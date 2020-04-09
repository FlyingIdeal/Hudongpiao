<template>
    <div>
        <transition :name="animateName">
            <div class="booth-area-part" v-show="boothPartFlag">
                <div class="head-back">
                    <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')" v-if="wxShare == 'true' || tinyPoster != 'undefined'" v-show="boothPreview != 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true' && tinyPoster == 'undefined'" v-show="boothPreview != 'true'"></i></div>
                    <h2 class="headerTitle" title="展位" v-text="$t('Exhibitor.Title')"></h2>
                    <div class="Occupy"></div>
                </div>
                <div class="topSeat botSeat">
                    <load-state v-show="loadState"></load-state>
                    <div class="booth-detail" v-if="!loadState && allData">
                        <div class="banner" :style="{height:adHeight, lineHeight: adHeight}"><img @click="wxScaleBigImg(bannerUrl)" :style="{maxHeight: adHeight}" v-lazy="bannerUrl"><div class="booth-place"><a v-if="$t('Exhibitor.placeBooth') == 'Booth'" :href="urlFilter(boothData.fid, allData.mapLink)"><i class="icon-address"></i><span>{{$t("Exhibitor.placeBooth")}} {{boothData.boothNum}}</span></a><a v-else :href="urlFilter(boothData.fid, allData.mapLink)"><i class="icon-address"></i><span>{{boothData.boothNum}} {{$t("Exhibitor.placeBooth")}}</span></a></div></div>
                        <div class="booth-name shadow">
                            <div class="heart"><v-heart :defaultIcon="defaultIcon" :activeIcon="activeIcon" v-on:toParCollectboothid="_toParCollectboothid" :favState="boothData.subFlag" :axiosParam="{url:url, data:{id: boothData.id, type: 'booth', projectId: projectId, userTk: userTk}}"></v-heart></div>
                            <div class="infro" @click="showCompany">
                                <div class="photo"><img v-if="boothData.comLogo" v-lazy="boothData.comLogo"><img v-else src="~@/common/images/boothPhoto.png"></div>
                                <div class="text">
                                    <h6 v-text="boothData.boothName"></h6>
                                    <p v-if="boothData.catesList.length > 0" title="分类">{{$t("CommonUse.Sort")}}：{{boothData.catesList | toList}}</p>
                                </div>
                            </div>
                            <div class="list-handle" @click="showCompany"><i class="icon-rightarrow"></i></div>
                        </div>
                        <!--判断是否有问卷-->
                        <template v-for="value in allDataModule">
                            <div class="booth-question shadow" v-if="value.appId == '403' && submitScuessFlag">
                                <router-link :to="{path:'/booth/question', query:{projectId: projectId, passKey: passKey, boothId: boothId, bankId: value.bankId}}"><i class="icon-question"></i><span :class='$t("CommonUse.TransSize")' title="您有一个问卷未完成">{{$t("HomePage.QuestionTips")}}</span><i class="icon-rightarrow"></i></router-link>
                            </div>
                        </template>
                        <!--展位tab-->
                        <div class="booth-tab">
                            <ul>
                                <li :class="[changeTabType == 'brief' ? 'active' : '']" @click="changeTab('brief')"><span title="简介">{{$t("ExhibitorDetail.Introduction")}}</span></li>
                                <template v-for="value in allDataModule">
                                    <li :class="[changeTabType == 'product' ? 'active' : '']" v-if="value.appId == '604'" ref="productTable" @click="changeTab('product')"><span title="展品">{{$t("ExhibitorDetail.Exhibit")}}</span></li>
                                </template>
                                <template v-for="value in allDataModule">
                                    <li :class="[changeTabType == 'data' ? 'active' : '']" v-if="value.appId == '106'" @click="changeTab('data')"><span title="资料">{{$t("ExhibitorDetail.Documents")}}</span></li>
                                </template>
                                <li :class="[changeTabType == 'comment' ? 'active' : '']" @click="changeTab('comment')"><span title="评论">{{$t("ExhibitorDetail.Discussion")}}</span></li>
                            </ul>
                        </div>
                        <div class="booth-tab-box">
                            <!--简介-->
                            <div class="booth-infro shadow" v-show="changeTabType == 'brief'">
                                <div class="quotetext" v-if="boothData.boothIntro" v-html="boothData.boothIntro" v-height></div>
                                <div class="view-more" v-if="boothData.boothIntro" briefViemMore @click='toggleBrief'>
                                    <span title="展开">{{$t("CommonUse.Fold")}}</span>
                                    <i class="icon-botarrow"></i>
                                </div>
                                <div class="noMoreData" title="暂无数据" v-if="!boothData.boothIntro">{{$t("CommonUse.hasNoDate")}}</div>
                            </div>
                            <!--热门产品-->
                            <div class="booth-hot-product shadow" v-if="hotProductList.length > 0" v-show="changeTabType == 'brief'">
                                <h3 class="console-txt-h3"><span title="热门展品">{{$t("ExhibitorDetail.Hot")}}</span></h3>
                                <ul>
                                    <li v-for="value in hotProductList">
                                        <router-link :to="{path:'/product/detail', query:{projectId: projectId, passKey: passKey, productId: value.productId}}">
                                            <div class="hot-product-img"><img v-if="value.logo" v-lazy="value.logo"><img v-else src="~@/common/images/product.png"></div>
                                            <h4 v-text="value.name"></h4>
                                            <p v-if="value.catesList">{{value.catesList | toList}}</p>
                                        </router-link>
                                    </li>
                                </ul>
                                <div class="view-more" v-if="productAllNum - hotProductList.length > 0" @click="changeTab('product')">
                                    <span title="查看更多">{{$t("CommonUse.More")}}</span>
                                    <em>({{productAllNum - hotProductList.length}})</em>
                                </div>
                            </div>
                            <!--展品-->
                            <template v-for="value in allDataModule">
                                <div class="booth-product listCol-arraw" v-if="value.appId == '604'" v-show="changeTabType == 'product'">
                                    <div class="listCol" v-if="productList.length > 0">
                                        <ul class="in-list">
                                            <li v-for="(value, key) in productList" :akey="key">
                                                <router-link :to="{path:'/product/detail', query:{projectId: projectId, passKey: passKey, productId: value.productId}}">
                                                    <div class="infro">
                                                        <div class="photo"></i><img v-if="value.logo" v-lazy="value.logo"><img v-else src="~@/common/images/product.png"></div>
                                                        <div class="text">
                                                            <h6 v-text="value.name"></h6>
                                                            <p>{{value.catesList | toList}}</p>
                                                        </div>
                                                    </div>
                                                    <div class="list-handle"><i class="icon-rightarrow"></i></div>
                                                </router-link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="view-more" @click="getMoreProduct" v-if="productAllNum - productList.length > 0">
                                        <span title="查看更多">{{$t("CommonUse.More")}}</span>
                                        <em>({{productAllNum - productList.length}})</em>
                                        <i class="icon-botarrow"></i>
                                    </div>
                                    <div class="shadow" v-if="productList.length == 0">
                                        <div class="noMoreData" title="暂无展品">{{$t("ExhibitorDetail.NoExhibits")}}</div>
                                    </div>
                                </div>
                            </template>
                            <!--资料-->
                            <template v-for="value in allDataModule">
                                <div class="booth-data" v-if="value.appId == '106'" v-show="changeTabType == 'data'">
                                    <div class="booth-data-filter" v-if="dataList.length > 0">
                                        <div class="booth-data-number" title="全部资料">{{$t("ExhibitorDetail.All")}}({{dataAllNum}})</div>
                                        <div class="booth-data-down" @click="dataDownload($event,'all')"><i class="icon-download"></i><span title="全部下载">{{$t("ExhibitorDetail.DownloadAll")}}</span></div>
                                    </div>
                                    <div class="listCol" v-if="dataList.length > 0">
                                        <ul class="in-list">
                                            <li v-for="(value, key) in dataList" :akey="key + 1">
                                                <a :href="value.url | formartUrl">
                                                    <div class="infro">
                                                        <div class="photo"><img v-lazy="_filterDataImg(value.url)"></div>
                                                        <div class="text">
                                                            <h6 v-text="value.title"></h6>
                                                            <p v-text="value.companyName"></p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <div class="list-handle" @click="dataDownload($event, value.id)"><i class="icon-download"></i></div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="view-more" @click="getMoreData" v-if="dataAllNum - dataList.length > 0">
                                        <span title="查看更多">{{$t("CommonUse.More")}}</span>
                                        <em>({{dataAllNum - dataList.length}})</em>
                                        <i class="icon-botarrow"></i>
                                    </div>
                                    <div class="noMoreData" title="暂无数据" v-if="dataList.length == 0">{{$t("CommonUse.hasNoDate")}}</div>
                                </div>
                            </template>
                            <!--评论-->
                            <div class="booth-comment" v-show="changeTabType == 'comment'">
                                <div class="leave-message shadow" v-if="contentObj">
                                    <div class="booth-data-filter">
                                        <div class="booth-data-number" title="全部评论">{{$t("Messaging.MessagingAll")}}({{contentObj.totalNum}})</div>
                                        <div class="booth-data-down" @click="reply($event, 'booth')"><i class="icon-topic"></i></div>
                                    </div>
                                    <div class="mine-nolist-tips" v-if="contentObj.list.length == 0">
                                        <i class="icon-emptybowl"></i>
                                        <p title="快来说说您的看法吧">{{$t("Messaging.LeaveTips")}}</p>
                                        <router-link :to="{path:'/speak/index', query:{projectId: projectId, passKey: passKey, detailId: boothId, title: $t('ExhibitorDetail.CompanyComments'), moduleType: 'booth'}}" class="create-btn" title="发言">{{$t("Messaging.PostBtn")}}</router-link>
                                    </div>
                                    <div class="listCol" v-if="contentObj.list.length > 0">
                                        <div class="main-comment-detail">
                                            <template v-for="(value, key) in contentObj.list">
                                                <div class="main-comment-list" v-if="key < 4" :akey="key">
                                                    <router-link class="link" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.userId}}">
                                                        <div class="photo"><img v-if="value.userImg" v-lazy="value.userImg"><img v-else src="~@/common/images/default.png"></div>
                                                    </router-link>
                                                    <div class="text">
                                                        <h4 class="name" v-text="value.userName"></h4>
                                                        <h6 class="content" v-text="value.content" :themeId= 'value.contentId' :handleType="value.creater == 1 ? 'delete' : 'complaint'" @click="topicHandle(value)"></h6>
                                                        <p class="time" v-text="value.showTime"></p>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                        <router-link :to="{path:'/speak/index', query:{projectId: projectId, passKey: passKey, detailId: boothId, title: $t('ExhibitorDetail.CompanyComments'), moduleType: 'booth'}}" class="view-more" v-if="contentObj.totalNum - 4 > 0">
                                            <span title="查看更多">{{$t("CommonUse.More")}}</span>
                                            <em>({{contentObj.totalNum - 4}})</em>
                                            <i class="icon-botarrow"></i>
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="noMoreData" title="没有展位信息" v-show="!loadState" v-if="!allData">{{$t("Attendee.BoothNoInro")}}</div>
                </div>
            </div>
        </transition>
        <transition :name="animateName">
            <div class="booth-company-part" v-show="!boothPartFlag">
                <div class="head-back">
                    <div class="head-back-icon" @click="hideCompany"><i class="icon-leftarrow"></i></div>
                    <h2 class="headerTitle" title="公司详情" v-text="$t('ExhibitorDetail.Company')"></h2>
                    <div class="Occupy"></div>
                </div>
                <div class="topSeat botSeat booth-detail">
                    <v-company ref="company" v-on:topicHandle="topicHandle" v-on:reply="reply" v-if="boothData" :boothData="boothData" :contactList = "contactList"></v-company>
                </div>
            </div>
        </transition>
        <v-yuyue v-if="boothData" :boothData="boothData" :contactList = "contactList"></v-yuyue>
        <v-datadown ref="datadown" :params="downDataObj"></v-datadown>
         <!--删除、投诉底部-->
        <actionsheet :class="sheetType" :actions="sheetAction" v-model="sheetVisible"></actionsheet>
        <!--投诉-->
        <v-complain ref="complain"></v-complain>
        <!--评论回复输入框-->
        <v-reply ref="reply" :limit="300" :moduleType="moduleType" :moduleId="moduleId" v-on:replayReresh="_replayReresh"></v-reply>
    </div>
