/**
 * npm run test -- --folder=bgm/${_component}/
 * @author ${_author}
 */

/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/

import {
    mount,
} from 'enzyme'
import {
    createStore,
} from 'stores/common'
import {
    combineReducers,
} from 'redux'
import React from 'react'
import View from '../view'
import Model from '..'

import mockData from '../mock/data'

describe('${_component} 实例测试', function () {
    const options = {
        setting: mockData,
        mapLocalState: (state) => state,
    }

    const instance = new Model(options)

    it('check setting', () => {
        expect(instance.getSetting().itemName).to.equal('变更项')
        expect(instance.getSetting().hotTag).to.equal('BatchAd.ChangeItem')
        expect(instance.getSetting().options[0].value).to.equal(1)
        instance.updateSetting({
            itemName: 'test',
        })
        expect(instance.getSetting().itemName).to.equal('test')
        instance.updateSetting({
            itemName: options.setting.itemName,
        })
    })

    describe('${_component} view测试', function () {
        const store = createStore(combineReducers({
            [reducerPath]: instance.reducer,
        }), {
            [reducerPath]: {},
        })
        const wrapper = mount(<instance.View />, {
            context: {
                store,
            },
        })
        it('check view', function () {
            expect(wrapper.find(View)).to.have.length(1)
            expect(wrapper.find('.general-line-name').text()).to.equal(instance.getSetting().itemName)
            expect(wrapper.find('button')).to.have.length(1)
        })
    })

    describe('${_component} services测试', function () {
        const store = createStore(combineReducers({
            [reducerPath]: instance.reducer,
        }), {
            [reducerPath]: {},
        })
        const wrapper = mount(<instance.View />, {
            context: {
                store,
            },
        })

        it('check services', function () {
            store.dispatch(instance.services.onChange([1]))
            expect(store.getState()[reducerPath].value).to.have.length(1)
            expect(store.getState()[reducerPath].value[0]).to.equal(1)

            store.dispatch(instance.services.onChange([]))
            store.dispatch(instance.services.validate())
            expect(store.getState()[reducerPath].errorMsg).to.equal('请选择变更项')

        })
    })
})
