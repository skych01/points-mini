// add_consignee.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    employeeName: '',
    realName: ''
  },

  onShow: function () {
    var that = this, role = app.globalData.roles;
        app.getRoleInfo(function () {
            if (role.length) {
                wx.redirectTo({
                    url: '../index/index'
                });
            } 
            that.setData({
                realName: app.globalData.employeeName,
                employeeName: app.globalData.employeeName
            })
        });
  },

  //获取input
  change_name: function (e) {
    this.setData({
      employeeName: e.detail.value
    })
  },

  //提交积分单
  save: function (e) {
      var that = this,commonAPI = require('../../utils/common.js');
    //验证数据
    if (!that.data.employeeName) {
      wx.showModal({
        title: '',
        content: '请将信息填写完整',
        showCancel: false
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    commonAPI.getRequest(
      '/mini-program/regist',
      { realName: that.data.employeeName },
      function (res) {
        if (res.data.success) {
          wx.hideLoading()
          wx.showModal({
            title: '',
            content: '提交成功，等待管理员审核',
            showCancel: false,
            success: function () {
              wx.switchTab({
                url: '../index/index'
              })
            }
          })
        }
      })
  }
})