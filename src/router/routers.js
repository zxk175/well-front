import {lazyView} from '../libs/util'

const login = 'login/login';
const main = 'main/main';
const home = 'home/home';
const _401 = 'error/401';
const _404 = 'error/404';
const _500 = 'error/500';

// 固定路由
export const constRouter = [
    {
        path: '/login',
        name: 'login',
        component: lazyView(login),
        meta: {
            title: '登录'
        }
    }
];

// Main路由
export const mainRouter =
    {
        path: '/',
        name: 'main',
        component: lazyView(main),
        redirect: {name: 'home'},
        meta: {
            title: '首页'
        },
        children: [
            {
                path: '/home',
                name: 'home',
                component: lazyView(home),
                meta: {
                    title: '首页'
                }
            }
        ]
    };

// 其它路由
export const otherRouter = [
    {
        path: '/401',
        name: '401',
        component: lazyView(_401),
        meta: {
            title: 'Access Error'
        }
    },
    {
        path: '/404',
        name: '404',
        component: lazyView(_404),
        meta: {
            title: 'Page Not Found'
        }
    },
    {
        path: '/500',
        name: '500',
        component: lazyView(_500),
        meta: {
            title: 'Server Error'
        }
    }
];