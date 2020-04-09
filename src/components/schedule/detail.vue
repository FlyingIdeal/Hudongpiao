<template>
    <div>
        <div class="head-back">
            <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')" v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
            <h2 class="headerTitle" title="日程" v-text="$t('HomePage.Schedule')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat schedule-detail">
            <div v-if="!scheduleData && errorMessage">
                <v-error :message="errorMessage"></v-error>
            </div>
            <div v-if="scheduleData">
                <h2 class="schedule-title" v-text="scheduleData.granules[0].theme"></h2>
                <div class="shadow">
                    <div class="schedule-time">
                        <div class="schedule-time-in">
                            <i class="icon-color icon-riqi"></i>
                            <p>{{scheduleData.granules[0].startTime | formatDate(scheduleData.granules[0].endTime)}}</p>
                        </div>
                        <div class="list-handle"><v-heart :defaultIcon="defaultIcon" :activeIcon="activeIcon" :favState="scheduleData.granules[0].watched" v-on:toParCollectboothid="_toParCollectboothid" :axiosParam="{url:url, data:{id: detailId, type: 'schedule', projectId: projectId, userTk: userTk}}"></v-heart></div>
                    </div>
                    <p class="schedule-place" v-if="scheduleData.place">
                        <i class="icon-color icon-place"></i><span v-text="scheduleData.place"></span>
                    </p>
                </div>
                <div class="shadow" v-if="scheduleData.granules[0].introduce">
                    <h3 class="console-txt-h3" title="简介">{{$t("HomePage.Introduction")}}</h3>
                    <v-Brief :content="scheduleData.granules[0].introduce"></v-Brief>
                </div>
                <div class="shadow" v-if="scheduleData.granules[0].guests.length > 0">
                    <h3 class="console-txt-h3" title="嘉宾">{{$t("HomePage.Speaker")}}</h3>
                    <div class="listCol listCol-arraw">
                        <ul class="in-list">
                            <li v-for="(value, key) in scheduleData.granules[0].guests" :akey="key + 1">
                                <router-link :to="{path:'/guest/detail', query:{projectId: projectId, passKey: passKey, childId: value.projectId, detailId: value.guestId, type: 'guestModule'}}">
                                    <div class="infro">
                                        <div class="photo"><img v-if="value.photo" v-lazy="value.photo" /><img v-else src="~@/common/images/default.png" /></div>
                                        <div class="text">
                                            <h6 v-text="value.name"></h6>
                                            <p v-text="value.company"></p>
                                            <p v-text="value.position"></p>
                                        </div>
                                    </div>
                                    <div class="list-handle"><i class="icon-rightarrow"></i></div>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="schedule-star" v-if="scope">
                    <h3 class="console-txt-h3" title="为主题评分">{{$t("Schedule.Rating")}}</h3>
                    <div class="shadow schedule-star-main">
                        <ul>
                            <li v-for="value in 5" @click="submitMark(value)"><i :class="[value - 1 >= scope.currentScope ? 'icon-emptystar' : 'icon-color icon-emptystared']"></i></li>
                        </ul>
                        <p class="schedule-population" title="平均分：/人投票">{{$t("Schedule.Average")}}：{{scope.scope.score}} / {{scope.scope.peopleNum}} {{$t("Schedule.Submitted")}}</p>
                    </div>
                </div>
                <div class="leave-message shadow" v-if="contentObj">
                    <h3 class="console-txt-h3"><span title="留言">{{$t("Messaging.Title")}}</span><i class="icon-topic" @click="reply"></i></h3>
                    <div class="mine-nolist-tips" v-if="contentObj.list.length == 0">
                        <i class="icon-emptybowl"></i>
                        <p title="快来说说您的看法吧">{{$t("Messaging.LeaveTips")}}</p>
                        <router-link :to="{path:'/speak/index', query:{projectId: projectId, passKey: passKey, detailId: detailId, title: $t('HomePage.Schedule'), moduleType: 'schedule', type: 'appScheduleModule'}}" class="create-btn" title="发言">{{$t("Messaging.Post")}}</router-link>
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
                        <router-link :to="{path:'/speak/index', query:{projectId: projectId, passKey: passKey, detailId: detailId, title: $t('HomePage.Schedule'), moduleType: 'schedule'}}" class="view-more" v-if="contentObj.totalNum - 4 > 0">
                            <span title="查看更多">{{$t("CommonUse.More")}}</span>
                            <em>({{contentObj.totalNum - 4}})</em>
                        </router-link>
                    </div>
                </div>
            </div>
            <!--评论回复输入框-->
            <v-reply ref="reply" :childId="projectId" :limit="300" :moduleType="'schedule'" :moduleId="detailId" v-on:replayReresh="_replayReresh"></v-reply>
        </div>
    </div>
