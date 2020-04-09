<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <div class="headerTab">
                <a title="好友" :class='$t("CommonUse.TransSize")' href="javascript:void(0);" @click="linkToFriend">{{$t("Person.MyContact")}}</a>
                <router-link title="来宾" :class='$t("CommonUse.TransSize")' :to="{path:'/attendguest/index', query:{projectId: projectId, passKey: passKey}}" class="active">{{$t("Person.AllAttend")}}</router-link>
            </div>
            <div class="Occupy"></div>
        </div>
        <div class="boothIndex topSeat botSeat">
            <!--ticket banner-->
            <v-home-banner-ad></v-home-banner-ad>
            <div class="sticky-area">
                <div class="search-bar">
                    <div class="search-inner">
                        <i class="icon-search"></i>
                        <input title="请输入姓名、消息内的关键字" type="text" v-model.trim="searchval" name="text" :placeholder="$t('Person.keyword')">
                    </div>
                    <div title="搜索" class="search-btn" @click="changeSearchVal" v-text='$t("CommonUse.Search")'></div>
                </div>
                <div class="cell-filter">
                    <div class="cell-filter-box">
                        <ul>
                            <li title="综合" class="active" @click="changeSearchTag($event,'all')">{{$t("CommonUse.Comprehensive")}}</li>
                            <li title="展商人员" @click="changeSearchTag($event,'fieldcontact')">{{$t("label.person")}}</li>
                            <!-- <li title="同身份" @click="changeSearchTag($event,'roleType')" v-if="tagRoleType">{{$t("label.Roles")}}</li> -->
                            <li title="推荐关注" @click="changeSearchTag($event,'relate')" v-if="tagRelate">{{$t("label.SameInterest")}}</li>
                            <li title="同城" @click="changeSearchTag($event,'local')" v-if="tagLocal">{{$t("label.Locality")}}</li>
                            <li title="同行业" @click="changeSearchTag($event,'industry')" v-if="tagIndustry">{{$t("label.Industry")}}</li>
                            <li title="同部门" @click="changeSearchTag($event,'department')" v-if="tagDepartment">{{$t("label.Department")}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <!--展位分类-->
            <div class="booth-classify" v-if="showBoothClassifyFlag">
                <h6 class="local-title">{{$t("label.EnterIndustry")}}</h6>
                <v-classify ref="boothclassify" :type="'boothclassify'" v-on:getClassify="boothGetClassify"></v-classify>
                <!--展位分类提交-->
                <div class="ready-submit" @click="submitBoothClassify" title="确定">{{$t("RegLogin.Confirm")}}</div>
                <p class="local-tips"><router-link :to="{path:'/label/index', query:{projectId: projectId, passKey: passKey}}">{{$t("label.GoLabel")}}</router-link></p>
            </div>
            
            <!-- 同行业 -->
            <div class="tagDepartment DepartmentOrtagIndustry" v-if="showTagIndustry">
                <h6 class="local-title" v-text='hasIndustryTitle'></h6>
                <p class="selectBox">
                    <select v-model="IndustryCheck" id="">
                      <option :value="item"  v-for="item in IndustryOption" v-text= 'item'></option>
                    </select>
                </p>
                <div class="ready-submit" @click="IndustrySubmit" title="确定">{{$t("RegLogin.Confirm")}}</div>
            </div>
            
            <!-- 同部门 -->
            <div class="tagIndustry DepartmentOrtagIndustry" v-if="showTagDepartment">
                <h6 class="local-title" v-text='hasDepartmentTitle'></h6>
                <p class="selectBox">
                    <select v-model="DepartmentCheck" id="">
                        <option :value="item"  v-for="item in DepartmentOption" v-text= 'item'></option>
                    </select>
                </p>
                <div class="ready-submit" @click="DepartmentSubmit" title="确定">{{$t("RegLogin.Confirm")}}</div>
            </div>

            <!--地址-->
            <div class="booth-local" v-if="showAddress">
                <h6 v-text='hasAddressTitle'></h6>
                <v-address ref="Address" :address="address" v-on:getAddress="_getAddress"></v-address>
                <!--地址提交-->
                <div class="ready-submit" @click="submitForm" title="确定">{{$t("RegLogin.Confirm")}}</div>
                <p><router-link :to="{path:'/label/index', query:{projectId: projectId, passKey: passKey}}">{{$t("label.GoLabel")}}</router-link></p>
            </div>

            <div class="boothList listCol-arraw" v-show="!showAddress && !showBoothClassifyFlag && !showTagDepartment && !showTagIndustry">
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

import vLoad from '../module/loadmore/dropload.vue'
import vClassify from '../module/classify/classify.vue'
import vLoginicon from '../module/loginicon/loginicon.vue'
import boothList from './list.vue'//引入展位列表模块
import vFooter from "../module/footer/footer"
import { mainUserTk, commonAjaxFun, skipEmptyElementForArray } from '../../common/js/common.js'
import vAddress from '../module/address/address.vue'//省级联动
import vHomeBannerAd from "../module/ad/homeBannerAd"//banner轮播广告

export default {
    data() {
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`, //登陆之后返回的url，用于本地存储
            listArry: [],
            searchval: '', //搜索查询
            address: "中国-北京-北京",
            addressResult: "中国-北京-北京", //选择最终地址结address.vue返回结果
            tagRoleType: false, //同身份
            tagRelate: false, //推荐关注
            tagLocal: false, //同城
            tagIndustry: false, //同行业
            tagDepartment: false, //同部门

            showBoothClassifyFlag: false, //推荐关注
            showAddress: false, //同城
            showTagDepartment: false, //同行业
            showTagIndustry: false, //同部门

            hasAddressTitle: "",
            hasDepartmentTitle: "",
            hasIndustryTitle: "",

            DepartmentOption: [],
            IndustryOption: [],

            IndustryCheck: "",
            DepartmentCheck: "",

            searchTag: "",
            page: 0,
            changeY: 0
        }
    },
    components: {
        vLoad,
        vLoginicon,
        vFooter,
        boothList,
        vClassify,
        vAddress,
        vHomeBannerAd
    },
    beforeRouteLeave(to, from, next) {
        let position = window.scrollY; //记录离开页面的位置 
        this.changeY = position;
        next();
    },
    mounted(){
        // console.log(this.$route.savedPosition)
        //获取同城等标签
        if(!!this.loginState){
            this.tagRelate = true;
            // this.tagRoleType = true;
            this.getFormAttrVal();
        }
    },
    methods: {
        _getList: function(num, me, type) {
            //下拉，加载 请求数据
            let _this = this;

            commonAjaxFun({
                url: '/userApi/allUsers',
                data: {
                    projectId: _this.projectId,
                    page: num,
                    query: _this.searchval,
                    searchTag: _this.searchTag
                }
            }).then((data) => {

                if (data.state == '10012' && _this.searchTag == 'local') {
                    _this.showAddress = true;
                    _this.showBoothClassifyFlag = false;
                    _this.showTagIndustry = false;
                    _this.showTagDepartment = false;
                /*} else if (data.state == '10012' && _this.searchTag == 'relate') {
                    _this.showAddress = false;
                    _this.showBoothClassifyFlag = true;
                    _this.showTagIndustry = false;
                    _this.showTagDepartment = false;*/
                } else if (data.state == '10012' && _this.searchTag == 'industry') {
                    _this.showAddress = false;
                    _this.showBoothClassifyFlag = false;
                    _this.showTagIndustry = true;
                    _this.showTagDepartment = false;
                } else if (data.state == '10012' && _this.searchTag == 'department') {
                    _this.showAddress = false;
                    _this.showBoothClassifyFlag = false;
                    _this.showTagIndustry = false;
                    _this.showTagDepartment = true;
                } else if (data.state == "0") {
                    _this.showAddress = false;
                    _this.showBoothClassifyFlag = false;
                    _this.showTagIndustry = false;
                    _this.showTagDepartment = false;

                    let _data = data.data;

                    _this.listArry = type == 'up' ? _data.rows : _this.listArry.concat(_data.rows)

                    _this.mapLink = _data.mapLink;

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
            this._getList(this.page, me)
        },
        loadUpFn: function(me) {
            this.page = 1
            me.resetload();
            this._getList(1, me, "up")
            me.unlock();
            me.noData(false);
        },
        clearListArry: function() {
            this.page = 0;
            this.listArry = [];
            this.$refs.vLoad.change()
        },
        changeSearchVal: function() {
            this.clearListArry();
        },
        linkToFriend: function(){
            //到好友页面，首先登录
            //首先判断是否登录
            if(!this.loginState){

                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl
                
                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
            } else {
                //跳转
                this.$router.push({path : '/attendguest/friend', query: {projectId: this.projectId, passKey: this.passKey}})
            }
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
                    _this.showTagIndustry = false;
                    _this.showTagDepartment = false;
                    _this.clearListArry();

                } else {
                    _this.$layer.toast({content: data.message});//失败
                    console.log(data.message);
                }

            })
        },
        submitBoothClassify: function() { // 推荐关注有关函数
            //个人属性-展位分类提交
            this.$refs.boothclassify.submit();
        },
        _getClassify: function(val) { //获取分类模块中的id  // 推荐关注有关函数
            this.categoryId = [];

            for (let i = 0; i < val.length; i++) {
                this.categoryId.push(val[i])
            }

            this.showClassify();
            this.clearListArry()
        },
        boothGetClassify: function(val){  // 推荐关注有关函数
            //个人属性-获取分类模块中的id
            if(val.length == 0) {
                this.$layer.toast({content: this.$t('Demand.enterClassIf')});//分类id为空
                return;
            }
            let formVal = JSON.stringify({interestPoint: val});
            this.userSubmitForm(formVal);
        },
        submitForm: function(){
            //地址提交
            let _this = this;
            let formVal = JSON.stringify({address: _this.addressResult});
            _this.userSubmitForm(formVal);
        },
        _getAddress: function(val) {
            this.addressResult = val;
        },
        changeSearchTag: function(e, val) {
            let _val = val == 'all' ? '' : val; //强制把all转为空
            this.searchTag = _val;
            this.categoryId = [];
            this.searchval = '';
            this.clearListArry();
            //tag active 切换
            var dom = $(e.toElement);
            dom.siblings().removeClass('active')
            dom.addClass('active');
        },
        IndustrySubmit:function(){
            let formVal = JSON.stringify({industry: this.IndustryCheck});
            this.userSubmitForm(formVal);
        },
        DepartmentSubmit:function(){
            let formVal = JSON.stringify({department: this.DepartmentCheck});
           this.userSubmitForm(formVal);
        },
        getFormAttrVal: function() {
            //获取表单用于判断不是有 同兴趣 同城 等选项
            let _this = this;
            commonAjaxFun({
                url: '/userForm/getFormAttrVal',
                data: {}
            }).then((data) => {
                
                let _data = data.data;

                if (data.state == '0') {

                    for (let i = 0; i < _data.length; i++) {

                        if (_data[i].eleMark == 'address') { //同城
                            _this.tagLocal = true;
                            _this.hasAddressTitle = _data[i].showName
                            continue;
                        } else if (_data[i].eleMark == 'industry') {
                            _this.tagIndustry = true;
                            _this.hasIndustryTitle = _data[i].showName
                            _this.IndustryOption = skipEmptyElementForArray(_data[i].eleContent.split("|"))
                            continue;
                        } else if (_data[i].eleMark == 'department') {
                            _this.tagDepartment = true;
                            _this.hasDepartmentTitle = _data[i].showName
                            _this.DepartmentOption = skipEmptyElementForArray(_data[i].eleContent.split("|"))
                            continue;
                        }
                    }

                } else {
                    console.log(data.message);
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

<style lang="stylus" rel="stylesheet/stylus">
</style>
