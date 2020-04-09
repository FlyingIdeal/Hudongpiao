<template>
    <div>
        <div class="head-back">
            <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')" v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
            <h2 class="headerTitle" title="来宾" v-text="$t('Person.AllAttend')"></h2>
            <div class="Occupy"><span @click="editPerson" class="o-idet" v-if="user && user.isMe" title="编辑">{{$t("RegLogin.Edit")}}</span></div>
        </div>
        <div class="topSeat attend-detail" v-if="user" :class="[user.isMe ? '' : 'botSeat', state == 'HE_RTS_ME' ? 'attend-bottom': '']">
            <div class="shadow">
                <div class="attend-top">
                    <div class="attend-infro">
                        <div class="photo"><img @click="wxScaleBigImg(user.headPortrait)" v-if="user.headPortrait" v-lazy="user.headPortrait" /><img v-else src="~@/common/images/default.png" /></div>
                        <div class="text">
                            <h6 title="姓名">{{$t("RegLogin.Name")}}：<span v-text="user.name ? user.name : $t('CommonHTag.Null')"></span></h6>
                            <p v-if="companyInfo.company" title="公司">{{$t("RegLogin.Company")}}：<span v-text="companyInfo.company"></span></p>
                            <p v-if="user.position" title="职位">{{$t("RegLogin.Title")}}：<span v-text="user.position"></span></p>
                        </div>
                    </div>
                    <div class="attend-text" title="简介 / 暂无">{{$t("CommonHTag.Profile")}}：{{user.intro ? user.intro : $t("CommonHTag.Null")}}</div>
                </div>
            </div>
            <div class="attend-link" v-if="user && (user.phone || user.email || user.wxNumber)">
                <div class="shadow">
                    <h4 class="console-txt-line"><span title="联系方式">{{$t("CommonHTag.Contact")}}</span></h4>
                    <div class="help-list">
                        <p v-if="user.phone"><a :href="user.phone | fomartPhone(user)"><i class="icon-mobile"></i><span v-text="user.phone"></span></a></p>
                        <p v-if="user.email"><a :href="user.email | fomartEmail(user)"><i class="icon-email"></i><span v-text="user.email"></span></a></p>
                        <p v-if="user.wxNumber"><a href="javascript:void(0)"><i class="icon-weixin"></i><span v-text="user.wxNumber"></span></a></p>
                        <!--二维码-->
                        <div class="qrcode-area" v-if="user && user.addUserStatus && user.addUserStatus.status == 'together'">
                            <div class="qrcode-img"><img :src="qrcodeImg"></div>
                            <div class="qrcode-text" title="长按识别二维码，可保存联系方式到手机">{{$t("Attendee.HoldQR")}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="attend-link" v-if='companyInfo.industry || companyInfo.roleType || companyInfo.country'>
                <div class="shadow">
                    <h4 class="console-txt-line"><span title="属性">{{$t("label.EnterpriseAttribute")}}</span></h4>
                    <div class="help-list">
                        <p v-if="companyInfo.industry"><a href="javascript:void(0)"><i class="icon-department"></i><span v-text="companyInfo.industry"></span></a></p>
                        <p v-if="companyInfo.roleType"><a href="javascript:void(0)"><i class="icon-role"></i><span v-text="companyInfo.roleType"></span></a></p>
                        <p v-if="user.catesList.length > 0"><a href="javascript:void(0)"><i class="icon-label"></i><span><template v-for="value in user.catesList">{{value.name}}；</template></span></a></p>
                        <p v-if="companyInfo.country"><a href="javascript:void(0)"><i class="icon-place"></i><span>{{companyInfo.country}}-{{companyInfo.province}}-{{companyInfo.city}}</span></a></p>
                    </div>
                </div>
            </div>
            <!--动态-->
            <div class="attend-active" v-show="childLength > 0">
                <h3 class="console-txt-h3"><span title="动态">{{$t("CommonHTag.Activities")}}</span></h3>
                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                  <slot>
                        <attenddetailList :tochildlist='listArry'></attenddetailList>
                  </slot>
                </v-load>
            </div>
            <!--底部交换名片-->
            <div class="comment-like-handle" v-if="state && !user.isMe && state !=='HE_RTS_ME'">
                <a href="javascript:void(0);" v-if="state == 'nothing' || state == 'default'" @click="changeCard"><i class="icon-changetag"></i><span title="递名片" v-text="$t('ExchangeCard.ExBusinessCard')"></span></a>
                <a href="javascript:void(0);" v-else-if="state == 'wait' || state == 'together'"><i class="icon-changetag grey-color"></i><span title="等待对方同意/已是好友" v-text="state == 'wait' ? $t('ExchangeCard.WaitResponse') : $t('ExchangeCard.Exchanged')"></span></a>

                <a href="javascript:void(0);" title="开始对话" @click="beginChat"><i class="icon-topic2"></i><span>{{$t("ExchangeCard.StartChat")}}</span></a>
            </div>
            <!--某某希望和你交换名片-->
            <div class="hope-like-handle" v-if="user && state == 'HE_RTS_ME'">
                <div class="hope-change-people">
                    <p class="hope-name" v-text="user.name"></p>
                    <p class="hope-text" title="希望与您交换联系方式">{{$t("ExchangeCard.RequestExchange")}}</p>
                </div>
                <div class="hope-like-area">
                    <a href="javascript:void(0);" @click="refuse" class="refuse"><span title="拒绝">{{$t("ExchangeCard.Decline")}}</span></a>
                    <a href="javascript:void(0);" @click="agree" class="agree"><span title="同意">{{$t("ExchangeCard.Agree")}}</span></a>
                </div>
            </div>
        </div>

        <smallFrom ref= 'smallFrom' v-show='smallFromFlag' :setSmallFromFlag = "setSmallFromFlag" ></smallFrom>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';//操作表，从屏幕下方移入。
import {mainUserTk, commonAjaxFun, initAllWeiXin, api_url, uwin_url, wxScaleBigImg } from '../../common/js/common.js'
import vLoad from '../module/loadmore/dropload.vue'
import smallFrom from '../module/smallFrom/index.vue'
import attenddetailList  from './detaillist.vue'//引入来宾动态
export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            userid: `${this.$route.query.userid}`,
            wxShare: `${this.$route.query.wxShare}`,//是否来自微信分享，如果是true，则返回首页，否则返回上一级
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            listArry:[],
            user: '',//个人信息
            companyInfo: '',//企业属性
            state: '',//请求状态,nothing 没关系 together 同意  RTS 发送请求
            msgId: '',
            qrcodeImg: '',//来宾二维码
            childLength: 0,//判断当前动态总数，从而隐藏动态
            page: 0,
            smallFromFlag:false,  // 判断表单显示隐藏
        }
    },
    components: {
        vLoad,
        attenddetailList,
        smallFrom
    },
    mounted(){
        this.getUserInfro()
    },
    filters: {
        fomartPhone: function(val, user){
            if(user.addUserStatus && user.addUserStatus.status == 'together') {
                return `tel:${val}`;
            } else {
                return 'javascript:void(0);'
            }
        },
        fomartEmail: function(val, user){
            if(user.addUserStatus && user.addUserStatus.status == 'together') {
                return `mailto:${val}`;
            } else {
                return 'javascript:void(0);'
            }
        }
    },
    methods: {
        wxScaleBigImg: function(value){
            //微信端图片放大预览
            wxScaleBigImg(value)
        },
        _getList: function(num, me) {
            //下拉，加载 请求数据
            let _this = this;

            commonAjaxFun({
                url: '/userApi/HisContent',
                data: {
                    projectId: _this.projectId,
                    page: num,
                    userTk: mainUserTk,
                    userId: _this.userid
                }
            }).then((data) => {

                if (data.state == "0") {
                    let _data = data.data;

                    _this.listArry = _this.listArry.concat(data.data.rows);

                    _this.childLength = _this.listArry.length;

                    if (_data.rows.length == 0) {
                        me.lock();
                        me.noData();
                        me.resetload();
                    } else {
                        _this.$nextTick(function() {
                            me.resetload();
                        })
                    }
                } else {
                    _this.$layer.toast({ content: data.message });
                }
            })
        },
        loadDownFn: function(me) {
            this.page = this.page + 1;
            this._getList(this.page, me);
            me.lock("up")
        },
        loadUpFn: function(me) {
            
        },
        routerBack: function(){
            if(this.wxShare == 'true'){
                this.$router.push({path : '/home/index', query: {projectId: this.projectId, passKey: this.passKey}});//主页
            } else {
                this.$router.go(-1);
            }
        },
        editPerson: function(){
            //去编辑个人页面
            this.$router.push({path : '/attendguest/edit', query: {projectId: this.projectId, passKey: this.passKey, userid: this.userid}});

        },
        showUploadMess: function(){
            //显示完善个人信息提示窗
            let _this = this;

            MessageBox({
                title: _this.$t('UpdataProfile.Title'),//请完善个人信息
                message: '<div class="upinfro-tips">' + _this.$t("UpdataProfile.TipsWord") + '<span>' + _this.$t("UpdataProfile.TipsWordKey") + '<span></div>',//交换名片前，请先提供您的+*姓名*手机号*电子邮箱地址
                showCancelButton: true,
                confirmButtonText: _this.$t('UpdataProfile.Updata'),//去完善
                confirmButtonClass: 'upinfro-trueBtn'
            }).then(action => {
                //跳转到完善个人页面，此处链接不对，注意后期修改
                if(action == 'confirm'){
                    _this.$router.push({path : '/attendguest/friend', query: {projectId: this.projectId, passKey: this.passKey}});
                }
            });
        },
        changeState: function(state){
            //更改发送名片请求状态
            let _this = this;
            let _msgId = '';

            if(state == 'together' || state == 'wait') {
                _msgId = '';
            } else {
                _msgId = _this.msgId;
            }

            _this.$layer.loading();

            commonAjaxFun({
                url: '/userApi/adduser',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    userId: _this.userid,
                    msgId: _msgId
                }
            }, 200).then((data) => {
                _this.$layer.close();

                let _data = data.data;

                if(data.state == '0'){
                    _this.state = state;
                    _this.getUserInfro();

                    _this.$router.push({path : '/chat/index', query: {userid: _this.userid, projectId: _this.projectId, passKey: _this.passKey}});

                } else {
                    _this.$layer.toast({content: data.message});
                }
            })

        },
        setSmallFromFlag:function(flag){
            this.smallFromFlag = flag
        },
        changeCard: function(){
            //交换名片
            let _this = this;

            _this.$layer.loading()

            commonAjaxFun({
                url: '/userApi/userInfo',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    userId: ''
                }
            }, 200).then((data) => {
                _this.$layer.close();

                let _data = data.data;
                if(data.state == '10001'){
                    //首先判断是否登录
                    localStorage.setItem(_this.returnUrl, _this.toFullPath);//本地存储backurl

                    _this.$router.push({path : '/login/index', query: {projectId: _this.projectId, passKey: _this.passKey}});//'请先登录！'

                } else {
                    //console.log(data)
                    if(_data.name == '' || _data.companyInfo.company == '' || _data.companyInfo.roleType == ''){
                        // _this.showUploadMess();//个人信息不完整
                        _this.setSmallFromFlag(true)
                        _this.$refs.smallFrom.setFormValue({name: _data.name,company: _data.companyInfo.company,Role:_data.companyInfo.roleType})

                    } else {
                        _this.changeState('wait');//刷新交换名片状态
                    }

                    /*if(_data.name == '' || _data.email == '' || _data.phone == ''){
                        _this.showUploadMess();//个人信息不完整
                    } else {
                        _this.changeState('wait');//刷新交换名片状态
                    }*/
                }
            })
        },
        refuse: function(){
            //拒绝
            this.changeState('nothing');
        },
        agree: function(){
            //同意
            this.changeState("together");
        },
        beginChat: function(){
            //开始对话
            let _this = this;

            _this.$layer.loading()

            commonAjaxFun({
                url: '/userApi/userInfo',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    userId: ''
                }
            }, 200).then((data) => {
                _this.$layer.close();

                let _data = data.data;

                if(data.state == '10001'){
                    //首先判断是否登录
                    localStorage.setItem(_this.returnUrl, _this.toFullPath);//本地存储backurl
                    
                    _this.$router.push({path : '/login/index', query: {projectId: _this.projectId, passKey: _this.passKey}});//请先登录！


                } else {
                    _this.$router.push({path : '/chat/index', query: {userid: _this.userid, projectId: _this.projectId, passKey: _this.passKey}});
                }
            })
        },
        getUserInfro: function(){
            //获取个人信息

            let _this = this;
            commonAjaxFun({
                url: '/userApi/userInfo',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    userId: _this.userid
                }
            }).then((data) => {
                let _data = data.data;
                if(data.state == '0'){

                    //console.log(_data)

                    _this.user = _data;
                    _this.companyInfo = _data.companyInfo;

                    if(_data.addUserStatus) {
                        if(_data.addUserStatus.status == 'together'){
                            _this.qrcodeImg = "https://console.expoplus.com.cn/basis/createQrcode?htmlUrl=MECARD:TEL:" + _data.phone + ";URL:;EMAIL:" + _data.email + ";NOTE:;N:" + _data.name + ";ORG:" + _data.company
                        }
                    }


                    //次判断用于来宾详情页面单独微信分享
                    if(_this.needSingleWx) {
                        let desc = _this.$t('RegLogin.Company') + ':' + (_data.companyInfo.company || _this.$t('CommonHTag.Null')) + ',' + _this.$t('RegLogin.Title') + ':' + (_data.position || _this.$t('CommonHTag.Null'));
                        let img = !!_data.headPortrait ? _data.headPortrait : (uwin_url + require('@/common/images/default.png'));
                        let link = _this.toFullPath;
                        initAllWeiXin(_this.projectId, _this.passKey, 'attendDetail', {}, {
                            desc: desc,
                            img: img,
                            link: link
                        })
                    }

                    if(_data.addUserStatus && _data.addUserStatus.status) {
                        _this.state = _data.addUserStatus.status;
                        _this.msgId = _data.addUserStatus.msgId;
                    } else {
                        _this.state = 'default';
                    }

                } else {
                    _this.$layer.toast({content: data.message})
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

@import "../../common/stylus/function.styl"
.attend-bottom
    padding-bottom: 80px
.attend-link
    margin: 0 10px
    .shadow
        overflow: hidden
        border-radius: 4px
    .help-list
        a
            line-height: 46px
            display: flex
            i
                flex: 0 0 46px
                width: 46px
                line-height: 46px
    .qrcode-area
        border-top: 1px solid rgba(0, 0, 0, 0.1)
        .qrcode-img
            width: 70px
            height: 70px
            vertical-align: top
            border: 1px solid rgba(0, 0, 0, 0.05)
            margin: 15px auto
            img
                max-width: 100%
        .qrcode-text
            font-size: 12px
            color: #999
            text-align: center
.attend-active
    h3.console-txt-h3
        font-size: 13px
        background-color: #fafafa
        border-bottom: 1px solid rgba(0, 0, 0, 0.1)
.comment-like-handle
    position: fixed
    width: 100%
    left: 0px
    bottom: 0px
    background-color: #f3f3f3
    a
        height: 40px
        line-height: 40px
        i
            height: 40px
            line-height: 40px
            color: #f35b00
            font-size: 18px
            &.grey-color
                color: #cccccc
        span
            color: #666666
            height: 40px
            line-height: 40px
.hope-like-handle
    position: fixed
    width: 100%
    left: 0px
    bottom: 0px
    background-color: #fff
    text-align: center
    .hope-change-people
        color: #666
        padding: 1px 10px
        font-size: 12px
        p
            overflow: hidden
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            word-break: break-word
            line-height: 16px
            height: 16px
    .hope-like-area
        font-size: 0px
        a
            height: 40px
            line-height: 40px
            width: 50%
            display: inline-block
            font-size: 16px
            box-sizing: border-box
            color: #fff
            &.refuse
                border-right: 1px solid #fff
                background-color: #4A4A4A
            &.agree
                background-color: #F35B00


</style>
