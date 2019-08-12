function getRandomColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
var app = getApp();
var absd;
Page({
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  data: {
    vedioLiveInfo: {},
    isShowVisiteTitle: false,
    hospitalInfo: [],
    bedArray: [],
    defaultDedId: '',
    hospitalId: '',
    statementContent: '',
    isVedio: true,
    isDisable401: false,
    // 超出探视时间
    overTime: false,
    // 加载中
    isLoading: false,
    danmuList: [],
    videointerval: 10,
    cycles: 5,
    a: 3,
    bb: 12,
  },

  onShow() {
    // console.log("查看页面传过来的参数", app.globalData.globalBedId);
    // console.log("页面", this.data.isVedio, this.data.isShowVisiteTitle);
    var that = this;
    this.setData({
      isLoading: false
    });
    // 获取医院 异步请求，直播地址的请求要先在医院信息请求后执行
    this.getHospitalInfo().then(function (res) {
      // 用户直播地址
      if (res.statusCode == 200) {
        that.getVedioLive();
        that.getState();
        that.getBarrageList();
      }
    });
  },
  onLoad() {
    var that = this;

    // 获取医院 异步请求，直播地址的请求要先在医院信息请求后执行
    // this.getHospitalInfo().then(function(res) {
    //   // 用户直播地址
    //   if (res.statusCode == 200) {
    //     that.getVedioLive();
    //     that.getState();
    //   }
    // });
    // this.getBarrageList();
  },

  // 获取免责声明
  getState() {
    // 用户获取免责声明
    var data1 = {
      hospitalId: this.data.hospitalId
    };
    wx.request({
      url: 'https://www.dfekj.cn/wx/user/hospitalStatement', // 获取免责声明
      method: 'POST', //请求方式
      data: JSON.stringify(data1),
      header: {
        'content-type': 'application/json', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
      },
      success: (res) => {
        // 如果code为401跳转登录页面
        // console.log(res.data);
        if (res.data.code == 401) {
          this.setData({
            isDisable401: false
          });
          //wx.navigateTo({
          //  url: '../log/log'
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


          //判断有没有声明
          if (res.data.data.length != 0) {
            this.setData({
              statementContent: res.data.data.statementContent
            });
          } else {
            this.setData({
              statementContent: ''
            });
          }

        }
      },
      error: (res) => {
        // console.log(res)
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
  },
  // 获取用户直播地址
  getVedioLive() {
    var that = this;
    var data2 = {
      bedId: this.data.defaultDedId
    };
    //var data2 = { bedId: '1111253843058556930' };
    // console.log("直播地址11", data2);
    wx.request({
      url: 'https://www.dfekj.cn/wx/user/getVedioLive', // 获取直播地址
      method: 'POST', //请求方式
      data: JSON.stringify(data2),
      header: {
        'content-type': 'application/json', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
      },
      success: (res) => {
        // console.log("直播地址", res.data, res.data.code);
        // 如果code为401跳转登录页面
        if (res.data.code == 401) {
          this.setData({
            isDisable401: false
          });
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
        } else if (res.data.code == 9999) {
          this.setData({
            isDisable401: true,
            overTime: true
          });
          // this.setData({
          //   overTime: true
          // });
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
            isDisable401: true,
            overTime: false,
            // isVedio: false,
            vedioLiveInfo: res.data,
          });

          return;
          if (that.data.isVedio == true) {
            this.setData({
              isDisable401: true,
              isVedio: false,
            });
            setTimeout(() => {
              this.setData({
                overTime: false,
                vedioLiveInfo: res.data,
                isVedio: true,
              });
            }, 100)
          } else {
            this.setData({
              isDisable401: true,
              overTime: false,
              vedioLiveInfo: res.data,
            });
          }
        }
      },
      error: (res) => {
        // console.log(res)
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
  },

  // 获取弹幕列表

  getBarrageList: function () {
    var that = this;
    this.getBarrageParameter().then(function () {
      var data2 = {
        bedId: that.data.defaultDedId
      };
      wx.request({
        url: 'https://www.dfekj.cn/wx/barrageMessage', // 获取医院接口
        method: 'post', //请求方式
        header: {
          'content-type': 'application/json', // 默认值
          'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
        },
        data: JSON.stringify(data2),
        success: (res) => {
          console.log(res.data);
          console.log('/*/**/**/*//*/*//弹幕内容');
          if (absd) {
            clearInterval(absd);
          }
          let danmuData = res.data.data;
          absd = setInterval(() => {
            danmuData.forEach((ele, index) => {
              that.videoContext.sendDanmu({
                text: ele.messageContent,
                color:'#fff'
              })
            })
          }, that.data.videointerval * 2000);
        },
        error: (res) => {
          console.log(res);
        }
      })
    });
  },

  //获取弹幕参数
  getBarrageParameter: function (params) {
    var that = this;
    return new Promise(function (resolve, reject) {
      var data2 = {
        bedId: that.data.defaultDedId
      };
      wx.request({
        url: 'https://www.dfekj.cn/wx/barrageParameter', // 获取医院接口
        method: 'post', //请求方式
        header: {
          'content-type': 'application/json', // 默认值
          'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
        },
        data: JSON.stringify(data2),
        success: (res) => {
          if (res.data.code == 0) {
            if (res.data.data) {
              that.setData({
                videointerval: res.data.data.intervals,
                cycles: res.data.data.times
              })
            } else {
              that.setData({
                videointerval: 10,
                cycles: 500
              })
            }
            resolve();
          }
          // 如果code为401跳转登录页面
        },
        error: (res) => {
          console.log(res);
        }
      })

    })

  },

  // 获取医院
  getHospitalInfo() {
    var that = this;
    return new Promise(function (resolve, reject) {
      // 用户获取医院接口
      var data = {};
      wx.request({
        url: 'https://www.dfekj.cn/wx/user/visitHospital', // 获取医院接口
        method: 'POST', //请求方式
        data: JSON.stringify(data),
        header: {
          'content-type': 'application/json', // 默认值
          'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
        },
        success: (res) => {
          // console.log("床位", res.data);
          // 如果code为401跳转登录页面
          if (res.data.code == 401) {
            that.setData({
              isDisable401: false
            });
            //wx.redirectTo({
            //url: '../log/log'
            // })
          } else if (res.data.code == 500) {
            that.setData({
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
            that.setData({
              isDisable401: true
            });
            var resBedArray = [];
            for (let i = 0; i < res.data.data.length; ++i) {
              resBedArray.push(res.data.data[i].bedNo);
            }
            that.setData({
              hospitalInfo: res.data.data,
              bedArray: resBedArray,
              defaultDedId: res.data.data[that.data.index].id,
              hospitalId: res.data.data[that.data.index].hospitalId
            });
          }
          // console.log("床位", res, that.data.hospitalInfo, that.data.defaultDedId, res.data.code);
          resolve(res);
        },
        error: (res) => {
          // console.log(res);
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

  inputValue: '',
  data: {
    src: '',
    array: ['01', '02', '03', '04'],
    index: 0,
    checkboxItems: [{
      name: '免责说明',
      value: '免责说明'
    }, ]
  },
  // 免责声明
  bindAgreeChange: function (e) {

    this.setData({
      isAgree: !!e.detail.value.length
    });
    // 勾选
    if (e.detail.value.length == 1) {
      this.setData({
        isVedio: true,
        isLoading: false
      });
      if (this.data.vedioLiveInfo && this.data.vedioLiveInfo.vedioType == 0 && this.data.hospitalInfo[this.data.index].visitFlag == 0 && !this.data.overTime) {
        /*setTimeout(() => {
          this.setData({
            isLoading: true
          });
        }, 5000);*/
      }

    } else if (e.detail.value.length == 0) {
      this.setData({
        isVedio: false
      });
    }
    // console.log("免责声明", e.detail.value.length, this.data.isVedio);
  },
  // 床位选择
  bindPickerChange: function (e) {
    var that = this;
    this.setData({
      index: e.detail.value,
      defaultDedId: that.data.hospitalInfo[e.detail.value].id,
      hospitalId: that.data.hospitalInfo[e.detail.value].hospitalId
    });
    // console.log("床位选择", e, that.data.index, that.data.defaultDedId);
    // 获取医院 异步请求，直播地址的请求要先在医院信息请求后执行
    this.getHospitalInfo().then(function (res) {
      // 用户直播地址
      if (res.statusCode == 200) {
        that.getVedioLive();
        that.getState();
        that.getBarrageList();
      }
    });
  },

  bindInputBlur(e) {
    this.inputValue = e.detail.value
  },
  // 付费
  bindPayButtonTap() {
    console.log("付费", this.data.hospitalInfo[0].id);
    wx.navigateTo({
      url: '../pay/pay?bedId=' + this.data.hospitalInfo[this.data.index].id + '&money=' + this.data.vedioLiveInfo.money
    })
  },
  // 授权亲属
  bindAuthorizeButtonTap() {
    const that = this;
    // console.log("床位id", this.data.hospitalInfo[this.data.index].id);
    wx.navigateTo({
      url: '../authorize/authorize?id=' + this.data.hospitalInfo[this.data.index].id + '&familyFlag=' + this.data.hospitalInfo[this.data.index].familyFlag
    })
  },
  // 视频出现缓冲时触发
  bindwaitingFn() {
    console.log("视频缓冲");
  },

  bindtimeupdateFn() {
    /*console.log("播放进度变化时触发");*/
    this.setData({
      isLoading: true
    });
  },
  bindplayFn() {
    /*console.log("当开始/继续播放时触发play事件");*/
  }
})