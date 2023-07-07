<template>
  <div class="staff_detail">
    <!-- 员工信息头部 -->
    <div class="staff_header">
      <div class="header_left">
        <img v-if="empInfo.avatar" :src="imgBaseUrl + empInfo.avatar" alt />
        <img v-else :src="require('@/assets/images/task/head.png')" alt />
        <span class="nickName-sty">
          <span v-if="empInfo.nickname !== null">{{ empInfo.nickname }}</span>
          <span v-else>{{ empInfo.username }}</span>
        </span>
      </div>
      <div class="header_right">
        <div class="right_header">
          <span>{{ empInfo.name }}</span>
          <span>{{ deptValue }}</span>
        </div>
        <div class="right_content">
          <span>{{ $t("label.userName") }}：{{ empInfo.username }}</span>
          <span>{{ $t("label.jobNumber") }}：{{ empInfo.number }}</span>
          <span>{{ $t("message.phoneCall") }}：{{ empInfo.phone }}</span>
        </div>
        <div class="right_footer">
          <span>{{ $t("message.role") }}：{{ rolesValue.toString() }}</span>
        </div>
      </div>
      <div class="header_button">
        <el-button class="staff_detail_btn"  type="success" @click="permissions.sys_account_edit ? handleUpdate() : $notAuthorized()">{{$t("button.edit")}}</el-button>
        <el-button
          class="staff_detail_btn"
          type="danger"
          v-if="empInfo.lockFlag == 0"
          @click="permissions.sys_account_edit ? startStatus(9) : $notAuthorized()">{{ $t("button.disabled") }}</el-button>
        <el-button
          class="staff_detail_btn"
          type="success"
          v-if="empInfo.lockFlag == 9"
          @click="permissions.sys_account_edit ? startStatus(0) : $notAuthorized()">{{ $t("button.enable") }}</el-button>
      </div>
    </div>
    <!-- 员工信息tab切换 -->
    <div class="staff_content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- <el-tab-pane :label="$t('message.operateLog')" name="first">
        </el-tab-pane> -->
        <el-tab-pane label="在职信息" name="four"></el-tab-pane>
        <el-tab-pane :label="$t('message.sysLog')" name="second"> </el-tab-pane>
        <el-tab-pane :label="$t('message.accountHistory')" name="three">
        </el-tab-pane>
      </el-tabs>
      <div>
        <!-- <operate-log
          v-if="activeName == 'first'"
          :userName="empName">
        </operate-log> -->
        <sys-log v-if="activeName == 'second'" :userName="empName"></sys-log>
        <account-history
          v-if="activeName == 'three'"
          :number="empInfo.number">
        </account-history>
        <job-info v-if="activeName == 'four'" :jobInfo="empInfo" />
      </div>
    </div>

    <!-- 编辑信息 -->
    <el-dialog :visible.sync="editDialog" title="编辑信息" :close-on-click-modal="false" width="600px" >
      <el-form :model="empEditInfo" ref="empEditInfo" :rules="empRules" label-width="150px" class="edit-box" >
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="empEditInfo.name" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-select v-model="empEditInfo.sex">
            <el-option v-for="item in sexList" 
              :key="item.value"
              :value="item.value"
              :label="item.label"  
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门：" prop="deptId">
          <el-select v-model="empEditInfo.deptName">
            <el-option :value="empEditInfo.deptId" :label="empEditInfo.deptName">
              <el-tree
                class="filter-tree"
                :data="treeDeptData"
                @node-click="deptNodeClick"
                ref="tree">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查重部门：" prop="businessGroupId">
          <el-select v-model="empEditInfo.businessGroupId">
            <el-option 
              v-for="item in repeatDeptOptions"
              :key="item.id"
              :value="item.id"
              :label="item.businessGroupName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工号：" prop="number">
          <el-input v-model="empEditInfo.number" disabled placeholder="请输入工号"/>
        </el-form-item>
        <el-form-item label="员工状态：" prop="status">
          <el-select v-model="empEditInfo.status">
            <el-option 
              v-for="item in statusList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职位：" prop="positionId">
          <el-select v-model="empEditInfo.positionId" :disabled="!empEditInfo.deptName" @change="getJobNodeData">
            <el-option 
              v-for="item in jobOptions"
              :key="item.positionId"
              :value="item.positionId"
              :label="item.positionName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职级：" prop="positionRankName">
          <el-select v-model="empEditInfo.positionRankName" multiple :disabled="!empEditInfo.positionId" @click.native.stop="getPositionRank()" @change="changeRank">
            <!-- <el-option 
              v-for="item in positionRankList"
              :key="item.id"
              :value="item.id"
              :label="item.rankLevel"
            /> -->
          </el-select>
        </el-form-item>
        <el-form-item label="岗位等级：" prop="stationId">
          <el-select v-model="empEditInfo.stationId" filterable>
            <el-option 
              v-for="item in stationOptions"
              :key="item.stationId"
              :value="item.stationId"
              :label="item.levelAndName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="证件类型：" prop="credentialsType">
          <el-select v-model="empEditInfo.credentialsType" placeholder="请选择证件类型">
            <el-option 
              v-for="item in credentialsTypeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码：" prop="credentialsNumber">
          <el-input v-model="empEditInfo.credentialsNumber" @blur="getBirthday(empEditInfo.credentialsNumber)" placeholder="请输入证件号码"/>
        </el-form-item>
        <el-form-item label="入职日期：" prop="entryTime">
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-model="empEditInfo.entryTime"
            type="date"
            placeholder="选择入职日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="转正日期：" prop="regularTime">
          <el-date-picker
            v-model="empEditInfo.regularTime"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择转正日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出生日期：">
          <el-date-picker
            disabled
            v-model="empEditInfo.birthday"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学历：" prop="educationId">
          <el-select v-model="empEditInfo.educationId" placeholder="请选择学历">
            <el-option 
              :value="empEditInfo.educationId"
              :label="empEditInfo.educationName"
            >
              <el-tree
                v-model="empEditInfo.educationId"
                class="filter-tree"
                :data="educationOptions"
                :props="defaultProps"
                @node-click="getEducationNode"
                ref="tree">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="edit-job-btn">
        <el-button size="mini" @click="editDialog = false,getDetail()">取消</el-button>
        <el-button type="primary" size="mini" @click="confirmEdit()">确定</el-button>
      </div>
    </el-dialog>
    
    <!-- 职级选择 -->
    <el-dialog :visible.sync="positionRankDialog" :close-on-click-modal="false" :before-close="cancelSetRank" title="选择职级" width="800px" top="300px" >
      <div class="dialog-box" v-if="filterPositionList.length > 0">
        <div v-for="item in filterPositionList" :key="item.positionRankId" class="rank-check">
          <p v-if="item.list.length > 0">{{item.name}}</p>
          <el-radio-group v-model="item.rankId" class="radio-group-rank">
            <el-radio v-for="el in item.list" :key="el.positionRankId" :label="el.positionRankId" @click.native.prevent="changeRadio($event,item,el.positionRankId)">{{el.rankLevel}}({{el.description}})</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div slot="footer">
        <el-button size="mini" @click="cancelSetRank()">取消</el-button>
        <el-button size="mini" type="primary" @click="setPositionRank(filterPositionList)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import detailHead from "@/page/index/top/index";
