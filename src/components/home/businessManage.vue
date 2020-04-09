<template>
    <div class="my-business">
        <h3 class="console-txt-line"><span v-text="$t('Me.Management')" title="我的商机管理"></span></h3>
        <div class="my-business-tab">
            <ul>
                <li :class="[changeTabType == 'qianke' ? 'active' : '']" @click="changeTab('qianke')"><span v-text="$t('Me.Customer')"  title="潜客"></span></li>
                <li :class="[changeTabType == 'xuqiu' ? 'active' : '']" @click="changeTab('xuqiu')"><span v-text="$t('Demand.Title')" title="需求"></span></li>
                <li :class="[changeTabType == 'yuyue' ? 'active' : '']" @click="changeTab('yuyue')"><span v-text="$t('RegLogin.Appointment')" title="预约"></span></li>
            </ul>
            <!--潜客-->
            <div class="my-business-qk" v-show="changeTabType == 'qianke'">
                <div v-show='qiankeData.length>0'>
                    <h5 class="my-business-find"><i class="icon-tishi"></i><em title="已发现与您有关的" v-text="$t('Me.CustomerTitleF')"></em> <b v-text='qiankeLength'></b> <em v-text="$t('Me.CustomerTitleE')" title="名潜客"></em></h5>
                    <div class="listCol">
                        <ul class="in-list">
                            <li v-for = 'item in qiankeData'>
                                <div class="in-list-detail">
                                    <a href="javascript:void(0)">
                                        <div class="infro">
                                            <div class="photo"><img v-if="item.photo && item.photo != 'undefined'" v-lazy="item.photo" /><img v-else src="~@/common/images/default.png" /></div>
                                            <div class="text">
                                                <div class="name-star">
                                                    <p v-text='item.name'></p>
                                                    <div class="star-list">
                                                        <i class="icon-star icon-color" v-for=' num in [...Array( parseInt (item.starLevel) )]'></i>
                                                    </div>
                                                </div>
                                                <p v-text='item.company'></p>
                                                <p v-text='item.position'></p>
                                            </div>
                                        </div>
                                    </a>
                                    <router-link :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey , userid: item.userid }}" class="list-handle" v-if = 'item.linkStatus == "0"'>
                                        <i class="icon-addfriend icon_color"></i>  
                                    </router-link>
                                    <router-link :to="{path:'/chat/index', query:{projectId: projectId, passKey: passKey , userid: item.userid  }}" class="list-handle" v-else = 'item.linkStatus !== "0"'>
                                        <i class="icon-chattips icon_color"></i>  
                                    </router-link>
                                </div>
                                <div class="tag">
                                    <p title="贵公司已经有人添加其为好友"><i class="icon-tishi"></i><em v-text="$t('Me.CustomerTextF')"></em><b v-text="item.linkNum"></b><em v-text="$t('Me.CustomerTextE')"></em></p>
                                    <span title="已发需求" v-if='item.needsNum !== "0" '><i></i><em title="已发需求"  v-text="$t('Demand.Title')"></em></span><span title="已预约" v-if='item.subNum !== "0" '><i></i><em v-text="$t('RegLogin.Appointment')"></em></span><span title="已收藏" v-if='item.watchNum !== "0" '><i></i><em v-text="$t('Me.Favorites')"></em></span><span title="已下载资料" v-if='item.datumNum !== "0" '><i></i><em v-text="$t('ExhibitorDetail.Documents')"></em></span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="view-more" @click="downMore('qianke')" id='qiankeMore'>
                        <span title="点击加载更多">{{$t("CommonUse.More")}}</span>
                    </div>
                </div>
                <div class="noMoreData" title="暂无数据" v-show='qiankeData.length===0'>{{$t("CommonUse.hasNoDate")}}</div>
            </div>
            <!--需求-->
            <div class="my-business-need" v-show="changeTabType == 'xuqiu'">
                <div v-show='xuqiuData.length > 0'>
                    <!-- <h5 class="my-business-find"><i class="icon-tishi"></i><span>您已应答14条需求</span></h5> -->
                    <div class="listCol">
                        <ul class="in-list">
                            <li v-for='item in xuqiuData'>
                                <router-link :to="{path:'/demand/detail', query:{projectId: projectId, passKey: passKey ,needId:item.needId}}" class="reply">
                                    <div class="reply-text">
                                        <h6 v-text='item.title'></h6>
                                        <p v-text='item.content'></p>
                                        <div class="reply-in">
                                            <div class="reply-all" title="共人参与"><i class="icon-tishi"></i><em v-text="$t('Me.DemandTextF')"></em><em v-text='item.responseNum'></em><em v-text="$t('Me.DemandTextE')"></em> </div>
                                            <div class="reply-we" title="贵公司有人参与"><em v-text="$t('Me.DemandText1F')" ></em><em v-text='item.responseBoothNum'></em><em v-text="$t('Me.DemandText1E')"></em></div>
                                        </div>
                                    </div>
                                    <div class="list-handle"><span v-text=' item.responseStatus == "0" ? $t("Me.Reply") : $t("Me.Communication") '></span><i class="icon-rightarrow"></i></div>
                                </router-link>
                                <div class="in-list-detail">
                                    <router-link :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey  , userid: item.userid }}">
                                        <div class="infro">
                                            <div class="photo"><img v-if="item.photo && item.photo != 'undefined'" v-lazy="item.photo" /><img v-else src="~@/common/images/default.png" /></div>
                                            <div class="text">
                                                <h6 v-text='item.name'></h6>
                                                <p v-text='item.company'></p>
                                                <div class="tag">
                                                    <span title="已发需求" v-if='item.needsNum !== "0" '><i></i><em title="已发需求"  v-text="$t('Demand.Title')"></em></span><span title="已预约" v-if='item.subNum !== "0" '><i></i><em v-text="$t('RegLogin.Appointment')"></em></span><span title="已收藏" v-if='item.watchNum !== "0" '><i></i><em v-text="$t('Me.Favorites')"></em></span><span title="已下载资料" v-if='item.datumNum !== "0" '><i></i><em v-text="$t('ExhibitorDetail.Documents')"></em></span>
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                    <router-link :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey , userid: item.userid }}" class="list-handle" v-if = 'item.linkStatus == "0"'>
                                        <i class="icon-addfriend icon_color"></i>  
                                    </router-link>
                                    <router-link :to="{path:'/chat/index', query:{projectId: projectId, passKey: passKey , userid: item.userid  }}" class="list-handle" v-else = 'item.linkStatus !== "0"'>
                                        <i class="icon-chattips icon_color"></i>  
                                    </router-link>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="view-more"  @click="downMore('xuqiu')" id="xuqiuMore">
                        <span title="点击加载更多">{{$t("CommonUse.More")}}</span>
                    </div>
                </div>
                <div class="noMoreData" title="暂无数据" v-show='xuqiuData.length===0'>{{$t("CommonUse.hasNoDate")}}</div>
            </div>
            <!--预约-->
            <div class="my-business-yuyue" v-show="changeTabType == 'yuyue'">
                <div v-show='yuyueData.length>0'>
                    <!-- <h5 class="my-business-find"><i class="icon-tishi"></i><span>已发现与您有关的120名潜客</span></h5> -->
                    <div class="listCol">
                        <ul class="in-list">
                            <li v-for = 'item in yuyueData'>
                                <div class="yuyue-time" v-if="item.subscribeDate"><i v-text="$t('RegLogin.AppointmentDate') + ':'"></i><em>{{item.subscribeDate | formatDate}}</em> <em v-text='item.subscribePart'></em></div>
                                <div class="in-list-detail">
                                    <router-link class="link" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: item.userid}}">
                                        <div class="infro">
                                           <div class="photo"><img v-if="item.photo && item.photo != 'undefined'" v-lazy="item.photo" /><img v-else src="~@/common/images/default.png" /></div>
                                            <div class="text">
                                                <h6 v-text='item.name'></h6>
                                                <p v-text='item.company'></p>
                                                <div class="tag">
                                                    <span title="已发需求" v-if='item.needsNum !== "0" '><i></i><em title="已发需求"  v-text="$t('Demand.Title')"></em></span><span title="已预约" v-if='item.subNum !== "0" '><i></i><em v-text="$t('RegLogin.Appointment')"></em></span><span title="已收藏" v-if='item.watchNum !== "0" '><i></i><em v-text="$t('Me.Favorites')"></em></span><span title="已下载资料" v-if='item.datumNum !== "0" '><i></i><em v-text="$t('ExhibitorDetail.Documents')"></em></span>
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                   <router-link :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey , userid: item.userid }}" class="list-handle" v-if = 'item.linkStatus == "0"'>
                                        <i class="icon-addfriend icon_color"></i>  
                                    </router-link>
                                    <router-link :to="{path:'/chat/index', query:{projectId: projectId, passKey: passKey , userid: item.userid  }}" class="list-handle" v-else = 'item.linkStatus !== "0"'>
                                        <i class="icon-chattips icon_color"></i>  
                                    </router-link>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="view-more"  @click="downMore('yuyue')" id="yuyueMore">
                        <span title="点击加载更多">{{$t("CommonUse.More")}}</span>
                    </div>
                </div>
                <div class="noMoreData" title="暂无数据" v-show='yuyueData.length===0'>{{$t("CommonUse.hasNoDate")}}</div>
            </div>
        </div>
    </div>
