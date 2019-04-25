'use strict';

const { Grid, Row, Col, Button, Label, Image, Form, InputGroup, FormGroup, ControlLabel, FormControl, Tabs, Tab, Table } = ReactBootstrap;

const defaultComponentBanner = './src/web/img/banner.jpg';

const webappName = Utils.getUrlParams('webapp') || '';
const stack = Utils.getUrlParams('stack') || 'react';

// 根据不同技术栈选择不同模板
const componentUrl = `./${stack}.html?c=${webappName}`;
const webapp = _getComponent(webappInfo.webapps);

let jsonEditor;
let countInterval = null;

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
            scriptCommand: webapp.scripts && webapp.scripts.release || 'npm run release', // 单元测试命令
            scriptFile: '',         // 自定义脚本文件名(包含路径)

            scriptResult: {},       // 自定义脚本运行结果
            showReadme: false,      // 是否显示readme内容
            debugDomain: '',        // 联调域名
            debugIp: '',            // 联调IP
            canSetting: false,       // 是否可以修改应用设置

            initCommand: 'npm i',        // 应用初始化命令
            devCommand: webapp.scripts && webapp.scripts.dev || 'npm run dev',            // 启动开发命令
            testCommand: webapp.scripts && webapp.scripts.build || 'npm run build',        // 测试打包命令
            releaseCommand: webapp.scripts && webapp.scripts.release || 'npm run release',  // 预发打包命令

            initCommandResult: {},         // 初始化状态
            devCommandResult: {},         // 启动调试状态
            testCommandResult: {},         // 测试部署状态
            releaseCommandResult: {},         // 预发布部署状态
            processStatus: '',             // 进行处理的阶段
            processTime: 0,                 // 进行处理的时间

            mockRule: '',           // mock规则
            mockData: '',           // mock数据
            mockDataSet: {},        // mock数据集
            activeKey: 'webapp', // tab默认选中的key
            mockSwitch: false       //是否启用mock
        }, this._getStateFromLocalstorage(webappName + '_componnet_key'));

        if (this.state.scriptResult.success === 'loading' && this.state.processStatus) {
            this._startProcessCount();
        }
    }

    componentDidMount() {
        document.title = webappName + '|' + document.title;
        window.reflectStore = function (store) {
            console.log('当前组件store:')
            console.log(store.getState());
        }
        window.showReadme = this.state.activeKey === 'readme';
    }

    componentDidUpdate() {
        localStorage.setItem(webappName + '_componnet_key', JSON.stringify(this.state));
    }

    render() {

        let { api, apis, storeKey, actionType, mockDataPath, jsonData, scriptResult, testFile,
            scriptFile, scriptCommand, showReadme, activeKey, initCommand, devCommand, testCommand, releaseCommand,
            mockDataSet, mockRule, mockData, mockSwitch, debugDomain, debugIp, processStatus, processTime, canSetting } = this.state;
        apis = apis.join('\n');

        let loadingStatus = scriptResult.success === 'loading' && processStatus ? `animate-loading ${processStatus}` : null;
        
        let scripts = [];

        for (let key in webapp.scripts) {
            scripts.push(<div>{key} : {webapp.scripts[key]}</div>)
        }

        
        let webappList = webappInfo.webapps;

        return (
            <div class="preview">
                <div>
                    <section className="left-nav" id="left-info">
                    <h4>应用列表</h4>
                    <hr />
                    {
                        webappList.length > 0 ? webappList.map((webapp, index) => {
                            let activeClass = webappName === webapp.name ? 'active ' : ' ';
                            return (
                                <ul className={`${activeClass}webapp-info`} title={webapp.description || webapp.name}>
                                    <li>应用名称：<a href={`/src/web/webapp.html?webapp=${webapp.name}`}><b>{webapp.name}</b></a></li>
                                    <li>作者： {webapp.author || '未知'}</li>
                                    <li>描述： {webapp.description || webapp.name}</li>
                                    <li>模板： {webapp.template}</li>
                                    <li>版本： {webapp.version || '1.0.0'}</li>
                                    {
                                        webapp.git ? <li>仓库url： <a href={webapp.git || ''} target="_blank">{webapp.git || ''}</a></li> : null
                                    }
                            </ul>)
                        }) : <div class="empty-list">无</div>
                    }
                        
                    </section>
                    <section class="right-content">
                        <Tabs activeKey={activeKey} id="uncontrolled-tab-example" onSelect={this._handleSelect.bind(this)}>
                            <Tab eventKey={'webapp'} title="应用信息">
                                <h4>应用打包部署：<Label>初始化时间可能较长</Label></h4>
                                <hr />
                                <div className="progress-container">
                                    <div className="progress-btn progress-init" onClick={this._triggerScriptExcute.bind(this, initCommand, 'init')}>
                                        {loadingStatus && processStatus === 'init' ? `${processTime} S` : '初始化'}
                                    </div>
                                    <div className="progress-btn progress-dev" onClick={this._triggerScriptExcute.bind(this, devCommand, 'dev')}>
                                        {loadingStatus && processStatus === 'dev' ? `${processTime} S` : '开发'}
                                    </div>
                                    <div className="progress-btn progress-test" onClick={this._triggerScriptExcute.bind(this, testCommand, 'test')}>
                                        {loadingStatus && processStatus === 'test' ? `${processTime} S` : '测试部署'}
                                    </div>
                                    <div className="progress-btn progress-release" onClick={this._triggerScriptExcute.bind(this, releaseCommand, 'release')}>
                                        {loadingStatus && processStatus === 'release' ? `${processTime} S` : '预发部署'}
                                    </div>
                                    <div className={loadingStatus}>
                                        <div><span></span></div>
                                        <div><span></span></div>
                                        <div><span></span></div>
                                    </div>
                                </div>
                                <Button type="button" bsStyle="danger" onClick={this._triggerScriptStop.bind(this)}>  停止  </Button>
                                <hr />
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>应用信息</th>
                                        <th>详情</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>应用名</td>
                                        <td>{webapp.name}</td>
                                    </tr>
                                    <tr>
                                        <td>版本号</td>
                                        <td>{webapp.version}</td>
                                    </tr>
                                    <tr>
                                        <td>仓库地址</td>
                                        <td>{webapp.git}</td>
                                    </tr>
                                    <tr>
                                        <td>应用线上地址</td>
                                        <td>{webapp.url}</td>
                                    </tr>
                                    <tr>
                                        <td>license</td>
                                        <td>{webapp.license}</td>
                                    </tr>
                                    <tr>
                                        <td>scripts</td>
                                        <td>{scripts}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Tab>

                            <Tab eventKey={'script'} title="打包部署日志">
                                <div className={'script-wrap ' + (scriptResult.success === true ? 'success' : '') + (scriptResult.success === false ? 'fail' : '')}>
                                    <Button type="button" bsStyle="success" onClick={this._triggerScriptExcute.bind(this, scriptCommand, null)}>运行命令</Button>

                                    <span className="script-input">
                                        <FormControl title={scriptCommand} className="script-file-command" type="text" value={scriptCommand} onChange={(e) => {
                                            this._changeHandle(e, 'scriptCommand')
                                        }} placeholder="输入要运行的运行命令" />
                                    </span>

                                    {scriptResult.success === true ? <i class="fa fa-check"><span>{scriptFile}运行成功</span></i> : null}
                                    {scriptResult.success === 'loading' ? <i className="loading"></i> : null}
                                    {scriptResult.success === false ? <i class="fa fa-times-circle"><span>执行失败</span></i> : null}
                                    <FormControl componentClass="textarea" value={scriptResult.result} placeholder="脚本运行结果" rows="35" disabled />
                                </div>
                            </Tab>
                            <Tab eventKey={'readme'} title="查看readme">
                                <MdEditor />
                            </Tab>
                            <Tab eventKey={'settings'} title="应用设置">
                                启用代理：
                                <div className={'switch ' + (mockSwitch ? 'on' : 'off')}>
                                    <div className='track' onClick={this._switchMockRule.bind(this, mockSwitch)}>
                                        <div className='thumb' />
                                    </div>
                                </div><span className={mockSwitch ? 'on' : 'off'}>{mockSwitch ? '已开启' : '已停止'}</span>
                                <hr />
                                <div>
                                    <h4>设置联调域名和IP</h4>
                                    <Form componentClass="fieldset" inline>
                                        <FormGroup controlId="formValidationWarning4" validationState="warning" className="dev-input" >
                                            <ControlLabel>联调域名</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon> </InputGroup.Addon>
                                                <FormControl title={debugDomain} type="text" value={debugDomain} onChange={(e) => {
                                                    this._changeHandle(e, 'debugDomain')
                                                }} placeholder="例如：www.domain.com" disabled={!canSetting}/>
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup controlId="formValidationError4" validationState="warning" className="dev-input">
                                            <ControlLabel title="例如线上或测试环境IP">联调指定IP</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon> </InputGroup.Addon>
                                                <FormControl title={debugIp} type="text" value={debugIp} onChange={(e) => {
                                                    this._changeHandle(e, 'debugIp')
                                                }} placeholder="127.0.0.1" disabled={!canSetting}/>
                                            </InputGroup>
                                        </FormGroup>
                                    </Form>
                                    <h4>命令配置</h4>
                                    <Form componentClass="fieldset" inline>
                                        <FormGroup controlId="formValidationWarning4" validationState="warning" className="dev-input" >
                                            <ControlLabel>初始化</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon> </InputGroup.Addon>
                                                <FormControl title={initCommand} type="text" value={initCommand} onChange={(e) => {
                                                    this._changeHandle(e, 'initCommand')
                                                }} placeholder="npm i" disabled={!canSetting}/>
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup controlId="formValidationError4" validationState="warning" className="dev-input">
                                            <ControlLabel title="启动调试命令">启动调试</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon> </InputGroup.Addon>
                                                <FormControl title={devCommand} type="text" value={devCommand} onChange={(e) => {
                                                    this._changeHandle(e, 'devCommand')
                                                }} placeholder="npm run dev" disabled={!canSetting}/>
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup controlId="formValidationError4" validationState="warning" className="dev-input">
                                            <ControlLabel title="测试打包部署">测试部署</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon> </InputGroup.Addon>
                                                <FormControl title={testCommand} type="text" value={testCommand} onChange={(e) => {
                                                    this._changeHandle(e, 'testCommand')
                                                }} placeholder="npm run release" disabled={!canSetting}/>
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup controlId="formValidationError4" validationState="warning" className="dev-input">
                                            <ControlLabel title="预发布部署">预发布部署</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon> </InputGroup.Addon>
                                                <FormControl title={releaseCommand} type="text" value={releaseCommand} onChange={(e) => {
                                                    this._changeHandle(e, 'releaseCommand')
                                                }} placeholder="npm run release" disabled={!canSetting}/>
                                            </InputGroup>
                                        </FormGroup>

                                        <Button type="button" bsStyle={canSetting ? 'success' : 'warning'} onClick={this._setSettingEnable.bind(this)}>
                                            {canSetting ? '保存' : '编辑'}
                                        </Button>
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
                                    <Form componentClass="fieldset">
                                        <FormGroup controlId="formValidationWarning4" validationState="warning" className="debug-domain" >
                                            <ControlLabel>接口地址</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon>api</InputGroup.Addon>
                                                <FormControl title={mockRule} type="text" value={mockRule} onChange={(e) => {
                                                    this._changeHandle(e, 'mockRule')
                                                }} placeholder="例如：/api/v2/list" />
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup controlId="formValidationError4" validationState="warning" className="debug-ip">
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

    _setSettingEnable() {
        this.setState({
            canSetting: !this.state.canSetting
        });
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
                mockData: JSON.stringify(mockDataSet[value])
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
        let { mockRule, mockDataSet } = this.state;
        let mockData = jsonEditor && jsonEditor.getValue(mockData) || JSON.parse(this.state.mockData || '{}');

        // json在textarea中的格式化展示，需要优化
        this.setState({
            mockData: JSON.stringify(mockData)
        })
        // 如果是redux组件则需要判断actionType并进行动态dispatch
        if (!mockRule || !mockData) {
            Dialog.toast.warn({
                content: 'mock接口地址或返回数据不能为空。'
            });
            return;
        } else {
            try {
                // 如果有storeKey可以支持jsonData为其它类型
                mockDataSet[mockRule] = mockData;
                this.setState({
                    mockDataSet
                });
                previewContainer.window.setMockData(mockDataSet, () => {
                    // mock数据联调启用
                    Dialog.toast.error({
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
                    content: '应用联调已停用'
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
     * 停止运行脚本
     * 
     * @memberof Preview
     */
    _triggerScriptStop() {

        clearInterval(countInterval);

        // 读取固定的api
        axios.get('/webapp/stop', {
            params: {}
        }).then(res => {
            if (res.data.success) {
                Dialog.toast.info({
                    content: res.data.result
                });
            }
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
    _triggerScriptExcute(webappCommand, processStatus) {
        let { scriptCommand } = this.state;

        this.setState({
            scriptResult: {
                success: 'loading'
            },
            processStatus: processStatus,
            processTime: 0
        });


        clearInterval(countInterval);
        this._startProcessCount();

        // 读取固定的api
        axios.get('/webapp/script', {
            params: {
                webappName: webappName,
                webappCommand: webappCommand || 'node'
            }
        }).then(res => {
            if (res.data.success) {
                Dialog.toast.success({
                    content: '运行成功'
                });
            } else {
                Dialog.toast.error({
                    content: '运行错误'
                });
                this.setState({
                    scriptResult: res.data,
                    processStatus: ''
                });
                clearInterval(countInterval);
            }
            try {
                let result = JSON.parse(res.data.result);
                
                if (!result.killed) {
                    // 终结其它的命令
                } else if (!res.data.success) {
                    this.setState({
                        scriptResult: res.data,
                        processStatus: ''
                    });
                    clearInterval(countInterval);
                } else {
                    this.setState({
                        scriptResult: res.data,
                        processStatus: ''
                    });
                    clearInterval(countInterval);
                }
            } catch (e) {
                this.setState({
                    scriptResult: res.data,
                    processStatus: ''
                });
                clearInterval(countInterval);
            }
        }).catch(err => {
            this.setState({
                processStatus: ''
            });
            Dialog.toast.error('请求失败，确认just start服务是否运行正常');
            console.log(err);
        });
    }

    _startProcessCount() {
        countInterval = setInterval(() => {
            this.setState({
                processTime: this.state.processTime + 1
            });
        }, 1000)
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
            [name]: e.target.value
        });
    }
};


class MdEditor extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        // 获取调试服务器组件目录下的readme
        axios.get(`/.build/${webappName}/readme.md`, {
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
}

/**
 * 从应用列表中找到当前应用信息
 * 
 * @param {any} webappInfo
 * @returns 
 */
function _getComponent(webappInfo) {
    return webappInfo.find(function (item) {
        return item.name == webappName;
    })
};

ReactDOM.render(<Preview name="John" />, document.getElementById('root'));

