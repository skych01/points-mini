var common = require('../../utils/common.js');
var app = getApp();
var token = '';
var reg = new RegExp(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/);//正数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips:false,
    errorMsg: '',
    billExchangeRate: 100,
    giveExchangeRate: 100,
    exchangeRateId: 1,
    givePiontsNum: '',
    billPiontsNum: '',
    restBillPoints: 0,
    restGivePoints: 0,
    exchangeVal: 0, 
    changeOpenId: '',
    memo: '',
    userInfo: '',
    realName: '',
    isRead: false,
    isExchange:true,
    isChangeRate: true,
    memoLength: 0
  },
  sureToExChange: function () {
    var that = this;
    that.setData({
      isExchange: true
    });
    if (!(/^(\+)?\d+$/.test(that.data.billPiontsNum)) && that.data.billPiontsNum != 0) {
      that.setData({
        isExchange: false,
        errorMsg: '填报积分为0或正整数'
      });
      that.showError();
    } else if (that.data.billPiontsNum == 0 && that.data.givePiontsNum == 0) {
      that.setData({
        isExchange: false,
        errorMsg: '积分不能都为零'
      });
      that.showError();
    } else if (!(/^(\+)?\d+$/.test(that.data.givePiontsNum)) && that.data.givePiontsNum != 0) {
      that.setData({
        isExchange: false,
        errorMsg: '赠送积分为0或正整数'
      });
      that.showError();
    } else if (that.data.billPiontsNum > that.data.restBillPoints) {
      that.setData({
        isExchange: false,
        errorMsg: '可用填报积分不足'
      });
      that.showError();
    } else if (that.data.givePiontsNum > that.data.restGivePoints) {
      that.setData({
        isExchange: false,
        errorMsg: '可用赠送积分不足'
      });
      that.showError();
    } else if (that.data.memoLength > 200) {
      that.setData({
        isExchange: false,
        errorMsg: '备注最多200个字符'
      });
      that.showError();
    } else if (that.data.memoLength > 200) {
      that.setData({
        isExchange: false,
        errorMsg: '备注最多200个字符'
      });
      that.showError();
    } else if (that.data.billPiontsNum.length > 10) {
      that.setData({
        isExchange: false,
        errorMsg: '一次最多兑换1000000000填报积分'
      });
      that.showError();
    } else if (that.data.givePiontsNum.length > 10) {
      that.setData({
        isExchange: false,
        errorMsg: '一次最多兑换1000000000赠送积分'
      });
      that.showError();
    }else{
      var echangeTip = '兑换员工 ' + that.data.realName +' ';
      if (that.data.billPiontsNum) {
        echangeTip += that.data.billPiontsNum + '填报积分 ';
      }
      if (that.data.givePiontsNum) {
        echangeTip += (that.data.givePiontsNum ? that.data.givePiontsNum : 0) + '赠送积分';
      }
      wx.showModal({
        title: '确认兑换？',
        content: echangeTip,
        confirmText: "确认",
        cancelText: "取消",
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            that.toExchange();
          } else {
            
          }
        }
      });
    }
  },
  showError: function () {
    var that= this;
    wx.showModal({
      content: that.data.errorMsg,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          
        }
      }
    });
  },
  toExchange: function () {
    wx.showLoading({
      title: '兑换中...',
      mask: true
    });
    token = wx.getStorageSync('authentication');
    var that = this;
    if(that.data.isExchange){
      that.setData({
        isRead: false
      });
      
      common.getRequestSyn('/mini-program/admin/toExchangePionts', {
        rateId: that.data.exchangeRateId,
        changeOpenId: that.data.changeOpenId,
        billPoints: that.data.billPiontsNum ? that.data.billPiontsNum : 0,
        givePoints: that.data.givePiontsNum ? that.data.givePiontsNum : 0,
        memo: that.data.memo,
      },
        function (res) {
          if (res.data.success) {
            wx.hideLoading();
            that.setData({
              restBillPoints: that.data.restBillPoints - that.data.billPiontsNum,
              restGivePoints: that.data.restGivePoints - that.data.givePiontsNum,
              billPiontsNum: that.data.billPiontsNum ? that.data.billPiontsNum : 0,
              givePiontsNum: that.data.givePiontsNum ? that.data.givePiontsNum : 0,
            });
            wx.showToast({
              title: '兑换成功',
              icon: 'success',
              duration: 3000
            });
          } else {
            wx.showModal({
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {

                }
              }
            });
          }
          setTimeout(function () {
            that.setData({
              isRead: true
            })
          }, 3000);
        }, that.toExchange)

    }
  },
  billPiontsNum: function (e) {
    var exchangeVal = (e.detail.value * this.data.billExchangeRate
      + this.data.givePiontsNum * this.data.giveExchangeRate) / 100;
    this.setData({
      billPiontsNum: e.detail.value,
      exchangeVal: (reg.test(exchangeVal)) ? exchangeVal.toFixed(2) : 0
    })
  },
  givePiontsNum: function (e) {
    var exchangeVal = (this.data.billPiontsNum * this.data.billExchangeRate
      + e.detail.value * this.data.giveExchangeRate)/100;
    this.setData({
      givePiontsNum: e.detail.value,
      exchangeVal: (reg.test(exchangeVal)) ? exchangeVal.toFixed(2) : 0
    })
  },
  
  /**
   * 备注
   */
  memo: function(e) {
    var memoLength = e.detail.value.length;
    this.setData({
      memo: e.detail.value,
      memoLength: memoLength
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getEmployeePortrait: function (that,options){
    //获取员工微信头像
    common.getRequestSyn('/mini-program/admin/getwxUser', 
      { openId: options.openId},
      function (res) {
        if (res.data.success) {
          that.setData({
            userInfo: res.data.content,
          })
        }
      }, that.onLoad, options)
  },
  getEmployeePoints: function (that, options) {
    //获取员工积分
    common.getRequestSyn('/mini-program/availablePoints',
      { openId: options.openId },
      function (res) {
        if (res.data.success) {
          var data = res.data.content;
          that.setData({
            restBillPoints: data ? (data.restBillPoints ? data.restBillPoints : 0) : 0,
            restGivePoints: data? (data.restGivePoints ? data.restGivePoints : 0) : 0
          })
        }
        wx.hideLoading();
      }, that.onLoad, options)
  },
  getExchangeRate: function (that, options) {
    //获取积分兑换率
    common.getRequestSyn('/mini-program/admin/getExchangeRate', {},
      function (res) {
        if (res.data.success) {
          var exchangeRate = res.data.content;
          if (exchangeRate) {
            that.setData({
              billExchangeRate: exchangeRate.billPointsRate,
              giveExchangeRate: exchangeRate.givePointsRate,
              exchangeRateId: exchangeRate.rateId,
              isRead: true
            })
          }
        }
      }, that.onLoad, options)
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    token = wx.getStorageSync('authentication');
    var that = this;
    that.setData({
      realName: options.employeeName,
      changeOpenId: options.openId
    });
    var roles = app.globalData.roles;
    if (roles.length < 1) wx.hideLoading();
    for (var i = 0; i < roles.length; i++) {
      if (roles[i] == 'ROLE_ADMIN') {
        that.getEmployeePortrait(that, options);
        that.getEmployeePoints(that, options);
        that.getExchangeRate(that);
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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