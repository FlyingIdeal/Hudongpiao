<template>
    <div>
        <div class="header">
            <div class="head-back">
                <div class="head-back-icon" @click="routerBack"><span title="首页" v-text="$t('HomePage.Home')" v-if="wxShare == 'true'"></span><i class="icon-leftarrow" v-if="wxShare != 'true'"></i></div>
                <h2 class="headerTitle" title="展位地图" v-text="$t('Exhibitor.BoothMap')"></h2>
                <div class="Occupy"><router-link v-if="boothGuideStatus" class="tolink" :to="{path:'/map/guide', query:{projectId: projectId, passKey: passKey}}" title="参观指南" :class='$t("CommonUse.TransSize")'>{{$t("Exhibitor.TourGuide")}}</router-link></div>
            </div>
        </div>
        <div class="mapIndex topSeat">
            <load-state v-show="loadState" :content="$t('ExhibitsDetail.tip')"></load-state>
            <div class="map-select" v-show="!loadState">
                <div class="map-filter">
                    <select v-model="floor">
                        <option value="">选择楼层</option>
                        <option v-for="value in floorList" :value="value.gid" v-text="value.desc"></option>
                    </select>
                </div>
                <div class="map-filter">
                    <select  v-model="special">
                        <option value="" title="筛选">{{$t("Exhibitor.Filter")}}</option>
                        <option value="my_sub_list" title="收藏">{{$t("Me.Favorites")}}</option>
                        <option value="sale" title="促销">{{$t("label.Sales")}}</option>
                        <option value="relate" title="同兴趣">{{$t("label.SameInterest")}}</option>
                        <option value="new" title="新展商">{{$t("label.newBooth")}}</option>
                    </select>
                </div>
            </div>
            <div class="map-center" v-show="!loadState">
                <div class="fengMap" id="fengMap" :style="{height:mapHeight}"></div>
                <div class="hide-logo"></div>
            </div>
            <div class="boothList" v-show="showList.length > 0 && !loadState">
                <div class="booth-list-close"><span :class="[boothShowFlag ? '': 'active']" @click="showToggle"></span></div>
                <div class="listCol" v-show="!boothShowFlag">
                    <ul class="in-list">
                        <li v-for="(value, key) in showList" :akey="key">
                            <router-link :to="{path:'/booth/detail', query:{projectId: projectId, passKey: passKey, boothId: value.id}}">
                                <div class="infro">
                                    <div class="photo"><i class="new" v-if="value.isNewBooth"></i><img v-if="value.comLogo" v-lazy="value.comLogo" /><img v-else src="~@/common/images/boothPhoto.png"></div>
                                    <div class="text">
                                        <h6 v-text="value.boothName"></h6>
                                        <p>{{value.catesList | toList}}</p>
                                        <p v-text="value.boothNum"></p>
                                        <div class="tag" v-if='value.saleStatus == "1" || value.cityStatus =="1" || value.relateStatus =="1"'>
                                            <i class="icon-label"></i>
                                            <span title="同城" class="orange" v-if='value.cityStatus =="1"'>{{$t("label.SameCity")}}</span><span title="同兴趣" class="green" v-if='value.relateStatus =="1"'>{{$t("label.SameInterest")}}</span><span title="促销" class="yellow" v-if='value.saleStatus =="1" '>{{$t("label.Sales")}}</span>
                                        </div>
                                    </div>
                                </div>
                            </router-link>
                            <!--暂时取消收藏按钮-->
                            <div class="list-handle"><i class="icon-rightarrow"></i></div>
                            <!-- <div class="list-handle"><v-heart :defaultIcon="defaultIcon" :activeIcon="activeIcon" v-on:toParCollectboothid="_toParCollectboothid" :favState="value.subFlag" :axiosParam="{url:url, data:{id: value.id, type: 'booth', projectId: projectId, userTk: userTk}}"></v-heart></div> -->
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>


