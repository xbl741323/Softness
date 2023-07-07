<template>
  <basic-container>
    <p class="hot_title">指定权限设置</p>
    <div>
      <avue-crud
        ref="crud"
        class="batch-choose"
        :data="tableData"
        :option="listOption"
        :page.sync="page"
        @on-load="getAppoint"
        @size-change="sizeChange"
        @current-change="currentChange">
        <template slot="name" slot-scope="scope">
          <span v-if="scope.row.id != 6 && scope.row.id != 8">{{ scope.row.name }}</span>
          <div v-else>
            <div v-if="scope.row.permissionEngineer && scope.row.id == 6">
              <span>默认工程师：</span>
              <span v-if="scope.row.permissionEngineer.defaultPatentEngineerName">专利：{{ scope.row.permissionEngineer.defaultPatentEngineerName }}</span>
              <span v-if="scope.row.permissionEngineer.defaultTrademarkEngineerName">；商标：{{ scope.row.permissionEngineer.defaultTrademarkEngineerName }}</span>
              <span v-if="scope.row.permissionEngineer.defaultCopyrightEngineerName">；版权：{{ scope.row.permissionEngineer.defaultCopyrightEngineerName }}</span>
              <span v-if="scope.row.permissionEngineer.defaultOtherEngineerName">；其他：{{ scope.row.permissionEngineer.defaultOtherEngineerName}}</span>
            </div>
            <div v-if="scope.row.id == 8">
               <div> 默认工程师：{{ scope.row.defaultName }} 武汉工程师：{{ scope.row.permissionEngineer.defaultOtherEngineerName }}</div>
            </div>
          </div>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" icon="el-icon-view" @click="handldEdit(scope.row)">编辑</el-button>
        </template>
      </avue-crud>
      <el-dialog
        title="编辑指定权限"
        v-if="centerDialogVisible"
        :close-on-click-modal="false"
        :visible.sync="centerDialogVisible"
        width="680px"
        center>
        <el-form :model="appointForm" :rules="rules" ref="appointForm">
          <el-form-item label="权限名称：">
            <span>{{ appointForm.permissionName }}</span>
          </el-form-item>
          <el-form-item label="权限人：" prop="radio" v-if="appointForm.id != 6 && appointForm.id != 8">
            <span v-if="appointForm.id == 1 || appointForm.id == 2 || appointForm.id == 3 || appointForm.id == 4" style="margin-right: 20px">
              <el-radio v-model="radio" label="1" v-if="notShow == true">不限</el-radio>
              <el-radio v-model="radio" label="2">自定义</el-radio>
            </span>
            <template v-if="radio == 2 || appointForm.id == 9 || appointForm.id == 13">
              <el-cascader
                ref="cascater"
                :key="refreshKey"
                clearable
                filterable
                collapse-tags
                style="width: 250px"
                :show-all-levels="false"
                :options="companyList"
                v-model="appointPerson"
                :before-filter="beforeFilter"
                @change="handldeChange"
                @remove-tag="removeTag"
                :props="{ value: 'customerId', label: 'label', multiple: true, emitPath: false}">
                <template slot-scope="{ data }">
                  <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                    <div slot="content">{{ data.customerNo }}</div>
                    <span>{{ data.label }}</span>
                  </el-tooltip>
                </template>
              </el-cascader>
              <span class="parallel" v-if="appointForm.id != 1 && appointForm.id != 2 && appointForm.id != 3 && appointForm.id != 4">可多选,最多10人，已选择{{ this.appointPerson.length }}人</span>
            </template>
          </el-form-item>
          <el-form-item label="默认工程师：" prop="defaultEngineer" v-if="appointForm.id == 6 || appointForm.id == 8">
            <div v-if="appointForm.id == 8">
              <el-cascader
                ref="cascater"
                :key="defaultKey"
                clearable
                filterable
                collapse-tags
                style="width: 250px"
                :show-all-levels="false"
                :options="companyList"
                v-model="defaultEngineer"
                :before-filter="beforeFilter"
                @change="handldeDefaultChange"
                @visible-change="removeDefault($event, defaultEngineer)"
                :props="{ value: 'customerId', label: 'label', multiple: true, emitPath: false}">
                <template slot-scope="{ data }">
                  <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                    <div slot="content">{{ data.customerNo }}</div>
                    <span>{{ data.label }}</span>
                  </el-tooltip>
                </template>
              </el-cascader>
              <span class="parallel">可多选，最多10人，已选择{{ defaultEngineer.length }}人</span>
            </div>
          </el-form-item>
          <!-- 武汉默认工程师 -->
          <el-form-item label="武汉默认工程师：" v-if="appointForm.id == 8">
            <div v-if="appointForm.id == 8">
              <el-cascader
                ref="cascater"
                :key="whKey"
                clearable
                filterable
                collapse-tags
                style="width: 250px"
                :show-all-levels="false"
                :options="companyList"
                v-model="whEngineer"
                :before-filter="beforeFilter"
                @change="handldeWhChange"
                @visible-change="removeWh($event, whEngineer)"
                :props="{ value: 'customerId', label: 'label', multiple: true, emitPath: false}">
                <template slot-scope="{ data }">
                  <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                    <div slot="content">{{ data.customerNo }}</div>
                    <span>{{ data.label }}</span>
                  </el-tooltip>
                </template>
              </el-cascader>
              <span class="parallel">可多选，最多10人，已选择{{ whEngineer[0] == 0?0: whEngineer.length }}人</span>
            </div>
          </el-form-item>
          <div v-if="appointForm.id == 6" style="margin-left: 6px">
            <el-form-item label="专利工程师：">
              <el-cascader
                ref="cascater"
                :key="patentKey"
                clearable
                filterable
                collapse-tags
                style="width: 250px"
                :show-all-levels="false"
                :options="companyList"
                :before-filter="beforeFilter"
                v-model="patentEngineer"
                @visible-change="removePatent($event, patentEngineer)"
                @change="handldePatentChange"
                :props="{ value: 'customerId', label: 'label', multiple: true, emitPath: false }">
                <template slot-scope="{ data }">
                  <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                    <div slot="content">{{ data.customerNo }}</div>
                    <span>{{ data.label }}</span>
                  </el-tooltip>
                </template>
              </el-cascader>
              <span class="parallel">可多选，最多10人，已选择{{ patentEngineer.length }}人</span>
            </el-form-item>
            <el-form-item label="商标工程师：">
              <el-cascader
                ref="cascater"
                :key="brandKey"
                clearable
                filterable
                collapse-tags
                style="width: 250px"
                :show-all-levels="false"
                :options="companyList"
                :before-filter="beforeFilter"
                v-model="brandEngineer"
                @visible-change="removeBrand($event, brandEngineer)"
                @change="handldeBrandChange"
                :props="{ value: 'customerId', label: 'label', multiple: true, emitPath: false}">
                <template slot-scope="{ data }">
                  <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                    <div slot="content">{{ data.customerNo }}</div>
                    <span>{{ data.label }}</span>
                  </el-tooltip>
                </template>
              </el-cascader>
              <span class="parallel">可多选，最多10人，已选择{{ brandEngineer.length }}人</span>
            </el-form-item>
            <el-form-item label="版权工程师：">
              <el-cascader
                ref="cascater"
                :key="copyrightKey"
                clearable
                filterable
                collapse-tags
                style="width: 250px"
                :show-all-levels="false"
                :options="companyList"
                :before-filter="beforeFilter"
                v-model="copyrightEngineer"
                @visible-change="removeCopyright($event, copyrightEngineer)"
                @change="handldeCopyrightChange"
                :props="{ value: 'customerId', label: 'label', multiple: true, emitPath: false}">
                <template slot-scope="{ data }">
                  <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                    <div slot="content">{{ data.customerNo }}</div>
                    <span>{{ data.label }}</span>
                  </el-tooltip>
                </template>
              </el-cascader>
              <span class="parallel">可多选，最多10人，已选择{{ copyrightEngineer.length }}人</span>
            </el-form-item>
            <el-form-item label="其他工程师：">
              <el-cascader
                ref="cascater"
                :key="otherKey"
                clearable
                filterable
                collapse-tags
                style="width: 250px"
                :show-all-levels="false"
                :options="companyList"
                :before-filter="beforeFilter"
                v-model="otherEngineer"
                @visible-change="removeOther($event, otherEngineer)"
                @change="handldeOtherChange"
                :props="{ value: 'customerId',  label: 'label', multiple: true, emitPath: false}">
                <template slot-scope="{ data }">
                  <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                    <div slot="content">{{ data.customerNo }}</div>
                    <span>{{ data.label }}</span>
                  </el-tooltip>
                </template>
              </el-cascader>
              <span class="parallel">可多选，最多10人，已选择{{ otherEngineer.length }}人</span>
            </el-form-item>
          </div>
          <div v-if="radio == 2 && appointForm.id != 5 && appointForm.id != 6 && appointForm.id != 7 && appointForm.id != 8 && appointForm.id != 9 && appointForm.id != 10 && appointForm.id != 13 "
            :class="[notShow == false ? 'teshu' : '', 'tip']">
            可多选,最多10人，已选择{{ appointPerson.length }}人
          </div>
          <div style="margin-top: 30px">
            说明：指定权限人前，请先配置其菜单权限，确保其可使用相应菜单。
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="appointForm.id == 6" type="primary" @click="handleProperty">确 定</el-button>
          <el-button v-else type="primary" @click="handleUpdata">确 定</el-button>
          <el-button @click="handleCancle">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import { getList, editAppoint } from "@/api/admin/appoint";
