<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle">{{$t("MyProfile.PersonalCenter")}}</h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <div class="mineIndex" v-show="!loadState">
                <div class="attend-top" v-if="InfroUser">
                    <router-link class="attend-infro" :to="{path:'/attendguest/edit', query:{projectId: projectId, passKey: passKey, userid: InfroUser.userid}}">
                        <div class="photo"><img v-if="InfroUser.headPortrait" v-lazy="InfroUser.headPortrait" /><img v-else src="~@/common/images/default.png" /></div>
                        <div class="text">
                            <h6 title="姓名">{{$t("RegLogin.Name")}}：<span v-text="InfroUser.name ? InfroUser.name : $t('CommonHTag.Null')"></span></h6>
                            <p v-if="InfroUser.records.company" title="公司">{{$t("RegLogin.Company")}}：<span v-text="InfroUser.records.company"></span></p>
                            <p v-if="InfroUser.position" title="职位">{{$t("RegLogin.Title")}}：<span v-text="InfroUser.position"></span></p>
                        </div>
                        <div class="list-handle"><i class="icon-rightarrow"></i></div>
                    </router-link>
                </div>
                <div class="attend-top" v-else>
                    <a href="javascript:void(0);" class="attend-infro noLogin">
                        <div class="photo"><img src="~@/common/images/default.png" /></div>
                        <div class="text">
                            <h6></h6>
                            <p></p>
                            <p></p>
                        </div>
                        <div class="list-handle"><i class="icon-rightarrow"></i></div>
                    </a>
                </div>
                <!--个人信息进度条-->
                <div class="mine-process-center" v-show="loginState && processNum < 100">
                    <div class="mine-process">
                        <p>{{$t("label.ImproveStill")}}{{100 - processNum}}%{{$t("label.ImproveMore")}}</p>
                        <mt-progress :value="processNum" :bar-height="2"></mt-progress>
                    </div>
                    <div class="mine-process-btn" @click="upInfroMess">{{$t("label.ImproveEdit")}}</div>
                </div>
                <!--未登录 登陆注册按钮-->
                <div class="mine-login" v-if="!InfroUser">
                    <router-link :to="{path:'/login/index', query:{projectId: projectId, passKey: passKey}}">登录</router-link>
                    <router-link :to="{path:'/login/register', query:{projectId: projectId, passKey: passKey,language:'ch'}}">注册</router-link>
                </div>
                <!--收藏好友等数据-->
                <div class="mine-tab" v-if="InfroUser">
                    <ul>
                        <li data-url='/booth/mybooth' @click="mineTabLink($event)">
                            <h6 v-text="InfroUser ? NumberData.watchNum : '--'"></h6>

                            <p title="我的收藏">{{$t("Me.Favorites")}}</p>
                        </li>
                        <li data-url='/attendguest/friend' @click="mineTabLink">
                            <h6 v-text="InfroUser ? NumberData.linkNum : '--'"></h6>
                            <p title="我的好友">{{$t("Person.MyContact")}}</p>
                        </li>
                        <li data-url='/demand/mydemand' @click="mineTabLink">
                            <h6 v-text="InfroUser ? NumberData.needsNum : '--'"></h6>
                            <p title="我的需求">{{$t("Demand.Title")}}</p>
                        </li>
                        <li data-url='/schedule/myschedule' data-type="myschedule" @click="mineTabLink">
                            <h6 v-text="InfroUser ? NumberData.scheduleNum : '--'"></h6>
                            <p title="我的日程">{{$t("HomePage.Schedule")}}</p>
                        </li>
                        <li data-url='/topic/mytopic' data-type="socialContact" @click="mineTabLink">
                            <h6 v-text="InfroUser ? NumberData.topicNum : '--'"></h6>
                            <p title="我的话题">{{$t("Forum.ForumTitle")}}</p>
                        </li>
                        <li data-url='/booth/myyuyue' @click="mineTabLink">
                            <h6 v-text="InfroUser ? NumberData.subNum : '--'"></h6>
                            <p title="预约">{{$t("RegLogin.Appointment")}}</p>
                        </li>
                    </ul>
                </div>
                <!--我的-->
                <div class="mine-link">
                    <ul v-if="InfroUser">
                        <li>
                            <router-link :to="{path:'/moment/mymoment', query:{projectId: projectId, passKey: passKey}}">
                                <i class="icon-xiaoxi"></i>
                                <span title="我的动态">{{$t("Me.MyActivityFeed")}}</span>
                                <i class="icon-rightarrow"></i>
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{path:'/poster/index', query:{projectId: projectId, passKey: passKey}}">
                                <i class="icon-poster"></i>
                                <span title="我的邀请函">{{$t("LeftNav.MyTicket")}}</span>
                                <i class="icon-rightarrow"></i>
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{path:'/mycode/index', query:{projectId: projectId, passKey: passKey}}">
                                <i class="icon-qrcode"></i>
                                <span title="我的二维码">{{$t("LeftNav.MyImg")}}</span>
                                <i class="icon-rightarrow"></i>
                            </router-link>
                        </li>
                    </ul>
                    <ul v-if="modulesArr.length > 0">
                        <li v-for="value in modulesArr">
                            <router-link :to="value | addProjectId(projectId, passKey)" v-if="filterUrl(value)">
                                <i :class="value.icon"></i>
                                <span v-text="value.appName"></span>
                                <i class="icon-rightarrow"></i>
                            </router-link>
                            <a :href="value | linkModuleFliter" target="_blank" v-else>
                                <i :class="value.icon"></i>
                                <span v-text="value.appName"></span>
                                <i class="icon-rightarrow"></i>
                            </a>
                        </li>
                    </ul>
                    <ul v-if="InfroUser && InfroUser.password">
                        <li>
                            <router-link :to="{path:'/login/forget', query:{projectId: projectId, passKey: passKey}}">
                                <i class="icon-password"></i>
                                <span title="修改密码">{{$t("LeftNav.MyPassword")}}</span>
                                <i class="icon-rightarrow"></i>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <v-footer :showClass="'mine'" v-on:getProcessNum="getProcessNum"></v-footer>
    </div>
