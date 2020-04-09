<template>
    <div class="home-broadcast">
        <i class="icon-broadcast"></i>
        <div class="broad-list" v-if="DynamicList.length > 0">
            <mt-swipe :showIndicators="false" :auto="DynamicList.length == 0 ? 0 : 5000" :speed="15">
                <template v-for="(value, index) in DynamicList">
                    <mt-swipe-item class="broad-child" v-if="value.type == 'company'" :akey="index">欢迎{{value.name}}入驻参展通</mt-swipe-item>
                    <mt-swipe-item class="broad-child" v-else :akey="index">欢迎{{value.name}}使用参展通</mt-swipe-item>
                </template>
            </mt-swipe>
        </div>
    </div>
</template>

<script>

import { Swipe, SwipeItem } from 'mint-ui';
import { commonAjaxFun } from '../../../common/js/common.js'

export default {
    data(){
    	return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            dynamicTimer : '',//定时器
            DynamicList: []//动态数据
    	}
    },
    components: {
        mtSwipe: Swipe,
        mtSwipeItem: SwipeItem
    },
    mounted(){
        let _this = this;

        _this.getDynamicInfo();
        _this._clearTimer();


        _this.dynamicTimer = setInterval(() => {
            _this.getDynamicInfo();
        }, 60000)//每个人轮播时间为5s。ajax请求回来为11个人，所以5（11 + 1） = 60s
    },
    destroyed: function() {
        this._clearTimer();
    },
    methods: {
        _clearTimer() {
            if (this.dynamicTimer) {
                clearInterval(this.dynamicTimer);
            }
        },
        getDynamicInfo: function() {
            //获取首页bannner
            let _this = this;

            commonAjaxFun({
                url: '/homeData/getDynamicInfo',
                data: {
                    projectId: _this.projectId
                }
            }).then((data) => {
                try {
                    let _data = data.data;
                    if (data.state == '0') {
                        _this.DynamicList = _data;
                    } else {
                        console.log(data.message);
                    }
                } catch (e) {
                    console.log(e)
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

.home-broadcast
    display: flex
    padding: 0 10px
    margin: 10px 0
    background-color: #fff
    .mint-swipe
        height: 36px
        line-height: 36px   
    i.icon-broadcast
        flex: 0 0 20px
        width: 20px
        line-height: 36px
        text-align: left
        margin-right: 6px
        color: #F35B00
    .broad-list
        flex: 1
        height: 36px
        line-height: 36px
        overflow: hidden
        box-sizing: border-box
        .broad-child
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            text-align: left
            font-size: 12px !important
            color: #666666
            height: 36px
            line-height: 36px
</style>
