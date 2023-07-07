<template>
  <div class="classify">
    <div class="classify_title">
      说明：此表中的类目及其选项，用于各板块参数设置中类目和选项的数据来源
    </div>
    <div class="classify_content">
      <el-table :data="classifyList" border="">
        <el-table-column
          prop="name"
          label="类目名称"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column prop="optionList" label="选项">
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              style="margin-left: 10px; margin-top: 5px; marign-bottom: 5px"
              v-for="(item, index) in scope.row.optionList"
              :key="index"
              :closable="false"
              type="primary"
              size="medium"
              >{{ item.name }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="编号" width="200">
        <template slot-scope="scope">
             {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="editDataBtn(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.necessary !== 1"
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteDataBtn(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin-top: 10px" type="primary" @click="addOperate"
        >新建类目</el-button
      >
      <!-- 新建编辑类目 -->
      <el-dialog
        :title="className"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="30%"
        center
        :before-close="handleClose"
      >
        <el-form :model="addForm" ref="addForm" inline :rules="rules">
          <el-form-item
            style="margin-left: 10px"
            label="类目名称"
            prop="className"
          >
            <el-input
              v-model="addForm.className"
              style="width: 300px"
              :placeholder="$t('message.noMoreThanTwity')"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <div style="margin-left: 40px" v-if="className == '新建类目'">
            <div v-for="(item, index) in arrOptionList" :key="index">
              <el-form-item :label="$t('label.option') + (index + 1)">
                <el-input
                  v-model="item.options"
                  style="width: 200px; margin-right: 20px; margin-bottom: -10px"
                  :placeholder="$t('message.noMoreThanTwity')"
                  maxlength="20"
                ></el-input>
                <span
                  style="margin-right: 20px; display: inline-block; width: 40px"
                >
                  <i
                    class="el-icon-sort-down"
                    style="font-size: 20px; cursor: pointer; color: #409eff"
                    id="down"
                    v-if="index !== arrOptionList.length - 1"
                    @click="handleMoveDown(index, item)"
                  ></i>
                  <i
                    class="el-icon-sort-up"
                    style="font-size: 20px; cursor: pointer; color: #409eff"
                    id="up"
                    v-if="index !== 0"
                    @click="handleMoveUp(index, item)"
                  ></i>
                </span>
                <el-button size="mini" @click="sliceList(index)">-</el-button>
                <el-button
                  size="mini"
                  v-if="index + 1 == arrOptionList.length"
                  @click="pushList"
                  >+</el-button
                >
              </el-form-item>
            </div>
          </div>
          <div style="margin-left: 40px" v-if="className == '编辑类目'">
            <div v-for="(item, index) in arrOptionList" :key="index">
              <el-form-item :label="$t('label.option') + (index + 1)">
                <el-input
                  v-model="item.name"
                  style="width: 200px; margin-right: 20px; margin-bottom: -10px"
                  maxlength="20"
                  :placeholder="$t('message.noMoreThanTwity')"
                ></el-input>
                <span
                  style="margin-right: 20px; display: inline-block; width: 40px"
                >
                  <i
                    class="el-icon-sort-down"
                    style="font-size: 20px; cursor: pointer; color: #409eff"
                    id="down"
                    v-if="(index !== arrOptionList.length - 1)&&(item.categoryId !== 2)"
                    @click="handleMoveDown(index, item)"
                  ></i>
                  <i
                    class="el-icon-sort-up"
                    style="font-size: 20px; cursor: pointer; color: #409eff"
                    id="up"
                    v-if="(index !== 0)&&(item.categoryId !== 2)"
                    @click="handleMoveUp(index, item)"
                  ></i>
                </span>
                <el-button
                  size="mini"
                  :disabled="item.areaNo == 100000 || item.areaNo == 340000||item.categoryId == 2"
                  @click="sliceList(index)"
                  >-</el-button
                >
                <el-button
                  size="mini"
                  v-if="index + 1 == arrOptionList.length"
                  @click="pushList"
                  >+</el-button
                >
              </el-form-item>
            </div>
          </div>
          <div style="margin-left: 140px; margin-top: 20px">
            <el-button
              style="padding: 10px 30px"
              type="primary"
              @click="addclassify"
              v-if="className == '新建类目'"
              >{{ $t("button.confirm") }}</el-button
            >
            <el-button
              style="padding: 10px 30px"
              type="primary"
              @click="editClassify"
              v-if="className == '编辑类目'"
              >{{ $t("button.confirm") }}</el-button
            >
            <el-button
              style="padding: 10px 30px; margin-left: 50px"
              @click="closeClassify"
              >{{ $t("button.cancel") }}</el-button
            >
          </div>
        </el-form>
      </el-dialog>
      <!-- 编辑地区类目 -->
      <el-dialog
        :title="className"
        :visible.sync="dialogVisible2"
        :close-on-click-modal="false"
        width="30%"
        center
        :before-close="handleClose"
      >
        <el-form :model="addForm" ref="addForm" inline :rules="rules">
          <el-form-item
            style="margin-left: 10px"
            label="类目名称"
            prop="className"
          >
            <el-input
              v-model="addForm.className"
              style="width: 300px"
              :placeholder="$t('message.noMoreThanTwity')"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <div style="margin-left: 40px">
            <div v-for="(item, index) in arrOptionList" :key="index">
              <el-form-item :label="$t('label.option') + (index + 1)">
                <el-input
                  v-model="item.name"
                  v-if="item.id"
                  style="width: 200px; margin-right: 20px; margin-bottom: -10px"
                  maxlength="20"
                  :placeholder="$t('message.noMoreThanTwity')"
                ></el-input>
                <el-select
                  v-model="item.name"
                  v-if="!item.id"
                  style="width: 200px; margin-right: 20px; margin-bottom: -10px"
                  maxlength="20"
                  :placeholder="$t('message.noMoreThanTwity')"
                >
                  <el-option v-for="(item,index) in areaOption" :key="index" :label="item.areaName" :value="item.areaNo"></el-option>
                </el-select>
                <span
                  style="margin-right: 20px; display: inline-block; width: 40px"
                >
                  <i
                    class="el-icon-sort-down"
                    style="font-size: 20px; cursor: pointer; color: #409eff"
                    id="down"
                    v-if="index !== arrOptionList.length - 1"
                    @click="handleMoveDown(index, item)"
                  ></i>
                  <i
                    class="el-icon-sort-up"
                    style="font-size: 20px; cursor: pointer; color: #409eff"
                    id="up"
                    v-if="index !== 0"
                    @click="handleMoveUp(index, item)"
                  ></i>
                </span>
                <el-button
                  size="mini"
                  :disabled="item.areaNo == 100000 || item.areaNo == 340000"
                  @click="sliceList(index)"
                  >-</el-button
                >
                <el-button
                  size="mini"
                  v-if="index + 1 == arrOptionList.length"
                  @click="pushList"
                  >+</el-button
                >
              </el-form-item>
            </div>
          </div>
          <div style="margin-left: 140px; margin-top: 20px">
            <el-button
              style="padding: 10px 30px"
              type="primary"
              @click="editClassify"
              >{{ $t("button.confirm") }}</el-button
            >
            <el-button
              style="padding: 10px 30px; margin-left: 50px"
              @click="closeClassify"
              >{{ $t("button.cancel") }}</el-button
            >
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  addClassify,
  getClassifyList,
  delClassify,
  editClassify,
  getAreaClassify
} from "@/api/siteSettings/classify";
import * as CodeMsg from "@/api/common/CodeChange"
export default {
  data() {
    return {
      editObj: {},
      classifyorignal: [],
      classifyOptionList: [],
      dialogVisible: false,
      dialogVisible2: false,
      areaOption:[],
      rules: {
        className: [
          {
            required: true,
            message: "请输入类目名称",
            trigger: "blur",
          },
        ],
      },
      arrOptionList: [
        {
          options: "",
        },
        {
          options: "",
        },
        {
          options: "",
        },
      ],
      className: "新建类目",
      addForm: {
        className: "",
      },
      classifyList: [],
    };
  },
  methods: {
    getAreaSelect(){
      getAreaClassify().then(res=>{
        this.areaOption = res.data.data
      })
    },
    addOperate() {
      this.dialogVisible = true;
      this.addForm.className = "";
      this.className = "新建类目";
      this.arrOptionList = [
        {
          options: "",
        },
        {
          options: "",
        },
        {
          options: "",
        },
      ];
    },
    sliceList(index) {
      if (this.className == "编辑类目") {
        this.$confirm(
          "选项删除后，关联数据的该属性将被清空，确定修改吗？",
          this.$t("message.tips"),
          {
            confirmButtonText: this.$t("button.confirm"),
            cancelButtonText: this.$t("button.cancel"),
            cancelButtonClass: "btn-custom-cancel",
            type: "warning",
          }
        )
          .then(() => {
            if (this.arrOptionList.length > 1) {
              console.log(index);
              this.arrOptionList.splice(index, 1);
            } else {
              this.$message({
                type: "warning",
                message: this.$t("message.leastSelectOne"),
                offset: 100,
              });
            }
          })
          .catch(() => {});
      } else {
        if (this.arrOptionList.length > 1) {
          console.log(index);
          this.arrOptionList.splice(index, 1);
        } else {
          this.$message({
            type: "warning",
            message: this.$t("message.leastSelectOne"),
            offset: 100,
          });
        }
      }
    },
    pushList() {
      if (this.className == "新建类目") {
        let obj = {
          options: "",
        };
        this.arrOptionList.push(obj);
      } else if (this.className == "编辑类目") {
        let obj2 = {
          options: "",
        };
        this.arrOptionList.push(obj2);
      }
    },
    handleMoveUp(index, item) {
      //上移
      var that = this;
      const downDate = that.arrOptionList[index - 1];
      that.arrOptionList.splice(index - 1, 1);
      that.arrOptionList.splice(index, 0, downDate);
      console.log(this.arrOptionList);
    },
    handleMoveDown(index, item) {
      //下移
      var that = this;
      const upDate = that.arrOptionList[index + 1];
      that.arrOptionList.splice(index + 1, 1);
      that.arrOptionList.splice(index, 0, upDate);
      console.log(this.arrOptionList);
    },
    handleClose(done) {
      done();
      this.getList();
    },
    addclassify() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          //调用添加接口
          console.log(this.arrOptionList, "输出arrOptionList");
          this.classifyOptionList = [];
          this.arrOptionList.forEach((item) => {
            if (item.options !== "") {
              this.classifyOptionList.push(item.options);
            }
          });
          console.log(this.classifyOptionList, "输出需要的数据");
          let params = {
            name: this.addForm.className,
            options: this.classifyOptionList,
          };
          addClassify(params).then((res) => {
            console.log(res);
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "添加成功！",
              });
              this.dialogVisible = false;
              this.getList();
            }
            if (res.data.code == CodeMsg.CODE_2000) {
              this.$message({
                type: "warning",
                message: res.data.data,
              });
            }
            if (res.data.code == CodeMsg.CODE_2009) {
              this.$message({
                type: "warning",
                message: res.data.data,
              });
            }
          });
        }
      });
    },
    getList() {
      getClassifyList().then((res) => {
        this.classifyList = res.data.data;
        // 更新类目存储信息
        this.$store.dispatch('setCategory');
      });
    },
    editAreaClassify(){},
    editClassify() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          this.$confirm(
            "类目及其选项修改后，关联数据的属性将同时被修改，确定修改吗？",
            this.$t("message.tips"),
            {
              confirmButtonText: this.$t("button.confirm"),
              cancelButtonText: this.$t("button.cancel"),
              cancelButtonClass: "btn-custom-cancel",
              type: "warning",
            }
          )
            .then(() => {
              //调用编辑接口
              console.log(this.arrOptionList, "输出需要的数据");
              this.classifyOptionList = [];
              this.classifyorignal = [];
              this.arrOptionList.forEach((item) => {
                if (item.id) {
                  this.classifyorignal.push(item);
                } else {
                  if (item.name && item.name !== "") {
                    this.classifyOptionList.push(item.name);
                  }
                }
              });
              console.log(this.classifyOptionList, "输出需要的数据");
              let params = {
                id: this.editObj.id,
                name: this.addForm.className,
                optionList: this.classifyorignal,
                options: this.classifyOptionList,
              };
              editClassify(params).then((res) => {
                if (res.data.code == CodeMsg.CODE_1000) {
                  this.$message({
                    type: "success",
                    message: "修改成功！",
                  });
                  this.getList();
                  this.dialogVisible = false;
                  this.dialogVisible2 = false;
                } else if (res.data.code == CodeMsg.CODE_2009) {
                  this.$message({
                    type: "warning",
                    message: res.data.data,
                  });
                }else if (res.data.code == CodeMsg.CODE_2000) {
                  this.$message({
                    type: "warning",
                    message: res.data.data,
                  });
                }
              });
            })
            .catch(() => {});
        }
      });
    },
    editDataBtn(index, row) {
      console.log(row);
      this.editObj = row;
      this.className = "编辑类目";
      if (row.id == 1) {
        this.dialogVisible2 = true;
      } else {
        this.dialogVisible = true;
      }
      this.addForm.className = row.name;
      this.arrOptionList = row.optionList;
    },
    deleteDataBtn(index, row) {
      this.$confirm(
        "该类目删除后，关联数据的该属性将被清空，确定修改吗？",
        this.$t("message.tips"),
        {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        }
      )
        .then(() => {
          //调用删除接口
          delClassify(row.id).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "删除成功！",
                duration: 2000
              });
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    closeClassify() {
      this.dialogVisible = false;
      this.dialogVisible2 = false;
      this.getList();
    },
  },
  mounted() {
    this.getList();
    this.getAreaSelect()
  },
};
</script>

<style scoped>
.classify {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  overflow: hidden;
  padding-bottom: 100px;
}
.classify_title {
  margin-left: 20px;
  margin-top: 30px;
  font-size: 14px;
}
.classify_content {
  width: 85%;
  margin-left: 20px;
  margin-top: 20px;
}
</style>