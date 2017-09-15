var app = getApp();
var util = require('../../utils/util.js');
var common = require('../../utils/common.js');
var token = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: true,
    label: '',
    pointBill: '',
    giveBill: '',
    givegGive: '',
    exchange: '',
    operator: '',
    givePeople: '',
    realName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    token = wx.getStorageSync('authentication');
    var that = this;
    var relateId = options.relateId;
    var label = options.label;
    var realName = options.realName;
    that.setData({
      label: label,
      realName: realName
    });
    var url = '';
    var params = {};
    var roles = app.globalData.roles;
    if (roles.length < 1) wx.hideLoading();
    for (var i = 0; i < roles.length; i++) {
      if (roles[i] == 'ROLE_EMPLOYEE' || roles[i] == 'ROLE_ADMIN') {
        if (label != 2 && label != 3 && label != 4) {
          url = '/mini-program/getPointBillById';
          params = { billId: relateId };
          common.getRequestSyn(url, params, function (res) {
            var data = res.data;
            if (data.success) {
              wx.hideLoading();
              var pointBill = data.content
              pointBill.createTime = util.getMyDate(pointBill.createTime);
              pointBill.updateTime = util.getMyDate(pointBill.updateTime);
              pointBill.billTime = util.formatDate(pointBill.billDate);
              that.setData({
                isShow: false,
                pointBill: data.content
              })
            }
          }, that.onLoad, options)
        } else if (label == 2) {
          url = '/mini-program/getGiveBillPointsById';
          params = { giveId: relateId };
          common.getRequestSyn(url, params, function (res) {
            var data = res.data;
            if (data.success) {
              wx.hideLoading();
              var giveBill = data.content[0]
              console.log(data.content)
              giveBill.createTime = util.getMyDate(giveBill.createTime);
              that.setData({
                isShow: false,
                giveBill: giveBill,
                givePeople: data.content[1]
              })
            }
          }, that.onLoad, options)
        } else if (label == 3) {
          url = '/mini-program/getGiveGivePointsById';
          params = { giveId: relateId };
          common.getRequestSyn(url, params, function (res) {
            var data = res.data;
            if (data.success) {
              wx.hideLoading();
              var givegGive = data.content[0]
              console.log(givegGive)
              givegGive.createTime = util.getMyDate(givegGive.createTime);
              that.setData({
                isShow: false,
                givegGive: givegGive,
                givePeople: data.content[1]
              })
            }
          }, that.onLoad, options)
        } else if (label == 4) {
          url = '/mini-program/getExchangePointsById';
          params = { exchangeId: relateId };
          common.getRequestSyn(url, params, function (res) {
            var data = res.data;
            if (data.success) {
              wx.hideLoading();
              var exchange = data.content[0];
              console.log(exchange)
              exchange.createTime = util.getMyDate(exchange.createTime);
              that.setData({
                isShow: false,
                exchange: exchange,
                operator: data.content[1]
              })
            }
          }, that.onLoad, options)
        }
        return;
      }
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
