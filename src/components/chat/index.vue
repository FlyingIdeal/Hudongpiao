<template>
    <div>
        <div class="head-back">
            <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')" v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
            <h2 class="headerTitle" v-if="userInfro" v-text="userInfro.name"></h2>
            <div class="Occupy" @click="topicHandle"><i class="icon-minemanage"></i></div>
        </div>
        <div class="brief topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <!--个人名片介绍-->
            <div class="listCol" v-if="userInfro && userFlag">
                <ul class="in-list">
                    <li>
                        <a href="javascript:void(0);">
                            <div class="infro">
                                <div class="photo"><img v-if="userInfro.headPortrait" v-lazy="userInfro.headPortrait" /><img v-else src="~@/common/images/default.png" /></div>
                                <div class="text">
                                    <p><span title="姓名">{{$t("RegLogin.Name")}}:</span><em v-text="userInfro.name"></em></p>
                                    <p><span :class='$t("CommonUse.TransSize")' title="公司">{{$t("RegLogin.Company")}}:</span><em v-text="userInfro.records ? userInfro.records.company : ''"></em></p>
                                    <p v-if="userInfro.position"><span title="职位">{{$t("RegLogin.Title")}}:</span><em v-text="userInfro.position"></em></p>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
            <div id="loadWrapper">
                <div class="chat-col">
                    <template v-for="(value, key) in listArr">
                        <div class="chat-list chat-left" v-if="value.isRight == '0'">
                            <div class="infro"><img v-lazy="getHeaderImg(value)"></div>
                            <div class="text">
                                <p class="chat-timer" v-text='value.createTime'></p>
                                <p class="chat-content" :class="[value.query == 'sysNoLinkTips' ? 'chat-border' : '']" v-text='value.content'></p>
                                <!--递名片-->
                                <p class="chat-card" v-if="value.query =='sysNoLinkTips'" @click="changeCard">
                                    <span title="点击这里">{{$t("ExchangeCard.ClickHere")}}</span><em title="递名片" :class="[linkStatus == '0' ? '' : 'haslink']">{{$t("ExchangeCard.ExBusinessCard")}}</em>
                                </p>
                                <!--交换按钮-->
                                <div class="chat-btn" :class="[isHasClick(value) ? '' : 'chat-grey']" v-if="value.query =='sysLinkApply'">
                                    <span class="agree" @click="agree(value)" title="同意">{{$t("ExchangeCard.Agree")}}</span>
                                    <span class="refuse" @click="refuse(value)" title="取消">{{$t("RegLogin.Cancel")}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="chat-list chat-right" v-else>
                            <div class="text">
                                <p class="chat-timer" v-text='value.createTime'></p>
                                <p class="chat-content"  :class="[value.query == 'sysNoLinkTips' ? 'chat-border' : '']" v-text='value.content'></p>
                                <!--递名片-->
                                <p class="chat-card" v-if="value.query =='sysNoLinkTips'" @click="changeCard">
                                    <span title="点击这里">{{$t("ExchangeCard.ClickHere")}}</span><em title="递名片" :class="[linkStatus == '0' ? '' : 'haslink']">{{$t("ExchangeCard.ExBusinessCard")}}</em>
                                </p>
                                <!--交换按钮-->
                                <div class="chat-btn" :class="[isHasClick(value) ? '' : 'chat-grey']" v-if="value.query =='sysLinkApply'">
                                    <span class="agree" @click="agree(value)" title="同意">{{$t("ExchangeCard.Agree")}}</span>
                                    <span class="refuse" @click="refuse(value)" title="取消">{{$t("RegLogin.Cancel")}}</span>
                                </div>
                            </div>
                            <div class="infro"><img v-lazy="getHeaderImg(value)"></div>
                        </div>
                    </template>
                </div>
            </div>
            <!--底部发送-->
            <div class="bottom-send" @click="replay">
                <p></p>
                <span title="发送">{{$t("RegLogin.SendBtn")}}</span>
            </div>

            <smallFrom ref= 'smallFrom' v-show='smallFromFlag' :setSmallFromFlag = "setSmallFromFlag" ></smallFrom>

            <!--评论回复输入框-->
            <v-reply ref="reply" :limit="300" :fromType="'chat'" :touserId="userid"></v-reply>
            <!--删除、投诉底部-->
            <v-actionsheet :class="sheetType" :actions="sheetAction" v-model="sheetVisible"></v-actionsheet>
        </div>
    </div>
</template>

<script>
import { Actionsheet, MessageBox } from 'mint-ui';//操作表，从屏幕下方移入。
import {commonAjaxFun, formatDate, mainUserTk} from '../../common/js/common.js'
import loadState from '../module/loadState/loadState.vue'//加载状态
import vReply from '../module/reply/reply.vue'
import smallFrom from '../module/smallFrom/index.vue'
export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            userid: `${this.$route.query.userid}`, //userid
            wxShare: `${this.$route.query.wxShare}`, //是否来自微信分享，如果是true，则返回首页，否则返回上一级
            loadState: false, //初次进页面加载中
            droploadObj: {}, //下拉加载
            listArr: [], //数据列表
            curCollect: [], //临时数组，用于存放下拉数据
            page: 1, //请求页数
            queryTime: '', //请求时间
            linkStatus: '',
            shieldStatus: '',
            userFlag: true, //个人信息的显示隐藏，当下拉时隐藏
            userInfro: '', //个人信息
            sheetAction: [],
            sheetVisible: false, //控制底部的显示隐藏
            sheetType: '', //根据当前类型，去选择class
            newQueryTimeNew: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            getNewChatFlag: false, //请求新信息的flag值，从而防止多次请求
            setTimer: null, //定时器
            sheetDelete: [{
                'name': '',
                'method': this.deleteTopic
            }],
            smallFromFlag:false,  // 判断表单显示隐藏
        }
    },
    components: {
        loadState: loadState,
        vReply: vReply,
        vActionsheet: Actionsheet,
        smallFrom
    },
    mounted() {
        this.getUserInfro('init');
        this.dropload(); //加载评论
    },
    destroyed() {
        clearTimeout(this.setTimer);
    },
    methods: {
        chatUrl: function(val) {
            if (val.fromUserid == this.userid && val.query !== "sys" && val.query !== "shieldTips" && val.query !== "sysNoLinkTips" && val.query !== "sysLinkApply") {
                return '/AttendGuests/people?projectId=' + this.projectId + '&userid=' + val.fromUserid;
            } else if (val.isRight == "1") {
                return '/AttendGuests/people?projectId=' + this.projectId + '&userid=' + val.fromUserid;
            } else {
                return "javascript:void(0)";
            }
        },
        routerBack: function(){
            if(this.wxShare == 'true'){
                this.$router.push({path : '/home/index', query: {projectId: this.projectId, passKey: this.passKey}});//主页
            } else {
                this.$router.go(-1);
            }
        },
        topicHandle: function() { //头部操作，不在接收此人信息
            if (this.shieldStatus == '1') {
                this.$set(this.sheetDelete[0], 'name', this.$t('ExchangeCard.AcceptMessages')); //接收对方的消息
            } else {
                this.$set(this.sheetDelete[0], 'name', this.$t('ExchangeCard.RejectMessages')); //不再接收对方的消息
            }

            this.sheetVisible = true;
            this.sheetType = 'sheet-delete';
            this.sheetAction = this.sheetDelete;
        },
        deleteTopic: function(){
            //不在接受此人信息
            let _this = this;
            let _text = '';//提示信息

            if (_this.shieldStatus == '1') {
                _text = _this.$t('ExchangeCard.ConfirmAcceptMessages');//确定接收对方的消息？
            } else {
                _text = _this.$t('ExchangeCard.ConfirmRejectMessages');//确定不再接收对方的消息？
            }

            MessageBox.confirm(_text).then(action => {

                this.$layer.loading();

                let _type = _this.shieldStatus == '1' ? 'unshield' : 'shield';

                commonAjaxFun({
                    url: '/userApi/shieldUser',
                    data: {
                        projectId: _this.projectId,
                        userTk: mainUserTk,
                        userId: _this.userid,
                        type: _type
                    }
                }, 200).then((data) => {

                    _this.$layer.close();

                    if (data.state == '0') {
                        _this.shieldStatus = _this.shieldStatus == '0' ? '1' : '0';
                    } else {
                        _this.$layer.toast({  content: data.message });
                    }

                    //console.log(_this.shieldStatus)
                })
            });
        },
        replay: function() {
            this.$refs.reply.hideMaskShadow();
        },
        getHeaderImg: function(value) {
            let _url = require('@/common/images/default.png');

            if (value.query == 'sys' || value.query == 'sysLinkApply' || value.query == 'shieldTips' || value.query == 'sysNoLinkTips') {
                let cookieLogo = this.$cookie.get('HDP_ENTERLOGO');

                _url = cookieLogo || _url;

            } else if (value.headPortrait) {
                _url = value.headPortrait;
            }

            return _url
        },
        getUserInfro: function(type) {
            //获取个人信息详情
            let _this = this;
            commonAjaxFun({
                url: '/messageTool/chat/getChatDetail',
                data: {
                    userTk: mainUserTk,
                    toUserid: _this.userid,
                    page: _this.page,
                    queryTime: _this.queryTime
                }
            }).then((data) => {
                let _data = data.data;
                if (data.state == '0') {

                    if (type == 'down') {
                        _this.userFlag = false;
                    }
                    _this.userInfro = _data.userInfo;
                    _this.linkStatus = _data.status.linkStatus;
                    _this.shieldStatus = _data.status.shieldStatus;


                    if (_data.chatData.rows.length > 0) {
                        _this.curCollect = _data.chatData.rows.reverse().concat(_this.curCollect); //取反
                        _this.listArr = _this.curCollect;
                        ++_this.page;
                        _this.queryTime = _data.queryTime;


                        _this.$nextTick(() => {
                            _this.droploadObj.resetload();

                            if (type == 'init') {
                                _this.scrollToEnd();

                                _this.newQueryTimeNew = _this.listArr[_this.listArr.length - 1].createTime;

                                _this.getNewChat();
                            }

                        })
                    } else {
                        _this.droploadObj.noData();
                        _this.droploadObj.resetload();
                    }

                } else {
                    console.log(data.message);
                }
            })
        },
        scrollToEnd: function() {
            //回到顶部
            let scrollHeight = $('body')[0].scrollHeight;

            $('body').scrollTop(scrollHeight);
        },
        agree: function(value) {
            //同意
            if (this.isHasClick(value)) {
                this.changeCard(value.resultMsg)
            }
        },
        refuse: function(value) {
            //拒绝
            if (this.isHasClick(value)) {
                this.changeCard('')
            }
        },
        isHasClick: function(value) {
            let _args = '';
            if (value.args) {
                _args = $.parseJSON(value.args);
            }

            if (!(this.linkStatus == '1' || (!!_args.handleStatus && _args.handleStatus == '1'))) {
                return true
            } else {
                return false;
            }
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
        setSmallFromFlag:function(flag){
            this.smallFromFlag = flag
        },
        changeCard: function() {
            //递名片
            let _this = this;
            if (_this.linkStatus == '0') {
                _this.$layer.loading()

                commonAjaxFun({
                    url: '/userApi/userInfo',
                    data: {
                        projectId: _this.projectId,
                        userTk: mainUserTk,
                        userId: ""
                    }
                }, 200).then((data) => {
                    _this.$layer.close();

                    let _data = data.data;
                    if(data.state == '10001'){
                        //首先判断是否登录
                        localStorage.setItem(_this.returnUrl, _this.toFullPath);//本地存储backurl

                        _this.$router.push({path : '/login/index', query: {projectId: _this.projectId, passKey: _this.passKey}});//'请先登录！'
                    } else {
                        //console.log(_data)
                        if(_data.name == '' || _data.companyInfo.company == '' || _data.companyInfo.roleType == ''){
                            _this.setSmallFromFlag(true)
                            _this.$refs.smallFrom.setFormValue({name: _data.name,company: _data.companyInfo.company,Role:_data.companyInfo.roleType})

                        } else {
                            _this.changeState('wait');//刷新交换名片状态
                        }
                    }

     
                })
            }
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
        getNewChat: function() {
            //刷新新对话
            let _this = this;
            clearTimeout(this.setTimer);
            //console.log(_this.getNewChatFlag)
            if (!_this.getNewChatFlag) {

                _this.getNewChatFlag = true;

                commonAjaxFun({
                    url: '/messageTool/chat/getNewChat',
                    data: {
                        userTk: mainUserTk,
                        toUserid: _this.userid,
                        newQueryTime: _this.newQueryTimeNew
                    }
                }).then((data) => {
                    let _data = data.data;

                    _this.getNewChatFlag = false;

                    if (data.state == '0') {
                        if (_data.list.length > 0) {
                            _this.curCollect = _this.listArr.concat(_data.list.reverse());

                            _this.listArr = _this.curCollect;

                            _this.newQueryTimeNew = _data.newQueryTime;

                            _this.$nextTick(() => {
                                _this.scrollToEnd()
                            })
                        }

                    } else {
                        console.log(data.message)
                    }

                    _this.setTimer = setTimeout(() => {
                        
                        _this.getNewChat();
                    }, 1000); //每一秒请求一次

                })
            }
        },
        dropload: function() {
            let _this = this;
            //正常情况
            _this.droploadObj = $('#loadWrapper').dropload({
                scrollArea: window,
                threshold: 50,
                domUp: {
                    domClass: "dropload-up",
                    domRefresh: '<div class="dropload-refresh">↓' + _this.$t('CommonUse.DropRefresh') + '</div>', //↓下拉刷新
                    domUpdate: '<div class="dropload-update">↑' + _this.$t('CommonUse.ReleaseRefresh') + '</div>', //↑释放更新
                    domLoad: '<div class="dropload-load"><span class="loading"></span>' + _this.$t('CommonUse.Refresh') + '</div>' //刷新中
                },
                domDown: {
                    domClass: 'dropload-down',
                    domRefresh: '<div class="dropload-refresh">↑' + _this.$t('CommonUse.PullMore') + '</div>', //↑上拉加载更多
                    domLoad: '<div class="dropload-load"><span class="loading"></span>' + _this.$t('CommonUse.Loading') + '</div>', //加载中...
                    domNoData: '<div class="dropload-noData">' + _this.$t('CommonUse.NoMoreInfor') + '</div>' //没有更多内容了
                },
                loadUpFn: function(me) {
                    _this.getUserInfro('down');
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.listCol
    margin: 0 14px
    box-sizing: border-box
    box-shadow: 0 0 3px 0 rgba(0,0,0,.3)
    border-radius: 0 0 4px 4px
    ul.in-list .infro .text
        padding: 0 14px
        p
            height: 22px
            line-height: 22px
            display: flex
            font-size: 13px
            span
                flex: 0 0 60px
                width: 60px
                text-align: left
                color: #666
            em
                height: 22px
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                word-break: break-word
                flex: 1
                font-size: 13px
                color: #333
.chat-col
    padding: 0 14px
    .chat-list
        margin-top: 10px
        display: flex
        .infro
            flex: 0 0 48px
            width: 48px
            height: 48px
            line-height: 48px
            text-align: center
            border-radius: 2px
            overflow: hidden
            font-size: 0px
            img
                max-width: 48px
                max-height: 48px
                vertical-align: middle
        .text
            flex: 1
            padding: 10px
            background-color: #fff
            box-shadow: 0 0 3px 0 rgba(0,0,0,.3)
            border-radius: 4px
            position: relative
            p.chat-timer
                color: #9B9B9B
                margin-bottom: 5px
                font-size: 12px
            p.chat-content
                font-size: 15px
                color: #333
            p.chat-border
                border-bottom: 1px solid #D9D9D9
                padding-bottom: 8px
                margin-bottom: 8px
        .chat-card
            font-size: 14px
            em
              color: #3c99ee
              &.haslink
                  color: #d9d9d9
        .chat-btn
            margin-top: 10px
            text-align: left
            font-size: 0px
            span
                display: inline-block
                vertical-align: top
                width: 64px
                height: 26px
                font-size: 14px
                line-height: 26px
                border-radius: 2px
                text-align: center
                color: #fff
            .agree
                background-color: #F35B00
                margin-right: 20px
            .refuse
                background-color: #999
        .chat-grey
            .agree, .refuse
                background-color: #F3F3F3
    .chat-left
        padding-right: 60px 
        .infro
            margin-right: 12px
        .text
            &:before   
                position: absolute
                content:''
                left: -7px
                top: 10px
                border-top: 7px solid transparent
                border-right: 7px solid rgba(0,0,0,.2)
                border-bottom: 7px solid transparent
            &:after   
                position: absolute
                content:''
                left: -6px
                top: 10px
                border-top: 6px solid transparent
                border-right: 6px solid #fff
                border-bottom: 6px solid transparent
    .chat-right
        padding-left: 60px 
        .infro
            margin-left: 12px
        .text
            &:before   
                position: absolute
                content:''
                right: -7px
                top: 10px
                border-top: 7px solid transparent
                border-left: 7px solid rgba(0,0,0,.2)
                border-bottom: 7px solid transparent
            &:after   
                position: absolute
                content:''
                right: -6px
                top: 10px
                border-top: 6px solid transparent
                border-left: 6px solid #fff
                border-bottom: 6px solid transparent
.bottom-send
    position: fixed
    left: 0px
    bottom: 0px
    padding: 5px 10px
    box-sizing: border-box
    width: 100%
    height: 51px
    display: flex
    border-top: 1px solid #D9D9D9
    background-color: #e6e6e6
    p
        flex: 1
        background-color: #fff
    span
        flex: 0 0 70px
        width: 70px
        height: 40px
        line-height: 40px
        text-align: center
        display: inline-block
        color: #fff
        background-color: #F35B00
        border-radius: 4px
        margin-left: 10px   
        font-size: 14px     
</style>
