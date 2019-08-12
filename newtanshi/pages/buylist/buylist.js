var app = getApp();
Page({
  data: {
    isShowDrawback: false,
    isShowTip: true,
    // 数据
    buyListArray: [],
    purchaseId: '',
    money: '',
    reason: '',
    transactionId: '',
    // 总页数
    totalPages: 0,
    currentPage: 1,
    isLoading: false,
  },
  onLoad() {
   
  },
  onShow() {
    this.setData({
      buyListArray: [],
      currentPage: 1
    })
    this.getBuyRecord(this.data.currentPage);

  },
  // 购买列表
  getBuyRecord(currentPage) {
    // 获取购买记录
    let url = app.globalData.URL + 'wx/user/listBuyRecord';
    var data = {
      limit: "20",
      page: currentPage.toString()
    };
    console.log("购买", app.globalData.userInfo);
    // 获取code后在执行请求接口
    wx.request({
      url: 'https://www.dfekj.cn/wx/user/listBuyRecord', //  获取购买记录接口  
      data: JSON.stringify(data),
      method: 'POST', //请求方式
      header: {
        'content-type': 'application/json', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
      },
      success: (res) => {
        this.setData({
          isLoading: false
        });
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
          var list = res.data.data.list;
          if (list.length != 0) {
            for (var i = 0; i < list.length; i++) {
              list[i].newStart = list[i].buyTime.split(' ')[0] + ' ' + list[i].buyTime.split(' ')[1].split(':')[0] + ':' + list[i].buyTime.split(' ')[1].split(':')[1];

              list[i].newEnd = list[i].buyEndTime.split(' ')[1].split(':')[0] + ':' + list[i].buyEndTime.split(' ')[1].split(':')[1];
            }
          }
          this.setData({
            buyListArray: [...this.data.buyListArray, ...list],
            totalPages: res.data.data.totalPage,
            currentPage: res.data.data.currPage

          });

          console.log("buy1111", res, this.data.buyListArray, list);
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
  // 申请退款
  openConfirm(e) {
    console.log("退款弹框", e.target.dataset.id);
    var item = e.target.dataset.id;
    // 弹出弹框
    this.setData({
      isShowDrawback: !this.data.isShowDrawback,
      purchaseId: item.id,
      money: item.money,
      transactionId: item.transactionId
    })
  },
  // 关闭弹框
  closeDrawback() {
    this.setData({
      isShowDrawback: !this.data.isShowDrawback
    })
  },
  //
  resonInput(e) {
    this.setData({
      reason: e.detail.value
    });
    console.log("退款原因", this.data.reason);
  },
  // 申请退款弹框中的申请退款
  applicationDrawback() {

    var that = this;
    this.setData({
      isShowDrawback: !this.data.isShowDrawback,
      isShowTip: !this.data.isShowTip
    });
    var data = {
      purchaseId: this.data.purchaseId,
      money: this.data.money,
      reason: this.data.reason,
      transactionId: this.data.transactionId
    }
    // 请求申请退款
    wx.request({
      url: 'https://www.dfekj.cn/wx/user/refund', // 退款记录  
      data: JSON.stringify(data),
      method: 'POST', //请求方式
      header: {
        'content-type': 'application/json', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
      },
      success: (res) => {
        console.log(res);
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
          wx.showToast({
            title: '申请退款成功',
            icon: 'success',
            duration: 1500,
            mask: false,
          });
          // this.getBuyRecord();
          that.setData({
            buyListArray: [],
            currentPage: 1
          })
          that.getBuyRecord(that.data.currentPage);
        }
        console.log("退款", res);
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
  // 关闭申请退款弹框中的申请退款
  tipClose() {
    this.setData({
      isShowTip: !this.data.isShowTip
    })
  },
  // 取消申请退款弹成功弹框
  tipCancel() {
    this.setData({
      isShowTip: !this.data.isShowTip
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log("下拉");
    wx.startPullDownRefresh({
      success: (res) => {
        console.log("下拉");
      }
    })

  },
  onReachBottom() {
    let {
      currentPage,
      totalPages,
      isLoading
    } = this.data;
    if (currentPage >= totalPages) {
      return
    }
    this.setData({
      isLoading: true
    });
    currentPage = currentPage + 1;
    this.getBuyRecord(currentPage);
  }
})