<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <div class="headerTab">
                <router-link title="好友" :class='$t("CommonUse.TransSize")' class="active" :to="{path:'/attendguest/friend', query:{projectId: projectId, passKey: passKey}}">{{$t("Person.MyContact")}}</router-link>
                <router-link title="来宾" :class='$t("CommonUse.TransSize")' :to="{path:'/attendguest/index', query:{projectId: projectId, passKey: passKey}}">{{$t("Person.AllAttend")}}</router-link>
            </div>
            <div class="Occupy"></div>
        </div>
        <div class="boothIndex topSeat botSeat">
            <div class="sticky-area">
                <div class="search-bar">
                    <div class="search-inner">
                        <i class="icon-search"></i>
                        <input title="请输入姓名、消息内的关键字" type="text" v-model.trim="searchval" name="text" :placeholder="$t('Attendee.keyword')">
                    </div>
                    <div title="搜索" class="search-btn" @click="changeSearchVal" v-text='$t("CommonUse.Search")'></div>
                </div>
            </div>
            <div class="boothList listCol-arraw">
                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                  <slot>
                        <boothList :tochildlist='listArry'></boothList>
                  </slot>
                </v-load>

            </div>
        </div>
        <v-footer :showClass="'social'"></v-footer>
    </div>
</template>
<script>

import {mainUserTk,commonAjaxFun} from '../../common/js/common.js'
import boothList from './list.vue'//引入展位列表模块
import vLoad from '../module/loadmore/dropload.vue'
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            listArry:[],   //列表数据
            searchval:'',//搜索查询
            page:0
        }
    },
    components: {
        vLoad,
        vLoginicon,
        vFooter,
        boothList
    },
    methods: {
        _getList: function(num, me, type) {
            //下拉，加载 请求数据
            var _this = this;

            commonAjaxFun({
                url: '/userApi/myUsers',
                data: {
                    projectId: _this.projectId,
                    query: _this.searchval,
                    page: num,
                    userTk: mainUserTk,
                }
            }).then((data) => {

                let _data = data.data;

                _this.listArry = type == 'up' ? _data.rows : _this.listArry.concat(_data.rows);

                if (_data.rows.length == 0) {
                    me.lock();
                    me.noData();
                    me.resetload();
                } else {
                    _this.$nextTick(function() {
                        me.resetload();
                    })
                }
            })
        },
        loadDownFn: function(me) {
            this.page = this.page + 1;
            this._getList(this.page, me);
        },
        loadUpFn: function(me) {
            this.page = 1;
            me.resetload();
            this._getList(1, me, "up");
            me.unlock();
            me.noData(false);
        },
        clearListArry: function() {
            this.page = 0;
            this.listArry = [];
            this.$refs.vLoad.change();
        },
        changeSearchVal: function() {
            this.clearListArry();
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
