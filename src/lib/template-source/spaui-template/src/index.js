import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { globalProps } from '@tencent/spaui-utils';

class ${_Component} extends PureComponent {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        text: PropTypes.string
    }

    static defaultProps = {
        text: 'http://spaui.oa.com'
    }

    render() {
        const { text } = this.props;

        return (
            <div {...globalProps(this.props, { className: '${_component}' })}>
                <h2>spaui-template模板组件：${_Component}</h2>
                {text}
            </div>
        );
    }
}

export default ${_Component};

