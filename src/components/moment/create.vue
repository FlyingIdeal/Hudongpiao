<template>
    <div>
    	<transition :name="animateName">
	    	<div class="create-part" v-show="createPartFlag">
	    		<div class="header">
		    		<div class="loginIcon" @click="goBack"><span :class='$t("CommonUse.SmallFont")' class="loginIcon-text" title="取消">{{$t("RegLogin.Cancel")}}</span></div>
		            <h2 class="headerTitle" title="动态" v-text="$t('RegLogin.Cancel')"></h2>
		            <div class="Occupy" @click="saveTheme" :class="[hascontentFlag ? 'icon-color' : '']" title="发送">{{$t("RegLogin.SendBtn")}}</div>
		        </div>
		        <div class="topSeat botSeat">
		        	<div class="moment-create-text">
		        		<div class="moment-textarea">
		        			<textarea id="textString" v-model="textcontent" title="说点什么吧" :placeholder="$t('Messaging.SaySomething')"></textarea>
		        		</div>
		        		<div class="moment-image">
							<div class="uploadImgBox">
								<div class="uploadImg-in" id="uploadMain" fileRootDomSelect=".uploadBox">
									<div class="upload">
										<div class="upLoadImg" title="上传图片" :style="{backgroundImage: uploadImgUrl}"></div>
										<a v-show="hasImgFlag" @click="deleteImg" href="javascript:void(0);" class="delete-img" title="删除图片"><i class="icon-clear"></i></a>
										<input type="hidden" urls value="">
									</div>
								</div>
							</div>
		        		</div>
		        		<div class="moment-here" @click="showIamData"><i class="icon-riqi"></i><span v-text="iamHere"></span><i class="icon-rightarrow"></i></div>
		        	</div>
		        </div>
	    	</div>
	    </transition>
	    <transition :name="animateName">
	    	<div class="data-part" v-show="!createPartFlag">
	    		<div class="header">
		    		<div class="head-back-icon" @click="hideIamData"><i class="icon-leftarrow"></i></div>
		            <h2 class="headerTitle" title="我在" v-text="$t('Moment.IamHere')"></h2>
		            <div class="Occupy"></div>
		        </div>
		        <div class="topSeat meetingList" v-if="scheduleList.length > 0">
		        	<div class="hide-here-data shadow" @click="chooseData($event)"><p title="不显示“我在”信息">{{$t("Moment.HideLocation")}}</p><div class="list-handle"><i class="icon-righttag"></i></div></div>
		        	<div class="meetingPlace shadow" v-for="(value, key) in scheduleList">
		        		<h3 class="console-txt-h3"><span>{{value.date | formatDate('yyyy年MM月dd日')}}</span></h3>
		        		<template v-for="(item, index) in value.meetings">
		                    <ul>
		                        <li v-for="gran in item.granules">
		                        	<a href="javascript:void(0);" class="toLink" :id="gran.id" @click="chooseData($event, gran.theme)">
			                            <div class="timer">
			                                <span>{{gran.startTime | formatDate('HH:mm')}}</span>
			                                <span>{{gran.endTime | formatDate('HH:mm')}}</span>
			                            </div>
			                            <div class="meetTxt" v-text="gran.theme"></div>
			                            <div class="list-handle"><i class="icon-righttag"></i></div>
		                        	</a>
		                        </li>
		                    </ul>
	                    </template>
		        	</div>
		        </div>
	    	</div>
	    </transition>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';//操作表，从屏幕下方移入。
