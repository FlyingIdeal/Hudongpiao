import VueCookie from 'vue-cookie'
import {uwin_url, commonAjaxFun, isWeixn, open_wx_oauth} from '../common/js/common.js'
import Vue from 'vue'
export function homeWeixin(to, from, next){

    let mainProjectId = to.query.projectId; //url中的projextid
    let mainPassKey = to.query.passKey; //url中的passkey

    let _oauth_data = VueCookie.get('EXPO_OAUTH_DATA');

    //如果是微信打开，并且是在正式服务器上
    if (isWeixn() && open_wx_oauth) {
        //微信中打开

        if (!!_oauth_data) {
            //如果当前cookie中有授权信息

            let oauthData = decodeURIComponent(_oauth_data);
            oauthData = JSON.parse(oauthData);
            let openId = oauthData.userInfo.openid;

            //自动登录
            commonAjaxFun({
                url: '/frontUser/autoLogin',
                data: {
                    openId: openId,
                    projectId: mainProjectId
                }
            }).then((data) => {

                if (data.state == '0' && !!data.data) {
                    //微信授权存EVENTUSERTK
                    VueCookie.set('EVENTUSERTK', data.data, {
                        expires: 7
                    });

                    Vue.prototype.loginState = true;

                }

                next();

            }, (error) => {
                //错误的话跳转到404页面
                next({
                    path: '/error/404',
                    query: {
                        projectId: mainProjectId,
                        passKey: mainPassKey,
                        message: error.message
                    }
                })
            })

        } else {
            //否则cookie中没有授权信息，则取授权

            // 正式服务器线上
            let obj = {
                url: uwin_url + to.fullPath,
                key: "expoplus",
                isCookieStorage: true,
                userId: 11111
            }

            // 线上
            let url = "https://weixin.expoplus.com.cn/weixin/api1/oauth?key=expoplus&data=" + encodeURIComponent(JSON.stringify(obj)); 
            
            window.location.href = url;

            next({
                path: url
            })

            return;

        }


    } else {
        //非微信
        next()
    }
    
}