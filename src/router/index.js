import Vue from 'vue'
import VueRouter from 'vue-router'
import {constRouter, mainRouter, otherRouter} from "./routers"
import {setToken, lazyView, replaceUrl, setMenuList} from '../libs/util'
import {cancelPending} from '../libs/request'
import {navMenu} from '../api/sys/sys-menu'
import {error} from '../libs/message'
import config from '../config'

Vue.use(VueRouter);

const {loginName} = config;
const router = new VueRouter({
    mode: 'hash',
    addFlag: false,
    routes: constRouter.concat(mainRouter).concat(otherRouter)
});

router.beforeEach((to, from, next) => {
    // 取消请求
    cancelPending();

    if (router.options.addFlag || loginName === to.name) {
        next();
    } else {
        navMenu(function (res) {
            if (res.success) {
                addDynamicRoutes(res.data);
                router.options.addFlag = true;
                setMenuList(res.data);
                next({...to, replace: true})
            } else {
                setMenuList([]);
                next();
            }
        }, function (err) {
            // 清除Token信息
            setToken('');

            let resp = err.response;
            if (resp && resp.status && resp.status === 200) {
                error("请求菜单列表失败，跳转至登录页");
                next({name: loginName});
            }
        });
    }
});

router.afterEach(() => {
    window.scrollTo(0, 0);
});

function addDynamicRoutes(menuList = [], routers = []) {
    let temp = [];
    let length = menuList.length;
    for (let i = 0; i < length; i++) {
        let curMenu = menuList[i];
        if (curMenu.children && curMenu.children.length >= 1) {
            temp = temp.concat(curMenu.children)
        } else if (curMenu.url && /\S/.test(curMenu.url)) {
            let url = replaceUrl(curMenu.url);
            let router = {
                path: url,
                name: url,
                component: null,
                meta: {
                    title: curMenu.name,
                    menuId: curMenu.menuId
                }
            };

            router['component'] = lazyView(curMenu.url) || null;

            routers.push(router);
        }
    }

    if (temp.length >= 1) {
        addDynamicRoutes(temp, routers)
    } else {
        if (mainRouter.children && mainRouter.children.length > 0) {
            mainRouter.children = [];
        }

        mainRouter.name = 'my-main';
        mainRouter.children = routers;
        router.addRoutes([
            mainRouter,
            {
                path: '*',
                redirect: '/404'
            }
        ]);

        console.log('\n');
        console.log('%c------------ 动态路由 start', 'color:blue');
        console.log(mainRouter.children);
        console.log('%c------------ 动态路由 end', 'color:blue')
    }
}

export default router