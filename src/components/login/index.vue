<template>
    <div>
        <div class="head-back">
            <div class="head-back-icon" @click="routerBack"><i class="icon-leftarrow"></i></div>
            <h2 class="headerTitle" title="登录" v-text="$t('RegLogin.Login')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat">
            <div class="sticky-area">
                <div class="fav-tab">
                    <ul>
                        <li :class="[tabLanguage == 'ch' ? 'active' : '']" @click="changeLanguage('ch')"><span title="中国大陆">中国大陆</span></li>
                        <li :class="[tabLanguage == 'en' ? 'active' : '']" @click="changeLanguage('en')"><span title="International">International</span></li>
                    </ul>
                </div>
            </div>
            <!--中文版本-->
            <div class="create-form" v-show="tabLanguage == 'ch'">
                <div class="field-main">
                    <h4 class="field-title"><span title="账号">手机</span><em class="red-star">*</em></h4>
                    <div class="field-box">
                        <div class="field-input"><input class="text-input" name="phone" title="仅支持中国大陆11位手机号" maxlength="11" placeholder="仅支持中国大陆11位手机号" type="text"></div>
                        <div class="field-handle"><i class="icon-clear"></i></div>
                    </div>
                    <p class="field-error"><span v-show="accountFlag" title="请输入正确手机号">请输入正确手机号</span></p>
                </div>

                <div class="field-main">
                    <h4 class="field-title"><span title="验证码">验证码</span><em class="red-star">*</em></h4>
                    <div class="field-justify">
                        <div class="field-box">
                            <div class="field-input"><input class="text-input" name="vercode" placeholder="" type="text" maxlength="6"></div>
                            <div class="field-handle"><i class="icon-clear"></i></div>
                        </div>
                        <!-- <div class="field-code-btn" @click='getVerificationCode' v-text='codeText'></div> -->
                        <div class="field-code-btn" :class="[codeFlag ? 'field-code-grey' : '']" v-text="codeText" @click="getVerificationCode"></div>
                    </div>
                    <p class="field-error"><span title="请填写正确验证码" v-show="vercodeFlag">请填写正确验证码</span></p>
                </div>
                <div class="ready-submit" @click="submitForm" title="确定">确定</div>
                <div class="login-toregister" v-if="Infro.isSignup == 1 && !Infro.regState">
                    <p title="没有账号"><span>没有账号?</span><i></i></p>
                    <router-link title="立即注册" :to="{path:'/login/register', query:{projectId: projectId, passKey: passKey,language:'ch'}}" v-text="isAdvance ? '预报名' : '注册'"></router-link>
                </div>
            </div>
            <!--英文版本-->
            <div class="create-form" v-show="tabLanguage == 'en'">
                <div class="field-main">
                    <h4 class="field-title"><span title="账号">E-mail</span><em class="red-star">*</em></h4>
                    <div class="field-box">
                        <div class="field-input"><input class="text-input" name="email" title="仅支持中国大陆11位手机号" maxlength="50" placeholder="E-mail" type="text"></div>
                        <div class="field-handle"><i class="icon-clear"></i></div>
                    </div>
                    <p class="field-error"><span v-show="accountFlag" title="请填写正确的邮箱">Incorrect E-mail address</span></p>
                </div>
                <div class="field-main">
                    <h4 class="field-title"><span title="密码">Password</span><em class="red-star">*</em></h4>
                    <div class="field-box">
                        <div class="field-input"><input class="text-input" name="password" title="6-16个字母或数字，区分大小写，不允许有空格" maxlength="16" placeholder="6-16 characters or numbers" type="password"></div>
                        <div class="field-handle"><i class="icon-clear"></i></div>
                    </div>
                    <p class="field-error"><span v-show="passwordFlag" title="请输入密码">Please enter your password</span></p>
                </div>
                <div class="field-main field-forget">
                    <router-link :to="{path:'/login/forget', query:{projectId: projectId, passKey: passKey,language:'en'}}" title="忘记密码">Forgot Password ?</router-link>
                </div>
                <div class="ready-submit" @click="submitForm" title="确定">Confirm</div>
                <div class="login-toregister" v-if="Infro.isSignup == 1 && !Infro.regState">
                    <p title="没有账号"><span>Don't have an account ?</span><i></i></p>
                    <router-link title="立即注册" :to="{path:'/login/register', query:{projectId: projectId, passKey: passKey,language:'en'}}" v-text="isAdvance ? 'Pre-registration' : 'Register'"></router-link>
                </div>
            </div>
           
        </div>
    </div>
</template>

