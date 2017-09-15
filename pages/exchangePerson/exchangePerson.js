var common = require('../../utils/common.js');
var app = getApp();
var token = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    employeeList: [],
  },
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    token = wx.getStorageSync('authentication');
    //获取权限
    var roles = app.globalData.roles;
    if (roles.length < 1) wx.hideLoading();
    for (var i = 0; i < roles.length; i++) {
      if (roles[i] == 'ROLE_ADMIN') {
        //获取已经是本公司员工
        common.getRequestSyn('/mini-program/admin/getEmployeeUser', {}, 
          function  (res) {
            if (res.data.success) {
              that.setData({
                employeeList: res.data.content,
              });
              wx.hideLoading();
            }
          }, that.onShow)
      }
    }
  },

})