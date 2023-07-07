<template>
  <div class="signing">
    <div class="title">
      <span>成交客户编号：{{userData.userNo}}</span>
      <el-tooltip effect="dark" :content="tooltipContent" placement="right">
        <span class="transform"  @mouseover="showUserInfo(userData.clueAttributionEmpId)">客户归属：{{userData.clueAttributionEmpName}}</span>
      </el-tooltip>
    </div>
    <span class="signing-spa">基本信息</span>
    <div class="bor"></div>
    <!-- 单位客户 -->
    <div class="signing-info" v-if="clueType == 2">
      <p><span class="ncolor">单位类型：</span> {{ userData.orgType|filterUnitType }}</p>
      <p v-if="userData.clueCompanyContactList&&userData.clueCompanyContactList.length>0">
        <span class="ncolor">联&nbsp;&nbsp;系&nbsp;&nbsp;人1：</span>
        <span class="span_left_sty">{{ userData.clueCompanyContactList[0].contactName }}</span>
        <span class="span_left_sty">{{ userData.clueCompanyContactList[0].jobName }}</span>
        <span class="span_left_sty">{{userData.clueCompanyContactList[0].mobile}}</span>
      </p>
      <p><span class="ncolor">行业类型：</span>{{ userData.industry|filterIndustry }}</p>
      <p v-if="userData.clueCompanyContactList&&userData.clueCompanyContactList.length>=2&&userData.clueCompanyContactList[1].contactName!==''">
        <span class="ncolor">联&nbsp;&nbsp;系&nbsp;&nbsp;人2：</span>
        <span class="span_left_sty">{{ userData.clueCompanyContactList[1].contactName }}</span>
        <span class="span_left_sty">{{ userData.clueCompanyContactList[1].jobName }}</span>
        <span class="span_left_sty">{{userData.clueCompanyContactList[1].mobile}}</span>
        <span v-if="userData.contractTwoCertificationStatus&&userData.contractTwoCertificationStatus!==null" >
            <span class="alread_register" :class="{'cur':listType =='personal'}"  @click="openRegisterDialog(1,userData.mobilePhoneTwoIsRegister)">
              {{ userData.contractTwoCertificationStatus }}
            </span>
          </span>
      </p>
      <p><span class="ncolor">所在地区： </span> {{ userData.orgAddress|filterArea }}</p>
      <p v-if="userData.clueCompanyContactList&&userData.clueCompanyContactList.length>=3&&userData.clueCompanyContactList[2].contactName!==''">
        <span class="ncolor">联&nbsp;&nbsp;系&nbsp;&nbsp;人3：</span>
        <span class="span_left_sty">{{userData.clueCompanyContactList[2].contactName }}</span>
        <span class="span_left_sty">{{userData.clueCompanyContactList[2].jobName }}</span>
        <span class="span_left_sty">{{userData.clueCompanyContactList[2].mobile}}</span>
       <span v-if="userData.contractThreeCertificationStatus&&userData.contractThreeCertificationStatus!==null">
            <span class="alread_register" :class="{'cur':listType =='personal'}"  @click="openRegisterDialog(2,userData.mobilePhoneThreeIsRegister)">
              {{ userData.contractThreeCertificationStatus }}
            </span>
          </span>
      </p>
       <p><span class="ncolor">详细地址： </span>{{ userData.detailAddress|filterArea }}</p>
       <p v-if="userData" class="upLoad_pdf_sty"><span class="ncolor">​营业执照：</span><span>
           <el-upload
           v-show="!fileUrl&&!upLoadState"
            ref="uploadcertificate"
            class="upload-demo"
            action="/your-upload-endpoint"
            :file-list="fileList"
            :on-change="handleChange"
            :auto-upload="false"
            :multiple="false"
            :accept="accept"
          >
          <el-button v-if="filterTaskAuthority()&&!fileUrl" size="small" type="primary">点击上传</el-button>
          </el-upload>
          <div v-if="fileUrl&&upLoadState" class="preview-contain" >
            <img v-if="fileType == 'pdf'" :src="require('@/assets/images/new-client/license.png')" alt="" @click="handlePreview(userData.tmCustomerResource)">
            <img v-else :src="fileUrl" alt="" @click="handlePreview(userData.tmCustomerResource)">
         </div>
         <div v-if="fileUrl&&!upLoadState" class="preview-contain" >
            <img v-if="fileType == 'pdf'" :src="require('@/assets/images/new-client/license.png')" alt="" @click="handlePreview(userData.tmCustomerResource)">
            <img v-else :src="fileUrl" alt="" @click="handlePreview(userData.tmCustomerResource)">
         </div>
      </span> <span v-if="(!upLoadState&&fileUrl)&&filterTaskAuthority()" @click="upDataStateFun()">更新</span> <span v-if="upLoadState"><span @click="definiteUpdate()">√ 确定更新</span> <span @click="cancelUpdate()">× 取消更新</span></span> </p>

    </div>
     <!-- 个人客户 -->
     <div class="signing-info" v-else>
      <p>
        <span class="ncolor">联 系 人：</span>
        <span class="span_left_sty">{{ userData.contactName }}</span>
        <span class="span_left_sty">{{ userData.jobName }}</span>
        <span class="span_left_sty">{{userData.mobile}}</span>
        <span class="alread_register" :class="{'cur':listType =='personal'}" v-if="userData.contractCertificationStatus&&userData.contractCertificationStatus!==null" @click="openRegisterDialog(0,basicRegisterData.accountType)">
          <span>{{ userData.contractCertificationStatus }}</span>
        </span>
      </p>
      <p><span class="ncolor">所在地区： </span> {{ userData.orgAddress|filterArea }}</p>
      <p><span class="ncolor">单位类型：</span> {{ userData.orgType|filterUnitType }}</p>
      <p><span class="ncolor">行业类型：{{ userData.industry|filterIndustry }}</span></p>
      <p>
        <span class="ncolor">单位名称： </span>
        <template v-if="userData.companyName!==null">{{ userData.companyName }}</template>
        <template v-else>暂无数据</template>
      </p>
      <p><span class="ncolor">详细地址： </span>{{ userData.detailAddress|filterArea }}</p>
    </div>
    <!-- 单位数据 -->
    <template v-if="clueType == 2">
        <span class="signing-spa">单位数据&nbsp; <i v-if="$route.query.listType =='personal'" @click="openEditDialog('second')" class="el-icon-edit newcolor" /></span>
        <div class="bor"></div>
        <div class="company">
            <div class="dea"><span class="analyze"></span><span>&nbsp;知产情况</span></div>
            <el-row class="ncolor">
                <el-col :span="4"><p>发明专利</p>
                  <p v-if="cluePropertyInfo.inventionList&&cluePropertyInfo.inventionList.length>0">
                    <span class="big">{{ cluePropertyInfo.inventionList.length }}</span>
                    <span>件</span>
                    <span class="left-sty">
                      <span @click="viewDialog(cluePropertyInfo.inventionList)" class="pointer-sty">查看</span>
                      <span v-if="uploadPermission" @click="openDialog(2)" class="pointer-sty left-sty">上传<span class="normal-sty">(pdf格式)</span></span>
                    </span>
                  </p>
                  <p class="pt" v-else>
                    <span>暂无数据</span>
                    <span class="left-sty">
                      <span v-if="uploadPermission" @click="openDialog(2)" class="pointer-sty left-sty">上传<span class="normal-sty">(pdf格式)</span></span>
                    </span>
                  </p>
                </el-col>
                <el-col :span="4"><p>实用新型专利</p>
                  <p v-if="cluePropertyInfo.practicalList&&cluePropertyInfo.practicalList.length>0">
                    <span class="big">{{ cluePropertyInfo.practicalList.length }}</span>
                    <span>件</span>
                    <span class="left-sty">
                      <span @click="viewDialog(cluePropertyInfo.practicalList)" class="pointer-sty">查看</span>
                      <span v-if="uploadPermission" @click="openDialog(3)" class="pointer-sty left-sty">上传<span class="normal-sty">(pdf格式)</span></span>
                    </span>
                  </p>
                  <p class="pt" v-else>
                    <span>暂无数据</span>
                    <span class="left-sty">
                      <span v-if="uploadPermission" @click="openDialog(3)" class="pointer-sty left-sty">上传<span class="normal-sty">(pdf格式)</span></span>
                    </span>
                  </p>
                </el-col>
                <el-col :span="4"><p>外观专利</p>
                  <p v-if="cluePropertyInfo.appearanceList&&cluePropertyInfo.appearanceList.length>0">
                    <span class="big">{{ cluePropertyInfo.appearanceList.length }}</span>
                    <span>件</span>
                    <span class="left-sty">
                      <span @click="viewDialog(cluePropertyInfo.appearanceList)" class="pointer-sty">查看</span>
                      <span v-if="uploadPermission" @click="openDialog(4)" class="pointer-sty left-sty">上传<span class="normal-sty">(pdf格式)</span></span>
                    </span>
                  </p>
                  <p class="pt" v-else>
                    <span>暂无数据</span>
                    <span class="left-sty">
                      <span v-if="uploadPermission" @click="openDialog(4)" class="pointer-sty left-sty">上传<span class="normal-sty">(pdf格式)</span></span>
                    </span>
                  </p>
                </el-col>
                <el-col :span="4"><p>商标</p>
                  <p v-if="cluePropertyInfo.trademarkList&&cluePropertyInfo.trademarkList.length>0">
                    <span class="big">{{ cluePropertyInfo.trademarkList.length }}</span>
                    <span>件</span>
                    <span class="left-sty">
                      <span @click="viewDialog(cluePropertyInfo.trademarkList)" class="pointer-sty">查看</span>
                      <span v-if="uploadPermission" @click="openDialog(5)" class="pointer-sty left-sty">上传<span class="normal-sty">(pdf格式)</span></span>
                    </span>
                  </p>
                  <p class="pt" v-else>
                    <span>暂无数据</span>
                    <span class="left-sty">
                      <span v-if="uploadPermission" @click="openDialog(5)" class="pointer-sty left-sty">上传<span class="normal-sty">(pdf格式)</span></span>
                    </span>
                  </p>
                </el-col>
                <el-col :span="4"><p>版权</p>
                  <p v-if="cluePropertyInfo.copyrightList&&cluePropertyInfo.copyrightList.length>0">
                    <span class="big">{{ cluePropertyInfo.copyrightList.length }}</span>
                    <span>件</span>
                    <span class="left-sty">
                      <span @click="viewDialog(cluePropertyInfo.copyrightList)" class="pointer-sty">查看</span>
                      <span v-if="uploadPermission" @click="openDialog(6)" class="pointer-sty left-sty">上传<span class="normal-sty">(pdf格式)</span></span>
                    </span>
                  </p>
                  <p class="pt" v-else>
                    <span>暂无数据</span>
                    <span class="left-sty">
                      <span v-if="uploadPermission" @click="openDialog(6)" class="pointer-sty left-sty">上传<span class="normal-sty">(pdf格式)</span></span>
                    </span>
                  </p>
                </el-col>
                <el-col :span="4"><p>其他知产</p>
                  <p v-if="cluePropertyInfo.otherList&&cluePropertyInfo.otherList.length>0">
                    <span class="big">{{ cluePropertyInfo.otherList.length }}</span>
                    <span>件</span>
                    <span class="left-sty">
                      <span @click="viewDialog(cluePropertyInfo.otherList)" class="pointer-sty">查看</span>
                      <span v-if="uploadPermission" @click="openDialog(7)" class="pointer-sty left-sty">上传<span class="normal-sty">(pdf格式)</span></span>
                    </span>
                  </p>
                  <p class="pt" v-else>
                    <span>暂无数据</span>
                    <span class="left-sty">
                      <span v-if="uploadPermission" @click="openDialog(7)" class="pointer-sty left-sty">上传<span class="normal-sty">(pdf格式)</span></span>
                    </span>
                  </p>
                </el-col>
            </el-row>
            <div class="dea" style="margin-top:16px"> 
              <span class="analyze"></span>
              <span>&nbsp;财务及人员情况</span>
              <el-select v-model="currentYear" @change="getClueOrganization()" class="year-select">
                <el-option 
                  v-for="item in yearsList"
                  :key="item.year"
                  :value="item.year"
                  :label="item.name"
                />
              </el-select>
            </div>
            <el-row class="ncolor">
                <el-col :span="4"><p>上年度销售总额</p>
                <div v-if="clueOrganization.lastYearSale"><el-tag class="tag_sty" size="mini">{{ clueOrganization.lastYearSale | filterLastYearSale}}</el-tag></div>
                <div v-else><el-tag class="tag_sty" size="mini">暂无数据</el-tag></div>
                <p v-if="clueOrganization.lastYearSaleAmount"><span class="big">{{ clueOrganization.lastYearSaleAmount }}</span>万元</p>
                <p v-else>暂无数据</p></el-col>
                <el-col :span="4"><p>上年度资产总计</p>
                <div v-if="clueOrganization.lastYearAssets"><el-tag class="tag_sty" size="mini">{{ clueOrganization.lastYearAssets | filterLastYearSale}}</el-tag></div>
                <div v-else><el-tag class="tag_sty" size="mini">暂无数据</el-tag></div>
                <p v-if="clueOrganization.lastYearAssetsAmount"><span class="big">{{ clueOrganization.lastYearAssetsAmount }}</span>万元</p>
                <p v-else>暂无数据</p></el-col>
                <el-col :span="4"><p>上年度利润总额</p>
                <div v-if="clueOrganization.lastYearProfit"><el-tag class="tag_sty" size="mini">{{ clueOrganization.lastYearProfit | filterLastYearSale}}</el-tag></div>
                <div v-else><el-tag class="tag_sty" size="mini">暂无数据</el-tag></div>
                <p v-if="clueOrganization.lastYearProfitAmount"><span class="big">{{ clueOrganization.lastYearProfitAmount }}</span>万元</p>
                <p v-else>暂无数据</p></el-col>
                <el-col :span="4"><p>上年度研发费用总额</p>
                <div v-if="clueOrganization.lastYearDevExpenses"><el-tag class="tag_sty" size="mini">{{ clueOrganization.lastYearDevExpenses | filterLastYearSale}}</el-tag></div>
                <div v-else><el-tag class="tag_sty" size="mini">暂无数据</el-tag></div>
                <p v-if="clueOrganization.lastYearDevExpensesAmount"><span class="big">{{ clueOrganization.lastYearDevExpensesAmount }}</span>万元</p>
                <p v-else>暂无数据</p></el-col>
                <el-col :span="4"><p>单位人数</p>
                <div v-if="clueOrganization.unitEmployees"><el-tag class="tag_sty" size="mini">{{ clueOrganization.unitEmployees | filterEmployeesNum}}</el-tag></div>
                <div v-else><el-tag class="tag_sty" size="mini">暂无数据</el-tag></div>
                <p v-if="clueOrganization.unitEmployeesNum"><span class="big">{{ clueOrganization.unitEmployeesNum }}</span>人</p>
                <p v-else>暂无数据</p></el-col>
            </el-row>
            <div class="dea" style="margin-top:16px"><span class="analyze"></span><span>&nbsp;主营业务</span></div>
            <p v-if="clueOrganization.mainBusiness&&clueOrganization.mainBusiness!==''">{{ clueOrganization.mainBusiness}}</p><p v-else>暂无数据</p>
            <div class="dea" style="margin-top:30px"><span class="analyze"></span><span>&nbsp;下一步项目规划</span></div>
            <p v-if="clueOrganization.nextPlanning&&clueOrganization.nextPlanning!==''">{{ clueOrganization.nextPlanning}}</p><p v-else>暂无数据</p>
        </div>
    </template>

    <!-- 人员信息 -->
    <template v-if="clueType == 2">
        <span class="signing-spa">人员信息&nbsp; <i v-if="$route.query.listType =='personal'"  @click="openEditDialog('third')" class="el-icon-edit newcolor" /></span>
        <div class="bor"></div>
        <div class="signing-info" v-if="userData.clueCompanyStaff">
            <p><span class="ncolor">法 人：</span> {{ userData.clueCompanyStaff.legalName|noDate }}&nbsp;&nbsp;&nbsp; {{ userData.clueCompanyStaff.legalMobile ||'暂无数据'}}</p>
            <p><span class="ncolor">营销主管：</span>{{ userData.clueCompanyStaff.marketingName|noDate }} &nbsp;&nbsp;&nbsp;{{ userData.clueCompanyStaff.marketingMobile || '暂无数据' }}</p>
            <p><span class="ncolor">财务主管：</span> {{ userData.clueCompanyStaff.treasurerName|noDate }}&nbsp;&nbsp;&nbsp; {{ userData.clueCompanyStaff.treasurerMobile || '暂无数据'}}</p>
            <p><span class="ncolor">人事主管： </span>{{ userData.clueCompanyStaff.administrativeName|noDate }} &nbsp;&nbsp;&nbsp; {{ userData.clueCompanyStaff.administrativeMobile || '暂无数据'}}</p>
            <p><span class="ncolor">技术主管： </span>{{ userData.clueCompanyStaff.technicalName|noDate }} &nbsp;&nbsp;&nbsp; {{ userData.clueCompanyStaff.technicalMobile || '暂无数据'}}</p>
        </div>
    </template>
    <!-- 开票信息 -->
    <span class="signing-spa">开票信息</span>
    <div class="bor"></div>
    <div class="signing-info">
      <p><span class="ncolor">单位名称：</span>
          <template v-if="(clueInvoice.companyName&&clueInvoice.companyName!==null) ">
            {{clueInvoice.companyName}}
            </template>
          <template v-else>暂无数据</template>
      </p>
      <p><span class="ncolor">注册电话：</span>
          <template v-if="(clueInvoice.registerMobile&&clueInvoice.registerMobile!==null)">{{ clueInvoice.invoicePhone ||  clueInvoice.registerMobile}}</template>
          <template v-else>暂无数据</template>
      </p>
      <p><span class="ncolor">发票税号：</span>
         <template v-if="clueInvoice.organization">{{ clueInvoice.organization }}</template>
         <template v-else>暂无数据</template>
      </p>
      <p><span class="ncolor">开户银行： </span>
         <template v-if="clueInvoice.bankName">{{ clueInvoice.bankName }}</template>
         <template v-else>暂无数据</template>
      </p>
      <p><span class="ncolor">注册地址： </span>
         <template v-if="clueInvoice.registerAddress">{{ clueInvoice.registerAddress }}</template>
         <template v-else>暂无数据</template>
      </p>
      <p><span class="ncolor">银行账号： </span>
         <template v-if="clueInvoice.bankAccount">{{ clueInvoice.bankAccount}}</template>
         <template v-else>暂无数据</template>
      </p>
    </div>
    <!-- 线索编辑dialog -->
    <el-dialog title="编辑线索信息" :visible.sync="editClueDialog" width="760px" :close-on-click-modal="false">
      <edit-info ref="clue" v-if="editClueDialog" :currentYear="currentYear" :userInfo="userData" :businessInfo="clueOrganization" :createType="createType" :editClue="true" @close-clue="editClueDialog=false" @closeClueOperate="closeClueOperateDialog"></edit-info>
    </el-dialog>
    <!-- 注册信息dialog -->
    <el-dialog :visible.sync="registerDialog" :width="basicData.accountType == 1?'850px':'700px'">
      <register-info :dialog="true" :userData="userData" :type="listType" :source="true" :basicData="basicData" :innerInfo='innerInfo' :unitVO='unitVO' :showTitle="true"></register-info>
    </el-dialog>
    <!-- 分片上传 -->
    <multipart-upload ref="upload" :taskNo="taskNo" :taskId="taskId" :orderSpuName="orderSpuName" :userData='userData' @refresh='getInfo' :isPerson="listType == 'personal'?true:false"></multipart-upload>
    <!-- 预览知产证书弹窗 -->
    <preview-dialog ref="preview" @refresh='getInfo' :source="listType == 'personal'?0:1"></preview-dialog>
    <!-- 预览营业执照弹窗 -->
    <preview-license ref="previewPdf"></preview-license>
  </div>
