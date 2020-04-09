<template>
    <div class="footer">
        <router-link title="首页" :class="[showClass == 'home' ? 'active' : '']" :to="{path:'/home/index', query:{projectId: projectId, passKey: passKey}}"><i :class="[showClass == 'home' ? 'icon-homed' : 'icon-home']"></i><p>{{$t("Foot.Home")}}</p></router-link>
        <router-link title="日程" v-if="showSchduleFlag" :class="[showClass == 'schedule' ? 'active' : '']" :to="{path:'/schedule/index', query:{projectId: projectId, passKey: passKey}}"><i :class="[showClass == 'schedule' ? 'icon-nav-scheduled' : 'icon-nav-schedule']"></i><p>{{$t("HomePage.Schedule")}}</p></router-link>
        <router-link title="发现" :class="[showClass == 'discovery' ? 'active' : '']" :to="{path:'/moment/index', query:{projectId: projectId, passKey: passKey}}"><i :class="[showClass == 'discovery' ? 'icon-finded' : 'icon-find']"></i><p>{{$t("Foot.Discovery")}}</p></router-link>
        <router-link title="人脉" :class="[showClass == 'social' ? 'active' : '']" :to="{path:'/attendguest/index', query:{projectId: projectId, passKey: passKey}}"><i :class="[showClass == 'social' ? 'icon-contactsed' : 'icon-contacts']"></i><p>{{$t("Foot.Social")}}</p></router-link>
        <router-link title="我的" :class="[showClass == 'mine' ? 'active' : '']" :to="{path:'/mine/index', query:{projectId: projectId, passKey: passKey}}"><i :class="[showClass == 'mine' ? 'icon-mined' : 'icon-mine']"></i><p>{{$t("Foot.Mine")}}</p><em class="dot" v-if="loginState && processNum < 100"></em></router-link>
    </div>
</template>

<script>

import {mainUserTk, commonAjaxFun} from '../../../common/js/common.js'

export default {
    props: {
        showClass: String//当前显示的class
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            returnUrl: `HDPSCHDULE${this.$route.query.projectId}${this.$route.query.passKey}`,//用于判断当前是否有日程
            showSchduleFlag: false,
            processNum: ''//资料百分比
        }
    },
    mounted(){
        //判断当前是否有日程
        this.getSchduleList();

        //查看个人页面，个人进度
        if(this.loginState){
            this.getPersonalProgress();
        }
    },
    methods: {
        //获取日程
        getSchduleList: function() {
            let _this = this;

            let _link = sessionStorage.getItem(_this.returnUrl); //本地存储的backurl

            if (_link == 'true' || _link == true) {
                //有日程
                _this.showSchduleFlag = true;
                return;
            } else if (_link == 'false' || _link == false) {
                //无日程
                _this.showSchduleFlag = false;
                return;
            } else {
                commonAjaxFun({
                    url: '/eventapi/during/getSchduleList',
                    data: {
                        projectId: _this.projectId,
                        type: 'appScheduleModule',
                        userTk: mainUserTk
                    }
                }).then((data) => {
                    let _data = data.data;

                    if (data.state == '0') {
                        if (_data.length > 0) {
                            _this.showSchduleFlag = true;
                        } else {
                            _this.showSchduleFlag = false;
                        }
                    } else {
                        _this.showSchduleFlag = false;
                    }

                    sessionStorage.setItem(_this.returnUrl, _this.showSchduleFlag); //本地存储backurl

                }, (err) => {
                    console.log(err)
                })
            }
        },
        getPersonalProgress: function(){
            //查看个人页面，个人进度
            let _this = this;
            commonAjaxFun({
                url: '/userApi/getPersonalProgress',
                data: {}
            }).then((data) => {
                try {
                    if (data.state == '0') {
                        _this.processNum = parseInt(data.data);//data.data即为当前完成度
                        _this.$emit('getProcessNum', _this.processNum);//向个人中心页面，发送百分比

                    } else {
                        console.log(data.message);
                    }
                } catch (e) {
                    console.log(e)
                }

            })
        },
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import "../../../common/stylus/function.styl"
.footer
    position: fixed
    left: 0px
    bottom: 0px
    width: 100%
    z-index: 10
    display: flex
    background-color: #fff
    a
        flex: 1
        text-align: center
        color: #999999
        padding: 6px 0
        font-size: 12px
        border-top-px(1px, rgba(7, 17, 27, 0.1))
        &.active
            color: #F35B00
            i
                color: #F35B00
        i 
            display: block
            width: 20px
            height: 20px
            line-height: 20px
            margin: 0 auto 2px
            font-size: 20px
        em.dot
            position: absolute
            right: 30%
            top: 6px
            width: 4px
            height: 4px
            background-color: #f35b00
            color: #fff
            border-radius: 50%
</style>
