<template>
	<div>
        <div class="mask-shadow" @click="setSmallFromFlag(false)"></div>
		<transition name="move">
			<div class="smallFrom">
				<div class="FromBox">
					<div class="smallTtitle">
						<p>完善以下信息，以便于预约展位、结交人脉、获取商机</p>
						<p class="orangeColor">一旦填写保存后，信息不可更改</p>
					</div>
					<div class="from">
						<div class="input"><span >{{$t("RegLogin.Name")}}</span><input type="text" name="name" v-model='nameValue' :disabled= 'isName' @input= "nameChange" placeholder="请输入您的真实姓名"><label>*</label></div>
						<div class="input"><span>{{$t("RegLogin.Company")}}</span><input type="text" name=" company" v-model='company' :disabled= 'isConpany'  @input= "conpanyChange" placeholder="请输入您的公司全称"><label>*</label></div>
						<div class="input"><span>{{$t("label.Role")}}</span><select v-model="Role" :disabled= 'isRole'>
						    <option v-for="value in RoleCategoryArr" :value="value" v-text="value"></option>
						</select><label>*</label></div>
					</div>
					<div class="btnTj" @click="tj" :class="{ active: isTJ }">{{$t("QuestionPage.Submit")}}</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>

import {formatDate, mainUserTk,  boothClassifyToList, commonAjaxFun} from '../../../common/js/common.js'

export default {
    props: {
    	// contactList: Array,
    	setSmallFromFlag:Function
    },
    data(){
    	return {
    		projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
        	nameValue:'',
        	company:'',
        	Role:'',
        	isName : false,
        	isConpany:false,
        	isRole:false,
        	isTJ:false,  //判断是否能提交
            delefulRoleValue:"",
            RoleCategoryArr: [],//角色类型数组
            defaultRoleList:{
                en:"Visitor|Professional Visitor|Media|Exhibitors|Organizer",
                ch:"普通观众|专业观众|媒体|参展商|主办方"
            }

    	}
    },
    filters: {

    },
    mounted(){
       	this.initRoleCategory()
       
    },
    methods: {
    	setFormValue:function(obj){
    		this.nameValue = obj.name
    		this.company = obj.company
    		this.Role = obj.Role
    		this.Role =  this.Role == "" ? this.delefulRoleValue : this.Role;
    		this.isName = this.nameValue !== "" ? true :false
    		this.isConpany = this.company !== "" ? true :false
    		this.isRole = obj.Role !== "" ? true :false

    		this.checkFill()
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
    	               //console.log(data.data)
                       if(data.data == ""){
                           data.data  =  _this.defaultRoleList[_language]
                       }
    	                _this.RoleCategoryArr = data.data.split("|");

                        if(_this.RoleCategoryArr[_this.RoleCategoryArr.length-1] == ""){
                           _this.RoleCategoryArr.pop(); 
                        }
                        
    	                _this.delefulRoleValue = _this.RoleCategoryArr[0];
    	            }
    	        } catch(err){
    	            console.log(err)
    	        }
    	    }, (err) => {
    	        console.log(err)
    	    })
    	},
    	nameChange(e){
    		this.checkFill()
    	},
    	conpanyChange(){
    		this.checkFill()
    	},
    	tj(){

    		let _this = this;
    		_this.$layer.loading();
    		commonAjaxFun({
    		    url: '/frontUser/updateUserInfo',
    		    data: {
    		    	userId:"",
    		    	name:this.nameValue,
    		    	company:this.company,
    		    	roleType:this.Role
    		    }
    		}).then((data) => {
    			_this.$layer.close();
    		    try {
    		        if(data.state == '0'){
    					//成功
    					_this.$layer.toast({content:  _this.$t('QuestionPage.SubSuccess')});
                        _this.setSmallFromFlag(false)
    		        }
    		    } catch(err){
    		        console.log(err)
    		    }
    		}, (err) => {
    		    console.log(err)
    		})

    		//console.log(this.nameValue)
    		//console.log(this.company)
    		//console.log(this.Role)
    	},
    	checkFill(){           //判断表单是否填写
    		if( $.trim( this.nameValue ) !== "" && $.trim( this.company ) !== "" ){
    			this.isTJ = true;
    		}else{
    			this.isTJ = false;
    		}
    	}
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../../common/stylus/function.styl"

.smallFrom
	position: fixed
	left: 0px
	bottom: 0px
	width: 100%
	z-index: 16
	background-color:#fff
	transform: translate3d(0, 0, 0)
	&.move-enter-active, &.move-leave-active
		transition: all 0.1s linear
	&.move-enter, &.move-leave-active
		transform: translate3d(0, 100%, 0)
	.FromBox
		padding:20px 15px
		.smallTtitle
			font-size:12px
			color:#333333
			.orangeColor
				color:#F35B00
		.from
			.input
				background-color: #F3F3F3
				padding:10px 0
				font-size:12px
				margin:10px 0;
				height:30px;
				line-height:30px;
				border-radius:2px;
				span
					display: inline-block;
					width: 20%;
					text-align: center;
					vertical-align: top;
				input,select
					height:30px;
					display: inline-block;
					width: 70%;
					vertical-align: top;
				label
					width:10%
					display: inline-block;
					color:#F35B00;
					text-align:center
					font-size:25px;
					vertical-align: top;
		.btnTj
			background-color:#D9D9D9
			height:50px
			line-height:50px
			text-align:center
			color:#ffffff
			font-size:18px
			border-radius:2px;
		.active
			background-color:#F35B00

	
</style>
