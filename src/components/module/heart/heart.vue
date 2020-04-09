<template>
    <i :class="state == false ? defaultIcon : activeIcon" @click="collectFavorite($el)"></i>
</template>
<script>
import {commonAjaxFun} from '../../../common/js/common.js'
export default {
    props: {
        favState: {},
        defaultIcon: String,//默认icon
        activeIcon: String,//点选之后的icon状态
        axiosParam: Object()
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            state : this.favState
        }
    },
    methods: {
        collectFavorite: function(dom){   
            let _this = this;
            //首先判断是否登录
            if(!_this.loginState){
                
                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
                return false;
            }
            _this.$layer.loading();

            commonAjaxFun({
                url: '/userApi/watch',
                data: _this.axiosParam.data
            }, 500).then((data) => {
                let msg = '';
                if(data.state != '0'){
                    msg = data.message;
                } else {
                    if(data.data == false){
                        msg = _this.$t('layerTips.RemoveFavorite');//取消收藏
                        this.state = false
                    } else if(data.data == true){
                        msg = _this.$t('layerTips.AddFavorite');//收藏成功
                        this.state = true
                    }
                }
                _this.$layer.toast({content: msg})
            })
        }
    }
}
</script>
<style lang="stylus" rel="stylesheet/stylus"></style>
