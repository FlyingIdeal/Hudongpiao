<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" v-text="toptitle"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="dataIndex topSeat botSeat">
            <div class="sticky-area">
                <div class="search-bar">
                    <div class="search-inner">
                        <i class="icon-search"></i>
                        <input type="text" v-model.trim="searchval" name="text" title="搜索资料名字" :placeholder="$t('ExhibitorDetail.keyword')">
                    </div>
                    <div title="搜索" class="search-btn" @click="changeSearchVal">{{$t("CommonUse.Search")}}</div>
                </div>
                <div class="cell-filter">
                    <div class="cell-filter-box">
                        <ul>
                            <li title="全部">{{$t("ExhibitorDetail.All")}}({{childLength}})</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="boothList">
                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                    <slot>
                        <boothList :tochildlist='listArry'></boothList>
                    </slot>
                </v-load>
            </div>
        </div>
        <v-footer :showClass="'mine'"></v-footer>
    </div>
</template>

<script>
import vLoad from '../module/loadmore/dropload.vue'
import boothList from './list.vue'//引入展位列表模块
import headTitle from '../module/head/headTitle.vue'//公共头部
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import {initAllWeiXin,commonAjaxFun} from '../../common/js/common.js'

export default {
    data(){
        return {
            searchval:'',//搜索查询
            listArry:[],
            childLength: 0,//资料总个数
            toptitle: `${this.$route.query.title}`,//头部
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            page:0

        }
    },
    components: {
        headTitle,
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
                url: '/eventapi/during/getAllDatum',
                data: {
                    projectId: _this.projectId,
                    page: num,
                    searchVal: _this.searchval
                }
            }).then((data) => {
                
                let _data = data.data;

                if (data.state == '0') {
                    _this.listArry = type == 'up' ? _data.rows : _this.listArry.concat(_data.rows);

                    _this.childLength = data.data.total;

                    if (_data.rows.length == 0) {
                        me.lock();
                        me.noData();
                        me.resetload();
                    } else {
                        _this.$nextTick(function() {
                            me.resetload();
                        })
                    }
                } else {
                    console.log(data.message)
                }

            })
        },
        loadDownFn: function(me) {
            this.page = this.page + 1;
            this._getList(this.page, me);
        },
        loadUpFn: function(me) {

            this.page = 1;

            this.$nextTick(function() {
                me.resetload();
                setTimeout(function() {
                    me.resetload();
                }, 200);
                me.unlock();
                me.noData(false);
                this._getList(1, me, 'up')
            })
        },
        clearListArry: function() {
            this.page = 0;
            this.listArry = [];
            this.$refs.vLoad.change();
        },
        changeSearchVal: function() {
            this.clearListArry();
        }
    },
    mounted() {
        //次判断用于来宾详情页面单独微信分享
        if (this.needSingleWx) {
            let desc = "资料下载";
            let link = this.toFullPath;
            initAllWeiXin(this.projectId, this.passKey, 'data', {}, {
                desc: desc,
                link: link
            })

        }
    }
}
</script>
<style lang="stylus" rel="stylesheet/stylus"></style>
