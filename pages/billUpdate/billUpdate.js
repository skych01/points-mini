// add_consignee.js
var app = getApp()
var commonAPI = require('../../utils/common.js');
var date = new Date();
var startDate = new Date(date - 2 * 24 * 60 * 60 * 1000);
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //日期
    datetTime: '',
    isSelectTime: false,
    //类型
    pointsType: [],
    isSelectType: false,
    typeIndex: 0,
    //积分项
    pointsItem: [],
    isSelectItem: false,
    itemIndex: 0,
    //默认数量
    pointsNum: 1,
    //修改订单 进入此页面会传一个 pointsBill
    ponitsBill: {},
    //现在日期 
    nowdate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getUTCDate(),
    startData: startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getUTCDate(),
  },

  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    // 传递过来的参数没取到 调到上一个页面
    if (!options.bill) {
      wx.navigateBack({
        delta: 1
      })
      return;
    }

    //获取权限
    var role = app.globalData.roles;
    if (role.length == 0) {
        app.getRoleInfo(function () {
            if (!role.length) {
                wx.redirectTo({
                    url: '../regist/regist'
                });
            } else {
                that.dataInit(options);
            }
        });
    } else {
        that.dataInit(options);
    }
  },
  //数据初始化
  dataInit: function (options) {
    var that = this
    //请求 分类
    commonAPI.getRequest(
      '/mini-program/getPointsType',
      {},
      function (res) {
        if (res.data.success) {
          that.setData({
            pointsType: res.data.content,
          })
          //bill 传来的
          var bill = JSON.parse(options.bill)
          var types = res.data.content
          for (var j = 0, len = types.length; j < len; j++) {
            if (types[j].groupName == bill.pointsItem.pointsItemGroup.groupName) {
              that.setData({
                typeIndex: j,
                pointsNum: bill.num,
                ponitsBill: bill
              })
            }
          }
          //查找该分类的项目
          commonAPI.getRequest(
            '/mini-program/getPointsItem',
            { groupId: that.data.pointsType[that.data.typeIndex].groupId },
            function (res) {
              if (res.data.success) {
                var items = res.data.content
                console.log(items)
                for (var i = 0, len = items.length; i < len; i++) {
                  if (items[i].itemName == bill.pointsItem.itemName) {
                    that.setData({
                      pointsItem: items,
                      itemIndex: i
                    })
                    return;
                  }
                }
              }
            })
          that.setData({
            datetTime: bill.billDate,
            isSelectTime: true,
            isSelectType: true,
            isSelectItem: true
          })
          wx.hideLoading()
        }
      })
  },
  //选择时间
  change_date: function (e) {
    var that = this
    console.log(e)
    that.setData({
      datetTime: e.detail.value,
      isSelectTime: true
    })
  },
  //选择类型
  change_type: function (e) {
    var that = this
    var typeIndex = e.detail.value
    wx.showNavigationBarLoading();
    that.setData({
      typeIndex: typeIndex,
      isSelectType: true
    })
    commonAPI.getRequest(
      '/mini-program/getPointsItem',
      { groupId: that.data.pointsType[typeIndex].groupId },
      function (res) {
        if (res.data.success) {
          that.setData({
            pointsItem: res.data.content,
          })
          wx.hideNavigationBarLoading();
        }
      })
  },
  //选择积分项
  change_item: function (e) {
    var that = this
    that.setData({
      itemIndex: e.detail.value,
      isSelectItem: true
    })
  },
  //取消按钮跳转上页
  quxiao: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //获取input
  change_num: function (e) {
    this.setData({
      pointsNum: e.detail.value
    })
  },
  //修改
  update: function () {
    var that = this
    var billId = that.data.ponitsBill.billId
    if (!that.data.pointsNum || that.data.pointsNum <= 0 || !util.isPInt(that.data.pointsNum)) {
      wx.showModal({
        title: '',
        content: '请填写数量',
        showCancel: false
      })
      return;
    } else {
      if (isNaN(that.data.pointsNum)) {
        wx.showModal({
          title: '',
          content: '请输入合法数字',
          showCancel: false
        })
        return;
      }
    }
    wx.showLoading({
        title: '加载中',
        mask: true
    });
    commonAPI.getRequest(
      '/mini-program/updateBill',
      {
        billId: billId,
        num: that.data.pointsNum,
        itemId: that.data.pointsItem[that.data.itemIndex].itemId,
        billTime: that.data.datetTime
      },
      function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 3000,
            success: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
          wx.hideLoading()
        }
      })
  },
  //删除按钮
  del_bill: function (e) {
    var that = this;
    wx.showModal({
      title: '',
      content: '确认删除此记录？',
      success: function (res) {
        if (res.confirm) {
          that.requestDel(e);
        }
      }
    })
  },
  requestDel: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var billId = that.data.ponitsBill.billId
    commonAPI.getRequest(
      '/mini-program/delBill',
      {
        billId: billId
      },
      function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
          wx.hideLoading()
        } else {
          wx.showModal({
            title: '',
            content: '已经过了删除或修改时间了！',
            showCancel: false
          })
        }
      })
  }
})