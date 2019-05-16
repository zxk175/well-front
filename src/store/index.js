import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex);

export default new Vuex.Store({
    // 生产环境要关闭，影响性能
    strict: false,
    modules: {
        user
    },
    getters
})