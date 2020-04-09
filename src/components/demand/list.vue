<template>
    <ul class="in-list">
        <li v-for="(value, key) in tochildlist" :akey="key + 1">
            <router-link :to="{path:'/demand/detail', query:{projectId: projectId, passKey: passKey, needId: value.needId}}">
                <div class="infro">
                    <div class="text">
                        <h6 v-text="value.title"></h6>
                        <div title="参与" class="demandJoin"><p v-text="value.categoryName"></p><span class="usernum"><em>{{value.userNum}}</em>{{$t("Demand.Responsed")}}</span></div>
                        <p title="需求描述">{{$t("Demand.reqDescription")}}：{{value.content}}</p>
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
.listCol .demandJoin
    display: flex
    p
        flex: 1
    span.usernum
        width: 84px
        flex: 0 0 84px
        color: #999
        text-align: right
        font-size: 12px
        em
            font-style: normal
            color: #F35B00
            margin-right: 4px
.listCol ul.in-list .infro .text p
    height: auto
    -webkit-line-clamp: 3            
</style>
