// consignee_config.js
var app = getApp()
var commonAPI = require('../../utils/common.js');
var serverInfo = app.globalData.xiaochengxuInfo;
var serverPath = serverInfo.protocol + serverInfo.domin_name + serverInfo.pathContext
var givePoints = 0
var selEmployee = []
var selEmployeeName = []
Page({
    /**
     * 页面的初始数据
     */
    data: {
        employeeList: [],
        billValue: 0,
        giveValue: 0,
        isLoad: true
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this
        console.log(that.data.employeeList)
        that.setData({
            isLoad: true
        })
        var role = app.globalData.roles;
        if (role.length == 0) {
            app.getRoleInfo(function () {
                role = app.globalData.roles;
                if (!role.length) {
                    wx.redirectTo({
                        url: '../regist/regist'
                    });
                } else {
                    that.initData();
                }
            });
        } else {
            that.initData();
        }
    },
    initData: function () {
        var that = this
        //获取所有员工
        commonAPI.getRequestSyn(
            '/mini-program/getEmployeeUser',
            {},
            function (res) {
                if (res.data.success) {
                    that.setData({
                        employeeList: res.data.content,
                    })
                }
            }, that.initData)

        //获取可用积分
        commonAPI.getRequestSyn(
            '/mini-program/availablePoints',
            {},
            function (res) {
                if (res.data.success) {
                    that.setData({
                        billValue: res.data.content.restBillPoints,
                        giveValue: res.data.content.restGivePoints,
                        isLoad: false
                    })
                }
            }, that.initData)
    },
    //选中添加到数组 取消选中从数组删除
    switch_change: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        selEmployeeName = []
        var employeeList = this.data.employeeList, employee = e.detail.value;
        for (var i = 0, lenI = employeeList.length; i < lenI; ++i) {
            employeeList[i].checked = false;

            for (var j = 0, lenJ = employee.length; j < lenJ; ++j) {
                if (employeeList[i].openId == employee[j]) {
                    employeeList[i].checked = true;
                    selEmployeeName.push(employeeList[i].realName)
                    break;
                }
            }
        }

        this.setData({
            employeeList: employeeList
        });
        selEmployee = employee
    },

    change_name: function (e) {
        givePoints = e.detail.value
    },

    submit: function () {
        console.log(selEmployee)
        console.log(selEmployeeName)
        var that = this
        console.log(givePoints)
        if (givePoints <= 0) {
            wx.showModal({
                title: '',
                content: '请填写要赠送的分值',
                showCancel: false,
            })
            return
        }
        if (selEmployee.length <= 0) {
            wx.showModal({
                title: '',
                content: '请选择赠送的员工',
                showCancel: false,
            })
            return
        }
        var data = that.data
        if (givePoints > (data.billValue + data.giveValue)) {
            wx.showModal({
                title: '',
                content: '您的积分不够无法赠送',
                showCancel: false,
            })
            return
        }
        if (givePoints % selEmployee.length != 0) {
            wx.showModal({
                title: '',
                content: '赠送积分无法平分，请重新填写',
                showCancel: false,
            })
            return
        }
        console.log(selEmployeeName)
        if (selEmployee.length != 1) {
            var tip = '赠送给' + selEmployeeName[0] + '等' + selEmployee.length + '个员工，每人' + givePoints / selEmployee.length + '分'
        } else {
            var tip = '赠送给' + selEmployeeName[0] + givePoints + '分'
        }
        wx.showModal({
            title: '确定赠送' + givePoints + '积分？',
            content: tip,
            success: function (res) {
                if (res.confirm) {
                    that.RequestGivePoints(that)
                }
            }
        })
    },

    RequestGivePoints: function (that) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        commonAPI.postRequest(
            '/mini-program/addGivePoints',
            {
                points: givePoints,
                employees: selEmployee
            },
            function (res) {
                console.log('success_commonAPI')
                if (res.data.success) {
                    if (res.data.success) {
                        wx.showModal({
                            title: '',
                            content: '成功赠送' + res.data.content + '积分！',
                            showCancel: false,
                        })
                        //获取可用积分
                        commonAPI.getRequest(
                            '/mini-program/availablePoints',
                            {},
                            function (res) {
                                console.log('success_commonAPI')
                                if (res.data.success) {
                                    that.setData({
                                        billValue: res.data.content.restBillPoints,
                                        giveValue: res.data.content.restGivePoints
                                    })
                                    wx.hideLoading()
                                }
                            })
                    } else {
                        wx.showModal({
                            title: '',
                            content: '您的积分不足无法赠送',
                            showCancel: false
                        })
                    }
                }
            })
        // var token = wx.getStorageSync('authentication');
        // wx.request({
        //     url: serverPath + '/mini-program/addGivePoints',
        //     method: "POST",
        //     header: {
        //         "Authorization": "Bearer " + token,
        //         "Content-Type": "application/x-www-form-urlencoded"
        //     },
        //     data: {
        //         points: givePoints,
        //         employees: selEmployee
        //     }
        //     ,
        //     success: function (res) {
        //         if (res.statusCode == 200) {
        //             if (res.data.success) {
        //                 wx.showModal({
        //                     title: '',
        //                     content: '成功赠送' + res.data.content + '积分！',
        //                     showCancel: false,
        //                 })
        //                 //获取可用积分
        //                 commonAPI.getRequest(
        //                     '/mini-program/availablePoints',
        //                     {},
        //                     function (res) {
        //                         console.log('success_commonAPI')
        //                         if (res.data.success) {
        //                             that.setData({
        //                                 billValue: res.data.content.restBillPoints,
        //                                 giveValue: res.data.content.restGivePoints
        //                             })
        //                             wx.hideLoading()
        //                         }
        //                     })
        //             } else {
        //                 wx.showModal({
        //                     title: '',
        //                     content: '您的积分不足无法赠送',
        //                     showCancel: false
        //                 })
        //             }
        //         } else {
        //             var loginTime = ++app.globalData.loginTime
        //             if (loginTime < 3) {
        //                 app.onLogin(that.RequestGivePoints, that)
        //             } else {
        //                 wx.showModal({
        //                     title: '连接失败',
        //                     content: '网络连接失败，请稍后再试',
        //                 })
        //             }
        //         }
        //     },
        // })
    },
    onPullDownRefresh: function () {
        this.dataInit();
        wx.stopPullDownRefresh();
    }
})