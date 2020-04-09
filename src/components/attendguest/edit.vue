<template>
    <div>
        <transition :name="animatePhone">
            <div class="all-part" v-show="editPhoneFlag && editEmailFlag">
                <div class="head-back">
                    <div class="head-back-icon" @click="goBack"><span title="取消" :class="$t('CommonUse.SmallFont')" v-text="$t('RegLogin.Cancel')"></span></div>
                    <h2 class="headerTitle" title="个人编辑" v-text="$t('MyProfile.Title')"></h2>
                    <div class="Occupy"><span @click="savePerson" class="o-idet" :class="$t('CommonUse.SmallFont')" title="保存">{{$t("RegLogin.Save")}}</span></div>
                </div>
                <div class="topSeat attendEdit">
                    <load-state v-show="loadState"></load-state>
                    <div class="person-center" v-show="!loadState">
                        <!--个人头像-->
                        <div class="person-image">
                            <div class="uploadImgBox">
                                <div class="uploadImg-in" id="uploadMain" fileRootDomSelect=".uploadBox">
                                    <div class="upload">
                                        <div class="upLoadImg" title="上传图片" :style="{backgroundImage: uploadImgUrl}"></div>
                                        <a v-show="hasImgFlag" href="javascript:void(0);" class="delete-img" title="删除图片"><i class="icon-clear"></i></a>
                                        <input type="hidden" urls value="">
                                    </div>
                                </div>
                                <!-- <p class="person-image-text">{{$t("MyProfile.EditAvatar")}}</p> -->
                            </div>
                           
                        </div>
                        <!--姓名-->
                        <div class="field-main" v-if="userInfo">
                            <h4 class="field-title"><span title="姓名">{{$t("RegLogin.Name")}}</span><em class="red-star">*</em></h4>
                            <div class="field-box">
                                <div class="field-input"><input class="text-input" title="姓名" name="name" v-model="userInfo.name" maxlength="50" :placeholder="$t('RegLogin.Name')" type="text"></div>
                                <div class="field-handle"><i class="icon-clear"></i></div>
                            </div>
                            <p class="field-error"><span v-show="nameFlag" title="请输入姓名">{{$t("RegLogin.inputName")}}</span></p>
                        </div>
                        <!--性别-->
                        <!--<div class="field-main field-col2" v-if="userInfo">
                            <h4 class="field-title"><span title="性别">{{$t("RegLogin.Gender")}}</span></h4>
                            <div class="field-choose">
                                <div @click="chooseSex('men')" class="field-choose-list" :class="userInfo.sex == 'men' ? 'field-choose-on' : ''">
                                    <i class="icon-radio" :class="userInfo.sex =='men' ? 'icon-radioed' : ''"></i>
                                    <span>{{$t("RegLogin.Men")}}</span>
                                </div>
                                <div @click="chooseSex('women')" class="field-choose-list" :class="userInfo.sex == 'women' ? 'field-choose-on' : ''">
                                    <i class="icon-radio" :class="userInfo.sex =='women' ? 'icon-radioed' : ''"></i>
                                    <span>{{$t("RegLogin.Women")}}</span>
                                </div>
                            </div>
                            <p class="field-error"><span></span></p>
                        </div> -->
                        <!--公司-->
                        <div class="field-main" v-if="userInfo">
                            <h4 class="field-title"><span title="公司">{{$t("RegLogin.Company")}}</span><em class="red-star">*</em></h4>
                            <div class="field-box">
                                <div class="field-input"><input class="text-input" title="公司" name="company" v-model="userInfo.companyInfo.company" :placeholder="$t('RegLogin.Company')" maxlength="50" type="text"></div>
                                <div class="field-handle"><i class="icon-clear"></i></div>
                            </div>
                            <p class="field-error"><span v-show="companyFlag" title="请输入公司">{{$t("RegLogin.inputCompany")}}</span></p>
                        </div>

                        <!-- 职位 -->
                        <div class="field-main" >
                            <h4 class="field-title"><span title="职位">{{$t("RegLogin.Title")}}</span><em class="red-star">*</em></h4>
                            <div class="field-box">
                                <div class="field-input">
                                    <select  v-model="positiontValue">
                                        <template v-for="(options, key) in positionList">
                                            <option :value="options" v-text="options"></option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                            <p class="field-error"><span v-show="positiontFlag" title="职位">{{$t("RegLogin.PositiontFlag")}}</span></p> 
                        </div>

                        <div class="field-main" >
                            <h4 class="field-title"><span title="部门">{{$t("RegLogin.Department")}}</span><em class="red-star">*</em></h4>
                            <div class="field-box">
                                <div class="field-input">
                                    <select  v-model="departmentValue">
                                        <template v-for="(options, key) in departmentList">
                                            <option :value="options" v-text="options"></option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                            <p class="field-error"><span v-show="departmentFlag" title="部门">{{$t("RegLogin.DepartmentFlag")}}</span></p> 
                        </div>

                        <!--角色类型-->
                        <div class="field-main">
                            <h4 class="field-title"><span title="身份">{{$t("label.Role")}}</span><em class="red-star">*</em></h4>
                            <div class="field-box">
                                <div class="field-input">
                                    <select v-model="roleValue">
                                        <option v-for="value in RoleCategoryArr" :value="value" v-text="value"></option>
                                    </select>
                                </div>
                            </div>
                            <p class="field-error"><span v-show="RoleFlag" title="身份">{{$t("label.SelectRole")}}</span></p>
                        </div>
                        <!--标签-->
                        <!-- <v-label ref="labeldom" v-on:allSubmit="_allSubmit" :my=true></v-label> -->
                        <!--修改手机-->
                        <div class="field-main" v-if="userInfo">
                            <h4 class="field-title"><span title="修改手机">{{$t("RegLogin.CellPhone")}}</span></h4>
                            <div class="field-justify">
                                <div class="field-box">
                                    <div class="field-input field-disabled"><input class="text-input" name="mobile" placeholder="" :value="oldMobile" type="text" disabled></div>
                                </div>
                                <div class="field-code-btn" @click="changeMobile" v-text="oldMobile ? $t('RegLogin.Changemobile') : $t('RegLogin.Bindingphone')"></div>
                            </div>
                        </div>
                        <!--修改邮箱-->
                        <div class="field-main" v-if="userInfo">
                            <h4 class="field-title"><span title="修改邮箱">{{$t("RegLogin.EMail")}}</span></h4>
                            <div class="field-justify">
                                <div class="field-box">
                                    <div class="field-input field-disabled"><input class="text-input" name="email" placeholder="" :value="oldEmail" type="text" maxlength="50" disabled></div>
                                </div>
                                <!--如果有邮箱则->修改邮箱， 否则为绑定邮箱-->
                                <div class="field-code-btn" @click="changeEmail" v-text="oldEmail ? $t('RegLogin.Changeemail') : $t('RegLogin.Bindingemail')"></div>
                            </div>
                        </div>


                        <!--国家省份-->
                        <div class="field-main" :value="addressResult">
                            <h4 class="field-title"><span>请选择您企业所在的地区</span></h4>
                            <v-address ref="Address" :address="address" v-on:getAddress="_getAddress"></v-address>
                        </div>

                        <!-- 行业 -->
                        <div class="field-main" >
                            <h4 class="field-title"><span title="行业">{{$t("RegLogin.industry")}}</span></h4>
                            <div class="field-box">
                                <div class="field-input">
                                    <select  v-model="industryValue">
                                        <template v-for="(options, key) in industryList">
                                            <option :value="options" v-text="options"></option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                            <p class="field-error"></p> 
                        </div>

                        <!--微信号-->
