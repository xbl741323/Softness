<template>
  <div class="init-order-frame">
    <h3>发起订单</h3>
    <span class="subtitle">线索信息</span>
    <div class="info-list">
      <div v-for="item in clueInfo" :key="item.value">
        <p class="info-title">{{item.label }}</p>
        <p class="center-sty">
          <span>{{item.key | clueFilter(this_)}}</span>
          <el-tooltip effect="dark" :content="clueData.certifiedType == 2?'高级认证':'初级认证'" placement="right" v-if="(item.key == 'organization'&&clueData.certifiedType&&clueData.certifiedType!=0)">
            <img class="certify_img_sty" :src="clueData.certifiedType == 2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
          </el-tooltip>
          <span class="auth-tag" v-if="item.key == 'idCard' && clueData.idCard">已认证</span>  
        </p>
      </div>
    </div>

    <!-- 客户签约人 -->
    <p class="subtitle">客户签约人</p>
    <el-radio-group v-model="signing" v-if="clueType == 1">
      <el-radio v-for="( item, index) in clueData.clueCompanyContactList" :disabled="(item.isban||item.certifiedType==0||!item.certifiedType)" :key="item.mobile" :label="item.mobile" class="radio-block">
        <span>联系人{{index+1}}： {{item.contactName}} {{item.mobile}}</span>
        <el-tooltip effect="dark" :content="item.certifiedType == 2?'高级授权':'初级授权'" placement="right" v-if="item.certifiedType&&item.certifiedType!=0">
          <img class="certify_img_sty" :src="item.certifiedType == 2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
        </el-tooltip>
        <span v-if="item.isban" class="warning-text">仅合规手机号可用于签约，请去线索信息中修改</span>
        <span v-else-if="((!item.certifiedType||(item.certifiedType&&item.certifiedType==0)))" class="warning-text">仅已授权联系人可选，如需选择，请先去授权</span>
      </el-radio>
    </el-radio-group>
      <el-radio v-model="signing" :label="clueData.mobile" class="radio-block" v-if="clueType == 0" >
        <span>联系人：{{clueData.contactName}} {{clueData.mobile}}</span>
        <span class="tag">已授权</span>
      </el-radio>
    <p class="sign-prompt">如需修改签约人信息，请去线索信息中修改</p>

    <!-- 订单信息 -->
    <div class="order-head">
      <p class="subtitle">订单信息</p>
      <div>
        <el-button size="medium" type="primary" :disabled="orderInfo.length >= 20" @click="addOrder">添加订单</el-button>
      </div>
    </div>
    <el-table :data="orderInfo" border >
      <el-table-column label="产品名称" prop="spuTitle"></el-table-column>
      <el-table-column label="数量" prop="attrForm.spuNum"></el-table-column>
      <el-table-column label="代理费总价">
        <template slot-scope="{row}">
          <p>{{ row.attrForm.spuNum * row.unitAgency }}</p>
        </template>
      </el-table-column>
      <el-table-column label="第三方费用总价">
        <template slot-scope="{row}">
          <p>{{ row.attrForm.spuNum * row.unitThird }}</p>
        </template>
      </el-table-column>
      <el-table-column label="官费总价">
        <template slot-scope="{row}">
          <p>{{ row.attrForm.spuNum * row.unitOfficial }}</p>
        </template>
      </el-table-column>
      <el-table-column label="订单总价">
        <template slot-scope="{row}">
          <p>{{ row.attrForm.spuNum * row.skuInfo.skuAmount }}</p>
        </template>
      </el-table-column>
      <el-table-column label="支付方式">
        <template slot-scope="{row}">
          <p>{{ row.skuInfo.payTimesType | payTimesType }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row, $index}">
          <el-button type="text" @click="editOrder(row)">编 辑</el-button>
          <el-popconfirm @confirm="delOrder($index)" title="确定删除该条订单吗？">
          <el-button class="del-order-btn" slot="reference" type="text">删 除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="init-order">
      <el-button type="primary" v-preventReClick @click="confirmOrder(1)">发起订单</el-button>
      <el-button type="warning" v-preventReClick @click="confirmOrder(-2)">保存草稿</el-button>
      <el-button @click="cancel()">取消</el-button>
    </div>
    
    <!-- 添加订单 -->
    <el-dialog :visible.sync="orderDialog" :close-on-click-modal="false" top="10vh" width="50%">
      <add-product  v-if="orderDialog" @selectProduct="selectProduct" @closeDialog="closeDialog" :existOrder="orderInfo"></add-product>
    </el-dialog>

    <!-- 编辑订单 -->
    <el-dialog :visible.sync="editOrderDialog" title="补充订单信息" top="5vh" :close-on-click-modal="false" width="820px">
      <edit-init-order v-if="editOrderDialog" :productData='hasSelectedProducts' :operate="operate" :edit="edit" @lastStep="lastStep" @closeDialog="closeDialog" @orderList="getOrderList" @editOrder="getEidtOrder"></edit-init-order>
    </el-dialog>
    
    <!-- 取消 -->
    <el-dialog :visible.sync="cancelDialog" title="提醒" width="400px" :close-on-click-modal="false">
      <div>
        <p class="cancel-title">取消后订单信息不会被保存，请保存草稿</p>
        <div class="cancel-btn">
          <el-button type="primary" v-preventReClick @click="confirmOrder(-2)">保存草稿</el-button>
          <el-button @click="goBack()">仍然取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 审核 -->
    <el-dialog :visible.sync="auditDialog" :close-on-click-modal="false" title="提交审核">
      <p>订单发生了改价,需要先审核,请先选择审核人。审核通过后,方可发送给客户。</p>
      <el-form :model="auditForm" ref="auditForm" :rules="auditRules" label-width="110px">
        <el-form-item label="改价审核人：" prop="auditor">
          <el-select v-model="auditForm.auditor">
            <el-option v-for="item in auditorList" :key="item.userId" :value="item.userId" :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="改价备注：">
          <el-input type="textarea" :rows="3" maxlength="100" show-word-limit v-model="auditForm.remark" />
        </el-form-item>
      </el-form>
      <div class="btn-audit">
        <el-button size="mini" type="primary" v-preventReClick @click="confirmAudit()">提交审核</el-button>
        <el-button size="mini" @click="cancelAudit()">取消提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderData from "./order-data";
