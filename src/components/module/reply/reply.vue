<template>
    <div>
        <transition name="move">
            <div class="main-reply" v-show="showFlag">
                <div class="reply-textarea">
                    <textarea id="textString" :placeholder="placeholderTxt"></textarea>
                </div>
                <div class="replay-btn">
                    <a href="javascript:void(0)" class="cancleBtn" @click="hideMaskShadow" title="取消">{{$t("RegLogin.Cancel")}}</a>
                    <a href="javascript:void(0)" class="sendBtn" @click="contentSubmit($event)" canclick="true" title="发送">{{$t("RegLogin.SendBtn")}}</a>
                </div>
            </div>
        </transition>
        <div class="mask-shadow" v-show="showFlag" @click="hideMaskShadow"></div>
    </div>
</template>
<script>
import {CountChineseCharacters, autoAddEllipsis, mainUserTk, commonAjaxFun} from '../../../common/js/common.js'

export default {
    props: {
        fromType: String,//用于chat页面，区分ajax的url
        childId: String,//模块id,日程评论是用子id
        limit: Number,//限制字数
        moduleType: String,//评论类型
        moduleId: String,//评论id
        level: Number,
        parentId: String,
        placeholder: String,//回复：某某
        touserId: String//评论者id
    },
    data () {
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            showFlag: false//控制输入模块的显示隐藏
        }
    },
    mounted(){
        this.initTextEvent()
    },
    computed: {
        placeholderTxt: function(){
            return this.placeholder || this.$t('Messaging.SayWithYou');//积极参与，活动有你...
        }
    },
    methods: {
        contentSubmit: function(event){//提交评论
            let _this = this;
            let _val = $.trim($('#textString').val());
            let _data;
            let _url;

            if(!_val) {
                _this.$layer.toast({content: _this.$t('layerTips.ContentEmpty')});//ContentEmpty
                return;
            }

            //防止重复点击
            let _dom = event.currentTarget;
            let _canclick = _dom.getAttribute('canclick');
            if(_canclick == 'false') {
                return;
            }
            _dom.setAttribute('canclick', 'false');

            let _mainId = _this.childId ? _this.childId : _this.projectId;

            if(_this.fromType == 'chat') {
                //对话
                
                _this.$layer.loading();

                _url = '/messageTool/chat/send';

                _data = {
                    userTk: mainUserTk,
                    toUserid: _this.touserId,
                    content: _val
                }
            } else {

                _this.$layer.loading(_this.$t('layerTips.Proceeding'));//正在提交，请稍候！

                _url = '/interactTopic/saveContent';

                _data = {
                    projectId: _mainId,
                    userTk: mainUserTk,
                    moduleType: _this.moduleType,
                    moduleId: _this.moduleId,
                    content: _val,
                    parentId: _this.parentId,
                    level: _this.level,
                    touserId: _this.touserId
                }
            }

            commonAjaxFun({
                url: _url,
                data: _data
            }, 500).then((data) => {
                try {

                    _this.$layer.close();
                    _this.hideMaskShadow();

                    let _mes = data.message;
                    let _state = data.state;


                    if (_state == '0'){
                        
                        _mes = _this.$t('Moment.CommentPosted');//评论成功

                        _this.$emit('replayReresh');//评论成功之后重刷新页面

                    } else if (_state == '10006') {
                        //评论频繁！
                        _mes = _this.$t('Moment.havaRest');//评论频繁！

                    } else if (_state == '10010'){
                        //此信息已被处理！
                        _mes = _this.$t('layerTips.ContentRemoved');//此信息已被处理！

                    } else if (_state == '10009'){
                        //您被举报违规，已禁止发言!
                        _mes = _this.$t('layerTips.CannotViolation');//您被举报违规，已禁止发言

                    }

                    if(_this.fromType != 'chat') {
                        _this.$layer.toast({content: _mes});
                    }


                    _dom.setAttribute('canclick', 'true');

                } catch(err){
                    console.log(err)
                }
            }, (err) => {
                _dom.setAttribute('canclick', 'true');
            })
        },
        hideMaskShadow: function(){
            this.showFlag = !this.showFlag;
            $('#textString').val('');
        },
        initTextEvent: function(){
            let _this = this;
            //初始化输入框事件
            $('#textString').bind('keyup keypress keydown input propertychange', function(e){
                let keyCode = e.keyCode || e.which || e.charCode;
                let ctrlKey = e.ctrlKey || e.metaKey;
                let _inthis = $(this);
                let content = _inthis.val();
                let max = _this.limit;
                let counter = CountChineseCharacters(content)

                if (ctrlKey || (keyCode == 8)) {
                    return true;
                } else if (CountChineseCharacters(window.getSelection().toString()) == (parseInt(max))) {
                    return true;
                } else if ((parseInt(max) - counter) <= 0) {
                    _inthis.val(autoAddEllipsis(content, parseInt(max)));
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.main-reply
    background-color: #fff
    width: 96%
    position: fixed
    left: 50%
    margin-left: -48%
    top: 10px
    z-index: 16
    border-radius: 8px
    padding: 10px 0
    &.move-enter-active, &.move-leave-active
        transition: all 0.1s linear
    &.move-enter, &.move-leave-active
        transform: translate3d(0, -100%, 0)
    .reply-textarea
        border-bottom: 1px solid #F2F2F2
        textarea
            padding: 0 2%
            width: 100%
            box-sizing: border-box
            height: 100px
            line-height: 18px
            font-size: 14px
    .replay-btn
        padding: 10px 10px 0
        text-align: right
        a
            display: inline-block
            padding: 2px 10px
            font-size: 12px
            margin-left: 10px
            color: #999
            border: 1px solid #999
            border-radius: 4px
            &.sendBtn
                color: #fff
                background-color: #F35B00
                border: 1px solid #F35B00
</style>
