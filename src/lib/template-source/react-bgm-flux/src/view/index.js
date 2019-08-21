/**
 * View UI层
 * @outhor ${_author}
 */
import React, {
    PureComponent, Fragment,
} from 'react'
import PropTypes from 'prop-types'
import Checkbox from 'components_v2/form/Checkbox'
import ErrorTips from 'components/ui/ErrorTips'

class ${_Component}View extends PureComponent {
    render() {
        const {
            options,
            value,
            onChange,
            onSubmit,
            showErrorMsg,
            errorMsg,
            frozenChangeItems,
            itemName,
        } = this.props

        return (
            <Fragment>
                <div className='lump'>
                    <h3>{itemName}</h3>
                    <div className='panel formpanel'>
                        <ErrorTips tips={showErrorMsg ? errorMsg : ''}/>
                        <div className='general-line'>
                            <div className="general-line-name">{itemName}</div>
                            <Checkbox options={options} onChange={onChange} value={value} listClassName='multi-select' disabled={frozenChangeItems}/>
                        </div>
                    </div>

                </div>
            </Fragment>
        )
    }
}

ChangeItems.propTypes = {
    //使用哪些变更项
    value: PropTypes.array.isRequired,
    //变更项可选列表
    options: PropTypes.arrayOf(PropTypes.shape({
        // 选项值
        value: PropTypes.any.isRequired,
        // 选项文案
        label: PropTypes.string.isRequired,
        // 选项子节点,跟在div.tit-wrap后
        child: PropTypes.element,
        // 选项hover提示文案
        tips: PropTypes.string,
        // 其他附加节点,跟在div.inner后
        extContent: PropTypes.element,
        // 附加在选项根节点的样式类
        extClassName: PropTypes.string,
        // 小问号提示语
        helpMarkTips: PropTypes.string,
    })).isRequired,
    //是否确定了变更项
    frozenChangeItems: PropTypes.bool,
    //勾选变更项
    onChange: PropTypes.func.isRequired,
    errorMsg: PropTypes.string,
    //提交，使用变更项生成广告
    onSubmit: PropTypes.func,
    //标题文案
    itemName: PropTypes.string,
}
ChangeItems.defaultProps = {
    value: [],
    options: [],
    errorMsg: '',
    showErrorMsg: false,
    frozenChangeItems: false,
    itemName: '',
    onChange: (valueArr) => {},
    onSubmit: () => {},
}

export default ChangeItems
