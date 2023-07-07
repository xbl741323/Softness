<template>
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
    <!-- dialog-修改点击量 -->
    <el-dialog
      :title="$t('label.updateClickNumber')"
      :visible.sync="dialogVisible2"
      :close-on-click-modal="false"
      width="30%"
      center
      :before-close="handleClose"
    >
      <el-form :model="clickForm" ref="clickForm" inline :rules="clickRules">
        <el-form-item :label="$t('label.clickNumberTo')" prop="clickCount">
          <el-input
            v-model="clickForm.clickCount"
            style="width: 300px"
            type="number"
          ></el-input>
          <span style="margin-left: 10px">{{ $t("label.timeHotEssay") }}</span>
        </el-form-item>
        <div style="font-size: 12px; margin-left: 82px; margin-top: -5px">
          {{ $t("input.inputMoreThanThousand") }}
        </div>
        <div style="margin-left: 140px; margin-top: 20px">
          <el-button
            style="padding: 10px 30px"
            type="primary"
            @click="setClickCount"
            >{{ $t("button.confirm") }}</el-button
          >
          <el-button
            style="padding: 10px 30px; margin-left: 50px"
            @click="cancel"
            >{{ $t("button.cancel") }}</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <!-- 列表 -->
    <div style="width: 92%" v-if="type!=0">
      <h3 class="form-title">{{ $t("message.classSetting") }}</h3>
      <el-table :data="policyList" border>
        <el-table-column
          prop="categoryName"
          :label="$t('label.className')"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column prop="must" label="必填项" width="150" align="center">
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
              type="text"
              icon="el-icon-delete"
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
    <!-- 热点设置 -->
    <div :class="[type!=0?'hotSty1':'hotSty2']">
      <h3 class="form-title">{{ $t("message.hotSetting") }}</h3>
      <span class="special_desc">{{ $t("message.explain") }}</span>
      <div class="hot_set">
        <table>
          <tr style="flex: 0.8">
            <th>{{ $t("message.clickNumber") }}：</th>
            <th>{{ $t("message.listRight") }}：</th>
            <th>{{ $t("message.detailRight") }}：</th>
          </tr>
          <tr style="flex: 9">
            <td>
              <span>
                {{ $t("label.clickNumberTo") }}
                <span style="margin: 0 10px">{{ hotCount }}</span>
                {{ $t("label.timeHotEssay") }}
              </span>
              <el-button
                type="primary"
                style="margin-left: 30px"
                size="mini"
                @click="dialogVisible2 = true"
                >{{ $t("button.modify") }}</el-button
              >
            </td>
            <td>
              <span
                v-for="(item, index) in rightList"
                :key="index"
                style="margin-right: 5px"
              >
                <el-checkbox
                  :label="item.policyType"
                  v-model="item.isShow"
                  style="margin-right: 2px"
                  @change="checkChange(item)"
                ></el-checkbox>
                <span>
                  {{ $t("status.show") }}
                  <el-select
                    v-model="item.counts"
                    style="width: 75px; margin: 0 8px 0 4px"
                    @change="selectChange(item)"
                  >
                    <el-option
                      v-for="(item, index) in numberList"
                      :key="index"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                  {{ $t("message.numHot") }}
                </span>
              </span>
            </td>
            <td>
              <!-- 40 -->
              <span
                v-for="(item, index) in detailList"
                :key="index"
                style="margin-right: 5px"
              >
                <el-checkbox
                  :label="item.policyType"
                  v-model="item.isShow"
                  style="margin-right: 2px"
                  @change="checkChange(item)"
                ></el-checkbox>
                <span>
                  {{ $t("status.show") }}
                  <!-- 90 -->
                  <el-select
                    v-model="item.counts"
                    style="width: 75px; margin: 0 8px 0 4px"
                    @change="selectChange(item)"
                  >
                    <el-option
                      v-for="(item, index) in numberList"
                      :key="index"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                  {{ $t("message.numHot") }}
                </span>
              </span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  editSoleOption,
  getHotList,
  editHotParam,
  NewparamAdd,
  NewparamEdit,
  NewparamDel,
  getParamArr,
  getParamClass,
} from "@/api/notice/param";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  props: ["type"],
  data() {
    return {
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
      dialogVisible2: false,
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
    };
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
          NewparamDel(row.id).then((res) => {
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
        console.log("输出需要的数据",this.optionList)
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
    checkChange(obj) {
      console.log(obj);
      let params = {
        id: obj.id,
        articleType: obj.articleType,
        isShow: Number(obj.isShow),
      };
      editHotParam(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess"),
            offset: 100,
          });
          this.getHList();
        }
      });
    },
    selectChange(obj) {
      console.log(obj);
      let params = {
        id: obj.id,
        articleType: obj.articleType,
        counts: obj.counts,
      };
      editHotParam(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess"),
            offset: 100,
          });
          this.getHList();
        }
      });
    },
    setClickCount() {
      this.$refs["clickForm"].validate((valid) => {
        if (valid) {
          let params = {
            id: this.clickList[0].id,
            articleType: this.clickList[0].articleType,
            counts: this.clickForm.clickCount,
          };
          editHotParam(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: this.$t("button.modifySuccess"),
                offset: 100,
              });
              this.dialogVisible2 = false;
              this.getHList();
            }
          });
        }
      });
    },
    getHList() {
      getHotList(this.type).then((res) => {
        this.hotCount = res.data.data[0].hotspotSetVOs[0].counts;
        this.clickForm.clickCount = this.hotCount;
        this.clickList = res.data.data[0].hotspotSetVOs;
        this.rightList = res.data.data[1].hotspotSetVOs;
        this.detailList = res.data.data[2].hotspotSetVOs;
        this.rightList.forEach((item) => {
          item.isShow =
            item.isShow == "0" ? false : item.isShow == "1" ? true : "";
        });
        this.detailList.forEach((item) => {
          item.isShow =
            item.isShow == "0" ? false : item.isShow == "1" ? true : "";
        });
      });
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
          };
          break;
        case 1:
          this.soloParams = {
            id: row.id,
            choice: row.choice,
          };
          break;
        case 2:
          this.soloParams = {
            id: row.id,
            crmSearch: row.crmSearch,
          };
          break;
        case 3:
          this.soloParams = {
            id: row.id,
            crmStyle: row.crmStyle,
          };
          break;
        case 4:
          this.soloParams = {
            id: row.id,
            platSearch: row.platSearch,
          };
          break;
      }
      NewparamEdit(this.soloParams).then((res) => {
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
          NewparamAdd(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: this.$t("message.addSuccess"),
                offset: 100,
              });
              this.dialogVisible = false;
              this.getList();
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
    productCount() {
      this.numberList = [];
      for (let i = 1; i <= 20; i++) {
        let obj = {
          label: i,
          value: i,
        };
        this.numberList.push(obj);
      }
    },
  },
  mounted() {
    this.getHList();
    this.getList();
    this.productCount()
    this.getSelect();
  },
};
</script>

<style scoped>
.set_policy_param {
  background: #fff;
  width: 100%;
  padding: 20px 30px 100px 30px;
}
.form-title {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 14px;
}
.special_desc {
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
.img_sty {
  width: 100px;
  margin-left: 20px;
}
.hotSty1 {
  margin-top: 50px;
  width: 92%;
}
.hotSty2 {
  width: 92%;
  padding-bottom: 270px;;
}
</style>