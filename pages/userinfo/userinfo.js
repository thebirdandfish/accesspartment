//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userImg: "../../images/defult_userimg.png",
    userName: "未登录",
    userInfo: {},
    uid: {},
    PHPSESSID: {},
  },
  tpintro: function (event) {
    console.log("点击了简介");
    wx.navigateTo({
      url: '/pages/aboutaccess/aboutaccess'
    })
  },

  onShow: function () {
    var that = this,
      userInfo = wx.getStorageSync('userInfo')

    that.setData({
      userImg: userInfo.avatarUrl,
      userName: userInfo.nickName
    })
  }
})