</template>

<script>

import { commonAjaxFun, formatDate } from '../../common/js/common.js'

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            changeTabType: 'qianke',//tab切换的类型，默认潜客qianke
            qiankeData:[],     //用于数据循环
            qiankeDataAll:[],
            qiankeLength:0,
            xuqiuData:[],
            xuqiuDataAll:[],
            xuqiuLength:0,
            yuyueData:[],
            yuyueDataAll:[],
            yuyueLength:0
        }
    },
    mounted(){
        if(this.loginState){
            this.initData();
        }
    },
    filters: {
        formatDate(time) {
            if (!!time) {
                let data = new Date(time.replace(new RegExp("-", "gm"), "/"));
                return formatDate(data, 'yyyy-MM-dd')
            }
        }
    },
    methods: {
        initData:function(){    //初始化数据
           this.getData("qianke",'/homeData/getPotentialUser')
           this.getData("xuqiu",'/homeData/getNeeds')
           this.getData("yuyue",'/homeData/getBoothSub')
        },
        getData: function(type, url) {
            var _this = this
            commonAjaxFun({
                url: url,
                data: {
                    projectId: _this.projectId,
                    userId: ""
                }
            }).then((data) => {
                try {

                    let _data = data.data;

                    if (data.state == '0') {
                        if (type === 'qianke') {

                            _this.qiankeDataAll = _data;
                            _this.qiankeLength = _data.length;
                            _this.downMore("qianke");

                        } else if (type === 'xuqiu') {

                            _this.xuqiuDataAll = _data;
                            _this.xuqiuLength = _data.length;
                            _this.downMore("xuqiu");

                        } else if (type === 'yuyue') {

                            _this.yuyueDataAll = _data;
                            _this.yuyueLength = _data.length;
                            _this.downMore("yuyue");

                        }
                    } else {
                        console.log(data.message)
                    }

                } catch (e) {
                    console.log(e)
                }
            })
        },
        downMore: function(type) {
            if (type === 'qianke') {
                if (this.qiankeDataAll.length >= 3) {
                    this.qiankeData = [...this.qiankeData, ...this.qiankeDataAll.splice(0, 3)]
                } else {
                    this.qiankeData = [...this.qiankeData, ...this.qiankeDataAll.splice(0, this.qiankeDataAll.length)]
                    $("#qiankeMore").remove()
                }
            } else if (type === 'xuqiu') {
                if (this.xuqiuDataAll.length > 3) {
                    this.xuqiuData = [...this.xuqiuData, ...this.xuqiuDataAll.splice(0, 3)]
                } else {
                    this.xuqiuData = [...this.xuqiuData, ...this.xuqiuDataAll.splice(0, this.xuqiuDataAll.length)]
                    $("#xuqiuMore").remove()
                }
            } else if (type === 'yuyue') {
                if (this.yuyueDataAll.length >= 3) {
                    this.yuyueData = [...this.yuyueData, ...this.yuyueDataAll.splice(0, 3)]
                } else {
                    this.yuyueData = [...this.yuyueData, ...this.yuyueDataAll.splice(0, this.yuyueDataAll.length)]
                    $("#yuyueMore").remove()
                }
            }
        },
        changeTab: function(type) {
            //tab切换,根据type类型去切换
            if (!type) {
                return
            }

            this.changeTabType = type;
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/function.styl"

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
                    font-size: 15px
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
        letter-spacing:0.5px
        i
            flex: 0 0 20px
            width: 20px
            color: #F35B00
            line-height: 36px
        span
            flex: 1
            font-size: 12px
            color: #666666
        em
            font-size:12px
        b
            color:#f35b00
            font-size:12px
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
                    // height: 20px
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
                // height: 20px
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
