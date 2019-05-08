'use strict';

const { Grid, Row, Col, Button, Label, Table, Image, Form, InputGroup, FormGroup, ControlLabel, FormControl, Tabs, Tab } = ReactBootstrap;

const defaultComponentBanner = './src/web/img/banner.jpg';

const packageName = Utils.getUrlParams('c') || '';
const componentName = Utils.getComponentName(packageName);
const stack = Utils.getUrlParams('stack') || 'react';

// 根据不同技术栈选择不同模板
const component = _getComponent(componentInfo.components);

let jsonEditor;
let interval;

class Preview extends React.Component {

    constructor(props) {
        super(props);

        this.state = Object.assign({}, {
            api: '',  // api
            mockDataPath: '',  // mock数据地址
            actionType: '',    // redux 的actiontype
            storeKey: '',      // redux触发数据挂载的key
            jsonData: '',       // dispatch到store的数据
            apis: [],           // api列表
            testFile: 'test',   // 单元测试用例文件名
            scriptCommand: 'mocha', // 单元测试命令
            scriptFile: '',         // 自定义脚本文件名(包含路径)
            unitTestResult: {},     // 单元测试运行结果
            scriptResult: {},       // 自定义脚本运行结果
            showReadme: false,      // 是否显示readme内容
            debugDomain: '',        // 调试域名
            debugIp: '',            // 调试ip
            mockRule: '',           // mock规则
            mockType: 'get',        // mock请求类型
            mockData: '',           // mock数据
            mockDataSet: {},        // mock数据集
            activeKey: 'component', // tab默认选中的key
            mockSwitch: false,       //是否启用mock
            packageVersionList: [],  // 获取版本号的列表
            mockApi: '',
            isMobile: false,        // 是否是移动端组件
            component: component     // 组件信息
        }, this._getStateFromLocalstorage(componentName + '_componnet_key'));
    }

    componentWillMount() {
        // 获取调试服务器组件目录下的readme
        axios.get(`/.build/${componentName}/package.json`, {
            params: {}
        }).then(res => {
            // 设置编辑器内容
            this.setState({
                component: Object.assign({}, component, res.data)
            });
        }).catch(err => {
            console.log(err);
        });
    }

    componentDidMount() {
        document.title = packageName + '|' + document.title;
        window.reflectStore = function (store) {
            console.log('当前组件store:')
            console.log(store.getState());
        }
        window.showReadme = this.state.activeKey === 'readme';
    }

    componentDidUpdate() {
        localStorage.setItem(componentName + '_componnet_key', JSON.stringify(this.state));
    }

