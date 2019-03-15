var app = getApp()
function loadInfo(itemid, obj) {
  var key = 'info_' + itemid
  var info = wx.getStorageSync(key)
  if (info) {
    console.log('data from localCache')
    obj.setData({ info: info })
    console.log('common.js data from localCache打印info.itemid:'+ info.itemid)
    return true
  }

  wx.request({
    url: app.url +'iteminfo/iteminfo/getList',
    method: 'POST',
    data: { 
      requestid: itemid,
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      obj.setData({ info: res.data })

      console.log(key)
      wx.setStorageSync(key, res.data)
      console.log('data from server')
      console.log('common.js data from server打印res.data:' + res.data)
      console.log(info)
    },
    fail: function (res) {
      console.log('server error')
      obj.setData({ toastHidden: false, msg: '当前网格异常，请稍后再试' })
    },
  })
}



//下面代码来自weiphp5.0_ demo

function initApp(baseUrl, needUserInfo) {
  var openid = wx.getStorageSync('openid')
  var PHPSESSID = wx.getStorageSync('PHPSESSID')

  if (openid == '' || PHPSESSID == '') {
    setLogin(baseUrl, needUserInfo)
  } else {
    //小程序登录状态检查
    wx.checkSession({
      success: function () {
        console.log('小程序登录态正常')
        //小程序登录态正常，接着检查后端PHP用户登录态
        var sessid = wx.getStorageSync('PHPSESSID')
        if (sessid == '') {
          setLogin(baseUrl, needUserInfo);
        } else {
          //判断是否已登录
          console.log('需要从后端判断用户有没有登录过')
          wx.request({
            url: baseUrl + 'checkLogin', //需要从后端判断用户有没有登录过
            data: {
              PHPSESSID: wx.getStorageSync('PHPSESSID') //一定要带上PHPSESSID，否则后端系统不知道哪个用户
            },
            success: function (res) {
              console.log('0->使用登录接口,触发功能setLogin(baseUrl, needUserInfo; 1->表示已经登录过. checkLogin的结果：' + res.data.status)
              console.log('in checkLogin res.data.phpsessid:' + res.data.PHPSESSID)
              console.log('in checkLogin res.data.openid:' + res.data.openid)
              console.log('in checkLogin phpsessid:' + PHPSESSID)
              console.log('in checkLogin openid:' + openid)
              if (res.data.status == 0) {
                setLogin(baseUrl, needUserInfo);
              }
            }
          })
        }
      },
      fail: function () {
        console.log('登录态过期')
        //登录态过期
        setLogin(baseUrl, needUserInfo) //重新登录
      }
    })
  }
}

function setLogin(baseUrl, needUserInfo) {
  console.log('setLogin:' + baseUrl)

  wx.login({
    success: function (res) {
      if (res.code) { //使用小程序登录接口完成后端用户登录
        wx.request({
          url: baseUrl + 'sendSessionCode',
          data: {
            code: res.code,
            from_uid: wx.getStorageSync('from_uid')
          },
          success: function (res) {
            console.log(res)
            if (typeof res.data == "string") {
              res = JSON.parse(res.data)
            } else {
              res = res.data
            }
            console.log('获取到了phpsessid:' + res.data.PHPSESSID)
            console.log('openid:' + res.data.openid)
            //把sessid保存到缓存里
            wx.setStorageSync("PHPSESSID", res.data.PHPSESSID)
            wx.setStorageSync("openid", res.data.openid)
            wx.setStorageSync("uid", res.data.uid)

            //登录成功后判断用户是否已初始化化，如没则自动初始化化
            if (needUserInfo) {
              autoReg()
            }
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });

}

function autoReg() {
  //判断是否完成自动注册
  var checkReg = true
  try {
    var userInfo = wx.getStorageSync('userInfo') //通过缓存判断就行，即使用户清缓存也无影响，顶多再保存一次而已
    if (!userInfo) {
      checkReg = false
    }
  } catch (e) {
    checkReg = false
  }
  console.log('true则不跳转,false则跳转至pages/login/login checkReg：' + checkReg)
  if (checkReg == true) {
    return true
  }

  wx.navigateTo({
    url: '/pages/login/login',
  })

}

function shareUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

  return url + '?from_uid=' + wx.getStorageSync('uid') + urlEncode(options);
}
/** 
 * param 将要转为URL参数字符串的对象 
 * key URL参数字符串的前缀 
 * encode true/false 是否进行URL编码,默认为true 
 *  
 * return URL参数字符串 
 */
var urlEncode = function (param, key, encode) {
  if (param == null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
}


module.exports = {
  loadInfo: loadInfo,
  initApp: initApp,
  shareUrl: shareUrl
}