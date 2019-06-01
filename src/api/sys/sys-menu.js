import * as API from '../api.js'
import {getAuth, postAuth} from '../../libs/request'
import {format, defSuccess, defError} from '../../libs/util'

export function navMenu(success, error) {
    getAuth(API.SYS_MENU_NAV, function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    });
}

export function listMenu(success, error) {
    getAuth(API.SYS_MENU_LIST, function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    });
}

export function removeMenu(params, success, error) {
    postAuth(API.SYS_MENU_REMOVE, params, function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    });
}

export function selectMenu(success, error) {
    getAuth(API.SYS_MENU_SELECT, function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    });
}

export function infoMenu(params, success, error) {
    getAuth(format(API.SYS_MENU_INFO, [params]), function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    });
}

export function opMenu(opFlag, params, success, error) {
    const url = opFlag ? API.SYS_MENU_SAVE : API.SYS_MENU_MODIFY;
    postAuth(url, params, function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    })
}


