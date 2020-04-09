// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './common/stylus/index.styl'
import VueCookie from 'vue-cookie'
import layer from 'vue-layer-mobile'
import { Lazyload } from 'mint-ui'
import VueI18n from 'vue-i18n'
import { monitorStatics, ajaxGetWeiXinConf, commonAjaxFun, initAllWeiXin, wxShareSingle, getQueryString } from './common/js/common.js'


Vue.config.productionTip = false

Vue.use(VueI18n) // 通过插件的形式挂载
Vue.use(VueCookie);
Vue.use(layer);

Vue.use(Lazyload,{
    error: require('./common/images/errorImg.png'),
    loading: require('./common/images/loading.svg'),
    attempt: 1
});


let cookieProjectId = VueCookie.get('CHANGEPROJECT');//主项目id
let cookiePasskey = VueCookie.get('HUDONGPIAOPASSKEY');//主项目passkey

router.beforeEach((to, from, next) => {
    let cookieProjectId = VueCookie.get('CHANGEPROJECT');//主项目id
    let cookiePasskey = VueCookie.get('HUDONGPIAOPASSKEY');//主项目passkey
	let loginState = false;//登录状态 默认false未登录
    let cookieUserTk = VueCookie.get('EVENTUSERTK');//主项目密码
	let mainProjectId = to.query.projectId;//url中的projextid
	let mainPassKey = to.query.passKey;//url中的passkey
	let appId = to.query.appId || mainProjectId;//子项目id
	let fromReferrer = from.path;//来源path
	let toReferrer = to.path;//想去的页面path
    let fromFullPath = from.fullPath;//来源全路径
    let toFullPath = to.fullPath;//将要去的页面全路径


	if(mainProjectId == cookieProjectId && mainPassKey == cookiePasskey){

		//passkey和projectid完全相同，这说明在同一个项目点击
		if(!!cookieUserTk){//是否有usertk
			//有，说明已经登录
			loginState = true;
		} else {
			//无，未登录
			loginState = false;
		}

	} else {

		//不同，则说明切换了项目
		loginState = false;

        VueCookie.set('CHANGEPROJECT', mainProjectId,  { expires: 7  });
        VueCookie.set('HUDONGPIAOPASSKEY', mainPassKey,  { expires: 7 });
		
        VueCookie.delete('language');//删除语言

        //切换项目的同时，清楚原来登陆的登陆本地存储信息
        localStorage.removeItem("HDPEXPOWEIXIN2018" + cookieProjectId);

        if (!!cookieUserTk) {
            //切换项目了，但是还有ursrTk,则清除
            VueCookie.delete('EVENTUSERTK');
        }

	}

    if (fromReferrer == '/') {
        //当前页面刷新
        monitorStatics(appId, mainProjectId, toReferrer) //检测
    } else {
        //想要去的页面
        monitorStatics(appId, mainProjectId, fromReferrer) //检测
    }

    //需要单独分享微信
    let needSingleWx = false;
    for (let i = 0; i < wxShareSingle.length; i++) {
        if (wxShareSingle[i] == to.name) {
            needSingleWx = true;
            break;
        }
    }

    Vue.prototype.fromFullPath = fromFullPath; //页面来源全路径， 用于微信分享使用
    Vue.prototype.toFullPath = toFullPath; //将要去的页面全路径， 用于微信分享使用


    Vue.prototype.needSingleWx = needSingleWx; //是否单独微信分享

    //重置分享
    //以下分享内容本地存储，用于第一次进入页面，然后进入展商、展品等详情页面时，在去其他页面分享时还会分享展商、展品等页面
    if(!needSingleWx) {//整体分享
        let hasHDPWXSHARE = sessionStorage.getItem("HDPWXSHARE" + mainProjectId + mainPassKey);

        if(!!hasHDPWXSHARE) {
            //如果当前存储里面含有分享信息
            let shareParse = JSON.parse(hasHDPWXSHARE);
            let _shareLink = shareParse.WXLink;

            //从未注册到注册的过程->用于增加shareId
            let _mainUserTk = VueCookie.get('EVENTUSERTK'); //usertk
            if(!!_mainUserTk) {
                //如果有userTk
                if (_shareLink.indexOf('shareId') > -1) {
                    let _splitUrl = _shareLink.split('&shareId');
                    if (_splitUrl.length > 2) {
                        _shareLink = _splitUrl[0] + '&shareId=' + _mainUserTk; //防止url中多个参数shareId
                    }
                } else {
                    _shareLink = _shareLink + '&shareId=' + _mainUserTk;
                }
            }

            shareParse.WXLink = _shareLink;

            ajaxGetWeiXinConf(shareParse);
        } else {
            //没有的情况
            initAllWeiXin(mainProjectId, mainPassKey, 'main', {Time: '时间', Address: '地址'});
        }
    }

    Vue.prototype.loginState = loginState; //是否登陆

    next()
})


/**
 * 以下为语言cookie处理
 */
let _PD = getQueryString('projectId');
let _PK = getQueryString('passKey');

let I18nCookie = VueCookie.get('language');//cookie中的语言表示

if(I18nCookie == null || !I18nCookie) {
	I18nCookie = 'ch';//默认中文
}

//切换项目，重置语言
if(_PD != cookieProjectId && _PK != cookiePasskey) {
    I18nCookie = 'ch';//默认中文
}

/*国际化*/
const i18n = new VueI18n({
    locale: I18nCookie,  // 语言标识
    messages: {
        'ch': require('./common/lang/zh.js'),//中文zh
        'en': require('./common/lang/en.js')//英文
    }
})

/* eslint-disable no-new */

new Vue({
    el: '#app',
    data(){
        return {
            projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`
        }
    },
    router,
    i18n,
    template: '<App/>',
    components: {
        App
    }
})


