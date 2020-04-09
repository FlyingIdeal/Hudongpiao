<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" title="嘉宾" v-text="$t('HomePage.Speaker')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <div class="listCol listCol-arraw" v-show="!loadState">
                <ul class="in-list">
                    <li v-for="(value, key) in guestArr" :akey="key + 1">
                        <router-link :to="{path:'/guest/detail', query:{projectId: projectId, passKey: passKey, childId: value.projectId, detailId: value.guestId, type: 'guestModule'}}">
                            <div class="infro">
                                <div class="photo"><img v-if="value.photo  && value.photo != 'undefined'" v-lazy="value.photo" /><img v-else src="~@/common/images/default.png" /></div>
                                <div class="text">
                                    <h6 v-text="value.name"></h6>
                                    <p v-text="value.company"></p>
                                    <p v-text="value.position"></p>
                                </div>
                            </div>
                            <div class="list-handle"><i class="icon-rightarrow"></i></div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <v-footer :showClass="'mine'"></v-footer>
    </div>
</template>
<script>

import loadState from '../module/loadState/loadState.vue'//加载状态
import headTitle from '../module/head/headTitle.vue'//公共头部
import { commonAjaxFun } from '../../common/js/common.js'
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            loadState: true,//初次进页面加载中
            guestArr: new Array,//嘉宾列表
        }
    },
    components: {
        loadState,
        headTitle,
        vLoginicon,
        vFooter
    },
    mounted(){
        this.homePageAjax();
    },
    methods: {
        homePageAjax: function(){
            //停用vuex，改用公用ajax请求
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/homePageAjax',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey
                }
            }).then((data) => {
                let _data = data.data;
                _this.loadState = false;
                if(data.state == '0'){
                    _this.guestArr = _data.guestModule.content;
                } else {
                    console.log(data.message);
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
