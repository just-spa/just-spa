import connect from './redux-connect/connect'

export function enhancedConnect(mapToState, mapToDispatch, is_page = true) {
    return function (pageConfig) {
        const {
            onLoad: _onLoad,
            onUnload: _onUnload,
            onAuthenticated,
            onRehydrated
        } = pageConfig;

        function onLoad(options) {
            this.store = getApp().store;

            if (this.store) {
                const state = this.store.getState();

                if (typeof onRehydrated === 'function') {
                    if (state.rehydrated) {
                        onRehydrated.call(this, options)
                    } else {
                        this.unsubscribeRehydrate = this.store.subscribe(() => {
                            const state = this.store.getState();
                            if (state.rehydrated) {
                                this.unsubscribeRehydrate();
                                onRehydrated.call(this, options);
                            }
                        });
                    }
                }

                const authenticated = state => state.auth && state.auth.authenticated && state.auth.expiredAt > new Date().getTime();
                if (typeof onAuthenticated === 'function') {
                    if (authenticated(state)) {
                        onAuthenticated.call(this, options)
                    } else {
                        this.unsubscribeAuth = this.store.subscribe(() => {
                            const state = this.store.getState();
                            if (authenticated(state)) {
                                this.unsubscribeAuth();
                                onAuthenticated.call(this, options);
                            }
                        });
                    }
                }
            }

            if (typeof _onLoad === 'function') {
                _onLoad.call(this, options)
            }
        }

        function onUnload() {
            if (typeof _onUnload === 'function') {
                _onUnload.call(this)
            }
            typeof this.unsubscribe === 'function' && this.unsubscribe()
        }

        return connect(mapToState, mapToDispatch, is_page)({...pageConfig, onLoad, onUnload})
    }
}
