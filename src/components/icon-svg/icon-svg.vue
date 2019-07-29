<template>
    <svg v-if="getSvgFlag" :class="getClass" :width="width" :height="height" aria-hidden="true">
        <use :xlink:href="getName"></use>
    </svg>

    <i v-else :class="getIClass"></i>
</template>

<script>
    export default {
        name: 'icon-svg',
        props: {
            name: {
                type: String,
                required: true
            },
            clazz: {
                type: String
            },
            width: {
                type: String
            },
            height: {
                type: String
            },
            fs: {
                type: String
            }
        },
        computed: {
            getName() {
                return `#if-${this.name}`;
            },

            getSvgFlag() {
                return this.name.toString().indexOf("el-icon") == -1;
            },

            getClass() {
                return [
                    'icon-svg',
                    this.fs ? `if${this.fs}` : '',
                    this.clazz ? `${this.clazz}` : ''
                ];
            },

            getIClass() {
                return [
                    this.fs ? `if${this.fs}` : '',
                    this.name ? `${this.name}` : '',
                    this.clazz ? `${this.clazz}` : '',
                ];
            }
        }
    }
</script>

<style scoped>
    .icon-svg {
        overflow: hidden;
        width: 1em;
        height: 1em;
        vertical-align: -0.18em;
        fill: currentColor;
    }

    .menu-icon {
        margin-right: 0;
        width: 24px;
        vertical-align: middle;
        text-align: center;
        font-size: 18px;
    }

    .if16 {
        font-size: 16px;
    }

    .if18 {
        font-size: 18px;
    }

    .if20 {
        font-size: 20px;
    }

    .if22 {
        font-size: 22px;
    }

    .if24 {
        font-size: 24px;
    }
</style>