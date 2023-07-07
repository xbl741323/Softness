<template>
  <div>
    <div class="edit-order-frame">
      <div v-for="(item, index) in orderList" :key="item.id">
        <div class="spu-title">
          <h3>订单{{ index + 1 }}：{{ item.spuTitle }}</h3>
          <img src="@/assets/images/task/closeactive.png" v-if="operate && orderList.length > 1"
            @click="delProduct(item, index)" alt="del">
        </div>
        <el-form :model="item.attrForm" ref="attrForm" :rules="formRules" inline>
          <el-form-item label="产品数量：">
            <el-input-number :min="1" :max="99" v-model="item.attrForm.spuNum" />
          </el-form-item>
          <el-form-item label="规格属性：">
            <el-select v-model="item.attrForm.attribute" :disabled="!operate"
              @change="changeAttr(item, item.attrForm.attribute)">
              <el-option v-for="(item, index) in item.attrList" :key="index" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
          <p>支付方式及费用：</p>
          <template>
            <el-radio v-model="item.skuInfo.payTimesType" @change="getRadio(item.skuInfo)" :label="1">方式1：定金+尾款</el-radio>
            <div style="display: flex;">
              <p class="spa-title">定金 </p>
              <el-form-item style="display:flex;margin-right:20px;" :prop="index + 'depositTypeAgencyFee'"
                :rules="formRules.depositTypeAgencyFee">
                <el-checkbox label="代理费：" :disabled='item.skuInfo.payTimesType != 1'
                  v-model="item.skuInfo.skuPayTypeList.checkDepositAgent"
                  @change="reset(item.skuInfo.skuPayTypeList, 'depositTypeAgencyFee', 'checkDepositAgent', 0)"></el-checkbox>
                <el-input style="width:100px" :disabled="!item.skuInfo.skuPayTypeList.checkDepositAgent"
                  v-model.number="item.skuInfo.skuPayTypeList.depositTypeAgencyFee" />
              </el-form-item>
              <el-form-item style="display:flex;margin-right:20px;" :prop="index + 'depositTypeThirdPartyFee'"
                :rules="formRules.depositTypeThirdPartyFee">
                <el-checkbox label="第三方费用：" :disabled='item.skuInfo.payTimesType != 1'
                  v-model="item.skuInfo.skuPayTypeList.checkDepositThird"
                  @change="reset(item.skuInfo.skuPayTypeList, 'depositTypeThirdPartyFee', 'checkDepositThird', 0)"></el-checkbox>
                <el-input style="width:100px" :disabled="!item.skuInfo.skuPayTypeList.checkDepositThird"
                  v-model.number="item.skuInfo.skuPayTypeList.depositTypeThirdPartyFee" />
              </el-form-item>
              <el-form-item style="display:flex;margin-right:20px" :prop="index + 'depositTypeOfficialFee'"
                :rules="formRules.depositTypeOfficialFee">
                <el-checkbox label="官费：" :disabled='item.skuInfo.payTimesType != 1'
                  v-model="item.skuInfo.skuPayTypeList.checkDepositGovernment"
                  @change="reset(item.skuInfo.skuPayTypeList, 'depositTypeOfficialFee', 'checkDepositGovernment', 0)"></el-checkbox>
                <el-input style="width:100px" :disabled="!item.skuInfo.skuPayTypeList.checkDepositGovernment"
                  v-model.number="item.skuInfo.skuPayTypeList.depositTypeOfficialFee" />
              </el-form-item>
            </div>
            <div style="display: flex;">
              <p class="spa-title">尾款 </p>
              <el-form-item style="display:flex;margin-right:20px;" :prop="index + 'finalTypeAgencyFee'"
                :rules="formRules.finalTypeAgencyFee">
                <el-checkbox label="代理费：" :disabled='item.skuInfo.payTimesType != 1'
                  v-model="item.skuInfo.skuPayTypeList.checkFinalAgent"
                  @change="reset(item.skuInfo.skuPayTypeList, 'finalTypeAgencyFee', 'checkFinalAgent', 1)"></el-checkbox>
                <el-input style="width:100px" :disabled="!item.skuInfo.skuPayTypeList.checkFinalAgent"
                  v-model.number="item.skuInfo.skuPayTypeList.finalTypeAgencyFee" />
              </el-form-item>
              <el-form-item style="display:flex;margin-right:20px;" :prop="index + 'finalTypeThirdPartyFee'"
                :rules="formRules.finalTypeThirdPartyFee">
                <el-checkbox label="第三方费用：" :disabled='item.skuInfo.payTimesType != 1'
                  v-model="item.skuInfo.skuPayTypeList.checkFinalThird"
                  @change="reset(item.skuInfo.skuPayTypeList, 'finalTypeThirdPartyFee', 'checkFinalThird', 1)"></el-checkbox>
                <el-input style="width:100px" :disabled="!item.skuInfo.skuPayTypeList.checkFinalThird"
                  v-model.number="item.skuInfo.skuPayTypeList.finalTypeThirdPartyFee" />
              </el-form-item>
              <el-form-item style="display:flex;margin-right:20px">
                <el-checkbox label="尾款待定" :disabled='item.skuInfo.payTimesType != 1'
                  v-model="item.skuInfo.skuPayTypeList.checkUndetermined"
                  @change="resetFinal(item.skuInfo.skuPayTypeList, ['finalTypeThirdPartyFee', 'finalTypeAgencyFee', 'checkFinalThird', 'checkFinalAgent'])"></el-checkbox>
              </el-form-item>
            </div>
            <el-radio v-model="item.skuInfo.payTimesType" @change="getRadio(item.skuInfo)" :label="2">方式2：一口价</el-radio>
            <div style="display: flex;">
              <p class="spa-title">一口价 </p>
              <el-form-item style="display:flex;margin-right:20px;" :prop="index + 'dueTypeAgencyFee'"
                :rules="formRules.dueTypeAgencyFee">
                <el-checkbox label="代理费：" :disabled='item.skuInfo.payTimesType != 2'
                  v-model="item.skuInfo.skuPayTypeList.checkFixedAgent"
                  @change="reset(item.skuInfo.skuPayTypeList, 'dueTypeAgencyFee', 'checkFixedAgent', 2)"></el-checkbox>
                <el-input style="width:100px" :disabled="!item.skuInfo.skuPayTypeList.checkFixedAgent"
                  v-model.number="item.skuInfo.skuPayTypeList.dueTypeAgencyFee" />
              </el-form-item>
              <el-form-item style="display:flex;margin-right:20px;" :prop="index + 'dueTypeThirdPartyFee'"
                :rules="formRules.dueTypeThirdPartyFee">
                <el-checkbox label="第三方费用：" :disabled='item.skuInfo.payTimesType != 2'
                  v-model="item.skuInfo.skuPayTypeList.checkFixedThird"
                  @change="reset(item.skuInfo.skuPayTypeList, 'dueTypeThirdPartyFee', 'checkFixedThird', 2)"></el-checkbox>
                <el-input style="width:100px" :disabled="!item.skuInfo.skuPayTypeList.checkFixedThird"
                  v-model.number="item.skuInfo.skuPayTypeList.dueTypeThirdPartyFee" />
              </el-form-item>
              <el-form-item style="display:flex;margin-right:20px" :prop="index + 'dueTypeOfficialFee'"
                :rules="formRules.dueTypeOfficialFee">
                <el-checkbox label="官费：" :disabled='item.skuInfo.payTimesType != 2'
                  v-model="item.skuInfo.skuPayTypeList.checkFixedGovernment"
                  @change="reset(item.skuInfo.skuPayTypeList, 'dueTypeOfficialFee', 'checkFixedGovernment', 2)"></el-checkbox>
                <el-input style="width:100px" :disabled="!item.skuInfo.skuPayTypeList.checkFixedGovernment"
                  v-model.number="item.skuInfo.skuPayTypeList.dueTypeOfficialFee" />
              </el-form-item>
            </div>
          </template>
          <el-form-item label="订单备注：">
            <el-input class="remark" type="textarea" :rows="4" v-model="item.attrForm.remark" />
          </el-form-item>
          <el-form-item label="客户签约人:" v-if="!operate && !edit">
            <el-radio-group v-model="signing" v-if="productData[0].clueType == 2">
              <el-radio v-for="( item, index) in clueData.clueCompanyContactList"
                :disabled="(item.isban || item.certifiedType == 0 || !item.certifiedType)" :key="item.mobile"
                :label="item.mobile" class="radio-block">
                <span>联系人{{ index + 1 }}： {{ item.contactName }} {{ item.mobile }}</span>
                <el-tooltip effect="dark" :content="item.certifiedType == 2 ? '高级授权' : '初级授权'" placement="right"
                  v-if="item.certifiedType && item.certifiedType != 0">
                  <img class="certify_img_sty"
                    :src="item.certifiedType == 2 ? require('@/assets/images/new-client/certified_unit.png') : require('@/assets/images/new-client/certified_unit_low.png')"
                    alt="">
                </el-tooltip>
                <span v-if="item.isban" class="warning-text">仅合规手机号可用于签约，请去线索信息中修改</span>
                <span v-else-if="(!item.certifiedType || item.certifiedType == 0)"
                  class="warning-text">仅已授权联系人可选，如需选择，请先去授权</span>
              </el-radio>
            </el-radio-group>
            <el-radio v-model="signing" :label="clueData.mobile" class="radio-block" v-if="productData[0].clueType == 1">
              <span>联系人： {{ clueData.contactName }} {{ clueData.mobile }}</span>
              <span v-if="personalAuth.status == 2" class="tag">已授权</span>
            </el-radio>
            <p class="sign-prompt">如需修改签约人信息，请去线索信息中修改</p>
          </el-form-item>
        </el-form>
        <p class="sub-line"></p>
      </div>
    </div>
    <div class="order-edit-btn">
      <el-button @click="lastStep()" v-if="operate">上一步</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
      <el-button type="warning" @click="closeDialog">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { getTradeInfo } from '@/api/project/project'
