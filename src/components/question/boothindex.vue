<template>
    <div>
        <div class="header">
            <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')" v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
            <h2 class="headerTitle" v-text="$t('QuestionPage.Title')"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="question topSeat botSeat">
            <load-state v-if="loadState && !loginFlag"></load-state>
            <v-login v-if="loginFlag"></v-login>
            <v-question v-if="!loadState && !submitScuessFlag" v-on:childEvent="backQusitionData" :question = "questionObj" :type="'booth'"></v-question>
            <!--提交成功-->
            <div class="submit-success topSeat" v-if="submitScuessFlag">
                <div class="submit-success-icon"><img :src="stateTipsImg"></div>
                <h6 class="submit-success-text" v-text="stateText"></h6>
                <div class="submitButtom">
                    <a href="javascript:void(0);" @click="routerBack" class="submit" title="返回">{{$t("RegLogin.Back")}}</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import loadState from '../module/loadState/loadState.vue'//加载状态
import question from '../module/question/boothquestion.vue'
import logintips from '../module/loginTips/login.vue' //登录提示
import { mainUserTk, commonAjaxFun} from '../../common/js/common.js'

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            boothId: `${this.$route.query.boothId}`,
            bankId: `${this.$route.query.bankId}`,
            toptitle: `${this.$route.query.title}`,//头部
            wxShare: `${this.$route.query.wxShare}`,//是否来自微信分享，如果是true，则返回首页，否则返回上一级
            loadState: true,//初次进页面加载中
            loginFlag: false,//判断是否登陆
            submitScuessFlag: false,//提交成功
            stateTipsImg: '',//提交成功或失败提示图片
            stateText: '',//提交成功或失败提示文字
            answerCookieSign: '',//cookie存储判断是否回答过问卷
            questionObj: ''//问卷对象
        }
    },
    components: {
        loadState: loadState,
        vQuestion: question,
        vLogin: logintips
    },
    mounted(){
        //判断当前是否登陆，如果登陆加载请求问卷列表
        this.answerCookieSign = 'HDPBOOTH' + this.projectId + this.boothId;//用于存储cookie

        if(!this.loginState){
            this.loginFlag = true;
        } else {

            let _hasAnswerSign = localStorage.getItem(this.answerCookieSign);
            //判断是否回答过问卷
            if(!!_hasAnswerSign) {
                //已经回答过问题
                this.loadState = false;
                this.submitScuessFlag = true;
                this.stateTipsImg = require('@/common/images/warn.png');
                this.stateText = this.$t('QuestionPage.FinishSurvey');
            } else {
                this.getBoothQuestion();
            }
        }

    },
    methods: {
        routerBack: function(){
            if(this.wxShare == 'true'){
                this.$router.push({path : '/home/index', query: {projectId: this.projectId, passKey: this.passKey}});//主页
            } else {
                this.$router.go(-1);
            }
        },
        backQusitionData: function(val){
            //问卷提交
            let _this = this;

            _this.$layer.loading()

            commonAjaxFun({
                url: '/boothApi/questionsSubmit',
                data: {
                    bankId: _this.bankId,
                    data: val,
                    projectId: _this.projectId,
                    userTk: mainUserTk
                }
            }).then((data) => {
                _this.$layer.close();
                _this.submitScuessFlag = true;
                if(data.state == '0'){
                    //提交成功
                    _this.stateTipsImg = require('@/common/images/success.png');
                    _this.stateText = _this.$t('QuestionPage.SubSuccess');
                    localStorage.setItem(_this.answerCookieSign, _this.answerCookieSign);

                }else{
                    //提交失败
                    _this.stateTipsImg = require('@/common/images/warn.png');
                    _this.stateText = data.message;
                }
            })
        },
        getBoothQuestion: function(){
            //获取展位问卷
            let _this = this;
            commonAjaxFun({
                url: '/boothApi/getQuestions',
                data: {
                    userTk: mainUserTk,
                    projectId: _this.projectId,
                    boothId: _this.boothId,
                    bankId: _this.bankId
                }
            }, 200).then((data) => {

                let _data = data.data;
                _this.loadState = false;

                if(data.state == '0'){
                    _this.questionObj = _data;
                } else {
                    console.log(data.message)
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.submitButtom
    position: fixed
    left: 0px
    bottom: 0px
    width: 100%
    a.submit
        display: block
        height: 50px
        line-height: 50px
        background-color: #f35b00
        color: #fff
        font-size: 18px
        text-align: center
.submit-success
    text-align: center
    color: #999
    font-size: 14px
    .submit-success-icon
        margin-top: 140px
        img
            width: 100px
    .submit-success-text
        font-size: 18px
        margin: 30px auto 10px

</style>
