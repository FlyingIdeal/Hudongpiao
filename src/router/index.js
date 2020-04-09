import Vue from 'vue'
import Router from 'vue-router'
import { homeWeixin } from './homeWeixin.js'
import home from '../components/home/index'//首页
import mine from '../components/mine/index'//我的
import booth from '../components/booth/index'//展位
import mybooth from '../components/booth/mybooth'//展位
import myyuyue from '../components/booth/myyuyue'//我的预约
import boothDetail from '../components/booth/detail'//展位详情
import boothQuestion from '../components/question/boothindex'//展位问卷
import product from '../components/product/index'//展品
import productDetail from '../components/product/detail'//展品详情
import myproduct from '../components/product/myproduct'//我的收藏-展品
import demand from '../components/demand/index'//需求
import mydemand from '../components/demand/mydemand'//需求
import demandDetail from '../components/demand/detail'//需求详情
import demandCreate from '../components/demand/create'//需求创建
import guestList from '../components/guest/index'//嘉宾列表
import guestDetail from '../components/guest/detail'//嘉宾详情
import brief from '../components/brief/index'//简介
import edit from '../components/edit/index'//图文编辑
import help from '../components/help/index'//帮助中心
import scene from '../components/scene/index'//图文直播
import data from '../components/data/index'//资料列表
import schedule from '../components/schedule/index'//日程
import scheduleDetail from '../components/schedule/detail'//日程详情
import myschedule from '../components/schedule/myschedule'//我的日程
import partner from '../components/partner/index'//合作伙伴
import question from '../components/question/index'//问卷
import attendguest from '../components/attendguest/index'//社交-嘉宾
import attendDetail from '../components/attendguest/detail'//社交-嘉宾
import attendfriend from '../components/attendguest/friend'//社交-好友
import attendEdit from '../components/attendguest/edit'//社交-个人中心编辑
import moment from '../components/moment/index'//动态
import momentCreate from '../components/moment/create'//创建动态
import momentDetail from '../components/moment/detail'//动态详情
import mymoment from '../components/moment/mymoment'//我的动态
import mymessage from '../components/moment/mymessage'//我的消息列表
import topic from '../components/topic/index'//社交-互动话题
import mytopic from '../components/topic/mytopic'//社交-我的话题
import topicCreate from '../components/topic/create'//社交-创建话题
import topicDetail from '../components/topic/detail'//社交-互动话题
import posterIndex from '../components/poster/index'//微海报
import inviteIndex from '../components/invite/index'//邀请函
import mycodeIndex from '../components/mycode/index'//我的二维码
import mapIndex from '../components/map/index'//地图
import mapGuide from '../components/map/guide'//地图-参观指南
import loginIndex from '../components/login/index'//登录
import forgetIndex from '../components/login/forget'//忘记密码
import register from '../components/login/register'//注册
import error from '../components/module/error/404'//404页面
import label from '../components/label/index'//标签页面
import notice from '../components/notice/index'//消息页面
import noticeList from '../components/notice/list'//消息-系统秘书-列表页
import speakIndex from '../components/speak/index'//留言-单独页面，发言
import chatIndex from '../components/chat/index'//对话

Vue.use(Router)