import { getClueDetail, getPersonalAuth, getOrgAuth } from "@/api/new-client/my-clue"
import AddProduct from "./add-product";
import EditInitOrder from './edit-initOrder.vue'
import { createOrder, needAudit, getAuditor } from "@/api/order/index";
export default {
  components:{
    AddProduct,
    EditInitOrder,
  },
  data(){
    return{
      this_: this,
      orderDialog: false,
      editOrderDialog: false,
      auditDialog: false,
      auditorList: [],
      param:{},
      auditForm: {},
      clueData: {},
      signing: '',
      orderInfo: [],
      hasSelectedProducts: [],
      unitAgency: 0,
      unitOfficial: 0,
      unitThird: 0,
      signName: '',
      list: [],
      edit: false,
      operate: true,
      cancelDialog: false,
      personalAuth: {},
      orgAuth: [],
      totalAmount: 0,
      orderStatus: 1, // 订单状态 1-待签约 -2-草稿
      orderChannel:'', // 下单渠道 1:卧涛平台; 2: 电商京东，3: 电商淘宝
      thirdOrderNo:'', // 第三方订单编号
      auditRules: {
        auditor: [{required: true, message:'请选择审核人',trigger:'change'}]
      }
    }
  },
  filters:{
    clueFilter(key, this_){
      if(this_.clueType == 1){
        return key == 'contactName' || key == 'mobile' ? (this_.clueData.clueCompanyContactList && this_.clueData.clueCompanyContactList[0][key]) : this_.clueData[key];
      }else{
        return key == 'companyName' ? this_.clueData['contactName'] : this_.clueData[key];
      };
    },
    payTimesType(val){
      if(val == 1){
        return '定金+尾款';
      }else{
        return '一口价';
      };
    },
  },
  computed:{
    clueInfo(){
      return orderData.clueInfo.filter(item=>{
        return item.show.includes(parseInt(this.clueType));
      })
    }
  },
  created(){
    this.clueType = this.$route.query.clueType;
    this.getDetail();
  },
  mounted(){},
  methods:{
    cancelAudit(){
      this.auditDialog = false;
      this.auditForm = {};
    },
    goBack(){
      history.go(-1);
    },
    cancel(){
      this.cancelDialog = true;
    },
    getEidtOrder(val){
      this.orderInfo.forEach( el => {
        if(el.spuId == val[0].spuId){
          el = val[0];
          this.$set(el,'unitAgency',0);
          this.$set(el,'unitOfficial',0);
          this.$set(el,'unitThird',0);
          let agencyFee = [];
          let thirdFee = [];
          let officialFee = [];
          let skuPayInfo = el.skuInfo.skuPayTypeList
          Object.keys(skuPayInfo).forEach(item =>{
            if(item.match(/Official/)){       // 官费
              officialFee.push(skuPayInfo[item]);
            }else if(item == 'finalTypePendingFee'){    //尾款待定
              this.finalFeePending = true;
            }else if(item.match(/Agency/)){
              agencyFee.push(skuPayInfo[item]);
            }else if(item.match(/ThirdParty/)){
              thirdFee.push(skuPayInfo[item])
            };
          })
          agencyFee.forEach( item => el.unitAgency += item);
          officialFee.forEach(item => el.unitOfficial += item);
          thirdFee.forEach( item => el.unitThird += item);
          el.skuInfo.skuAmount = el.unitAgency + el.unitOfficial + el.unitThird;
          this.$message({
            type:'success',
            message:'订单编辑成功！',
            offset: 300
          })
          this.editOrderDialog = false;
          this.edit = false;
          this.operate = true;
        };
      });
    },
    editOrder(val){
      this.hasSelectedProducts = [val];
      this.edit = true;
      this.operate = false;
      this.editOrderDialog = true;
    },
    delOrder(row,index){
      this.orderInfo.splice(index, 1)
    },
    handleClose(){
      history.go(-1);
    },
    confirmOrder(orderStatus){
      this.orderStatus = orderStatus;
      if(this.orderInfo.length == 0){
        this.$message({
          type:'warning',
          message:'请添加订单！',
          offset: 300
        })
      }else{
        this.param = {};
        let tmOrderVoList = [];
        this.orderInfo.forEach( (el, index) => {
          this.totalAmount += (el.skuInfo.skuAmount* el.attrForm.spuNum),
          tmOrderVoList.push({
            goodsSkuId: el.skuInfo.id,
            buyNum: el.attrForm.spuNum,
            orderPart:'PC',
            remark: el.attrForm.remark,
            tailStatus : el.skuInfo.payTimesType == 2 ? 3 : el.skuInfo.payTimesType == 1 ? (el.skuInfo.skuPayTypeList && el.skuInfo.skuPayTypeList.checkUndetermined ? 0 : 1) : null,
            payTypeVoList:[],
            totalAmount:el.skuInfo.skuAmount* el.attrForm.spuNum
          })
          if(el.skuInfo.payTimesType == 2){
            tmOrderVoList[index].payTypeVoList.push({
              payCostList:[
                {costAmount: el.skuInfo.skuPayTypeList.dueTypeAgencyFee || 0, costTypeId: 1},
                {costAmount: el.skuInfo.skuPayTypeList.dueTypeThirdPartyFee || 0, costTypeId: 2},
                {costAmount: el.skuInfo.skuPayTypeList.dueTypeOfficialFee || 0, costTypeId: 3},
              ],
              payTypeId:3,
              payTypeAmount: (el.skuInfo.skuPayTypeList.dueTypeAgencyFee || 0)+ (el.skuInfo.skuPayTypeList.dueTypeThirdPartyFee || 0) +(el.skuInfo.skuPayTypeList.dueTypeOfficialFee || 0)
            })
          };
          if(el.skuInfo.payTimesType == 1){
            tmOrderVoList[index].payTypeVoList.push({
                payCostList:[
                  {costAmount: el.skuInfo.skuPayTypeList.depositTypeAgencyFee || 0, costTypeId: 1},
                  {costAmount: el.skuInfo.skuPayTypeList.depositTypeThirdPartyFee || 0, costTypeId: 2},
                  {costAmount: el.skuInfo.skuPayTypeList.depositTypeOfficialFee || 0, costTypeId: 3},
                ],
                payTypeId: 1,
                payTypeAmount: (el.skuInfo.skuPayTypeList.depositTypeAgencyFee || 0) +(el.skuInfo.skuPayTypeList.depositTypeThirdPartyFee || 0) + (el.skuInfo.skuPayTypeList.depositTypeOfficialFee || 0)
              },
              Object.assign(!el.skuInfo.skuPayTypeList.checkUndetermined ? 
                {
                  payCostList:[
                    {costAmount: el.skuInfo.skuPayTypeList.finalTypeAgencyFee || 0, costTypeId: 1},
                    {costAmount: el.skuInfo.skuPayTypeList.finalTypeThirdPartyFee || 0, costTypeId: 2},
                  ],
                  payTypeId:2,
                  payTypeAmount: (el.skuInfo.skuPayTypeList.finalTypeAgencyFee || 0) + (el.skuInfo.skuPayTypeList.finalTypeThirdPartyFee || 0)
                } : {
                  payCostList:[
                    {costAmount: 0, costTypeId: 1},
                    {costAmount: 0, costTypeId: 2},
                    {costAmount: 0, costTypeId: 4},
                  ],
                  payTypeId:2,
                  payTypeAmount: 0
                }
              )
            )
          }
        })
        if(this.clueType == 1){
          this.clueData.clueCompanyContactList.forEach( sign => {
            if(sign.mobile == this.signing){
              this.signName = sign.contactName
            }
          });
        }else{
          this.signName = this.clueData.contactName
        };
        this.param = {
          orderStatus: this.orderStatus,
          clueType: this.clueType == 1 ? '2' : '1',
          clueId: this.clueType == 1 ? this.clueData.clueCompanyId : this.clueData.cluePersonId,
          signMobile: this.signing || this.clueData.mobile,
          signName: this.signName,
          tmOrderVoList: tmOrderVoList,
          totalAmount: this.totalAmount,
          orderPort: 'PC',
          orderSource: 2,
          orderChannel:this.orderChannel, // 下单渠道 1:卧涛平台; 2: 电商京东，3: 电商淘宝
          thirdOrderNo:this.thirdOrderNo // 第三方订单编号
        }
        if(this.orderChannel == 1){
          this.param.thirdOrderNo = ''
        }
        if(this.orderStatus == 1){
          needAudit(this.param).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              if(res.data.data){
                getAuditor().then(res=>{
                  if(res.data.code == CodeMsg.CODE_0){
                    this.auditorList = res.data.data;
                    this.auditDialog = true;
                  }
                })
              }else{
                this.confirmCreateOrder('发起订单成功!');
              }
            }
          })
        }else{
          this.confirmCreateOrder();
        }
      };
    },
    confirmCreateOrder(operateText){
      createOrder(this.param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message: this.orderStatus == 1 ? operateText : '保存草稿成功！请在我的订单-待生效订单中查看草稿',
            offset: 300
          })
          if(this.orderStatus == 1){
            let list =  res.data.data.tmOrderVoList;
            list.forEach( order => {
              this.orderInfo.forEach(el => {
                if(order.goodsSkuId == el.skuInfo.id){
                  this.$set(el,'orderId',order.id);//生成的待生效订单id
                  this.$set(el,'belongId',order.belongId);//生成的待生效订单id
                  this.$set(el,'orderStatus',order.orderStatus);//订单状态
                }
              });
            });
            this.$router.push("/personal/personal-order");
          }else{
            setTimeout(()=>{
              history.go(-1);
            },1000)
          };
        }
      })
    },
    confirmAudit(){
      this.$refs.auditForm.validate(valid =>{
        if(valid){
          this.auditorList.forEach(el => {
            if(this.auditForm.auditor == el.userId){
              this.param.orderStatus = this.orderStatus;
              this.param.handleBy = el.userId;
              this.param.handleByNo = el.number;
              this.param.handleByName = el.name;
              this.param.changePriceRemark = this.auditForm.remark;
            }
          });
          this.confirmCreateOrder('提交审核成功!');
        }
      })
    },
    sum(){
      let result=0;
      for(let i = 0;i < arguments.length; i++){
        if(arguments.length>1){
          result += Number(arguments[i] || 0);
        }
      }
      return result;
    },
    lastStep(val){
      this.editOrderDialog = val;
    },
    closeDialog(){
      this.orderDialog = false;
      this.editOrderDialog = false;
    },
    selectProduct(val,orderChannel,platformOrderNo){
      console.log(orderChannel,'orderChannel')
      console.log(platformOrderNo,'platformOrderNo')
      this.orderChannel = orderChannel
      this.thirdOrderNo = platformOrderNo
      this.edit = false;
      this.operate = true;
      this.hasSelectedProducts = val;
      this.editOrderDialog = true;
    },
    getOrderList(val){
      let list = [];
      list = val
      list.forEach( sku => {
        this.$set(sku,'unitAgency',0);
        this.$set(sku,'unitOfficial',0);
        this.$set(sku,'unitThird',0);
        let agencyFee = [];
        let thirdFee = [];
        let officialFee = [];
        let skuPayInfo = sku.skuInfo.skuPayTypeList
        Object.keys(skuPayInfo).forEach(item =>{
          if(item.match(/Official/)){       // 官费
            officialFee.push(skuPayInfo[item]);
          }else if(item == 'finalTypePendingFee'){    //尾款待定
            this.finalFeePending = true;
          }else if(item.match(/Agency/)){
            agencyFee.push(skuPayInfo[item]);
          }else if(item.match(/ThirdParty/)){
            thirdFee.push(skuPayInfo[item])
          };
        })
        agencyFee.forEach( item => sku.unitAgency += item);
        officialFee.forEach(item => sku.unitOfficial += item);
        thirdFee.forEach( item => sku.unitThird += item);
        sku.skuInfo.skuAmount = sku.unitAgency + sku.unitOfficial + sku.unitThird;
      });
      this.orderInfo.push(...val);
      this.orderDialog = false;
      this.editOrderDialog = false;
    },
    addOrder(){
      this.orderDialog = true;
    },
    // 获取线索详情数据
    getDetail(){
      let params = parseInt(this.clueType) ? { clueCompanyId: this.$route.query.id } : { cluePersonId: this.$route.query.id } 
      getClueDetail(params, this.clueType, true).then(res=>{
        if (res.data.code == CodeMsg.CODE_0) {
          this.clueData = res.data.data
          this.signing = this.clueType == 1 ? this.clueData.clueCompanyContactList[0].mobile : this.clueData.mobile
          if(this.clueType == 0){
            getPersonalAuth({mobile: this.clueData.mobile}).then(res=>{
              if(res.data.code == CodeMsg.CODE_0){
                if(res.data.data){
                  this.personalAuth = res.data.data;
                  this.signing = this.personalAuth.mobile;
                }
              };
            })
          }else{
            getOrgAuth({ organization: this.clueData.organization }).then(res=>{
              this.orgAuth = res.data.data;
              let pattern = /^1[3456789]\d{9}$/
              this.clueData.clueCompanyContactList.forEach( clueEl => {

                if(pattern.test(clueEl.mobile)){

                }else{
                  this.$set(clueEl,'isban',true);
                }
                this.orgAuth.forEach(orgEl => {
                  if(clueEl.mobile == orgEl.mobile){
                    this.$set(clueEl,'certifiedType', orgEl.authorizedType);
                  }
                });
              });
            })
          };
        }
      });
    },
  }
}
</script>

