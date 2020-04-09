<template>
    <div class="classifyNav">
        <ul>
            <li v-for="item in list" >
                <template v-if = "item.FrontEnd == 'level_1'">
                    <div class="level">
                        <p class="overText" @click="open(item,$event)">
                            <i class="add" :class="[item.openMark ? 'icon-reduce' : 'icon-plus']"></i>
                            <span v-text='item.name'></span>
                        </p>
                        <i v-if="type != 'boothclassify'" class="all" :class="[item.choiceMark ? 'icon-checked' : 'icon-check']"  @click="all(item,$event)"></i>
                    </div>
                    <ul :style="item.openMark ? 'display:block' : 'display:none'">
                        <li v-for="item2 in item.children">
                            <template v-if = "item2.FrontEnd == 'level_1'" >
                                <div class="level">
                                    <p class="overText"  @click="open(item2,$event)">
                                        <i class="add" :class="[item2.openMark ? 'icon-reduce' : 'icon-plus']"></i>
                                        <span v-text='item2.name'></span>
                                    </p>
                                    <i v-if="type != 'boothclassify'" class="all" :class="[item2.choiceMark ? 'icon-checked' : 'icon-check']"  @click="all(item2,$event)"></i>
                                </div>
                                <ul :style="item2.openMark ? 'display:block' : 'display:none'">
                                    <li v-for="item3 in item2.children" v-if = "item3.FrontEnd == 'level_3'" >
                                        <div class="level" @click="single(item3,$event)" :class="{'select':item3.choiceMark}"><p class="overText"><span v-text='item3.name'></span></p></div>
                                    </li>
                                </ul>
                            </template>
                            <template v-if = "item2.FrontEnd == 'level_3'" >
                                <div class="level" @click="single(item2,$event)" :class="{'select':item2.choiceMark}"><p class="overText"><span v-text='item2.name'></span></p></div>
                            </template>
                        </li>
                    </ul>
                </template>
                <template v-if = "item.FrontEnd == 'level_3'">
                    <div class="level" @click="single(item,$event)" :class="{'select':item.choiceMark}"><p class="overText"><span v-text='item.name'></span></p></div>
                </template>
            </li>
        </ul>
    </div>
</template>
<script>

import {getListTrees, commonAjaxFun} from '../../../common/js/common.js'