import {mainUserTk, commonAjaxFun, CountChineseCharacters, autoAddEllipsis, formatDate} from '../../common/js/common.js'
export default {
    data() {
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            limit: 300,
            textcontent: '', //输入文本框文字
            animateName: 'right', //默认我在日程part显示
            createPartFlag: true,  //默认展位part显示
            iamHere: this.$t('Moment.IamHere'),
            hasSchedle: false, //是否有日程，从而显示隐藏@我在
            uploadImg: '', //图片地址
            uploadImgUrl: 'url(' + require('@/common/images/imgupload.png') + ')',
            hasImgFlag: false,  //上传了图片
            uploadServelUrl: 'https://static.expoplus.com.cn/fileupload', //读取文件
            scheduleId: '',//选择日程的id
            scheduleList: [] //日程列表
        }
    },
    mounted() {
        this.initTextEvent();
        this.getSchduleList();
        this.initUpload();
    },
    filters: {
        formatDate(time, format){
            let data = new Date(time.replace(new RegExp("-","gm"),"/"));
            return formatDate(data, format)
        }
    },
    computed: {
        hascontentFlag: function(){
            if(!this.textcontent && !this.uploadImg){
            	return false
            } else {
            	return true
            }
        }
    },
    methods: {
        toJSON: function(val){
            //仅供安卓手机调试bug使用，勿删除            
        },
        goBack: function(){//返回上一页
            this.$router.go(-1)
        },
        saveTheme: function(){
            //发送话题
            let _this = this;

            if(!_this.hascontentFlag){
                _this.$layer.toast({content: _this.$t('Moment.NoEmpty')});//内容或图片不能为空！
                return;
            }

            _this.$layer.loading(_this.$t('layerTips.Proceeding'));//正在提交，请稍候！


            commonAjaxFun({
                url: '/interactCircle/saveTheme',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    scheduleId: _this.scheduleId,
                    content: _this.textcontent,
                    img: _this.uploadImg
                }
            },500).then((data) => {
                
                _this.$layer.close();
                let _state = data.state;
                let _data = data.data;

                try {

                    if(_state == '10006') {
                        _this.$layer.toast({content: _this.$t('layerTips.HaveRest')});//操作频繁！
                    } else if(_state == '10008'){
                        _this.$layer.toast({content: data.message})
                    } else if(_state == '10009') {
                        _this.$layer.toast({content: _this.$t('layerTips.CannotViolation')});//您被举报违规，已禁止发言
                    } else if (_state == '0') {
                        //成功
                        _this.$layer.toast({content: _this.$t('ForumCreate.CreateSuccess'), time: 400});//创建成功

                        setTimeout(() => {
                            _this.$router.go(-1)
                        }, 500)
                        
                    } else {
                        console.log(data.message)
                    }

                } catch(err){
                    console.log(err)
                }
            })
        },
        deleteImg: function(){
            //删除图片
            let _this = this;
            MessageBox.confirm(_this.$t('Moment.DeletePic')).then(action => {//要删除这张照片吗？
                _this.uploadImgUrl = 'url(' + require('@/common/images/imgupload.png') + ')';
                _this.hasImgFlag = false;
                _this.uploadImg = '';
            })
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
                        _this.hasImgFlag = true;
                    }
                })
            })
        },
        showIamData: function(){
            //显示公司详情
            this.createPartFlag = !this.createPartFlag;
            this.animateName = 'right';
        },
        hideIamData: function(){
            //显示公司详情
            this.createPartFlag = !this.createPartFlag;
            this.animateName = 'left';
        },
        chooseData: function(event, text){//选择日程
            let _dom = $(event.currentTarget);
            let id = _dom.attr('id');

            $('.meetingList').find('i').hide();
            _dom.find('i').show();

            this.iamHere = !!text ? text : _this.$t('Moment.IamHere');//我在
            this.scheduleId = !!id ? id : '';

            this.createPartFlag = !this.createPartFlag;
            this.animateName = 'left';
        },
        getSchduleList: function(){//获取日期列表-》我在
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getSchduleList',
                data: {
                    projectId: _this.projectId,
                    type: 'appScheduleModule'
                }
            }).then((data) => {
                let _state = data.state;
                let _data = data.data;
                try {
                    if(_state == '10001'){
                        _this.hasSchedle = false;//无日程
                    } else if( _state == '0' ){
                        _this.hasSchedle = true;
                        _this.scheduleList = _data;
                    } else {
                        console.log(data.message)
                    }
                    console.log(_this.scheduleList)
                } catch(err){
                    console.log(err)
                }
            })
        },
        initTextEvent: function(){ //初始化输入框事件
            let _this = this;
            $('#textString').bind('keyup keypress keydown input propertychange', function(e){
                let keyCode = e.keyCode || e.which || e.charCode;
                let ctrlKey = e.ctrlKey || e.metaKey;
                let _inthis = $(this);
                let content = _inthis.val();
                let max = _this.limit;
                let counter = CountChineseCharacters(content)

                if (ctrlKey || (keyCode == 8)) {
                    return true;
                } else if (CountChineseCharacters(window.getSelection().toString()) == (parseInt(max))) {
                    return true;
                } else if ((parseInt(max) - counter) <= 0) {
                    _inthis.val(autoAddEllipsis(content, parseInt(max)));
                }
            })
        }
    }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/function.styl"
.moment-create-text
	background-color: #fff
	padding: 10px 0 0px 10px
	.moment-textarea
		padding-right: 10px
		textarea
			width: 100%
			height: 90px
			line-height: 24px
			font-size: 14px
			color: #333
			box-sizing: border-box
.moment-here
	border-top-px(1px, rgba(0,0,0,.05))
	height: 40px
	line-height: 40px
	display: flex
	i.icon-riqi
		color: #999
		flex: 0 0 30px
		text-align: left
		height: 40px
		width: 30px
		line-height: 40px
	i.icon-rightarrow
		color: #999
		flex: 0 0 40px
		text-align: center
		height: 40px
		width: 40px
		font-size: 12px
		line-height: 40px
	span
		flex: 1
		font-size: 14px
		height: 40px
		overflow: hidden
		display: -webkit-box
		-webkit-box-orient: vertical
		-webkit-line-clamp: 1
		word-break: break-word
.hide-here-data
	display: flex
	padding: 4px 0
	p
		flex: 1
		box-sizing: border-box
		padding: 0 14px
		line-height: 40px
	    color: #576B95
	.list-handle
		height: 40px
		line-height: 40px
		i
			font-size: 16px
			color: #f35b00
			display: none
.moment-image
	padding: 10px 0
	.upload
		position: relative
		width: 100px
		height: 100px
	.upLoadImg
		position: relative
		width: 100px
		height: 100px
		border-radius: 2px
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

.meetingList .meetingPlace li
	&:last-child
		border-bottom-px(1px, rgba(0,0,0,.05))
	.list-handle
		height: 40px
		line-height: 40px
		i
			display: none

.create-part,.data-part
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

</style>
