<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" title="我的消息" v-text="$t('Me.MyNotifications')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <div v-if="loginFlag">
                <v-error :message="errorMessage"></v-error>
            </div>
            <div class="sticky-area" v-if="!loadState && !loginFlag">
                <div class="search-bar">
                    <div class="search-inner">
                        <i class="icon-search"></i>
                        <input type="text" v-model.trim="searchval" title="请输入姓名、消息内的关键字" name="text" :placeholder="$t('Person.keyword')">
                    </div>
                    <div class="search-btn" title="搜索" @click="changeSearchVal" v-text='$t("CommonUse.Search")'></div>
                </div>
            </div>
            <div class="listCol" v-if="!loadState && !loginFlag">
                <ul class="in-list">
                    <li>
                        <router-link :to="{path:'/notice/list', query:{projectId: projectId, passKey: passKey}}">
                            <div class="infro">
                                <div class="photo"><i class="num" v-if="systemMessage.count > 0" v-text='systemMessage.count'></i><img src="~@/common/images/system.jpg" /></div>
                                <div class="text">
                                    <h6><span class="notice-name" title="系统小秘书">{{$t("Person.SystemAssistant")}}</span><span class="notice-time" v-text="systemMessage.timer"></span></h6>
                                    <p v-html='systemMessage.message'></p>
                                </div>
                            </div>
                        </router-link>
                    </li>
                    <li v-for="(value, key) in tochildlist" :akey="key">
                        <div class="infro">
                            <router-link class="toAttend" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.userid}}">
                                <div class="photo"><i class="num" v-if="value.noReadNum > 0" v-text='value.noReadNum'></i><img v-if="value.headPortrait" v-lazy="value.headPortrait" /><img v-else src="~@/common/images/default.png" /></div>
                            </router-link>
                            <router-link class="toChat" :to="{path:'/chat/index', query:{projectId: projectId, passKey: passKey, userid: value.userid}}">
                                <div class="text">
                                    <h6><span class="notice-name" v-text="value.userName"></span><span class="notice-time" v-text="value.createTime"></span></h6>
                                    <p v-text="value.content"></p>
                                </div>
                            </router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <v-footer :showClass="'notice'"></v-footer>
    </div>
</template>

<script>

import {mainUserTk, commonAjaxFun} from '../../common/js/common.js'
import headTitle from '../module/head/headTitle.vue'//公共头部
import loadState from '../module/loadState/loadState.vue'//加载状态
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import vError from '../module/error/error.vue'

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            loadState: true,//初次进页面加载中
            tochildlist: [],//消息列表数组
            loginFlag: false,//登陆提示
            errorMessage: '',//登陆提示语
            searchval:'',//搜索查询
            systemMessage: {
                message: '',
                count: 0,
                timer: '',
                allCount: ''
            }
        }
    },
    components: {
        headTitle,
        loadState,
        vLoginicon,
        vFooter,
        vError
    },
    mounted(){
        this.getChatList();
    },
    methods: {
        changeSearchVal: function(){
            this.getChatList();
        },
        getChatList: function(){
            //获取消息列表
            let _this = this;
            commonAjaxFun({
                url: '/messageTool/chat/getChatList',
                data: {
                    userTk: mainUserTk,
                    searchStr: _this.searchval
                }
            }).then((data) => {
                try{

                    let _data = data.data;
                    _this.loadState = false;

                    if(data.state == '0') {
                        
                        _this.tochildlist = _data.list;

                        //格式化系统小秘书
                        if(_data.message) {
                            _this.setSystemMessage(_data);
                        }
                    } else {
                        _this.loginFlag = true;
                        _this.errorMessage = data.message;
                    }

                }catch(err){
                    console.log(err)
                }
            })
        },
        setSystemMessage: function(_data){
            //系统小秘书

            let _mesData = _data.message;
            let _mesInfro = '';

            if(_mesData.args) {
                _mesInfro = $.parseJSON(_mesData.args);
            }

            if(_mesData.type == 'card') {
                let _comStr = _mesInfro.company ? _mesInfro.company + "," : "";
                let _posStr = _mesInfro.position ? _mesInfro.position + "," : "";

                this.systemMessage.message = _comStr + _posStr + _mesInfro.name + "," + this.$t('ExchangeCard.RequestExchange');//希望与您交换联系方式
            } else if(_mesData.type == 'broadcast'){
                this.systemMessage.message = _mesData.title;
            } else if(_mesData.type == 'circle') {
                this.systemMessage.message = $.parseJSON(_mesData.args).name + this.$t('Person.ReplyMoment') + '"' + _mesData.content + '"';//在您创建的动态中，回复了您
            } else if(_mesData.type == 'topic') {
                this.systemMessage.message = $.parseJSON(_mesData.args).name + this.$t('Person.At') + $.parseJSON(_mesData.args).theme + this.$t('Person.Reply') ;//在您创建的《'dasdada'》中，回复了您
            } else if(_mesData.type == 'needs') {
                this.systemMessage.message = _mesData.title.replace(/<a(.*?)<\/a>/g,"")
            } else if(_mesData.type == 'boothSub') {
                this.systemMessage.message = _mesData.title
            }

            this.systemMessage.timer = _mesData.createTime;
            this.systemMessage.count = _data.count;
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/function.styl"
.listCol ul.in-list
    a.toAttend
        flex: 0 0 50px
        width: 50px
    a.toChat
        flex: 1
    .infro
        width: 100%
        .photo
            width: 50px
            height: 50px
            flex: 0 0 50px
            line-height: 48px
            overflow: inherit
            .num
                position: absolute
                right: -8px
                top: -8px
                width: 16px
                height: 16px
                border-radius: 50%
                background-color: #F35B00
                color: #fff
                border: 1px solid #fff
                text-align: center
                line-height: 14px
                font-size: 12px
            img
                max-width: 48px
                max-height: 48px
        .text
            padding: 3px 10px
            h6
                display: flex
                height: 20px
                line-height: 20px
                .notice-time
                    flex: 0 0 120px
                    width: 120px
                    color: #999
                    font-size: 12px
                    text-align: right
                .notice-name
                    flex: 1
                    font-weight: 600
                    font-size: 15px
                    overflow: hidden
                    display: -webkit-box
                    -webkit-box-orient: vertical
                    -webkit-line-clamp: 1
            p
                margin-top: 4px
                font-size: 12px
                color: #999
</style>
