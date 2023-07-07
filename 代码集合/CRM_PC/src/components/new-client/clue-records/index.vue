<template>
    <div class="clue-record">
      <div class="new_left_span">
        <span></span>
        <span>线索列表</span>
      </div>
      <avue-crud
        class="batch-choose"
        ref="crud"
        :option="option"
        :page.sync="page"
        :data="dataList"
        @size-change="sizeChange"
        @current-change="currentChange"
        @on-load="getList">
        <template slot="clueFollowTime" slot-scope="scope">
          <span v-if="scope.row.createType == '1'">{{ scope.row.clueFollowTime }}</span>
          <span v-if="scope.row.createType == '0'">{{ scope.row.userFollowTime }}</span>
        </template>
        <template slot="clueCompanyContactList" slot-scope="scope">
          <span v-if="scope.row.clueCompanyContactList.length > 0">{{ scope.row.clueCompanyContactList[0].contactName}}</span>
        </template>
        <template slot="clueNo" slot-scope="scope">
          <span>{{ scope.row.clueNo }}</span>
          <span class='bind-status' v-if="scope.row.isBind">{{ $t("message.bind") }}</span>
        </template>
        <template slot="phone" slot-scope="{row}">
          <span v-if="row.clueCompanyContactList.length > 0">{{ row.clueCompanyContactList[0].mobile }}</span>
          <span v-if="row.clueCompanyContactList.length > 0 && row.clueCompanyContactList[0].authStatus == 2" class="green_sty line-status">已授权</span>
        </template>
        <template slot="clueAttributionEmpName" slot-scope="scope">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right">
            <span @mouseover="showUserInfo(scope.row.clueAttributionEmpId)">{{scope.row.clueAttributionEmpName}}</span>
          </el-tooltip>
        </template>
        <template slot="clueSalesmanEmpName" slot-scope="scope">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right" :disabled="userInfo.isPartner">
            <span @mouseover="showUserInfo(scope.row.clueSalesmanEmpId)">{{scope.row.clueSalesmanEmpName}}</span>
          </el-tooltip>
        </template>
        <template slot="menu" slot-scope="scope">
          <div v-if="type==1">
            <el-button type="text" v-if="!scope.row.isBind" @click="changeBind(scope.row)" :disabled="!permissions.bt_bind_transaction_clue">绑定此线索</el-button>
            <el-button type="text" v-if="scope.row.isBind" @click="permissions.bt_allot_clue_attr ? distrBelong(0) : $notAuthorized()">分配线索归属</el-button>
            <el-button type="text" v-if="scope.row.isBind" @click="distrBelong(1)" :disabled="!permissions.bt_allot_clue_salesman">分配业务员</el-button>
          </div>
          <div v-if="type==0">
            <el-button type="text" v-if="!scope.row.isBind" @click="changeBind(scope.row)" :disabled="!permissions.bt_bind_transaction_clue_my">绑定此线索</el-button>
            <el-button type="text" v-if="scope.row.isBind" @click="permissions.bt_allot_clue_attr_my ? distrBelong(0) : $notAuthorized()">分配线索归属</el-button>
            <el-button type="text" v-if="scope.row.isBind" @click="distrBelong(1)" :disabled="!permissions.bt_allot_clue_salesman_my">分配业务员</el-button>
          </div>
        </template>
      </avue-crud>
      <allot ref="allot" @refresh="refresh"></allot>
    </div>
