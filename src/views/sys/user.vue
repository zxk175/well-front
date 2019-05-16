<template>
    <div class="table-div">
        <el-form :inline="true">
            <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-plus" @click.native="saveOrModifyData(0)" v-has="'sys:user:save'">新增</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click.native="deleteBatchData" v-has="'sys:user:remove'" :disabled="deleteArr.length <= 0">批量删除</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" ref="multiTable" row-key="menuId" height="480" size="mini" @selection-change="selectionChange" stripe border>
            <el-table-column type="selection" label="1" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" :index="genIndex" align="center" fixed="left"></el-table-column>
            <el-table-column prop="userId" label="Id" width="160" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="avatar" label="头像" width="60" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <img :src="scope.row.avatar || userAvatar" width="30" height="30" alt="avatar">
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="名字" width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="mobile" label="手机号" width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="identity" label="身份标识" width="100" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="1 === scope.row.identity" size="mini" type="info">普通用户</el-tag>
                    <el-tag v-else-if="2 === scope.row.identity" size="mini" type="success">超级管理员</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="roleName" label="用户角色" width="180" align="center"></el-table-column>
            <el-table-column prop="state" label="状态" width="60" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="0 === scope.row.state" size="mini" type="danger">锁定</el-tag>
                    <el-tag v-else-if="1 === scope.row.state" size="mini" type="success">启用</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="140" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="160" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-popover placement="top" trigger="click" :ref="scope.row.userId + 'del'">
                        <p>确定对<span class="popover-tip-val">{{scope.row.userName}}</span>进行<span class="popover-tip-op">删除</span>操作?</p>
                        <div style="text-align: right; margin: 0;">
                            <el-button type="text" size="mini" @click.native="hideDelPopover(scope.row.userId, 'del')">取消</el-button>
                            <el-button type="primary" size="mini" @click.native="deleteData(scope.row)">确定</el-button>
                        </div>
                    </el-popover>

                    <el-button type="warning" size="mini" @click.native="saveOrModifyData(scope.row.userId)" v-has="'sys:user:modify'">修改</el-button>
                    <el-button v-popover="scope.row.userId + 'del'" type="danger" size="mini" v-has="'sys:user:remove'">删除</el-button>
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
    import {list, remove} from '../../api/sys/sys-user'
    import {success, error, info} from '../../libs/message'
    import SaveOrModify from '../../components/sys/user-save-or-modify'

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
                mobile: ''
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

            listData() {
                let that = this;
                const params = that.getParams();

                list(params, function (res) {
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
                    // 手机号
                    mobile: that.mobile,
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

            saveOrModifyData(userId) {
                this.$nextTick(() => {
                    this.$refs.saveOrModify.init(userId);
                })
            },

            deleteData(row) {
                let that = this;
                let params = {};

                if (row.userId) {
                    params = [{
                        "userId": row.userId,
                        "identity": row.identity
                    }];
                } else {
                    params = row;
                }

                remove(params, function (res) {
                    if (res.success) {
                        success(res.msg);

                        setTimeout(function () {
                            that.listData();
                        }, 500);
                    } else {
                        error(res.msg);
                    }

                    if (row.userId) {
                        that.hideDelPopover(row.userId, 'del');
                    }
                });
            },

            deleteBatchData() {
                let userIdArr = this.deleteArr.map(item => {
                    return {
                        "userId": item.userId,
                        "identity": item.identity
                    };
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
                    this.deleteData(userIdArr);
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