<!--                         <div class="field-main" v-if="userInfo">
                            <h4 class="field-title"><span title="微信号">{{$t("RegLogin.WechatID")}}</span></h4>
                            <div class="field-box">
                                <div class="field-input"><input maxlength="50" class="text-input" title="微信号" name="weixin" :value="userInfo.wxNumber" placeholder="" type="text"></div>
                            </div>
                        </div> -->
                        <!--简介-->
                        <div class="field-main" v-if="userInfo">
                            <h4 class="field-title"><span title="简介">{{$t("RegLogin.PersonalProfile")}}</span></h4>
                            <div class="field-box">
                                <div class="field-input"><textarea maxlength="200" title="简介" name="intro" :value="userInfo.intro"></textarea></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!--修改手机-->
        <transition :name="animatePhone">
            <div class="edit-phone-part" v-show="!editPhoneFlag">
                <div class="header">
                    <div class="head-back-icon" @click="hideEditPhone"><i class="icon-leftarrow"></i></div>
                    <h2 class="headerTitle" title="修改手机" v-text="oldMobile ? $t('RegLogin.Changemobile') : $t('RegLogin.Bindingphone')"></h2>
                    <div class="Occupy"></div>
                </div>
                <div class="topSeat">
                    <div class="person-center field-main">
                        <!--原手机号 / 有手机号的情况下-->
                        <div class="field-main" v-if="userInfo && oldMobile">
                            <h4 class="field-title"><span title="修改手机">{{$t("RegLogin.CellPhone")}}</span></h4>
                            <div class="field-justify">
                                <div class="field-box">
                                    <div class="field-input field-disabled"><input class="text-input" name="editmobile" placeholder="" :value="oldMobile" type="text" disabled></div>
                                </div>
                            </div>
                        </div>
                        <!--绑定手机号 / 无手机号的情况下-->
                        <div class="field-main" v-if="userInfo && !this.oldMobile">
                            <h4 class="field-title"><span title="绑定手机">{{$t("RegLogin.Bindingphone")}}</span></h4>
                            <div class="field-box">
                                <div class="field-input"><input class="text-input" name="editunmobile" :placeholder="$t('RegLogin.OnlyChinaPhone')" value="" type="text" maxlength="11"></div>
                            </div>
                            <p class="field-error"><span v-show="bindMobileFlag" title="请输入正确手机号">{{$t("RegLogin.Correctwmobile")}}</span></p>
                        </div>
                        <!--验证码-->
                        <div class="field-main">
                            <h4 class="field-title"><span title="验证码">{{$t("RegLogin.VerificationCode")}}</span><em class="red-star">*</em></h4>
                            <div class="field-justify">
                                <div class="field-box">
                                    <div class="field-input"><input class="text-input" name="vercodeMobile" placeholder="" type="text" maxlength="6"></div>
                                    <div class="field-handle"><i class="icon-clear"></i></div>
                                </div>
                                <div class="field-code-btn" :class="[mobileCodeFlag ? 'field-code-grey' : '']" v-text="mobileCodeText" @click="beforeGetVerificationCode('mobile')"></div>
                            </div>
                            <p class="field-error"><span v-show="mobileVercodeFlag" title="请填写正确验证码">{{$t("layerTips.FillCorrectCode")}}</span></p>
                        </div>
                        <!--新手机号-->
                        <div class="field-main" v-if="userInfo && oldMobile">
                            <h4 class="field-title"><span title="新手机号">{{$t("RegLogin.Newmobile")}}</span></h4>
                            <div class="field-justify">
                                <div class="field-box">
                                    <div class="field-input"><input class="text-input" name="newmobile" :placeholder="$t('RegLogin.OnlyChinaPhone')" maxlength="11"></div>
                                </div>
                            </div>
                            <p class="field-error"><span v-show="newMobileFlag" title="请输入正确手机号">{{$t("RegLogin.Correctwmobile")}}</span></p>
                        </div>
                        <!--没手机号的情况下，绑定新手机 确定-->
                        <div class="ready-submit" submitNewMobile @click="submitNewMobile" v-if="userInfo && !oldMobile" title="确定">{{$t("RegLogin.Confirm")}}</div>
                        <!--有手机号的情况下，更换新手机 确定-->
                        <div class="ready-submit" submitUpdataNewMobile @click="submitUpdataNewMobile" v-else title="确定">{{$t("RegLogin.Confirm")}}</div>
                    </div>
                </div>
            </div>
        </transition>
        <!--修改邮箱-->
        <transition :name="animatePhone">
            <div class="edit-phone-part" v-show="!editEmailFlag">
                <div class="header">
                    <div class="head-back-icon" @click="hideEditEmail"><i class="icon-leftarrow"></i></div>
                    <h2 class="headerTitle" title="修改邮箱" v-text="oldEmail ? $t('RegLogin.Changeemail') : $t('RegLogin.Bindingemail')"></h2>
                    <div class="Occupy"></div>
                </div>
                <div class="topSeat">
                    <div class="person-center field-main">
                        <!--原邮箱/ 有邮箱的情况下-->
                        <div class="field-main" v-if="userInfo && oldEmail">
                            <h4 class="field-title"><span title="修改邮箱">{{$t("RegLogin.EMail")}}</span></h4>
                            <div class="field-box">
                                <div class="field-input field-disabled"><input class="text-input" name="email" placeholder="" :value="oldEmail" type="text" maxlength="50" disabled></div>
                            </div>
                        </div>
                        <!--绑定邮箱 / 无邮箱的情况下-->
                        <div class="field-main" v-if="userInfo && !oldEmail">
                            <h4 class="field-title"><span title="绑定邮箱">{{$t("RegLogin.Bindingemail")}}</span></h4>
                            <div class="field-box">
                                <div class="field-input"><input class="text-input" name="editunemail" placeholder="" value="" maxlength="50" type="text"></div>
                            </div>
                            <p class="field-error"><span v-show="bindEmailFlag" title="请填写正确的邮箱">{{$t("layerTips.FillCorrectEmail")}}</span></p>
                        </div>
                        <!--验证码-->
                        <div class="field-main">
                            <h4 class="field-title"><span title="验证码">{{$t("RegLogin.VerificationCode")}}</span><em class="red-star">*</em></h4>
                            <div class="field-justify">
                                <div class="field-box">
                                    <div class="field-input"><input class="text-input" name="vercodeEmail" placeholder="" type="text" maxlength="6"></div>
                                    <div class="field-handle"><i class="icon-clear"></i></div>
                                </div>
                                <div class="field-code-btn" :class="[emailCodeFlag ? 'field-code-grey' : '']" v-text="emailCodeText" @click="beforeGetVerificationCode('email')"></div>
                            </div>
                            <p class="field-error"><span v-show="emailVercodeFlag" title="请填写正确验证码">{{$t("layerTips.FillCorrectCode")}}</span></p>
                        </div>
                        <!--新邮箱-->
                        <div class="field-main" v-if="userInfo && oldEmail">
                            <h4 class="field-title"><span title="新邮箱">{{$t("RegLogin.Newemail")}}</span></h4>
                            <div class="field-box">
                                <div class="field-input"><input class="text-input" name="newemail" placeholder="" maxlength="50" type="text"></div>
                            </div>
                            <p class="field-error"><span v-show="newEmailFlag" title="请填写正确的邮箱">{{$t("layerTips.FillCorrectEmail")}}</span></p>
                        </div>
                        <!--没邮箱的情况下，绑定新邮箱 确定-->
                        <div class="ready-submit" submitNewEmail @click="submitNewEmail" v-if="userInfo && !oldEmail" title="确定">{{$t("RegLogin.Confirm")}}</div>
                        <!--有邮箱的情况下，更换新邮箱 确定-->
                        <div class="ready-submit" submitUpdataNewEmail @click="submitUpdataNewEmail" v-else title="确定">{{$t("RegLogin.Confirm")}}</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>

