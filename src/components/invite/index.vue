<template>
    <div>
        <div class="head-back">
            <div class="head-back-icon" @click="routerBack"><i class="icon-leftarrow"></i></div>
            <h2 class="headerTitle" title="邀请函" v-text="$t('CommonUse.Invitation')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat poster-index">
            <div class="poster-img"><img :src="createPersonImage"></div>
        </div>
        <div class="mask-shadow" v-show="showFlag" @click="hideMaskShadow"></div>
        <transition name="move">
            <div class="poster-tips" v-show="showFlag" id="postertips" @click="hideMaskShadow"><img class="poster-tips-img" src="~@/common/images/wposter_me.png"></div>
        </transition>
    </div>
</template>

<script>

import { api_url } from '../../common/js/common.js'

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            boothId: `${this.$route.query.boothId}`,
            showFlag: true
        }
    },
    computed: {
        createPersonImage: function(){
            return `${api_url}/tinyPoster/createBoothImage?boothId=${this.boothId}`;
        }
    },
    methods: {
        routerBack: function(){
            this.$router.go(-1);
        },
        hideMaskShadow: function(){
            this.showFlag = !this.showFlag
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.poster-index
    .poster-img img
        max-width: 100%
.poster-tips
    width: 300px
    position: fixed
    left: 50%
    top: 100px
    z-index: 16
    margin-left: -150px
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
        transition: all 0.1s linear
    &.move-enter, &.move-leave-active
        transform: translate3d(0, -100%, 0)
    img
        max-width: 100%
        pointer-events: none; 
</style>
