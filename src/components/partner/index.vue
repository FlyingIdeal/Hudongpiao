<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" v-text="toptitle"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="partner topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <div class="shadow" v-for="(value,key) in thisModule.groups">
                <h3 class="console-txt-h3" v-text="value.groupName"></h3>
                <ul v-if="thisModule.childs[value.partnerId]">
                    <li v-for="(img,index) in thisModule.childs[value.partnerId]"><div class="innerImg"><img @click="wxScaleBigImg(img.logo)" v-lazy="img.logo"></div></li>
                </ul>
            </div>
        </div>
        <v-footer :showClass="'mine'"></v-footer>
    </div>
    
</template>
<script>

import headTitle from '../module/head/headTitle.vue'//公共头部
import loadState from '../module/loadState/loadState.vue'//加载状态
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import { commonAjaxFun, wxScaleBigImg } from '../../common/js/common.js'

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            childId: `${this.$route.query.childId}`,
            type: `${this.$route.query.type}`,
            childpassKey: `${this.$route.query.childpassKey}`,
            loadState: true,//初次进页面加载中
            thisModule: '',//当前模块对象
            toptitle: `${this.$route.query.title}`//头部
        }
    },
    components: {
        headTitle,
        loadState,
        vLoginicon,
        vFooter
    },
    methods: {
        wxScaleBigImg: function(value){
            //微信端图片放大预览
            wxScaleBigImg(value)
        },
        getDataChildren: function(){
            //停用vuex，改用公用ajax请求
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getDataChildren',
                data: {
                    projectId: _this.projectId,
                    moduleId: _this.childId,
                    passKey: _this.childpassKey,
                    type: _this.type
                }
            }).then((data) => {
                let _data = data.data;
                _this.loadState = false;

                if (data.state == '0') {
                    _this.thisModule = _data;
                } else {
                    console.log(data.message);
                }
            })
        }
    },
    mounted(){
        this.getDataChildren()
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.partner
    h3.console-txt-h3
        font-size: 13px
        background: #fafafa
    ul
        font-size:0
        li
            display: inline-block
            width: 33.3333333%
            height: 90px
            padding: 10px 0
            overflow: hidden
            text-align: center
            box-sizing: border-box
            border-bottom: 1px solid rgba(0,0,0,.05)
            &:nth-child(3n)
                .innerImg
                    border-right: none
            .innerImg
                height: 70px
                line-height: 70px
                border-right: 1px solid rgba(0,0,0,.05)
            img
                max-width: 70%
                max-height: 70px
                vertical-align: middle
</style>
