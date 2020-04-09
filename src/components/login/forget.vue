<template>
    <div>
        <div class="head-back">
            <div class="head-back-icon" @click="routerBack"><i class="icon-leftarrow"></i></div>
            <h2 class="headerTitle" title="找回密码" v-text="titleStr"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat">
            <div class="create-form">
                <div class="field-main">
                    <h4 class="field-title"><span title="账号" v-text='AccountStr'></span><em class="red-star">*</em></h4>
                    <div class="field-box">
                        <div class="field-input"><input class="text-input" name="account" title="中国大陆11位手机号码/邮箱" maxlength="50" :placeholder="AccountTip" type="text"></div>
                        <div class="field-handle"><i class="icon-clear"></i></div>
                    </div>
                    <p class="field-error"><span v-show="accountFlag" title="请输入正确的电话号码或邮箱" v-text='AccountError'></span></p>
                </div>
                <div class="field-main">
                    <h4 class="field-title"><span title="验证码" v-text="CodeStr"></span><em class="red-star">*</em></h4>
                    <div class="field-justify">
                        <div class="field-box">
                            <div class="field-input"><input class="text-input" name="vercode" placeholder="" type="text" maxlength="6"></div>
                            <div class="field-handle"><i class="icon-clear"></i></div>
                        </div>
                        <div class="field-code-btn" :class="[codeFlag ? 'field-code-grey' : '']" v-text="codeText" @click="getVerificationCode"></div>
                    </div>
                    <p class="field-error"><span v-show="vercodeFlag" title="请填写正确验证码" v-text='CodeError'></span></p>
                </div>
                <div class="field-main">
                    <h4 class="field-title"><span title="设置新密码" v-text='PasswordStr'></span><em class="red-star">*</em></h4>
                    <div class="field-box">
                        <div class="field-input"><input class="text-input" name="password" maxlength="16" title="6-16个字母或数字，区分大小写，不允许有空格" :placeholder="PasswordTip" type="password"></div>
                        <div class="field-handle"><i class="icon-clear"></i></div>
                    </div>
                    <p class="field-error"><span v-show="passwordFlag" v-text="PasswordError"></span></p>
                </div>
                <div class="ready-submit" @click="submitForm" title="确定" v-text='button'></div>
            </div>
        </div>
    </div>
</template>

<script>

