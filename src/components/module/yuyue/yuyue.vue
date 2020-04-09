<template>
	<div>
		<div class="bottom-fix">
			<a href="javascript:void(0);" @click="showYuyue"><i class="icon-productclassify"></i><span title="预约">{{$t("RegLogin.Appointment")}}</span></a>
			<a href="javascript:void(0);" @click="showZixun" v-if="contactList.length > 0 || boothData.attnPhone"><i class="icon-helpphone"></i><span title="咨询">{{$t("RegLogin.Advisory")}}</span></a>
		</div>
		<!--预约-->
		<div class="mask-shadow" v-show="yuyueShowFlag || zixunShowFlag" @click="hideMaskShadow"></div>
		<transition name="move">
			<div class="module-yuyue" v-show="yuyueShowFlag" v-if="boothData">
				<h4 class="bottom-fix-title"><i class="icon-productclassify"></i><span title="咨询">{{$t("RegLogin.Appointment")}}</span></h4>
				<div class="bottom-booth-infro">
					<div class="photo"><img v-if="boothData.comLogo" v-lazy="boothData.comLogo" /><img v-else src="~@/common/images/boothPhoto.png" /></div>
					<div class="text">
						<h6 v-text='boothData.boothName'></h6>
						<p v-text='boothData.comShortName'></p>
						<p>{{boothData.catesList | toList}}</p>
					</div>
				</div>
				<div class="bottom-booth-place">
					<a href="javascript: void(0);" title="展位">
						<i class="icon-placearrow"></i><span> {{boothData.boothNum}} {{$t("Exhibitor.Title")}}</span>
					</a>
				</div>
				<div class="bottom-booth-time">
					<div class="roughly-time">
						<label title="展位">{{$t("RegLogin.AppointmentDate")}}</label>
						<div class="select-in" v-if="getTimeOptionArr.length > 0">
							<select class="select-time" v-model="yuyueTime">
								<template v-for="value in getTimeOptionArr">
									<option :value="value" v-text="value"></option>
								</template>
							</select>
						</div>
					</div>
					<div class="accurate-time">
						<label></label>
						<div class="select-in accurate-time-tab"><div class="am" @click="changeAmPm($event, '上午')"><i class="icon-radioed icon_color" title="上午"></i>{{$t("CommonUse.AM")}}</div><div class="pm" @click="changeAmPm($event, '下午')"><i class="icon-radio" title="下午"></i>{{$t("CommonUse.PM")}}</div></div>
					</div>
				</div>
				<div class="bottom-booth-submit" @click="submitYuyue" title="发送">{{$t("RegLogin.AppointmentSubmit")}}</div>
			</div>
		</transition>
		<!--咨询-->
		<transition name="move">
			<div class="module-zixun" v-show="zixunShowFlag" v-if="boothData">
				<h4 class="bottom-fix-title"><i class="icon-helpphone"></i><span title="咨询">{{$t("RegLogin.Advisory")}}</span></h4>
				<div class="listCol">
					<ul class="in-list">
						<!--默认展位联系人 不可点击-->
						<li>
							<a href="javascript: void(0);">
				                <div class="infro">
				                    <div class="photo"><img v-if="boothData.comLogo" v-lazy="boothData.comLogo" /><img v-else src="~@/common/images/boothPhoto.png" /></div>
				                    <div class="text">
				                        <h6 v-text='boothData.attnName'></h6>
				                        <p v-text='boothData.attnPosition'></p>
				                        <p v-text='boothData.attnEmail'></p>
				                    </div>
				                </div>
							</a>
							<a v-if="boothData.attnPhone" :href="boothData.attnPhone | fomartPhone" class="list-handle"><i class="icon-mobile icon_color"></i></a>
						</li>
						<li v-for="value in contactList">
							<router-link :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.userId}}">
				                <div class="infro">
				                    <div class="photo"><img v-if="value.headPortrait" v-lazy="value.headPortrait" /><img v-else src="~@/common/images/default.png" /></div>
				                    <div class="text">
				                        <h6 v-text='value.name'></h6>
				                        <p v-text='value.email'></p>
				                        <p v-text='value.position'></p>
				                    </div>
				                </div>
					        </router-link>
							<router-link :to="{path:'/chat/index', query:{projectId: projectId, passKey: passKey, userid: value.userId}}" class="list-handle">
								<i class="icon-topic icon_color"></i>	
							</router-link>
							<a :href="value.phone | fomartPhone" class="list-handle"><i class="icon-mobile icon_color"></i></a>
						</li>
					</ul>
				</div>
			</div>
		</transition>

		<smallFrom ref= 'smallFrom' v-show='smallFromFlag' :setSmallFromFlag = "setSmallFromFlag" ></smallFrom>
	</div>
</template>
<script>

