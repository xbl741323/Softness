<template>
<!-- 排查完成 -->
  <div class="new_clue_info">
    <div class="first_create_sty">
      <div>
        <span>创建方式：{{ userData.isAutoConversion | createType }}</span>
        <span v-if="(userData.isAutoConversion&&userData.userNo)">（{{userData.userNo}}）</span>
      </div>
      <span>创建时间：{{ userData.createTime }}</span>
    </div>
    <!-- 基本信息 -->
    <div class="new_left_span">
      <span></span>
      <span>基本信息</span>
      <i class="el-icon-edit pointer_sty" v-if="type == 0 && myType == 0" @click="openEditDialog('first')"></i>
    </div>
    <!-- 单位客户 -->
    <div class="basic_info_contain_parent_column" v-if="userData.clueType == '1'">
      <div class="basic_info_contain_column">
       <div class="basic_info_item"><span>单位类型：</span><span class="content_color_sty">{{ userData.orgType|filterUnitType }}</span></div>
       <div class="basic_info_item"><span>行业类型：</span><span class="content_color_sty">{{ userData.industry|filterIndustry }}</span></div>
       <div class="basic_info_item"><span>详细地址：</span><span class="content_color_sty">{{ userData.detailAddress|noDate }}</span></div>
       <div class="basic_info_item"><span>所在地区：</span><span class="content_color_sty">{{ userData.orgAddress|filterArea }}</span></div>
       <div :class="['basic_info_item',userData.tmCustomerResource?'bt-center-sty':'']">
        <span>营业执照：</span>
        <img v-if="userData.tmCustomerResource" @click="viewLicenseDialog(userData.tmCustomerResource)" class="license-sty" :src="require('@/assets/images/new-client/license.png')" alt="">
        <span v-if="!userData.tmCustomerResource" class="no_font-sty content_color_sty patent_top_sty">暂无数据</span>
       </div>
      </div>
      <div class="basic_info_contain_column">
      <div class="basic_info_item center-start-sty" v-for="(item,index) in userData.clueCompanyContactList" :key="index">
        <div class="center-start-sty">
          <span>联&nbsp;&nbsp;系&nbsp;&nbsp;人{{index+1}}：</span>
          <span class="content_color_sty">{{ item.contactName|noDate }}</span>
          <span class="span_left_sty content_color_sty">{{ item.jobName|noDate }}</span>
        </div>
        <div class="span_left_sty content_color_sty center-sty">
          <span class="content_color_sty" v-if="type == 0">{{item.mobile|noDate}}</span>
          <span class="content_color_sty" v-if="type == 1">{{item.mobile|noDate}}</span>
          <span v-if="(item.authorizedLabel == 1||item.authorizedLabel == 2)">
            <el-tooltip class="item" effect="dark" :content="item.authorizedLabel == 2?'高级授权':'初级授权'" placement="right">
              <img class="certify_img_sty" :src="item.authorizedLabel == 2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
            </el-tooltip>
          </span>
          <span class="alread_register pointer_sty" v-if="(!source&&(userData.certifiedType&&userData.certifiedType!=0)&&item.authorizedLabel == 0&&customerType == 'clue')" @click="(permissions.bt_initiate_authentication || $route.query.isPerson == 'personal') ? sendAuthorization(item) : $notAuthorized()">发起授权</span>
        </div>
      </div>
      </div>
    </div>
    <!-- 个人客户 -->
    <div class="basic_info_contain_parent" v-else>
      <div class="basic_info_contain">
      <div class="basic_info_item center-start-sty">
        <span>联&nbsp;&nbsp;系&nbsp;&nbsp;人：</span>
        <span class="content_color_sty">{{ userData.contactName }}</span>
        <span class="span_left_sty content_color_sty" v-if="Number(userData.sex)!=0">{{ userData.sex|sexFilter }}</span>
        <span class="span_left_sty content_color_sty" v-if="Number(userData.jobName)!=0">{{ userData.jobName }}</span>
        <span class="span_left_sty content_color_sty center-sty">
          <span class="content_color_sty">{{ userData.mobile }}</span>
          <el-tooltip v-if="userData.certifiedLabel" effect="dark" :content="userData.certifiedLabel==2?'高级认证':'初级认证'" placement="right">
            <img class="certify_img_sty" :src="userData.certifiedLabel == 2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
          </el-tooltip>
        </span>
      </div>
      <div class="basic_info_item"><span>所在地区：</span><span class="content_color_sty">{{ userData.orgAddress|filterArea }}</span></div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item"><span>身份证号：</span><span class="content_color_sty">{{ userData.idCard|noDate }}</span></div>
      <div class="basic_info_item"><span>行业类型：</span><span class="content_color_sty">{{ userData.industry|filterIndustry }}</span></div>
      </div>
      <div class="basic_info_contain">
        <div class="basic_info_item"><span>单位类型：</span><span class="content_color_sty">{{ userData.orgType|filterUnitType }}</span></div>
        <div class="basic_info_item"><span>详细地址：</span><span class="content_color_sty">{{ userData.detailAddress|noDate }}</span></div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>单位名称：</span>
        <span>
          <span v-if="userData.companyName" class="content_color_sty">{{ userData.companyName }}</span>
					<span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
      </div>
      </div>
    </div>
    <!-- 基本信息 -->
    <div v-if="userData.clueType == '1'">
    <div class="new_left_span">
      <span></span>
      <span>单位数据</span>
      <i class="el-icon-edit pointer_sty" v-if="type == 0 && myType == 0" @click="openEditDialog('second')"></i>
    </div>
    <!-- 数据未加处理 -->
    <div class="org_contain">
      <div class="org_title"><span></span><span>知产情况</span></div>
      <div class="org_list_main">
        <div class="org_list_item">
          <span>发明专利</span>
          <div v-if="userData.clueCompanyUnit.inventionList&&userData.clueCompanyUnit.inventionList.length>0" class="patent_top_sty">
            <span>{{ userData.clueCompanyUnit.inventionList.length }}</span>
            <span class="span_font_sty">件</span>
            <span @click="viewDialog(userData.clueCompanyUnit.inventionList)" class="left-sty">查看证书</span>
          </div>
          <div v-else class="no_font-sty content_color_sty patent_top_sty">暂无数据</div>
        </div>
        <div class="org_list_item">
          <span>实用新型专利</span>
          <div v-if="userData.clueCompanyUnit.practicalList&&userData.clueCompanyUnit.practicalList.length>0" class="patent_top_sty">
            <span>{{ userData.clueCompanyUnit.practicalList.length }}</span>
            <span class="span_font_sty">件</span>
            <span @click="viewDialog(userData.clueCompanyUnit.practicalList)" class="left-sty">查看证书</span>
          </div>
          <div v-else class="no_font-sty content_color_sty patent_top_sty">暂无数据</div>
        </div>
        <div class="org_list_item">
          <span>外观专利</span>
          <div v-if="userData.clueCompanyUnit.appearanceList&&userData.clueCompanyUnit.appearanceList.length>0" class="patent_top_sty">
            <span>{{ userData.clueCompanyUnit.appearanceList.length }}</span>
            <span class="span_font_sty">件</span>
            <span @click="viewDialog(userData.clueCompanyUnit.appearanceList)" class="left-sty">查看证书</span>
          </div>
          <div v-else class="no_font-sty content_color_sty patent_top_sty">暂无数据</div>
          </div>
        <div class="org_list_item">
          <span>商标</span>
          <div v-if="userData.clueCompanyUnit.trademarkList&&userData.clueCompanyUnit.trademarkList.length>0" class="patent_top_sty">
            <span>{{ userData.clueCompanyUnit.trademarkList.length }}</span>
            <span class="span_font_sty">件</span>
            <span @click="viewDialog(userData.clueCompanyUnit.trademarkList)" class="left-sty">查看证书</span>
          </div>
          <div v-else class="no_font-sty content_color_sty patent_top_sty">暂无数据</div>
          </div>
        <div class="org_list_item">
          <span>版权</span>
          <div v-if="userData.clueCompanyUnit.copyrightList&&userData.clueCompanyUnit.copyrightList.length>0" class="patent_top_sty">
            <span>{{ userData.clueCompanyUnit.copyrightList.length }}</span>
            <span class="span_font_sty">件</span>
            <span @click="viewDialog(userData.clueCompanyUnit.copyrightList)" class="left-sty">查看证书</span>
          </div>
          <div v-else class="no_font-sty content_color_sty patent_top_sty">暂无数据</div>
          </div>
        <div class="org_list_item">
          <span>其他知产</span>
          <div v-if="userData.clueCompanyUnit.otherList&&userData.clueCompanyUnit.otherList.length>0" class="patent_top_sty">
            <span>{{ userData.clueCompanyUnit.otherList.length }}</span>
            <span class="span_font_sty">件</span>
            <span @click="viewDialog(userData.clueCompanyUnit.otherList)" class="left-sty">查看证书</span>
          </div>
          <div v-else class="no_font-sty content_color_sty patent_top_sty">暂无数据</div>
          </div>
      </div>
    </div>
    <div class="org_contain">
      <div class="org_title">
        <span></span>
        <span>财务及人员情况</span>
        <el-select class="left-year-sty" @change="changeYear()" v-model="currentYearIndex" placeholder="请选择">
         <el-option v-for="item in yearList" :key="item.valueIndex" :label="item.label" :value="item.valueIndex"></el-option>
        </el-select>
      </div>
      <div class="org_list_main">
        <div class="org_list_item">
          <span>上年度销售总额</span>
          <el-tag size="mini" class="tag_sty" v-if="financeInfo&&financeInfo.lastYearSale!==null">{{ financeInfo.lastYearSale|filterLastYearSale }}</el-tag>
          <el-tag size="mini" class="tag_sty content_color_sty" v-else>暂无数据</el-tag>
          <div v-if="financeInfo&&financeInfo.lastYearSaleAmount!==null">
            <span>{{ financeInfo.lastYearSaleAmount }}</span>
            <span class="span_font_sty">万</span>
          </div>
          <div v-else class="no_font-sty content_color_sty">暂无数据</div>
        </div>
        <div class="org_list_item">
          <span>上年度资产总计</span>
          <el-tag size="mini" class="tag_sty" v-if="financeInfo&&financeInfo.lastYearAssets!==null">{{ financeInfo.lastYearAssets|filterLastYearSale }}</el-tag>
          <el-tag size="mini" class="tag_sty content_color_sty" v-else>暂无数据</el-tag>
          <div v-if="financeInfo&&financeInfo.lastYearAssetsAmount!==null">
            <span>{{ financeInfo.lastYearAssetsAmount }}</span>
            <span class="span_font_sty">万</span>
          </div>
          <div v-else class="no_font-sty content_color_sty">暂无数据</div>
        </div>
        <div class="org_list_item">
          <span>上年度利润总额</span>
          <el-tag size="mini" class="tag_sty" v-if="financeInfo&&financeInfo.lastYearProfit!==null">{{ financeInfo.lastYearProfit|filterLastYearSale }}</el-tag>
          <el-tag size="mini" class="tag_sty content_color_sty" v-else>暂无数据</el-tag>
          <div v-if="financeInfo&&financeInfo.lastYearProfitAmount!==null">
            <span>{{ financeInfo.lastYearProfitAmount }}</span>
            <span class="span_font_sty">万</span>
          </div>
          <div v-else class="no_font-sty content_color_sty">暂无数据</div>
        </div>
        <div class="org_list_item">
          <span>上年度研发费用总额</span>
          <el-tag size="mini" class="tag_sty" v-if="financeInfo&&financeInfo.lastYearDevExpenses!==null">{{ financeInfo.lastYearDevExpenses|filterLastYearSale }}</el-tag>
          <el-tag size="mini" class="tag_sty content_color_sty" v-else>暂无数据</el-tag>
          <div v-if="financeInfo&&financeInfo.lastYearDevExpensesAmount!==null">
            <span>{{ financeInfo.lastYearDevExpensesAmount }}</span>
            <span class="span_font_sty">万</span>
          </div>
          <div v-else class="no_font-sty content_color_sty">暂无数据</div>
        </div>
        <div class="org_list_item">
          <span>单位人数</span>
          <el-tag size="mini" class="tag_sty" v-if="financeInfo&&financeInfo.unitEmployees!==null">{{ financeInfo.unitEmployees|filterEmployeesNum }}</el-tag>
          <el-tag size="mini" class="tag_sty content_color_sty" v-else>暂无数据</el-tag>
          <div v-if="financeInfo&&financeInfo.unitEmployeesNum!==null">
            <span>{{ financeInfo.unitEmployeesNum }}</span>
            <span class="span_font_sty">人</span>
          </div>
          <div v-else class="no_font-sty content_color_sty">暂无数据</div>
        </div>
        <div class="org_list_item"></div>
      </div>
    </div>
    <div class="org_contain">
      <div class="org_title"><span></span><span>主营业务</span></div>
      <div class="org_desc content_color_sty" v-if="financeInfo&&financeInfo.mainBusiness!==null&&financeInfo.mainBusiness!==''">{{ financeInfo.mainBusiness }}</div>
      <div v-else class="org_desc content_color_sty">暂无数据</div>
    </div>
    <div class="org_contain">
      <div class="org_title"><span></span><span>下一步项目规划</span></div>
      <div class="org_desc content_color_sty" v-if="financeInfo&&financeInfo.nextPlanning!==null&&financeInfo.nextPlanning!==''">{{ financeInfo.nextPlanning }}</div>
      <div v-else class="org_desc content_color_sty">暂无数据</div>
    </div>
    <!-- 基本信息 -->
    <div class="new_left_span">
      <span></span>
      <span>人员信息</span>
      <i class="el-icon-edit pointer_sty" v-if="type == 0 && myType == 0" @click="openEditDialog('third')"></i>
    </div>
    <div class="basic_info_contain_parent">
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;人：</span>
        <span class="content_color_sty">{{ userData.clueCompanyStaff.legalName|noDate }}</span>
        <span v-if="type ==0" class="phone_left_sty content_color_sty">{{ userData.clueCompanyStaff.legalMobile|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ userData.clueCompanyStaff.legalMobile|noDate }}</span>
      </div>
      <div class="basic_info_item">
        <span>营销主管：</span>
        <span class="content_color_sty">{{ userData.clueCompanyStaff.marketingName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ userData.clueCompanyStaff.marketingMobile|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ userData.clueCompanyStaff.marketingMobile|noDate }}</span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>财务主管：</span>
        <span class="content_color_sty">{{ userData.clueCompanyStaff.treasurerName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ userData.clueCompanyStaff.treasurerMobile|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ userData.clueCompanyStaff.treasurerMobile|noDate }}</span>
      </div>
      <div class="basic_info_item">
        <span>人事主管：</span>
        <span class="content_color_sty">{{ userData.clueCompanyStaff.administrativeName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ userData.clueCompanyStaff.administrativeMobile|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ userData.clueCompanyStaff.administrativeMobile|noDate }}</span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>技术主管：</span>
        <span class="content_color_sty">{{ userData.clueCompanyStaff.technicalName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ userData.clueCompanyStaff.technicalMobile|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ userData.clueCompanyStaff.technicalMobile|noDate }}</span>
      </div>
      </div>
    </div>
    </div>
    <!-- 基本信息 -->
    <div class="new_left_span">
      <span></span>
      <span>开票信息</span>
      <i class="el-icon-edit pointer_sty" v-if="type == 0 && myType == 0" @click="openEditDialog('fourth')"></i>
      <span v-if="userData.clueType == '0'" style="font-size:14px;">（仅录入个人客户的单位开票信息）</span>
    </div>
    <div class="basic_info_contain_parent">
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>单位名称：</span>
        <span v-if="userData.clueType =='1'">
          <span v-if="Number(userData.companyName)!==0" class="content_color_sty">{{ userData.companyName }}</span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
        <span v-else>
          <span v-if="userData.cluePersonInvoice&&Number(userData.cluePersonInvoice.companyName)!==0" class="content_color_sty">{{ userData.cluePersonInvoice.companyName }}</span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
      </div>
      <!-- 未加判断处理 -->
      <div class="basic_info_item">
        <span>注册电话：</span>
        <span v-if="userData.clueType =='1'">
          <span v-if="userData.clueCompanyInvoice&&Number(userData.clueCompanyInvoice.registerMobile)!==0" class="content_color_sty">{{ userData.clueCompanyInvoice.registerMobile }}</span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
         <span v-else>
          <span v-if="userData.cluePersonInvoice&&Number(userData.cluePersonInvoice.registerMobile)!==0" class="content_color_sty">{{ userData.cluePersonInvoice.registerMobile }}</span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>发票税号：</span>
        <span v-if="userData.clueType =='1'">
          <span v-if="Number(userData.organization)!==0" class="content_color_sty">{{ userData.organization }}</span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
        <span v-else>
          <span v-if="userData.cluePersonInvoice&&Number(userData.cluePersonInvoice.organization)!==0" class="content_color_sty">{{ userData.cluePersonInvoice.organization }}</span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
      </div>
      <div class="basic_info_item">
        <span>开户银行：</span>
        <span v-if="userData.clueType =='1'">
          <span v-if="userData.clueCompanyInvoice&&Number(userData.clueCompanyInvoice.bankName)!==0" class="content_color_sty">{{ userData.clueCompanyInvoice.bankName }}</span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
        <span v-else>
          <span v-if="userData.cluePersonInvoice&&Number(userData.cluePersonInvoice.bankName)!==0" class="content_color_sty">{{ userData.cluePersonInvoice.bankName }}</span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>注册地址：</span>
        <span v-if="userData.clueType =='1'">
          <span v-if="userData.clueCompanyInvoice&&Number(userData.clueCompanyInvoice.registerAddress)!==0" class="content_color_sty">{{ userData.clueCompanyInvoice.registerAddress }}</span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
        <span v-else>
          <span v-if="userData.cluePersonInvoice&&Number(userData.cluePersonInvoice.registerAddress)!==0" class="content_color_sty">{{ userData.cluePersonInvoice.registerAddress }}</span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
      </div>
      <div class="basic_info_item">
        <span>银行账号：</span>
        <span v-if="userData.clueType =='1'">
          <span v-if="userData.clueCompanyInvoice&&Number(userData.clueCompanyInvoice.bankAccount)!==0" class="content_color_sty">{{ userData.clueCompanyInvoice.bankAccount }}</span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
         <span v-else>
          <span v-if="userData.cluePersonInvoice&&Number(userData.cluePersonInvoice.bankAccount)!==0" class="content_color_sty">{{ userData.cluePersonInvoice.bankAccount }}</span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
      </div>
      </div>
    </div>
    <!-- 线索编辑dialog -->
    <el-dialog :visible.sync="editClueDialog" title="编辑线索" width="690px" :close-on-click-modal="false" top="5vh">
      <operate-clue v-if="editClueDialog" ref="clue" :userInfo="userData" :financeInfo='financeInfo' @close-clue="editClueDialog=false" :createType="Number(!userData.isUserConversion)" :editClue="true" @closeClueOperate="closeClueOperateDialog"></operate-clue>
    </el-dialog>
     <!-- 预览知产证书弹窗 -->
    <preview-dialog ref="preview" :source="2"></preview-dialog>
    <!-- 预览营业执照弹窗 -->
    <preview-license ref="license"></preview-license>
  </div>
