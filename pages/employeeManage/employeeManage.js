// consignee_config.js
var app = getApp()
var commonAPI = require('../../utils/common.js');
var employeeList = [], registList = []
Page({
    /**
     * 页面的初始数据
     */
    data: {
        employeeList: [],
        registList: [],
        inputShowed: false,
        isLoad: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        var that = this
        that.setData({
            isLoad: true
        });

        //获取权限
        var role = app.globalData.roles;
        var isAdmin=false;
        //判断是否是管理员
        for (var i = 0; i < role.length; i++) {
            if (role[i] == 'ROLE_ADMIN') {
                isAdmin = true
                break;
            }
        }
        if (isAdmin) {
            that.dataInit();
        } else {
            app.getRoleInfo(function () {
                role = app.globalData.roles;
                for (var i = 0; i < role.length; i++) {
                    if (role[i] == 'ROLE_ADMIN') {
                        isAdmin = true
                        break;
                    }
                }
                if (isAdmin){
                    that.dataInit();
                }else{
                    wx.switchTab({
                        url: '../index/index'
                    });
                }
            });
        }
    },

    dataInit: function () {
        var that = this
        //获取 已注册未 审核的员工
        commonAPI.getRequest(
            '/mini-program/admin/getPointsUser',
            {},
            function (res) {
                if (res.data.success) {
                    registList = res.data.content.registUser;
                    employeeList = res.data.content.employeeUser;
                    that.setData({
                        registList: registList,
                        employeeList: employeeList,
                    })
                    that.setData({
                        isLoad: false
                    });
                }
            })
    },
    switch_change: function (e) {
        var that = this
        var openId = e.target.dataset.id
        if (e.detail.value) {
            wx.showLoading({
                title: '',
                mask: true
            })
            //获取员工
            commonAPI.getRequest(
                '/mini-program/admin/addUser',
                { openId: openId },
                function (res) {
                    if (res.data.success) {
                        wx.hideLoading()
                    }
                })
        } else {
            wx.showLoading({
                title: '',
            })
            commonAPI.getRequest(
                '/mini-program/admin/delUser',
                { openId: openId },
                function (res) {
                    if (res.data.success) {
                        wx.hideLoading()
                    }
                })
        }
    },
    
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            registList: registList,
            employeeList: employeeList,
            inputVal: "",
            inputShowed: false
        });

    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        var that = this
        var info = e.detail.value
        if (info.length == 0) {
            that.setData({
                registList: registList,
                employeeList: employeeList,
            })
            return;
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        commonAPI.getRequest(
            '/mini-program/admin/getPointsUserByInfo',
            { info: info },
            function (res) {
                if (res.data.success) {
                    that.setData({
                        registList: res.data.content.registUser,
                        employeeList: res.data.content.employeeUser,
                    })
                    wx.hideLoading()
                }
            })
    },
    cleanInput: function (e) {
        var that = this
        var info = e.detail.value
        if (info.length == 0) {
            that.setData({
                registList: registList,
                employeeList: employeeList,
            })
            return;
        }
    }



})