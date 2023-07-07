<template>
<!-- 排查完成 -->
  <basic-container>
    <div class="avue-crud">
      <el-form
        :inline="true"
        :model="filters"
        ref="filters"
        @keyup.enter.native="getFirstAllList()">
        <div style="display: flex">
          <div>
            <el-form-item label="产品标题：" prop="spuTitle">
              <el-input
                v-model.trim="filters.spuTitle"
                placeholder="产品标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品编号：" prop="spuCode">
              <el-input
                v-model.trim="filters.spuCode"
                placeholder="产品编号"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('button.showStatus') + '：'" prop="showStatus">
              <el-select v-model="filters.showStatus">
                <el-option :label="$t('status.all')" :value="null"></el-option>
                <el-option :label="$t('status.show')" :value="1"></el-option>
                <el-option :label="$t('status.noShow')" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('label.suitRegion') + '：'" prop="area" v-if="productType == 1">
              <el-cascader
                ref="cascader"
                :options="areaOptions"
                :props="{ multiple: true }"
                v-model="filters.area"
                clearable
                collapse-tags
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item
              :label="$t('message.returnMouth') + '：'"
              prop="putUnder"
              v-if="productType == 1">
              <el-select
                :placeholder="$t('input.choose')"
                v-model="filters.putUnder">
                <el-option
                  v-for="(values, index) in putUnderData.optionList"
                  :key="index"
                  :label="values.name"
                  :value="values.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布时间：" prop="publishTime">
              <el-date-picker
                v-model="filters.publishTime"
                :unlink-panels="true"
                format="yyyy-MM-dd HH:mm"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="在线交易：" prop="isOnline">
              <el-select v-model="filters.isOnline">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-button icon="el-icon-search" type="primary" size="mini" @click="getFirstAllList()">{{ $t("button.search") }}</el-button>
          <el-button icon="el-icon-refresh-left" size="mini" @click="resetForm('filters')">{{ $t("button.reset") }}</el-button>
          <el-button icon="el-icon-plus" size="mini" type="success" @click="addArticle()">{{ $t("button.addProject") }}</el-button>
        </div>
      </el-form>
      <div>
        <!-- 设置显示状态 -->
        <el-dialog
          :title="$t('message.batchShowStatus')"
          :visible.sync="dialogbatchShowStatus"
          width="40%"
          :close-on-click-modal="false">
          <el-form :model="batchForm" ref="batchForm" :rules="rules">
            <p style="margin-bottom: 20px">已选择<span style="color: #ff0000">{{ this.batchList.length }}</span>篇文章</p>
            <el-form-item label="设置显示状态：" prop="status">
              <el-radio-group v-model="batchForm.showStatus">
                <el-radio :label="0" v-if="productType !=1">置顶</el-radio>
                <el-radio label="1">显示</el-radio>
                <el-radio label="2">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" style="margin-top: -40px">
            <el-button type="primary" @click="batchStatus('batchForm')">确 定</el-button>
            <el-button @click="dialogbatchShowStatus = false">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 批量操作-复制 20200812需求要求不做了 -->
        <!-- 批量上移下移2020年10.13动态列表导致多选框没法回显需求修改不做了 -->
        <div class="batch">
          <div class="batch-handle">
          <span class="handle-txt" v-if="this.batchList.length != 0">已选择<b>{{batchList.length}}</b>项</span><span class="handle-txt">批量操作：</span>
            <el-button icon="el-icon-view" type="primary" :disabled="batchList.length == 0" @click="dialogbatchShowStatus = true" >{{ $t("button.showStatus") }}</el-button>
            <el-button icon="el-icon-delete" :disabled="batchList.length == 0" type="danger" @click="deleteBatch">{{ $t("button.delete") }}</el-button>
          </div>
          <!-- <el-popover placement="left" :title="$t('title.setListTitle')" width="260" ref="setList" trigger="click">
            <el-checkbox-group v-model="choosedHead" :max="6">
              <el-checkbox
                class="check-item"
                v-for="(item, index) in listHeads"
                :key="index"
                :label="item.categoryId">{{ item.categoryName }}</el-checkbox>
            </el-checkbox-group>
            <div style="text-align: center; margin: 10px auto">
              <el-button type="primary" :disabled="choosedHead.length == 0" @click="$refs.setList.doClose(), getList()">{{ $t("button.confirm") }}</el-button>
              <el-button @click="$refs.setList.doClose()">{{$t("button.cancel")}}</el-button>
              <el-button type="text" @click="resetListHead()">{{$t("button.resetDefault")}}</el-button>
            </div>
            <el-button slot="reference" type="text" icon="el-icon-s-operation" size="medium">{{ $t("button.setList") }}</el-button>
          </el-popover> -->
        </div>
        <!-- 列表数据 -->
        <avue-crud
          class="batch-choose"
          ref="crud"
          :page.sync="page"
          :data="tableData"
          stripe
          :row-key="getRowKeys"
          :option="tableOption"
          @selection-change="selectionChange"
          :row-class-name="tableRowClassName"
          :cell-class-name="tableCellClassName"
          :header-cell-class-name="tableHeadClassName"
          @on-load="getList">
          <template slot="area" slot-scope="scope">
            <span v-if="scope.row.generateAttributeList">{{ scope.row.generateAttributeList[0]}}</span>
          </template>
          <template slot="attribute" slot-scope="scope">
            <span v-if="scope.row.generateAttributeList">{{ scope.row.generateAttributeList[1]}}</span>
          </template>
          <template slot="isOnline" slot-scope="scope">
            <span>{{ scope.row.isOnline ? '是' : '否' }}</span>
          </template>
          <template slot="status" slot-scope="scope">
            <el-select v-model="scope.row.status" @change="changeStatus(scope.row, scope.index)" :disabled="scope.row.deleted == 1">
              <el-option :label="$t('status.show')" value="1"></el-option>
              <el-option :label="$t('status.noShow')" value="2"></el-option>
            </el-select>
          </template>
          <template v-for="item in classSet" :slot="item.prop" slot-scope="scope">
            <span :key="item.prop">{{ scope.row.options | classifyFilter(item) }}</span>
          </template>
          <template slot="menu" slot-scope="scope">
            <el-button v-if="scope.row.deleted == 1" type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row, scope.index)">{{ $t("button.check") }}</el-button>
            <div v-else>
              <!-- <el-button type="text" size="small" icon="el-icon-edit" @click="fastEdit(scope.row, scope.index)">{{ $t("button.amend") }}</el-button> -->
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row, scope.index)">{{ $t("button.edit") }}</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row, scope.index)">{{ $t("button.delete") }}</el-button>
            </div>
          </template>
        </avue-crud>
        <!-- 快速修改弹框 -->
        <!-- <el-dialog :title="$t('button.amend')" width="1200px" :visible.sync="dialogEdit" v-model="dialogEdit" @closed="dialogClose" :close-on-click-modal="false">
          <set-project ref="child" @close="close"></set-project>
        </el-dialog> -->
      </div>
    </div>
  </basic-container>
