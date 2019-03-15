var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '请完成授权',
    logo: '../../images/defult_userimg.png',
  },
  saveUserInfo: function (baseUrl, res) {
    wx.setStorageSync("userInfo", res.userInfo)

    wx.request({
      url: baseUrl + 'weiapp/api/saveUserInfo',
      data: {
        iv: res.iv,
        encryptedData: res.encryptedData,
        PHPSESSID: wx.getStorageSync('PHPSESSID')
      },
      success: function (res) {
        console.log('success')
        wx.navigateBack({
          delta: 1,
        })
     
      },
      complete:function(res){
        console.log('complete')
        console.log(res)
      }
    })
  },
  login: function (e) {
    console.log("/pages/login/login.js -> login: function (e): e.detail ="+e.detail)
    this.saveUserInfo(app.url, e.detail)
  }
})