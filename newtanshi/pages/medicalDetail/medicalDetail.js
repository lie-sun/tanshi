// pages/medicalDetail/medicalDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    no: '',
    phone: '',
    name: '',
    hospitalname:'',
    time:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // console.log(options.no)
    this.setData({
      content: options.content,
      no: options.no,
      phone: options.phone,
      name: options.name,
      time: options.time.substr(0,10).replace(/-/,' 年 ').replace(/-/,' 月 ')+' 日',
      hospitalname: options.hospitalname,
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