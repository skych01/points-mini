// add_consignee.js
var app = getApp();
var date = new Date();
var commonAPI = require('../../utils/common.js');
var startDate = new Date(date - 2 * 24 * 60 * 60 * 1000);
Page({
    /**
     * 页面的初始数据
     */
    data: {
        //日期
        datetTime: '',
        isSelectTime: false,
        nowdate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getUTCDate(),
        startData: startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getUTCDate(),

        //类型
        pointsType: [],
        isSelectType: false,
        typeIndex: 0,
        //积分项
        pointsItem: [],
        isSelectItem: false,
        itemIndex: null,
        //默认数量
        pointsNum: 1,
        recordBill: [],
    },


    onLoad: function () {
        var that = this
        //获取权限
        var role = app.globalData.roles;
        if (role.length == 0) {
            app.getRoleInfo(function () {
                if (!role.length) {
                    wx.redirectTo({
                        url: '../regist/regist'
                    });
                } else {
                    that.dataInit();
                }
            });
        } else {
            that.dataInit();
        }
    },
    dataInit: function () {
        var that = this
        commonAPI.getRequest(
            '/mini-program/getPointsType',
            {},
            function (res) {
                if (res.data.success) {
                    that.setData({
                        pointsType: res.data.content,
                    })
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
            isSelectItem: false,
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




    //保存
    save: function () {
        var that = this
        //验证数据
        var data = this.data
        console.log(data)
        if (!data.isSelectTime) {
            wx.showModal({
                title: '',
                content: '请选择日期',
                showCancel: false
            })
            return;
        }
        if (!data.isSelectType) {
            wx.showModal({
                title: '',
                content: '请选择积分类型',
                showCancel: false
            })
            return;
        }
        if (!data.isSelectItem) {
            wx.showModal({
                title: '',
                content: '请选择积分项',
                showCancel: false
            })
            return;
        }
        var util = require('../../utils/util.js');
        if (!data.pointsNum || data.pointsNum <= 0 || !util.isPInt(data.pointsNum)) {
            wx.showModal({
                title: '',
                content: '请输入合法数字',
                showCancel: false
            })
            return;
        } else {
            if (isNaN(data.pointsNum)) {
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
        })
        commonAPI.getRequest(
            '/mini-program/addBill',
            {
                num: data.pointsNum,
                itemId: data.pointsItem[data.itemIndex].itemId,
                billDate: data.datetTime
            },
            function (res) {
                if (res.data.success) {
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 2000,
                    })
                    var data = that.data
                    var bill = {
                        date: data.datetTime.split("-")[1] + '-' + data.datetTime.split("-")[2],
                        pointsType: data.pointsType[data.typeIndex].groupName,
                        pointsItem: data.pointsItem[data.itemIndex].itemName,
                        num: data.pointsNum,
                        value: parseInt(data.pointsItem[data.itemIndex].itemValue) * parseInt(data.pointsNum)
                    }
                    console.log(parseInt(data.pointsItem[data.itemIndex].itemValue))
                    console.log(parseInt(data.pointsNum))
                    var array = data.recordBill
                    array.push(bill)
                    that.setData({
                        isSelectItem: false,
                        pointsNum: 1,
                        recordBill: array
                    })
                    wx.hideLoading()
                }
            })
    },



})