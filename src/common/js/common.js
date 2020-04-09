import layer from 'vue-layer-mobile'
import VueCookie from 'vue-cookie'

/**
 * 测试服务器100上线前更改配置。
 * http://front.uwin.cc/
 */

/*export let api_url =  process.env.NODE_ENV == 'development' ? 'http://10.113.5.62:8080' : 'https://front.uwin.cc/api';
export let uwin_url =  process.env.NODE_ENV == 'development' ? 'http://10.113.5.62:8080' : 'https://front.uwin.cc';
export let land_url = process.env.NODE_ENV == 'development' ? 'http://10.113.5.62:8080' : 'https://em.uwin.cc'; 
export let open_wx_oauth = false;//如果是测试服务器，关闭微信授权 
*/

/**
 * 正式服务器上线前更改配置。
 * https://front.expoplus.com.cn/
 */
export let api_url =  process.env.NODE_ENV == 'development' ? 'http://localhost:8080' : 'https://front.expoplus.com.cn/api';
export let uwin_url =  process.env.NODE_ENV == 'development' ? 'http://localhost:8080' : 'https://front.expoplus.com.cn';
export let land_url = process.env.NODE_ENV == 'development' ? 'http://localhost:8080' : 'https://console.expoplus.com.cn'; 
export let open_wx_oauth = true; //如果是正式服务器，开启微信授权 




//导出公共变量
export const regEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;//邮箱正则
export const regNumber = /^[0-9]*$/;//数字
export const regPhoneNumber = /^1[345789]\d{9}$/;//手机
export const regPassword = /^[0-9a-zA-Z]{6,16}$/; //密码6-16个字母或数字
export const mainUserTk = VueCookie.get('EVENTUSERTK');//usertk


/**

需要单独微信分享的页面名字，需要和route里的名字对应
个人详情页面 - 》 attendDetail
展位详情页面-》 boothDetail
展品详情页面-》 productDetail
资料列表页面-》 data
嘉宾详情页面-> guestDetail
互动圈详情页面-> momentDetail
微海报页面-> posterIndex
日程详情页面-> scheduleDetail
日程详情发言页面->speakIndex
互动话题详情页面-> topicDetail

 */
export const wxShareSingle = ['attendDetail', 'boothDetail', 'productDetail', 'data', 'guestDetail', 'momentDetail', 'posterIndex', 'scheduleDetail', 'speakIndex', 'topicDetail'];


/**
 * [clearLocalStorage 进入首页的时候清除部分本地存储]
 * @param  {[type]} projectId [description]
 * @param  {[type]} passKey   [description]
 * @return {[type]}           [description]
 */
export function clearLocalStorage(projectId, passKey) {
    localStorage.removeItem('HDPSCHDULE' + projectId + passKey);//底导航日程
}

/**
 * [getQueryString 获取url的字符串]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
export function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * [isWeixn 判断是否为微信]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
export function isWeixn(){
    var ua = navigator.userAgent.toLowerCase();

    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

/**
 * 时间格式化
 * yyyy-MM-dd hh:mm:ss.S
 * @param  {[type]} time [description]
 * @param  {[type]} fmt  [description]
 * @return {[type]}      [description]
 **/
export function formatDate(time, fmt) {
    var date = new Date(time);
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
}


 /**
 * js截取字符串，中英文都能用
 * @param str：需要截取的字符串
 * @param len: 需要截取的长度
 */
export function InterceptString(str, len) {
    //length属性读出来的汉字长度为1
    if (str.length * 2 <= len) {
        return str;
    }
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if (strlen >= len) {
                return s.substring(0, s.length - 1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if (strlen >= len) {
                return s.substring(0, s.length - 2) + "...";
            }
        }
    }
    return s;
}

/**
 * 日程
 * @param  {[type]} date all [description]
 * @return {[type]}      [description]
 * {
    day:19
    hasDate:"no"
    week:"Tue"
 * }
 */
