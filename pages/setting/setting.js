var app = getApp();
var Server_info = app.globalData.xiaochengxuInfo;
var ServerPath = Server_info.protocol + Server_info.domin_name + Server_info.pathContext;
var token = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    grids: [0],
  },
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    token = wx.getStorageSync('authentication');
    var that = this
    //获取已经是本公司员工
    
  },

})