<template>
<!-- 排查完成 -->
   <div class="content">
       <div class="snapshot">
           <div class="head">
               <div class="flex">
                   <img src="@/assets/images/task/head.png" class="headimg" />
                    <div class="headleft">
                        <div class="headtop">{{headetail.companyName || headetail.personName}}
                          <!-- <img v-if="headetail.authStatus==1" src="@/assets/images/task/name.png" class="tag" /> -->
                          <img :src="require('@/assets/images/new-client/certified_unit.png')" alt="" style="width: 20px;height: 20px; margin-left: 10px" v-if="headetail.authStatus==1 && headetail.transactionNo && headetail.companyName">
                          <img :src="require('@/assets/images/new-client/certified_unit_low.png')" alt="" style="width: 20px;height: 20px; margin-left: 10px" v-if="headetail.authStatus==1 && !headetail.transactionNo && headetail.companyName">
                        </div>
                        <div>
                            <span class="numbtn">{{headetail.username}}</span>  
                            <span class="numbtn numleft">{{headetail.userNo}}</span>      
                        </div> 
                    </div> 
               </div>
               <div class="btns">
                    <el-button v-if="source=='person'" @click="follow(headetail)">跟进</el-button>
                    <el-button @click="permissions.sys_user_edit || source == 'person' ? allocate() : $notAuthorized()">分配</el-button>
                    <el-button v-if="source=='list'&&isDisabled==0&&type!=0"  @click="permissions.sys_user_status_edit ? handleEnabledisable(headetail) : $notAuthorized()">禁用</el-button>
                    <el-button v-if="source=='list'&&isDisabled==1&&type!=0"  @click="permissions.sys_user_status_edit ? handleEnabledisable(headetail) : $notAuthorized()">启用</el-button>
               </div>
           </div>
           <div class="grid">
             <div v-for="(item,index) in list" :key="index">
                  <p class="text">{{item.label}}</p>
                  <p v-if="item.id==1" class="value">{{headetail.clueNo || '暂无数据'}}</p>
                  <p v-if="item.id==2" class="value">{{headetail.customerServerName || '暂无数据' }}</p>
                  <p v-if="item.id==3" class="value">{{headetail.promoteAttributionName || '暂无数据'}}</p>
                  <p v-if="item.id==4" class="value">{{headetail.transactionId | filtertransactionId}}</p>
                  <p v-if="item.id==5" class="value">{{headetail.personName ||'暂无数据'}}</p>
                  <p v-if="item.id==6" class="value">{{headetail.mobile ||'暂无数据'}}</p>
                  <p v-if="item.id==7" class="value">{{headetail.lastClueFollowTime ||'暂无数据'}}</p>
                  <p v-if="item.id==8" class="value">{{headetail.lastUserFollowTime ||'暂无数据'}}</p>
                  <p v-if="item.id==9" class="value">{{headetail.lastLoginTime ||'暂无数据'}}</p>
                  <p v-if="item.id==10" class="value">{{headetail.lastSignTime ||'暂无数据'}}</p>
                  <p v-if="item.id==11" class="value">{{headetail.diyIndustry | filterIndustry}}</p>
                  <p v-if="item.id==12" class="value">{{headetail.diyOrgAddress | filterArea}}</p>
             </div>
           </div>
           <p class="text">备注<i class="el-icon-edit edit" @click="permissions.sys_user_edit || source == 'person' ? editNote() : $notAuthorized()"></i></p>
           <p class="value">{{headetail.remark?headetail.remark:'暂无数据'}}</p>
       </div>
       <div class="info">
          <el-tabs type="border-card" v-model="activeTab" @tab-click="handleClick">
            <el-tab-pane label="用户信息" name="first">
                <el-button @click="whichTab=1" :class="[whichTab==1?'blue':'']"  v-show="type!=2">注册信息</el-button>
                <el-button @click="whichTab=2" :class="[whichTab==2?'blue':'']" v-show="type!=2">线索信息</el-button>
                <registerinfo v-if="activeTab=='first'  && registerdetail.userId && whichTab==1" :registerdetail="registerdetail" :headetail="headetail" :transactionNo="transactionNo" @goFresh="goFresh"/>
                <clue-info v-if="activeTab=='first' && whichTab==2 && headetail.clueType!=null && type!=2" @refresh="handleRefresh" :userData="userData" myType="0" :type="source=='list'?1:0" source="false" :clueId='this.headetail.clueId' :clueType='headetail.clueType'></clue-info>
            </el-tab-pane>
            <el-tab-pane label="订单记录" name="second">
              <div>
                <div class="order-filter-item">
                  <span class="order-name-sty">订单类型：</span>
                  <el-radio-group v-model="orderType" >
                    <el-radio-button
                      v-for="(item, index) in typeList"
                      :key="index"
                      border
                      :label="item.value"
                      :class="['order-btn-sty', index > 0 ? 'order-border-sty' : '']">{{ item.title }}</el-radio-button>
                  </el-radio-group>
                </div>
                <product-order v-if="orderType == 0" :source="source"></product-order>
                <course-order v-if="orderType == 1" :source="source"></course-order>
                <member-order v-if="orderType == 2" :source="source"></member-order>
              </div>
            </el-tab-pane>
            <el-tab-pane label="用户日志" name="third">用户日志</el-tab-pane>
            <el-tab-pane label="用户关注" name="fourth">
              <el-button @click="attentionTab=1" :class="[attentionTab==1?'blue':'']">用户下载</el-button>
               <el-button @click="attentionTab=2" :class="[attentionTab==2?'blue':'']">用户收藏</el-button>
               <user-download  v-if="activeTab=='fourth'&&attentionTab==1"></user-download>
               <user-follow  v-if="activeTab=='fourth'&&attentionTab==2"></user-follow>
            </el-tab-pane>
            <el-tab-pane label="维护记录" name="fifth">
               <el-button @click="recordTab=1" :class="[recordTab==1?'blue':'']">用户跟进</el-button>
               <el-button @click="recordTab=2" :class="[recordTab==2?'blue':'']">用户编辑</el-button>
               <follow-info  v-if="activeTab=='fifth'&&recordTab==1" @passValue="passValue"></follow-info>
               <edit-info  v-if="activeTab=='fifth'&&recordTab==2"></edit-info>
            </el-tab-pane>
          </el-tabs>
       </div>
       <el-dialog :visible.sync="noteDialog" title="编辑备注" :close-on-click-modal="false" width="500px">
            <el-input type="textarea" v-model="note" rows="5" maxlength="100" show-word-limit />
            <div class="edit-note">
                <el-button type="primary" @click="submit" v-preventReClick>确 定</el-button>
                <el-button @click="noteDialog=false">取 消</el-button>
            </div>
       </el-dialog>
       
       <!-- 用户分配 -->
      <el-dialog  title="分配客服"  :visible.sync="dialogVisible" :close-on-click-modal="false" width="23%" :before-close="handlebeforeDialogClose">
        <el-form :model="userForm" ref="crud"  label-width="140px">
          <el-form-item label="请选择客服：" prop="customerServerName" >
            <el-select v-model="userForm.customerServerName" placeholder="请选择">
              <el-option  v-for="item in customerList" :key="item.userId" :label="item.name" :value="item.userId"></el-option>
            </el-select>
          </el-form-item> 
        </el-form>
        <div class="allot-btn-contain">
          <el-button type="primary" @click="makeSure()">确定</el-button>
          <el-button class="ml" @click="handleCancel()">取消</el-button>
        </div>
      </el-dialog>

      <!-- 跟进弹窗 -->
      <el-dialog :visible.sync="followDialog" title="用户跟进" width="670px" :close-on-click-modal="false">
        <follow-up v-if="followDialog" :userInfo="userData" @changeVisible="changeVisible"></follow-up>
      </el-dialog>
   </div>
