declare global {
    interface Window {
        jsonCallBack: Function,
    }
}

export default (url: string) => {
    if (!url) {
        console.error('axios.jsonp出错 至少需要一个url参数!');
        return;
    }
    return new Promise((resolve, reject) => {
        window.jsonCallBack = result => {
            resolve(result);
        };
        var JSONP = document.createElement('script');
        JSONP.type = 'text/javascript';
        JSONP.src = `${url}&callback=jsonCallBack`;
        document.getElementsByTagName('head')[0].appendChild(JSONP);
        setTimeout(() => {
            document.getElementsByTagName('head')[0].removeChild(JSONP);
        }, 500);
    });
};


