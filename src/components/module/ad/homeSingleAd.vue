<template>
    <div class="home-single-ad" v-if="adListObj" :style="{height: adHeight}">
        <router-link :to="{path:'/booth/detail', query:{projectId: projectId, passKey: passKey, boothId: adListObj.id}}"><img v-lazy="adListObj.banner" :style="{maxHeight: adHeight}"></router-link>
    </div>
</template>

<script>

import { commonAjaxFun } from '../../../common/js/common.js'

export default {
    data(){
    	return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
    		adListObj: {}//广告列表
    	}
    },
    mounted(){
        this.getBannerByVersion();
    },
    computed: {
        adHeight: function(){
            let _w = parseInt((document.body.clientWidth * 2) / 5);
            if(_w > 300) {
                _w = 300;
            }
            return _w + 'px'
        }
    },
    methods: {
        getBannerByVersion: function() {
            //获取首页bannner
            let _this = this;

            commonAjaxFun({
                url: '/homeData/getBannerByVersion',
                data: {
                    projectId: _this.projectId
                }
            }).then((data) => {
                try {
                    let _data = data.data;
                    if (data.state == '0') {
                        _this.adListObj = _data;
                    } else {
                        console.log(data.message);
                    }

                } catch (e) {
                    console.log(e)
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.home-single-ad
    background-color: #fff
    margin-bottom: 10px
    a
        display: block
        text-align: center
        height:100%
        overflow: hidden
        font-size: 0px
        img
            max-width: 100%
            // max-height: 105px
</style>
