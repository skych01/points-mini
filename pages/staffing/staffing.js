// consignee_config.js
var app = getApp()
var commonAPI = require('../../utils/common.js');
var date = new Date()
function getzf(num) {
  if (parseInt(num) < 10) {
    num = '0' + num;
  }
  return num;
}
var isRead = false

Page({
  /**
   * 页面的初始数据
   */
  data: {
    employeeList: [],
    date: date.getFullYear() + "-" + getzf(date.getMonth() + 1),
    nowdate: date.getFullYear() + "-" + (date.getMonth() + 1)
  },

  onShow: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //获取权限
    var roles = app.globalData.roles
    if (roles.length == 0) {
      commonAPI.getRequest(
        "/mini-program/getRoles", {},
        function (res) {
          if (res.data.success) {
            var isEmployee
            var roles = res.data.content
            console.log(roles)
            for (var i = 0; i < roles.length; i++) {
              if (roles[i].roleName == 'ROLE_EMPLOYEE') {
                isEmployee = true
                break;
              }
            }
            //权限没通过 跳转注册页面
            if (!isEmployee) {
              wx.redirectTo({
                url: '../regist/regist'
              })
              return;
            }
            that.dataInit()
          }
        })
    } else {
      that.dataInit()
    }

  },
  dataInit: function () {
    var that = this
    commonAPI.getRequest(
      '/mini-program/getEmployeeUserByDate',
      {
        year: that.data.date.split('-')[0],
        month: that.data.date.split('-')[1]
      },
      function (res) {
        if (res.data.success) {
          var list = res.data.content
          
          for (var i = 0; i < list.bill.length; i++) {
            list.bill[i].give = list.give[i].points
          }
          that.setData({
            employeeList: list.bill
          })
          console.log(list.bill)
          wx.hideLoading()
        }
      })
  },

  pointsDetail: function (e) {
    console.log(e)
    var date = e.currentTarget.dataset.date
    var open_id = e.currentTarget.dataset.employee.open_id
    var realName = e.currentTarget.dataset.employee.real_name
    wx.navigateTo({
      url: '../pointsRecords/pointsRecords?date=' + date + '&openId=' + open_id + '&realName=' + realName
    })
  },
  bindDateChange: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.setData({
      date: e.detail.value
    })
    console.log(e.detail.value);
    var year = e.detail.value.split('-')[0]
    var month = e.detail.value.split('-')[1]
    //页面每次显示加载当月可用填单积分
    commonAPI.getRequest(
      '/mini-program/getEmployeeUserByDate',
      {
        year: that.data.date.split('-')[0],
        month: that.data.date.split('-')[1]
      },
      function (res) {
        if (res.data.success) {
          var list = res.data.content
          for (var i = 0; i < list.bill.length; i++) {
            list.bill[i].give = list.give[i].points
          }
          that.setData({
            employeeList: list.bill
          })
          console.log(list.bill)
          wx.hideLoading()
        }
      })

  },
  onPullDownRefresh: function () {
    this.dataInit();
    wx.stopPullDownRefresh();
  }


})