</template>
<script>
import vBrief from '../module/brief/brief.vue'
import vReply from '../module/reply/reply.vue'
import vHeart from '../module/heart/heart.vue'
import vError from '../module/error/error.vue'
import { Actionsheet, MessageBox } from 'mint-ui';//操作表，从屏幕下方移入。
import complain from '../module/complain/complain.vue'//投诉
import {commonAjaxFun, deleteContent, formatDate,  collectDataFun, mainUserTk, initAllWeiXin, api_url } from '../../common/js/common.js'
export default {
    data(){
        return {
            sheetComplain: [
                {
                    'name' : this.$t("RegLogin.Flag"),//投诉
                    'method': this.complain
                }
            ],
            sheetDelete: [
                {
                    'name' : this.$t("RegLogin.Delete"),//删除
                    'method': this.deleteTopic
                }
            ],
            sheetAction: [],
            sheetType: '',//根据当前类型，去选择class
            sheetVisible: false,//控制底部的显示隐藏
            moduleType: 'schedule',//默认投诉日程的评论列表
            deleteThemeid: '',//要删除的themeid
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            wxShare: `${this.$route.query.wxShare}`,//是否来自微信分享，如果是true，则返回首页，否则返回上一级
            detailId: `${this.$route.query.detailId}`,
            childId: `${this.$route.query.childId}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            scheduleData : '',
            contentObj: '',//评论列表
            scope: '',//评分
            defaultIcon: 'icon-heart',//收藏点选之前的状态
            activeIcon: 'icon-hearted icon_color',//点选周的选中状态
            errorMessage: '',//日程错误提示
            url: '/userApi/watch',
            userTk: mainUserTk
        }
    },
    components: {
        vBrief: vBrief,
        vReply: vReply,
        vActionsheet: Actionsheet,
        vComplain: complain,
        vHeart: vHeart,
        vError: vError
    },
    mounted(){
        this.getScheduleDetail();

        if(this.childId != 'undefined'){
            //此处做特殊处理，因为从嘉宾详情页相关日程列表没有childid,在这地方强制处理
            //从而对评分和收藏使用
            this.getScope();
            this.getContentList();
        }
    },
    filters: {
        formatDate(sT, eT){
            let sTime = new Date(sT.replace(new RegExp("-","gm"),"/"));
            let eTime = new Date(eT.replace(new RegExp("-","gm"),"/"));

            let _sday = formatDate(sTime, 'yyyy/MM/dd');
            let _sall = formatDate(sTime, 'yyyy/MM/dd HH:mm');
            let _eday = formatDate(eTime, 'yyyy/MM/dd');
            let _eall = formatDate(eTime, 'yyyy/MM/dd HH:mm');
            let _eHour = formatDate(eTime, 'HH:mm');

            if(_sday == _eday){//同一天2017/09/20 10:15 - 10:45
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
        _toParCollectboothid: function(id, data){//点赞
            this.$set(this.scheduleData.granules[0], 'watched', data);
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
                    moduleType: 'schedule',
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
        submitMark: function(value){
            //打分
            let _this = this;

            _this.$layer.loading()

            commonAjaxFun({
                url: '/interactScope/saveScope',
                data: {
                    projectId: _this.projectId,
                    userTk: _this.userTk,
                    moduleType: 'schedule',
                    moduleId: _this.detailId,
                    scope: value
                }
            }, 500).then((data) => {
                _this.$layer.close();

                let _data = data.data;

                if(data.state == '0'){
                    _this.getScope();//重置分数
                } else if (data.state == '9001') { //请先登录

                    localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl
                    
                    _this.$router.push({path : '/login/index', query: {projectId: _this.projectId, passKey: _this.passKey}});//请先登录！
                } else {
                    _this.$layer.toast({content: data.message})
                }
            })
        },
        getScheduleDetail: function(){
            //获取日程详情
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getChildrenDetails',
                data: {
                    detailId: _this.detailId,
                    type: 'appScheduleModule'
                }
            }).then((data) => {
                //console.log(data)
                let _data = data.data;
                if(data.state == '0'){
                    _this.scheduleData = _data.meetings[0];

                    if(_this.childId == 'undefined'){
                        //此处做特殊处理，因为从嘉宾详情页相关日程列表没有childid,在这地方强制处理
                        //从而对评分和收藏使用
                        _this.childId = _data.meetings[0].projectId;
                        _this.getScope();
                        _this.getContentList();
                    }

                    //次判断用于来宾详情页面单独微信分享
                    if(_this.needSingleWx) {
                        let desc = _data.meetings[0].place || '';
                        let title = _data.meetings[0].granules[0].theme;
                        let link = _this.toFullPath;

                        initAllWeiXin(_this.projectId, _this.passKey, 'scheduleDetail', {}, {
                            title: title,
                            desc: desc,
                            link: link
                        })
                        
                    }

                } else if(data.state == '9100') {
                    _this.errorMessage = data.message;
                } else {
                    console.log(data.message);
                }
            })
        },
        getScope: function(){
            //获取日程评分
            let _this = this;
            commonAjaxFun({
                url: '/interactScope/getScope',
                data: {
                    projectId: _this.projectId,
                    moduleType: 'schedule',
                    moduleId: _this.detailId,
                    userTk: _this.userTk
                }
            }).then((data) => {
                let _data = data.data;
                if(data.state == '0'){
                    _this.scope = _data;
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
h2.schedule-title
    padding: 20px 14px
    text-align: center
    font-size: 18px
    background-color: #f2f2f2
    border-bottom-px(1px, rgba(0,0,0,.05))
.schedule-time
    display: flex
    .schedule-time-in
        flex: 1
        display: flex
        i
            flex: 0 0 30px
            width: 30px
            display: inline-block
            line-height: 48px
            text-align: center
            font-size: 18px
        p
            flex: 1
            line-height: 48px
            box-sizing: border-box
            padding: 0 6px
            font-size: 14px
    .list-handle
        flex: 0 0 48px
        width: 48px
        height: 48px
        line-height: 48px
.schedule-place
    display: flex
    i
        flex: 0 0 30px
        width: 30px
        display: inline-block
        line-height: 48px
        text-align: center
        font-size: 18px
    span
        flex: 1
        line-height: 48px
        box-sizing: border-box
        padding: 0 6px
        font-size: 14px
        border-top-px(1px, rgba(0,0,0,.05))
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
                    font-size: 24px
                    vertical-align: middle
    p.schedule-population
        padding: 14px 10px 0
        text-align: center
        font-size: 14px
        color: #f35b00
.list-handle i.icon-hearted, .list-handle i.icon-heart
    font-size: 22px
</style>


