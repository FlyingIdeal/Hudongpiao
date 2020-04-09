<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <div class="header-search">
                <input v-model.trim="searchval" @keyup.enter="searchRoute" class="header-search-input" maxlength="10" :placeholder="$t('Exhibitor.keyword')" type="text" name="" />
                <i class="icon-close" v-if="searchval" @click="clearSearchVal"></i>
                <i class="icon-search" @click="changeSearchVal"></i>
            </div>
            <v-mapicon></v-mapicon>
        </div>
        <div class="porductIndex topSeat botSeat">
            <div class="sticky-area">
                <div class="booth-fav-tab">
                    <ul>
                        <li class="active"><span title="展品">{{$t("Exhibits.Title")}}</span></li>
                        <li @click="searchRoute"><span title="展位">{{$t("HomePage.Exhibitors")}}</span></li>
                    </ul>
                </div>
                <div class="cell-filter">
                    <div class="cell-filter-box">
                        <ul>
                            <li title="综合" class="active" @click="changeSearchTag($event,'all')">{{$t("CommonUse.Comprehensive")}}</li>
                            <li title="最热" @click="changeSearchTag($event,'hot')">{{$t("Forum.Hot")}}</li>
                            <li title="新展品" @click="changeSearchTag($event,'new')">{{$t("label.newProduct")}}</li>
                            <li title="促销" @click="changeSearchTag($event,'sale')">{{$t("label.Sales")}}</li>
                            <!-- <li title="猜你喜欢" @click="changeSearchTag($event,'relate')" v-if="tagRelate">{{$t("label.GuessYouLike")}}</li> -->
                            <li title="同城" @click="changeSearchTag($event,'local')" v-if="tagLocal">{{$t("label.Locality")}}</li>
                        </ul>
                    </div>
                    <div class="class-filter" @click="showClassify"><i class="icon-classify"></i><span v-text='$t("CommonUse.Sort")'></span></div>
                </div>
            </div>
            <!--地址-->
            <div class="booth-local" v-if="showAddress">
                <h6 v-text='hasAddressTitle'></h6>
                <v-address ref="Address" :address="address" v-on:getAddress="_getAddress"></v-address>
                <!--地址提交-->
                <div class="ready-submit" @click="submitForm" title="确定">{{$t("RegLogin.Confirm")}}</div>
                <p><router-link :to="{path:'/label/index', query:{projectId: projectId, passKey: passKey}}">{{$t("label.GoLabel")}}</router-link></p>
            </div>
            <!--展位分类-->
            <div class="booth-classify" v-if="showBoothClassifyFlag">
                <h6 class="local-title">{{$t("label.EnterIndustry")}}</h6>
                <v-classify ref="boothclassify" :type="'boothclassify'" v-on:getClassify="boothGetClassify"></v-classify>
                <!--展位分类提交-->
                <div class="ready-submit" @click="submitBoothClassify" title="确定">{{$t("RegLogin.Confirm")}}</div>
                <p class="local-tips"><router-link :to="{path:'/label/index', query:{projectId: projectId, passKey: passKey}}">{{$t("label.GoLabel")}}</router-link></p>
            </div>
            <div class="boothList" v-show="!showAddress && !showBoothClassifyFlag">
                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                    <slot>
                        <boothList :tochildlist='listArry' :showHot="'true'"></boothList>
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
        <v-footer :showClass="'home'"></v-footer>
    </div>
</template>
<script>

import {mainUserTk, commonAjaxFun } from '../../common/js/common.js'
import vLoad from '../module/loadmore/dropload.vue'
import vClassify from '../module/classify/classify.vue'
import boothList from './list.vue'//引入展位列表模块
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import vMapicon from "../module/mapicon/mapicon"
import vAddress from '../module/address/address.vue'//省级联动

