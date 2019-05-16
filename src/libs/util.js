import {success} from './message'
import {checkErrorStatus} from '../libs/request'
import {USER_KEY, TOKEN_KEY, MENU_LIST_KEY} from '../config'
import {getLsItem, setLsItem, getSsItem, setSsItem} from '../libs/storage'


export const getUser = () => {
    const user = getLsItem(USER_KEY);
    return user ? user : false;
};

export const setUser = (user) => {
    setLsItem(USER_KEY, JSON.stringify(user));
};

export const getUserId = () => {
    const user = getUser();
    return user ? user.userId : '0';
};

export const getToken = () => {
    const token = getLsItem(TOKEN_KEY);
    return token ? token : false;
};

export const setToken = (token) => {
    setLsItem(TOKEN_KEY, token);
};

export const getMenuList = () => {
    return getSsItem(MENU_LIST_KEY) || [];
};

export const setMenuList = (menuList) => {
    setSsItem(MENU_LIST_KEY, JSON.stringify(menuList || []));
};

export const lazyView = (view) => {
    // 使用[request]来告诉webpack，这里的值由传入的字符串来决定
    // https://blog.csdn.net/javao_0/article/details/85162458
    return () => import(/* webpackChunkName: "[request]" */ `../views/${view}.vue`);
};

export const replaceUrl = (url) => {
    return url.replace("/", "-");
};

export const treeDataTranslate = (data, id = 'menuId', pid = 'parentId') => {
    let res = [];
    let temp = {};
    let length = data.length;
    for (let i = 0; i < length; i++) {
        temp[data[i][id]] = data[i]
    }

    for (let k = 0; k < length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
            if (!temp[data[k][pid]]['children']) {
                temp[data[k][pid]]['children'] = []
            }
            if (!temp[data[k][pid]]['_level']) {
                temp[data[k][pid]]['_level'] = 1
            }
            data[k]['_level'] = temp[data[k][pid]]._level + 1;
            temp[data[k][pid]]['children'].push(data[k])
        } else {
            res.push(data[k])
        }
    }

    return res
};

export const format = (str, data) => {
    if (isArray(data)) {
        let reg = new RegExp("\{([0-" + (data.length - 1) + "])\}", "g");
        return str.replace(reg, function (match, index) {
            return data[index];
        });
    }

    if (typeof data === "object") {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                str = str.replace(new RegExp("\{" + key + "\}", "g"), data[key]);
            }
        }
    }

    return str;
};

export const defSuccess = (successCb, res) => {
    if (successCb) {
        const data = res.data;
        successCb(data);
    } else {
        success("请求成功");
    }
};

export const defError = (errorCb, errMsg) => {
    console.log(errMsg);

    if (errorCb) {
        errorCb(errMsg);
    } else {
        checkErrorStatus(errMsg);
    }
};

export const isProd = () => {
    return 'prod' === process.env.NODE_ENV;
};

export const isArray = (param) => {
    return '[object Array]' === prototype(param);
};

export const isString = (param) => {
    return '[object String]' === prototype(param);
};

export const isObject = (param) => {
    return '[object Object]' === prototype(param);
};

export const isJson = (param) => {
    if (isString(param)) {
        try {
            JSON.parse(param);

            // 是对象或数组则返回true
            return param.indexOf('{') > -1 || param.indexOf('[') > -1;
        } catch (e) {
            return false;
        }
    }

    return false;
};

function prototype(param) {
    return Object.prototype.toString.call(param)
}
