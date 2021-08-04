var easy_md5 = require('./data/md5.js');
var extendObj = require('./data/extendObj.js');
let tokenKey = 'user:token';
App({
  globalData: {
    rootDocment: 'http://test/api',
    v: "1.0",
    timeout: 120,
    app_key: '',
    app_secret: '',
  },
  onLaunch() {
  },
  onShow(){
     this.login(function() {
     })
  },
  checkWxSession(cb1, cb2) {
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        var user = wx.getStorageSync(tokenKey)||{};
        if (user.token) {
          cb1(user.token);
          return;
        }
        cb2();
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        cb2();
      }
    });
  },
  login (cb) {
    var that = this;
    that.checkWxSession(function(token) {
      cb(token);
    }, function() {
        that.getJsCode(function(code) {
          that.loadMsg('正在获取TOKEN');
          that.request('wechat.user.login', {code: code})
            .then((res) => {
              wx.hideToast();
              var alert = res.data;
              if (alert.code != 0) {
                that.errorTip(alert.msg);
              } else {
                wx.setStorageSync(tokenKey, {
                  user_id: alert.data.user_id,
                  token: alert.data.token,
                  openid: alert.data.openid,
                  session_key: alert.data.session_key
                });
                cb(alert.data.token);         
              }
            });
        });
    });
  },
  getTokenObject () {
    return wx.getStorageSync(tokenKey)||{};
  },
  updateTokenObject (data) {
    var newObj = this.getTokenObject();
    newObj.token = data.token ? data.token : newObj.token;
    newObj.user_id = data.user_id ? data.user_id : newObj.user_id;
    newObj.openid = data.openid ? data.openid : newObj.openid;
    newObj.session_key = data.session_key ? data.session_key : newObj.session_key;
    wx.setStorageSync(tokenKey, newObj);
  },
  getJsCode: function(cb) {
    cb = cb || function() { };
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var js_code = res.code;
        wx.getUserInfo({
          success: function (res1) {
            cb(js_code, res1);
          }
        });
      }
    })
  },
  requestUserInfo: function (e) {
    let that = this;
    return new Promise(function (resolve, reject) {
      wx.getUserProfile({
        desc: '获取你的昵称、头像',
        success: function(res) {
          let userInfo = res.userInfo;
          resolve(userInfo);
        },
        fail: function(res) {
          that.errorTip('您拒绝了请求');
        }
      });
    });
  },
  getRequestUrl: function(method, token) {
    return this.request(method, {}, token, 1);
  },
  request: function(method, data, token, return_url) {
    token = token||'';

    if (method == 'wechat.user.login') {
      return new Promise((resolve, reject) => {
        resolve({
          code: 0,
          data: {
            user_id: 0,
            session_key: '',
            token: '',
          }
        });
      })
    }

    return_url = return_url||0;
    var rootDocment = this.globalData.rootDocment + '', url_c = '';
    var sysParams = {
      method: method,
      v: this.globalData.v,
      timestamp: Math.round(new Date().getTime() / 1000) + "",
      noncestr: this.generateMixed(32),
      timeout: this.globalData.timeout,
      app_key: this.globalData.app_key,
    };
    var all_api_sys = this.objKeySort(sysParams);
    var strsign = "";
    var url_c = "";
    // 拼接sign
    for (var item in all_api_sys) {
      if (typeof all_api_sys[item] != "object") {
        strsign += item + all_api_sys[item];
      }
    }
    strsign = this.globalData.app_secret + strsign + this.globalData.app_secret;
    // 得到md5签名
    var md5 = easy_md5.md5(strsign).toUpperCase();
    for (var item in sysParams) {
      if (typeof sysParams[item] != "object") {
        url_c += item + "=" + sysParams[item] + "&";
      }
    }
    url_c += "sign=" + md5;
    if (return_url) return rootDocment+'?'+url_c;

    return new Promise((resolve, reject) => {
      wx.request({
        url: rootDocment + "?" + url_c,
        data: data,
        method: 'POST',
        dataType: "json",
        header: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        success: resolve,
        fail: reject
      });
    });
  },
  // 失败弹框
  errorTip: function (msg) {
    wx.showModal({
      title: '错误提示', 
      content: msg,
      showCancel: false,
    })
  },
  // 成功弹框
  sucTip: function (msg) {
    wx.showModal({
      title: '操作成功', 
      content: msg,
      showCancel: false,
    })
  },
  // 提供提示，自动关闭
  sucMsg: function(msg) {
    wx.showToast({title: msg, icon: 'success'});
  },
  // 加载提示，自动关闭
  loadMsg: function(msg) {
    wx.showToast({title: msg, icon: 'loading'});
  },
  // 简单提示，自动关闭
  msg: function(msg) {
    wx.showToast({title: msg, icon: 'none'});
  },
  // 生成32位随机数
  generateMixed: function (n) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * 35);
      res += chars[id];
    }
    return res.toLowerCase();
  },
  // 封装key值排序
  objKeySort: function (obj) {
    var newkey = Object.keys(obj).sort();
    var newObj = {};//创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
      newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj;//返回排好序的新对象
  },

  addSelectedSkuToCart: function(e, page_obj) {
    var type = parseInt(e.currentTarget.dataset.type);
    function get_sku_value(sku_obj) {
      if (sku_obj.style3_value) {
        return sku_obj.style1_value+','+sku_obj.style2_value+','+sku_obj.style3_value;
      } else if (sku_obj.style2_value) {
        return sku_obj.style1_value+','+sku_obj.style2_value;
      } else {
        return sku_obj.style1_value;
      }
    }
    return new Promise((resolve, reject) => {
        if (!page_obj.data.sku_obj.sku_id) {
          this.errorTip('没有选择规格');
          resolve();
          return;
        }
        let shopnum = parseInt(page_obj.data.shopnum)||0;
        if (shopnum <= 0) {
          this.errorTip('购买数量错误');
          resolve();
          return;
        }
        let add_info = [{
          "sku_id": page_obj.data.sku_obj.sku_id,
          "buy_num": shopnum
        }];
        var stock_num = page_obj.data.sku_obj.stock_num||0;
        if (shopnum > stock_num) {
          this.errorTip('超出了商品库存');
          resolve();
          return;
        }

        if (type === 0) { // 加入购物车

        } else {
          var integral_mall = 0;
          if (type == 2) { // 积分兑换
            integral_mall = 1;
          }
          wx.setStorageSync('make:order:data', [{
            product_id: page_obj.data.sku_obj.product_id,
            sell_price: page_obj.data.sku_obj.sell_price,
            sku_name: page_obj.data.sku_obj.style_name,
            sku_value: get_sku_value(page_obj.data.sku_obj),
            pic_url: page_obj.data.sku_obj.pic_url,
            sku_id: page_obj.data.sku_obj.sku_id,
            qty: shopnum,
            product_name: page_obj.data.product_name,
            integral_mall: integral_mall,
            integral_num: page_obj.data.sku_obj.integral_num,
          }]);
          wx.navigateTo({
            url: '/pages/confirmOrder/confirmOrder'
          });
        }
    });
  },

  setSelectedAddrInfo(addr_info) {
    wx.setStorageSync('make:order:addr', addr_info);
  },

  getSelectedAddrInfo() {
    return wx.getStorageSync('make:order:addr');
  },

  getErrorMsg(alert) {
    if (alert.code === 50001) {
      return '还未成为会员，请去注册会员';
    }
    return alert.msg;
  }

})
