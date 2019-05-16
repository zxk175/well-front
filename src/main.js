import Vue from 'vue'
import App from './App.vue'
import store from './store'
import config from './config'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/common.css'
import './assets/icons/ali/iconfont.js'
import directive from './directive'
import IconSvg from './components/icon-svg'
import {getSsItem, setSsItem} from './libs/storage'


// 注册指令
directive(Vue);

Vue.use(Element);
Vue.component('IconSvg', IconSvg);

// 全局注册应用配置
Vue.prototype.$config = config;
Vue.config.productionTip = false;

// Vue错误处理
Vue.config.errorHandler = function (err) {
    Vue.nextTick(() => {
        console.error(err);
    })
};

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    created() {
        const storeKey = "store";

        // 在页面加载时读取sessionStorage里的状态信息
        let store = getSsItem(storeKey);
        if (store) {
            this.$store.replaceState(Object.assign({}, this.$store.state, store))
        }

        // 在页面刷新时将vuex的信息保存到sessionStorage
        window.addEventListener("beforeunload", () => {
            setSsItem(storeKey, JSON.stringify(this.$store.state))
        });
    }
});
