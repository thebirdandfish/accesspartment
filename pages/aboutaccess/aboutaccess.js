//aboutme.js
//获取应用实例
var app = getApp()
Page({
  data: {
    img: '../../images/basicprofile.png',
    streetguideimg1: '../../images/streetguideimg1.jpg',
    streetguideimg2: '../../images/streetguideimg2.jpg',
    streetguideimg3: '../../images/streetguideimg3.jpg',
    title: "公寓",
    intro1: "公寓，温馨舒适，高速上网。",
    intro2: "大屏网络电视，独立卫浴，24小时热水。",
    intro3: "服务时间为6:30至23:30。",
    address: "22号",
    mobile: "123456",
    mappage: false,
    latitude: 66.078400,
    longitude: 121.512931,
    markers: [{
      id: 1,
      latitude: 66.078400,
      longitude: 121.512931,
      name: '公寓'
    }]
  },
  
  switch1Change(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    this.data.e = e.detail.value
    this.setData({
      mappage: this.data.e
    })
  },

  onLoad: function () {
    wx.request({
      url: app.url + 'weiapp/api/testLogin',
      method:'POST',
      data: { PHPSESSID: wx.getStorageSync('PHPSESSID') },
      success: function (res) {
        console.log('in aboutaccess testLogin succeeded, res: ' +res.uid);
      }
    })
  },
  callme: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.mobile
    })
  },

  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  }
})

