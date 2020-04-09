<template>
    <div class="loginIcon">
        <router-link class="login-text" title="登录" :to="{path:'/login/index', query:{projectId: projectId, passKey: passKey}}" v-if="!hasLogin">{{$t("RegLogin.Login")}}</router-link>
        <router-link class="login-message" :to="{path:'/notice/index', query:{projectId: projectId, passKey: passKey}}" v-if="hasLogin"><i class="icon-xiaoxi"></i><em class="dot" v-if="hasLogin && chatNum > 0" v-text="chatNum"></em></router-link>
    </div>
</template>
<script>

import { commonAjaxFun } from '../../../common/js/common.js'

export default {
	data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            chatNum: 0//消息数
        }
	},
    computed: {
        hasLogin: function(){
            //判断是否登陆，默认false未登录
            if(!this.loginState) {
                return false
            } else {
                return true;
            }
        }
    },
    mounted(){
        if(!!this.loginState){
            this.chatGetNum();
        }
    },
    methods: {
        chatGetNum: function(){
            //消息提醒
            let _this = this;

            commonAjaxFun({
                url: '/messageTool/chat/getNum',
                data: {
                    projectId:_this.projectId,
                    passKey:_this.passKey
                }
            }).then((data) => {

                if(data.state == '0') {
                    _this.chatNum = data.data;
                } else {
                    _this.chatNum = 0;
                    console.log(data.message)
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
