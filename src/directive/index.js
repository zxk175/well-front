import * as directs from './directives'

const importDirective = Vue => {
    // 按钮鉴权
    directs.hasPerms(Vue);

    // 设置标题
    directs.setTitle(Vue);
};

export default importDirective