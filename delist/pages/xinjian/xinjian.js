//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();
const DB = wx.cloud.database().collection("Delist")
const COUNT = wx.cloud.database().collection("count")
const app = getApp()
const _ =  wx.cloud.database().command
var util=require("../../utils/util.js")
let name=""
let zhcolor=""
Page({
  data: {
    name:"",
    zhcolor:"",
    radio:[{
        va:"red",
        name:"红色",
      },
      {
        va:"yellow",
        name:"黄色",
      },
      {
        va:"green",
        name:"绿色",
      },
      {
        va:"blue",
        name:"蓝色",
      },
    ],
    num:{"red":4,"yellow":3,"green":4,"blue":10},
    key:1,
    _id:"",
    Dl_id:"",
    //录音状态 
    recordState: false ,
    enddates:"",
  },
  onLoad: function (options) {
    var time = util.formatTime(new Date());
    this.setData({
      enddates: time,
    });
  //识别语音
   this.initRecord();  

    let that = this
    let d= new Date();
    let str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    // 本年周数
    let d1 = new Date(str);
    let d2 = new Date(str);
    d2.setMonth(0);
    d2.setDate(1);
    let rq = d1 - d2;
    let days = Math.ceil(rq / (24 * 60 * 60 * 1000));
    let week = Math.ceil(days / 7) + 1;
    //星期
    let day = d.getDay()

    COUNT.where({
      week:week,
      day:day
    }).get({
      success(res) {
        if(res.data.length == 0){
          COUNT.add({
            data:{
              opid:app.globalData.dataId,
              week:week,
              day:day,
              cnum:0,
              snum:0,
              red:2,
              yellow:3,
              green:4
            },
            success(res) {
              that.setData({
                "num.red":2,
                "num.yellow":3,
                "num.green":4,
                _id:res._id
              })
            },
             fail(res){
              console.log("添加失败", res)
            }
          })
        }else{          
          that.setData({
            _id:res.data[0]._id,
            "num.red":res.data[0].red,
            "num.yellow":res.data[0].yellow,
            "num.green":res.data[0].green,
          })
        }
      },
       fail(res){
        console.log("获取失败", res)
      }
    })

    if(options.name){
      that.setData({
        name:options.name,
        zhcolor:options.color,
        key:options.color,
        Dl_id:options._id
      })
      // if(options.color == "red"){
      //   var n = this.data.num.red+1
      //   console.log("redn",n)
      //   that.setData({
      //     name:options.name,
      //     zhcolor:options.color,
      //     key:options.color,
      //     "num.red":n
      //   })
      //   console.log("redn2",this.data.num.red)
      // }else if(options.color == "green"){
      //   var n = this.data.num.green+1
      //   that.setData({
      //     name:options.name,
      //     zhcolor:options.color,
      //     key:options.color,
      //     "num.green":n
      //   })
      // }else if(options.color == "yellow"){
      //   var n = this.data.num.yellow+1
      //   that.setData({
      //     name:options.name,
      //     zhcolor:options.color,
      //     key:options.color,
      //     "num.yellow":n
      //   })
      // }else{
      //   that.setData({
      //     name:options.name,
      //     zhcolor:options.color,
      //     key:options.color,
      //   })
      // }    
      // that.setData({
      //   Dl_id:options._id
      // })
    } 

  },
//  获取单选按钮颜色
  radioChange(e){   
    this.data.zhcolor=e.detail.value
    console.log('单选:', zhcolor)
  },
// 获取清单名称
  addName:function(event){
    this.data.name = event.detail.value
  },
// 向数据库添加数据
  addData:function(event){
    let that = this
    if(this.data.zhcolor == ""){
      wx.showToast({  
        title: '请选择紧急程度',  
        icon: 'none',  
        duration: 2000  
      })  
      return
    }
    if(this.data.name ==""){
      wx.showToast({  
        title: '请输入内容',  
        icon: 'none',  
        duration: 2000  
      })  
      return
    }
    if(this.data.key != 1){
      DB.doc(that.data.Dl_id).remove({
        success(res){
          console.log("key",res)
        }
      })
    }
    let d= new Date();
    let m = d.getMonth()+1
    if(m<10){
      m = "0"+m
    }
    let s =  d.getDate()
    if(s<10){
      s = "0" + s
    }
    let str = d.getFullYear()+"-"+m+"-"+s;
    DB.add({
      data:{
        opid:app.globalData.dataId,
        color:this.data.zhcolor,
        complete:0,
        content:this.data.name,
        data:"",
        time:"",
        old:"",
        addTime:str
      },
      success(res) {
        console.log("添加成功", res)
      },
      fail(res){
        console.log("添加失败", res)
      }
    })

    if(that.data.key == 1){
      if(that.data.zhcolor =="red"){
        COUNT.doc(that.data._id).update({
          data:{
            snum:_.inc(1),
            red:_.inc(-1)
          },
          success(res){
            console.log('成功',res)
          },
          fail(res){
            console.log('失败',res)
          }
        })
      }else if(this.data.zhcolor =="yellow"){
        COUNT.doc(this.data._id).update({
          data:{
            snum:_.inc(1),
            yellow:_.inc(-1)
          },
          success(res){
            console.log('成功',res)
          },
          fail(res){
            console.log('失败',res)
          }
        })
      }else  if(this.data.zhcolor =="green"){
        COUNT.doc(this.data._id).update({
          data:{
            snum:_.inc(1),
            green:_.inc(-1)
          },
          success(res){
            console.log('成功',res)
          },
          fail(res){
            console.log('失败',res)
          }
        })
      }else{
        COUNT.doc(this.data._id).update({
          data:{
            snum:_.inc(1)
          },
          success(res){
            console.log('成功',res)
          },
          fail(res){
            console.log('失败',res)
          }
        })
      }
    }else{
      var c = this.data.key 
      var col = this.data.zhcolor 
      if(c != col){
        if(c == "red"){
          if(col == "yellow"){
            COUNT.doc(this.data._id).update({
              data:{
                yellow:_.inc(-1),
                red:_.inc(1)
              },
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          }else if(col == "green"){
            COUNT.doc(this.data._id).update({
              data:{
                green:_.inc(-1),
                red:_.inc(1)
              },
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          }else{
            COUNT.doc(this.data._id).update({
              data:{
                red:_.inc(1)
              },
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          }
        }else if(c == "yellow"){
          if(col == "red"){
            COUNT.doc(this.data._id).update({
              data:{
                red:_.inc(-1),
                yellow:_.inc(1)
              },
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          }else if(col == "green"){
            COUNT.doc(this.data._id).update({
              data:{
                green:_.inc(-1),
                yellow:_.inc(1)
              },
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          }else{
            COUNT.doc(this.data._id).update({
              data:{
                yellow:_.inc(1)
              },
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          }
        }else if(c == "green"){
          if(col == "red"){
            COUNT.doc(this.data._id).update({
              data:{
                red:_.inc(-1),
                green:_.inc(1)
              },
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          }else  if(col == "yellow"){
            COUNT.doc(this.data._id).update({
              data:{
                yellow:_.inc(-1),
                green:_.inc(1)
              },
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          }else{
            COUNT.doc(this.data._id).update({
              data:{
                green:_.inc(1)
              },
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          }
        }else{
          if(col == "yellow"){
            COUNT.doc(this.data._id).update({
              data:{
                yellow:_.inc(-1)
              },
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          }else if(col == "green"){
            COUNT.doc(this.data._id).update({
              data:{
                green:_.inc(-1)
              },
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          }else if(col == "red"){
            COUNT.doc(this.data._id).update({
              data:{
                red:_.inc(-1)
              },
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          }
        }
      }
    }

    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 图片识别
  uploadImage() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(chooseImage_res) {
        wx.getFileSystemManager().readFile({
          filePath: chooseImage_res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success(base64_res) {
            wx.showLoading({
              title: '识别中……',
              mask: false,
            })
            wx.cloud.callFunction({
              name: "OCR_Detection",
              data: {
                base64: base64_res.data,
              },
              success(cloud_callFunction_res) {
                console.log(cloud_callFunction_res.result.TextDetections.length)
                if (cloud_callFunction_res.result.TextDetections.length == 0) {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提示',
                    content: '未检测到文字，请重试',
                    success() {
                    }
                  })
                } else {
                  var newarray = []
                  for (var i = 0; i < cloud_callFunction_res.result.TextDetections.length; i++) {
                    newarray.push(cloud_callFunction_res.result.TextDetections[i].DetectedText)
                  }
                  that.setData({
                    name: newarray,
                  })
                  wx.hideLoading()
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 200
                  })
                }
              },
            })
          }
        })
      }
    })
  },
  //识别语音 -- 初始化  
  initRecord: function () { 
    const that = this; 
     // 有新的识别内容返回，则会调用此事件 
    manager.onRecognize = function (res) {
      console.log(res)  
    }    
    // 正常开始录音识别时会调用此事件 
    manager.onStart = function (res) {  
      console.log("成功开始录音识别", res)  
    }   
    // 识别错误事件    
    manager.onError = function (res) {  
      console.error("error msg", res)  
    }   
    //识别结束事件
    manager.onStop = function (res) { 
      console.log('..............结束录音') 
      console.log('录音临时文件地址 -->' + res.tempFilePath);     
      console.log('录音总时长 -->' + res.duration + 'ms');     
      console.log('文件大小 --> ' + res.fileSize + 'B');   
      console.log('语音内容 --> ' + res.result);   
      if (res.result == '') {  
        wx.showModal({    
          title: '提示', 
          content: '听不清楚，请重新说一遍！',  
          showCancel: false,        
          success: function (res) {}   
        })    
        return;  
      }
      let text =  res.result;
      that.setData({   
       name: text
      })  
    }  
  }, 
  //语音  --按住说话  
  touchStart: function (e) { 
    this.setData({   
      recordState: true  
      //录音状态   
    }) 
    // 语音开始识别    
    manager.start({   
      lang: 'zh_CN',
      // 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua 
    })
  },  
  //语音  --松开结束  
  touchEnd: function (e) {    
    this.setData({   
      recordState: false
    })  
    // 语音结束识别   
    manager.stop(); 
  },
})