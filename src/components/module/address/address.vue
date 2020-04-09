<template>
    <div class="edit-field-box">
        <div class="select-area">
        	<select v-model="Country" @change = "getCountry(Country)">
                <template v-for="options in CountryOption">
                    <option :value="options.name" v-text="options.showText"></option>
                </template>
            </select>
        </div>
        <div class="select-area">
        	<select v-model="Province" @change = "getProvince(Province)">
                <template v-for="options in ProvinceOption">
                    <option :value="options.name" v-text="options.showText"></option>
                </template>
            </select>
        </div>
        <div class="select-area">
        	<select v-model="City">
                <template v-for="options in CityOption">
                    <option :value="options.name" v-text="options.showText"></option>
                </template>
            </select>
        </div>
    </div>
</template>

<script>

import {commonAjaxFun, getListCity} from '../../../common/js/common.js'

export default {
    props:{
        address: String
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            addressFormat:'',//默认地址格式化
        	Country: "",//国家
        	CountryOption: [],//国家列表
        	Province: "",//省份
        	ProvinceOption:[],//省份列表
        	City: "",//城市
        	CityOption:[],//城市列表
            allDistrictData: [],//所有国家地区数据
        }
    },
    computed: {
        addressResult: function(){
            return this.Country + '-' + this.Province + '-' + this.City;
        }
    },
    mounted(){
        this.formatAddress();
    	this.getDistrict();
    },
    methods: {
        formatAddress(){//格式化地址
            // console.log(this.address)
            this.addressFormat = this.address.split('-');
        },
    	getDistrict: function(){
    		//获取国家列表
    		let _this = this;
    		commonAjaxFun({
                url: '/bommonBasic/getDistrict',
                data: {}
            }).then((data) => {
                try {
                	if(data.state == "0"){
                         // console.log(JSON.parse(JSON.stringify( data.data)))
                        _this.allDistrictData = getListCity(data.data, 0);
                        // console.log(JSON.parse(JSON.stringify(  _this.allDistrictData )))

                        _this.CountryOption = _this.allDistrictData;
                        _this.CountryOption.unshift({name:"请选择",showText:"请选择(Select)"})


                        _this.Country = _this.addressFormat[0];
                        _this.getCountry(_this.Country); 

                        _this.Province = _this.addressFormat[1];
                        _this.getProvince(_this.Province); 

                        _this.City = _this.addressFormat[2];                                                

                	} else {
                        console.log(data.message)
                    }

                } catch(err){
                    console.log(err)
                }
            })
    	},
        getCountry: function(str){//国家

            this.ProvinceOption = this.getList(this.CountryOption, str).children || [];

            if(this.uqion(this.ProvinceOption, "请选择")){
                this.ProvinceOption.unshift({name:"请选择",showText:"请选择(Select)"})
            }
        
            this.Province = this.ProvinceOption[0].name;
            this.getProvince(this.Province)
        },
        getProvince:function(str){//省份

            this.CityOption = this.getList(this.ProvinceOption, str).children || [];

            if(this.uqion(this.CityOption,"请选择")){
                this.CityOption.unshift({name:"请选择",showText:"请选择(Select)"})
            }

            this.City = this.CityOption[0].name;
        },
        getList:function (_list, country_str){
            
            let _obj = new Array();

            for (let i = 0; i < _list.length; i++) {
                if (_list[i].name == country_str) {
                    _obj = _list[i];
                    break;
                }
            }

            return _obj
        },
        uqion:function(arr,str){
            var flag = true;
            // console.log(JSON.parse(JSON.stringify( this.ProvinceOption)))
            for(var i=0,max=arr.length;i<max;i++){
                if( arr[i].name == str){
                    flag =  false
                    break;
                }
            }
            return flag
        }
    },
    watch: {
        addressResult: function(){
            this.$emit('getAddress', this.addressResult);
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
