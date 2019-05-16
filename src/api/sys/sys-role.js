import * as API from '../api.js'
import {getAuth, postAuth} from '../../libs/request'
import {format, defSuccess, defError} from '../../libs/util'

export function listRole(params, success, error) {
    postAuth(API.SYS_ROLE_LIST, params, function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    });
}

export function removeRole(params, success, error) {
    postAuth(API.SYS_ROLE_REMOVE, params, function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    });
}

export function infoRole(params, success, error) {
    getAuth(format(API.SYS_ROLE_INFO, [params]), function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    });
}

export function opRole(opFlag, params, success, error) {
    const url = opFlag ? API.SYS_ROLE_SAVE : API.SYS_ROLE_MODIFY;
    postAuth(url, params, function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    })
}


