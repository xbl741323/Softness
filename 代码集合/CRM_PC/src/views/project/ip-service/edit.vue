<template>
<!-- 排查完成 -->
  <div class="product-main">
    <div class="product-edit">
      <!-- tab切换区域 -->
      <div class="tab-change">
        <span
          @click="showTag(index)"
          :class="['tab-name', item.status == true ? 'name-color' : '']"
          v-for="(item, index) in dataList"
          :key="index"
          >{{ item.tagName }}</span>
      </div>
      <!-- 内容区域 -->
      <div class="edit-content">
        <basic-Info @refresh="refresh" :productInfo="productInfo" :payList="payList" :type="0" v-if="showIndex == 0"></basic-Info>
        <trade-info @refresh="refresh" :productInfo="productInfo" :editType="true" v-if="showIndex == 1"></trade-info>
        <detail @refresh="refresh" :tinyList="tinyList" :productInfo="productInfo" v-if="showIndex == 2"></detail>
        <opearte-records :productInfo="productInfo" v-if="showIndex == 3"></opearte-records>
      </div>
    </div>
  </div>
</template>
<script>
import { getWorkDetail } from "@/api/processmanage/work-flow"
import detailHead from "@/page/index/top/index";
import basicInfo from "@/components/ip-service/basic-info";
import tradeInfo from "@/components/ip-service/trade-info";
import detail from "@/components/ip-service/detail";
import opearteRecords from "@/components/ip-service/operate-records";
import { getProductDetail } from "@/api/project/ip";
export default {
  components: { basicInfo, detail, opearteRecords, detailHead,tradeInfo },
  data() {
    return {
			id:"",
			productInfo:{},
			showIndex: 0,
			payList:[
				{
          payName: this.$t("message.agencyFee"),
          price: "",
          status: false,
        },
        {
          payName: this.$t("message.threePartyFee"),
          price: "",
          status: false,
        },
        {
          payName: this.$t("message.officialFee"),
          price: "",
          status: false,
          type: 0,
        },
			],
			tinyList:[],
      dataList: [
        {
          tagName: this.$t("message.basicInfo"),
          status: true
        },
        {
          tagName: "交易信息",
          status: false
        },
        {
          tagName: this.$t("message.detailContent"),
          status: false
        },
        {
          tagName: this.$t("message.operateRecords"),
          status: false
        },
      ],
    };
  },
  methods: {
		refresh(){
			this.getDetail()
		},
    getDetail() {
      getProductDetail(this.id).then((res) => {
				this.productInfo = res.data.data
        getWorkDetail({policyId:this.productInfo.id,type:1}).then(res=>{ 
        this.$set(this.productInfo,"workId",res.data.workId);
        console.log(this.productInfo.workId,"this.form.workId")
       })
				this.tinyList = []
				//处理指导价数组
				if(this.productInfo.agencyFee!==""){
					this.payList[0].price = this.productInfo.agencyFee
					this.payList[0].status = true
				}
				if(this.productInfo.thirdPartyFee!==""){
					this.payList[1].price = this.productInfo.thirdPartyFee
					this.payList[1].status = true
				}
				if(this.productInfo.governmentFee!==""){
					this.payList[2].price = this.productInfo.governmentFee
					this.payList[2].status = true
				}
				//处理标签数组
				if(this.productInfo.labelOneName!==null&&this.productInfo.labelOneContent!==null){
					let obj = {
						tagName:this.productInfo.labelOneName,
						tagContent:this.productInfo.labelOneContent,
					}
					this.tinyList.push(obj)
				}
				if(this.productInfo.labelTwoName!==null&&this.productInfo.labelTwoContent!==null){
					let obj = {
						tagName:this.productInfo.labelTwoName,
						tagContent:this.productInfo.labelTwoContent,
					}
					this.tinyList.push(obj)
				}
				if(this.productInfo.labelThreeName!==null&&this.productInfo.labelThreeContent!==null){
					let obj = {
						tagName:this.productInfo.labelThreeName,
						tagContent:this.productInfo.labelThreeContent,
					}
					this.tinyList.push(obj)
				}
				if(this.productInfo.labelFourName!==null&&this.productInfo.labelFourContent!==null){
					let obj = {
						tagName:this.productInfo.labelFourName,
						tagContent:this.productInfo.labelFourContent,
					}
					this.tinyList.push(obj)
				}
				console.log(this.tinyList,"tinyList")
			});
    },
    showTag(index) {
      this.showIndex = index;
      this.dataList.forEach((item) => {
        item.status = false;
      });
      this.dataList[index].status = true;
    }
	},
	created(){
		this.id = this.$route.query.id
	},
	mounted(){
    this.getDetail()
	}
};
</script>
<style scoped>
.product-main {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 30px 20px;
}
.product-edit {
  width: 80%;
  margin-left: 5%;
}

.tab-change {
  border-bottom: 1px solid rgb(204, 204, 204);
  height: 47px;
}
.tab-name {
  display: inline-block;
  padding: 0 40px;
  line-height: 45px;
  font-size: 16px;
  cursor: pointer;
}
.name-color {
  color: rgb(16, 142, 233);
  border-bottom: 2px solid rgb(16, 142, 233);
}
.tab-content {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  margin-top: 80px;
}
.edit-content {
  margin-left: 0px;
  margin-top: 30px;
}
</style>