import {
  editEmp,
  getStaffEmpDetail,
  setEmpStatus,
  repeatDeptList
} from "@/api/admin/user";
import accountHistory from "@/components/staff/account-history";
import { fetchNewTree, getStationList } from "@/api/admin/dept";
import * as CodeMsg from "@/api/common/CodeChange"
import { deptRoleList } from "@/api/admin/role";
import operateLog from "@/components/staff/operate-log";
import sysLog from "@/components/staff/sys-log";
import jobInfo from '@/components/staff/job-info'
import { getPosition, listPositionRankByPositionId, getEducationOptions, getDefaultByDeptId } from "@/api/staff/index";
import { mapGetters } from 'vuex';
import * as staffData from '@/components/staff/staff'
export default {
  components: {
    accountHistory,
    operateLog,
    detailHead,
    sysLog,
    jobInfo
  },
  data() {
    return {
      defaultProps: {
        label: "name",
        value: "id",
      },
      positionRankDialog: false,
      positionList: [],
      rankId:'',
      tab: '0',
      selectedRank: [],
      positionRankName: [],

      roleIdsList: [],
      editDialog: false,
      id: "",
      infoConfirm: "",
      imgBaseUrl:
        process.env.NODE_ENV === "production"
          ? "//static.wotao.com/"
          : "//static-tst.wotao.com/",
      rolesOptions: [],
      rolesValue: [],
      deptValue: "",
      treeDeptData: [],
      empInfo: {},
      empEditInfo: {},
      empName: "",
      activeName: "four",
      repeatDeptOptions: [],
      sexList: staffData.sexList,
      statusList: staffData.statusList,
      credentialsTypeList: staffData.credentialsTypeList,
      educationOptions: [],
      jobOptions: [],
      stationOptions: [],
      positionRankList: [],
      empRules:{
        name: [{required: true, message:'请输入姓名,不超过十个字符', trigger:'blur'}],
        sex: [{required: true, message:'请选择性别', trigger:'blur'}],
        deptId: [{required: true, message:'请选择所属部门', trigger:'blur'}],
        businessGroupId: [{required: true, message:'请选择查重部门', trigger:'blur'}],
        status: [{required: true, message:'请选择员工状态', trigger:'blur'}],
        stationId: [{required: true, message:'请选择岗位等级', trigger:'blur'}],
        positionId: [{required: true, message:'请选择职位', trigger:'blur'}],
        positionRankName: [{required: true, message:'请选择职级', trigger:'blur'}],
        credentialsType: [{required: true, message:'请选择证件类型', trigger:'blur'}],
        credentialsNumber: [{required: true, message:'请输入证件号码'}],
        entryTime: [{required: true, message:'请选择入职日期', trigger:'blur'}],
        // regularTime: [{required: true, message:'请选择转正日期', trigger:'blur'}],
        educationId: [{required: true, message:'请选择学历', trigger:'blur'}]
      }
    };
  },
  computed: {
    ...mapGetters(['permissions']),
    filterPositionList(){
      return this.positionList.filter(item => item.list.length > 0);
    },
  },
  created() {
    this.empName = this.$route.query.empName;
    this.id = this.$route.query.id;
  },
  methods: {
    changeRadio(el,item,val){
      this.$nextTick(()=>{
        if(el.target.tagName === 'INPUT'){ 
          return;
        }else{
          if(item.rankId == val && item.flag != 1 ){
            this.$set(item,'rankId',null);
            this.$set(item, 'flag', 1);
          }else{
            this.$set(item,'rankId', val);
            this.$set(item, 'flag', 0);
          }
        }
      })
      this.$forceUpdate();
    },
    cancelSetRank(){
      this.filterPositionList.forEach(item => {
        item.list.forEach(element => {
          if(this.empEditInfo.positionRankIds.includes(element.positionRankId)){
            this.$set(item,'rankId',element.positionRankId);
          }
        });
      });
      this.positionRankDialog = false;
    },
    changeRank(val){
      this.empEditInfo.positionRankIds = [];
      this.selectedRank = [];
      this.positionList.forEach(item => {
        item.list.forEach(el => {
          item.rankId = '';
          if(val.includes(el.rankLevel)){
            item.rankId = el.positionRankId;
            this.empEditInfo.positionRankIds.push(el.positionRankId)
            this.selectedRank.push(el);
          }
        });
      });
    },
    getEducationNode(val){
      this.empEditInfo.educationId = val.id;
      this.empEditInfo.educationName = val.name;
    },
    setPositionRank(val){
      let rankInfo = val.filter(item => item.list.length > 0);
      this.selectedRank = [];
      rankInfo.forEach(el => {
        if(el.rankId != null){
          el.list.forEach(element => {
            if(element.positionRankId == el.rankId){
              this.selectedRank.forEach( (el, index) => {
                if(el.category == element.category){
                  this.selectedRank.splice(index, 1);
                }
              });
              this.selectedRank.push(element);
            }
          });
        }else{
          el.list.forEach(element => {
            this.selectedRank.forEach( (el, index) => {
              if(el.positionRankId == element.positionRankId){
                this.selectedRank.splice(index, 1);
              }
            });
          });
        };
      });
      this.empEditInfo.positionRankIds = [];
      this.empEditInfo.positionRankName = [];
      this.selectedRank = [...new Set(this.selectedRank)];
      this.selectedRank.forEach( item => {
        this.empEditInfo.positionRankName.push(item.rankLevel);
        this.empEditInfo.positionRankIds.push(item.positionRankId);
      });
      if(this.selectedRank.length == 0){
        this.$message.warning('请选择至少一个职级！')
      }else{
        this.positionRankDialog = false;
      }
    },
    getPositionRank(){
      this.filterPositionList.forEach(item => {//原来选中的数据回显
        item.list.forEach(element => {
          if(this.empEditInfo.positionRankIds.includes(element.positionRankId)){
            this.$set(item,'rankId',element.positionRankId);
          }
        });
      });
      this.positionRankDialog = true;
    },
    getJobNodeData(val, status){
      if(!status){
        this.empEditInfo.positionRankIds = [];
        this.empEditInfo.positionRankName = [];
        this.empInfo.positionRankIds = [];
        this.selectedRank = [];
        this.positionList.forEach(item => {
          item.rankId = null
        });
      }
      this.positionList = [];
      if(val){
        listPositionRankByPositionId(val).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            let managements = {
              name: '技术类',
              category: '0',
              list: []
            }
            let technicals = {
              name: '管理类',
              category: '2',
              list: []
            }
            let markets = {
              name: '市场类',
              category: '1',
              list: []
            }
            res.data.data.forEach( item => {
              if(item.category == 0){
                managements.list.push(item)
              }
              if(item.category == 1){
                markets.list.push(item)
              }
              if(item.category == 2){
                technicals.list.push(item)
              }
            });
            this.positionList.push(markets,managements,technicals);
            this.positionList.forEach(item => {
              item.list.forEach(el => {
                if(this.empInfo.positionRankIds.includes(el.positionRankId)){
                  item.rankId = el.positionRankId
                  this.selectedRank.push(el);
                }
              });
            });
          }
        })
      }
    },
    confirmEdit(){
      let param = {
        name: this.empEditInfo.name,
        sex: this.empEditInfo.sex,
        deptId: this.empEditInfo.deptId,
        businessGroupId: this.empEditInfo.businessGroupId,
        number: this.empEditInfo.number,
        status: this.empEditInfo.status,
        postId: this.empEditInfo.postId,
        stationId: this.empEditInfo.stationId,
        positionId: this.empEditInfo.positionId,
        positionRankIds: this.empEditInfo.positionRankIds,
        credentialsType: this.empEditInfo.credentialsType,
        credentialsNumber: this.empEditInfo.credentialsNumber,
        entryTime: this.empEditInfo.entryTime,
        regularTime:this.empEditInfo.regularTime,
        birthday: this.empEditInfo.birthday,
        educationId: this.empEditInfo.educationId,
        userId: this.empInfo.userId,
        username: this.empInfo.username,
        role: this.roleIdsList
      }
      this.$refs.empEditInfo.validate(valid=>{
        if(valid){
          editEmp(param).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: this.$t("alert.sucessEdit"),
                offset:300
              });
              this.getDetail();
              this.editDialog = false;
            }
          });
        }else{
          return false;
        };
      })
    },
    getBirthday(userCard){
      let yearBirth = userCard.substring(6, 10);
      let monthBirth = userCard.substring(10, 12);
      let dayBirth = userCard.substring(12, 14);
      this.empEditInfo.birthday = yearBirth+'-'+monthBirth+'-'+dayBirth
    },
    deptNodeClick(val){
      this.empEditInfo.positionId = null;
      this.empEditInfo.positionRankName = [];
      this.empEditInfo.positionRankIds = [];
      this.selectedRank = [];
      getPosition(val.id).then(res=>{
        this.jobOptions = res.data.data
      })
      this.empEditInfo.deptId = val.id;
      this.empEditInfo.deptName = val.name;
      this.getRepeatDeptList(val);
    },
    nodeClick(val){
      getPosition(val.id).then(res=>{
        this.jobOptions = res.data.data
      })
      this.empEditInfo.deptId = val.id;
      this.empEditInfo.deptName = val.name;
      this.getRepeatDeptList(val);
    },
    getRepeatDeptList(val){
      repeatDeptList().then(res=>{
        this.empEditInfo.businessGroupId = '';
        this.repeatDeptOptions = res.data.data;
        getDefaultByDeptId(val.id).then(res=>{//获取查重部门
          if(res.data.code == CodeMsg.CODE_0){
            this.empEditInfo.businessGroupId = res.data.data.id
          }else{
            this.$message({
              type:'warning',
              message: res.data.msg
            })
          }
        })
      })
    },
    findChild(data,parentId,repeatId){
      if(data.children &&data.children.length > 0){
        for (const element of data.children) {
          if(parentId == element.id){
            this.empEditInfo.businessGroupId = repeatId
            return ;
          }else{
            this.findChild(data.children);
          };
        }
        // data.children.forEach(element => {
        // });
      }
    },
    setEmp(val) {
      let params = {
        userId: this.empInfo.userId,
        lockFlag: String(val),
        username: this.empInfo.username,
      };
      setEmpStatus(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "操作成功！",
          });
          this.getDetail();
        }
      });
    },
    getEmpList() {
      fetchNewTree({menuFlag: "emp_list"}).then( res => {
        this.treeDeptData = res.data.data;
        this.treeDeptData.forEach((item) => {
          if (item.id == this.empInfo.deptId) {
            this.deptValue = item.name;
            this.getRepeatDeptList({id: item.id, parentId: item.parentId, children:item.children});
          }
        });
      });
    },
    getRoleList() {
      deptRoleList().then((res) => {
        this.rolesOptions = res.data.data;
        this.rolesValue = [];
        this.rolesOptions.forEach((item) => {
          this.empInfo.roleList.forEach((val) => {
            if (item.roleId == val.roleId) {
              this.rolesValue.push(item.roleName);
              return;
            }
          });
        });
      });
    },
    handleUpdate() {
      this.getDetail();
      this.editDialog = true;
    },
    getDetail() {
      let params = {
        id: this.id,
      };
      getStaffEmpDetail(params).then((res) => {
        if(res.data.code == CodeMsg.CODE_0){
          this.empInfo = res.data.data;
          this.roleIdsList = [];
          this.empInfo.roleList.forEach(el => {
            this.roleIdsList.push(el.roleId);
          });
          this.empEditInfo = JSON.parse(JSON.stringify(this.empInfo));
          this.$nextTick(() => {
            this.getEmpList();
            this.getRoleList();
            this.getStationList();
            this.getEducation();
            this.nodeClick({id:this.empInfo.deptId,name:this.empInfo.deptName},true);
            this.getJobNodeData(this.empInfo.positionId, true);
            if(this.empInfo.businessGroupId){
              this.empEditInfo.businessGroupId = this.empInfo.businessGroupId;
            }else{
              this.getRepeatDeptList({id: this.empInfo.deptId, parentId: null, children: null});
            };
          });
        };
      });
    },
    getEducation(){
      getEducationOptions().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.educationOptions = res.data.data;
        }
      })
    },
    getStationList() {
      getStationList().then(res => {
        this.stationOptions = res.data.data;
      })
    },
    startStatus(val) {
      val == 0
        ? (this.infoConfirm = this.$t("button.enable"))
        : (this.infoConfirm = this.$t("button.disabled"));
      this.$confirm(
        this.$t("button.confirm") +
          this.infoConfirm +
          this.$t("message.staffDelete"),
        this.$t("title.notice"),
        {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        }
      ).then(() => {
        this.setEmp(val);
      });
    },
    handleClick() {},
  },
  mounted() {
    this.getDetail();
  },
};
</script>

