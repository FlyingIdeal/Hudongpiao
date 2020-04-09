<template>
    <div class="schedule">
        <div class="scheduleList">
            <h3 class="console-sch-h3" v-text="defaultMonth"></h3>
            <div class="dataScroll" ref="dataScroll" id="dataScroll">
                <ul class="scroll-center" :style="{width: scrollWidth}">
                    <li @click="changeDate(key, $event)" class="scroll-child" :class="[value.hasDate == 'yes' ? 'has' : 'no', value.toady == 'true' ? 'active' : '']" :style="{width: Width}" v-for="(value, key) in dateJsonArr" ref="scrollChild">
                        <p :style="{height: Height}" v-text="value.week"></p>
                        <p :style="{height: Height}" v-text="value.day"></p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="meetingList">
            <div class="meetingPlace" v-for="(value, key) in content" v-show="dateShowFlag[key]">
                <template v-for="(item, index) in value.meetings">
                    <h3 class="console-txt-h3"><span>{{item.name}}<em class="meet-place" v-if="item.place">  ({{item.place}})</em></span></h3>
                    <ul>
                        <li v-for="gran in item.granules">
                            <router-link class="toLink" :to="{path:'/schedule/detail', query:{projectId: projectId, passKey: passKey, childId:item.projectId, detailId: gran.id, type: 'appScheduleModule'}}">
                                <div class="timer">
                                    <span>{{gran.startTime | formatDate}}</span>
                                    <span>{{gran.endTime | formatDate}}</span>
                                </div>
                                <div class="meetTxt">
                                    <div class="meetTxt-theme" v-text="gran.theme"></div>
                                    <div class="listCol listCol-arraw" v-if="gran.guests.length > 0">
                                        <ul class="in-list">
                                            <li v-for="(value, key) in gran.guests" :akey="key + 1">
                                                <div class="infro">
                                                    <div class="photo"><img v-if="value.photo" v-lazy="value.photo" /><img v-else src="~@/common/images/default.png" /></div>
                                                    <div class="text">
                                                        <h6 v-text="value.name"></h6>
                                                        <p v-text="value.company"></p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </router-link>
                            <div class="list-handle"><v-heart :defaultIcon="defaultIcon" :activeIcon="activeIcon" v-on:toParCollectboothid="_toParCollectboothid" :favState="gran.watched" :axiosParam="{url:url, data:{id: gran.id, type: 'schedule', projectId: projectId, userTk: userTk}}"></v-heart></div>
                        </li>
                    </ul>
                </template>
            </div>
        </div>
    </div>
</template>
<script>

import {formatDate, scheduleFormat, mainUserTk} from '../../../common/js/common.js';
import BScroll from 'better-scroll';
import vHeart from '../heart/heart.vue'

