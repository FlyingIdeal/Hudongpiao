<template>
    <ul class="in-list">
        <template v-for="(value, key) in tochildlist">
            <!--插入推荐展品广告-->
            <li class="booth-ad" :class="[key % 10 == 3 ? 'booth-add-3' : '']" v-if="showHot == 'true' && value && !!value.recommend && value.recommend == 'push'"  :akey="key">
                <router-link :to="{path:'/product/detail', query:{projectId: projectId, passKey: passKey, productId: value.id}}">
                    <div class="home-hot-img">
                        <img v-if="value.logo" :src="value.logo" /><img v-else src="~@/common/images/boothPhoto.png" />
                    </div>
                    <h4 v-text="value.name"></h4>
                    <p v-text="value.company"></p>
                </router-link>
            </li>

            <li v-if="value.recommend == 'normal'" :akey="key">
                <router-link :to="{path:'/product/detail', query:{projectId: projectId, passKey: passKey, productId: value.productId}}">
                    <div class="infro">
                        <div class="photo"><i class="new" v-if="value.isNews == 1"></i><img v-if="value.logo" :src="value.logo" /><img v-else src="~@/common/images/product.png" /></div>
                        <div class="text">
                            <h6 v-text="value.name"></h6>
                            <p v-if="value.catesList">{{value.catesList | toList}}</p>
                            <p v-text="value.companyName"></p>
                            <div class="tag" v-if='value.saleStatus == "1" || value.cityStatus =="1" || value.isSales =="1"'>
                                <i class="icon-label"></i>
                                <span  class="orange" v-if='value.cityStatus =="1"' title="同城">{{$t("label.SameCity")}}</span><span title="同兴趣" class="green" v-if='value.relateStatus =="1"'>{{$t("label.SameInterest")}}</span><span title="促销" class="yellow" v-if='value.isSales =="1" '>{{$t("label.Sales")}}</span>
                            </div>
                        </div>
                    </div>
                </router-link>
                <!--暂时取消收藏按钮-->
                <div class="list-handle"><i class="icon-rightarrow"></i></div>
                <!-- <div class="list-handle"><v-heart :defaultIcon="defaultIcon" :activeIcon="activeIcon" :favState="value.subFlag" :axiosParam="{url:url, data:{id: value.productId, type: 'product', projectId: projectId, userTk: userTk, passKey: passKey, subscribeTime:'',subscribe_part:''}}"></v-heart></div> -->
            </li>
        </template>
    </ul>
</template>

<script>

import vHeart from '../module/heart/heart.vue'
import { mainUserTk } from '../../common/js/common.js'

export default {
    props:{
        showHot: String,//是否显示推荐
        tochildlist: Array
    },
    components: {
        vHeart
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            userTk: mainUserTk,
            defaultIcon: 'icon-heart',//收藏点选之前的状态
            activeIcon: 'icon-hearted icon_color',//点选周的选中状态
            url: '/userApi/watch'
        }
    },
    filters: {
        toList: function(val){
            if(val.length == 0){
                return;
            }

            let result = new Array;
            for(let i = 0; i < val.length; i++){
                result.push(val[i].name);
            }

            return result.join('、')
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/function.styl"
.listCol
    li
        clear: both
        i.new
            position: absolute
            right: 0px
            top: 0px
            width: 20px
            height: 10px
            background: url('~@/common/images/new.png') 0 0 no-repeat
            background-size: 20px 10px

.listCol ul.in-list
    font-size: 0px
    li
        background-color: #fff
        &.booth-ad
            display: inline-block
            font-size: 0px
            width: 66.666666%
            overflow: hidden
            float: left
            box-sizing: border-box
            clear: none
            padding: 12px 4px
            vertical-align: top
            a
                display: block
                padding: 0 5px
                box-sizing: border-box
                overflow: hidden
            .home-hot-img
                width: 60px
                height: 60px
                line-height: 60px
                float: right
                text-align: center
                img
                    max-width: 100%
                    max-height: 60px
                    vertical-align: middle
            h4
                font-size: 13px
                color: #333
                text-align: left
                overflow: hidden
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 1
                word-break: break-word
                height: 20px
                line-height: 20px
                margin: 4px 0
            p
                line-height: 20px
                height: 20px
                font-size: 12px
                text-align: left
                overflow: hidden
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 1
                word-break: break-word
        &.booth-add-3
            border-right: 1px solid rgba(0,0,0,0.05)
            width: 33.333333%
            padding: 14px 0
            .home-hot-img
                width: 92px
                height: 92px
                line-height: 92px
                float: none
                margin: 0 auto
                text-align: center
                img
                    max-width: 100%
                    max-height: 92px
                    vertical-align: middle
            h4, p
                text-align: center
</style>