export default {
    props:{
        type: String,
        clickSingle: String,
        interestId: Array
    },
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            showClassFlag: false,//分类的显示隐藏
            list: [],//列表数据
            originList: [],
            categoryId:[]
        }
    },
    created: function(){
        this.getClassifyData()
    },
    methods: {
        getClassifyData: function() {
            //获取展位分类
            let _this = this;
            commonAjaxFun({
                url: '/boothApi/getAllCategory',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey
                }
            }).then((data) => {
                try {
                    let _data = data.data;
                    if (data.state == '0') {
                        _this.list = getListTrees(_data, 0);
                        _this.originList = _this.list.slice()
                    }
                } catch (err) {
                    console.log(err)
                }
            })
        },
        open: function(itemdata, event){
            $(event.target).parents("div.level").next().slideToggle(100)
            this.$set(itemdata, "openMark", !itemdata.openMark);
        },
        all: function(itemdata, event) {
            let _this = this
            _this.$set(itemdata, "choiceMark", !itemdata.choiceMark);
            ChooseChildNodes(itemdata.children)

            function ChooseChildNodes(item) {
                if (item) {
                    for (let i = 0; i < item.length; i++) {
                        _this.$set(item[i], "choiceMark", itemdata.choiceMark);
                        ChooseChildNodes(item[i].children)
                    }
                }
            }
            this.isAllA(this.list);
        },
        isAllA: function(allData) {
            let _this = this
            allChoice(allData);

            function allChoice(item) {
                if (item) {

                    for (let i = 0; i < item.length; i++) {
                        if (item[i].children.length > 0) {
                            allChoice(item[i].children)
                            if (isChildNodes(item[i].children)) {

                                _this.$set(item[i], "choiceMark", true);
                            } else {
                                _this.$set(item[i], "choiceMark", false);
                            }
                        }
                    }
                }
            }

            function isChildNodes(item) {
                for (let k = 0; k < item.length; k++) {
                    if (!item[k].choiceMark) {
                        return false;
                    }
                }
                return true;
            }
        },
        single: function(itemdata, parentItem, event) {
            let _this = this;
            if (_this.clickSingle == 'true') {
                //只能单选
                clearChosice(_this.list)

                function clearChosice(item) {
                    if (item) {
                        for (var k = 0, maxK = item.length; k < maxK; k++) {
                            _this.$set(item[k], "choiceMark", false);
                            clearChosice(item[k].children)
                        }
                    }
                }

                _this.$set(itemdata, "choiceMark", !itemdata.choiceMark);

            } else {
                _this.$set(itemdata, "choiceMark", !itemdata.choiceMark);
                _this.isAllA(_this.list);
            }

        },
        showClassFn: function(){
            //分类显示隐藏
            this.showClassFlag = !this.showClassFlag;
        },
        submit: function(){
            this.showClassFn();
            let tempArry = [];
            let choiceList = pitchOn(this.list);
            let classifyName = [];//分类名字，在创建分类时使用
            this.categoryId = [];

            let tempName = [];
            let choiceName = pitchStr(this.list);
            let choiceStr = "";

            for (let i = 0; i < choiceList.length; i++) {
               this.categoryId.push(choiceList[i].id);
               classifyName.push(choiceList[i].name)
            }

            for (let j = 0, maxj = choiceName.length; j < maxj; j++) {
                if (j == maxj - 1) {
                    choiceStr += choiceName[j].name;
                } else {
                    choiceStr += choiceName[j].name + "、";
                }
            }

            //获取选中的ID
            function pitchOn(item) {
                if (item) {
                    for (let k = 0; k < item.length; k++) {
                        if (item[k].children.length == 0 && item[k].choiceMark) {
                            tempArry.push(item[k]);
                        }
                        pitchOn(item[k].children)
                    }
                }
                return tempArry;
            }

            // 获取选中的最高级
            function pitchStr(item) {
                if (item) {
                    for (let k = 0, maxK = item.length; k < maxK; k++) {
                        if (item[k].choiceMark) {
                            tempName.push(item[k]);
                            continue;
                        }
                        pitchStr(item[k].children)
                    }
                }
                return tempName;
            }

            // console.log(this.categoryId)
            this.$emit('getClassify', this.categoryId,choiceStr);
            this.$emit('getClassifyName', classifyName);
        },
        reset: function() {
            let _this = this
            reset_all(_this.list)
            reset_openMark(_this.list)

            // console.log(JSON.parse(JSON.stringify(_this.list)))
            function reset_all(item) {
                if (item) {
                    for (let k = 0; k < item.length; k++) {
                        _this.$set(item[k], "choiceMark", false);
                        reset_all(item[k].children)
                    }
                }
            }

            function reset_openMark(item) {
                if (item) {
                    for (let i = 0; i < item.length; i++) {
                        if (item[i].children.length > 0) {
                            reset_openMark(item[i].children)
                            _this.$set(item[i], "openMark", false);
                        }
                    }
                }
            }

        },
        allChoice: function(item) {
            let _this = this;

            if (item) {
                for (let i = 0; i < item.length; i++) {
                    if (item[i].children.length > 0) {
                        _this.allChoice(item[i].children)
                        if (_this.isChildNodes(item[i].children)) {
                            _this.$set(item[i], "openMark", !item[i].openMark);
                        }
                    }
                }
            }
        },
        openMark_Fn: function(item) {
            let _this = this;
            if (item) {
                for (let i = 0; i < item.length; i++) {
                    if (item[i].children.length > 0) {
                        _this.openMark_Fn(item[i].children)
                        if (_this.isopenMark(item[i].children)) {
                            _this.$set(item[i], "openMark", !item[i].openMark);
                        }
                    }
                }
            }
        },
        isopenMark: function(item) {
            for (let i = 0; i < item.length; i++) {
                if (!!item[i].openMark) {
                    return true;
                }
            }
            return false;
        },
        isChildNodes: function(item) {
            for (let i = 0; i < item.length; i++) {
                if (!!item[i].choiceMark) {
                    return true;
                }
            }
            return false;
        },
        choiceMark: function(item,number){
            let _this = this;
            if (item) {
                for (let i = 0; i < item.length; i++) {
                    _this.choiceMark(item[i].children, number)
                    if (item[i].id == number) {
                        _this.$set(item[i], "choiceMark", true);
                    }
                }
            }
        }
    },
    watch: {
        interestId: function(val) {
            let _this = this;
            this.reset()
            if(val.length > 0) {
                for(let i = 0; i < val.length; i++) {
                    _this.choiceMark(_this.list, val[i]);
                }

                _this.allChoice(_this.list);
                _this.openMark_Fn(_this.list);
                
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

@import "../../../common/stylus/function.styl"
.classifyBar
    .classifyNav
        position: absolute
        left: 0px
        top: 0px
        bottom: 52px
        overflow-x: hidden
        overflow-y: scroll
        width: 100%
        -webkit-overflow-scrolling: touch
        li
            font-size: 14px
            line-height: 40px
            margin-left: 20px
            li
                margin-left: 30px
        .level
            display: flex
            border-bottom:1px solid  rgba(0, 0, 0, 0.05)
        p.overText
            display: flex
            flex: 1
            position: relative
            i.add
                flex: 0 0 30px
                width: 30px
                height: 40px
                color: #f35b00
                line-height: 40px
                display: inline-block
                text-align: center
            span
                flex: 1
        i.all
            display: inline-block
            flex: 0 0 40px
            width: 40px
            height: 40px
            text-align: center
            line-height: 40px
            font-size: 16px
            color: #929292
        ul div.select
            position:relative
            border-bottom:1px solid #F35B00;
            color:#F35B00
            &:after
               position:absolute;
               right:0;
               top:0;
               padding:0 10px 0 5%;
               content: "\e609";
               font-family:"iconfont" !important;
               font-size:16px
               font-style:normal
               -webkit-font-smoothing:antialiased
               -moz-osx-font-smoothing:grayscale
               color:#F35B00
        i.icon-checked 
            color: #f35b00
</style>
