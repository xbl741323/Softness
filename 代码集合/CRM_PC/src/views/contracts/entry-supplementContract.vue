<template>
<!-- 排查完成 -->
  <div class="supplement-entry">
    <h2>录入补充协议</h2>
    <div class="info-contract">
      <p class="subtitle">合同信息</p>
      <div v-if="!$route.query.id">
        <el-button size="mini" type="primary" @click="chooseContract()">选择合同</el-button>
      </div>
    </div>
    <el-table :data="contractData">
      <el-table-column label="合同编号" prop="contractNo"></el-table-column>
      <el-table-column label="客户名称" prop="authName"></el-table-column>
      <el-table-column label="合同金额(元)" prop="totalAmount"></el-table-column>
      <el-table-column label="业务员">
        <template slot-scope="{ row }">
          <el-tooltip effect="dark" :content="'工号：'+ empNo +' 部门：'+ deptName" placement="top">
          <span @mouseover="showUserInfo(row.clueSalesmanEmpId)">{{row.clueSalesmanEmpName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <p class="subtitle">订单信息</p>
    <el-table :data="orderData" class="order-table" @selection-change="handleSelectionChange" :row-key="(row) => { return row.id }" ref="multipleTable" >
      <el-table-column type="selection" ></el-table-column>
      <el-table-column label="订单编号" prop="orderNo"></el-table-column>
      <el-table-column label="订单信息" prop="spuName"></el-table-column>
      <el-table-column label="产品数量" prop="buyNum"></el-table-column>
      <el-table-column label="订单金额(元)" prop="totalAmount"></el-table-column>
      <el-table-column label="订单归属">
        <template slot-scope="{ row }">
          <el-tooltip effect="dark" :content="'工号：'+ empNo +' 部门：'+ deptName" placement="top">
          <span @mouseover="showUserInfo(row.belongId)">{{row.belongName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="业务员">
        <template slot-scope="{ row }">
          <el-tooltip effect="dark" :content="'工号：'+ empNo +' 部门：'+ deptName" placement="top">
          <span @mouseover="showUserInfo(row.clueSalesmanEmpId)">{{row.clueSalesmanEmpName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-form :model="contractForm" ref="contractForm" :rules="rules">
      <!-- 合同附件 -->
      <el-form-item label="合同附件" prop="file" class="form-item">
        <div :class="contractForm.file ? 'newsty' : ''">
          <file-upload
            :limit="1"
            :acceptType="'.pdf'"
            :multipleFile="false"
            :wordLimit="100"
            class="upload-file"
            :contractFile="contractFile"
            @fileList="getFileList"
            :followFileList="followFileList"
          />
          <p class="warning-txt">
            只允许上传一份合同文件，格式为pdf,文件大小不超过20M
          </p>
        </div>
      </el-form-item>
      <div class="customer-infos">
        <el-form-item label="客户签约人" prop="signName">
          <el-input v-model.trim="contractForm.signName" :maxlength="8" class="customer-name" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item prop="signMobile">
        <el-input 
            v-model.trim="contractForm.signMobile"
            class="customer-phone"
            placeholder="请输入联系电话"/>
        </el-form-item>
      </div>
      <el-form-item label="签约时间" prop="signTime">
        <el-date-picker
          class="signing-time"
          v-model="contractForm.signTime"
          type="datetime"
          :picker-options="expireTimeOption"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="handle"
          placeholder="选择签约时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="合同备注">
        <el-input class="textarea" type="textarea" :rows="5" show-word-limit maxlength="100" v-model.trim="contractForm.remark"/>
      </el-form-item>
      <span class="allot-engineer">审批人</span>
      <el-form-item label="审批人：" :prop="whichselet == 2 ? '': 'auditor'" label-width="80px">
        <el-cascader v-if="whichselet==1" :show-all-levels='false'  :props="{ value: 'customerId', label: 'label'}" options="empList" filterable v-model="contractForm.auditor" placeholder="请选择审核人" lang="审核人" @change="auditorChange">
          <template slot-scope="{ node,data }">
            <span>{{ data.label }}</span>
            <span v-if="node.isLeaf && data.lockFlag && data.lockFlag ==9"> <img src="/img/disable.png" class="disablemancal" alt="" /></span>
          </template>
        </el-cascader>
        <el-select v-else-if="whichselet ==0" v-model="contractForm.auditor" ref="myselect">
          <el-option 
            v-for="item in empList"
            :key="item.userId"
            :label="item.name"
            :value="item.userId"
          >
          <span>{{item.name}}</span>
            <img v-if="item.lockFlag && item.lockFlag ==9" src="/img/disable.png" class="disableman" alt="" />
          </el-option>
        </el-select>
        <span v-else>{{contractForm.name}}</span>
      </el-form-item>
      <div class="btn">
        <el-button type="primary" size="mini" v-if="permissions.sys_contract_supplement_edit || source == 'personal'" @click=" confirmSubmit(0)">提交审核</el-button>
        <el-button type="warning" size="mini" v-if="permissions.sys_contract_supplement_edit || source == 'personal'" @click="confirmSubmit(1)">保存草稿</el-button>
        <el-popconfirm
          :key="'c'+ Date.now()"
          confirm-button-text='确定'
          cancel-button-text='取消'
          icon="el-icon-info"
          icon-color="red"
          v-if="permissions.sys_contract_supplement_edit || source == 'personal'"
          @confirm="cancel()"
          title="确定取消补充协议录入吗？"
        >
        <el-button size="mini" slot="reference" class="cancel-supplement-btn">取消</el-button>
        </el-popconfirm>
        <!-- <el-button type="primary" @click="nextAuditor()" v-preventReClick v-if="(permissions.sys_contract_paper_detail && permissions.sys_contract_paper_edit) || isPersonal == 'personal'">提交审核</el-button>
        <el-button type="warning" @click="submitAudit(true)" v-preventReClick v-if="(permissions.sys_contract_paper_detail && permissions.sys_contract_paper_edit) || isPersonal == 'personal'" :disabled="updateContract==1">保存草稿</el-button>
        <el-button @click="cancle()" v-if="(permissions.sys_contract_paper_edit) || isPersonal == 'personal'">取消</el-button> -->
      </div>
    </el-form>

    <!-- 选择合同 -->
    <el-dialog :visible.sync="contractDialog" title="选择合同" :close-on-click-modal="false">
      <choose-contract v-if="contractDialog" :source="$route.query.source" @closeDialog="closeDialog" @list="getContract" />
    </el-dialog>
  </div>
</template>

<script>
import FileUpload from "@/components/file/file-upload.vue";
import constract from "@/components/clue/entering-contract.js"
import { getOrder } from "@/api/contracts/contracts";
import chooseContract from './choose-contract';
import { getOneEmp } from "@/api/clue/clue";
import { mapGetters } from "vuex";
import { uploadContactFile } from "@/api/clue/clue-contract";
import { saveContractSupplementary, saveContractSupplementaryDraft, getSupplementDetail } from "@/api/supplement/index";
export default {
  components:{
    FileUpload,
    chooseContract
  },
  data(){
    var contractValidate = (rule, value, callback) => {
      if (this.judge(this.contractForm.file)) {
        callback(new Error("请上传合同附件"));
      } else {
        callback();
      }
    };
    return {
      contractId:'',
      contractDialog: false,
      source:'',
      whichselet: 0,
      empList: [],
      selectedOrderIds: [],
      contractSupplementaryOrderIdList:[],
      followFileList: [],
      contractData: [],
      orderData: [],
      contractFile: [],
      contractUrl: '',
      contractName: '',
      contractStatus: false,
      expireTimeOption: constract.expireTimeOption,
      contractForm: {
        file:'',
        signName:'',
        signMobile: ''
      },
      rules: {
        file: [{ required: true, validator: contractValidate, trigger: "blur" }],
        signName: [{ required: true, message: "请输入联系人姓名", trigger: "blur" }],
        signMobile: [{ required: true, message: "请输入联系电话(固话须加区号)", trigger: "blur", pattern: /^((0\d{2,3}-?\d{7,9})|(1[3465789]\d{9}))$/}],
        signTime: [{ required: true, message: "选择签约时间" }],
        contactTitle: [{ required: true, pattern: /^[A-Z]{1,10}$/, message: "请输入正确的合同编号抬头，最多十个大写字母", trigger: "blur"}],
        auditor: [{ required: true, message: "请选择审核人", trigger: "blur" }],
      },
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted(){
    this.getEmp();
    this.source = this.$route.query.source || null;
    if(this.$route.query.id){
      this.getSupplementContractDetail();
    }
  },
  methods:{
    cancel(){
      sessionStorage.removeItem(`${this.$route.path}`);
      this.$router.go(-1);
    },
    getSupplementContractDetail(){
        getSupplementDetail({id:this.$route.query.id},this.source).then(res=>{
          if (res.data.code == CodeMsg.CODE_0) {
            let supplementInfo = res.data.data;
            this.contractId = supplementInfo.contractId;
            let contractInfo = {}
            this.$set(contractInfo,'contractNo',supplementInfo.contractNo);
            this.$set(contractInfo,'authName',supplementInfo.authName);
            this.$set(contractInfo,'totalAmount',supplementInfo.totalAmount);
            this.$set(contractInfo,'clueSalesmanEmpId',supplementInfo.clueSalesmanEmpId);
            this.$set(contractInfo,'clueSalesmanEmpName',supplementInfo.clueSalesmanEmpName);
            this.$set(contractInfo,'contractType',supplementInfo.contractType);
            this.$set(contractInfo,'orderIdList',supplementInfo.orderIdList);
            this.$set(this.contractForm,'signName',supplementInfo.signName);
            this.$set(this.contractForm,'signMobile',supplementInfo.signMobile);
            this.$set(this.contractForm,'remark',supplementInfo.remark);
            this.$set(this.contractForm,'signTime',supplementInfo.signTime);
            this.contractStatus = supplementInfo.contractSupplementaryStatus;
            this.$set(this.contractFile,0,{
              url: supplementInfo.signUrl,
              name: supplementInfo.contractSupplementaryName,
              file:new File([],supplementInfo.contractSupplementaryName,{})
            });
            if(supplementInfo.contractSupplementaryName != ''){
              this.$set(this.followFileList,0,{
                url: supplementInfo.signUrl,
                name: supplementInfo.contractSupplementaryName,
                file:new File([],supplementInfo.contractSupplementaryName,{})
              });
            }
            this.$set(this.contractForm, "file", {
              url: supplementInfo.signUrl,
              name: supplementInfo.contractSupplementaryName,
              file:new File([],supplementInfo.contractSupplementaryName,{})
            });
            this.contractSupplementaryOrderIdList = supplementInfo.contractSupplementaryOrderIdList
            this.contractName = supplementInfo.contractSupplementaryName;
            this.contractUrl = supplementInfo.signUrl
            this.contractData.push(contractInfo)
            this.getContract(this.contractData,true)
          }
        })
    },
    confirmSubmit(operateId){
      if(this.contractData.length == 0 || this.selectedOrderIds.length == 0){
        this.$message({
          type: 'warning',
          message: '请检查是否选择合同或合同关联订单!',
          duration: 2000
        })
      }else{
        this.$refs.contractForm.validate( valid =>{
          if(valid){
            let param = {
              contractId: this.contractData[0].id || this.contractId,
              contractType: this.contractData[0].contractType,
              contractSupplementaryName: this.contractName,
              signUrl: this.contractUrl,
              signName: this.contractForm.signName,
              signMobile: this.contractForm.signMobile,
              signTime: this.contractForm.signTime,
              remark: this.contractForm.remark,
              orderIdList: this.selectedOrderIds
            }
            if(this.whichselet == 0){
              param.handlerId = this.contractForm.auditor
              param.handlerName = this.$refs.myselect.selected.label
            }else if(this.whichselet == 2){
              param.handlerId = this.judge(this.contractForm.auditor) ? null : this.contractForm.auditor
              param.handlerName = this.judge(this.contractForm.auditor) ? null : this.contractForm.auName
            }else{
              param.handlerId = 1
              param.handlerName = '管理员'
            };
            if(this.$route.query.id){
              param.id = this.$route.query.id;
            };
            if(operateId == 0){
              saveContractSupplementary(param, this.source).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                  this.$message({
                    type: 'success',
                    message: res.data.msg,
                    duration: 1000
                  })
                  this.cancel();
                }
              })
            };
            if(operateId == 1){
              saveContractSupplementaryDraft(param, this.source).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                  this.$message({
                    type: 'success',
                    message: res.data.msg,
                    duration: 1000
                  })
                  this.cancel();
                }
              })
            };
          }else{
            return false;
          };
        })
      }
    },
    handleSelectionChange(row){
      this.selectedOrderIds = [];
      if(row.length > 0){
        row.forEach( el => {
          this.selectedOrderIds.push(el.id);
        });
      };
    },
    getContract(val,selectContract){
      this.contractData = val;
      let arr = typeof(val[0].orderIdList) == 'object' ? val[0].orderIdList : val[0].orderIdList.split('|');
      getOrder(arr).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.orderData = res.data.data;
          if(!selectContract){
            this.$set(this.contractForm,'signName',this.orderData[0].signName);
            this.$set(this.contractForm,'signMobile',this.orderData[0].signMobile);
          }
          this.orderData.forEach( el => {
            this.contractSupplementaryOrderIdList.forEach( orderId => {
              if(el.id == orderId ){
                this.$nextTick(()=>{
                  this.$refs.multipleTable.toggleRowSelection(el);
                })
              }
            });
          });
        }
      })
      this.contractDialog = false;
    },
    closeDialog(){
      this.contractDialog = false;
    },
    getFileList(row){
      this.contractForm.file = row[0];
      if(!this.judge(this.contractForm.file)){
        var para = new FormData();
        para.append('multipartFile', this.contractForm.file.raw);
        uploadContactFile(para).then(res=>{
          if(res.data.code == 0){
            this.contractUrl = res.data.data.url;
            this.contractName = res.data.data.name;
          }
        })
      }
    },
    chooseContract(){
      this.contractDialog = true;
    },
    handle() {
      // var startAt = (new Date(this.contractForm.signTime) * 1000) / 1000;
      // if (startAt > Date.now()) {
      //   this.contractForm.signTime = new Date();
      // }
    },
    // 判断是否为空
    judge(val){
      if(val == '' || val == null || val == undefined){
        return true;
      }else{
        return false;
      }
    },
    getEmp() {
      this.whichselet = 0;
      getOneEmp().then((res) => {
        if (res.data.data.length == 0) {
          //未设置审核人
          this.whichselet = 1;
          this.getAllperson();
        } else if (res.data.data.length == 1) {
          //只有一个审核人
          this.whichselet = 2;
          this.contractForm = res.data.data[0];
          this.contractForm.auditor = res.data.data[0].userId;
          this.contractForm.auName= res.data.data[0].name;
        } else {
          this.whichselet = 0;
          this.empList = res.data.data;
        }
      });
    },
  }
}
</script>

<style scoped>
@import url("../../components/clue/entering-contract.css");
.supplement-entry{
  margin: 10px;
  padding: 20px; 
  background: #FFFFFF;
}
.subtitle{
  padding-left: 5px;
  font-weight: 550;
  border-left: 3px solid #2ca4f5;
}
.order-table{
  margin: 20px 0;
}
.info-contract{
  display: grid;
  grid-template-columns: repeat(2,1fr);
}
.info-contract :nth-child(2n){
  text-align: right;
  margin-right: 10px;
}
.newsty {
  margin-top: -40px;
}
.cancel-supplement-btn{
  margin-left: 10px;
}
</style>