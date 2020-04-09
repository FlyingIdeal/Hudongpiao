<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" title="日程" v-text="$t('HomePage.Schedule')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <v-Schedule v-if="scheduleArr.length > 0" v-on:toGreatParCollectbooth="_toGreatParCollectbooth" :content="scheduleArr"></v-Schedule>
        </div>
        <v-footer :showClass="'schedule'"></v-footer>
    </div>
</template>
<script>

import vSchedule from '../module/schedule/schedule.vue'
import {formatDate, commonAjaxFun, collectDataFun, mainUserTk } from '../../common/js/common.js'
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
    },
    methods: {
        _toGreatParCollectbooth: function(id, data){
            let _obj = collectDataFun(this.scheduleArr, id);//筛选当前的index
            this.$set(this.scheduleArr[_obj.mainIndex].meetings[_obj.meetingsIndex].granules[_obj.granulesIndex], 'watched', data)
        },
        getMySchedule: function(){
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getSchduleList',
                data: {
                    projectId: _this.projectId,
                    type: 'appScheduleModule',
                    userTk: mainUserTk
                }
            }).then((data) => {
                let _data = data.data;
                _this.loadState = false;
                if(data.state == '0') {
                    _this.scheduleArr = _data;
                } else {
                    console.log(data.message)
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>


