var app = getApp();
Page({
  data:{
    authorizeListArray: [],
    beauthorizeArray: [],
    familyFlag: ''
  },
  // 
  onLoad(options) {
    console.log("授权列表", options);
    this.setData({
      familyFlag: options.familyFlag
    })
  },
  onShow(){
    this.getAuthorize();
    this.getBeauthorize();
  },
  // 获取授权列表
  getAuthorize() {
    // 获取授权列表
    let url = app.globalData.URL + 'wx/user/list/authorize';
    var data = {};
    // 获取code后在执行请求接口
    wx.request({
      url: url, //  获取购买记录接口  
      data: JSON.stringify(data),
      method: 'POST', //请求方式
      header: {
        'content-type': 'application/json', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
      },
      success: (res) => {
        // 如果code为401跳转登录页面
        if (res.data.code == 401) {
          wx.redirectTo({
            url: '../log/log'
          })
        } else if (res.data.code == 500) {
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
            authorizeListArray: res.data.data.list
          });
        }
        console.log("授权", res, this.data.authorizeListArray.length);
      },
      error: (res) => {
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
        console.log(res)
      }
    })
  },
  // 获取被授权列表
  getBeauthorize(){
    // 获取被授权列表
    let url = app.globalData.URL + 'wx/user/list/beauthorize';
    var data = {};
    // 获取code后在执行请求接口
    wx.request({
      url: url, //  获取购买记录接口  
      data: JSON.stringify(data),
      method: 'POST', //请求方式
      header: {
        'content-type': 'application/json', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
      },
      success: (res) => {
        // 如果code为401跳转登录页面
        if (res.data.code == 401) {
          wx.redirectTo({
            url: '../log/log'
          })
        } else if (res.data.code == 500) {
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
          if (res.data.data.list.length) {
            this.setData({
              beauthorizeArray: res.data.data.list
            });
          }
          console.log("被授权", res, this.data.beauthorizeArray);
          }
      },
      error: (res) => {
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
        console.log(res)
      }
    })
  },
  // 查看视频
  bindButtonCheckVisit(e) {
    console.log("查看视频", e.target.dataset.id);
    app.globalData.globalBedId = e.target.dataset.id.bedId;
    app.globalData.globalBedNo = e.target.dataset.id.bedNo;
    app.globalData.globalHospitalId = e.target.dataset.id.hospitalId;
    app.globalData.globalHospitalName = e.target.dataset.id.hospitalName;
    app.globalData.globalFamilyFlag = e.target.dataset.id.familyFlag;
    wx.switchTab({
      url: '../player/player'
    })
  },
  // 删除弹框
  openConfirm (e) {
    var that = this;
    var item = e.target.dataset.item;
    wx.showModal({
      title: '',
      content: '授权手机' + item.familyPhone,
      confirmText: "确定删除",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('用户点击确定删除')
          let url = app.globalData.URL + 'wx/user/delete/authorize';
          var data = {id: item.id};
          // 获取code后在执行请求接口
          wx.request({
            url: url, //  获取购买记录接口  
            data: JSON.stringify(data),
            method: 'POST', //请求方式
            header: {
              'content-type': 'application/json', // 默认值
              'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
            },
            success: (res) => {
              console.log("删除", res);
              if (res.data.code == 401) {
                wx.redirectTo({
                  url: '../log/log'
                })
              } else if (res.data.code == 500) {
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
                if (res.data.msg == 'success') {
                  that.setData({
                    authorizeListArray: that.ArrDelAssignItem(that.data.authorizeListArray, item)
                  });
                }
              }
            
            },
            error: (res) => {
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
            }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },
  /**
 * 找到指定元素并删除
 * param array: array为数组
 * param arrValue: arrValue为指定要删除的值
 */
  ArrDelAssignItem(array, arrValue) {
    //找到该item在数组里的索引并删除
    let delIndex;
    if (typeof (arrValue) == "object") {
      delIndex = array.findIndex(function (value) {
        return value.id == arrValue.id;
      });
    } else {
      delIndex = array.findIndex(function (value) {
        return value == arrValue;
      });
    }
    array.splice(delIndex, 1);
    return array;
  }
})