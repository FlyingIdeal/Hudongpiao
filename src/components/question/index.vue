<template>
    <div>
        <div class="header">
            <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')" v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
            <h2 class="headerTitle" v-text="toptitle"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="question topSeat botSeat">
            <load-state  v-if="loadState && !loginFlag"></load-state>
            <v-login  v-if="loginFlag"></v-login>
            <v-question v-if="questionEmpty && questionObj && !loginFlag && !submitScuessFlag" v-on:childEvent="backQusitionData" :question = "questionObj"></v-question>
            <div class="noMoreData" title="暂无数据" v-if="!questionEmpty  && !loginFlag">{{$t("CommonUse.hasNoDate")}}</div>
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
import headTitle from '../module/head/headTitle.vue'//公共头部
import question from '../module/question/question.vue'
import logintips from '../module/loginTips/login.vue' //登录提示
import { mainUserTk, commonAjaxFun } from '../../common/js/common.js'


export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            childId: `${this.$route.query.childId}`,//子模块id
            toptitle: `${this.$route.query.title}`,//头部
            type: `${this.$route.query.type}`,
            wxShare: `${this.$route.query.wxShare}`,//是否来自微信分享，如果是true，则返回首页，否则返回上一级
            loginFlag: false,//是否登录
            loadState: true,//初次进页面加载中
            submitScuessFlag: false,//提交成功
            stateTipsImg: '',//提交成功或失败提示图片
            stateText: '',//提交成功或失败提示文字
            answerCookieSign: '',//cookie存储判断是否回答过问卷
            questionObj: '',//问卷对象
            questionEmpty:false
        }
    },
    components: {
        loadState: loadState,
        headTitle: headTitle,
        vQuestion: question,
        vLogin: logintips
    },
    mounted(){

        this.answerCookieSign = 'HDPQUESTION' + this.childId; //用于存储cookie

        let _hasAnswerSign = localStorage.getItem(this.answerCookieSign);

        //判断是否回答过问卷
        if (!!_hasAnswerSign) {
            //已经回答过问题
            this.loadState = false;
            this.submitScuessFlag = true;
            this.stateTipsImg = require('@/common/images/warn.png');
            this.stateText = this.$t('QuestionPage.FinishSurvey');
            this.questionEmpty = true
        } else {
            this.getQuestion();
        }
    },
    methods: {
        getQuestion: function(){
            //获取展位问卷
            let _this = this;
            commonAjaxFun({
                url: '/interact/common/getData',
                data: {
                    userTk: mainUserTk,
                    moduleId: _this.childId,
                    projectId: _this.projectId,
                    type: _this.type
                }
            }, 200).then((data) => {

                let _data = data.data;

                _this.loadState = false;

                if(_data.questions && _data.questions.length  == 0 ){
                    _this.questionEmpty = false
                }else{
                    _this.questionEmpty = true
                }

                if (data.state == '9001') {
                    //请先登录
                    _this.loginFlag = true;
                } else {
                    _this.loginFlag = false;
                    _this.questionObj = _data;
                }

            })
        },
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
            _this.$layer.loading();

            commonAjaxFun({
                url: '/interact/interactQuestionPure/saveData',
                data: {
                    data: val,
                    projectId: _this.projectId,
                    userTk: mainUserTk
                }
            }).then((data) => {

                _this.$layer.close();
                _this.submitScuessFlag = true;

                if (data.state == '0') {
                    //提交成功
                    _this.stateTipsImg = require('@/common/images/success.png');
                    _this.stateText = _this.$t('QuestionPage.SubSuccess');
                    localStorage.setItem(this.answerCookieSign, this.answerCookieSign);

                } else {
                    //提交失败
                    _this.stateTipsImg = require('@/common/images/warn.png');
                    _this.stateText = data.message;
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
