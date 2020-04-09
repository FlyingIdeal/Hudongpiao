<template>
    <div>
    	<div class="head-back">
            <div class="head-back-icon" @click="routerBack"><i class="icon-leftarrow"></i></div>
            <h2 class="headerTitle" title="需求编辑" v-text="$t('Demand.editDemand')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat">
        	<div class="create-form">
        		<div class="field-main">
	        		<h4 class="field-title"><span title="需求编辑">{{$t("Demand.caption")}}</span><em class="red-star">*</em></h4>
	        		<div class="field-box">
	        			<template v-if="needId && demandObj && demandObj.needs">
	        				<div class="field-input"><input class="text-input" type="text" name="caption" :value="demandObj.needs.title"></div>
	        			</template>
	        			<template v-else>
	        				<div class="field-input"><input class="text-input" type="text" name="caption"></div>
        				</template>
	        			<div class="field-handle"><i class="icon-clear"></i></div>
	        		</div>
	        		<p class="field-error"><span title="请输入标题" v-show="captionFlag">{{$t("Demand.enterTitle")}}</span></p>
	        	</div>
	        	<div class="field-main">
	        		<h4 class="field-title"><span title="分类">{{$t("Demand.classify")}}</span><em class="red-star">*</em></h4>
	        		<div class="field-box">
	        			<div class="field-input" @click="showClassify"><input disabled type="text" name="classify" v-model="classifyname"></div>
	        		</div>
	        		<p class="field-error"><span title="请选择分类" v-show="classifyFlag">{{$t("Demand.enterClassIf")}}</span></p>
	        	</div>
	        	<div class="field-main">
	        		<h4 class="field-title"><span title="需求">{{$t("Demand.Title")}}</span><em class="red-star">*</em></h4>
	        		<div class="field-box">
	        			<template v-if="needId && demandObj && demandObj.needs">
	        				<div class="field-input"><textarea name="content" :value="demandObj.needs.content"></textarea></div>
	        			</template>
	        			<template v-else>
	        				<div class="field-input"><textarea name="content"></textarea></div>
	        			</template>
	        		</div>
	        		<p class="field-error"><span title="请输入需求" v-show="contentFlag">{{$t("Demand.enterDemand")}}</span></p>
	        	</div>
        		<div class="ready-submit" title="发布" @click="submitForm">{{$t("Demand.issue")}}</div>
        	</div>
        	<!--分类筛选-->
            <transition name="move">
                <div class="classifyBar" v-show="showClassFlag">
                    <v-classify ref="classify" :clickSingle="'true'" :type="'boothclassify'" :interestId="choiceListId" v-on:getClassify="_getClassify" v-on:getClassifyName="_getClassifyName"></v-classify>
                    <div class="classifyButtom">
	                    <a href="javascript:void(0);" @click="reset" class="reset">重置</a>
	                    <a href="javascript:void(0);" @click="submit" class="submit">确定</a>
	                </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import {commonAjaxFun} from '../../common/js/common.js'
import vClassify from '../module/classify/classify.vue'
export default {
	data(){
		return {
			projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
			captionFlag: false,//是否填标题
			classifyFlag: false,//是否有分类
			contentFlag: false,//是否有内容
			needId: `${this.$route.query.needId}`,
			classifyname:'',//分类名字
            showClassFlag: false,//分类的显示隐藏
			demandObj : '',//请求话题返回对象
			choiceListId: []
		}
	},
	components: {
        vClassify
    },
	mounted(){
		this.initInputEvent();

		if(this.needId != 'undefined') {
			this.getNeedsDetail();//修改情况下获取详情
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
		showClassify: function(){
            //调用子组件里的显示右侧分类
            this.showClassFlag = !this.showClassFlag;
        },
		initInputEvent(){
			//初始化输入框事件
			let _this = this;

			$('input.text-input').bind('focus', function(e){
				let _inthis = this;
				$(_inthis).parent().next().find('i').show()
			}).bind('focusout', function(e){
				let _inthis = this;
				$(_inthis).parent().next().find('i').hide()
			})

			$('.field-handle').delegate('i','touchend', function(){
				let _inthis = this;
				$(_inthis).hide().parent().prev().find('input').val('')
			})
		},
		getNeedsDetail: function(){
			//获取需求详情
			let _this = this;

			commonAjaxFun({
                url: '/interact/needs/getNeeds',
                data: {
                    needId: _this.needId
                }
            }).then((data) => {

            	//console.log(data)
                try {
                    let _data = data.data;
                    if(data.state == '0'){
                        //成功
                        _this.demandObj = _data;

                        //个人分类格式转化
                        _this.choiceListId = _data.needs.categoryId.split(',');
                        this.classifyname = _data.needs.categoryName;

                    } else {
                        console.log(data.message)
                    }
                } catch(err){
                    console.log(err)
                }
            })
		},
		submit: function(){
            //分类确定按钮
            this.$refs.classify.submit();
        },
        reset: function(){
            //分类重置按钮
            this.$refs.classify.reset();
        },
		_getClassify: function(val){
            //获取分类模块中的id
            if(val.length == 0) {
        		return;
        	}

            let cateArr = [];

            for (let i = 0; i < val.length; i++) {
                cateArr.push(val[i])
            }

            this.choiceListId = cateArr;
            this.showClassify();
        },
        _getClassifyName: function(nameArr){
        	
        	if(nameArr.length == 0) {
        		return;
        	}

        	this.classifyname = nameArr.join('，');

        },
		submitForm: function(){
			//发布
			let _this = this;
			let caption = $.trim($('[name=caption]').val());
			let content = $.trim($('[name=content]').val());
			let allcheck = true;

			_this.choiceListId = !!_this.choiceListId ? _this.choiceListId : '';

			if(!caption) {
				allcheck = false;
				_this.captionFlag = true;
			} else {
				_this.captionFlag = false;
			}

			if(!_this.choiceListId) {
				allcheck = false;
				_this.classifyFlag = true;
			} else {
				_this.classifyFlag = false;
			}

			if(!content) {
				allcheck = false;
				_this.contentFlag = true;
			} else {
				_this.contentFlag = false;
			}

			if(_this.needId == 'undefined'){
				_this.needId = '';
			}

			if(allcheck){
				//提交

				_this.$layer.loading(_this.$t('layerTips.Proceeding'));//正在提交，请稍候！

				commonAjaxFun({
	                url: '/interact/needs/saveNeeds',
	                data: {
	                    projectId: _this.projectId,
	                    needId: _this.needId,
	                    title: caption,
	                    content: content,
	                    cateId: _this.choiceListId
	                }
	            }).then((data) => {

	            	_this.$layer.close();

	                try {
	                    let _data = data.data;
	                    if(data.state == '0'){
	                        //成功
	                        _this.$layer.toast({content: _this.$t('ForumCreate.CreateSuccess'), time: 400});//成功

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
			}
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