import {regEmail, regPhoneNumber, regNumber, regPassword, commonAjaxFun} from '../../common/js/common.js'

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            accountFlag: false,
            vercodeFlag: false,
            passwordFlag: false,
            codeText: "AskForCode",//获取验证码
            codeFlag: false,
            dbclickFlag: false,//获取验证码，防止多次点击
            countDownNum: 120,//倒计时120s
            passwordTxt: this.$t('RegLogin.Enterpassword'),//'请输入密码'
            tabLanguage: this.$route.query.language || this.$cookie.get('language') || 'ch',//tab切换
        }
    },
    computed:{
        AccountStr:function(){
            return this.tabLanguage == "en" ? "Account" : "账号"
        },
        AccountTip:function(){
            return this.tabLanguage == "en" ? "Please enter your email" : "请输入邮箱"
        },
        AccountError:function(){
            return this.tabLanguage == "en" ? "Incorrect E-mail address" : "请填写正确的邮箱"
        },
        CodeStr:function(){
            return this.tabLanguage == "en" ? "Verification Code" : "验证码"
        },
        CodeError:function(){
            return this.tabLanguage == "en" ? "Please enter the verification code" : "请填写正确验证码"
        },
        PasswordStr:function(){
            return this.tabLanguage == "en" ? "Set a new password" : "设置新密码"
        },
        PasswordTip:function(){
            return this.tabLanguage == "en" ? "6-16 characters or numbers" : "6-16个字母或数字，区分大小写，不允许有空格"
        },
        PasswordError:function(){
            return this.tabLanguage == "en" ? "Password format is not correct" : "密码格式不正确"
        },
        button:function(){
           return this.tabLanguage == "en" ? "Confirm" : "确定" 
        },
        titleStr:function(){
            return this.$route.query.language ? "Retrieve password" : this.$t('LeftNav.MyPassword') 
        }
    },
    mounted(){
        // console.log(this.tabLanguage)
        window.document.body.style.backgroundColor = '#fff';
    },
    destroyed(){
        window.document.body.style.backgroundColor = '#e6e6e6';
    },
    methods: {
        routerBack: function(){
            this.$router.go(-1);
        },
        submitForm: function(){
            //提交
            let _this = this;
            let checkFlag = true;
            let account = $.trim($("input[name = account]").val());//账号
            let vercode = $.trim($("input[name = vercode]").val());//验证码
            let password = $.trim($("input[name = password]").val());//密码

            //账号
            if(account.length == 0){
                _this.accountFlag = true;
                checkFlag = false;
            } else {
                //检证账号是否是邮箱或手机
                if(regEmail.test(account) || regPhoneNumber.test(account)){
                    _this.accountFlag = false;
                } else {
                    _this.accountFlag = true;
                    checkFlag = false;
                }
            }

            //验证码
            if(vercode.length != 6 || !regNumber.test(vercode)){
                _this.vercodeFlag = true;
                checkFlag = false;
            } else {
                _this.vercodeFlag = false;
            }

            //密码
            if(password.length > 0){
                
                if(regPassword.test(password)) {
                    _this.passwordTxt = '';
                    _this.passwordFlag = false;
                } else {
                    _this.passwordTxt = _this.$t("RegLogin.Errorpassword")//'密码格式不正确';
                    _this.passwordFlag = true;
                    checkFlag = false;
                }

            } else {
                _this.passwordTxt = _this.$t("RegLogin.PNPassword")//'请输入新密码';
                _this.passwordFlag = true;
                checkFlag = false;
            }

            //格式全部正确
            if(checkFlag) {
                
                _this.$layer.loading(_this.$t('layerTips.Proceeding'));//正在提交，请稍候！

                commonAjaxFun({
                    url: '/frontUser/forgetPassword',
                    data: {
                        account: account,
                        verifyCode: vercode,
                        password: password
                    }
                }, 400).then((data) => {

                    _this.$layer.close();

                    try {
                        if(data.state == '0'){
                            //密码重新设置成功
                            _this.$layer.toast({content: _this.$t('layerTips.againpassword')});//密码重新设置成功
                            _this.$router.push({path : '/home/index', query: {projectId: _this.projectId, passKey: _this.passKey}});//主页
                        } else if(data.state == '102') {
                            //手机号或邮箱已被注册
                            _this.$layer.toast({content: _this.$t('layerTips.alreadyReg')});//手机号或邮箱未注册
                        } else if(data.state == "1003"){
                            //请填写正确验证码
                            _this.$layer.toast({content: _this.$t('layerTips.FillCorrectCode')});//请填写正确验证码
                        } else {
                            _this.$layer.toast({content: data.message});
                        }

                    } catch(err){
                        console.log(err)
                    }

                }, (err) => {
                    _this.$layer.close();
                    console.log(err)
                })
            }

        },
        getVerificationCode: function(){
            //获取验证码
            let account = $.trim($("input[name = account]").val());
            let _this = this;

            if(account.length == 0){
                _this.accountFlag = true;
                return;
            } else {
                //检证账号是否是邮箱或手机
                if( regEmail.test(account) ){

                    if(_this.dbclickFlag){//防止重复点击
                        return;
                    }
                    _this.dbclickFlag = true;

                    _this.$layer.loading()

                    commonAjaxFun({
                        url: '/frontUser/checkAccount',
                        data: {
                            account :account
                        }
                    }).then((data) => {
                        try {
                            if(data.state == '0'){
                                if(data.data){
                                    //账号存在
                                    _this.dbclickFlag = false;
                                    return data.data
                                } else {// 112112@163.com, 18710282311
                                    //账号不存在
                                    _this.$layer.close();
                                    _this.$layer.toast({content: _this.$t('layerTips.HasAccount')});//账号不存在
                                    _this.dbclickFlag = false;
                                    return false;
                                }
                            } else {
                                _this.dbclickFlag = false;
                                _this.$layer.close();
                                _this.$layer.toast({content: data.message});
                                return false;
                            }
                        } catch(err){
                            console.log(err)
                        }
                    }).then((data) => {

                        if(data){
                            commonAjaxFun({
                                url: '/frontUser/sendEmailVerifyCode',
                                data: {
                                    email: account
                                }
                            }).then((data) => {
                                try {
                                    _this.$layer.close();

                                    if(data.state == '0'){
                                        _this.countDownFn();//开始倒计时
                                    } else {
                                        _this.dbclickFlag = false;
                                        _this.$layer.toast({content: data.message});
                                    }

                                } catch(err){
                                    console.log(err)
                                }
                            })
                        }

                    })

                } else {
                    _this.accountFlag = true;
                }
            }

        },
        countDownFn: function(){
            //倒计时
            let _this = this;

            if(_this.countDownNum == 0){
                _this.codeText ="AskForCode";//获取验证码
                _this.codeFlag = false;
                _this.countDownNum =  120;
                _this.dbclickFlag = false;
                return false;
            } else {
                _this.codeText = _this.countDownNum + 's';
                _this.codeFlag = true;
                _this.countDownNum--;
            }

            setTimeout(() => {
                _this.countDownFn();
            }, 1000)
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">


</style>
