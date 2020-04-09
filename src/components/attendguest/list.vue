<template>
    <ul class="in-list">
        <li v-for="(value, key) in tochildlist" :akey="key + 1" v-if="(value.headPortrait && value.headPortrait != 'undefined') || value.name || value.records.company || value.position">
            <router-link :to="{path:'/attendguest/detail', query:{projectId: projectId, passKey: passKey, userid: value.userid}}">
                <div class="infro">
                    <div class="photo"><img v-if="value.headPortrait && value.headPortrait != 'undefined'" :src="value.headPortrait" /><img v-else src="~@/common/images/default.png"><i class="e-icon wait" v-if="value.contactType == 'RTS'"></i><i class="e-icon together" v-else-if="value.contactType == 'together'"></i></div>
                    <div class="text">
                        <h6 v-text="value.name"></h6>
                        <p v-text="value.records.company"></p>
                        <p v-text="value.position"></p>
                    </div>
                </div>
                <div class="list-handle"><i class="icon-rightarrow"></i></div>
            </router-link>
        </li>
    </ul>
</template>

<script>


export default {
    props:{
        tochildlist: Array
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.listCol ul.in-list .infro .photo
    overflow: inherit
    .e-icon
        position: absolute
        height: 20px
        width: 20px
        background-size: cover
        top: -10px
        right: -10px
    .RTS
        background-image: url('~@/common/images/wait.png')
    .together
        background-image: url('~@/common/images/changeCard.png')
</style>
