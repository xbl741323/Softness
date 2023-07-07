<template>
  <div class="my_collect">
    <!-- 顶部搜索区域 -->
    <div class="collect_head">
      <div class="head_return">
        <span @click="toMember"></span>
        <span>我的收藏</span>
      </div>
      <!-- <i class="iconfont searchbtn" @click="showHistory">&#xe605;</i> -->
    </div>
    <mt-popup v-model="isHistory">
        <!-- 历史记录 -->
      <div class="historyContent">
        <div class="head_search">
            <input @keyup.enter="getAllList" v-model="searchKey" placeholder="搜索" type="text" />
        </div>
        <div class="searchbutton" @click="getAllList">搜索</div>
        <div class="historytitle">历史搜索</div>
        <div>
          <span v-for="(item,index) in historyList" :key="index" class="historyword" @click="changeSearchKey(item.searchKey)">
             {{item.searchKey}}
          </span>
        </div>
      </div>
    </mt-popup>
    
    <!-- tab切换区域 -->
    <div class="collect_tab">
      <div class="tab_left">
        <!-- <span @click="changeType(2)" :class="[showIndex == 2 ? 'change_sty' : '','spantab']">文章政策</span> -->
        <span @click="changeType(1)" :class="[showIndex == 1 ? 'change_sty' : '','spantab']">服务产品</span>
        <el-dropdown trigger="click" @command="handleCommand" :class="['down',!operateStatus?'specialdown':'']">
            <span class="el-dropdown-link checkstatus">
                {{showStatus==0?'全部':showStatus==1?'失效':'正常'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0" >全部</el-dropdown-item>
                <el-dropdown-item command="2">正常</el-dropdown-item>
                <el-dropdown-item command="1">失效</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- 管理按钮 -->
        <div class="operate" v-if="operateStatus">
            <p class="operatething" @click="toggleCheckALL(1)" v-if="multiStatus == 0">管理</p>
            <p class="operatething" @click="toggleCheckALL(0)" v-if="multiStatus == 1">完成</p>
        </div> 
      </div>
    </div>
    <!-- 内容区域 -->
    <div v-if="showIndex == 1">
      <!-- 服务产品 -->
      <service-collect
        @project-total="projectTotal"
        @project-change="projetcChange"
        @change-page="changePage"
        :showStatus="showStatus"
        ref="project"
      ></service-collect>
    </div>
    <div v-if="showIndex == 2">
      <!-- 文章政策 -->
      <!-- <policy-collect
        @policy-total="policyTotal"
        @project-change="projetcChange"
        @change-page="changePage"
        :showStatus="showStatus"
        ref="policy"
      ></policy-collect> -->
    </div>
    <!-- collect_delete区域 -->
    <div class="collect_delete" v-if="multiStatus == 1">
      <span><el-checkbox v-model="allCheckValue" @change="changeShowCheck">全选</el-checkbox></span>
      <span @click="deleteCollect">删除</span>
    </div>
  </div>
</template>

<script>
import {getHistoryList } from "@/api/member"
import { MessageBox } from 'mint-ui'
import { batchDelete } from "@/api/policySquare"
import policyCollect from "@/components/collect/policyCollect"
import serviceCollect from "@/components/collect/serviceCollect"
import { getUserInfo } from "@/api/login"
import { cancelcollect} from "@/api/collect"
export default {
  components: {
    policyCollect,
    serviceCollect
  },
  layout: 'empty',
  head() {
        return {
            title: this.metaTitle,
        };
    },
  data() {
    return {
      identification:"",
      isHistory:false,
      accountId:null,
      operateStatus:true,
      metaTitle:"我的收藏",
      allNum: 0,
      failNum: 0,
      searchKey: "",
      chooseList: [],
      chooseTitleList: [],
      allCheckValue: false,
      multiStatus: 0,
      showIndex: 1,
      collectList: [],
      historyList:[],
      showStatus:0  
    }
  },
   created(){
     this.getUserInfo();
  },
  methods: {
    handleCommand(status){
       this.showStatus = status
    },  
    changeSearchKey(searchKey){
         this.searchKey = searchKey;
         this.getAllList();
    },
    showHistory(){  
        this.isHistory =!this.isHistory;
    },
    getUserInfo() {
      getUserInfo().then((res) => {
        if (res.code == 0) {
          this.accountId = res.data.id
        }
      });
    },
    changePage(){
      this.chooseList = []
      this.chooseTitleList = []
      if(this.showIndex == 1){
        this.$refs.project.$refs.project.forEach((item) => {  
            item.checkValue = false
        })
      }else if(this.showIndex ==2){
        this.$refs.policy.$refs.policy.forEach((item) => {  
            item.checkValue = false
        })
      }
      this.allCheckValue = false
    },
    deleteCollect(){
      if(this.chooseList.length>0){
        MessageBox.confirm('确定删除所选的收藏吗？').then(action => {
            if(this.showIndex == 2){
                let param = {
                    idList: this.chooseList,
                    resourceTitleList: this.chooseTitleList
                }
                batchDelete(param).then(res=>{
                   if(res.code ==1000){
                        this.$toast({
                            message: "删除成功！",
                            position: "middle",
                            duration: 3000,
                        });
                        this.getAllList()
                        this.changeShowCheck(false)
                        this.chooseList = []
                        this.chooseTitleList = []
                   }
                })
            }else if(this.showIndex ==1){   // 服务产品
                if(!localStorage.getItem('userInfo')){
                    return
                }
                let param = {
                    spuIds: this.chooseList,
                    userId:JSON.parse(localStorage.getItem('userInfo')).userId
                }
                cancelcollect(param).then(res=>{
                    this.$toast({
                        message: "删除成功！",
                        position: "middle",
                        duration: 3000,
                    })
                    this.getAllList()
                    this.changeShowCheck(false)
                    this.chooseList = []
                    this.chooseTitleList = []
                })
            }
        })
       }else{
            this.$toast({
                message: "请先勾选再删除！",
                position: "middle",
                duration: 3000,
            })
      }
    },
    policyTotal(val) {
        this.allNum = val
        if(this.showIndex == 2 && val == 0){
            this.operateStatus = false
            this.multiStatus = 0
        }else{
            this.operateStatus = true
        }
    },
    projectTotal(val) {
        this.allNum = val
        if(this.showIndex == 1 && val == 0){
            this.operateStatus = false
            this.multiStatus = 0
        }else{
            this.operateStatus = true
        }
    },
    projetcChange() {
      this.chooseList = [];
      this.chooseTitleList = []
      if (this.showIndex == 1) {
        this.$refs.project.$refs.project.forEach((item) => {
          if (item.checkValue == true) {
            this.chooseList.push(item.collectInfo.spuId);
            this.chooseTitleList.push(item.collectInfo.spuTitle);
          }
        })
        if (this.chooseList.length == this.$refs.project.collectList.length) {
          this.allCheckValue = true;
        } else {
          this.allCheckValue = false;
        }
      } else if(this.showIndex == 2){
        this.$refs.policy.$refs.policy.forEach((item) => {
          if (item.checkValue == true) {
            this.chooseList.push(item.collectInfo.id);
            this.chooseTitleList.push(item.collectInfo.title);
          }
        });
        console.log(this.chooseList, "输出勾选的选项！");
        if (this.chooseList.length == this.$refs.policy.collectList.length) {
          this.allCheckValue = true;
        } else {
          this.allCheckValue = false;
        }
      }
    },
    toggleCheckALL(val) {
      this.multiStatus = val;
      this.projetcChange();
      if (this.showIndex == 1) {
        this.$refs.project.multiStatus = val;
        this.$refs.project.$refs.project.forEach((item) => {
          if (item.checkValue == true) {
           item.checkValue = false
          }
        });
      } else if(this.showIndex ==2) {
        this.$refs.policy.multiStatus = val;
        this.$refs.policy.$refs.policy.forEach((item) => {
          if (item.checkValue == true) {
           item.checkValue = false
          }
        });
      }
    },
    getAllList() {
      if (this.showIndex == 1) {
        this.$refs.project.searchKey = this.searchKey;
        this.$refs.project.currentPage = 1;
        this.$refs.project.getList();
      } else if(this.showIndex == 2){
        this.$refs.policy.searchKey = this.searchKey;
        this.$refs.policy.currentPage = 1;
        this.$refs.policy.getList();
      }
      this.isHistory = false;
      setTimeout(() => {
          this.getHistory();
      }, 500);
    },
    changeType(val) {
      if(this.showIndex == val){
      this.showIndex = val;
      }else{
      this.showIndex = val;
      this.multiStatus = 0;
      this.allCheckValue = false;
      this.chooseList = [];
      this.changeOperate()
      }
    },
    changeOperate(){
      if(this.allNum == 0){
        this.operateStatus = false
      }else{
        this.operateStatus = true
      }
        if (this.showIndex == 1) {
        if(this.$refs.project){
          this.$refs.project.multiStatus = 0;
        }
      } else if(this.showIndex ==2) {
        if(this.$refs.policy){
          this.$refs.policy.multiStatus = 0;
        }
      }
    },
    changeShowCheck(val) {
      if (this.showIndex == 1) {
        this.$refs.project.$refs.project.forEach((item) => {
          item.checkValue = val;
        });
        this.projetcChange();
      } else if(this.showIndex == 2) {
        this.$refs.policy.$refs.policy.forEach((item) => {
          item.checkValue = val;
        });
        this.projetcChange();
      }
    },
    toMember() {
      this.$router.push({
        path: "/member",
      });
    },
    getHistory(){
      if(localStorage.getItem('userInfo')){
          var userInfo = JSON.parse(localStorage.getItem('userInfo'));
          this.accountId = userInfo.userId
        }else{
          this.accountId = null
        }
        let params = {
          accountId:this.accountId
        }
      getHistoryList(params).then(res=>{
           this.historyList = res.data;
      })
    }
  },
  mounted() {
    if(localStorage.getItem("identification")){
        this.identification = localStorage.getItem("identification")
      }
    this.getHistory();
  },
};
</script>

<style scoped>
.my_collect >>> .el-checkbox__inner{
    border-radius: 50%;
}
.mint-popup{
    position: fixed;
    background: #fff;
    width: 100%;
    top: 0;
    left: 0;
    transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transition: .2s ease-out;
}
.historyContent{
  width: 100%;
  height: 222px;
  padding:8px 15px 0 15px;
  background:#ffffff;
}
.historytitle{
  font-size: 16px;
  margin-top: 15px;
  margin-bottom: 12px;
}
.historyword{
  display: inline-block;
  padding: 4.5px;
  background: #F6F7F9;
  border-radius: 5px;
  color: #333333;
  font-size: 14px;
  margin-right: 10px;
  margin-bottom: 5px;
}
.my_collect {
  width: 100%;
  background: #f3f3f3;
  position: relative;
}
.collect_head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1.17333333333rem;
  background: #fff;
}
.head_return {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5333333333rem;
}
.head_return > span:nth-of-type(1) {
  height: 0.26666666667rem;
  width: 0.26666666667rem;
  border: 2px solid #626262;
  transform: rotate(-45deg);
  border-right: none;
  border-bottom: none;
}
.head_return > span:nth-of-type(2) {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.searchbutton{
  width: 70px;
  height: 29px;
  line-height: 29px;
  border-radius: 10px;
  color: #ffffff;
  background: #36A6FEFF;
  font-size: 15px;
  text-align: center;
  position: absolute;
  top: 10px;
  right: 28px;
}
.head_search {
  width: 5.54666666667rem;
  height: 0.85333333333rem;
  position: relative;
  margin-right: 0.42666666667rem;
}
.head_search input {
  width: 247px;
  height: 0.85333333333rem;
  background: #ffffff;
  border: 1px solid #ebebeb;
  opacity: 1;
  border-radius: 16px;
  padding-left: 0.4rem;
}
.head_search i {
  color: #929292;
  position: absolute;
  right: 0.26666666667rem;
  top: 2px;
  font-size: 24px;
}
.collect_tab {
  width: 100%;
  height: 1.28rem;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 12px;
  border-top: 1px solid #e7e6eb;
  border-bottom: 1px solid #e7e6eb;
}
.tab_left {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
}
.tab_left span {
  display: inline-block;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #666666;
  margin-right: 24px;
  position: relative;
}
.change_sty {
  color: #36a6fe !important;
  font-weight:600;
}
.collect_content {
  margin-top: 12px;
  background: #ffffff;
}
.page_limit {
  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 35px;
  margin-bottom: 2rem;
}
.content_null {
  padding-top: 50px;
  background: #ffffff;
  color: #aaaaaa;
  font-size: 0.426666666667rem;
  width: 100%;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.collect_delete {
  width: 100%;
  height: 50px;
  background: #f2f2f2;
  opacity: 1;
  position: fixed;
  bottom: 0;
}
.collect_delete {
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}
.collect_delete > span:nth-of-type(1) {
  margin-left: 16px;
}
.collect_delete > span:nth-of-type(2) {
  width: 64px;
  height: 24px;
  border: 1px solid #ff3c31;
  opacity: 1;
  border-radius: 16px;
  color: #ff3c31;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
}
.searchbtn{
    margin-top: 3px;
    margin-right: 12px;
    font-size: 22px;
}
.operate{
    position: absolute;
    right: 12px;
    padding-left: 6px;
    border-left: 1px solid #e4e4e4;
}
.operatething{
    font-size: 14px;
}
.down{
    position: absolute;
    right: 30px;
}
.specialdown{
    right: 0;
    margin-right: 0;
}
.checkstatus{
    color: #36A6FE !important;
}
</style>

