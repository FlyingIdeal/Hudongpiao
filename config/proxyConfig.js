//const url = 'https://front.uwins.cc/api';
const url = "https://front.expoplus.com.cn/api";

module.exports = {
    '/interactCircle/getThemeList': { //互动话题
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactCircle/getThemeList': '/interactCircle/getThemeList'
        }
    },
    '/interactCircle/recentlyMsg': { //朋友圈-获取最新信息条数
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactCircle/recentlyMsg': '/interactCircle/recentlyMsg'
        }
    },
    '/interactCircle/getTheme': { //互动话题-详情
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactCircle/getTheme': '/interactCircle/getTheme'
        }
    },
    '/eventapi/during/homePageAjax': { //首页
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/eventapi/during/homePageAjax': '/eventapi/during/homePageAjax'
        }
    },
    '/eventapi/during/getChildrenProject': { //首页
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/eventapi/during/getChildrenProject': '/eventapi/during/getChildrenProject'
        }
    },
    '/homeData/getBanners': { //首页-获取banner轮播图
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/homeData/getBanners': '/homeData/getBanners'
        }
    },
    '/homeData/getDynamicInfo': { //首页-消息
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/homeData/getDynamicInfo': '/homeData/getDynamicInfo'
        }
    },
    '/homeData/getHotProduct': { //首页-热门产品
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/homeData/getHotProduct': '/homeData/getHotProduct'
        }
    },
    '/homeData/getHotBooth': { //首页-热门展位
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/homeData/getHotBooth': '/homeData/getHotBooth'
        }
    },
    '/homeData/getRecommend': { //首页-热门推荐
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/homeData/getRecommend': '/homeData/getRecommend'
        }
    },
    '/homeData/getBannerByVersion': { //首页-下广告
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/homeData/getBannerByVersion': '/homeData/getBannerByVersion'
        }
    },
    '/homeData/getUsertype': { //首页-判断是普通观众或展位联系人
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/homeData/getUsertype': '/homeData/getUsertype'
        }
    },
    '/complain/getComplain': { //投诉
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/complain/getComplain': '/complain/getComplain'
        }
    },
    '/complain/report': { //投诉提交
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/complain/report': '/complain/report'
        }
    },
    '/boothApi/getBooths': { //展位
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/boothApi/getBooths': '/boothApi/getBooths'
        }
    },
    '/userApi/getTagStatus': { //展位相关选择 综合 最新 本地 和我相关
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userApi/getTagStatus': '/userApi/getTagStatus'
        }
    },
    '/boothApi/getAllCategory': { //展位分类
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/boothApi/getAllCategory': '/boothApi/getAllCategory'
        }
    },
    '/boothApi/getProducts': { //展品
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/boothApi/getProducts': '/boothApi/getProducts'
        }
    },
    '/boothApi/getProductsDetail': { //展品详情
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/boothApi/getProductsDetail': '/boothApi/getProductsDetail'
        }
    },
    '/boothApi/getQuestions': { //展品问卷
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/boothApi/getQuestions': '/boothApi/getQuestions'
        }
    },
    '/boothApi/questionsSubmit': { //展品问卷-提交
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/boothApi/questionsSubmit': '/boothApi/questionsSubmit'
        }
    },
    '/interact/needs/getPage': { //需求
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interact/needs/getPage': '/interact/needs/getPage'
        }
    },
    '/interact/needs/getNeeds': { //需求详情
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interact/needs/getNeeds': '/interact/needs/getNeeds'
        }
    },
    '/interact/needs/getUsers': { //需求参与
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interact/needs/getUsers': '/interact/needs/getUsers'
        }
    },
    '/interact/needs/saveRecord': { //需求-联系
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interact/needs/saveRecord': '/interact/needs/saveRecord'
        }
    },
    '/interact/needs/delete': { //需求-删除
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interact/needs/delete': '/interact/needs/delete'
        }
    },
    '/userApi/allUsers': { //来宾
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userApi/allUsers': '/userApi/allUsers'
        }
    },
    '/userApi/myUsers': { //好友
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userApi/myUsers': '/userApi/myUsers'
        }
    },
    '/interactTopic/getThemeList': { //互动话题
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactTopic/getThemeList': '/interactTopic/getThemeList'
        }
    },
    '/interactTopic/getTheme': { //互动话题详情
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactTopic/getTheme': '/interactTopic/getTheme'
        }
    },
    '/interactTopic/saveTheme': { //互动话题-创建
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactTopic/saveTheme': '/interactTopic/saveTheme'
        }
    },
    '/interactTopic/getContentList': { //话题评论列表
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactTopic/getContentList': '/interactTopic/getContentList'
        }
    },
    '/interact/common/getData': { //问卷
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interact/common/getData': '/interact/common/getData'
        }
    },
    '/eventapi/during/getDataChildren': { //帮助中心
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/eventapi/during/getDataChildren': '/eventapi/during/getDataChildren'
        }
    },
    '/boothApi/getBoothDetail': { //展位详情
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/boothApi/getBoothDetail': '/boothApi/getBoothDetail'
        }
    },
    '/userApi/watch': { //收藏
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userApi/watch': '/userApi/watch'
        }
    },
    '/interactCircle/deleteTheme': { //删除朋友圈主题话题
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactCircle/deleteTheme': '/interactCircle/deleteTheme'
        }
    },
    '/interactTopic/deleteTheme': { //删除互动话题主题
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactTopic/deleteTheme': '/interactTopic/deleteTheme'
        }
    },
    '/interactTopic/deleteContent': { //删除话题详情评论列表
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactTopic/deleteContent': '/interactTopic/deleteContent'
        }
    },
    '/eventapi/during/getAllDatum': { //资料下载
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/eventapi/during/getAllDatum': '/eventapi/during/getAllDatum'
        }
    },
    '/boothApi/getDatums': { //展位资料下载
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/boothApi/getDatums': '/boothApi/getDatums'
        }
    },
    '/boothApi/watch': { //展位预约时间
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/boothApi/watch': '/boothApi/watch'
        }
    },
    '/eventapi/during/getSchduleList': { //我的日程
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/eventapi/during/getSchduleList': '/eventapi/during/getSchduleList'
        }
    },
    '/eventapi/during/getNewAppLiveGraphic': { //图文直播
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/eventapi/during/getNewAppLiveGraphic': '/eventapi/during/getNewAppLiveGraphic'
        }
    },
    '/interactCircle/saveTheme': { //发布朋友圈
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactCircle/saveTheme': '/interactCircle/saveTheme'
        }
    },
    '/userApi/userInfo': { //嘉宾详情页面
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userApi/userInfo': '/userApi/userInfo'
        }
    },
    '/userApi/adduser': { //嘉宾详情页面-交换名片
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userApi/adduser': '/userApi/adduser'
        }
    },
    '/userApi/HisContent': { //嘉宾详情动态
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userApi/HisContent': '/userApi/HisContent'
        }
    },
    '/interactTopic/saveContent': { //评论内容提交
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactTopic/saveContent': '/interactTopic/saveContent'
        }
    },
    '/interactTopic/likedLogs': { //评论内容点咋按
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactTopic/likedLogs': '/interactTopic/likedLogs'
        }
    },
    '/eventapi/during/getSchduleList': { //发布互动圈 @我在的日程列表
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/eventapi/during/getSchduleList': '/eventapi/during/getSchduleList'
        }
    },
    '/interactCircle/saveTheme': { //发布互动圈发送
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactCircle/saveTheme': '/interactCircle/saveTheme'
        }
    },
    '/interact/needs/saveNeeds': { //发布需求
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interact/needs/saveNeeds': '/interact/needs/saveNeeds'
        }
    },
    '/userApi/myFavorite': { //获取我的收藏，我的展位我的展品数量
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userApi/myFavorite': '/userApi/myFavorite'
        }
    },
    '/interactCircle/myMsg': { //互动圈-我的消息列表
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactCircle/myMsg': '/interactCircle/myMsg'
        }
    },
    '/eventapi/during/getChildrenDetails': { //日程详情
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/eventapi/during/getChildrenDetails': '/eventapi/during/getChildrenDetails'
        }
    },
    '/interactScope/getScope': { //日程评分
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactScope/getScope': '/interactScope/getScope'
        }
    },
    '/interactScope/saveScope': { //日程打分
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interactScope/saveScope': '/interactScope/saveScope'
        }
    },
    '/boothApi/downloadDatums': { //展位资料下载
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/boothApi/downloadDatums': '/boothApi/downloadDatums'
        }
    },
    '/eventapi/during/saveOperate': { //资料二级页下载
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/eventapi/during/saveOperate': '/eventapi/during/saveOperate'
        }
    },
    '/boothApi/getBoothGuide': { //地图-参观指南
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/boothApi/getBoothGuide': '/boothApi/getBoothGuide'
        }
    },
    '/frontUser/login': { //登录
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/login': '/frontUser/login'
        }
    },
    '/frontUser/sendEmailVerifyCode': { //获取邮箱验证码
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/sendEmailVerifyCode': '/frontUser/sendEmailVerifyCode'
        }
    },
    '/hudongpiao/message/getCheckCode': { //获取手机验证码
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/hudongpiao/message/getCheckCode': '/hudongpiao/message/getCheckCode'
        }
    },
    '/frontUser/checkAccount': { //检验当前账号是否存在
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/checkAccount': '/frontUser/checkAccount'
        }
    },
    '/frontUser/forgetPassword': { //忘记密码-提交
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/forgetPassword': '/frontUser/forgetPassword'
        }
    },
    '/frontUser/getRoleType': { //获取角色类型
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/getRoleType': '/frontUser/getRoleType'
        }
    },
    '/frontUser/autoLogin': { //微信自动登陆
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/autoLogin': '/frontUser/autoLogin'
        }
    },
    '/frontUser/getLoginStatus': { //是否登陆
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/getLoginStatus': '/frontUser/getLoginStatus'
        }
    },
    '/frontUser/sendVerificationCode': { //注册页面发送验证码
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/sendVerificationCode': '/frontUser/sendVerificationCode'
        }
    },
    '/frontUser/register': { //注册页面-提交注册
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/register': '/frontUser/register'
        }
    },
    '/bommonBasic/getDistrict': { //获取国家列表
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/bommonBasic/getDistrict': '/bommonBasic/getDistrict'
        }
    },
    '/userForm/getFormAttrVal': { //标签页面获取表单数据
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userForm/getFormAttrVal': '/userForm/getFormAttrVal'
        }
    },
    '/userForm/getIsYuBaoMing': { //是否开启了预报名，label使用
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userForm/getIsYuBaoMing': '/userForm/getIsYuBaoMing'
        }
    },
    '/userForm/submitForm': { //label标签提交
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userForm/submitForm': '/userForm/submitForm'
        }
    },
    '/messageTool/chat/getNum': { //获取消息数目
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/messageTool/chat/getNum': '/messageTool/chat/getNum'
        }
    },
    '/messageTool/chat/getChatList': { //获取消息页面的消息列表
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/messageTool/chat/getChatList': '/messageTool/chat/getChatList'
        }
    },
    '/messageTool/pull': { //获取系统小秘书页面的列表
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/messageTool/pull': '/messageTool/pull'
        }
    },
    '/messageTool/chat/getChatDetail': { //获取聊天页面的个人信息
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/messageTool/chat/getChatDetail': '/messageTool/chat/getChatDetail'
        }
    },
    '/messageTool/chat/send': { // chat页面-对话
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/messageTool/chat/send': '/messageTool/chat/send'
        }
    },
    '/userApi/shieldUser': { // chat页面-不在接受此人信息
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userApi/shieldUser': '/userApi/shieldUser'
        }
    },
    '/messageTool/chat/getNewChat': { // chat页面-获取新对话
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/messageTool/chat/getNewChat': '/messageTool/chat/getNewChat'
        }
    },
    '/interact/interactQuestionPure/saveData': { // 问卷-提交
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/interact/interactQuestionPure/saveData': '/interact/interactQuestionPure/saveData'
        }
    },
    '/userApi/getPersonalProgress': { // 个人页面，查看当前进度
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userApi/getPersonalProgress': '/userApi/getPersonalProgress'
        }
    },
    '/userApi/updateUser': { // 个人编辑页面，更新个人
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/userApi/updateUser': '/userApi/updateUser'
        }
    },
    '/frontUser/updateEmail': { // 个人编辑页面，更换新邮箱
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/updateEmail': '/frontUser/updateEmail'
        }
    },
    '/frontUser/updatePhone': { // 个人编辑页面，更换新手机号
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/updatePhone': '/frontUser/updatePhone'
        }
    },
    '/homeData/getNumInfo': { // 获取个人面页中   收藏 好友 预约 等 6个标签个数
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/homeData/getNumInfo': '/homeData/getNumInfo'
        }
    },
    '/boothApi/saveConsultLog': { // 点击展位咨询 
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/boothApi/saveConsultLog': '/boothApi/saveConsultLog'
        }
    },
    '/homeData/getPotentialUser': { // 首页潜客 
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/homeData/getPotentialUser': '/homeData/getPotentialUser'
        }
    },
    '/homeData/getNeeds': { // 首页需求
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/homeData/getNeeds': '/homeData/getNeeds'
        }
    },
    '/homeData/getBoothSub': { // 首页预约
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/homeData/getBoothSub': '/homeData/getBoothSub'
        }
    },
    '/frontUser/updateUserInfo': { // 补全用户信息
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/updateUserInfo': '/frontUser/updateUserInfo'
        }
    },
    '/frontUser/saveUserInterest': { // 进入展品 展位 详情页 监测
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/frontUser/saveUserInterest': '/frontUser/saveUserInterest'
        }
    },
    '/tinyPoster/createImage': { // 我的伪海报
        target: url,
        changeOrigin: true,
        pathRewrite: {
            '^/tinyPoster/createImage': '/tinyPoster/createImage'
        }
    }


    

}