export default {
    data() {
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            searchval: `${this.$route.query.search}` == 'undefined' ? '' : `${this.$route.query.search}`, //搜索查询
            searchValChange: '', //配合缓存使用
            listArry: [], //列表数据
            mapLink: '', //判断是否有地图
            searchTag: "", //当前标签
            categoryId: [], //选中的分类
            showAddress: false, //是否显示地址组建
            address: "中国-北京-北京",
            addressResult: "中国-北京-北京", //选择最终地址结address.vue返回结果
            showBoothClassifyFlag: false, //是否显示展位分类组建
            tagRelate: false, //猜你喜欢
            tagLocal: false, //同城
            hasAddressTitle: "", //是否已经填写了地址
            showClassFlag: false, //分类的显示隐藏
            page: 0,
            tuijianList: [], //推荐展品
            changeY: 0
        }
    },
    components: {
        vLoad,
        vLoginicon,
        vClassify,
        vFooter,
        vMapicon,
        vAddress,
        boothList
    },
    beforeRouteLeave(to, from, next) {
        let position = window.scrollY; //记录离开页面的位置 
        this.changeY = position;
        next();
    },
    mounted(){
        //获取同城等标签
        if(!!this.loginState){
            this.getTagStatus();
        }
    },
    activated(){
        //清除keep-alive对search的缓存问题
        this.searchValChange = this.$route.query.search == undefined ? '' : this.$route.query.search;

        if((this.searchValChange != this.searchval)) {
            if (!(this.fromFullPath.indexOf('/product/detail') > -1)) {
                this.searchval = this.searchValChange;
                this.changeSearchVal()
            }
        }
    },
    methods: {
        addHotProduct: function(arr, num){
            //添加推荐数组 ->17n + 3

            //根据当前listArry的长度， 以及长度之前的区间范围
            //[0, 10]  0/17 -> 0, 1/17 -> 1,  值不同 添加推荐
            //[20, 30] 20/17 -> 2, 30/17 -> 2 值相同，不添加

            try {
                let _arrMaxLen = 10 * num;
                let _arrMinLen = 10 * (num - 1);

                let _max = Math.ceil(_arrMaxLen / 17);
                let _min = Math.ceil(_arrMinLen / 17);
                let pushPlace = parseInt((_min * 17 + 3) % 10); //插入位置
                if (pushPlace == 0) {
                    pushPlace = 10;
                }

                //console.log(arr.length, pushPlace)

                let _arr = [...arr];

                if (_max != _min && arr.length >= pushPlace && this.tuijianList.length >= 3) {
                    //此区间能添加推荐
                    let arrPre2 = this.tuijianList.slice(0, 3); //推荐截取前三个

                    this.tuijianList.splice(0, 3);

                    _arr.splice(pushPlace, 0, arrPre2[0]);
                    _arr.splice(pushPlace, 0, arrPre2[1]);
                    _arr.splice(pushPlace, 0, arrPre2[2]);
                }

                return _arr;

            } catch (e) {
                console.log(e)
            }
        },
        _getList: function(num, me, type) {
            //下拉，加载 请求数据
            let _this = this;


            //普通展品列表接口
            let getProducts = commonAjaxFun({
                url: '/boothApi/getProducts',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey,
                    search: _this.searchval,
                    page: num,
                    cateId: _this.categoryId,
                    userTk: mainUserTk,
                    searchTag: _this.searchTag
                }
            });

            //推荐展位列表接口
            //先要判断 tuijianList 小于3 则重启
            let getHotProduct = '';
            if(_this.tuijianList.length < 3) {
                
                let _lan = this.$cookie.get('language') || 'ch';//当前cookie中的中英文
                getHotProduct = commonAjaxFun({
                    url: '/homeData/getHotProduct',
                    data: {
                        projectId: _this.projectId,
                        language: _lan
                    }
                })
            }

            let promiseAll = Promise.all([getProducts, getHotProduct]);//全部ajax

            promiseAll.then((data) => {
                try {


                    let normalData = data[0]; //正常列表
                    let hotData = data[1]; //推送列表

                    //推送列表
                    if (!!hotData) {
                        if (hotData.state == '0') {

                            let _data = hotData.data;

                            //添加recommend字段，用于区分默认还是系统推送展位
                            for (let i = 0; i < _data.length; i++) {
                                _data[i]['recommend'] = 'push';
                            }

                            _this.tuijianList = _data;

                        } else {
                            console.log(data.message);
                        }
                    }

                    //正常列表
                    if (normalData.state == '10012' && _this.searchTag == 'local') {

                        _this.showAddress = true;
                        _this.showBoothClassifyFlag = false;

                    } else if (normalData.state == "0") {

                        _this.showAddress = false;
                        _this.showBoothClassifyFlag = false;

                        let _data = normalData.data;

                        for (let i = 0; i < _data.pageObj.rows.length; i++) {
                            _data.pageObj.rows[i]['recommend'] = 'normal';
                        }

                        let backAddHotArr = _this.addHotProduct(_data.pageObj.rows, num);

                        _this.listArry = type == 'up' ? backAddHotArr : _this.listArry.concat(backAddHotArr);

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


                } catch (e) {}
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

            this.tuijianList = [];//清空推荐数组

            this.$refs.vLoad.change();
        },
        changeSearchVal: function() {
            this.clearListArry();
        },
        searchRoute: function(){
            //展位展品带有搜索内容跳转
            if(!!this.searchval) {
                this.$router.push({path : '/booth/index', query: {projectId: this.projectId, passKey: this.passKey, search: this.searchval}});
            } else {
                this.$router.push({path : '/booth/index', query: {projectId: this.projectId, passKey: this.passKey}});
            }
        },
        clearSearchVal: function(){
            //清空搜索内容
            this.searchval = '';
        },
        _getAddress: function(val) {
            this.addressResult = val;
        },
        submit: function() {
            //分类确定按钮
            this.$refs.classify.submit();
        },
        reset: function() {
            //分类重置按钮
            this.$refs.classify.reset();
        },
        submitForm: function(){
            //地址提交
            let _this = this;
            let formVal = JSON.stringify({address: this.addressResult});
            _this.userSubmitForm(formVal);
        },
        userSubmitForm: function(formVal){ //地址提交
            let _this = this;
            _this.$layer.loading();

            commonAjaxFun({
                url: '/userForm/submitForm',
                data: {formVal: formVal}
            }, 500).then((data) => {
                _this.$layer.close();

                if(data.state == '0') {

                    _this.$layer.toast({content: _this.$t('QuestionPage.SubSuccess')});//提交成功
                    _this.showAddress = false;
                    _this.showBoothClassifyFlag = false;
                    _this.clearListArry()

                } else {
                    _this.$layer.toast({content: data.message});//失败
                    console.log(data.message);
                }

            })
        },
        submitBoothClassify: function(){
            //个人属性-展位分类提交
            this.$refs.boothclassify.submit();
        },
        _getClassify: function(val) { //获取分类模块中的id
            this.categoryId = [];

            for (let i = 0; i < val.length; i++) {
                this.categoryId.push(val[i])
            }
            
            if( this.categoryId.length>0){
               this.clearListArry() 
            }

            this.showClassify();
        },
        boothGetClassify: function(val){
            //个人属性-获取分类模块中的id
            if(val.length == 0) {
                this.$layer.toast({content: this.$t('Demand.enterClassIf')});//分类id为空
                return;
            }

            let formVal = JSON.stringify({interestPoint: val});
            this.userSubmitForm(formVal);
        },
        changeSearchTag: function(e, val) { //切换标签
            let _val = val == 'all' ? '' : val; //强制把all转为空
            this.searchTag = _val
            this.categoryId = [];
            this.searchval = '';
            this.$refs.classify.reset();
            this.clearListArry()
            let dom = $(e.toElement);
            dom.siblings().removeClass('active');
            dom.addClass('active');
        },
        showClassify: function() {
            //分类显示隐藏
            this.showClassFlag = !this.showClassFlag;
        },
        getTagStatus: function() {
            // 展位相关选择 综合 最新 本地 和我相关
            let _this = this;
            commonAjaxFun({
                url: '/userApi/getTagStatus',
                data: {}
            }).then((data) => {
                let _data = data.data;
                if (data.state == '0') {
                    if (_data.loginStatus == '1') {
                        // _this.tagRelate = true;

                        if (_data.localStatus == '1') {
                            _this.tagLocal = true;
                        }
                    }
                    _this.getFormAttrVal();

                } else {
                    console.log(data.message);
                }

            })
        },
        getFormAttrVal: function() {
            //判断当前是否有地址
            let _this = this;
            commonAjaxFun({
                url: '/userForm/getFormAttrVal',
                data: {}
            }).then((data) => {
                try {
                    let _data = data.data;
                    if (data.state == '0') {
                        for (let i = 0; i < _data.length; i++) {
                            if (_data[i].eleMark == 'address') {
                                _this.hasAddressTitle = _data[i].showName;
                                break;
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            })
        }
    },
    watch: {
        '$route' (to, from) {
            $(document).scrollTop(this.changeY);
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.fav-tab ul
    display: flex
    width: 100%
    background-color: #fff
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
