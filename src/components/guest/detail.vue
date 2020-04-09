<template>
    <div>
        <div class="head-back">
            <div class="head-back-icon" @click="routerBack"><span v-text="'首页'" v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
            <h2 class="headerTitle" title="嘉宾" v-text="$t('HomePage.Speaker')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat schedule-detail">
            <div class="shadow" v-if="guestData">
                <div class="attend-top">
                    <div class="attend-infro">
                        <div class="photo"><img @click="wxScaleBigImg(guestData.photo)" v-if="guestData.photo" v-lazy="guestData.photo" /><img v-else src="~@/common/images/default.png" /></div>
                        <div class="text">
                            <h6 title="姓名">{{$t('RegLogin.Name')}}：<span v-text="guestData.name"></span></h6>
                            <p title="公司">{{$t('RegLogin.Company')}}：<span v-text="guestData.company"></span></p>
                            <p title="职位">{{$t('RegLogin.Title')}}：<span v-text="guestData.position"></span></p>
                        </div>
                    </div>
                </div>
            </div>
            <!--简介-->
            <div class="attend-top shadow" v-if="guestData && guestData.introduce">
                <h3 class="console-txt-h3" title="简介">{{$t('CommonHTag.Profile')}}</h3>
                <div class="attend-text">{{guestData.introduce}}</div>
            </div>
            <!--相关日程-->
            <div class="attend-top shadow" v-if="guestData && guestData.granules.length > 0">
                <h3 class="console-txt-h3" title="相关日程">{{$t('CommonHTag.RelatedAgenda')}}</h3>
                <div class="listCol">
                    <ul class="in-list">
                        <li v-for="(value, key) in guestData.granules" :akey="key">
                            <router-link class="toLink" :to="{path:'/schedule/detail', query:{projectId: projectId, passKey: passKey, detailId: value.id, type: 'appScheduleModule'}}">
                                <div class="infro">
                                    <div class="text">
                                        <h6 v-text="value.theme"></h6>
                                        <p>{{value.startTime | formatDate(value.endTime)}}</p>
                                        <p v-text="value.meeting.place"></p>
                                    </div>
                                </div>
                            </router-link>
                            <div class="list-handle"><v-heart :defaultIcon="defaultIcon" :activeIcon="activeIcon" :favState="value.watched" v-on:toParCollectboothid="_toParCollectboothid" :axiosParam="{url:url, data:{id: value.id, type: 'schedule', projectId: projectId, userTk: userTk}}"></v-heart></div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="leave-message shadow" v-if="contentObj">
                <h3 class="console-txt-h3"><span title="留言">{{$t('Messaging.Title')}}</span><i class="icon-topic" @click="reply"></i></h3>
                <div class="mine-nolist-tips" v-if="contentObj.list.length == 0">
                    <i class="icon-emptybowl"></i>
                    <p title="快来说说您的看法吧">{{$t('Messaging.LeaveTips')}}</p>
                    <router-link title="发言" :to="{path:'/speak/index', query:{projectId: projectId, passKey: passKey, detailId: detailId, title: $t('Messaging.Title'), moduleType: 'guest'}}" class="create-btn">{{$t('Messaging.PostBtn')}}</router-link>
                </div>
                <div class="listCol" v-if="contentObj.list.length > 0">
                    <div class="main-comment-detail">
                        <template v-for="(value, key) in contentObj.list">
                            <div class="main-comment-list" v-if="key < 4" :akey="key">
                                <router-link class="link" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.userId}}">
                                    <div class="photo"><img v-if="value.userImg" v-lazy="value.userImg" /><img v-else src="~@/common/images/default.png" /></div>
                                </router-link>
                                <div class="text">
                                    <h4 class="name" v-text="value.userName"></h4>
                                    <h6 class="content" v-text="value.content" :themeId= 'value.contentId' :handleType="value.creater == 1 ? 'delete' : 'complaint'" @click="topicHandle($event)"></h6>
                                    <p class="time" v-text="value.showTime"></p>
                                </div>
                            </div>
                        </template>
                        <!--删除、投诉底部-->
                        <v-actionsheet :class="sheetType" :actions="sheetAction" v-model="sheetVisible"></v-actionsheet>
                        <!--投诉-->
                        <v-complain ref="complain"></v-complain>
                    </div>
                    <router-link class="view-more" :to="{path:'/speak/index', query:{projectId: projectId, passKey: passKey, detailId: detailId, title: $t('Messaging.Title'), moduleType: 'guest'}}" v-if="contentObj.totalNum - 4 > 0">
                        <span title="查看更多">{{$t("CommonUse.More")}}</span>
                        <em>({{contentObj.totalNum - 4}})</em>
                    </router-link>
                </div>
            </div>
            <!--评论回复输入框-->
            <v-reply ref="reply" :childId="projectId" :limit="300" :moduleType="'guest'" :moduleId="detailId" v-on:replayReresh="_replayReresh"></v-reply>
        </div>
    </div>
