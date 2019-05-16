<template>
  <div>
      <h2>登录信息</h2>

      <p>用户Id：{{user.userId}}</p>
      <p>手机号：{{user.mobile}}</p>
      <p>用户名字：{{user.userName}}</p>
  </div>
</template>

<script>
    import {getUser} from '../../libs/util'

    export default {
        data() {
            return {
                user: {
                    mobile: "请登录",
                    userName: '请登录',
                    defAvatar: require('../../assets/images/avatar.png'),
                },
            }
        },
        created() {
            this.user = Object.assign(this.user, getUser());
        },
    }
</script>