export function scheduleFormat(all){

    let dateArr = new Array();//存放时间日期
    let dataJsonArr = new Array();//存放匹配后的时间json数组对象

    let start = new Date((all[0].date).replace(new RegExp("-","gm"),"/"));
    let end = new Date((all[all.length - 1].date).replace(new RegExp("-","gm"),"/"));
    let diff = parseInt((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));//结束时间和开始时间天数差

    if(diff >= 0 && diff <= 7){
        let pre = parseInt((7 - diff) / 2);
        let next = Math.ceil((7 - diff) / 2);

        //开始时间补白
        for(let i = 1; i <= pre; i++) {
            let _s = start.getTime() - 1000*60*60*24*i;
            dateArr.push(_s);
        }

        //时间范围内
        for(let k = 0; k < diff; k++){
            let _s = start.getTime() + 1000*60*60*24*k;
            dateArr.push(_s);
        }

        //结束时间补白
        for(let m = 0; m < next; m++){
            let _s = end.getTime() + 1000*60*60*24*m;
            dateArr.push(_s);
        }
    } else {
       //时间范围内
        for(let z = 0; z <= diff; z++){
            let _s = start.getTime() + 1000*60*60*24*z;
            dateArr.push(_s);
        }
    }


    //匹配日程，从而提示哪个有日程
    for(let i = 0; i < dateArr.length; i++){

        let curJson = new Object();
        curJson.hasDate = 'no';

        curJson.day = new Date(dateArr[i]).getDate();
        curJson.yearmonth = formatDate(new Date(dateArr[i]), 'yyyy年MM月');
        curJson.yearmonthDate = formatDate(new Date(dateArr[i]), 'yyyy年MM月dd日');
        curJson.week = swtichWeekday(new Date(dateArr[i]).getDay());

        for(let j = 0; j < all.length; j++){
            let contentGettime = new Date((all[j].date).replace(new RegExp("-","gm"),"/"));
            if(contentGettime.getTime() == dateArr[i]){
                curJson.hasDate = 'yes';
                curJson.index = j
                continue;
            }
        }

        dataJsonArr.push(curJson)
    }

    return dataJsonArr;

}

/**
 * 返回星期
 * @param  {[type]} day [description]
 * @return {[type]}     [description]
 */
function swtichWeekday(day){
    let weekday = new Array(7);

    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    return weekday[day]
}

/**
 * 根据type类型得到对应的icon
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
export function chooseChildIcon(obj){

    let _moduleObj = {
        eventIntroModule: {
            //简介
            icon: 'icon-exhiprofiles',
            url: '/brief/index'
        },
        appScheduleModule: {
            //日程
            icon: 'icon-schedule',
            url: '/schedule/index'
        },
        guestModule: {
            //嘉宾
            icon: 'icon-guest',
            url: '/guest/index'
        },
        partnerModule: {
            //合作伙伴
            icon: 'icon-partners',
            url: '/partner/index'
        },
        helpModule: {
            //帮助中心
            icon: 'icon-help',
            url: '/help/index'
        },
        linkModule: {
            //自定义连接
            icon: 'icon-link',
            url: '/home/link'
        },
        newsModule: {
            //图文编辑
            icon: 'icon-tuwenedit',
            url: '/edit/index'
        },
        datumModule: {
            //下载
            icon: 'icon-dataheart',
            url: '/data/index'
        },
        appLiveGraphicModule: {
            //图文直播
            icon: 'icon-alerts',
            url: '/scene/index'
        },
        voteModule: {
            //投票
            icon: 'icon-vote',
            url: '/home/interactVote'
        },
        speekModule: {
            //互动发言
            icon: 'icon-interactspeek',
            url: '/home/interactSpeek'
        },
        questionModule: {
            //问卷
            icon: 'icon-question',
            url: '/question/index'
        }
    }


    let _obj = obj;
    let _objArr = new Array();

    if(obj.length == 0){
        return;
    }

    for(let v in _obj){
        let _bname = _obj[v].beanName;

        if(!!_moduleObj[_bname]){
            _obj[v]["icon"] = _moduleObj[_bname].icon;

            let _url = _moduleObj[_bname].url;

            if(_obj[v].beanName == "linkModule" && _obj[v].linkUrl != ""){
                let reg_url = /^(https?|http):\/\//;
                if (!reg_url.test(_obj[v].linkUrl)) {
                    _obj[v]["linkUrl"] = "http://" + _obj[v].linkUrl;
                }
            } else if(_obj[v].beanName == "linkModule" && _obj[v].linkUrl == ""){
                _obj[v]["linkUrl"] = "javascript:void(0);"
            } else {
                _obj[v]["linkUrl"] = _url + "?childId=" + _obj[v].projectId  + "&childpassKey=" + _obj[v].passKey + "&appId=" + _obj[v].appId + "&type=" + _obj[v].beanName + "&title=" + _obj[v].appName;
            }

            _objArr.push(_obj[v])

        }else{
            _obj[v]["icon"] = '';
            _obj[v]["linkUrl"] = '';
        }
    }
    return _objArr;

}

/**
 *  合作伙伴数据处理
 * [guestObjectToArr description]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
export function guestObjectToArr(arr){
    //处理嘉宾
    if(!arr){
        return false;
    }

    let _arr = new Array;

    for(let i in arr){
        for(let j = 0; j < arr[i].length; j++){
            _arr.push(arr[i][j]);
        }
    }

    return _arr;
}


/**
 * 分享时间设置，
 如果为同一天 则 2018/03/03 - 05:00 - 18:00
 否则分开写 2018/03/03- 05:00 - 2018/03/05 - 18:00
 * [wxShareTime 分享时间设置，]
 * @param  {[type]} starTime  [开始时间]
 * @param  {[type]} endTime [结束时间]
 * @return {[type]}      [description]
 */