</template>

<script>
import operateClue from "@/components/new-client/common/operate-clue"
import { filterArea, filterIndustry, filterUnitType, filterLastYearSale, filterEmployeesNum } from "@/util/new-client/filter"
import { getOrganizationByClueId, getTtClueCompanyUnit } from "@/api/new-client/my-clue"
import previewDialog from "@/components/task/preview/preview-dialog";
import previewLicense from "@/components/new-client/common/preview/preview-license"
import { mapGetters } from 'vuex';
import * as CodeMsg from "@/api/common/CodeChange"
export default {
  components:{
    operateClue,
    previewDialog,
    previewLicense
  },
  props:['userData','type','source','myType','customerType','clueId','clueType'],
  data() {
    return {
      financeInfo: null, // 财务及人员信息
      baseUrl: process.env.BASE_URL,
      editClueDialog:false,
      currentYearIndex: 0,
      yearList: [ 
        {
          label:'',
          value:null,
          valueIndex: 0
        },
        {
          label:'',
          value:null,
          valueIndex: 1
        },
        {
          label:'',
          value:null,
          valueIndex: 2
        }
      ]
    };
  },
  filters:{
    sexFilter(val) {
      return val == 1 ? "男" : val == 2 ? "女" : "暂无数据";
    },
    createType(val){
      return val == true? "用户转化" : val == false? "手动创建" : "不详";
    },
    noDate(val){
      return val == null? '暂无数据' :val == ''?'暂无数据':val
    },
    filterUnitType(val){
      return filterUnitType(val)
    },
    filterIndustry(val){
      return filterIndustry(val)
    },
    filterLastYearSale(val){
      return filterLastYearSale(val)
    },
    filterEmployeesNum(val){
      return filterEmployeesNum(val)
    },
    filterArea(val){ 
      return filterArea(val)
    },
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted(){
   this.setYearList()
   this.getTtClueCompanyInfo()
  },
  methods:{
    setYearList(){
      this.yearList.forEach((item,index)=>{
       let value = this.$moment().subtract(index+1, 'year').format('YYYY')
       item.label = `-${value}年度`
       item.value = value
     })
    },
    changeYear(){
      this.getTtClueCompanyInfo()
    },
    // 获取财务与人员信息-单位线索才有
    getTtClueCompanyInfo(){
      if(this.userData.clueType == 1 || this.clueType == 1){
        let params = {
         clueId: this.clueId,
         year: this.yearList[this.currentYearIndex].value
      }
      getTtClueCompanyUnit(params,this.type).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.financeInfo = res.data.data
        }
      })
      }
    },
    // 预览知产证书弹窗
    viewDialog(fileList){
     this.$nextTick(()=>{
        this.$refs.preview.openVisble = true
        this.$refs.preview.currentIndex = 0
        this.$refs.preview.fileList = fileList
      })
    },
    // 预览营业执照弹窗
    viewLicenseDialog(licenseInfo){
     this.$nextTick(()=>{
        this.$refs.license.openVisble = true
        this.$refs.license.licenseInfo = licenseInfo
      })
    },
    // 发起授权
    sendAuthorization(item){      
      // 校验手机号格式
      if(item.legalMobileFlag){
        if(this.$route.query.type == 0) return this.toAccredit(this.userData.organization,item); 
        // 线索客户中的信用代码获取非加密数据
        if(this.$route.query.type == 1) return getOrganizationByClueId(this.$route.query.id).then(res=>{
          if(res.data.code==0){
            let organization = res.data.data
            this.toAccredit(organization,item);        
          } else {
            this.$offsetMessage.warning('获取信用代码出错，请联系管理员！');
          }
        })
      }else{
        this.$message({
          type:'warning',
          message:'手机号码不合规，请修改后再试！',
          offset: 300
        })
      }
    },
    toAccredit(val,item){
      this.$router.push({
        path:'/launch-accredit',
        query:{
          id: this.$route.query.id,
          chooseId: item.id,
          clueType: 1,//1-单位 0-个人
          organization: val
        }
      })
    },
    openEditDialog(val){
      if(this.permissions.bt_edit_clue_my){
       this.editClueDialog = true
       this.$nextTick(()=>{
       if(this.$refs.clue){
         this.$refs.clue.activeName = val
         this.$refs.clue.currentYear = this.yearList[this.currentYearIndex].label
        }
      })
      }else{
        this.$notAuthorized()
      }
    },
    closeClueOperateDialog(){
      this.editClueDialog = false
      this.$emit('refresh')
    }
  }
};
</script>

