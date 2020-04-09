<template>
    <div class="question-list-main">
        <div class="question-list-in">
            <template v-for="(value, key) in question.questions">
                <transition :name="animateName">
                    <div class="question-list" v-if="value.subjectType != '3'" v-show="questionNum == key" :subjectid="value.subjectid" :dataType = "value.subjectType" :isNo = "value.isNo" ref="questionList">
                        <div class="que-title shadow">
                            <h3><span>{{key + 1}}、</span><p v-text="value.title"></p></h3>
                            <div class="sort">{{ key + 1 }}/{{ question.questions.length }}</div>
                        </div>
                        <div class="opt-list shadow">
                            <template v-for="(item, index) in value.options">
                                <div class="in" :dataType = "value.subjectType" :optionid="item.optionid" :isother = "item.isother" :isMaxChoose="value.isMaxChoose" :maxChoose = "value.maxChoose" @click="clickAnswer($event)">
                                    <span class="num">{{ index | _optionNumToSerial}}</span>
                                    <p class="text" v-text="item.name"></p>
                                    <i :class="[value.subjectType == 1 ? 'icon-radio' : 'icon-check']"></i>
                                </div>
                                <div class="other" v-if="item.isother" style="display: none"><textarea></textarea></div>
                            </template>
                        </div>
                    </div>
                    <div class="question-list" v-else v-show="questionNum == key" :subjectid="value.subjectid" :dataType = "value.subjectType" :isNo = "value.isNo" ref="questionList">
                        <div class="que-title shadow">
                            <h3><span>{{key + 1}}、</span><p v-text="value.title"></p></h3>
                            <div class="sort">{{ key + 1 }}/{{ question.questions.length }}</div>
                        </div>
                        <div class="opt-list shadow">
                            <div class="other"><textarea maxlength="200"></textarea></div>
                        </div>
                    </div>
                </transition>
            </template>
        </div>
        <div class="question-handle">
            <a href="javascript:void(0);" class="pre" :class="{'no': questionNum == 0}" @click="preQuestion" title="上一题">{{$t("QuestionPage.Previous")}}</a>
            <a href="javascript:void(0);" class="next" @click="nextQuestion" v-text="nextText"></a>
        </div>
    </div>
</template>
<script>