import { getClueDetail, getPersonalAuth, getOrgAuth } from "@/api/new-client/my-clue"
import { updateOrder, getIneffectiveById } from "@/api/order/index";
import Vue from 'vue'
export default {
  props: {
    pathBool: {
      type: Boolean,
      require: false

    },
    productData: {
      type: Array,
      require: true
    },
    operate: { //能否能修改规格属性
      type: Boolean,
      required: true
    },
    edit: {//发起订单-编辑订单
      type: Boolean
    },
    orderId: {
      type: Number
    }
  },
  data() {
    var depositAgency = (rule, value, callback) => {
      let index = rule.field.match(/(\d)/)[1];
      let pattern = /^[1-9]\d*$/;
      if (this.orderList[index].skuInfo.skuPayTypeList.checkDepositAgent) {
        if (pattern.test(this.orderList[index].skuInfo.skuPayTypeList.depositTypeAgencyFee)) {
          callback();
        } else {
          callback(new Error('请填写正整数金额!'));
        };
      } else {
        callback()
      };
    };

    var depositThird = (rule, value, callback) => {
      let index = rule.field.match(/(\d)/)[1];
      let pattern = /^[1-9]\d*$/;
      if (this.orderList[index].skuInfo.skuPayTypeList.checkDepositThird) {
        if (pattern.test(this.orderList[index].skuInfo.skuPayTypeList.depositTypeThirdPartyFee)) {
          return callback();
        } else {
          return callback(new Error('请填写正整数金额'));
        };
      } else {
        callback();
      };
    };

    var depositOfficial = (rule, value, callback) => {
      let index = rule.field.match(/(\d)/)[1];
      let pattern = /^[1-9]\d*$/;
      if (this.orderList[index].skuInfo.skuPayTypeList.checkDepositGovernment) {
        if (pattern.test(this.orderList[index].skuInfo.skuPayTypeList.depositTypeOfficialFee)) {
          return callback();
        } else {
          return callback(new Error('请填写正整数金额'));
        };
      } else {
        callback();
      };
    };

    var finalAgency = (rule, value, callback) => {
      let index = rule.field.match(/(\d)/)[1];
      let pattern = /^[1-9]\d*$/;
      if (this.orderList[index].skuInfo.skuPayTypeList.checkFinalAgent) {
        if (pattern.test(this.orderList[index].skuInfo.skuPayTypeList.finalTypeAgencyFee)) {
          return callback();
        } else {
          return callback(new Error('请填写正整数金额'));
        };
      } else {
        callback();
      };
    };

    var finalThird = (rule, value, callback) => {
      let index = rule.field.match(/(\d)/)[1];
      let pattern = /^[1-9]\d*$/;
      if (this.orderList[index].skuInfo.skuPayTypeList.checkFinalThird) {
        if (pattern.test(this.orderList[index].skuInfo.skuPayTypeList.finalTypeThirdPartyFee)) {
          callback();
        } else {
          callback(new Error('请填写正整数金额'));
        };
      } else {
        callback();
      };
    };

    var fixedAgency = (rule, value, callback) => {
      let index = rule.field.match(/(\d)/)[1];
      let pattern = /^[1-9]\d*$/;
      if (this.orderList[index].skuInfo.payTimesType == 2 && this.orderList[index].skuInfo.skuPayTypeList.checkFixedAgent) {
        if (pattern.test(this.orderList[index].skuInfo.skuPayTypeList.dueTypeAgencyFee)) {
          callback();
        } else {
          callback(new Error('请填写正整数金额'));
        };
      } else {
        callback();
      };
    };

    var fixedThird = (rule, value, callback) => {
      let index = rule.field.match(/(\d)/)[1];
      let pattern = /^[1-9]\d*$/;
      if (this.orderList[index].skuInfo.payTimesType == 2 && this.orderList[index].skuInfo.skuPayTypeList.checkFixedThird) {
        if (pattern.test(this.orderList[index].skuInfo.skuPayTypeList.dueTypeThirdPartyFee)) {
          callback();
        } else {
          callback(new Error('请填写正整数金额'));
        };
      } else {
        callback();
      };
    };

    var fixedOfficial = (rule, value, callback) => {
      let index = rule.field.match(/(\d)/)[1];
      let pattern = /^[1-9]\d*$/;
      if (this.orderList[index].skuInfo.payTimesType == 2 && this.orderList[index].skuInfo.skuPayTypeList.checkFixedGovernment) {
        if (pattern.test(this.orderList[index].skuInfo.skuPayTypeList.dueTypeOfficialFee)) {
          callback();
        } else {
          callback(new Error('请填写正整数金额'));
        };
      } else {
        callback();
      };
    };
    return {
      baseUrl: process.env.BASE_URL,
      priceInfo: [],
      orderList: [],
      clueData: {},
      signing: '',
      signName: '',
      personalAuth: {},
      orgAuth: {},
      totalAmount: 0,
      formRules: {
        depositTypeAgencyFee: [{ required: true, validator: depositAgency, trigger: 'blur' }],
        depositTypeThirdPartyFee: [{ required: true, validator: depositThird, trigger: 'blur' }],
        depositTypeOfficialFee: [{ required: true, validator: depositOfficial, trigger: 'blur' }],
        finalTypeAgencyFee: [{ required: true, validator: finalAgency, trigger: 'blur' }],
        finalTypeThirdPartyFee: [{ required: true, validator: finalThird, trigger: 'blur' }],
        dueTypeAgencyFee: [{ required: true, validator: fixedAgency, trigger: 'blur' }],
        dueTypeOfficialFee: [{ required: true, validator: fixedOfficial, trigger: 'blur' }],
        dueTypeThirdPartyFee: [{ required: true, validator: fixedThird, trigger: 'blur' }],
      },
    }
  },
  created() {
    if (this.edit) {
      this.orderList = this.productData;
    } else {
      if (!this.operate) {
        this.getClue();
      };
      if (this.orderId) {
        this.getOrderDetail();
      } else {
        this.getTrade();
      };
    };
  },
  methods: {
    resetFinal(row, val) {
      this.$set(row, 'finalTypePendingFee', 0);
      this.$set(row, val[0], null);
      this.$set(row, val[1], null);
      this.$set(row, val[2], false);
      this.$set(row, val[3], false);
      Vue.delete(row, val[0]);
      Vue.delete(row, val[1]);
    },
    reset(row, val, checkName, type) {// type: 0-定金 1-尾款 2-一口价
      let depositObj = {
        checkDepositAgent: row.checkDepositAgent || false,
        checkDepositThird: row.checkDepositThird || false,
        checkDepositGovernment: row.checkDepositGovernment || false
      };
      let finalObj = {
        checkFinalAgent: row.checkFinalAgent || false,
        checkFinalThird: row.checkFinalThird || false,
        checkUndetermined: row.checkUndetermined || false
      };
      let fixedObj = {
        checkFixedAgent: row.checkFixedAgent || false,
        checkFixedThird: row.checkFixedThird || false,
        checkFixedGovernment: row.checkFixedGovernment || false
      };
      if (
        (type == 0 && Object.values(depositObj).join(',').match(/true/g) == null) ||
        (type == 1 && Object.values(finalObj).join(',').match(/true/g) == null) ||
        (type == 2 && Object.values(fixedObj).join(',').match(/true/g) == null)
      ) {
        this.$set(row, checkName, true);
        this.$message({
          type: 'warning',
          message: '最少勾选一项价格！',
          offset: 300
        })
      } else {
        this.$set(row, val, null);
        Vue.delete(row, val);
        if (row.checkFinalThird || row.checkFinalAgent) {
          this.$set(row, 'checkUndetermined', false);
          Vue.delete(row, 'finalTypePendingFee');
        };
      };
    },
    getRadio(row) {
      this.$set(row, 'skuPayTypeList', {})
      this.$set(row.skuPayTypeList, 'checkDepositAgent', row.payTimesType == 1 ? true : false);
      this.$set(row.skuPayTypeList, 'checkDepositThird', false);
      this.$set(row.skuPayTypeList, 'checkDepositGovernment', false);
      this.$set(row.skuPayTypeList, 'checkFinalAgent', row.payTimesType == 1 ? true : false);
      this.$set(row.skuPayTypeList, 'checkFinalThird', false);
      this.$set(row.skuPayTypeList, 'checkUndetermined', false);
      this.$set(row.skuPayTypeList, 'checkFixedAgent', row.payTimesType == 2 ? true : false);
      this.$set(row.skuPayTypeList, 'checkFixedThird', false);
      this.$set(row.skuPayTypeList, 'checkFixedGovernment', false);
    },
    confirmOrder() {
      if (this.productData[0].clueType == 1) {
        this.signName = this.clueData.contactName
      } else {
        this.clueData.clueCompanyContactList.forEach(sign => {
          if (sign.mobile == this.signing) {
            this.signName = sign.contactName
          }
        });
      }
      let payTypeVoList = [];
      this.orderList.forEach(el => {
        if (el.skuInfo.payTimesType == 2) {
          payTypeVoList.push({
            payCostList: [
              { costAmount: el.skuInfo.skuPayTypeList.dueTypeAgencyFee || 0, costTypeId: 1 },
              { costAmount: el.skuInfo.skuPayTypeList.dueTypeThirdPartyFee || 0, costTypeId: 2 },
              { costAmount: el.skuInfo.skuPayTypeList.dueTypeOfficialFee || 0, costTypeId: 3 },
            ],
            payTypeId: 3,
            payTypeAmount: (el.skuInfo.skuPayTypeList.dueTypeAgencyFee || 0) + (el.skuInfo.skuPayTypeList.dueTypeThirdPartyFee || 0) + (el.skuInfo.skuPayTypeList.dueTypeOfficialFee || 0)
          })
        };
        if (el.skuInfo.payTimesType == 1) {
          payTypeVoList.push({
            payCostList: [
              { costAmount: el.skuInfo.skuPayTypeList.depositTypeAgencyFee || 0, costTypeId: 1 },
              { costAmount: el.skuInfo.skuPayTypeList.depositTypeThirdPartyFee || 0, costTypeId: 2 },
              { costAmount: el.skuInfo.skuPayTypeList.depositTypeOfficialFee || 0, costTypeId: 3 },
            ],
            payTypeId: 1,
            payTypeAmount: (el.skuInfo.skuPayTypeList.depositTypeAgencyFee || 0) + (el.skuInfo.skuPayTypeList.depositTypeThirdPartyFee || 0) + (el.skuInfo.skuPayTypeList.depositTypeOfficialFee || 0)
          },
            Object.assign(!el.skuInfo.skuPayTypeList.checkUndetermined ?
              {
                payCostList: [
                  { costAmount: el.skuInfo.skuPayTypeList.finalTypeAgencyFee || 0, costTypeId: 1 },
                  { costAmount: el.skuInfo.skuPayTypeList.finalTypeThirdPartyFee || 0, costTypeId: 2 },
                ],
                payTypeId: 2,
                payTypeAmount: (el.skuInfo.skuPayTypeList.finalTypeAgencyFee || 0) + (el.skuInfo.skuPayTypeList.finalTypeThirdPartyFee || 0)
              } : {
                payCostList: [
                  { costAmount: 0, costTypeId: 1 },
                  { costAmount: 0, costTypeId: 2 },
                  { costAmount: 0, costTypeId: 4 },
                ],
                payTypeId: 2,
                payTypeAmount: 0
              }
            )
          )
        }
      });
      payTypeVoList.forEach(el => {
        this.totalAmount += el.payTypeAmount;
      });
      let param = {
        id: this.productData[0].orderId,
        buyNum: this.orderList[0].attrForm.spuNum,
        goodsSkuId: this.productData[0].goodsSkuId,
        orderNo: this.productData[0].orderNo,
        orderStatus: this.productData[0].orderStatus,
        signMobile: this.signing,
        signName: this.signName,
        tailStatus: this.orderList[0].skuInfo.payTimesType == 2 ? 3 : this.orderList[0].skuInfo.payTimesType == 1 ? (this.orderList[0].skuInfo.skuPayTypeList && this.orderList[0].skuInfo.skuPayTypeList.checkUndetermined ? 0 : 1) : null,
        remark: this.orderList[0].attrForm.remark,
        payTypeVoList: payTypeVoList,
        totalAmount: this.totalAmount,
        subjectName: this.orderInfo.subjectName
      }
      updateOrder(param).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: 'success',
            message: '订单修改成功',
            offset: 300
          })
          this.$emit('closeDialog', false);
        }
      })
    },
    getClue() {
      // 获取线索详情数据
      let params = parseInt(this.productData[0].clueType) == 2 ? { clueCompanyId: this.productData[0].clueId } : { cluePersonId: this.productData[0].clueId }
      getClueDetail(params, this.productData[0].clueType == 1 ? 0 : 1, true).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.clueData = res.data.data
          this.signing = this.productData[0].clueType == 2 ? (this.productData[0].orderStatus == -2 ? this.productData[0].signMobile : this.clueData.clueCompanyContactList[0].mobile) : '';

          if (this.productData[0].clueType == 1) {
            getPersonalAuth({ mobile: this.clueData.mobile }).then(res => {
              this.personalAuth = res.data.data;
              this.signing = this.personalAuth.mobile;
            })
          } else {
            getOrgAuth({ organization: this.clueData.organization }).then(res => {
              this.orgAuth = res.data.data;
              let pattern = /^1[3456789]\d{9}$/
              this.clueData.clueCompanyContactList.forEach(clueEl => {
                if (pattern.test(clueEl.mobile)) {

                } else {
                  this.$set(clueEl, 'isban', true);
                }
                this.orgAuth.forEach(orgEl => {
                  if (clueEl.mobile == orgEl.mobile) {
                    this.$set(clueEl, 'certifiedType', orgEl.authorizedType);
                  }
                });
              });
            })
          };
        };
      })
    },
    delProduct(row, index) {
      this.orderList.splice(index, 1);
    },
    submit() {
      let validateStatus = true;
      this.orderList.forEach((el, index) => {
        this.$refs.attrForm[index].validate(valid => {
          if (valid) {

          } else {
            validateStatus = false;
            return false;
          };
        });
      });
      if (validateStatus) {
        if (this.edit) {
          this.$emit('editOrder', this.orderList);
        } else {
          if (!this.operate) {
            this.confirmOrder();
          } else {
            this.$emit('orderList', this.orderList);
          };
        };
      }
    },
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    lastStep() {
      this.$emit('lastStep', false);
    },
    changeAttr(row, skuIndex) {
      row.skuList.forEach(skuInfo => {
        if (skuInfo.skuIndex == skuIndex) {
          if (skuInfo.skuPayTypeList.checkFixedGovernment || skuInfo.skuPayTypeList.checkFixedThird || skuInfo.skuPayTypeList.checkFixedAgent) {//一口价
            this.$set(skuInfo, 'payTimesType', 2);
          } else {
            this.$set(skuInfo, 'payTimesType', 1);
          }
          row.skuInfo = skuInfo;
        }
      });
    },
    getOrderDetail() {
      let param = {
        orderId: this.orderId,
        sensitiveFlag: this.source == 1 ? true : false
      }
      getIneffectiveById(param, this.pathBool).then(res => {
        this.orderInfo = res.data.data
        let attrForm = {
          attribute: 0,
          remark: this.orderInfo.remark,
          spuNum: this.orderInfo.buyNum || 1
        };
        let attrList = [{
          label: this.orderInfo.spec,
          value: 0
        }];
        let skuInfo = {
          id: this.orderInfo.goodsSkuId,
          skuCode: this.orderInfo.spuNo,
          skuIndex: '0',
          skuNum: -1,
          skuPayTypeList: {}
        };
        this.orderInfo.orderFeeVoList.forEach(el => {
          if (el.payType == 1) {//支付类型(1:定金；2:尾款；3:一口价)
            skuInfo.payTimesType = 1;
            if (el.costType == 1 && el.price > 0) {//费用类型（1:代理费;2:第三方费用;3:官费;4:待定）
              this.$set(skuInfo.skuPayTypeList, 'checkDepositAgent', true);
              this.$set(skuInfo.skuPayTypeList, 'depositTypeAgencyFee', el.price);
            } else if (el.costType == 2 && el.price > 0) {
              this.$set(skuInfo.skuPayTypeList, 'checkDepositThird', true);
              this.$set(skuInfo.skuPayTypeList, 'depositTypeThirdPartyFee', el.price);
            } else if (el.costType == 3 && el.price > 0) {
              this.$set(skuInfo.skuPayTypeList, 'checkDepositGovernment', true);
              this.$set(skuInfo.skuPayTypeList, 'depositTypeOfficialFee', el.price);
            } else {

            };
          } else if (el.payType == 2) {
            skuInfo.payTimesType = 1;
            if (el.costType == 1 && el.price > 0) {//费用类型（1:代理费;2:第三方费用;3:官费;4:待定）
              this.$set(skuInfo.skuPayTypeList, 'checkFinalAgent', true);
              this.$set(skuInfo.skuPayTypeList, 'finalTypeAgencyFee', el.price);
            } else if (el.costType == 2 && el.price > 0) {
              this.$set(skuInfo.skuPayTypeList, 'checkFinalThird', true);
              this.$set(skuInfo.skuPayTypeList, 'finalTypeThirdPartyFee', el.price);
            } else if (el.costType == 4 || el.costType == null) {
              this.$set(skuInfo.skuPayTypeList, 'checkUndetermined', true);
            } else {

            };
          } else {
            skuInfo.payTimesType = 2;
            if (el.costType == 1 && el.price > 0) {//费用类型（1:代理费;2:第三方费用;3:官费;4:待定）
              this.$set(skuInfo.skuPayTypeList, 'checkFixedAgent', true);
              this.$set(skuInfo.skuPayTypeList, 'dueTypeAgencyFee', el.price);
            } else if (el.costType == 2 && el.price > 0) {
              this.$set(skuInfo.skuPayTypeList, 'checkFixedThird', true);
              this.$set(skuInfo.skuPayTypeList, 'dueTypeThirdPartyFee', el.price);
            } else if (el.costType == 3 && el.price > 0) {
              this.$set(skuInfo.skuPayTypeList, 'checkFixedGovernment', true);
              this.$set(skuInfo.skuPayTypeList, 'dueTypeOfficialFee', el.price);
            } else {

            };
          };
        });
        this.orderList.push({
          attrForm: attrForm,
          attrList: attrList,
          skuInfo: skuInfo,
          skuList: JSON.parse(JSON.stringify(skuInfo)),
          spuId: this.orderInfo.spuId,
          spuTitle: this.orderInfo.spuName
        })
      });
    },
    getTrade() {
      this.productData.forEach((el) => {
        let param = {
          spuId: el.id || el.spuId
        }
        getTradeInfo(param).then(res => {
          let arr = res.data.data.dynamicAttributeList
          let obj = []
          let attrlist = []
          arr.map((item, index) => {
            obj.push({
              attributeName: Object.keys(item)[0],
              attributeValues: []
            })
            Object.values(item)[0].forEach((element) => {
              obj[index].attributeValues.push({
                attributeValue: element
              });
            })
          });
          if (obj.length == 1) {
            obj[0].attributeValues.forEach((item, index) => {
              attrlist.push({ value: index, label: item.attributeValue })
            });
          } else {
            obj[0].attributeValues.forEach((item, index) => {
              obj[1].attributeValues.forEach((ele, idx) => {
                attrlist.push({
                  value: index + '_' + idx,
                  label: item.attributeValue + '+' + ele.attributeValue
                })
              })
            })
          };

          res.data.data.skuList.forEach(item => {
            this.$set(item.skuPayTypeList, 'checkDepositAgent', item.skuPayTypeList.depositTypeAgencyFee ? true : false);
            this.$set(item.skuPayTypeList, 'checkDepositThird', item.skuPayTypeList.depositTypeThirdPartyFee ? true : false);
            this.$set(item.skuPayTypeList, 'checkDepositGovernment', item.skuPayTypeList.depositTypeOfficialFee ? true : false);
            this.$set(item.skuPayTypeList, 'checkFinalAgent', item.skuPayTypeList.finalTypeAgencyFee ? true : false);
            this.$set(item.skuPayTypeList, 'checkFinalThird', item.skuPayTypeList.finalTypeThirdPartyFee ? true : false);
            this.$set(item.skuPayTypeList, 'checkUndetermined', item.skuPayTypeList.finalTypePendingFee == 0 ? true : false);
            this.$set(item.skuPayTypeList, 'checkFixedAgent', item.skuPayTypeList.dueTypeAgencyFee ? true : false);
            this.$set(item.skuPayTypeList, 'checkFixedThird', item.skuPayTypeList.dueTypeThirdPartyFee ? true : false);
            this.$set(item.skuPayTypeList, 'checkFixedGovernment', item.skuPayTypeList.dueTypeOfficialFee ? true : false);
            this.priceInfo.push({
              id: item.id,
              skuIndex: item.skuIndex,
              skuCode: item.skuCode,
              skuPayTypeList: item.skuPayTypeList
            });
          });
          let skuInfo = {}
          let selectList = []
          let skuIndexList = [];
          res.data.data.skuList.forEach(sku=>{
            skuIndexList.push(sku.skuIndex);
          })
          let skuList = attrlist.filter(attr => skuIndexList.includes(''+attr.value));
          res.data.data.skuList.forEach(sku => {
            if (sku.skuIndex == skuList[0].value) {
              if (sku.skuPayTypeList.checkFixedGovernment || sku.skuPayTypeList.checkFixedThird || sku.skuPayTypeList.checkFixedAgent) {//一口价
                this.$set(sku, 'payTimesType', 2);
              } else {
                this.$set(sku, 'payTimesType', 1);
              }
              skuInfo = sku
            }
            attrlist.forEach(attr => {
              if (attr.value == sku.skuIndex) {
                selectList.push(attr)
              }
            });
          });

          this.orderList.push({
            attrList: selectList,
            skuInfo: skuInfo,
            spuTitle: el.spuTitle || el.spuName,
            spuId: el.id,
            attrForm: {
              attribute: skuList[0].value,
              spuNum: el.buyNum || 1,
              remark: !this.operate ? this.productData[0].remark : '',
            },
            skuList: JSON.parse(JSON.stringify(res.data.data.skuList))
          });
          console.log(this.orderList);
        })
      });
    },
  }
}
</script>

