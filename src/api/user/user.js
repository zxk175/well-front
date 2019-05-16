import * as API from '../api.js'
import {post} from '../../libs/request'
import {defSuccess, defError} from '../../libs/util'

// 登录
export function login(params, success, error) {
    post(API.LOGIN, params, function (res) {
        defSuccess(success, res);
    }, function (err) {
        defError(error, err);
    });
}