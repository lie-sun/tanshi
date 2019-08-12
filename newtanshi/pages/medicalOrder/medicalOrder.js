// pages/medicalOrder/medicalOrder.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },


  toDetails: function (params) {
    // console.log(params.currentTarget.dataset.content);
    // console.log(params.currentTarget.dataset.no);
    wx.navigateTo({
      url: '/pages/medicalDetail/medicalDetail?content=' + params.currentTarget.dataset.content + '&no=' + params.currentTarget.dataset.no + '&phone=' + params.currentTarget.dataset.phone + '&name=' + params.currentTarget.dataset.name + '&time=' + params.currentTarget.dataset.createtime + '&hospitalname=' + params.currentTarget.dataset.hospitalname,
      success: (result) => {

      },
      fail: () => {},
      complete: () => {}
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMydicalOrder();
  },
  //获取遗嘱列表
  getMydicalOrder: function () {
    let map = {};
    wx.request({
      url: 'https://www.dfekj.cn/wx/medicalAdvice',
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('globalSessionId')
      },
      data: JSON.stringify(map),
      success: (res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          let datas = res.data.data;
          if (datas.length > 0) {
            datas.forEach((ele, index) => {
              datas[index].content = ele.messageContent.substr(0, 4) + "…"
            })
          }
          console.log(datas);
          this.setData({
            orderList: datas
          })
        }
        console.log("请求参数回来")
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})