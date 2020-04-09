<template>
    <div class="m-center" v-if="tochildlist.length > 0">
        <template v-for="(value, key) in tochildlist" v-if="value">
            <!--推送 分享 type = schedule 口腔展style="display:none" -->
            <div class="shadow m-list" v-if='value.jsonStr && jsonstrToJson(value.jsonStr, "moduleType") == "schedule"' v-show="filterLanguage(value.jsonStr)" :akey = 'key'>
                <h3 class="console-txt-h3"><i class="icon-riqi"></i><span title="日程">{{$t("HomePage.Schedule")}}</span></h3>
                <div class="meeting_main">
                    <router-link :to="{path:'/schedule/detail', query:{projectId: projectId, passKey: passKey, detailId: jsonstrToJson(value.jsonStr, 'moduleId'), type: 'appScheduleModule'}}">
                        <div class="timer">
                            <span v-text="jsonstrToJson(value.jsonStr, 'stTime')"></span>
                            <span v-text="jsonstrToJson(value.jsonStr, 'edTime')"></span>
                        </div>
                        <div class="meetTxt" v-text="jsonstrToJson(value.jsonStr, 'theme')"></div>
                        <div class="list-handle"><i class="icon-rightarrow"></i></div>
                    </router-link>
                </div>
            </div>
            <!--正常图文朋友圈 type = original -->
            <div class="shadow m-list" :themeId= 'value.themeId' v-else :akey = 'key'>
                <div class="m-list-top" v-if="value.type != 'push'">
                    <router-link class="link" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.userId}}">
                        <div class="infro">
                            <div class="photo"><img v-if="value.userImg && value.userImg != 'undefined'" v-lazy="value.userImg" /><img v-else src="~@/common/images/default.png" /></div>
                            <div class="text">
                                <h6 v-text="value.userName"></h6>
                                <p v-text="value.company"></p>
                                <p v-text="value.position"></p>
                            </div>
                        </div>
                    </router-link>
                    <div class="list-handle" v-if="!value.jsonStr" :themeId= 'value.themeId' :handleType="value.creater == 1 ? 'delete' : 'complaint'" @click="topicHandle($event)"><i class="icon-botarrow"></i></div>
                </div>
                <div class="m-list-text" v-if="value.content || value.img">
                    <p v-text="value.content" v-if="value.content"></p>
                    <div class="img" v-if="value.img"><img @click="wxScaleBigImg(value.img)" v-lazy="value.img"></div>
                </div>
                <div class="push-topic" :class="[value.type == 'push' ? 'push-topic-padtop' : '']" v-if="value.jsonStr">
                    <router-link :to="{path:'/topic/detail', query:{projectId: projectId, passKey: passKey, childId: jsonstrToJson(value.jsonStr, 'projectId'), themeId: jsonstrToJson(value.jsonStr, 'moduleId')}}">
                        <div class="push-top-img"><img v-lazy="choosePushIcon(value.jsonStr.guestList, 'topic')"></div>
                        <div class="push-top-text"><p v-text='jsonstrToJson(value.jsonStr, "theme")'></p></div>
                    </router-link>
                </div>
                <!--日程-->
                <div class="m-list-time" v-if="value.theme"><span class="m-creat-time" v-text="value.showTime"></span><em title="在">{{$t("IneractCircle.At")}}</em><router-link class="at" :to="{path:'/schedule/detail', query:{projectId: projectId, passKey: passKey, detailId: value.scheduleId, type:'appScheduleModule'}}" v-text="value.theme"></router-link></div>
                <!--互动话题-->
                <div class="m-list-time" v-else-if="value.jsonStr"><span class="m-creat-time" v-text="value.showTime"></span><em title="在">{{$t("IneractCircle.At")}}</em><router-link class="at" :to="{path:'/topic/index', query:{projectId: projectId, passKey: passKey, childId: jsonstrToJson(value.jsonStr, 'projectId'), type: 'socialContact'}}" title="互动话题" v-text="$t('Forum.Forum')"></router-link></div>
                <!--无任何at-->
                <div class="m-list-time" v-else><span class="m-creat-time" v-text="value.showTime"></span></div>
                <!--评论和点赞-->
                <div class="comment-like-handle" v-if="!value.jsonStr">
                    <router-link :to="{path:'/moment/detail', query:{projectId: projectId, passKey: passKey, childId: childId, themeId: value.themeId}}"><i class="icon-topic2"></i><span v-text="value.readNum" v-if="value.readNum > 0"></span></router-link>
                    <a href="javascript:void(0);" @click="likedLogs(value)"><i :class="[value.liked == 1 ? 'icon-color icon-liked' : 'icon-like']"></i><span :class="[value.liked == 1 ? 'icon-color' : '']" v-text="value.likedNum" v-if="value.likedNum > 0">11</span></a>
                </div>
            </div>
        </template>
        <!--删除、投诉底部-->
        <v-actionsheet :class="sheetType" :actions="sheetAction" v-model="sheetVisible"></v-actionsheet>
        <!--投诉-->
        <v-complain ref="complain"></v-complain>
    </div>
