<template>
	<div class="header">
        <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')" v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
        <h2 class="headerTitle" v-text="toptitle"></h2>
        <div class="Occupy"></div>
    </div>
</template>
<script>
export default {
    props: {
        toptitle: String
    },
    data() {
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            wxShare: `${this.$route.query.wxShare}`, //是否来自微信分享，如果是true，则返回首页，否则返回上一级
        }
    },
    methods: {
        routerBack: function(){
            if(this.wxShare == 'true'){
                this.$router.push({path : '/home/index', query: {projectId: this.projectId, passKey: this.passKey}});//主页
            } else {
                this.$router.go(-1);
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
