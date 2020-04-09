<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" v-text="toptitle"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <div class="scene" v-show="!loadState">
                <div id="loadWrapper">
                    <div class="listCol">
                        <dl class="sceneList" v-if="tochildlist">
                            <dd v-for="(value,key) in tochildlist" :aakey="key + 1">
                                <i class="icon-clock"></i>
                                <div class="txt-area">
                                    <p class="time">{{value.createTime | formatDate}}</p>
                                    <p class="txt" v-text="value.txtContent"></p>
                                    <div class="img" v-if="value.imgContent" v-for="img in splitImg(value.imgContent)"><img @click="wxScaleBigImg(img)" v-lazy="img" /></div>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="noMoreData" title="暂无数据" v-if="!graphicId && !loadState">{{$t("CommonUse.hasNoDate")}}</div>
        </div>
        <v-footer :showClass="'mine'"></v-footer>
    </div>
</template>

<script>

import vLoginicon from '../module/loginicon/loginicon.vue'
import loadState from '../module/loadState/loadState.vue'//加载状态
import vFooter from "../module/footer/footer"
import {commonAjaxFun, formatDate, wxScaleBigImg, mainUserTk } from '../../common/js/common.js'

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            childId: `${this.$route.query.childId}`,
            type: `${this.$route.query.type}`,
            childpassKey: `${this.$route.query.childpassKey}`,
            toptitle: `${this.$route.query.title}`,//头部
            tochildlist: [],//快讯列表
            graphicId: '',//当前直播的graphicId
            loadState: true,//初次进页面加载中
            queryId: ''//分页
        }
    },
    filters: {
        formatDate(time){
            let data = new Date(time.replace(new RegExp("-","gm"),"/"));
            return formatDate(data, 'HH:mm')
        }
    },
    components: {
        vFooter,
        vLoginicon,
        loadState
    },
    mounted(){
        this.getDataChildren();
    },
    methods: {
        wxScaleBigImg: function(value){
            //微信端图片放大预览
            wxScaleBigImg(value)
        },
        splitImg: function(val){
            if(!val){
                return;
            }
            return val.split(',')
        },
        loadUpFnMethods: function(me){//把下来刷新内部方法单独领出来
            let _this = this;

            commonAjaxFun({
                url: '/eventapi/during/getNewAppLiveGraphic',
                data: {
                    graphicId: _this.graphicId,
                    queryId: _this.queryId
                }
            }).then((data) => {
                let _data = data.data;
                try{
                    //加载完成
                    if(data.state == '0'){
                        if (_data.newList.length > 0){
                            _this.tochildlist = _data.newList;
                            _this.queryId = _data.queryId;
                            me.resetload();
                        } else {
                            me.lock();// 解锁loadDownFn里锁定的情况
                            me.noData(false);// 无数据
                        }
                    }

                }catch(err){
                    console.log(err)
                }
            })
        },
        loadDownFnMethods: function(me){//加载更多
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getNewAppLiveGraphic',
                data: {
                    graphicId: _this.graphicId,
                    queryId: _this.queryId
                }
            }).then((data) => {
                let _data = data.data;
                try{
                    //加载完成
                    if(data.state == '0'){
                        if (_data.newList.length > 0){
                            _this.tochildlist = _this.tochildlist.concat(_data.newList);
                            _this.queryId = _data.queryId;

                            _this.$nextTick(function() {
                                me.resetload();
                            })
                        } else {
                            me.lock();// 解锁loadDownFn里锁定的情况
                            me.noData();// 无数据
                            me.resetload();
                        }
                    }

                }catch(err){
                    console.log(err)
                }
            })
        },
        dropload: function(){
            let _this = this;
            //正常情况
            _this.droploadObj = $('#loadWrapper').dropload({
                scrollArea: window,
                threshold: 50,
                domUp : {
                    domClass: "dropload-up",
                    domRefresh: '<div class="dropload-refresh">↓' + _this.$t('CommonUse.DropRefresh') + '</div>',//↓下拉刷新
                    domUpdate: '<div class="dropload-update">↑' + _this.$t('CommonUse.ReleaseRefresh') + '</div>',//↑释放更新
                    domLoad: '<div class="dropload-load"><span class="loading"></span>' + _this.$t('CommonUse.Refresh') + '</div>'//刷新中
                },
                domDown : {
                    domClass: 'dropload-down',
                    domRefresh: '<div class="dropload-refresh">↑' + _this.$t('CommonUse.PullMore') + '</div>',//↑上拉加载更多
                    domLoad: '<div class="dropload-load"><span class="loading"></span>' + _this.$t('CommonUse.Loading') + '</div>',//加载中...
                    domNoData: '<div class="dropload-noData">' + _this.$t('CommonUse.NoMoreInfor') + '</div>'//没有更多内容了
                },
                loadDownFn: function(me){
                    _this.loadDownFnMethods(me);
                },
                loadUpFn: function(me) {

                    _this.queryId = '';

                    me.resetload();
                    _this.loadUpFnMethods(me);
                    me.unlock();
                    me.noData(false);
                }
            })
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

                    if(!!_data.graphicId) {
                        _this.graphicId = _data.graphicId;
                        _this.dropload();
                    }
                    

                } else {
                    console.log(data.message);
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/function.styl"

dl.sceneList
    padding: 0 14px
    dd
        border-left-px(1px, rgba(0,0,0,.05))
        padding: 14px 18px
        position: relative
        &:first-child
            i, p.time
                color: #f35b00
        i
            position: absolute
            top: 18px
            left: -8px
            color: #333
        img
            max-width: 80%
        p.time
            font-size: 16px
        p.txt
            padding: 4px 0 10px
            color: #4D4D4D
</style>
