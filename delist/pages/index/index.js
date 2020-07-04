const DB = wx.cloud.database().collection("Delist")
const D = wx.cloud.database().collection("user")
const COUNT = wx.cloud.database().collection("count")
const app = getApp()
const _ =  wx.cloud.database().command
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    Mstart:'',  //记录左滑开始的位置
    index:'' ,//记录左滑的元素
    cf:{"red":15,"yellow":10,"green":5,"blue":1}
  },
  onShow() { //返回显示页面状态函数    
    this.onLoad()//再次加载，实现返回上一页页面刷新   
    // var d= new Date();
    // var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
  },
  f0:function(){
    wx.navigateTo({
      url: '/pages/xinjian/xinjian',
    })
  },
  edit(e){
    let _id=e.currentTarget.dataset.id;
    DB.doc(_id).get().then(res => {
      wx.navigateTo({
        url: '/pages/xinjian/xinjian?'+"name="+res.data.content+"&color="+res.data.color+"&_id="+_id
      })
    })
  },
  onLoad: function (options) {
    var that =this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight:  res.windowHeight,
          windowWidth:  res.windowWidth
        })
      }
    })

    //获取用户信息，入库
    wx.getUserInfo({
      success: res => {    
        console.log("成功")
        app.globalData.userInfo = res.userInfo
        app.globalData.dataId = res.signature 
        console.log("name",res.signature )
        D.where({
          opid:res.signature 
        }).get({
          success(res){
            if(res.data.length == 0){  
              D.add({
                data:{
                  opid:app.globalData.dataId,
                  jif:0,
                  day:0,
                  csn:0
                },
                success(res) {
                  console.log("添加成功", res)
                },
                 fail(res){
                  console.log("添加失败", res)
                }
              })

              D.where({
                opid:res.signature 
              }).get({
                success(res){
                  app.globalData._id = res.data[0]._id
                  app.globalData.user = res.data[0]
                }
              })
              DB.add({
                data:{
                  content:"点击 + 创建任务",
                  opid:app.globalData.dataId,
                  complete:0,
                  ark:6,
                  color:"blue"
                },
                success(res) {
                  console.log("添加成功", res)
                },
                 fail(res){
                  console.log("添加失败", res)
                }
              })
              DB.add({
                data:{
                  content:"向左滑动选择更多操作",
                  opid:app.globalData.dataId,
                  complete:0,
                  ark:6,
                  color:"blue"
                },
                success(res) {
                  console.log("添加成功", res)
                },
                 fail(res){
                  console.log("添加失败", res)
                }
              })
              DB.add({
                data:{
                  content:"更多使用规则前往个人中心查看",
                  opid:app.globalData.dataId,
                  complete:0,
                  ark:6,
                  color:"blue"
                },
                success(res) {
                  console.log("添加成功", res)
                },
                 fail(res){
                  console.log("添加失败", res)
                }
              })
            }else{
              app.globalData._id = res.data[0]._id
              app.globalData.user = res.data[0]
            }
          },
          fail(res){
            console.log("sb",res.data)
          }
        })
      }
    })
    console.log("asd")
     // 获取还未完成的任务
     DB.where({
      complete:0,
    }).get({
      success(res){
        //console.log("查询成功",res)
        let list = res.data;
        that.setData({
          datalist:list
        })   
       // console.log(that.data.datalist)     
      },
      fail(res){
        console.log("查询失败",res)
      }
    })

  },

 // 触摸开始
  touchstart:function(e){
  // 自身距离
  //console.log(e);
    this.setData({
     Mstart:e.changedTouches[0].pageX, //开始触摸式的坐标
      index:e.currentTarget.dataset.index
    })
// pageX, pageY距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴
// clientX, clientY距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴
  },
