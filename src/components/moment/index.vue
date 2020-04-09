<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <div class="headerTab">
                <a class="active" :class='$t("CommonUse.TransSize")' href="javascript:void(0);" title="动态" v-text="$t('Headers.IneractCircle')"></a>
                <!-- <router-link :class='$t("CommonUse.TransSize")' :to="{path:'/schedule/index', query:{projectId: projectId, passKey: passKey}}" title="日程" v-text="$t('HomePage.Schedule')"></router-link> -->
                <router-link title="互动话题" :class='$t("CommonUse.TransSize")' :to="{path:'/topic/index', query:{projectId: projectId, passKey: passKey}}" v-text="$t('Forum.Forum')"></router-link>
            </div>
            <a class="Occupy" @click="createMoment" href="javascript:void(0);"><i class="icon-camera"></i></a>
        </div>
        <div class="moment topSeat botSeat">
            <!--ticket banner-->
            <v-home-banner-ad></v-home-banner-ad>
            <!--有新消息通知-->
            <div class="moment-new" v-if="recentlyMsgObj && recentlyMsgObj.count > 0">
                 <router-link :to="{path:'/moment/mymessage', query:{projectId: projectId, passKey: passKey}}" title="4条新消息">
                     <div class="photo"><img v-if="recentlyMsgObj.img" v-lazy="recentlyMsgObj.img" /><img v-else src="~@/common/images/default.png" /></div>
                     <p>{{recentlyMsgObj.count}}{{$t("Moment.NewMessages")}}</p>
                     <i class="icon-rightarrow"></i>
                 </router-link>
            </div>
            <!--话题列表为空的情况  v-if="listArry.length == 0" -->
            <div class="mine-nolist-tips"  v-show="createFlag">
                <i class="icon-emptybowl"></i>
                <p title="快来说说您的看法吧">{{$t('IneractCircle.Wait')}}</p>
                <a title="发起话题" href="javascript: void(0);" @click="createMoment" class="create-btn">{{$t('CommonUse.Post')}}</a>
            </div>

            <div class="momentList">
                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                    <slot>
                        <boothList :tochildlist='listArry'></boothList>
                    </slot>
                </v-load>
            </div>
        </div>
        <v-footer :showClass="'discovery'"></v-footer>
    </div>
</template>
<script>
import vLoginicon from '../module/loginicon/loginicon.vue'
import boothList from './list.vue'//引入展位列表模块
import vFooter from "../module/footer/footer"
import { mainUserTk, commonAjaxFun } from '../../common/js/common.js'
import vLoad from '../module/loadmore/dropload.vue'
import BScroll from 'better-scroll';
import vHomeBannerAd from "../module/ad/homeBannerAd"//banner轮播广告

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            listArry:[],
            createFlag:false,
            queryTime:"",
            recentlyMsgObj: ''//最新消息个数
        }
    },
    components: {
        vLoad,
        vLoginicon,
        vFooter,
        boothList,
        vHomeBannerAd
    },
    mounted(){
        if(!!this.loginState){//登录情况下，获取最新消息个数
            this.recentlyMsg();//获取最新消息个数
        }
    },
    methods: {
        _getList: function(me, type) {
            //下拉，加载 请求数据
            let _this = this;
            commonAjaxFun({
                url: '/interactCircle/getThemeList',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    type: 'normal',
                    queryTime: _this.queryTime
                }
            }).then((data) => {

                let _data = data.data;
            
                _this.listArry = type == 'up' ? _data.list : _this.listArry.concat(_data.list);
                _this.queryTime = data.data.queryTime;

                _this.createFlag = _this.listArry.length > 0 ? false :true;

                if (data.state == "9001" || data.state == "0") {

                    if (_data.list.length == 0) {

                        if(_this.listArry.length == 0){
                            $(".momentList").hide()
                        }else{
                           $(".momentList").show() 
                        }

                        me.lock();
                        me.noData();
                        me.resetload();
                    } else {
                        _this.$nextTick(function() {
                            me.resetload();
                        })
                    }
                }

            })
        },
        loadDownFn: function(me) {
            this._getList(me);
        },
        loadUpFn: function(me) {
            this.queryTime = "";
            me.resetload();
            this._getList(me, "up");
            me.unlock();
            me.noData(false);
        },
        createMoment: function(){
            //创建动态

            //首先判断是否登录
            if(!this.loginState){
                
                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
            } else {
                this.$router.push({path : '/moment/create', query: {projectId: this.projectId, passKey: this.passKey}});
            }

        },
        recentlyMsg: function() {
            //进入朋友圈页面显示几条最新信息提示
            let _this = this;

            commonAjaxFun({
                url: '/interactCircle/recentlyMsg',
                data: {
                    projectId: _this.projectId,
                    userTk: _this.mainUserTk
                }
            }).then((data) => {

                try {

                    let _data = data.data;

                    if (data.state == '0') {
                        _this.recentlyMsgObj = _data;
                    } else {
                        console.log(data.message);
                    }

                } catch (e) {
                    console.log(e);
                }

            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.header .Occupy i.icon-camera
    font-size: 26px
    color: #f35b00
.moment-new
    padding: 10px 0
    text-align: center
    font-size: 0px
    a
        display: inline-block
        padding: 5px
        border-radius: 3px
        background-color: #fff
        font-size: 0px
        vertical-align: top
        .photo
            display: inline-block
            width: 30px
            height: 30px
            font-size: 0px
            line-height: 30px
            overflow: hidden
            border-radius: 2px
            text-align: center
            border: 1px solid rgba(230,230,230, 0.2)
            box-sizing: border-box
            vertical-align: top
            img
                max-width: 28px
                max-height: 28px
                vertical-align: middle
        p
            font-size: 14px
            display: inline-block
            line-height: 30px
            vertical-align: top
            margin: 0 6px
            color: #F35B00
        i
            font-size: 12px
            display: inline-block
            vertical-align: top
            line-height: 30px
            color: #ccc
</style>
