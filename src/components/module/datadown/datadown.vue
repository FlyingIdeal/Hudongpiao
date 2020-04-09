<template>
    <div>
        <transition name="move">
            <div class="data-download" v-show="showFlag">
                <!--资料下载-->
                <div class="data-down-close"><i class="icon-clear" @click="hideMaskShadow"></i></div>
                <div class="data-down-in">
                    <h6 title="所选资料将发送到以下邮箱">{{$t("RegLogin.SendEmailAddress")}}*</h6>
                    <input type="text" name="" value="" v-model="localemail" />
                    <p title="请填写正确的邮箱" v-text="tipsText"></p>
                </div>
                <div class="data-down-btn" @click="dataSubmit" title="发送">{{$t("RegLogin.AppointmentSubmit")}}</div>
            </div>
        </transition>
        <div class="mask-shadow" v-show="showFlag" @click="hideMaskShadow"></div>
    </div>
</template>
<script>

import {regEmail, commonAjaxFun} from '../../../common/js/common.js'

export default {
    props: {
        params: Object 
    },
    data () {
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            showFlag: false,
            localemail: '',//本地存储邮箱
            tipsText : ''//邮箱不正确的提示语
        }
    },
    mounted(){
        this.localemail = window.localStorage ? localStorage.getItem('HUDONGPIAOEAMIL') : ''
    },
    methods: {
        hideMaskShadow: function(){
            this.showFlag = !this.showFlag
        },
        dataSubmit: function(){
            //发送
            //检测邮箱
            let _this = this;

            if (!regEmail.test(_this.localemail)) {
                _this.tipsText = _this.$t("layerTips.FillCorrectEmail");//请填写正确的邮箱
                return;
            } else {
                _this.tipsText = '';
                _this.$set(_this.params.data, 'email', _this.localemail)
            }

            commonAjaxFun({
                url: _this.params.url,
                data: _this.params.data
            }).then((data) => {
                try{
                    let _data = data.data;
                    if(data.state == '0'){
                        _this.$layer.toast({content: _this.$t("layerTips.SendSuccessfully")});//发送成功
                        _this.hideMaskShadow();
                        //_this.contentObj = _data;
                    } else {
                        _this.$layer.toast({content: data.message});
                    }
                }catch(err){
                    console.log(err)
                }
            })

            if(window.localStorage) {
                localStorage.setItem("HUDONGPIAOEAMIL", _this.localemail);  
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.data-download
    background-color: #fff
    width: 300px
    position: fixed
    left: 50%
    top: 200px
    z-index: 16
    margin-left: -150px
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
        transition: all 0.1s linear
    &.move-enter, &.move-leave-active
        transform: translate3d(0, -100%, 0)
    .data-down-close
        height: 40px
        text-align: right
        i
            display: inline-block
            width: 40px
            height: 40px
            line-height: 40px
            text-align: center
            font-size: 20px
    .data-down-in
        padding: 0 10px
        h6
            font-size: 14px
            padding: 4px 0 8px
        input
            border: 1px solid #cccccc
            background-color: #f2f2f2
            height: 36px
            line-height: 36px
            width: 100%
            box-sizing: border-box
            padding: 4px 8px
            border-radius: 4px
        p
            padding: 6px 0
            height: 30px
            box-sizing: border-box
            color: #ff0000
            font-size: 12px
    .data-down-btn
        height: 50px
        line-height: 50px
        font-size: 20px
        color: #fff
        text-align: center
        background-color: #737373
</style>
