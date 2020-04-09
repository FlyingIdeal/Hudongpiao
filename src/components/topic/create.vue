<template>
    <div>
    	<div class="head-back">
            <div class="head-back-icon" @click="routerBack"><i class="icon-leftarrow"></i></div>
            <h2 class="headerTitle" v-text="headerTitle"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat">
        	<div class="create-form">
        		<div class="field-main">
	        		<h4 class="field-title"><span title="话题名称">{{$t("ForumCreate.Topic")}}</span><em class="red-star">*</em></h4>
	        		<div class="field-box">
	        			<div class="field-input">
	        				<template v-if="themeId && themeObj">
	        					<input class="text-input" type="text" name="caption" :value="themeObj.title" disabled>
	        				</template>
	        				<template v-else>
	        					<input class="text-input" type="text" name="caption">
	        				</template>
	        			</div>
	        			<div class="field-handle"><i class="icon-clear"></i></div>
	        		</div>
	        		<p class="field-error"><span v-show="captionFlag" title="话题不能为空">{{$t("Forum.SubjectEmpty")}}</span></p>
	        	</div>
	        	<div class="field-main">
	        		<h4 class="field-title"><span title="话题简介">{{$t("ForumCreate.Description")}}</span></h4>
	        		<div class="field-box">
	        			<div class="field-input">
	        				<template v-if="themeId && themeObj">
	        					<textarea name="content" :value="themeObj.content"></textarea>
	        				</template>
	        				<template v-else>
								<textarea name="content"></textarea>
	        				</template>
	        			</div>
	        		</div>
	        		<p class="field-error"></p>
	        	</div>
        		<div class="ready-submit" @click="submit" title="提交">{{$t("QuestionPage.Submit")}}</div>
        	</div>
        </div>
    </div>
</template>

<script>
import {commonAjaxFun, mainUserTk} from '../../common/js/common.js'
export default {
	data(){
		return {
			projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
			headerTitle: this.$t("ForumCreate.Title"),//发起话题
			captionFlag: false,//是否填标题
			themeId: `${this.$route.query.themeId}`,
			themeObj : ''//请求话题返回对象
		}
	},
	mounted(){

		if(this.themeId != 'undefined') {
			this.getTheme();
			this.headerTitle = this.$t("ForumCreate.EditForum");//编辑话题
		}

		window.document.body.style.backgroundColor = '#fff';
	},
    destroyed(){
        window.document.body.style.backgroundColor = '#e6e6e6';
    },
	methods: {
		routerBack: function(){
            this.$router.go(-1);
        },
		submit: function(){
			//发布
			let _this = this;
			let caption = $.trim($('[name=caption]').val());
			let content = $.trim($('[name=content]').val());
			let _type = _this.themeId != 'undefined' ? 'edit' : 'save';//区分是编辑还是创建
			let _themeId = _this.themeId != 'undefined' ? _this.themeId : '';
			let sucessLayer = _this.themeId == 'undefined' ? _this.$t("Forum.CreateComments") : _this.$t("Forum.FurtherComments");//修改话题频繁！/话题创建频繁，请3分钟后创建！
			let errorLayer = _this.themeId == 'undefined' ? _this.$t("Forum.FailureEdit") : _this.$t("Forum.FailureCreate");//修改话题失败！ / 话题创建失败！

			let allcheck = true;

			if(!caption) {
				allcheck = false;
				_this.captionFlag = true;
			} else {
				_this.captionFlag = false;
			}


			if(allcheck){
				//提交

            	_this.$layer.loading(_this.$t('layerTips.Proceeding'));//正在提交，请稍候！

				commonAjaxFun({
	                url: '/interactTopic/saveTheme',
	                data: {
	                    projectId: _this.projectId,
	                    userTk: mainUserTk,
	                    title: caption,
	                    content: content,
	                    type: _type,
	                    themeId: _themeId
	                }
	            }, 600).then((data) => {

	            	_this.$layer.close();

	                try {
	                    let _data = data.data;

	                    if(data.state == '10006') {
	                    	_this.$layer.toast({content: sucessLayer});
	                    	return;
	                    }

	                    if (data.state == '10009') {
            				_this.$layer.loading(_this.$t('layerTips.CannotViolation'));//您被举报违规，已禁止发言
	                    	return;
	                    }

	                    if (data.state == '10008' || data.state == '10007') {
	                    	_this.$layer.toast({content: data.message});
	                    	return;
	                    }

	                    _this.$layer.toast({content: _this.$t('ForumCreate.CreateSuccess'), time: 400});//创建成功

	                    setTimeout(() => {
                            _this.$router.go(-1)
                        }, 600)

	                } catch(err){
	                    console.log(err)
	                }
	            }, (err) => {
	            	_this.$layer.close();
	            	_this.$layer.toast({content: errorLayer});
	            })
			}
		},
		getTheme: function(){
			//获取话题
			let _this = this;
            commonAjaxFun({
                url: '/interactTopic/getTheme',
                data: {
                    projectId: _this.projectId,
                    themeId: _this.themeId,
                    userTk: mainUserTk
                }
            }).then((data) => {
            	if(data.state == '0') {
            		_this.themeObj = data.data.theme;
            	} else {
            		console.log(data.message)
            	}
            })
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
