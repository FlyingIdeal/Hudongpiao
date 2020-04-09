<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" title="我的需求" v-text="$t('Demand.myDemand')"></h2>
            <!-- <router-link class="Occupy" :to="{path:'/demand/create', query:{projectId: projectId, passKey: passKey}}"><i class="icon-addtopic"></i></router-link> -->
            <div class="Occupy" @click='createDemandBtn'><i class="icon-addtopic"></i></div>
        </div>
        <div class="demandIndex topSeat botSeat">
            <div class="mine-nolist-tips" v-show="childLength == 0">
                <i class="icon-emptybowl"></i>
                <p title="暂无需求快来发布吧">{{$t("Demand.MoreInquiries")}}</p>
                <div title="创建需求" class="create-btn" @click='createDemandBtn'>{{$t("Demand.CreateDemand")}}</div>
                <!-- <router-link title="创建需求" class="create-btn" :to="{path:'/demand/create', query:{projectId: projectId, passKey: passKey}}">{{$t("Demand.CreateDemand")}}</router-link> -->
            </div>
            <div class="listCol-arraw" v-show="childLength > 0">
                <!-- <v-load ref="child" v-on:childEvent="_childEvent" v-on:childLength="_childLength" :params="params" :whichfrom="whichfrom"></v-load> -->
                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                    <slot>
                        <boothList :tochildlist='listArry'></boothList>
                    </slot>
                </v-load>
            </div>
        </div>
        <v-footer :showClass="'mine'"></v-footer>

        <smallFrom ref= 'smallFrom' v-show='smallFromFlag' :setSmallFromFlag = "setSmallFromFlag" ></smallFrom>
    </div>
</template>
<script>

import { mainUserTk,commonAjaxFun} from '../../common/js/common.js'
import vLoad from '../module/loadmore/dropload.vue'
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import boothList from './list.vue'//引入展位列表模块
import smallFrom from '../module/smallFrom/index.vue'
export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            listArry:[],
            page:0,
            childLength: 1, //需求个数
            smallFromFlag:false  // 判断表单显示隐藏
        }
    },
    components: {
        vLoad,
        vLoginicon,
        vFooter,
        boothList,
        smallFrom
    },
    methods: {
        _getList: function(num, me, type) {
            //下拉，加载 请求数据
            let _this = this;
            commonAjaxFun({
                url: '/interact/needs/getPage',
                data: {
                    projectId: _this.projectId,
                    page: num,
                    userTk: mainUserTk,
                    type: 'mine'
                }
            }).then((data) => {
                try {

                    let _data = data.data;
                    //console.log(data)
                    _this.childLength = _data.total;
                    _this.listArry = type == 'up' ? _data.rows : _this.listArry.concat(_data.rows);

                    if (data.state == "0") {
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

                } catch (e) {
                    console.log(e)
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
                this._getList(1, me, "up")
            })
        },
        setSmallFromFlag:function(flag){
            this.smallFromFlag = flag
        },
        createDemandBtn:function(){

            let _this = this;

            _this.$layer.loading()

            commonAjaxFun({
                url: '/userApi/userInfo',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    userId: ""
                }
            }, 200).then((data) => {
                _this.$layer.close();

                let _data = data.data;
                if(data.state == '10001'){
                    //首先判断是否登录
                    localStorage.setItem(_this.returnUrl, _this.toFullPath);//本地存储backurl

                    _this.$router.push({path : '/login/index', query: {projectId: _this.projectId, passKey: _this.passKey}});//'请先登录！'
                } else {
                    //console.log(_data)
                    if(_data.name == '' || _data.companyInfo.company == '' || _data.companyInfo.roleType == ''){
                        _this.setSmallFromFlag(true)
                        _this.$refs.smallFrom.setFormValue({name: _data.name,company: _data.companyInfo.company,Role:_data.companyInfo.roleType})

                    } else {
                       this.$router.push({path : '/demand/create', query: {projectId: this.projectId, passKey: this.passKey}});//主页
                    }
                }

        
            })
            

        }

    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.header .Occupy i
    color: #f35b00
</style>
