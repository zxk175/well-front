import * as API from '../api.js'
import {getAuth, postAuth} from '../../libs/request'
import {format, defSuccess, defError} from '../../libs/util'

export function list(params, success, error) {
    postAuth(API.SYS_USER_LIST, params, function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    });
}

export function remove(params, success, error) {
    postAuth(API.SYS_USER_REMOVE, params, function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    });
}

export function info(params, success, error) {
    getAuth(format(API.SYS_USER_INFO, [params]), function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    });
}

export function op(opFlag, params, success, error) {
    const url = opFlag ? API.SYS_USER_SAVE : API.SYS_USER_MODIFY;
    postAuth(url, params, function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    })
}