<style scoped>
.new_clue_info {
  padding: 10px 0 50px 0;
}
.new_left_span {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 20px 0 25px 0px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E4E7ED;
}
.new_left_span > span:nth-of-type(1) {
  display: inline-block;
  width: 5px;
  height: 20px;
  background: #108ee9;
}
.new_left_span > span:nth-of-type(2) {
  display: flex;
  width: 65px;
  height: 20px;
  margin-right: 5px;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: #2c3e50;
  font-weight: bold;
}
.first_create_sty{
  font-size: 14px;
  display: flex;
}
.first_create_sty>div:nth-of-type(1){
  margin-right: 50px;
}
.basic_info_contain{
  display: flex;
  margin-bottom: 30px;
}
.basic_info_contain_column:nth-of-type(1){
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  flex: 1;
}
.basic_info_contain_column:nth-of-type(2){
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  flex: 1.5;
}
.basic_info_contain_column .basic_info_item{
  margin-top: 20px;
}
.basic_info_contain_column>.basic_info_item:nth-of-type(1){
  margin-top: 0px;
}
.basic_info_item{
  position: relative;
}
.basic_info_contain_column>.basic_info_item>span{
  flex:1;
  font-size: 14px;
}
.basic_info_contain>.basic_info_item:nth-of-type(1){
  flex:1;
  font-size: 14px;
}
.basic_info_contain>.basic_info_item:nth-of-type(2){
  flex:1.5;
  font-size: 14px;
}
.basic_info_contain_parent_column{
  display: flex;
}
.basic_info_contain_parent{
  margin: 20px 0 60px 0;
}
.org_contain{
  display: flex;
  margin-bottom: 30px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.org_title{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}
.org_title>span:nth-of-type(1){
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #000000;
  transform: rotate(-45deg);
  margin-left: 5px;
  margin-right: 5px;
}
.org_title>span:nth-of-type(2){
  font-weight: bold;
}
.org_desc{
  font-size: 14px;
  padding: 10px 150px 10px 5px;
}
.org_list_main{
  display: flex;
  width: 100%;
  padding: 10px 0 0 5px;
}
.org_list_item{
 flex: 1;
 display: flex;
 flex-direction: column;
 padding: 10px 0 0 5px;
 align-items: flex-start;
 font-size: 20px;
}
.org_list_item>span:nth-of-type(1){
  font-size: 14px;
  margin-right: 20%;
}
.org_list_item>span:nth-of-type(2){
  font-size: 20px;
}
.tag_sty{
  width: 90px;
  font-size: 14px !important;
  text-align: center;
  margin: 10px 0;
}
.span_font_sty{
  font-size: 16px;
  margin-left: 3px;
}
.pointer_sty{
  cursor: pointer;
}
.span_left_sty{
  margin-left: 15px;
  position: relative;
}
.alread_register{
  text-align: center;
  display: inline-block;
  padding: 1px 5px 2px 5px;
  border-radius: 5px;
  color: #ffffff !important;
  background: #409EFF;
  font-size: 12px;
  margin-left: 5px;
}
.no_font-sty{
  font-size: 14px;
}
.phone_left_sty{
  margin-left: 10px;
}
.content_color_sty{
  color: #666666;
}
.patent_top_sty{
  margin-top: 3px;
}
.center-start-sty{
  display: flex;
  justify-content: flex-start;
  font-size: 14px;
}
.center-sty{
  display: flex;
  align-items: center;
  justify-content: center;
}
.certify_img_sty{
  width: 20px;
  height: 20px;
  margin-left: 5px;
}
.left-sty{
  cursor: pointer;
  color: #409EFF;
  margin-left: 20px;
  font-size: 14px;
}
.license-sty{
  width: 80px;
  height: 60px;
  cursor: pointer;
}
.bt-center-sty{
  width: 150px !important;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.left-year-sty{
  margin-left: 10px;
}
</style>