<script>
import {regEmail, regPhoneNumber, regNumber, regPassword, commonAjaxFun,commonGetAjaxFun} from '../../common/js/common.js'
import VueCookie from 'vue-cookie';
export default {
    data() {
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`, //登陆之后返回的url，用于本地存储
            passwordTxt: this.$t("RegLogin.Enterpassword"), //密码正误的提示语
            accountFlag: false, //账号提示
            passwordFlag: false, //密码提示
            vercodeFlag:false,
             codeFlag: false,//已点击获取验证码按钮时的状态
            Infro: '', //会议基本信息
            phoneList: [],
            isAdvance: false, //用于判断是否预报名，默认false注册
            tabLanguage:  this.$route.query.language || "ch", //tab切换
            codeText: '获取验证码',//获取验证码
            dbclickFlag: false,//获取验证码，防止多次点击
            countDownNum: 120,//倒计时120s
        }
    },
    mounted() {
        console.log(this.tabLanguage)
        this.initInputEvent();
        this.getChildrenProject()
        this.getIsYuBaoMing()
        window.document.body.style.backgroundColor = '#fff';
    },
    destroyed(){
        window.document.body.style.backgroundColor = '#e6e6e6';
    },
    computed: {
        localBackUrl: function(){
            let _link = localStorage.getItem(this.returnUrl);//本地存储的backurl

            if(!!_link) {
                return _link
            } else {
                return false
            }
        }
    },
    methods: {
        routerBack: function() {
            this.$router.go(-1);
        },
        changeLanguage: function(lan) {
            //tab切换中英文
            this.tabLanguage = lan;
        },
        getIsYuBaoMing: function() {
            //判断当前是否预报名，从而改变title,和-完善信息让您能更好的使用系统功能、
            let _this = this;
            commonAjaxFun({
                url: '/userForm/getIsYuBaoMing',
                data: {}
            }).then((data) => {
                try {
                    if (data.state == "0") {
                        if (data.data.isAdvance) {
                            _this.isAdvance = true;
                        } else {
                            _this.isAdvance = false;
                        }

                    } else {
                        console.log(data.message)
                    }

                } catch (err) {
                    console.log(err)
                }
            })
        },
        initInputEvent: function() {
            //初始化输入框事件
            let _this = this;

            $('input.text-input').bind('focus', function(e) {
                let _inthis = this;
                $(_inthis).parent().next().find('i').show()
            }).bind('focusout', function(e) {
                let _inthis = this;
                $(_inthis).parent().next().find('i').hide()
            })


            $('.field-handle').delegate('i', 'touchend', function() {
                let _inthis = this;
                $(_inthis).hide().parent().prev().find('input').val('')
            })
        },
        getVerificationCode: function() {
            let phone = $.trim($("input[name = phone]").val());
            let _this = this;

            //如果当前为中国号码,正则为11位号码
            if (!regPhoneNumber.test(phone)) {
                _this.accountFlag = true;
                return;
            } else {
                _this.accountFlag = false;
            }

            if (_this.dbclickFlag) { //防止重复点击
                return;
            }
            _this.dbclickFlag = true;

            var captcha1 = new TencentCaptcha('2050675704', function(res) {
                if (res.ret === 0) {
                    commonGetAjaxFun({
                        url: '/frontUser/sendVerificationCode',
                        data: {
                            phone: phone,
                            projectId: _this.projectId,
                            passKey: _this.passKey,
                            ticket: res.ticket,
                            randstr: res.randstr,
                            userIP: returnCitySN["cip"]
                        }
                    }).then((data) => {
                        try {

                            _this.$layer.close();

                            if (data.state == '0') {
                                _this.countDownFn(); //开始倒计时
                            } else {
                                _this.dbclickFlag = false;
                                _this.$layer.toast({
                                    content: data.message
                                });
                            }
                        } catch (err) {
                            console.log(err)
                        }
                    })
                }

            });
            captcha1.show(); // 显示验证码 
        },
        countDownFn: function() {
            //倒计时
            let _this = this;

            if (_this.countDownNum == 0) {
                _this.codeText = '获取验证码'; //获取验证码
                _this.codeFlag = false;
                _this.countDownNum = 120;
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
        },
        submitForm: function() {
            //提交表单
            let checkFlag = true;
            let _this = this;
            let phone = $.trim($("input[name = phone]").val());
            let vercode = $.trim($("input[name = vercode]").val()); //验证码
            let email = $.trim($("input[name = email]").val());
            let password = $.trim($("input[name = password]").val());

            let formdata = {};

            if (this.tabLanguage == "ch") {
                //如果当前为中国号码,正则为11位号码
                if (!regPhoneNumber.test(phone)) {
                    _this.accountFlag = true;
                    checkFlag = false;
                } else {
                    _this.accountFlag = false;
                }
                //验证码
                if (vercode.length != 6 || !regNumber.test(vercode)) {
                    _this.vercodeFlag = true;
                    checkFlag = false;
                } else {
                    _this.vercodeFlag = false;
                }

                formdata.account = phone;
                formdata.password = "";
                formdata.verifyCode = vercode;
            } else {
                //邮箱
                if (!regEmail.test(email)) {
                    _this.accountFlag = true;
                    checkFlag = false;
                } else {
                    _this.accountFlag = false;
                }

                //检测密码
                if (password.length > 0) {
                    //检证密码是否格式正确
                    if (regPassword.test(password)) {
                        _this.passwordTxt = ''
                    } else {
                        _this.passwordTxt = _this.$t("RegLogin.Errorpassword"); //密码格式不正确
                        checkFlag = false;
                        _this.passwordFlag = true;
                    }
                } else {
                    _this.passwordTxt = _this.$t("RegLogin.Enterpassword"); //请输入新密码
                    checkFlag = false;
                    _this.passwordFlag = true;
                }
                formdata.verifyCode = "";
                formdata.account = email;
                formdata.password = password;
            }





            var weixin_Flag = VueCookie.get('EXPO_OAUTH_DATA');

            if (weixin_Flag) {
                let _oauth_data = decodeURIComponent(weixin_Flag);
                _oauth_data = JSON.parse(_oauth_data);

                formdata.openId = _oauth_data.userInfo.openid;
                formdata.wxNickname = _oauth_data.userInfo.nickname;
                formdata.wxSex = _oauth_data.userInfo.sex;
                formdata.wxHeadimgurl = _oauth_data.userInfo.headimgurl ? _oauth_data.userInfo.headimgurl.replace(/http/, "https") : ""; ;
                formdata.wxProvince = _oauth_data.userInfo.province;
                formdata.wxCountry = _oauth_data.userInfo.country;
                formdata.wxCity = _oauth_data.userInfo.city;
            }

            // var weixin_Flag = localStorage.getItem("HDPEXPOWEIXIN2018" + _this.projectId);
            // console.log(localStorage.getItem("HDPWEIXINOPENID" + _this.projectId))
            // if (weixin_Flag) {
            //     formdata.openId = localStorage.getItem("HDPWEIXINOPENID" + _this.projectId)
            //     formdata.wxNickname = localStorage.getItem("HDPWEIXINWXNAME" + _this.projectId)
            //     formdata.wxSex = "" + localStorage.getItem("HDPWEIXINWXSEX" + _this.projectId)
            //     formdata.wxHeadimgurl = localStorage.getItem("HDPWEIXINWXHEADIMGURL" + _this.projectId)
            //     formdata.wxProvince = localStorage.getItem("HDPWEIXINWXPROVINCE" + _this.projectId)
            //     formdata.wxCountry = localStorage.getItem("HDPWEIXINWXCOUNTRY" + _this.projectId)
            // }

            // formdata.wechatInfo = JSON.stringify(formdata.wechatInfo)
            //无误
            if (checkFlag) {
                _this.$layer.loading(_this.$t("RegLogin.LoginWait")); //正在登录，请稍候！

                //登录
                commonAjaxFun({
                    url: '/frontUser/login',
                    data: formdata
                }, 1000).then((data) => {
                    try {

                        _this.$layer.close();

                        let _data = data.data;

                        if (data.state == '0') {

                            _this.$cookie.set('EVENTUSERTK', _data, {
                                expires: 7
                            });

                            setTimeout(() => {

                                //判断是否返回到登陆前url
                                if (!_this.localBackUrl) {
                                    _this.$router.replace({
                                        path: '/home/index',
                                        query: {
                                            projectId: _this.projectId,
                                            passKey: _this.passKey
                                        }
                                    }); //主页
                                } else {
                                    _this.$router.push({
                                        path: _this.localBackUrl
                                    }); //主页
                                }

                            }, 1000)


                        } else {
                            _this.$layer.toast({
                                content: data.message
                            })
                        }
                    } catch (err) {
                        console.log(err)
                    }
                })

            }
        },
        getChildrenProject: function() {
            //停用vuex，改用公用ajax请求
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getChildrenProject',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey
                }
            }).then((data) => {
                try {
                    let _data = data.data;
                    //console.log(_data)
                    if (data.state == '0') {
                        _this.Infro = _data;
                    } else {
                        console.log(data.message);
                    }

                } catch (e) {
                    console.log(e)
                }

            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.login-toregister

    margin-top: 8px
    text-align: center
    p
        font-size: 12px
        color: #999
        padding-bottom:10px
        i
            height:1px
            background: #CCCCCC
            margin-top:-10px
            display:block
        span
            background:#FFFFFF
            padding:0 10px
    a
        font-size: 20px
        color: #F35B00
        display: block
        line-height: 40px
        text-decoration: underline
.fav-tab
    border-bottom: 1px solid rgba(0,0,0,0.05)
    ul
        display: flex
        width: 100%
        li
            text-align: center
            flex: 1
            width: 50%
            a
                display: block
            span
                display: inline-block
                height: 46px
                line-height: 46px
                border-bottom: 1px solid transparent
            &.active
                span
                    border-bottom: 1px solid #f35b00
</style>
