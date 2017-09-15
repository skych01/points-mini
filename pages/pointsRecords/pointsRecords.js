var common = require('../../utils/common.js');
var app = getApp();
var token = '';
var date = new Date()
function getzf(num) {
  if (parseInt(num) < 10) {
    num = '0' + num;
  }
  return num;
}
// 拼接日期 以 年月日 
function getMyDate(str) {
  var oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMinutes = oDate.getMinutes(),
    oSecond = oDate.getSeconds(),
    weekDay = oDate.getDay(),
    oTime = getzf(oMonth) + '-' + getzf(oDay);
  weekDay = weekDay == 1 ? '星期一' : weekDay == 2 ? '星期二' : weekDay == 3 ? '                    星期三' : weekDay == 4 ? '星期四' : weekDay == 5 ? '星期五' : weekDay == 6 ? '星期六' : weekDay == 7 ? '星期日' : '未知'
  oTime = { weekDay: weekDay, createTime: oTime }
  return oTime;
};
var page = 1, totalPage = 0;
var params = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pointsRecords: [],
    realName: '',
    isNextPage: false,
    pageShow:false
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var date = options.date;
    var openId = options.openId;
    var realName = options.realName;
    token = wx.getStorageSync('authentication');
    var that = this
    var roles = app.globalData.roles;

    var url = '';
    if (roles.length < 1) wx.hideLoading();
    for (var i = 0; i < roles.length; i++) {
      if (roles[i] == 'ROLE_EMPLOYEE' || roles[i] == 'ROLE_ADMIN') {
        url = '/mini-program/getEmployeeGiveGiveByDate';
        params = {
          openId: openId,
          year: date.split('-')[0],
          month: date.split('-')[1],
          page: page,
          totalPage: totalPage
        };
        common.getRequestSyn(url, params, function (res) {
          if (res.data.success) {

            var giveGiveList = res.data.content.data
            totalPage = res.data.content.totalPage
            for (var i = 0; i < giveGiveList.length; i++) {
              giveGiveList[i].bill_date = getMyDate(giveGiveList[i].bill_date)
            }
            that.setData({
              pointsRecords: giveGiveList,
              realName: realName,
              isNextPage: page < totalPage,
              pageShow: page < totalPage
            })
            console.log(page < totalPage)
            console.log('page' + page)
            console.log('totalPage' + totalPage)
            wx.hideLoading();
          }
        }, that.onLoad, options)
        return;
      }
    }

  },
  toPointsDetails: function (value) {
    var lable = value.currentTarget.dataset.lable
    var realName = value.currentTarget.dataset.realName
    var relateId = value.currentTarget.dataset.relateId
    wx.navigateTo({
      url: '../pointsDetails/pointsDetails?relateId=' + relateId + '&label=' + lable + '&realName=' + realName
    })
  },

  onReachBottom: function () {
    var that = this
    if (that.data.isNextPage) {
      page++
      params.page = page;
      params.totalPage = totalPage;
      common.getRequest('/mini-program/getEmployeeGiveGiveByDate', params, function (res) {
        if (res.data.success) {
          var giveGiveList = res.data.content.data
          totalPage = res.data.content.totalPage
          for (var i = 0; i < giveGiveList.length; i++) {
            giveGiveList[i].bill_date = getMyDate(giveGiveList[i].bill_date)
          }
          var giveGiveListOld = that.data.pointsRecords.concat(giveGiveList);
          that.setData({
            pointsRecords: giveGiveListOld,
            isNextPage: page < totalPage
          })

          wx.hideLoading();
        }
      })
    }
  },

  onUnload: function () {
    page = 1;
    totalPage = 0;
    params.page = page;
  }


})