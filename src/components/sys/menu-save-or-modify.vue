<template>
    <el-dialog :title="opFlag ? '新增' : '修改'" :visible.sync="visible" :close-on-click-modal="false">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
            <el-form-item label="类型" prop="type">
                <el-radio-group v-model="dataForm.type" @change="typeChange">
                    <el-radio v-for="(item, key) in dataForm.typeObj" :label="key" :key="key">{{item}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="dataForm.typeObj[dataForm.type] + '名称'" prop="name">
                <el-input v-model="dataForm.name" :placeholder="dataForm.typeObj[dataForm.type] + '名称'" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="上级菜单" prop="parentId">
                <el-popover ref="menuListPopover" placement="bottom-start" trigger="click">
                    <el-tree ref="menuListTree" node-key="menuId"
                             :data="menuListTreeData"
                             :props="menuListTreeProps"
                             :highlight-current="true"
                             :default-expand-all="true"
                             :expand-on-click-node="false"
                             @current-change="currentChangeHandle">
                    </el-tree>
                </el-popover>

                <el-input v-model="dataForm.parentName" v-popover:menuListPopover readonly placeholder="点击选择上级菜单" size="medium"></el-input>
            </el-form-item>
            <el-form-item v-show="dataForm.type === '2'" label="菜单路由" prop="url" :class="{'is-required': dataForm.type === '2'}">
                <el-input v-model="dataForm.url" placeholder="菜单路由" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item v-show="dataForm.type >= 2" label="授权标识" prop="perms">
                <el-input v-model="dataForm.perms" placeholder="多个用逗号分隔, 如: user:list,user:add" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item v-show="dataForm.type <= 2" :label="dataForm.typeObj[dataForm.type] + '图标'" prop="icon">
                <el-popover ref="iconListPopover" placement="bottom-start" trigger="click" popper-class="table-div__icon-popover">
                    <div class="table-div__icon-list">
                        <el-button v-for="(item, index) in iconList" :key="index" :class="{'is-active': item === dataForm.icon}"
                                   @click.native="iconActiveHandle(item)">
                            <icon-svg :name="item"/>
                        </el-button>
                    </div>
                </el-popover>
                
                <el-input v-model="dataForm.icon" v-popover:iconListPopover size="medium" readonly>
                    <template slot="prepend">
                        <icon-svg :name="dataForm.icon" fs="18"/>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="dataForm.sort" :min="1" controls-position="right" size="medium"></el-input-number>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button type="text" size="mini" @click.native="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click.native="dataFormSubmit">确定</el-button>
        </span>
    </el-dialog>
</template>

<style lang="less" scoped>
    .table-div {
        .menu-list__input,
        .icon-list__input {
            > .el-input__inner {
                cursor: pointer;
            }
        }

        &__icon-popover {
            max-width: 370px;
        }

        &__icon-list {
            max-height: 180px;
            padding: 0;
            margin: -8px 0 0 -8px;

            > .el-button {
                padding: 8px;
                margin: 8px 0 0 8px;

                > span {
                    display: inline-block;
                    vertical-align: middle;
                    width: 18px;
                    height: 18px;
                    font-size: 18px;
                }
            }
        }

        .icon-list__tips {
            font-size: 18px;
            text-align: center;
            color: #e6a23c;
            cursor: pointer;
        }
    }
</style>

<script>
    import {treeDataTranslate} from '../../libs/util'
    import {selectMenu, infoMenu, opMenu} from '../../api/sys/sys-menu'

    export default {
        data() {
            let that = this;
            let validateUrl = (rule, value, callback) => {
                if (that.dataForm.type === '2' && !/\S/.test(value)) {
                    callback(new Error('菜单URL不能为空'))
                } else {
                    callback()
                }
            };

            return {
                opFlag: true,
                visible: false,
                dataForm: {
                    menuId: 0,
                    type: '2',
                    typeObj: {
                        '1': '目录',
                        '2': '菜单',
                        '3': '按钮'
                    },
                    name: '',
                    parentId: '0',
                    parentName: '',
                    url: '',
                    perms: '',
                    icon: '',
                    sort: 0
                },
                dataRule: {
                    name: [
                        {required: true, message: '菜单名称不能为空', trigger: 'blur'}
                    ],
                    parentId: [
                        {required: true, message: '上级菜单不能为空', trigger: 'change'}
                    ],
                    url: [
                        {validator: validateUrl, trigger: 'blur'}
                    ]
                },
                iconList: [],
                menuListTreeData: [],
                menuListTreeProps: {
                    label: 'name',
                    children: 'children'
                }
            }
        },
        created() {
            this.listIcon();
        },
        methods: {
            init(menuId) {
                let that = this;
                that.visible = true;
                that.dataForm.menuId = menuId || 0;
                that.opFlag = that.dataForm.menuId === 0;
                that.$nextTick(() => {
                    that.$refs.dataForm.resetFields();
                });

                selectMenu(function (res) {
                    if (res.success) {
                        that.menuListTreeData = treeDataTranslate(res.data);

                        if (that.opFlag) {
                            that.setCurrentNode();
                        } else {
                            that.getInfo(menuId);
                        }
                    } else {
                        that.menuListTreeData = [];
                    }
                });
            },

            listIcon() {
                let svg = document.getElementsByTagName("svg");
                let childElementCount = svg[0].childElementCount;
                for (let i = 0; i < childElementCount; i++) {
                    let childNode = svg[0].childNodes[i];
                    let message = childNode.id.toString().replace("if-", "");
                    this.iconList.push(message);
                }
            },

            getInfo(menuId) {
                let that = this;

                infoMenu(menuId, function (res) {
                    if (res.success) {
                        // 对象拷贝
                        Object.assign(that.dataForm, res.data);
                        that.dataForm.type = res.data.type + '';
                        that.setCurrentNode();
                    }
                });
            },

            typeChange() {
                let that = this;
                that.$nextTick(() => {
                    that.$refs.dataForm.clearValidate();
                });
            },

            currentChangeHandle(data) {
                this.dataForm.parentId = data.menuId;
                this.dataForm.parentName = data.name
            },

            setCurrentNode() {
                let that = this;
                that.$nextTick(() => {
                    that.$refs.menuListTree.setCurrentKey(that.dataForm.parentId);
                    that.dataForm.parentName = (that.$refs.menuListTree.getCurrentNode() || {})['name'];
                });
            },

            iconActiveHandle(icon) {
                this.dataForm.icon = icon;
            },

            dataFormSubmit() {
                let that = this;
                that.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        let params = that.dataForm;
                        if (that.opFlag) {
                            delete params["menuId"];
                        }

                        opMenu(that.opFlag, params, function (res) {
                            if (res.success) {
                                that.visible = false;
                                that.$emit('refreshData');
                            }
                        })
                    }
                });
            },
        }
    }
</script>
