<template>
  <div class="page">
    <div class="contracts">
      <div class="details">
        <!-- 快照信息 -->
        <div class="top-detail">
          <div class="processnumber">
            <img src="../../assets/images/process/liucheng_icon.png" style="width: 24px; height: 24px; position: relative; top: 5px" />
            <span style="margin-left: 8px; font-weight: 600">流程编号：{{ $route.query.taskNo }}</span>
            <el-button type="primary" size="small" class="ceshi" v-if="snapshotInformation.taskStatus == 1" @click="permissions.sys_invoice_audit || isPersonal ? openDialog() : $notAuthorized()">修改发票信息</el-button>
            <span class="zuofei" v-if="snapshotInformation.taskStatus == 6">已作废</span>
          </div>
          <table class="table" style="margin-bottom: 30px">
            <tr><th>流程状态</th><th>合计开票金额</th><th>费用类型</th><th>退款状态</th><th>发起人</th><th>发起时间</th></tr>
            <tr>
              <td>
                <span v-show="snapshotInformation.taskStatus == 0" class="circleBluec"></span>
                <span v-show="snapshotInformation.taskStatus == 1" class="successc"><b>✔</b></span>
                <span v-show="snapshotInformation.taskStatus == 2" class="circleRedc"></span>
                <span v-show="snapshotInformation.taskStatus == 6"><b class="err">X&nbsp;</b></span>
                <span>{{ snapshotInformation.taskStatus | filtertaskStatus }}</span>
              </td>
              <td>{{ snapshotInformation.invoiceAmount | filterPrice }}</td>
              <td>{{ snapshotInformation.amountType | filterAmount }}</td>
              <td> {{snapshotInformation.isRefund==2?'无退款':'有退款'}} <img v-if="snapshotInformation.isRefund==0"  class="circle"  src="@/assets/iconfonts/circle.svg" /></td>
              <td>
                <el-tooltip effect="dark" :content="'工号：' +snapshotInformation.taskCommitNo +'   部门：' + snapshotInformation.taskCommitDeptName" placement="right">
                  <span>{{ snapshotInformation.creatorName }}</span>
                </el-tooltip>
              </td>
              <td>{{ snapshotInformation.gmtCreate }}</td>
            </tr>
          </table>
        </div>
        <!-- 开票信息-->
        <div class="list-header"><p class="rectangle"></p><b class="text">开票信息</b></div>
        <!-- 个人抬头 -->
        <template v-if="snapshotInformation.headerType ==0">
            <div style="display:flex;margin-top:10px"><div class="one">票据类型</div><div class="one">发票抬头</div><div class="one">个人姓名</div><div class="one">开票备注</div></div>
            <div style="display:flex">
                <div class="two" :class="{'dbottom':!snapshotInformation.invoiceUrl}">{{ snapshotInformation.billType  | fiterbillType }}</div>
                <div class="two" :class="{'dbottom':!snapshotInformation.invoiceUrl}">个人</div>
                <div class="two" :class="{'dbottom':!snapshotInformation.invoiceUrl}">{{ snapshotInformation.corporateName? snapshotInformation.corporateName: snapshotInformation.personalName}}</div>
                <div class="two" :class="{'dbottom':!snapshotInformation.invoiceUrl}" v-if="snapshotInformation.remark && snapshotInformation.remark.length<=26">{{ snapshotInformation.remark }}</div>
                <div class="two" :class="{'dbottom':!snapshotInformation.invoiceUrl}" v-else-if="snapshotInformation.remark && snapshotInformation.remark.length>26">
                    <el-tooltip effect="dark" :content="snapshotInformation.remark" placement="right"><span>{{ snapshotInformation.remark.substring(0,26) }}...</span></el-tooltip>
                </div>
                <div class="two" :class="{'dbottom':!snapshotInformation.invoiceUrl}" v-else>{{ snapshotInformation.remark }}</div>
            </div>
           <div style="display:flex" v-if="snapshotInformation.invoiceUrl"><div class="one">发票代码</div><div class="one">发票号码</div><div class="one">发票文件</div><div class="one">快递信息</div></div>
           <div style="display:flex;margin-bottom:25px" v-if="snapshotInformation.invoiceUrl">
                <div class="two dbottom">{{ snapshotInformation.invoiceCode }}</div>
                <div class="two dbottom">{{ snapshotInformation.number }}</div>
                <div class="two dbottom"><a :href="fileUrl+snapshotInformation.invoiceUrl" target="_blank" class="filecol">{{ snapshotInformation.invoiceUrlName }}</a></div>
                <div class="two dbottom">{{ snapshotInformation.expressCompany }}&nbsp;&nbsp;{{snapshotInformation.expressNumber}}</div>
            </div>
        </template>
        <!-- 单位抬头 -->
        <template v-else>
            <div style="display:flex;margin-top:10px"><div class="one">票据类型</div><div class="one">单位名称</div><div class="one">发票税号</div><div class="one">注册地址</div></div>
            <div style="display:flex">
                <div class="two">{{ snapshotInformation.billType  | fiterbillType }}</div>
                <div class="two">{{ snapshotInformation.corporateName? snapshotInformation.corporateName: snapshotInformation.personalName}}</div>
                <div class="two">{{ snapshotInformation.invoiceTaxNo }}</div>
                <div class="two" v-if="snapshotInformation.invoiceAddress && snapshotInformation.invoiceAddress.length<=26">{{ snapshotInformation.invoiceAddress }}</div>
                <div class="two" v-else-if="snapshotInformation.invoiceAddress && snapshotInformation.invoiceAddress.length>26">
                    <el-tooltip effect="dark" :content="snapshotInformation.invoiceAddress" placement="right"><span>{{ snapshotInformation.invoiceAddress.substring(0,26) }}...</span></el-tooltip>
                </div>
                <div class="two" v-else>{{ snapshotInformation.invoiceAddress }}</div>
            </div>
            <div style="display:flex"><div class="one">注册电话</div><div class="one">开户银行</div><div class="one">银行账号</div><div class="one">开票备注</div></div>
            <div style="display:flex;">
                <div class="two" :class="{'dbottom':!snapshotInformation.invoiceUrl}">{{ snapshotInformation.invoicePhone }}</div>
                <div class="two" :class="{'dbottom':!snapshotInformation.invoiceUrl}">{{ snapshotInformation.invoiceBank }}</div>
                <div class="two" :class="{'dbottom':!snapshotInformation.invoiceUrl}">{{ snapshotInformation.invoiceNumber }}</div>
                <div class="two" :class="{'dbottom':!snapshotInformation.invoiceUrl}" v-if="snapshotInformation.remark && snapshotInformation.remark.length<=26">{{ snapshotInformation.remark }}</div>
                <div class="two" :class="{'dbottom':!snapshotInformation.invoiceUrl}" v-else-if="snapshotInformation.remark && snapshotInformation.remark.length>26">
                    <el-tooltip effect="dark" :content="snapshotInformation.remark" placement="right"><span>{{ snapshotInformation.remark.substring(0,26) }}...</span></el-tooltip>
                </div>
                <div class="two" :class="{'dbottom':!snapshotInformation.invoiceUrl}" v-else>{{ snapshotInformation.remark }}</div>
            </div>
            <div style="display:flex" v-if="snapshotInformation.invoiceUrl"><div class="one">发票代码</div><div class="one">发票号码</div><div class="one">发票文件</div><div class="one">快递信息</div> </div>
            <div style="display:flex;margin-bottom:25px" v-if="snapshotInformation.invoiceUrl">
                <div class="two dbottom">{{ snapshotInformation.invoiceCode }}</div>
                <div class="two dbottom">{{ snapshotInformation.number }}</div>
                <div class="two dbottom"><a :href="fileUrl+snapshotInformation.invoiceUrl" target="_blank" class="filecol">{{ snapshotInformation.invoiceUrlName }}</a></div>
                <div class="two dbottom">{{ snapshotInformation.expressCompany }}&nbsp;&nbsp;{{snapshotInformation.expressNumber}}</div>
            </div>
        </template>
        <!-- 客户信息 -->
        <div class="list-header"><p class="rectangle"></p><b class="text">客户信息</b> </div>
        <div v-if="kefuArray && kefuArray.length>0">
            <el-table :data="kefuArray" :header-cell-style="{ background: '#FAFAFA',color:'#000000D9' }" border style="margin-bottom: 30px">
                <el-table-column prop="clueNo" label="线索编号" width="180"></el-table-column>
                <el-table-column prop="clueType" label="线索类型">
                    <template slot-scope="scope">
                      <span>{{ scope.row.clueType | filterType }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="orgName" label="客户名称">
                     <template slot-scope="scope">
                      <span>{{ scope.row.orgName ?scope.row.orgName:snapshotInformation.corporateName? snapshotInformation.corporateName: snapshotInformation.personalName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="contactName" label="联系人"> </el-table-column>
                <el-table-column prop="contactMobilephone" label="联系方式">
                </el-table-column>
                <el-table-column prop="clueBelongName" label="线索归属">
                    <template slot-scope="scope">
                    <el-tooltip effect="dark" :content="'工号：' +scope.row.clueBelongNo +'   部门：' + scope.row.clueBelongDeptName" placement="right">
                        <span>{{ scope.row.clueBelongName }}</span>
                    </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="salesmanName" label="业务员">
                    <template slot-scope="scope">
                    <el-tooltip effect="dark" :content=" '工号：' +scope.row.salesmanNo + '   部门：' +scope.row.salesmanDeptName" placement="right">
                        <span>{{ scope.row.salesmanName }}</span>
                    </el-tooltip>
                    </template>
                </el-table-column>
           </el-table>
        </div>
        <!-- 订单信息 -->
        <div v-if="orderArray && orderArray.length>0">
          <div class="list-header"><p class="rectangle"></p><b class="text">订单信息</b></div>
          <el-table :data="orderArray" :header-cell-style="{ background: '#FAFAFA',color:'#000000D9' }" border style="margin-bottom: 30px">
            <el-table-column prop="orderNo" label="订单编号" width="180"></el-table-column>
            <el-table-column prop="productName" label="产品名称" width="180"></el-table-column>
            <el-table-column prop="finishTime" label="交付时间"></el-table-column>
            <el-table-column prop="productCount" label="数量" ></el-table-column>
            <el-table-column prop="agencyFee" label="代理费总价">
              <template slot-scope="scope">
                <span>{{ scope.row.agencyFee | filterPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="thirdPartyFee" label="第三方费用总价">
              <template slot-scope="scope">
                <span>{{ scope.row.thirdPartyFee | filterPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="governmentFee" label="官费总价">
              <template slot-scope="scope">
                <span>{{ scope.row.governmentFee | filterPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="订单总价">
              <template slot-scope="scope">
                <span>{{ scope.row.totalAmount | filterPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="订单生成日期" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <!-- 回款信息 -->
        <div class="list-header"><p class="rectangle"></p><b class="text">回款信息</b></div>
        <div v-if="refundArray && refundArray.length>0" >
         <el-table :data="refundArray" :header-cell-style="{ background: '#FAFAFA',color:'#000000D9' }" border style="margin-bottom: 30px">
          <el-table-column prop="receiveNo" label="回款编号" width="180"></el-table-column>
          <el-table-column prop="contractNo" label="合同编号" width="180"></el-table-column>
          <el-table-column prop="receiveAmount" label="回款金额">
            <template slot-scope="scope">
              <span>{{ scope.row.receiveAmount | filterPrice }}</span>
            </template>
          </el-table-column>
           <el-table-column prop="refundAmount" label="退款金额">
            <template slot-scope="scope">
              <template v-if="!scope.row.refund_Status">
                  <span>无退款流程</span>
              </template>
              <!-- 待审核 -->
              <template v-else-if="scope.row.refund_Status==0">
                  <span class="cell-blue" @click="goRefundDetail(scope.row.refundTaskNo)">{{ scope.row.refundAmount | filterPrice }}</span>
                  <img  class="circle"  src="@/assets/iconfonts/circle.svg" />
              </template>
              <!-- 未通过和撤销 -->
               <template v-else-if="scope.row.refund_Status==2 ||  scope.row.refund_Status==5">
                  <span class="cell-blue" @click="goRefundDetail(scope.row.refundTaskNo)">{{ scope.row.refund_Status | filterrefundStatus}}</span>
              </template>
              <!-- 已通过 -->
               <template v-else-if="scope.row.refund_Status==1">
                  <span class="cell-blue" @click="goRefundDetail(scope.row.refundTaskNo)">{{ scope.row.refundAmount | filterPrice }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="payerName" label="付款方名称"></el-table-column>
          <el-table-column prop="amountType" label="费用类型">
            <template slot-scope="scope">
              <span>{{ scope.row.amountType |filterAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="receiveDirectionName" label="回款去向"></el-table-column>
          <el-table-column prop="claimName" label="认领人">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="'工号：' +scope.row.claimNo +'   部门：' +scope.row.claimDeptName" placement="right">
                <span>{{ scope.row.claimName }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="receiveTime" label="回款时间" show-overflow-tooltip></el-table-column>
         </el-table>
        </div>
        <!-- 审核记录 -->
        <div class="process-record" v-if="recordData.length > 0">
          <div class="list-header"><p class="rectangle"></p><b class="text">审核记录</b></div>
          <div class="record-top">
            <el-timeline v-if="recordData.length > 0">
              <el-timeline-item v-for="(element, index) in recordData" :key="index" :color="index == 0 ? '#ff6600' : ''" placement="top" hide-timestamp>
                <p>{{ element.auditStatus | filterauditStatus }}</p>
                <el-tooltip v-if="element.operatorNo" effect="dark" :content="'工号：' +element.operatorNo +'  部门：' +element.operatorDept" placement="right">
                  <span> 操作人：{{ element.operatorName ? element.operatorName : "暂无"}}</span>
                </el-tooltip>
                <el-tooltip v-else effect="dark" content="暂无" placement="right">
                  <span>操作人：{{ element.operatorName ? element.operatorName : "暂无"}}</span>
                </el-tooltip>
                <p>{{ element.auditStatus | filterText }} {{ element.auditNote ? element.auditNote : "暂无" }}</p>
                <p>{{ element.gmtCreate }}</p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <!-- 开票审批 -->
        <div class="examine" v-if="snapshotInformation.taskStatus ==0">
          <div class="list-header"><p class="rectangle"></p><b class="text">开票审批</b></div>
          <div style="margin-left:15px;margin-top:15px" v-if="snapshotInformation.isRefund ==0">当前有退款流程进行中，暂时不可进行开票</div>
          <template v-if="snapshotInformation.isRefund !=0">
            <div style="display:flex;margin:10px 0 15px 14px">
                <span style="margin-left:-7px"><span style="color:#F56C6C">*</span>发票文件：</span>
                <template v-if="invoiceUrl">
                    <a :href="fileUrl+invoiceUrl" target="_blank" class="filecol">{{invoiceUrlName}}</a>
                    <span class="redcol" @click="handleDelete">删除</span>  
                </template>
                <el-upload
                    v-else
                :headers="headers"
                action="wtcrm/file/upload"
                accept=".pdf,.jpg,.png"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="handleSuccess">
                    <span class="des">点击上传</span>
                </el-upload>
            </div>
            <div class="tip">仅限pdf、jpg及png等图片格式的文件，大小不超过5M</div>
            <div class="warntip" v-show="shouWarning">请上传发票文件</div>
            <el-form ref="invoicingForm" :model="invoicingForm" label-width="100px" style="margin-left:-5px" >
                <el-form-item label="发票代码：">
                        <el-input class="inwidth" v-model="invoicingForm.invoiceCode" ></el-input>
                </el-form-item>
                    <el-form-item label="发票号码：">
                        <el-input class="inwidth" v-model="invoicingForm.number"></el-input>
                </el-form-item>
                    <el-form-item label="快递公司：">
                        <el-select  placeholder="请选择" class="inwidth"  v-model="invoicingForm.expressCompany">
                            <el-option v-for="element in selectArray" :key="element.id" :label="element.dropdownValue" :value="element.dropdownValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="快递单号：">
                        <el-input class="inwidth"  v-model="invoicingForm.expressNumber"></el-input>
                    </el-form-item>
            </el-form>
            <div class="examine-content">
                <p>审批意见：</p>
                <el-input type="textarea" placeholder="请输入内容" v-model="textarea" maxlength="100" show-word-limit clearable rows="4" />
                <div class="button">
                <el-button type="success" size="medium" v-preventReClick  @click="permissions.sys_invoice_audit || isPersonal ? handlePass() : $notAuthorized()">{{ $t("button.auditingPassed") }}</el-button>
                <el-button type="danger" size="medium" class="unpassed" v-preventReClick  @click="permissions.sys_invoice_audit || isPersonal ? handleUnpass() : $notAuthorized()" >{{ $t("button.auditingUnPassed") }}</el-button>
                </div>
            </div>
          </template>
        </div>
        <!-- 修改发票信息 -->
        <el-dialog title="修改发票信息" v-if="dialogVisible" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false" :before-close="handleClose">
            <span class="signing-spa">开票信息</span>
            <div class="bor"></div>
             <!-- 个人抬头 -->
            <template v-if="snapshotInformation.headerType ==0">
                <div class="mt"><span class="aa">开票金额</span><span class="bb">{{snapshotInformation.invoiceAmount | filterPrice}}</span><span class="cc">费用类型</span><span class="dd">{{ snapshotInformation.amountType | filterAmount }}</span></div>
                <div><span class="aa dbottom">票据类型</span><span class="bb dbottom">{{ snapshotInformation.billType  | fiterbillType }}</span><span class="cc dbottom">个人姓名</span><span class="dd dbottom"> {{ snapshotInformation.corporateName? snapshotInformation.corporateName: snapshotInformation.personalName}}</span></div>
            </template>
            <!-- 单位抬头 -->
            <template v-else>
                <div class="mt"><span class="aa">开票金额</span><span class="bb">{{snapshotInformation.invoiceAmount | filterPrice}}</span><span class="cc">费用类型</span><span class="dd">{{ snapshotInformation.amountType | filterAmount }}</span></div>
                <div><span class="aa">票据类型</span><span class="bb">{{ snapshotInformation.billType  | fiterbillType }}</span><span class="cc">注册电话</span><span class="dd">{{ snapshotInformation.invoicePhone }}</span></div>
                <div><span class="aa">单位名称</span><span class="bb">{{ snapshotInformation.corporateName? snapshotInformation.corporateName: snapshotInformation.personalName}}</span><span class="cc">开户银行</span><span class="dd">{{ snapshotInformation.invoiceBank || '未填写'}}</span></div>
                <div><span class="aa">发票税号</span><span class="bb">{{ snapshotInformation.invoiceTaxNo || '未填写' }}</span><span class="cc">银行账号</span><span class="dd">{{ snapshotInformation.invoiceNumber || '未填写' }}</span></div>
                <div style="display:flex"><span class="aa dbottom">注册地址</span><span class="bb dbottom">{{snapshotInformation.invoiceAddress || '未填写' }}</span><span class="cc dbottom">开票备注</span><span class="dd dbottom">{{snapshotInformation.remark || '未填写'}}</span></div>
            </template>
            <!-- 发票信息 -->
            <div style="margin-top:13px"></div>
            <span class="signing-spa">发票信息</span>
            <div class="bor"></div>
            <div class="mt">
                <div style="display:flex;margin:5px 0 15px 14px">
                <span style="margin-left:-7px"><span style="color:#F56C6C;">*</span>发票文件：</span>
                <template v-if="invoiceUrl">
                <a :href="fileUrl+invoiceUrl" target="_blank" class="filecol">{{invoiceUrlName}}</a>
                <span class="redcol" @click="handleDelete">删除</span>  
                </template>
                <el-upload
                v-else
                :headers="headers"
                action="wtcrm/file/upload"
                accept=".pdf,.jpg,.png"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="handleSuccess">
                <span class="des">点击上传</span>
                </el-upload>
                </div>
                <div class="tip">仅限pdf、jpg及png等图片格式的文件，大小不超过5M</div>
                <div class="warntip" v-show="shouWarning">请上传发票文件</div>
                <el-form :model="invoicingForm" ref="invoicingForm" :rules="rules" label-width="100px" style="margin-left:-5px" >
                    <el-form-item label="发票代码：">
                       <el-input class="inwidth" v-model="invoicingForm.invoiceCode" @input="updata"></el-input>
                    </el-form-item>
                    <el-form-item label="发票号码：">
                       <el-input class="inwidth" v-model="invoicingForm.number" @input="updata"></el-input>
                    </el-form-item>
                    <el-form-item label="快递公司：">
                        <el-select  placeholder="请选择" class="inwidth"  v-model="invoicingForm.expressCompany" @input="updata">
                            <el-option v-for="element in selectArray" :key="element.id" :label="element.dropdownValue" :value="element.dropdownValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="快递单号：">
                        <el-input class="inwidth"  v-model="invoicingForm.expressNumber" @input="updata"></el-input>
                    </el-form-item>
                    <el-form-item label="修改原因：" prop="reason">
                        <el-input type="textarea" placeholder="请输入内容" v-model="invoicingForm.reason"  @input="updata" maxlength="100" show-word-limit clearable rows="3" />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" v-preventReClick  @click="handleEdit('invoicingForm')">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange"
import { getpersoninvoicingdDetail,getCompany,audit,auditFail,editInvoicing } from "@/api/processmanage/invoicing";
import store from "@/store";
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      snapshotInformation: {},  
      kefuArray: [],          
      orderArray: [],
      refundArray: [],      
      recordData: [],
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      fileUrl: null,           // 前缀
      invoiceUrl:null,        // 发票文件
      invoiceUrlName:null,
      shouWarning:false,
      invoicingForm:{
          invoiceCode:null,
          number:null,
          expressCompany:null,
          expressNumber:null,
          reason:null
      },
      textarea: "",
      dialogVisible: false,
      isPersonal: this.$route.query.source == 'personal',
      rules:{
          reason: [{ required: true, message: '请输入修改原因', trigger: 'blur' },]
      },
      selectArray:[]
    };
  },
  filters: {
    filtertaskStatus(val) {
      if (val == "0") {
        return "待审核"
      } else if (val == "1") {
        return "已通过"
      } else if (val == "2") {
        return "未通过"
      } else if(val== '6') {
        return "已作废"
      }
    },
   filterPrice(val) {
      if (val) {
        return (val / 100).toFixed(2)
      } else {
        return "待定"
      }
    },
    filterAmount(val) {
      if (val == "0") {
        return "代理费"
      } else if (val == "1") {
        return "第三方费用"
      } else if (val == "2") {
        return "官费"
      }
    },
     filterauditStatus(val) {
      if (val == "0") {
        return "提交审核"
      } else if (val == "1") {
        return "审核通过"
      } else if (val == "2") {
        return "审核不通过"
      } else if(val == '6'){
        return "已作废"
      }else if(val =='7'){
        return '修改发票'
      }
    },
     filterText(val) {
      if (val == "0") {
        return "备注："
      } else if (val == "1") {
        return "审核意见："
      } else if (val == "2") {
        return "审核意见："
      } else if(val == '6'){
        return "作废原因："
      }else if(val =='7'){
        return '修改发票信息，修改原因：'
      }
    },
    fiterbillType(val){
        if(val==0){
            return '增值税专用发票'
        }else if(val==1){
            return '增值税普通发票'
        }else{
            return '政府收据'
        }
    },
    filterType(val) {
      if (val == 0) {
        return "个人"
      } else {
        return "单位"
      }
    },
    filterrefundStatus(val){
       if(val==2){
           return '未通过'
       }else if(val==5){
           return  '已撤销'
       }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  mounted() {
    if (process.env.NODE_ENV === "production") {
        this.fileUrl = "//static.wotao.com/"
    } else {
        this.fileUrl = "//static-tst.wotao.com/"
    }  
    this.getDetail()
    this.getSelect()
  },
  methods: {
    getDetail() {
      getpersoninvoicingdDetail(this.$route.query.taskNo).then((res) => {
            let data = res.data.data
            this.snapshotInformation = data.Invoice
            if(data.Invoice.order){
                // 业务员
                data.clue.salesmanName = data.Invoice.order.salesmanName;
                data.clue.salesmanNo = data.Invoice.order.salesmanNo;
                data.clue.salesmanDeptName = data.Invoice.order.salesmanDeptName;
                // 归属人
                data.clue.clueBelongName = data.Invoice.order.clueBelongName;
                data.clue.clueBelongNo = data.Invoice.order.clueBelongNo;
                data.clue.clueBelongDeptName = data.Invoice.order.clueBelongDeptName;
            }else {
                data.clue.salesmanName = data.clue.salesmanEmpName;
                data.clue.salesmanNo = data.clue.salesmanEmpNo;
                data.clue.salesmanDeptName = data.clue.salesmanDeptName;
                // data.clue.clueBelongName = data.clue.customerBelongEmpName;
                // data.clue.clueBelongNo = data.clue.customerBelongEmpNo;
                // data.clue.clueBelongDeptName = data.clue.customerBelongDeptName;
                data.clue.clueBelongName = data.clue.customerEmpName || data.clue.customerBelongEmpName
                data.clue.clueBelongNo = data.clue.customerEmpNo || data.clue.customerBelongEmpNo
                data.clue.clueBelongDeptName = data.clue.customerDeptName|| data.clue.customerBelongDeptName
            }
            this.kefuArray = [data.clue]
            if(data.Invoice.order){
              this.orderArray = [data.Invoice.order] 
            }
            this.refundArray = data.Invoice.receiveList
            this.recordData = data.Invoice.invoiceProcessList
      });
    },
    updata(){
        this.$forceUpdate()
    },
    getSelect(){
       getCompany().then(res=>{
           this.selectArray = res.data.data
       })
    },
    beforeUpload(file) {
     let filename = file.name.substring(file.name.lastIndexOf('.')+1)
     let fileType = ['pdf','jpg','png']
     const extension = fileType.includes(filename)
     const isLt2M = file.size / 1024 / 1024 < 5
     if(!extension) {
         this.$message({
             message: '上传文件只能是 pdf、jpg及png等图片格式的文件!',
             type: 'warning'
         });
     }
     if(!isLt2M) {
         this.$message({
             message: '上传文件大小不能超过 5MB!',
             type: 'warning'
         });
     }
     return extension  && isLt2M
   },
    handleSuccess(res,file){
       this.invoiceUrl = res.data 
       this.invoiceUrlName = file.name
    },
    handleDelete(){
        this.invoiceUrl = null
        this.invoiceUrlName = null
    },
    goRefundDetail(taskNo) {
        this.$router.push({
            path: "/refund-detail",
            query: { taskNo}
        });
    },
    //审核通过
    handlePass() {
       if(!this.invoiceUrl){
            this.shouWarning = true
            return
        }
      let param = {
        taskNo: this.$route.query.taskNo,
        taskCurrentEmpId: this.snapshotInformation.taskCurrentEmpId,
        invoiceUrl:this.invoiceUrl,        
        invoiceUrlName:this.invoiceUrlName,
        invoiceCode:this.invoicingForm.invoiceCode,
        number:this.invoicingForm.number,
        expressCompany:this.invoicingForm.expressCompany,
        expressNumber:this.invoicingForm.expressNumber,
        auditNote: this.textarea
      }
      audit(param).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "审核通过!"
          });
          this.getDetail()
        } else if (res.data.code == CodeMsg.CODE_1) {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      });
    },
    // 审核不通过
    handleUnpass() {
      let param = {
        taskNo: this.$route.query.taskNo,
        taskCurrentEmpId: this.snapshotInformation.taskCurrentEmpId,
        invoiceUrl:this.invoiceUrl,        
        invoiceUrlName:this.invoiceUrlName,
        invoiceCode:this.invoicingForm.invoiceCode,
        number:this.invoicingForm.number,
        expressCompany:this.invoicingForm.expressCompany,
        expressNumber:this.invoicingForm.expressNumber,
        auditNote: this.textarea
      }
      this.$confirm("审核不通过,流程将驳回到流程发起人", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
      }).then(() => {
        auditFail(param).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "审核不通过!",
            });
            this.getDetail();
          }
        });
      });
    },
    openDialog(){
       this.invoicingForm ={}
       this.dialogVisible = true
       this.invoiceUrl = this.snapshotInformation.invoiceUrl
       this.invoiceUrlName = this.snapshotInformation.invoiceUrlName
       this.invoicingForm.invoiceCode = this.snapshotInformation.invoiceCode
       this.invoicingForm.number = this.snapshotInformation.number
       this.invoicingForm.expressCompany = this.snapshotInformation.expressCompany
       this.invoicingForm.expressNumber = this.snapshotInformation.expressNumber
    },
    // 修改发票信息
    handleEdit(formName){
        if(!this.invoiceUrl){
            this.shouWarning = true
            return
        }
         this.$refs[formName].validate((valid) => {
          if (valid) {
               let param = {
                taskNo: this.$route.query.taskNo,
                taskCurrentEmpId: this.snapshotInformation.taskCurrentEmpId,
                invoiceUrl:this.invoiceUrl,        
                invoiceUrlName:this.invoiceUrlName,
                invoiceCode:this.invoicingForm.invoiceCode,
                number:this.invoicingForm.number,
                expressCompany:this.invoicingForm.expressCompany,
                expressNumber:this.invoicingForm.expressNumber,
                auditNote: this.invoicingForm.reason
              }
             editInvoicing(param).then(res=>{
                if (res.data.code == CodeMsg.CODE_0) {
                    this.$message({
                        type: "success",
                        message: "修改成功!"
                    });
                    this.dialogVisible = false
                    this.getDetail()
                } else if (res.data.code == CodeMsg.CODE_1) {
                    this.$message({
                        type: "error",
                        message: res.data.msg,
                    });
                    this.dialogVisible = false
                }
             })
          } else {
            return false
          }
        });
    },
    handleClose(){
        this.dialogVisible = false
        this.invoiceUrl = null
        this.invoiceUrlName = null
        this.invoicingForm = {}
    }
  },
};
</script>
<style scoped>
.one{
    flex: 1;
    height: 38px;
    background: rgb(250, 250, 250);
    text-align: center;
    line-height: 38px;
    color:#000000D9;
    font-size: 12px;
    border-top: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    border-bottom:1px solid #EBEEF5;
    font-weight: bold;
}
.one:nth-child(4n+4){
    border-right: 1px solid #EBEEF5;
}
.two{
    flex: 1;
    height: 38px;
    text-align: center;
    line-height: 38px;
    border-left: 1px solid #EBEEF5;
    color: #606266;
    font-size: 12px;
}
.two:nth-child(4n+4){
    border-right: 1px solid #EBEEF5;
}
.circle{
   position: relative;
   top:2px;
   margin-left:5px;
   width:14px
}
.zuofei{
    width: 69px;
    height: 21px;
    display: inline-block;
    background-color: rgba(255, 204, 153, 0.44);
    color: rgb(255, 102, 0);
    font-size: 11px;
    text-align: center;
    line-height: 21px;
    border-radius: 6px;
    border:1px solid rgb(255, 204, 153);
    position: relative;
    top: -4px;
    left: 15px;
}
.warntip{
    margin-top: -10px;
    margin-left:10px;
    color:red;
}
.tip{
    position: relative;
    top: -12px;
    left: 93px;
    color: #999999;
    font-size: 12px;
}
.circle{
   position: relative;
   top:2px;
   margin-left:5px;
   width:14px
}
.filecol{
    color: #0099ff;
    cursor: pointer;
    position: relative;
    top: 3px;
    margin-left: 11px;
}
.redcol{
    color: red;
    cursor: pointer;
    position: relative;
    top: 1.5px;
    margin-left: 18px;
}
.des{
    color: #0099ff;
    cursor: pointer;
    margin-left: 10.5px;
}
.inwidth{
    width: 320px;
}
.page {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 20px 100px 20px 30px;
}
.ccc {
  color: #d1d1d1 !important;
}
.bottom-detail .el-tabs--border-card {
  background: #fff;
  border: 0;
  border-top: 0.1px solid #dcdfe6;
  box-shadow: 0 0 0 #fff;
}
.cell-blue {
  color: #36a6fe;
  cursor: pointer;
}
.contracts {
  margin-bottom: 0;
  background: #f6f7fa;
}
.record-top {
  margin-top: 10px;
}
.circleBluec {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  background: #36a6fe;
  top: -2px;
  margin-right: 4px;
}
.circleRedc {
  width: 6px;
  height: 6px;
  position: relative;
  display: inline-block;
  border-radius: 50%;
  margin-right: 4px;
  top: -2px;
  background: red;
}
.successc {
  font-weight: bolder;
  font-size: 12px;
  color: green;
  margin-right: 4px;
}
.details {
  min-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
}
.table {
  margin-left: 20px;
  width: 100%;
}
.top-detail {
  background: #fff;
  padding-bottom: 15px;
}
.processnumber {
  font-weight: 300;
  margin-top: 10px;
  font-size: 20px;
  margin-left: -12px;
}
.top-detail tr {
  height: 30px;
  font-size: 14px;
  text-align: left;
}
.top-detail td {
  font-size: 14px;
  color: #333;
  width: 200px;
}
.top-detail th {
  padding-top: 25px;
}
.topBtn {
  padding: 25px;
}
.circle {
  position: relative;
  top: 2px;
  margin-left: 5px;
  width: 14px;
}
.delete {
  margin-left: 30px;
}
.cell-blue {
  display: inline-block;
  color: #36a6fe;
  cursor: pointer;
  max-width: 140px;
}
.tabottom {
  margin-bottom: 50px;
}
.bottom-detail {
  margin-top: 16px;
  background: #fff;
}
.list-header {
  display: flex;
  margin: 0 0;
}
.rectangle {
  width: 5px;
  height: 15px;
  background: #0aa1ed;
  border-radius: 3px;
  padding: 0;
}
.text {
  font-size: 14px;
  padding: 10px 10px;
  margin: 3px 0;
}
.process-record {
  background: #fff;
  margin-bottom: 30px;
}
.examine {
  margin-top: 16px;
  background: #fff;
  margin-bottom: 80px;
  font-size: 14px;
}
.examine-content {
  width: 100%;
  margin: 30px 0 0 15px;
  font-size: 14px;
}
.button {
  margin: 30px;
  text-align: center;
}
.unpassed {
  margin-left: 50px;
}
.showBottom {
  margin-bottom: 200px;
}
.achievecode:hover {
  background: #ffffff;
  color: #606266;
  border-color: #dcdfe6;
}
.ceshi {
  position: relative;
  left: 15px;
  top: -4px;
}
.aaa >>> .el-table th > .cell {
  text-align: center;
}

.aaa >>> .el-table .cell {
  text-align: center;
}
.record-top >>> .el-timeline-item__tail {
  position: absolute;
  left: 4px;
  height: 115%;
  border-left: 2px solid #e4e7ed;
}
.err{
    color: red;
    font-size: 16px;
    position: relative;
    top: 1px;
}
.signing-spa {
  display: inline-block;
  color: #2c3e50;
  font-weight: bold;
  padding-left: 6px;
  border-left: #3e84df 3px solid;
  margin-top: 6.5px;
}
.bor {
  width: 100%;
  height: 1px;
  background-color: #dddddd45;
  margin-top: 10px;
}
.mt{
   margin-top: 20px; 
}
.aa{
    display: inline-block;    
    width: calc(100%/6);
    height: 35px;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    background: #fafafa;
    text-align: center;
    line-height: 35px;
    border-top: 1px solid #dddddd4d;
    border-left: 1px solid #dddddd4d;
}
.bb{
    display: inline-block;    
    width: calc(100%/6*2);
    height: 35px;
    font-size: 13px;
    color: #333;
    text-align: center;
    line-height: 35px;
    border-top: 1px solid #dddddd4d;
    border-left: 1px solid #dddddd4d;
}
.cc{
    display: inline-block;    
    width: calc(100%/6);
    height: 35px;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    background: #fafafa;
    text-align: center;
    line-height: 35px;
    border-top: 1px solid #dddddd4d;
    border-left: 1px solid #dddddd4d;
}
.dd{
    display: inline-block;    
    width: calc(100%/6*2);
    height: 35px;
    font-size: 13px;
    color: #333;
    text-align: center;
    line-height: 35px;
    border-top: 1px solid #dddddd4d;
    border-left: 1px solid #dddddd4d;
    border-right: 1px solid #dddddd4d;
}
.dbottom{
   border-bottom: 1px solid #dddddd4d;
}
.dialog-footer{
    display: flex;
    justify-content: center;
}
</style>
