<template>
<!-- 排查完成 -->
  <div  class="gridcom">  
    <div class="mt unit" v-if="registerdetail.userType == 2">
    <span class="text">账号类型：  </span><span class="val">{{registerdetail.userType | fiteruserType}}  </span>
  </div>
  <!-- 单位 -->   
  <div v-if="registerdetail.userType==2">
    <!-- 主体信息 -->
      <div class="new_left_span">
        <span></span>
        <span>主体信息</span>
      </div>
      <div class="unit_sty">
        <div class="unit_box">
          <span class="unit_title">{{registerdetail.companyName}}</span>
          <p class="unit_tag">单位类型：&nbsp;&nbsp;
            <span>{{registerdetail.diyOrgType | filterUnitType}}</span>
          </p>
          <p class="unit_tag">信用代码：&nbsp;&nbsp;
            <span>{{registerdetail.organization}}</span>
          </p>
          <p class="unit_tag">认证时间：&nbsp;&nbsp;
            <span>{{registerdetail.auditorTime}} </span>
          </p>
          <p class="unit_tag">行业类型：&nbsp;&nbsp;
            <span>{{registerdetail.diyIndustry | filterIndustry}}</span>
          </p>
          <p class="unit_tag">注册来源：&nbsp;&nbsp;
            <span>{{registerdetail.registerClient | filterSource}}</span>
          </p>
          <p class="unit_tag">注册时间：&nbsp;&nbsp;
            <span>{{registerdetail.regCreateTime}}</span>
          </p>
        </div>
      </div>
    <!-- 登录ID信息 -->
    <div class="new_left_span">
      <span></span>
      <span>登录ID信息</span>
    </div>
    <div class="tableSty">
      <el-table :data="registerdetail.accountList" class="table_sty" border>
        <el-table-column prop="accountNo" label="登录ID" width="120" align="center"></el-table-column>
        <el-table-column prop="personName" label="联系人" width="120" align="center"></el-table-column>
        <el-table-column prop="job" label="职务" width="150" align="center"></el-table-column>
        <el-table-column prop="mobile" label="手机号"  width="150" align="center">
          <template slot-scope="scope"><div class="bgi-sty">
            <span class="mobile-sty">{{scope.row.mobile}}</span>
            <img :src="require('@/assets/images/new-client/certified_unit.png')" alt=""  class="img-sty" v-if="scope.row.authorizedType==2">
            <img :src="require('@/assets/images/new-client/certified_unit_low.png')" alt="" class="img-sty"  v-if="scope.row.authorizedType==1">
          </div>
          </template>
        </el-table-column>
        <el-table-column prop="wxBindFlag" label="微信绑定" width="100" align="center">
          <template slot-scope="scope">{{scope.row.wxBindFlag | filterWxBind}}</template>
        </el-table-column>
        <el-table-column prop="wxFollowFlag" label="微信关注" width="100" align="center">
          <template slot-scope="scope">{{scope.row.wxFollowFlag | filterWxFollow}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column  label="操作" width="120" align="center" v-if="$route.query.source=='list'"> 
          <template slot-scope="scope">
            <span @click="disableAccount(scope.row)" v-if="scope.row.isDisabled == 0" class="text_sty">禁用</span>
            <span @click="disableAccount(scope.row)" v-if="scope.row.isDisabled == 1"  class="text_sty">启用</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </div>
    <!-- 个人 -->
    <template v-else-if="registerdetail.userType==1">
      <div class="mt">
        <span class="text">账号类型：  </span>
        <span class="val">{{registerdetail.userType | fiteruserType}}  </span>
      </div>
      <div class="mt">
        <template v-if="registerdetail.userType==1 ||registerdetail.userType==2">
            <span class="text">登录 ID：  </span>
            <span class="val">{{headetail.accountNo}}  </span>  
        </template>
      </div> 
      <div class="mt">
        <span class="text">姓名：  </span>
        <span class="val">{{registerdetail.personName}}  </span>
      </div>
      <div class="mt">
        <span class="text">手  机  号：  </span>
        <span class="val">{{registerdetail.mobile}}  </span>
        <span v-if="registerdetail.status == 2" class="alread_register">已授权</span>
      </div>
      <div class="mt">
        <span class="text">职务：    </span>
        <span class="val" v-if="judge(registerdetail.job)">暂无数据 </span>
        <span class="val" v-else>{{registerdetail.job}}</span>
      </div>
      <div class="mt">
        <span class="text">微信绑定： </span>
        <span class="val">
          <span v-if="registerdetail.wxBindFlag==true">已绑定</span>
          <span v-else>未绑定</span>
        </span>
      </div>
      <div class="mt">
        <span class="text">单位名称：  </span>
        <span class="val" v-if="judge(registerdetail.diyOrgName)">暂无数据 </span>
        <span class="val" v-else>{{registerdetail.diyOrgName}}  </span>
      </div>
      <div class="mt">
        <span class="text">微信关注： </span>
        <span class="val">
          <span v-if="registerdetail.wxFollowFlag">已关注</span>
          <span v-else>未关注</span>
        </span>
      </div>
      <div class="mt">
        <span class="text">单位类型： </span>
        <span class="val">{{registerdetail.diyOrgType | filterUnitType}}  </span>
      </div>
      <div class="mt">
        <span class="text">注册时间： </span>
        <span class="val">{{registerdetail.regCreateTime}}  </span>
      </div>
      <div class="mt">
        <span class="text">行业类型： </span>
        <span class="val">{{registerdetail.diyIndustry | filterIndustry}}  </span>
      </div>
      <div class="mt">
        <span class="text">注册来源： </span>
        <span class="val">{{registerdetail.registerClient | filterSource}}  </span>
      </div>
      <div class="mt">
        <span class="text">所在地区： </span>
        <span class="val">{{registerdetail.diyOrgAddress | filterArea}}  </span>
      </div>
      <div class="mt">
        <span class="text">认证时间： </span>
        <span class="val">{{registerdetail.auditorTime}}  </span>
      </div>
    </template>


    <!-- 未认证 -->
    <template v-else>
      <div class="mt">
        <span class="text">账号类型：  </span>
        <span class="val">{{registerdetail.userType | fiteruserType}}  </span>
      </div>
      <div class="mt">
        <template>
            <span class="text">主体 ID：  </span>
            <span class="val">{{headetail.userNo}}  </span>  
        </template>
      </div> 
      <div class="mt">
        <span class="text">联  系  人：  </span>
        <span class="val" v-if="judge(registerdetail.personName)">暂无数据 </span>
        <span class="val" v-else>{{registerdetail.personName}}  </span>
      </div>
      <div class="mt">
        <span class="text">手  机  号：  </span>
        <span class="val">{{registerdetail.mobile}}  </span>
      </div>
      <div class="mt">
        <span class="text">单位名称：    </span>
        <span class="val" v-if="judge(registerdetail.companyName)">暂无数据 </span>
        <span class="val" v-else>{{registerdetail.companyName}}</span>
      </div>
      <div class="mt">
        <span class="text">微信绑定： </span>
        <span class="val">
          <span v-if="registerdetail.wxBindFlag==true">已绑定</span>
          <span v-else>未绑定</span>
        </span>
      </div>
      <!-- <div class="mt">
        <span class="text">信用代码：  </span>
        <span class="val">{{registerdetail.organization}}  </span>
      </div> -->
      <div class="mt">
        <span class="text">单位类型： </span>
        <span class="val">{{registerdetail.diyOrgType | filterUnitType}}  </span>
      </div>
      <div class="mt">
        <span class="text">微信关注： </span>
        <span class="val">
          <span v-if="registerdetail.wxFollowFlag">已关注</span>
          <span v-else>未关注</span>
        </span>
      </div>
      <div class="mt">
        <span class="text">行业类型： </span>
        <span class="val">{{registerdetail.diyIndustry | filterIndustry}}  </span>
      </div>
      <div class="mt">
        <span class="text">注册时间： </span>
        <span class="val">{{registerdetail.regCreateTime}}  </span>
      </div>
      <div class="mt">
        <span class="text">所在地区： </span>
        <span class="val">{{registerdetail.diyOrgAddress | filterArea}}  </span>
      </div>
      <div class="mt">
        <span class="text">注册来源： </span>
        <span class="val">{{registerdetail.registerClient | filterSource}}  </span>
      </div>
    </template>
  </div>
</template>
<script>
import { filterArea, filterIndustry,filterUnitType } from "@/util/new-client/filter"
import { accountDisabled } from "@/api/user/user"
import * as CodeMsg from "@/api/common/CodeChange";
export default{
  data () {
    return {
      baseUrl: process.env.BASE_URL,
    }
  },
   props:{
    transactionNo:{
      require:false
    },
     registerdetail:{
       type:Object,
       required:true
     },
     headetail:{
       type:Object,
       required:false
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
    fiteruserType(val){
      return val == 2 ? '单位': val == 1 ? '个人':'未认证'
    },
    filterSource(val){
      return val == "1" ? 'PC端': val == "2" ? '小程序' : val == "3" ?'移动端' : ''
    },
    filterWxBind(val){
      return val == true ? '已绑定' : '未绑定'
    },
    filterWxFollow(val){
      return val == true ? '已绑定' : '未绑定'
    }
  },
  methods:{
    judge(str){
      if(str == '' || str == null || str == undefined){
        return true;
      }
      return false;
    },
    disableAccount(row){
      let title = ''
      let ask = ''
      if(row.isDisabled == 0){
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
          accountId: row.accountId, 
          isDisabled: row.isDisabled == 0 ? 1 : 0
        }
        accountDisabled(params).then(res =>{
          if(res.data.code == CodeMsg.CODE_0){
              this.$message({
                type:'success',
                message: res.data.msg,
                duration: 2000
              });
            this.$emit('goFresh',true)
          }else{
            this.$message({
              type: "warning",
              message: res.data.msg,
              offset: 100,
              duration: 2000
            });
          }
        }).catch(error =>{
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
      })
    }
  },
  created(){
    console.log(this.$route.query.source)
  }
}
</script>
<style scoped>
.img-sty{
 width: 20px;
}
.bgi-sty{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
/* .mobile-sty{
  position: absolute;
  right: 27%;
  top: 20%;
} */
.new_left_span {
  width: 20%;
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
  height: 20px;
  margin-left: 5px;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: #2c3e50;
  font-weight: bold;
}
.gridcom{
    display: grid;
    grid-template-columns: repeat(2,1fr);
    grid-column-gap: 20px;
}
.mt{
  margin-top: 25px;
}
.text{
    color: #2c3e50;
    font-size: 14px;
}
.val{
    color: #666;
    font-size: 14px;
}
.alread_register{
  text-align: center;
  display: inline-block;
  padding: 1px 5px 2px 5px;
  border-radius: 5px;
  color: #ffffff !important;
  background: #409EFF;
  font-size: 12px;
  margin-left: 5px;
}
.unit {
  left: 600px;
  position: absolute;
  top: -2px;
}
.tableSty >>> .el-table th.el-table__cell>.cell{
  color:#000000;
}
.table_sty .text_sty {
  color: #409EFF;
}
.table_sty .text_sty:hover {
  cursor: pointer;
}
.unit_sty {
  border:1px solid #eeeeee;
  width:140%;
  height:330px;
  margin-top:-20px;
  margin-bottom:30px;
}
.unit_box {
  padding:25px;
}
.unit_title {
  font-size:16px;
  font-weight:bold;
}
.unit_tag {
  padding:5px;
  font-size:14px;
  margin-top:15px;
}
.table_sty {
  width: 100%;
  margin-bottom: 20px;
}

</style>