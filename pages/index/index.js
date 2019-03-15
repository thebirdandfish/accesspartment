// pages/reservation/reservation.js
//var API_ROOMS_URL = 'https://weicms.accesspartment.top/index.php?s=/addon/Classinfo/Classinfo/getList';

//lists.js
//获取应用实例
var app = getApp()
Page({
  data: {
    itemList: [],
    fullItemList: [],
    requestid: 0,
    lastid: 0,
    toastHidden: true,
    confirmHidden: true,
    isfrist: 1,
    loadHidden: true,
    footShowing: false,
    moreHidden: 'none',
    itemsonEachList: 30,
    msg: '已加载全部信息'
  },
  loadData: function (requestid) {
    //显示出加载中的提示
    this.setData({
      loadHidden: false
    })
    console.log('requestid: ' + requestid)
    var limit = 100
    var that = this

    wx.request({
      url: app.url + 'iteminfo/iteminfo/getList',
      //  url: app.url + 'addon/Cms/Cms/getList',

      method: 'POST',
      data: {
        requestid: requestid,
        limit: limit
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {

        var len = res.data.length
        wx.setStorageSync('fullItemList', res.data)



        var oldLastid = requestid

        that.setData({ lastid: res.data[len - 1].itemid })
        var dataArr = that.data.itemList

        var newData = dataArr.concat(res.data);

        console.log('oldLastid == 0:为true时,停止加载;为false时,继续加载更多 ' + (oldLastid == 0))
        wx.setStorageSync('itemList', newData)
        that.setData({
          itemList: newData
        })

        if (oldLastid == 3002) {
          console.log('停止加载')
          that.setData({
            toastHidden: false
          })
          that.setData({
            moreHidden: 'none'
          })
          return false
        } else {
          that.setData({
            moreHidden: ''
          })
        }

      },
      fail: function (res) {
        if (lastid == 3002) {
          var newData = wx.getStorageSync('itemList')

          if (!newData) {
            that.setData({
              itemList: newData
            })
            that.setData({
              moreHidden: ''
            })

            var len = newData.length
            that.setData({
              lastid: newData[len - 1].itemid
            })
          }
          console.log('data from cache');
        } else {
          that.setData({
            toastHidden: false,
            moreHidden: 'none',
            msg: '当前网络异常，请稍后再试'
          })
        }
      },
      complete: function () {
        //显示出加载中的提示
        that.setData({
          loadHidden: true,
          footShowing:true
        })
      }
    })
  },
  loadMore: function (event) {

    var itemid = event.currentTarget.dataset.requestid
    var isfrist = event.currentTarget.dataset.isfrist
    var that = this

    this.setData({ isfrist: 0 })
    this.loadData(itemid);
  },
  onLoad: function () {
    var that = this

    this.loadData(0);
  },
 
  toastChange: function () {
    this.setData({
      toastHidden: true
    })
  },
  modalChange: function () {
    console.log('abc');
    this.setData({
      confirmHidden: true
    })
  },

})