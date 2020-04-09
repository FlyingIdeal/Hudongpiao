<template>
	<div>
        <div class="company-title shadow">
            <div class="company-title-inner">
                <div class="company-title-photo"><img @click="wxScaleBigImg(boothData.comLogo)" v-if="boothData.comLogo" v-lazy="boothData.comLogo" /><img v-else src="~@/common/images/boothPhoto.png" /></div>
                <h3 v-text="boothData.comShortName"></h3>
                <p title="所属行业">{{$t("ExhibitorDetail.Industry")}}：{{boothData.comIndustry}}</p>
            </div>
        </div>
        <div class="company-baisc shadow" v-if="boothData.comWebsite || boothData.comCity">
            <h3 class="console-txt-h3" title="基本信息">{{$t("CommonHTag.Information")}}</h3>
            <p v-if="boothData.comWebsite"><i class="icon-earth"></i><span v-text="boothData.comWebsite"></span></p>
            <p v-if="boothData.comCity || boothData.companyName"><i class="icon-place"></i><span>{{boothData.comCity}} {{boothData.comProvince}} {{boothData.comCounty}} {{boothData.companyName}}</span></p>
        </div>
        <div class="company-detail shadow" v-if="boothData && boothData.comIntro">
            <h3 class="console-txt-h3" title="简介">{{$t("HomePage.Introduction")}}</h3>
            <v-Brief v-if="boothData" :content="boothData.comIntro"></v-Brief>
        </div>
        <div class="company-comment">
            <div class="leave-message shadow" v-if="contentObj">
                <h3 class="console-txt-h3"><span title="留言">{{$t('Messaging.Title')}}</span><i class="icon-topic" @click="reply($event)"></i></h3>
                <div class="mine-nolist-tips" v-if="contentObj.list.length == 0">
                    <i class="icon-emptybowl"></i>
                    <p title="快来说说您的看法吧">{{$t('Messaging.LeaveTips')}}</p>
                    <router-link title="发言" :to="{path:'/speak/index', query:{projectId: projectId, passKey: passKey, detailId: moduleId, title: $t('Messaging.Title'), moduleType: 'company'}}" class="create-btn">{{$t('Messaging.PostBtn')}}</router-link>
                </div>
                <div class="listCol" v-if="contentObj.list.length > 0">
                    <div class="main-comment-detail">
                        <template v-for="(value, key) in contentObj.list">
                            <div class="main-comment-list" v-if="key < 4" :akey="key">
                                <router-link class="link" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.userId}}">
                                    <div class="photo"><img v-if="value.userImg" v-lazy="value.userImg" /><img v-else src="~@/common/images/default.png" /></div>
                                </router-link>
                                <div class="text">
                                    <h4 class="name" v-text="value.userName"></h4>
                                    <h6 class="content" v-text="value.content" :themeId= 'value.contentId' :handleType="value.creater == 1 ? 'delete' : 'complaint'" @click="topicHandle(value)"></h6>
                                    <p class="time" v-text="value.showTime"></p>
                                </div>
                            </div>
                        </template>
                    </div>
                    <router-link :to="{path:'/speak/index', query:{projectId: projectId, passKey: passKey, detailId: moduleId, title: $t('Messaging.Title'), moduleType: 'company'}}" class="view-more" v-if="contentObj.totalNum - 4 > 0">
                        <span title="查看更多">{{$t("CommonUse.More")}}</span>
                        <em>({{contentObj.totalNum - 4}})</em>
                        <i class="icon-botarrow"></i>
                    </router-link>
                </div>
            </div>
        </div>
	</div>
</template>
<script>
import { Actionsheet, MessageBox } from 'mint-ui';//
import vBrief from '../brief/brief.vue'
import { mainUserTk, boothClassifyToList, wxScaleBigImg, commonAjaxFun} from '../../../common/js/common.js'

export default {
    props: {
    	boothData: Object,
    	contactList: Array
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            moduleId: `${this.boothData.comId}`,//模块id
            contentObj:'',//公司评论
            moduleType: 'company'
        }
    },
    mounted(){
        this.getCompanyContentList();
    },
    components: {
        vBrief
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
    methods: {
        wxScaleBigImg: function(value){
            //微信端图片放大预览
            wxScaleBigImg(value)
        },
        topicHandle: function(value){
            //话题操作，去判断删除还是投诉
            this.$emit('topicHandle', value, this.moduleType);
        },
        reply: function(event){
            //回复
            this.$emit('reply', event, this.moduleType, this.moduleId);
        },
        getCompanyContentList: function(){
            //获取展位里的公司评论
            let _this = this;
            commonAjaxFun({
                url: '/interactTopic/getContentList',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    moduleType: _this.moduleType,
                    moduleId: _this.moduleId,
                    queryTime:''
                }
            }).then((data) => {
                try{
                    let _data = data.data;
                    if(data.state == '0'){
                        _this.contentObj = _data;
                    } else {
                        console.log(data.message)
                    }
                }catch(err){
                    console.log(err)
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../../common/stylus/function.styl"
.company-title
    padding: 60px 15px 0
    background-color: #ECECEC
    background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0.00) 0%, #FFFFFF 64%)
    .company-title-inner
        background-color: #FFF
        font-size: 12px
        color: #999
        border: 1px solid rgba(0,0,0,.1)
        padding: 50px 10px 10px
        border-radius: 4px 4px 0 0
        border-bottom: none
        position: relative
        text-align: center
        h3
            font-size: 16px
            padding: 6px 0
            color: #333
        .company-title-photo
            width: 80px
            height: 80px
            font-size: 0px
            line-height: 80px
            border-radius: 2.4px
            box-shadow: 0 1.5px 1.5px 0 rgba(0, 0, 0, 0.16)
            background-color: #fff
            position: absolute
            left: 50%
            top: -40px
            margin-left: -40px
            img
                vertical-align: middle
                max-width: 80px
                max-height: 80px
h3.console-txt-h3
    font-size: 13px
.company-baisc
    padding-bottom: 20px
    p
        display: flex
        word-break: break-word
        i
            flex: 0 0 40px
            width: 40px
            height: 40px
            line-height: 40px
            text-align: center
            color: #999
            font-size: 18px
        span
            flex: 1
            padding: 8px 10px
            box-sizing: border-box
            font-size: 14px
            line-height: 24px
            border-bottom-px(1px, rgba(0,0,0,.1))

</style>
