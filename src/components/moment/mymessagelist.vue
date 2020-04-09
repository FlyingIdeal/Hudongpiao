<template>
    <div>
        <ul class="in-list">
            <li v-for="(value, key) in tochildlist" :akey="key">
                <a href="javascript:void(0);" @click="textReply(value)">
                    <div class="infro">
                        <div class="photo"><img v-if="value.userImg" v-lazy="value.userImg" /><img v-else src="~@/common/images/default.png" /></div>
                        <div class="text">
                            <h6 v-text="value.userName"></h6>
                            <p class="replytext" v-if="value.content" v-text="value.content"></p>
                            <p class="replytext" v-else><i class ="icon_color icon-liked"></i></p>
                            <p class="time" v-text="value.showTime"></p>
                        </div>
                    </div>
                </a>
                <router-link class="list-handle" v-if="value.theme.img" :to="{path:'/moment/detail', query:{projectId: projectId, passKey: passKey, themeId: value.theme.themeId}}"><img @click="wxScaleBigImg(value.theme.img)" v-lazy="value.theme.img"></router-link>
                <router-link class="list-handle list-handle-text" v-else :to="{path:'/moment/detail', query:{projectId: projectId, passKey: passKey, themeId: value.theme.themeId}}" v-text="value.theme.content"></router-link>
            </li>
        </ul>
        <!--评论回复输入框-->
        <v-reply ref="reply" :limit="300" :moduleType="'circle'" :moduleId="moduleId" :touserId="touserId" :parentId="parentId" :level="level" :placeholder="placeholder" v-on:replayReresh="_replayReresh"></v-reply>
    </div>
</template>

<script>
import vReply from '../module/reply/reply.vue'
import { deleteTheme, wxScaleBigImg } from '../../common/js/common.js'
import complain from '../module/complain/complain.vue'//投诉

export default {
    props:{
        tochildlist: Array
    },
    components: {
        vReply
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            placeholder:'',//输入框占位符
            parentId: '',//父id
            moduleId:'',//模块id
            touserId: '',//回复人的userid
            level: 0//回复层级
        }
    },
    methods: {
        wxScaleBigImg: function(value){
            //微信端图片放大预览
            wxScaleBigImg(value)
        },
        textReply: function(value){
            //评论回复
            if(!value.like){//点赞不回复
                this.moduleId = value.theme.themeId;
                this.touserId = value.userId;
                this.parentId = !value.parentId ? value.contentId : value.parentId;

                let _lev = parseInt(value.level);
                this.level = _lev < 3 ? (_lev + 1) : _lev;

                this.placeholder = (this.$t('ExchangeCard.Reply') + ':') + value.userName;//回复:

                this.reply();
            }
        },
        _replayReresh: function(){
            this.moduleId = '';
            this.touserId = '';
            this.parentId = '';
            this.level = 0;
            this.placeholder = '';
        },
        reply: function(){
            //回复
            this.$refs.reply.hideMaskShadow();
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

@import "../../common/stylus/function.styl"

.listCol ul.in-list
    padding: 0 10px
    .infro
        .text
            padding: 0 10px
            h6
                font-size: 12px
                line-height: 18px
                height: auto
                overflow: inherit
                -webkit-line-clamp: inherit
            p.replytext
                font-size: 15px
                margin: 6px 0
                i.icon-liked
                    font-size: 20px
            p.time
                font-size: 12px
                color: #999
        .photo
            width: 30px
            height: 30px
            line-height: 28px
            flex: 0 0 30px
            img
                max-width: 28px
                max-height: 28px
.listCol ul.in-list
    .list-handle
        width: 60px
        flex: 0 0 60px
        height: 60px
        line-height: inherit
        text-align: center
        img
            vertical-align: top
            max-width: 50px
            max-height: 50px
    .list-handle-text
        font-size: 12px
        line-height: 15px
        overflow: hidden
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp: 4
</style>
