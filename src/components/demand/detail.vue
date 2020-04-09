<template>
    <div>
    	<div class="head-back">
            <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')" v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
            <h2 class="headerTitle" title="需求编辑" v-text="$t('Demand.DetailTitle')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat demand-detail" v-if="needData" :style="{paddingBottom: paddingBottom}">
            <div class="shadow demand-title">
                <h3 class="console-txt-h3"><span v-text="needData.needs.title"></span><i class="icon-botarrow" v-if="needData.needs.creator" @click="topicHandle"></i></h3>
                <div class="demand-supplement">
                    <span class="demand-classify" v-text="needData.needs.categoryName"></span>
                    <span class="demand-part-number"><em title="0参与" v-text="needData.needs.userNum"></em>{{$t("Demand.Responsed")}}</span>
                </div>
                <div class="demand-describe" title="需求描述">{{$t("Demand.reqDescription")}}：{{needData.needs.content}}</div>
            </div>
            <!--参与-->
            <div class="shadow listCol-arraw demand-part" v-if="needData.needs.creator">
                <h3 class="console-txt-h3"><span title="参与">{{$t("Demand.Responsed")}}（{{canyuValue.total}}）</span></h3>
                <div class="listCol" v-if="canyuList.length > 0">
                	<ul class="in-list">
                		<li v-for="value in canyuList">
                            <router-link :to="{path:'/product/detail', query:{projectId: projectId, passKey: passKey, productId: value.productId}}">
                                <div class="infro">
									<div class="photo"><img v-if="value.photo" v-lazy="value.photo" /><img v-else src="~@/common/images/default.png" /></div>
									<div class="text">
				                        <h6 v-text="value.userName"></h6>
				                        <p v-text="value.company"></p>
				                        <p v-text="value.position"></p>
				                    </div>
								</div>
				                <div class="list-handle"><i class="icon-rightarrow"></i></div>
                            </router-link>
                        </li>
                	</ul>
                </div>
                <div class="shadow" v-if="canyuList.length == 0">
                	<div class="noMoreData" title="暂无数据">{{$t("CommonUse.hasNoDate")}}</div>
                </div>
                <div class="view-more" v-if="hasMoreData" @click="getCanyuUser">
                    <span title="查看更多">{{$t("CommonUse.More")}}</span>
                </div>
            </div>
            <!--推荐展商-->
            <div class="shadow listCol-arraw demand-part" v-if="needData.needs.creator && tuijianBooth.length > 0">
                <h3 class="console-txt-h3"><span title="推荐展商">{{$t("Demand.Suggested")}}</span></h3>
                <div class="listCol">
                	<ul class="in-list">
                		<li v-for="value in tuijianBooth">
                            <router-link class="booth-link" :to="{path:'/booth/detail', query:{projectId: projectId, passKey: passKey, boothId: value.boothId}}">
                        		<div class="infro">
				                    <div class="photo"><img v-if="value.boothFigure" v-lazy="value.boothFigure" /><img v-else src="~@/common/images/boothPhoto.png" /></div>
				                    <div class="text">
				                        <h6 v-text="value.boothName"></h6>
				                        <p v-text="value.companyName"></p>
				                        <p v-text="value.boothNum"></p>
				                    </div>
				                </div>
				                <div class="list-handle"><i class="icon-rightarrow"></i></div>
                            </router-link>
                            <!--推荐展商中的推荐展位-->
			                <div class="listColProduct">
			                	<dl>
			                		<dd v-for="key in value.products">
			                			<router-link class="product-link" :to="{path:'/product/detail', query:{projectId: projectId, passKey: passKey, productId: key.product_id}}">
			                				<div class="photo"><img v-if="key.product" v-lazy="key.product" /><img v-else src="~@/common/images/product.png" /></div>
			                				<p v-text='key.name'></p>
			                			</router-link>
			                		</dd>
			                	</dl>
			                </div>
                        </li>
                	</ul>
                </div>
                
            </div>
            <!--联系-->
            <div class="demand-bottom" @click="saveRecord" v-if="contactsFlag">{{$t("Demand.Response")}}</div>
            <!--删除、投诉底部-->
            <v-actionsheet :class="sheetType" :actions="sheetAction" v-model="sheetVisible"></v-actionsheet>
        </div>
    </div>
</template>

<script>

import { Actionsheet, MessageBox } from 'mint-ui';//操作表，从屏幕下方移入。
import {boothClassifyToList, commonAjaxFun, filterCurrentModule, filterDataImg} from '../../common/js/common.js'

