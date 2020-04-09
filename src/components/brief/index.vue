<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" title="简介" v-text="$t('HomePage.Introduction')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="brief topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <div class="banner" v-show="!loadState" :style="{height:cliHeight, backgroundImage: bannerUrl}"><img v-if="bannerUrl" v-lazy="bannerUrl"><img v-else src="~@/common/images/kv.png"></div>
            <v-Brief v-if="brieftxt" :content="brieftxt" v-show="!loadState"></v-Brief>
            <div class="noMoreData" title="暂无数据" v-show="!loadState" v-if="!brieftxt">{{$t("CommonUse.hasNoDate")}}</div>
        </div>
        <v-footer :showClass="'mine'"></v-footer>
    </div>
</template>

<script>
import headTitle from '../module/head/headTitle.vue'//公共头部
import vBrief from '../module/brief/brief.vue'
import loadState from '../module/loadState/loadState.vue'//加载状态
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import { commonAjaxFun } from '../../common/js/common.js'

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            loadState: true,//初次进页面加载中
            cliHeight: `${parseInt(document.body.clientWidth * 2 / 5)}px`,
            bannerUrl: '',//banner的url地址
            brieftxt: ''//简介内容
        }
    },
    components: {
        headTitle,
        vBrief,
        loadState,
        vLoginicon,
        vFooter
    },
    methods: {
        getChildrenProject: function() {
            //停用vuex，改用公用ajax请求
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getChildrenProject',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey
                }
            }).then((data) => {
                let _data = data.data;
                if (data.state == '0') {
                    //主视觉
                    if (!!_data && !!_data.basicInfo && _data.basicInfo.meetingPrimary) {
                        _this.bannerUrl = _data.basicInfo.meetingPrimary;
                    }

                } else {
                    console.log(data.message);
                }
            })
        },
        homePageAjax: function() {
            //停用vuex，改用公用ajax请求
            let _this = this;

            commonAjaxFun({
                url: '/eventapi/during/homePageAjax',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey
                }
            }).then((data) => {
                let _data = data.data;
                _this.loadState = false;

                if (data.state == '0') {
                    _this.brieftxt = _data.eventIntroModule.content.content;
                } else {
                    console.log(data.message);
                }
            })
        }
    },
    mounted() {
        this.getChildrenProject()
        this.homePageAjax()
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

.brief
    .quotetext
        padding: 10px
        background: #fff
    .banner
        overflow: hidden
        text-align: center
        img
            max-width: 100%
            max-height: 100%
        
</style>
