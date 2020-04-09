<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" title="我的日程" v-text="$t('Me.MySchedule')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <div class="mine-nolist-tips" v-show="!loadState" v-if="scheduleArr.length == 0">
                <i class="icon-emptybowl"></i>
                <p title="您还未添加日程，请前往日程添加">{{$t("Schedule.NoScheduleTips")}}</p>
                <router-link class="create-btn" :to="{path:'/schedule/index', query:{projectId: projectId, passKey: passKey, childId: dataModule.projectId, childpassKey: dataModule.passKey, appId: dataModule.appId, type: dataModule.beanName, title: dataModule.appName}}" title="日程">{{$t("HomePage.Schedule")}}</router-link>
            </div>
            <v-Schedule v-show="!loadState" v-if="scheduleArr.length > 0" v-on:toGreatParCollectbooth="_toGreatParCollectbooth" :content="scheduleArr" :type="type"></v-Schedule>
        </div>
        <v-footer :showClass="'mine'"></v-footer>
    </div>
</template>
<script>

import vSchedule from '../module/schedule/schedule.vue'
import {formatDate, filterCurrentModule, collectDataFun, commonAjaxFun } from '../../common/js/common.js'
import headTitle from '../module/head/headTitle.vue'//公共头部
import loadState from '../module/loadState/loadState.vue'//加载状态
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            dataModule:'',//日程模块，当我的日程列表为空时，去日程页面mine-nolist-tips的url使用
            loadState: true,//初次进页面加载中
            type: 'collect',//根据类型，从而让子组件隐藏点击下拉功能，顺便增加收藏功能
            scheduleArr: []//日程数组
        }
    },
    components: {
        headTitle,
        vSchedule,
        loadState,
        vLoginicon,
        vFooter
    },
    mounted(){
        this.getMySchedule();
        this.getChildrenProject()
    },
    methods: {
        _toGreatParCollectbooth: function(id, data){
            let _obj = collectDataFun(this.scheduleArr, id);//筛选当前的index
            this.$set(this.scheduleArr[_obj.mainIndex].meetings[_obj.meetingsIndex].granules[_obj.granulesIndex], 'watched', data);
        },
        getMySchedule: function(){
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getSchduleList',
                data: {
                    projectId: _this.projectId,
                    type: 'appScheduleModule',
                    onlyWatched: true
                }
            }).then((data) => {
                let _data = data.data;
                if(data.state == '0') {
                    _this.loadState = false;
                    _this.scheduleArr = _data;
                } else {
                    console.log(data.message)
                }
            })
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
                        _this.dataModule = filterCurrentModule(_data.modules, 'appScheduleModule');//拿到对应的动态模块
                    } else {
                        console.log(data.message);
                    }

                } catch(e) {
                    console.log(e)
                }
                
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>


