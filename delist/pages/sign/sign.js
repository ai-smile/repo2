// pages/calendar/calendar.js
const DB = wx.cloud.database().collection("Delist")
const D = wx.cloud.database().collection("user")
const DA = wx.cloud.database().collection("date")
const app = getApp()
const _ =  wx.cloud.database().command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all:0,
    show:"showModal",
    l:"l"
  },
  l(e){
    wx.showToast({  
      title: '今日已签',  
      image: '../../images/cuowu.png',   
      duration: 2000  
    })  
  },
  showModal(e) {
    let that = this
    console.log(that.data.lt)
    let d= new Date();
    let year =  d.getFullYear()
    let mon = (d.getMonth()+1)
    let day = d.getDate()
    let str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    
    let old = d.getTime()

    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();

    let time = str + " " +hour+":"+minute+":"+second


    D.doc(app.globalData._id).update({
      data:{
        day:that.data.lt,
        jif:_.inc(10),
      },
      success(res){
        app.globalData.user.day = that.data.lt
        app.globalData.user.jif = app.globalData.user.jif +10
      },
      fail(res){
        console.log('失败',res)
      }
    }) 
    this.setData({
      b:(this.data.lt - this.data.lt%100)/100,
      s:(this.data.lt%100-this.data.lt%10)/10,
      g:this.data.lt%10
    }),
    DB.add({
      data:{
        opid:app.globalData.dataId,
        data:str,
        time:time,
        old:old,
        lock:1,
        up:10,
        ark:1,
        pro:"签到"
      }
    })
    DA.add({
      data:{
        opid:app.globalData.dataId,
        day:day,
        mon:mon,
        year:year
      }
    })
    wx.showToast({  
      title: '签到成功',  
      icon: 'success',  
      duration: 2000  
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    var lt 
    var time=(new Date).getTime()-24*60*60*1000;
    var yesterday=new Date(time);
    yesterday=yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1) + "-" +((yesterday.getDate()));
    let d= new Date();
    let str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    console.log("r",yesterday)
    console.log("r",app.globalData.user.day)
    DB.where({
      opid:app.globalData.dataId,
      ark:1,
      data:str
    }).get({
      success(res){
        if(res.data.length != 0){
          that.setData({
            lt : app.globalData.user.day
          })
          that.setData({
            all:1
          })
        }else{
          DB.where({
            opid:app.globalData.dataId,
            ark:1,
            data:yesterday
          }).get({
            success(res){
              if(res.data.length == 0){
                that.setData({
                  lt : 1
                })
              }else{
                that.setData({
                  lt : app.globalData.user.day + 1
                })
              }
            }
          })
        }
      }
    })
    this.setData({
      b:(app.globalData.user.day - app.globalData.user.day%100)/100,
      s:(app.globalData.user.day%100-app.globalData.user.day%10)/10,
      g:app.globalData.user.day%10
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getCalendarData(e) { // 监听日历数据
      console.log(e.detail)
  }
})