</template>

<script>
import { saveDetal } from "@/util/clearDetail";
import { mapGetters } from "vuex";
import setProject from "@/components/project/set-project";
import { tableOption } from "@/const/crud/project/list";
import * as CodeMsg from "@/api/common/CodeChange";
import { batchSort } from "@/api/project/project";
import upImg from "@/components/policy/upImg";
import { getAllFlow } from "@/api/processmanage/work-flow";
import { editProjectFast } from "@/api/policy/detail";
import {
  productList,
  batchShowStatus,
  batchDelete,
  batchTransfer,
  listChangeStatus,
} from "@/api/project/project";
import {
  getDropPolicy,
  dropEditData,
  getListPolicy,
  dropBelong,
} from "@/api/policy/list";
export default {
  components: {
    upImg,
    setProject,
  },
  props:{
    productType:{
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      clickStatus:false,
      recordNumber: [],
      flowList: [],
      type: 4,
      editObj: {},
      classSet: [],
      classSetLength: "",
      // listHeads: [],
      choosedHead: [],
      imgBaseUrl: process.env.NODE_ENV === "production"? "//static.wotao.com/": "//static-tst.wotao.com/",
      filters: {},
      fixId: "",
      getRowKeys(row) {
        return row.id;
      },
      selectDrop: [],
      areaOptions: [],
      senior: false,
      tableData: [],
      tableOption: tableOption,
      belongData: [],
      secondClass: [],
      secondAreaOptions: [],
      secondSelectData: [],
      selectArea: [],
      page: {
        total: 0, // 总页数
        layout: "total,prev,pager,next, jumper",
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      batchList: [],
      batchVal: [],
      batchForm: {},
      imgBaseUrl: "",
      dialogbatchShowStatus: false,
      transferDialog: false,
      copyDialog: false,
      param: {},
      selectID: [],
      dialogEdit: false,
      sortList: [],
      columnLength: 3,
      optionsList: [],
      putUnderData: [],
      transfer: "",
      changeSort: "",
      // dialogEdit: false,
      // fastAreaOptions: [],
      // fastOptionList: [],
      // saveparam: new FormData(),
      rules: {
        showStatus: [
          { required: true, message: "请选择显示状态", trigger: "change" },
        ],
        title: [
          {
            required: true,
            message: this.$t("input.pleaseInputAticleTitle"),
            trigger: "blur",
          },
        ],
        metaTitle: [
          {
            required: true,
            message: this.$t("input.pleaseInputWebTitle"),
            trigger: "blur",
          },
        ],
        metaKeyword: [
          {
            required: true,
            message: this.$t("input.pleaseInputMetaKeywords"),
            trigger: "blur",
          },
          {
            min: 1,
            max: 100,
            message: this.$t("input.txtLong100"),
            trigger: "blur",
          },
        ],
        guidancePrice: [
          {
            message: this.$t("message.guidePriceRules"),
            pattern: /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{0,2})?$/,
            trigger: "blur",
          },
          {
            message: this.$t("message.guidePriceRules"),
            pattern:
              /^([1-9]\d*(\.\d*[1-9][0-9])?)|(0\.\d*[1-9][0-9])|(0\.\d*[1-9])$/,
            trigger: "blur",
          },
        ],
        metaDescription: [
          { required: true, message: "请输入meta描述", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: this.$t("input.txtLong200"),
            trigger: "blur",
          },
        ],
        sort: [
          { required: true, message: "请输入序号", trigger: "blur" },
          {
            min: 1,
            max: 6,
            message: "请输入正整数",
            pattern: /^[+]{0,1}(\d+)$/,
            trigger: "blur",
          },
        ],
        slogan: [{ required: true, message: "请输入广告语", trigger: "blur" }],
        region: [
          {
            required: true,
            message: this.$t("input.pleaseChooseRegion"),
            trigger: "change",
          },
        ],
        selectDrop: [
          {
            required: true,
            message: this.$t("input.choose"),
            trigger: "change",
          },
        ],
        workId: [
          { required: true, message: this.$t("input.choose"), trigger: "blur" },
        ],
      },
      editObj: {
        selectDrop: [],
        workId: "",
      },
      fastBelongData: [],
      productImg: "",
      productImgFile: null,
      areaOptionId: "",
      payList: [
        {
          payName: this.$t("message.agencyFee"),
          price: "",
          status: false,
        },
        {
          payName: this.$t("message.threePartyFee"),
          price: "",
          status: false,
        },
        {
          payName: this.$t("message.officialFee"),
          price: "",
          status: false,
          type: "0",
        },
      ],
    };
  },
  filters: {
    viewFilter(val) {
      if (val / 10000 >= 1) {
        return (val / 10000).toFixed(2) + "万";
      } else {
        return val;
      }
    },
    classifyFilter(list, obj) {
      let result = "";
      list.forEach((item) => {
        if (item.categoryId == obj.prop) {
          result = item.optionNames.toString();
        }
      });
      return result;
    },
  },
  //input自动聚焦
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      },
    },
  },
  methods: {
    // close() {
    //   this.dialogEdit = false;
    //   this.getAllList();
    // },
    selectMultiData() {
      console.log(this.selectDrop, "ss");
    },
    oninput(value) {
      value = value.replace(/^0*(0\.|[1-9])/, "$1");
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      value =
        value.indexOf(".") > 0
          ? value.split(".")[0].substring(0, 10) + "." + value.split(".")[1]
          : value.substring(0, 10);
      return value;
    },
    checkSelect(index) {
      this.payList.forEach((item) => {
        if (item.status == false) {
          item.price = "";
        }
      });
    },
    // 快速修改确认
    editDo(formName) {
      this.$refs.editObj.validate((valid) => {
        if (valid) {
          this.saveParam();
          let config = {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          };
          editProjectFast(this.saveparam, config).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: this.$t("alert.sucessEdit"),
                offset: 300,
              });
              this.getList();
              this.$refs["editObj"].resetFields();
              this.dialogEdit = false;
              this.editObj.selectDrop = [];
            } else {
              this.$message({
                type: "warning",
                message: this.$t("alert.failedEdit"),
                offset: 300,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
        }
      });
    },
    dialogClose() {
      this.editObj.region = [];
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getFirstAllList(){
      this.clickStatus = true
      this.getAllList()
    },
    changeStatus(value) {
      let para = {
        spuIds: [JSON.stringify(value.id)],
        status: value.status,
        number: value.number,
      };
      this.$confirm(this.$t("alert.editStatus"), this.$t("title.notice"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
        listChangeStatus(para).then((res) => {
            if (res.data.code == 1000) {
              this.getList();
              this.$message({
                type: "success",
                message: this.$t("alert.sucessEdit"),
                offset: 300,
              });
            }
          })
        }).catch(() => {
          this.getList()
        });
    },
    selectData(val) {},
    move(val) {
      this.transfer = val;
    },
    // 修改列表序号
    moveHandle(val) {
      batchSort(val).then((res) => {
          if (res.data.code == CodeMsg.CODE_1000) {
            this.$message({
              type: "success",
              message: this.$t("handle.success"),
              offset: 300,
              duration: 2000,
            });
            this.getAllList();
          } else {
            this.$message({
              type: "warning",
              message: this.$t("handle.defeat"),
              offset: 300,
              duration: 2000,
            });
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    selectionChange(val) {
      this.recordNumber = [];
      this.batchList = [];
      this.selectID = [];
      this.batchVal = val;
      for (let i = 0; i < this.batchVal.length; i++) {
        this.batchList.push(this.batchVal[i].id);
        this.recordNumber.push(this.batchVal[i].number);
      }
      if (val.length > 0) {
        val.forEach((value, index) => {
          this.selectID.push(value.id);
        });
      }
    },
    tableRowClassName({ row, rowIndex }) {
      let color = "";
      for (let item of this.selectID.values()) {
        if (item === row.id) color = "table-SelectedRow-bgcolor";
      }
      if (row === 2) {
        return "width-row";
      }
      return color;
    },
    tableHeadClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        return "width-row";
      }
      return "";
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        return "width-row";
      }
      return "";
    },
    toggleSelection(val) {
      this.$refs.crud.toggleSelection(val);
    },
    deleteBatch() {
      this.$confirm(`已选择${this.batchList.length}篇文章，确定删除吗?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
          let param = {
            spuIds: this.batchList,
            numbers: this.recordNumber,
          };
          batchDelete(param).then((res) => {
              if (res.data.code == CodeMsg.CODE_1000) {
                this.$message({
                  type: "success",
                  message: "删除成功！",
                });
                this.toggleSelection(this.batchVal);
                this.batchForm = {};
                this.getAllList();
              } else if (res.data.code !== CodeMsg.CODE_1001) {
                this.$message({
                  type: "warning",
                  message: "操作失败联系工作人员!",
                  offset: 300,
                });
              }
            }).catch((err) => {
              console.log(err);
            });
        }).catch(() => {});
    },
    batchStatus(formName) {
      let param = {
        status: this.batchForm.showStatus,
        spuIds: this.batchList,
        numbers: this.recordNumber,
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          batchShowStatus(param).then((res) => {
              if (res.data.code == CodeMsg.CODE_1000) {
                this.$message({
                  type: "success",
                  message: "设置成功！",
                });
                this.toggleSelection(this.batchVal);
                this.batchForm = {};
                this.dialogbatchShowStatus = false;
                this.getAllList();
              } else if (res.data.code !== CodeMsg.CODE_1001) {
                this.$message({
                  type: "warning",
                  message: "操作失败联系工作人员!",
                  offset: 300,
                });
              }
            }).catch((err) => {
              console.log(err);
            });
        } else {
        }
      });
    },
    batchTransferHandle(formName) {
      this.secondSelectData.forEach((item) => {
        item.optionsName = item.options;
        item.optionsId = Number(item.id);
        delete item.id;
        delete item.options;
      });
      if (this.batchForm.oldClassify == "0") {
        this.param = {
          type: this.batchForm.oldClassify,
          policyClassList: this.secondSelectData,
          numbers: this.batchList,
          areaNo: this.batchForm.area[1],
          parentNo: this.batchForm.area[0],
        };
      } else {
        this.param = {
          type: this.batchForm.oldClassify,
          policyClassList: this.secondSelectData,
          numbers: this.batchList,
        };
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          batchTransfer(this.param).then((res) => {
              if (res.data.code == CodeMsg.CODE_1000) {
                this.$message({
                  type: "success",
                  message: "设置成功！",
                });
                this.transferDialog = false;
                this.secondSelectData = [];
                this.toggleSelection(this.batchVal);
                this.batchForm = {};
                this.getAllList();
              } else if (res.data.code !== CodeMsg.CODE_1001) {
                this.$message({
                  type: "warning",
                  message: "操作失败联系工作人员!",
                  offset: 300,
                });
              }
            }).catch((err) => {
              console.log(err);
            });
        } else {
        }
      });
    },
    //  resetListHead() {
    //   this.choosedHead = [];
    //   if (this.listHeads.length >= 6) {
    //     this.classSetLength = 6;
    //   } else {
    //     this.classSetLength = this.listHeads.length;
    //   }
    //   for (let i = 0; i < this.classSetLength; i++) {
    //     this.choosedHead.push(this.listHeads[i].categoryId);
    //   }
    // },
    // 获取列表
    getList() {
      let list = [];
      let optionList = this.filters.putUnder == null ? [] : [[this.filters.putUnder]];
      // this.selectDrop.forEach((item) => {
      //   if (item instanceof Array) {
      //     optionList.push(item);
      //   } else {
      //     optionList.push([item]);
      //   }
      // });
      if(this.filters.putUnder){//归口
        list.push({attributeId:'2',attributeValueList:[JSON.stringify(this.filters.putUnder)]})
      };
      try {
        if(this.selectArea.length > 0){//地区
          list.push({attributeId:'1',attributeValueList:this.selectArea})
        }
      } catch (error) {
        
      }
      let params = {
        sort:'latest',
        categoryId: this.productType,
        isOnline: this.filters.isOnline,
        spuTitle: this.clickStatus == true?(this.filters.spuTitle):"", 
        spuCode:this.filters.spuCode,
        status: this.clickStatus == true?(this.filters.showStatus):null, 
        areaNos:  this.clickStatus == true?(this.selectArea):[],
        generateAttributeList: list,
        pageSize: this.page.pageSize, 
        pageNo: this.page.currentPage, 
        // selection: this.clickStatus == true?(optionList):[],
        // categoryIds: this.clickStatus == true?(this.choosedHead):[],
        
      };
      try {
        param.startTime = this.$moment(this.filters.publishTime[0]).format("YYYY-MM-DD HH:mm:ss");
        param.endTime = this.$moment(this.filters.publishTime[1]).format("YYYY-MM-DD HH:mm:ss");
      } catch (error) {
        
      };
      // 需要缓存的参数
      let keepParams = {
        clickStatus:this.clickStatus,
        params: params,
        publishTime: this.filters.publishTime,
        area: this.filters.area,
        putUnder: this.filters.putUnder,
        senior: this.senior,
        detail: {
          path: "",
          query: {},
        },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      productList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.page.total = res.data.data.total;
          let a = res.data.data.records;
          let otherOptions = [
            { label: '产品编号', prop: "spuCode", overHidden: true,},
            { label: '标题', prop: "spuTitle", overHidden: true, slot: true},
            { label: '适用地区', prop: "area", width: 220, overHidden: true, slot: true},
            { label: '归口', prop: "attribute", width: 160, slot: true }, 
            { label: '显示状态', prop:"status", width: 160, slot: true}, 
            { label: '在线交易', prop:"isOnline", width: 160,slot: true}, 
            { label: "创建时间", prop: "publishTime" },
          ];
          if(this.productType !=1 ){
            otherOptions.splice(2,2)
          }
          this.tableOption.column = otherOptions;
          this.tableData = a;
        }
      })
    },
    resetForm(formName) {
      this.clickStatus = false
      this.$refs[formName].resetFields();
      this.filters.spuTitle = "";
      this.filters.spuCode = "";
      this.filters.showStatus = null;
      this.filters.area = [];
      this.filters.putUnder = null;
      this.selectDrop = [];
      this.optionsIds = [];
      this.selectArea = [];
      this.filters.publishTime = [];
      this.getAllList();
    },
    addArticle() {
      let path = "/project-addnotice";
      let query = {
        type: this.productType,
        beFrom: 0,
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    handleEdit(row, index) {
      let path = "/project-editnotice";
      let query = {
        number: row.id,
        type: this.productType,
        beFrom: 0,
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    handleDelete(row, index) {
      this.$confirm('是否确认删除"' + row.title + '"的项目?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(()=>{
          return batchDelete({spuIds:[row.id]})
        }).then(() => {
          this.getAllList();
          this.$message({
            type: "success",
            message: "删除成功！",
            offset: 300,
          });
        });
    },
    getSecondData(val) {
      dropBelong(val).then((res) => {
          if (val == 0) {
            dropEditData(0).then((res) => {
                this.secondAreaOptions = res.data.data.area;
              }).catch((err) => {
                console.log(err);
              });
          }
          this.secondClass = res.data.data.classInfo;
        })
    },
    getDropdown() {
      getAllFlow().then((res) => {
        this.flowList = res.data.data;
      });
      getListPolicy(this.type).then((res) => {
          this.belongData = res.data.data.selection;
          this.areaOptions = res.data.data.area;
          this.belongData.forEach((item) => {
            if (item.categoryId == 2) {
              this.putUnderData = item;
            }
          });
        })
      getDropPolicy(this.type).then((res) => {
          this.fastBelongData = res.data.data.factors;
          if (res.data.data.area) {
            this.fastAreaOptions = res.data.data.area;
          }
        })
    },
    selectData(val) {
      this.$forceUpdate();
    },
    handleChange(value) {
      if (this.$refs.cascader) {
        this.$refs.cascader.dropDownVisible = false;
      }
      this.selectArea = [];
      value.forEach((item) => {
        this.selectArea.push(item[1]);
      });
    },
    // getFlexData(){
    //   listHead().then((res) => {
    //     this.listHeads = res.data.data;
    //     this.resetListHead();
    //   })
    // }
  },
  computed: {
    ...mapGetters(["tagList"]),
  },
  created() {
    // if (sessionStorage.getItem(`${this.$route.path}`)) {
    //   let keepParams = JSON.parse(
    //     sessionStorage.getItem(`${this.$route.path}`)
    //   );
    //   if (keepParams.detail.path !== "") {
    //     this.$router.push({
    //       path: keepParams.detail.path,
    //       query: keepParams.detail.query,
    //     });
    //     return;
    //   }
    //   this.filters.keywords = keepParams.params.title;
    //   this.filters.showStatus = keepParams.params.showStatus;
    //   this.filters.putUnder = keepParams.putUnder;
    //   this.page.currentPage = keepParams.params.start;
    //   this.page.pageSize = keepParams.params.size;
    //   this.selectArea = keepParams.params.areaNos;
    //   this.filters.publishTime = keepParams.publishTime;
    //   this.filters.area = keepParams.area;
    //   this.senior = keepParams.senior;
    //   this.clickStatus = keepParams.clickStatus
    // }
  },
  mounted() {
    this.getDropdown();
    // this.getFlexData();
  },
};
</script>

<style scoped>
.form-title {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  margin-top: 50px;
  color: #666;
  font-size: 16px;
}
.table-SelectedRow-bgcolor td {
  background-color: #dee0e2 !important;
}
.batch {
  margin: 0 20px 0 0;
  display: flex;
  align-items: center;
}
.batch div:first-child {
  flex: 1;
}
.edit_table {
  width: 50px;
  height: 25px;
  padding: 5px;
}
.keyword_sty {
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding: 8px 15px;
}
.edit_box {
  width: 40px;
  margin-right: 4px;
  border: 1px solid #eee;
  padding: 7px 6px;
}
.btn {
  margin-left: 20px;
  margin-right: -30px;
}
.locationUrl {
  color: #36a6fe;
  cursor: pointer;
}
.editBtn {
  color: #36a6fe;
}
.head {
  width: 40px;
  margin: 0 auto;
  margin-top: -40px;
  margin-bottom: 30px;
}
.senior-select {
  width: 220px !important;
}
.width-single {
  width: 70% !important;
}
.must:before {
  content: "*";
  color: #f56c6c;
  margin-left: -91px;
}
.check-select {
  display: flex;
  align-items: center;
}
.pay-sty-select {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
}
.special-th {
  height: 148px;
}
.check-select-form {
  margin: 8px !important;
}
.check-btn-select {
  width: 100px;
}
.pay-type-sty {
  font-size: 14px;
  margin: 0 15px 0 20px;
}
.form-sty {
  margin-top: -60px;
}
</style>
<style>
.el_input {
  width: 200px !important;
}
</style>