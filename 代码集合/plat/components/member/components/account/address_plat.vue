<template>
  <div class="address_plat">
        <div class="address_head">
          <button v-if="receiveList.length<10" @click="addressDialog = true, dialogStatus = true,isDefault= false"><span style="cursor:pointer;">新增地址</span></button>
          <div>您已创建{{receiveList.length}}个，最多可创建10个</div>
        </div>
        <div class="address_List" v-for="item in receiveList" :key="item.id">
            <div class="top_box" >
                <div class="username_head" >{{item.receiverName}}</div>
                <div class="address_default" v-if="item.isDefault == 1">默认地址</div>
                <div class="right" >
                <div class="default" @click="handleDefault(item)" v-if="item.isDefault == 0">设为默认</div>
                <div class="edit" @click="handleEdit(item)">编辑</div>
                <div class="delate" v-if="receiveList.length>1" @click="handleDelete(item)">删除</div>
            </div>
            </div>
            <div class="content">
                <div class="user" style="margin-top: 16px;margin-left: 12px;">收件人：<span class="real">{{item.receiverName}}</span></div>
                <div class="user">所在地区：<span class="real">{{item.areaName}}</span></div>
                <div class="user">详细地址：<span class="real_a" >{{item.detailAddress}}</span></div>
                <div class="user">手机号码：<span class="real">{{item.mobilePhoneNumber}}</span></div>
            </div>
             
        </div>
        <el-dialog :title="editType==0?'新增收件地址':'编辑收货地址'" :visible.sync='addressDialog' :close-on-click-modal="false" center :show-close='false' width="597px">
        <div v-if="dialogStatus">
            <el-form :model="areaForm" ref="areaForm" :rules="areaRules" label-width="110px" class="add_area">
            <el-form-item label="选择地区：" prop="area">
                <el-cascader v-model="areaForm.area" :options="areaList" :props="{ value: 'id', label: 'areaName'}" placeholder="请选择地区"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址：" prop="address">
                <el-input placeholder="请输入详细地址信息，如道路、楼栋、单元号、门牌号等" maxlength="100" v-model="areaForm.address" />
            </el-form-item>
            <el-form-item label="收件人姓名：" prop="receiverName">
                <el-input v-model="areaForm.receiverName" maxlength="50" />
            </el-form-item>
            <el-form-item label="手机号码：" prop="mobilePhone">
                <el-input v-model="areaForm.mobilePhone" />
            </el-form-item>
            <el-form-item label="" prop="defaultArea">
                <el-checkbox v-model="isDefaultArea">设为默认收件地址</el-checkbox>
            </el-form-item>
            <div style="text-align: center">
                <el-button type="primary" @click="submitArea()">确定</el-button>
                <el-button @click="cancel()">取消</el-button>
            </div>
            </el-form>
        </div>
        </el-dialog>
  </div>    
</template>

<script>
import { getAreaList, receiveList, addAddress,deteleOrder,editAddress,defaultOrder} from '~/api/member'
export default {
  data () {
    return {
        number:'100',
        imgUrl: process.env.CDN_BASE_URL,
        orderDetail: {},
        productNum: '',
        read: false,
        areaList: [],//地区
        receiveList:[],//收件地址
        receive:'',
        areaForm:{},
        userInfo:{},
        dialogStatus: false,
        addressDialog: false,
        isDefaultArea: false,
        hasDefault: false,
        areaRules:{
            area:[{required: true, message:'请选择地区',trigger:'change'}],
            address:[{required: true, message:'请输入详细地址',trigger:'blur'}],
            receiverName:[{required: true, message:'请输入收件人姓名',trigger:'blur'}],
            mobilePhone:[{required: true, pattern:/^1[3456789]\d{9}$/, message:'请输入正确的手机号码',trigger:'blur'}]
        },
        editType:0,
        id:null
    }
  },
 mounted(){
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getArea();
    this.getReceiveList()
 },
methods:{
    cancel(){
      this.addressDialog = false;
      this.dialogStatus =false
    },
    handleEdit(item){
      this.editType =1
      let obj = JSON.parse(JSON.stringify(item))
      this.isDefaultArea = obj.isDefault==1?true:false;
      this.id = obj.id
      obj.address = obj.detailAddress
      obj.mobilePhone = obj.mobilePhoneNumber
      obj.area = obj.areaNo.split(',').map(Number)
      this.areaForm = obj
      this.addressDialog = true
      this.dialogStatus = true
    },
    handleDelete(item){
        this.$confirm('是否删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = new FormData();
          param.append("id", item.id);
          deteleOrder(param).then(res=>{
            if(res.data.code==0){
              this.getReceiveList();
               this.$message({
                type:'success',
                message: '删除成功！',
                offset: 300
              })
            }
          })
        }).catch(() => {   
           return false  
        })
    },
    handleDefault(item){
      let param = new FormData();
      param.append("id", item.id);
      defaultOrder(param).then(res=>{
        if(res.data.code==0){
          this.getReceiveList();
        }
      })
          
    },
    submitArea(){
      this.$refs.areaForm.validate(valid=>{
        if(valid){
            let param={
                accountId: this.userInfo.accountId,
                areaNo: this.areaForm.area.join(','),
                detailAddress: this.areaForm.address,
                receiverName: this.areaForm.receiverName,
                mobilePhoneNumber: this.areaForm.mobilePhone,
                isDefault: this.isDefaultArea ? 1 : 0
              }
          if(this.editType ==0){
             addAddress(param).then(res=>{
                if(res.data.code == 0){
                  this.$message({
                    type:'success',
                    message: '新增成功！',
                    offset: 300
                  })
                  this.areaForm = {};
                  this.dialogStatus = false;
                  this.addressDialog = false;
                  this.getReceiveList();
                }
            })
          }else{
            param.id = this.id
            editAddress(param).then(res=>{
              if(res.data.code == 0){
                this.$message({
                  type:'success',
                  message: '修改成功！',
                  offset: 300
                })
                this.areaForm = {};
                this.dialogStatus = false;
                this.addressDialog = false;
                this.getReceiveList();
              }
            })
         }
        }else{
          return false;
        };
      })
    },
    getReceiveList(){
      receiveList({accountId:this.userInfo.accountId}).then(res=>{
        if(res.data.code == 0){
          this.receiveList = res.data.data;
        }
      })
    },
    getArea(){
      getAreaList().then(res=>{
        this.areaList = res.data.data;
      }).catch(err=>{
        return err;
      });
    },
  }
}

</script>
<style lang="stylus" scoped>
@import './address_plat.stylus';
</style>