<template>
<!-- 排查完成 -->
  <div class="details_frame">
    <div class="header_box">
      <span class="achievement-status">当前状态：{{ dataList.status | statusChange }}</span>&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button
        type="primary"
        size="mini"
        style="margin-left:10px;"
        v-show="dataList.status===2"
        @click="onSale()"
      >上架</el-button>
      <el-button
        type="warning"
        size="mini"
        v-show="dataList.status===1"
        @click="offSale()"
      >下架</el-button>
      <el-button
        type="warning"
        size="mini"
        v-show="this.dataList.status===1 || this.dataList.status===2 "
        @click="delRequirement()"
      >删除</el-button>     
      <el-button
        type="primary"
        size="mini"
        v-show="this.dataList.status===1 || this.dataList.status===2"
        @click="edit()"
      >编辑需求信息</el-button>
    </div>
    <!-- 编辑 -->
    <div v-if="isEditor">
      <requirement-editor :id="requirementId" :isEditor.sync="isEditor"></requirement-editor>
    </div>
    <!-- 详情 -->
    <div v-else>
      <div class="spa">
        <span>需求信息</span>
      </div>     
      <table class="tables" style="border-collapse:collapse;">
        <tr>
          <td class="t1">需求名称</td>
          <td class="t2">{{dataList.requirementName}}</td>
        </tr>
        <tr>
          <td class="t1">产品编号</td>
          <td class="t2">
            {{dataList.requirementNo}}
          </td>
        </tr>
        <tr>
          <td class="t1">来源</td>
          <td class="t2">
            <div v-if="dataList.sourceUser===0">{{dataList.sourceUser |sourceUser}}</div>
            <div v-else>{{dataList.sourceUser |sourceUser}}({{dataList.userVO.name}}-{{dataList.userVO.number}})</div>
          </td>
        </tr>                
        <tr>
          <td class="t1">需求类型</td>
          <td class="t2">{{dataList.requirementTypeTxt}}</td>
        </tr>
        <tr>
          <td class="t1">行业分类</td>
          <td class="t2">
            <span>{{dataList.industryTxt}}&nbsp;</span>
          </td>
        </tr>
        <tr>
          <td class="t1">投入预算(万元)</td>
          <td class="t2">{{budget}}</td>
        </tr>
        <tr>
          <td class="t1">所在地</td>
          <td class="t2">{{dataList.areaTxt}}</td>
        </tr>              
        <tr>
          <td class="t1">创建时间</td>
          <td class="t2" >{{dataList.createTime}}</td>
        </tr>
        <tr>
          <td class="t1">需求描述</td>
          <td class="t2" v-html="dataList.requirementDesc"></td>
        </tr>
        <tr>
          <td class="t1">浏览量/收藏量</td>
          <td class="t2" >浏览量：{{dataList.scanNumber}}&nbsp;&nbsp;&nbsp;收藏量：{{dataList.collectionNumber}}</td>
        </tr>          
      </table>
    </div>        
  </div>
</template>

<script>
import {receivePrice} from '@/util/price.js';
import requirementEditor from './create.vue';
import { getDetails,onlydelRequirement } from "@/api/requirement/index";
import {onSaleProduct,offSaleProduct,statusChange} from './requirements.js';
import { mapGetters } from 'vuex';
export default {
    components: {
      requirementEditor,        
    },
    data() {
      return {
        budget:'',
        isEditor:false,
        requirementId: "",
        memberStatus: "",
        joinStatus: "",
        dataList: {},
        userData: [],
        chargeList:[],
        reassignDialog: false,
        reassignmentForm: {},
        emplyeesList: {},        
        changeList: []
      };
    },
    filters: {
      sourceUser(value) {
        switch(value){
          case 0:
            return "用户";          
          case 1:
            return "后台";        
          default:
            return "未知";       
        }      
      },
      statusChange(value) {
        return statusChange(value);
      }      
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    created() {
      this.requirementId = this.$route.query.requirementId;
      this.isEditor = this.$route.query.status==1?true:false;
    },
    methods: {
      onSale(){
        let param = new FormData();
        param.append('id', this.requirementId);
        param.append('no', this.dataList.requirementNo);
        onSaleProduct(param).then(res=>{
          this.getRequirementDetail();
        })
      },
      offSale(){
        let param = {
          id: this.requirementId,
          no:this.dataList.requirementNo
        }
        offSaleProduct(param).then(res=>{
          this.getRequirementDetail();
        })
      },
      delRequirement(){
        this.idList = [this.requirementId];
        let param = {
          ids: this.idList.join(','),
          nos:this.dataList.requirementNo
        }
        onlydelRequirement(param).then(res=>{
          this.getRequirementDetail();
        })
      },    
      edit(row) {
        this.isEditor=true        
      },
      getRequirementDetail() {
        let param = new FormData();
        param.append('id',this.requirementId);
        getDetails(param).then(res => {
          this.dataList = res.data.data; 
          if(this.dataList.priceType){
            this.budget='面议'
          }else{
            if(!this.dataList.tradePriceMax){
              this.budget=receivePrice(this.dataList.tradePriceMin,2) 
            }else if(!this.dataList.tradePriceMin ){
              this.budget=receivePrice(this.dataList.tradePriceMax,2)  
            }else{
              this.budget=receivePrice(this.dataList.tradePriceMin,2)+'~'+receivePrice(this.dataList.tradePriceMax,2)
            } 
          }                                    
        })       
      }
    },
    mounted() {
      this.getRequirementDetail()
    }
};
</script>

<style>
.details_frame {
    width: 100%;
    margin: 0 auto;
}
.header_box {
    width: 100%;
    height: 70px;
    padding: 20px 30px;
    background: #ffffff;
    margin-left: 10px;
}
.spa {
    padding-left: 15px;
    border-left: 5px solid #3d85dc;
    font-size: 16px;
    margin: 20px 0;
}
.tables {
    width: 1200px;
    margin: 30px 0;
    color: #666;
}
.t1 {
    font-size: 14px;
    padding: 5px 5px;
    line-height: 40px;
    width: 300px;
    text-align: center;
    border: 1px solid lightgrey;
    padding-right: -10px;
    font-weight: bold;
}
.t2 {
    padding: 5px 5px;
    /* line-height:20px; */
    font-size: 14px;
    border: 1px solid lightgrey;
}
.info {
    margin: 30px;
}
.achievement-status{
  font-weight: 550;
}
</style>