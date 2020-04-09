<template>
    <ul class="in-list">
        <template v-for="(value, key) in tochildlist">
            <!--插入展位广告-->
            <li class="booth-ad" v-if="showHot == 'true' && value && !!value.recommend && value.recommend == 'push'"  :akey="key">
                <router-link :to="{path:'/booth/detail', query:{projectId: projectId, passKey: passKey, boothId: value.id}}">
                    <div class="home-hot-img">
                        <img v-if="value.boothFigure" :src="value.boothFigure" /><img v-else src="~@/common/images/boothPhoto.png" />
                    </div>
                    <h4 v-text="value.company"></h4>
                    <div class="home-hot-detail">
                        <span title="件展品"><em v-text="value.productNum"></em> {{$t("ExhibitorDetail.Aexhibits")}}</span>
                        <span title="个参展人员"><em v-text="value.contactNum"></em> {{$t("ExhibitorDetail.Aexhibitors")}}</span>
                    </div>
                </router-link>
            </li>
            <h5 v-if="showTime == 'true'" class="time-text"><i v-text="$t('RegLogin.AppointmentDate') + ':'" title="预约时间:"></i><em v-text='value.subscribeDate.slice(0,10)'></em><em v-text='value.subscribePart'></em></h5>
            <li v-if="value.recommend == 'normal'"  :akey="key">
                <router-link :to="{path:'/booth/detail', query:{projectId: projectId, passKey: passKey, boothId: value.id}}">
                    <div class="infro">
                        <div class="photo"><i class="new" v-if="value.isNewBooth"></i><img v-if="value.comLogo" :src="value.comLogo" /><img v-else src="~@/common/images/boothPhoto.png" /></div>
                        <div class="text">
                            <h6 v-text="value.boothName"></h6>
                            <p v-if="value.catesList">{{value.catesList | toList}}</p>
                            <p v-text="value.boothNum"></p>
                            <div class="tag" v-if='value.saleStatus == "1" || value.cityStatus =="1" || value.relateStatus =="1"'>
                                <i class="icon-label"></i>
                                <span title="同城" class="orange" v-if='value.cityStatus =="1"'>{{$t("label.SameCity")}}</span>
                                <span title="同兴趣" class="green" v-if='value.relateStatus =="1"'>{{$t("label.SameInterest")}}</span>
                                <span title="促销" class="yellow" v-if='value.saleStatus =="1" '>{{$t("label.Sales")}}</span>
                            </div>
                        </div>
                    </div>
                </router-link>
                <!--暂时取消收藏按钮-->
                <div class="list-handle" v-if="showMapIcon(value.fid)"><i @click="toMap(value.fid)" class="icon-address"></i></div>
                <div class="list-handle" v-else><i class="icon-rightarrow"></i></div>
                <!-- <div class="list-handle" v-if="showTime != 'true'">
                    <v-heart :defaultIcon="defaultIcon" :activeIcon="activeIcon" :favState="value.subFlag" :axiosParam="{url:url, data:{id: value.id, type: 'booth', projectId: projectId, userTk: userTk}}"></v-heart>
                </div> -->
            </li>
        </template>
    </ul>
</template>

<script>

import vHeart from '../module/heart/heart.vue'
import { boothClassifyToList, mainUserTk} from '../../common/js/common.js'

export default {
    props: {
        showHot: String,//是否加入推荐展位
        mapLink: String,
        showTime: String,//是否显示预约时间
        tochildlist: Array
    },
    components: {
        vHeart
    },
    data() {
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            userTk: mainUserTk,
            defaultIcon: 'icon-heart', //收藏点选之前的状态
            activeIcon: 'icon-hearted icon_color', //点选周的选中状态
            url: '/userApi/watch', //点赞使用
        }
    },
    filters: {
        toList: function(val) {
            return boothClassifyToList(val)
        }
    },
    methods: {
        toMap: function(fid){
            if(!fid){
                return false;
            } else {
                this.$router.push({path : '/map/index', query: {projectId: this.projectId, passKey: this.passKey, fid: fid}});//主页
            }
        },
        showMapIcon: function(fid) {
            if (!!fid && this.mapLink && this.mapLink.indexOf('mapid') > 0) {
                return true;
            } else {
                return false;
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

@import "../../common/stylus/function.styl"

.listCol
    li
        h4
            display: flex
            width: 100%
        i.new
            position: absolute
            right: 0px
            top: 0px
            width: 20px
            height: 10px
            background: url('~@/common/images/new.png') 0 0 no-repeat
            background-size: 20px 10px
    .time-text
        border-bottom-px(1px, rgba(0,0,0,0.02))
        font-size:14px
        padding:8px 0
        em
            color: #F35B00
            margin:0 5px
.listCol ul.in-list
    font-size: 0px
    li.booth-ad
        display: inline-block
        font-size: 0px
        width: 50%
        a
            display: block
            padding: 0 5px
            box-sizing: border-box
        .home-hot-img
            height: 92px
            line-height: 92px
            text-align: center
            img
                max-width: 100%
                max-height: 92px
                vertical-align: middle
        h4
            font-size: 13px
            color: #333
            overflow: hidden
            overflow: hidden
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            word-break: break-word
            height: 20px
            line-height: 20px
            margin: 4px 0
        .home-hot-detail
            text-align: left
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            span
                display: inline-block
                height: 20px
                line-height: 20px
                font-size: 12px
                margin-right: 4px
                color: #999
                em
                    color: #f35b00
</style>
