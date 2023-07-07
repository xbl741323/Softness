// personal/pages/footmark/footmark.js
const app = getApp()
const getFootmarkList=require('../../../utils/api.js').getFootmarkList;
const batchDelFootmark=require('../../../utils/api.js').batchDelFootmark;

Page({
  data: {
    isOperate:false,
    isall:false,
    imageUrl: app.globalData.imageURL,
    footmarkList:[],
    nodata:false,
    idList:[],
    total:0,
    videoControl:false,
    showTop:false,
  },
  // 回到页面顶部
  toTop(){
    app.toTop()
  },
  //监听页面滑动
  onPageScroll (e){
    var that=this;
    if(e.scrollTop>0){
      that.setData({
        showTop:true
      })
    }else{
      that.setData({
        showTop:false
      })
    }     
  },
  toIndex(){
    wx.switchTab({       
      url:"/pages/index/index",
    })
  },
  //number属性进详情的标识
  toDetail(e){
    console.log(e)
    let number=e.currentTarget.dataset.number;
    let type=e.currentTarget.dataset.type;
    let invalid=e.currentTarget.dataset.invalid;
    if(invalid==1){
      wx.navigateTo({
        url:"/search/pages/nodata/nodata"
      })
    }else{
      if(type==1){
        wx.navigateTo({
          url:"/search/pages/projectDetail/projectDetail?number="+number
        })
      }else{
        wx.navigateTo({
          url:"/search/pages/propertyDetail/propertyDetail?propertyId="+number
        })
      }     
    }  
  },
  operate(){
    var that=this;
    this.setData({
      isOperate:!this.data.isOperate
    })
    console.log(this.data.idList)
    if(this.data.isOperate){
      wx.setNavigationBarTitle({
        title: "已选择"+that.data.idList.length+"项"
      })
    }else{
      wx.setNavigationBarTitle({
        title: "我的足迹",
      })
      this.setData({
        idList:[],
       
      })
    }
  },
  //选中的项目列操作
  checkboxChange(e) {
    console.log(e,"e")
    var that=this;
    this.setData({
      idList:e.detail.value,//选中的列的value值数组集合
    }) 
    wx.setNavigationBarTitle({
      title: "已选择"+that.data.idList.length+"项"
    })     
    if(this.data.idList.length==this.data.total){
      this.setData({
        isall:true,
      })
    }else{
      this.setData({
        isall:false,
      })
    }
  },
  getList(){
    var that=this; 
    // {accountId:wx.getStorageSync('accountId')}
    getFootmarkList().then(res=>{
      if(res.code==0){
        if(res.data.length>0){
          let total=0
          res.data.forEach(item=>{
            total+=item.footmarks.length;
            item.footmarks.forEach(elem=>{
              if(elem.coverUrls){
                elem.coverUrls.forEach(urlItem=>{
                  if(urlItem.isCover==1){
                    elem.coverUrl=urlItem.spUrl ? urlItem.spUrl : urlItem.url;               
                  }
                })
              }
              elem.urlType=elem.coverUrl?elem.coverUrl.substr(elem.coverUrl.lastIndexOf('.')+1):''              
            })
          })
          that.setData({
            footmarkList:res.data,
            nodata:false,
            total:total
          })
        }           
      }else{
        that.setData({
          nodata:true
        })
      }
    })
  },
  //全选
  selectAll(){
    this.setData({
      isall:!this.data.isall
    })
    let footmarkList=this.data.footmarkList;
    let idList=[];
    if(this.data.isall){
      footmarkList.forEach(item=>{
        item.footmarks.forEach(elem=>{
          idList.push(elem.id);
          elem.checked=true;
        })
      })
    }else{
      footmarkList.forEach(item=>{
        item.footmarks.forEach(elem=>{
          elem.checked=false
        })
      })      
    }
    this.setData({
      footmarkList:footmarkList,
      idList:idList
    })
    wx.setNavigationBarTitle({
      title: "已选择"+this.data.idList.length+"项"
    })
  },
  //删除
  delFootmark(){  
    var that=this; 
    if(this.data.idList.length==0){
      wx.showToast({
        title: '请先选择产品',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.showModal({
        content: '确定要删除此足迹吗？',
        cancelColor:'#4D97FF',
        confirmColor:'#FF3627',
        success (res) {
          if (res.confirm) {
            batchDelFootmark({ids:that.data.idList}).then(res=>{
              if(res.code==0){
                wx.showToast({
                  title: '已删除',
                  icon: 'success',
                  duration: 2000
                })
                that.setData({
                  idList:[]                  
                })
                that.getList();
              }
            })
          } 
        }
      }) 
    }        
  },  

  onLoad: function (options) {

  },

  onShow: function () {
    var that=this
    // toLogin()
    this.getList()
  },  
})