</template>

<script>


import { chooseChildIcon, commonAjaxFun } from '../../common/js/common.js'
import { Progress } from 'mint-ui'
import vLoginicon from '../module/loginicon/loginicon.vue'
import loadState from '../module/loadState/loadState.vue'//加载状态
import vFooter from "../module/footer/footer"

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            loadState: true, //初次进页面加载中
            Infro: '', //基础数据
            InfroUser: '', //基础数据-个人信息
            modulesArr: [], //模块数组
            processNum: 0,//资料百分比
            NumberData: {
                linkNum: "", // 好友
                needsNum: "", //需求
                scheduleNum: "", //日程
                subNum: "", //预约
                topicNum: "", //话题 
                watchNum: "" //收藏
            }
        }
    },
    components: {
        loadState: loadState,
        vLoginicon: vLoginicon,
        vFooter: vFooter,
        mtProgress: Progress
    },
    filters: {
        addProjectId: function(val, id, key) {
            let _url = val.linkUrl;
            return _url + '&projectId=' + id + '&passKey=' + key;
        },
        linkModuleFliter: function(val) {
            let _url = val.linkUrl;

            if (val.beanName == 'linkModule' && _url != '' && _url != 'javascript:void(0);') {
                let _regUrl = /^(https?|http):\/\//;
                if (!_regUrl.test(_url)) {
                    _url = "http://" + _url;
                }

            } else if (val.beanName == 'linkModule' && _url == '') {
                _url = "javascript:void(0);"
            }

            return _url
        }
    },
    mounted(){
        this.getChildrenProject();
    },
    methods: {
        filterUrl: function(val) {
            if (val.beanName != 'linkModule') {
                //如果不是自定义链接
                return true
            } else {
                return false;
            }
        },
        _chooseChildIcon: function(){
            this.modulesArr = chooseChildIcon(this.Infro.modules);
        },
        getProcessNum: function(value) {
            //获取百分比
            this.processNum = value;
        },
        upInfroMess: function(){
            //完善个人信息
            if(this.InfroUser) {
                this.$router.push({path : '/attendguest/edit', query: {projectId: this.projectId, passKey: this.passKey, userid: this.InfroUser.userid}});
            } else {
                this.$layer.toast({content: this.$t('layerTips.LoginFirst')});//请先登录！
            }
        },
        mineTabLink: function(el){
            let url = el.currentTarget.getAttribute('data-url');
            let type = el.currentTarget.getAttribute('data-type');

            if(!!type) {
                this.$router.push({path : url, query: {projectId: this.projectId, passKey: this.passKey, type: type}});
            } else {
                this.$router.push({path : url, query: {projectId: this.projectId, passKey: this.passKey}});
            }

        },
        getMyNumber: function(userid) { //获取自己收藏 好友 需求 日程 话题  预约
            let _this = this;
            commonAjaxFun({
                url: '/homeData/getNumInfo',
                data: {
                    projectId: _this.projectId,
                    userId: userid
                }
            }).then((data) => {
                try {

                    if (data.state == '0') {
                        var _data = data.data;
                        //inkNum-> 好友  needsNum->需求 scheduleNum->日程 subNum->预约 topicNum->话题  watchNum->收藏
                        _this.NumberData = _data;

                    } else {
                        console.log(data.message);
                    }

                } catch (e) {
                    console.log(e)
                }

            })
        },
        getChildrenProject: function() {
            //停用vuex，改用公用ajax请求
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getChildrenProject',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey
                }
            }).then((data) => {
                try {
                    //console.log(data)
                    let _data = data.data;
                    _this.loadState = false;

                    if (data.state == '0') {
                        
                        _this.Infro = _data;
                        _this.InfroUser = _data.userInfo;

                        _this._chooseChildIcon();

                        if(!!_data.userInfo) {
                            _this.getMyNumber(_data.userInfo.userid)
                        }

                    } else {
                        console.log(data.message);
                    }

                } catch (e) {
                    console.log(e)
                }

            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/function.styl"

a.noLogin
    .text
        h6
            width: 100px
            height: 20px
            line-height: 20px
            background-color: #D9D9D9
            border-radius: 4px
        p
            height: 16px
            width: 40px
            margin-top: 8px
            background-color: #F3F3F3
            border-radius: 4px
            &:last-child
                width: 80px
.mine-login
    font-size: 0px
    padding: 10px
    text-align: left
    margin-bottom: 6px
    background-color: #fff
    a
        display: inline-block
        height: 36px
        line-height: 36px
        border: 1px solid #F35B00
        color: #F35B00
        border-radius: 2px
        width: 46%
        font-size: 16px
        text-align: center
        box-sizing: border-box
        &:first-child
            margin-right: 8%
            background-color: #F35B00
            color: #fff
.mine-tab
    padding: 10px
    margin-top: 6px
    margin-bottom: 6px
    background-color: #fff
    ul
        display: flex
        li
            flex: 1
            text-align: center
            line-height: 24px
            h6
                font-size: 14px
                color: #F35B00
            p
                font-size: 12px
                color: #999999
.mine-link
    ul
        padding-left: 10px
        margin-bottom: 6px
        background-color: #fff
        li
            border-bottom-px(1px, rgba(0,0,0,0.05))
            &:last-child
                border-bottom-px(0px, rgba(0,0,0,0.05))
            a
                display: flex
                i
                    flex: 0 0 30px
                    width: 30px
                    height: 44px
                    line-height: 44px
                    color: #F35B00
                    &.icon-rightarrow
                        font-size: 12px
                        text-align: center
                span
                    flex: 1
                    height: 44px
                    line-height: 44px
                    font-size: 14px
                    color: #666666
.mine-process-center
    margin-top: 6px
    background-color: #fff
    display: flex
    padding: 10px
    align-items:center
    .mine-process
        flex:1
        margin-right: 10px
        p
            font-size: 12px
            color: #666666
            line-height: 18px
            margin-bottom: 2px
    .mine-process-btn
        flex: 0 0 60px
        height: 20px
        line-height: 20px
        text-align: center
        color: #fff
        font-size: 12px
        background-color: #F35B00
        border-radius: 3px
</style>
