<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" title="需求" v-text="$t('Demand.Title')"></h2>
            <a href="javascript:void(0);" class="Occupy" @click="demandCreate"><i class="icon-addtopic"></i></a>
        </div>
        <div class="demandIndex topSeat botSeat">
            <div class="sticky-area">
                <div class="cell-filter">
                    <div class="cell-filter-box">
                        <ul>
                            <li title="全部" v-text="cellFilterTxt"></li>
                        </ul>
                    </div>
                    <div class="class-filter" @click="showClassify"><i class="icon-classify"></i><span v-text='$t("CommonUse.Sort")'></span></div>
                </div>
            </div>
            <div class="listCol-arraw">
                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                    <slot>
                        <boothList :tochildlist='listArry'></boothList>
                    </slot>
                </v-load>
            </div>
            <!--分类筛选-->
            <transition name="move">
                <div class="classifyBar" v-show="showClassFlag">
                    <v-classify ref="classify" v-on:getClassify="_getClassify"></v-classify>
                    <div class="classifyButtom">
                        <a href="javascript:void(0);" @click="reset" class="reset">重置</a>
                        <a href="javascript:void(0);" @click="submit" class="submit">确定</a>
                    </div>
                </div>
            </transition>
        </div>
        <v-footer :showClass="'booth'"></v-footer>
        <smallFrom ref= 'smallFrom' v-show='smallFromFlag' :setSmallFromFlag = "setSmallFromFlag" ></smallFrom>
    </div>
</template>
<script>

import {mainUserTk,commonAjaxFun} from '../../common/js/common.js'
import boothList from './list.vue'//引入展位列表模块
import vLoad from '../module/loadmore/dropload.vue'
import vClassify from '../module/classify/classify.vue'
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import smallFrom from '../module/smallFrom/index.vue'
export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            showClassFlag: false,//分类的显示隐藏
            listArry:[],
            page:0,
            categoryId:[],
            cellFilterTxt: '',
            categoryStr:"",
            smallFromFlag:false  // 判断表单显示隐藏
        }
    },
    components: {
        vLoad,
        vClassify,
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
                    cateId: _this.categoryId
                }
            }).then((data) => {

                try {
                    _this.showAddress = false;
                    _this.showBoothClassifyFlag = false;

                    let _data = data.data;


                    if (_this.categoryId.length == 0) {
                        _this.cellFilterTxt = `${_this.$t("CommonUse.All")}(${_data.total})`;
                    } else {
                        _this.cellFilterTxt = `${_this.categoryStr}(${_data.total})`;
                    }

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
        clearListArry: function() {
            this.page = 0;
            this.listArry = [];
            this.$refs.vLoad.change();
        },
        setSmallFromFlag:function(flag){
            this.smallFromFlag = flag
        },
        demandCreate: function(){
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
            
        },
        submit: function() {
            //分类确定按钮
            this.$refs.classify.submit();
        },
        reset: function() {
            //分类重置按钮
            this.$refs.classify.reset();
        },
        _getClassify: function(val, str) {
            this.categoryId = [];
            this.categoryStr = str;

            for (let i = 0; i < val.length; i++) {
                this.categoryId.push(val[i])
            }


            if( this.categoryId.length>0){
               this.clearListArry() 
            }

            this.showClassify();

        },
        showClassify: function() {
            //分类显示隐藏
            this.showClassFlag = !this.showClassFlag;
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.header .Occupy i
    color: #f35b00
</style>
