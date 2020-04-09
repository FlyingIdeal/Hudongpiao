<template>
    <dl class="sceneList" v-if="tochildlist">
        <dd v-for="(value,key) in tochildlist" :aakey="key + 1">
            <i class="icon-clock"></i>
            <div class="txt-area">
                <p class="time">{{value.createTime | formatDate}}</p>
                <p class="txt" v-text="value.txtContent"></p>
                <div class="img" v-if="value.imgContent" v-for="img in splitImg(value.imgContent)"><img v-lazy="img" /></div>
            </div>
        </dd>
    </dl>
</template>

<script>
import {formatDate} from '../../common/js/common.js'

export default {
    props:{
        tochildlist: Array
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`
        }
    },
    filters: {
        formatDate(time){
            let data = new Date(time.replace(new RegExp("-","gm"),"/"));
            return formatDate(data, 'HH:mm')
        }
    },
    methods: {
        splitImg: function(val){
            if(!val){
                return;
            }
            return val.split(',')
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

@import "../../common/stylus/function.styl"

dl.sceneList
    padding: 0 14px
    dd
        border-left-px(1px, rgba(0,0,0,.05))
        padding: 14px 18px
        position: relative
        &:first-child
            i, p.time
                color: #f35b00
        i
            position: absolute
            top: 18px
            left: -8px
            color: #333
        img
            max-width: 80%
        p.time
            font-size: 16px
        p.txt
            padding: 4px 0 10px
            color: #4D4D4D


</style>
