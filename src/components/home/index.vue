<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <div class="header-search">
                <input v-model.trim="searchval" @keyup.enter="searchRoute" class="header-search-input" maxlength="10" :placeholder="$t('Exhibitor.keyword')" type="text" name="" />
                <i class="icon-close" v-if="searchval" @click="clearSearchVal"></i>
                <i class="icon-search" @click="searchRoute"></i>
            </div>
            <div class="switchLan"><i :class="[language == 'ch' ? 'icon-zh' : 'icon-en' ]" v-if="languageFlag"  @click="switchLan"></i></div>
        </div>
        <div class="ticketMain topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <div v-show="!loadState">
                <!--ticket banner-->
                <v-home-banner-ad></v-home-banner-ad>
                <!--展会简介-->
                <div class="infroBasic" v-if="Infro">
                    <h3 class="console-txt-line" @click="toggleShowInfro($event)"><span>{{Infro.basicInfo.meetingName}}</span><i class="icon-uparrow" :class="[toggleShowInfroFlag ? '' : 'icon-botarrow']"></i></h3>
                    <!--基本信息-->
                    <ul class="infroList" v-show="toggleShowInfroFlag">
                        <li class="infroList-normal"><router-link v-if="scheduleModule.beanName" :to="{path:'/schedule/index', query:{projectId: projectId, passKey: passKey, childId: scheduleModule.projectId, childpassKey: scheduleModule.passKey, appId: scheduleModule.appId, type: scheduleModule.beanName, title: scheduleModule.appName}}"><i class="icon-riqi"></i><span>{{Infro.basicInfo.startTime | formatDate}}  - {{Infro.basicInfo.endTime | formatDate}}</span><i class="icon-rightarrow"></i></router-link><a href="javascript:void(0);" v-else><i class="icon-riqi"></i><span>{{Infro.basicInfo.startTime | formatDate}}  - {{Infro.basicInfo.endTime | formatDate}}</span></a></li>
                        <li class="infroList-normal"><a :href="InfroMapAddressUrl" target="_blank"><i class="icon-place"></i><span>{{Infro.basicInfo.address}}</span><i class="icon-rightarrow"></i></a></li>
                        <li class="infroList-normal"><a href="javascript:void(0);"><i class="icon-sponsor"></i><span>{{Infro.basicInfo.meetingOrganizers}}</span></a></li>
                        <li class="button_collect" v-show='userInfo && Infro.isSignup == "1"' style="display: none;"><span @click="yuBaoMingClick" title="注册" v-text="registerBtn"></span></li>
                    </ul>
                </div>
                <!--tab 四个按钮 -游客-->
                <div class="home-tab" v-if="!userType">
                    <ul>
                        <li><router-link :to="{path:'/product/index', query:{projectId: projectId, passKey: passKey}}"><i class="icon-product"></i><span title="展品分类" v-text="$t('ExhibitorDetail.Exhibit')"></span></router-link></li>
                        <li v-if="boothMapHas">
                            <router-link v-if="boothMapFlag" :to="{path:'/map/index', query:{projectId: projectId, passKey: passKey}}"><i class="icon-address"></i><span v-text="$t('Exhibitor.BoothMap')"></span></router-link>
                            <a :href="boothMapUrl" v-else target="_blank"><i class="icon-address"></i><span v-text="$t('Exhibitor.BoothMap')"></span></a>
                        </li>
                        <li><router-link :to="{path:'/demand/index', query:{projectId: projectId, passKey: passKey}}"><i class="icon-need"></i><span v-text="$t('Demand.CreateDemand')"></span></router-link></li>
                        <li><router-link :to="{path:'/booth/index', query:{projectId: projectId, passKey: passKey}}"><i class="icon-booth"></i><span title="预约展商" v-text="$t('HomePage.Exhibitors')"></span></router-link></li>
                    </ul>
                </div>
                <!--tab 五个按钮 -销售 v-if="userType" -->
                <div class="home-tab" v-if="userType">
                    <ul>
                        <li><router-link :to="{path:'/booth/detail', query:{projectId: projectId, passKey: passKey, boothId: boothId}}"><i class="icon-mybooth"></i><span title="我的展位" v-text="$t('Exhibitor.myBooth')"></span></router-link></li>
                        <li><router-link :to="{path:'/invite/index', query:{projectId: projectId, passKey: passKey, boothId: boothId}}"><i class="icon-poster"></i><span title="邀请函" v-text="$t('CommonUse.Invitation')"></span></router-link></li>
                        <li><router-link :to="{path:'/moment/index', query:{projectId: projectId, passKey: passKey}}"><i class="icon-xuanchuan"></i><span title="动态宣传" v-text="$t('Headers.ActivityFeed')"></span></router-link></li>
                        <li><router-link :to="{path:'/product/index', query:{projectId: projectId, passKey: passKey}}"><i class="icon-product"></i><span title="展品分类/展品展商" v-text="$t('HomePage.ExhiB')"></span></router-link></li>
                        <li v-if="boothMapHas">
                            <router-link v-if="boothMapFlag" :to="{path:'/map/index', query:{projectId: projectId, passKey: passKey}}"><i class="icon-address"></i><span v-text="$t('Exhibitor.BoothMap')"></span></router-link>
                            <a :href="boothMapUrl" v-else target="_blank"><i class="icon-address"></i><span v-text="$t('Exhibitor.BoothMap')"></span></a>
                        </li>
                    </ul>
                </div>
                <!-- 广告条 -->
                <div class="home-guide-line" @click='guideLink'>
                    <img src="~@/common/images/guideline.png">
                </div>
                <!--广播-->
                <v-home-broadcast></v-home-broadcast>
                <!--我的商机管理-->
                <v-business-manage v-if="userType"></v-business-manage>
                <!--热门展品-->
                <div class="home-hot-product" v-if="hotProductList && hotProductList.length>0">
                    <h3 class="console-txt-title">
                        <i class="icon-hot"></i>
                        <p class="console-in-text" title="热门展品" v-text="$t('ExhibitorDetail.HotExhibits')"></p>
                        <div class="text-icon" @click="getHotProduct('hasload')">
                            <i class="icon-huanyipi"></i>
                            <span title="换一换" v-text="$t('CommonUse.Change')"></span>
                        </div>
                    </h3>
                    <div class="hot-product-list">
                        <ul>
                            <li v-for="value in hotProductList">
                                <router-link :to="{path:'/product/detail', query:{projectId: projectId, passKey: passKey, productId: value.id}}">
                                    <div class="home-hot-img"><img v-if="value.logo" :src="value.logo" /><img v-else src="~@/common/images/product.png" /></div>
                                    <h4 v-text="value.name"></h4>
                                    <p v-text="value.company"></p>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--热门展商-->
                <div class="home-hot-booth" v-if="hotBoothList && hotBoothList.length>0">
                    <h3 class="console-txt-title">
                        <i class="icon-hot"></i>
                        <p class="console-in-text" title="热门展商" v-text="$t('HomePage.HotExhibitors')"></p>
                        <div class="text-icon" @click="getHotBooth('hasload')">
                            <i class="icon-huanyipi"></i>
                            <span title="换一换" v-text="$t('CommonUse.Change')"></span>
                        </div>
                    </h3>
                    <div class="hot-booth-list">
                        <ul>
                            <li v-for="value in hotBoothList">
                                <router-link :to="{path:'/booth/detail', query:{projectId: projectId, passKey: passKey, boothId: value.id}}">
                                    <div class="home-hot-img"><img v-if="value.boothFigure" :src="value.boothFigure" /><img v-else src="~@/common/images/boothPhoto.png" /></div>
                                    <h4 v-text="value.company"></h4>
                                    <div class="home-hot-detail">
                                        <span title="件展品"><em v-text="value.productNum"></em> {{$t("ExhibitorDetail.Aexhibits")}}</span>
                                        <span title="个参展人员"><em v-text="value.contactNum">1024</em> {{$t("ExhibitorDetail.Aexhibitors")}}</span>
                                    </div>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--热门展商-广告位-->
                <v-home-single-ad></v-home-single-ad>
                <!--猜您喜欢-->
                <div class="home-hot-like" v-if="recommendList && recommendList.length>0">
                    <h3 class="console-txt-title">
                        <i class="icon-tuijian"></i>
                        <p class="console-in-text" title="猜您喜欢" v-text="$t('label.GuessYouLike')"></p>
                    </h3>
                    <div class="hot-like-list">
                        <ul>
                            <li v-for="(value, index) in recommendList" :akey = 'index'>
                                <router-link :to="{path:'/product/detail', query:{projectId: projectId, passKey: passKey, productId: value.id}}">
                                    <div class="home-hot-img"><img v-if="value.logo" v-lazy="value.logo" /><img v-else src="~@/common/images/product.png" /></div>
                                    <h4 v-text="value.name"></h4>
                                    <p v-text="value.company"></p>
                                </router-link>
                            </li>
                        </ul>
                        <div class="view-more" @click="getRecommend('hasload')" v-if="recommendMoreFlag">
                            <span title="点击加载更多">{{$t("CommonUse.More")}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--遮罩层-->
        <!--<div class="home-guide" v-show="hasLook"  @click="hideGuide">
            <div class="home-guide-center">
                <div class="guide-close" @click="hideGuide"></div>
                <div class="guide-img">
                     <img src="~@/common/images/guide.png">
                     <div class="guideLink" @click="guideLink"></div>
                </div>
            </div>
        </div> -->
        <v-footer :showClass="'home'"></v-footer>
    </div>
</template>

<script>

import loadState from '../module/loadState/loadState.vue'//加载状态
import {formatDate, land_url, filterCurrentModule, guestObjectToArr, commonAjaxFun, mainUserTk,uwin_url} from '../../common/js/common.js'
import vBrief from '../module/brief/brief.vue'
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import vHomeBannerAd from "../module/ad/homeBannerAd"//banner轮播广告
import vHomeSingleAd from "../module/ad/homeSingleAd"//首页下面单独v3广告
import vHomeBroadcast from "../module/ad/homeBroadcast"//首页消息广播
import vBusinessManage from "./businessManage"//我的商机管理


export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            localProName: `HDPHOME${this.$route.query.projectId}${this.$route.query.passKey}`, //本地存储项目名字，用于判断展会简介的toggle的显示隐藏
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            InfroMapAddressUrl: 'javascript:void(0);', //map->url
            loadState: true, //加载状态
            Infro: '',
            searchval: '', //搜索内容
            scheduleModule: '', //日程模块
            language: 'ch', //中英文,默认中文
            languageFlag: false, //是否显示中英文，false隐藏
            hotProductList: '', //热门展品
            hotBoothList: '', //热门展位
            recommendList: [], //热门推荐
            recommendMoreFlag: false, //猜你喜欢-加载更多
            recommendPage: 1, //recommend-ajax请求页码
            boothMapHas: false, //是否有展位地图
            boothMapUrl: '', //展位地图地址
            boothMapFlag: false, //有展位地图的情况下。判断是外链还是到/map/index
            userType: false, //是否为展商人员
            boothId: 0, //我的展位id
            registerBtn:""
        }
    },
    components: {
        vBrief,
        loadState,
        vLoginicon,
        vFooter,
        vHomeSingleAd,
        vHomeBannerAd,
        vHomeBroadcast,
        vBusinessManage
    },
    mounted(){
        this.getChildrenProject();
        this.getUsertype();//判断是普通观众或展位联系人
        this.getHotProduct();//热门展品
        this.getHotBooth();//热门展位
        this.getRecommend();//热门推荐-猜你喜欢
        this.getIsYuBaoMing()
    },
    destroyed(){
        localStorage.setItem(this.localProName, this.localProName);
    },
    computed: {
        hasLook: function() {
            let getProName = localStorage.getItem(this.localProName);
            if (!!getProName) {
                return false; //如果有了  则隐藏
            } else {
                return true; //如果没有  则显示
            }
        },
        userInfo() { //是否登陆
            if (this.Infro.userInfo) {
                return false
            }
            return true
        },
        toggleShowInfroFlag: function() {
            let toggleFlag = this.loginState
            if (!!toggleFlag) {
                return false; //如果有了  则隐藏
            } else {
                return true; //如果没有  则显示
            }
        },
        hotLanguage: function(){
            //当前cookie中的中英文, 默认中文
            let _lan = this.$cookie.get('language') || 'ch';
            return _lan;
        }
    },
    filters: {
        formatDate(time){
            let data = new Date(time.replace(new RegExp("-","gm"),"/"));
            return formatDate(data, 'yyyy/MM/dd HH:mm')
        }
    },
    methods: {
        getIsYuBaoMing: function(){
            //判断当前是否预报名，从而改变title,和-完善信息让您能更好的使用系统功能、
            let _this = this;
            commonAjaxFun({
                url: '/userForm/getIsYuBaoMing',
                data: {}
            }).then((data) => {
                try {
                    if(data.state == "0"){
                        if(data.data.isAdvance){
                            _this.registerBtn = _this.$t('label.PreRegistration');
                        } else {
                            _this.registerBtn = _this.$t('RegLogin.Register');
                        }
                       
                    } else {
                        console.log(data.message)
                    }

                } catch(err){
                    console.log(err)
                }
            })
        },
        yuBaoMingClick: function() {
            //点击预报名注册，记录本地存储
            localStorage.setItem(this.returnUrl, this.toFullPath); //本地存储backurl
            this.$router.push({path : '/login/register', query: {projectId: this.projectId, passKey: this.passKey ,language:'ch'}});
        },
        hideGuide: function(){
            //首页遮罩显示隐藏
            $('.home-guide').hide();
        },
        showGuide: function(){
            //首页遮罩显示隐藏
            $('.home-guide').show();
        },
        guideLink: function(){
            //点我创建跳转
            location.href = `${land_url}/landing/exhibitor?exhibitionId=${this.projectId}&passKey=${this.passKey}`
        },
        getRecommend: function(hasload){
            //热门推荐-猜你喜欢
            let _this = this;

            if(!!hasload) {
                _this.$layer.loading();
            }

            commonAjaxFun({
                url: '/homeData/getRecommend',
                data: {
                    projectId: _this.projectId,
                    page: _this.recommendPage,
                    language: _this.hotLanguage
                }
            }, 300).then((data) => {

                _this.$layer.close();

                try {
                    let _data = data.data;
                    if (data.state == '0') {
                        if(_data.length < 6) {
                            _this.recommendMoreFlag = false
                        } else {
                            _this.recommendMoreFlag = true
                        }

                        _this.recommendList = _this.recommendList.concat(_data);

                        _this.recommendPage++;

                    } else {
                        console.log(data.message);
                    }

                } catch (e) {
                    console.log(e)
                }
            })
        },
        getHotBooth: function(hasload){
            //热门展位
            let _this = this;

            if(!!hasload) {
                _this.$layer.loading();
            }

            commonAjaxFun({
                url: '/homeData/getHotBooth',
                data: {
                    projectId: _this.projectId,
                    language: _this.hotLanguage
                }
            }, 300).then((data) => {
                _this.$layer.close();

                try {
                    let _data = data.data;
                    if (data.state == '0') {
                        _this.hotBoothList = _data;
                    } else {
                        console.log(data.message);
                    }

                } catch (e) {
                    console.log(e)
                }
            })
        },
        getHotProduct: function(hasload){
            //热门展品
            let _this = this;

            if(!!hasload) {
                _this.$layer.loading();
            }

            commonAjaxFun({
                url: '/homeData/getHotProduct',
                data: {
                    projectId: _this.projectId,
                    language: _this.hotLanguage
                }
            }, 300).then((data) => {
                _this.$layer.close();
                try {
                    let _data = data.data;
                    if (data.state == '0') {
                        _this.hotProductList = _data;
                    } else {
                        console.log(data.message);
                    }

                } catch (e) {
                    console.log(e)
                }
            })
        },
        getUsertype: function() {
            //首页-判断是普通观众或展位联系人
            let _this = this;

            commonAjaxFun({
                url: '/homeData/getUsertype',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey
                }
            }).then((data) => {
                try {

                    let _data = data.data;

                    if (data.state == '0') {
                        _this.userType = _data.userType == '1' ? true : false;
                        _this.boothId = _data.boothId;
                    } else {
                        console.log(data.message);
                    }

                } catch (e) {
                    console.log(e)
                }
            })
        },
        searchRoute: function(){
            //搜索去展品
            if(!!this.searchval) {
                this.$router.push({path : '/product/index', query: {projectId: this.projectId, passKey: this.passKey, search: this.searchval}});
            } else {
                this.$router.push({path : '/product/index', query: {projectId: this.projectId, passKey: this.passKey}});
            }
        },
        clearSearchVal: function(){
            //清空搜索内容
            this.searchval = '';
        },
        _initMap: function(){
            //地图
            let x_location = this.Infro.basicInfo.xlocation;
            let y_location = this.Infro.basicInfo.ylocation;
            let title = this.Infro.basicInfo.address.toLowerCase();
            this.InfroMapAddressUrl = `https://api.map.baidu.com/marker?location=${y_location},${x_location}&title=${title}&content=&output=html&src=00`;
        },
        toggleShowInfro: function(event){
            let _dom = $(event.currentTarget);
            _dom.next().slideToggle(150);
            _dom.find('i').toggleClass('icon-botarrow');
        },
        moreLanguage: function(){
            //是否有中英文
            let _lan = this.$cookie.get('language') || 'ch';//当前cookie中的中英文

            if(_lan == 'ch') {
                this.language = 'en';
            } else {
                this.language = 'ch';
            }

            this.languageFlag = true;//显示中英文
        },
        switchLan: function(){
            //中英文切换

            let _lan = this.$cookie.get('language') || 'ch';//当前cookie中的中英文

            if(_lan == this.language) {
                return;
            }

            if(_lan == 'en') {
                this.$cookie.set('language', 'ch',  { expires: 7 });
            } else {
                this.$cookie.set('language', 'en',  { expires: 7 });
            }

            document.location.href = uwin_url + "/home/index?projectId=" + this.projectId + "&passKey=" + this.passKey + "&timer=" + new Date().getTime()
            // document.location.reload() //重刷新
        },
        getChildrenProject: function(){
            //停用vuex，改用公用ajax请求
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getChildrenProject',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey
                }
            }).then((data) => {

                try{

                    let _data = data.data;
                    _this.loadState = false;

                    if (data.state == '0') {

                        if(!!_data) {
                            // console.log(_data)
                            _this.Infro = _data;

                            //分模块数据
                            _this.scheduleModule = filterCurrentModule(_data.modules, 'appScheduleModule'); //拿到对应的日程模块

                            //是否有中英文
                            if (_data.isMoreLanguage) {
                                _this.moreLanguage();
                            }

                            //以下为是否有展位地图判断，和展位列表页右上角判断相同
                            _this.boothMapUrl = _data.basicInfo.boothMapLink;

                            if (!!_this.boothMapUrl) {
                                _this.boothMapHas = true;
                            } else {
                                _this.boothMapHas = false;
                            }

                            if (_this.boothMapUrl.indexOf('mapid') > 0) {
                                _this.boothMapFlag = true;
                            } else {
                                _this.boothMapFlag = false;
                            }


                            //会议地址
                            _this._initMap();

                        } else {
                            //当前展位不存在
                            _this.$router.push({path : '/error/404', query: {projectId: _this.projectId, passKey: _this.passKey, title:'当前会议不存在'}});
                        }

                    } else {
                        console.log(data.message);
                    }
                } catch(e) {
                    console.log(e)
                }

            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/function.styl"
.home-guide
    position: fixed
    left: 0px
    top: 0px
    z-index: 11
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0)
    .home-guide-center
        width: 320px
        height: 422px
        position: fixed
        left: 50%
        top: 50%
        margin: -211px 0 0 -160px
        .guide-close
            position: absolute
            top: 0px
            right: 0px
            width: 50px
            height: 50px
            i
                display: inline-block
                width: 30px
                height: 30px
                line-height: 30px
                text-align: center
                color: #fff
                font-size: 24px
    .guide-img
        font-size: 0px
        img
            max-width: 100%
        .guideLink
            position: absolute
            top: 332px
            left: 0
            right: 0
            width: 164px
            height: 50px;
            margin: auto
.switchLan
    flex: 0 0 45px
    text-align: center
    i
        flex: 1
        display: block
        height: 45px
        width: 45px
        text-align: center
        line-height: 45px
        color: #999999
.home-guide-line
    font-size: 0px
    margin-top: 10px
    img
        width: 100%
.infroBasic
    margin-bottom: 10px
    background-color: #fff
    .console-txt-line
        span
            font-size: 14px
            line-height: 24px
        i
            flex: 0 0 30px
            text-align: center
            color: #999
            line-height: 24px
            font-size: 14px
    .infroList
        padding-left: 10px
        padding-bottom: 2px
        .infroList-normal
            a
                display: flex
                padding: 6px 0
                font-size: 12px
                border-bottom-px(1px, rgba(0,0,0,.05))
                i
                    flex: 0 0 30px
                    color: #999
                    font-size: 18px
                    color: #f35b00
                    line-height: 22px
                    &:last-child
                        font-size: 12px
                        text-align: center
                        color: #999
                span
                    flex: 1
                    line-height: 22px
        .button_collect
            text-align:center
            padding: 6px 0
            span
                width: 80%
                background:#F35B00
                border-radius: 4px
                color:#ffffff
                height: 38px
                line-height: 38px
                box-sizing: border-box
                display: inline-block
                font-size: 16px
.home-tab
    padding: 20px 0
    background-color: #fff
    ul
        display: flex
        li
            flex: 1
            &:last-child
                a
                    border-right: none
            a
                font-size: 0px
                display: block
                text-align: center
                box-sizing: border-box
                border-right: 1px solid #D9D9D9
                i
                    display: inline-block
                    width: 24px
                    height: 24px
                    font-size: 22px
                    line-height: 24px
                    color: #F35B00
                    &.icon-classify
                        font-size: 20px
                span
                    display: block
                    margin-top: 2px
                    line-height: 24px
                    font-size: 12px
                    color: #333333
.hot-booth-list
    background-color: #fff
    padding: 10px 5px
    ul
        font-size: 0px
        li
            display: inline-block
            width: 50%
            padding: 0 5px
            box-sizing: border-box
            margin-bottom: 10px
            vertical-align: top
            a
                display: block
            .home-hot-img
                height: 92px
                line-height: 92px
                text-align: center
                img
                    max-width: 100%
                    max-height: 92px
                    vertical-align: middle
            h4
                font-size: 13px
                color: #333333
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
                height: 20px
                line-height: 20px
                margin: 4px 0
    .home-hot-detail
        text-align: left
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        span
            display: inline-block
            height: 20px
            line-height: 20px
            font-size: 12px
            margin-right: 4px
            color: #999999
            em
                color: #F35B00
.hot-product-list
    background-color: #fff
    padding: 10px 5px
    ul
        font-size: 0px
        li
            display: inline-block
            width: 33.333333%
            padding: 0 5px
            box-sizing: border-box
            margin-bottom: 10px
            vertical-align: top
            a
                text-align: center
                display: block
            .home-hot-img
                height: 105px
                line-height: 105px
                font-size: 0px
                text-align: center
                img
                    max-width: 100%
                    max-height: 105px
                    vertical-align: middle
            h4
                font-size: 13px
                color: #333333
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
                height: 20px
                line-height: 20px
                margin: 4px 0
            p
                font-size: 12px
                color: #999999
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
                height: 20px
                line-height: 20px
.hot-like-list
    background-color: #fff
    padding: 10px 5px
    ul
        font-size: 0px
        margin-bottom: 10px
        li
            display: inline-block
            width: 50%
            padding: 10px 5px
            box-sizing: border-box
            border-right: 1px solid rgba(0,0,0,0.05)
            border-bottom: 1px solid rgba(0,0,0,0.05)
            vertical-align: top
            &:nth-child(even)
                border-right: none
            a
                text-align: center
                display: block
            .home-hot-img
                height: 115px
                line-height: 115px
                text-align: center
                img
                    max-width: 100%
                    max-height: 115px
                    vertical-align: middle
            h4
                font-size: 13px
                color: #333333
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
                height: 20px
                line-height: 20px
                margin: 4px 0
            p
                font-size: 12px
                color: #999999
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
                height: 20px
                line-height: 20px
    .view-more
        background-color: #fafafa
        border: 1px solid #f3f3f3
        height: 48px
        line-height: 48px
        margin: 10px 10px 0
        span
            height: 48px
            line-height: 48px
            color: #a4a4a4
.home-hot-booth, .home-hot-product
    margin-bottom: 10px
.home-hot-booth
    margin-top: 10px
.ad-area
    font-size: 0px
    a
        display: block
        text-align: center
        img
            max-width: 100%
.my-business
    background-color: #fff
    margin-bottom: 10px
    .my-business-tab
        &>ul
            border: 1px solid #EBEBEB
            display: flex
            font-size: 0px
            li
                flex: 1
                text-align: center
                span
                    height: 42px
                    line-height: 42px
                    display: inline-block
                    padding: 0 3px
                    font-size: 16px
                    border-bottom: 3px solid transparent
                &.active
                    span
                        color: #F35B00
                        border-bottom: 3px solid #F35B00
    .my-business-find
        display: flex
        padding: 0 10px
        height: 36px
        line-height: 36px
        border-bottom-px(1px, rgba(0,0,0,.05))
        i
            flex: 0 0 20px
            width: 20px
            color: #F35B00
            line-height: 36px
        span
            flex: 1
            font-size: 12px
            color: #666666
    .view-more
        background-color: #FAFAFA
        border: 1px solid #F3F3F3
        height: 48px
        line-height: 48px
        margin: 10px 10px 0
        span
            height: 48px
            line-height: 48px
            color: #A4A4A4
    .my-business-qk
        padding-bottom: 10px
        ul.in-list
            li
                display: block
            .in-list-detail
                flex: 1
                display: flex
                p
                    color: #999999
            .name-star
                text-align: left
                margin-bottom: 4px
                font-size: 0px
                display: flex
                p
                    color: #333333
                .star-list
                    flex: 0 0 100px
                    width: 100px
                    display: inline-block
                    vertical-align: top
                    margin-left: 10px
                    i
                        display: inline-block
                        font-size: 14px
                        width: 20px
                        height: 20px
                        line-height: 20px
                        text-align: center
                
            a.list-handle
                flex: 0 0 40px
                width: 40px
            .tag
                margin-left: 74px
                border-top:1px solid #F3F3F3
                height: auto
                padding: 10px 0 0
                p
                    height: 20px
                    line-height: 20px
                    font-size: 12px
                    color: #999999
                    margin-bottom: 4px
                span
                    margin-left: 0px
                    margin-right: 8px
                    color: #999999
                    height: 18px
                    line-height: 18px
                    i
                        display: inline-block
                        width: 12px
                        height: 12px
                        margin-right: 4px
                        background: url('~@/common/images/changeCard.png') 0 0 no-repeat
                        background-size: cover
                        vertical-align: -1px
    .my-business-need, .my-business-yuyue
        padding-bottom: 10px
        ul.in-list
            li
                display: block
                flex: inherit
        a.reply
            display: flex
            .reply-text
                flex: 1
                h6
                    font-size: 14px
                    color: #333333
                    overflow: hidden
                    display: -webkit-box
                    -webkit-box-orient: vertical
                    -webkit-line-clamp: 1
                    word-break: break-word
                p
                    line-height: 18px
                    font-size: 12px
                    color: #999
                    margin: 4px 0
                    overflow: hidden
                    display: -webkit-box
                    -webkit-box-orient: vertical
                    -webkit-line-clamp: 2
                    word-break: break-word
            .reply-in
                font-size: 0px
                text-align: left
                height: 20px
                line-height: 20px
            .reply-all, .reply-we
                margin-right: 12px
                display: inline-block
                vertical-align: top
                font-size: 12px
                color: #666
                i
                    display: inline-block
                    width: 20px
                    height: 20px
                    vertical-align: top
                    line-height: 20px
                    color: #F35B00
                em
                    color: #F35B00
            .reply-we
                color: #F35B00
            .list-handle
                flex: 0 0 100px
                box-sizing: border-box
                padding-right: 10px
                width: 100px
                text-align: right
                font-size: 0px
                i
                    display: inline-block
                    width: 20px
                    font-size: 12px
                span
                    text-align: right
                    display: inline-block
                    width: 50px
                    height: 40px
                    line-height: 40px
                    vertical-align: middle
                    font-size: 12px
                    color: #F35B00
        .in-list-detail
            padding-top: 6px
            border-top: 1px solid #F3F3F3
            display: flex
            margin-top: 6px
            a.list-handle
                flex: 0 0 40px
                width: 40px
            .photo
                flex: 0 0 32px
                height: 32px
                width: 32px
                line-height: 30px
                img
                    max-width: 30px
                    max-height: 30px
            .text
                h6
                    font-size: 12px
                    color: #666666
                    height: 16px
                    line-height: 16px
                p
                    color: #666666
                    height: 16px
                    line-height: 16px
            .tag
                height: auto
                p
                    height: 20px
                    line-height: 20px
                    font-size: 12px
                    color: #999999
                    margin-bottom: 4px
                span
                    margin-left: 0px
                    margin-right: 8px
                    color: #999999
                    height: 18px
                    line-height: 18px
                    i
                        display: inline-block
                        width: 12px
                        height: 12px
                        margin-right: 4px
                        background: url('~@/common/images/changeCard.png') 0 0 no-repeat
                        background-size: cover
                        vertical-align: -1px
    .yuyue-time
        line-height: 24px
        font-size: 14px
        color: #333333
        em
            margin-left: 10px
            color: #F35B00
</style>