export default {
	data(){
		return {
			projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            needId: `${this.$route.query.needId}`,
            wxShare: `${this.$route.query.wxShare}`,//是否来自微信分享，如果是true，则返回首页，否则返回上一级
			canyuList: [],
	        canyuValue: '', //参与value
	        userid: '',//联系的userid
	        page: 1, //参与分页
	        totalPage: 1, //参与总分页
	        hasMoreData: true, //参与查看更多
			needData: '',//需求基础数据
			contactsFlag: false,//是否展位联系人
			paddingBottom: '0px',//是否展位联系人时的padding-bottom
            sheetAction: [
                {
                    'name' : this.$t("RegLogin.Delete"),//删除
                    'method': this.deleteTopic
                },
                {
                    'name' : this.$t("RegLogin.ChangeBtn"),//修改
                    'method': this.revise
                }
            ],
            sheetVisible: false,//控制底部的显示隐藏
            sheetType: 'sheet-delete-revise',//根据当前类型，去选择class
			tuijianBooth: []//推荐展商列表
		}
	},
	components: {
        vActionsheet: Actionsheet
    },
	mounted(){
		this.getNeeds()
	},
	methods: {
		routerBack: function(){
			if(this.wxShare == 'true'){
                this.$router.push({path : '/home/index', query: {projectId: this.projectId, passKey: this.passKey}});//主页
			} else {
				this.$router.go(-1);
			}
        },
        topicHandle: function(){
        	//删除  or  修改
        	this.sheetVisible = true;
        },
        revise: function(){
        	//修改
        	this.$router.push({path : '/demand/create', query: {needId: this.needId, projectId: this.projectId, passKey: this.passKey}});
        },
        deleteTopic: function(){
        	//删除需求
        	let _this = this;

            MessageBox.confirm(_this.$t('layerTips.DeleteTips')).then(action => {//确定删除

                _this.$layer.loading(_this.$t('layerTips.Deleting'));//正在删除，请稍后！

	            commonAjaxFun({
	                url: '/interact/needs/delete',
	                data: {
	                    needId: _this.needId
	                }
	            }).then((data) => {
	            	
	            	_this.$layer.close();

	            	let _data = data.data;

	            	if(data.state == '0') {
	            		
	            		_this.$layer.toast({content: _this.$t('layerTips.DeleteSuccess'), time: 400});//删除成功

                        setTimeout(() => {
                            _this.$router.go(-1)
                        }, 500)

	            	} else {
	            		console.log(data.message)
	            	}
	            })
            });
        },
		getNeeds: function(){
			//获取需求详情
			let _this = this;
            commonAjaxFun({
                url: '/interact/needs/getNeeds',
                data: {
                    needId: _this.needId
                }
            }).then((data) => {
            	let _data = data.data;

            	if(data.state == '0') {
            		_this.needData = _data;
            		_this.userid = _data.needs.userId;
            		_this.tuijianBooth = _data.boothInfo || [];

            		_this.contactsFlag = _data.contacts == 'false' ? false : true;
	                _this.paddingBottom = _data.contacts == 'false' ? '0px' : '50px';

            		//如果自己为创建者
            		if(!!_data.needs.creator) {

            			_this.contactsFlag = false;
	                    _this.paddingBottom = '0px';


            			_this.getCanyuUser();//交谈过的人
            		}

            	} else {
            		console.log(data.message)
            	}
            })
		},
		getCanyuUser: function(){
			//获取需求参与
			let _this = this;

            _this.$layer.loading();

            let _page = _this.page;

            if (_page > _this.totalPage) {
                return;
            }

            commonAjaxFun({
                url: '/interact/needs/getUsers',
                data: {
                    needId: _this.needId,
                    page: _this.page
                }
            }).then((data) => {

            	_this.$layer.close();

            	let _data = data.data;
            	
            	if(data.state == '0') {
            		
            		_this.canyuValue = _data;
            		_this.totalPage = _data.totalPage;
            		_this.canyuList = _this.canyuList.concat(_data.rows);

            		if (_data.totalPage <= _this.page) {
                        _this.hasMoreData = false;
                    }

                    _this.page++;

            	} else {
            		console.log(data.message)
            	}
            })
		},
		saveRecord: function(){
			//联系一下
			let _this = this;

            commonAjaxFun({
                url: '/interact/needs/saveRecord',
                data: {
                    needId: _this.needId
                }
            }).then((data) => {

            	let _data = data.data;

            	if(data.state == '0') {
                    _this.$router.push({path : '/chat/index', query: {userid: _this.userid, projectId: _this.projectId, passKey: _this.passKey}});

            	} else {
            		console.log(data.message)
            	}
            })
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

@import "../../common/stylus/function.styl"

.demand-title
	padding: 10px
	h3.console-txt-h3
		padding: 10px 0
		line-height: 24px
		&:after
			border-bottom: 0px
		span
			font-size: 15px
		i
			height: 24px
			width: 24px
			flex: 0 0 24px
			color: rgba(204,204,204,0.5)
			text-align: center
	.demand-supplement
		margin: 10px 0
		display: flex
		line-height: 20px
		span.demand-classify
			flex: 1
			color: #999999
			font-size: 12px
		span.demand-part-number
			flex: 0 0 76px
			width: 76px
			font-size: 12px
			text-align: right
			color: #999999
			em
				font-style: normal
				color: #F35B00
				margin-right: 4px
	.demand-describe
		padding: 10px 0
		font-size: 14px
		border-top-px(1px, rgba(7, 17, 27, 0.1))
.demand-part
	h3.console-txt-h3
		font-size: 13px
		background: #fafafa	
.demand-bottom
	position: fixed
	left: 0px
	bottom: 0px
	width: 100%
	line-height: 50px
	height: 50px
	color: #fff
	text-align: center
	background-color: #f35b00
	font-size: 18px
.listCol ul.in-list 
	li
		display: block
		a.booth-link
			width: 100%
			padding-bottom: 14px
			border-bottom: 1px solid rgba(0,0,0,0.05)
.listColProduct
	padding: 14px 10px 14px 0
	display: block
	dl
		font-size: 0px
		dd
			display: inline-block
			width: 33.333333%
			text-align: center
			a.product-link
				flex: initial
				display: block
			.photo
				height: 90px
				line-height: 90px
				overflow: hidden
				img
					width: 90px
					vertical-align: middle
			p
				margin-top: 4px
				font-size: 16px
				height: 20px
				line-height: 20px
				overflow: hidden
				display: -webkit-box
				-webkit-box-orient: vertical
				-webkit-line-clamp: 1
</style>
