Page({
  data: {
    // 手机号
    mobile: '',
    // 验证提示信息
    tipMsg:'',
    // 登录按钮是否禁用
    logBtnDisable: true,
    // 是否显示验证提示信息
    isShowTip: false,
    // 验证按钮
    vilidBtnDisable: false,
    // 验证码
    validCode: '',
    // 验证码按钮提示
    validMsg: '获取验证码',
    // cookie
    validCookie: '',
    //注意事项：1用户手机登录也要先授权【授权方法要写上】，然后获取用户信息 2.手机号获取验证码 3. 点击登录传送数据
    appid: '',
    code: '',
    nickName: '',
    gender: '',
    city: '',
    province: '',
    country: '',
    avatarUrl: '',
    currentTime: 60
  },
  onLoad(options) {
    this.setData({
      code: options.code
    });
    console.log("登录",this.data.code);
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
                gender: res.userInfo.gender,
                nickName: res.userInfo.nickName,
                province: res.userInfo.province
              });
              console.log("用户授权", that.data.avatarUrl);
            }
          });
        }
      }
    })
  },
  //验证码倒计时函数
  countdown () {
    var that = this;
    var time = 60;
    that.setData({
      validMsg: '60秒后重发',
      vilidBtnDisable: true
    })
    var Interval = setInterval(function () {
      time--;
      if (time > 0) {
        that.setData({
          validMsg: time + '秒后重发'
        })
      } else {
        clearInterval(Interval);
        that.setData({
          validMsg: '获取验证码',
          vilidBtnDisable: false
        })
      }
    }, 1000)
  },
  // 手机输入框实时输入
  mobileInput (e) {
    this.setData({
      isShowTip: false,
      mobile: e.detail.value
    })
  },
  // 获取验证码
  bindButtonTapGetValidCode() {
    // 验证手机号
    var that = this;
    var mobile = this.data.mobile;
    console.log(mobile);
    // 手机号为空时
    if (mobile == '') {
      this.setData({
        // 禁用
        logBtnDisable: true,
        // 显示提示信息
        isShowTip: true,
        tipMsg: '手机号码不能为空'
      });
      return false;
    } else if (mobile.length != 11) {
      this.setData({
        // 禁用
        logBtnDisable: true,
        // 显示提示信息
        isShowTip: true,
        tipMsg: '请输入正确的手机号'
      });
      return false;
    }
    var myreg = /^1[0-9]{10}$/;
    if (!myreg.test(mobile)) {
      this.setData({
        // 禁用
        logBtnDisable: true,
        // 显示提示信息
        isShowTip: true,
        tipMsg: '请输入正确的手机号'
      });
      return false;
    } else {
      console.log("通过");
      this.setData({
        vilidBtnDisable: false,
        // 启用
        logBtnDisable: false
      });
      // 验证通过，请求数据
      wx.request({
        url: 'https://www.dfekj.cn/wx/user/getValidCode', // 获取验证码
        method: 'POST', //请求方式
        data: JSON.stringify({
          mobile: mobile,
        }),
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          // 500为验证码错误,验证码错误就提示，而不跳转页面
          if (res.data.code == 500) {
            this.setData({
              // 显示提示信息
              isShowTip: true,
              tipMsg: res.data.msg
            });
          }else {
            this.countdown();
            this.setData({
              isShowTip: false,
              vilidBtnDisable: true,
              validCookie: res.data.jsessionid
            });
            wx.setStorageSync(
              'globalSessionId', res.data.jsessionid
            );
          }
        
          console.log(res, this.data.validCookie)
        },
        error: res => {
          console.log(res)
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
          that.setData({
            vilidBtnDisable: false,
            validMsg: '获取验证码'
          });

        }
      })
    }
    
  },
  // 验证码
  validInput(e) {
    this.setData({
      validCode: e.detail.value,
      // 启用
      logBtnDisable: false,
      isShowTip: false
    });
  },
  // 获取用户信息
  /*bindGetUserInfoLog(res) {
    var that = this;
    console.log("11", res)
    console.log(res);
    if (res.detail.userInfo) {
      // 用户信息
      wx.login({
        success: function (res) {
          console.log("22", res)
          var data = {
            mobile: that.data.mobile,
            validCode: that.data.validCode,
            appid: 'wx30f6b9195dc32116',
            code: res.code,
            nickName: that.data.nickName,
            gender: that.data.gender,
            city: that.data.city,
            province: that.data.province,
            country: that.data.country,
            avatarUrl: that.data.avatarUrl
          };
          if (res.code) {
            // 请求登录
            wx.request({
              url: 'https://www.dfekj.cn/wx/user/login',
              method: 'POST', //请求方式
              data: JSON.stringify(data),
              header: {
                'content-type': 'application/json', // 默认值
                'Cookie': 'JSESSIONID=' + that.data.validCookie
              },
              success: function (res) {
                // 500为验证码错误,验证码错误就提示，而不跳转页面
                if (res.data.code == 500){
                  that.setData({
                    // 显示提示信息
                    isShowTip: true,
                    tipMsg: res.data.msg
                  });
                }else{
                  that.setData({
                    isShowTip: false,
                    vilidBtnDisable: false
                  });
                  wx.switchTab({
                    url: '../player/player',
                  })
                }
                
                console.log("成功", res);
              },
              error: res => {
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
            })
          } else {
            wx.showModal({
              title: "",
              content: "授权失败,请重新登录",
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
            console.log("授权失败");
          }
        }
      })
    } else {
      console.log("点击了拒绝授权");
    }
  }*/
  bindGetUserInfoLog() {
    var that = this;
    var data = {
      mobile: that.data.mobile,
      validCode: that.data.validCode,
      appid: 'wxb6f0a37456dc20be',
      code: that.data.code,
      nickName: that.data.nickName,
      gender: that.data.gender,
      city: that.data.city,
      province: that.data.province,
      country: that.data.country,
      avatarUrl: that.data.avatarUrl
    };
    // 请求登录
    wx.request({
      url: 'https://www.dfekj.cn/wx/user/login',
      method: 'POST', //请求方式
      data: JSON.stringify(data),
      header: {
        'content-type': 'application/json', // 默认值
        'Cookie': 'JSESSIONID=' + that.data.validCookie
      },
      success: function (res) {
        // 500为验证码错误,验证码错误就提示，而不跳转页面
        if (res.data.code == 500) {
          that.setData({
            // 显示提示信息
            isShowTip: true,
            tipMsg: res.data.msg
          });
        } else {
          that.setData({
            isShowTip: false,
            vilidBtnDisable: false
          });
          wx.switchTab({
            url: '../player/player',
          })
        }

        console.log("成功", res);
      },
      error: res => {
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
    })
  }
})