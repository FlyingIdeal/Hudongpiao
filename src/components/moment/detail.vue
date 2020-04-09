<template>
    <div>
        <div class="head-back">
            <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')" v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
            <h2 class="headerTitle" title="详情" v-text="$t('Moment.Detail')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat m-center">
            <div class="shadow m-list" :themeId='themeObj.theme.themeId' v-if="themeObj">
                <div class="m-list-top">
                    <router-link class="link" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: themeObj.theme.userId}}">
                        <div class="infro">
                            <div class="photo"><img v-if="themeObj.theme.userImg" v-lazy="themeObj.theme.userImg" /><img v-else src="~@/common/images/default.png" /></div>
                            <div class="text">
                                <h6 v-text="themeObj.theme.userName"></h6>
                                <p v-text="themeObj.theme.company"></p>
                                <p v-text="themeObj.theme.position"></p>
                            </div>
                        </div>
                    </router-link>
                    <div class="list-handle" v-if="!themeObj.theme.jsonStr" :themeId= 'themeObj.theme.themeId' :handleType="themeObj.theme.creater == 1 ? 'delete' : 'complaint'" @click="topicHandle(themeObj.theme, 'theme')"><i class="icon-botarrow"></i></div>
                </div>
                <div class="m-list-text" v-if="themeObj.theme.content || themeObj.theme.img">
                    <p v-text="themeObj.theme.content" v-if="themeObj.theme.content"></p>
                    <div class="img" v-if="themeObj.theme.img"><img @click="wxScaleBigImg(themeObj.theme.img)" v-lazy="themeObj.theme.img"></div>
                </div>
                <!--时间-->
                <div class="m-list-time">
                    <span class="m-creat-time" v-text="themeObj.theme.showTime"></span><em v-if="themeObj.theme.theme" title="在">{{$t("IneractCircle.At")}}</em><router-link class="at" :to="{path:'/schedule/detail', query:{projectId: projectId, passKey: passKey, detailId: themeObj.theme.scheduleId, type:'appScheduleModule'}}" v-if="themeObj.theme.theme" v-text="themeObj.theme.theme"></router-link>
                </div>
            </div>
            <!--评论和点赞-->
            <div>
                <div class="topic-coment-list">
                    <div class="topic-coment-tab">
                        <span class="active" title="评论">{{$t("Moment.Comments")}} <em v-if="listArr.length > 0">{{listArr.length}}</em></span>
                        <span v-if="themeObj" title="赞">{{$t("Moment.Like")}} <em v-if="themeObj.theme.likedNum > 0" v-text="themeObj.theme.likedNum"></em></span>
                    </div>
                    <div id="loadWrapper">
                        <div class="listCol">
                            <div class="main-comment-detail shadow">
                                <template v-for="(value, key) in listArr">
                                    <!--如果没有parentId则说明为一级回复-->
                                    <div class="main-comment-list" v-if="!value.parentId">
                                        <router-link class="link" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.userId}}">
                                            <div class="photo"><img v-if="value.userImg" v-lazy="value.userImg" /><img v-else src="~@/common/images/default.png" /></div>
                                        </router-link>
                                        <div class="text">
                                            <h4 class="name" v-text="value.userName"></h4>
                                            <h6 class="content" v-text="value.content" :themeId= 'value.contentId' :handleType="value.creater == 1 ? 'delete' : 'complaint'" @click="topicHandle(value, 'content')"></h6>
                                            <p class="time"><span v-text="value.showTime"></span><em v-if="value.creater == 1" title="删除" v-text="$t('RegLogin.Delete')" @click="contentDelete(value)"></em></p>
                                            <!--评论二次回复区-->
                                            <div class="comment-reply">
                                                <template v-for="(item, index) in listArr">
                                                    <div class="comment-reply-list" v-if="item.parentId && item.parentId==value.contentId">
                                                        <router-link class="link" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: item.userId}}">
                                                            <div class="photo"><img v-if="item.userImg" v-lazy="item.userImg" /><img v-else src="~@/common/images/default.png" /></div>
                                                        </router-link>
                                                        <div class="text">
                                                            <h4 class="name"><span v-text="item.userName"></span><em v-text="item.showTime"></em></h4>
                                                            <h6 class="content" :themeId= 'item.contentId' :handleType="item.creater == 1 ? 'delete' : 'complaint'" @click="topicHandle(item, 'content')"><em title="回复" v-text="$t('ExchangeCard.Reply')" v-if="item.level == 3"></em><span class="to-who" v-if="item.level == 3">{{item.toUserName}}:</span><span v-text="item.content"></span></h6>
                                                            <p class="time" v-if="item.creater == 1"><span title="删除" v-text="$t('RegLogin.Delete')"  @click="contentDelete(item)"></span></p>
                                                        </div>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--删除、投诉底部-->
            <v-actionsheet :class="sheetType" :actions="sheetAction" v-model="sheetVisible"></v-actionsheet>
            <!--投诉-->
            <v-complain ref="complain"></v-complain>
            <!--底部评论和点赞-->
            <div class="comment-like-handle" v-if="themeObj">
                <a href="javascript:void(0);" @click="reply(themeObj.theme, 'theme')"><i class="icon-topic2"></i><span v-text="listArr.length" v-if="listArr.length > 0"></span></a>
                <a href="javascript:void(0);" :class="[themeObj.theme.liked == '1' ? 'icon-color' : '']" @click="likedLogs"><i class="icon-like" :class="[themeObj.theme.liked == '1' ? 'icon-liked' : '']"></i><span v-text="themeObj.theme.likedNum" v-if="themeObj.theme.likedNum > 0"></span></a>
            </div>
            <!--评论回复输入框-->
            <v-reply ref="reply" :limit="300" :moduleType="'circle'" :moduleId="themeId" :touserId="touserId" :level="level" :parentId="parentId" :placeholder="placeholder" v-on:replayReresh="_replayReresh"></v-reply>
        </div>
    </div>
