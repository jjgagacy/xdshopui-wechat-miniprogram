const app = getApp();
var _self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    has_next: 1,
    page: 1,
    keywords: '',
    current_cat_id: 1,
    cat_list: [
      {cat_id: 1, cat_name: '服饰'},
      {cat_id: 2, cat_name: '鞋子'},
      {cat_id: 3, cat_name: '帽子'},
      {cat_id: 4, cat_name: '裙子'},
      {cat_id: 5, cat_name: 'BB霜'},
      {cat_id: 6, cat_name: '防晒霜'},
      {cat_id: 7, cat_name: '项链'},
      {cat_id: 8, cat_name: '项链'},
      {cat_id: 9, cat_name: '项链'},
      {cat_id: 10, cat_name: '项链'},
      {cat_id: 11, cat_name: '项链'},
      {cat_id: 12, cat_name: '项链'},
      {cat_id: 13, cat_name: '项链'},
      {cat_id: 14, cat_name: '项链'},
      {cat_id: 15, cat_name: '项链'},
      {cat_id: 16, cat_name: '项链'},
      {cat_id: 17, cat_name: '项链'},
    ],
    product_list: [
      {product_id: 1, product_name: 'test001'},
      {product_id: 2, product_name: 'test002'},
      {product_id: 3, product_name: 'test003'},
      {product_id: 4, product_name: 'test004'},
      {product_id: 5, product_name: 'test005'},
      {product_id: 6, product_name: 'test006'},
      {product_id: 7, product_name: 'test007'},
      {product_id: 7, product_name: 'test008'},
      {product_id: 7, product_name: 'test009'},
      {product_id: 7, product_name: 'abd'},
      {product_id: 7, product_name: 'asdkjfadf'},
      {product_id: 7, product_name: 'asdf231231'},
      {product_id: 7, product_name: 'aksdjfa,asdfjad,fm'},
      {product_id: 7, product_name: '123'},
      {product_id: 7, product_name: '456'},
      {product_id: 7, product_name: '111'},
      {product_id: 7, product_name: '000'},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _self = this;
    //高度自适应  
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        _self.setData({
          winHeight: calc - 120
        });
      }
    });
  },

  formSubmit: function(e) {
    _self.formConfirm();
  },

  // todo 现在搜索不清空类目
  formConfirm: function(e) {
    _self.reset();
    _self.loadList();
  },

  setkeywords: function(e) {
    _self.setData({keywords: e.detail.value});
  },

  loadList: function() {

  },

  onSwitchCat: function(e) {
    var cat_id = e.currentTarget.dataset.id;
    _self.setData({
      current_cat_id: cat_id
    })
  },

  onscolllowercat: function() {

  },

  

})