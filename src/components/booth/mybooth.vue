<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" title="我的收藏" v-text="$t('Me.MyFavorites')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="boothIndex topSeat botSeat">
            <div class="sticky-area">
                <div class="cell-filter fav-tab">
                    <ul>
                        <li class="active" v-if="boothNum != 0"><a href="javascript:void(0);"><span title="展位">{{$t("HomePage.Exhibitors")}}({{boothNum}})</span></a></li>
                        <li v-if="productNum != 0"><router-link :to="{path:'/product/myproduct', query:{projectId: projectId, passKey: passKey}}"><span title="展品">{{$t("Exhibits.Title")}}({{productNum}})</span></router-link></li>
                    </ul>
                </div>
            </div>
            <div class="boothList">
                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                    <slot>
                        <boothList :tochildlist='listArry' :mapLink='mapLink'></boothList>
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
    mounted(){
        this.getMyFavoriteNumber();
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
                    isSubFlag: "my_sub_list"
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
        },
        getMyFavoriteNumber: function() { //获取展位和展品数量
            //获取展位下的数据
            let _this = this;
            commonAjaxFun({
                url: '/userApi/myFavorite',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk
                }
            }).then((data) => {
                try {
                    let _data = data.data;
                    if (data.state == '0') {
                        if( _data.boothNum == "0" && _data.productNum !== "0"){
                            _this.$router.push({path:'/product/myproduct', query:{projectId: _this.projectId, passKey: _this.passKey}});
                        }
                        
                        _this.boothNum = _data.boothNum;
                        _this.productNum = _data.productNum;

                    } else {
                        console.log(data.message)
                    }
                } catch (err) {
                    console.log(err)
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.sticky-area
    .cell-filter
        padding: 0px
.fav-tab ul
    display: flex
    width: 100%
    li
        text-align: center
        flex: 1
        width: 50%
        a
            display: block
        span
            display: inline-block
            height: 46px
            line-height: 46px
            border-bottom: 1px solid transparent
        &.active
            span
                border-bottom: 1px solid #f35b00
</style>
