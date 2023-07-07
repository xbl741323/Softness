<template>
  <div class="site_box">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tab_sty">
      <el-tab-pane label="分站站点" name="first"></el-tab-pane>
      <el-tab-pane label="全国站点" name="second"></el-tab-pane>
    </el-tabs>
    <div class="pad_sty" v-if="activeName">
      <el-form style="padding-left: 8px;" :model="siteForm" ref="siteForm" inline label-width="90"
        @keyup.enter.native="getAllList()">
        <div>
          <el-form-item label="站点名称：" prop="keyWords">
            <el-input placeholder="请输入站点名称" class="contract-keyword" v-model.trim="siteForm.keyWords"></el-input>
          </el-form-item>
          <!-- 创建时间 -->
          <el-form-item :label="$t('label.createTime')" prop="createTime" width="50px">
            <el-date-picker style="width: 340px" v-model="siteForm.createTime" type="datetimerange" range-separator="~"
              format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
              start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-button size="small" type="primary" @click="getAllList()">搜索</el-button>
          <el-button size="small" type="warning" @click="resetList()">重置</el-button>
          <el-button size="small" type="primary" @click="addWeb" style="margin-left: 40px">添加站点</el-button>
        </div>
      </el-form>
      <avue-crud ref="crud" :data="dataList" :option="tableOption" @sort-change="changeSort" @size-change="sizeChange"
        @current-change="currentChange" :page.sync="page" v-loading="tableLoading"> <template v-slot:canCopyHeader>
          <span>允许复制</span>
          <el-tooltip class="item" effect="dark" content="开启后，可复制文章详情" placement="top">
            <div class="prompt_sty">?</div>
          </el-tooltip>
        </template>
        <template slot-scope="scope" slot="canCopy">
          <el-switch @change="changeCanCopyFn(scope.row)"
            :disabled="filterSwitchLoading(scope.row) ? true : switchLoading" v-model="scope.row.canCopy"
            active-color="#0082fc" :active-value="1" :inactive-value="0">
          </el-switch>
        </template>
        <template slot-scope="scope" slot="substationRealmName">
          <div style="color: #409EFF; cursor: pointer;" @click="handleToLink(scope.row.substationRealmName)">
            {{ scope.row.substationRealmName }}
          </div>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button type="text" icon="el-icon-unlock" @click="handlePermission(scope.row)">权限设置</el-button>
          <el-button type="text" icon="el-icon-edit"
            @click="permissions.sys_substation_edit ? handleEdit(scope.row) : $notAuthorized('没有编辑权限！')">编辑</el-button>
        </template>
      </avue-crud>
    </div>
    <!-- 添加/编辑站点弹窗 -->
    <el-dialog :title="addWebTitle" :visible.sync="addWebShow" width="30%" :before-close="resetForm"
      :close-on-click-modal="false">
      <el-form label-width="100px" :model="form" ref="ruleForm" :rules="rules" style="width: 500px;">
        <el-form-item label="站点名称：" prop="substationName">
          <el-input v-model="form.substationName" placeholder="请输入站点名称" clearable maxlength="20"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="站点域名：" prop="substationRealmName">
          <el-input v-model="form.substationRealmName" placeholder="请输入站点域名" clearable>
            <template slot="prepend">https://</template>
          </el-input>
        </el-form-item>
        <el-form-item label="上线时间：" prop="createTime" style="width: 500px;">
          <!-- <el-input v-model="form.createTime" style="width: 400px;"></el-input> -->
          <el-date-picker type="datetime" placeholder="请选择日期" v-model="form.createTime"
            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="tail_sty">*</span><span>允许复制：</span>
          </template>
          <el-switch :disabled="filterSwitchLoading(form) ? true : switchLoading" v-model="form.canCopy"
            active-color="#0082fc" :active-value="1" :inactive-value="0">
          </el-switch>
          <span class="open_stare_sty">开启后，客户端可复制文章详情</span>
        </el-form-item>
      </el-form>
      <div style="text-align: center;">
        <el-button size="small" type="primary" @click="submitForm">确定</el-button>
        <el-button size="small" @click="resetForm">取消</el-button>
      </div>
    </el-dialog>
    <!-- 权限设置 -->
    <el-dialog title="权限管理" :visible.sync="powerVisible" width="520px" center :close-on-click-modal='false'>
      <el-form :model="powerInfo" ref="powerInfo" :rules="powerRules">
        <el-form-item label="站点名称：" label-width="100px">
          <span>{{ powerInfo.substationName }}</span>
        </el-form-item>
        <div class="power_sty">
          <el-form-item label="权限人：" label-width="100px" prop="powerType">
            <el-radio-group v-model="powerInfo.powerType" @change="changeType">
              <el-radio :label="0">不限</el-radio>
              <el-radio :label="1">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="powerInfo.powerType == 1" prop="powerMan" label-width="30px">
            <el-cascader :key="iscascaderShow" @change="changePowerMan" ref="cascader" clearable filterable collapse-tags
              :show-all-levels='false' :options="empList" :before-filter="beforeFilter" v-model="powerInfo.powerMan"
              @remove-tag="removeTag" :props="{ value: 'customerId', label: 'label', multiple: true, emitPath: false }">
              <template slot-scope="{data}">
                <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                  <div slot="content">{{ data.customerNo }}</div>
                  <span>{{ data.label }}</span>
                </el-tooltip>
              </template>
            </el-cascader>
          </el-form-item>
        </div>
      </el-form>
      <div class="power_btn_sty">
        <el-button size="medium" type="primary" @click="operatePower">确认</el-button>
        <el-button size="medium" class="btn_left_sty" @click="closePower">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import * as CodeMsg from "@/api/common/CodeChange";
