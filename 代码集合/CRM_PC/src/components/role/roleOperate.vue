<template>
  <div>
    <el-dialog
      :visible.sync="countDialog"
      :close-on-click-modal="false"
      :title="$t('message.numberOfUsers')"
    >
      <div >
        <el-button class="role-sty" type="primary" @click="addDialog = true">{{
          $t("message.addPeople")
        }}</el-button>
        <avue-crud
          ref="crud"
          :option="option"
          :data="dataList"
          :page.sync="page"
          v-model="form"
          clearable
          @size-change="sizeChange"
          @current-change="currentChange"
          v-if="countDialog"
        >
          <template slot-scope="{data}">
            <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
              <div slot="content">{{data.customerNo}}</div>
              <span>{{data.label}}</span>
            </el-tooltip>
          </template>
          <template slot="user" slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
          <template slot="department" slot-scope="scope">
            <span>{{ scope.row.deptName }}</span>
          </template>
          <template slot="role" slot-scope="scope">
            <span v-for="(item, index) in scope.row.roleList" :key="index"
              >{{ item.roleName
              }}<span v-if="index < scope.row.roleList.length - 1"
                >,</span
              ></span
            >
          </template>
          <template slot="accountStatus" slot-scope="scope">
            <span>{{ scope.row.lockFlag | flagFilters(te) }}</span>
          </template>
          <template slot="menu" slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              @click="handleCancel(scope.row)"
              >{{ $t("message.cancelUse") }}
            </el-button>
          </template>
        </avue-crud>
      </div>
    </el-dialog>
    <!-- 添加操作 -->
    <el-dialog
      :visible.sync="addDialog"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :title="$t('message.addRoleUser')"
      width="23%"
    >
      <el-form class="form-sty" :model="addForm">
        <el-form-item :label="$t('message.roleName')">
          <span>{{ roleInfo.roleName }}</span>
        </el-form-item>
        <el-form-item :label="$t('message.chooseMan')">
          <el-cascader
            :key="isResourceShow"
            ref="man"
            filterable
            clearable
            collapse-tags
            :show-all-levels="false"
            @change="changeMan()"
            :options="empList"
            :before-filter="beforeFilter"
            v-model="addForm.man"
            :props="{ value: 'customerId', label: 'label', multiple: true }"
          >
            <template slot-scope="{data}">
              <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                <div slot="content">{{data.customerNo}}</div>
                <span>{{data.label}}</span>
              </el-tooltip>
            </template>
          </el-cascader>
        </el-form-item>
        <div class="role-btn-sty">
          <el-button
            class="confirm-sty"
            type="primary"
            :disabled="roleBolong == '' ? true : false"
            @click="addOperate"
            >{{ $t("button.confirm") }}</el-button
          >
          <el-button type="primary" @click="handleClose">{{
            $t("button.cancel")
          }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { tableOption } from "@/const/crud/role/role";
import * as CodeMsg from "@/api/common/CodeChange"
import { getEmpList } from "@/api/clue/clue";
import {
  getRoleList,
  addRoleEmp,
  delRoleEmp,
  getRoleData,
} from "@/api/admin/role";
export default {
  data() {
    return {
      isResourceShow: 0,
      roleInfo: {},
      addDialog: false,
      countDialog: false,
      option: tableOption,
      empList: [],
      form: {},
      addForm: {
        man: "",
      },
      roleBolong: "",
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [5, 10],
      },
    };
  },
  filters: {
    flagFilters(val, te) {
      return val == 0 ? te("button.enable") : te("button.disabled");
    },
  },
  methods: {
    //显示工号
    async beforeFilter() {
      let params = {
        roleId: this.roleInfo.roleId,
      };
      await getRoleData(params).then((res) => {
        if (res.data.code == 0) {
          //员工
          this.empList = res.data.data;
        }
      }).catch((err) => {
        return false;
      });
      this.$loop(this.empList[0], this.empList[0])
      return false
    },
    te(val) {
      return this.$t(val);
    },
    showInfo() {
      this.getDropList();
      this.getAllList();
    },
    //取消
    removeRoleEmp(row) {
      let params = {
        roleId: row.roleId,
        userId: row.userId,
      };
      delRoleEmp(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: this.$t("handle.success"),
          });
          this.getDropList();
          this.getAllList();
          this.$emit("refresh");
        }
      });
    },
    //添加角色员工
    addOperate() {
      addRoleEmp(this.roleBolong).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: this.$t("message.addSuccess"),
          });
          this.getDropList();
          this.getAllList();
          this.$emit("refresh");
          this.addDialog = false;
          this.roleBolong = [];
        }
      });
    },
    changeMan(val) {
      this.roleBolong = [];
      this.addForm.man.forEach((item) => {
        this.roleBolong.push({
          roleId: this.roleInfo.roleId,
          userId: item[item.length - 1],
        });
      });
    },
    handleClose() {
      this.addDialog = false;
      this.addForm.man = "";
      this.roleBolong = [];
    },
    handleCancel(row) {
      this.$confirm(
        `确定取消 ${row.userName} 的 ${row.roleName} 角色？`,
        this.$t("message.cancelUse"),
        {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        }
      )
        .then(() => {
          this.removeRoleEmp(row);
        })
        .catch(() => {});
    },
    getDropList() {
      let params = {
        roleId: this.roleInfo.roleId,
      };
      getRoleData(params)
        .then((res) => {
          //员工
          this.empList = res.data.data;
          console.log(this.empList, "输出empList");
          // this.empList.forEach(item=>{
          //   if(item.children == null){
          //     item.disabled = true
          //   }else{
          //    item.children.forEach(it=>{
          //      if(it.children == null){
          //        it.disabled = true
          //      }
          //    })
          //   }
          // })
          console.log(this.empList, "输出empList2332");
        })
        .catch((err) => {
          return false;
        });
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      let params = {
        roleId: this.roleInfo.roleId,
        size: this.page.pageSize,
        current: this.page.currentPage,
      };
      getRoleList(params).then((res) => {
        console.log(res.data.data.total);
        this.$set(this.page, 'total', res.data.data.total);
        // this.page.total = res.data.data.total;
        this.dataList = res.data.data.records;
      });
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getAllList();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getList();
    },
  },
};
</script>

<style scoped>
.role-sty {
  margin: 0px 6px 10px 6px;
}
.form-sty {
  margin: -10px 0px 0 20px;
}
.role-btn-sty {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.confirm-sty {
  margin-right: 30px;
}
</style>