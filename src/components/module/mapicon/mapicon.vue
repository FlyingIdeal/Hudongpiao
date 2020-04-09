<template>
    <div class="Occupy">
        <div class="OccupyHas" v-if="boothMapHas">
            <i class="icon-address" v-if="boothMapFlag" @click="gotoMapLink"></i>
            <a class="outLink" :href="boothMapUrl" v-if="!boothMapFlag" target="_blank"><i class="icon-address"></i></a>
        </div>
    </div>
</template>
<script>

import { commonAjaxFun } from '../../../common/js/common.js'

export default {
	data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            boothMapFlag: false,//有展位地图的情况下。判断是外链还是到/map/index
            boothMapHas: false,//是否有展位地图
            boothMapUrl: ''//地图地址
        }
	},
    mounted(){
        this.getChildrenProject()
    },
    methods: {
        gotoMapLink: function(){
            if(this.boothMapUrl.indexOf('mapid') > 0){
                this.$router.push({path : '/map/index', query: {projectId: this.projectId, passKey: this.passKey}});//主页
            }
        },
        getChildrenProject: function(){
            //停用vuex，改用公用ajax请求
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getChildrenProject',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey
                }
            }).then((data) => {
                try{
                    let _data = data.data;

                    if (data.state == '0') {

                        _this.boothMapUrl = _data.basicInfo.boothMapLink;

                        if (!!_this.boothMapUrl) {
                            _this.boothMapHas = true;
                        } else {
                            _this.boothMapHas = false;
                        }

                        if (_this.boothMapUrl.indexOf('mapid') > 0) {
                            _this.boothMapFlag = true;
                        } else {
                            _this.boothMapFlag = false;
                        }

                    } else {
                        console.log(data.message);
                    }

                } catch(e) {
                    console.log(e)
                }
                
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.Occupy a.outLink
    display: block
    flex: 1
</style>
