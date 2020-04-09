<template>

    <div v-if="allhtmlEleData">
        <template v-for="(item,index) in allhtmlEleData">
            <!--输入框-->
            <div class="field-main" v-if="item.htmlEle == 'input' && (item.eleType == 'text' || item.eleType == 'datetime-local' || item.eleType == 'date')">
                <h4 class="field-title"><span v-text="item.showName"></span><em class="red-star" v-if="item.isNotNull == 1">*</em></h4>
                <div class="field-box">
                    <div class="field-input"><input class="text-input" placeholder="" v-model="item.formValue" :name="item.eleMark" :htmlele='item.htmlEle' :nameID="item.eleMark" :isNotNull="item.isNotNull" :type="item.eleType" maxlength="50"></div>
                    <div class="field-handle"><i class="icon-clear"></i></div>
                </div>
                <p class="field-error"><span></span></p>
            </div>

            <!--下拉框-->
            <div class="field-main" v-if="item.htmlEle == 'select' && item.eleMark !== 'roleType' ">
                <h4 class="field-title"><span v-text="item.showName"></span><em class="red-star" v-if="item.isNotNull == 1">*</em></h4>
                <div class="field-box">
                    <div class="field-input">
                    <!-- !item.formValue && item.formValue !=='' ?  allSelectFilterData[index][0] : item.formValue -->
                        <select :name="item.eleMark" v-model="allSelectFilterData[index][0]"  :isNotNull="item.isNotNull" :htmlele='item.htmlEle' :nameID="item.eleMark" :selfData = "allSelectFilterData[index]">
                            <template v-for="(options, key) in allSelectFilterData[index]">
                                <option :value="options" v-text="options"></option>
                            </template>
                        </select>
                    </div>
                </div>
                <p class="field-error"><span></span></p>
            </div>
            <div class="field-main" v-if="item.htmlEle == 'select' && item.eleMark == 'roleType' ">
                <h4 class="field-title"><span v-text="item.showName"></span><em class="red-star" v-if="item.isNotNull == 1">*</em></h4>
                <div class="field-box">
                    <div class="field-input">
                        <select :name="item.eleMark" v-model="roleValue" :value="roleValue" :isNotNull="item.isNotNull" :htmlele='item.htmlEle' :nameID="item.eleMark" :selfData = "allSelectFilterData[index]">
                            <option v-for="value in RoleCategoryArr" :value="value" v-text="value"></option>
                        </select>
                    </div>
                </div>
                <p class="field-error"><span></span></p>
            </div>


            <!--单选按钮-->
            <div class="field-main" v-if="item.htmlEle == 'input' && item.eleType == 'radio'">
                <h4 class="field-title"><span v-text="item.showName"></span><em class="red-star" v-if="item.isNotNull == 1">*</em></h4>
                <div class="field-choose" :selfData = "allSelectFilterData[index]" value="" :name="item.eleMark" :htmlele='item.htmlEle' :nameID="item.eleMark" :isNotNull="item.isNotNull">
                    <template v-for="(val, key) in allSelectFilterData[index]">
                        <div @click="radioFun($event)" class="field-choose-list" :dataval="val" :class="item.formValue == val ? 'field-choose-on' : ''" :nameFor="item.eleMark">
                            <i class="icon-radio" :class="item.formValue == val ? 'icon-radioed' : ''"></i>
                            <span v-text="val"></span>
                        </div>
                    </template> 
                </div>
                <p class="field-error"><span></span></p>
            </div>

            <!--复选按钮-->
            <div class="field-main" v-if="item.htmlEle == 'input' && item.eleType == 'checkbox'">
                <h4 class="field-title"><span v-text="item.showName"></span><em class="red-star" v-if="item.isNotNull == 1">*</em></h4>
                <div class="field-choose" :selfData = "allSelectFilterData[index]" value="" :name="item.eleMark" :htmlele='item.htmlEle' :nameID="item.eleMark" :isNotNull="item.isNotNull">
                    <template v-for="(val, key) in allSelectFilterData[index]">
                        <div @click="checkFun($event)" class="field-choose-list" :dataval="val" :class="hasChooseCheck(item.formValue, val) ? 'field-choose-on' : ''" :nameFor="item.eleMark">
                            <i class="icon-check" :class="hasChooseCheck(item.formValue, val) ? 'icon-checked' : ''"></i>
                            <span v-text="val"></span>
                        </div>
                    </template> 
                </div>
                <p class="field-error"><span></span></p>
            </div>

            <!--多行文本-->
            <div class="field-main" v-if="item.htmlEle == 'textarea'">
                <h4 class="field-title"><span v-text="item.showName"></span><em class="red-star" v-if="item.isNotNull == 1">*</em></h4>
                <div class="field-box">
                    <div class="field-input"><textarea :name="item.eleMark" :htmlele='item.htmlEle' :nameID="item.eleMark" :isNotNull="item.isNotNull" :maxlength="200" v-model="item.formValue" v-text="item.formValue"></textarea></div>
                </div>
                <p class="field-error"><span></span></p>
            </div>

            <!--国家省份-->
            <div class="field-main" v-if="item.htmlEle == 'input' && item.eleType == 'textAddress'" :htmlele='item.htmlEle' :nameID="item.eleMark" :value="addressResult">
                <h4 class="field-title"><span v-text="item.showName"></span><em class="red-star" v-if="item.isNotNull == 1">*</em></h4>
                <v-address ref="Address" :address="address" v-on:getAddress="_getAddress"></v-address>
                <p class="field-error"><span></span></p>
            </div>
        </template>
        <!--个人标签分类-->
        <!-- <div class="booth-classify">
            <h6 class="local-title">{{$t("label.interTips")}}</h6>
            <v-classify ref="boothclassify" :type="'boothclassify'" :interestId="interestId" v-on:getClassify="boothGetClassify"></v-classify>
        </div> -->
    </div>
