<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <div class="headerTab">
                <router-link :class='$t("CommonUse.TransSize")' :to="{path:'/moment/index', query:{projectId: projectId, passKey: passKey}}" title="动态" v-text="$t('Headers.IneractCircle')"></router-link>
                <!-- <router-link title="日程" :class='$t("CommonUse.TransSize")' :to="{path:'/schedule/index', query:{projectId: projectId, passKey: passKey}}" v-text="$t('HomePage.Schedule')"></router-link> -->
                <a class="active" :class='$t("CommonUse.TransSize")' href="javascript:void(0);" title="互动话题" v-text="$t('Forum.Forum')"></a>
            </div>
            <div class="Occupy" @click="createTopic"><i class="icon-addtopic"></i></div>
        </div>
        <div class="boothIndex topSeat botSeat">
            <!--ticket banner-->
            <v-home-banner-ad></v-home-banner-ad>
            <div class="sticky-area">
                <div class="cell-filter">
                    <div class="cell-filter-box">
                        <ul>
                            <li title="最新" class="active" @click="changeSearchTag($event,'new')"><span>{{$t("Forum.New")}}</span></li>
                            <li title="最热" @click="changeSearchTag($event,'hot')"><span>{{$t("Forum.Hot")}}</span></li>
                            <!-- <li title="我的" @click="changeSearchTag($event,'mine')"><span>{{$t("Forum.Mine")}}</span></li> -->
                        </ul>
                    </div>
                </div>
            </div>
            <div class="topic listCol-arraw">
                <div class="mine-nolist-tips" v-if="!tagmineFlag && tagmine == 'mine'">
                    <i class="icon-emptybowl"></i>
                    <p title="快来说说您的看法吧">{{$t("Messaging.LeaveTips")}}</p>
                    <a title="发起话题" href="javascript: void(0);" @click="createTopic" class="create-btn">{{$t("ForumCreate.Title")}}</a>
                </div>
                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad' v-show="!(!tagmineFlag && tagmine == 'mine')"> 
                    <slot>
                        <topicList :tochildlist='listArry' :listObj="listObj"></topicList>
                    </slot>
                </v-load>
            </div>
        </div>
        <v-footer :showClass="'discovery'"></v-footer>
    </div>
</template>
<script>

import vLoad from '../module/loadmore/dropload.vue'
import { mainUserTk, commonAjaxFun } from '../../common/js/common.js'
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import topicList from './list.vue'//互动话题
import vHomeBannerAd from "../module/ad/homeBannerAd"//banner轮播广告

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            tagmineFlag: false,//我的，列表长度
            tagmine: '',//标签名称
            listArry:[],
            listObj:{},
            page:0,
            searchTag:"new",
            createTime:null
        }
    },
    components: {
        vLoad,
        vLoginicon,
        vFooter,
        topicList,
        vHomeBannerAd
    },
    methods: {
        _getList: function(me, type) {
            //下拉，加载 请求数据
            var _this = this;

            commonAjaxFun({
                url: '/interactTopic/getThemeList',
                data: {
                    projectId: _this.projectId,
                    type: _this.searchTag,
                    page: _this.page,
                    createTime: null
                }
            }).then((data) => {

                let _data = data.data;
                _this.page = _this.page + 1;

                _this.listArry = type == 'up' ? _data.themeList : _this.listArry.concat(_data.themeList);

                _this.listObj = _data.mainTheme;
                _this.createTime = _data.queryDate;

                _this.tagmineFlag = _this.listArry.length == 0 ? false : true;

                if (_data.themeList.length == 0) {
                    me.lock();
                    me.noData();
                    me.resetload();
                } else {
                    _this.$nextTick(function() {
                        me.resetload();
                    })
                }
            })
        },
        loadDownFn: function(me) {
            this._getList(me)
        },
        loadUpFn: function(me) {
            this.page = 0;
            me.resetload();
            this._getList(me, "up");
            me.unlock();
            me.noData(false);
        },
        linkToFriend: function(){
            //到好友页面，首先登录
            //首先判断是否登录
            if(!this.loginState){

                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl
                
                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
                return false;
            } else {
                this.$router.push({path : '/attendguest/friend', query: {projectId: this.projectId, passKey: this.passKey}});//主页
            }
        },
        createTopic: function(){
            //创建话题
            if(!this.loginState){

                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl
                
                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
                return false;
            } else {
                this.$router.push({path : '/topic/create', query: {projectId: this.projectId, passKey: this.passKey}});//主页
            }
        },
        _childLength: function(length){
            this.tagmineFlag = length == 0 ? false : true;
        },
        clearListArry: function() {
            this.page = 0;
            this.listArry = [];
            this.$refs.vLoad.change()
        },
        changeSearchTag: function(e, val) {
            this.searchTag = val;
            this.createTime = null;

            if (val !== 'new') {
                this.listObj = {};
            }
            this.clearListArry();

            if (val == 'mine') {
                this.tagmine = 'mine';
            } else {
                this.tagmine = '';
            }

            //tag active 切换
            let dom = $(e.currentTarget);
            dom.siblings().removeClass('active');
            dom.addClass('active');
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/function.styl"
.header .Occupy i
    color: #f35b00
.sticky-area
    .cell-filter
        padding: 0px
        border-bottom-px(1px, rgba(0,0,0,.05))
        ul
            display: flex
            li
                flex: 1
                padding: 0px
                height: 42px
                text-align: center
                &.active
                    span
                        color: #F35B00
                        border-bottom: 3px solid #F35B00
                span
                    color: #999999
                    display: inline-block
                    height: 42px
                    line-height: 42px
                    box-sizing: border-box
                    padding: 0 6px
                    border-bottom: 3px solid transparent
</style>