touchmove:function(e){
  let that = this;
  let list =that.data.datalist
  //console.log(e)
  // 计算滑动的距离
  let moveL = that.data.Mstart-e.changedTouches[0].pageX
  // 移动的距离是正值赋值-move
  list[that.data.index].left=moveL>0?-moveL:0
  that.setData({
    datalist:list
  })
},
// 触摸结束
touchend:function(e){
  let that=this;
  let list =that.data.datalist;
  let ark = e.currentTarget.dataset.ark;
  console.log("ark",ark)
  //console.log(list)
  // 最终移动的距离
  let lastMoveL=that.data.Mstart-e.changedTouches[0].pageX;
  if(ark != 6){
    list[that.data.index].left=lastMoveL>100?-360:0;
  }else{
    list[that.data.index].left=lastMoveL>100?-120:0;
  }
  this.setData({
    datalist:list
  })
},
// 删除操作
scrollDel:function(e){
  let _id=e.currentTarget.dataset.id;
  let list=this.data.datalist;
  DB.doc(_id).remove({
    success(res){
      console.log("删除成功",res)   
    },
    fail(res){
      console.log("删除失败",res)
    }
  })
  list=list.filter((item)=>{
    return item._id!=_id
  });
  this.setData({
    datalist:list
  })
},
// 完成操作
complete:function(e){
  let _id=e.currentTarget.dataset.id;
  let color = e.currentTarget.dataset.color

  let d= new Date();
  let str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
  
  let old = d.getTime()
  
  let hour = d.getHours();
  let minute = d.getMinutes();
  let second = d.getSeconds();

  let time = str + " " +hour+":"+minute+":"+second

  let d1 = new Date(str);
  let d2 = new Date(str);
  d2.setMonth(0);
  d2.setDate(1);
  let rq = d1 - d2;
  let days = Math.ceil(rq / (24 * 60 * 60 * 1000));
  let week = Math.ceil(days / 7) + 1;
  //星期
  let day = d.getDay()

  let list=this.data.datalist;
  DB.doc(_id).update({
    data:{
      complete:1,
      data:str,
      time:time,
      old:old,
      lock:1,
      up:this.data.cf[color],
      pro:"任务完成"
    },
    success(res){
      console.log('成功',res)
    },
    fail(res){
      console.log('失败',res)
    }
  }) 
    app.globalData.user.jif = app.globalData.user.jif + this.data.cf[color]
    D.doc(app.globalData._id).update({
      data:{
        jif:_.inc(this.data.cf[color]),
        csn:_.inc(1),
      },
      success(res){
        console.log('成功',res)
      },
      fail(res){
        console.log('失败',res)
      }
   }) 
    list=list.filter((item)=>{
      return item._id!=_id
    });
    this.setData({
      datalist:list
    })
    COUNT.where({
      week:week,
      day:day
    }).get({
      success(res){
        if(res.data.length == 0){
          COUNT.add({
            data:{
              opid:app.globalData.dataId,
              week:week,
              day:day,
              cnum:1,
              snum:0,
              red:2,
              yellow:3,
              green:4
            }
          })
        }else{
          COUNT.doc(res.data[0]._id).update({
            data:{
              cnum:_.inc(1)
            }
          })
        }
      }
    })
    wx.navigateTo({
      url: '/pages/complete/complete',
    })
  },

})



// db.collection('todos')
//   .where({
//     _openid: 'xxx', // 填入当前用户 openid
//   })
//   .skip(10) // 跳过结果集中的前 10 条，从第 11 条开始返回
//   .limit(10) // 限制返回数量为 10 条
//   .get()
//   .then(res => {
//     console.log(res.data)
//   })
//   .catch(err => {
//     console.error(err)
//   })


 // getD:function(e){
  //   D.where({
  //     opid:"6b15d816e663babbccb491b0445f547a3254de6c"
  //   }).get({
  //     success(res){
  //       console.log("cg",res.data)
  //     },
  //     fail(res){
  //       console.log("sb"+res.data)
  //     }
  //   })
  // },

              //今天日期
            // let d= new Date();
            // let str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
            //本年周数
            // let d1 = new Date(str);
	          // let d2 = new Date(str);
	          // d2.setMonth(0);
	          // d2.setDate(1);
	          // let rq = d1 - d2;
	          // let days = Math.ceil(rq / (24 * 60 * 60 * 1000));
	          // let num = Math.ceil(days / 7) + 1;