    render() {

        let { component, api, apis, storeKey, actionType, mockDataPath, jsonData, unitTestResult, scriptResult, testFile,
            scriptFile, scriptCommand, showReadme, activeKey, debugDomain, debugIp, mockData, mockRule, mockDataSet,
            mockSwitch, addPackageName, addPackageVersion, mockType, packageVersionList, mockApi, isMobile } = this.state;
        apis = apis.join('\n');

        let dependencies = [];

        const componentUrl = isMobile ? `./${stack}-mobile.html?c=${packageName}` : `./${stack}.html?c=${packageName}`;

        for (let key in component.dependencies || {}) {
            dependencies.push(<div className="dependencies-item">{key} : {component.dependencies[key]} 
            <Button type="button" bsStyle="danger" bsSize="small" onClick={this._removeDependencies.bind(this, key, component.dependencies[key])}>移除</Button></div>)
        }
        dependencies.push(<span>
            <Form componentClass="fieldset" inline>
                <FormGroup controlId="formValidationWarning4" validationState="warning" className="debug-domain" >
                    <InputGroup>
                        <InputGroup.Addon>新包名</InputGroup.Addon>
                        <FormControl title={addPackageName} type="text" value={addPackageName} onChange={(e) => {
                            this._changeHandle(e, 'addPackageName')
                        }} placeholder="例如：react" />
                    </InputGroup>
                </FormGroup>

                @<FormGroup controlId="formValidationError4" validationState="warning" className="debug-ip">
                    <FormControl title={addPackageVersion} componentClass="select" value={addPackageVersion} onChange={(e) => {
                        this._changeHandle(e, 'addPackageVersion')
                    }} placeholder="版本号">
                        <option value="latest">latest</option>
                        {
                            packageVersionList.reverse().map((version) => {
                                return <option value={version}>{version}</option>
                            })
                        }
                    </FormControl>
                </FormGroup>
                <Button type="button" bsStyle="info" bsSize="primary" onClick={this._queryDependencies.bind(this, addPackageName, addPackageVersion)}>查询可用版本</Button>
                <Button className="btn-add-dependencies" type="button" bsStyle="success" onClick={this._addDependencies.bind(this, addPackageName, addPackageVersion)}>安装使用版本</Button>
            </Form>
            <span>请确认包管理工具是否为npm或tnpm，如果安装失败也可使用 "just i [packageName]" 进行安装</span>
        </span>)
        
        return (
            <div class="preview">
                <div>
                    <section className="left-nav" id="left-info">
                        <ul className="component-info" title={component.name}>
                            <li><b>组件名称： {component.name}</b></li>
                            <li>作者： {component.author || '未知'}</li>
                            <li>描述： {component.description || component.name}</li>
                            <li>模板： {component.template}</li>
                            <li>版本： {component.version || '1.0.0'}</li>
                            {
                                component.stack ? (<li className="component-logo">
                                    <img src={`./img/${component.stack}.png`} width="50" height="45" />
                                </li>) : null
                            }
                            {
                                component.git ? <li>仓库url： <a href={component.git || ''} target="_blank">{component.git || ''}</a></li> : null
                            }
                        </ul>

                    </section>
                    <section class="right-content">
                        <Tabs activeKey={activeKey} id="uncontrolled-tab-example" onSelect={this._handleSelect.bind(this)}>
                            <Tab eventKey={'component'} title="组件预览">
                                <div>
                                    <div class="menus">
                                        <a href="javascript: void(0);" onClick={this._reloadIframe} title="打开新页面预览组件">
                                            <i class="fa fa-refresh"><span>刷新</span></i>
                                        </a>
                                        <a target="_blank" href={componentUrl} title="打开新页面预览组件">
                                            <i class="fa fa-arrows-alt"><span>全屏</span></i>
                                        </a>
                                        <a href="javascript: void(0);" onClick={this._setMobileDebug.bind(this)} title="切换移动端或PC端预览组件">
                                            { !isMobile ? <i class="fa fa-mobile"><span>切换到移动端</span></i> :
                                                <i class="fa fa-tv"><span>切换到PC</span></i>}  
                                            
                                        </a>
                                    </div>
                                </div>
                                <iframe name="previewContainer" id="previewContainer" className={'preview-container ' + (isMobile ? 'mobile' : '')}
                                    src={componentUrl} frameborder="1"></iframe>
                            </Tab>
                            <Tab eventKey={'detail'} title="组件详情">
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>组件信息：</th>
                                        <th>详情</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>组件名 (name)</td>
                                        <td>{component.name}</td>
                                    </tr>
                                    <tr>
                                        <td>版本号 (version)</td>
                                        <td>{component.version}</td>
                                    </tr>
                                    <tr>
                                        <td>仓库地址 (git)</td>
                                        <td>{component.git}</td>
                                    </tr>
                                    <tr>
                                        <td>license (license)</td>
                                        <td>{component.license}</td>
                                    </tr>
                                    <tr>
                                        <td>第三方依赖 (dependencies)</td>
                                        <td>{dependencies}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab eventKey={'readme'} title="readme调试">
                                <MdEditor ref="MdEditor"/>
                            </Tab>
                            <Tab eventKey={'test'} title="单元测试">
                                <div className={'script-wrap ' + (unitTestResult.success === true ? 'success' : '') + (unitTestResult.success === false ? 'fail' : '')}>
                                    <Button type="button" bsStyle="success" onClick={this._triggerUnitTest.bind(this)}>单元测试</Button>
                                    {unitTestResult.success === true ? <Button type="button" onClick={() => {
                                        window.open('/coverage/report/index.html')
                                    }}>测试报告</Button>:  null}
                                    <span className="script-input">
                                        /.build/{componentName}/test/<FormControl title={testFile} className="test-file-name" type="text" value={testFile} onChange={(e) => {
                                            this._changeHandle(e, 'testFile')
                                        }} placeholder="要测试的文件脚本，默认为test.js" />
                                    </span>
                                    {unitTestResult.success === true ? <i class="fa fa-check"><span>{testFile || 'test.js'}测试通过</span></i> : null}
                                    {unitTestResult.success === 'loading' ? <i className="loading-icon"></i> : null}
                                    {unitTestResult.success === false ? <i class="fa fa-times-circle"><span>失败</span></i> : null}
                                    <FormControl componentClass="textarea" value={unitTestResult.result} placeholder="单元测试结果" rows="35" disabled />
                                </div>
                            </Tab>

                            <Tab eventKey={'script'} title="运行日志">
                                <div className={'script-wrap ' + (scriptResult.success === true ? 'success' : '') + (scriptResult.success === false ? 'fail' : '')}>
                                    <Button type="button" bsStyle="success" onClick={this._buildEs5Component.bind(this)}>执行打包</Button>

                                    {scriptResult.success === true ? <i class="fa fa-check"><span>构建完成</span></i> : null}
                                    {scriptResult.success === 'loading' ? <i className="loading-icon"></i> : null}
                                    {scriptResult.success === false ? <i class="fa fa-times-circle"><span>执行失败</span></i> : null}
                                    <FormControl componentClass="textarea" value={scriptResult.result} placeholder="脚本运行结果" rows="35" disabled />
                                </div>
                            </Tab>
                            <Tab eventKey={'mock'} title="Mock联调">
                                联调切换：
                                <div className={'switch ' + (mockSwitch ? 'on' : 'off')}>
                                    <div className='track' onClick={this._switchMockRule.bind(this, mockSwitch)}>
                                        <div className='thumb' />
                                    </div>
                                </div><span className={ mockSwitch ? 'on' : 'off'}>{mockSwitch ? '已开启' : '已停止'}</span>
                                <hr />
                                <div>
                                    <h4>设置联调域名和IP<Label bsStyle="warning">针对应用生效</Label></h4>
                                    <Form componentClass="fieldset" inline>
                                        <FormGroup controlId="formValidationWarning4" validationState="warning" className="dev-input" >
                                            <ControlLabel>联调域名</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon>domain</InputGroup.Addon>
                                                <FormControl title={debugDomain} type="text" value={debugDomain} onChange={(e) => {
                                                    this._changeHandle(e, 'debugDomain')
                                                }} placeholder="例如：www.domain.com" />
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup controlId="formValidationError4" validationState="warning" className="dev-input">
                                            <ControlLabel title="例如线上或测试环境IP">联调指定IP</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon>IP</InputGroup.Addon>
                                                <FormControl title={debugIp} type="text" value={debugIp} onChange={(e) => {
                                                    this._changeHandle(e, 'debugIp')
                                                }} placeholder="127.0.0.1" />
                                            </InputGroup>
                                        </FormGroup>
                                    </Form>
                                    <hr />
                                    <h4>设置联调Mock数据<Label bsStyle="warning">针对组件生效</Label></h4>
                                    <div>
                                        <FormGroup controlId="formControlsSelect" validationState="warning" >
                                            <ControlLabel>已保存配置（保存Mock规则可直接添加）</ControlLabel>
                                            <FormControl componentClass="select" placeholder="select" onChange={this._changeMockHandler.bind(this)}>
                                                <option value="">选择Mock规则</option>
                                                {
                                                    Object.keys(mockDataSet).map((key, index) => {
                                                        return <option value={key}>[{index}]  {key}</option>
                                                    })
                                                }
                                            </FormControl>
                                        </FormGroup>
                                    </div>
                                    <div className="mock-input-group left">
                                        <FormGroup controlId="formControlsSelect" validationState="warning" >
                                            <ControlLabel>请求类型（Get,Post,Put,Delete等）</ControlLabel>
                                            <FormControl componentClass="select" placeholder="select" value={mockType}  onChange={(e) => {
                                                this._changeHandle(e, 'mockType')
                                            }}>
                                                <option value="get">Get</option>
                                                <option value="post">Post</option>
                                                <option value="put">Put</option>
                                                <option value="delete">Delete</option>
                                            </FormControl>
                                        </FormGroup>
                                    </div>
                                    <div className="mock-input-group">
                                        <FormGroup controlId="formControlsSelect" validationState="warning" >
                                            <ControlLabel>选择mock本地数据</ControlLabel>
                                            <FormControl componentClass="select" placeholder="select" value={mockApi} onChange={(e) => {
                                                this._changeHandle(e, 'mockApi')
                                            }}>
                                                <option value="">未选择</option>
                                                {Object.keys(component.mockDataList).map((key, index) => {
                                                    return <option value={component.mockDataList[key]}>[{index}] {component.mockDataList[key]}</option>
                                                })}
                                            </FormControl>
                                        </FormGroup>
                                    </div>
                                    <Form componentClass="fieldset">
                                        <FormGroup controlId="formValidationWarning4" validationState="warning" className="dev-input" >
                                            <ControlLabel>接口地址</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon>api</InputGroup.Addon>
                                                <FormControl title={mockRule} type="text" value={mockRule} onChange={(e) => {
                                                    this._changeHandle(e, 'mockRule')
                                                }} placeholder="例如：/api/v2/list。支持匹配" />
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup controlId="formValidationError4" validationState="warning" className="dev-input">
                                            <ControlLabel title="返回数据格式">返回数据格式</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon>json</InputGroup.Addon>
                                                <FormControl componentClass="textarea" value={mockData} onChange={(e) => {
                                                    this._changeHandle(e, 'mockData')
                                                }} placeholder="例如：{ret: 0, data: {}, msg: 'ok'}" rows="10" />
                                            </InputGroup>
                                        </FormGroup>

                                        <Button type="button" bsStyle="success" onClick={this._saveMockRule.bind(this)}>保存Mock规则</Button>
                                        <Button type="button" bsStyle="warning" onClick={this._editJson.bind(this)}>同步到Schema编辑</Button>
                                    </Form>
                                </div>
                                <div id="jsonEditor"></div>
                            </Tab>
                        </Tabs>
                    </section>
                </div>
            </div>
        );
    }