</template>
<script>
import { Actionsheet, MessageBox } from 'mint-ui';//操作表，从屏幕下方移入。
import {commonAjaxFun, deleteContent, deleteTheme, wxScaleBigImg, mainUserTk, initAllWeiXin} from '../../common/js/common.js'
import complain from '../module/complain/complain.vue'//投诉
import vReply from '../module/reply/reply.vue'

export default {
    data(){
        return {
            sheetComplain: [
                {
                    'name' : this.$t("ExchangeCard.Reply"),//回复
                    'method': this.reply
                },
                {
                    'name' : this.$t("RegLogin.Flag"),//投诉
                    'method': this.complain
                }
            ],
            sheetDelete: [
                {
                    'name' : this.$t("ExchangeCard.Reply"),//回复
                    'method': this.reply
                },
                {
                    'name' : this.$t("RegLogin.Delete"),//删除
                    'method': this.deleteTopic
                }
            ],
            sheetAction: [],
            sheetType: '',//根据当前类型，去选择class
            sheetVisible: false,//控制底部的显示隐藏
            deleteThemeid: '',//要删除的themeid
            droploadObj: {},//下拉加载
            listArr: [],//数据列表
            queryTime: '',//下拉加载所需参数，其实为时间
            level: 1,//默认回复层级
            parentId: '',//回复话题的上一级
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            wxShare: `${this.$route.query.wxShare}`,//是否来自微信分享，如果是true，则返回首页，否则返回上一级
            themeId: `${this.$route.query.themeId}`,
            childId: `${this.$route.query.childId}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            moduleType: 'circleTheme',
            touserId: '',//to回复者
            placeholder:'',//输入框占位符
            themeObj: ''//话题详情-对象
        }
    },
    mounted(){
        this.getTheme();
        this.dropload();//加载评论
    },
    components: {
        vActionsheet: Actionsheet,
        vComplain: complain,
        vReply: vReply
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
        getTheme: function(){
            //主话题-详情
            let _this = this;
            commonAjaxFun({
                url: '/interactCircle/getTheme',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    themeId: `${this.$route.query.themeId}`
                }
            }).then((data) => {
                let _data = data.data;
                if(data.state == '0') {
                    _this.themeObj = _data;

                    //次判断用于来宾详情页面单独微信分享
                    if(_this.needSingleWx) {
                        let desc = '';
                        let title = _data.theme.content
                        let link = _this.toFullPath;

                        initAllWeiXin(_this.projectId, _this.passKey, 'momentDetail', {}, {
                            desc: desc,
                            title: title,
                            link: link
                        })
                    }

                } else {
                    console.log(data.message)
                }
                
            })
        },
        loadDownFnMethods: function(me){//加载更多
            let _this = this;

            commonAjaxFun({
                url: '/interactTopic/getContentList',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    moduleType: 'circle',
                    moduleId: _this.themeId,
                    queryTime: _this.queryTime
                }
            }).then((data) => {

                let _data = data.data;

                try{
                    //加载完成
                    if(data.state == '0'){
                        if (_data.list.length > 0){
                            _this.listArr = _this.listArr.concat(_data.list);

                            _this.$nextTick(function() {
                                me.resetload();
                            })

                            _this.queryTime = _data.queryTime;

                        } else {
                            me.lock();// 锁定
                            me.noData();//无数据
                            me.resetload();
                        }
                    }

                }catch(err){
                    console.log(err)
                }
            })
        },
        dropload: function(){
            let _this = this;
            //正常情况
            _this.droploadObj = $('#loadWrapper').dropload({
                scrollArea: window,
                threshold: 50,
                domUp : {
                    domClass: "dropload-up",
                    domRefresh: '<div class="dropload-refresh">↓' + _this.$t('CommonUse.DropRefresh') + '</div>',//↓下拉刷新
                    domUpdate: '<div class="dropload-update">↑' + _this.$t('CommonUse.ReleaseRefresh') + '</div>',//↑释放更新
                    domLoad: '<div class="dropload-load"><span class="loading"></span>' + _this.$t('CommonUse.Refresh') + '</div>'//刷新中
                },
                domDown : {
                    domClass: 'dropload-down',
                    domRefresh: '<div class="dropload-refresh">↑' + _this.$t('CommonUse.PullMore') + '</div>',//↑上拉加载更多
                    domLoad: '<div class="dropload-load"><span class="loading"></span>' + _this.$t('CommonUse.Loading') + '</div>',//加载中...
                    domNoData: '<div class="dropload-noData">' + _this.$t('CommonUse.NoMoreInfor') + '</div>'//没有更多内容了
                },
                loadDownFn: function(me){
                    _this.loadDownFnMethods(me);
                }
            })
        },
        complain: function(){
            //调用子组件里的显示右侧投诉
            this.$refs.complain.handleComplain(this.childId, this.deleteThemeid, this.moduleType);
        },
        _replayReresh: function(){
            //回复之后的操作
            this.queryTime = '';
            this.listArr = [];

            this.droploadObj.resetload();
            this.loadDownFnMethods(this.droploadObj);
            this.droploadObj.unlock();
            this.droploadObj.noData(false);
        },
        reply: function(theme, type){
            //回复
            
            //首先判断是否登陆
            if(!this.loginState){
                
                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
                return false;
            }
            
            if(type == 'theme'){//底部按钮是对主话题评论，此时placeholder,parentid,level，touserId相当于重置
                this.placeholder = '';
                this.parentId = '';
                this.level = 1;
                this.touserId = theme.userId;
            }

            this.$refs.reply.hideMaskShadow();
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

                        setTimeout(() => {
                            _this.$router.go(-1)
                        }, 500)

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
        contentDelete: function(value){
            //删除话题评论
            let _this = this;

            MessageBox.confirm(_this.$t('layerTips.DeleteTips')).then(action => {//确定删除

                _this.$layer.loading(_this.$t('layerTips.Deleting'));//正在删除，请稍后！

                deleteContent(_this.projectId, value.contentId).then((data) => {
                    //console.log(data)
                    _this.$layer.close();

                    if(data.state == '0'){

                        _this.$layer.toast({content: _this.$t('layerTips.DeleteSuccess')});//删除成功
                        
                        _this._replayReresh();

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
        topicHandle: function(theme, type){
            //话题操作，去判断删除还是投诉
            //此处有个type类型，区分主话题和评论，主话题底部只有投诉和删除，评论底部是要有投诉，删除，回复

            //首先判断是否登录
            if(!this.loginState){

                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
                return false;
            }

            let _type = theme.creater == 1 ? 'delete' : 'complaint';
            let _id = theme.themeId;

            //如果为内容，点击回复要加名字
            if(type == 'content'){
                this.placeholder = !!theme.userName ? (this.$t('ExchangeCard.Reply') + ':') + theme.userName : '';//回复:
                this.level = parseInt(theme.level) + 1;
                this.parentId = this.level == 2 ? theme.contentId : theme.parentId;//如果是对一级评论，则当前的parentid就是contentid, 如果对二级或三级回复，此时相当于永久对一级回复，所以处理当前的parentid即为目标评论的id
                this.touserId = theme.userId;
            } else {
                this.placeholder = '';
            }

            if(_type == 'complaint'){
                this.sheetVisible = true;
                this.sheetAction = this.sheetComplain;
                this.sheetType = type == 'theme' ? 'sheet-complain sheet-onlyTwo' : 'sheet-complain';
                this.deleteThemeid = _id;
            } else if(_type == 'delete'){
                this.sheetVisible = true;
                this.sheetAction = this.sheetDelete;
                this.sheetType = type == 'theme' ? 'sheet-delete sheet-delete-relay sheet-onlyTwo' : 'sheet-delete sheet-delete-relay';
                this.deleteThemeid = _id;
            } else {
                this.sheetVisible = false;
                this.deleteThemeid = '';
            }
        },
        likedLogs: function(){
            //点赞
            let _this = this;
            _this.$layer.loading();

            commonAjaxFun({
                url: '/interactTopic/likedLogs',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    moduleType:'circle',
                    moduleId: _this.themeId
                }
            }, 200).then((data) => {

                _this.$layer.close();
                
                if(data.state == '0') {
                    //成功
                    _this.getTheme();//点赞之后刷新主题

                } else if (data.state == '10006') {
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

.topic-coment-tab
    padding: 0 14px
    background-color: #fff
    border-bottom-px(1px, rgba(0,0,0,.05))
    span
        display: inline-block
        line-height: 36px
        color: #999
        margin-right: 16px
        border-bottom: 2px solid transparent
        em
            font-style: normal
    span.active
        color: #333
        border-bottom: 2px solid #F35B00

.main-comment-detail
    margin-top: 0px
.comment-like-handle
    position: fixed
    background-color: #fff
    width: 100%
    left: 0px
    bottom: 0px
    padding: 10px 0
    box-shadow: 0px -1.5px 1.5px 0px rgba(0, 0, 0, 0.16)
</style>
