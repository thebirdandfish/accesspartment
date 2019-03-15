//aboutme.js
//获取应用实例
var app = getApp();
var dateFormat = require('../../utils/dateutil');
var common = require('../../utils/common.js')
var oneDay = 1 * 24 * 60 * 60 * 1000;

Page({
  data: {
    toastHidden: true,
    footShowing: false,
    info: {},
    userName: '',
    userInfo: {},
    uid: {},
    PHPSESSID: {}
  },

  onShow: function () {
    var that = this,
      userInfo = wx.getStorageSync('userInfo')
    that.setData({
      userImg: userInfo.avatarUrl,
      userName: userInfo.nickName
    })
    console.log('in detail.js userName:' + userName)
  },

  onLoad: function(options) {
    var userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    console.log(userInfo.nickName)
    this.setData({ 
      userName: userInfo.nickName
       
    })
    console.log('options.itemid:' + options.itemid)
    var itemid = options.itemid
    var key = 'info_' + itemid
    var info = wx.getStorageSync(key)
    var that = this
    this.setData({
      FSdate: {
        date: dateFormat.formatTime(new Date(Date.now() + oneDay)),
        week: dateFormat.formatWeek(new Date(Date.now() + oneDay)),
        startday: dateFormat.formatDay(new Date(Date.now() + oneDay)),
        currentday: dateFormat.formatDay(new Date(Date.now() + oneDay))
      },
      FEdate: {
        date: dateFormat.formatTime(new Date(Date.now() + 2 * oneDay)),
        week: dateFormat.formatWeek(new Date(Date.now() + 2 * oneDay)),
        startday: dateFormat.formatDay(new Date(Date.now() + 2 * oneDay)),
        currentday: dateFormat.formatDay(new Date(Date.now() + 2 * oneDay))
      },
      HSdate: {
        date: dateFormat.formatTime(new Date(Date.now())),
        week: dateFormat.formatWeek(new Date(Date.now())),
        startday: dateFormat.formatDay(new Date(Date.now())),
        currentday: dateFormat.formatDay(new Date(Date.now()))
      },
      HEdate: {
        date: dateFormat.formatTime(new Date(Date.now() + oneDay)),
        week: dateFormat.formatWeek(new Date(Date.now() + oneDay)),
        startday: dateFormat.formatDay(new Date(Date.now() + oneDay)),
        currentday: dateFormat.formatDay(new Date(Date.now() + oneDay))
      }
    })
    if (info) {
      console.log('data from localCache')
      this.setData({
        info: info
      })
      console.log('common.js data from localCache打印info.itemid:' + info.itemid)
      return true
    }

    wx.request({
      url: app.url + 'iteminfo/iteminfo/getList',
      method: 'POST',
      data: {
        requestid: options.itemid,
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        that.setData({
          info: res.data
        })
        console.log('info: ' + info)
        console.log('onLoad data from server打印res.data:' + res.data)
        console.log('key: ' + key)
        wx.setStorageSync(key, res.data)


      },
      fail: function(res) {
        console.log('server error')
        that.setData({
          toastHidden: false,
          msg: '当前网格异常，请稍后再试'
        })
      },
    })
  },

  onShow: function () {
    this.setData({ footShowing: true });
  },

  formSubmit: function(e) {

    var formData = { //formData的参数
      'itemid': this.data.info.itemid, //商品ID,例如002001
      'itemtitle': this.data.info.itemtitle, //商品标题,例如单机电脑大床房
      //'HotelCheckInDate': dateFormat.timestamp(this.data.HSdate.currentday),
      'HotelCheckInDate': this.data.HSdate.currentday,
      'HotelCheckOutDate': this.data.HEdate.currentday,
      'userName': this.data.userName,
      'PHPSESSID' : wx.getStorageSync('PHPSESSID')
    };

    console.log('向后台提交数据：', formData)

    var that = this

    wx.request({
      url: app.url + 'reservation/reservation/addReservation',
      method: 'POST',
      data: formData,

      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res)
      },
      fail: function() {
        console.log('fail')
      },
      complete: function() {}
    })

  },

  bingDateChange: function(e) { //绑定选择时间的函数
    var type = e.currentTarget.dataset.type;
    switch (type) {
      case '1':
        this.setData({
          FSdate: {
            date: dateFormat.formatTime(new Date(e.detail.value)),
            week: dateFormat.formatWeek(new Date(e.detail.value)),
            startday: this.data.FSdate.startday,
            currentday: dateFormat.formatDay(new Date(e.detail.value))
          },
          FEdate: {
            date: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatTime(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatTime(new Date(this.data.FEdate.currentday)),
            week: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatWeek(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatWeek(new Date(this.data.FEdate.currentday)),
            startday: dateFormat.formatDay(new Date(new Date(e.detail.value).getTime() + oneDay)), //todo
            currentday: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatDay(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatDay(new Date(this.data.FEdate.currentday))
          },
          HSdate: {
            date: dateFormat.formatTime(new Date(e.detail.value)),
            week: dateFormat.formatWeek(new Date(e.detail.value)),
            startday: this.data.HSdate.startday,
            currentday: dateFormat.formatDay(new Date(e.detail.value))
          },
          HEdate: {
            date: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatTime(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatTime(new Date(this.data.FEdate.currentday)),
            week: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatWeek(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatWeek(new Date(this.data.FEdate.currentday)),
            startday: this.data.HEdate.startday,
            currentday: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatDay(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatDay(new Date(this.data.FEdate.currentday))
          }
        })
        break;
      case '2':
        this.setData({
          FEdate: {
            date: dateFormat.formatTime(new Date(e.detail.value)),
            week: dateFormat.formatWeek(new Date(e.detail.value)),
            startday: this.data.FEdate.startday,
            currentday: dateFormat.formatDay(new Date(e.detail.value))
          },
          HEdate: {
            date: dateFormat.formatTime(new Date(e.detail.value)),
            week: dateFormat.formatWeek(new Date(e.detail.value)),
            startday: this.data.HEdate.startday,
            currentday: dateFormat.formatDay(new Date(e.detail.value))
          }
        })
        break;
      case '3':
        this.setData({
          HSdate: {
            date: dateFormat.formatTime(new Date(e.detail.value)),
            week: dateFormat.formatWeek(new Date(e.detail.value)),
            startday: this.data.HSdate.startday,
            currentday: dateFormat.formatDay(new Date(e.detail.value))
          },
          HEdate: {
            date: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatTime(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatTime(new Date(this.data.FEdate.currentday)),
            week: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatWeek(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatWeek(new Date(this.data.FEdate.currentday)),
            startday: dateFormat.formatDay(new Date(new Date(e.detail.value).getTime() + oneDay)), //todo
            currentday: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatDay(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatDay(new Date(this.data.FEdate.currentday))
          }
        })
        break;
      case '4':
        this.setData({
          HEdate: {
            date: dateFormat.formatTime(new Date(e.detail.value)),
            week: dateFormat.formatWeek(new Date(e.detail.value)),
            startday: this.data.HEdate.startday,
            currentday: dateFormat.formatDay(new Date(e.detail.value))
          }
        })
        break;
    }
  },

  compareDay: function(startday, endday) {
    var startSecond = new Date(startday).getTime();
    var endSecond = new Date(endday).getTime();
    if ((endSecond - startSecond) > oneDay) {
      return true;
    } else {
      return false;
    }
  },

  alertWarn: function() {
    var obj = {
      pointer: this,
      duration: 3000
    }
    app.toast2(obj);
  },

  bingDateChange: function(e) { //绑定选择时间的函数,点击日期>确定-之后改变上页的显示日期
    var type = e.currentTarget.dataset.type;
    switch (type) {
      case '1':
        this.setData({
          HSdate: {
            date: dateFormat.formatTime(new Date(e.detail.value)),
            week: dateFormat.formatWeek(new Date(e.detail.value)),
            startday: this.data.HSdate.startday,
            currentday: dateFormat.formatDay(new Date(e.detail.value))
          },
          HEdate: {
            date: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatTime(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatTime(new Date(this.data.FEdate.currentday)),
            week: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatWeek(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatWeek(new Date(this.data.FEdate.currentday)),
            startday: this.data.HEdate.startday,
            currentday: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatDay(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatDay(new Date(this.data.FEdate.currentday))
          }
        })
        break;
      case '2':
        this.setData({
          FEdate: {
            date: dateFormat.formatTime(new Date(e.detail.value)),
            week: dateFormat.formatWeek(new Date(e.detail.value)),
            startday: this.data.FEdate.startday,
            currentday: dateFormat.formatDay(new Date(e.detail.value))
          },
          HEdate: {
            date: dateFormat.formatTime(new Date(e.detail.value)),
            week: dateFormat.formatWeek(new Date(e.detail.value)),
            startday: this.data.HEdate.startday,
            currentday: dateFormat.formatDay(new Date(e.detail.value))
          }
        })
        break;
      case '3':
        this.setData({
          HSdate: {
            date: dateFormat.formatTime(new Date(e.detail.value)),
            week: dateFormat.formatWeek(new Date(e.detail.value)),
            startday: this.data.HSdate.startday,
            currentday: dateFormat.formatDay(new Date(e.detail.value))
          },
          HEdate: {
            date: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatTime(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatTime(new Date(this.data.FEdate.currentday)),
            week: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatWeek(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatWeek(new Date(this.data.FEdate.currentday)),
            startday: dateFormat.formatDay(new Date(new Date(e.detail.value).getTime() + oneDay)), //todo
            currentday: this.compareDay(e.detail.value, this.data.FEdate.currentday) === false ? dateFormat.formatDay(new Date(new Date(e.detail.value).getTime() + oneDay)) : dateFormat.formatDay(new Date(this.data.FEdate.currentday))
          }
        })
        break;
      case '4':
        this.setData({
          HEdate: {
            date: dateFormat.formatTime(new Date(e.detail.value)),
            week: dateFormat.formatWeek(new Date(e.detail.value)),
            startday: this.data.HEdate.startday,
            currentday: dateFormat.formatDay(new Date(e.detail.value))
          }
        })
        break;
    }
  },


  closepage: function() {
    wx.navigateBack()
  },
  toastChange: function() {
    this.setData({
      toastHidden: true
    })
    wx.navigateBack()

  },


})