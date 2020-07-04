const COUNT = wx.cloud.database().collection("count")
const D = wx.cloud.database().collection("user")
const app = getApp()
import * as echarts from '../../ec-canvas/echarts';
Page({
  data: { 
    total:0,
    sum:0,
    finished:0,
    week:18,
    ec: {
      lazyLoad: true
    },
    list:{}
        //  "cnum":[2,3,4,7,6,3,2],
        //  "snum":['2','3','1','6','7','8','2']//模拟数据
         
  },
  onLoad: function (options) {
    let that = this
    D.where({
      opid:app.globalData.dataId
    }).get({
      success(res){
        that.setData({
          total:res.data[0].csn
        })
      }
    })
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
        var i = 0;
        var snum=[0,0,0,0,0,0,0];
        var cnum=[0,0,0,0,0,0,0];
        for(i;i<res.data.length;i++){
          snum[res.data[i].day] = res.data[i].snum
          cnum[res.data[i].day] = res.data[i].cnum
        }
        let list = {};
        list.snum = snum;
        list.cnum = cnum
        that.setData({
          list:list
        })
        that.echartsComponnet = that.selectComponent('#linechart');
        that.init_echarts()
      },
      fail(res){
        console.log("失败")
      }
    })
  },

  init_echarts:function(){
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(Chart);
      Chart.setOption(this.getOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  getOption:function(){
    var option={
      legend:{
        bottom:0,
        left:60,
        icon:'rect',
        textStyle:{
          fontSize:16
      } 
    },
    color:['yellow','red'],
    tooltip:{
        trigger:'axis',
        formatter: function (params) {
          var tip = ''; 
          for (var i = 0; i < params.length; i++) { 
            var t=params[i].name+'\n';
            tip +=params[i].seriesName + ': ' + params[i].value;
            if (i != params.length - 1) {
              tip += '\n';
            }
          }
          return t+tip;
        },    
    },
    grid:{
        containLabel:true,
        x:12,
        x2:43
        
    },
    toolbox:{
        show:true,
        feature:{
            restore:{show:true},
            saveAsImage:{show:true}
        }
    },
    xAxis: {
        name:'时间',
        type: 'category',
        data: ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        axisLabel:{
          textStyle:{
              color:"gray"
          }
      }
    },
    yAxis: {
        name:'数量',
        type: 'value',
        axisLabel:{
          textStyle:{
              color:"gray"
          }
      },
      axisLine:{
        lineStyle:{
            color:'gray',
        }
    }
        
    },
    series: [{
        name:'今日任务',
        data: this.data.list['snum'],
        type: 'line'
    },{
        name:'今日完成',
        data: this.data.list['cnum'],
        type: 'line'
    }]
    }
    return option
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
        var i = 0;
        var snum=[0,0,0,0,0,0,0];
        var cnum=[0,0,0,0,0,0,0];
        for(i;i<res.data.length;i++){
          snum[res.data[i].day] = res.data[i].snum
          cnum[res.data[i].day] = res.data[i].cnum
        }
        let list = {};
        list.snum = snum;
        list.cnum = cnum
        that.setData({
          list:list
        })
        that.echartsComponnet = that.selectComponent('#linechart');
        that.init_echarts()       
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
        console.log(res.data)
        var i = 0;
        var snum=[0,0,0,0,0,0,0];
        var cnum=[0,0,0,0,0,0,0];
        for(i;i<res.data.length;i++){
          snum[res.data[i].day] = res.data[i].snum
          cnum[res.data[i].day] = res.data[i].cnum
        }
        let list = {};
        list.snum = snum;
        list.cnum = cnum
        that.setData({
          list:list
        })
        that.echartsComponnet = that.selectComponent('#linechart');
        that.init_echarts() 
      },
      fail(res){
        console.log("失败")
      }
    })
  }

})