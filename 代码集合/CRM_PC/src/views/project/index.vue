<template>
<!-- 排查完成 -->
  <basic-container>
    <div class="avue-crud" v-if="permissions.bt_page_product || permissions.bt_edit_product || permissions.bt_del_product">
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
                <el-option :label="$t('status.show')" value="1"></el-option>
                <el-option :label="$t('status.noShow')" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('label.area')" prop="area" v-if="productType == 1">
              <el-cascader 
                ref="cascader"
                :options="areaOptions"
                :props="{ value: 'no', label: 'name',checkStrictly: true  }"
                v-model="filters.area"
                clearable
                collapse-tags
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
             <el-form-item
              :label="$t('label.level')"
              prop="level"
              v-if="productType == 1">
              <el-select
                :placeholder="$t('input.choose')"
                v-model="filters.level">
                <el-option
                  v-for="(item, index) in levelData"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
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
            <el-form-item
              label="类型："
              prop="putUnder"
              v-if="productType == 2">
              <el-select
                :placeholder="$t('input.choose')"
                v-model="filters.propertyType"
                @change="propertyChange = true;"
                >
                <el-option
                  v-for="item in propertyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间：" prop="publishTime">
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
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-button icon="el-icon-search" type="primary" size="mini" @click="getFirstAllList()">{{ $t("button.search") }}</el-button>
          <el-button icon="el-icon-refresh-left" size="mini" @click="resetForm('filters')">{{ $t("button.reset") }}</el-button>
          <el-button icon="el-icon-plus" size="mini" type="success" @click="permissions.bt_add_product ? addArticle() : $notAuthorized()">{{ $t("button.addProject") }}</el-button>
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
            <el-button icon="el-icon-view" type="primary" :disabled="batchList.length == 0" @click="permissions.bt_edit_product ? dialogbatchShowStatus = true : $notAuthorized()" >{{ $t("button.showStatus") }}</el-button>
            <el-button icon="el-icon-delete" :disabled="batchList.length == 0" type="danger" @click="permissions.bt_del_product ? deleteBatch() : $notAuthorized()">{{ $t("button.delete") }}</el-button>
          </div>
        </div>
        <!-- 列表数据 -->
        <avue-crud
          class="batch-choose"
          ref="crud"
          @on-load="getList"
          :data="tableData"
          :option="tableOption"
          :page.sync="page"
          :row-key="getRowKeys"
          @selection-change="selectionChange"
          :row-class-name="tableRowClassName"
          :cell-class-name="tableCellClassName"
          :header-cell-class-name="tableHeadClassName"
          >
          <template slot="level" slot-scope="scope">
            <span v-if="scope.row.generateAttributeList">{{scope.row.generateAttributeList | attributeLevel}}</span>
          </template>
          <template slot="area" slot-scope="scope">
            <span v-if="scope.row.generateAttributeList">{{scope.row.generateAttributeList | areaTransfer(this_)}}</span>
          </template> 
          <template slot="attribute" slot-scope="scope">
            <span v-if="scope.row.generateAttributeList">{{ scope.row.generateAttributeList | attribute}}</span>
          </template>
          <template slot="isOnline" slot-scope="scope">
            <span>{{ scope.row.isOnline ? '是' : '否' }}</span>
          </template>
          <template slot="categoryId" slot-scope="scope" >
            <span v-if="scope.row.categoryId >= 2 && scope.row.categoryId <= 6">{{ scope.row.categoryId | categoryType() }}</span>
          </template>
          <template slot="status" slot-scope="scope">
            <el-select v-model="scope.row.status" @change="changeStatus(scope.row, scope.index)" :disabled="scope.row.deleted == 1 || !permissions.bt_edit_product">
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
              <el-button type="text" size="small" icon="el-icon-edit" @click="permissions.bt_edit_product ? fastEdit(scope.row, scope.index) : $notAuthorized()">{{ $t("button.amend") }}</el-button>
              <el-button type="text" size="small" icon="el-icon-share" v-if="scope.row.status == 1" @click="permissions.bt_page_product ? handleShare(scope.row, scope.index) : $notAuthorized()">推广</el-button>
              <el-button type="text" size="small" icon="el-icon-edit" @click="permissions.bt_edit_product ? handleEdit(scope.row, scope.index) : $notAuthorized()">{{ $t("button.edit") }}</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="permissions.bt_del_product ? handleDelete(scope.row, scope.index) : $notAuthorized()">{{ $t("button.delete") }}</el-button>
            </div>
          </template>
        </avue-crud>
        <!-- 快速修改弹框 -->
        <el-dialog :title="$t('button.amend')" width="1200px" :visible.sync="dialogEdit" v-model="dialogEdit" @closed="dialogClose" :close-on-click-modal="false">
          <set-project v-if="dialogEdit" ref="child" @close="close" :spuId="editInfo.id" :productType="productType" :isFastEdit="true"></set-project>
        </el-dialog>
      </div>
    </div>
    <el-dialog width="40%" title="推广" @close="shareCancelFn" :visible.sync="shareDialog">
      <el-radio-group v-model="shareRadio">
        <el-radio :label="0">链接推广（客户使用PC端）</el-radio>
        <el-radio :label="1">二维码推广（客户使用小程序）</el-radio>
      </el-radio-group>
      <el-input
        class="shareInput"
        v-if="shareRadio == 0"
        v-model="pcCodeUrl"
        placeholder="请输入内容"
      >
        <template slot="append">
          <el-button type="primary" @click="copyToClip(pcCodeUrl)">
            {{!isCopied ? "复制推广地址" : "推广地址已复制"}}
          </el-button>
        </template>
      </el-input>
      <div v-else class="erweima " ref="erweima">
        <div class="erweimainfo wx-member-sty" 
            :style="{
              backgroundImage: `url('${wtMemberBgUrl}')`,
              backgroundSize: '100% 100%',
            }">
        <img
          class="shareBanner"
          :src="imgBaseUrl + dialogForm.imageUrl"
          alt=""
        />
          <!-- <div class="banner"></div> -->
          <div class="bottom">
            <div class="jieshao" style="margin-top: 18px">
              <div class="title">
                {{ dialogForm.spuTitle }}
              </div>
              <div class="allPrice">
                <div class="price">
                  <!-- <div class="priceName">定金</div> -->
                  <!-- <div class="priceNum" v-if="dialogForm.isOnline">
                    ￥{{
                      dialogForm.spuMaxAmount > dialogForm.spuMinAmount
                        ? dialogForm.spuMinAmount + "/起"
                        : dialogForm.spuMinAmount
                    }}
                  </div> -->
                  <div class="priceNum">{{depositFee}}</div>
                </div>
              </div>
            </div>
            <div>
              <vue-qr
              :class="['wx-member-main-sty']"
              :text="wxCodeUrl"
              :size="150"
              :logoScale="0.2"
            ></vue-qr>
            <div style="text-align: center;">{{number}}</div>
            </div>
            
          </div>
        </div>
        <!-- <img class="wx-member-sty" :src="wtMemberBgUrl" alt="" /> -->
        <div>
          <el-button style="margin-top:15px" type="primary" @click="saveMemberCode">下载二维码</el-button>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shareCancelFn">取 消</el-button>
        <el-button type="primary" @click="shareOkFn">确 定</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import html2canvas from "html2canvas";
