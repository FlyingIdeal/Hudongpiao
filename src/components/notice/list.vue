<template>
    <div>
        <div class="head-back">
            <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')"  v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
            <h2 class="headerTitle" title="我的通知" v-text="$t('Me.MyNotice')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat">
            <div class="notice-list">
                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                  <slot>
                        <syslist :tochildlist='listArry' ></syslist>
                  </slot>
                </v-load>

            </div>
        </div>
    </div>
</template>

<script>

import {mainUserTk, commonAjaxFun} from '../../common/js/common.js'
import vLoad from '../module/loadmore/dropload.vue'
import syslist from './syslist.vue'//系统消息-列表

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            wxShare: `${this.$route.query.wxShare}`,//是否来自微信分享，如果是true，则返回首页，否则返回上一级
            listArry:[],
            searchTag:"",
            page:0
        }
    },
    components: {
        vLoad,
        syslist
    },
    methods: {
        _getList: function(num, me, type) {
            //下拉，加载 请求数据
            let _this = this;

            commonAjaxFun({
                url: '/messageTool/pull',
                data: {
                    userTk: mainUserTk,
                    type: _this.searchTag,
                    page: num
                }
            }).then((data) => {

                if (data.state == "0") {
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
        routerBack: function(){
            if(this.wxShare == 'true'){
                this.$router.push({path : '/home/index', query: {projectId: this.projectId, passKey: this.passKey}});//主页
            } else {
                this.$router.go(-1);
            }
        },
        changeSearchVal: function() {
            this.getChatList();
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
