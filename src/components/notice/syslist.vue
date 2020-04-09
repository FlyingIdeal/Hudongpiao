<template>
    <ul class="notice-ul">
        <li v-for="(value, key) in listAfter" :akey="key" :class="[value.hasBeenRead ? 'active' : '']">
            <!--名片样式-->
            <div class="infro card" v-if="value.type == 'card'">
                <div class="notice-tag" :class="$t('CommonUse.SmallFont')" title="名片">{{$t("Person.BusinessCard")}}</div>
                <div class="text">
                    <!--请求中-->
                    <router-link v-if="value.args.state=='RTS'" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.fromUserid}}" class="notice-title">
                        <em class="pos" v-text="value.args.position"></em><em class="pos" v-if='value.args.position' v-text='","'></em><em class="pos" v-text="value.args.name"></em><em title="向您递了名片，希望与您成为好友" v-text="$t('ExchangeCard.RequestExcard')"></em>
                    </router-link>
                    <!--已同意-->
                    <router-link v-else="value.args.state=='agree'" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.fromUserid}}" class="notice-title">
                        <em class="pos" v-text="value.args.position"></em><em class="pos" v-if='value.args.position' v-text='","'></em><em class="pos" v-text="value.args.name"></em><em title="已与您互递名片，成为了好友" v-text="$t('Person.ApprovedRequest')"></em>
                    </router-link>
                    <!--同意拒绝按钮-->
                    <div class="card-handle">
                        <div class="notice-time" v-text="value.showTime"></div>
                        <div class="card-btn">
                            <span class="refuse" v-if="value.resultCode == ''" @click="refuse(value)" title="拒绝">{{$t("ExchangeCard.Decline")}}</span>
                            <span class="agree" v-if="value.resultCode == ''" @click="agreed(value)" title="同意">{{$t("ExchangeCard.Agree")}}</span>
                            <span class="hasagree" v-if="value.resultCode == '0'" title="已同意">{{$t("Person.Approved")}}</span>
                            <span class="hasrefuse" v-if="value.resultCode == '2'" title="已拒绝">{{$t("Person.Declined")}}</span>
                        </div>
                    </div>
                </div>
                <router-link class="list-handle" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.fromUserid}}"><i class="icon-rightarrow"></i></router-link>
            </div>
            <!--动态-->
            <div class="infro circle"  v-if="value.type == 'circle'">
                <div class="notice-tag" :class="$t('CommonUse.SmallFont')" title="动态">{{$t("Headers.IneractCircle")}}</div>
                <div class="text">
                    <router-link class="circle-link" :to="{path:'/moment/detail', query:{projectId: projectId, passKey: passKey, themeId: value.query}}">
                        <div class="circle-detail">
                            <h6 class="notice-title"><em title="匿名用户/在您创建的动态中，回复了您" v-text='value.args.name ? value.args.name : $t("VoteInteract.AnonymousUser")'></em> {{$t("Person.ReplyMoment")}}</h6>
                            <div class="circle-reply">
                                <div class="circle-text" v-text="value.content"></div>
                                <div class="circle-img"><img v-lazy="value.images"></div>
                            </div>
                            <div class="notice-time" v-text="value.showTime"></div>
                        </div>
                        <div class="list-handle"><i class="icon-rightarrow"></i></div>
                    </router-link>
                </div>
            </div>
            <!--话题-->
            <div class="infro topic" v-if="value.type == 'topic'">
                <div class="notice-tag" :class="$t('CommonUse.SmallFont')" title="话题">{{$t("Forum.ForumTitle")}}</div>
                <div class="text">
                    <router-link :to="{path:'/topic/detail', query:{projectId: projectId, passKey: passKey, themeId: value.query}}">
                        <div class="circle-detail">
                            <h6 class="notice-title"><em title="匿名用户" v-text='value.args.name ? value.args.name : $t("VoteInteract.AnonymousUser")'></em> <em title="在您创建的《" v-text='$t("Person.At")'></em><em v-text='value.args.theme'></em><em title="》中，回复了您" v-text='$t("Person.Reply")'></em></h6>
                            <div class="circle-reply">
                                <div class="circle-text" v-text="value.content"></div>
                            </div>
                            <div class="notice-time" v-text="value.showTime"></div>
                        </div>
                    </router-link>
                </div>
                <router-link class="list-handle" :to="{path:'/booth/detail', query:{projectId: projectId, passKey: passKey}}"><i class="icon-rightarrow"></i></router-link>
            </div>
            <!--广播-->
            <div class="infro broadcast" v-if="value.type == 'broadcast'">
                <div class="notice-tag" :class="$t('CommonUse.SmallFont')" title="广播">{{$t("Person.Broadcast")}}</div>
                <div class="text">
                    <div class="circle-detail">
                        <h6 class="notice-title" v-html='value.title'></h6>
                        <p v-text="value.time"></p>
                    </div>
                </div>
                <div class="list-handle"></div>
            </div>
            <!-- 需求 -->
            <div class="infro needs" v-if="value.type == 'needs'">
                <div class="notice-tag" :class="$t('CommonUse.SmallFont')" title="需求">{{$t("Demand.Title")}}</div>

                <router-link :to="{path:'/demand/detail', query:{projectId: projectId, passKey: passKey, needId: value.query}}">
                    <div class="text">
                        <div class="circle-detail">
                            <h6 class="notice-title" v-html='value.title'></h6>
                            <p v-text="value.showTime"></p>
                        </div>
                    </div>
                </router-link>
                <div class="list-handle"></div>
               
            </div>
            <!-- 预约 -->
            <div class="infro boothSub" v-if="value.type == 'boothSub'">
                <div class="notice-tag" :class="$t('CommonUse.SmallFont')" title="预约">{{$t("RegLogin.Appointment")}}</div>
                    <router-link :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.fromUserid}}">
                        <div class="text">
                            <div class="circle-detail">
                                <h6 class="notice-title" v-html='value.title'></h6>
                                <p v-text="value.showTime"></p>
                            </div>
                        </div>
                    </router-link>
                    <div class="list-handle"></div>
            </div>
        </li>
    </ul>
