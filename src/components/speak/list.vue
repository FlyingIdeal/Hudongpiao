<template>
<div class="main-comment-detail">
    <div class="main-comment-list"  v-for="(value, key) in tochildlist">
        <router-link class="link" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.userId}}">
            <div class="photo"><img v-if="value.userImg" v-lazy="value.userImg" /><img v-else src="~@/common/images/default.png" /></div>
        </router-link>
        <div class="text">
            <h4 class="name" v-text="value.userName"></h4>
            <h6 class="content" v-text="value.content" :themeId= 'value.contentId' :handleType="value.creater == 1 ? 'delete' : 'complaint'" @click="topicHandle($event)"></h6>
            <p class="time" v-text="value.showTime"></p>
        </div>
    </div>
    <!--删除、投诉底部-->
    <v-actionsheet :class="sheetType" :actions="sheetAction" v-model="sheetVisible"></v-actionsheet>
    <!--投诉-->
    <v-complain ref="complain"></v-complain>
</div>
</template>

<script>
import vLoad from '../module/loadmore/dropload.vue'
import { mainUserTk ,deleteContent} from '../../common/js/common.js'
import vReply from '../module/reply/reply.vue'
import { Actionsheet, MessageBox } from 'mint-ui';//操作表，从屏幕下方移入。
import complain from '../module/complain/complain.vue'//投诉
export default {
    props:{
        setList: Function,
        tochildlist: Array
    },
    data(){
        return {
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
            sheetType: '',//根据当前类型，去选择class
            sheetVisible: false,//控制底部的显示隐藏
            moduleType: 'schedule',//默认投诉日程的评论列表
            deleteThemeid: '',//要删除的themeid
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`
        }
    },
    components: {
        vReply,
        vLoad,
        vActionsheet: Actionsheet,
        vComplain: complain
    },
    methods: {
        complain: function(){
            //调用子组件里的显示右侧投诉
            this.$refs.complain.handleComplain(this.childId, this.deleteThemeid, this.moduleType);
        },
        deleteTopic: function(){
            //删除话题
            let _this = this;

            MessageBox.confirm(_this.$t('layerTips.DeleteTips')).then(action => {//确定删除

                _this.$layer.loading(_this.$t('layerTips.Deleting'));//正在删除，请稍后！

                deleteContent(_this.projectId, _this.deleteThemeid).then((data) => {
                    _this.$layer.close();

                    if(data.state == '0'){
                        _this.$layer.toast({content: _this.$t('layerTips.DeleteSuccess')});//删除成功
                        _this.setList()
                        // _this.getContentList();//重新获取评论列表

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
            });
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

            if(_type == 'complaint'){
                this.sheetVisible = true;
                this.sheetAction = this.sheetComplain;
                this.sheetType = 'sheet-complain';
                this.deleteThemeid = _id;
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

    },
    mounted(){


    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.speak-btn
    position: fixed
    left: 0px
    bottom: 0px
    width: 100%
    background-color: #fff
    text-align: center
    height: 50px
    line-height: 50px
    box-shadow: 0 -1.5px 1.5px 0 rgba(0,0,0,.16);
    i
        display: inline-block
        vertical-align: top
        height: 50px
        line-height: 50px
        width: 30px
        font-size: 24px
        color:#F35B00
    span
        display: inline-block
        vertical-align: top
        color:#F35B00
</style>
