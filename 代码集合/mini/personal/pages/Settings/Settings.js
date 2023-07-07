const app = getApp();
const getDropdown = require('../../../utils/api.js').getDropdown;
const getAreaTree = require('../../../utils/api.js').getAreaTree;
import { updateAccountBaseInfo, getMyAccountInfo } from "../../../utils/api/user"
import { getUserInfos } from "../../../utils/common/userDeal"
//自定义底部弹框动画
var action = '';
var moveY = 200;
var animation = animation = wx.createAnimation({
  transformOrigin: "50% 50%",
  duration: 400,
  timingFunction: "ease",
  delay: 0
})
animation.translateY(moveY + 'vh').step();

Page({
  data: {
    forms:{
      diyOrgName:'',
      diyOrgType:'',
      orgTypeName:'',
      diyIndustry:'',
      industryTypeName:'',
      diyOrgAddress: '',
      areaName: '',
      mobile: '',      
      job:'',
      userType:null
    },
    orgTypeIndex: 0,
    show: false,
    authStatus:'',
    backgroundVisible: false,
    animation: animation,
    bg: 'background',
    accountList: ["未知","个人", "单位"],
    orgTypeList: [], //列表
    industryTypeList: [],
    industryChoosed: [], //多选框选择的值
    //当前多列选中数组的下标值
    customIndex: [0, 0, 0],
    //当前选中数组
    onlyArray: [
      [],
      [],
      []
    ],
    customArray: [],
    defaultImg: "/personal/image/center/geren_icon@2x.png",
    netImg: "",
    logoUrl: "",
    imgbase64: "", //微信选择的图片二进制传给后台
    imageUrl: app.globalData.imageURL,
    error: ["请选择单位Logo", "请填写单位名称", "请选择单位类型", "请选择行业类型", "请选择所在地区", "请填写单位详细地址", "请填写单位拥有授权专利数量", "请填写联系人","请填写正确的手机号码"],
    orgNameError: false,
    orgTypeError: false,
    industryError: false,
    phoneError: false,
    areaError: false,
    accountId: '',
    userId: "",
    id: '',
    scrollTop: true,
    udisabled: false,
    userMetaInfo:{},
    arrList:[],
    loaded:false,
  },

  //行业类型自定义多选底部弹框
  showModel() {
    moveY = 0;
    action = 'show';
    animationEvents(this, moveY, action);
  },
  hidden() {
    moveY = 200;
    action = 'hide';
    animationEvents(this, moveY, action);
  },
  checkOrdName() {
    this.setData({
      orgNameError: this.data.forms.diyOrgName ? false : true,
    })
  },
   //手机号校验
   checkPhone() {
    let reg = /^1[3-9]\d{9}$/;
    if (reg.test(this.data.forms.mobile)) {
      this.setData({
        phoneError: false,
      })
    } else {
      this.setData({
        phoneError: true,
      })
    }
  },
  // 过滤非数字
  handlePhone(e) {
    let value = this.validateNumber(e.detail.value)
    let mobile = 'forms.mobile'
    this.setData({
      [mobile]: value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  checkboxChange(e){
    var that = this;
    let list = this.data.industryTypeList
    if (e.detail.value.length >= 3) {
      list.forEach(item => {
        item.disabled = e.detail.value.every(valueItem => {
          return item.id != valueItem
        })
        item.checked = !item.disabled
      })
    } else {
      list.forEach(item => {
        item.disabled = false;
        item.checked = e.detail.value.some(valueItem => {
          return item.id == valueItem
        })
      })
    }
    that.setData({
      industryTypeList: list,
      industryChoosed: e.detail.value
    })
  },
  toConfirm(){
    wx.navigateTo({
      url: '/personal/pages/authentication/authentication',
    })
  },
  //行业类型选择框确定按钮
  industryTypeChange() {
    let industryTypeName = 'forms.industryTypeName'
    let diyIndustry = 'forms.diyIndustry'
    console.log(this.data.industryChoosed);
    if (this.data.industryChoosed.length > 0 || this.data.forms.diyIndustry.length>0) {
      let choosedName = []
      let choosed = this.data.industryChoosed.length > 0 ? this.data.industryChoosed : this.data.forms.diyIndustry;
      choosed.forEach(item => {
        for (let i = 0; i < this.data.industryTypeList.length; i++) {
          if (item == this.data.industryTypeList[i].id) {
            choosedName.push(this.data.industryTypeList[i].name);
            break;
          }
        }
      })
      this.setData({
        [industryTypeName]: choosedName.join(","),
        [diyIndustry]: typeof(choosed) == String ? choosed.join(","):choosed,
      })
    } else {
      this.setData({
        [industryTypeName]: "请选择行业类型",
        [diyIndustry]: "",
      })
    }
    this.hidden();
  },
  
  ///获取单位名称输入框信息
  getOrgName(e) {
    let orgName = 'forms.diyOrgName'
    this.setData({
      [orgName]: e.detail.value
    })
  },
  //单位类型切换
  orgTypeTypeChange(e) {
    let orgTypeName = 'forms.orgTypeName';
    let diyOrgType = 'forms.diyOrgType';
    this.setData({
      [orgTypeName]: this.data.orgTypeList[e.detail.value].name,
      [diyOrgType]: this.data.orgTypeList[e.detail.value].id,
      orgTypeIndex: e.detail.value,
    })
  },
  //地区切换
  //多列自定义选择器改变value的方法
  bindCustomPickerChange: function (e) {
    console.log(e.detail.value);
    let customIndex = this.data.customIndex;
    let onlyArray = this.data.onlyArray;
    let addressIdList = []
    let addressNameList = []
      onlyArray.forEach((item, index) => {
      if (item.length > 0 && item[customIndex[index]] && item[customIndex[index]].id) {
        addressIdList.push(item[customIndex[index]].id)
      }
      if (item.length > 0 && item[customIndex[index]] && item[customIndex[index]].name) {
        addressNameList.push(item[customIndex[index]].name)
      }
    })
    let diyOrgAddress = 'forms.diyOrgAddress';
    let areaName = 'forms.areaName';
    this.setData({
      customIndex: e.detail.value,
      [diyOrgAddress]: addressIdList.join(','),
      [areaName]: addressNameList.join(','),
    })
  },
  //多列自创选择器换列方法
  bindCustomPickerColumnChange: function (e) {
    var customArray = this.data.customArray,
      customIndex = this.data.customIndex,
      onlyArray = this.data.onlyArray;
    customIndex[e.detail.column] = e.detail.value;
      var searchColumn = () => {
      for (var i = 0; i < customArray.length; i++) {
        var arr1 = [];
        var arr2 = [];
        if (i == customIndex[0]) {
          if (customArray[i].children && customArray[i].children.length > 0) {
            for (var j = 0; j < customArray[i].children.length; j++) {
              let item = customArray[i].children[j]
              arr1.push({
                id: item.id,
                name: item.areaName
              });
              if (j == customIndex[1]) {
                for (var k = 0; k < customArray[i].children[j].children.length; k++) {
                  let item = customArray[i].children[j].children[k]
                  arr2.push({
                    id: item.id,
                    name: item.areaName
                  });
                }
                onlyArray[2] = arr2;
              }
            }
          }
          onlyArray[1] = arr1;
        }
      };
    }
    switch (e.detail.column) {
      case 0:
        customIndex[1] = 0;
        customIndex[2] = 0;
        searchColumn();
        break;
      case 1:
        customIndex[2] = 0;
        searchColumn();
        break;
    }
    this.setData({
      onlyArray: onlyArray,
      customIndex: customIndex
    });
  },
  //获取联系人输入框信息
  getjobName(e) {
    let job = 'forms.job'
    this.setData({
      [job]: e.detail.value
    })
  },
  logoChange() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let imgbase64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64") //将图片转为二进制传给后台
        console.log(imgbase64,"resphone")
        that.setData({
          logoUrl: res.tempFilePaths[0],
          imgbase64: imgbase64
        });
        wx.uploadFile({
          filePath: that.data.logoUrl,
          name: 'file', //后台接收图片的字段
          url: app.globalData.baseURL + "/appletTmUser/uploadDiyLogoUrl",
          method: "post",
          formData: imgbase64,
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
            'Authorization': wx.getStorageSync('token'),
          },
          success(res) {
            var data = JSON.parse(res.data) //如果是 JSON 要注意用 JSON.parse 转换一下（wx.request 会自动转换，wx.uploadFile 不会）            
            console.log(res.data.data)
            if (data.code == 0) {
              wx.showToast({
                title: '头像更换成功',
                icon: 'success',
                duration: 2000
              });
              getUserInfos();
            }
          }
        })
      }
    })
  },
  //初始化获取字典项数据 
  getDownList() {
    var that = this;
    getDropdown("unittype").then(res => {
      if (res.code == 0) {
        that.setData({
          orgTypeList: res.data
        })
      }
    });
    getDropdown("industrytype").then(res => {
      if (res.code == 0) {
        that.setData({
          industryTypeList: res.data
        })
      }
    });
    if(wx.getStorageSync('chooseIP')){
        that.setInfo(wx.getStorageSync('chooseIP'))
    } else {
      getAreaTree().then(res => {
        if (res.code == 0) {
          wx.setStorageSync('chooseIP', res.data);
          that.setInfo(res.data)                
        }
      });
    }
    
  },
  setInfo(data){
    this.setData({
      customArray: data
    });
    this.getUserInfo();  
  },
  filterOnlyArray(){
    var data = {
      customArray: this.data.customArray,
      customIndex: this.data.customIndex,
      onlyArray: this.data.onlyArray,
    };
    for (var i = 0; i < data.customArray.length; i++) {
      data.onlyArray[0].push({
        id: data.customArray[i].id,
        name: data.customArray[i].areaName
      });
    }
    for (var j = 0; j < data.customArray[data.customIndex[0]].children.length; j++) {
      let item = data.customArray[data.customIndex[0]].children[j]
      data.onlyArray[1].push({
        id: item.id,
        name: item.areaName
      });
    }
    for (var k = 0; k < data.customArray[data.customIndex[0]].children[data.customIndex[1]].children.length; k++) {
      let item = data.customArray[data.customIndex[0]].children[data.customIndex[1]].children[k];
      data.onlyArray[2].push({
        id: item.id,
        name: item.areaName
      });
    }
    this.setData({
      customArray: data.customArray,
      customIndex: data.customIndex,
      onlyArray: data.onlyArray,
    });
  },
  //提交表单
  submitForm() {
    var that = this;
    let data = this.data;
    if (!data.forms.diyOrgName&&!data.forms.companyName) {
      this.setData({
        orgNameError: true
      })
    } else {
      this.setData({
        orgNameError: false
      })
    }
    if (!data.forms.diyOrgType) {
      this.setData({
        orgTypeError: true
      })
    } else {
      this.setData({
        orgTypeError: false
      })
    }
    if (!data.forms.diyIndustry) {
      this.setData({
        industryError: true
      })
    } else {
      this.setData({
        industryError: false
      })
    }
    if (!data.forms.diyOrgAddress) {
      this.setData({
        areaError: true
      })
    } else {
      this.setData({
        areaError: false
      })
    }
    if (!data.orgNameError && !data.orgTypeError && !data.industryError && !data.areaError) {
      let userVO = {};
      //------userVO
      userVO.diyOrgName = data.forms.diyOrgName;
      userVO.diyOrgType = data.forms.diyOrgType;
      userVO.diyIndustry = data.forms.diyIndustry.toString();
      userVO.diyOrgAddress = data.forms.diyOrgAddress;
      userVO.accountId = data.forms.accountId;
      userVO.job = data.forms.job;
      updateAccountBaseInfo(userVO).then(res=>{
        if(res.code==0){
          wx.showToast({
            title: '信息修改成功!',
          })
          this.getUserInfo()
        }
      })
    }
  },
  getUserInfo() {
    var that = this;
    getMyAccountInfo().then(res => {
      if (res.code == 0) {
        var data = res.data;
        that.setData({
          forms: data,
          netImg: data.diyLogoUrl,
          accountType: data.userType,
          authStatus: data.authStatus,
        });
        if(this.data.forms.diyOrgType){this.filterData(this.data.forms.diyOrgType, this.data.orgTypeList,'forms.orgTypeName')};
        if(this.data.forms.diyIndustry){this.filterData(this.data.forms.diyIndustry,this.data.industryTypeList,'forms.industryTypeName')};
        if(data.diyOrgAddress){this.filterArea(data.diyOrgAddress)};      
        this.filterOnlyArray();       
        wx.hideLoading();
        this.setData({
          loaded:true
        })
        this.filterBox();
      } else {
        this.failedToast();
      }
    });    
  },
  failedToast(){
    wx.hideLoading();
    app.toastBox('加载失败！','error',2000)
    this.setData({
      loaded:true
    })
  },
  // 类型回显文字显示
  filterData(type,list,name){
    let types = typeof(type) == 'number'? [type] : type
    let filters = [];
    list.forEach(item=>{
      if(types.includes(item.id)){
        filters.push(item.name)
      }
    });
    let typeName = name;
    this.setData({
      [typeName]: filters.toString()
    });    
    if(this.data.forms.diyOrgType && name == 'forms.orgTypeName'){
      this.setData({
        orgTypeIndex: list.findIndex(item => item.id == type)
      })
    };
  },
  // 筛选地区
  filterArea(val) {    
    this.setData({
      arrList:[],
      customIndex:[],
    });
    if (val && Number(val) !== 0) {
      let list = val.split(",")
      console.log(list);
      list.forEach(resI => {
        this.data.customArray.forEach((cItem,index) => {
          this.filterLoop(cItem, resI, index)
        })
      })
    };
    let areaName = "forms.areaName";
    console.log(this.data.customIndex);
    this.setData({
      [areaName]: this.data.arrList.toString(),
      customIndex: this.data.customIndex
    });
    this.filterOnlyArray()
  },
  filterLoop(item, val,index) {
    if (item.id !== 0 && item.id == val) {
      this.data.arrList.push(item.areaName);
      this.data.customIndex.push(index)
  } else if (item.children != null && item.children.length > 0) {
      item.children.forEach((cItem,i) => {
        return this.filterLoop(cItem, val,i)
      })
    }
  },
  // 类型弹出框回显
  filterBox(){
    let diyIndustry = 'forms.diyIndustry';    
    let forms = this.data.forms;
    if (forms.diyIndustry) {
      this.setData({
        [diyIndustry]: this.data.forms.diyIndustry.split(",")
      })
      let list = this.data.industryTypeList
      if (forms.diyIndustry.length >= 3) {
        list.forEach(item => {
          item.disabled = forms.diyIndustry.every(valueItem => {
            return item.id != valueItem
          })
          item.checked = !item.disabled
        })
      } else {
        list.forEach(item => {
          item.disabled = false;
          item.checked = forms.diyIndustry.some(valueItem => {
            return item.id == valueItem
          })
        })
      }
      this.setData({
        industryTypeList: list,
      })
    }
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '信息加载中...',
    })
    this.getDownList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('userInfo').certificationStatus == 1) {
      this.setData({
        udisabled: true
      })
    }


  },
})

//动画事件 底部的弹出，背景层通过切换不同的class，添加一个transition的效果，使之有一个渐变的感觉。
function animationEvents(that, moveY, action) {
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  })
  that.animation.translateY(moveY + 'vh').step()
  if (action == 'show') {
    that.setData({
      animation: that.animation.export(),
      show: true,
      backgroundVisible: true,
      bg: 'bg',
      disableScroll: 'disableScroll'
    });
  } else if (action == 'hide') {
    that.setData({
      animation: that.animation.export(),
      show: false,
      backgroundVisible: false,
      bg: 'background',
      disableScroll: ''
    });
  }
}