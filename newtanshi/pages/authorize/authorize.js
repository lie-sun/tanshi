var app = getApp();
Page({
  data: {
    // 手机号
    mobile: '',
    isShowTip: false,
    tipMsg: '',
    authorizeListArray: [],
    inputValue: '',
    bedId: '',
    familyFlag: ''
  },
  // 手机输入框实时输入
  mobileInput(e) {
    this.setData({
      mobile: e.detail.value
    });
    this.setData({
      isShowTip: false
    });
  },
  onLoad(options){
    this.setData({
      bedId: options.id,
      familyFlag: options.familyFlag
    });
    console.log();
  },
  onShow() {
    this.setData({
      mobile: '',
      inputValue: ''
    });
  },
  bindButtonSure() {
    // 验证手机号
    var mobile = this.data.mobile;
    console.log(mobile);
    // 手机号为空时
    if (mobile == '') {
      this.setData({
        // 显示提示信息
        isShowTip: true,
        tipMsg: '手机号码不能为空'
      });
      return false;
    } else if (mobile.length != 11) {
      this.setData({
        // 显示提示信息
        isShowTip: true,
        tipMsg: '请输入正确的手机号'
      });
      return false;
    }
    var myreg = /^1[0-9]{10}$/;
    if (!myreg.test(mobile)) {
      this.setData({
        // 显示提示信息
        isShowTip: true,
        tipMsg: '请输入正确的手机号'
      });
      return false;
    } else {
      console.log("通过");
      // 验证通过，请求数据
      console.log("床位id", this.data.bedId);
      var data1 = { 
        mobile: mobile,
        bedId: this.data.bedId
      };
      wx.request({
        url: 'https://www.dfekj.cn/wx/user/authorize', // 授权亲属
        method: 'POST', //请求方式
        data: JSON.stringify(data1),
        header: {
          'content-type': 'application/json', // 默认值
          'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
        },
        success:(res) => {
          console.log(res.data, res.data.code);
          // 如果code为401跳转登录页面
          if (res.data.code == 401) {
            wx.navigateTo({
              url: '../log/log'
            })
          } else if (res.data.code != 401 && res.data.code !=0) {
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
          } else{
            if (res.data.msg == 'success') {
              wx.navigateTo({
                url: '../myauthorize/myauthorize?familyFlag=' + this.data.familyFlag,
              })
            }
          }
        },
        error:(res) => {
          console.log(res)
        }
      })
    }
  },
  bindButtonCannel() {
    wx.switchTab({
      url: '../player/player',
    })
  }
})