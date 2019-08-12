Page({
  data: {
    avatarUrl: '',
    city: '',
    country: '',
    encryptedData: '',
    gender: '',
    iv: '',
    language: '',
    nickName: '',
    nickName: '',
    province: '',
    rawData: '',
    signature: ''
  },
  onLoad() {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(JSON.stringify(res));
              //用户已经授权过
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                city: res.userInfo.city,
                country: res.userInfo.country,
                encryptedData: res.encryptedData,
                gender: res.userInfo.gender,
                iv: res.iv,
                language: res.userInfo.language,
                nickName: res.userInfo.nickName,
                province: res.userInfo.province,
                rawData: res.rawData,
                signature: res.signature

              });
              console.log("用户授权",that.data.avatarUrl);
            }
          });
        }
      }
    })
  },
  //
  backClick() {
    wx.switchTab({
      url: '../illustrate/illustrate',
    });
  },
  // 微信授权
  bindGetUserInfo(res) {
    var that = this;
    console.log("11", res)
    console.log(res);
    if (res.detail.userInfo) {
      wx.login({
        success: function (res) {
          console.log("点击了同意授权", res);
          if (res.code) {
            wx.request({
              url: 'https://www.dfekj.cn/wx/user/autho/login',
              method: 'POST', //请求方式
              data: {
                appid: 'wxb6f0a37456dc20be',
                code: res.code,
                nickName: that.data.nickName,
                gender: that.data.gender,
                city: that.data.city,
                province: that.data.province,
                country: that.data.country,
                avatarUrl: that.data.avatarUrl,
                loginType: 2,
                rawData: that.data.rawData,
                signature: that.data.signature,
                encryptedData: that.data.encryptedData,
                iv: that.data.iv
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                if (res.data.code == 0) {
                  wx.switchTab({
                    url: '../player/player',
                  });
                  wx.setStorageSync(
                    'globalSessionId', res.data.jsessionid
                  );
                  
                }else {
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
                }
                console.log("微信登录成功", res);
              }
            })
          } else {
            console.log("授权失败");
          }
        }
      })
    } else {
      console.log("点击了拒绝授权");
    }
  },
  bindGetUserInfoPhone(res) {
    var that = this;
    console.log("11", res)
    console.log(res);
    if (res.detail.userInfo) {
      // 用户信息
      wx.login({
        success: function (res) {
          console.log("22", res.code)
          wx.navigateTo({
            url: '../phoneLog/phoneLog?code=' + res.code
          })
        }
      })
    } else {
      console.log("点击了拒绝授权");
    }
  }
})