import * as CodeMsg from "@/api/common/CodeChange";
import { getEmpList } from "@/api/clue/clue";
import { listOption } from "@/const/crud/admin/appoint";
export default {
  data() {
    return {
      radio: "1",
      notShow: true,
      whKey: 0,
      selectKey: 0,
      refreshKey: 0,
      defaultKey: 0,
      patentKey: 0,
      brandKey: 0,
      copyrightKey: 0,
      otherKey: 0,
      recordList: [],
      companyList: [],
      selectList: [],
      appointPerson: [], // 权限人
      whEngineer: [], // 武汉默认工程师
      defaultEngineer: [],
      patentEngineer: [],
      brandEngineer: [],
      copyrightEngineer: [],
      otherEngineer: [],
      selectiveEngineer: [],
      centerDialogVisible: false,
      params: {},
      page: {
        currentPage: 1,
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
        pageSize: 20,
      },
      listOption: listOption,
      tableData: [],
      appointForm: {},
      rules: {
        radio: [{ required: true, message: "", trigger: "blur" }],
        defaultEngineer: [{ required: true, message: "", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getData();
    this.getSelectData();
  },
  watch: {
    appointPerson: {
      handler(newVal, oldVal) {
        if (newVal.length == 11) {
          this.appointPerson = oldVal;
          --this.refreshKey;
          this.$message({
            message: "最多只能选择10人！",
            duration: 2000,
            type: "warning",
          });
        } else if (newVal.length > 11) {
          this.$message({
            message: "最多只能选择10人！",
            duration: 2000,
            type: "warning",
          });
          this.appointPerson = [];
          newVal.slice(0, 10).forEach((item) => {
            this.appointPerson.push(item);
            ++this.refreshKey;
          });
        }
      },
      deep: true,
      immediate: true,
    },
    defaultEngineer: {
      handler(newVal, oldVal) {
        if (newVal.length > 10) {
          this.$message({
            message: "最多只能选择10项",
            duration: 1500,
            type: "warning",
          });
          this.$nextTick(() => {
            this.defaultEngineer = [];
            newVal.slice(0, 10).forEach((item) => {
              this.defaultEngineer.push(item);
              ++this.defaultKey;
            });
          });
        }
      },
      deep: true,
      immediate: true,
    },
    whEngineer: {
      handler(newVal, oldVal) {
        if (newVal.length > 10) {
          this.$message({
            message: "最多只能选择10项",
            duration: 1500,
            type: "warning",
          });
          this.$nextTick(() => {
            this.whEngineer = [];
            newVal.slice(0, 10).forEach((item) => {
              this.whEngineer.push(item);
              ++this.whKey;
            });
          });
        }
      },
      deep: true,
      immediate: true,
    },
    patentEngineer: {
      handler(newVal, oldVal) {
        if (newVal.length > 10) {
          this.$message({
            message: "最多只能选择10项",
            duration: 1500,
            type: "warning",
          });
          this.$nextTick(() => {
            this.patentEngineer = [];
            newVal.slice(0, 10).forEach((item) => {
              this.patentEngineer.push(item);
              ++this.patentKey;
            });
          });
        }
      },
      deep: true,
      immediate: true,
    },
    brandEngineer: {
      handler(newVal, oldVal) {
        if (newVal.length > 10) {
          this.$message({
            message: "最多只能选择10项",
            duration: 1500,
            type: "warning",
          });
          this.$nextTick(() => {
            this.brandEngineer = [];
            newVal.slice(0, 10).forEach((item) => {
              this.brandEngineer.push(item);
              ++this.brandKey;
            });
          });
        }
      },
      deep: true,
      immediate: true,
    },
    copyrightEngineer: {
      handler(newVal, oldVal) {
        if (newVal.length > 10) {
          this.$message({
            message: "最多只能选择10项",
            duration: 1500,
            type: "warning",
          });
          this.$nextTick(() => {
            this.copyrightEngineer = [];
            newVal.slice(0, 10).forEach((item) => {
              this.copyrightEngineer.push(item);
              ++this.copyrightKey;
            });
          });
        }
      },
      deep: true,
      immediate: true,
    },
    otherEngineer: {
      handler(newVal, oldVal) {
        if (newVal.length > 10) {
          this.$message({
            message: "最多只能选择10项",
            duration: 1500,
            type: "warning",
          });
          this.$nextTick(() => {
            this.otherEngineer = [];
            newVal.slice(0, 10).forEach((item) => {
              this.otherEngineer.push(item);
              ++this.otherKey;
            });
          });
        }
      },
      deep: true,
      immediate: true,
    },
    selectList: {
      handler(newVal, oldVal) {
        this.selectKey++;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    //显示工号
    async beforeFilter() {
      await getEmpList(false).then((res) => {
        if (res.data.code == 0) {
          this.companyList = res.data.data;
        }
      });
      this.$loop(this.companyList[0], this.companyList[0]);
      return false;
    },
    getData() {
      // 组织架构
      getEmpList(false).then((res) => {
        this.recordList = res.data.data;
        this.companyList = res.data.data;
      });
    },
    getSelectData() {
      getEmpList(false).then((res) => {
        this.selectList = res.data.data;
      });
    },
    getAppoint() {
      let param = {
        start: this.page.currentPage,
        size: this.page.pageSize,
      };
      getList(param).then((res) => {
        this.tableData = res.data.data.list;
        this.page.total = res.data.data.total;
      });
    },
    handldeDefaultChange(val) {
      if (val.length == 0) {
        this.forTreeData(this.selectList, 0);
      }
    },
    handldeChange(val) {
      this.appointPerson = val.filter((n) => n);
    },
    handldePatentChange(val) {
      if (val.length == 0) {
        this.forSelectTreeData(this.selectList, 0);
      }
    },
    // 武汉工程师专用
    handldeWhChange(val){
      console.log(val,'输出武汉')
      if (val.length == 0) {
        this.forSelectTreeData(this.selectList, 0);
      }
    },
    handldeBrandChange(val) {
      if (val.length == 0) {
        this.forSelectTreeData(this.selectList, 0);
      }
    },
    handldeCopyrightChange(val) {
      if (val.length == 0) {
        this.forSelectTreeData(this.selectList, 0);
      }
    },
    handldeOtherChange(val) {
      if (val.length == 0) {
        this.forSelectTreeData(this.selectList, 0);
      }
    },
    removeTag(val) {
      var list = JSON.parse(JSON.stringify(this.appointPerson));
      this.appointPerson = [];
      if (list.length > 1) {
        list.slice(0, list.length - 1).forEach((item) => {
          this.appointPerson.push(item);
          ++this.refreshKey;
        });
      } else {
        ++this.refreshKey;
      }
    },
    removeDefault(callback) {
      //只有回调参数为false时才触发
      if (!callback) {
        ++this.defaultKey;
        this.defaultEngineer.forEach((i, key) => {
          this.selectiveEngineer.push(i);
          this.forTreeData(this.selectList, i); //默认不可选
        });
        ++this.selectKey;
        this.selectiveEngineer = this.unique(this.selectiveEngineer);
      }
    },
    forTreeData(val, cValue) {
      val.forEach((item) => {
        if (item.disabled == true) {
          let c = JSON.parse(JSON.stringify(this.defaultEngineer));
          let e = [];
          c.forEach((element) => {
            e.push(element);
          });
          let flag = e.findIndex((i) => i === item.customerId);
          if (flag == -1) {
            //取消默认选择某一项可选工程师可以选择
            item.disabled = false;
          }
        }
        if (item.customerId !== null && item.customerId == cValue) {
          item.disabled = true;
        }
        if (item.children !== null && item.children.length > 0) {
          this.forTreeData(item.children, cValue);
        }
      });
    },
    removeWh(callback){
      if (!callback) {
        ++this.patentKey;
        this.patentEngineer.forEach((i, key) => {
          this.selectiveEngineer.push(i);
          this.forSelectTreeData(this.selectList, i);
        });
        ++this.selectKey;
        this.selectiveEngineer = this.unique(this.selectiveEngineer);
      }
    },
    removePatent(callback) {
      if (!callback) {
        ++this.patentKey;
        this.patentEngineer.forEach((i, key) => {
          this.selectiveEngineer.push(i);
          this.forSelectTreeData(this.selectList, i);
        });
        ++this.selectKey;
        this.selectiveEngineer = this.unique(this.selectiveEngineer);
      }
    },
    removeBrand(callback) {
      if (!callback) {
        ++this.brandKey;
        this.brandEngineer.forEach((i, key) => {
          this.selectiveEngineer.push(i);
          this.forSelectTreeData(this.selectList, i);
        });
        ++this.selectKey;
        this.selectiveEngineer = this.unique(this.selectiveEngineer);
      }
    },
    removeCopyright(callback) {
      if (!callback) {
        ++this.copyrightKey;
        this.copyrightEngineer.forEach((i, key) => {
          this.selectiveEngineer.push(i);
          this.forSelectTreeData(this.selectList, i);
        });
        ++this.selectKey;
        this.selectiveEngineer = this.unique(this.selectiveEngineer);
      }
    },
    removeOther(callback) {
      if (!callback) {
        ++this.otherKey;
        this.otherEngineer.forEach((i, key) => {
          this.selectiveEngineer.push(i);
          this.forSelectTreeData(this.selectList, i);
        });
        ++this.selectKey;
        this.selectiveEngineer = this.unique(this.selectiveEngineer);
      }
    },
    forSelectTreeData(val, cValue) {
      val.forEach((item) => {
        if (item.customerId !== null && item.customerId == cValue) {
          item.disabled = true;
        }
        if (item.children !== null && item.children.length > 0) {
          this.forSelectTreeData(item.children, cValue);
        }
        if (item.disabled == true) {
          let a = JSON.parse(JSON.stringify(this.patentEngineer));
          let b = JSON.parse(JSON.stringify(this.brandEngineer));
          let c = JSON.parse(JSON.stringify(this.copyrightEngineer));
          let d = JSON.parse(JSON.stringify(this.otherEngineer));
          let e = [];
          a.forEach((element) => {
            e.push(element);
          });
          b.forEach((element) => {
            e.push(element);
          });
          c.forEach((element) => {
            e.push(element);
          });
          d.forEach((element) => {
            e.push(element);
          });
          let flag = e.findIndex((i) => i === item.customerId);
          if (flag == -1) {
            //取消默认选择某一项可选工程师可以选择
            item.disabled = false;
            ++this.selectKey;
          }
        }
      });
      ++this.selectKey;
    },
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr) && res.set(arr, 1));
    },
    // 编辑
    handldEdit(row) {
      this.appointForm = row;
      this.centerDialogVisible = true;
      this.appointPerson = [];
      this.whEngineer = []
      this.selectiveEngineer = [];
      this.patentEngineer = [];
      this.defaultEngineer = [];
      this.otherEngineer = [];
      this.copyrightEngineer = [];
      this.brandEngineer = [];
      if (row.nameNo.split(",") && row.id != 6 && row.id != 8 && row.id != 9) {
        this.notShow = true;
        this.radio = "2";
        this.appointPerson = row.nameNo.split(",");
      } else {
        this.notShow = true;
        this.radio = "1";
      }
      if (
        row.permissionName == "退款审批" ||
        row.permissionName == "认证审批"
      ) {
        this.notShow = false;
        this.radio = "2";
      }
      if (row.defaultNameNo) {
        this.defaultEngineer = row.defaultNameNo.split(",");
      }
      if (row.nameNo.split(",") && row.id == 9) {
        this.appointPerson = row.nameNo.split(",");
      }
      if (row.id == 8) {
        this.whEngineer = (row.permissionEngineer.defaultOtherEngineerAppointType ==null||row.permissionEngineer.defaultOtherEngineerAppointType =="null")?["0"]: JSON.parse(row.permissionEngineer.defaultOtherEngineerAppointType)
      }
      if (row.id == 6) {
        if (
          JSON.parse(row.permissionEngineer.defaultPatentEngineerAppointType)
            .length > 0
        ) {
          JSON.parse(
            row.permissionEngineer.defaultPatentEngineerAppointType
          ).forEach((item) => {
            this.patentEngineer.push(item);
          });
        }
        if (
          JSON.parse(row.permissionEngineer.defaultTrademarkEngineerAppointType)
            .length > 0
        ) {
          JSON.parse(
            row.permissionEngineer.defaultTrademarkEngineerAppointType
          ).forEach((item) => {
            this.brandEngineer.push(item);
          });
        }
        if (
          JSON.parse(row.permissionEngineer.defaultCopyrightEngineerAppointType)
            .length > 0
        ) {
          JSON.parse(
            row.permissionEngineer.defaultCopyrightEngineerAppointType
          ).forEach((item) => {
            this.copyrightEngineer.push(item);
          });
        }
        if (
          JSON.parse(row.permissionEngineer.defaultOtherEngineerAppointType)
            .length > 0
        ) {
          JSON.parse(
            row.permissionEngineer.defaultOtherEngineerAppointType
          ).forEach((item) => {
            this.otherEngineer.push(item);
          });
        }
      }
    },
    // 确定
    handleUpdata() {
      if (this.appointForm.id == 8) {
        this.checkEngineer()
      } else {
        if (this.radio == 2 && this.appointPerson.length < 1) {
          this.$message({
            type: "warning",
            message: "请选择必填项!",
            offset: 200,
          });
        } else {
          this.handlerEdit();
        }
      }
    },
    // 项目工程师必填项校验
    checkEngineer(){
      if(this.defaultEngineer.length > 0){
          console.log(this.whEngineer,"输出武汉所选工程师！")
          this.handlerEdit();
        }else{
          this.$message({
            type: "warning",
            message: "请选择默认工程师!",
            offset: 200,
          });
        }
    },
    transLateAppoint(){
      let r = []
      this.whEngineer.forEach(item=>{
        r.push(String(item))
      })
      return r.length == 0?null:r
    },
    handlerEdit() {
      let customerNos = [];
      let defaultCustomerNos = [];
      let a = JSON.parse(JSON.stringify(this.appointPerson));
      let c = JSON.parse(JSON.stringify(this.defaultEngineer));
      if (c && c.length > 0) {
        //处理默认工程师
        defaultCustomerNos = this.defaultEngineer;
      }
      if (
        this.radio == 1 &&
        this.appointForm.id != 8 &&
        this.appointForm.id != 9
      ) {
        customerNos = [];
      } else if (this.appointForm.id != 8) {
        if (a && a.length > 0) {
          customerNos = this.appointPerson;
        }
      }
      // 项目工程师
      if (this.appointForm.id == 8) {
        this.params = {
          customerNos,
          defaultCustomerNos,
          defaultAppoints: this.defaultEngineer,
          id: this.appointForm.id,
          permissionEngineer:{
            defaultOtherEngineerAppoints: this.transLateAppoint(),
            defaultOtherEngineerNos: this.transLateAppoint()
          }
        };
      } else {
        this.params = {
          customerNos,
          appoints:
            this.radio == 1 && this.appointForm.id != 9
              ? []
              : this.appointPerson, // 回显处理字段
          id: this.appointForm.id,
        };
      }
      editAppoint(this.params).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            type: "success",
            message: "编辑成功!",
          });
          this.getAppoint();
          this.centerDialogVisible = false;
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      });
    },
    //知产确定按钮
    handleProperty() {
      let permissionEngineer = {
        defaultPatentEngineerNos: [],
        defaultPatentEngineerAppoints: this.patentEngineer,
        defaultTrademarkEngineerNos: [],
        defaultTrademarkEngineerAppoints: this.brandEngineer,
        defaultCopyrightEngineerNos: [],
        defaultCopyrightEngineerAppoints: this.copyrightEngineer,
        defaultOtherEngineerNos: [],
        defaultOtherEngineerAppoints: this.otherEngineer,
      };
      let customerNos = [];
      let a = JSON.parse(JSON.stringify(this.patentEngineer));
      let b = JSON.parse(JSON.stringify(this.brandEngineer));
      let c = JSON.parse(JSON.stringify(this.copyrightEngineer));
      let d = JSON.parse(JSON.stringify(this.otherEngineer));
      if (a.length > 0 && b.length > 0 && c.length > 0 && d.length > 0) {
        a.forEach((i) => {
          permissionEngineer.defaultPatentEngineerNos.push(i);
        });
        b.forEach((i) => {
          permissionEngineer.defaultTrademarkEngineerNos.push(i);
        });
        c.forEach((i) => {
          permissionEngineer.defaultCopyrightEngineerNos.push(i);
        });
        d.forEach((i) => {
          permissionEngineer.defaultOtherEngineerNos.push(i);
        });
        let para = {
          customerNos,
          permissionEngineer,
          id: this.appointForm.id,
        };
        editAppoint(para).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "编辑成功!",
            });
            this.getAppoint();
            this.centerDialogVisible = false;
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
            });
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: "请选择必填项!",
          offset: 200,
        });
      }
    },
    // 取消
    handleCancle() {
      this.centerDialogVisible = false;
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getAppoint();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getAppoint();
    },
  },
};
</script>

