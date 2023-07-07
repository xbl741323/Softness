`<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->

<template>
  <!-- class="app-container calendar-list-container" -->
  <div>
    <div class="filter-container">
      <el-button-group>
        <el-button
          v-if="deptManager_btn_add"
          type="primary"
          icon="plus"
          @click="handlerAdd"
          >添加
        </el-button>
        <el-button
          v-if="deptManager_btn_edit"
          type="primary"
          icon="edit"
          @click="handlerEdit"
          >编辑
        </el-button>
        <el-button
          v-if="deptManager_btn_del"
          type="primary"
          icon="delete"
          @click="handleDelete"
          >删除
        </el-button>
      </el-button-group>
    </div>

    <el-row>
      <el-col :span="8" style="margin-top: 15px">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          class="filter-tree"
          node-key="id"
          highlight-current
          default-expand-all
          @node-click="getNodeData"
        />
      </el-col>
      <el-col :span="16" style="margin-top: 15px">
        <el-card class="box-card">
          <el-form
            ref="form"
            :label-position="labelPosition"
            :rules="rules"
            :model="form"
            label-width="110px"
          >
            <el-form-item label="父级节点" prop="parentId">
              <el-input
                v-model="form.parentId"
                disabled
                placeholder="请输入父级节点"
              />
            </el-form-item>
            <el-form-item v-if="formEdit" label="节点编号" prop="deptId">
              <el-input
                v-model="form.deptId"
                :disabled="formEdit"
                placeholder="节点编号"
              />
            </el-form-item>
            <el-form-item label="部门名称" prop="name">
              <el-input
                v-model="form.name"
                :disabled="formEdit"
                placeholder="请输入名称"
              />
            </el-form-item>
            <el-form-item label="负责人" prop="userId">
              <el-cascader
                filterable
                ref="myCascader"
                v-model="form.userId"
                clearable
                :options="users"
                :disabled="formEdit"
                style="width: 300px"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input
                v-model="form.sort"
                :disabled="formEdit"
                type="number"
                placeholder="请输入排序"
              />
            </el-form-item>
            <el-form-item
              v-if="formStatus == 'create' || formStatus == 'update'"
              label="创建查重部门"
              prop="createBusinessGroup"
            >
              <el-radio
                v-model="form.createBusinessGroup"
                :label="true"
                @change="newName"
                >是</el-radio
              >
              <el-radio
                v-model="form.createBusinessGroup"
                :label="false"
                @change="update"
                >否</el-radio
              >
            </el-form-item>
            <el-form-item
              v-if="
                form.createBusinessGroup &&
                (formStatus == 'create' || formStatus == 'update')
              "
              prop="businessGroupName"
            >
              <el-input
                v-model="form.businessGroupName"
                placeholder="请自定义查重部门名称"
              />
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
              <el-button type="primary" @click="update">更新 </el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
              <el-button type="primary" @click="create">保存 </el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchTree,
  getObj,
  putObj,
  getEmpList,
} from "@/api/admin/dept";
import { mapGetters } from "vuex";

export default {
  name: "Dept",
  data() {
    return {
      users: [],
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: "",
      typeOptions: ["0", "1"],
      methodOptions: ["GET", "POST", "PUT", "DELETE"],
      listQuery: {
        name: undefined,
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      rules: {
        parentId: [
          { required: true, message: "请输入父级节点", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "请输入节点编号", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
          {
            min: 3,
            max: 32,
            message: "长度在 3 到 32 个字符",
            trigger: "blur",
          },
        ],
        // userId: [{ required: true, message: "请选择负责人", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序值", trigger: "blur" }],
        businessGroupName: [
          { required: true, message: "请输入查重部门名称", trigger: "blur" },
        ],
      },
      labelPosition: "right",
      form: {
        name: undefined,
        sort: undefined,
        parentId: undefined,
        deptId: undefined,
        userId: [],
        createBusinessGroup: false,
      },
      currentId: 0,
      deptManager_btn_add: false,
      deptManager_btn_edit: false,
      deptManager_btn_del: false,
    };
  },
  created() {
    this.getList();
    this.deptManager_btn_add = this.permissions["sys_dept_add"];
    this.deptManager_btn_edit = this.permissions["sys_dept_edit"];
    this.deptManager_btn_del = this.permissions["sys_dept_del"];
  },
  computed: {
    ...mapGetters(["elements", "permissions"]),
  },
  methods: {
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children) {
          if (data[i].children.length < 1) {
            // children若为空数组，则将children设为undefined
            data[i].children = undefined;
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].children);
          }
        }
      }
      return data;
    },
    getList() {
      fetchTree(this.listQuery).then((response) => {
        this.treeData = response.data.data;
      });
      getEmpList().then((res) => {
        this.users = this.getTreeData(res.data.data);
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      if (this.formEdit) {
        this.formStatus = "update";
      }
      getObj(data.id).then((response) => {
        this.form = response.data.data;
        this.$set(
          this.form,
          "createBusinessGroup",
          response.data.data.businessGroupName ? true : false
        );
        // this.createBusinessGroup = response.data.data.businessGroupName ? true : false;
      });
      this.currentId = data.id;
    },
    handlerEdit() {
      if (this.form.deptId) {
        this.formEdit = false;
        this.formStatus = "update";
      }
    },
    handlerAdd() {
      this.resetForm();
      this.formEdit = false;
      this.formStatus = "create";
    },
    handleDelete() {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delObj(this.currentId).then((res) => {
          if(res.data.code == 0){
            this.getList();
            this.resetForm();
            this.onCancel();
            this.$notify.success("删除成功");
          }else{
            this.$notify.warning(res.data.msg);
          }
        });
      });
    },
    newName() {
      if (this.form.businessGroupName) {
      } else if (this.form.name) {
        this.$set(this.form, "businessGroupName", this.form.name);
      }
    },
    update() {
      if (typeof this.form.userId == "object" && this.form.userId != null) {
        this.form.userId = this.form.userId.join(",");
      }
      if(this.formStatus != 'create'){
        this.$refs.form.validate((valid) => {
        if (!valid) return;
          putObj(this.form).then((res) => {
            if (res.data.code == 1) {
              this.$message({
                type: "warning",
                message: res.data.msg,
              });
              this.form.createBusinessGroup = true;
            } else {
              this.getList();
              this.onCancel();
              this.$notify.success("更新成功");
            }
          });
        });
      }
    },
    create() {
      if (typeof(this.form.userId) == 'object') {
        this.form.userId = this.form.userId.join(",");
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        addObj(this.form).then(res => {
          this.getList();
          this.onCancel();
          if(res.data.code ==0){ 
            this.$notify.success("创建成功"); 
            return;
          }else{
            this.$message({
              type:'error',
              message: res.data.msg
            })
          }
        });
      });
    },
    onCancel() {
      this.formEdit = true;
      this.formStatus = "";
      this.form = {};
    },
    resetForm() {
      this.form = {
        parentId: this.currentId,
        createBusinessGroup: false,
      };
    },
  },
};
</script>