</template>
<script>
import vBrief from '../module/brief/brief.vue'
import vReply from '../module/reply/reply.vue'
import vHeart from '../module/heart/heart.vue'
import { Actionsheet, MessageBox } from 'mint-ui';//操作表，从屏幕下方移入。
import complain from '../module/complain/complain.vue'//投诉
import {commonAjaxFun, deleteContent, formatDate,  collectDataFun, mainUserTk, initAllWeiXin, wxScaleBigImg, uwin_url, api_url } from '../../common/js/common.js'

export default {
    data(){
        return {
            sheetComplain: [{
                'name': this.$t("RegLogin.Flag"), //投诉
                'method': this.complain
            }],
            sheetDelete: [{
                'name': this.$t("RegLogin.Delete"), //删除
                'method': this.deleteTopic
            }],
            sheetAction: [],
            sheetType: '', //根据当前类型，去选择class
            sheetVisible: false, //控制底部的显示隐藏
            moduleType: 'guest', //默认投诉嘉宾的评论列表
            deleteThemeid: '', //要删除的themeid
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            wxShare: `${this.$route.query.wxShare}`, //是否来自微信分享，如果是true，则返回首页，否则返回上一级
            detailId: `${this.$route.query.detailId}`,
            childId: `${this.$route.query.childId}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            guestData: '',
            contentObj: '', //评论列表
            defaultIcon: 'icon-heart', //收藏点选之前的状态
            activeIcon: 'icon-hearted icon_color ', //点选周的选中状态
            url: '/userApi/watch',
            userTk: mainUserTk
        }
    },
    components: {
        vBrief: vBrief,
        vReply: vReply,
        vActionsheet: Actionsheet,
        vComplain: complain,
        vHeart: vHeart
    },
    mounted() {
        this.getGuestDetails(); //获取嘉宾详情
        this.getContentList();
    },
    filters: {
        formatDate(sT, eT) {
            let sTime = new Date(sT.replace(new RegExp("-", "gm"), "/"));
            let eTime = new Date(eT.replace(new RegExp("-", "gm"), "/"));

            let _sday = formatDate(sTime, 'yyyy/MM/dd');
            let _sall = formatDate(sTime, 'yyyy/MM/dd HH:mm');
            let _eday = formatDate(eTime, 'yyyy/MM/dd');
            let _eall = formatDate(eTime, 'yyyy/MM/dd HH:mm');
            let _eHour = formatDate(eTime, 'HH:mm');

            if (_sday == _eday) { //同一天2017/09/20 10:15 - 10:45
                return _sall + ' - ' + _eHour
            } else {
                return _sall + ' - ' + _eall;
            }
        }
    },
    methods: {
        routerBack: function(){
            if(this.wxShare == 'true'){
                this.$router.push({path : '/home/index', query: {projectId: this.projectId, passKey: this.passKey}});//主页
            } else {
                this.$router.go(-1);
            }
        },
        wxScaleBigImg: function(value){
            //微信端图片放大预览
            wxScaleBigImg(value)
        },
        _toParCollectboothid: function(id, data){//点赞
            if(!id){return}
            for(let i = 0; i < this.guestData.granules.length; i++){
                if(this.guestData.granules[i].id == id){
                    this.$set(this.guestData.granules[i], 'watched', data);
                    break;
                }
            }
        },
        reply: function(){
            //回复
            //首先判断是否登录
            if(!this.loginState){

                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
                return false;
            }

            this.$refs.reply.hideMaskShadow();
        },
        complain: function(){
            //调用子组件里的显示右侧投诉
            this.$refs.complain.handleComplain(this.childId, this.deleteThemeid, this.moduleType);
        },
        _replayReresh: function(){
            //评论之后的操作-重新获取评论列表
            this.getContentList();
        },
        deleteTopic: function(){
            //删除话题
            let _this = this;

            MessageBox.confirm(_this.$t('layerTips.DeleteTips')).then(action => {//确定删除

                _this.$layer.loading(_this.$t('layerTips.Deleting'));//正在删除，请稍后！

                deleteContent(_this.projectId, _this.deleteThemeid).then((data) => {
                    _this.$layer.close();


                    if(data.state == '0'){

                        _this.$layer.toast({content: _this.$t('layerTips.DeleteSuccess')});//删除成功

                        _this.getContentList();//重新获取评论列表

                    } else if (data.state == '10002'){
                        _this.$layer.toast({content: _this.$t('layerTips.NoPremiss')});//无权限删除！
                    } else if (data.state == '10010'){
                        _this.$layer.toast({content: _this.$t('layerTips.ContentRemoved')});//此信息已被处理！
                    } else if (data.state == '10011'){
                        _this.$layer.toast({content: _this.$t('layerTips.ContentRemovedPoster')});//此内容已被用户删除！
                    } else {
                        _this.$layer.toast({content: (data.message + data.state)});
                    }
                })
            });
        },
        getContentList: function(){
            //获取评论列表
            let _this = this;
            commonAjaxFun({
                url: '/interactTopic/getContentList',
                data: {
                    projectId: _this.projectId,
                    userTk: _this.userTk,
                    moduleType: 'guest',
                    moduleId: _this.detailId,
                    queryTime: ''
                }
            }).then((data) => {
                let _data = data.data;
                if(data.state == '0'){
                   _this.contentObj = _data;
                } else {
                    console.log(data.message);
                }
            })
        },
        getGuestDetails: function(){
            //获取嘉宾详情
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getChildrenDetails',
                data: {
                    detailId: _this.detailId,
                    type: 'guestModule'
                }
            }).then((data) => {

                let _data = data.data;
                if(data.state == '0'){
                    _this.guestData = _data;

                    //次判断用于来宾详情页面单独微信分享
                    if(_this.needSingleWx) {
                        let desc = _this.$t('RegLogin.Company') + ':' + (_data.company || _this.$t('CommonHTag.Null')) + ',' + _this.$t('RegLogin.Title') + ':' + (_data.position || _this.$t('CommonHTag.Null'));
                        let img = !!_data.photo ? _data.photo : (uwin_url + require('@/common/images/default.png'));
                        let link = _this.toFullPath;

                        initAllWeiXin(_this.projectId, _this.passKey, 'guestDetail', {}, {
                            desc: desc,
                            img: img,
                            link: link
                        })
                    }

                } else {
                    console.log(data.message);
                }
            })
        },
        topicHandle: function(event){
            //话题操作，去判断删除还是投诉
            
            //首先判断是否登录
            if(!this.loginState){

                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});

                return false;
            }
            
            let _dom = $(event.currentTarget);
            let _type = _dom.attr('handleType');
            let _id = _dom.attr('themeId');

            if(_type == 'complaint'){
                this.sheetVisible = true;
                this.sheetAction = this.sheetComplain;
                this.sheetType = 'sheet-complain';
                this.deleteThemeid = _id;
            } else if(_type == 'delete'){
                this.sheetVisible = true;
                this.sheetAction = this.sheetDelete;
                this.sheetType = 'sheet-delete';
                this.deleteThemeid = _id;
            } else {
                this.sheetVisible = false;
                this.deleteThemeid = '';
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/function.styl"

.attend-top .attend-text
    font-size: 14px
.listCol ul.in-list .infro .text p
    color: #999
h3.console-txt-h3
    background-color: #fafafa
    font-size: 13px
    padding: 8px 10px
.schedule-star
    .schedule-star-main
        padding:16px 0 10px
        ul
            padding: 0 40px
            display: flex
            li
                flex: 1
                text-align: center
                i
                    display: inline-block
                    font-size: 32px
                    vertical-align: middle
    p.schedule-population
        padding: 14px 10px 0
        text-align: center
        font-size: 14px
        color: #f35b00
.list-handle i
    font-size: 22px
    // color: #f35b00 
</style>