import vHeart from '../module/heart/heart.vue'
import {mainUserTk, boothClassifyToList, commonAjaxFun} from '../../common/js/common.js'
import loadState from '../module/loadState/loadState.vue'//加载状态

export default {
    data(){
        return {
            loadState: true,
            defaultIcon: 'icon-heart',//收藏点选之前的状态
            activeIcon: 'icon-hearted icon_color',//点选周的选中状态
            url: '/userApi/watch',//点赞使用
            boothShowFlag: false,//展位列表的显示隐藏
            boothGuideStatus: false,//参观指南显示隐藏
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
            wxShare: `${this.$route.query.wxShare}`,//是否来自微信分享，如果是true，则返回首页，否则返回上一级
            userTk: mainUserTk,
            floor: '',//切换floor
            special: '',//切换筛选条件
            map:'',//map地图
            makelayer: '',//当前点坐标的maker
            mapHeight:'',//地图高度
            page: 1,//展位ajax请求页码
            defaultThemeName : '',//地图主题名字
            searchAnalyser: '',//搜索对象
            groupControl: '',//楼层控制
            imgUrl: require('@/common/images/blueImageMarker.png'),//默认图片地址
            locationImgUrl: require('@/common/images/map_new.png'),
            locationMarkerArr: [],//创建定位点标注对象数组
            floorList: [],//楼层数组
            showList: [],//筛选需要显示出来的列表
            queryFid: `${this.$route.query.fid}`,//url中是否带有fid
            boothDataList: []//展位列表
        }
    },
    components: {
        vHeart,
        loadState
    },
    filters: {
        toList: function(val) {
            return boothClassifyToList(val)
        }
    },
    activated() {
        //清除keep-alive对地图fid的缓存问题
        let aFid = this.$route.query.fid;
        if (aFid != undefined) {
            if (!(this.fromFullPath.indexOf('/booth/detail') > -1)) {

                let fidModel = this.findCoordinate(aFid); //根据Fid拿到当前fid数据对象
                this.filldata(fidModel) //地图标记筛选并且移动
                this.getBoothDetail(aFid); //获取展位详情列表

            }
        }

    },
    mounted(){

        this.mapHeight = ($(window).height() - 100) + 'px';//地图高度

        this.getBoothData()
    },
    watch: {
        floor: function(value) {
            if (!value) {
                return
            } else {
                this.changeTag('floor');
            }
        },
        special: function(value) {
            if (!value) {
                return
            } else {
                this.changeTag('special');
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
        InitFengMap: function() {
            //初始化地图
            let _this = this;

            _this.map = new fengmap.FMMap({
                container: document.getElementById('fengMap'),
                //mapServerURL: mapLink,
                mapThemeURL: 'https://source.fengmap.com/webtheme/',
                lazyCreateMode: true,//“懒创建” 模式
                noSideFaces: true,//只用2d模式
                defaultThemeName: _this.defaultThemeName,
                defaultViewMode: fengmap.FMViewMode.MODE_2D,
                // 默认比例尺级别设置为20级
                defaultMapScaleLevel: 20,
                //开发者申请应用下web服务的key
                key: 'f5edcfd79f11c45c5e359aa97fe3df43',
                //开发者申请应用名称
                appName: '灵一互动'
            });

            _this.map.openMapById(_this.defaultThemeName); //sceneId

            _this.loadState = false;

            _this.map.on('loadComplete', function() {

                //默认显示指南针
                _this.map.showCompass = true;

                _this.searchAnalyser = _this.map.searchAnalyser; //获取搜索类

                _this.map.viewMode = fengmap.FMViewMode.MODE_2D;

                // 点击指南针事件, 使角度归0
                _this.map.on('mapClickCompass', function() {
                    _this.map.rotateTo({
                        //设置角度
                        to: 0,
                        //动画持续时间，默认为。3秒
                        duration: .3
                    })
                });

                //创建楼层
                _this.createFloor(_this.map);

                //楼层控制控件配置参数
                _this.groupControl = new fengmap.buttonGroupsControl(_this.map, {
                    expand: false,
                    //默认在右下角
                    position: fengmap.controlPositon.LEFT_BOTTOM,
                    //默认显示楼层的个数
                    //showBtnCount: 1,
                    //位置x,y的偏移量
                    offset: {
                        x: 20,
                        y: 10
                    }
                });

                //地图点击事件
                _this.map.on('mapClickNode', function(event) {
                    //排除无用区域，墙，楼层等
                    if (event.nodeType == fengmap.FMNodeType.MODEL) {
                        //过滤类型为墙的model
                        if (event.typeID == '300000') {
                            return;
                        }

                        _this.getBoothDetail(event.FID); //获取展位详情列表
                        _this.filldata(event) //地图标记筛选并且移动

                    }
                })


                if (_this.queryFid != undefined && _this.queryFid != 'undefined') {
                    //如果参数有fig，则自动跳转到相应位置
                    let fidModel = _this.findCoordinate(_this.queryFid); //根据Fid拿到当前fid数据对象
                    _this.filldata(fidModel) //地图标记筛选并且移动
                    _this.getBoothDetail(_this.queryFid); //获取展位详情列表
                }
            });
        },
        showToggle: function(){
            //显示隐藏展位列表
            this.boothShowFlag = !this.boothShowFlag;
        },
        getBoothData: function() {
            //获取展位列表
            let _this = this;
            commonAjaxFun({
                url: '/boothApi/getBooths',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey,
                    userTk: _this.userTk,
                    searchVal: '',
                    page: 1,
                    cateId: [],
                    isSubFlag: '',
                    searchTag: '',
                    fid: ''
                }
            }).then((data) => {
                try {
                    let _data = data.data;
                    if (data.state == '0') {

                        _this.defaultThemeName = _this.fmMapGetTheme(_data.mapLink); //获取展位地图的mapid
                        _this.InitFengMap(); //初始化蜂鸟地图

                        _this.boothGuideStatus = _data.boothGuideStatus; //是否有参观指南

                    } else {
                        console.log(data.message)
                    }
                } catch (err) {
                    console.log(err)
                }
            })
        },
        getBoothDetail: function(fid) {
            //点击展位地图，拿到当前FID， 从而拿到展位信息
            if (!fid) {
                return false;
            }

            let _this = this;

            commonAjaxFun({
                url: '/boothApi/getBooths',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey,
                    userTk: _this.userTk,
                    searchVal: '',
                    page: 1,
                    cateId: [],
                    isSubFlag: '',
                    searchTag: '',
                    fid: fid
                }
            }).then((data) => {
                try {
                    let _data = data.data;

                    if (data.state == '0') {
                        _this.showList = _data.pageObj.rows;
                    } else {
                        _this.showList = [];
                        console.log(data.message)
                    }
                } catch (err) {
                    console.log(err)
                }
            })
        },
        filterBoothData: function(type, callback){
            //根据筛选条件，去获取展位列表
            let _isSubFlag = this.special == 'my_sub_list' ? 'my_sub_list' : '';//收藏
            let _type = this.special == 'my_sub_list' ? '' : type;
            
            let _this = this;
            commonAjaxFun({
                url: '/boothApi/getBooths',
                data: {
                    projectId: _this.projectId,
                    passKey: _this.passKey,
                    userTk: _this.userTk,
                    page:  _this.page,
                    isSubFlag: _isSubFlag,
                    searchTag: _type
                }
            }).then((data) => {
                try {
                    let _data = data.data;

                    console.log(data)

                    if(!_data) {
                        return;
                    }

                    if(data.state == '0'){

                        if(_this.page > _data.pageObj.totalPage) {
                            callback();

                        } else {
                            _this.boothDataList = _this.boothDataList.concat(_data.pageObj.rows);

                            _this.page++;
                            _this.filterBoothData(type, callback);//根据页码继续获取数据
                        }
                        
                    } else {
                        console.log(data.message)
                    }

                } catch(err){
                    console.log(err)
                }
            })
        },
        fmMapGetTheme: function(url){
            //强制处理url从而得到主题名字
            let _url = url || '';
            let _urlArr1 = url.split('mapid=');

            if(!_urlArr1){
                return '';
            }else {
                return _urlArr1[1];
            }

        },
        changeTag: function(type) {
            //切换楼层和筛选,根据type类型，判断是切换楼层还是切换筛选条件

            let _this = this;

            _this.removeLocationMarker();//清空标记地图数据

            if (type == 'floor') { //切换楼层

                _this.groupControl.changeFocusGroup(_this.floor);
                _this.addLocatImgMarker(); //重新标记

            } else if (type == 'special') { //切换筛选条件

                //切换筛选条件的时候，不管是否有楼层，都要获取展位列表数据
                _this.page = 1;
                _this.boothDataList = []; //重置展位列表
                
                _this.chooseMakeImage(_this.special); //选择图片

                _this.filterBoothData(_this.special, function() {
                    //获取所有展位数据之后，去蜂鸟地图里面得到fid对用的model
                    _this.addLocatImgMarker(); //重新标记
                });
            }

        },
        fidGetBoothId: function(){
            //根据点选的fid从而得到boothid]
            let _this = this;
            let resultArr = [];
            for(let i = 0; i < _this.boothDataList.length; i++) {
                resultArr.push(_this.boothDataList[i].fid)
            }
            return resultArr;
        },
        _toParCollectboothid: function(id, data) {
            //点赞
            if (!id) return;
            for (let i in this.showList) {
                if (id == this.showList[i].id) {
                    this.$set(this.showList[i], "subFlag", data);
                    break;
                }
            }
        },
        addLocatImgMarker: function(){
            //楼层元素添加图片之前筛选
            for(let i = 0; i < this.boothDataList.length; i++) {
                let _model = this.findCoordinate(this.boothDataList[i].fid);
                this.addLocationMarker(_model)
            }
        },
        removeLocationMarker: function(){
            //移除定位点标注
            for(let i = 0; i < this.locationMarkerArr.length; i++){
               this.map.removeLocationMarker(this.locationMarkerArr[i]);

                if(i == this.locationMarkerArr.length - 1){
                    this.locationMarkerArr = [];//切换标签之后数组重置
                }
            }
        },
        addLocationMarker: function(model){
            //添加特殊标记图片=创建定位点标注
            let _this = this;

            if(model.groupID != _this.floor) {
                return;
            }

            let locationMarker = new fengmap.FMLocationMarker({
                //设置图片的路径
                url: _this.locationImgUrl,
                //设置图片显示尺寸
                size:20,
                //设置图片高度
                height:10,
            });

            _this.map.addLocationMarker(locationMarker);

            locationMarker.setPosition({
                //设置定位点的x坐标
                x: model.mapCoord.x,
                //设置定位点的y坐标
                y: model.mapCoord.y,
                //设置定位点所在楼层
                groupID: _this.map.groupIDs[model.groupID],
                //groupID: _this.map.groupIDs[0],
                //groupID: _this.floor,
                //设置定位点的高于楼层多少
                zOffset:1
            });


            _this.locationMarkerArr.push(locationMarker);

        },
        findCoordinate: function(fid) {
            //根据fid精确查询
            try {

                if (!fid) {
                    return;
                }

                let searchReq = new fengmap.FMSearchRequest(fengmap.FMNodeType.MODEL); //设置查询地图元素类型

                searchReq.FID(fid);

                let _result;

                this.searchAnalyser.query(searchReq, function(request, result) { //result 为查询到的结果集。
                    _result = result[0]
                });

                return _result;

            } catch (e) {
                
            }

        },
        filldata: function(model) {
            //点选地图，拿到当前点的数据对象，可实现增加地图点的标记，并进行移动
            if (!model) {
                return;
            }

            this.addMarkers(model.groupID, model.mapCoord.x, model.mapCoord.y);

            let coord = {
                x: model.mapCoord.x,
                y: model.mapCoord.y,
                groupID: model.groupID
            }

            this.moveTo(coord); //定位跳转
        },
        addMarkers: function(gid, X, Y) {
            //添加地点Marker（地图自带蓝色点图片）

            let _this = this;

            _this.removeMarkers();

            let group = _this.map.getFMGroup(gid);

            //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
            _this.makelayer = group.getOrCreateLayer('imageMarker');

            let im = new fengmap.FMImageMarker({
                x: X,
                y: Y,
                url: _this.imgUrl,
                size: 32,
                callback: function() {
                    im.alwaysShow();
                }
            });

            _this.makelayer.addMarker(im);
        },
        removeMarkers: function() { //删除Marker
            //获取多楼层Marker
            this.map.callAllLayersByAlias('imageMarker', function(makelayer) {
                makelayer.removeAll();
            });
        },
        moveTo: function(coord) { //定位跳转
            this.map.visibleGroupIDs = [coord.groupID];
            this.map.focusGroupID = coord.groupID;
            this.map.moveTo(coord);
        },
        createFloor: function(_map) {
            //创建楼层
            let optionArr = [];

            for (let i = 0; i < _map.listGroups.length; i++) {
                if (_map.listGroups[i].gid) {
                    let _group = new Object();
                    _group.gid = _map.listGroups[i].gid;
                    _group.desc = _map.listGroups[i].desc;

                    optionArr.push(_group);
                }
            }
            this.floorList = optionArr;
            //this.floor = this.floorList[0].gid;
        },
        chooseMakeImage: function(type) {
            //选择图层图片
            if (!type) {
                return
            }

            let _locImg = '';

            switch (type) {
                case 'sale':
                    _locImg = 'map_sale';
                    break;
                case 'new':
                    _locImg = 'map_new';
                    break;
                case 'relate':
                    _locImg = 'map_relate';
                    break;
                case 'my_sub_list':
                    _locImg = 'map_heart';
                    break;
            }

            this.locationImgUrl = require('@/common/images/' + _locImg + '.png');
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.head-back-icon
    flex: 0 0 66px
    width: 66px
    text-align: left
    i, span
        display: inline-block
        width: 50px
        height: 50px
        line-height: 50px
        text-align: center
        vertical-align: top
.head-back .Occupy
    flex: 0 0 66px
    font-size: 14px
    color: #999

.map-select
    text-align: center
    padding: 10px 14px
    font-size: 0px
    background-color: #fff
    .map-filter
        display: inline-block
        width: 44%
        margin: 0 2%
        select
            box-sizing: border-box
            padding: 4px 10px
            border: 1px solid rgba(0,0,0,.15)
            font-size: 14px
            width: 100%
            color: #333
            height: 30px
            background-color: #FDFDFD
.map-center
    position: relative
    .hide-logo
        position: absolute
        right: 0px
        bottom: 0px
        width: 100%
        height: 50px
        background-color: #F1F2F7
.boothList
    position: fixed
    left: 0px
    bottom: 0px
    width: 100%
    .booth-list-close
        padding: 4px
        text-align: right
        span
            display: inline-block
            width: 36px
            height: 36px
            vertical-align: middle
            background-size: 36px 30px
            background-position: center
            background-repeat: no-repeat
            background-image: url('~@/common/images/map_up.png')
            &.active
                background-image: url('~@/common/images/map_down.png')
    .listCol
        overflow-x: hidden
        overflow-y: scroll
        background: #fff
        -webkit-overflow-scrolling: touch
        max-height: 124px
        height: 124px
        box-shadow: 0 -2px 4px rgba(0,0,0,.1)
</style>
