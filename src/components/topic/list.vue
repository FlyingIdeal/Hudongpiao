<template>
    <div class="t-center">
        <div class="t-list" v-if="listObj">
            <!--主办方-->
            <div class="topic-title-new-ident"><img v-if="$t('Forum.TopicIcon') == 'zhuIconEn'" src="~@/common/images/zhuIconEn.png" /><img v-else src="~@/common/images/zhuIcon.png" /></div>
            <h3 class="topic-title topic-title-handle">
                <router-link class="topic-title-link" :to="{path:'/topic/detail', query:{projectId: projectId, passKey: passKey, themeId: listObj.themeId, childId: listObj.projectId}}">{{listObj.meetingName}}</router-link>
            </h3>
            <router-link class="topic-infro" :to="{path:'/topic/detail', query:{projectId: projectId, passKey: passKey, themeId: listObj.themeId}}">
                <div class="topic-creator">
                    <div class="photo"><img v-if="listObj.meetingPrimary" v-lazy="listObj.meetingPrimary" /><img v-else src="~@/common/images/default.png" /></div>
                    <p v-text="listObj.meetingName"></p>
                </div>
                <div class="comment-like-handle">
                    <a href="javascript:void(0);"><i class="icon-like"></i><span v-text="listObj.likedNum" v-if="listObj.likedNum > 0"></span></a>
                    <a href="javascript:void(0);"><i class="icon-topic2"></i><span v-text="listObj.readNum" v-if="listObj.readNum > 0"></span></a>
                </div>
            </router-link>
        </div>

        <template v-for="(value, key) in tochildlist" :akey="key + 1">
            <div class="t-list" :themeId = 'value.themeId'>
                <div class="topic-title-ident" v-if="value.topicType == 'mine'"><i :class='$t("Forum.MineIcon")'></i></div>
                <h3 class="topic-title" :class="value.topicType == 'mine' ? 'topic-title-handle' : '' ">
                    <router-link class="topic-title-link" :to="{path:'/topic/detail', query:{projectId: projectId, passKey: passKey, themeId: value.themeId, childId: value.projectId}}">{{value.title}}</router-link>
                 </h3>
                 <!--观众-->
                <!-- <router-link class="topic-infro" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.userId}}"> -->
                <div class="topic-infro">
                   <!--  <div class="topic-creator"> -->
                    <router-link class="topic-creator" :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.userId}}">
                        <div class="photo"><img v-if="value.userImg" v-lazy="value.userImg" /><img v-else src="~@/common/images/default.png" /></div>
                        <p v-text="value.userName"></p>
                    </router-link>
                    <!-- </div> -->
                    <!-- <div class="comment-like-handle"> -->
                    <router-link class="comment-like-handle" :to="{path:'/topic/detail', query:{projectId: projectId, passKey: passKey, themeId: value.themeId, childId: value.projectId}}">
                        <a href="javascript:void(0);"><i class="icon-like"></i><span v-text="value.likedNum" v-if="value.likedNum > 0"></span></a>
                        <a href="javascript:void(0);"><i class="icon-topic2"></i><span v-text="value.readNum" v-if="value.readNum > 0"></span></a>
                    </router-link>
                    <!-- </div> -->
                <!-- </router-link> -->
                </div>
            </div>
        </template>
    </div>
</template>

<script>


export default {
    props:{
        tochildlist: Array,
        listObj: Object
    },
    components: {
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
          
</style>
