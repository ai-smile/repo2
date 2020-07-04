// pages/user/user.js
const COUNT = wx.cloud.database().collection("count")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {   
    finished:3,
    sum:4,
    list:[],
    week:18
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let d= new Date();
    let str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    let d1 = new Date(str);
    let d2 = new Date(str);
    d2.setMonth(0);
    d2.setDate(1);
    let rq = d1 - d2;
    let days = Math.ceil(rq / (24 * 60 * 60 * 1000));
    // 第几周
    let week = Math.ceil(days / 7) + 1;
    this.setData({
      week:week
    })
    //星期几
    let day = d.getDay()
    COUNT.where({
      opid:app.globalData.dataId,
      week:week,
      day:day
    }).get({
      success(res){
        console.log(res.data)
        that.setData({
          finished:res.data[0].cnum,
          sum:res.data[0].snum
        })
      },
      fail(res){
        console.log("失败")
      }
    })
    COUNT.where({
      opid:app.globalData.dataId,
      week:week,
    }).get({
      success(res){
        let list=[{
          "day":"星期日",
          "cnum":0,
          "snum":0
        },{
          "day":"星期一",
          "cnum":0,
          "snum":0
        },{
          "day":"星期二",
          "cnum":0,
          "snum":0
        },{
          "day":"星期三",
          "cnum":0,
          "snum":0
        },{
          "day":"星期四",
          "cnum":0,
          "snum":0
        },{
          "day":"星期五",
          "cnum":0,
          "snum":0
        },{
          "day":"星期六",
          "cnum":0,
          "snum":0
        }]
        console.log(res.data)
        var i = 0;
        for(i;i<res.data.length;i++){
          list[res.data[i].day].snum = res.data[i].snum
          list[res.data[i].day].cnum = res.data[i].cnum
        }
        console.log(list)
        that.setData({
          list:list
        })
      },
      fail(res){
        console.log("失败")
      }
    })
  },
  pre:function(){
    let that = this
    let week = this.data.week - 1
    that.setData({
      week:week
    })
    console.log(this.data.week)
    COUNT.where({
      opid:app.globalData.dataId,
      week:week,
    }).get({
      success(res){
        console.log(res.data)
        let list=[{
          "day":"星期日",
          "cnum":0,
          "snum":0
        },{
          "day":"星期一",
          "cnum":0,
          "snum":0
        },{
          "day":"星期二",
          "cnum":0,
          "snum":0
        },{
          "day":"星期三",
          "cnum":0,
          "snum":0
        },{
          "day":"星期四",
          "cnum":0,
          "snum":0
        },{
          "day":"星期五",
          "cnum":0,
          "snum":0
        },{
          "day":"星期六",
          "cnum":0,
          "snum":0
        }]
        var i = 0;
        for(i;i<res.data.length;i++){
          list[res.data[i].day].snum = res.data[i].snum
          list[res.data[i].day].cnum = res.data[i].cnum
        }
        console.log(list)
        that.setData({
          list:list
        })
      },
      fail(res){
        console.log("失败")
      }
    })
  },

  next:function(){
    let that = this
    let week = this.data.week + 1
    that.setData({
      week:week
    })
    console.log(this.data.week)
    COUNT.where({
      opid:app.globalData.dataId,
      week:week,
    }).get({
      success(res){
        let list=[{
          "day":"星期日",
          "cnum":0,
          "snum":0
        },{
          "day":"星期一",
          "cnum":0,
          "snum":0
        },{
          "day":"星期二",
          "cnum":0,
          "snum":0
        },{
          "day":"星期三",
          "cnum":0,
          "snum":0
        },{
          "day":"星期四",
          "cnum":0,
          "snum":0
        },{
          "day":"星期五",
          "cnum":0,
          "snum":0
        },{
          "day":"星期六",
          "cnum":0,
          "snum":0
        }]
        console.log(res.data)
        var i = 0;
        for(i;i<res.data.length;i++){
          list[res.data[i].day].snum = res.data[i].snum
          list[res.data[i].day].cnum = res.data[i].cnum
        }
        console.log(list)
        that.setData({
          list:list
        })
      },
      fail(res){
        console.log("失败")
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