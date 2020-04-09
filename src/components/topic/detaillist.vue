<template>
    <div class="main-comment-detail shadow">
        <template v-for="(value, key) in tochildlist">
            <div class="main-comment-list">
                <router-link class="link" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.userId}}">
                    <div class="photo"><img v-if="value.userImg" v-lazy="value.userImg" /><img v-else src="~@/common/images/default.png" /></div>
                </router-link>
                <div class="text">
                    <h4 class="name" v-text="value.userName"></h4>
                    <h6 class="content" v-text="value.content" :themeId= 'value.contentId' :handleType="value.creater == 1 ? 'delete' : 'complaint'" @click="topicHandle($event)"></h6>
                    <p class="time" v-text="value.showTime"></p>
                </div>
            </div>
        </template>
        <!--删除、投诉底部-->
        <v-actionsheet :class="sheetType" :actions="sheetAction" v-model="sheetVisible"></v-actionsheet>
        <!--投诉-->
        <v-complain ref="complain"></v-complain>
    </div>
</template>

<script>

import { Actionsheet, MessageBox } from 'mint-ui';//操作表，从屏幕下方移入。
import { deleteContent, deleteTopicTheme } from '../../common/js/common.js'
import complain from '../module/complain/complain.vue'//投诉

export default {
    props:{
        tochildlist: Array
    },
    components: {
        vActionsheet: Actionsheet,
        vComplain: complain
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            sheetComplain: [
                {
                    'name' : this.$t("RegLogin.Flag"),//投诉
                    'method': this.complain
                }
            ],
            sheetDelete: [
                {
                    'name' : this.$t("RegLogin.Delete"),//删除
                    'method': this.deleteTopic
                }
            ],
            sheetAction: [],
            moduleType: `${this.$route.query.moduleType}`,//默认投诉评论列表
            sheetType: '',//根据当前类型，去选择class
            sheetVisible: false,//控制底部的显示隐藏
            deleteType:'',//删除类型，从而判断是删除主题还是删除评论
            deleteThemeid: ''//要删除的themeid
        }
    },
    methods: {
        fromParentHandle: function(type, moduleId, moduleType, deleteType){
            //来自上一级的处理，根据type类型，去显示删除或是投诉，上一级为dropload, 然后再向父级topic/detail
            //type->delete/complain, moduleId ->投诉的id，moduleType->投诉类型

            this.deleteType = deleteType;

            if(type == 'delete') {
                //删除
                this.sheetVisible = true;
                this.sheetAction = this.sheetDelete;
                this.sheetType = 'sheet-delete';
                this.deleteThemeid = moduleId;
                this.moduleType = 'topic';

            } else if(type == 'complaint') {
                //投诉
                this.sheetVisible = true;
                this.sheetAction = this.sheetComplain;
                this.sheetType = 'sheet-complain';
                this.deleteThemeid = moduleId;
                this.moduleType = moduleType;

            } else {
                this.sheetVisible = false;
                this.moduleType = 'topic';
                this.deleteThemeid = '';
            }
        },
        complain: function(){
            //调用子组件里的显示右侧投诉
            this.$refs.complain.handleComplain(this.$route.query.childId, this.deleteThemeid, this.moduleType);
        },
        deleteTopic: function(){
            //删除话题
            let _this = this;

            MessageBox.confirm(_this.$t('layerTips.DeleteTips')).then(action => {//确定删除

                _this.$layer.loading(_this.$t('layerTips.Deleting'));//正在删除，请稍后！

                if(_this.deleteType == 'deleteTheme') {
                    //删除主题
                    _this._deleteTheme();
                } else {
                    //删除评论
                    _this._deleteContent();
                }
                
            });
        },
        _deleteContent: function(){
            //删除评论内容
            let _this = this;
            deleteContent(_this.projectId, _this.deleteThemeid).then((data) => {
                    
                _this.$layer.close();

                if(data.state == '0'){
                    //删除成功

                    _this.$layer.toast({content: _this.$t('layerTips.DeleteSuccess')});//删除成功

                    //删除themeid的数据
                    for(let i = 0; i < _this.tochildlist.length; i++) {
                        if(_this.tochildlist[i].contentId == _this.deleteThemeid){
                            _this.tochildlist.splice(i, 1);
                            break;
                        }
                    }

                    //删除成功之后，由评论列表返回到话题详情页面
                    _this.$emit('fromChildHandle');

                } else if (data.state == '10002'){
                    _this.$layer.toast({content: _this.$t('layerTips.NoPremiss')});//无权限删除！
                } else if (data.state == '10010'){
                    _this.$layer.toast({content: _this.$t('layerTips.ContentRemoved')});//此信息已被处理！
                } else if (data.state == '10011'){
                    _this.$layer.toast({content: _this.$t('layerTips.ContentRemovedPoster')});//此内容已被用户删除！
                } else {
                    _this.$layer.toast({content: (data.message + data.state)});
                }
            })
        },
        _deleteTheme: function(){
            //删除主题
            
            let _this = this;

            deleteTopicTheme(_this.projectId, _this.deleteThemeid).then((data) => {
                    
                _this.$layer.close();

                if(data.state == '0'){

                    _this.$layer.toast({content: _this.$t('layerTips.DeleteSuccess')});//删除成功

                    setTimeout(() => {
                        _this.$router.go(-1)
                    }, 500)

                } else if (data.state == '10002'){
                    _this.$layer.toast({content: _this.$t('layerTips.NoPremiss')});//无权限删除！
                } else if (data.state == '10010'){
                    _this.$layer.toast({content: _this.$t('layerTips.ContentRemoved')});//此信息已被处理！
                } else if (data.state == '10011'){
                    _this.$layer.toast({content: _this.$t('layerTips.ContentRemovedPoster')});//此内容已被用户删除！
                } else {
                    _this.$layer.toast({content: (data.message + data.state)});
                }
            })

        },
        topicHandle: function(event){
            //话题操作，去判断删除还是投诉
            
            //首先判断是否登录
            if(!this.loginState){

                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
                return false;
            }
            
            let _dom = $(event.currentTarget);
            let _type = _dom.attr('handleType');
            let _id = _dom.attr('themeId');

            this.deleteType = '';

            if(_type == 'complaint'){
                this.sheetVisible = true;
                this.sheetAction = this.sheetComplain;
                this.sheetType = 'sheet-complain';
                this.deleteThemeid = _id;
                this.moduleType = 'topic'
            } else if(_type == 'delete'){
                this.sheetVisible = true;
                this.sheetAction = this.sheetDelete;
                this.sheetType = 'sheet-delete';
                this.deleteThemeid = _id;
            } else {
                this.sheetVisible = false;
                this.deleteThemeid = '';
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
