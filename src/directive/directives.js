import store from '../store'
import config from '../config'

export function hasPerms(Vue) {
    Vue.directive('has', {
        inserted(el, binding) {
            if (store.getters.perms.includes(binding.value)) {
                el.style.visibility = "visible";
            } else {
                el.style.visibility = "hidden";
                el.parentNode.removeChild(el);
            }
        }
    });
}

export function setTitle(Vue) {
    let titleFun = function (router) {
        if (router === undefined) {
            return
        }

        const pageTitle = (router.meta && router.meta.title) || router.name;
        window.document.title = pageTitle ? `${config.title} - ${pageTitle}` : config.title;
    };

    Vue.directive('title', function (el, binding) {
        titleFun(binding.value)
    })
}