</template>

<script>
import { getClueRegister, getTtClueCompanyUnit } from "@/api/clue/clue"
import { filterArea,filterIndustry, filterUnitType, filterLastYearSale, filterEmployeesNum} from "@/util/new-client/filter"
import { getCustomerInfo ,getCustomerPersonInfo ,upDataSaveLicense } from "@/api/task/index.js"
import EditInfo from './edit-info.vue';
import * as CodeMsg from "@/api/common/CodeChange"
import RegisterInfo from './register-info.vue';
import multipartUpload from "@/components/task/upload/multipart-upload";
import previewDialog from "@/components/task/preview/preview-dialog";
import previewLicense from "@/components/task/preview/preview-license"
import { mapGetters } from "vuex"
import { upload } from "@/components/task/upload/ossUtil"
export default {
  components:{
     EditInfo,
     RegisterInfo,
     multipartUpload,
     previewDialog,
     previewLicense
  },

  props:{
    taskId:{
      type:Number,
      required:true
    },
    clueId:{
      type: Number,
      default: null
    },
     orderSpuName: {
      type: String,
      required: true
    },
    userId:{
      // type:Number,
      required:true
    },
    clueType:{
      type: Number,
      default: null
    },
    listType:{//personal-我的 
      type: String,
      default: null
    },
    taskNo:{
      type: String,
      default: null
    },
  },
  computed: {
    fileUrl(){
      if(this.userData&&this.userData.tmCustomerResource){
        return this.userData.tmCustomerResource.fileUrl
      }
      return false
    },
  fileType() {
    if (this.userData && this.userData.tmCustomerResource){
      let arr = this.userData.tmCustomerResource.fileUrl.split('.');
      let fileType = arr[arr.length-1];
      return fileType;
    }
    return false;
  },
      ...mapGetters(['permissions']),
    uploadPermission(){
      let personalStatus = this.permissions.bt_save_my_intellectual_property && this.listType == 'personal'
      let listStatus = this.permissions.bt_save_intellectual_property && this.listType != 'personal'
      return (personalStatus || listStatus)
    }
  },
  data() {
    return {
        accept:".pdf, .png, .jpeg, .jpg , .tif",
        delBtnState:true,
        fileList: [],
        pdfFileInfo: null,
        templateForm: {},
        templateStatus: false,
        upLoadState:false,
        userData:{

        },
        clueOrganization:{},  // 单位数据
        clueInvoice:{},   // 开票信息
        editClueDialog:false,
        registerDialog:false,
        basicData:{},
        innerInfo:{},
        unitVO:{},
        cluePropertyInfo: {},
        yearsList: [],//近三年
        currentYear: new Date().getFullYear()-1,
    };
  },
  filters: {
    createType(val){
      return val == 0 ? '用户转化' : val == 1 ? '手动创建' : '不详';
    },
     valiData(val){
      return val == null? '不详' : val
    },
    noDate(val){
      return val == null? '暂无数据' :val == ''?'暂无数据':val
    },
    registerFilter(val){
      return val == 0?"已注册个人":val == 1?"已注册单位":""
    },
    otherFilter(val){
      return val == 0?"已认证个人":val == 1?"已认证单位":""
    },
     filterLastYearSale(val){
      return filterLastYearSale(val)
    },
     filterArea(val){
      return filterArea(val)
    },
      filterIndustry(val){
      return filterIndustry(val)
    },
      filterUnitType(val){
      return filterUnitType(val)
    },
      filterEmployeesNum(val){
      return filterEmployeesNum(val)
    },
  },
  mounted(){
    this.getInfo();
    let year = new Date().getFullYear();
    this.yearsList.push(
      { year: parseInt(year-1), name:'-'+parseInt(year-1)+'年度' },
      { year: parseInt(year-2), name:'-'+parseInt(year-2)+'年度' },
      { year: parseInt(year-3), name:'-'+parseInt(year-3)+'年度'},
    )
  },
  methods: {
    filterTaskAuthority() {
      if (this.listType == "personal") {
        return this.permissions.bt_save_my_license;
      } else {
        return this.permissions.bt_save_license;
      }
    },
    handlePreview(licenseInfo) {
      this.$nextTick(()=>{
        this.$refs.previewPdf.openVisble = true;
        this.$refs.previewPdf.licenseInfo = licenseInfo
      })
      // 处理预览操作
      // ...
    },
    // 打开上传弹窗
    openDialog(fileType){
      this.$nextTick(()=>{
        this.$refs.upload.openVisble = true
        this.$refs.upload.fileType = fileType
      })
    },
    // 预览弹窗
    viewDialog(fileList){
     this.$nextTick(()=>{
        this.$refs.preview.openVisble = true
        this.$refs.preview.currentIndex = 0
        this.$refs.preview.fileList = fileList
      })
    },
    // 更新
    upDataStateFun(){
      this.$refs["uploadcertificate"].$refs["upload-inner"].handleClick()
    },
    // 取消更新
    cancelUpdate(){
      this.getInfo()
      this.upLoadState = false;
    },
    // 确定更新
    definiteUpdate(){
     if(this.pdfFileInfo){
      this.upLoadState = false;
      let data = {
        fileName:  this.templateForm.name,
        sourceNo: this.taskNo,
        clueType: this.clueType,
        clueId: this.clueId,
        fileUrl: this.pdfFileInfo.url,
        sourceName: this.orderSpuName,
        sourceNo: this.taskNo,
        fileSize: this.filterFileSize(this.templateForm.size)
      };
      upDataSaveLicense(data,this.listType=="personal").then(res   => {
        this.upLoadState = false;
        this.getInfo()
      });
     }

    },
    filterFileSize(size) {
      let unit;
      if (size > 1024 * 1024) {
        // 文件大小大于1M
        size = size / (1024 * 1024);
        unit = "M";
      } else {
        // 文件大小小于等于1M
        size = size / 1024;
        unit = "KB";
      }

      return size.toFixed(2) + unit;
    },
    async  handleChange(file, fileList) {
      const acceptedFileTypes = this.accept.replace(/\s+/g, "").split(",").map(item => item.replace(/^\./, ""));
      const fileType =  file.name.split('.').pop().toLowerCase();
        if (acceptedFileTypes.includes(fileType)) {
          if (file) {
          this.templateForm = file
          upload(file).then(res=>{
            this.pdfFileInfo = res;
            this.upLoadState = true;
            if (!this.userData.tmCustomerResource) {
              this.userData.tmCustomerResource = {}
            }
            this.userData.tmCustomerResource.fileUrl = res.url
          })
          }else{
            this.upLoadState = false;
          }
        } else {
          this.$message({
            message: '该文件的类型不是PDF、TIF、png、jpg、jpeg',
            type: "warning",
          });
        }
    },
    getInfo(){
      let params={
        id:this.taskId,
        clueId:this.clueId,
        listType:this.listType,
      }
      if(this.clueType ==1){
        getCustomerPersonInfo(params).then(res=>{
          let data = res.data.data
          this.userData = data
          this.userData.clueType = this.clueType
          if(data.clueOrganization){
            this.clueOrganization = data.clueOrganization
          }
          if(data.cluePersonInvoice){
            this.clueInvoice = data.cluePersonInvoice
          }
        })
      }else{
        getCustomerInfo(params).then(res=>{
          let data = res.data.data
          this.userData = data
          this.userData.clueType = this.clueType
          if(data.clueCompanyInvoice){
            this.clueInvoice = data.clueCompanyInvoice
          };
          if(data.clueCompanyUnit){
            this.cluePropertyInfo = data.clueCompanyUnit;
          }
          this.getClueOrganization();
        })
      }
    },
    /* 获取单位线索的财务及人员情况 */
    getClueOrganization(){
      getTtClueCompanyUnit({clueId: this.clueId, year: this.currentYear, listType: this.listType}).then(result=>{
        if(result.data.code == CodeMsg.CODE_0){
          this.clueOrganization = result.data.data || {};
        }
      })
    },
    openEditDialog(val){
      this.createType = Number(this.userData.createType)
      this.editClueDialog = true
      this.$nextTick(()=>{
        if(this.$refs.clue){
        this.$refs.clue.activeName = val
        }
      })
    },
    openRegisterDialog(index,ctype){
      if(this.listType !='personal'){
        return
      }
      // type 0 个人
      getClueRegister(this.userData.id,index,0).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.basicData = res.data.data
          if (this.basicData.userVO !== null) {
            this.innerInfo = this.basicData.userVO;
            if (this.basicData.userVO.unitVO !== null) {
              this.unitVO = this.basicData.userVO.unitVO;
            }
          }
        }
      })
      this.registerDialog = true
    },
    closeClueOperateDialog(){
      this.editClueDialog = false
      this.getInfo()
    },
  },
};
</script>

