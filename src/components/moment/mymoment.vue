<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <div class="headerTab">
                <router-link class="active" :to="{path:'/moment/mymoment', query:{projectId: projectId, passKey: passKey}}" title="我的">{{$t("Forum.Mine")}}</router-link>
                <router-link :to="{path:'/moment/mymessage', query:{projectId: projectId, passKey: passKey}}" title="消息列表">{{$t("Moment.MessageCenter")}}</router-link>
            </div>
            <router-link class="Occupy" :to="{path:'/moment/create', query:{projectId: projectId, passKey: passKey}}"><i class="icon-camera"></i></router-link>
        </div>
        <div class="moment topSeat botSeat">
            <div class="momentList">
               <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                  <slot>
                        <boothList :tochildlist='listArry'></boothList>
                  </slot>
                </v-load>
            </div>
        </div>
        <v-footer></v-footer>
    </div>
</template>
<script>
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import vLoad from '../module/loadmore/dropload.vue'
import { mainUserTk, commonAjaxFun } from '../../common/js/common.js'
import boothList from './list.vue'//引入展位列表模块

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            listArry:[],
            queryTime:""
        }
    },
    components: {
        vLoad,
        vLoginicon,
        vFooter,
        boothList
    },
    methods: {
        _getList: function(me, type) {
            //下拉，加载 请求数据
            let _this = this;

            commonAjaxFun({
                url: '/interactCircle/getThemeList',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    type: 'mine',
                    queryTime: _this.queryTime
                }
            }).then((data) => {
                let _data = data.data;

                _this.listArry = type == 'up' ? _data.list : _this.listArry.concat(_data.list);
                _this.queryTime = data.data.queryTime;

                if (_data.list.length == 0) {
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
            this._getList(me);
        },
        loadUpFn: function(me) {
            this.queryTime = "";
            me.resetload();
            this._getList(me, "up");
            me.unlock();
            me.noData(false);
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.header .Occupy i.icon-camera
    font-size: 26px
    color: #f35b00
</style>
