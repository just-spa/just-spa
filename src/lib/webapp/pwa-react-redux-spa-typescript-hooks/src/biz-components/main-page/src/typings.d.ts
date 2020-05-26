/**
 * 组件属性结构
 *
 * @export
 * @interface MainPageProps
 */
export interface MainPageProps {
    MainPage: {
        name: string,
        text: string,
    },
    dispatch: Function,
}

/**
 * API数据结构定义
 *
 * @export
 * @interface APIRespData
 */
export interface APIRespData {
    data: {
        [k: string]: string,
    },
    code: number,
}

/**
 * Action结构定义
 *
 * @export
 * @interface APIRespData
 */
export interface Action {
    type: string,
    data: object,
}

/**
 * Index View的属性定义
 *
 * @export
 * @interface IndexViewProps
 */
export interface IndexViewProps {
    title: string,
    name: string,
    text: string,
    dispatchChange: Function,
    dispatchAsyncChange: Function,
}