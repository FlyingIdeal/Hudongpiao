<template>
    <div class="m-center t-center">
        <template v-for="(value, key) in tochildlist">
            <!--动态-->
            <div class="shadow m-list" :themeId= 'value.themeId' :akey = 'key' v-if="value.moduleType == 'circleTheme'">
                <div class="m-list-top" >
                    <a class="link" href="javascript:void(0);">
                        <div class="infro">
                            <div class="photo"><img v-if="value.userImg" v-lazy="value.userImg" /><img v-else src="~@/common/images/default.png" /></div>
                            <div class="text">
                                <h6 v-text="value.userName"></h6>
                                <p v-text="value.company"></p>
                                <p v-text="value.position"></p>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="m-list-text" v-if="value.content || value.img">
                    <p v-text="value.content" v-if="value.content"></p>
                    <div class="img" v-if="value.img"><img @click="wxScaleBigImg(value.img)" v-lazy="value.img"></div>
                </div>
                <!--时间-->
                <div class="m-list-time"><span class="m-creat-time" v-text="value.showTime"></span><em v-if="value.contentPosition" title="在">{{$t("IneractCircle.At")}}</em><router-link class="at" v-if="value.contentPosition" :to="{path:'/schedule/detail', query:{projectId: projectId, passKey: passKey, detailId: value.allId, type:'appScheduleModule'}}" v-text="value.contentPosition"></router-link></div>
                <div class="comment-like-handle" v-if="!value.jsonStr">
                    <router-link :to="{path:'/moment/detail', query:{projectId: projectId, passKey: passKey, themeId: value.moduleId}}"><i class="icon-topic2"></i><span v-text="value.readNum" v-if="value.readNum > 0"></span></router-link>
                    <a href="javascript:void(0);" @click="likedLogs(value)"><i :class="[value.liked == 1 ? 'icon-color icon-liked' : 'icon-like']"></i><span :class="[value.liked == 1 ? 'icon-color' : '']" v-text="value.likedNum" v-if="value.likedNum > 0"></span></a>
                </div>
            </div>
            <!--互动话题-->
            <div class="shadow t-list" :themeId= 'value.themeId' :akey = 'key' v-else-if="value.moduleType == 'topicTheme'">
                <div class="topic-title-ident" v-if="value.topicType == 'mine'"><i class="icon-mine-topic-zh"></i></div>
                <h3 class="topic-title" :class="value.topicType == 'mine' ? 'topic-title-handle' : '' ">
                    <router-link class="topic-title-link" :to="{path:'/topic/detail', query:{projectId: projectId, passKey: passKey, themeId: value.moduleId}}">{{value.title}}</router-link>
                 </h3>
                 <!--观众-->
                <router-link class="topic-infro" :to="{path:'/topic/detail', query:{projectId: projectId, passKey: passKey, themeId: value.moduleId}}">
                    <div class="topic-creator">
                        <div class="photo"><img v-if="value.userImg" v-lazy="value.userImg" /><img v-else src="~@/common/images/default.png" /></div>
                        <p v-text="value.userName"></p>
                    </div>
                    <div class="comment-like-handle">
                        <a href="javascript:void(0);"><i class="icon-like"></i><span v-text="value.likedNum" v-if="value.likedNum > 0"></span></a>
                        <a href="javascript:void(0);"><i class="icon-topic2"></i><span v-text="value.readNum" v-if="value.readNum > 0"></span></a>
                    </div>
                </router-link>
            </div>
        </template>
    </div>
</template>

<script>

import {commonAjaxFun, commonFilterIndex, wxScaleBigImg, mainUserTk } from '../../common/js/common.js'

export default {
    props:{
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
    methods: {
        wxScaleBigImg: function(value){
            //微信端图片放大预览
            wxScaleBigImg(value)
        },
        likedLogs: function(val) {
            //点赞
            let _this = this;
            _this.$layer.loading();
            commonAjaxFun({
                url: '/interactTopic/likedLogs',
                data: {
                    projectId: _this.projectId,
                    userTk: mainUserTk,
                    moduleType: 'circle',
                    moduleId: val.moduleId
                }
            }, 200).then((data) => {

                _this.$layer.close();

                if (data.state == '0') {
                    //成功
                    let _index = commonFilterIndex(val.moduleId, 'moduleId', _this.tochildlist);
                    let _likedNum = parseInt(_this.tochildlist[_index].likedNum);
                    _this.$set(_this.tochildlist[_index], 'likedNum', ++_likedNum);
                    _this.$set(_this.tochildlist[_index], 'liked', '1');

                } else if (data.state == '10006') {
                    //已经赞过
                    _this.$layer.toast({ content: _this.$t('Forum.Liked') }) //已经赞过此话题了
                } else {
                    //其他情况
                    _this.$layer.toast({ content: data.message })
                }
            })

        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

      
</style>
