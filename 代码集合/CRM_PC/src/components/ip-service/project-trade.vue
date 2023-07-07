<template>
<!-- 排查完成 -->
  <div ref="PDF">
    <h2>二、交易信息</h2>
    <h4>设置规格属性 <span>您可以自定义填写何修改默认的属性项何属性值的名称</span></h4>
    <el-form inline :model="tableForm">
      <div
        v-for="(item,index) in specificationList"
        :key="index"
      >
        <el-form-item :label="'规格属性'+(index+1)+'：'">
          <div class="btn-operate">
            <el-input maxlength="4" v-model.trim="item.attributeName" placeholder="默认规格" />
            <img v-if="specificationList.length > 1" src="@/assets/images/ip-servers/dedut_icon@2x.png" @click="delSpecification(index)" alt="">
          </div>
        </el-form-item>
        <h6>属性值</h6>
        <div class="sub-input">
          <el-form-item
            v-for="(child, subscript) in item.attributeValues"
            :key="subscript"
          >
            <div class="btn-operate">
              <el-input v-model.trim="child.attributeValue" maxlength="15" placeholder="属性值" />
              <img v-if="item.attributeValues.length < 4 && item.attributeValues.length == subscript+1" src="@/assets/images/ip-servers/add_icon@2x.png" @click="addAttribute(index)" alt="">
              <img v-if="item.attributeValues.length > 1" src="@/assets/images/ip-servers/dedut_icon@2x.png" @click="delAttribute(index, subscript)" alt="">
            </div>
          </el-form-item>
        </div>
      </div>
      <el-button type="primary" @click="addSubscript()" v-if="specificationList.length < 2">添加属性</el-button>
    </el-form>

    <span>属性组合：</span>
    <p>商品名称</p>
    <div class="prod-group">
      <el-checkbox-group v-model="company" class="group">
        <el-checkbox
          v-for="(item,index) in tableDataList"
          :key="item.id"
          :label="item.unique"
          class="check"
        >
          <el-tooltip effect="dark" :content="++index+'. '+item.name" placement="top">
            <span class="wordlimit">{{index}}. {{item.name}}</span>
          </el-tooltip>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    
    <el-form :model="modelform" ref="modelform" :rules="formRules">
      <el-table border :data="modelform.skuList">
        <el-table-column label="编号" prop="index" width="50"></el-table-column>
        <el-table-column label="商品名称" prop="name" width="300"></el-table-column>
        <el-table-column label="价格" width="700">
          <template slot-scope="{row,$index}">
            <el-radio v-model="row.payTimesType" @change="getRadio(row)" :label="1">定金+尾款</el-radio>
            <div style="display: flex;">
              <p class="spa-title">定金 </p>
              <el-form-item style="display:flex;margin-right:5px;" :prop="'skuList.'+$index+'.skuPayTypeList.depositTypeAgencyFee'" :rules="formRules.depositTypeAgencyFee">
                <el-checkbox label="代理费：" :disabled='row.payTimesType != 1' v-model="row.skuPayTypeList.checkDepositAgent" @change="reset(row.skuPayTypeList,'depositTypeAgencyFee','checkDepositAgent', 0)"></el-checkbox>
                <el-input style="width:100px" :disabled="!row.skuPayTypeList.checkDepositAgent" v-model.number="row.skuPayTypeList.depositTypeAgencyFee" />
              </el-form-item>
              <el-form-item style="display:flex;margin-right:5px;" :prop="'skuList.'+$index+'.skuPayTypeList.depositTypeThirdPartyFee'" :rules="formRules.depositTypeThirdPartyFee">
                <el-checkbox label="第三方费用：" :disabled='row.payTimesType != 1' v-model="row.skuPayTypeList.checkDepositThird" @change="reset(row.skuPayTypeList,'depositTypeThirdPartyFee', 'checkDepositThird', 0)"></el-checkbox>
                <el-input style="width:100px" :disabled="!row.skuPayTypeList.checkDepositThird" v-model.number="row.skuPayTypeList.depositTypeThirdPartyFee"/>
              </el-form-item>
              <el-form-item style="display:flex;margin-right:5px" :prop="'skuList.'+$index+'.skuPayTypeList.depositTypeOfficialFee'" :rules="formRules.depositTypeOfficialFee">
                <el-checkbox label="官费：" :disabled='row.payTimesType != 1' v-model="row.skuPayTypeList.checkDepositGovernment" @change="reset(row.skuPayTypeList,'depositTypeOfficialFee', 'checkDepositGovernment', 0)"></el-checkbox>
                <el-input style="width:100px" :disabled="!row.skuPayTypeList.checkDepositGovernment" v-model.number="row.skuPayTypeList.depositTypeOfficialFee" />
              </el-form-item>
            </div>
            <div style="display: flex;">
              <p class="spa-title">尾款 </p> 
              <el-form-item style="display:flex;margin-right:5px;" :prop="'skuList.'+$index+'.skuPayTypeList.finalTypeAgencyFee'" :rules="formRules.finalTypeAgencyFee" >
                <el-checkbox label="代理费：" :disabled='row.payTimesType != 1' v-model="row.skuPayTypeList.checkFinalAgent" @change="reset(row.skuPayTypeList,'finalTypeAgencyFee', 'checkFinalAgent', 1)"></el-checkbox>
                <el-input style="width:100px" :disabled="!row.skuPayTypeList.checkFinalAgent" v-model.number="row.skuPayTypeList.finalTypeAgencyFee" />
              </el-form-item>
              <el-form-item style="display:flex;margin-right:5px;" :prop="'skuList.'+$index+'.skuPayTypeList.finalTypeThirdPartyFee'" :rules="formRules.finalTypeThirdPartyFee" >
                <el-checkbox label="第三方费用：" :disabled='row.payTimesType != 1' v-model="row.skuPayTypeList.checkFinalThird" @change="reset(row.skuPayTypeList,'finalTypeThirdPartyFee', 'checkFinalThird', 1)"></el-checkbox>
                <el-input style="width:100px" :disabled="!row.skuPayTypeList.checkFinalThird" v-model.number="row.skuPayTypeList.finalTypeThirdPartyFee"/>
              </el-form-item>
              <el-form-item style="display:flex;margin-right:5px" >
                <el-checkbox label="尾款待定" :disabled='row.payTimesType != 1' v-model="row.skuPayTypeList.checkUndetermined" @change="resetFinal(row.skuPayTypeList,['finalTypeThirdPartyFee','finalTypeAgencyFee','checkFinalThird','checkFinalAgent'])"></el-checkbox>
              </el-form-item>
            </div>
            <el-radio v-model="row.payTimesType" @change="getRadio(row)" :label="2">一口价</el-radio>
            <div style="display: flex;">
              <h3>一口价 </h3>
              <el-form-item style="display:flex;margin-right:5px;" :prop="'skuList.'+$index+'.skuPayTypeList.dueTypeAgencyFee'" :rules="formRules.dueTypeAgencyFee" >
                <el-checkbox label="代理费：" :disabled='row.payTimesType !=2' v-model="row.skuPayTypeList.checkFixedAgent" @change="reset(row.skuPayTypeList, 'dueTypeAgencyFee', 'checkFixedAgent', 2)"></el-checkbox>
                <el-input style="width:100px" :disabled="!row.skuPayTypeList.checkFixedAgent" v-model.number="row.skuPayTypeList.dueTypeAgencyFee" />
              </el-form-item>
              <el-form-item style="display:flex;margin-right:5px;" :prop="'skuList.'+$index+'.skuPayTypeList.dueTypeThirdPartyFee'" :rules="formRules.dueTypeThirdPartyFee" >
                <el-checkbox label="第三方费用：" :disabled='row.payTimesType !=2' v-model="row.skuPayTypeList.checkFixedThird" @change="reset(row.skuPayTypeList,'dueTypeThirdPartyFee', 'checkFixedThird', 2)"></el-checkbox>
                <el-input style="width:100px" :disabled="!row.skuPayTypeList.checkFixedThird" v-model.number="row.skuPayTypeList.dueTypeThirdPartyFee"/>
              </el-form-item>
              <el-form-item style="display:flex;margin-right:5px" :prop="'skuList.'+$index+'.skuPayTypeList.dueTypeOfficialFee'" :rules="formRules.dueTypeOfficialFee" >
                <el-checkbox label="官费：" :disabled='row.payTimesType !=2' v-model="row.skuPayTypeList.checkFixedGovernment" @change="reset(row.skuPayTypeList,'dueTypeOfficialFee', 'checkFixedGovernment', 2)"></el-checkbox>
                <el-input style="width:100px" :disabled='!row.skuPayTypeList.checkFixedGovernment' v-model.number="row.skuPayTypeList.dueTypeOfficialFee" />
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量(件)" width="100">不限</el-table-column>
        <el-table-column label="编号" prop="skuCode"></el-table-column>
      </el-table>
    </el-form>
    <div class="btn-confirm" v-if="$route.query.number">
      <el-button class="cancel-sty-two" size="medium" type="primary" @click="tradeInfoCheck()" v-preventReClick>{{$t('button.save')}}</el-button>
      <el-button class="cancel-sty-two" size="medium" @click="goback">{{$t('button.cancel')}}</el-button>
    </div>
  </div>