export default {
    data(){
        return {
            Height: '20px',
            Width: '',
            deIndex: 0,
            liLength: 0,//li的长度
            dateJsonArr : new Array(),
            scrollWidth: '',//滑动总宽度
            defaultMonth : '',
            dateShowFlag: new Array(),//默认显示日程
            defaultIcon: 'icon-heart',//收藏点选之前的状态
            activeIcon: 'icon-hearted icon_color',//点选周的选中状态
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            userTk: mainUserTk,
            url: '/userApi/watch'
        }
    },
    props: {
        content: Array
    },
    components: {
        vHeart
    },
    filters: {
        formatDate(time){
            let data = new Date(time.replace(new RegExp("-","gm"),"/"));
            return formatDate(data, 'HH:mm')
        }
    },
    mounted(){
        this._scheduleFormat();//日程
    },
    methods: {
        _toParCollectboothid: function(id, data){
            //再向上一级发送
            this.$emit('toGreatParCollectbooth', id, data);
        },
        changeDate: function(key, event){
            //切换日程
            if (!event._constructed) {
                return;//原生对象处理
            }

            if(this.dateJsonArr[key].hasDate == 'no'){
                return;
            }

            for(let i = 0; i < this.dateJsonArr.length; i++){
                this.dateJsonArr[i].toady = 'false'
            }

            this.dateJsonArr[key].toady = 'true';

            let tabIndex = this.dateJsonArr[key].index;

            //处理小技巧，因为dataJson对象数组不会变化，用下面方法添加在删除可实现
            this.dateJsonArr.push({});
            this.dateJsonArr.pop();


            //table变化
            for(let k = 0; k < this.dateShowFlag.length; k++){
                this.dateShowFlag[k] = false
            }

            this.dateShowFlag[tabIndex] = true;

            this.defaultMonth = this.dateJsonArr[key].yearmonth;//默认第一个日期的年月

        },
        setScrollChildWidth: function(){
            //动态设置滑动日期宽度
            let scrollBoxDomWidth = $('#dataScroll').width();//外围DOM

            let scrollChilWidth = parseInt(scrollBoxDomWidth / 7);//slide宽度

            //单个li宽度
            if(scrollChilWidth >= 80){
                this.Width = "80px";
            } else if (scrollChilWidth <= 42) {
                this.Width = "42px";
            } else {
                this.Width = scrollChilWidth + "px";
            }

            this.Height = parseInt(scrollChilWidth / 2) + 'px';

            this.scrollWidth = scrollChilWidth * this.dateJsonArr.length + 'px';

            //this._initScroll();
            this.$nextTick(() => {
                this._initScroll();//当渲染完li的时候初始化滑动组建
            })

        },
        _initScroll: function(){
            //日期滑动到指定日期
            this.dataScroll = new BScroll(this.$refs.dataScroll, {
                click: true,
                scrollX: true
            });

            if(!!this.deIndex){

                let scrollChild = this.$refs.scrollChild;
                this.dataScroll.scrollToElement(scrollChild[this.deIndex], 100, true, true);

            }

        },
        _scheduleFormat: function(){

            //设置格式化日期
            if(this.content.length == 0){
                return;
            }else {

                this.dateJsonArr = scheduleFormat(this.content);
                this.defaultMonth = this.dateJsonArr[0].yearmonth;//默认第一个日期的年月

                this.dateShowFlagFun();//去便利index从而控制高亮和显示
            }

        },
        dateShowFlagFun: function(){
            //如果日程和当前天相同则显示当前天的日程，否则默认显示第一天日程
            let nowDate = formatDate(new Date(), 'yyyy年MM月dd日');//当前天

            let Index = 0;

            for(let i = 0; i < this.content.length; i++){

                let _regTime = new Date(this.content[i].date.replace(new RegExp("-","gm"),"/"));

                let _curDate = formatDate(new Date(_regTime), 'yyyy年MM月dd日');//当前天

                if(nowDate == _curDate){
                    this.dateShowFlag.push(true);
                } else {
                    this.dateShowFlag.push(false);
                    Index++;
                }

                if(Index == this.content.length){
                    this.dateShowFlag[0] = true;
                }
            }

            let dayIndex = 0;
            //对this.dataJsonArr处理，从而匹配当前天
            for(let j = 0; j < this.dateJsonArr.length; j++){

                this.dateJsonArr[j].toady = 'false';

                if(nowDate == this.dateJsonArr[j].yearmonthDate && this.dateJsonArr[j].hasDate == 'yes'){
                    this.dateJsonArr[j].toady = 'true';
                    this.deIndex = j;
                } else {
                    dayIndex++;
                }

            }

            if(dayIndex == this.dateJsonArr.length){
                for(let z = 0; z < this.dateJsonArr.length; z++){
                    if(this.dateJsonArr[z].hasDate == 'yes'){
                        this.dateJsonArr[z].toady = 'true';
                        break;
                    }
                }
            }

            this.setScrollChildWidth();//初始化li的宽度

        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../../common/stylus/function.styl"
.scheduleList
    background: #fff
    padding: 10px 0
    text-align:center
    font-size:14px
.dataScroll
    overflow:hidden
    margin-top:10px
    .scroll-center
        font-size: 0
        text-align:center
    .scroll-child
        display:inline-block
        font-size:16px
        color:#c6c6c6
        border-radius: 50%
        overflow: hidden
        &.has
            color:#000000
        &.active
            background: #f25b00
            color:#fff
        p
            box-sizing: border-box
        p:first-child
            font-size: 12px
            padding: 4px 0 1px
            margin-bottom: -2px
        p:last-child
            font-size: 16px
            padding: 1px 0 4px
.meetingList .meetingPlace li .list-handle
    height: 40px
    line-height: 40px
    i.icon-heart, i.icon-hearted
        display: block !important
</style>