</template>
<script>
import { batchAllotService } from "@/api/admin/user";
import { clientOption } from "@/const/crud/client/clue-list";
import { getClueList,getBelong, getClueRecords} from "@/api/admin/customer"
import { getEmpList,allot,changeClue,clueAllot,clueListAllot} from '@/api/clue/clue'
import * as CodeMsg from "@/api/common/CodeChange"
import { mapGetters, mapState } from "vuex";
import { getUserDetail} from "@/api/admin/user";
import Allot from "@/components/new-client/common/allot";
export default {
  props:["accountId","type","source","clueId","userData"],
  components:{
    Allot
  },
  data() {
    return {
      cEmpNo:"",
      cDeptName:"",
      userBelongObj:{},
      operateWay:null,
      allotUser:false,
      // userData:{},
      allotUserBelong:"分配推广归属",
      allotClue:this.$t("message.allotClueBelong"),
      allotSalesman:this.$t("message.allotSalesman"),
      empInfo:{},
      clientBelongStatus:false,
      params:{},
      data:"",
      empNo:"",
      clueList:[],
      enterType:this.$route.query.type,
      isResouceShow: 0,
      allotDialog:false,
      dialogTitle:"",
      option: clientOption,
      allotForm: {},
      dataList: [],
      empLists:[],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条,
        isAsc: false, // 是否倒序
      },
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters(['permissions'])
  },
  filters:{
     onlineFilter(res,te){
      return res == 0? te("status.unRegistered") :res == 1?te("status.registered"):res == 2?te("status.certified"):res == 3?te("status.notCertified"):res == 4?te("status.invalid"):te("status.unknown")
    }
  },
  mounted(){
    this.getDatas();
  },
  methods: {
    refresh(){
      this.$emit('getData');
      this.getList();
    },
    distrBelong(val) {
      this.$nextTick(() => {
        this.$refs.allot.clueList = [this.userData];
        this.$refs.allot.clueType = this.$route.query.clueType;
        this.$refs.allot.isPerson = this.type == 1? false:true;
        this.$refs.allot.distrBelong(val,val==0?"分配线索归属":"分配业务员");
      });
    },
    changeBind(row){
      this.$confirm(this.$t("message.confirmAllot"), this.$t("title.notice"), {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning'
        }).then(() => {
          let params = {
            userId: this.userData.userId,
            clueId: row.id,
            }
            changeClue(params,this.$route.query.clueType,this.type).then(res=>{
              if(res.data.code == CodeMsg.CODE_0){
                this.$message({
                  type:"success",
                  message:this.$t("message.changeBindSuccess")
                }) 
                this.$emit('refresh',row.id);
                this.getNewList(row.id);
              }else{
                this.$message({
                  type:'warning',
                  message: res.data.msg
                })
              }
            })
        }).catch(() => {
        });
    },
    getUserData() {
      getUserDetail(this.userInfo.username).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          this.empInfo = res.data.data;
          if(this.empInfo.number == this.userData.customerBelongEmpNo){
          this.clientBelongStatus = true
        }else{
          this.clientBelongStatus = false
        }
        }
      });
      
    },
    te(arg){
       return this.$t(arg)
    },
     BelongNoChange(val){
        this.userBelongObj = {};
        this.$nextTick(()=>{
         this.empNo = this.$refs['clueBelonging'].getCheckedNodes()[0].data.customerNo; 
         this.userBelongObj = this.$refs["clueBelonging"].getCheckedNodes()[0].data;
        })     
      },
    //获取员工级联数据
    getDatas(){
      getEmpList(false).then(res=>{//去除禁用后的员工
          ++this.isResouceShow;
          this.empLists = res.data.data;
        }).catch(err=>{
          return false;
        });
    },
    //分配线索归属、业务员
    handleCheck(row){
      this.clueList=[]
       this.data=row.data;
       this.allotDialog = true;
       this.dialogTitle = row.title;
       this.allotType = row.type;//0、分配归属人 1、分配业务员 分配用户
       this.clueList.push(row.data)
       if(row.type==0&&row.customerCascadeView!==null){
        this.allotForm.clueBelonging = row.data.customerCascadeView.split(',');
      }else if(row.type==1&&row.salesmanCascadeView!==null){
        this.allotForm.clueBelonging = row.data.salesmanCascadeView.split(',');
      }else if(row.type==2){
        this.allotUser = true
        this.allotForm.clueBelonging = row.data.salesmanCascadeView.split(',');
      }
    },
    //分配线索归属、业务员dialog确认按钮
    allotConfirm(){
        let param = {
          allotSource: this.type==0? 1:0,
          allotType : this.allotType,
          accountList: this.clueList,
          customerCascadeView: this.allotForm.clueBelonging.join(',')
        }
        if(this.allotType==2){
          this.comTransf()
        }else{
        if(this.type == 1){
          this.allotListOperate(param)
        }else if(this.type == 0){
          this.allotOperate(param)
        }
        }
      },
       // 选择用户归属
    handleUserBelongChange(value) {
      this.userBelongObj = {};
      this.$nextTick(() => {
        this.userBelongObj = this.$refs["userBelong"].getCheckedNodes()[0].data;
        this.userBelongObj.deptName = this.userBelongObj.customerDeptName;
      });
    },
      //确定分配操作
    comTransf() {
        let params = {
          batchUserFlag:1,
          userNo: this.$route.query.loginEmpNo,
          // deptId: this.serviceObj.deptId,
          // deptName: this.serviceObj.departName,
          // deptNumber: this.serviceObj.deptNumber,
          // customerId: this.serviceObj.userId,
          // customerName: this.serviceObj.name,
          // customerNo: this.serviceObj.number,
          userBelongName:this.userBelongObj.customerName,
          userBelongNo:this.userBelongObj.customerNo,
          userBelongDeptName:this.userBelongObj.customerDeptName,
          // saleBelongNo:this.salesManObj.customerNo,
          // saleBelongName:this.salesManObj.customerName,
          // saleBelongDeptName:this.salesManObj.customerDeptName,
          // customerCascadeView: this.clueForm.service!==""?this.clueForm.service :"",
          userCascadeView: this.allotForm.clueBelonging.join(','),
          // saleCascadeView: this.clueForm.salesMan!==""?this.clueForm.salesMan.join(","):"",
          accountVOS: [this.data],
          };
          batchAllotService(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "分配成功！",
                offset: 300,
              });
              this.getDatas()
            }
        });
    },
      allotListOperate(param){
        clueListAllot(param).then(res=>{
          this.allotForm= {};
          this.allotDialog = false;
          if(res.data.code == CodeMsg.CODE_0){
            if(this.$route.query.type==1){
              this.$message({
                type: 'success',
                message: res.data.data
             })
              this.$emit('getData');
              this.getList();
            }else{
              if(this.allotType==0){
                getBelong({
                  empNo:this.empNo,
                  salesmanEmpNo:this.data.salesmanEmpNo
                }).then(res=>{
                  if(res.data.data=="failed"){
                    this.$message({
                      type: 'success',
                      message: this.$t("message.allotVisble")
                    })
                    this.$router.push("/personal/my-client")
                  }else{
                    this.$message({
                      type: 'success',
                      message: this.$t("alert.allotSuccess")
                    })
                    this.$emit('getData');
                    this.getList();
                  }
                  // console.log(res,"sheludasga")
                })
              }else{
                getBelong({
                  empNo:this.empNo,
                  customerEmpNo:this.data.customerEmpNo
                }).then(res=>{
                   if(res.data.data=="failed"){
                    this.$message({
                      type: 'success',
                      message: this.$t("message.allotVisble")
                    })
                    this.$router.push("/personal/my-client")
                  }else{
                    this.$message({
                      type: 'success',
                      message: this.$t("alert.allotSuccess")
                    })
                    this.$emit('getData');
                    this.getList();
                  }
                  console.log(res,"sheludasga")
                })
              }
            }
          }else{
            this.$notify({
            title: res.data.data,
            message: res.data.msg,
            type: 'warning',
            duration:4000
        });
          }
        })
      },
      allotOperate(param){
        clueAllot(param).then(res=>{
          this.allotForm= {};
          this.allotDialog = false;
          if(res.data.code == CodeMsg.CODE_0){
            if(this.$route.query.type==1){
              this.$message({
                type: 'success',
                message: res.data.data
             })
              this.$emit('getData');
              this.getList();
            }else{
              if(this.allotType==0){
                getBelong({
                  empNo:this.empNo,
                  salesmanEmpNo:this.data.salesmanEmpNo
                }).then(res=>{
                  if(res.data.data=="failed"){
                    this.$message({
                      type: 'success',
                      message: this.$t("message.allotVisble")
                    })
                    this.$router.push("/personal/my-client")
                  }else{
                    this.$message({
                      type: 'success',
                      message: this.$t("alert.allotSuccess")
                    })
                    this.$emit('getData');
                    this.getList();
                  }
                  // console.log(res,"sheludasga")
                })
              }else{
                getBelong({
                  empNo:this.empNo,
                  customerEmpNo:this.data.customerEmpNo
                }).then(res=>{
                   if(res.data.data=="failed"){
                    this.$message({
                      type: 'success',
                      message: this.$t("message.allotVisble")
                    })
                    this.$router.push("/personal/my-client")
                  }else{
                    this.$message({
                      type: 'success',
                      message: this.$t("alert.allotSuccess")
                    })
                    this.$emit('getData');
                    this.getList();
                  }
                  console.log(res,"sheludasga")
                })
              }
            }
          }else{
            this.$notify({
            title: res.data.data,
            message: res.data.msg,
            type: 'warning',
            duration:4000
        });
          }
        })
      },
    //分配线索归属、业务员dialog取消按钮
    cancle(){
        this.allotForm= {};
        this.allotDialog = false;
        this.clueList=[]
      },
      getNewList(id) {
      this.params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        clueId: this.userData.clueCompanyId || this.userData.cluePersonId
      }
      getClueRecords(this.params,this.$route.query.clueType,this.type).then(res=>{
        this.dataList = res.data.data.data.records
        this.page.total = res.data.data.data.total
      })
    },
    getList() {
      this.params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        clueId: this.userData.clueCompanyId || this.userData.cluePersonId
      }
      if(this.source){
        this.option.menu = false
        this.params.id = this.clueId
      }else{
        this.option.menu = true
        this.params.id = this.accountId
      }
      getClueRecords(this.params,this.$route.query.clueType,this.type).then(res=>{
        this.dataList = res.data.data.records
        this.page.total = res.data.data.total
      })
      // getClueList(this.params).then(res=>{
      //   this.dataList = res.data.data.data.records
      //   this.page.total = res.data.data.data.total
      // })
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getList();
    },
  },
}
</script>
<style scoped>
.clue-record{
  margin-left: 20px;
}
.footer{
  text-align: right;
}
.new_left_span {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 20px 0 25px 0px;
  padding-bottom: 20px;
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
  color: #666666;
  font-weight: bold;
}
.size-sty{
  font-weight: bold;
  font-size: 16px;
}
.info-title{
  font-weight: bold;
}
.line-status{
	height: 16px;
  padding: 1px 5px;
	line-height: 16px;
  font-size: 12px;
  display: inline-block;
  background: #409eff;
  border-radius: 20px;
  color: #ffffff;
  margin-left: 5px;
	position: absolute;
	top: 4px;
}
.green_sty{
  background: #409eff !important;
}
.fail-sty{
	background: #888 !important;
}
.bind-status{
  position:absolute;
  top:4px;
  width: 43px;
	height: 16px;
	line-height: 16px;
  font-size: 12px;
  display: inline-block;
  /* background: #409eff; */
  border-radius: 50px;
  border:1px solid green;
  color:green;
  margin-left: 5px;
}
.job-sty{
  font-size: 14px;
  margin-left: 10px;
  font-weight: normal;
}
</style>