</template>
<script>
import Vue from 'vue'
import vHeart from '../module/heart/heart.vue'
import {mainUserTk, boothClassifyToList, commonAjaxFun, filterCurrentModule, filterDataImg, deleteContent, initAllWeiXin, wxScaleBigImg, uwin_url, api_url} from '../../common/js/common.js'
import { Actionsheet, MessageBox } from 'mint-ui';//操作表，从屏幕下方移入。
import vYuyue from '../module/yuyue/yuyue.vue'
import vCompany from '../module/company/company.vue'
import vDatadown from '../module/datadown/datadown.vue'
import vReply from '../module/reply/reply.vue'
import vComplain from '../module/complain/complain.vue'//投诉
import loadState from '../module/loadState/loadState.vue'//加载状态

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
            loadState: true,//初次进页面加载中
            deleteThemeid:'',//要投诉的内容id
            moduleType: 'booth',//当前页面模块类型
            complainModuleType: '',//区分投诉类型，booth/conpany
            animateName: 'right',//默认展位part显示
            boothPartFlag: true,//默认展位part显示
            defaultIcon: 'icon-hearted',//收藏点选之前的状态
            activeIcon: 'icon-hearted icon_color',//点选周的选中状态
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            boothPreview: `${this.$route.query.boothPreview}`,//后台预览
            wxShare: `${this.$route.query.wxShare}`,//是否来自微信分享，如果是true，则返回首页，否则返回上一级
            tinyPoster: `${this.$route.query.tinyPoster}`,//是否来自邀请函
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            userTk: mainUserTk,
            url: '/userApi/watch',//点赞使用
            adHeight: `${parseInt(document.body.clientWidth * 2 / 5)}px`,
            bannerUrl: '',//bannner的url地址
            changeTabType:'brief',//tab切换的类型，默认为简介brief
            mark: `${this.$route.query.mark}`,//从展品详情全部展品到展位页
            allDataModule: '',//展位下的模块
            contactList: '',//展位联系人
            allData: '',//展位信息返回的所有值，用于获取展位地图
            boothData: '',//展位基本信息
            boothId: `${this.$route.query.boothId}`,
            moduleId: '',//模块id,用于区分展位和公司评论的id
            productPage: 1,//请求展品的初始页数
            productList: [],//展品列表
            productAllNum: '',//展品总数
            contentObj: '',//评论列表
            bankId: '',///product中用的产品id
            hotProductList: [],//热门产品
            databankId: '',//资料下载中的bankid
            dataPage: 1,//请求资料的初始页数
            dataList: [],//资料列表
            dataAllNum: '',//资料总数
            answerCookieSign: '',//cookie存储判断是否回答过问卷
            submitScuessFlag: false,
            downDataObj: {
                //资料下载传递到datadown的模块中
                url: '/boothApi/downloadDatums',
                data: {
                    userTk: mainUserTk,
                    bankId: '',
                    boothId: `${this.$route.query.boothId}`,
                    datumId: '',
                    email: ''
                }
            }
        }
    },
    components: {
        vHeart,
        vReply,
        vYuyue,
        loadState,
        vCompany,
        Actionsheet,
        vComplain,
        vDatadown
    },
    directives: {
        height: {
        	/*展位介绍 高度*/
            update: function(el) {
                if ($(el).height() > 178) {
                    $(el).height('180px')
                    $(".view-more[briefViemMore]").show()
                } else {
                    $(".view-more[briefViemMore]").hide()
                }
            }
        }
    },
    created(){
        //如果是从展品全部展品到展位页面，则默认显示展位tab
        if(this.mark == 'product'){
            this.changeTabType = this.mark;
        } else {
            this.changeTabType = 'brief';
        }
    },
    mounted() {
        let _this = this;

        //判断是否回答过问卷
        _this.answerCookieSign = 'HDPBOOTH' + _this.projectId + _this.boothId; //用于存储cookie
        let _hasAnswerSign = localStorage.getItem(this.answerCookieSign);

        //判断是否回答过问卷
        if (!!_hasAnswerSign) {
            //已经回答过问题
            _this.submitScuessFlag = false;
        } else {
            _this.submitScuessFlag = true;
        }

        //z展位基本信息
        _this.boothBasicInfro();

        //评论
        _this.getContentList();

        $(window).resize(() => {
            _this.adHeight = `${parseInt(document.body.clientWidth * 2 / 5)}px`;
        })

        this.jiance();
    },
    filters: {
        toList: function(val) {
            return boothClassifyToList(val)
        },
        formartUrl: function(val) {
            return !val ? 'javascript:void(0);' : val
        }
    },
    methods: {
        routerBack: function(){
            //如果是微信分享或者来自邀请函，都去首页
            if(this.wxShare == 'true' || this.tinyPoster != 'undefined'){
                this.$router.push({path : '/home/index', query: {projectId: this.projectId, passKey: this.passKey}});//主页
            } else {
                this.$router.go(-1);
            }
        },
        wxScaleBigImg: function(value){
            //微信端图片放大预览
            wxScaleBigImg(value)
        },
        jiance:function(){     //监测
            var _this = this
            commonAjaxFun({
                url: '/frontUser/saveUserInterest',
                data: {
                    projectId: _this.projectId,
                    userId : "",
                    moduleType: _this.moduleType,
                    moduleId: _this.boothId
                }
            }).then((data) => {
                try {
    
                    //console.log(data)
                    
                } catch (err) {
                    console.log(err)
                }
            })
        },
        urlFilter: function(fid, url) {

            let _url = 'javascript:void(0);';

            if (url.indexOf('mapid') > 0 && !!fid) {
                _url = `/map/index?projectId=${this.projectId}&passKey=${this.passKey}&fid=${fid}`;
            }
            return _url
        },
        topicHandle: function(value, type){
            //话题操作，去判断删除还是投诉

            //首先判断是否登录
            if(!this.loginState){

                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});

                return false;
            }

            let _type = value.creater == 1 ? 'delete' : 'complaint';
            let _id = value.contentId;

            if (type == 'company') {
                this.complainModuleType = type;
            } else {
                this.complainModuleType = 'booth'
            }

            if (_type == 'complaint') {
                this.sheetVisible = true;
                this.sheetAction = this.sheetComplain;
                this.sheetType = 'sheet-complain';
                this.deleteThemeid = _id;
            } else if (_type == 'delete') {
                this.sheetVisible = true;
                this.sheetAction = this.sheetDelete;
                this.sheetType = 'sheet-delete';
                this.deleteThemeid = _id;
            } else {
                this.sheetVisible = false;
                this.deleteThemeid = '';
            }

        },
        reply: function(event, type, moduid){
            //回复, type为公司->conpany/booth, moduid为模块id

            //首先判断是否登录
            if(!this.loginState){

                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});

            } else {
                
                if (type == 'company') { //公司回复
                    this.moduleId = moduid;
                    this.moduleType = type;
                } else { //展位评论回复
                    this.moduleId = this.boothId;
                    this.moduleType = 'booth';
                }

                this.$refs.reply.hideMaskShadow();
            }
        },
        _replayReresh: function() {
            //评论之后的操作-重新获取评论列表
            if (this.moduleType == 'company') {
                //调用公司组建去刷新评论列表
                this.$refs.company.getCompanyContentList();
            } else {
                this.getContentList()
            }
        },
        complain: function() {
            //调用子组件里的显示右侧投诉
            this.$refs.complain.handleComplain(this.projectId, this.deleteThemeid, this.complainModuleType);
        },
        deleteTopic: function(type){
            //删除话题,此处添加type，是为了区分是展位评论还是公司评论
            let _this = this;

            MessageBox.confirm(_this.$t('layerTips.DeleteTips')).then(action => {//确定删除

                _this.$layer.loading(_this.$t('layerTips.Deleting'));//正在删除，请稍后！

                deleteContent(_this.projectId, _this.deleteThemeid).then((data) => {
                    _this.$layer.close();

                    if(data.state == '0'){

                        _this.$layer.toast({content: _this.$t('layerTips.DeleteSuccess')});//删除成功

                        _this._replayReresh();//重新获取评论列表

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
        showCompany: function() {
            //显示公司详情
            this.boothPartFlag = !this.boothPartFlag;
            this.animateName = 'right';
            this.moduleType = 'company';
        },
        hideCompany: function() {
            //隐藏公司详情
            this.boothPartFlag = !this.boothPartFlag;
            this.animateName = 'left';

        },
        changeTab: function(type){
            //tab切换,根据type类型去切换
            if(!type){return}
            this.changeTabType = type;
        },
        _filterDataImg: function(val){
            let _type = filterDataImg(val);
            return require('@/common/images/' + _type);
        },
        dataDownload: function(event, id){
            //资料下载
            //首先判断是否登录
            if(!this.loginState){

                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
                
            } else {
                let _id = id == 'all' ? '' : id; //下载全部的情况下id为空

                this.$set(this.downDataObj.data, 'bankId', this.databankId)
                this.$set(this.downDataObj.data, 'datumId', _id)

                this.$refs.datadown.hideMaskShadow();
            }
        },
        _toParCollectboothid: function(id, data) {
            //点赞
            this.$set(this.boothData, 'subFlag', data);
        },
        filterBoothProduct: function() {
            //删选展位里面的展品模块，从而执行获取展品
            let _currentObj;
            for (let i = 0; i < this.allDataModule.length; i++) {
                if (this.allDataModule[i].appId == '604') {
                    //有展品
                    this.bankId = this.allDataModule[i].bankId;
                    this.getBoothProduct(); //获取展品
                } else if (this.allDataModule[i].appId == '106') {
                    //有资料
                    this.databankId = this.allDataModule[i].bankId
                    this.getBoothData()
                }
            }

        },
        getMoreData: function() {
            //资料下的查看更多
            this.dataPage++;
            if (this.dataPage > Math.ceil(this.dataAllNum / 10)) {
                //每页10个
                return false;
            }
            this.getBoothData();
        },
        getMoreProduct: function() {
            //展品下的查看更多
            this.productPage++;
            if (this.productPage > Math.ceil(this.productAllNum / 10)) {
                //每页10个
                return false;
            }
            this.getBoothProduct();
        },
        getContentList: function() {
            //获取展位里的评论
            let _this = this;
            commonAjaxFun({
                url: '/interactTopic/getContentList',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    moduleType: _this.moduleType,
                    page: _this.productPage,
                    moduleId: _this.boothId,
                    queryTime: ''
                }
            }).then((data) => {
                try {
                    let _data = data.data;
                    if (data.state == '0') {
                        _this.contentObj = _data;
                    } else {
                        console.log(data.message)
                    }
                } catch (err) {
                    console.log(err)
                }
            })
        },
        getBoothData: function() {
            //获取展位下的数据
            let _this = this;
            commonAjaxFun({
                url: '/boothApi/getDatums',
                data: {
                    bankId: _this.databankId,
                    boothId: _this.boothId,
                    page: _this.dataPage
                }
            }).then((data) => {
                try {
                    let _data = data.data;
                    if (data.state == '0') {
                        _this.dataAllNum = _data.total;
                        for (let i in _data.rows) {
                            _this.dataList.push(_data.rows[i])
                        }
                    } else {
                        console.log(data.message)
                    }
                } catch (err) {
                    console.log(err)
                }
            })
        },
        getBoothProduct: function() {
            //获取展位下的展品
            let _this = this;
            commonAjaxFun({
                url: '/boothApi/getProducts',
                data: {
                    projectId: _this.projectId,
                    search: '',
                    page: _this.productPage,
                    userTk: mainUserTk,
                    bankId: _this.bankId,
                    subListFlag: '',
                    boothPreview: ''
                }
            }).then((data) => {
                try {
                    let _data = data.data;
                    if (data.state == '0') {
                        _this.productAllNum = _data.pageObj.total;
                        for (let i in _data.pageObj.rows) {
                            _this.productList.push(_data.pageObj.rows[i])
                        }
                    } else {
                        console.log(data.message)
                    }
                } catch (err) {
                    console.log(err)
                }
            })
        },
        boothBasicInfro: function() {
            //展位基本信息

            let _this = this;

            commonAjaxFun({
                url: '/boothApi/getBoothDetail',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey,
                    userTk: mainUserTk,
                    boothId: _this.boothId,
                    watchType:"booth"
                }
            }).then((data) => {
                try {
                    let _data = data.data;
                    _this.loadState = false;

                    if (data.state == '0') {
                        _this.allData = _data;
                        _this.boothData = _data.data;
                        _this.loadState = false;
                        //首页为展位图片，其次会议主题， 最后为默认kv
                        _this.bannerUrl = this.boothData.boothFigure || this.boothData.meetingKv || require('@/common/images/kv.png');
                        _this.allDataModule = _data.modules;
                        _this.hotProductList = _data.hotProduct; //热门产品
                        _this.contactList = _data.contactList;

                        //拿到总模块之后去获取对应的子模块
                        if (_this.allDataModule.length > 0) {
                            _this.filterBoothProduct();
                        }
                          
                        // console.log(_obj)
                        //次判断用于来宾详情页面单独微信分享
                        if (_this.needSingleWx) {
                            let desc = _data.data.boothNum;
                            let title = _data.data.boothName;
                            let img = !!_data.data.comLogo ? _data.data.comLogo : (uwin_url + require('@/common/images/boothPhoto.png'));

                            let link = _this.toFullPath;

                            initAllWeiXin(_this.projectId, _this.passKey, 'boothDetail', {}, {
                                title: title,
                                desc: desc,
                                img: img,
                                link: link
                            })
                        }


                    } else {
                        
                        console.log(data.message)
                    }
                } catch (err) {
                    console.log(err)
                }
            })
        },
        toggleBrief: function() {
            //展位介绍  展开 收起
            let _this = this;
            if (_this._open) {
                _this._open = false;
                $(".quotetext").height("180px");
                $(".view-more[briefViemMore] span").text(_this.$t("CommonUse.Fold"));
                $(".view-more[briefViemMore] i").removeClass('icon-uparrow').addClass('icon-botarrow');
            } else {
                _this._open = true;
                $(".quotetext").height("auto");
                $(".view-more[briefViemMore] span").text(_this.$t("CommonUse.Unfold"));
                $(".view-more[briefViemMore] i").removeClass('icon-botarrow').addClass('icon-uparrow');
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

@import "../../common/stylus/function.styl"

.booth-detail
    .banner
        position: relative
        font-size: 0px
        text-align: center
        img
            max-width: 100%
            vertical-align: middle
        .booth-place
            position: absolute
            left: 0px
            bottom: 10px
            a
                display: block
                position: relative
                padding: 0px 16px 0 60px
                box-sizing: border-box
                text-align: center
                border-radius: 0 14px 14px 0
                background-color: #131C28
                height: 28px
                line-height: 28px
                font-size: 16px
                i
                    position: absolute
                    left: 10px
                    top: 50%
                    width: 40px
                    height: 40px
                    line-height: 40px
                    text-align: center
                    border-radius: 50%
                    background-color: #131C28
                    margin-top: -20px
                    font-size: 18px
                    color: #fff
                span
                    font-size: 16px
                    height: 28px
                    line-height: 28px
                    color: #fff
.booth-name
    font-size: 12px
    padding: 10px
    background-color: #fff
    position: relative
    display: flex
    .heart
        position: absolute
        right: 10px
        top: -30px
        height: 60px
        width: 60px
        box-sizing: border-box
        background-color: #fff
        border: 1px solid rgba(0, 0, 0, 0.1)
        border-radius: 50%
        line-height: 60px
        text-align: center
        i
            display: inline-block
            width: 40px
            height: 40px
            line-height: 40px
            vertical-align: -3px
            font-size: 26px
            color: #999999
    .infro
        flex: 1
        display: flex
        .photo
            width: 80px
            height: 80px
            flex: 0 0 80px
            border: 1px solid #e6e6e6
            box-sizing: border-box
            border-radius: 2px
            text-align: center
            line-height: 78px
            font-size: 0px
            overflow: hidden
            img
                vertical-align: middle
                max-height: 78px
                max-width: 78px
        .text
            flex: 1;
            box-sizing: border-box
            padding-left: 10px
            h6
                font-size: 16px
                line-height: 20px
                overflow: hidden
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 3
                word-break: break-word
            p
                line-height: 20px;
                min-height: 20px;
                font-size: 12px;
    .list-handle
        flex: 0 0 50px
        width: 50px
        height: 80px
        line-height: 80px
        text-align: center
        i
            display: inline-block
            width: 40px
            height: 40px
            line-height: 40px
            vertical-align: middle
.booth-question
    a
        display: flex
        background-color: #F35B00
        color: #fff
        border-radius: 2px
        i
            flex: 0 0 40px
            text-align:center
            line-height: 44px
            &:first-child
                font-size: 20px
            &:last-child
                font-size: 12px
        span
            flex: 1
            line-height: 44px
.booth-tab
    position: sticky
    z-index: 13
    top: 0px
    background-color: #fff
    border-bottom: 1px solid rgba(0,0,0,0.1)
    ul
        display: flex
        li
            flex: 1
            text-align: center
            span
                display:inline-block
                height: 38px
                line-height: 40px
                border-bottom: 2px solid transparent
                font-size: 13px
            &.active
                span
                    border-bottom: 2px solid #F35B00
.booth-infro
    padding: 4px 0px 2px
    .quotetext
        margin-bottom: 8px
        height: auto
.booth-hot-product
    h3.console-txt-h3
        font-size: 13px
        background: #fafafa
    ul
        font-size: 0px
        li
            display: inline-block
            width: 50%
            vertical-align: top
            a
                padding: 12px 15px
                color: #999999
                font-size: 12px
                display: block
                text-align: center
                box-sizing: border-box
                h4
                    font-size: 15px
                    margin-top: 6px
                    color: #333
                    height: 22px
                    line-height: 22px
                    overflow: hidden
                    display: -webkit-box
                    // eslint-disable-next-line
                    /* autoprefixer: off */
                    -webkit-box-orient: vertical
                    /* autoprefixer: on */
                    -webkit-line-clamp: 1
                p
                    height: 20px
                    line-height: 20px
                    overflow: hidden
                    display: -webkit-box
                    -webkit-box-orient: vertical
                    -webkit-line-clamp: 1
        .hot-product-img
            width: 100px
            height: 100px
            line-height: 96px
            overflow: hidden
            margin: 0 auto
            box-sizing: border-box
            border: 2px solid #E6E6E6
            font-size: 0px
            img
                max-width: 96px
                max-height: 96px
                vertical-align: middle
.booth-data-filter
    display: flex
    padding: 8px 10px
    border-bottom-px(1px, rgba(0,0,0,.1))
    background-color: #fff
    font-size: 13px
    .booth-data-number
        flex:1
    .booth-data-down
        flex: 0 0 120px
        text-align: right
        i
            font-size: 18px
            margin-right: 4px
            vertical-align: -2px
            color: #f35b00
.booth-data .listCol ul.in-list li
    padding: 0px
    a
        padding: 14px 0
        .infro .photo
            flex: 0 0 50px
            width: 50px
            height: 50px
            line-height: 48px
            img
                max-width: 48px
                max-height: 48px
    .list-handle
        height: 78px
        line-height: 78px
        border-left-px(1px, rgba(0,0,0,0.05))
       i
           font-size: 18px
           color: #f35b00
.booth-company-part, .booth-area-part
    transform: translate3d(0, 0, 0)
    &.right-enter-active
        transition: all 0.2s linear
    &.right-enter
        transform: translate3d(100%, 0, 0)
    &.right-leave-active
        transition: all 0s linear
    &.right-leave
        transform: translate3d(-100%, 0, 0)
    &.left-enter-active
        transition: all 0.2s linear
    &.left-enter
        transform: translate3d(-100%, 0, 0)
    &.left-leave-active
        transition: all 0s linear
    &.left-leave
        transform: translate3d(100%, 0, 0)
</style>
