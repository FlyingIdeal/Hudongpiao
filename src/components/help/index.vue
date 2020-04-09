<template>
    <div>
        <div class="header">
            <v-loginicon></v-loginicon>
            <h2 class="headerTitle" v-text="toptitle"></h2>
            <div class="Occupy"></div>
        </div>
        <div class="topSeat botSeat">
            <load-state v-show="loadState"></load-state>
            <div class="help" v-show="!loadState">
                <h3 class="console-txt-h3" title="联系人">{{$t("HelpPage.Contact")}}</h3>
                <div class="shadow">
                    <div class="help-list">
                        <p><i class="icon-name"></i><span title="主办方联系人">{{Infro.organizersName}}({{$t("HelpPage.Organizers")}})</span></p>
                        <p><a :href="Infro.organizersPhone | fomartPhone"><i class="icon-mobile"></i><span v-text="Infro.organizersPhone"></span></a></p>
                        <p><a :href="Infro.organizersEmail | fomartEmail"><i class="icon-email"></i><span v-text="Infro.organizersEmail"></span></a></p>
                    </div>
                    <div class="help-list" v-for="val in thisModule.contacts">
                        <p v-if="val.name"><i class="icon-name"></i><span v-text="val.name"></span></p>
                        <p v-if="val.phone"><a :href="val.phone | fomartPhone"><i class="icon-mobile"></i><span v-text="val.phone"></span></a></p>
                        <p v-if="val.email"><a :href="val.email | fomartEmail"><i class="icon-email"></i><span v-text="val.email"></span></a></p>
                    </div>
                </div>
                <h3 class="console-txt-h3" v-if="helpText" title="帮助信息">{{$t("HelpPage.Information")}}</h3>
                <div class="shadow" v-if="helpText"><v-Brief :content="helpText"></v-Brief></div>
                <div class="noMoreData" v-if="!thisModule">{{$t("CommonUse.hasNoDate")}}</div>
            </div>
        </div>
        <v-footer :showClass="'mine'"></v-footer>
    </div>
</template>

<script>

import vBrief from '../module/brief/brief.vue'
import loadState from '../module/loadState/loadState.vue'//加载状态
import vLoginicon from '../module/loginicon/loginicon.vue'
import vFooter from "../module/footer/footer"
import { commonAjaxFun, textAreaToHtml } from '../../common/js/common.js'

export default {
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            childId: `${this.$route.query.childId}`,
            type: `${this.$route.query.type}`,
            childpassKey: `${this.$route.query.childpassKey}`,
            loadState: true,//初次进页面加载中
            Infro:'',//会议基本信息
            thisModule: '',//当前模块对象
            helpText: '',//帮助信息
            toptitle: `${this.$route.query.title}`//头部
        }
    },
    components: {
        vBrief,
        loadState,
        vLoginicon,
        vFooter
    },
    filters: {
        fomartPhone: function(val){
            if(!val)return;

            return `tel:${val}`;
        },
        fomartEmail: function(val){
            if(!val)return;

            return `mailto:${val}`;
        }
    },
    methods: {
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
                    _this.loadState = false;

                    if (data.state == '0') {
                        _this.Infro = _data.basicInfo;
                    } else {
                        console.log(data.message);
                    }

                } catch(e) {
                    console.log(e)
                }
                
            })
        },
        getDataChildren: function(){
            //停用vuex，改用公用ajax请求
            let _this = this;
            commonAjaxFun({
                url: '/eventapi/during/getDataChildren',
                data: {
                    projectId: _this.projectId,
                    moduleId: _this.childId,
                    passKey: _this.childpassKey,
                    type: _this.type
                }
            }).then((data) => {
                let _data = data.data;

                if (data.state == '0') {
                    _this.thisModule = _data;

                    if (_data.caption.length > 0) {
                        _this.helpText = textAreaToHtml(_data.caption[0].caption);
                    }

                } else {
                    console.log(data.message);
                }
            })
        }
    },
    mounted(){
        this.getDataChildren();
        this.getChildrenProject()
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/function.styl"
.help
    h3.console-txt-h3
        font-size: 13px
        background: #fafafa
    .help-list
        p:last-child
                padding-bottom: 14px

    .quotetext
        padding: 10px
</style>
