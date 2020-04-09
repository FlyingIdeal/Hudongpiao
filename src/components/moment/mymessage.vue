<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <div class="headerTab">
                <router-link :to="{path:'/moment/mymoment', query:{projectId: projectId, passKey: passKey}}" title="我的">{{$t("Forum.Mine")}}</router-link>
                <router-link :to="{path:'/moment/mymessage', query:{projectId: projectId, passKey: passKey}}" title="消息列表">{{$t("Moment.MessageCenter")}}</router-link>
            </div>
            <router-link class="Occupy" :to="{path:'/moment/create', query:{projectId: projectId, passKey: passKey}}"><i class="icon-camera"></i></router-link>
        </div>
        <div class="moment topSeat botSeat">
            <div class="momentList">
              <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                 <slot>
                       <mymessageList :tochildlist='listArry'></mymessageList>
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
import mymessageList from './mymessageList.vue'//
import {mainUserTk, formatDate,commonAjaxFun} from '../../common/js/common.js'
import vLoad from '../module/loadmore/dropload.vue'

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            whichfrom: 'mymessageList',//插槽组件来源
            listArry:[],
            queryTime:formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
        }
    },
    components: {
        vLoad,
        vLoginicon,
        vFooter,
        mymessageList
    },
    methods: {
        _getList: function(num, me, type) {
            //下拉，加载 请求数据
            let _this = this;

            commonAjaxFun({
                url: '/interactCircle/myMsg',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    unRead: false,
                    date: this.queryTime
                }
            }).then((data) => {
                let _data = data.data;

                _this.listArry = type == 'up' ? _data : _this.listArry.concat(_data);

                if (data.state == "0") {
                    if (_data.length == 0) {
                        me.lock();
                        me.noData();
                        me.resetload();
                    } else {
                        _this.$nextTick(function() {

                            this.queryTime = _data[_data.length - 1].createTime;
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
            this.queryTime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
            me.resetload();
            this._getList(1, me, "up")
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