import {formatDate, mainUserTk,  boothClassifyToList, commonAjaxFun} from '../../../common/js/common.js'
import smallFrom from '../smallFrom/index.vue'
export default {
    props: {
    	boothData: Object,
    	contactList: Array
    },
    data(){
    	return {
    		projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
    		Infro: '',//会议基本信息，用于开始时间和结束时间
    		timeFlag: false,//用户判断当前活动已结束
    		timeAmPm: '上午',//选择上下午,默认上午
    		yuyueShowFlag: false,//底部预约隐藏
    		zixunShowFlag: false,//底部咨询隐藏
    		yuyueTime: '',//预约时间
    		getTimeOptionArr: [],//预约时间的列表
    		smallFromFlag:false,  // 判断表单显示隐藏
    		returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`//登陆之后返回的url，用于本地存储
    	}
    },
    filters: {
        toList: function(val) {
            return boothClassifyToList(val)
        },
        fomartPhone: function(val){
            if(!val)return;
            return `tel:${val}`;
        },
        fomartEmail: function(val){
            if(!val)return;
            return `mailto:${val}`;
        }
    },
    components: {
        smallFrom
    },
    mounted(){
        this.getChildrenProject()
    },
    methods: {
        hideMaskShadow: function(){
    		//隐藏遮罩层
    		this.yuyueShowFlag = false;
    		this.zixunShowFlag = false;
        },
        showYuyue: function(){ 
        	let _this = this;
        	_this.$layer.loading()
        	commonAjaxFun({
        	    url: '/userApi/userInfo',
        	    data: {
        	        projectId: _this.projectId,
        	        userTk: mainUserTk,
        	        userId: ''
        	    }
        	}, 200).then((data) => {
        	    _this.$layer.close();

        	    let _data = data.data;
        	    if(data.state == '10001'){
        	        //首先判断是否登录
        	        localStorage.setItem(_this.returnUrl, _this.toFullPath);//本地存储backurl

        	        _this.$router.push({path : '/login/index', query: {projectId: _this.projectId, passKey: _this.passKey}});//'请先登录！'

        	    } else {
        	        // console.log(data)
        	        if(_data.name == '' || _data.companyInfo.company == '' || _data.companyInfo.roleType == ''){
        	            // _this.showUploadMess();//个人信息不完整
        	            _this.setSmallFromFlag(true)
        	            _this.$refs.smallFrom.setFormValue({name: _data.name,company: _data.companyInfo.company,Role:_data.companyInfo.roleType})

        	        } else {
        	            //显示预约
        	            if(this.timeFlag){
        	            	//活动已结束
        	            	this.$layer.toast({content: this.$t('layerTips.EventOver')});//活动已结束
        	            	return;
        	            }
        	            this.yuyueShowFlag = !this.yuyueShowFlag;
        	        }
        	    }
        	})


        },
        setSmallFromFlag:function(flag){
            this.smallFromFlag = flag
        },
        showZixun: function(){
    		//显示咨询
    		var _this = this
    		commonAjaxFun({
    			url: '/boothApi/saveConsultLog ',
    			data: {
    				boothId: _this.boothData.id,
    				projectId: _this.projectId,
    				userId : "",
    			}
    		}).then((data) => {
    			if(data.state != '0') {
    				console.log(data.message)
    			}
    		})
    		this.zixunShowFlag = !this.zixunShowFlag;
        },
        submitYuyue: function(){
        	//预约提交
			let _this = this;
			commonAjaxFun({
				url: '/userApi/watch',
				data: {
					id: _this.boothData.id,
					projectId: _this.projectId,
					userTk: mainUserTk,
					type: 'booth_sub',
					subscribeDate: _this.yuyueTime,
					subscribePart: _this.timeAmPm
				}
			}).then((data) => {
				if(!!data.data){
					//您的预约信息已提交，请耐心等待展商与您联系
					_this.$layer.toast({content: _this.$t('CommonUse.RequestSubmit')});//您的预约信息已提交，请耐心等待展商与您联系
					_this.hideMaskShadow()
				} else {
					_this.$layer.toast({content: data.message})
				}
			})
        },
        changeAmPm: function(event, time){
    		$(event.currentTarget).siblings().find('i').addClass('icon-radio').removeClass('icon-radioed icon_color');
    		$(event.currentTarget).find('i').addClass('icon-radioed icon_color')
    		this.timeAmPm = time;
        },
        getYuYueTimeList: function(begin, end){
			let ab = begin.split("-");
			let ae = end.split("-");
			let db = new Date();
			db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
			let de = new Date();
			de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
			let unixDb = db.getTime();
			let unixDe = de.getTime();

			let timeArr = []; //时间列表

			for (let k = unixDb; k <= unixDe;) {
				let curTime = formatDate(new Date(parseInt(k)), 'yyyy-MM-dd')
				timeArr.push(curTime);
				k = k + 24 * 60 * 60 * 1000;
			}

			return timeArr;
        },
        determineTimeOver: function(){//判断当前时间是否过期

    		//由本地存储获取开始时间和结束时间
    		let localStorageStartTime = this.Infro.basicInfo.startTime || formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
    		let localStorageEndTime = this.Infro.basicInfo.endTime || formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');

    		localStorageStartTime = localStorageStartTime.replace(new RegExp("-", "gm"), "/")
    		localStorageEndTime = localStorageEndTime.replace(new RegExp("-", "gm"), "/")

    		//当前时间
    		let todayTimeMsec = new Date().getTime(), 
    		todayTimeMsecFormat = formatDate(new Date(todayTimeMsec), 'yyyy-MM-dd');

    		//会议开始时间
    		let startTimeMsec = new Date(localStorageStartTime).getTime(),
    		startTimeMsecFormat = formatDate(new Date(localStorageStartTime), 'yyyy-MM-dd');

    		//会议结束时间
    		let endTimeMsec = new Date(localStorageEndTime).getTime(),
    		endTimeMsecFormat = formatDate(new Date(localStorageEndTime), 'yyyy-MM-dd')

    		if( todayTimeMsec <= startTimeMsec ){
    			//当前时间小于开始时间
    			this.getTimeOptionArr = this.getYuYueTimeList(startTimeMsecFormat, endTimeMsecFormat);
    		} else if (todayTimeMsec > endTimeMsec) {
	            	//当前时间大于结束时间-预约结束
				this.timeFlag = true;

	        } else {
        		//当前时间处在开始和结束之间
        		this.getTimeOptionArr = this.getYuYueTimeList(todayTimeMsecFormat, endTimeMsecFormat);
	        }
	        this.yuyueTime = this.getTimeOptionArr[0];
        },
        getChildrenProject: function(){
            //停用vuex，改用公用ajax请求
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getChildrenProject',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey
                }
            }).then((data) => {
                try{

                    let _data = data.data;

                    if (data.state == '0') {
                        _this.Infro = _data;
                        _this.determineTimeOver();
                    } else {
                        console.log(data.message);
                    }

                } catch(e) {
                    console.log(e)
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../../common/stylus/function.styl"
.bottom-fix
	position: fixed
	left: 0px
	bottom: 0px
	width: 100%
	text-align: center
	font-size: 0px
	background-color:#F3F3F3
	display: flex
	a
		display: inline-block
		flex: 1
		box-sizing: border-box
		&:last-child
			border-left-px(1px, rgba(7, 17, 27, 0.1))
		span
			display: inline-block
			height: 45px
			line-height: 45px
			color: #666666
			vertical-align: top
			font-size: 16px
		i
			display: inline-block
			height: 45px
			line-height: 47px
			color: #f35b00
			font-size: 18px
			vertical-align: top
			margin-right: 8px
h4.bottom-fix-title
	height: 45px
	line-height: 45px
	background-color: #F6F6F6
	text-align: center
	i
		display: inline-block
		height: 45px
		line-height: 47px
		margin-right: 9px
		vertical-align: top
		font-size: 18px
		color: #f35b00
	span
		display: inline-block
		height: 45px
		line-height: 45px
		vertical-align: top
		color: #f35b00
		font-size: 16px	
.module-yuyue, .module-zixun
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
	.bottom-booth-infro
		padding: 10px
		display: flex
		.photo
			flex: 0 0 64px
			box-sizing: border-box
			width: 64px
			height: 64px
			line-height: 64px
			border: 1px solid #e6e6e6
			img
				max-width: 62px
				max-height: 62px
		.text
			flex: 1
			box-sizing: border-box
			padding-left: 10px
			h6
				overflow: hidden
				display: -webkit-box
				-webkit-box-orient: vertical
				-webkit-line-clamp: 1
				line-height: 24px
				height: 24px
			p
				overflow: hidden
				display: -webkit-box
				-webkit-box-orient: vertical
				-webkit-line-clamp: 1
				font-size: 12px
				color: #999999
				height: 20px
				line-height: 20px
	.bottom-booth-place
		a
			text-align: center
			padding: 10px
			display: block
			font-size: 16px
			color: #f35b00
			border-bottom-px(1px, rgba(0, 0, 0, 0.05))
			border-top-px(1px, rgba(0, 0, 0, 0.05))
	.bottom-booth-time
		padding: 20px 10px 10px
		.roughly-time
			display: flex
		.accurate-time
			display: flex
			padding: 10px 0
		label
			flex: 0 0 70px
			width: 70px
			height: 30px
			font-size: 15px
			line-height: 30px
		.select-in
			flex: 1
			select
				box-sizing: border-box
				width: 100%
				height: 30px
				line-height: 30px
				border: 1px solid rgba(0,0,0,.05)
				padding: 0 10px
			.am, .pm
				display: inline-block
				width: 50%
				line-height: 30px
				i
					margin-right: 8px
	.bottom-booth-submit
		background-color: #f35b00
		color: #fff
		font-size: 16px
		text-align: center
		height: 50px
		line-height: 50px
.listCol
	max-height: 276px
	overflow-x: hidden
	overflow-y: scroll
	ul.in-list a.list-handle
		flex: 0 0 50px
		width: 50px
		i
			font-size: 18px
			&.icon-mobile
				font-size: 16px
	
</style>