<style scoped>
.tip {
  position: relative;
  top: -10px;
  left: 41%;
  color: #666666;
}
.teshu {
  left: 26%;
}
.name {
  margin: 6px 0 15px 15px;
}
.hot_title {
  font-size: 16px;
  font-weight: 550;
}
.parallel {
  margin-left: 10px;
}
.text {
  overflow: hidden;
  white-space: nowrap;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.orderMsg {
  display: flex;
  flex-direction: column;
}
.orangeName {
  color: #e6a23c;
}
.senior {
  margin: 10px 0px;
}
.search {
  margin: 25px 0px;
}
.radio-sty {
  margin-left: 20px;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}
.cell-blue {
  color: #36a6fe;
  cursor: pointer;
}
.list-btn {
  padding: 8px 20px;
  margin: 0 5px;
  border: 1px solid #eee;
  border-radius: 5px;
  cursor: pointer;
}
.activebtn {
  background: #36a6fe;
  border-radius: 5px;
  border: 0;
  color: #fff;
}
.circleBlue {
  width: 6px;
  height: 6px;
  float: left;
  border-radius: 50%;
  background: #36a6fe;
  margin-top: 4px;
  margin-right: 7px;
}
.circleBluec {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 7px;
}
.circleRed {
  background: red;
}
.circleRedc {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  margin-right: 7px;
  background: red;
}
.success {
  font-weight: bolder;
  font-size: 12px;
  float: left;
  color: green;
  margin-top: 2px;
  margin-right: 6px;
}
.successc {
  font-weight: bolder;
  font-size: 12px;
  color: green;
  margin-right: 6px;
}
.pagination {
  float: right;
}
.keyword {
  width: 350px;
}
.state-right {
  margin-right: 20px;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}
</style>