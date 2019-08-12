//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    familyFlag: '',
    isDisable401: false,
    isShow: 0
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    
  },

  //获取医嘱信息
  getRed: function (params) {
    var data = {};
    wx.request({
      url: 'https://www.dfekj.cn/wx/ifWaring', // 获取用户中心
      method: 'POST', //请求方式
      data: JSON.stringify(data),
      header: {
        'content-type': 'application/json', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
      },
      success: (res) => {
        // console.log('医嘱新消息');
        // console.log(res.data);
        if (res.data.code == 0) {
          this.setData({
            isShow: res.data.data
          })
        }
        // console.log("用户", res.data);
      },
      error: (res) => {
        console.log(res)
      }
    })
  },
  onShow() {
    this.getUserInfo();
    this.getRed();
  },
  // 获取用户接口
  getUserInfo() {
    // 用户获取探视信息接口
    var data = {};
    wx.request({
      url: 'https://www.dfekj.cn/wx/user/getUserInfo', // 获取用户中心
      method: 'POST', //请求方式
      data: JSON.stringify(data),
      header: {
        'content-type': 'application/json', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
      },
      success: (res) => {

        // 如果code为401跳转登录页面
        if (res.data.code == 401) {
          this.setData({
            isDisable401: false
          });
          //wx.redirectTo({
          //url: '../log/log'
          //})
        } else if (res.data.code == 500) {
          this.setData({
            isDisable401: true
          });
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
          this.setData({
            isDisable401: true
          });
          this.setData({
            userInfo: res.data.data,
            familyFlag: res.data.familyFlag
          });
        }
        // console.log("用户", res.data, this.data.userInfo)
      },
      error: (res) => {
        console.log(res)
      }
    })
  },
  // 点击授权管理
  bindButtonAuth() {
    wx.navigateTo({
      url: '../myauthorize/myauthorize?familyFlag=' + this.data.familyFlag,
    })
  }
})