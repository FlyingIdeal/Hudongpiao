<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" title="我的" v-text="$t('Me.MyAppointment')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="boothIndex topSeat botSeat">
            <div class="boothList">
                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                    <slot>
                        <boothList :tochildlist='listArry' :mapLink='mapLink' :showTime="'true'"></boothList>
                    </slot>
                </v-load>
            </div>
        </div>
        <v-footer :showClass="'mine'"></v-footer>
    </div>
</template>
<script>

import {mainUserTk, commonAjaxFun} from '../../common/js/common.js'
import vLoad from '../module/loadmore/dropload.vue'
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import boothList from './list.vue'//引入展位列表模块
export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            listArry: [], //列表数据
            mapLink: '', //判断是否有地图
            boothNum: 0, //展位数量
            productNum: 0, //展品数量
            page: 0
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
            let _this = this;

            commonAjaxFun({
                url: '/boothApi/getBooths',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey,
                    page: num,
                    userTk: mainUserTk,
                    isSubFlag: 'my_sub_list',
                    watchType: 'booth_sub'
                }
            }).then((data) => {
                if (data.state == "0") {

                    let _data = data.data;

                    //添加recommend字段，用于区分默认还是系统推送展位
                    for (let i = 0; i < _data.pageObj.rows.length; i++) {
                        _data.pageObj.rows[i]['recommend'] = 'normal';
                    }

                    _this.listArry = type == 'up' ? _data.pageObj.rows : _this.listArry.concat(_data.pageObj.rows);

                    _this.mapLink = _data.mapLink;

                    if (_data.pageObj.rows.length == 0) {
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
            this._getList(this.page, me)
        },
        loadUpFn: function(me) {
            this.page = 1;
            me.resetload();
            this._getList(1, me, "up");
            me.unlock();
            me.noData(false);
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
        
</style>

