<template>
  <div class="operate-frame">
    <el-form :model="clueForm" ref="clueForm" :rules="clueRules" label-width="130px">
      <el-form-item label="线索类型：" prop="clueType">
        <el-radio-group v-model="clueForm.clueType">
          <el-radio :label="1">单位</el-radio>
          <el-radio :label="0">个人</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 单位线索 -->
      <div v-if="this.clueForm.clueType=='1'">
        <el-form-item label="线索标签：" prop="clueFlagId">
          <el-radio-group  v-model="clueForm.clueFlagId" >
            <el-radio
              @change="getclueFlag(item)"
              v-for="item in clueLabelList"
              :key="item.id"
              :label="item.id">
            {{item.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单位名称：" prop="orgName">
          <el-input placeholder="请输入企业营业执照全称" style="width: 430px;" maxlength="50" v-model="clueForm.orgName"/>
        </el-form-item>
        <div class="contact">
          <el-form-item label="联系人：" class="" prop="contactName">
            <el-input placeholder="联系人姓名" style="width: 140px;" maxlength="50" v-model="clueForm.contactName"/>
          </el-form-item>
          <el-form-item label-width="5px" prop="contractJob">
            <el-input placeholder="联系人职务" style="width: 140px;" maxlength="50" v-model="clueForm.contractJob" />
          </el-form-item>
          <el-form-item prop="contactMobilephone" label-width="5px">
            <el-input placeholder="手机号码" style="width: 140px" maxlength="50" v-model="clueForm.contactMobilephone" :disabled= 'this.createType == 0' />
          </el-form-item>
        </div>
        <el-form-item label="单位类型：" prop="orgTypeId">
          <el-select v-model="clueForm.orgTypeId" >
            <el-option
              v-for="item in unitTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业类型：" prop="orgIndustryNo">
          <el-select v-model="clueForm.orgIndustryNo" multiple :multiple-limit="3" style="width: 430px;">
            <el-option
            v-for="item in industryTypeList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在地区：" prop="orgAddress" >
          <el-cascader :options="areaTree" v-model="clueForm.orgAddress" :props="{value: 'id',label: 'areaName'}"/>
        </el-form-item>
        <el-form-item label="详细地址：" prop="orgDetailAddress">
          <el-input style="width: 430px;" v-model="clueForm.orgDetailAddress" maxlength="100" />
        </el-form-item>
        <el-form-item label="专利数量：" prop="orgPatentNumber">
          <el-input type="number" maxlength="50" style="width: 430px;" v-model="clueForm.orgPatentNumber"/>
        </el-form-item>
        <el-form-item label="上一年销售额：" prop="orgSalesYearId">
          <el-select v-model="clueForm.orgSalesYearId">
            <el-option 
              v-for="item in lastYearsSalesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单位人数：" prop="orgEmployeesNumberId	">
          <el-select v-model="clueForm.orgEmployeesNumberId	">
            <el-option 
              v-for="item in unitNumberList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </div>
      <!-- 个人线索 -->
      <div v-else> 
        <el-form-item label="线索标签：" prop="clueFlagId">
          <el-radio-group v-model="clueForm.clueFlagId" >
            <el-radio
              @change="getclueFlag(item)"
              v-for="item in clueLabelList"
              :key="item.id"
              :label="item.id">
            {{item.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="contact">
          <el-form-item label="联系人：" class="" prop="contactName">
            <el-input placeholder="联系人姓名" style="width: 140px;" maxlength="50" v-model="clueForm.contactName"/>
          </el-form-item>
          <el-form-item label-width="5px" prop="contractJob">
            <el-input placeholder="联系人职务" style="width: 140px;" maxlength="50" v-model="clueForm.contractJob" />
          </el-form-item>
          <el-form-item prop="contactMobilephone" label-width="5px">
            <el-input placeholder="手机号码" style="width: 140px" maxlength="50" v-model="clueForm.contactMobilephone" :disabled = 'this.createType == 0' />
          </el-form-item>
        </div>
        <el-form-item label="单位名称：" prop="orgName">
          <el-input placeholder="请输入企业营业执照全称" style="width: 430px;" maxlength="50" v-model="clueForm.orgName" />
        </el-form-item>        
        <el-form-item label="单位类型：" prop="orgTypeId">
          <el-select v-model="clueForm.orgTypeId">
            <el-option
              v-for="item in unitTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="行业类型：" prop="orgIndustryNo">
          <el-select v-model="clueForm.orgIndustryNo" style="width: 430px;" multiple :multiple-limit="3" >
            <el-option 
              v-for="item in industryTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所在地区：" prop="orgAddress" >
          <el-cascader :options="areaTree" v-model="clueForm.orgAddress" @change="add(clueForm.orgAddress)" :props="{value: 'id',label: 'areaName'}"/>
        </el-form-item>
        <el-form-item label="详细地址：" prop="orgDetailAddress">
          <el-input style="width: 430px;" v-model="clueForm.orgDetailAddress" maxlength="100" />
        </el-form-item>      
      </div>
      <el-form-item label="备注：" prop="clueRemark">
        <el-input 
          v-model="clueForm.clueRemark"
          type="textarea" 
          :rows="8"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="btn-footer">
      <el-button type="primary" @click="addClueInfo()">确 定</el-button>
      <el-button @click="cancel()">取 消</el-button>
    </div>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange"
import {getClueLabel, getUnitType, getIndustryType, getLastYearsSales, getUnitNumber, getAreaTree, addNewClue, clueValidate} from '@/api/clue/clue'
export default {
  name:"transForm",
  props:{
    createType:{//创建方式
      type: String,
      required: true
    },
    userInfo:{//用户、线索编辑回显
      type: Object,
      required : false
    },
    editClue:{//线索编辑
      type: Boolean,
      required: false
    }
  },
  data(){ 
    var validateName = (rule, value, callback) => {//单位名称验证
      if (value === '') {
        callback(new Error('请输入单位名称'));
      } else {
        var param = {
          clueType: this.clueForm.clueType,
          orgName: this.clueForm.orgName,
        }
        if(this.editClue){
          param.operType = 0;//编辑标识
          param.id = this.userInfo.id
        }
        clueValidate(param).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            callback();
          }else{
            callback(new Error(res.data.msg));
          }
        }).catch(()=>{
          return false;
        })
      }
    };
    var validateContactPhone = (rule, value, callback)=>{//联系人手机号码验证
      if(value === ''){
        callback(new Error('请输入联系人手机号'));
      }else{
        var para = {
          clueType: this.clueForm.clueType,
          contactMobilephone: this.clueForm.contactMobilephone,
        }
        if(this.editClue){
          para.operType = 0;//编辑标识
          para.id= this.userInfo.id
        }
        clueValidate(para).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            callback();
          }else{
            callback(new Error(res.data.msg));
          }
        }).catch(()=>{
          return false;
        })
      }
    };
    return {
      disable: false,//手机号是否可编辑
      clueForm: {
        orgTypeId:"",
        clueType:1,
        orgIndustryNo:[],
        orgAddress:[],
        orgTypeName:"",
        clueFlagId:"",
        orgName:"",
        contactName:"",
        contractJob:"",
        orgDetailAddress:"",
        orgSalesYearId:null,
        orgEmployeesNumberId:"",
        orgPatentNumber:"",
        contactMobilephone:'',
        clueRemark: ''
      },
      deptNumber:"",
      clueLabelList: [],
      unitTypeList: [],
      industryTypeList: [],
      lastYearsSalesList: [],
      unitNumberList: [],
      areaTree: [],
      clueRules:{
        clueType: [{required: true, message: '请选择线索类型', trigger: 'change' }],
        clueFlagId: [{required: true, message: '请选择线索标签', trigger: 'blur' }],
        orgName: [{required: true, validator: validateName, trigger: 'blur' }],
        contactName: [{required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        contractJob: [{required: true, message: '请输入联系人职务', trigger: 'blur' }],
        contactMobilephone: [
          {validator: validateContactPhone, trigger: 'blur' },
          { required: true, message: "请填写正确的手机号", pattern: /^1[3|4|5|6|7|8|9]\d{9}$/, trigger: "blur" }
        ],
        orgTypeId: [{required: true, message: '请选择单位类型', trigger: 'blur' }],
        orgIndustryNo: [{required: true, message: '请选择单位所属行业类型', trigger: 'blur'}],
        orgAddress: [{required: true, message: '请选择单位所在地', trigger: 'blur'}],
      }
    }
  },
  mounted(){
    this.getDropData();
    if(this.userInfo){//编辑线索-用户线索回显
      if(this.createType==0 && !this.editClue){//用户转化
        this.clueForm.orgName= this.userInfo.userVO.orgName;
        this.deptNumber=this.userInfo.deptNumber
        this.clueForm.contactName= this.userInfo.userVO.name;
        this.clueForm.contractJob= this.userInfo.userVO.job;
        this.clueForm.contactMobilephone= this.userInfo.accountNo;
        if( this.userInfo.userVO.unitVO){
          this.clueForm.orgPatentNumber= this.userInfo.userVO.unitVO.orgPatentNumber;
        }
        if(this.userInfo.userVO.industry){
          for(let item of this.userInfo.userVO.industry.split(",")){
            this.clueForm.orgIndustryNo.push(Number(item)); 
          }
        }
        for(var item of this.userInfo.userVO.orgAddressList){
          this.clueForm.orgAddress.push(Number(item));
        }
        this.clueForm.orgTypeId= this.userInfo.userVO.orgType;
        this.clueForm.orgDetailAddress= this.userInfo.userVO.orgDetailAddress;
        if(this.userInfo.userVO.unitVO){
          this.clueForm.orgSalesYearId= Number(this.userInfo.userVO.unitVO.orgSalesYear);
          this.clueForm.orgEmployeesNumberId= Number(this.userInfo.userVO.unitVO.orgEmployeesNumber);
        }
      }else{//线索编辑
        this.clueForm.clueType = Number(this.userInfo.clueType);
        this.clueForm.orgName= this.userInfo.orgName;
        this.deptNumber=this.userInfo.empDeptNo;
        this.clueForm.contactName= this.userInfo.contactName;
        this.clueForm.contractJob= this.userInfo.contractJob;
        this.clueForm.contactMobilephone= this.userInfo.contactMobilephone;
        this.clueForm.clueFlagId = Number(this.userInfo.clueFlagId);
        if( this.userInfo.clueType == 1){
          this.clueForm.orgPatentNumber= this.userInfo.orgPatentNumber;
        }
        if(this.userInfo.orgIndustryNo){
          for(let item of this.userInfo.orgIndustryNo.split(",")){
            this.clueForm.orgIndustryNo.push(Number(item));
          }
        }
        for(var item of this.userInfo.orgAddress.split(',')){
          this.clueForm.orgAddress.push(Number(item));
        }
        this.clueForm.clueRemark = this.userInfo.clueRemark;
        this.clueForm.orgPatentNumber = this.userInfo.orgPatentNumber;
        this.clueForm.orgTypeId= Number(this.userInfo.orgTypeId);
        this.clueForm.orgDetailAddress= this.userInfo.orgDetailAddress;
        if(this.userInfo.orgSalesYearId){
          this.clueForm.orgSalesYearId= Number(this.userInfo.orgSalesYearId);
        }
        if(this.userInfo.orgEmployeesNumberId){
          this.clueForm.orgEmployeesNumberId= Number(this.userInfo.orgEmployeesNumberId);
        }
      } 
    }
  },
  methods:{
    cancel(){    
      this.clueForm = {
        clueType:1,
      };    
      this.$refs["clueForm"].resetFields();
      this.$emit("changeVisible");
      this.$emit('closeClueOperate',false);//线索创建、编辑
    },
    getclueFlag(row){
      this.$set(this.clueForm,'clueFlag',row.name);
    },
    getDropData(){//获取下拉框数据
      const clueNumber = 'ce0c3bde90d74c36b2f4e6c184710e4c';
      const unitTypeNumber = 'unittype';
      const industryTypeNumber = 'industrytype';
      const lastYearsSales = 'lastyearssales';
      const unitNumber = 'numberofunits';
      getClueLabel(clueNumber).then(res=>{
        this.clueLabelList = res.data.data[0].options;
      }).catch(err=>{
        return err;
      });
      getUnitType(unitTypeNumber).then(res=>{
        this.unitTypeList = res.data.data[0].options;
      }).catch(err=>{
        return err;
      });
      getIndustryType(industryTypeNumber).then(res=>{
        this.industryTypeList = res.data.data[0].options;
      }).catch(err=>{
        return err;
      });
      getLastYearsSales(lastYearsSales).then(res=>{
        this.lastYearsSalesList = res.data.data[0].options;
      }).catch(err=>{
        return err;
      });
      getUnitNumber(unitNumber).then(res=>{
        this.unitNumberList = res.data.data[0].options;
      }).catch(err=>{
        return err;
      });
      getAreaTree().then(res=>{
        this.areaTree = res.data.data;
      }).catch(err=>{
        return err;
      })
    },
    addClueInfo(){
      this.$refs["clueForm"].validate(val=>{
        if(val){
          var param= {
            embedPoint: 2,//数据埋点标识
            createType: this.createType,
            clueType: this.clueForm.clueType,
            clueFlagId: this.clueForm.clueFlagId,
            clueFlag: this.clueForm.clueFlag,
            orgName: this.clueForm.orgName,
            contactName: this.clueForm.contactName,
            contractJob: this.clueForm.contractJob,
            contactMobilephone: this.clueForm.contactMobilephone,
            orgTypeId: this.clueForm.orgTypeId,
            orgIndustryNo: this.clueForm.orgIndustryNo.join(','),    
            orgAddress: this.clueForm.orgAddress.join(','),
            orgDetailAddress:  this.clueForm.orgDetailAddress,
            orgPatentNumber: this.clueForm.orgPatentNumber,
            orgSalesYearId: this.clueForm.orgSalesYearId,
            orgSalesYear: this.clueForm.orgSalesYear,
            orgEmployeesNumberId: this.clueForm.orgEmployeesNumberId,
            clueRemark: this.clueForm.clueRemark
          }
          if(this.userInfo){ //用户列表编辑线索 、线索列表-编辑线索
            param.clueNo=this.userInfo.clueNo,
            param.id = this.userInfo.id;
            param.deptNumber=this.userInfo.deptNumber;
            param.customerEmpNo= this.userInfo.customerEmpNo;
            param.customerEmpName= this.userInfo.customerEmpName;
            param.empDeptId= this.userInfo.empDeptId;
          }
          if(!this.editClue && this.createType ==0){
            param.onlineStatus= 1;
          }
          addNewClue(param,this.editClue).then(res=>{
            if(this.createType == 0){
              var messageTxt = '转化成功！';
            }else if(this.createType == 1 && this.editClue){
              var messageTxt = '线索编辑成功！'
            }else{
              var messageTxt = '线索创建成功！'
            }
            if(res.data.code == CodeMsg.CODE_0){
              this.$message({
                type: "success",
                message: messageTxt,
                offset: 300,
              });
              if(this.createType === 0){
                this.$emit("changeVisible");//用户转化、编辑
              }else{
                this.$emit('closeClueOperate',false);//线索创建、编辑
              }
            }else{
              this.$message({
                type: "error",
                message:res.msg,
                offset: 300,
              });
            }
          })
        }else{
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
.btn-footer{
  text-align: right;
}
.operate-fram{
  width: 100%;
}
.contact{
  display: flex;
}
</style>