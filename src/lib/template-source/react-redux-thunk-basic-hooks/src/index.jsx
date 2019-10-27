
import React, { useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef } from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux'
import PropTypes from 'prop-types';
import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
import { formatName } from './data-adapter';
import IndexView from './views/index';

const ${_Component} = (props) => {
    const dispatch = useDispatch();
    const [label, setLabel] = useState('default');
    const state = useSelector((state) => {
        return state['${_Component}'] || {}
    }, shallowEqual);

    // imitate componentDidMount
    useEffect(() => {
        // do something
    }, []);


    const { name } = props;
    const { text } = state;
    const formatNameData = formatName(name);
    const className = '${_component}';
    const componentTitle = '${_Component}';

    return (
        <IndexView
            text={text}
            label={label}
            setLabel={setLabel}
            className={className}
            name={formatNameData}
            title={componentTitle}
            dispatchChange={() => {
                dispatch(dispatchChange());
            }}
            dispatchAsyncChange={() => {
                dispatch(dispatchAsyncChange());
            }}
            dispatchPromiseChange={() => {
                dispatch(dispatchPromiseChange());
            }}
        />
    )
}

${_Component}.propTypes = {};

export default React.memo(${_Component});