    /**
     * 切换移动端和PC端调试
     *
     */
    _setMobileDebug() {
        const { isMobile } = this.state;
        this.setState({
            isMobile: !isMobile
        });
    }
    /**
     * 查询组件依赖的版本号
     *
     * @memberof packageName
     * @memberof packageVersion
     */
    _queryDependencies(packageName, packageVersion) {

        if (!packageName) {
            Dialog.toast.warn('包名不能为空');
            return;
        }

        // 读取固定的api
        bizAxios({
            url: '/package/info',
            method: 'get',
            cache: true,
            params: {
                packageName: packageName
            }
        }).then(res => {
            this.setState({
                scriptResult: res.data,
                packageVersionList: res.data.result || []
            });
            if (res.data.success) {
                Dialog.toast.success('查询到版本号，选中版本包进行安装');
            } else {
                Dialog.toast.error('查询版本号失败');
            }
        }).catch(err => {
            Dialog.toast.error('请求失败，请确认just start服务是否正常');
            console.log(err);
        });
    }

    /**
     * 添加组件依赖
     *
     * @memberof packageName
     * @memberof packageVersion
     */
    _addDependencies(packageName, packageVersion) {

        if (!packageName || !packageVersion) {
            Dialog.toast.warn('包名称或版本号均不能为空');
            return;
        }

        // 读取固定的api
        bizAxios({
            url: '/component/dependencies/add',
            method: 'get',
            params: {
                packageName: packageName,
                packageVersion: packageVersion,
                componentName: componentName
            }
        }).then(res => {
            this.setState({
                scriptResult: res.data
            });
            if (res.data.success) {
                Dialog.toast.success('安装完成，刷新页面查看新的依赖');
            } else {
                Dialog.toast.error('安装失败');
            }
        }).catch(err => {
            Dialog.toast.error('请求失败，请确认just start服务是否正常');
            console.log(err);
        });
    }
    /**
     * 移除组件依赖
     *
     * @memberof packageName
     * @memberof packageVersion
     */
    _removeDependencies(packageName, packageVersion) {
        const self = this;
        if (!packageName || !packageVersion) {
            Dialog.toast.warn('包名称或版本号均不能为空');
            return;
        }

        // 确认移除第三方依赖包
        Dialog.confirm({
            title: '请确认',
            content: `确定移除${packageName}@${packageVersion}，移除后组件可能不能正常运行`,
            onConfirm: function() {
                // 读取固定的api
                bizAxios({
                    url: '/component/dependencies/remove',
                    method: 'get',
                    params: {
                        packageName: packageName,
                        packageVersion: packageVersion,
                        componentName: componentName
                    }
                }).then(res => {
                    self.setState({
                        scriptResult: res.data
                    });
                    if (res.data.success) {
                        Dialog.toast.success('已经移除依赖，刷新页面查看新的依赖');
                    } else {
                        Dialog.toast.error('移除依赖失败');
                    }
                }).catch(err => {
                    Dialog.toast.error('请求失败，请确认just start服务是否正常');
                    console.log(err);
                });
            }
        })
    }
    /**
     * 切换以保存的cgi
     * 
     * @memberof Preview
     */
    _changeMockHandler(e) {
        let { mockDataSet } = this.state;
        var value = e.target.value || e.srcElement && e.srcElement.value;
        if (value && mockDataSet[value]) {
            this.setState({
                mockRule: value,
                mockType: mockDataSet[value].mockType,
                mockData: JSON.stringify(mockDataSet[value].mockData)
            });
        }
    }

