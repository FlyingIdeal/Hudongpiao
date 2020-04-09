<template>
    <div>
        <!-- <load-state v-show="loadState"></load-state> -->
        <!-- <div id="loadWrapper" v-show="!loadState"> -->
        <div id="loadWrapper">
            <div class="listCol">
               <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
import {commonAjaxFun, formatDate} from '../../../common/js/common.js'
export default {
    props: {
        params: Object,
        whichfrom: String,
        loadDownFn: Function,
        loadUpFn:Function
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            droploadObj: {},//下拉加载
        }
    },
    mounted(){
        let _this = this;
        setTimeout(function () {
           _this.dropload()
        }, 20)
    },
    methods: {
        dropload:function(){
            let _this = this;
            
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
                loadUpFn: function(me){
                   _this.loadUpFn(me)
                },
                loadDownFn: function(me){
                    _this.loadDownFn(me)
                }
            })
        },
        change:function(){
            this.droploadObj.resetload();
            this.droploadObj.unlock();
            this.droploadObj.noData(false);
            this.loadDownFn(this.droploadObj)
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.mint-loadmore-content.is-dropped
    transition: .2s linear
.mint-loadmore-top
    text-align: center
    margin-top: -50px
    height: 50px
    font-size: 12px
    line-height: 50px
    color: #f35b00
    span
        display: inline-block
        vertical-align: middle
        transition: .2s linear;
        &.rotate
            transform: rotate(180deg)
    em
        display:inline-block
        font-style: normal
    .ani-icon
        display:inline-block
        vertical-align: top
        width: 50px
        height: 50px
        position: relative
        .jump
            display: inline-block
            background-color: #f35b00
            border-radius: 10%
            position: absolute
            left: 15px
            top: 5px
            width: 20px
            height: 20px
            box-sizing: border-box
            animation-play-state: paused
            animation: square-jelly-box-animate 0.6s -0.1s linear infinite
        .foil
            display: inline-block
            position: absolute
            left: 15px
            bottom: 8px
            background: rgba(0,0,0,0.2)
            height: 4px
            width: 20px
            border-radius: 50%
            box-sizing: border-box
            animation-play-state: paused
            animation: square-jelly-box-shadow 0.6s -0.1s linear infinite
    .load-text
        display: inline-block
        vertical-align: top
.mint-loadmore-bottom
    text-align: center
    height: 50px
    font-size: 12px
    line-height: 50px
    color: rgba(153,153,153,0.7)
    em
        display:inline-block
        font-style: normal
    span
        display: inline-block
        -webkit-transition: .2s linear
        transition: .2s linear
        vertical-align: middle
        &.rotate
            -webkit-transform: rotate(180deg)
            transform: rotate(180deg)
    .ani-icon
        display:inline-block
        vertical-align: top
        width: 50px
        height: 50px
    .load-text
        display: inline-block
        vertical-align: top


@keyframes square-jelly-box-animate
{
    17%{
        border-bottom-right-radius: 10%;
    }
    25%{
        transform: translateY(8px) rotate(22.5deg)
    }
    50%{
        border-bottom-right-radius: 100%
        transform: translateY(16px) scale(1, 0.9) rotate(45deg)
    }
    75%{
        transform: translateY(8px) rotate(67.5deg)
    }
    100%{
        transform: translateY(0) rotate(90deg)
    }
}
@keyframes square-jelly-box-shadow
{
    50%{
        transform: scale(1.25, 1)
    }
}

.mint-spinner-snake
    animation: mint-spinner-rotate 0.8s infinite linear
    border: 2px solid transparent
    border-radius: 50%
    border-top-color: rgb(153,153,153)
    border-left-color: rgb(153,153,153)
    border-bottom-color: rgb(153,153,153)
    height: 16px
    width: 16px

@keyframes mint-spinner-rotate {
    0% {
        -webkit-transform: rotate(0deg)
                transform: rotate(0deg)
    }
    100% {
        -webkit-transform: rotate(360deg)
                transform: rotate(360deg)
    }
}
</style>
