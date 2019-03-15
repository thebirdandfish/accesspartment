//app.js
var common = require('utils/common.js')
App({


  globalData: {
    userInfo: null
  },

  onLaunch: function(options) {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    var from_uid = options.query.from_uid == undefined ? '0' : options.query.from_uid
    if (from_uid != 0) {
      wx.setStorageSync("from_uid", from_uid)
    }

    common.initApp(this.url + 'weiapp/Api/', true)
  },

  success: function(msg) {
    if (!msg) {
      msg = '操作成功'
    }
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 2000
    });
  },
  error: function(msg) {
    if (!msg) {
      msg = '操作成功'
    }
    wx.showToast({
      title: msg,
      image: '/images/icon_wrong.png',
      duration: 2000
    });
  },
  url: 'https://yoursite/public/index.php/',
  PHPSESSID: '',
  common: common
})