import { optionNumToSerial } from '../../../common/js/common.js'
export default {
    props:{
        question: Object
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            questionNum: 0,//当前回答到第几题
            questionLength: `${this.question.questions.length}`,
            nextText: this.question.questions.length !== 1 ? this.$t("QuestionPage.Next") : this.$t("QuestionPage.Submit"),
            animateName: 'right'
        }
    },
    filters: {
        _optionNumToSerial: function(num){
            return optionNumToSerial(num)
        }
    },
    methods: {
        clickAnswer: function(event){
            //回答问题
            let obj = $(event.currentTarget);

            if(obj.attr('dataType') == '1'){//单选

                obj.siblings().removeClass('check').find('i').removeClass('icon-radioed');
                obj.addClass('check').find('i').addClass('icon-radioed');

                if(obj.attr('isother') == 'true'){//含有其他
                    obj.siblings('.other').show()
                } else {
                    obj.siblings('.other').hide()
                }

            } else if(obj.attr('dataType') == '2'){

                let checkLen = obj.siblings('.check').length;
                let _curMaxChoose = parseInt(obj.attr('maxChoose'));

                //最多可以选择
                if(checkLen == _curMaxChoose){
                    this.$layer.open({content:this.$t("QuestionPage.ChooseNoMore") + _curMaxChoose + this.$t("QuestionPage.Options"), skin: 'msg', time: 1000});//最多只能选择 2个选项
                    return;
                }

                obj.toggleClass('check').find('i').toggleClass('icon-checked');

                if(obj.attr('isother') == 'true'){//含有其他
                    obj.siblings('.other').toggle()
                }
            }
        },
        preQuestion: function(){
            //上一题
            if(this.questionNum <= 0){
                return false;
            } else {
                this.animateName = 'left';
                this.questionNum--
            }
        },
        nextQuestion: function(){
            //下一题
            if(this.questionNum >= this.questionLength - 1){
                this.submitData()
            } else {
                let _flag = this.checkAnswerQue();

                this.questionResult()

                //已经回答了问题
                if(_flag){
                    this.questionNum++;
                    this.animateName = 'right';
                } else {
                    this.$layer.open({content: this.$t("QuestionPage.EnterOption"), skin: 'msg', time: 1000});//请输入答案!
                }
            }
        },
        checkAnswerQue: function(){
            //检查是否回答问题

            let questionListDomArr = this.$refs.questionList;//选项列表
            let obj = $(questionListDomArr[this.questionNum]);//当前index的选项dom

            if (obj.attr('isNO') == 'true') { //必答题
                if (obj.attr("dataType") == '3') {

                    if (obj.find("textarea").val() !== '') {
                        return true
                    }

                } else if (obj.find('.check').length > 0) {

                    if (!obj.find(".other").is(':hidden')) {

                        if (obj.find("textarea").val() !== '') {
                            return true
                        } else {
                            return false
                        }

                    } else {
                        return true
                    }
                }

                return false

            } else {
                //选答题
                return true
            }
        },
        questionResult: function(){
            //全部问卷数据
            let _arr = new Array();
            let questionListDomArr = this.$refs.questionList;//选项列表

            $(questionListDomArr).each( (index, element) => {

                let _obj = new Object();
                let _this = $(element);

                _obj.subjectid = _this.attr('subjectid');


                if(_this.attr('dataType') == '3'){
                    _obj.content = _this.find('textarea').val();
                    _arr.push(_obj)

                } else {
                    _this.find('.check').each((key, value) => {
                        let optObj = new Object();
                        let optThis = $(value);

                        optObj.subjectid = _obj.subjectid;
                        optObj.optionid = optThis.attr('optionid');

                        if(optThis.attr('isother')) {
                            optObj.content = optThis.siblings('.other').find('textarea').val();
                        }

                        _arr.push(optObj);

                    })
                }
            });

            return _arr;
        },
        submitData: function(){
            //提交数据
       
            if(this.questionResult().length == 0){
                 this.$layer.toast({ content:this.$t('QuestionPage.tip') });
             }else{
                let _data = JSON.stringify(this.questionResult());
                //拿到这些数据返回到上一层
                this.$emit('childEvent', _data);
             }

        }
    },
    watch: {
        questionNum: function(){
            //监听题号变化，从而改变next的值
            if(this.questionNum == this.questionLength - 1){
                this.nextText = this.$t("QuestionPage.Submit");//提交
            } else {
                this.nextText = this.$t("QuestionPage.Next");//下一题
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

@import "../../../common/stylus/function.styl"
.question-list-main
    width:100%
    overflow: hidden  
.question-list
    transform: translate3d(0, 0, 0)
    &.right-enter-active
        transition: all 0.2s linear
    &.right-enter
        transform: translate3d(100%, 0, 0)
    &.right-leave-active
        transition: all 0s linear
    &.right-leave
        transform: translate3d(-100%, 0, 0)
    &.left-enter-active
        transition: all 0.2s linear
    &.left-enter
        transform: translate3d(-100%, 0, 0)
    &.left-leave-active
        transition: all 0s linear
    &.left-leave
        transform: translate3d(100%, 0, 0)
.que-title
    padding:20px 10px 6px
    background-color:#fff
    h3
        display: flex
        font-size: 17px
        span
            flex: 0 0 40px
            width: 40px
            height: 24px
            line-height: 24px
            text-align: center
        p
            line-height: 24px
            flex: 1
    .sort
        text-align: right
        margin-top: 6px
        font-size: 12px
.opt-list
    .in
        padding: 20px 10px
        display: flex
        line-height: 30px
        font-size: 18px
        border-bottom-px(1px, rgba(0, 0, 0, 0.05))
        &:last-child
            border-bottom: 0px
        .num
            flex: 0 0 30px
            width: 30px
            height: 30px
        i
            flex: 0 0 40px
            width: 40px
            height: 30px
            line-height: 30px
            text-align: center
            color: #929292
        p.text
            flex: 1
    .check
        i
            color: #f35b00
    .other
        padding: 10px
        background: #F2F2F2
        textarea
            display: block
            width: 100%
            height: 100px
            border-radius: 4px
            color: #333333
            box-sizing: border-box
            padding: 10px
            color: #333333
            line-height: 24px
            background-color: #fff
.question-handle
    position: fixed
    bottom: 0px
    left: 0px
    width: 100%
    display: flex
    a
        flex: 1
        display:inline-block
        color: #ffffff
        text-align: center
        height: 50px
        box-sizing: border-box
        line-height: 50px
        &.pre
            border-right-px(1px, rgba(255, 255, 255, 1))
            background-color: #F0772E
        &.next
            background-color: #F35B00
            border-left-px(1px, rgba(255, 255, 255, 1))
        &.no
            background-color: #c2c2c2


</style>
