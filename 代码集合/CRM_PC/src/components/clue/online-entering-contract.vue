<template>
  <div :class="['frame', changewidth ? 'gutter-special' : 'gutter-normal']" v-loading="loading">
    <div class="contract-frame">
      <div class="transfer-box">
        <h2>录入合同</h2>
      </div>
      <span class="subtitle">线索信息</span>
      <span v-if="changeList.length > 0">人员分配信息已更新，<span class="view-update-info" @click="viewUpdateInfo()">点击查看</span></span>
      <span class="clue-warning" v-if="!this.hasClueInfo">请选择一条线索</span>
      <!-- 草稿录入线索 -->
      <div class="add-product">
        <el-button type="primary" icon="el-icon-position" @click="chooseClue()">选择线索</el-button >
      </div>
      <div class="clue-info-head">
        <p v-for="item in list" :key="item.id">{{ item.name }}</p>
      </div>
      <!-- 线索信息 -->
      <div class="clue-infos">
        <p>{{ clueInfo.clueNo }}</p>
        <!-- 线索名称 -->
        <p v-if="clueInfo.clueType == 1">{{ clueInfo.companyName }}</p>
        <p v-else>{{ clueInfo.contactName }}</p>
        <!-- 联系人 -->
        <p>{{ clueInfo.contactName }}</p>
        <!-- 手机号 -->
        <p>{{ clueInfo.mobile }}</p>
        <!-- 业务员 -->
        <el-tooltip effect="dark" :content="'工号：' + cEmpNo + ' 部门：' + cDeptName" placement="top-start" v-if="clueInfo.clueSalesmanEmpName">
          <p @mouseover="showUserInfo(clueInfo.clueSalesmanEmpId)">
            {{ clueInfo.clueSalesmanEmpName }}
          </p>
        </el-tooltip>
        <p v-else></p>
      </div>
      <!-- 订单信息 -->
      <span class="subtitle">订单信息</span>
      <p class="order_txt">最多可添加20条订单信息</p>
      <div class="add-product">
        <el-button type="primary" icon="el-icon-plus" @click="addProduct()">添加订单</el-button>
      </div>
      <el-form :model="form" ref="form" :rules="timeRules">
        <el-table :data="form.orderList" border show-summary class="order-table" :summary-method="getSummaries">
          <el-table-column label="订单编号" prop="orderNo" width="180"  align="center"></el-table-column>
          <el-table-column label="主体ID" prop="userId"  align="center"></el-table-column>
          <el-table-column label="用户名称" prop="subjectName" align="center"></el-table-column>
          <el-table-column label="产品名称" prop="spuName" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column label="数量" prop="buyNum"  align="center"></el-table-column>
          <el-table-column label="订单总价" prop="totalAmount"  align="center"></el-table-column>
          <el-table-column label="订单归属" prop="belongName" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.belongName!='自主'">
                <el-tooltip effect="dark" :content="'工号：'+ cEmpNo +'   部门：'+ cDeptName" placement="top">
                  <span @mouseover="showUserInfo(scope.row.belongId)">
                    <!-- <img src="/img/disable.png" class="emp_disabled" alt="" /> -->
                    {{scope.row.belongName}}
                  </span>
                </el-tooltip>
              </div>
              <div v-else>
                <span>{{scope.row.belongName}}</span>
              </div>
            </template>
          </el-table-column>    
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <!-- <el-button type="text" @click="editOrder(scope.row)">编辑</el-button> -->
              <el-button type="text" @click="deleteProduct(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span class="subtitle">合同信息</span>
      <el-form :model="constractForm" ref="constractForm" :rules="rules">
        <!-- 合同编号抬头 -->
        <el-form-item label="合同编号抬头" prop="contactNoTitle">
          <div class="contactNO-title" v-if="draftStatus == 0 && draftContractNo!=null">
            <p class="draft_contractNo">
              当前已获得合同编号：{{ draftContractNo }}
            </p>
          </div>
          <div class="contactNO-title" v-else>
            <div v-for="item in contactNoList" :key="item.value" class="flex-box">
              <el-radio :label="item.value" v-model="constractForm.contactNoTitle" @change="changeNo(item.value, item.label)">{{ item.label + item.labelDesc }}</el-radio>
              <el-form-item prop="contactTitle" :rules="rules.contactTitle" class="customNo-input" v-if="constractForm.contactNoTitle == 0 && item.value == 0">
                <el-input v-model.trim="constractForm.contactTitle" class="contact-input" style="width: 100px"/>&nbsp;
                <span>请输入合同编号抬头的大写字母</span>
              </el-form-item>
            </div>
          </div>
        </el-form-item>
        <!-- 合同附件 -->
        <el-form-item label="合同附件" prop="file" class="form-item">
          <div :class="constractForm.file ? 'newsty' : ''">
            <file-upload
              :limit="1"
              :acceptType="'.pdf'"
              :multipleFile="false"
              :wordLimit="100"
              class="upload-file"
              @fileList="getFileList"
              :contractFile="contractFile"
              :status="contractStatus"
              v-model="constractForm.file"/>
            <p class="warning-txt">
              只允许上传一份合同文件，格式为pdf,文件大小不超过20M
            </p>
          </div>
        </el-form-item>
        <div class="customer-infos">
          <el-form-item label="客户签约人" prop="signName">
            <el-input v-model.trim="constractForm.signName" :maxlength="8" class="customer-name" placeholder="请输入联系人姓名" />
          </el-form-item>
          <el-form-item prop="signMobilephone">
            <!-- <el-input 
             @change="constractForm.signMobilephone = oninputForPhone(constractForm.signMobilephone)"
             @keyup.native="constractForm.signMobilephone = oninputForPhone(constractForm.signMobilephone)"
             v-model="constractForm.signMobilephone"
             class="customer-phone"
             placeholder="请输入联系电话"/>
          </el-form-item> -->
          <el-input 
             v-model.trim="constractForm.signMobilephone"
             class="customer-phone"
             placeholder="请输入联系电话"/>
          </el-form-item>
        </div>
        <el-form-item label="签约时间" prop="signTime">
          <el-date-picker
            class="signing-time"
            v-model="constractForm.signTime"
            type="datetime"
            :picker-options="expireTimeOption"
            format="yyyy-MM-dd HH:mm"
            @change="handle"
            placeholder="选择签约时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同备注">
          <el-input class="textarea" type="textarea" :rows="5" show-word-limit maxlength="100" v-model.trim="constractForm.contractNote"/>
        </el-form-item>
        <span class="allot-engineer">审批人</span>
        <el-form-item label="审批人：" prop="auditor" label-width="80px">
          <el-cascader 
          ref="cas"
          :options="empList" 
          :show-all-levels="false"  
          v-model="constractForm.auditor"
          placeholder="请选择审核人"
          :props="{ value: 'customerId', label: 'customerName' }"></el-cascader>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" @click="nextAuditor()" v-preventReClick>提交审核</el-button>
          <el-button type="warning" @click="submitAudit(true)" v-preventReClick>保存草稿</el-button>
          <!-- <el-button type="danger" @click="deleteContract()" v-if="contractStatus && this.updateContract != 1">删除草稿</el-button> -->
          <el-button @click="cancle()">取消</el-button>
          <p v-if="warningTxt" class="contract-waring-txt">
            请检查信息是否填写完整,检查完成后可再次提交
          </p>
          <p v-if="hasWarning" class="contract-waring-txt">
            请选择合同编号抬头
          </p>
        </div>
      </el-form>
    </div>

    <!-- 选择线索 -->
    <el-dialog title="选择线索" :visible.sync="clueDialog" :close-on-click-modal="false" v-if="clueDialog" width="850px" >
      <contract-choose-clue @closeDialog="closeDialog" @clue="getClue" />
    </el-dialog>
    <!-- 添加订单 -->
    <el-dialog title="添加订单" :visible.sync="productDialog" :close-on-click-modal="false" >
      <addcontractproduct v-if="productDialog" @list="orderInfoList" @closeDialog="closeProductDialog" :existingProducts="form.orderList" :multipleNum="5" :clueInfo="orderParam"/>
    </el-dialog>
    <!-- 编辑订单 -->
    <!-- <el-dialog :title="title" :visible.sync="orderDialog" :close-on-click-modal="false" width="1150px" v-if="orderDialog">
      <contract-order-edit :productInfo="productOrder" :editOrder="editStatus" @list="addOrderInfo" @edit="editOrderInfo" @closeDialog="closeOrderDialog" @lastDialog="openLastDialog"/>
    </el-dialog> -->
    <!-- 添加订单第二步 -->
    <!-- <el-dialog :title="title" :visible.sync="nextStepDialog" :close-on-click-modal="false" width="1150px" v-if="nextStepDialog">
      <add-product-next-step :productInfo="productOrdersList" @closeDialog="closeOrderDialog"  @ordersList="getOrdersList" @goback="goBackLastDialog"/>
    </el-dialog> -->
    <!-- 线索更新 -->
    <el-dialog title="线索信息更新" :visible.sync="clueUpdateDialog" :close-on-click-modal="false" width="800px">
      <clueupdateinfo v-if="clueUpdateDialog" :datalist="changeList" :clueNo="clueInfo.clueNo" @closeDialog="closeDialog" @cancle="cancelUpdate"/>
    </el-dialog>
    <!-- 确认审核人 -->
    <!-- <el-dialog title="提交审核"  :visible.sync="auditDialog" :close-on-click-modal="false">
      <avue-form :option="tableOption" v-model="obj" @submit="submit" @reset-change="reset" emptyText='取消' v-if="auditDialog" >
        <template slot="auditor" >
          <avue-cascader v-if="whichselet==1" :show-all-levels='false'  :props="{ value: 'customerId', label: 'label'}" :dic="empList" filterable v-model="obj.auditor" placeholder="请选择审核人" lang="审核人"></avue-cascader>
          <el-select v-else-if="whichselet ==0" v-model="obj.auditor">
            <el-option 
              v-for="item in empList"
              :key="item.userId"
              :label="item.name"
              :value="item.userId"
            >{{item.name}}
            </el-option>
          </el-select>
          <span v-else>{{obj.name}}</span>
        </template>
        <template slot="remark">
          <avue-input type="textarea" :maxRows="5" v-model="obj.remark" />
        </template>
      </avue-form>
    </el-dialog> -->
    <!--法人、财务 -->
    <el-dialog :visible.sync="userDialog" title="补充客户信息" :close-on-click-modal="false" width="500px">
      <p style="font-weight: 550">
        该单位客户需要补充完整以下信息之一方可提交合同审核
      </p>
      <el-form :model="userForm" ref="userForm" :rules="userRules" label-width="100" inline v-if="userDialog">
        <div class="contact">
          <el-form-item label="公司法人：" prop="ceoName">
            <el-input placeholder="请输入姓名" style="width: 140px" maxlength="50" v-model.trim="userForm.ceoName" />
          </el-form-item>
          <el-form-item prop="ceoPhone" label-width="5px">
            <el-input placeholder="请输入手机号" style="width: 140px"  v-model.trim="userForm.ceoPhone" />
          </el-form-item>
        </div>
        <div class="contact">
          <el-form-item label="财务主管：" prop="cfoName">
            <el-input placeholder="请输入姓名" style="width: 140px" maxlength="50" v-model.trim="userForm.cfoName" />
          </el-form-item>
          <el-form-item prop="cfoPhone" label-width="5px">
            <el-input placeholder="请输入手机号" style="width: 140px"  v-model.trim="userForm.cfoPhone" />
          </el-form-item>
        </div>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="submitAudit(false)">确定</el-button>
        <el-button type="warning" @click="cancleEditUser()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getClueDetail } from "@/api/new-client/my-clue";
