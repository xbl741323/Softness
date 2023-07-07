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
        <el-form-item :label="$t('label.className')+'：'" prop="className">
          <el-input
            v-model="addForm.className"
            style="width:300px;"
            :placeholder="$t('message.noMoreThanTen')"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('label.yesOrNoSelect')+'：'" prop="mustSelect">
          <el-radio-group v-model="addForm.mustSelect">
            <el-radio :label="1">{{$t('message.yes')}}</el-radio>
            <el-radio :label="0">{{$t('message.no')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div>
          <el-form-item :label="$t('label.soloOrMulSelect')+'：'" prop="selectType">
            <el-radio-group v-model="addForm.selectType">
              <el-radio :label="0">{{$t('message.soloSelect')}}</el-radio>
              <el-radio :label="1">{{$t('message.mulSelect')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('label.setSearchFilter')+'：'" prop="isPlat">
            <span style="margin-left:0px;">
              {{$t('label.platStage')}}：
              <el-select style="width:90px;" v-model="addForm.isPlat">
                <el-option :label="$t('message.yes')" :value="1"></el-option>
                <el-option :label="$t('message.no')" :value="0"></el-option>
              </el-select>
            </span>
          </el-form-item>
          <el-form-item prop="isCrm">
            <span style="margin-left:20px;">
              {{$t('label.crmStage')}}：
              <el-select style="width:90px;" v-model="addForm.isCrm">
                <el-option :label="$t('message.yes')" :value="1"></el-option>
                <el-option :label="$t('message.no')" :value="0"></el-option>
              </el-select>
            </span>
          </el-form-item>
        </div>
        <div style="margin-left:20px;" v-if="className == appendClass">
          <div v-for="(item,index) in arrOptionList" :key="index">
            <el-form-item :label="$t('label.option')+(index+1)">
              <el-input
                v-model="item.options"
                style="width:200px;margin-right:20px;margin-bottom:-10px;"
                :placeholder="$t('message.noMoreThanTen')"
                maxlength="10"
              ></el-input>
              <span style="margin-right:10px;display:inline-block;width:40px;">
                <i
                  class="el-icon-sort-down"
                  style="font-size:20px;cursor:pointer;color:#409eff;"
                  id="down"
                  v-if="index!==arrOptionList.length-1"
                  @click="handleMoveDown(index,item)"
                ></i>
                <i
                  class="el-icon-sort-up"
                  style="font-size:20px;cursor:pointer;color:#409eff;"
                  id="up"
                  v-if="index!==0"
                  @click="handleMoveUp(index,item)"
                ></i>
              </span>
              <el-button size="mini" @click="sliceList(index)">-</el-button>
              <el-button size="mini" v-if="(index+1) == arrOptionList.length" @click="pushList">+</el-button>
            </el-form-item>
          </div>
        </div>
        <div style="margin-left:20px;" v-if="className == updateClass">
          <div v-for="(item,index) in arrOptionList" :key="index">
            <el-form-item :label="'选项'+(index+1)">
              <el-input
                v-model="item.options"
                style="width:200px;margin-right:20px;margin-bottom:-10px;"
                maxlength="10"
              ></el-input>
              <span style="margin-right:10px;display:inline-block;width:40px;">
                <i
                  class="el-icon-sort-down"
                  style="font-size:20px;cursor:pointer;color:#409eff;"
                  id="down"
                  v-if="index!==arrOptionList.length-1"
                  @click="handleMoveDown(index,item)"
                ></i>
                <i
                  class="el-icon-sort-up"
                  style="font-size:20px;cursor:pointer;color:#409eff;"
                  id="up"
                  v-if="index!==0"
                  @click="handleMoveUp(index,item)"
                ></i>
              </span>
              <el-button
                size="mini"
                @click="sliceList(index)"
                :disabled="((index==0||index==1)&&(item.classSetNumber=='f764cbf22ca14416a9c2d7576426b368'))"
              >-</el-button>
              <el-button size="mini" v-if="(index+1) == arrOptionList.length" @click="pushList">+</el-button>
            </el-form-item>
          </div>
        </div>
        <div style="margin-left:140px;margin-top:20px;">
          <el-button
            style="padding:10px 30px;"
            type="primary"
            @click="addPolicyParams"
            v-if="className == appendClass"
          >{{$t('button.confirm')}}</el-button>
          <el-button
            style="padding:10px 30px;"
            type="primary"
            @click="editPolicyParams"
            v-if="className == updateClass"
          >{{$t('button.confirm')}}</el-button>
          <el-button
            style="padding:10px 30px;margin-left:50px;"
            @click="closeDia"
          >{{$t('button.cancel')}}</el-button>
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
          <el-input v-model="clickForm.clickCount" style="width:300px;" type="number"></el-input>
          <span style="margin-left:10px;">{{$t('label.timeHotEssay')}}</span>
        </el-form-item>
        <div
          style="font-size:12px;margin-left:82px;margin-top:-5px;"
        >{{$t('input.inputMoreThanThousand')}}</div>
        <div style="margin-left:140px;margin-top:20px;">
          <el-button
            style="padding:10px 30px;"
            type="primary"
            @click="setClickCount"
          >{{$t('button.confirm')}}</el-button>
          <el-button
            style="padding:10px 30px;margin-left:50px;"
            @click="cancel"
          >{{$t('button.cancel')}}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- dialog-添加选项 -->
    <el-dialog
      :title="$t('message.addClass')"
      :visible.sync="dialogVisible3"
      :close-on-click-modal="false"
      width="30%"
      center
      :before-close="handleClose"
    >
      <el-form :model="addOptionForm" ref="addOptionForm" inline :rules="addOpRules">
        <el-form-item
          :label="$t('label.optionName')+'：'"
          prop="optionData"
          style="margin-left:25px;"
        >
          <el-input
            v-model="addOptionForm.optionData"
            style="width:300px;"
            :placeholder="$t('message.noMoreThanTen')"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <div style="margin-left:140px;margin-top:15px;">
          <el-button
            style="padding:10px 30px;"
            type="primary"
            @click="addSelectObj"
          >{{$t('button.confirm')}}</el-button>
          <el-button
            style="padding:10px 30px;margin-left:50px;"
            @click="dialogVisible3 = false"
          >{{$t('button.cancel')}}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <div style="width:92%;">
      <h3 class="form-title">{{$t('message.classSetting')}}</h3>
      <el-table :data="policyList" border>
        <el-table-column prop="name" :label="$t('label.className')" width="150"></el-table-column>
        <el-table-column prop="soloOrMuSelect" :label="$t('label.soloOrMulSelect')" width="130">
          <template slot-scope="scope">
            <el-select
              style="padding:0 10px;"
              v-model="scope.row.choice"
              @change="changeChoice(scope.row)"
            >
              <el-option :label="$t('message.soloSelect')" :value="0"></el-option>
              <el-option :label="$t('message.mulSelect')" :value="1"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="searchFilter" :label="$t('label.setSearchFilter')" width="300">
          <template slot-scope="scope">
            <span style="margin-left:20px;">
              {{$t('label.platStage')}}：
              <el-select
                style="width:60px;"
                v-model="scope.row.isPlat"
                @change="changeCrm(scope.row)"
              >
                <el-option :label="$t('message.yes')" :value="1"></el-option>
                <el-option :label="$t('message.no')" :value="0"></el-option>
              </el-select>
            </span>
            <span style="margin-left:10px;">
              {{$t('label.crmStage')}}：
              <el-select
                style="width:60px;"
                v-model="scope.row.isCrm"
                @change="changeCrm(scope.row)"
              >
                <el-option :label="$t('message.yes')" :value="1"></el-option>
                <el-option :label="$t('message.no')" :value="0"></el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="option" :label="$t('label.option')">
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              style="margin-right:8px;"
              v-for="(item,index) in scope.row.optionsList"
              :key="index"
              :closable="((index==0||index==1)&&(scope.$index==0))?false:true"
              @close="delOption(item)"
              type="primary"
              size="medium"
            >{{ item.options }}</el-tag>
            <el-button
              size="mini"
              @click="addOptionSelect(scope.$index,scope.row)"
            >+{{$t('label.option')}}</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="editClass(scope.$index,scope.row)"
            >{{$t('button.modify')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        style="margin-top:20px;"
        @click="addClass"
        disabled
      >{{$t("message.addClass")}}</el-button>
    </div>
    <!-- 热点设置 -->
    <div style="margin-top:50px;width:92%;">
      <h3 class="form-title">{{$t("message.hotSetting")}}</h3>
      <span class="special_desc">{{$t('message.explain')}}</span>
      <div class="hot_set">
        <table>
          <tr style="flex:0.8;">
            <th>{{$t('message.clickNumber')}}：</th>
            <th>{{$t('message.listRight')}}：</th>
          </tr>
          <tr style="flex:9;">
            <td>
              <span>
                {{$t('label.clickNumberTo')}}
                <span style="margin:0 10px;">{{ hotCount }}</span>
                {{$t('label.timeHotEssay')}}
              </span>
              <el-button
                type="primary"
                style="margin-left:30px;"
                size="mini"
                @click="dialogVisible2 = true"
              >{{$t('button.modify')}}</el-button>
            </td>
            <td>
              <span v-for="(item,index) in rightList" :key="index" style="margin-right: 5px">
                <el-checkbox
                  :label="item.policyType"
                  v-model="item.isShow"
                  style="margin-right:2px;"
                  @change="checkChange(item)"
                ></el-checkbox>
                <span>
                  {{$t('status.show')}}
                  <el-select
                    v-model="item.counts"
                    style="width: 75px; margin: 0 8px 0 4px"
                    @change="selectChange(item)"
                  >
                    <el-option
                      v-for="(item,index) in numberList"
                      :key="index"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                  {{$t('message.numHot')}}
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
  addParam,
  getParamArr,
  addOption,
  deleteOption,
  editOption,
  editSoleOption,
  getHotList,
  editHotParam
} from "@/api/notice/param";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  data() {
    return {
      selectParams: new FormData(),
      appendClass: this.$t("message.addClass"),
      updateClass: this.$t("message.updateClass"),
      //热点区域
      hotCount: "",
      rightList: {},
      //参数设置区域
      soleParam: {},
      editId: "",
      editNumber: "",
      className: "",
      selectSpecial: "0",
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      waitAddObj: {},
      numberList: [],
      arrOptionList: [
        {
          options: ""
        },
        {
          options: ""
        }
      ],
      addOptionForm: {
        optionData: ""
      },
      clickForm: {
        clickCount: ""
      },
      addOpRules: {
        optionData: [
          {
            required: true,
            message: this.$t("message.optionNameNotNull"),
            trigger: "blur"
          }
        ]
      },
      clickRules: {
        clickCount: [
          {
            required: true,
            message: this.$t("message.clickWarning"),
            trigger: "blur",
            pattern: /^[1-9]\d{2,9}(^(-)?\d+$)?$/
          }
        ]
      },
      rules: {
        className: [
          {
            required: true,
            message: this.$t("message.pleaseInputClassName"),
            trigger: "blur"
          }
        ],
        mustSelect: [
          {
            required: true,
            message: this.$t("message.pleaseSelectOrMust"),
            trigger: "blur"
          }
        ],
        isPlat: [
          {
            required: true,
            message: this.$t("message.pleaseSelectSearchFilter"),
            trigger: "blur"
          }
        ],
        isCrm: [
          {
            required: true,
            message: this.$t("message.pleaseSelectSearchFilter"),
            trigger: "blur"
          }
        ],
        selectType: [
          {
            required: true,
            message: this.$t("message.pleaseSelect"),
            trigger: "blur"
          }
        ]
      },
      addForm: {
        className: "",
        mustSelect: "1",
        isPlat: "1",
        isCrm: "1",
        optionsList: [],
        selectType: ""
      },
      policyList: []
    };
  },
  methods: {
    //新增排序操作
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
    changeChoice(row) {
      this.$confirm(this.$t("message.sureUpdate"), this.$t("message.tips"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          console.log(row);
          this.editChoiceParams(row);
        })
        .catch(() => {
          this.getList();
        });
    },
    editChoiceParams(row) {
      let params = {
        id: row.id,
        choice: row.choice
      };
      editSoleOption(params).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess"),
            offset: 100
          });
          this.getList();
        }
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
        isShow: Number(obj.isShow)
      };
      editHotParam(params).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess"),
            offset: 100
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
        counts: obj.counts
      };
      editHotParam(params).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess"),
            offset: 100
          });
          this.getHList();
        }
      });
    },
    setClickCount() {
      this.$refs["clickForm"].validate(valid => {
        if (valid) {
          let params = {
            id: this.clickList[0].id,
            articleType: this.clickList[0].articleType,
            counts: this.clickForm.clickCount
          };
          editHotParam(params).then(res => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: this.$t("button.modifySuccess"),
                offset: 100
              });
              this.dialogVisible2 = false;
              this.getHList();
            }
          });
        }
      });
    },
    getHList() {
      getHotList(3).then(res => {
        this.hotCount = res.data.data[0].hotspotSetVOs[0].counts;
        this.clickForm.clickCount = this.hotCount;
        this.clickList = res.data.data[0].hotspotSetVOs;
        this.rightList = res.data.data[1].hotspotSetVOs;
        this.rightList.forEach(item => {
          item.isShow =
            item.isShow == "0" ? false : item.isShow == "1" ? true : "";
        });
      });
    },
    sliceList(index) {
      if (this.className == this.updateClass) {
        this.$confirm(this.$t("message.sureDel"), this.$t("message.tips"), {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning"
        })
          .then(() => {
            if (this.arrOptionList.length > 1) {
              console.log(index);
              this.arrOptionList.splice(index, 1);
            } else {
              this.$message({
                type: "warning",
                message: this.$t("message.leastSelectOne"),
                offset: 100
              });
            }
          })
          .catch(() => {
            this.getList();
          });
      } else {
        if (this.arrOptionList.length > 1) {
          console.log(index);
          this.arrOptionList.splice(index, 1);
        } else {
          this.$message({
            type: "warning",
            message: this.$t("message.leastSelectOne"),
            offset: 100
          });
        }
      }
    },
    pushList() {
      if (this.className == this.appendClass) {
        let obj = {
          options: ""
        };
        this.arrOptionList.push(obj);
      } else if (this.className == this.updateClass) {
        let obj2 = {
          options: "",
          classSetNumber: this.editNumber
        };
        this.arrOptionList.push(obj2);
      }
    },
    delOption(obj) {
      this.$confirm(this.$t("message.sureDel"), this.$t("message.tips"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          let params = {
            number: obj.classSetNumber,
            id: obj.id
          };
          deleteOption(params).then(res => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: this.$t("message.deleteSuccess"),
                offset: 100
              });
              this.getList();
            } else if (res.data.code == CodeMsg.CODE_2004) {
              this.$message({
                type: "warning",
                message: res.data.data,
                offset: 300
              });
            }
          });
        })
        .catch(() => {
          this.getList();
        });
      console.log(obj);
    },
    addSelectObj() {
      this.$refs["addOptionForm"].validate(valid => {
        if (valid) {
          this.selectParams = new FormData();
          this.selectParams.append("classSetNumber", this.waitAddObj.number);
          this.selectParams.append("options", this.addOptionForm.optionData);
          addOption(this.selectParams).then(res => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: this.$t("message.addSuccess"),
                offset: 100
              });
              this.addOptionForm.optionData = "";
              this.dialogVisible3 = false;
              this.getList();
            } else if (res.data.code == CodeMsg.CODE_2000) {
              this.$message({
                type: "warning",
                message: res.data.data,
                offset: 100
              });
              this.addOptionForm.optionData = "";
            }
          });
        }
      });
    },
    addOptionSelect(index, row) {
      this.dialogVisible3 = true;
      this.waitAddObj = row;
      console.log(this.waitAddObj);
    },
    getList() {
      getParamArr(3).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.policyList = res.data.data;
        }
      });
    },
    changeCrm(row) {
      this.$confirm(this.$t("message.sureUpdate"), this.$t("message.tips"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          console.log(row);
          this.soleParam = row;
          this.editSoleParams();
        })
        .catch(() => {
          this.getList();
        });
    },
    editSoleParams() {
      let params = {
        id: this.soleParam.id,
        isCrm: this.soleParam.isCrm,
        isPlat: this.soleParam.isPlat
      };
      editSoleOption(params).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess"),
            offset: 100
          });
          this.getList();
        }
      });
    },
    editPolicyParams() {
      this.arrOptionList.forEach((item, index) => {
        item.sort = index + 1;
      });
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          //判断前台显示的选项必须为2个
          let checkArr = [];
          let nullArr = [];
          checkArr = this.arrOptionList.filter(item => {
            return item.options !== "";
          });
          nullArr = this.arrOptionList.filter(item => {
            return item.options !== "";
          });
          console.log(checkArr);
          if (checkArr.length >= 1) {
            let params = {
              id: this.editId,
              type: 3,
              number: this.editNumber,
              name: this.addForm.className,
              required: this.addForm.mustSelect,
              isPlat: this.addForm.isPlat,
              isCrm: this.addForm.isCrm,
              choice: this.addForm.selectType,
              optionsList: nullArr
            };
            editOption(params).then(res => {
              if (res.data.code == CodeMsg.CODE_1000) {
                this.$message({
                  type: "success",
                  message: this.$t("button.modifySuccess"),
                  offset: 100
                });
                this.dialogVisible = false;
                this.arrOptionList = [
                  {
                    options: ""
                  },
                  {
                    options: ""
                  }
                ];
                this.getList();
              } else if (res.data.code == CodeMsg.CODE_2000) {
                this.$message({
                  type: "warning",
                  message: res.data.data,
                  offset: 100
                });
              } else if (res.data.code == CodeMsg.CODE_2002) {
                this.$message({
                  type: "warning",
                  message: res.data.data,
                  offset: 100
                });
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: this.$t("message.leastInputOne"),
              offset: 100
            });
          }
        }
      });
    },
    addPolicyParams() {
      this.arrOptionList.forEach((item, index) => {
        item.sort = index + 1;
      });
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          //判断前台显示的选项必须为2个
          let checkArr = [];
          let nullArr = [];
          checkArr = this.arrOptionList.filter(item => {
            return item.options !== "";
          });
          nullArr = this.arrOptionList.filter(item => {
            return item.options !== "";
          });
          console.log(checkArr);
          if (checkArr.length >= 1) {
            let params = {
              type: 3,
              name: this.addForm.className,
              required: this.addForm.mustSelect,
              isPlat: this.addForm.isPlat,
              isCrm: this.addForm.isCrm,
              choice: this.addForm.selectType,
              optionsList: nullArr
            };
            addParam(params).then(res => {
              if (res.data.code == CodeMsg.CODE_1000) {
                this.$message({
                  type: "success",
                  message: this.$t("message.addSuccess"),
                  offset: 100
                });
                this.dialogVisible = false;
                this.getList();
              } else if (res.data.code == CodeMsg.CODE_2000) {
                this.$message({
                  type: "warning",
                  message: res.data.data,
                  offset: 100
                });
              } else if (res.data.code == CodeMsg.CODE_2002) {
                this.$message({
                  type: "warning",
                  message: res.data.data,
                  offset: 100
                });
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: this.$t("message.leastInputOne"),
              offset: 100
            });
          }
        }
      });
    },
    addClass() {
      this.arrOptionList = [
        {
          options: "",
          required: ""
        },
        {
          options: "",
          required: ""
        }
      ];
      this.className = this.appendClass;
      this.dialogVisible = true;
      this.addForm = {};
    },
    editClass(index, row) {
      this.className = this.updateClass;
      this.dialogVisible = true;
      this.editId = row.id;
      this.editNumber = row.number;
      this.addForm.className = row.name;
      this.addForm.mustSelect = row.required;
      this.addForm.isPlat = row.isPlat;
      this.addForm.isCrm = row.isCrm;
      this.addForm.selectType = row.choice;
      this.arrOptionList = row.optionsList;
      this.arrOptionList.forEach(item => {
        item.required =
          item.required == "0" ? false : item.required == "1" ? true : "";
      });
      console.log(this.optionsList);
    },
    handleClose(done) {
      done();
    },
    productCount() {
      this.numberList = [];
      for (let i = 1; i <= 20; i++) {
        let obj = {
          label: i,
          value: i
        };
        this.numberList.push(obj);
      }
    }
  },
  mounted() {
    this.getHList();
    this.getList();
    this.productCount();
  }
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
</style>