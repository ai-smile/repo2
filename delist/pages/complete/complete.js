const DB = wx.cloud.database().collection("Delist")
Page({
  data: {
    data:"",
    activeNav: 'today',
    navs: [{
      text: '今日完成',
      alias: 'today'
    }, {
      text: '历史完成',
      alias: 'lishi'
    }]
  },
  onLoad: function (options) {
    var d= new Date();
    var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    let that=this;
    DB.where({
      complete:1,
    }).get({
      success(res){
        var list = res.data
        console.log(str)
        var today=list.filter((item)=>{
          return item.data == str
        });
        var history = list.filter((item)=>{
          return item.data != str
        })
        console.log("today",today)
        console.log("history",history)
        that.setData({
          data:today,
          today:today,
          history:history
        })
      },
      fail(res){
        console.log("查询失败",res)
      } 
    })
  },

  changeList(e) {
    console.log(e.target.dataset.alias);
    const alias = e.target.dataset.alias;
    let data;
    if(alias == "today"){
      data = this.data.today
    }else{
      data = this.data.history
    }
    console.log(data)
    if (alias !== this.data.activeNav) {
      this.setData({
        activeNav: e.target.dataset.alias,
        data:data,
        loading: true
      });
    }
  },
})