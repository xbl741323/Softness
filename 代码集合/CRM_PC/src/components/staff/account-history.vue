<template>
  <div class="login_log">
    <div class="left_span">
      <span></span>
      <span>{{ $t("message.idHistory") }}</span>
    </div>
    <div class="table_main">
      <el-table :data="dataList" border>
        <el-table-column
          prop="createTime"
          :label="$t('label.time')"
          align="center"
          width="400"
        ></el-table-column>
        <el-table-column prop="roleNames" :label="$t('message.role')">
          <template slot-scope="scope">
              <el-button
              v-for="(it, indzx) in scope.row.sysRole"
              :key="indzx"
                type="primary"
                @click="permissions.sys_role_perm ? handlePermission(it) : $notAuthorized()"
                style="margin-left: 10px">
                {{ it.roleName }}
              </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 权限 -->
    <el-dialog
      :visible.sync="dialogPermissionVisible"
      :close-on-click-modal="false"
      :title="roleTitle">
      <div class="dialog-main-tree">
      <el-tree
        ref="menuTree"
        :data="treeData"
        :default-checked-keys="checkedKeys"
        :check-strictly="false"
        :props="defaultProps"
        :filter-node-method="filterNode"
        class="filter-tree"
        node-key="id"
        show-checkbox
        highlight-current/>
      </div>
      <div slot="footer"
        class="dialog-footer">
        <el-button
	        type="default"
          size="small"
          @click="cancal()">{{ $t("button.cancel") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, fetchRoleTree, permissionUpd, putObj } from '@/api/admin/role'
import { getHistory, getEmployRole } from "@/api/admin/user";
import { fetchMenuTree } from '@/api/admin/menu'
import { mapGetters } from 'vuex';
export default {
  props: ["number"],
  data() {
    return {
      roleTitle:"",
      dialogPermissionVisible:false,
       defaultProps: {
        label: 'name',
        value: 'id'
      },
      treeData:[],
      checkedKeys: [],
      roleList: [],
      dataList: [
        {
          time: "",
          role: "",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
     cancal () {
        this.dialogPermissionVisible = false;
      },
    handlePermission(role) {
      this.roleTitle = role.roleName
      fetchRoleTree(role.roleId)
        .then(response => {
         this.checkedKeys = response.data.data
         return fetchMenuTree()
        })
        .then(response => {
          this.treeData = response.data.data
          // 解析出所有的太监节点
          this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
          this.dialogPermissionVisible = true
        })
    },
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter(id => id === item.id))
        }
      }
      return temp
    },
    getData() {
      getHistory(this.number).then((res) => {
        this.dataList = res.data.data;
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style>
.left_span {
  width: 100px;
  height: 25px;
  display: flex;
  margin: 40px 0 25px 0px;
}
.left_span > span:nth-of-type(1) {
  display: inline-block;
  width: 10px;
  height: 25px;
  background: #108ee9;
}
.left_span > span:nth-of-type(2) {
  display: flex;
  width: 80px;
  height: 25px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #666666;
  font-weight: bold;
}
</style>