</template>

<script>
import { getTradeInfo,modTradeInfo } from '@/api/project/project'
import { clearDetail } from "@/util/clearDetail"
import Vue from 'vue'
export default {
  data(){
    var depositAgency = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      let pattern = /^[1-9]\d*$/;
      if(this.modelform.skuList[index].skuPayTypeList.checkDepositAgent){
        if(value!=null){
          callback();
        }else{
          callback(new Error('请填写正整数金额!'));
        };
      }else{
        callback()
      };
    };

    var depositThird = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      let pattern = /^[1-9]\d*$/;
      if(this.modelform.skuList[index].skuPayTypeList.checkDepositThird){
        if(value!=null){
          return callback();
        }else{
          return callback(new Error('请填写正整数金额'));
        };
      }else{
        callback();
      };
    };

    var depositOfficial = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      let pattern = /^[1-9]\d*$/;
      if(this.modelform.skuList[index].skuPayTypeList.checkDepositGovernment){
        if(value!=null){
          return callback();
        }else{
          return callback(new Error('请填写正整数金额'));
        };
      }else{
        callback();
      };
    };

    var finalAgency = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      let pattern = /^[1-9]\d*$/;
      if(this.modelform.skuList[index].skuPayTypeList.checkFinalAgent){
        if(value!=null){
          return callback();
        }else{
          return callback(new Error('请填写正整数金额'));
        };
      }else{
        callback();
      };
    };

    var finalThird = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      let pattern = /^[1-9]\d*$/;
      if(this.modelform.skuList[index].skuPayTypeList.checkFinalThird){
        if(value!=null){
          callback();
        }else{
          callback(new Error('请填写正整数金额'));
        };
      }else{
        callback();
      };
    };

    var fixedAgency = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      let pattern = /^[1-9]\d*$/;
      if(this.modelform.skuList[index].payTimesType == 2  && this.modelform.skuList[index].skuPayTypeList.checkFixedAgent){
        if(value!=null){
          callback();
        }else{
          callback(new Error('请填写正整数金额'));
        };
      }else{
        callback();
      };
    };

    var fixedThird = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      let pattern = /^[1-9]\d*$/;
      if(this.modelform.skuList[index].payTimesType == 2  && this.modelform.skuList[index].skuPayTypeList.checkFixedThird){
        if(value!=null){
          callback();
        }else{
          callback(new Error('请填写正整数金额'));
        };
      }else{
        callback();
      };
    };

    var fixedOfficial = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      let pattern = /^[1-9]\d*$/;
      if(this.modelform.skuList[index].payTimesType == 2  && this.modelform.skuList[index].skuPayTypeList.checkFixedGovernment){
        if(value!=null){
          callback();
        }else{
          callback(new Error('请填写正整数金额'));
        };
      }else{
        callback();
      };
    };

    return {
      specificationList: [
        {
          attributeName: '默认规格',
          attributeValues: [
            {
              attributeName: '默认规格',
              attributeValue: '属性',
            },
          ]
        }
      ],
      tableForm: {},
      tableDataList: [
        {
          index: 1,
          skuIndex:'0',
          skuNum:-1,//产品数量不限
          name: '属性',
          payTimesType: 1,
          skuPayTypeList:{
            checkDepositAgent: true,
            checkFinalAgent: true
          }
        }
      ],
      company:[],
      modelform:{
        skuList:[]
      },
      formRules:{
        depositTypeAgencyFee:[{required: true, validator: depositAgency, trigger:'blur'}],
        depositTypeThirdPartyFee:[{required: true, validator: depositThird,trigger:'blur'}],
        depositTypeOfficialFee:[{required: true, validator: depositOfficial,trigger:'blur'}],
        finalTypeAgencyFee:[{required: true, validator: finalAgency,trigger:'blur'}],
        finalTypeThirdPartyFee:[{required: true, validator: finalThird,trigger:'blur'}],
        dueTypeAgencyFee:[{required: true, validator: fixedAgency,trigger:'blur'}],
        dueTypeOfficialFee:[{required: true, validator: fixedOfficial,trigger:'blur'}],
        dueTypeThirdPartyFee:[{required: true, validator: fixedThird,trigger:'blur'}],
      },
      priceInfo: [],//编辑-- 交易信息存储
      flagID: 0,
      check: true,
      editUnique: [],//存储唯一值
    }
  },
  watch:{
    specificationList:{
      deep: true,
      handler(){
        this.getGroup();
      }
    },
    filterList:{
      deep: true,
      handler(){
        this.$set( this.modelform,'skuList',this.filterList);
        this.modelform.skuList.forEach(item => {
          this.priceInfo.forEach(element => {
            if(item.unique == element.unique){
              if(element.skuPayTypeList.checkFixedGovernment || element.skuPayTypeList.checkFixedThird ||element.skuPayTypeList.checkFixedAgent){//一口价
                this.$set(item,'payTimesType',2);
              }
              this.$set(item,'skuCode',element.skuCode);
              item.skuPayTypeList = element.skuPayTypeList;
            }
            if(this.editUnique.includes(item.unique) == -1){//不在编辑带入的值范围内
              this.$set(item,'skuCode','');
              this.$set(item,'skuPayTypeList',{});
            }
          });
        });
      }
    },
  },
  computed:{
    filterList(){
      return this.tableDataList.filter(item=>{
        // this.check = true;
        return this.company.includes(item.unique);
      })
    }
  },
  mounted(){
    if(this.$route.query.number){
      this.getTrade();
    }
  },
  methods:{
    getTrade(){
      let param ={
        spuId: this.$route.query.number
      }
      getTradeInfo(param).then(res=>{
        let arr = res.data.data.dynamicAttributeList
        let obj = []
        arr.map((item,index)=>{
          obj.push({
            attributeName: Object.keys(item)[0],
            attributeValues:[]
          })
          Object.values(item)[0].forEach((element)=>{
            obj[index].attributeValues.push({
              attributeValue: element
            });
          })
        });
        
        res.data.data.skuList.forEach(item => {
          this.$set(item.skuPayTypeList,'checkDepositAgent',item.skuPayTypeList.depositTypeAgencyFee ? true : false);
          this.$set(item.skuPayTypeList,'checkDepositThird',item.skuPayTypeList.depositTypeThirdPartyFee ? true : false);
          this.$set(item.skuPayTypeList,'checkDepositGovernment',item.skuPayTypeList.depositTypeOfficialFee ? true : false);
          this.$set(item.skuPayTypeList,'checkFinalAgent',item.skuPayTypeList.finalTypeAgencyFee ? true : false);
          this.$set(item.skuPayTypeList,'checkFinalThird',item.skuPayTypeList.finalTypeThirdPartyFee ? true : false);
          this.$set(item.skuPayTypeList,'checkUndetermined',item.skuPayTypeList.finalTypePendingFee == 0 ? true : false);
          this.$set(item.skuPayTypeList,'checkFixedAgent',item.skuPayTypeList.dueTypeAgencyFee ? true : false);
          this.$set(item.skuPayTypeList,'checkFixedThird',item.skuPayTypeList.dueTypeThirdPartyFee ? true : false);
          this.$set(item.skuPayTypeList,'checkFixedGovernment',item.skuPayTypeList.dueTypeOfficialFee ? true : false);
          this.priceInfo.push({
            id: item.id,
            skuIndex: item.skuIndex,
            skuCode: item.skuCode,
            skuPayTypeList: item.skuPayTypeList
          });
        });
        /* 给每个属性赋一个唯一值 */
        obj.forEach(item => {
          item.attributeValues.forEach(element => {
            this.$set(element,'flagID',this.flagID++);
          });
        });
        this.check = true;
        this.specificationList = obj;
        this.modelform.skuList = res.data.data.skuList;
      })
    },
    goback(){
      clearDetail("/project/index");
      history.go(-1);
    },
    modTrade(){
      let param = {
        id: this.$route.query.number,
        dynamicAttributeList: this.specificationList,
        skuList: this.modelform.skuList
      }
      modTradeInfo(param).then(res=>{
        this.$message({
          type:'success',
          message:'保存成功！'
        })
        history.go(-1);
      })
    },
    getRadio(row){
      this.$set(row,'skuPayTypeList',{})
      this.$set(row.skuPayTypeList,'checkDepositAgent',row.payTimesType == 1 ? true : false);
      this.$set(row.skuPayTypeList,'checkDepositThird', false);
      this.$set(row.skuPayTypeList,'checkDepositGovernment', false);
      this.$set(row.skuPayTypeList,'checkFinalAgent', row.payTimesType == 1 ? true : false);
      this.$set(row.skuPayTypeList,'checkFinalThird', false);
      this.$set(row.skuPayTypeList,'checkUndetermined', false);
      this.$set(row.skuPayTypeList,'checkFixedAgent', row.payTimesType == 2 ? true : false);
      this.$set(row.skuPayTypeList,'checkFixedThird', false);
      this.$set(row.skuPayTypeList,'checkFixedGovernment', false);
    },
    reset(row, val, checkName, type){// type: 0-定金 1-尾款 2-一口价
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
      if(
        (type == 0 && Object.values(depositObj).join(',').match(/true/g) == null) || 
        (type == 1 && Object.values(finalObj).join(',').match(/true/g) == null) || 
        (type == 2 && Object.values(fixedObj).join(',').match(/true/g) == null)
      ){
        this.$set(row, checkName, true);
        this.$message({
          type: 'warning',
          message: '最少勾选一项价格！'
        })
      }else{
        this.$set(row,val,null);
        Vue.delete(row,val);
        if(row.checkFinalThird || row.checkFinalAgent){
          this.$set(row,'checkUndetermined',false);
          Vue.delete(row,'finalTypePendingFee');
        };
      };
    },
    resetFinal(row,val){
      this.$set(row,'finalTypePendingFee',0);
      this.$set(row,val[0],null);
      this.$set(row,val[1],null);
      this.$set(row,val[2],false);
      this.$set(row,val[3],false);
      Vue.delete(row,val[0]);
      Vue.delete(row,val[1]);
    },
    addSubscript(){
      this.check = false;
      this.specificationList.push(
        {
          attributeName: '默认规格',
          attributeValues: [
            {
              attributeName: '默认规格',
              attributeValue: '属性',
              flagID: this.flagID++
            }
          ]
        }
      );
    },
    delSpecification(index){
      this.check = false;
      this.specificationList.splice(index,1);
    },
    addAttribute(index){
      this.check = false;
      this.specificationList[index].attributeValues.push(
        {
          attributeValue: '属性',
          flagID: this.flagID++
        }
      );
    },
    delAttribute(index,subscript){
      this.check = false;
      this.specificationList[index].attributeValues.splice(subscript,1);
    },
    getGroup(){
      this.tableDataList = [];
      if(this.specificationList.length == 1){//一个规格
        this.specificationList[0].attributeValues.forEach((item,subscript) => {
          this.tableDataList.push({
            index: this.tableDataList.length + 1,
            name: item.attributeValue,
            skuIndex: subscript,
            unique: item.flagID,
            payTimesType: 1,
            skuNum:-1,
            skuPayTypeList: {
              checkDepositAgent: true,
              checkFinalAgent: true
            }
          });
        });
      };
      if(this.specificationList.length > 1){//多规格
        this.specificationList[0].attributeValues.forEach((item,subscript) => {
          this.specificationList[1].attributeValues.forEach((element,index) => {
            this.tableDataList.push(
              {
                index: this.tableDataList.length + 1,
                skuIndex: subscript+'_'+index,
                unique: item.flagID+'_'+element.flagID,
                name:item.attributeValue+'+'+element.attributeValue,
                payTimesType: 1,
                skuNum:-1,
                skuPayTypeList: {
                  checkDepositAgent: true,
                  checkFinalAgent: true
                }
              }
            )
          });
        });
      };
      if(this.check){
        this.tableDataList.forEach(item => {
          this.editUnique.push(item.unique);
        });
      };

      if(this.$route.query.number){//价格回显 接口调用时执行一次
        this.tableDataList.forEach(item => {
          this.priceInfo.forEach(element => {
            if(item.skuIndex == element.skuIndex && this.editUnique.includes(item.unique) ){
              if(element.skuPayTypeList.checkFixedGovernment || element.skuPayTypeList.checkFixedThird ||element.skuPayTypeList.checkFixedAgent){//一口价
                this.$set(item,'payTimesType',2);
              }
              this.$set(item,'skuCode',element.skuCode);
              this.$set(item,'id',element.id);
              item.skuPayTypeList = element.skuPayTypeList;
            }
            if(this.editUnique.includes(item.unique) == -1){
              this.$set(item,'skuCode','');
              this.$set(item,'skuPayTypeList',{});
            }
          });
          this.modelform.skuList.forEach(element => {
            if(item.skuIndex == element.skuIndex){
              this.$set(element,'unique',item.unique);
            }
          });
        });
        if(this.check){//接口调用时执行一次
          this.company = [];
          this.modelform.skuList.forEach(item => {//已选中商品
            this.company.push(item.unique);
          });
          this.editUnique = [];
          this.company.forEach(item => {
            this.editUnique.push(item);
          });
          this.check = false;
        }
      };
    },
    tradeInfoCheck(){
      this.$refs['modelform'].validate(valid=>{
        if(valid){
          if(this.modelform.skuList.length > 0){//商品已选
            if(this.$route.query.number){
              this.modTrade();
            }
            this.$emit('passValidate',true);
          }else{
            this.$message({
              type: 'warning',
              message: '至少选择一个商品！'
            })
          };
        }else{
          // this.$message({
          //   type: 'warning',
          //   message: '请检查交易信息是否填写！'
          // })
        };
      });
    },
  },

}
</script>

<style scoped>
h4 >>> span{
  font-size: 12px;
  color: #666666;
}
h6{
  margin: 0 0 0 90px;
  color: #666666;
  font-weight: 400;
}
h3{
  margin: 8px;
  line-height: 18px;
}
.sub-input{
  display: flex;
  margin-left: 90px;
}
.btn-operate{
  display: flex;
}
.btn-operate img{
  width: 18px;
  height: 18px;
  margin: auto 10px;
  cursor: pointer;
}
.prod-group{
  border-bottom: 1px solid #EEEEEE;
  margin-bottom: 20px;
}
.group{
  display: grid;
  grid-template-columns: repeat(4,1fr);
  grid-gap: 20px;
  margin-bottom: 20px;
  line-height: 14px;
}
.btn-confirm {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
}
.spa-title{
  width: 90px !important;
  font-size: 14px;
  font-weight: 550;
  margin: 5px;
}
.wordlimit{
  display: inline-block;
  margin: 0;
  max-width: 150px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.check >>> .el-checkbox__label{
  line-height: 12px;
}
</style>