import { getPaperContractsDetail ,getOrder} from "@/api/contracts/contracts";
import detailHead from "@/page/index/top/index";
import addcontractproduct from "@/components/clue/add-contract-product";
import addProductNextStep from "./add-product-next-step";
import {
  addContract,
  saveDraft,
  saveContactDraft,
  uploadContactFile,
  contractInfo,
  delContract,
  getContactNO,
  personalSaveDraft,
  personalAddContract,
} from "@/api/clue/clue-contract";
import { getEmpList, getOneEmp, updateUserInfo } from "@/api/clue/clue";
import { checkCreditCode } from "@/api/personal/wtclueaccount"; //检查信用代码
import { getEmpInfo } from "@/api/project/wtClass"
import constract from "./entering-contract.js";
import FileUpload from "../file/file-upload.vue";
import clueupdateinfo from "./clue-update-info";
import contractOrderEdit from "./contract-order-edit.vue";
import contractChooseClue from "./contract-choose-clue";
import dropList from "@/util/department.js";
import * as CodeMsg from "@/api/common/CodeChange";
import { clearDetail } from "@/util/clearDetail";
const math = require("mathjs");
export default {
  components: {
    detailHead,
    FileUpload,
    addcontractproduct,
    clueupdateinfo,
    contractOrderEdit,
    contractChooseClue,
    addProductNextStep,
  },
  data() {
    var contractValidate = (rule, value, callback) => {
      if (this.judge(this.constractForm.file)) {
        callback(new Error("请上传合同附件"));
      } else {
        callback();
      }
    };
    return {
      clueId: "",
      clueType: "",
      whichselet: 0,
      userForm: {},
      show_edit_contract: false,
      loading: false,
      warningTxt: false, //表单必填提醒
      editStatus: false, //是否编辑订单
      contactNoList: [],
      updateContract: "", //修改合同跳转过来标识
      changeList: [], //线索更新信息
      contractFile: [],
      contractId: "", //合同Id
      contractStatus: false, //合同状态
      constractSum: "",
      clueCompanyContactList: [],
      obj: {},
      clueInfo: {},
      empList: [], //员工表
      engineersList: [], //工程师
      financialList: [], //财务辅导人员
      constractForm: {
        contactNoTitle:null,
        contactTitle:'',
      },
      contractUrl:'',//上传合同url
      contractName:'',//上传合同名称
      productDialog: false, //产品
      auditDialog: false, //审核
      noteDialog: false, //备注
      clueUpdateDialog: false, //线索更新
      nextStepDialog: false, //添加订单第二步
      orderIdList:[],
      rules: {
        //合同信息验证
        file: [
          { required: true, validator: contractValidate, trigger: "blur" },
        ],
        signName: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
        ],
        signMobilephone: [
          {
            required: true,
            message: "请输入联系电话(固话须加区号)",
            trigger: "blur",
            pattern: /^((0\d{2,3}-?\d{7,9})|(1[3465789]\d{9}))$/,
          },
        ],
        signTime: [{ required: true, message: "选择签约时间" }],
        contactNoTitle: [
          { required: true, message: "请选择合同编号抬头", trigger: "blur" },
        ],
        contactTitle: [
          {
            required: true,
            pattern: /^[A-Z]{1,10}$/,
            message: "请输入正确的合同编号抬头，最多十个大写字母",
            trigger: "blur",
          },
        ],
        auditor: [{ required: true, message: "请选择审核人", trigger: "blur" }],
        finishTime: [{ required: true, message: "选择交付时间" }],
      },
      userRules: {
        ceoName: [{ message: "请输入公司法人姓名", trigger: "blur" }],
        cfoName: [{ message: "请输入财务主管姓名", trigger: "blur" }],
        ceoPhone: [
          { message: "请填写正确的联系电话", trigger: "blur" },
          {
            pattern: /^\s*((0\d{2,3}-?\d{7,8})|(1[3456789]\d{9}))\s*$/,
            message: "请填写正确的联系电话",
            trigger: "blur",
          },
        ],
        cfoPhone: [
          { message: "请填写正确的联系电话", trigger: "blur" },
          {
            pattern: /^\s*((0\d{2,3}-?\d{7,8})|(1[3456789]\d{9}))\s*$/,
            message: "请填写正确的联系电话",
            trigger: "blur",
          },
        ],
      },
      list: constract.info, // ./entering-contact.js
      timeRules: constract.timeRules,
      expireTimeOption: constract.expireTimeOption,
      TimeOption: constract.TimeOption,
      // tableOption: constract.tableOption,//审核弹框数据
      form: {
        orderList: [],//订单列表
      },
      transfer: {}, //转换使用
      contactTitle: "",
      change: true,
      productOrder: {},
      productOrdersList: [],
      orderDialog: false, //添加编辑订单信息
      title: "",
      contractSumUncertain: false,
      clueDialog: false,
      hasClueInfo: true,
      hasWarning: false,
      draftContractNo: "",
      draftStatus: 999, //默认一个非0值
      userDialog: false,
      changewidth: true,
      orderParam:{
        clueId:null,
        clueType:null,
        clueSalesmanEmpId:null
      },
      cEmpNo: "",
      cDeptName: ""
    };
  },
  filters: {
    change(price, priceStatus) {
      if (priceStatus) {
        return "待定";
      } else {
        return price == null ? 0 : price;
      }
    },
  },
  created() {
    dropList.getSpecificEmp(2).then((res) => {
      //财务辅导
      this.financialList = res;
    });
    this.getContactNoTitle();
    this.getAllperson();
    // this.getEmp(); //员工下拉框数据
    // if (this.$route.query.id) {
    //   this.contractStatus = true;
    //   this.contractId = this.$route.query.id;
    //   this.updateContract = this.$route.query.update;
    //   this.draftStatus = this.$route.query.contractStatus;
    //   this.getContractInfo();
    // } else if (this.$route.query.clueId) {
    //   this.clueId = this.$route.query.clueId;
    //   this.clueType = this.$route.query.clueType;
    //   this.getDetail();
    // } else {
    //   this.show_edit_contract = true;
    // }
    // if (sessionStorage.getItem("clueInfo")) {
    //   this.clueInfo = sessionStorage.getItem("clueInfo");
    //   this.clueId = sessionStorage.getItem("clueId");
    //   this.hasClueInfo = sessionStorage.getItem("hasClueInfo");
    // }
    // if (sessionStorage.getItem("id")) {
    //   this.contractId = sessionStorage.getItem("id");
    //   this.draftStatus = sessionStorage.getItem("contractStatus");
    //   this.getContractInfo();
    // }
    // if (
    //   sessionStorage.getItem(
    //     JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
    //   )
    // ) {
    //   sessionStorage.setItem(
    //     JSON.parse(sessionStorage.getItem("pigx-tag")).content.value,
    //     JSON.stringify({
    //       page: JSON.parse(
    //         sessionStorage.getItem(
    //           JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
    //         )
    //       ).page,
    //       screening: JSON.parse(
    //         sessionStorage.getItem(
    //           JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
    //         )
    //       ).screening, //表单筛选信息
    //       ID: JSON.parse(sessionStorage.getItem("pigx-tag")).content.label, //页面标识
    //       detail: { query: this.$route.query, path: this.$route.path },
    //     })
      // ); //保存页面信息
    // }
  },
  mounted() {
    setTimeout(() => {
      this.changewidth = false;
    }, 800);
    if(this.$route.query.id){
      this.draftStatus = 0
      this.getData()
    }
  },
  destroyed() {
    sessionStorage.removeItem("clueInfo");
    sessionStorage.removeItem("clueId");
    sessionStorage.removeItem("hasClueInfo");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("contractStatus");
  },
  methods: {
    // 获取员工信息
    showUserInfo(id){
      getEmpInfo(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
    // 获取线索详情数据
    getDetail() {
      let params =
        this.clueType == 1
          ? { clueCompanyId: this.clueId }
          : { cluePersonId: this.clueId };
      getClueDetail(params, this.clueType, true).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.show_edit_contract = true;
          this.clueInfo = res.data.data;
          if (res.data.data.clueCompanyContactList) {
            this.clueCompanyContactList =
              res.data.data.clueCompanyContactList[0];
          }
          // this.userData = res.data.data
          // this.userData.clueType = this.clueType
        }
      });
    },
    // oninputForPhone(value) {
    //   return value.replace(/[^\d-+]/g, "");
    // },
    // 关闭补充客户信息弹窗
    cancleEditUser() {
      this.userDialog = false;
    },
    // getOrdersList(val) {
    //   this.form.orderList.push(...val);
    //   this.productDialog = false;
    //   let deptNo = this.form.orderList[0].productType ? 0 : 1;
    //   dropList.getSpecificEmp(deptNo).then((res) => {
    //     this.engineersList = res;
    //   });
    // },
    // goBackLastDialog(val) {
    //   this.nextStepDialog = val;
    // },
    getEmp() {
      this.whichselet = 0;
      getOneEmp().then((res) => {
        if (res.data.data.length == 0) {
          //未设置审核人
          this.whichselet = 1;
          this.getAllperson();
        } else if (res.data.data.length == 1) {
          // //只有一个审核人
          // this.whichselet = 2;
          // this.constractForm = res.data.data[0];
          // this.constractForm.auditor = this.constractForm.userId;
        } else {
          // this.whichselet = 0;
          // this.empList = res.data.data;
        }
      });
    },
    getAllperson() {
      getEmpList(true).then((res) => {
        //员工
        this.empList = res.data.data;
      })
    },
    //草稿状态返回录入合同数据回显
    getData(){
        getPaperContractsDetail(Number(this.$route.query.id)).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.draftContractNo = res.data.data.contractNo
            this.constractForm.signName = res.data.data.signName
            this.constractForm.signMobilephone = res.data.data.signMobile
            this.constractForm.signTime = res.data.data.signTime
            this.constractForm.contractNote = res.data.data.remark
            this.constractForm.auditor = [null,res.data.data.handlerId]
            this.contractFile.push({
              url: res.data.data.signUrl,
              name: res.data.data.contractName,
              file:new File([],res.data.contractName,{})
            })
            this.clueInfo.clueNo = res.data.data.clueNo
            this.clueInfo.contactName = res.data.data.contactName
            this.clueInfo.mobile = res.data.data.mobile
            this.clueInfo.clueId = res.data.data.id
            this.clueInfo.clueSalesmanEmpId = res.data.data.clueSalesmanEmpId
            this.clueInfo.clueSalesmanEmpName = res.data.data.clueSalesmanEmpName
            // this.orderParam.clueType = 
            this.orderParam.clueSalesmanEmpId = res.data.data.clueSalesmanEmpId
            this.orderParam.clueId =  res.data.data.id
            this.getOrder(JSON.parse(JSON.stringify(res.data.data.orderIdList)))
          }
       });
    },
    // 根据订单id查订单列表
    getOrder(arr){
      getOrder(arr).then(res=>{
        if(res.data.code == 0){
          this.form.orderList = res.data.data
        }
      })
    },
    // 获取添加的线索信息
    getClue(val) {
      this.clueInfo = val;
      if(val.clueType == 1){
        this.orderParam.clueId = Number(val.clueCompanyId);
      }else if(val.clueType == 0){
        this.orderParam.clueId = Number(val.cluePersonId);
      }
      this.orderParam.clueType = val.clueType + 1;
      this.orderParam.clueSalesmanEmpId = val.clueSalesmanEmpId;
      this.userForm = JSON.parse(JSON.stringify(val));
      this.clueId = val.id;
      this.hasClueInfo = true;
      sessionStorage.setItem("clueInfo", val);
      sessionStorage.setItem("clueId", val.id);
      sessionStorage.setItem("hasClueInfo", true);
    },
    // 更换线索
    chooseClue() {
      this.clueDialog = true;
    },
    getContactNoTitle() {
      getContactNO(4).then((res) => {
          //合同编号抬头
          this.contactNoList = res.data.data;
          this.contactNoList.push({ value: 0, label: "自定义", labelDesc: "" });
        })
    },
    changeNo(val, label) {
      if (val == 0) {
        this.$set(this.constractForm, "contactTitle", "");
      } else {
        this.contactTitle = label;
        this.change = false; //是否修改抬头
      }
    },
    viewUpdateInfo() {
      //查看线索信息更新
      this.clueUpdateDialog = true;
    },
    deleteContract() {
      this.$confirm("确认删除该条合同吗？", "提示", {
        type: "warning",
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
      }).then(() => {
        let param = {
          id: this.contractId,
          contractStatus: this.$route.query.contractStatus,
          no: this.draftContractNo,
        };
        delContract(param).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "合同删除成功！",
              offset: 100,
              duration: 2000
            });
            clearDetail("/personal/my-contracts");
            setTimeout(() => {
              this.$router.push("/personal/my-contracts");
            }, 500);
          }
        });
      });
    },
    getContractInfo() {
      //合同信息回显
      // contractInfo(this.contractId, this.$route.query.source).then((res) => {
      //   if (res.data.code != CodeMsg.CODE_1001) {
      //     this.show_edit_contract = true;
      //   } else {
      //     setTimeout(() => {
      //       history.go(-1);
      //     }, 500);
      //   }
      //   if (this.$route.query.transfer) {
      //     this.draftStatus = res.data.data.contractStatus;
      //     this.draftContractNo = res.data.data.contractNo; //草稿合同编号
      //   } else {
      //     this.userForm = JSON.parse(JSON.stringify(res.data.data));
      //     if (res.data.data.orders) {
      //       this.form.orderList = res.data.data.orders;
      //     }
      //     if (this.form.orderList.length > 0) {
      //       let deptNo = this.form.orderList[0].productType ? 0 : 1;
      //       dropList.getSpecificEmp(deptNo).then((res) => {
      //         this.engineersList = res;
      //       });
      //       dropList.getSpecificEmp(2).then((res) => {
      //         //财务辅导
      //         this.financialList = res;
      //       });
      //     }
      //     this.draftStatus = res.data.data.contractStatus;
      //     this.clueInfo = res.data.data;
      //     this.draftContractNo = res.data.data.contractNo; //草稿合同编号
      //     if (res.data.data.clueId) {
      //       this.clueId = res.data.data.clueId;
      //     } else {
      //     }
      //     this.$set(
      //       this.clueInfo,
      //       "customerBelongEmpName",
      //       res.data.data.cuBelongName
      //     );
      //     this.$set(this.clueInfo, "phone", res.data.data.phone);
      //     this.$set(
      //       this.clueInfo,
      //       "customerBelongEmpNo",
      //       res.data.data.cuBelongNo
      //     );
      //     this.$set(
      //       this.clueInfo,
      //       "customerBelongDeptName",
      //       res.data.data.cuBelongDeptName
      //     );
      //     this.$set(
      //       this.clueInfo,
      //       "customerEmpName",
      //       res.data.data.clBelongName
      //     );
      //     this.$set(this.clueInfo, "customerEmpNo", res.data.data.clBelongNo);
      //     this.$set(
      //       this.clueInfo,
      //       "customerDeptName",
      //       res.data.data.clBelongDeptName
      //     );
      //     this.$set(
      //       this.clueInfo,
      //       "salesmanEmpName",
      //       res.data.data.saleBelongName
      //     );
      //     this.$set(this.clueInfo, "salesmanEmpNo", res.data.data.saleBelongNo);
      //     this.$set(
      //       this.clueInfo,
      //       "salesmanDeptName",
      //       res.data.data.saleBelongDeptName
      //     );
      //     this.$set(this.clueInfo, "uuid", res.data.data.uuid);
      //     this.$set(
      //       this.constractForm,
      //       "contactNoTitle",
      //       res.data.data.prefixValue
      //     );
      //     this.$set(this.constractForm, "contactTitle", res.data.data.prefix);
      //     // if(res.data.data.financialIdCascade != null){
      //     //   this.$set(this.constractForm,'financialIdCascade',Number(res.data.data.financialIdCascade));
      //     // }
      //     // if(res.data.data.engineerCascadeView){
      //     //   this.$set(this.constractForm,'engineerCascadeView',Number(res.data.data.engineerCascadeView));
      //     // }
      //     if (!this.contractId) {
      //       this.$set(
      //         this.constractForm,
      //         "signName",
      //         res.data.data.contactName
      //       );
      //       this.$set(
      //         this.constractForm,
      //         "signMobilephone",
      //         res.data.data.contactMobilephone
      //       );
      //     }
      //     this.form.orderList.forEach((element) => {
      //       element.agencyFee = element.agencyFee / 100;
      //       element.thirdPartyFee = element.thirdPartyFee / 100;
      //       element.governmentFee = element.governmentFee / 100;
      //     });
      //     if (res.data.data.changeList.length > 0) {
      //       this.changeList = res.data.data.changeList;
      //       this.clueUpdateDialog = true;
      //     }
      //     if (res.data.data.attachmentName) {
      //       this.contractStatus = true;
      //       var file = {};
      //       file.name = res.data.data.attachmentName;
      //       file.attachmentUrl = res.data.data.attachmentUrl;
      //       if (this.contractFile.length > 0) {
      //       } else {
      //         this.contractFile.push(file);
      //       }
      //     }
      //     this.$set(this.constractForm, "signTime", res.data.data.signTime);
      //     this.$set(this.constractForm, "signName", res.data.data.signName);
      //     this.$set(
      //       this.constractForm,
      //       "signMobilephone",
      //       res.data.data.signMobilephone
      //     );
      //     this.$set(
      //       this.constractForm,
      //       "contractNote",
      //       res.data.data.contractNote
      //     );
      //     this.$set(this.constractForm, "file", file);
      //   }
      // });
    },
    handle() {
      var startAt = (new Date(this.constractForm.signTime) * 1000) / 1000;
      if (startAt > Date.now()) {
        this.constractForm.signTime = new Date();
      }
    },
    editOrder(row) {
      this.editStatus = true;
      // this.orderDialog = true;
      this.title = "编辑订单";
      this.productOrder = row;
    },
    // 删除订单
    deleteProduct(row) {
      this.$confirm("确认删除该订单吗？", "提示", {
        type: "warning",
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
      }).then(() => {
        for (let i = 0; i < this.form.orderList.length; i++) {
          if (this.form.orderList[i].orderNo == row.orderNo) {
            this.form.orderList.splice(
              this.form.orderList.indexOf(this.form.orderList[i]),
              1
            );
          }
        }
        if (this.form.orderList.length == 0) {
          this.engineersList = [];
        }
      });
    },
    submit() {
      //确认审核人
      this.submitAudit(false);
      // this.auditDialog = false;
      // this.obj = {};
    },
    reset() {
      //清空审核人表单并关闭
      this.auditDialog = false;
    },
    // 提交审核
    nextAuditor() {
      //   //手机号已失效
      //   this.$alert("线索手机号已失效，请修改线索信息后再试！", "禁止提交", {
      //     type: "danger",
      //     showCancelButton: false,
      //     confirmButtonText: "我知道了",
      //   });
      this.$refs.constractForm.validate((valid) => {
        if (valid) {
          this.warningTxt = false;
          if(JSON.parse(JSON.stringify(this.orderParam)).clueId == null){
            this.$message({
              type: 'warning',
              message: '尚未线索信息无法提交审核，请先添加线索',
              offset: 100
            })
            return false;
          }
          if(JSON.parse(JSON.stringify(this.orderIdList)).length == 0){
            this.$message({
              type: 'warning',
              message: '尚未订单信息无法提交审核，请先添加订单',
              offset: 100
            })
            return false;
          }
          this.submitAudit(false);
        } else {
          this.warningTxt = true;
          return false;
        }
      });
    },
    getFileList(val) {
      //获取上传的文件
      this.uploadContractFile(val[0]);
    },
    // 判断是否为空
    judge(val){
      if(val == '' || val == null || val == undefined){
        return true;
      }else{
        return false;
      }
    },
    // 上传合同文件
    uploadContractFile(val){
      this.constractForm.file = val;
      if(!this.judge(val)){
        var para = new FormData();
        para.append('multipartFile', val.raw);
        uploadContactFile(para).then(res=>{
          if(res.data.code == 0){
            this.contractUrl = res.data.data.url;
            this.contractName = res.data.data.name;
          }
        })
      }
    },
    // 提交审核/保存草稿
    submitAudit(isDraft) {
      var param = {
        isDraft: isDraft,
        clueId: this.judge(this.orderParam.clueId) ? null : this.orderParam.clueId,//线索ID
        clueType: this.judge(this.orderParam.clueType) ? null : this.orderParam.clueType,//认证类型 1个人 2企业
        salesmanEmpId: this.judge(this.orderParam.clueSalesmanEmpId) ? null : this.orderParam.clueSalesmanEmpId,//线索业务员ID
        orderIdList: JSON.parse(JSON.stringify(this.orderIdList)),//订单列表
        contractNoHead: this.constractForm.contactNoTitle == 0 ? this.constractForm.contactTitle : this.contactTitle,//合同编号抬头
        signUrl: this.contractUrl,//签署合同附件url
        signName: this.judge(this.constractForm.signName) ? '' : this.constractForm.signName,//签署人名称
        signMobile: this.judge(this.constractForm.signMobilephone) ? '' : this.constractForm.signMobilephone,//签署人手机号
        signTime:  this.$moment(this.constractForm.signTime).format("YYYY-MM-DD HH:mm:ss"),//签约时间
        auditEmpId: this.judge(this.constractForm.auditor) ? null : this.constractForm.auditor[1],//审核人ID
        auditEmpName: this.judge(this.constractForm.auditor) ? '' : this.$refs.cas.getCheckedNodes()[0].pathLabels[1],//审核人名称
        contractName: this.contractName,//上传合同名称
        remark: this.judge(this.constractForm.contractNote) ? '' : this.constractForm.contractNote,//合同备注
        legalName: this.userForm.ceoName,//法人姓名
        legalMobile: this.userForm.ceoPhone,//法人手机号
        treasurerName: this.userForm.cfoName,//财务主管名称
        treasurerMobile: this.userForm.cfoPhone,//财务主管手机号
      } 
      // 判断是否为草稿状态  true 保存草稿 false 提交审核
      if(isDraft){
        if(this.draftStatus!= 0 && this.judge(param.contractNoHead)){
          this.$message({
            type: 'warning',
            message: '至少需选择合同编号抬头',
            offset: 100
          })
          return false
        }
        saveContactDraft(param).then(res=>{
          if(res.data.code != 0){
            this.$message({
              type: 'warning',
              message: res.data.msg,
              offset: 100
            })
            return false;
          }
          // this.draftStatus = 0;
          // this.draftContractNo = res.data.data;
          this.$message({
            type: 'success',
            message: '保存草稿成功',
            offset: 100
          })
          this.$router.push("/contracts/contracts-manage")
        })
      }else{
        saveContactDraft(param).then(res=>{
          if(res.data.code != 0){
            res.data.code == 4002 ? this.userDialog = true : this.userDialog = false;
            this.userDialog == false && this.$message({
              type: 'warning',
              message: res.data.msg,
              offset: 100
            })
            return false;
          }
          console.log(res)
          this.$message({
            type: 'success',
            message: '提交审核成功',
            offset: 100
          })
          this.$router.push("/contracts/contracts-manage")
        })
      }
    },
    closeDialog(val) {
      //关闭子组件
      this.clueUpdateDialog = val;
      this.clueDialog = val;
      // if(this.$route.query.id){
      //   this.getContractInfo();
      // }
    },
    closeProductDialog(val) {
      //关闭产品选择框
      this.productDialog = val;
    },
    // closeOrderDialog(val) {
    //   //关闭订单框
    //   this.orderDialog = val;
    //   this.editStatus = false;
    // },
    // openLastDialog(val) {
    //   this.productDialog = val;
    //   this.orderDialog = false;
    // },
    cancelUpdate(val) {
      this.clueUpdateDialog = val;
    },
    orderInfoList(val) {
      this.form.orderList = Object.values(val);
      this.form.orderList.forEach(item=>{
        this.orderIdList.push(item.id)
      })
    },
    // addOrderInfo(val) {
    //   this.form.orderList = this.form.orderList.concat(val);
    //   // let deptNo = this.form.orderList[0].productType ? 'DEPT06' :'DEPT05';
    //   let deptNo = this.form.orderList[0].productType ? 0 : 1; //0-知识产权 1-项目申报
    //   dropList.getSpecificEmp(deptNo).then((res) => {
    //     // 工程师
    //     this.engineersList = res;
    //     if(this.form.orderList[0].productType == 1){
    //       dropList.getSpecificEmp('DEPT05').then(res=>{//工程师
    //         this.engineersList.push(...res);
    //       });
    //     }
    //   });
    // },
    // editOrderInfo(val) {
    //   this.form.orderList.forEach((item, index) => {
    //     if (val.orderNo == item.orderNo) {
    //       this.form.orderList.splice(index, 1, val);
    //     } 
    //   });
    // },
    addProduct() {
      //添加产品
      if(Object.keys(this.clueInfo).length == 0){
        this.$message({
          type: "warning",
          message: '尚无线索信息，无法添加订单！',
          offset: 300
        });
      }else{
        this.productDialog = true;
      }
    },
    cancle() {
      if (this.updateContract == 1) {
        //修改合同-取消修改
        this.$confirm("确定取消修改合同？", "提示", {
          type: "warning",
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel",
        }).then(() => {
          history.go(-1);
        });
      } else {
        //录入合同-取消录入
        this.$confirm("取消录入后合同信息不会被保存，请保存草稿!", "提醒", {
          type: "warning",
          distinguishCancelAndClose: true,
          confirmButtonText: "存为草稿",
          cancelButtonText: "取消录入",
          cancelButtonClass: "btn-custom-cancel",
        }).then(() => {
            this.submitAudit(true);
          })
          .catch((res) => {
            if (
              sessionStorage.getItem(
                JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
              )
            ) {
              sessionStorage.setItem(
                JSON.parse(sessionStorage.getItem("pigx-tag")).content.value,
                JSON.stringify({
                  page: JSON.parse(
                    sessionStorage.getItem(
                      JSON.parse(sessionStorage.getItem("pigx-tag")).content
                        .value
                    )
                  ).page,
                  screening: JSON.parse(
                    sessionStorage.getItem(
                      JSON.parse(sessionStorage.getItem("pigx-tag")).content
                        .value
                    )
                  ).screening, //表单筛选信息
                  ID: JSON.parse(sessionStorage.getItem("pigx-tag")).content
                    .label, //页面标识
                  detail: { query: {} },
                })
              ); //保存页面信息
            }
            if (res == "close") {
            } else {
              setTimeout(() => {
                history.go(-1);
              }, 500);
            }
          });
      }
    },
    // 合计总价
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价';
            return;
          }
          if(index == 5){
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[5] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 元';
            } else {
              sums[index] = 'N/A';
            }
          }
        });
        return sums;
    },
    addRedStar(h, { column }) {
      // 给表头加标识
      return [
        h("span", { style: "color: red" }, "*"),
        h("span", " " + column.label),
      ];
    },
  },
};
</script>

<style scoped>
@import url("./entering-contract.css");
.frame {
  font-size: 14px;
  padding-bottom: 40px;
  background: #fff;
  margin: 0 10px;
  border-radius: 5px;
}
.newsty {
  margin-top: -40px;
}
.order_txt {
  color: #999999;
}
.contact {
  display: flex;
}
.disableman {
  width: 15px;
  height: 15px;
  position: relative;
  top: 3px;
  left: -10px;
}
.disablemancal {
  width: 15px;
  height: 15px;
  position: relative;
  top: 3px;
  left: 5px;
}
.el-table th.gutter {
  display: table-cell !important;
}
.transfer-box {
  display: flex;
}
.transfer-btn {
  border: 1px solid #36a6fe;
  margin-left: 20px;
  margin-top: 15px;
  color: #36a6fe;
  border-radius: 4px;
  cursor: pointer;
}
.clue-info-head,
.clue-infos {
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.clue-info-head p {
  width: 20%;
  text-align: center;
}
.clue-infos p {
  width: 20%;
  text-align:center;
}
::v-deep i.el-input__icon.el-icon-date {
  position: absolute;
  right: 0;
}
</style>