<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" v-text="toptitle"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <div class="code-area" v-if="!loadState">
                <h3 class="console-txt-h3"><span>ID：{{userInfo.userid}}</span></h3>
                <div class="code-detail">
                    <div class="code-img" @click="scaleBig">
                        <img v-lazy="qrcodeImgUrl">
                    </div>
                    <div class="code-line">
                        <img src="~@/common/images/codebg.png" />
                        <div class="code-photo" :style="userImg"></div>
                    </div>
                    <div class="code-name shadow">
                        <p v-text="userInfo.name"></p>
                        <p title="嘉宾" v-text="userInfo.identification ? userInfo.identification : $t('HomePage.Attendee')"></p>
                        <p v-text="userInfo.company" v-if="userInfo.company"></p>
                    </div>
                </div>
            </div>
        </div>
        <v-footer :showClass="'mine'"></v-footer>
        <div class="mask-shadow" v-show="showFlag" @click="scaleBig"></div>
        <transition name="move">
            <div class="poster-tips" v-show="showFlag" id="postertips" @click="scaleBig"><img class="poster-tips-img":src="qrcodeImgUrl"></div>
        </transition>
    </div>
</template>

<script>

import { commonAjaxFun } from '../../common/js/common.js'
import headTitle from '../module/head/headTitle.vue'//公共头部
import loadState from '../module/loadState/loadState.vue'//加载状态
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            loadState: true,//初次进页面加载中
            Infro: '',//会议基本信息
            userInfo: '',//个人基本信息
            userImg: '',//个人头像
            showFlag: false,
            qrcodeImgUrl: "https://console.expoplus.com.cn/basis/createQrcode?htmlUrl=",
            toptitle: this.$t("LeftNav.MyImg"),//我的二维码
        }
    },
    components: {
        headTitle,
        loadState,
        vLoginicon,
        vFooter
    },
    methods: {
        scaleBig: function(){
            //放大二维码
            this.showFlag = !this.showFlag
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

                        _this.Infro = _data;
                        _this.userInfo = _data.userInfo;
                        _this.qrcodeImgUrl = _this.qrcodeImgUrl + _data.userInfo.userid;
                        let _curImg = _data.userInfo.headPortrait || require('@/common/images/default_grey.png');
                        _this.userImg = 'background-image:url(' + _curImg + ')';

                    } else {
                        console.log(data.message);
                    }

                } catch(e) {
                    console.log(e)
                }
            })
        }
    },
    mounted(){
        this.getChildrenProject()
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.code-area
    padding: 30px 50px
    .console-txt-h3
        background-color: #fafafa
        border-bottom: 1px solid #F35B00
    .code-img
        background-color: #fff
        text-align: center
        padding: 40px 20px 50px
        img
            width: 150px
            height: 150px
    .code-line
        position: relative
        font-size: 0px
        img
            width: 100%
        .code-photo
            position: absolute
            width: 80px
            height: 80px
            border-radius: 50%
            margin: -30px 0 0 -40px
            background-size: cover
            left: 50%
            top: 0px
            background-repeat: no-repeat
            background-position: center
    .code-name
        background-color: #666
        color: #fff
        font-size: 18px
        line-height: 1.8
        padding: 30px 10px 20px
        text-align: center
.poster-tips
    width: 260px
    position: fixed
    left: 50%
    top: 100px
    z-index: 16
    margin-left: -150px
    transform: translate3d(0, 0, 0)
    font-size: 0px
    padding: 20px
    background-color: #fff
    &.move-enter-active, &.move-leave-active
        transition: all 0.1s linear
    &.move-enter, &.move-leave-active
        transform: translate3d(0, -100%, 0)
    img
        max-width: 100%
</style>