<style scoped>
.init-order-frame{
  padding: 20px;
  background: #ffffff;
}
.subtitle{
  padding-left: 10px;
  border-left: 5px solid #409eff;
}
.info-list{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
  font-size: 14px;
  border: 1px solid #EEEEEE;
  text-align: center;
  margin-top: 10px;
}
.info-title{
  background-color: #eeeeee;
  padding: 10px 0;
  margin-top: 0;
}
.radio-block{
  display: flex;
  align-items: center;
  padding: 10px 0;
}
.init-order{
  text-align: center;
  margin-top: 20px;
}
.order-head{
  display: grid;
  grid-template-columns: 90% 10%;
}
.del-order-btn{
  margin-left: 10px;
  color: red;
}
.cancel-btn{
  margin-top: 40px;
  text-align: center;
}
.cancel-title{
  margin-top: -20px;
  color: rgba(0, 0, 0, 0.801);
  font-size: 18px;
}
.code-sty{
  padding: 15px;
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  border-radius: 3px;
}
.link-title{
  font-size: 16px;
  font-weight: 550;
}
.link-copy{
  color: #36a6fe;
}
.wx-link{
  width: 300px;
  margin: 0 auto;
  font-size: 12px;
  color: #666666;
  text-align: center;
}
.tag{
  font-size: 12px;
  color: #FFFFFF;
  border-radius: 4px;
  padding: 3px 5px;
  background: #36a6fe;
  margin-left: 5px;
}
.warning-text{
  color: red;
  font-size: 14px;
  margin-left: 5px;
}
.sign-prompt{
  color: #f8ac1d;
  font-size: 14px;
}
.auth-tag{
  padding: 3px 5px;
  background: #36a6fe;
  font-size: 12px;
  border-radius: 5px;
  color: #FFFFFF;
  margin-left: 5px;
}
.wait-audit{
  color: #ec975d;
}
.btn-audit{
  text-align: center;
}
.low-sty{
  background: rgba(245, 154, 35, 1) !important;
}
.center-sty{
  display: flex;
  justify-content: center;
  align-items: center;
}
.certify_img_sty{
  width: 20px;
  height: 20px;
  margin-left: 5px;
}
</style>
<style>
.init-order-frame .el-radio__label{
  display: flex;
  align-items: center;
}
</style>