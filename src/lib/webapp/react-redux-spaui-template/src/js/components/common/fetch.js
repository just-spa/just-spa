import axios from 'axios';
import mwReport from './middlewares/report';

// 参数转化
const stringifySearch = (searchData) => {
	let searchList = [],
		key = '';

	if (typeof searchData === 'object') {
		for (key in searchData) {
			if (typeof searchData[key] !== 'undefined') {
				searchList.push(key + '=' + encodeURIComponent(searchData[key]));
			}
		}
	}

	return searchList.join('&');
};

/*
 * 给fetch添加中间件（主要是为了处理所有公共发起的cgi）
 * @param config {object}
 * @param config.fetch {object} fetch的url,必须是支持链式的
 * @param config.data {obejct}
 * @param config.middlewares {Array} 根据数组从0至N添加组件（每个组件是函数哦）
 * @return fetch
 */
const applyMiddlewares = (config = {}) => {
	const fetch = config.fetch || {};
	const data = config.data || {};
	const middlewares = config.middlewares || [];
	let middleWareFetch = null;

	middlewares.map((item) => {
		if (item) {
			middleWareFetch = item(fetch, data);
		}
		return item;
	});

	return middleWareFetch;
}

/*
 * 下载文件
 * @param url {string} 请求的url
 * @param data {object} 下载请求的参数
 * @return void 没有返回
 */
let downloadIndex = 0;
const download = (theUrl = '', data = {}, downloadWaitTime = 20000) => {
	const id = 'downloadIframe_' + (downloadIndex++);
	let iframe = document.createElement('iframe'),
		url = theUrl;

	if (!url) {
		return false;
	}

	if (url.indexOf('?') > -1) {
		url += '&';
	} else {
		url += '?';
	}
	url += stringifySearch(data);

	iframe.id = id;
	iframe.url = url;
	iframe.frameborder = 0;
	iframe.scrolling = 'no';
	iframe.style.display = 'none';
	iframe.style.width = 0;
	iframe.style.height = 0;
	iframe.width = 0;
	iframe.height = 0;

	document.body.appendChild(iframe);

	setTimeout(function () {
		const $id = document.getElementById(id);

		if ($id) {
			document.body.removeChild(iframe);
		}
	}, downloadWaitTime);
}
/*
 * 发起请求
 * @param url {string} 请求的url
 * @param params {object}
 * @param params.method {string} 'GET/POST' 默认是GET
 * @param params.data {object} 参数
 * @return fetch
 */
export const fetch = (url = '', params = {}) => {
	let data = params.data || {},
		method = (params.method || 'get').toLowerCase();

	// url都不给，那肯定啥都没有啦
	if (!url || !method) {
		return false;
	}

	// 下载走别的路(下载iframe的缺少返回码上报)
	if (data && data.format === 'csv') {
		download(url, data);
		return {
			then: function () { }
		};
	}

	return applyMiddlewares({
		fetch: axios({
			url,
			data,
			method
		}),
		data: {
			url,
			data,
			method,
			startTime: new Date().getTime()
		},
		middlewares: [
			mwReport
		]
	});
}

export default fetch;