    /**
     * 编辑json
     * 
     * @memberof Preview
     */
    _editJson() {
        const { mockData } = this.state;
        if (!jsonEditor) {
            jsonEditor = new JSONEditor(document.getElementById('jsonEditor'), {
                schema: {
                    type: 'object',
                    title: 'Mock Schema数据编辑',
                    properties: {
                    }
                },
                theme: 'bootstrap3'
            });
        }
        jsonEditor.setValue(JSON.parse(mockData));
    }

    /**
     * 设置联调Mock规则与数据
     * 
     * @memberof Preview
     */
    _saveMockRule() {
        let { mockRule, mockDataSet, mockType, mockApi } = this.state;
        let mockData = jsonEditor && jsonEditor.getValue(mockData) || JSON.parse(this.state.mockData || '{}');

        // json在textarea中的格式化展示，需要优化
        this.setState({
            mockData: JSON.stringify(mockData)
        })
        // 如果是redux组件则需要判断actionType并进行动态dispatch
        if (!mockRule || !mockData ) {
            Dialog.toast.warn({
                content: 'mock接口地址或返回数据不能为空。'
            });
            return;
        } else {
            // 如果有storeKey可以支持jsonData为其它类型
            mockDataSet[mockRule] = {
                mockData: mockData,
                mockType: mockType,
                mockApi: mockApi
            };

            let mockApiList = [];
            for (let key in mockDataSet) {
                // 如果含有mockApi，请求路径和方式，则将数据注入到readme中永久保存
                if (mockDataSet[key].mockApi && mockDataSet[key].mockType) {
                    // 随机mock变量名
                    let mockDataVar = mockDataSet[key].mockApi.replace('.', '') + (Math.random() + '').slice(-4);
                    let insertContent = `
let ${mockDataVar} = require('./data/${mockDataSet[key].mockApi}');
//Mock${key}请求返回数据
Mock.mock(new RegExp('${key}', 'ig'), ${mockDataVar});
`;
                mockApiList.push(insertContent);
                }
            }

            if (mockApiList.length) {
                window.MdEditor.saveReadme(mockApiList.join(''), () => {
                    this.refs['MdEditor'].loadReadMe();
                });
                return ;
            }

            try {

                this.setState({
                    mockDataSet
                });
                previewContainer.window.setMockData(mockDataSet, () => {
                    // mock数据联调启用
                    Dialog.toast.info({
                        content: 'Mock规则保存并已启用'
                    });
                });
            } catch (e) {
                console.error(e);
                Dialog.toast.error({
                    content: '输入的mock数据格式必须为json'
                });
            }

        }
    }