import {mainUserTk, commonAjaxFun, regPhoneNumber, regEmail , regNumber ,includeStrChooice} from '../../common/js/common.js'
import vLabel from '../module/label/label.vue'//个人标签
import loadState from '../module/loadState/loadState.vue'//加载状态
import vAddress from '../module/address/address.vue'//省级联动

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            userid: `${this.$route.query.userid}`,
            address:"请选择-请选择-请选择",
            departmentValue:"",//部门
            defaultDepartmentList:{
                en:"Select|Technical|Sales|Marketing|Financial|Manufacture|Procurement|Administration|Others",
                ch:"请选择|技术部门|销售部门|市场营销|财务部|生产部门|采购部|行政部门|其他"
            },
            departmentList:[],//部门例表
            departmentFlag:false,//部门提示
            positiontValue:"",  // 职位
            positionList:[],
            defaultPositionList:{
                en:"Select|CEO|Director|Manager|Stuff",
                ch:"请选择|总经理|总监|经理|职员"
            },
            positiontFlag:false,
            industryValue:"",
            industryList:[],
            defaultIndustryList:{
                en:"Select|Energy & Mining|Traffic & Logistics|Real Estate|Wholesale & Retail|Education|Manufacture|Services|Finance|Government|Internet|Others",
                ch:"请选择|能源矿产|交通物流|地产建筑|贸易零售|文化教育|加工制造|服务行业|金融行业|政府单位|互联网软件|其他"
            },
            defaultRoleList:{
                en:"Select|Visitor|Professional Visitor|Media|Exhibitors|Organizer",
                ch:"请选择|普通观众|专业观众|媒体|参展商|主办方"
            },
            addressResult: '',//地址
            loadState: true,//加载状态
            uploadImg: '', //图片地址
            uploadImgUrl:"url("+ require('@/common/images/default.png') +")" ,
            hasImgFlag: false,  //上传了图片
            uploadServelUrl: 'https://static.expoplus.com.cn/fileupload', //读取文件
            nameFlag: false,//姓名提示
            companyFlag: false,//公司提示
            RoleCategoryArr: [],//角色类型数组
            roleValue: '',//角色类型的v-model值
            newMobileFlag: false,//新手机号码提示
            bindMobileFlag: false,//绑定新手机情况下错误提示
            bindEmailFlag: false,//绑定新邮箱情况下错误提示
            newEmailFlag: false,//绑定新邮箱情况下错误提示
            animatePhone: 'right',//修改手机号和邮箱弹出层运动方向
            editPhoneFlag: true,//是否显示修改手机
            editEmailFlag: true,//是否显示修改邮箱
            emailFlag: false,//邮箱提示
            RoleFlag:false,//身份提示
            oldMobile: '',//原手机号
            oldEmail: '',//原邮箱
            userSex: 'men',//性别，默认男
            emailCountDownNum: 120,//邮箱倒计时120s
            emailCodeFlag: false,//邮箱已点击获取验证码按钮时的状态
            emailCodeText: this.$t("RegLogin.AskForCode"),//邮箱获取验证码
            emailVercodeFlag: false,//邮箱验证码提示
            emailDbclickFlag: false,//获取验证码，防止多次点击
            mobileCountDownNum: 120,//手机倒计时120s
            mobileCodeFlag: false,//手机已点击获取验证码按钮时的状态
            mobileCodeText: this.$t("RegLogin.AskForCode"),//手机获取验证码
            mobileVercodeFlag: false,//手机验证码提示
            mobileDbclickFlag: false,//获取验证码，防止多次点击
            labelResult: '',//个人标签页面结果
            userInfo: '',//个人信息
            selectString:this.$cookie.get('language')  =="en" ? "Select" : "请选择"
        }
    },
    components: {
        vLabel,
        loadState,
        vAddress
    },
    mounted() {
        this.getFormAttrVal()//获取表单
        this.initUpload();//初始化上传图片
        this.getUserInfo();//个人信息
        this.initRoleCategory();//初始化角色类型
        window.document.body.style.backgroundColor = '#fff';
    },
    destroyed(){
        window.document.body.style.backgroundColor = '#e6e6e6';
    },
    methods: {
        getFormAttrVal: function(){//获取表单
            //展位基本信息
            let _this = this;
            var _language =this.$cookie.get('language')
            // console.log(_language)

            if( _language == null || _language == ""){
                _language = "ch"
            }
            commonAjaxFun({
                url: '/userForm/getFormAttrVal',
                data: {}
            }).then((data) => {
                try {
                    if (data.state == "0") {
                        let _data = data.data;
                        console.log(_data)
                        _this.departmentList = _this.filterArryEmpty ( _this.defaultDepartmentList[_language].split("|") )
                        _this.positionList = _this.filterArryEmpty ( _this.defaultPositionList[_language].split("|") )
                        _this.industryList = _this.filterArryEmpty ( _this.defaultIndustryList[_language].split("|") )
        
                        if(_data.length > 0){
                            for(var i=0,max = _data.length;i<max;i++){
                                    if(_data[i].eleMark == 'department'){
                                        _this.departmentList = _this.filterArryEmpty ( _data[i].eleContent.split("|") )
                                        _this.departmentList.unshift(_this.selectString)
                                    }

                                    if(_data[i].eleMark == 'position'){
                                        _this.positionList = _this.filterArryEmpty ( _data[i].eleContent.split("|") )
                                        _this.positionList.unshift(_this.selectString)
                                    }

                                    if(_data[i].eleMark == 'industry'){
                                        _this.industryList = _this.filterArryEmpty ( _data[i].eleContent.split("|") )
                                        _this.industryList.unshift(_this.selectString)
                                    }
                            }
                        }

                    } else {
                        console.log(data.message);
                    }
                } catch (err) {
                    console.log(err)
                }
            })
        },
        filterArryEmpty:function(val){
            if(val[val.length-1] == ""){
               val.pop(); 
            }
            return val
        },
        _getAddress: function(val){
            if( includeStrChooice(val) ){
               val = ""
            }
            this.addressResult = val;
        },
        goBack: function(){
            this.$router.go(-1);
        },
        savePerson: function(){
            //保存
            let _this = this;
            // _this.$refs.labeldom.submit();//调用label中的submit方法

            let name = $.trim($('[name=name]').val());//姓名
            let company = $.trim($('[name=company]').val());//公司
            let mobile = $.trim($('[name=mobile]').val());//手机
            let email = $.trim($('[name=email]').val());//邮箱
            let weixin = $.trim($('[name=weixin]').val());//微信
            let intro = $.trim($('[name=intro]').val());//简介
            let sex = _this.userSex;//简介
            let headPortrait =  _this.uploadImg;//头像
            let allFlag = false;//是否所有都能通过验证

            if(!name) {
                //姓名验证
                _this.nameFlag = true;
                allFlag = true;
            } else {
                _this.nameFlag = false;
            }

            if(!company) {
                //公司验证
                _this.companyFlag = true;
                allFlag = true;
            } else {
                _this.companyFlag = false;
            }
  
            if(_this.roleValue == "" || _this.roleValue == "请选择" || _this.roleValue == "Select"){
                _this.RoleFlag = true;
                allFlag = true
            }else{
                _this.RoleFlag = false;
            }

            if( _this.positiontValue == "" || _this.positiontValue == "请选择" || _this.positiontValue == "Select"){
                _this.positiontFlag = true;
                allFlag = true
            }else{
                _this.positiontFlag = false;
            }
       

            // console.log(_this.departmentValue)
            if(_this.departmentValue == "" || _this.departmentValue == "请选择" || _this.departmentValue == "Select" ){
                _this.departmentFlag = true;
                allFlag = true
            }else{
                _this.departmentFlag = false;
            }

            if(allFlag) {
                return;
            }

            //标签页面必须有值
            // if(!_this.labelResult) {
            //     //空值
            //     return false;
            // }
            if( _this.industryValue == '请选择' ||   _this.industryValue == 'Select' ){
                _this.industryValue  = ''
            }
            var _address = _this.addressResult == "" ? ["","",""] : _this.addressResult.split("-")

            let updateUserObj = {//个人信息
                name: name,
                wechatInfo: {
                    wxNumber: weixin
                },
                headPortrait: headPortrait,
                // sex: sex,
                intro: intro,
                department: _this.departmentValue,
                position:_this.positiontValue,

                records: {
                    company: company,
                    roleType: _this.roleValue,
                    country:_address[0],
                    province:_address[1],
                    city:_address[2],
                    industry:_this.industryValue,
                }
            };

            // console.log( _this.addressResult.split("-") )
            let _user = JSON.stringify(updateUserObj);

 
            let updateAjax = commonAjaxFun({
                url: '/userApi/updateUser',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey,
                    userTk: mainUserTk,
                    userId: _this.userid,
                    key: '473f995555fa83c377ef7a7e0edf9805',
                    user: _user
                    // formVal: _this.labelResult
                
                }
            });

            // let labelAjax = commonAjaxFun({//个人属性
            //     url: '/userForm/submitForm',
            //     data: {
            //         formVal: _this.labelResult
            //     }
            // });


            _this.$layer.loading(_this.$t('layerTips.Proceeding'));//正在提交，请稍候！

            // let promiseAll = Promise.all([updateAjax, labelAjax]);//全部ajax
            let promiseAll = Promise.all([updateAjax]);//全部ajax

            promiseAll.then((data) => {

                _this.$layer.close();

                let data1 = data[0];//updateUser返回值
                let _state = data1.state;

                if (_state == "0") {
                    _this.$layer.toast({content: _this.$t('QuestionPage.SubSuccess')});//提交成功
                    _this.$router.replace({path : '/mine/index', query: {projectId: _this.projectId, passKey: _this.passKey}});//主页
                } else if (_state == "201") {
                    //"201","参数错误"
                    _this.$layer.open({content: _this.$t("RegLogin.ParameterError"), skin: 'msg', time: 1000});
                } else if (_state == "202") {
                    //"202","登录用户与修改用户不匹配"
                    _this.$layer.open({content: _this.$t("RegLogin.UserMatch"), skin: 'msg', time: 1000});
                } else if (_state == "203") {
                    //"203","未找到该用户"
                    _this.$layer.open({content: _this.$t("RegLogin.UserNoFind"), skin: 'msg', time: 1000});

                } else if (_state == "204") {
                    //"204","用户信息序列化错误"
                    _this.$layer.open({content: _this.$t("RegLogin.UserSerErr"), skin: 'msg', time: 1000});

                } else if (_state == "205") {
                    //"205","验证码/key/手机号不能空"
                    _this.$layer.open({content: _this.$t("RegLogin.CodePhoneNumber"), skin: 'msg', time: 1000});
                } else if (_state == "206") {
                    //手机号码已经存在
                    _this.$layer.open({content: _this.$t("RegLogin.PhoneExist"), skin: 'msg', time: 1000});

                } else {
                    // _state == "207"->验证码系统开小差了
                    _this.$layer.toast({content: data1.message})
                }
            })
        },
        _allSubmit: function(val){
            //从vlabel拿到所有的值
            this.labelResult = JSON.stringify(val);
        },
        changeMobile: function(){
            //修改手机
            this.editPhoneFlag = !this.editPhoneFlag;
            this.animatePhone = 'right';
        },
        hideEditPhone: function(){
            //隐藏手机编辑
            this.editPhoneFlag = !this.editPhoneFlag;
            this.animatePhone = 'left';
        },
        changeEmail: function(){
            //修改邮箱
            this.editEmailFlag = !this.editEmailFlag;
            this.animatePhone = 'right';
        },
        hideEditEmail: function(){
            //隐藏邮箱编辑
            this.editEmailFlag = !this.editEmailFlag;
            this.animatePhone = 'left';
        },
        submitNewMobile: function(){
            //没有原手机的情况下，绑定新手机
            let _this = this;

            let _code = $.trim($('[name=vercodeMobile]').val());
            let _mobile = $.trim($('[name=editunmobile]').val());

            let _flag = false;

            //同时正则号码 必须为中国号码
            if(!regPhoneNumber.test(_mobile) || !_mobile){
                _this.bindMobileFlag = true;
                _flag = false;
            } else {
                _this.bindMobileFlag = false;
            }

            //正则验证码
            if (!regNumber.test(_code) || _code.length == 0) {
                _this.mobileVercodeFlag = true;
                _flag = true;
            } else {
                _this.mobileVercodeFlag = false;
            }

            if(_flag) {
                return;
            }

            //输入信息完整的情况下，提交
            commonAjaxFun({
                url: '/frontUser/updatePhone',
                data: {
                    projectId:_this.projectId,
                    newPhone: _mobile,
                    verifyCode: _code
                }
            }).then((data) => {

                let _state = data.state;

                if (_state == '103') {
                    _this.$layer.toast({ content: _this.$t('RegLogin.alreadyPhone') }); //手机号已经存在 
                } else if (_state == '102') {
                    _this.$layer.toast({ content: _this.$t('RegLogin.NewOldPhoneSome') }); //原手机号与新手机号一致，无需修改 
                } else if(_state == '1003') {
                    _this.$layer.toast({ content: _this.$t('layerTips.FillCorrectCode') }); //请填写正确验证码 
                } else if(_state == '0') {
                    document.location = document.location;//保存成功
                } else {
                    _this.$layer.toast({ content: data.message }); //邮箱已经存在 
                }
            })
        },
        submitUpdataNewMobile: function(){
            //有手机号的情况下，更换新手机号
            let _this = this;

            let _code = $.trim($('[name=vercodeMobile]').val());
            let _mobile = $.trim($('[name=newmobile]').val());

            let _flag = false;

            //同时正则号码 必须为中国号码
            if(!regPhoneNumber.test(_mobile) || !_mobile){
                _this.newMobileFlag = true;
                _flag = true;
            } else {
                _this.newMobileFlag = false;
            }

            //正则验证码
            if (!regNumber.test(_code) || _code.length == 0) {
                _this.mobileVercodeFlag = true;
                _flag = true;
            } else {
                _this.mobileVercodeFlag = false;
            }

            if(_flag) {
                return;
            }

            //输入信息完整的情况下，提交
            commonAjaxFun({
                url: '/frontUser/updatePhone',
                data: {
                    projectId:_this.projectId,
                    newPhone: _mobile,
                    verifyCode: _code
                }
            }).then((data) => {

                let _state = data.state;

                if (_state == '103') {
                    _this.$layer.toast({ content: _this.$t('RegLogin.alreadyPhone') }); //手机号已经存在 
                } else if (_state == '102') {
                    _this.$layer.toast({ content: _this.$t('RegLogin.NewOldPhoneSome') }); //原手机号与新手机号一致，无需修改 
                } else if(_state == '1003') {
                    _this.$layer.toast({ content: _this.$t('layerTips.FillCorrectCode') }); //请填写正确验证码 
                } else if(_state == '0') {
                    document.location = document.location;//保存成功
                } else {
                    _this.$layer.toast({ content: data.message }); //邮箱已经存在 
                }
            })
            
        },
        submitNewEmail: function(){
            //没有原邮箱的情况下，绑定新邮箱
            let _this = this;

            let _code = $.trim($('[name=vercodeEmail]').val());
            let _email = $.trim($('[name=editunemail]').val());

            let _flag = false;

            //首先正则验证邮箱
            if (!regEmail.test(_email)) {
                _this.bindEmailFlag = true;
                _flag = true;

            } else {
                _this.bindEmailFlag = false;
            }

            //正则验证码
            if (!regNumber.test(_code) || _code.length == 0) {
                _this.emailVercodeFlag = true;
                _flag = true;
            } else {
                _this.emailVercodeFlag = false;
            }

            if(_flag) {
                return;
            }

            //需要先去验证当前邮箱是否存在
            commonAjaxFun({
                url: '/frontUser/updateEmail',
                data: {
                    newEmail: _email,
                    verifyCode: _code
                }
            }).then((data) => {

                let _state = data.state;

                if (_state == '103') {
                    _this.$layer.toast({ content: _this.$t('RegLogin.alreadyEmail') }); //邮箱已经存在 
                } else if (_state == '102') {
                    _this.$layer.toast({ content: _this.$t('RegLogin.NewOldEmailSome') }); //原邮箱号与新邮箱号一致，无需修改 
                } else if(_state == '1003') {
                    _this.$layer.toast({ content: _this.$t('layerTips.FillCorrectCode') }); //请填写正确验证码 
                } else if(_state == '0') {
                    document.location = document.location;//保存成功
                } else {
                    _this.$layer.toast({ content: data.message }); //邮箱已经存在 
                }
            })

        },
        submitUpdataNewEmail: function(){
            //有邮箱的情况下，更换新邮箱 确定
            let _this = this;

            let _code = $.trim($('[name=vercodeEmail]').val());
            let _email = $.trim($('[name=newemail]').val());

            let _flag = false;

            //首先正则验证邮箱
            if (!regEmail.test(_email)) {
                _this.newEmailFlag = true;
                _flag = true;

            } else {
                _this.newEmailFlag = false;
            }

            //正则验证码
            if (!regNumber.test(_code) || _code.length == 0) {
                _this.emailVercodeFlag = true;
                _flag = true;
            } else {
                _this.emailVercodeFlag = false;
            }

            if(_flag) {
                return;
            }

            //输入信息完整的情况下，提交
            commonAjaxFun({
                url: '/frontUser/updateEmail',
                data: {
                    newEmail: _email,
                    verifyCode: _code
                }
            }).then((data) => {

                let _state = data.state;

                if (_state == '103') {
                    _this.$layer.toast({ content: _this.$t('RegLogin.alreadyEmail') }); //邮箱已经存在 
                } else if (_state == '102') {
                    _this.$layer.toast({ content: _this.$t('RegLogin.NewOldEmailSome') }); //原邮箱号与新邮箱号一致，无需修改 
                } else if(_state == '1003') {
                    _this.$layer.toast({ content: _this.$t('layerTips.FillCorrectCode') }); //请填写正确验证码 
                } else if(_state == '0') {
                    document.location = document.location;//保存成功
                } else {
                    _this.$layer.toast({ content: data.message }); //邮箱已经存在 
                }
            })
        },
        chooseSex: function(value){
            //性别
            this.userSex = value;
            this.$set(this.userInfo, 'sex', value);
        },
        initUpload: function(){//初始化上传插件
            let _this = this;
            $('#uploadMain').each(function(i){
                let _inthis = this;
                let uploadObj = $(_inthis).find('.upLoadImg');
                let fileRootDomSelect = $(_inthis).attr('fileRootDomSelect');

                uploadTool(uploadObj, {
                    fileRootDomSelect: fileRootDomSelect,
                    formData: {
                        lessened: "true"
                    },
                    callback: function(file, data){
                        //上传成功之后的回掉
                        let _savePath = !!data.lessenedSavePath ? data.lessenedSavePath : data.savePath;
                        _this.uploadImg = _this.uploadServelUrl + _savePath;
                        
                        _this.uploadImgUrl = "url(" + _this.uploadServelUrl + _savePath + ")";
                    }
                })
            })
        },
        getUserInfo: function(){
            //获取个人信息
            let _this = this;

            commonAjaxFun({
                url: '/userApi/userInfo',
                data: {}
            }, 200).then((data) => {
                // console.log(data)
                try {
                    let _data = data.data;
                    _this.loadState = false;

                    if(data.state == '0'){
                        _this.userInfo = _data;

                        //个人兴趣分类
                        /*if(_data.catesList.length > 0) {
                            _this.setInterestArr(_data.catesList);
                        }*/

                        // console.log(_data);

                        _this.roleValue = _data.companyInfo.roleType || _this.selectString;//角色类型

                        _this.departmentValue = _data.department || _this.selectString   // 部门

                        var _tempAddress = _data.companyInfo.country + "-" + _data.companyInfo.province + "-" + _data.companyInfo.city; // 地址
                        _this.address = _tempAddress == "--" ?_this.address :  _tempAddress


                        // console.log(_tempAddress)
                        
                         _this.positiontValue = _data.position || _this.selectString  //职位
                         _this.industryValue = _data.companyInfo.industry || _this.selectString   //行业

                        if(!!_data.headPortrait) {
                            _this.uploadImgUrl = "url(" + _data.headPortrait + ")";
                            _this.uploadImg = _data.headPortrait;
                        }

                        //是否有邮箱和手机
                        _this.oldMobile = !!_data.phone ? _data.phone : '';
                        _this.oldEmail = !!_data.email ? _data.email : '';

                    } else {
                        console.log(data.message)
                    }

                } catch(err) {
                    console.log(err)
                }

            })
        },
        initRoleCategory: function(){
            //初始化角色类型
            let _this = this;
            var _language =this.$cookie.get('language');
            if( _language == null || _language == ""){
                _language = "ch"
            }
            commonAjaxFun({
                url: '/frontUser/getRoleType',
                data: {}
            }).then((data) => {
                try {
                    if(data.state == '0'){

                        if(data.data == ""){
                            data.data  =  _this.defaultRoleList[_language]
                        }
                        var _select = '';
                        _select = _this.$cookie.get('language')  =="en" ? "Select" : "请选择"
                        _this.RoleCategoryArr =_this.filterArryEmpty ( data.data.split("|") );
                        _this.RoleCategoryArr.unshift(_select)
                    }
                } catch(err){
                    console.log(err)
                }
            }, (err) => {
                console.log(err)
            })
        },
        beforeGetVerificationCode: function(type){
            //获取验证码之前操作, type类型用于判断是手机还是邮箱 mobile/email

            let _this = this;

            let ajaxObj = {};//请求对象

            //如果当前有手机号，则说明是要更换手机号
            if(type == 'mobile') {
                
                if(_this.mobileDbclickFlag){//防止手机获取验证码重复点击
                    return;
                }
                _this.mobileDbclickFlag = true;

                if(!!_this.oldMobile) {


                var captcha1 = new TencentCaptcha('2050675704', function(res) {

                        if(res.ret === 0){
                            ajaxObj = {
                                url : '/frontUser/sendVerificationCode',
                                data : {
                                    phone: _this.oldMobile,
                                    projectId:_this.projectId,
                                    passKey:_this.passKey,
                                    ticket: res.ticket,
                                    randstr: res.randstr,
                                    userIP: returnCitySN["cip"]
                                }
                            }

                            //有原手机的情况下，倒计时
                            _this.getVerificationCode(ajaxObj).then((data) => {
                                if (data) {
                                    //- > 120s倒计时
                                    _this.mobileCountDownFn();
                                }
                            })
                        }

                    });
                    captcha1.show(); // 显示验证码




                } else {
 
                    let newInput = $.trim($("input[name = editunmobile]").val());

                    //同时正则号码
                    if(!regPhoneNumber.test(newInput)){
                        _this.bindMobileFlag = true;
                        _this.mobileDbclickFlag = false;
                        return;
                    } else {
                        _this.bindMobileFlag = false;
                    }

                    //校验当前手机号是否存在, 如果为新号码，则发送验证码，并且倒计时
                    _this.checkAccount(newInput, type).then((data) => {
                        // console.log(data)
                        if(data) {


                            var captcha1 = new TencentCaptcha('2050675704', function(res) {
                                    
                                    if(res.ret === 0){
                                        ajaxObj = {
                                            url : '/frontUser/sendVerificationCode',
                                            data : {
                                                phone: newInput,
                                                projectId:_this.projectId,
                                                passKey:_this.passKey,
                                                ticket: res.ticket,
                                                randstr: res.randstr,
                                                userIP: returnCitySN["cip"]
                                            }
                                        }

                                        //有原手机的情况下，倒计时
                                        _this.getVerificationCode(ajaxObj).then((data) => {
                                            if (data) {
                                                //- > 120s倒计时
                                                _this.mobileCountDownFn();
                                            }
                                        })
                                    }


                                });
                                captcha1.show(); // 显示验证码

                            //账号不存在 -> 新号码
                            // ajaxObj = {
                            //     url : '/message/getCheckCode',
                            //     data : {
                            //         phone: newInput
                            //     }
                            // }

                            // //请求验证码
                            // _this.getVerificationCode(ajaxObj).then((data) => {
                            //     if(data) {
                            //         //- > 120s倒计时
                            //         _this.mobileCountDownFn();
                            //     }
                            // })

                        } else {
                            _this.mobileDbclickFlag = false;
                        }
                    });

                }
            }

            //如果操作的是邮箱
            if(type == 'email') {

                if(_this.emailDbclickFlag){//防止邮箱获取验证码重复点击
                    return;
                }
                _this.emailDbclickFlag = true;

                if(!!_this.oldEmail) {
                    //有原邮箱的情况下，只是更换邮箱
                    ajaxObj = {
                        url: '/frontUser/sendEmailVerifyCode',
                        data: {
                            email: _this.oldEmail
                        }
                    }

                    //有邮箱的情况下，倒计时
                    _this.getVerificationCode(ajaxObj).then((data) => {
                        if (data) {
                            //- > 120s倒计时
                            _this.emailCountDownFn();
                        }
                    })

                } else {

                    //邮箱未填写的情况下，绑定新邮箱
                    let newInput = $.trim($("input[name = editunemail]").val());

                    //同时正则邮箱
                    if(!regEmail.test(newInput)){
                        _this.bindEmailFlag = true;

                        return;
                    } else {
                        _this.bindEmailFlag = false;
                    }

                    // console.log(123)

                    //校验当前邮箱是否存在, 如果为新号码，则发送验证码，并且倒计时
                    _this.checkAccount(newInput, type).then((data) => {
                        if(data) {
                            //账号不存在 -> 新号码 - > 120s倒计时
                            ajaxObj = {
                                url : '/frontUser/sendEmailVerifyCode',
                                data : {
                                    email: newInput
                                }
                            }

                            //请求验证码
                            _this.getVerificationCode(ajaxObj).then((data) => {
                                if(data) {
                                    //- > 120s倒计时
                                    _this.emailCountDownFn();
                                }
                            })


                        } else {
                            _this.emailDbclickFlag = false;
                        }
                    });

                }

            }

        },
        getVerificationCode: function(obj){
            //获取验证码
            let _this = this;

            _this.$layer.loading();

            return new Promise((resolve, reject) => {
                commonAjaxFun({
                    url: obj.url,
                    data: obj.data
                }, 300).then((data) => {

                    _this.$layer.close();

                    if (resolve) {
                        if (data.state == '0') {
                            _this.$layer.toast({
                                content: _this.$t("RegLogin.AskForCodeSuccess")
                            }); //验证码发送成功
                            resolve(true);
                        } else {
                            _this.$layer.toast({
                                content: data.message
                            }); //验证码发送失败
                            reject(false);
                        }
                    }
                })
            })

        },
        checkAccount: function(account, type){
            //当前账号是否存在, type用于判断是邮箱还是手机
            let _this = this;

            _this.$layer.loading();

            return new Promise((resolve, reject) => {
                commonAjaxFun({
                    url: '/frontUser/checkAccount',
                    data: {
                        account : account
                    }
                }, 300).then((data) => {

                    _this.$layer.close();

                    if(resolve) {
                        if(data.state == '0') {
                            if(data.data){
                                //账号存在

                                if(type == 'mobile') {
                                    _this.$layer.toast({content: _this.$t("RegLogin.boundPhone")});//手机账号已存在
                                } else if(type == 'email'){
                                    _this.$layer.toast({content: _this.$t("RegLogin.boundEmail")});//邮箱账号已存在
                                }

                                _this.mobileDbclickFlag = false;
                                resolve(false);

                            } else {// 112112@163.com, 18710282311
                                //账号不存在
                                 _this.mobileDbclickFlag = false;
                                resolve(true);
                            }
                        } else {
                            reject(false);
                        }
                    }
                })
            })
        },
        emailCountDownFn: function(){
            //邮箱倒计时，因为邮箱和手机倒计时必须无耦合，所以拆分来写
            let _this = this;

            if(_this.emailCountDownNum == 0){
                _this.emailCodeText = _this.$t("RegLogin.AskForCode");//获取验证码
                _this.emailCodeFlag = false;
                _this.emailCountDownNum =  120;
                _this.emailDbclickFlag = false;
                return false;
            } else {
                _this.emailCodeText = _this.emailCountDownNum + 's';
                _this.emailCodeFlag = true;
                _this.emailCountDownNum--;
            }

            setTimeout(() => {
                _this.emailCountDownFn();
            }, 1000)
        },
        mobileCountDownFn: function(){
            //手机倒计时，因为邮箱和手机倒计时必须无耦合，所以拆分来写
            let _this = this;

            if(_this.mobileCountDownNum == 0){
                _this.mobileCodeText = _this.$t("RegLogin.AskForCode");//获取验证码
                _this.mobileCodeFlag = false;
                _this.mobileCountDownNum =  120;
                _this.mobileDbclickFlag = false;
                return false;
            } else {
                _this.mobileCodeText = _this.mobileCountDownNum + 's';
                _this.mobileCodeFlag = true;
                _this.mobileCountDownNum--;
            }

            setTimeout(() => {
                _this.mobileCountDownFn();
            }, 1000)
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import "../../common/stylus/function.styl"

.head-back
    span.SmallFont
        font-size: 13px
.Occupy span
    &.o-idet
        color: #f35b00
    &.SmallFont
        font-size: 13px
.person-center
    padding: 10px
.person-image
    border-bottom: 1px solid rgba(0, 0, 0, 0.05)
    .uploadImgBox
        width: 100px
        margin: 0 auto
        padding-bottom: 10px
    .upload
        position: relative
        width: 100px
        height: 100px
    .upLoadImg
        position: relative
        width: 100px
        height: 100px
        border-radius: 4px
        overflow: hidden
        background-position: center center
        background-repeat: no-repeat
        background-size: contain
    .delete-img
        position: absolute
        right: -10px
        top: -10px
        z-index: 2
        i
            display: block
            width: 30px
            height: 30px
            line-height: 30px
            text-align: center
            font-size: 18px
    p
        text-align: center
        padding: 10px 0
        font-size: 14px
        color: #f35b00

    .uploadify-button
        width: 100px !important
        height: 100px !important
        text-align: center
        position: relative
        overflow: hidden
    .progressnum, .up_percent
        display: none !important
    .uploadify-queue .uploadify-queue-item
        margin-top: 0px !important
    .uploadify-progress
        width: 100% !important
        height: 6px !important
        border-radius: 6px !important
        vertical-align: 4px !important
    .uploadify-queue
        font-size: 0px !important

.all-part,.edit-phone-part
    &.right-enter-active
        transition: all 0.2s linear
    &.right-enter
        transform: translateX(100%)
    &.right-leave-active
        transition: all 0s linear
    &.right-leave
        transform: translateX(-100%)
    &.left-enter-active
        transition: all 0.2s linear
    &.left-enter
        transform: translateX(-100%)
    &.left-leave-active
        transition: all 0s linear
    &.left-leave
        transform: translateX(100%)
.person-center .edit-field-box
    display: flex
    .select-area
        flex: 4
        border: 1px solid #c9d0d6
        background-color: #f0efed
        font-size: 14px
        border-radius: 2px
        &:nth-child(2)
            margin: 0 2%
        select
            display: block
            width: 100%
            height: 38px
            line-height: 38px
            background-color: transparent
            box-sizing: border-box
            padding: 0 10px
.attendEdit
    .waitList
        background-color: #fff
        span
            background-color: #E6E6E6
</style>
