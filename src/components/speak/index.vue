<template>
    <div>
        <div class="head-back">
            <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')" v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
            <h2 class="headerTitle" v-text="titleText"></h2>
            <div class="Occupy">

            </div>
        </div>
        <div class="topSeat botSeat">
            <div class="listCol-arraw">
                <!-- <v-load ref="child" v-on:childEvent="_childEvent" :params="params" :whichfrom="whichfrom"></v-load> -->

                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad'> 
                  <slot>
                        <list :tochildlist='listArry' :setList = '_replayReresh'></list>
                  </slot>
                </v-load>
                
            </div>
            <div class="speak-btn" @click="reply"><i class="icon-topic2"></i><span title="发言">{{$t("Messaging.Post")}}</span></div>
            <!--评论回复输入框-->
            <v-reply ref="reply" :limit="300" :moduleType="moduleType" :moduleId="moduleId" v-on:replayReresh="_replayReresh"></v-reply>
        </div>
    </div>
</template>

<script>
import vLoad from '../module/loadmore/dropload.vue'
import { mainUserTk, initAllWeiXin ,commonAjaxFun} from '../../common/js/common.js'
import vReply from '../module/reply/reply.vue'
import list from './list.vue'

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            moduleType: `${this.$route.query.moduleType}`,//请求话题的类型
            moduleId: `${this.$route.query.detailId}`,//请求话题的id
            titleText: `${this.$route.query.title}`,//不同页面来源title
            wxShare: `${this.$route.query.wxShare}`,//是否来自微信分享，如果是true，则返回首页，否则返回上一级
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            whichfrom: 'speakList',//插槽组件来源
            params: {//请求话题列表
                url: '/interactTopic/getContentList',//
                data: {
                    projectId: `${this.$route.query.projectId}`,
                    userTk: mainUserTk,
                    moduleType:`${this.$route.query.moduleType}`,
                    moduleId:`${this.$route.query.detailId}`,
                    queryTime: ''
                }

            },
            listArry:[],
            queryTime:"",
            _me : ""
        }
    },
    components: {
        vReply,
        vLoad,
        list
    },
    methods: {
        _getList: function(num, me, type) {
            //下拉，加载 请求数据
            let _this = this;

            commonAjaxFun({
                url: '/interactTopic/getContentList',
                data: {
                    projectId: this.projectId,
                    userTk: mainUserTk,
                    moduleType:`${this.$route.query.moduleType}`,
                    moduleId:`${this.$route.query.detailId}`,
                    queryTime: this.queryTime
                }
            }).then((data) => {

                if (data.state == "0") {
                    let _data = data.data; 
                    //console.log(_data)
                    _this.listArry = type == 'up' ? _data.list : _this.listArry.concat(_data.list);
                    this.queryTime = _data.queryTime
                    if (_data.list.length == 0) {
                        me.lock();
                        me.noData();
                        me.resetload();
                    } else {
                        _this.$nextTick(function() {
                            me.resetload();
                        })
                    }
                }
            })
        },
        loadDownFn: function(me) {
            this.page = this.page + 1;
            this._getList(this.page, me);
            this._me = me;
        },
        loadUpFn: function(me) {
            this.queryTime = "";
            me.resetload();
            this._getList(1, me, "up");
            me.unlock();
            me.noData(false);
        },
        clearListArry: function() {
            this.queryTime = "";
            this.listArry = [];
            this.$refs.vLoad.change();
        },
        routerBack: function(){
            if(this.wxShare == 'true'){
                this.$router.push({path : '/home/index', query: {projectId: this.projectId, passKey: this.passKey}});//主页

            } else {
                this.$router.go(-1);
            }
        },
        _replayReresh: function(){
            //评论之后的操作
            // this.$set(this.params.data, "queryTime", '');
            this.loadUpFn(this._me);
        },
        reply: function(){
            //回复
            
            //首先判断是否登录
            if(!this.loginState){
                
                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
                return false;
            }

            this.$refs.reply.hideMaskShadow();
        }
    },
    mounted(){

        let _this = this;

        //次判断用于来宾详情页面单独微信分享
        if(_this.needSingleWx) {
            let desc = '';
            let title = _this.titleText;

            let link = (_this.fromFullPath != '/') ? _this.fromFullPath : _this.toFullPath ;//优先来源页面

            initAllWeiXin(_this.projectId, _this.passKey, 'scheduleDetail', {}, {
                title: title,
                desc: desc,
                link: link
            })
            
        }
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
