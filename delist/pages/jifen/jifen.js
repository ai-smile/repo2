const DB = wx.cloud.database().collection("Delist")
const D = wx.cloud.database().collection("user")
const app = getApp()
const _ =  wx.cloud.database().command
// pages/jifen/jifen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  
  f0:function(){
    wx.navigateTo({
      url: '/pages/regulation/regulation',
    })
  },
  f1:function(){
    wx.navigateTo({
      url: '/pages/record/record',
    })
  },
  f2:function(){
    wx.navigateTo({
      url: '/pages/sign/sign',
    })
  },
  uploadImg(fileUrl){
    wx.cloud.uploadFile({
      cloudPath: jifen3 +'.png', // 上传至云端的路径
      filePath: fileUrl, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        console.log("上传成功",res)
        this.setData({
          showImg:res.fileID
        })
      },
      fail: console.error
    })
  },
  modalcnt:function(e){  
    let f=e.currentTarget.dataset.id;
    let pro=e.currentTarget.dataset.pro;
    wx.showModal({  
        title: '提示',  
        content: '确定要兑换吗?',  
        success: function(res) {  
            if (res.confirm) {  
              D.where({
                opid:app.globalData.dataId
              }).get({
                success(res){
                  if(res.data[0].jif >= f){
                    let d= new Date();
                    let str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
                    let old = d.getTime()
                    let time = d.toLocaleString('chinese', { hour12: false });
                    D.doc(res.data[0]._id).update({
                      data:{
                        jif:_.inc(-f)
                      }
                    })
                    DB.add({
                      data:{
                        opid:app.globalData.dataId,
                        data:str,
                        time:time,
                        old:old,
                        lock:1,
                        up:-f,
                        pro:pro
                      },
                      success(res) {
                        wx.showToast({  
                          title: '兑换成功',  
                          icon: 'success',  
                          duration: 2000  
                        })  
                      },
                       fail(res){
                        console.log("添加失败", res)
                      }
                    })  
                  }else{
                    wx.showToast({  
                      title: '积分不足',  
                      image: '../../images/cuowu.png',  
                      duration: 2000  
                    })  
                  }
                }
              })
            } else if (res.cancel) {  
              console.log('用户点击取消')  
            }  
        }  
    })  
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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