export default new Router({
    linkActiveClass: 'active',
    mode: 'history',
    scrollBehavior (to, from) {
        if(!to.meta.keepAlive){
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve({ x: 0, y: 1 });  // 和window.scrollTo类似
              }, 0);
            })
        }
    },
    routes: [
        {
            path: '/',
            redirect: '/home/index'
        },
        {
            path: '/home/index',
            beforeEnter: function(to, from, next){
                homeWeixin(to, from, next)
            },
            name: 'home',
            component: home
        },
        {
            path: '/mine/index',
            name: 'mine',
            component: mine
        },
        {
            path: '/booth/index',
            name: 'boothIndex',
            component: booth,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/booth/detail',
            beforeEnter: function(to, from, next){
                if( to.query.wxShare && to.query.wxShare == "true"){
                   homeWeixin(to, from, next)
               }else{
                  next()
               }
            },
            name: 'boothDetail',
            component: boothDetail
        },
        {
            path: '/booth/mybooth',
            name: 'mybooth',
            component: mybooth
        },
        {
            path: '/booth/myyuyue',
            name: 'myyuyue',
            component: myyuyue
        },
        {
            path: '/booth/question',
            name: 'boothQuestion',
            component: boothQuestion
        },
        {
            path: '/product/index',
            name: 'productIndex',
            component: product,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/demand/index',
            name: 'demandIndex',
            component: demand
        },
        {
            path: '/demand/detail',
            name: 'demandDetail',
            component: demandDetail
        },
        {
            path: '/demand/mydemand',
            name: 'mydemand',
            component: mydemand
        },
        {
            path: '/demand/create',
            name: 'demandCreate',
            component: demandCreate
        },
        {
            path: '/guest/index',
            name: 'guestList',
            component: guestList
        },
        ,
        {
            path: '/guest/detail',
            name: 'guestDetail',
            beforeEnter: function(to, from, next){
                if( to.query.wxShare && to.query.wxShare == "true"){
                   homeWeixin(to, from, next)
               }else{
                  next()
               }
            },
            component: guestDetail
        },
        {
            path: '/brief/index',
            name: 'brief',
            component: brief,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/edit/index',
            name: 'edit',
            component: edit
        },
        {
            path: '/data/index',
            beforeEnter: function(to, from, next){
                if( to.query.wxShare && to.query.wxShare == "true"){
                   homeWeixin(to, from, next)
               }else{
                  next()
               }
            },
            name: 'data',
            component: data,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/help/index',
            name: 'help',
            component: help,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/scene/index',
            name: 'scene',
            component: scene
        },
        {
            path: '/partner/index',
            name: 'partner',
            component: partner,
            meta: {
                keepAlive: true// 这个是需要keepalive的
            }
        },
        {
            path: '/schedule/index',
            name: 'schedule',
            component: schedule
        },
        ,
        {
            path: '/schedule/detail',
            beforeEnter: function(to, from, next){
                if( to.query.wxShare && to.query.wxShare == "true"){
                   homeWeixin(to, from, next)
               }else{
                  next()
               }
            },
            name: 'scheduleDetail',
            component: scheduleDetail
        },
        {
            path: '/schedule/myschedule',
            name: 'myschedule',
            component: myschedule
        },
        {
            path: '/question/index',
            name: 'question',
            component: question
        },
        {
            path: '/attendguest/index',
            name: 'attendguest',
            component: attendguest,
            meta: {
                keepAlive: true// 这个是需要keepalive的
            }
        },
        {
            path: '/attendguest/friend',
            name: 'attendfriend',
            component: attendfriend
        },
        {
            path: '/attendguest/detail',
            beforeEnter: function(to, from, next){
                if( to.query.wxShare && to.query.wxShare == "true"){
                   homeWeixin(to, from, next)
               }else{
                  next()
               }
            },
            name: 'attendDetail',
            component: attendDetail
        },
        {
            path: '/attendguest/edit',
            name: 'attendEdit',
            component: attendEdit
        },
        {
            path: '/moment/index',
            name: 'moment',
            component: moment
        },
        {
            path: '/moment/create',
            name: 'momentCreate',
            component: momentCreate
        },
        {
            path: '/moment/detail',
            beforeEnter: function(to, from, next){
                if( to.query.wxShare && to.query.wxShare == "true"){
                   homeWeixin(to, from, next)
               }else{
                  next()
               }
            },
            name: 'momentDetail',
            component: momentDetail
        },
        {
            path: '/moment/mymoment',
            name: 'mymoment',
            component: mymoment
        },
        {
            path: '/moment/mymessage',
            name: 'mymessage',
            component: mymessage
        },
        {
            path: '/topic/index',
            name: 'topic',
            component: topic
        },
        {
            path: '/topic/mytopic',
            name: 'mytopic',
            component: mytopic
        },
        {
            path: '/topic/detail',
            beforeEnter: function(to, from, next){
                if( to.query.wxShare && to.query.wxShare == "true"){
                   homeWeixin(to, from, next)
               }else{
                  next()
               }
            },
            name: 'topicDetail',
            component: topicDetail
        },
        {
            path: '/topic/create',
            name: 'topicCreate',
            component: topicCreate
        },
        {
            path: '/product/detail',
            beforeEnter: function(to, from, next){
                if( to.query.wxShare && to.query.wxShare == "true"){
                   homeWeixin(to, from, next)
               }else{
                  next()
               }
            },
            name: 'productDetail',
            component: productDetail
        },
        {
            path: '/product/myproduct',
            name: 'myproduct',
            component: myproduct
        },
        {
            path: '/poster/index',
            name: 'posterIndex',
            component: posterIndex,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/invite/index',
            name: 'inviteIndex',
            component: inviteIndex
        },
        {
            path: '/map/index',
            name: 'mapIndex',
            component: mapIndex,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/map/guide',
            name: 'mapGuide',
            component: mapGuide,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/login/index',
            name: 'loginIndex',
            component: loginIndex
        },
        {
            path: '/login/forget',
            name: 'forgetIndex',
            component: forgetIndex
        },
        {
            path: '/login/register',
            name: 'register',
            component: register
        },
        {
            path: '/error/404',
            name: 'error',
            component: error
        },
        {
            path: '/label/index',
            name: 'label',
            component: label
        },
        {
            path: '/mycode/index',
            name: 'mycodeIndex',
            component: mycodeIndex,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/notice/index',
            name: 'notice',
            component: notice
        },
        {
            path: '/notice/list',
            name: 'noticeList',
            component: noticeList
        },
        {
            path: '/speak/index',
            beforeEnter: function(to, from, next){
                if( to.query.wxShare && to.query.wxShare == "true"){
                   homeWeixin(to, from, next)
               }else{
                  next()
               }
            },
            name: 'speakIndex',
            component: speakIndex
        },
        {
            path: '/chat/index',
            name: 'chatIndex',
            component: chatIndex
        }
    ]
})