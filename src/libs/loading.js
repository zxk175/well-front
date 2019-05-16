import {Loading} from 'element-ui';

let loadingCount = 0;
let loading;

const open = () => {
    loading = Loading.service({
        lock: true,
        text: '请稍等，处理中......'
    });
};

const close = () => {
    loading.close();
};

export const show = () => {
    if (loadingCount === 0) {
        open();
    }

    loadingCount += 1;
};

export const hide = () => {
    if (loadingCount <= 0) {
        return;
    }

    loadingCount -= 1;
    if (loadingCount === 0) {
        close();
    }
};