export function wxShareTime(starTime,endTime){

    if( starTime.substring(0, 11) == endTime.substring(0, 11) ){
        return starTime.replace(/-/g, "\/") + " - " + endTime.substring(11,16).replace(/-/g, "\/")
    }else{
        return starTime.substring(0, 11).replace(/-/g, "\/") + " - " + endTime.substring(0, 11).replace(/-/g, "\/")
    }
}

/**
 * 筛选当前模块
 * [filterCurrentModule description]
 * @param  {[type]} arr  [description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
export function filterCurrentModule(arr, type){
    let _arr = new Array;

    for(let i = 0 ; i < arr.length; i++){
        if(arr[i].beanName == type){
            _arr = arr[i]
            break;
        }
    }

    return _arr;
}

/**
 * [filterDataImg description]
 * 过滤资料下载图片
 * @param  {[type]} val [description]
 * imgPath 图片路径
 * @return {[type]}     [description]
 */
export function filterDataImg(val){

    let imgPath = !!val ? val : 'other.png';

    let filePathArr = val.split(".");

    if (!filePathArr || filePathArr.length < 1) {
        return imgPath;
    }

    let suffix = filePathArr[filePathArr.length - 1].toLowerCase();
    switch (suffix) {
        case "jpg":
        case "jpeg":
            imgPath = 'jpg.png';
            break;

        case "png":
            imgPath = 'png.png';
            break;

        case "gif":
        case "bmp":
            imgPath = 'pic.png';
            break;

        case "doc":
        case "docx":
            imgPath = 'word.png';
            break;

        case "xls":
        case "xlsx":
            imgPath = 'excel.png';
            break;

        case "pdf":
            imgPath = 'pdf.png';
            break;

        case "ppt":
        case "pptx":
            imgPath = 'ppt.png';
            break;

        case "txt":
            imgPath = 'text.png';
            break;

        case "mp3":
            imgPath = 'other.png';
            break;

        case "rar":
            imgPath = 'rar.png';
            break;

        case "zip":
            imgPath = 'zip.png';
            break;

        case "com":
        case "com/":
        case "html":
            imgPath = 'link.png';
            break;

        default:
            imgPath = 'other.png';
            break;
    }

    return imgPath;
}

/**
 * [getListTrees description]
 * 展位树级有关函数
 * 把数据组合成json格式
 * @param  {[type]} list   [description]
 * @param  {[type]} number [description]
 * @return {[type]}        [description]
 */
export function getListTrees(list, number){

    function node(item) {
        var tempNode = [];
        for (var i = 0, max = list.length; i < max; i++) {
            if (list[i].parentCode == item) {
                tempNode.push(list[i])
            }
        }

        return tempNode;
    }

    function standardData(item) {
        if (item.length > 0) {
            var temp = [];
            for (var i = 0, max = item.length; i < max; i++) {
                temp = node(item[i].code);
                if (!item[i]['children']) {
                    item[i]['children'] = []
                }
                item[i]['children'] = temp;
                standardData(temp)
            }
        }
        return item;
    }

    function addLevel(item) {
        if (item.length > 0) {
            for (var i = 0, max = item.length; i < max; i++) {
                if (item[i].children.length > 0) {
                    item[i].FrontEnd = "level_1"
                } else {
                    item[i].FrontEnd = "level_3"
                }
                addLevel(item[i].children);
            }
        }
        return item;
    }

    return addLevel(standardData(node(number)));
}

/**
 * [englistOptionSerial description]
 * 选项序号1-24 转为 A - Y
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
export function optionNumToSerial(num){
    let arr = ["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I.", "J.", "K.", "L.", "M.", "N.", "O.", "P.", "Q.", "R.", "S.", "T.", "U.", "V.", "W.", "X.", "Y.", "Z."]
    return arr[num]
}



/**
 * [deleteTheme 互动圈删除话题]
 * @param  {[type]} id [当前项目的themeid]
 * @return {[type]}    [description]
 */