<style scoped>
.preview-contain{
  width: 50px;
  height: 50px;
  cursor: pointer;
}
.preview-contain img{
  width: 50px ;
  height: 50px;
  cursor: pointer;
}
.pt{
  padding-top: 8.5px;
}
.ncolor{
  color: #333333;
}
.title {
  margin: 0 0 20px 10px;
  color: #333333;
}
.transform {
  margin-left: 45px;
}
.company {
  margin: 20px 0 0 10px;
}
.signing {
  font-size: 14px;
  margin-top: 5px;
  color: #666666;
}
.signing >>> .el-dialog__body{
    padding: 5px 20px;
}
.upload-demo >>> .el-upload-list{
    display: none;
}
.signing-spa {
  display: inline-block;
  color: #2c3e50;
  font-weight: bold;
  padding-left: 6px;
  border-left: #3e84df 3px solid;
  margin-top: 6.5px;
}
.signing-info {
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: repeat(2, 1fr);
  margin: 4px 0 0 10px;
  font-size: 14px;
}
.empName {
  color: #666666b5 !important;
}
.dea {
  display: flex;
  align-items: center;
  color: #2c3e50;
  font-weight: 550;
  font-size: 14px;
}
.analyze {
  display: inline-block;
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
  background-color: black;
}
.bor {
  width: 100%;
  height: 1px;
  background-color: #ddd;
  margin-top: 10px;
}
.newcolor{
    color: #409EFF;
    cursor: pointer;
}
.fly{
    display: flex;
}
.dialogtitle{
    color: black;
    text-align: left;
    padding-left: 5px;
    border-left: #3e84df 3px solid;
    margin-bottom: 12px;
}
.alread_register{
  width: 72px;
  padding: 2px 5px;
  border-radius: 5px;
  color: #ffffff;
  background: #409EFF;
  font-size: 12px;
  position: relative;
  left: 6px;
  text-align: center;
}
.span_left_sty{
  margin-left: 15px;
  position: relative;
}
.big{
    font-size: 24px;
    color: #333333;
}
.tag_sty{
  width: 90px;
  font-size: 14px !important;
  text-align: center;
}
.cur{
    cursor: pointer;
}
.upLoad_pdf_sty{
  display: flex;
  align-items: center;
}
.upLoad_pdf_sty span:nth-child(2){
  margin-left: 10px;
}
.upLoad_pdf_sty span:nth-child(3) ,.upLoad_pdf_sty span:nth-child(4){
  margin-left: 10px;
  color: #409EFF;
  cursor: pointer;
  user-select: none;
  -moz-user-select: none; /* Firefox 兼容性 */
  -webkit-user-select: none; /* Safari 和 Chrome 兼容性 */
  -ms-user-select: none; /* IE 兼容性 */
}
.pointer-sty{
  cursor: pointer;
  color: #409EFF;
}
.left-sty{
  margin-left: 20px;
}
.normal-sty{
  color: #333333 !important;
}
.year-select{
  margin-left: 10px;
  width: 100px !important;
}
</style>
