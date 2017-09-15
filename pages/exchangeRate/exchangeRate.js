var common = require('../../utils/common.js');
var app = getApp();
var token = '';
var reg = new RegExp(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/);//正数
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: false,
    billExchangeRate: 0,
    giveExchangeRate: 0,
    exchangeRateId: 1,
    tempGiveExchangeRate:0,
    tempGiveExchangeRate:0,
    isChangeRate:true
  },
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    token = wx.getStorageSync('authentication');
    var that = this;
    var roles = app.globalData.roles;
    if (roles.length < 1) wx.hideLoading();
    for (var i = 0; i < roles.length; i++) {
      if (roles[i] == 'ROLE_ADMIN') {
        that.setData({
          isAdmin: true
        })
        //获取积分兑换率
        common.getRequestSyn('/mini-program/admin/getExchangeRate', {},
         function (res) {
           if (res.data.success) {
             var exchangeRate = res.data.content;
             if (exchangeRate) {
               wx.hideLoading();
               that.setData({
                 billExchangeRate: exchangeRate.billPointsRate,
                 giveExchangeRate: exchangeRate.givePointsRate,
                 tempBillExchangeRate: exchangeRate.billPointsRate,
                 tempGiveExchangeRate: exchangeRate.givePointsRate,
                 exchangeRateId: exchangeRate.rateId,
               })
             }
           }
        })
      }
    }
    
  },
  showError: function () {
    var that = this;
    wx.showModal({
      content: that.data.errorMsg,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {

        }
      }
    });
  },
  tempBillExchangeRate: function (e) {
    var value = e.detail.value;
    if (value) {
      this.setData({
        tempBillExchangeRate: e.detail.value
      })
    }
  },
  tempGiveExchangeRate: function (e) {
    var value = e.detail.value;
    if (value) {
      this.setData({
        tempGiveExchangeRate: value
      })
    }
  },
  changeExchangeRate: function () {
    
    token = wx.getStorageSync('authentication');
    var that = this;
    that.setData({
      isChangeRate: true
    });
    if (!(reg.test(that.data.tempBillExchangeRate))) {
      that.setData({
        isExchange: false,
        errorMsg: '请输入正数'
      });
      this.showError();
    } else if (!(reg.test(that.data.tempGiveExchangeRate))) {
      that.setData({
        isExchange: false,
        errorMsg: '请输入正数'
      });
      this.showError();
    } else if (that.data.tempGiveExchangeRate.length > 10) {
      that.setData({
        isExchange: false,
        errorMsg: '最多11位数'
      });
      this.showError();
    } else if (that.data.tempBillExchangeRate.length > 10) {
      that.setData({
        isExchange: false,
        errorMsg: '最多11位数'
      });
      this.showError();
    } else if (that.data.isChangeRate) {
      wx.showLoading({
        title: '保存中...',
      });
      //获取积分兑换率
      common.getRequestSyn('/mini-program/admin/changeExchangeRate', 
        {
          rateId: that.data.exchangeRateId,
          billExchangeRate: that.data.tempBillExchangeRate,
          giveExchangeRate: that.data.tempGiveExchangeRate,
        },
        function (res) {
          if (res.data.success) {
            wx.hideLoading();
            var exchangeRate = res.data.content;
            if (exchangeRate) {
              that.setData({
                billExchangeRate: exchangeRate.billPointsRate,
                giveExchangeRate: exchangeRate.givePointsRate,
                exchangeRateId: exchangeRate.rateId,
              })
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              });
              setTimeout(function () {
                that.setData({
                  showMain: true
                })
              }, 2000);
            }
          }
        }, that.changeExchangeRate)
    }
  }

})