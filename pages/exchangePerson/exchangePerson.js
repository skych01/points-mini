var common = require('../../utils/common.js');
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        employeeList: [],
        isLoad: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        var that = this;
        that.setData({
            isLoad: true
        });
        //获取权限
        var role = app.globalData.roles;
        var isAdmin = false;
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
                if (isAdmin) {
                    that.dataInit();
                } else {
                    wx.switchTab({
                        url: '../index/index'
                    });
                }
            });
        }
    },
    dataInit: function () {
        var that = this;
        //获取已经是本公司员工
        common.getRequest('/mini-program/admin/getEmployeeUser', {},
            function (res) {
                if (res.data.success) {
                    that.setData({
                        employeeList: res.data.content,
                    });
                    that.setData({
                        isLoad: false
                    });
                }
            })
    }
})