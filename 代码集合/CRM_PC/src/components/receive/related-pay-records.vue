<template>
  <div>
		<el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :disabled="selectMemberOrderList.length>0||selectCourseOrderList.length>0" label="产品订单" name="product"></el-tab-pane>
      <el-tab-pane :disabled="selectProOrderList.length>0||selectCourseOrderList.length>0" label="课堂会员订单" name="member"></el-tab-pane>
      <el-tab-pane :disabled="selectProOrderList.length>0||selectMemberOrderList.length>0" label="课程订单" name="course"></el-tab-pane>
    </el-tabs>
	  <el-form @keyup.enter.native="getAllList()" :model="filters" inline>
      <el-form-item label="关键字：">
			 <el-input class="input-sty" v-model="filters.keyWords" :placeholder="getPlaceDec()"></el-input>
		  </el-form-item>
		<el-button type="primary" @click="getAllList()">搜索</el-button>
		<el-button type="warning" @click="resetList()">重置</el-button>
	  </el-form>
	    <div v-show="activeName == 'product'">
				<avue-crud class="batch-choose" @selection-change="selectionChange" v-if="activeName == 'product'" ref="crud" :option="productOption" :page.sync="page" :data="dataList" @size-change="sizeChange" @current-change="currentChange" @on-load="getList"></avue-crud>
			</div>
			<div v-show="activeName == 'member'">
				<avue-crud class="batch-choose" @selection-change="selectionChange" v-if="activeName == 'member'" ref="crud" :option="memberOption" :page.sync="page" :data="dataList" @size-change="sizeChange" @current-change="currentChange" @on-load="getList">
				  <template slot="productName">
            <span>卧涛课堂会员</span>
          </template>
				</avue-crud>
			</div>
			<div v-show="activeName == 'course'">
				<avue-crud class="batch-choose" @selection-change="selectionChange" v-if="activeName == 'course'" ref="crud" :option="courseOption" :page.sync="page" :data="dataList" @size-change="sizeChange" @current-change="currentChange" @on-load="getList"></avue-crud>
			</div>
			<div class="btn-contain">
				<el-button class="right-sty" type="primary" size="medium" @click="submit()">确定</el-button>
				<el-button size="medium" @click="handelCancel()">取消</el-button>
			</div>
	</div>
</template>

