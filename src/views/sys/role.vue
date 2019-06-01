<template>
    <div class="table-div">
        <el-form :inline="true" size="small" label-position="left">
            <el-form-item label="角色名">
                <el-input placeholder="请输入角色名"
                          v-model="roleName"
                          size="small"
                          clearable/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click.native="search">查询</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click.native="clear">清除条件</el-button>
            </el-form-item>
        </el-form>

        <div class="tool-container">
            <el-button type="primary" icon="el-icon-plus" size="small" @click.native="saveOrModifyData(0)" v-has="'sys:role:save'">新增</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click.native="deleteBatchData" v-has="'sys:role:remove'" :disabled="deleteArr.length <= 0">批量删除</el-button>
        </div>

        <el-table :data="tableData" ref="multiTable" row-key="menuId" height="480" size="mini" @selection-change="selectionChange" stripe border>
            <el-table-column type="selection" label="1" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" :index="genIndex" align="center" fixed="left"></el-table-column>
            <el-table-column prop="roleId" label="Id" width="160" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="160" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="roleSign" label="角色标签" width="160" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="remark" label="备注" width="180" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="state" label="状态" width="80" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="0 === scope.row.state" size="mini" type="danger">关闭</el-tag>
                    <el-tag v-else-if="1 === scope.row.state" size="mini" type="success">启用</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="140" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="160" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-popover placement="top" trigger="click" :ref="scope.row.roleId + 'del'">
                        <p>确定对<span class="popover-tip-val">{{scope.row.roleName}}</span>进行<span class="popover-tip-op">删除</span>操作?</p>
                        <div style="text-align: right; margin: 0;">
                            <el-button type="text" size="mini" @click.native="hideDelPopover(scope.row.roleId, 'del')">取消</el-button>
                            <el-button type="primary" size="mini" @click.native="deleteData(scope.row)">确定</el-button>
                        </div>
                    </el-popover>

                    <el-button type="warning" size="mini" @click.native="saveOrModifyData(scope.row.roleId)" v-has="'sys:role:modify'">修改</el-button>
                    <el-button v-popover="scope.row.roleId + 'del'" type="danger" size="mini" v-has="'sys:role:remove'">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="table-page">
            <el-pagination background layout="total, prev, pager, next, sizes, jumper"
                           @current-change="pageChange"
                           @size-change="sizeChange"
                           :page-sizes="[10, 20, 50, 80, 100]"
                           :current-page.sync="paging.page"
                           :page-size.sync="paging.size"
                           :total="paging.total">
            </el-pagination>
        </div>

        <save-or-modify ref="saveOrModify" @refreshData="listData"></save-or-modify>
    </div>
</template>

<script>
    import {listRole, removeRole} from '../../api/sys/sys-role'
    import {success, error, info} from '../../libs/message'
    import SaveOrModify from '../../components/sys/role-save-or-modify'

    export default {
        data() {
            return {
                paging: {
                    page: 1,
                    size: 10,
                    total: 0,
                },
                userAvatar: require('../../assets/images/avatar.png'),
                deleteArr: [],
                tableData: [],
                roleName: '',
            };
        },
        created() {
            this.listData();
        },
        components: {
            SaveOrModify
        },
        methods: {
            selectionChange(rows) {
                this.deleteArr = rows;
            },

            genIndex(index) {
                return this.paging.size * (this.paging.page - 1) + index + 1;
            },

            search: function () {
                this.listData();
            },

            clear: function () {
                this.roleName = '';

                this.listData();
            },

            listData() {
                let that = this;
                const params = that.getParams();

                listRole(params, function (res) {
                    if (res.success) {
                        that.paging.total = res.extra.total;
                        that.tableData = res.data;
                    } else {
                        error(res.msg);
                        that.tableData = [];
                    }
                });
            },

            getParams() {
                let that = this;
                return {
                    // 页码
                    page: that.paging.page,
                    // 页面大小
                    size: that.paging.size,

                    roleName: that.roleName
                };
            },

            pageChange(page) {
                this.paging.page = page;

                this.listData();
            },

            sizeChange(size) {
                this.paging.page = 1;
                this.paging.size = size;

                this.listData();
            },

            saveOrModifyData(roleId) {
                this.$nextTick(() => {
                    this.$refs.saveOrModify.init(roleId);
                })
            },

            deleteData(row) {
                let that = this;
                let params = row.roleId ? [row.roleId] : row;

                removeRole(params, function (res) {
                    if (res.success) {
                        success(res.msg);

                        setTimeout(function () {
                            that.listData();
                        }, 500);
                    } else {
                        error(res.msg);
                    }

                    if (row.roleId) {
                        that.hideDelPopover(row.roleId, 'del');
                    }
                });
            },

            deleteBatchData() {
                let roleIdArr = this.deleteArr.map(item => {
                    return item.roleId
                });

                const h = this.$createElement;
                this.$msgbox({
                    title: "提示",
                    type: 'warning',
                    message: h('p', null, [
                        h('span', null, '确定对选中数据进行['),
                        h('span', {style: 'color: red;'}, '批量删除'),
                        h('span', null, ']操作?'),
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.deleteData(roleIdArr);
                }).catch(() => {
                    info("已取消删除");
                });
            },

            hideDelPopover(id, type) {
                this.$refs[id + type].doClose();
            },
        }
    };
</script>