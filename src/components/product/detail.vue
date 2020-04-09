<template>
    <div>
         <div class="head-back">
            <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')" v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
            <h2 class="headerTitle" title="展品详情" v-text="$t('ExhibitsDetail.Title')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat">
            <load-state v-show="loadState"></load-state>
            <div class="product-detail"  v-if="!loadState && productData">
                <div class="company-title shadow">
                    <div class="company-title-inner">
                        <div class="heart"><v-heart :defaultIcon="defaultIcon" :activeIcon="activeIcon" v-on:toParCollectboothid="_toParCollectboothid" :favState="productData.subFlag" :axiosParam="{url:url, data:{id: productData.productId, type: 'product', projectId: projectId, userTk: userTk, subscribeTime:'', subscribe_part:''}}"></v-heart></div>
                        <div class="company-title-photo"><img @click="wxScaleBigImg(productData.logo)" v-if="productData.logo" v-lazy="productData.logo" /><img v-else src="~@/common/images/product.png" /></div>
                        <h3 v-text="productData.name"></h3>
                        <p v-if="productData.catesList.length > 0">{{productData.catesList | toList}}</p>
                    </div>
                </div>
                <div class="shadow" v-if="productData.intro">
                    <h3 class="console-txt-h3" title="展品介绍">{{$t("ExhibitsDetail.Introductions")}}</h3>
                    <v-Brief :content="productData.intro"></v-Brief>
                </div>
                <div class="product-detail-list shadow">
                    <h3 class="console-txt-h3" title="展位信息">{{$t("ExhibitsDetail.BoothInfo")}}</h3>
                    <div class="listCol">
                        <ul class="in-list">
                            <li>
                                <router-link :to="{path:'/booth/detail', query:{projectId: projectId, passKey: passKey, boothId: boothData.id}}">
                                    <div class="infro">
                                        <div class="photo"><img v-if="boothData.comLogo" v-lazy="boothData.comLogo" /><img v-else src="~@/common/images/boothPhoto.png" /></div>
                                        <div class="text">
                                            <h6 v-text="boothData.boothName"></h6>
                                            <p v-text="boothData.comShortName"></p>
                                            <p v-text="boothData.boothNum"></p>
                                        </div>
                                        <div class="list-handle"><i class="icon-rightarrow"></i></div>
                                    </div>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="shadow" v-if="productTotal > 0">
                    <router-link class="console-txt-h3" :to="{path:'/booth/detail', query:{projectId: projectId, passKey: passKey, boothId: boothData.id, mark:'product'}}">
                        <span title="全部展品">{{$t("ExhibitsDetail.ExhibitsList")}}（{{productTotal}}）</span><i class="icon-rightarrow"></i>
                    </router-link>
                </div>
            </div>
            <div class="noMoreData" title="没有展位信息" v-show="!loadState" v-if="!productData">{{$t("Attendee.ProductNoInro")}}</div>
        </div>
        <!-- <v-yuyue v-if="boothData" :boothData="boothData" :contactList = "contactList"></v-yuyue> -->
    </div>
</template>

<script>
import vHeart from '../module/heart/heart.vue'
import {boothClassifyToList, commonAjaxFun, mainUserTk, initAllWeiXin, wxScaleBigImg, uwin_url, api_url } from '../../common/js/common.js'
import vBrief from '../module/brief/brief.vue'
import vYuyue from '../module/yuyue/yuyue.vue'
import loadState from '../module/loadState/loadState.vue'//加载状态

export default {
    components: {
        vBrief,
        vHeart,
        vYuyue,
        loadState
    },
    filters: {
        toList: function(val) {
            return boothClassifyToList(val)
        }
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            wxShare: `${this.$route.query.wxShare}`,//是否来自微信分享，如果是true，则返回首页，否则返回上一级
            productId: `${this.$route.query.productId}`,
            userTk: mainUserTk,
            loadState: true,//初次进页面加载中
            productTotal: '',//全部展品
            productData: '',//产品信息
            boothData: '',//展位信息
            defaultIcon: 'icon-heart',//收藏点选之前的状态
            activeIcon: 'icon-hearted icon_color',//点选周的选中状态
            url: '/userApi/watch',//点赞使用
            contactList: '',//展位联系人
            boothData: ''//展位基本信息
        }
    },
    mounted(){
        //展品基本信息
        this.productBasicInfro()
        this.jiance()
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
        jiance:function(){     //监测
            var _this = this
            commonAjaxFun({
                url: '/frontUser/saveUserInterest',
                data: {
                    projectId: _this.projectId,
                    userId : "",
                    moduleType:'product',
                    moduleId: _this.productId
                }
            }).then((data) => {
                try {
        
                    //console.log(data)
                    
                } catch (err) {
                    console.log(err)
                }
            })
        },
        _toParCollectboothid: function(id, data) {
            //点赞
            this.$set(this.productData, 'subFlag', data);
        },
        productBasicInfro: function(){
            let _this = this;
            //展位基本信息
            commonAjaxFun({
                url: '/boothApi/getProductsDetail',
                data: {
                    projectId: _this.projectId,
                    productId: _this.productId
                }
            }).then((data) => {
                let _data = data.data;
                _this.loadState = false;

                if(data.state == '0') {
                    _this.productTotal = _data.productTotal;
                    _this.productData = _data.product;
                    _this.boothData = _data.booth;
                    _this.contactList = _data.contactList;

                    //次判断用于展品详情页面单独微信分享
                    if(_this.needSingleWx) {
                        let desc = '';
                        let title = _data.product.name;
                        let img = !!_data.product.logo ? _data.product.logo : (uwin_url + require('@/common/images/product.png'));

                        let link = _this.toFullPath;

                        initAllWeiXin(_this.projectId, _this.passKey, 'productDetail', {}, {
                            title: title,
                            desc: desc,
                            img: img,
                            link: link
                        })
                        
                    }

                } else {
                    console.log(data.message)
                }

            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.company-title
    padding: 100px 15px 0
    background-color: #ECECEC
    background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0.00) 0%, #FFFFFF 64%)
    .company-title-inner
        background-color: #FFF
        font-size: 12px
        color: #999
        border: 1px solid rgba(0,0,0,.1)
        padding: 85px 10px 10px
        border-radius: 4px 4px 0 0
        border-bottom: none
        position: relative
        text-align: center
        h3
            font-size: 16px
            padding: 6px 0
            color: #333
        .company-title-photo
            width: 150px
            height: 150px
            line-height: 150px
            font-size: 0px
            border-radius: 2.4px
            box-shadow: 0 1.5px 1.5px 0 rgba(0, 0, 0, 0.16)
            background-color: #fff
            position: absolute
            left: 50%
            top: -75px
            margin-left: -75px
            img
                vertical-align: middle
                max-width: 150px
                max-height: 150px
        .heart
            position: absolute
            right: 25px
            top: -25px
            width: 50px
            height: 50px
            line-height: 50px
            border-radius: 50%
            text-align: center
            border: 1px solid rgba(0,0,0,0.1)
            background-color: #fff
            box-sizing: border-box
            i
                display: inline-block
                width: 40px
                height: 40px
                line-height: 40px
                vertical-align: -3px
                font-size: 22px
                color: rgba(0,0,0,0.5)

.product-detail
    h3.console-txt-h3, a.console-txt-h3
        display: flex
        padding: 8px 10px
        font-size: 13px
        background-color: #fafafa
        span
            flex: 1
        i
            flex: 0 0 30px
            width: 30px
            text-align: center
            line-height: 24px
            color: #999

</style>