</template>

<script>
import userdata from '@/components/restructureUserList/userlist.js'
import { getUserDetail,getRegister,editMark,mygetUserDetail,mygetRegister ,distribution} from "@/api/restructureuser/index"
import { getClueDetail } from "@/api/new-client/my-clue"
import { getCustomerList } from "@/api/clue/clue"
import clueInfo from "@/components/new-client/clue-info/index"
import followUp from '@/components/personal/my-users/follow-up'
import registerinfo from "@/components/restructureUserList/registerinfo"
import productOrder from "@/components/personal/my-users/product-order"
import courseOrder from "@/components/personal/my-users/course-order"
import memberOrder from "@/components/personal/my-users/member-order"
import followInfo from "@/components/personal/my-users/follow-info"
import userFollow from "@/components/personal/my-users/user-follow"
import editInfo from "@/components/personal/my-users/edit-info"
import userDownload from "@/components/personal/my-users/user-download"
import { filterArea, filterIndustry,filterUnitType } from "@/util/new-client/filter"
import { mapGetters } from 'vuex'
import { accountDisabled } from "@/api/user/user"
export default {
  components: {
     clueInfo,
     registerinfo,
     productOrder,
     followInfo,
     editInfo,
     userDownload,
     userFollow ,
     followUp,
     courseOrder,
     memberOrder
  },
  data() {
    return {
      transactionNo:null,
      baseUrl: process.env.BASE_URL,
      userId: null,
      type: null,
      isDisabled: null,
      source: null,
      list: userdata.gridList,
      note: null,
      noteDialog: false,
      activeTab: 'first',
      headetail: {},
      registerdetail: {},
      userData: {},
      whichTab: 1,
      typeList: [
        {
          title: "产品订单",
          value: 0,
        },
        {
          title: "课程订单",
          value: 1,
        },
        {
          title: "课堂会员",
          value: 2,
        }
      ],
      orderType: 0,
      recordTab: 1,
      attentionTab: 1,
      customerList: [],
      dialogVisible: false,
      userForm: {
        customerServerName: null,
        promoteAttributionName: null
      },
      batchList: [],
      followDialog: false,
    }
  },
  filters: {
    filterIndustry(val){
      return filterIndustry(val)
    },
    filterArea(val){ 
      return filterArea(val)
    },
    filterUnitType(val){ 
      return filterUnitType(val)
    },
    filtertransactionId(val){
      return val?'是':'否'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created(){
    this.userId = this.$route.query.userId
    this.type = this.$route.query.type //账号类型
    this.source = this.$route.query.source 
    this.transactionNo = this.$route.query.transactionNo 
    sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(this.$route.query));
  },
  mounted() {
     this.getCustomerList()
     this.getHeadInfo()
     this.getUserInfo()
  },
  methods: {
      goFresh(val){
        if(val == true){
          this.getUserInfo()
        }
      },
      // 跟进
      follow(row){
        this.followDialog = true;
        this.userData = row;
      },
      //跟进取消按钮
      changeVisible(val) {
        this.followDialog = val;
        this.getHeadInfo()
        this.getUserInfo()
      },
      // 客服
      getCustomerList(){
        getCustomerList().then((res) => {
          this.customerList = res.data.data
        })
      },
      // 分配客服
      allocate(){
        this.dialogVisible = true
      },
      //启用禁用用户
      handleEnabledisable(row) {
        let title = ''
        let ask = ''
        if(this.isDisabled == 0){
          title = '用户禁用'
          ask = '确定禁用该用户吗？'
        }else{
          title = '用户启用'
          ask = '确定启用该用户吗？'
        }
        this.$confirm(ask, title, {
          type: 'warning',
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel"
        }).then(()=>{
            let params = {
            accountId: this.accountId, 
            isDisabled: this.isDisabled == 0 ? 1 : 0
          }
          accountDisabled(params).then(res =>{
            if(res.data.code == CodeMsg.CODE_0){
                this.$message({
                  type:'success',
                  message: res.data.msg,
                  duration: 2000
                });
                this.getHeadInfo()
                this.getUserInfo()
            }
          }).catch(error =>{
            console.log(error)
          })
      }).catch(err=>{
        return err;
      });
      },
      //关闭分配弹框
      handlebeforeDialogClose(done){
        done()
      },
      //取消分配
      handleCancel(){
        this.userForm.customerServerName = null
        this.dialogVisible = false
      },
      makeSure(){
        this.batchList.push(this.userId)
        let param = {
          userIds:this.batchList,
          customerServerId:this.userForm.customerServerName,  //客服
        }
        distribution(param).then(res=>{
            if(res.data.code!=0){
              this.$message({
                type:'warning',
                message: res.data.msg,
                offset:300
              })   
              return false
            }
            this.$message({
              type:'success',
              message:'分配成功',
              offset:300
            })   
            this.batchList = []
            this.userForm.customerServerName = null
            this.dialogVisible = false
            this.getHeadInfo()
            this.getUserInfo()
        })
      },
      editNote(){
         this.noteDialog = true
         this.note = this.headetail.remark
      },
      submit(){
        let param = {
           userId:this.userId,
           remark:this.note
        }
        editMark(param).then(res=>{
          if(res.data.code==0){
            this.noteDialog = false;
            this.getHeadInfo()
          }
        })
      },
      handleClick(tab, event){

      },
      //头部信息
      getHeadInfo(){
        if(this.source=='list'){
          getUserDetail(this.type,{userId:this.userId}).then(res=>{
            if(res.data.data.clueType){
               res.data.data.clueType =  res.data.data.clueType==2?1:0 
            }
            this.headetail = res.data.data
            if(this.headetail.clueType==null){
                return 
            }
            this.getClueInfo()
          })
        }else{
          mygetUserDetail(this.type,{userId:this.userId}).then(res=>{
            if(res.data.data.clueType){
               res.data.data.clueType =  res.data.data.clueType==2?1:0 
            }
            this.headetail = res.data.data
            if(this.headetail.clueType==null){
                return 
            }
            this.getClueInfo()
          }) 
        }
      },
      //注册信息
      getUserInfo(){
         if(this.source=='list'){
            getRegister(this.type,this.userId).then(res=>{
              console.log(res);
                this.registerdetail = res.data.data
                this.isDisabled = res.data.data.isDisabled
                this.accountId = res.data.data.accountId
            })
         }else{
            mygetRegister(this.type,this.userId).then(res=>{
                this.registerdetail = res.data.data
                this.isDisabled = res.data.data.isDisabled
                this.accountId = res.data.data.accountId
            })
         }
      },
      //线索信息
      getClueInfo(){
        let param= this.headetail.clueType == 1? {clueCompanyId: this.headetail.clueId}:{cluePersonId: this.headetail.clueId}
        getClueDetail(param,this.headetail.clueType,this.source == 'list'?false:true).then(res=>{
            if (res.data.code == 0) {
                this.userData = res.data.data
                console.log(this.userData);
                this.userData.clueType = this.headetail.clueType
            }
        })
      },
      handleRefresh(){
        this.getHeadInfo()
      }
  }
}
</script>

<style scoped>
.content{
    padding-left: 10px;
}
.snapshot{
    background: #ffffff;
    min-height: 380px;
    padding: 30px 40px;
    border-radius: 3px;
}
.head{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.headimg{
    width: 60px;
    height: 60px;
}
.headleft{
    margin-left: 15px;
}
.tag{
    width: 18px;
    height: 18px;
    margin-left: 10px;
}
.numbtn{
    display: inline-block;
    padding: 6px;
    margin-top: 6px;
    background-color: rgba(247, 247, 247, 1);
    padding: 4px;
    border: 1px solid rgba(235, 235, 235, 1);
    border-radius: 4px;
}
.numleft{
    margin-left: 10px;
}
.headtop{
    display: flex;
    align-items: center;
}
.flex{
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}
.grid{
    display: grid;
    grid-template-columns: repeat(6,1fr);
    grid-column-gap: 20px;
}
.info{
    background: #ffffff;
    padding: 30px 40px;
    border-radius: 3px;
    margin-top: 20px;
}
.edit-note{
  text-align: right;
  margin-top: 10px;
}
.text{
  font-weight: bold;
  color: #2c3e50;
  font-size: 14px;
}
.value{
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
}
.blue{
    background: rgba(16, 139, 252, 1);
    color: #fff;
}
.order-filter-item {
  margin: 0 0 15px 0;
}
.order-name-sty {
  font-size: 14px;
  color:#606266;
}
.order-btn-sty {
  margin: 0 20px 0 0;
}
.order-border-sty {
  border-left: 1px solid #dcdfe6;
}
.allot-btn-contain {
  margin-top: 25px;
  display: flex;
  justify-content: center;
}
</style>