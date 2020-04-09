<template>
    <div>
        <ul class="in-list">
            <li v-for="(value, key) in tochildlist" :akey="key">
                <!-- <a :href="value.url | formartUrl"> -->
                <a href="javascript:void(0);">
                    <div class="infro">
                        <div class="photo"><img v-lazy="_filterDataImg(value.url)"></div>
                        <div class="text">
                            <h6 v-text="value.title"></h6>
                            <p v-text="value.companyName"></p>
                        </div>
                    </div>
                </a>
                <div class="list-handle" @click="dataDownload(value)"><i class="icon-download"></i></div>
            </li>
        </ul>
        <v-datadown ref="datadown" :params="downDataObj"></v-datadown>
    </div>
</template>

<script>
import vDatadown from '../module/datadown/datadown.vue'
import {filterDataImg} from '../../common/js/common.js'

export default {
    props:{
        tochildlist: Array
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            returnUrl: `HDPLINK${this.$route.query.projectId}${this.$route.query.passKey}`,//登陆之后返回的url，用于本地存储
            downDataObj: {},//资料下载传递到datadown的模块中
            normalDownObj: {//正常情况下的资料下载，event.type='event'
                url: '/eventapi/during/saveOperate',
                data: {
                    did: '',
                    email: ''
                }
            },
            boothDownObj: {//展位下的资料下载，event.type='booth'
                url: '/boothApi/downloadDatums',
                data: {
                    bankId: '',
                    boothId: '',
                    datumId: '',
                    email: ''
                }
            }
        }
    },
    components: {
        vDatadown
    },
    filters: {
        formartUrl: function(val){
            return !val ? 'javascript:void(0);' : val
        }
    },
    methods: {
        _filterDataImg: function(val){
            let _type = filterDataImg(val);
            return require('@/common/images/' + _type);
        },
        dataDownload: function(value){
            //资料下载
            
            //首先判断是否登录
            if(!this.loginState){

                localStorage.setItem(this.returnUrl, this.toFullPath);//本地存储backurl
                
                this.$router.push({path : '/login/index', query: {projectId: this.projectId, passKey: this.passKey}});
            } else {
                
                if (value.type == 'event') {
                    this.$set(this.normalDownObj.data, 'did', value.id);

                    this.downDataObj = this.normalDownObj;
                } else if (value.type == 'booth') {
                    this.$set(this.boothDownObj.data, 'bankId', value.bankId);
                    this.$set(this.boothDownObj.data, 'boothId', value.moduleId);
                    this.$set(this.boothDownObj.data, 'datumId', value.id);

                    this.downDataObj = this.boothDownObj;
                }

                this.$refs.datadown.hideMaskShadow();
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

@import "../../common/stylus/function.styl"

.listCol ul.in-list li
    padding: 0px !important
    a
        padding: 14px 0
    .list-handle
        height: 92px
        line-height: 92px
        border-left-px(1px, rgba(0,0,0,0.05))
       i
           font-size: 18px
           color: #f35b00
</style>
