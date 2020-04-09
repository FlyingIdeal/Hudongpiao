<template>
    <div>
        <div class="head-back">
            <div class="head-back-icon" @click="routerBack"><i class="icon-leftarrow"></i></div>
            <h2 class="headerTitle" title="注册" v-text="$t('RegLogin.RegisterBtn')"></h2>
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
            <div class="create-form" v-if="tabLanguage == 'ch'">
                <div class="field-main">
                    <h4 class="field-title"><span title="手机">手机</span><em class="red-star">*</em></h4>
                    <div class="field-box">
                        <div class="field-input"><input class="text-input" name="phone" title="仅支持中国大陆11位手机号" maxlength="11" placeholder="仅支持中国大陆11位手机号" type="text"></div>
                        <div class="field-handle"><i class="icon-clear"></i></div>
                    </div>
                    <p class="field-error"><span v-show="accountFlag" title="请输入正确手机号">请输入正确手机号</span></p>
                </div>
                <div class="field-main" v-show="chinaPhoneNumber">
                    <h4 class="field-title"><span title="验证码">验证码</span><em class="red-star">*</em></h4>
                    <div class="field-justify">
                        <div class="field-box">
                            <div class="field-input"><input class="text-input" name="vercode" placeholder="" type="text" maxlength="6"></div>
                            <div class="field-handle"><i class="icon-clear"></i></div>
                        </div>
                        <div class="field-code-btn" :class="[codeFlag ? 'field-code-grey' : '']" v-text="codeText" @click="getVerificationCode"></div>
                    </div>
                    <p class="field-error"><span v-show="vercodeFlag" title="请填写正确验证码">请填写正确验证码</span></p>
                </div>
            </div>
            <!--国际版本-->
            <div class="create-form" v-if="tabLanguage == 'en'">
                <div class="field-main">
                    <h4 class="field-title"><span title="账号">Account</span><em class="red-star">*</em></h4>
                    <div class="field-justify">
                        <div class="field-box field-box-col8">
                            <div class="field-input"><input class="text-input" name="account" placeholder="Please enter your email" type="text" maxlength="30"></div>
                            <div class="field-handle"><i class="icon-clear"></i></div>
                        </div>
                    </div>
                    <p class="field-error"><span v-show="accountFlag" title="请输入正确的电话号码">Incorrect E-mail address</span></p>
                </div>
                <!--密码-->
                <div class="field-main">
                    <h4 class="field-title"><span title="密码">Password</span><em class="red-star">*</em></h4>
                    <div class="field-box">
                        <div class="field-input"><input class="text-input" title="6-16个字母或数字，区分大小写，不允许有空格" name="password" placeholder="6-16 characters or numbers" type="password" maxlength="16"></div>
                        <div class="field-handle"><i class="icon-clear"></i></div>
                    </div>
                    <p class="field-error"><span v-show="passwordFlag" v-text="">Please enter your password</span></p>
                </div>
            </div>



            <div class="create-form">
                <v-label ref="labeldom" v-on:allSubmit="_allSubmit" :typeChOrCh = 'tabLanguage'></v-label>
            </div>

            <!--服务协议-->
            <div class="fw">
                <div class="field-service"><a href="https://www.expoplus.com.cn/other/expo.html" title="《参展通服务协议》" target="_blank">{{registeredAgreementLinkText}} <span>{{registeredAgreementLinkTextName}}</span></a></div>

            </div>

            <div class="create-form">
                <div class="ready-submit" @click="submitForm($event)" canclick="true" title="确定">{{RegisterBtn}}</div>
            </div>

            <div class="login-toregister">
               <p title="已有账号"><span>{{Yesaccount}}</span><i></i></p>
                <router-link title="登录" :to="{path:'/login/index', query:{projectId: projectId, passKey: passKey,language:tabLanguage}}">{{Login}}</router-link>
            </div>

        </div>
    </div>
</template>

<script>

