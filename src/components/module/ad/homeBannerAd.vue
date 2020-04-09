<template>
    <div>
        <div class="page-swipe" :style="{height: adHeight}" v-if="adList.length > 0">
            <mt-swipe :auto="adList.length == 0 ? 0 : 5000" :style="{height: adHeight}">
                <template v-for="value in adList">
                    <mt-swipe-item>
                        <a :href="value.clickLink" :style="{height: adHeight}" @click="bannerLinkTo(value.id)"><img v-lazy="value.banner" :style="{maxHeight: adHeight}"></a>
                    </mt-swipe-item>
                </template>
            </mt-swipe>
        </div>
    </div>
</template>

<script>

import { Swipe, SwipeItem } from 'mint-ui';
import { commonAjaxFun } from '../../../common/js/common.js'

export default {
    data(){
    	return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
    		adList: []//广告列表
    	}
    },
    components: {
        mtSwipe: Swipe,
        mtSwipeItem: SwipeItem
    },
    mounted(){
        this.getBanners();
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
        bannerLinkTo: function(id){
            //首页广告跳转
            if(id == '0' || !id) {
                return;
            } else {
                this.$router.push({path : '/booth/detail', query: {projectId: this.projectId, passKey: this.passKey, boothId: id }});
            }
        },
        getBanners: function() {
            //获取首页bannner
            let _this = this;

            commonAjaxFun({
                url: '/homeData/getBanners',
                data: {
                    projectId: _this.projectId
                }
            }).then((data) => {
                try {
                    let _data = data.data;
                    if (data.state == '0') {
                        _this.adList = _data;
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

<style lang="stylus" rel="stylesheet/stylus">
.page-swipe
    background-color: #fff
</style>
