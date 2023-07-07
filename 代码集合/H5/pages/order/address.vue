<template>
  <div class="add-address">
    <div class="order-head">
      <img src="~/assets/images/home/back@2x.png" @click="goback()"/>
      <p>添加收货地址</p>
    </div>
    <div class="address">
      <el-form :model="areaForm" ref="areaForm" :rules="rules" label-width="2.3rem">
        <el-form-item label="收货人" prop="receiverName">
          <el-input placeholder="请输入收货人姓名" v-model="areaForm.receiverName" maxlength="20" />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobilePhoneNumber">
          <el-input placeholder="请填写收货人手机号码" v-model="areaForm.mobilePhoneNumber" />
        </el-form-item>
        <el-form-item label="所在地区" prop="areaName">
          <el-input placeholder="省、市、区、县等" v-model="areaForm.areaName" suffix-icon="el-icon-arrow-right" @focus="visible.region =true" />
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input type="textarea" :autosize="{ minRows: 2 }" maxlength="100" show-word-limit placeholder="小区楼栋/乡村名称" v-model.trim="areaForm.detailAddress"  />
        </el-form-item>
      </el-form>
    </div>
    <!-- 默认地址选项 -->
    <div class="default-box">
      <div>
        <p class="address-tilte">设为默认收货地址</p>
        <p class="address-content">提醒：每次下单默认推荐使用该地址</p>
      </div>
      <el-switch v-model="isDefault" class="switch"></el-switch>
    </div>
    <div class="submitbtn" @click="submitArea()">保 存</div>
    <!-- 地址选择框 -->
    <div v-if="visible.region">
      <mt-popup v-model="visible.region" position="bottom">
        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="visible.region = !visible.region">
            取消
          </div>
          <div class="usi-btn-sure" @click="addSelectOk">确定</div>
        </div>
        <mt-picker
          class="picker"
          ref="refRegion"
          value-key="name"
          :slots="addSlots"
          @change="onAddressChange"
        ></mt-picker>
      </mt-popup>
    </div>
  </div>
</template>

<script>
import { getProvince1 } from "@/api/user";
import { addAddress, receiveList, editAdd } from '@/api/order'
export default {
  head() {
    return {
      title: '收货地址',
      meta: [
        { name: 'keywords', content: '收货地址'},
        {
          hid: 'description',
          name: 'description',
          content:'收货地址'
        }
      ]
    }
  },
  data(){
    var areaValidator = (rule, value, callback)=>{
      if(this.areaForm.areaName){
        callback();
      }else{
        callback(new Error('请选择地区'));
      };
    }
    return {
      areaForm: {
        area:''
      },
      regionInit: false, //禁止地区选择器自动初始化，picker组件会默认进行初始化，导致一进入页面就会默认选中一个初始3级地址
      visible:{
        region: false,
      },
      addSlots: [
        {
          flex: 1,
          values: [], //省份数组
          className: "slot1",
          textAlign: "center",
        },
        {
          flex: 1,
          values: [],
          className: "slot2",
          textAlign: "center",
        },
        {
          flex: 1,
          values: [],
          className: "slot3",
          textAlign: "center",
        },
      ],
      orgAddress:'',
      orgAddressNameList:'',
      isDefault: false,
      rules:{
        areaName:[{required: true, validator: areaValidator}],
        detailAddress:[{required: true, message:'请输入详细地址',trigger:'blur'}],
        receiverName:[{required: true, message:'请输入收件人姓名',trigger:'blur'}],
        mobilePhoneNumber:[{required: true, pattern:/^1[3456789]\d{9}$/, message:'请输入正确的手机号码',trigger:'blur'}]
      }
    }
  },
  mounted(){
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo){
      this.getAddress();
      if(this.$route.query.id){
        this.getReceiveList();
      };
    };
  },
  methods:{
    getReceiveList(){
      receiveList({accountId:this.userInfo.userId}).then(res=>{
        if(res.code == 0){
          res.data.forEach(item => {
            if(item.id == this.$route.query.id){
              console.log(item);
              this.areaForm = item;
              this.isDefault = item.isDefault ==1;
            }else{

            };
          });
        };
      });
    },
    goback(){
      history.go(-1);
    },
    submitArea(){
      let param={
        accountId: this.userInfo.userId,
        areaNo: this.orgAddress || this.areaForm.areaNo,
        detailAddress: this.areaForm.detailAddress,
        receiverName: this.areaForm.receiverName,
        mobilePhoneNumber: this.areaForm.mobilePhoneNumber,
        isDefault: this.isDefault ? 1 : 0,
        id: this.$route.query.id
      }
      this.$refs.areaForm.validate(valid=>{
        if(valid){
          addAddress(param).then(res=>{
            if(res.code == 0){
              this.$message({
                type:'success',
                message: '收件地址编辑成功！',
                offset: 80,
                duration: 1000
              })
              history.go(-1)
              // this.$router.push({
              //   path:'/order/order-pay',
              //   query: this.$route.query.data
              // });
            }else{

            };
          })
        }else{
          return false;
        };
      })
    },
    getAddress(){
      getProvince1().then((res) => {
        this.proVal = res.data;
        for (let i = 0; i < res.data.length; i++) {
          this.addSlots[0].values.push({
            id: res.data[i].id,
            name: res.data[i].areaName,
            index: i,
          });
        }
      });
    },
    addSelectOk() {
      this.visible.region = false;
      this.orgAddress=this.region.map(item=>{
        return item.id
      }).join(',')
      let area =this.region.map(item=>{
        return item.name
      }).join(',')
      this.areaForm.areaName = JSON.parse(JSON.stringify(area));
    },
    onAddressChange(picker, values) {
      if (!this.regionInit) {
        let city = this.proVal[values[0].index].children;
        let slots2 = [];
        let slots3 = [];
        //市
        if (city ) {
          for (let i = 0; i < city.length; i++) {
            slots2.push({ id: city[i].id, name: city[i].areaName, index: i });
          }
        }
        picker.setSlotValues(1, slots2);
        //区
        if (values[1] ) {
          let area = city[values[1].index].children;
          console.log(area, 22);
          if (area) {
            for (let i = 0; i < area.length; i++) {
              slots3.push({ id: area[i].id, name: area[i].areaName });
            }
          }
        }
        picker.setSlotValues(2, slots3);
      }
      this.region=values
    },
  }
}
</script>