</template>

<script>
import { commonAjaxFun,includeStrChooice } from '../../../common/js/common.js'
import vAddress from '../address/address.vue'//省级联动
import vClassify from '../classify/classify.vue'

export default {
    props : ['my','typeChOrCh'] ,
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            address:"请选择-请选择-请选择",
            InterestPoint: [],//个人兴趣
            addressResult: '',//地址
            allhtmlEleData:[],//所有自定义选项数据
            allSelectFilterData:[],//所有下拉格式化数据
            RoleCategoryArr: [],//角色类型数组
            roleValue: '',//角色类型的v-model值
            falgRole:false,
            changeLanguage:this.typeChOrCh || ""
        }
    },

    components: {
        vAddress,
        vClassify
    },
    computed:{
    },
    mounted(){
        this.initRoleCategory();//初始化角色类型
        this.getFormAttrVal();
    },
    methods: {
        initRoleCategory: function(){
            //初始化角色类型
            // let _paramsdata =  Object.assign(_regJson, account_key);
            let _this = this;
            commonAjaxFun({
                url: '/frontUser/getRoleType',
                data: {
                  projectId:_this.projectId,
                  passKey:_this.passKey,
                  language:_this.changeLanguage
                }
            }).then((data) => {
                try {
                    if(data.state == '0'){
                        // console.log(data)
                        var _select = '';

                        if( _this.typeChOrCh !== ""){
                            _select =  _this.typeChOrCh =="en" ? "Select" : "请选择"
                        }else{
                           _select = _this.$cookie.get('language')  =="en" ? "Select" : "请选择"
                        }
                        // _arr.unshift(_select)

                        _this.RoleCategoryArr = data.data.split("|");
                        _this.RoleCategoryArr.unshift(_select)
                        _this.roleValue = _this.RoleCategoryArr[0];
                    }
                } catch(err){
                    console.log(err)
                }
            }, (err) => {
                console.log(err)
            })
        },
        _getAddress: function(val){
            // console.log(val)
            this.addressResult = val;
        },
        boothGetClassify: function(val){
            //个人属性-获取分类模块中的id
            this.InterestPoint = val;
        },
        getFormAttrVal: function(){//获取除去国家列表之外的表单
            //展位基本信
            let _this = this;
            commonAjaxFun({
                url: '/userForm/getFormAttrVal',
                data: {
                    language:_this.changeLanguage
                }
            }).then((data) => {

                try {
                    
                    if (data.state == "0") {
                       
                        let _data = data.data;

                        var _list_data = []
                           
                        if(_this.my){
                            for(var i = 0,max =_data.length;i<max;i++){ 
                                if( _data[i].eleMark !== "roleType" &&  _data[i].eleMark !== "name"  &&  _data[i].eleMark !== "company"){
                                    // console.log(_data[i])
                                    _list_data.push( _data[i])
                                }
                            }
                            // console.log(_list_data)
                        }else{
                            _list_data = _data
                        }
                        
                        _data = _list_data
                       

                        //对selsec数据处理，如果当前没有默认值，则赋值第一个
                        for (let e = 0; e < _data.length; e++) {
                            if (_data[e].htmlEle == "select" && _data[e].formValue == "") {
                                _data[e].formValue = _data[e].eleContent.split('|')[0];
                            }
                        }
                       
                        // _this.allhtmlEleData = _data;
                         _this.allhtmlEleData.splice(0, _this.allhtmlEleData.length,..._data);
                        _this.allSelectFilterData.length = _data.length;
 
                        //格式化selsect数据
                        for (let j = 0; j < _data.length; j++) {

                            if (_data[j].htmlEle == "select" ||
                                (_data[j].htmlEle == "input" && _data[j].eleType == "radio") ||
                                (_data[j].htmlEle == "input" && _data[j].eleType == "checkbox")) {

                                let _arr = _data[j].eleContent == undefined || _data[j].eleContent=="" ? [] : _data[j].eleContent.split('|');
                                if(_arr[_arr.length-1] == ""){
                                   _arr.pop(); 
                                }
           
                                if( _data[j].htmlEle == "select" ){
                                    var _select = '';

                                    if( _this.typeChOrCh !== ""){
                                        _select =  _this.typeChOrCh == "en" ? "Select" : "请选择"
                                    }else{

                                       _select = _this.$cookie.get('language')  =="en" ? "Select" : "请选择"
                                    }
                                    _arr.unshift(_select)
                                }
                                
                                _this.allSelectFilterData[j] = _arr;

                            } else if (_data[j].htmlEle == "input" && _data[j].eleType == "textAddress") {

                                //省级联动
                                if (!!_data[j].formValue) {
                                    _this.address = _data[j].formValue;
                                    _this.addressResult = _data[j].formValue;
                                }

                            } else {

                                _this.allSelectFilterData[j] = new Array();
                            }
                        }
                        // console.log(JSON.parse(JSON.stringify( _this.allhtmlEleData)))
                    } else {
                        console.log(data.message);
                    }

                } catch (err) {
                    console.log(err)
                }
            })
        },
        hasChooseCheck: function(valArr, val){
            //复选按钮已选择
            try{
                if(!!valArr){
                    let _valArr = valArr.split('|');

                    for(let i = 0; i < _valArr.length; i++){
                        if(_valArr[i] == val){
                            return true;
                        }
                    }
                }else {
                    return false;
                }
            } catch(err){
                console.log(err);
            }

        },
        submit: function(){
            let  _this = this;
            //_this.$refs.boothclassify.submit();//触发分类子组件提交
            let _nameDom = $('div [nameID]');

            let _regJson = {};
            let allFlag = true;

            for(let i = 0; i < _nameDom.length; i++){

                let _thisName = $(_nameDom[i]).attr('nameID');
                let _thisNotNull = $(_nameDom[i]).attr('isNotNull');
                let _thisValue = $(_nameDom[i]).attr('value') || $(_nameDom[i]).val();
                let _thishtmlele = $(_nameDom[i]).attr('htmlele')
                var _titpStr = "";
                
                if(!_thisValue && _thisNotNull == 1 && _thishtmlele !== "select"){
                    // console.log(_thisValue)
                    allFlag = false;
                   
                    var _titpStr=""
                    if( _this.typeChOrCh !== ""){
                        _titpStr =  _this.typeChOrCh =="en" ? "Content can’t be empty!" : "内容不能为空";
                    }else{
                        _titpStr =  _this.$cookie.get('language') =="en" ? "Content can’t be empty!" : "内容不能为空";
                    }
                    $(_nameDom[i]).parents('.field-main').find('.field-error span').html(_titpStr);//内容不能为空
                
                }else{
                    $(_nameDom[i]).parents('.field-main').find('.field-error span').html('');
                    
                }

                if(_thishtmlele == "select" && _thisNotNull == 1 || _thisName == "address"){
                    // if(  _thisValue == "Select" || _thisValue == "请选择-请选择-请选择" || _thisValue == "请选择"){
                    if(  _thisValue == "Select" ||  includeStrChooice(_thisValue) || _thisValue == "请选择"){
                        allFlag = false;
                        var _titpStr = ""
                        if( _this.typeChOrCh !== ""){
                            _titpStr =  _this.typeChOrCh =="en" ? "Select" : "请选择"
                            
                        }else{
                            _titpStr =  _this.$cookie.get('language') =="en" ? "Select" : "请选择"
                        }
                            
                        if(_thisName == "address"){
                            $(_nameDom[i]).find('.field-error span').html(_titpStr);//内容不能为空
                        }else{

                            $(_nameDom[i]).parents('.field-main').find('.field-error span').html(_titpStr);//内容不能为空
                        }
                       
                    }else{
                        if(_thisName == "address"){
                            $(_nameDom[i]).find('.field-error span').html('');
                        }else{
                            $(_nameDom[i]).parents('.field-main').find('.field-error span').html('');
                        }
                    }
                }

                if(_thishtmlele == "select" || _thisName == "address"){
                    // if(_thisValue == "Select" || _thisValue == "请选择-请选择-请选择" || _thisValue == "请选择"){
                    if(_thisValue == "Select" || includeStrChooice(_thisValue) || _thisValue == "请选择"){
                        _thisValue = ""
                    }
                }
                _regJson[_thisName] = _thisValue;
            }

            // console.log(_regJson)
            if(!allFlag){
                return false;
            }

            //个人兴趣
            //_regJson['interestPoint'] = _this.InterestPoint;

            _this.$emit('allSubmit', _regJson);

        },
        checkFun: function(event){
            //多项选择
            let _targetDom = $(event.currentTarget);
            let _nameFor = _targetDom.toggleClass('field-choose-on').attr('nameFor');//获取当前的nameId
            _targetDom.find('i').toggleClass('icon-checked');

            let checkValArr = [];

            let checkValDom = $('div.field-choose-on[nameFor=' + _nameFor + ']');

            for(let i=0; i < checkValDom.length; i++){
                checkValArr.push($(checkValDom[i]).attr('dataval'))
            }

            $('div[name=' + _nameFor + ']').attr('value',checkValArr.join('|'));

        },
        radioFun: function(event){
            //单项选择
            let _targetDom = $(event.currentTarget);
            let _nameFor = _targetDom.attr('nameFor');//获取当前的nameId

            $('div[nameFor=' + _nameFor + ']').removeClass('field-choose-on');

            $('div[name=' + _nameFor + ']').find('i').removeClass('icon-radioed')

            _targetDom.addClass('field-choose-on').find('i').addClass('icon-radioed');

            let resultVal = $('div.field-choose-on[nameFor=' + _nameFor + ']').attr('dataval');

            $('div[name=' + _nameFor + ']').attr('value',resultVal);
        }
    },
    watch:{
        typeChOrCh:function(val,oldval){
            this.allhtmlEleData.splice(0, this.allhtmlEleData.length);
            if(val){
                this.changeLanguage = val
                this.getFormAttrVal()
                this.initRoleCategory()
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.field-main
    select
        display: block
        width: 100%
        height: 38px
        line-height: 38px
        background-color: transparent
        box-sizing: border-box
        padding: 0 10px
.create-form .edit-field-box
    display: flex
    .select-area
        flex: 4
        border: 1px solid #c9d0d6
        background-color: #f0efed
        font-size: 14px
        border-radius: 2px
        &:nth-child(2)
            margin: 0 2%
.classifyButtom
    position: fixed
    left:0px
    bottom: 0px
    width: 100%
    height: 52px
    font-size:0px
    a
        font-size: 16px
        display: inline-block
        width: 50%
        height: 52px
        line-height: 52px
        text-align: center
        color: #666
        background-color: #E6E6E6
        &.submit
            color: #fff
            background-color: #F35B00
</style>
