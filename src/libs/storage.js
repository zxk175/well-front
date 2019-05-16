import {isObject, isJson} from './util'

export const setLsItem = (key, value) => {
    if (isObject(value)) {
        value = JSON.stringify(value)
    }

    window.localStorage.setItem(key, value)
};

export const getLsItem = (key) => {
    let item = window.localStorage.getItem(key);

    if (isJson(item)) {
        item = JSON.parse(item)
    }

    return item;
};

export const removeLsItem = (key) => {
    let item = window.localStorage.getItem(key);

    if (item) {
        window.localStorage.removeItem(key);
        return true;
    } else {
        return false;
    }
};

export const clearLs = () => {
    return window.localStorage.clear()
};

export const setSsItem = (key, value) => {
    if (isObject(value)) {
        value = JSON.stringify(value)
    }

    window.sessionStorage.setItem(key, value)
};

export const getSsItem = (key) => {
    let item = window.sessionStorage.getItem(key);

    if (isJson(item)) {
        item = JSON.parse(item)
    }

    return item;
};

export const removeSsItem = (key) => {
    let item = window.sessionStorage.getItem(key);

    if (item) {
        window.sessionStorage.removeItem(key);
        return true;
    } else {
        return false;
    }
};

export const clearSs = () => {
    return window.sessionStorage.clear()
};