export function deleteTheme(childId, themeId){
    return new Promise((resolve,reject) => {
        if(resolve){
            $.ajax({
                url: api_url + "/interactCircle/deleteTheme",
                dataType: "json",
                data: {
                    projectId: childId,
                    userTk: mainUserTk,
                    themeId: themeId
                },
                type: 'post',
                success: function(data) {
                    setTimeout(() => {
                        resolve(data);
                    }, 1000)
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
    })
}

/**
 * [deleteTheme 华东话题删除主题]
 * @param  {[type]} id [当前项目的themeid]
 * @return {[type]}    [description]
 */
export function deleteTopicTheme(childId, themeId){
    return new Promise((resolve,reject) => {
        if(resolve){
            $.ajax({
                url: api_url + "/interactTopic/deleteTheme",
                dataType: "json",
                data: {
                    projectId: childId,
                    userTk: mainUserTk,
                    themeId: themeId
                },
                type: 'post',
                success: function(data) {
                    setTimeout(() => {
                        resolve(data);
                    }, 1000)
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
    })
}

/**
 * [deleteTheme 话题详情评论列表删除]
 * @param  {[type]} id [当前项目的评论contentId]
 * @return {[type]}    [description]
 */
export function deleteContent(projectId, contentId) {
    return new Promise((resolve,reject) => {
        if(resolve){
            $.ajax({
                url: api_url + "/interactTopic/deleteContent",
                dataType: "json",
                data: {
                    projectId: projectId,
                    userTk: mainUserTk,
                    contentId: contentId
                },
                type: 'post',
                success: function(data) {
                    setTimeout(() => {
                        resolve(data);
                    }, 1000)
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
    })
}



/**
 * [boothClassifyToList 展位分类]
 * @param  {[type]} val [分类列表数组]
 * @return {[type]}    [分类字符串]
 */
export function boothClassifyToList(val){
    if(val.length == 0){
        return;
    }

    let result = new Array;
    for(let i = 0; i < val.length; i++){
        result.push(val[i].name);
    }

    return result.join('、')
}


/**
 * [commonAjaxFun 所有ajax的公共方法]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function commonAjaxFun(params, time){
    return new Promise((resolve, reject) =>{
        if(resolve){
            $.ajax({
                url: api_url + params.url,
                dataType: "json",
                data: params.data,
                traditional: true,
                type: 'post',
                success: function(data) {
                    if(!!time) {
                        //如果有时间则间隔返回
                        setTimeout(() => {
                            resolve(data);
                        }, time)
                    } else {
                        resolve(data)
                    }
                },
                error: function(err) {
                    //服务器500
                    if(!!time) {
                        setTimeout(() => {
                            layer.close();
                            layer.toast({content: '服务器开小差了！'});
                        }, time)
                    } else {
                        layer.close();
                        //layer.toast({content: '服务器开小差了！'});
                    }
                    
                    reject(err)
                }
            });
        }
    })
}

/**
 * [commonGetAjaxFun 所有ajax的get公共方法]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function commonGetAjaxFun(params, time){
    return new Promise((resolve, reject) =>{
        if(resolve){
            $.ajax({
                url: api_url + params.url,
                dataType: "json",
                data: params.data,
                type: 'get',
                success: function(data) {
                    if(!!time) {
                        //如果有时间则间隔返回
                        setTimeout(() => {
                            resolve(data);
                        }, time)
                    } else {
                        resolve(data)
                    }
                },
                error: function(err) {
                    //服务器500
                    if(!!time) {
                        setTimeout(() => {
                            layer.close();
                            layer.toast({content: '服务器开小差了！'});
                        }, time)
                    } else {
                        layer.close();
                        layer.toast({content: '服务器开小差了！'});
                    }
                    
                    reject(err)
                }
            });
        }
    })
}

/**
 * [commonAdlistAjaxFun 所有广告ajax的公共方法]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function commonAdlistAjaxFun(params) {
    return new Promise((resolve, reject) =>{
        if(resolve){
            $.ajax({
                url: params.url,
                dataType: "jsonp",
                data: params.data,
                type: 'post',
                success: function(data) {
                    resolve(data)
                },
                error: function(err) {
                    reject(err)
                    console.log(err);
                }
            });
        }
    })
}




/**
 * [collectDataFun 根据id找出日程的收藏]
 * @param  {[type]} arr [日程数组]
 * @param  {[type]} id  [点击对应的id]
 * @return {[type]}     [description]
 * retrun 需要返回主会场的index, meeting的index, granules的index
 * ------
 * this.scheduleArr[1].meetings[0].granules[0], 'watched', true
 */
export function collectDataFun(arr, id){

    let _obj = new Object;
    if(arr.length > 0){
        for (let i = 0; i < arr.length; i++) {
            let _meeting = arr[i].meetings;

            if(_meeting.length > 0){
                for(let j = 0; j < _meeting.length; j++){
                    let _granules = _meeting[j];

                    let _index = collectDataFunInner(_granules.granules, id);

                    if(_index != undefined){
                        _obj.mainIndex = i;
                        _obj.meetingsIndex = j;
                        _obj.granulesIndex = _index;
                        break;
                    }

                }
            }
        }
    }

    return _obj;
}

/**
 * [collectDataFunInner 配合collectDataFun使用]
 * @param  {[type]} arr [数组]
 * @param  {[type]} id  [需要寻找的id]
 * @return {[type]}     [description]
 */
function collectDataFunInner(arr, id){
    let index;
    for(let i = 0; i < arr.length; i++) {
        if(arr[i].id == id){
            index = i;
            break;
        }
    }
    return index
}

/**
 * [commonFilterIndex 筛选当前index]
 * @param  {[type]} arr [数组]
 * @param  {[type]} type [筛选类型]
 * @param  {[type]} id  [需要寻找的id]
 * @return {[type]}     [description]
 */
export function commonFilterIndex(id, type, arr){
    let index;
    for(let i = 0; i < arr.length; i++) {
        if(arr[i][type] == id){
            index = i;
            break;
        }
    }
    return index
}



//字数统计
export function CountChineseCharacters(str) {
    var Words = str;
    var W = new Object();
    var Result = new Array();
    var iNumwords = 0;
    var sNumwords = 0;
    var sTotal = 0; //双字节字符;
    var iTotal = 0; //中文字符；
    var eTotal = 0; //Ｅ文字符
    var otherTotal = 0;
    var bTotal = 0;
    var inum = 0; //数字

    for (let i = 0; i < Words.length; i++) {
        var c = Words.charAt(i);
        if (c.match(/[\u4e00-\u9fa5]/)) {
            if (isNaN(W[c])) {
                iNumwords++;
                W[c] = 1;
            }
            iTotal++;
        }
    }

    for (let i = 0; i < Words.length; i++) {
        var c = Words.charAt(i);
        if (c.match(/[^\x00-\xff]/)) {
            if (isNaN(W[c])) {
                sNumwords++;

            }
            sTotal++;
        } else {
            eTotal++;
        }
        if (c.match(/[0-9]/)) {
            inum++;
        }
    }

    return iTotal * 2 + (sTotal - iTotal) * 2 + eTotal;
}

/*
 * 处理过长的字符串，截取并添加省略号
 * 注：半角长度为1，全角长度为2
 *
 * pStr:字符串
 * pLen:截取长度
 *
 * return: 截取后的字符串
 */
export function autoAddEllipsis(pStr, pLen) {
    var _ret = cutString(pStr, pLen);
    var _cutFlag = _ret.cutflag;
    var _cutStringn = _ret.cutstring;
    return _cutStringn;
}



/*
 * 取得指定长度的字符串
 * 注：半角长度为1，全角长度为2
 *
 * pStr:字符串
 * pLen:截取长度
 *
 * return: 截取后的字符串
 */
function cutString(pStr, pLen) {

    // 原字符串长度
    var _strLen = pStr.length;

    var _tmpCode;

    var _cutString;

    // 默认情况下，返回的字符串是原字符串的一部分
    var _cutFlag = "1";

    var _lenCount = 0;

    var _ret = false;

    if (_strLen <= pLen / 2) {
        _cutString = pStr;
        _ret = true;
    }

    if (!_ret) {
        for (var i = 0; i < _strLen; i++) {
            if (isFull(pStr.charAt(i))) {
                _lenCount += 2;
            } else {
                _lenCount += 1;
            }

            if (_lenCount > pLen) {
                _cutString = pStr.substring(0, i);
                _ret = true;
                break;
            } else if (_lenCount == pLen) {
                _cutString = pStr.substring(0, i + 1);
                _ret = true;
                break;
            }
        }
    }

    if (!_ret) {
        _cutString = pStr;
        _ret = true;
    }

    if (_cutString.length == _strLen) {
        _cutFlag = "0";
    }

    return {
        "cutstring": _cutString,
        "cutflag": _cutFlag
    };
}

/*
 * 判断是否为全角
 * pChar:长度为1的字符串
 * return: true:全角
 *          false:半角
 */
function isFull(pChar) {
    if ((pChar.charCodeAt(0) > 128)) {
        return true;
    } else {
        return false;
    }
}

/**
 * [getListCity 升级联动]
 * @param  {[type]} arr   [description]
 * @param  {[type]} number [description]
 * @return {[type]}        [description]
 */
export function getListCity(arr, number) {
    let list = arr;

    function getNode(item) {
        let tempNode = [];
        for (let i = 0, max = list.length; i < max; i++) {
            if (list[i].parentid == item) {
                tempNode.push(list[i])
            }
        }

        return tempNode;
    }

    function getLast(item) {
        if (item.length > 0) {
            let temp = [];
            for (let i = 0, max = item.length; i < max; i++) {
                temp = getNode(item[i].id);
                if (!item[i]['children']) {
                    item[i]['children'] = []
                }
                item[i]['children'] = temp;
                getLast(temp)
            }
        }
        return item;
    }

    function setShow(item,str) {
        if (item.length > 0) {
           for (let i = 0, max = item.length; i < max; i++) {
                item[i].showText = item[i][str];
                setShow(item[i].children,str)
           }
        }
    } 

    var collect = getLast(getNode(number))
    collect[0].showText = collect[0].name
    collect[1].showText = collect[1].pinyin
    setShow(collect[0].children,"name")
    setShow(collect[1].children,"pinyin")
    // collect.unshift({
    //     name:"请选择",
    //     pinyin:"Select",
    //     showText:"请选择(Select)",
    //     children:[{
    //         name:"请选择",
    //         pinyin:"Select",
    //         showText:"请选择(Select)",
    //         children:[{
    //             name:"请选择",
    //             pinyin:"Select",
    //             showText:"请选择(Select)",
    //             children:[]
    //         }]
    //     }]
    // })
    return collect
}

/**
 * [monitorStatics 数据检测]
 * @param  {[type]} childId   [子项目id]
 * @param  {[type]} projectId [主项目id]
 * @param  {[type]} referrer [页面来源]
 * @return {[type]}           [description]
 */
export function monitorStatics(childId, projectId, referrer) {

    if(process.env.NODE_ENV == 'development') {
        return false;
    }

    //展位预览不执行监测
    let EXCLUDEMOINTER = VueCookie.get('EXCLUDEMOINTER');

    if (EXCLUDEMOINTER == 'true') {
        return;
    }

    let domain = 'https://monitor.expoplus.com.cn';
    let params = {};

    if(!!window._hmt) {
        window._hmt = {
            push: function (param_name){
                if (!param_name || !param_name instanceof Array || param_name.length != 3) {
                    return;
                }

                params.type = param_name[0];
                params.sub_type = encodeURIComponent(param_name[1]);
                params.remark = encodeURIComponent(param_name[2]);

                var args = "";
                for (var i in params) {
                    if (args != "") {
                        args += "&";
                    }
                    args += i + "=" + encodeURIComponent(params[i]);
                }

                var request = false;
                try {
                    request = new XMLHttpRequest();
                } catch (trymicrosoft) {
                    try {
                        request = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (othermicrosoft) {
                        try {
                            request = new ActiveXObject("Microsoft.XMLHTTP");
                        } catch (failed) {
                            request = false;
                        }
                    }
                }
                if (request) {
                    var args = "";
                    for (var i in params) {
                        if (args != "") {
                            args += "&";
                        }
                        args += i + "=" + encodeURIComponent(params[i]);
                    }
                    request.open("GET", domain + "/statistics/index.action?random=" + new Date().getTime() + "&" + args, false);
                    request.send(null);
                }
                //  post();
            }
        }
    }

    if(document) {
        params.url = document.URL || "";
        params.title = encodeURIComponent(document.title) || "";
        params.referrer = api_url + referrer;
    }

    params.appId = childId;
    params.projectId = projectId;

    post();

    function post(){

        if (params.f) {
            return;
        }

        let args = '';

        for (let i in params) {

            if (args != '') {
                args += "&";
            }
            args += i + '=' + encodeURIComponent(params[i]);
        }

        let img = new Image(1, 1);

        img.src = domain + "/statistics/index.action?random=" + new Date().getTime() + "&" + args;

    }

}


/**
 * [wxScaleBigImg 微信图片点击图片放大功能]
 * @param  {[type]} imgsrc [description]
 * @return {[type]}        [description]
 */
export function wxScaleBigImg(imgsrc) {
    try{
        let sourceImgSplit = imgsrc.split('_less');
        let sourceImg = sourceImgSplit[0] || imgsrc;

        let _imgArr = [];
        _imgArr.push(sourceImg);

        if(typeof(WeixinJSBridge) != "undefined") {
            WeixinJSBridge.invoke('imagePreview', {
                'current': imgsrc,
                'urls': _imgArr
            });
        }

    } catch(e) {
        console.log(e)
    }
}


/**
 * [encryptionPhone 手机加密  ]
 * 例如18710231234 -> 187****1234
 * @param  {[type]} phone [传入电话号码]
 * @return {[type]}       [description]
 */
export function encryptionPhone(phone){

    if(!!phone && phone.length >= 11) {//大于11位数
        return phone.replace(/^(\d{4})\d{4}(\d+)/, "$1****$2");
    } else {
        return phone
    }
}

/**
 * [includeStrChooice 判断是否包含请选择字段 ]

 * @param  {[type]} str [传入电话号码]
 * @return {[type]}    正假
 */
export function includeStrChooice(str){
    return str.indexOf("请选择") !== -1
}


/**
 * [encryptionEmail 邮箱加密]
 * @param  {[type]} email [description]
 * @return {[type]}       [description]
 */
export function encryptionEmail(email) {

    if(!!email) {
        let _splitEmail = email.split("@");
        let _splitHead = _splitEmail[0].substr(4);

        let _tempEmailStr = '';

        for(let i = 0; i < _splitHead.length; i++) {
            _tempEmailStr += '*';
        }

        let _back = _splitEmail[0].substr(0, 4) + _tempEmailStr + "@" + _splitEmail[1];

        return _back;
    } else {
        return email;
    }
}

/**
 * [skipEmptyElementForArray 如果arr中的元素存在空字符串''，则去掉该空字符串 ]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
export function skipEmptyElementForArray(arr){  
    var a = [];  
    $.each(arr,function(i,v){  
        var data = $.trim(v);//$.trim()函数来自jQuery  
        if('' != data){  
            a.push(data);  
        }  
    });  
    return a;  
} 


/**
 * [textAreaToHtml TextArea文本转换为Html
 * @param  {[type]} _str [字符串]
 * @return {[type]}       [description]
 */
export function textAreaToHtml(_str) {

    let _regBr = new RegExp("\n","g");

    let str = _str.replace(_regBr, '<br/>');

    return str;
}


/**
 * [initAllWeiXin 公共微信分享]
 * @param  {[type]} projectId [description]
 * @param  {[type]} passKey   [description]
 * @param  {[type]} type      [判断来源类型，如果是主页面main, 分页]
 * @param  {[type]} text      [微信描述里用的个别文字]
 * @param  {[type]} shareObj  [个别页面需要微信分享的图片，链接，等]
 * @return {[type]}           [description]
 */
export function initAllWeiXin(projectId, passKey, type, text, shareObj) {
    commonAjaxFun({
        url: '/eventapi/during/getChildrenProject',
        data: {
            projectId: projectId,
            passKey: passKey
        }
    }).then((data) => {

        let _data = data.data;

        if (data.state == '0' && _data) {

            let _img = uwin_url + require('@/common/images/fenxiang.jpg');
            let _mainUserTk = VueCookie.get('EVENTUSERTK');//usertk

            //let WXImg = _data.basicInfo.enterLogo ? _data.basicInfo.enterLogo : (uwin_url + '/src/common/images/fenxiang.jpg');
            let WXImg = _data.basicInfo.enterLogo ? _data.basicInfo.enterLogo : _img;
            let WXLink = '';
            let WXTitle = _data.basicInfo.meetingName ? _data.basicInfo.meetingName : '参展通';
            let WXDesc =  _data.basicInfo.address ? _data.basicInfo.address : '专注提供会展数字化服务，帮助众多国内外品牌在多媒体交互体验和数据采集方面提供解决方案';

            if (type == 'main') {
                //主页面，需要时间和地点
                WXLink = uwin_url + '/home/index?projectId=' + projectId + '&passKey=' + passKey;
                WXDesc = text.Time + ':' + wxShareTime(_data.basicInfo.startTime, _data.basicInfo.endTime) + text.Address + ':' + _data.basicInfo.address;


                if (WXLink.indexOf('wxShare') > -1) {
                    let _splitUrl = WXLink.split('&wxShare');
                    if (_splitUrl.length > 2) {
                        WXLink = _splitUrl[0] + '&wxShare=true'; //防止url中多个参数wxShare=true
                    }
                } else {
                    WXLink = WXLink + '&wxShare=true';
                }

                //分享中带着shareId
                if(!!_mainUserTk) {
                    //如果有userTk
                    if (WXLink.indexOf('shareId') > -1) {
                        let _splitUrl = WXLink.split('&shareId');
                        if (_splitUrl.length > 2) {
                            WXLink = _splitUrl[0] + '&shareId=' + _mainUserTk; //防止url中多个参数shareId
                        }
                    } else {
                        WXLink = WXLink + '&shareId=' + _mainUserTk;
                    }
                }

                //以下分享内容本地存储，用于第一次进入页面，然后进入展商、展品等详情页面时，在去其他页面分享时还会分享展商、展品等页面
                let params = {
                    WXImg: WXImg,
                    WXLink: WXLink,
                    WXTitle: WXTitle,
                    WXDesc: WXDesc
                }

                sessionStorage.setItem("HDPWXSHARE" + projectId + passKey, JSON.stringify(params));

            } else if (type == 'attendDetail') {
                //来宾详情
                WXImg = shareObj.img;
                WXLink = uwin_url + shareObj.link;
                WXDesc = shareObj.desc;

            } else if (type == 'boothDetail') {
                //展位详情
                WXImg = shareObj.img;
                WXLink = uwin_url + shareObj.link;
                WXTitle = shareObj.title;
                WXDesc = shareObj.desc;

            } else if (type == 'data') {
                //资料列表
                WXLink = uwin_url + shareObj.link;
                WXDesc = shareObj.desc;

            } else if( type == 'guestDetail') {
                //嘉宾详情
                WXImg = shareObj.img;
                WXLink = uwin_url + shareObj.link;
                WXDesc = shareObj.desc;

            } else if( type == 'momentDetail') {
                //互动圈详情
                WXTitle = shareObj.title;
                WXLink = uwin_url + shareObj.link;
                WXDesc = shareObj.desc;
                
            } else if( type == 'productDetail') {
                //展品详情
                WXImg = shareObj.img;
                WXLink = uwin_url + shareObj.link;
                WXTitle = shareObj.title;
                WXDesc = shareObj.desc;

            } else if ( type == 'scheduleDetail') {
                //日程详情
                WXLink = uwin_url + shareObj.link;
                WXTitle = shareObj.title;
                WXDesc = shareObj.desc;

            } else if ( type == 'speakIndex') {
                //发言列表
                WXLink = uwin_url + shareObj.link;
                WXTitle = shareObj.title;
                WXDesc = shareObj.desc;

            } else if (type == 'topicDetail') {
                //话题详情
                WXLink = uwin_url + shareObj.link;
                WXTitle = shareObj.title;
                WXDesc = shareObj.desc;
            }

            //分享中带着wxShare，从而判断左上角是返回还是首页
            if(WXLink.indexOf('wxShare') > -1) {
                let _splitUrl = WXLink.split('&wxShare');
                if(_splitUrl.length > 2) {
                    WXLink = _splitUrl[0] + '&wxShare=true';//防止url中多个参数wxShare=true
                }

            } else {
                WXLink = WXLink + '&wxShare=true'
            }

            //分享中带着shareId
            if(!!_mainUserTk) {
                //如果有userTk
                if (WXLink.indexOf('shareId') > -1) {
                    let _splitUrl = WXLink.split('&shareId');
                    if (_splitUrl.length > 2) {
                        WXLink = _splitUrl[0] + '&shareId=' + _mainUserTk; //防止url中多个参数shareId
                    }
                } else {
                    WXLink = WXLink + '&shareId=' + _mainUserTk;
                }
            }

            let params = {
                WXImg: WXImg,
                WXLink: WXLink,
                WXTitle: WXTitle,
                WXDesc: WXDesc
            }

            ajaxGetWeiXinConf(params); //微信分享

        } else {
            console.log(data.message)
        }

    }, (err) => {
        console.log(err);
    })
}


/**
 * [ajaxGetWeiXinConf 微信分享初始化设置]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 * @param  {[type]} hideMenuItems [隐藏右上角分享按钮, 默认hide]
 */
export function ajaxGetWeiXinConf(params) {

    commonAdlistAjaxFun({
        url: 'https://weixin.expoplus.com.cn/weixin/getConfig',
        data: {
            url: location.href.split('#')[0],
            type: 'share',
            key: 'expoplus'
        }
    }).then((data) => {
        if(data.state == "0"){
            initWeiXin(data.data, params);
        }
    }, (err) => {
        console.log(err)
    })
}

/**
 * [initWeiXin 初始化微信分享配置]
 * @param  {[type]} data   [ajax返回的微信配置包括appid, timestamp]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 * @return {[type]}        [description]
 * 
 */
function initWeiXin(data, params) {

    wx.config({
        debug: false,
        appId: data.appid,
        timestamp: data.timestamp,
        nonceStr: data.noceStr,
        signature: data.signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems'
        ]
    });



    wx.ready(function() {
        // 微信分享的数据
        var wxData = {
            imgUrl: params.WXImg,
            link: params.WXLink,
            desc: params.WXDesc, //描述
            title: params.WXTitle, //大标题
            trigger: function(res) {},
            complete: function(res) {},
            success: function(res) {},
            cancel: function(res) {},
            fail: function(res) {}
        };

        wx.hideMenuItems({
            menuList: [
                "menuItem:copyUrl", //复制链接
                "menuItem:originPage", //原网页
                "menuItem:readMode", //阅读模式
                "menuItem:openWithQQBrowser", //在QQ浏览器中打开
                "menuItem:editTag", //编辑标签
                "menuItem:openWithSafari", //在Safari中打开
                "menuItem:share:email", //邮件
                "menuItem:share:facebook", //分享到FB
                "menuItem:share:weiboApp", //分享到Weibo
                "menuItem:share:qq", //分享到QQ
                "menuItem:share:QZone", //分享到 QQ 空间
                "menuItem:delete" //删除
            ]
        });

        //“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareAppMessage(wxData);
        //“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareTimeline(wxData);
        //监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareQQ(wxData);
        //“分享到微博”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareWeibo(wxData);
    });
}