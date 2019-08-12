var app = getApp();
Page({
  data: {
    bedId: '',
    money: '',
    timeStamp: '',
    nonceStr: '',
    package: '',
    signType: 'MD5',
    paySign: ''
  },
  onLoad(options) {
    this.setData({
      bedId: options.bedId,
      money: options.money/100
    });
    
  },
  bindPayBtn() {
    var that = this;
    // 支付接口
    this.getBuyVedio();
  },
  bindCannelBtn() {
    wx.switchTab({
      url: '../player/player',
    })
  },
  // 后端支付接口
  getBuyVedio() {
    var that = this;
    return new Promise(function (resolve, reject) {
      // 调用支付接口
      let url = app.globalData.URL + 'wx/user/buyVedio';
      var data = {
        bedId: that.data.bedId
      };
      console.log("购买", app.globalData.userInfo);
      // 支付
      wx.request({
        url: url, //  获取购买记录接口  
        data: JSON.stringify(data),
        method: 'POST', //请求方式
        header: {
          'content-type': 'application/json', // 默认值
          'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
        },
        success: (res) => {
          console.log(res);
          console.log('7845123')
          if (res.data.code == 500) {
            wx.showModal({
              title: '',
              content: res.data.msg,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          } else {
            that.setData({
              timeStamp: res.data.order.timeStamp,
              nonceStr: res.data.order.nonceStr,
              package: res.data.order.packageValue,
              signType: res.data.order.signType,
              paySign: res.data.order.paySign
            });
            that.getWXpay();
          }
          resolve(res);
          console.log("pay", res);
        },
        error: (res) => {
          console.log(res);
          wx.showModal({
            title: '',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
          reject('error');
        }
      })
    })
  },
  // 前端支付接口
  getWXpay() {
    wx.requestPayment({
      timeStamp: this.data.timeStamp,
      nonceStr: this.data.nonceStr,
      package: this.data.package,
      signType: this.data.signType,
      paySign: this.data.paySign,
      success(res) { 
        console.log("前端微信支付成功",res);
        wx.showModal({
          title: '',
          content: '支付成功',
          confirmText: "确定",
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              wx.switchTab({
                url: '../player/player',
              })
            } 
          }
        });
      },
      fail(res) { 
        ("前端微信支付失败", res);
        wx.showModal({
          title: '',
          content: '支付失败',
          confirmText: "确定",
          success: function (res) {
            
          }
        });
      }
    })
  }

})