import VueQr from "vue-qr";
import { saveDetal } from "@/util/clearDetail";
import { mapGetters } from "vuex";
import setProject from "@/components/project/set-project";
import { getWxYaoCode } from "@/api/personal/myhome";
import * as CodeMsg from "@/api/common/CodeChange";
import { batchSort } from "@/api/project/project";
import upImg from "@/components/policy/upImg";
import { getAllFlow } from "@/api/processmanage/work-flow";
import { editProjectFast } from "@/api/policy/detail";
import * as productData from './project-data';
import { commonOption } from "@/const/crud/project/common-list";
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
  getNewArea
} from "@/api/policy/list";
export default {
  components: {
    upImg,
    setProject,
    VueQr,
  },
  props:{
    productType:{
      type: Number,
      default: 1
    },
  },
  data() {
    return {
      editInfo: {},
      isCopied: false,
      dialogForm: {},
      wtMemberBgUrl: require("@/assets/images/project/pic_WTmember.png"),
      wxCodeUrl: "",
      pcCodeUrl: '',
      shareDialog: false,
      shareRadio: 0,
      form: {},
      number: this.$store.state.user.userInfo.number,
      wtMemberTitle: "产品推广码",
      this_:this,
      propertyChange: false,
      propertyList: productData.ppropertyData,
      clickStatus:false,
      recordNumber: [],
      flowList: [],
      type: 4,
      editObj: {},
      classSet: [],
      classSetLength: "",
      choosedHead: [],
      imgBaseUrl: process.env.NODE_ENV === "production"? "//static.wotao.com/": "//static-tst.wotao.com/",
      pcUrl: process.env.VUE_APP_WEB_URL,
      filters: {
        spuTitle:'',
        spuCode:'',
        propertyType:'',
        isOnline:'',
        belong: null,
        area: [],
        keywords: "",
        publishMan: "",
        showStatus: null,
        putUnder: null,
        publishTime: [],
        level: null
      },
      fixId: "",
      getRowKeys(row) {
        return row.id;
      },
      selectDrop: [],
      areaOptions: [],
      senior: false,
      tableData: [],
      tableOption: {
        selection: true,
        reserveSelection: true,
        selectClearBtn: false,
        expandFixed: true,
        addBtn: false,
        header: false,
        editBtn: false,
        delBtn: false,
        align: 'center',
        menuAlign: 'center',
        menuWidth: 260,
        border: true,
        column:
        this.productType == 1? 
        commonOption.columnOne:this.productType == 2?
        commonOption.columnTwo:commonOption.columnThree
      },
      belongData: [],
      secondClass: [],
      secondAreaOptions: [],
      secondSelectData: [],
      selectArea: [],
      page: {
        total: 0, // 总页数
        layout: "sizes, total, prev, pager, next, jumper",
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes:[5,10,20,30,50,100]
      },
      batchList: [],
      batchVal: [],
      batchForm: {},
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
      fastAreaOptions: [],
      levelData: productData.levelData,
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
      depositFee: '',
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
    areaTransfer(list){
      let arg = '';
      list.forEach(item => {
        if(item.attributeId == 1){
          arg = item.attributeValueDesc;
        }
      })
      return arg
    },
    attribute(list){
      for (let index = 0; index < list.length; index++) {
        if(list[index].attributeId == 2){
          return list[index].attributeValueDesc;
        }
      }
    },
    attributeLevel(list){
      for (let index = 0; index < list.length; index++) {
        if(list[index].attributeId == 3){
          return list[index].attributeValueDesc;
        }
      }
    },
    categoryType(val){
      return productData.categoryType(val);
    }
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
    fastEdit(row){
      console.log(row);
      this.editInfo = row;
      this.dialogEdit = true;
    },
    close() {
      this.dialogEdit = false;
      this.getAllList();
    },
    selectMultiData() {

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
          editProjectFast(this.saveparam, config)
            .then((res) => {
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
              if (res.data.code == 0) {
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
              if (res.data.code == CodeMsg.CODE_0) {
                this.$message({
                  type: "success",
                  message: "删除成功！",
                });
                this.toggleSelection(this.batchVal);
                this.batchForm = {};
                this.getAllList();
              } else if (res.data.code == CodeMsg.CODE_1001) {
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
              if (res.data.code == CodeMsg.CODE_0) {
                this.$message({
                  type: "success",
                  message: "设置成功！",
                });
                this.toggleSelection(this.batchVal);
                this.batchForm = {};
                this.dialogbatchShowStatus = false;
                this.getAllList();
              } else if (res.data.code == CodeMsg.CODE_1001) {
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
              if (res.data.code == CodeMsg.CODE_0) {
                this.$message({
                  type: "success",
                  message: "设置成功！",
                });
                this.transferDialog = false;
                this.secondSelectData = [];
                this.toggleSelection(this.batchVal);
                this.batchForm = {};
                this.getAllList();
              } else if (res.data.code == CodeMsg.CODE_1001) {
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
    // 获取列表
    getList() {
      getDropPolicy(this.type).then((res) => {
        if (res.data.data.area) {
          this.fastAreaOptions = res.data.data.area;
        }
      })
      let list = [];
      let optionList = this.filters.putUnder == null ? [] : [[this.filters.putUnder]];
      if(this.filters.putUnder){//归口
        list.push({attributeId:'2',attributeValueList: [JSON.stringify(this.filters.putUnder)]})
      };
      let district = JSON.parse(JSON.stringify(this.filters.area))
      if(district.length>0){//地区
        list.push({
            attributeId:'1',
            attributeValueList: [district.toString()]
          })
      }
      if(this.filters.level){//级别
        list.push({attributeId:'3',attributeValueList: [this.filters.level]})
      }
      let params = {
        sort:'default',
        categoryId: this.productType,
        isOnline: this.filters.isOnline,
        spuTitle: this.clickStatus == true?(this.filters.spuTitle):"", 
        spuCode:this.filters.spuCode,
        createUser: this.clickStatus == true?(this.filters.publishMan):"",
        status: this.clickStatus == true?(this.filters.showStatus):null, 
        generateAttributeList: list,
        pageSize: this.page.pageSize, 
        pageNo: this.page.currentPage,
      };
      if(this.productType == 2 && this.propertyChange){
        params.categoryId = this.filters.propertyType;
      };
      if(this.filters.publishTime[0]){
        params.publishStartTime = this.$moment(this.filters.publishTime[0]).format("YYYY-MM-DD HH:mm:ss");
        params.publishEndTime = this.$moment(this.filters.publishTime[1]).format("YYYY-MM-DD HH:mm:ss");
      }
      // 需要缓存的参数
      let keepParams = {
        clickStatus:this.clickStatus,
        params: params,
        publishTime: this.filters.publishTime,
        area: this.filters.area,
        level: this.filters.level,
        putUnder: this.filters.putUnder,
        isOnline: this.filters.isOnline,
        spuTitle: this.filters.spuTitle,
        spuCode: this.filters.spuCode,
        showStatus: this.filters.showStatus,
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
      this.filters.propertyType = null;
      this.filters.level = null;
      this.selectDrop = [];
      this.optionsIds = [];
      this.selectArea = [];
      this.filters.publishTime = [];
      this.filters.isOnline = null;
      this.propertyChange = false;
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
    saveMemberCode() {
      this.saveQrStatus = false;
      setTimeout(() => {
        html2canvas(this.$refs.erweima, {
          useCORS: true,
          width: 384,
          height: 529,
          scale: 3,
          windowWidth: document.body.scrollWidth,
          windowHeight: document.body.scrollHeight,
          x: 169,
          y: -2,
        }).then((canvas) => {
          let imgUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imgUrl;
          link.setAttribute("download", this.wtMemberTitle + ".png");
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          this.saveQrStatus = true;
          this.$message({
            type: "success",
            message: "图片下载成功"
          })
        });
      }, 500);
    },
    copyToClip(content) {
      const ele = document.createElement("input");
      ele.setAttribute("value", content);
      document.body.appendChild(ele);
      ele.select();
      document.execCommand("copy");
      document.body.removeChild(ele);
      this.$message({
        type: "success",
        message: "推广地址复制成功",
      });
      this.isCopied = true
    },
    shareCancelFn() {
      this.shareDialog = false
      this.shareRadio = 0
      this.wxCodeUrl = ""
      this.pcCodeUrl = ""
      this.isCopied = false
    },
    shareOkFn() {
      this.shareDialog = false
      this.shareRadio = 0
      this.wxCodeUrl = ""
      this.pcCodeUrl = ""
      this.isCopied = false
    },
    //推广
    handleShare(row) {
      getWxYaoCode().then(res => {
        this.shareDialog = true
        this.dialogForm = JSON.parse(JSON.stringify(row))
        let allList = this.tableData.filter(item => item.id == this.dialogForm.id)
        console.log(allList);
        allList.forEach(item => {
          let amount = ''
          if(item.isOnline){
            amount = item.spuMaxAmount != item.spuMinAmount ? item.spuMinAmount + "起" : item.spuMinAmount
            amount.indexOf('起') != -1 ? amount = '￥'+amount.slice(0, amount.indexOf('.'))+'起' : amount = '￥' + amount.slice(0, amount.indexOf('.'))
          }else{
            amount = '面议'
          }
            this.depositFee = amount
        })
        let params = {
          spuId: this.dialogForm.id,
          spuType: this.dialogForm.categoryId,
          proSpread: res.data.data,
        }
        let data = JSON.stringify(params)
        this.wxCodeUrl = `https://www.wotao.com/product?data=${data}`
        this.pcCodeUrl = this.pcUrl+`productdetails/details?spuId=${this.dialogForm.id}&type=${this.dialogForm.categoryId}&link=${res.data.data}`
      })
    },
    handleEdit(row, index) {
      let path = "/project-editnotice";
      let query = {
        number: row.id,
        type: this.productType,
        beFrom: 0,
      };
      // saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    handleDelete(row, index) {
      this.$confirm('是否确认删除"' + row.spuTitle + '"的项目?', "警告", {
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
        this.belongData.forEach((item) => {
          if (item.categoryId == 2) {
            this.putUnderData = item;
          }
        });
      })
      getNewArea().then(res => {
        this.areaOptions = res.data.data
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
  },
  computed: {
    ...mapGetters(["tagList",'permissions']),
  },
  created() {
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      if (keepParams.detail.path !== "") {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query,
        });
        return;
      }
      this.filters.keywords = keepParams.params.title;
      this.filters.showStatus = keepParams.showStatus;
      this.filters.putUnder = keepParams.putUnder;
      this.filters.level = keepParams.level;
      this.filters.isOnline = keepParams.isOnline;
      this.filters.spuCode = keepParams.spuCode;
      this.filters.spuTitle = keepParams.spuTitle;
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.selectArea = keepParams.params.areaNos;
      this.filters.publishTime = keepParams.publishTime;
      this.filters.area = keepParams.area;
      this.senior = keepParams.senior;
      this.clickStatus = keepParams.clickStatus
    }
  },
  mounted() {
    console.log(this.permissions);
    if (!this.permissions.bt_page_product && !this.permissions.bt_edit_product && !this.permissions.bt_del_product) {
      this.$notAuthorized()
    }
    this.getDropdown();
  },
};
</script>

<style lang="scss" scoped>
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
.shareInput {
  width: 85%;
  margin-top: 30px;
}
.erweima{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.erweimainfo {
  display: flex;
  flex-direction: column;
  z-index: 1;
  .shareBanner {
    width: 329px; 
    height: 235px; 
    background: #ccc; 
    border-radius: 10px;
    margin-top: 70px;
    margin-left: 23px;
  }
  .bottom {
    display: flex;
    margin-left: 21px;
    .jieshao {
      width: 190px;
      .title {
        max-width: 180px;
        min-height: 54px;
        font-size: 16px;
        font-weight: 600;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      .allPrice {
        display: flex;
        // justify-content: space-between;
        margin-top: 10px;
        .price {
          display: flex;
          flex-direction: column;
          margin-right: 5px;
          width: 100%;
          .priceName {
            font-size: 12px;
            color: #979797;
            padding: 8px 0;
          }
          .priceNum {
            font-size: 15px;
            font-weight: 600;
            color: #fa8958;
          }
        }
      }
    }
  }
  .wx-member-main-sty {
    width: 150px;
    height: 150px;
    z-index: 2;
  }
}
.wx-member-sty {
  width: 380px;
  height: 532px;
}
</style>
<style>
.el_input {
  width: 200px !important;
}
</style>