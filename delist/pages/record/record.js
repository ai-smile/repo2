// pages/user/user.js
const DB = wx.cloud.database().collection("Delist")
const D = wx.cloud.database().collection("user")
const app = getApp()
const _ =  wx.cloud.database().command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    available:0,
    show:false,
    index:0,
    worklist:[
      { 
        name:'每日签到',
        time:'2020.03.21 14:23:21',
        score:'+10'
       }
      ]
  },
  option:function(e){
  let Index=  e.currentTarget.dataset.index;
  this.setData({
    index:Index,
    show:!this.data.show
  });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    DB.where({
      lock:1
    }).orderBy('old', 'desc').get({
      success(res){
        that.setData({
          worklist:res.data
        })
      }
    })

    D.where({
      opid:app.globalData.dataId
    }).get({
      success(res){
        that.setData({
          available:res.data[0].jif
        })
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