<script>
import { productOption, memberOption, courseOption } from "@/const/crud/receivable/related"
import { getPayRecords } from "@/api/receive/receive.js"
import * as CodeMsg from "@/api/common/CodeChange";
import { mapState } from "vuex";
export default {
	props:['feeInfo'],
  data() {
    return {
			checkStatus: false,
			productOption: productOption,
			memberOption: memberOption,
			courseOption: courseOption,
			activeName:'',
			filters:{
				keyWords:''
			},
			page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条,
      },
			dataList:[],
			selectProOrderList:[], // 选择的关联产品订单
			selectMemberOrderList:[], // 选择的关联课堂会员订单
			selectCourseOrderList:[], // 选择的关联课程订单
			selectTotalOrderList:[], // 选择的订单集合
		};
  },
	computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
    })
  },
	methods:{
		getPlaceDec(){
		 return this.activeName=='product'?	'请输入支付流水号/合同编号/订单编号/产品名称/客户名称关键字':'请输入支付流水号/客户手机号/订单编号/产品名称/客户名称关键字'
		},
		// 重置筛选条件
		resetList(){
			this.filters.keyWords = ''
			this.getAllList()
		},
		// 提交确定
		submit(){
			this.setTotalOrder()
			let checkList = []
			if(this.selectTotalOrderList.length>0){
				checkList = this.selectTotalOrderList.filter(item=>{
				return item.userId != this.selectTotalOrderList[0].userId
			})
			}
			if(checkList.length>0){
        this.$message({
					type:'warning',
					message:'请选择相同客户的支付记录！',
					offset:300
				})
			}else{
			  this.$emit('getSelectOrder',this.selectTotalOrderList)
			  this.handelCancel()
			}
		},
		selectionChange(val) {
			if(this.activeName == 'product'){
				this.selectProOrderList = this.getFilterOrder(val,1)
			}
			if(this.activeName == 'member'){
				this.selectMemberOrderList = this.getFilterOrder(val,3)
			}
			if(this.activeName == 'course'){
				this.selectCourseOrderList = this.getFilterOrder(val,2)
			}
		},
		// 查重
		filterSelect(list){
		 let idList = []
		 let result = []
     if(list.length>0){
			list.forEach(item=>{
				idList.push(item.id)
			})
		 }
		 let filterIdList = [...new Set(idList)]
		 filterIdList.forEach(item=>{
			let r = list.filter(citem=>{
				return citem.paymentId == item
			})
			r.length>0?result.push(r[0]):''
		 })
		 return result
		},
		// 获取订单指定参数
		getFilterOrder(val,type){
			let list = this.filterSelect(val)
			let result = []
			list.forEach(item=>{
				let obj = {
					payAmount:item.payAmount,
					agencyFee:type==1?this.fixProductFee(item,1):type==2?this.fixCourseFee(item,0):item.payAmount,
					thirdPartyFee:type==1?this.fixProductFee(item,2):type==2?this.fixCourseFee(item,1):0,
					governmentFee:type==1?this.fixProductFee(item,3):0,
					tradeNo:item.tradeNo,
					orderId:item.orderId,
					orderNo:item.orderNo,
					orderType: type,
					paymentId:item.paymentId,
					receiveId:this.feeInfo.id,
					userId: item.userId
				}
				// 产品订单独有
				if(type==1){
					obj.contractNo = item.contractNo
					obj.payType = item.payType
				}else{
					obj.payType = 3
				}
				result.push(obj)
			})
			return result
		},
		// 计算产品订单的费用 费用类型（1:代理费;2:第三方费用;3:官费;4:待定）
		fixProductFee(item,type){
			if(item.ttOrderFeeList&&item.ttOrderFeeList!=null){
				let r = item.ttOrderFeeList.filter((item)=>{
					return item.costType == type
				})
				return r.length>0?(r[0].buyNum*r[0].price):0
			}else{
				return 0
			}
		},
		// 计算课程订单的费用 费用类型：0课程单价；1第三方费用,
		fixCourseFee(item,type){
			if(item.ttCourseOrderFeeList&&item.ttCourseOrderFeeList!=null){
				let r = item.ttCourseOrderFeeList.filter((item)=>{
					return item.feeType == type
				})
				return r.length>0?r[0].feeAmout:0
			}else{
				return 0
			}
		},
		// 取消关闭弹窗
		handelCancel(){
			this.$emit('closeDialog')
		},
		handleClick(){
			this.setTotalOrder()
		},
		setTotalOrder(){
			this.selectTotalOrderList = []
			this.selectTotalOrderList = this.selectProOrderList.concat(this.selectMemberOrderList).concat(this.selectCourseOrderList)
		},
		filterActiveName(val){
			return val == 'product'?1:val == 'member'?3:val == 'course'?2:''
		},
		setActiveName(val){
			this.activeName = val == 1?'product':val == 3?'member':val == 2?'course':''
		},
		getAllList(){
			this.page.currentPage = 1
			this.getList()
		},
		setTypeOrder(){
			if(this.selectTotalOrderList.length>0){
				this.setActiveName(this.selectTotalOrderList[0].orderType)
			}else{
				this.activeName = 'product'
			}
			this.selectProOrderList = this.getFilterData(1)
      this.selectMemberOrderList = this.getFilterData(3)
      this.selectCourseOrderList = this.getFilterData(2)
		},
		getFilterData(type){
			let result = this.selectTotalOrderList.filter((item)=>{
          return item.orderType == type
			})
			return result
		},
		getList(){
      let params = {
        pageNo: this.page.currentPage,
	      pageSize: this.page.pageSize,
        keyWord: this.filters.keyWords, // 关键字
				claimStatus: 0,
				sortField:'orderTime',
				createTime: this.$moment(new Date('2023-01-01')).format("YYYY-MM-DD")+' '+'00:00:00',
				clueSalesmanEmpId:''
      }
			let type = this.filterActiveName(this.activeName)
			if(type==1){
				params.clueSalesmanEmpId = this.userInfo.id
			}else{
				params.belongId = this.userInfo.id
			}
      getPayRecords(type,params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
					this.dataList = res.data.data.records;
					this.dataList.forEach(item=>{
						item.id = item.paymentId
					})
          this.page.total = res.data.data.total;
					if(!this.checkStatus){
						this.setCheckd(type)
					}
				}
      })
    },
		// 处理勾选项
		setCheckd(type){
			this.setTotalOrder()
			this.dataList.forEach(item=>{
				this.selectTotalOrderList.forEach(cItem=>{
          if((item.id == cItem.paymentId)&&(cItem.orderType == type)){
						this.$refs.crud.toggleRowSelection(item,true);
					}
				})
			})
			this.checkStatus = true
		},
		currentChange(val){
			this.page.currentPage = val;
		},
		sizeChange(val){
			this.page.pageSize = val;
		},
	},
};
</script>

<style scoped>
.input-sty{
	width: 500px;
}
.btn-contain{
	display: flex;
	justify-content: center;
}
.right-sty{
	margin-right: 100px;
}
</style>