import { getPermissionList, addSubstationSite, editSubstationSite, permissionSettings, updateCanCopy } from '@/api/substation/index'
import { tableOption } from "@/const/crud/substation/index";
import { getEmpList } from "@/api/clue/clue";
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  data() {
    return {
      switchLoading: false,
      activeName: "first",
      addWebShow: false,
      powerVisible: false,
      iscascaderShow: 0,
      addWebTitle: null,
      names: [],
      customerNos: [],
      appoints: [],
      empList: [],
      powerInfo: {
        substationName: "",
        id: "",
        powerType: 0,
        powerMan: [],
      },
      siteForm: {
        keyWords: "",
        createTime: [],
      },
      page: {
        total: 0,
        pageSize: 20,
        currentPage: 1,
        pages: [5, 10, 20, 50]
      },
      form: {
        substationName: "",
        substationRealmName: "",
        createTime: "",
        canCopy: 0
      },
      powerRules: {
        powerType: [{ required: true, message: '请选择', trigger: 'blur' }],
        powerMan: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      rules: {
        substationName: [
          { required: true, message: '请输入站点名称', trigger: 'blur' },
        ],
        substationRealmName: [
          { required: true, message: '请输入站点域名', trigger: 'blur' },
          { pattern: /^(?=^.{3,255}$)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/, message: '请输入正确的站点域名', trigger: 'blur' },
        ],
        createTime: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
      },
      tableLoading: true,
      dataList: [],
      tableOption: tableOption,
      sortField: '',
      sortType: ''
    }
  },
  watch: {
    'powerInfo.powerMan': {
      handler(newVal, oldVal) {
        if (newVal && newVal.length > 30) {
          this.$message({
            message: '最多只能选择30人！',
            duration: 2000,
            type: 'warning'
          })
          this.powerInfo.powerMan = [];
          newVal.slice(0, 30).forEach(item => {
            this.powerInfo.powerMan.push(item);
            ++this.iscascaderShow;
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      if (keepParams.detail.path !== '') {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query
        })
        return
      }
      this.siteForm.keyWords = keepParams.params.keyWord
      this.siteForm.createTime = keepParams.params.createTime
      if (keepParams.params.activeName) {
        this.activeName = keepParams.params.activeName
      } else {
        this.activeName = "first"
      }
    }
  },

  mounted() {
    this.getAllList()
    this.getDropData();
  },

  methods: {
    // 根据分站id 判断是否可以复制
    filterSwitchLoading(val) {
      if(!val)return true
      /* excludeIds 分站id
        3 : 成都2站
        4 : 商标站
        5 : 江苏站
       12 : 湖北1站
       20 : 湖南站
       */
      const excludeIds = [3, 4, 5, 12, 20]
      return !excludeIds.includes(val.id)
    },
    async changeCanCopyFn(row) {
      this.switchLoading = true;
      let data = {
        id: row.id,
        canCopy: row.canCopy,
      };
      let res = await updateCanCopy(data);
      if (res.data.code == CodeMsg.CODE_0) {
        this.$message({
          type: "success",
          message: "修改成功",
        });
        await this.getAllList();
      }
      this.switchLoading = false;
    },
    //显示工号
    async beforeFilter() {
      await getEmpList(false).then((res) => {
        if (res.data.code == 0) {
          this.empList = res.data.data;
        }
      });
      this.$loop(this.empList[0], this.empList[0])
      return false
    },
    handleToLink(row) {
      window.open(row)
    },
    removeTag(val) {
      // this.powerInfo.powerMan = []
      // if(val.length>0){
      //   val.forEach(item=>{
      //   this.powerInfo.powerMan.push(item);
      //   ++this.iscascaderShow
      // })
      // }
    },
    changePowerMan(val) {
      if (val[val.length - 1] == null) {
        val.pop()
      }
      this.customerNos = []
      this.powerInfo.powerMan.forEach(item => {
        this.customerNos.push(item)
      })
    },
    changeType(val) {
      this.$refs['powerInfo'].clearValidate()
      if (val == 0) {
        this.customerNos = []
        this.powerInfo.powerMan = []
      }
    },
    operatePower() {
      this.$refs['powerInfo'].validate(valid => {
        if (valid) {
          if (this.customerNos.length >= 31) {
            return this.$message({
              type: 'warning',
              message: "人数不超过30，请重新选择"
            })
          }
          let params = {
            id: this.powerInfo.id,
            customerNos: this.customerNos, // customerNo集合
            substationType: this.activeName == 'first' ? 1 : 0,
          }
          permissionSettings(params).then(res => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "操作成功！",
                offset: 300
              })
              this.customerNos = []
              this.powerInfo.powerMan = []
              this.powerVisible = false
              this.getAllList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        }
      })
    },
    getDropData() {
      //去除禁用后的员工
      getEmpList(false).then((res) => {
        this.empList = res.data.data;
      });
    },
    closePower() {
      this.powerVisible = false
      this.powerInfo.powerMan = []
      this.powerInfo.powerType = 0
    },
    //提交表单
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let params = {
            onlineTime: this.form.createTime,
            substationName: this.form.substationName,
            substationRealmName: 'https://' + this.form.substationRealmName,
            substationType: this.activeName == 'first' ? 1 : 0,
            canCopy: this.form.canCopy
          }
          if (this.addWebTitle == "添加站点") {
            addSubstationSite(params).then(res => {
              if (res.data.code == 1000) {
                this.$message({
                  type: 'success',
                  message: '添加站点成功'
                })
                this.getAllList()
                this.resetForm()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
          } else {
            params.id = this.form.id
            editSubstationSite(params).then(res => {
              if (res.data.code == 1000) {
                this.$message({
                  type: 'success',
                  message: '编辑站点成功'
                })
                this.getAllList()
                this.resetForm()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs["ruleForm"].resetFields();
      this.addWebShow = false
      this.form = {
        substationName: "",
        substationRealmName: "",
        createTime: "",
        canCopy: 0,
      }
    },
    //添加站点
    addWeb() {
      this.addWebShow = true
      this.addWebTitle = "添加站点"
    },
    addWebClose() {
      this.addWebShow = false
    },
    // 排序
    changeSort(e) {
      this.sortType = e.order == 'ascending' ? 'asc' : 'desc'
      this.sortField = e.prop
      this.getAllList()
    },
    // tab切换
    handleClick(tab, event) {
      this.getAllList()
    },
    // 获取列表
    getList() {
      if (this.permissions.sys_substation_perm_detail) {
        let params = {
          keyWord: this.siteForm.keyWords,//关键字
          substationType: this.activeName == 'first' ? 1 : 0,//站点类型
          sortField: this.sortField,//排序字段
          sortType: this.sortType, // 排序方式
          pageNo: this.page.currentPage,
          pageSize: this.page.pageSize,
        }
        if (this.siteForm.createTime) {
          params.startTime = this.siteForm.createTime[0];
          params.endTime = this.siteForm.createTime[1];
        }
        // 需要缓存的参数
        let keepParams = {
          params: {
            keyWord: this.siteForm.keyWords,
            activeName: this.activeName,
            createTime: this.siteForm.createTime
          },
          detail: { path: "", query: {} },
        };
        sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
        getPermissionList(params).then(res => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.tableLoading = false
            this.dataList = res.data.data.records;
            this.page.total = res.data.data.total;
          }
        })
      } else {
        this.tableLoading = false
      }
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    // 权限设置
    handlePermission(row) {
      this.powerInfo.powerMan = '';
      if (row.permissionId == '不限' || !row.permissionId) {
        this.powerInfo.powerType = 0
      } else {
        this.powerInfo.powerType = 1
        this.powerInfo.powerMan = row.permissionId.split(',')
        console.log(this.powerInfo.powerMan);
        this.customerNos = []
        this.powerInfo.powerMan.forEach(item => {
          this.customerNos.push(item)
        })
        ++this.iscascaderShow
      }
      this.powerInfo.substationName = row.substationName
      this.powerInfo.id = row.id
      this.powerVisible = true
      console.log(this.powerInfo.powerMan);
    },
    // 编辑
    handleEdit(row) {
      this.addWebTitle = "编辑站点"
      this.form = {
        substationName: row.substationName,
        substationRealmName: row.substationRealmName.split('https://')[1],
        createTime: row.createTime,
        id: row.id,
        canCopy: row.canCopy
      }
      this.addWebShow = true
    },
    // 重置
    resetList() {
      this.siteForm = {
        keyWords: "",
        createTime: []
      };
      this.getAllList();
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
  }

}
</script>

<style scoped>
.site_box {
  background: #fff;
  height: 100%;
}

.tab_sty {
  padding-left: 30px;
}

.pad_sty {
  padding: 5px 20px 20px 15px;
}

.power_sty {
  display: flex;
}

.power_left_sty {
  margin-left: 20px;
}

.power_btn_sty {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn_left_sty {
  margin-left: 60px;
}

.prompt_sty {
  margin-left: 10px;
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  color: #fff;
  background-color: rgb(216, 233, 120);
  line-height: 14px;
  text-align: center;
}

.tail_sty {
  color: #F56C6C;
  margin-right: 4px;
}

.open_stare_sty {
  font-size: 9px;
  margin-left: 10px;
  color: #888;
  }
</style>
