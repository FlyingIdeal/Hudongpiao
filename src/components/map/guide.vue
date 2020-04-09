<template>
    <div>
         <div class="head-back">
                <div class="head-back-icon" @click="routerBack"><i class="icon-leftarrow"></i></div>
                <h2 class="headerTitle" title="参观指南" v-text="$t('Exhibitor.TourGuide')"></h2>
                <div class="Occupy"></div>
            </div>
        <div class="brief topSeat">
            <load-state v-show="loadState"></load-state>
            <div class="quotetext" v-show="!loadState" v-html="brieftxt"></div>
        </div>
    </div>
</template>

<script>
import loadState from '../module/loadState/loadState.vue'//加载状态
import {boothClassifyToList, commonAjaxFun} from '../../common/js/common.js'

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            loadState: true,
            brieftxt: ''
        }
    },
    components: {
        loadState
    },
    mounted(){
        this.getBoothGuide()
    },
    methods: {
        routerBack: function(){
            this.$router.go(-1);
        },
        getBoothGuide: function(){
            //获取展位-参观指南
            let _this = this;
            commonAjaxFun({
                url: '/boothApi/getBoothGuide',
                data: {}
            }).then((data) => {
                try {
                    let _data = data.data;
                    if(data.state == '0'){

                        _this.brieftxt = _data;
                        _this.loadState = false;

                    } else {
                        console.log(data.message)
                    }
                } catch(err){
                    console.log(err)
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.quotetext
    padding: 10px 14px
    background-color: #fff
</style>
