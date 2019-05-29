import axios from 'axios'
import router from '../router'
import config from '../config'
import {show, hide} from '../libs/loading'
import {success, error} from './message'
import {getToken} from './util'

let pending = [];
let CancelToken = axios.CancelToken;

// 请求频繁取消上一次请求
export const cancelPending = (config) => {
    pending.forEach((item, index) => {
        if (config && item.pendUrl === config.url) {
            // 取消请求
            item.cancel();
            // 移除当前请求记录
            pending.splice(index, 1)
        } else {
            item.cancel();
            pending.splice(index, 1);
        }
    })
};

// 创建axios 实例
export const http = axios.create({
    timeout: 24 * 1000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// request 拦截器
http.interceptors.request.use(
    config => {
        show();

        cancelPending(config);

        config.cancelToken = new CancelToken(res => {
            pending.push({'pendUrl': config.url, 'cancel': res});
        });

        if (config.auth) {
            const token = getToken();
            if (token) {
                config.headers["token"] = token;
            } else {
                toLogin();
            }
        }

        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// response 拦截器
http.interceptors.response.use(
    response => {
        hide();

        cancelPending(response.config);

        checkSuccessStatus(response.data);

        if (response.data && response.data.code === 401) {
            toLogin();
        }

        return response;
    },
    err => {
        hide();

        checkErrorStatus(err);

        return Promise.reject(err);
    }
);

export const request = (url, method, params, success, error) => {
    params = dealObjectValue(params);

    return http({
        url: url,
        method: method,
        data: params,
        auth: params.auth
    }).then(success).catch(error);
};

export const get = (url, success, error) => {
    return request(url, 'get', {}, success, error);
};

export const getAuth = (url, success, error) => {
    const params = {'auth': true};
    return request(url, 'get', params, success, error);
};

export const post = (url, params, success, error) => {
    return request(url, 'post', params, success, error);
};

export const postAuth = (url, params, success, error) => {
    params.auth = true;
    return request(url, 'post', params, success, error);
};

export const del = (url, success, error) => {
    return request(url, 'del', {}, success, error);
};

export const put = (url, params, success, error) => {
    return request(url, 'put', params, success, error);
};

export const checkSuccessStatus = (res) => {
    const status = res.code;
    if (status === -1 || status >= 1) {
        res.success ? success(`${res.msg}`) : error(`${res.msg}`);
    } else {
        if (!res.success) {
            error(`${res.msg}`);
        }
    }
};

export const checkErrorStatus = (err) => {
    if (err.response) {
        const status = err.response.status;
        switch (status) {
            case 401:
                error("未授权，请登录");
                break;
            case 403:
                error("拒绝访问");
                break;
            case 404:
                error(`请求地址不存在: ${err.response.config.url}`);
                break;
            case 500:
                error("服务器内部错误");
                break;
            case 502:
                error("网络错误或服务器关闭");
                break;
            default:
                error(`(${status}) 未知错误`);
                break;
        }
    } else {
        let msg = err.message;
        if (msg && msg.indexOf("timeout") > -1) {
            error("请求超时");
        } else if (msg && msg.indexOf("Network") > -1) {
            error("网络错误或服务器关闭");
        } else {
            error(msg || '未知错误');
        }
    }
};

function toLogin() {
    router.push({name: config.loginName});
}

function dealObjectValue(obj) {
    if (obj instanceof Array) {
        return obj;
    } else {
        let param = {};
        if (obj === null || obj === undefined || obj === "") {
            return param
        }
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let tmp = obj[key];
                if ("Object" === dataType(tmp)) {
                    param[key] = dealObjectValue(tmp);
                } else if (tmp !== null && tmp !== undefined && tmp !== "") {
                    param[key] = tmp;
                }
            }
        }
        return param;
    }
}

function dataType(obj) {
    if (obj === null) {
        return "Null";
    }

    if (obj === undefined) {
        return "Undefined";
    }

    return Object.prototype.toString.call(obj).slice(8, -1);
}