    /**
     * 移除联调Mock规则，如果有mockRule，则移除对应的规则，否则移除所有
     * 
     * @memberof Preview
     */
    _switchMockRule(mockSwitch) {
        let { mockRule } = this.state;

        this.setState({
            mockSwitch: !mockSwitch
        });

        // 如果原来已经开启联调，则需要停止移除规则；否则增加规则
        if (mockSwitch) {
            previewContainer.window.removeMockData(() => {
                // mock数据联调停止
                Dialog.toast.info({
                    content: 'Mock数据联调已停用'
                });
            }, mockRule);
        } else {
            this._saveMockRule();
        }
    }

    /**
     * 显示readme文档
     * 
     * @memberof Preview
     */
    _handleSelect(selectedKey) {
        this.setState({
            activeKey: selectedKey
        });
        if (selectedKey === 'readme' || this.setState.activeKey === 'readme') {
            // 标识外层是否可以使用ctrl + S来保存readme文档
            window.showReadme = true;
        } else {
            window.showReadme = false;
        }
    }

    
    /**
     * 启动eslint
     * 
     * @memberof Preview
     */
    _triggerEsLint() {
        let { testFile } = this.state;

        this.setState({
            unitTestResult: {
                success: 'loading'
            }
        });

        // 读取固定的api
        bizAxios({
            url: '/eslint',
            method: 'get',
            params: {
                componentName: componentName
            }
        }).then(res => {
            this.setState({
                unitTestResult: res.data
            });
        }).catch(err => {
            console.log(err);
        });
    }

