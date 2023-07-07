<template>
<!-- 排查完成 -->
  <div class="set_policy_project">
    <!-- dialog-添加分类 -->
    <div class="set_policy_param">
      <!-- dialog-添加分类 -->
      <el-dialog
        :title="className"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="30%"
        center
        :before-close="handleClose"
      >
        <el-form :model="addForm" ref="addForm" inline :rules="rules">
          <div
            style="
              font-size: 12px;
              color: #ff6600;
              margin-bottom: 20px;
              margin-left: 10px;
            "
          >
            说明：
            如果当前的类目不能满足需求，请到网站设置-类目管理中进行添加或修改
          </div>
          <el-form-item :label="$t('label.className') + '：'" prop="classId">
            <el-select
              v-model="addForm.classId"
              style="width: 240px"
              placeholder="请选择"
              maxlength="10"
            >
              <el-option
                v-for="(item, index) in optionList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('label.yesOrNoSelect') + '：'"
            prop="mustSelect"
          >
            <el-radio-group v-model="addForm.mustSelect">
              <el-radio :label="1">{{ $t("message.yes") }}</el-radio>
              <el-radio :label="0">{{ $t("message.no") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div>
            <el-form-item
              :label="$t('label.soloOrMulSelect') + '：'"
              prop="selectType"
            >
              <el-radio-group v-model="addForm.selectType">
                <el-radio :label="0">{{ $t("message.soloSelect") }}</el-radio>
                <el-radio :label="1">{{ $t("message.mulSelect") }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              :label="$t('label.setSearchFilter') + '：'"
              prop="isPlat"
            >
              <span style="margin-left: 0px">
                {{ $t("label.crmStage") }}：
                <el-select style="width: 100px" v-model="addForm.isCrm">
                  <el-option :label="$t('message.yes')" :value="1"></el-option>
                  <el-option :label="$t('message.no')" :value="0"></el-option>
                </el-select>
              </span>
            </el-form-item>
            <el-form-item prop="crmStyle">
              <span style="margin-left: 10px">
                <el-select
                  style="width: 150px"
                  v-model="addForm.crmStyle"
                  placeholder="请选择"
                >
                  <el-option label="标签" :value="0"></el-option>
                  <el-option label="普通下拉框" :value="1"></el-option>
                  <el-option label="高级搜索" :value="2"></el-option>
                </el-select>
              </span>
            </el-form-item>
          </div>
          <div style="margin-left: 100px">
            <el-form-item prop="isCrm">
              <span style="margin-left: 20px">
                {{ $t("label.platStage") }}：
                <el-select style="width: 100px" v-model="addForm.isPlat">
                  <el-option :label="$t('message.yes')" :value="1"></el-option>
                  <el-option :label="$t('message.no')" :value="0"></el-option>
                </el-select>
              </span>
            </el-form-item>
          </div>
          <div style="margin-left: 140px; margin-top: 20px">
            <el-button
              style="padding: 10px 30px"
              type="primary"
              @click="addPolicyParams"
              >{{ $t("button.confirm") }}</el-button
            >
            <el-button
              style="padding: 10px 30px; margin-left: 50px"
              @click="closeDia"
              >{{ $t("button.cancel") }}</el-button
            >
          </div>
        </el-form>
      </el-dialog>
      <!-- 列表 -->
      <div style="width: 92%">
        <h3 class="form-title">{{ $t("message.classSetting") }}</h3>
        <el-table :data="policyList" border>
          <el-table-column
            prop="categoryName"
            :label="$t('label.className')"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="must"
            label="必填项"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <el-select
                style="width: 80px"
                v-model="scope.row.must"
                @change="changeSoleOption(scope.row, 0)"
              >
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="choice"
            :label="$t('label.soloOrMulSelect')"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <el-select
                style="width: 100px"
                v-model="scope.row.choice"
                @change="changeSoleOption(scope.row, 1)"
                :disabled="scope.$index == 0 || scope.$index == 1"
              >
                <el-option
                  :label="$t('message.soloSelect')"
                  :value="0"
                ></el-option>
                <el-option
                  :label="$t('message.mulSelect')"
                  :value="1"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="crmSearch"
            label="设为搜索条件（后台）"
            align="center"
            width="420"
          >
            <template slot-scope="scope">
              <span style="margin-left: 20px">
                <el-select
                  style="width: 80px"
                  v-model="scope.row.crmSearch"
                  @change="changeSoleOption(scope.row, 2)"
                >
                  <el-option :label="$t('message.yes')" :value="1"></el-option>
                  <el-option :label="$t('message.no')" :value="0"></el-option>
                </el-select>
              </span>
              <span style="margin-left: 10px">
                标签搜索：
                <el-select
                  v-model="scope.row.crmStyle"
                  style="width: 120px"
                  placeholder="请选择"
                  @change="changeSoleOption(scope.row, 3)"
                >
                  <el-option label="标签" :value="0"></el-option>
                  <el-option label="普通下拉框" :value="1"></el-option>
                  <el-option label="高级搜索" :value="2"></el-option>
                </el-select>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="platSearch"
            label="设为搜索条件（前台）"
            align="center"
            width="400"
          >
            <template slot-scope="scope">
              <span style="margin-left: 20px">
                <el-select
                  style="width: 80px"
                  v-model="scope.row.platSearch"
                  @change="changeSoleOption(scope.row, 4)"
                >
                  <el-option :label="$t('message.yes')" :value="1"></el-option>
                  <el-option :label="$t('message.no')" :value="0"></el-option>
                </el-select>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="option" label="操作" align="center">
            <template slot-scope="scope">
              <div style="display: inline-block; width: 60px">
                <i
                  class="el-icon-sort-down"
                  style="font-size: 20px; cursor: pointer; color: #409eff"
                  id="down"
                  v-if="scope.$index !== policyList.length - 1"
                ></i>
                <i
                  class="el-icon-sort-up"
                  style="font-size: 20px; cursor: pointer; color: #409eff"
                  id="up"
                  v-if="scope.$index !== 0"
                ></i>
              </div>
              <el-button
                @click="delClass(scope.row, scope.$index)"
                size="mini"
                type="primary"
                v-if="scope.$index > 1"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="margin-top: 20px" @click="addClass">{{
          $t("message.addClass")
        }}</el-button>
      </div>
    </div>
    <!-- dialog-修改权重值 -->
    <el-dialog
      :title="$t('message.setWeight')"
      :visible.sync="dialogVisible2"
      :close-on-click-modal="false"
      width="30%"
      center
      :before-close="handleWeightClose"
    >
      <div>
        <div style="display: flex; flex-direction: row-reverse">
          <div>
            <el-table
              :data="optionWeightList"
              style="width: 100%; border-left: none"
              @selection-change="handleSelectionChange"
              border
            >
              <el-table-column width="240" :label="$t('message.weightValue')">
                <template slot-scope="scope">
                  <el-input
                    @blur="getInputValue(scope.row)"
                    type="number"
                    :disabled="scope.row.required == 0 ? true : false"
                    v-model="scope.row.weight"
                    oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+4)}"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div>
            <el-table
              :data="optionOtherList"
              style="width: 100%"
              border
              @selection-change="handleSelectionChange"
              @select="selectSolo"
              @select-all="selectAll"
              ref="projectTable"
            >
              <el-table-column type="selection" width="100"></el-table-column>
              <el-table-column
                :label="$t('label.option')"
                width="185"
                prop="classSetName"
              >
                <template slot-scope="scope">
                  <div style="height: 32px">{{ scope.row.classSetName }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="total_fix">
          <span>{{ $t("message.total") }}</span>
          <span v-if="weightCount == 1">{{ weightCount | countFilter }}</span>
          <span v-else style="color: red">{{ weightCount | countFilter }}</span>
        </div>
        <div class="for_set_weight">
          <el-button
            type="primary"
            style="width: 80px; margin-right: 40px"
            @click="editWeightValue"
            >{{ $t("button.confirm") }}</el-button
          >
          <el-button style="width: 80px" @click="cancel">{{
            $t("button.cancel")
          }}</el-button>
          <span
            style="cursor: pointer; color: blue; margin-left: 30px"
            @click="resetValue"
            >恢复默认值</span
          >
        </div>
      </div>
    </el-dialog>
    <!-- 推荐设置 -->
    <div style="margin-top: 50px; width: 92%">
      <h3 class="form-title">{{ $t("message.introSetting") }}</h3>
      <div class="hot_set">
        <table>
          <tr style="flex: 0.8">
            <th>{{ $t("message.introNumber") }}：</th>
            <th>{{ $t("message.optionWeight") }}：</th>
          </tr>
          <tr style="flex: 9">
            <td>
              <el-form inline :model="introForm">
                <el-form-item>
                  <el-select
                    v-model="introForm.introCount"
                    style="width: 100px; margin-top: 10px"
                    @change="introChange"
                  >
                    <el-option
                      v-for="(item, index) in countList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </td>
            <td>
              <span
                v-for="(item, index) in weightList"
                :key="index"
                :class="[index > 0 ? 'special' : '']"
                >{{ item.classSetName }}：{{ item.weight }}</span
              >
              <el-button
                style="margin-left: 20px"
                size="mini"
                type="primary"
                @click="openTable"
                >{{ $t("message.setUp") }}</el-button
              >
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="explain-sty">
    <p>说明：</p>
    <p>1.推荐数量指在某项目申报产品的详情页，右侧推荐栏里推荐的项目数量；</p>
    <p>2.匹配度计算方式：匹配度值=匹配分类1*匹配分类1权重+匹配分类2*匹配分类2权重+......+匹配分类n*匹配分类n权重</p>
    <p>相同选项则得该项权重满分，不同则得0分，有空分类时得满分，见示例。</p>
    <p>3.排序方式：按匹配度倒序，匹配度相同时，按发布时间倒选序（不含当前页面项目）</p>
    <p>例：假设分类A、B、C、D为参与计算权重的选项，且权重均分，每项权重为0.250</p>
    <img src="//static.wotao.com/banner/6abf950e51334d3db238b07e828eae6a.png" alt="">
    <p>项目1和项目2的匹配度为：0.25+0+0.25+0.25=0.75</p>
    </div>
  </div>
</template>

<script>
import {
  paramAdd,
  paramEdit,
  paramDel,
  getParamArr,
  getParamClass,
} from "@/api/notice/param";
import {
  changeRecCount,
  getRecList,
  getAll,
  reSetWeight,
  editWeight,
} from "@/api/project/project";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  data() {
    return {
      type: 4,
      soloParams: {},
      optionList: [],
      params: {},
      areaSelectObj: null,
      //热点区域
      hotCount: "",
      rightList: {},
      detailList: {},
      //参数设置区域
      className: this.$t("message.addClass"),
      dialogVisible: false,
      numberList: [],
      clickForm: {
        clickCount: "",
      },
      clickRules: {
        clickCount: [
          {
            required: true,
            message: this.$t("message.clickWarning"),
            trigger: "blur",
            pattern: /^[1-9]\d{2,9}(^(-)?\d+$)?$/,
          },
        ],
      },
      rules: {
        classId: [
          {
            required: true,
            message: "请选择分类名称",
            trigger: "blur",
          },
        ],
        mustSelect: [
          {
            required: true,
            message: this.$t("message.pleaseSelectOrMust"),
            trigger: "blur",
          },
        ],
        isPlat: [
          {
            required: true,
            message: this.$t("message.pleaseSelectSearchFilter"),
            trigger: "blur",
          },
        ],
        isCrm: [
          {
            required: true,
            message: this.$t("message.pleaseSelectSearchFilter"),
            trigger: "blur",
          },
        ],
        selectType: [
          {
            required: true,
            message: this.$t("message.pleaseSelect"),
            trigger: "blur",
          },
        ],
        crmStyle: [
          {
            required: true,
            message: this.$t("message.pleaseSelectSearchFilter"),
            trigger: "blur",
          },
        ],
      },
      addForm: {
        classId: "",
        mustSelect: "",
        isPlat: "",
        isCrm: "",
        optionsList: [],
        selectType: "",
        crmStyle: "",
      },
      policyList: [],
      //-----------------
      weightCount: "",
      recommendSetList: [],
      arr: [],
      paramId: "",
      setWeightList: [],
      optionOtherList: [],
      weightList: [],
      recommendData: [],
      //参数设置区域
      dialogVisible2: false,
      optionWeightList: [],
      countList: [],
      introForm: {
        introCount: "",
      },
    };
  },
  filters: {
    countFilter(value) {
      let priceStr = "" + value;
      if (priceStr.indexOf(".") > -1) {
        let arr = priceStr.split(".");
        return arr[0] + "." + (arr[1] + "0").substr(0, 3);
      } else {
        return priceStr + ".000";
      }
    },
  },
  methods: {
    delClass(row, index) {
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
          paramDel(row.id).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "删除成功！",
              });
              this.getList();
            } else {
              this.$message({
                type: "warning",
                message: res.data.data,
              });
            }
          });
        })
        .catch(() => {
          this.getList();
        });
    },
    getSelect() {
      getParamClass().then((res) => {
        this.optionList = res.data.data;
      });
    },
    cancel() {
      this.dialogVisible2 = false;
      this.clickForm.clickCount = this.hotCount;
      this.getList();
    },
    closeDia() {
      this.dialogVisible = false;
      this.getList();
    },
    getList() {
      getParamArr(this.type).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.policyList = res.data.data;
        }
      });
    },
    changeSoleOption(row, soloType) {
      this.$confirm(this.$t("message.sureUpdate"), this.$t("message.tips"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      })
        .then(() => {
          this.editSoleParams(row, soloType);
        })
        .catch(() => {
          this.getList();
        });
    },
    editSoleParams(row, soloType) {
      console.log("输出的待改参数对象！", row);
      console.log("输出的待改参数！", soloType);
      this.soloParams = {};
      switch (soloType) {
        case 0:
          this.soloParams = {
            id: row.id,
            must: row.must,
            policyCatagoryId:row.policyCatagoryId
          };
          break;
        case 1:
          this.soloParams = {
            id: row.id,
            choice: row.choice,
            policyCatagoryId:row.policyCatagoryId
          };
          break;
        case 2:
          this.soloParams = {
            id: row.id,
            crmSearch: row.crmSearch,
            policyCatagoryId:row.policyCatagoryId
          };
          break;
        case 3:
          this.soloParams = {
            id: row.id,
            crmStyle: row.crmStyle,
            policyCatagoryId:row.policyCatagoryId
          };
          break;
        case 4:
          this.soloParams = {
            id: row.id,
            platSearch: row.platSearch,
            policyCatagoryId:row.policyCatagoryId
          };
          break;
      }
      paramEdit(this.soloParams).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess"),
            offset: 100,
          });
          this.getList();
        }
      });
    },
    addPolicyParams() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          let params = {
            type: this.type,
            categoryId: this.addForm.classId,
            choice: this.addForm.selectType,
            crmSearch: this.addForm.isCrm,
            platSearch: this.addForm.crmStyle,
            crmStyle: this.addForm.crmStyle,
            must: this.addForm.mustSelect,
          };
          paramAdd(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: this.$t("message.addSuccess"),
                offset: 100,
              });
              this.dialogVisible = false;
              this.getList();
              this.getRecList();
              this.getRecList2();
              this.getAllList();
            } else if (res.data.code == CodeMsg.CODE_2000) {
              this.$message({
                type: "warning",
                message: res.data.data,
                offset: 100,
              });
            } else if (res.data.code == CodeMsg.CODE_2002) {
              this.$message({
                type: "warning",
                message: res.data.data,
                offset: 100,
              });
            }
          });
        }
      });
    },
    addClass() {
      this.dialogVisible = true;
      this.addForm = {};
    },
    handleClose(done) {
      done();
    },
    //------------------------------------------------
    getInputValue(val) {
      console.log(val, "inputValue");
      this.recommendSetList.forEach((item) => {
        if (item.id == val.id) {
          item.weight = val.weight;
        }
      });
      this.weightCount = 0;
      this.recommendSetList.forEach((item) => {
        this.weightCount = this.weightCount + Number(item.weight);
      });
    },
    //编辑权重值
    editWeightValue() {
      let param = {
        recommendSetList: this.recommendSetList,
      };
      editWeight(param).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: this.$t("alert.sucessEdit"),
          });
          this.dialogVisible2 = false;
          this.getAllList();
          this.getRecList();
          this.getRecList2();
        } else if (res.data.code == CodeMsg.CODE_2005) {
          this.$message({
            type: "warning",
            message: res.data.data,
          });
        }
      });
    },
    openTable() {
      this.getAllList();
      this.getRecList();
      this.dialogVisible2 = true;
      this.$nextTick(() => {
        this.optionOtherList.forEach((item) => {
          if (item.required == 1) {
            this.$refs.projectTable.toggleRowSelection(item, true);
          }
        });
      });
    },
    //勾选全部
    selectAll(val) {
      this.getSelectData(val);
    },
    //单个勾选
    selectSolo(val) {
      this.getSelectData(val);
    },
    getSelectData(val) {
      let arr = [];
      val.forEach((item) => {
        arr.push(item.id);
      });
      let params = {
        ids: arr,
      };
      reSetWeight(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          // this.getRecList();
          this.optionWeightList = res.data.data;
          this.optionOtherList = res.data.data;
          this.$nextTick(() => {
            this.optionOtherList.forEach((item) => {
              if (item.required == 1) {
                this.$refs.projectTable.toggleRowSelection(item, true);
              }
            });
          });
          this.recommendSetList = [];
          res.data.data.forEach((item) => {
            let obj = {
              id: item.id,
              weight: item.weight,
            };
            this.recommendSetList.push(obj);
          });
          this.weightCount = 0;
          this.recommendSetList.forEach((item) => {
            this.weightCount = this.weightCount + Number(item.weight);
          });
          // this.getInputValue();
          this.getAllList();
        }
        if (res.data.code == CodeMsg.CODE_2001) {
          this.$message({
            type: "warning",
            message: res.data.data,
          });
        }
      });
    },
    handleSelectionChange(val) {
      console.log(val, "输出待编辑的数值");
      this.recommendSetList = [];
      this.arr = [];
      val.forEach((item) => {
        this.arr.push(item.id);
        let obj = {
          id: item.id,
          weight: item.weight,
        };
        this.recommendSetList.push(obj);
      });
    },
    //恢复默认值
    resetValue() {
      let params = {
        ids: this.arr,
      };
      reSetWeight(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.getRecList();
          this.getAllList();
        }
        if (res.data.code == CodeMsg.CODE_2001) {
          this.$message({
            type: "warning",
            message: res.data.data,
          });
        }
      });
    },
    getAllList() {
      getAll().then((res) => {
        this.recommendData = res.data.data;
        console.log(this.recommendData);
        this.introForm.introCount = this.recommendData[0].recommendSetList[0].weight;
        this.paramId = this.recommendData[0].recommendSetList[0].id;
        this.weightList = this.recommendData[1].recommendSetList;
      });
    },
    getRecList() {
      getRecList().then((res) => {
        this.optionWeightList = res.data.data.weightList;
        this.weightCount = res.data.data.sum;
        this.recommendSetList = [];
        res.data.data.weightList.forEach((item) => {
          let obj = {
            id: item.id,
            weight: item.weight,
          };
          this.recommendSetList.push(obj);
        });
      });
    },
    getRecList2() {
      getRecList().then((res) => {
        this.optionOtherList = res.data.data.weightList;
      });
    },
    introChange() {
      this.$confirm(this.$t("message.sureUpdate"), this.$t("message.tips"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: this.paramId,
            weight: this.introForm.introCount,
          };
          changeRecCount(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: this.$t("button.modifySuccess"),
                offset: 300,
              });
            }
          });
        })
        .catch(() => {});
    },
    cancel() {
      this.dialogVisible2 = false;
      this.getList();
      this.getRecList();
      this.getRecList2();
    },
    handleWeightClose() {
      this.dialogVisible2 = false;
      this.getRecList();
      this.getRecList2();
    },
    productCount() {
      this.countList = [];
      for (let i = 1; i <= 20; i++) {
        let obj = {
          label: i,
          value: i,
        };
        this.countList.push(obj);
      }
    },
  },
  mounted() {
    this.getList();
    this.getSelect();
    //-----------------------
    this.getRecList();
    this.getRecList2();
    this.getAllList();
    this.productCount();
  },
};
</script>

<style scoped>
.set_policy_project {
  background: #fff;
  width: 100%;
  padding: 20px 30px 100px 30px;
  margin-left: 10px;
}
.form-title {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 14px;
}
table,
th,
td {
  border-collapse: collapse;
}
.hot_set tr {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.hot_set table {
  width: 100%;
  border-left: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  display: flex;
}
.hot_set td,
.hot_set th {
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  height: 50px;
  line-height: 50px;
  padding: 0 15px 0 20px;
  width: 100%;
  font-size: 14px;
}
.hot_set th {
  text-align: right;
}
.for_set_weight {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;
}
.special {
  margin-left: 20px;
}
.total_fix {
  width: 100%;
  border: 1px solid #ebeef5;
  border-top: none;
  height: 41px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.total_fix span {
  flex: 1;
  text-align: center;
  height: 100%;
  line-height: 41px;
}
.total_fix > span:nth-of-type(2) {
  flex: 0.84;
  border-left: 1px solid #ebeef5;
}
.img_sty {
  width: 100px;
  margin-left: 20px;
}
.explain-sty{
  font-size: 14px;
  line-height: 12px;
  color: #FF6600;
}
</style>