import {regEmail, regPhoneNumber, regNumber, regPassword, commonAjaxFun, commonGetAjaxFun} from '../../common/js/common.js'
import VueCookie from 'vue-cookie';
import vLabel from '../module/label/label.vue'//个人标签
export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            oauthData: `${this.$route.query.oauth_data}`,//来自微信授权
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            areacode: "phone",//地区
            accountFlag: false,//账号提示
            vercodeFlag: false,//验证码提示
            passwordFlag: false,//密码提示
            // nameFlag: false,//姓名提示
            // companyFlag: false,//公司提示
            // emailFlag: false,//邮箱提示
            serviceFlag: false,//协议提示
            // hasChooseService: true,//默认勾选协议
            passwordTxt: this.$t("RegLogin.Enterpassword"),//请输入密码,密码正误的提示语
            codeText: '获取验证码',//获取验证码
            codeFlag: false,//已点击获取验证码按钮时的状态
            accountTxt: this.$t("RegLogin.inputEmail"), //中国大陆11位手机号码,手机号placehodler
            chinaPhoneNumber: true,//如果是中国号码，则显示获取验证码

            dbclickFlag: false,//获取验证码，防止多次点击
            countDownNum: 120,//倒计时120s
            phoneList: [],
            labelResult:"",
            tabLanguage: `${this.$route.query.language}`,//tab切换

        }
    },
    components: {
        vLabel
    },
    mounted(){
        window.document.body.style.backgroundColor = '#fff';
    },
    destroyed(){
        window.document.body.style.backgroundColor = '#e6e6e6';
    },
    computed: {
        localBackUrl: function() {
            let _link = localStorage.getItem(this.returnUrl); //本地存储的backurl
            if (!!_link) {
                return _link
            } else {
                return false
            }
        },
        registeredAgreementLinkText: function() {
            return this.tabLanguage == 'ch' ? '点击「注册」按钮，即代表你同意' : 'Click on the register button,agreed on your behalf'
        },
        registeredAgreementLinkTextName: function() {
            return this.tabLanguage == 'ch' ? '《参展通服务协议》' : '《Expo+ service agreement》'
        },
        RegisterBtn: function() {
            return this.tabLanguage == 'ch' ? '注册' : 'RegisterBtn'
        },
        Yesaccount: function() {
            return this.tabLanguage == 'ch' ? '已有账号?' : 'Existing account ?'
        },
        Login: function() {
            return this.tabLanguage == 'ch' ? '登录' : 'Login'
        }
    },
    methods: {
        _allSubmit: function(val){
            //从vlabel拿到所有的值
            this.labelResult = JSON.stringify(val);
        },
        routerBack: function(){
            this.$router.go(-1);
        },
        changeLanguage: function(lan) {
            //tab切换中英文
            // this.$router.push({path:'/login/register', query:{projectId: this.projectId, passKey: this.passKey,language:'ch'});//'请先登录！'
            this.tabLanguage = lan;
            this.accountFlag = false;
            this.vercodeFlag = false;
            this.labelResult = ""

        },
        getVerificationCode: function() {
            //获取验证码
            let account = $.trim($("input[name = phone]").val());
            let _this = this;

            //如果当前为中国号码,正则为11位号码
            if (!regPhoneNumber.test(account)) {
                _this.accountFlag = true;
                return;
            } else {
                _this.accountFlag = false;
            }


            if (_this.dbclickFlag) { //防止重复点击
                return;
            }
            _this.dbclickFlag = true;

            _this.$layer.loading();

            // //当前账号是否存在
            commonAjaxFun({
                url: '/frontUser/checkAccount',
                data: {
                    account: account,
                    projectId: _this.projectId,
                    passKey: _this.passKey
                }
            }).then((data) => {
                try {
                    if (data.state == '0') {
                        if (data.data) {
                            //账号存在
                            _this.$layer.close();
                            _this.$layer.toast({
                                content: _this.$t("RegLogin.AccountHas")
                            }); //账号已存在
                            _this.dbclickFlag = false;
                            return false;
                        } else { // 112112@163.com, 18710282311
                            //账号不存在
                            _this.$layer.close();
                            var captcha1 = new TencentCaptcha('2050675704', function(res) {

                                if (res.ret === 0) {
                                    commonGetAjaxFun({
                                        url: '/frontUser/sendVerificationCode',
                                        data: {
                                            phone: account,
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
                            return true;
                        }
                    } else {
                        _this.$layer.close();
                        _this.$layer.toast({
                            content: data.message
                        });
                        return false;
                    }
                } catch (err) {
                    console.log(err)
                }
            }).then((data) => {
                /*发送验证码
                if(data){

                    commonGetAjaxFun({
                        url: '/frontUser/sendVerificationCode',
                        data: {
                            phone: account,
                            projectId:_this.projectId,
                            passKey:_this.passKey
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
                }*/

            })

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
        submitForm: function(event) {

            //注册提交
            let _this = this;
            let phone = $.trim($("input[name = phone]").val()); //手机号
            let vercode = $.trim($("input[name = vercode]").val()); //验证码

            let account = $.trim($("input[name = account]").val()); //邮箱
            let password = $.trim($("input[name = password]").val()); //密码
            let checkFlagAccount = ""

            _this.$refs.labeldom.submit(); //调用label中的submit方法
            // let name = $.trim($("input[name = name]").val());//姓名

            // let company = $.trim($("input[name = company]").val());//公司
            let checkFlag = true; //flag判断整体验证是否通过

            let account_key = {} //判断如果选择邮箱或手机

            if (this.tabLanguage == "ch") {
                // 验证手机
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

                checkFlagAccount = phone;
                account_key.phone = phone
            } else {

                //检测邮箱
                if (!regEmail.test(account)) {
                    _this.accountFlag = true;
                    checkFlag = false;
                } else {
                    _this.accountFlag = false;
                }


                //检测密码
                if (!regPassword.test(password) || password.length == 0) {
                    _this.passwordFlag = true;
                    checkFlag = false;
                } else {
                    _this.passwordFlag = false;
                }

                checkFlagAccount = account
                account_key.email = account
            }


            let _regJson = {
                password: password,
                projectid: _this.projectId,
                wechatInfo: {}
            }

            _regJson = Object.assign(_regJson, account_key);


            let weixin_Flag = VueCookie.get('EXPO_OAUTH_DATA');

            if (weixin_Flag) {
                let _oauth_data = decodeURIComponent(weixin_Flag);
                _oauth_data = JSON.parse(_oauth_data);

                _regJson.wechatInfo.openId = _oauth_data.userInfo.openid;
                _regJson.wechatInfo.wxNickname = _oauth_data.userInfo.nickname;
                _regJson.wechatInfo.wxSex = _oauth_data.userInfo.sex;

                _regJson.wechatInfo.wxHeadimgurl = _oauth_data.userInfo.headimgurl ? _oauth_data.userInfo.headimgurl.replace(/http/, "https") : "";
                _regJson.wechatInfo.wxProvince = _oauth_data.userInfo.province;
                _regJson.wechatInfo.wxCountry = _oauth_data.userInfo.country;
                _regJson.wechatInfo.wxCity = _oauth_data.userInfo.city;
            }


            if (!checkFlag || !_this.labelResult) {
                return;
            }

            //防止重复点击
            let _dom = event.currentTarget;
            let _canclick = _dom.getAttribute('canclick');

            if (_canclick == 'false') {
                return;
            }
            _dom.setAttribute('canclick', 'false');

            _this.$layer.loading(_this.$t('layerTips.Proceeding')); //正在提交，请稍候！

            let _regJsonString = JSON.stringify(_regJson);

            let _jsonData = {
                verifyCode: vercode,
                regJson: _regJsonString,
                formVal: _this.labelResult
            }

            //仍然要先验证正好是否存在
            commonAjaxFun({
                url: '/frontUser/checkAccount',
                data: {
                    account: checkFlagAccount,
                    projectId: _this.projectId,
                    passKey: _this.passKey
                }
            }).then((data) => {
                try {
                    if (data.state == '0') {
                        if (data.data) {
                            //账号存在
                            _this.$layer.close();
                            _this.$layer.toast({
                                content: _this.$t("RegLogin.AccountHas")
                            }); //账号已存在
                            _dom.setAttribute('canclick', 'true');
                            return false;
                        } else { // 112112@163.com, 18710282311
                            //账号不存在
                            return true;
                        }
                    } else {
                        _this.$layer.close();
                        _this.$layer.toast({
                            content: data.message
                        });
                        return false;
                    }
                } catch (err) {
                    console.log(err)
                }
            }, (err) => {
                _dom.setAttribute('canclick', 'true');
                return false;
            }).then((data) => {

                if (data) {
                    commonAjaxFun({
                        url: '/frontUser/register',
                        data: _jsonData
                    }).then((data) => {
                        try {

                            _this.$layer.close();

                            if (data.state == '0') {

                                _this.$cookie.set('EVENTUSERTK', data.data, {
                                    expires: 7
                                });

                                _this.$layer.toast({
                                    content: _this.$t("RegLogin.RegisterSuccess")
                                }); //注册成功

                                //判断是否返回到登陆前url
                                if (!_this.localBackUrl) {
                                    _this.$router.replace({ path: '/home/index', query: { projectId: _this.projectId, passKey: _this.passKey } }); //主页
                                } else {
                                    _this.$router.push({
                                        path: _this.localBackUrl
                                    }); //主页
                                }

                            } else if (data.state == "103") {
                                _this.$layer.toast({
                                    content: _this.$t("RegLogin.alreadyReg")
                                }); //手机号或邮箱已被注册
                            } else {
                                _this.$layer.toast({
                                    content: data.message
                                });
                            }

                            _dom.setAttribute('canclick', 'true');

                        } catch (err) {
                            console.log(err)
                        }
                    }, (err) => {
                        _dom.setAttribute('canclick', 'true');
                    })
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.fw
    padding:0 14px
    font-size:12px
    text-indent:10px;
    position:relative
    a
      color: #999999
      span
          text-decoration: underline
          color:#09bb07
          
    &::after
        content:""
        position: absolute
        left: 16px
        top: 8px
        background: #09BB07
        height: 4px
        width: 4px
        border-radius: 50%
        
.chooseBox
    border-top:2px solid #EEEEEE
    padding:15px
.chooseTip
    font-size:12px
    color:#F35B00
    text-indent: 25px;
.login-toregister
    padding:0 14px
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
    background-color: #fff
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