<style scoped>
.edit-order-frame {
  height: 700px;
  overflow: auto;
}

.spa-title {
  width: 90px !important;
  font-size: 14px;
  font-weight: 550;
  margin: 5px;
  margin-left: 25px;
}

.remark {
  min-width: 600px;
}

.sub-line {
  width: 100%;
  border-bottom: 1px solid #eeeeee;
}

.order-edit-btn {
  padding-top: 20px;
  text-align: center;
  border-top: 1px solid #eeeeee;
}

.spu-title {
  display: inline-flex;
}

.spu-title img {
  width: 30px;
  height: 30px;
  margin: auto 0;
  margin-left: 10px;
  cursor: pointer;
}

.radio-block {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.sign-prompt {
  color: #f8ac1d;
}

.tag {
  font-size: 12px;
  color: #FFFFFF;
  border-radius: 5px;
  padding: 3px 5px;
  background: #36a6fe;
  margin-left: 5px;
}

.warning-text {
  color: red;
  font-size: 14px;
  margin-left: 5px;
}

.low-sty {
  background: rgba(245, 154, 35, 1) !important;
}

.certify_img_sty {
  width: 20px;
  height: 20px;
  margin-left: 5px;
}
</style>
<style>
.edit-order-frame .el-radio__label {
  display: flex;
  align-items: center;
}
</style>