<style scoped>
.radio-group-rank{
  display: grid;
  grid-template-columns: repeat(5,1fr);
  grid-gap:10px;
}
.staff_detail {
  width: 100%;
  background: #ffffff;
  min-height: 924px;
  margin-left: 10px;
}
.staff_header {
  width: 80%;
  height: 200px;
  display: flex;
  margin-left: 5%;
}
.header_left {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header_left img {
  display: flex;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
}
.nickName-sty {
  width: 128px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  position: absolute;
  bottom: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}
.header_button {
  margin-top: 60px;
  margin-left: 25%;
}
.right_header {
  margin-top: 60px;
}
.right_header > span:nth-of-type(1) {
  font-weight: bold;
  font-size: 14px;
}
.right_header > span:nth-of-type(2) {
  margin-left: 25px;
  font-size: 14px;
}
.right_content {
  margin-top: 8px;
  font-size: 14px;
}
.right_content span {
  margin-right: 20px;
}
.right_footer {
  margin-top: 8px;
  font-size: 14px;
}
.right_footer span {
  margin-right: 5px;
}
.staff_content {
  width: 80%;
  margin-left: 5%;
}
.staff_detail_btn {
  width: 70px;
  margin-left: 20px;
}
.edit-box >>> .el-input__inner{
  width: 300px;
}
.edit-job-btn{
  text-align: center;
}
.dialog-box{
  min-height: 250px;
}
.rank-check{
  margin: 0;
}
</style>