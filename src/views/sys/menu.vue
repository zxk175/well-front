<template>
    <div class="table-div">
        <el-form :inline="true">
            <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-plus" @click.native="saveOrModifyData(0)" v-has="'sys:menu:save'">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" :indent="6" row-key="menuId" height="480" size="mini" stripe border>
            <el-table-column prop="menuId" label="Id" width="260" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" width="120" align="center"></el-table-column>
            <el-table-column prop="icon" label="图标" width="80" align="center">
                <template slot-scope="scope">
                    <icon-svg id="cell-icon" :name="scope.row.icon"></icon-svg>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="60" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="1 === scope.row.type" size="mini">目录</el-tag>
                    <el-tag v-else-if="2 === scope.row.type" size="mini" type="success">菜单</el-tag>
                    <el-tag v-else-if="3 === scope.row.type" size="mini" type="warning">按钮</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="url" label="路径" width="180" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="perms" label="授权标识" width="240" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sort" label="排序" width="60" align="center"></el-table-column>
            <el-table-column label="操作" width="160" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-popover placement="top" trigger="click" :ref="scope.row.menuId + 'del'">
                        <p>确定对<span class="popover-tip-val">{{scope.row.name}}</span>进行<span class="popover-tip-op">{{scope.row.state === 0 ? '恢复' : '删除'}}</span>操作?</p>
                        <div style="text-align: right; margin: 0;">
                            <el-button type="text" size="mini" @click.native="hideDelPopover(scope.row.menuId, 'del')">取消</el-button>
                            <el-button type="primary" size="mini" @click.native="deleteData(scope.row, scope.row.state === 0 ? 1 : 0)">确定</el-button>
                        </div>
                    </el-popover>

                    <el-button type="warning" size="mini" @click.native="saveOrModifyData(scope.row.menuId)" v-has="'sys:menu:modify'">修改</el-button>
                    <el-button v-popover="scope.row.menuId + 'del'" type="success" size="mini" v-if="scope.row.state === 0" v-has="'sys:menu:remove'">恢复</el-button>
                    <el-button v-popover="scope.row.menuId + 'del'" type="danger" size="mini" v-else v-has="'sys:menu:remove'">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <save-or-modify ref="saveOrModify" @refreshData="listData"></save-or-modify>
    </div>
</template>

<script>
    import {success, error} from '../../libs/message'
    import {listMenu, removeMenu} from '../../api/sys/sys-menu'
    import SaveOrModify from '../../components/sys/menu-save-or-modify'

    export default {
        data() {
            return {
                tableData: []
            }
        },
        created() {
            this.listData();
        },
        components: {
            SaveOrModify
        },
        methods: {
            listData() {
                let that = this;

                listMenu(function (res) {
                    if (res.success) {
                        that.tableData = res.data;
                    } else {
                        error(res.msg);
                        that.tableData = [];
                    }
                })
            },

            saveOrModifyData(menuId) {
                this.$nextTick(() => {
                    this.$refs.saveOrModify.init(menuId);
                })
            },

            deleteData(row, state) {
                let that = this;
                let menuId = row.menuId;
                let params = {
                    "state": state,
                    "menuId": menuId
                };

                removeMenu(params, function (res) {
                    if (res.success) {
                        success(res.msg);

                        setTimeout(function () {
                            that.listData();
                        }, 500);
                    } else {
                        error(res.msg);
                    }

                    that.hideDelPopover(menuId, 'del');
                });
            },

            hideDelPopover(id, type) {
                this.$refs[id + type].doClose();
            },
        }
    };
</script>