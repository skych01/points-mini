// consignee_config.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    billList: [],
    isLoad: true
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this
    that.setData({
        isLoad: true
    })
    var role = app.globalData.roles;
    if (role.length == 0) {
        app.getRoleInfo(function(){
            if (!role.length) {
                wx.redirectTo({
                    url: '../regist/regist'
                });
            }else{
                that.initData();
            }
        });
    } else {
      that.initData();
    }
  },
  //编辑按钮
  edit_bill: function (e) {
    console.log(e)
    var bill = e.currentTarget.dataset.bill
    wx.navigateTo({
      url: '../billUpdate/billUpdate?bill=' + JSON.stringify(bill)
    })
  },
  //新增按钮
  add_bill: function () {
    wx.navigateTo({
      url: '../billWrite/billWrite'
    })
  },
  initData: function () {
    var that = this, commonAPI = require('../../utils/common.js');
    commonAPI.getRequest(
      '/mini-program/getPersonBillByMonth',
      {},
      function (res) {
        if (res.data.success) {
            var bills = res.data.content, getMyDate = require('../../utils/util.js').formatDate;
          for (var i = 0; i <= bills.length - 1; i++) {
            bills[i].billDate = getMyDate(bills[i].billDate)
          }
          that.setData({
            billList: bills,
            isLoad: false
          })
          wx.hideLoading()
        }
      })
  },
  onPullDownRefresh: function () {
    this.initData();
    wx.stopPullDownRefresh();
  }
})