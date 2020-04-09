<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" v-text="toptitle"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="brief topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <v-Brief v-if="thisModule.content" :content="thisModule.content" v-show="!loadState"></v-Brief>
            <div class="noMoreData" title="暂无数据" v-if="!thisModule.content && !loadState">{{$t("CommonUse.hasNoDate")}}</div>
        </div>
        <v-footer :showClass="'mine'"></v-footer>
    </div>
</template>

<script>

import { commonAjaxFun } from '../../common/js/common.js'
import headTitle from '../module/head/headTitle.vue'//公共头部
import vBrief from '../module/brief/brief.vue'
import loadState from '../module/loadState/loadState.vue'//加载状态
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"

export default {
    data(){
        return {
            loadState: true,//初次进页面加载中
            thisModule: '',//当前模块对象
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            toptitle: `${this.$route.query.title}`,//头部
            childId: `${this.$route.query.childId}`,//子项目childId
            childpassKey: `${this.$route.query.childpassKey}`,//子项目childpassKey
            type: `${this.$route.query.type}`
        }
    },
    components: {
        headTitle,
        vBrief,
        loadState,
        vLoginicon,
        vFooter
    },
    methods: {
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

.brief
    .quotetext
        padding: 10px
        background: #fff
</style>
