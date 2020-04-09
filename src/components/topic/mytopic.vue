<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" title="我的话题" v-text="$t('Forum.MyForum')"></h2>
            <div class="Occupy" @click="createTopic"><i class="icon-addtopic"></i></div>
        </div>
        <div class="boothIndex topSeat botSeat">
            <div class="topic listCol-arraw">
                <div class="mine-nolist-tips" v-if="topLength == 0 ">
                    <i class="icon-emptybowl"></i>
                    <p title="快来说说您的看法吧">{{$t("Messaging.LeaveTips")}}</p>
                    <a title="发起话题" href="javascript: void(0);" @click="createTopic" class="create-btn">{{$t("ForumCreate.Title")}}</a>
                </div>
                <v-load :loadDownFn = "loadDownFn" :loadUpFn='loadUpFn' ref='vLoad' v-show="topLength > 0"> 
                  <slot>
                        <topicList :tochildlist='listArry' :listObj="listObj"></topicList>
                  </slot>
                </v-load>

            </div>
        </div>
        <v-footer :showClass="'mine'"></v-footer>
    </div>
</template>
<script>
import { mainUserTk, commonAjaxFun } from '../../common/js/common.js'
import vLoad from '../module/loadmore/dropload.vue'
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import topicList from './list.vue'//互动话题

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            topLength: 1,  //我的，列表长度
            listArry:[],
            listObj:{},
            page:0
        }
    },
    components: {
        vLoad,
        vLoginicon,
        vFooter,
        topicList
    },
    methods: {
        _getList: function(num, me, type) {
            //下拉，加载 请求数据
            let _this = this;

            commonAjaxFun({
                url: '/interactTopic/getThemeList',
                data: {
                    type: 'mine',
                    page: _this.page,
                    createTime: null
                }
            }).then((data) => {
                let _data = data.data;
                //console.log(JSON.parse(JSON.stringify(_data)))    
                _this.page = _this.page + 1;

                _this.listArry = type == 'up' ? _data.themeList : _this.listArry.concat(_data.themeList);
                _this.listObj = _data.mainTheme;
                _this.createTime = _data.queryDate;

                _this.topLength = _this.listArry.length ;

                if (_data.themeList.length == 0) {
                    me.lock();
                    me.noData();
                    me.resetload();
                } else {
                    _this.$nextTick(function() {
                        me.resetload();
                    })
                }
            })
        },
        loadDownFn: function(me) {
            this._getList(this.page, me);
        },
        loadUpFn: function(me) {
            this.page = 0;
            me.resetload();
            this._getList(1, me, "up");
            me.unlock();
            me.noData(false);
        },
        linkToFriend: function(){
            //到好友页面，首先登录
            //首先判断是否登录
            if(!this.loginState){
                
                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
                return false;
            } else {
                this.$router.push({path : '/attendguest/friend', query: {projectId: this.projectId, passKey: this.passKey}});//主页
            }

        },
        createTopic: function(){
            //创建话题
            if(!this.loginState){

                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl

                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
                return false;
            } else {
                this.$router.push({path : '/topic/create', query: {projectId: this.projectId, passKey: this.passKey}});//主页
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/function.styl"
.header .Occupy i
    color: #f35b00
.sticky-area
    .cell-filter
        padding: 0px
        border-bottom-px(1px, rgba(0,0,0,.05))
        ul
            display: flex
            li
                flex: 1
                padding: 0px
                height: 42px
                text-align: center
                &.active
                    span
                        color: #F35B00
                        border-bottom: 3px solid #F35B00
                span
                    color: #999999
                    display: inline-block
                    height: 42px
                    line-height: 42px
                    box-sizing: border-box
                    padding: 0 6px
                    border-bottom: 3px solid transparent
</style>
