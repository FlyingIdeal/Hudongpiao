<template>
    <div class="login-tips">
        <div class="login-icon"><img src="~@/common/images/warn.png" /></div>
        <p class="login-text" title="请登录参展通，参与活动">{{$t("QuestionPage.LoginFirst")}}</p>
        <div class="login-bottom-handle"><router-link :to="{path:'/login/index', query:{projectId: projectId, passKey: passKey}}" title="登录">{{$t("RegLogin.Login")}}</router-link></div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.login-tips
    text-align: center
    padding: 120px 10px
    .login-icon
        img
            width: 100px
    p.login-text
        margin-top: 20px
        word-break: break-word
        color: rgba(0,0,0,0.4)
        font-size: 18px
    .login-bottom-handle
        position: fixed
        left: 0px
        bottom: 0px
        width: 100%
        display: flex
        a
            flex: 1
            display: block
            line-height: 50px
            height: 50px
            color: #fff
            text-align: center
            background-color: #f35b00
            font-size: 18px
</style>