<style scoped>
.add-address{
  width: 100%;
  color: #333333;
  font-size: .3733rem;
  min-height: 100vh;
  padding-top: 1.1733333333rem;
  padding-bottom: 1.8rem;
}
.order-head{
  display: flex;
  line-height: 1.1733333333rem;
  background: #FFFFFF;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1;
  box-shadow: 3px 3px 4px 0px rgba(0,0,0,0.03); 
}
.order-head p{
  margin: 0 auto;
  font-size: .427rem;
}
.order-head img{
  margin: auto 0;
  width: 15px;
  height: 15px;
  margin-left: 15px;
}
.address{
  margin-top: 20px;
  font-size: .32rem;
}
.address >>> .el-input__inner{
  width: 7.34rem;
  color: #999999;
  font-size: .32rem;
  font-weight: 500 !important;
}
.address >>> .el-textarea__inner{
  width: 7.34rem;
  color: #999999;
  font-size: .32rem;
  font-weight: 550 !important;
  padding-bottom: .7rem;
}
.address >>> .el-form-item__label{
  font-weight: 550;
  color: #333333;
}
.address >>> .el-textarea .el-input__count{
  right: 25px;
  height: 10px;
  bottom: .5rem;
}
.address >>> .el-icon-arrow-right:before{
  margin-right: 15px;
}
.picker-toolbar-title {
  display: flex;
  justify-content: space-around;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  border-bottom: 1px solid #DCDCDC;
}
.usi-btn-cancel,.usi-btn-sure {
  color: #0aa1ed;
}
.default-box{
  width: 95%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 90% 10%;
}
.address-tilte{
  font-weight: 550;
  line-height: .5333rem;
}
.address-content{
  color: #666666;
  font-size: .32rem;
}
.switch{
  margin: auto 0; 
}
.submitbtn{
  width: 351px;
  height: 34px;
  background: linear-gradient(126deg,#82d6f6 0%, #0c89e9 98%);
  border-radius: 17px;
  text-align: center;
  margin: 0 auto;
  line-height: 34px;
  margin-top: 1rem;
  color: #FFFFFF;
}
</style>