</template>

<script>

import { mainUserTk,commonAjaxFun } from '../../common/js/common.js'

export default {
    props:{
        listObj: Object,
        tochildlist: Array
    },
    components: {
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`
        }
    },
    computed: {
        listAfter: function(){
            let _temList = new Array();

            for(let i = 0; i < this.tochildlist.length; i++) {

                let _args = this.tochildlist[i].args;

                try {
                    this.tochildlist[i].args =  $.parseJSON(_args);
                } catch (e) {}

                _temList.push(this.tochildlist[i])
            }

            return _temList;
        }
    },
    methods: {
        refuse: function(val) {
            this.ajaxGet(val, "2");
        },
        agreed: function(val) {
            this.ajaxGet(val, "0");
        },
        ajaxGet: function(val, str) {
            let temp_msgId = "";
            let _this = this;

            if (str == "0") {
                temp_msgId = '';
            } else {
                temp_msgId = val.id;
            }
            _this.$layer.loading(_this.$t("layerTips.Proceeding")); //正在提交，请稍候！

            //登录
            commonAjaxFun({
                url: '/userApi/adduser',
                data: {
                    userTk: mainUserTk,
                    userId: val.fromUserid,
                    msgId: temp_msgId,
                    projectId: this.projectId
                }
            }, 1000).then((data) => {
                try {
                    _this.$layer.close();
                    if (data.state == '0') {
                        val.resultCode = str;

                    } else {
                        _this.$layer.toast({
                            content: data.message
                        })
                    }
                } catch (err) {
                    console.log(err)
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

@import "../../common/stylus/function.styl"

.notice-ul
    padding-left: 10px
    li
        display: flex
        padding: 14px 0
        border-bottom-px(1px, rgba(0,0,0,0.05))
        &.active
            opacity: 0.7
    .infro
        width: 100%
        display: flex
        .text
            flex: 1
            box-sizing: border-box
            padding-left: 10px
    .list-handle
        flex: 0 0 40px
        width: 40px
        text-align: center
        display: flex
        align-items: center;
    .notice-title
        display: block
        margin-bottom: 6px
        font-size: 15px
        color: #666
        em.pos
            color: #000
            font-weight: 500
    .notice-tag
        flex: 0 0 60px
        width: 60px
        text-align: center
        color: #fff
        height: 18px
        line-height: 18px
        border-radius: 4px
        font-size: 12px
        &.SmallFont
            height: 36px
            word-break: break-word
    .card .notice-tag
        background-color: #3C99EE
    .broadcast .notice-tag
        background-color: #00CD9D
    .topic .notice-tag
        background-color: #FE9009
    .circle .notice-tag
        background-color: #F35B00
    .notice-time
        height: 28px
        line-height: 28px
        font-size: 12px
        color: #666
    .card-handle
        display: flex
        .notice-time
            flex: 1
        .card-btn
            flex: 0 0 168px
            width: 168px
            font-size: 0px
            text-align: right
            span
                display: inline-block
                width: 80px
                height: 28px
                line-height: 28px
                text-align: center
                font-size: 14px
                margin-left: 4px
                border-radius: 4px
                border: 1px solid rgba(0,0,0,.05)
                box-sizing: border-box
                &.agree
                    background-color: #F35B00
                    color: #fff
                &.hasagree, &.hasrefuse
                    color: rgba(51,51,51, 0.5)
                    background-color: rgba(239,239,239, 0.5)
    .circle-text
        font-size: 15px
    .circle-link
        display: flex
    .circle-detail
        flex: 1
    .circle-reply
        display: flex
        .circle-text
            flex: 1
        .circle-img
            flex: 0 0 50px
            width: 50px
            height: 30px
            text-align: right
            img
                max-width: 100%
                max-height: 100%
    .needs .notice-tag
        background-color: #FE9009;
    .needs p
        font-size:12px;
    .boothSub .notice-tag
        background-color: #d11d48;
    .boothSub p  
        font-size:12px; 
</style>
