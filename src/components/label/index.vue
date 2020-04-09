<template>
    <div>
        <div class="header">
            <h2 class="headerTitle" v-if="headerTitle" v-text="headerTitle"></h2>
        </div>
        <div class="topSeat botSeat">
            <h3 class="console-h3-from" v-show="yubaoFlag">完善信息让您能更好的使用系统功能</h3>
            <div class="create-form">
                <v-label ref="labeldom" v-on:allSubmit="_allSubmit"></v-label>
            </div>
            <div class="classifyButtom">
                <a href="javascript:void(0);" class="submit" @click="submit">提交</a>
                <router-link class="reset" :to="{path:'/home/index', query:{projectId: projectId, passKey: passKey}}">直接进入首页</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import {commonAjaxFun} from '../../common/js/common.js'
import vLabel from '../module/label/label.vue'//个人标签

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            headerTitle: '',//title文字
            yubaoFlag: false,//预报名
            labelResult: ''//结果
        }
    },
    components: {
        vLabel
    },
    mounted(){
        window.document.body.style.backgroundColor = '#fff';
        this.getIsYuBaoMing();
    },
    destroyed(){
        window.document.body.style.backgroundColor = '#e6e6e6';
    },
    methods: {
        _allSubmit: function(val){
            //从vlabel拿到所有的值
            this.labelResult = JSON.stringify(val);
        },
        submit: function(){
            //提交
            
            let _this = this;
            
            _this.$refs.labeldom.submit();//调用label中的submit方法

            if(!_this.labelResult) {
                //空值
                return false;
            }

            _this.$layer.loading('正在提交，请稍候！');

            commonAjaxFun({
                url: '/userForm/submitForm',
                data: {
                    formVal: _this.labelResult
                }
            }).then((data) => {
                try {
                    if(data.state == '0'){
                        _this.$layer.toast({content: '提交成功'});

                        setTimeout(function() {
                            _this.$router.push({path : '/home/index', query: {projectId: _this.projectId, passKey: _this.passKey}});//主页

                        }, 1000);

                    } else {
                        _this.$layer.toast({content: data.message});
                    }

                } catch(err){
                    console.log(err)
                }
            })

        },
        getIsYuBaoMing: function(){
            //判断当前是否预报名，从而改变title,和-完善信息让您能更好的使用系统功能、
            let _this = this;
            commonAjaxFun({
                url: '/userForm/getIsYuBaoMing',
                data: {}
            }).then((data) => {
                try {
                    if(data.state == "0"){

                        if(data.data){
                            _this.headerTitle = '预报名';
                            _this.yubaoFlag = false;
                        } else {
                            _this.headerTitle = '完善信息';
                            _this.yubaoFlag = true;
                        }

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

<style lang="stylus" rel="stylesheet/stylus">
h3.console-h3-from
    font-size: 16px
    text-align: center
    padding: 10px 0
.classifyButtom
    position: fixed
    left:0px
    bottom: 0px
    width: 100%
    height: 52px
    font-size:0px
    a
        font-size: 16px
        display: inline-block
        width: 50%
        height: 52px
        line-height: 52px
        text-align: center
        color: #666
        background-color: #E6E6E6
        &.submit
            color: #fff
            background-color: #F35B00
</style>