</template>

<script>

import { Actionsheet, MessageBox } from 'mint-ui';//操作表，从屏幕下方移入。
import { deleteTheme, commonAjaxFun, commonFilterIndex, wxScaleBigImg, mainUserTk } from '../../common/js/common.js'
import complain from '../module/complain/complain.vue'//投诉

export default {
    props:{
        tochildlist: Array
    },
    components: {
        vActionsheet: Actionsheet,
        vComplain: complain
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
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
            childId: `${this.$route.query.childId}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            sheetAction: [],
            sheetType: '',//根据当前类型，去选择class
            sheetVisible: false,//控制底部的显示隐藏
            deleteThemeid: ''//要删除的themeid
        }
    },
    methods: {
        complain: function(){
            //调用子组件里的显示右侧投诉
            this.$refs.complain.handleComplain(this.childId, this.deleteThemeid, 'circleTheme');
        },
        wxScaleBigImg: function(value){
            //微信端图片放大预览
            wxScaleBigImg(value)
        },
        deleteTopic: function(){
            //删除话题
            
            let _this = this;

            MessageBox.confirm(_this.$t('layerTips.DeleteTips')).then(action => {//确定删除

                _this.$layer.loading(_this.$t('layerTips.Deleting'));//正在删除，请稍后！

                deleteTheme(_this.projectId, _this.deleteThemeid).then((data) => {

                    _this.$layer.close();

                    if(data.state == '0'){

                        _this.$layer.toast({content: _this.$t('layerTips.DeleteSuccess')});//删除成功

                        //删除themeid的数据
                        for(let i = 0; i < _this.tochildlist.length; i++) {
                            if(_this.tochildlist[i].themeId == _this.deleteThemeid){
                                _this.tochildlist.splice(i, 1)
                            }
                        }

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

        },
        jsonstrToJson: function(jsonStr, type){
            var obj = JSON.parse(jsonStr);
            return obj[type]
        },
        filterLanguage: function(jsonStr) {

            var jsonStr = JSON.parse(jsonStr);
            let _lan = this.$cookie.get('language') || 'ch'; //当前cookie中的中英文

            if (!jsonStr.language) {
                return true;
            } else if (jsonStr.language == _lan) {
                return true;
            } else {
                return false;
            }
        },
        choosePushIcon: function(val, type){
            let iconImg = require('@/common/images/default.png');

            if(type == 'topic'){
                iconImg = require('@/common/images/topicIcon.png');
            } else if(type == 'date'){
                iconImg = !val ? iconImg : val
            }
            return iconImg
        },
        likedLogs: function(val){
            //点赞
            let _this = this;
            _this.$layer.loading();
            commonAjaxFun({
                url: '/interactTopic/likedLogs',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    moduleType:'circle',
                    moduleId: val.themeId
                }
            }, 200).then((data) => {

                _this.$layer.close();
                
                if(data.state == '0') {
                    //成功
                    let _index = commonFilterIndex(val.themeId, 'themeId', _this.tochildlist);
                    let _likedNum = parseInt(_this.tochildlist[_index].likedNum);
                    _this.$set(_this.tochildlist[_index], 'likedNum', ++_likedNum);
                    _this.$set(_this.tochildlist[_index], 'liked', '1');

                } else if (data.state == '10006') {
                    //已经赞过
                    _this.$layer.toast({content: this.$t('Forum.Liked')});//已经赞过此话题了
                } else {
                    //其他情况
                    _this.$layer.toast({content: data.message})
                }
            })

        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

@import "../../common/stylus/function.styl"

.push-topic
    padding: 0 10px
    a
        display: flex
        .push-top-img
            flex: 0 0 60px
            width: 60px
            height: 60px
            vertical-align: top
            img
                width: 60px
        .push-top-text
            flex: 1
            height: 60px
            overflow: hidden
            box-sizing: border-box
            padding: 10px
            background-color: #F2F2F2
            p
                line-height: 20px
                overflow: hidden
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 2
.push-topic-padtop
    padding: 10px 10px 0
.m-list
    h3.console-txt-h3
        color: #999999
        font-size: 14px
        i
            flex:0 0 30px
            width: 30px
            vertical-align: top
            font-size: 16px
        span
            line-height: 24px
    .meeting_main
        padding-left: 14px
        a
            display: flex
            padding: 12px 0
    .timer
        flex: 0 0 50px
        font-size: 12px
        span:last-child
            display: block
            color: #999999
            line-height: 20px
    .meetTxt
        flex: 1
        box-sizing: border-box
        padding: 0 16px
        font-size: 15px
        line-height: 20px
        height: 40px
        border-left-px(1px, rgba(0, 0, 0, 0.05))
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    .list-handle
        line-height: 40px
        height: 40px
</style>
