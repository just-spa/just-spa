import {ReduxSagaEffects, regeneratorRuntime} from '../libs/redux'

// import simpleRestClient from '../rest/simple';
//
// import crudFetch from './crudFetch'
// import {watchAddTodo} from './projectTodoCount'
// import {watchFetchLoading} from './navBarLoading'
// import {watchShowNotification} from './hideNotification'
// const {fork} = ReduxSagaEffects;

export default function* root() {
  yield [
    // fork(watchAddTodo),
    // fork(watchFetchLoading),
    // fork(watchShowNotification)
  ]
}