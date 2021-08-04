var app = getApp();
var _self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    components: [
      {name: 'Button', path: 'components/button/button'},
      {name: 'Icon列表', path: 'components/iconlist/iconlist'},
      {name: '轮播图', path: 'components/slider/slider'},
      {name: '侧边+右边分类页', path: 'components/category/category'},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _self = this;
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        _self.setData({
          winHeight: calc - 20
        });
      }
    });
  },

  gotocom: function(e) {
    var componentPath = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: '/pages/' + componentPath
    })
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