    /**
     * 启动单元测试
     * 
     * @memberof Preview
     */
    _triggerUnitTest() {
        let { testFile, unitTestResult } = this.state;

        if (interval) {
            return;
        }
        this.setState({
            unitTestResult: {
                success: 'loading'
            }
        });
        // 读取固定的api
        axios.get('/test', {
            params: {
                componentName: componentName,
                testFile: testFile || 'test.js'
            }
        }).then(res => {

            // 读取固定的api
            interval = setInterval(() => {
                axios.get('/test/log', {}).then(testRes => {

                    let resData = testRes.data;
                    resData.result = resData.result && resData.result.replace(/(\[\d\d?m)|(\[\d\d?m)/ig, ' ');
                    this.setState({
                        unitTestResult: resData
                    });
                    if (resData.success === true || resData.success === false) {
                        clearInterval(interval);
                        interval = null;
                    }
                }).catch(err => {
                    clearInterval(interval);
                    interval = null;
                });
            }, 2000)
        }).catch(err => {
            console.log(err);
        });
    }

    /**
     * build组件为ES5
     * 
     * @memberof Preview
     */
    _buildEs5Component() {

        this.setState({
            scriptResult: {
                success: 'loading'
            }
        });

        // 读取固定的api
        axios.get('/component/build', {
            params: {
                componentName: componentName,
            }
        }).then(res => {
            this.setState({
                scriptResult: res.data
            });
        }).catch(err => {
            console.log(err);
        });
    }


    /**
     * 启动运行脚本
     * 
     * @memberof Preview
     */
    _triggerScriptExcute() {
        let { scriptFile, scriptCommand } = this.state;

        this.setState({
            scriptResult: {
                success: 'loading'
            }
        });

        // 读取固定的api
        axios.get('/script', {
            params: {
                componentName: componentName,
                scriptFile: scriptFile || 'test/test.js',
                scriptCommand: scriptCommand || 'mocha'
            }
        }).then(res => {
            this.setState({
                scriptResult: res.data
            });
        }).catch(err => {
            Dialog.toast.error('请求失败，请确认just start服务是否正常');
            console.log(err);
        });

    }

    /**
     * 刷新iframe
     * 
     * @memberof Preview
     */
    _reloadIframe() {
        previewContainer.window.location.reload();
    }

    /**
     * 从localStorage中获取state
     * 
     * @param {any} key 
     * @returns 
     * @memberof Preview
     */
    _getStateFromLocalstorage(key) {
        let localStorageString = localStorage.getItem(key);
        try {
            return JSON.parse(localStorageString);
        } catch (e) {
            return {};
        }
    }

    /**
     * 修改表单输入的处理
     * 
     * @param {any} e 
     * @param {string} name
     * @memberof Preview
     */
    _changeHandle(e, name) {
        this.setState({
            unitTestResult: {
                success: ''
            }
        });
        this.setState({
            [name]: e.target.value
        });

        // 如果选择的是选择本地的mock文件，则自动填入Mock的数据内容
        if (name === 'mockApi' && e.target.value) {
            // 自动读取本地data
            bizAxios({
                url: `/.build/${component.name}/data/${e.target.value}`,
                method: 'get',
                params: {}
            }).then(res => {
                this.setState({
                    mockData: JSON.stringify(res.data)
                });
            }).catch(err => {
                this.setState({
                    mockData: '{}'
                });
                console.log(err);
            });
        } else {
            this.setState({
                mockData: '{}'
            });
        }
    }
};


class MdEditor extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.loadReadMe();
    }

    componentDidMount() {
        initMdEditor();
    }

    render() {
        return <div id="markdownEditor" className="mark-editor">
            <div id='bar'>
                <div id="toolbar">
                    <i className="fa fa-save" title="保存" onClick={() => {
                        window.MdEditor.saveReadme();
                    }}></i>
                    <i className="fa fa-bold" id="bold" title="加粗" onClick={() => {
                        window.MdEditor.insertText('**这里填写要加粗的文字**');
                    }}></i>
                    <i className="fa fa-italic" id="italic" title="斜体" onClick={() => {
                        window.MdEditor.insertText('_这里填写要斜体的文字_');
                    }}></i>
                    <i className="fa fa-chain" id="hyperlink" title="链接" onClick={() => {
                        window.MdEditor.insertText('[这里写连接的描述](这里填写连接地址)');
                    }}></i>
                    <i className="fa fa-file-text" id="code" title="代码" onClick={() => {
                        window.MdEditor.insertText('```\n这里插入代码\n```');
                    }}></i>
                    <i src="fa fa-image-o" id="image" title="上传图片" onClick={() => {
                        window.MdEditor.showDialog();
                    }}></i>
                    <i className="fa fa-expand" title="切换编辑/预览" onClick={() => {
                        window.MdEditor.toggleEditorWidth();
                    }}></i>
                </div>
            </div>
            <div id='container'>
                <div id='editor-column' className='pull-left'>
                    <div id='panel-editor' style={{ height: '100%' }}>
                        <div className="editor-content" id="mdeditor" style={{ height: '100%' }}></div>
                    </div>
                </div>
                <div id='preview-column' className='pull-right'>
                    <div id='panel-preview'>
                        <div id="preview" className="markdown-body"></div>
                    </div>
                </div>
            </div>
        </div>
    }

    loadReadMe () {
        // 获取调试服务器组件目录下的readme
        axios.get(`/.build/${componentName}/readme.md`, {
            params: {}
        }).then(res => {
            console.log('获取readme文档成功');
            // 设置编辑器内容
            document.getElementById('markdownEditor').style.display = 'block';
            document.getElementById('preview').innerHTML = marked(res.data);
            ace.edit('mdeditor').setValue(res.data);
        }).catch(err => {
            Dialog.alert({
                content: '获取readme文档失败'
            });
            console.log(err);
        });
    }
}

/**
 * 从component中找到当前component信息
 * 
 * @param {any} componentInfo
 * @returns 
 */
function _getComponent(componentInfo) {
    return componentInfo.find(function (item) {
        return item.name == packageName;
    })
};

ReactDOM.render(<Preview name="John" />, document.getElementById('root'));

