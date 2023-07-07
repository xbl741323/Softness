<template>
  <div class="class-basic">
    <el-form ref="classForm" :model="classForm" :rules="rules">
      <!-- 基本信息区域 -->
      <div class="top-info">
        <h3 class="basic-title-basic">基本信息</h3>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>课程标题</span>
          </div>
          <el-form-item class="class-item-input" prop="classTitle">
            <el-input size="small" v-model.trim="classForm.classTitle" placeholder="不超过30个字" maxlength="30" :class="['item-input-value',pageFrom==0?'item-edit-value':'']"></el-input>
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>广告语</span>
          </div>
          <el-form-item class="class-item-input" prop="adviseDesc">
            <el-input size="small" v-model.trim="classForm.adviseDesc" placeholder="不超过30个字" maxlength="30" :class="['item-input-value',pageFrom==0?'item-edit-value':'']"></el-input>
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>专业分类</span>
          </div>
          <el-form-item class="class-item-input" prop="themeType">
            <el-select @change="changeThemType()" v-model="classForm.themeType" multiple :multiple-limit="3">
              <el-option v-for="(item,index) in optionList" :key="index" :label="item.categoryName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>封面图片</span>
          </div>
          <el-form-item class="class-item-input" prop="coverUrl">
            <div class="wt-img-upload">
              <imgUpload ref="upload" :imageDesc="imageDesc"></imgUpload>
            </div>
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>显示状态</span>
          </div>
          <el-form-item class="class-item-input" prop="showStatus">
            <el-radio-group v-model="classForm.showStatus">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">不显示</el-radio>
              <el-radio v-if="classForm.showStatus == 3" :label="3">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span></span>
            <span>关联产品</span>
          </div>
          <el-form-item class="class-item-input" prop="relateProduct">
            <div class="relate-product-sty">
              <div class="relate-list" v-if="classForm.relateProduct.length>0">
                <span
                  v-for="(item, index) in classForm.relateProduct"
                  class="relate-list-item"
                  :key="index">
                  <span>{{ item.productName }}</span>
                  <i class="el-icon-delete realte-del-btn" @click="delRelatePro(index)"></i>
                </span>
              </div>
              <div class="relate-btn">
                <el-button type="primary" size="mini" @click="showProduct()">添加</el-button>
                <span>关联产品会出现在本课程详情页的推荐区域，最多可以添加6个关联产品。</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>所属板块</span>
          </div>
          <el-form-item class="class-item-input" prop="plates">
            <el-select @change="changePlateFn()" v-model="classForm.plates" multiple placeholder="请选择所属板块">
              <el-option v-for="(item,index) in platesList" :key="index" :label="item.plateName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>序号</span>
          </div>
          <el-form-item class="class-item-input" prop="sort">
            <el-input type="number" size="small" v-model="classForm.sort"></el-input>
          </el-form-item>
        </div>
      </div>

      <!-- SEO信息区域 -->
      <div class="top-info">
        <h3 class="basic-title-basic">SEO信息</h3>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>网页标题</span>
          </div>
          <el-form-item class="class-item-input" prop="metaTitle">
            <el-input size="small" v-model.trim="classForm.metaTitle" placeholder="不超过70个字" maxlength="70" :class="['item-input-value',pageFrom==0?'item-edit-value':'']"></el-input>
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>meta关键字</span>
          </div>
          <el-form-item class="class-item-input" prop="metaKeywords">
            <el-input size="small" v-model.trim="classForm.metaKeywords" placeholder="不超过100个字" maxlength="100" :class="['item-input-value',pageFrom==0?'item-edit-value':'']"></el-input>
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>meta描述</span>
          </div>
          <el-form-item class="class-item-input" prop="metaDesc">
            <el-input size="small" v-model.trim="classForm.metaDesc" placeholder="不超过200个字" maxlength="200" :class="['item-input-value',pageFrom==0?'item-edit-value':'']"></el-input>
          </el-form-item>
        </div>
      </div>

      <!-- 交易信息区域 -->
      <div class="top-info">
        <h3 class="basic-title-basic">交易信息</h3>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>收费类型</span>
          </div>
          <el-form-item class="class-item-input">
            <el-radio-group v-model="classForm.feeType" @change="changeFeeType()">
              <el-radio :label="1">完全免费</el-radio>
              <el-radio :label="2">VIP免费</el-radio>
              <el-radio :label="3">单独收费</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="class-item" v-if="classForm.feeType !== 1">
          <div class="class-item-label">
            <span>*</span>
            <span>课程单价</span>
          </div>
          <div class="class-fee-contain">
            <div class="input-fee-contain">
              <div class="class-price-label">
                <span>*</span>
                <span>原&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价</span>
              </div>
              <el-form-item class="class-item-input-fee" prop="classPreFee">
                <el-input size="small" type="number" @change="classForm.classPreFee = oninput(classForm.classPreFee)" @keyup.native="classForm.classPreFee = oninput(classForm.classPreFee)" v-model.trim="classForm.classPreFee" placeholder="请输入金额，如300.00"></el-input>
              </el-form-item>
            </div>
            <div class="input-fee-contain">
              <div class="class-price-label">
                <span>*</span>
                <span>现&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价</span>
              </div>
              <el-form-item class="class-item-input-fee" prop="classNowFee">
                <el-input size="small" type="number" @change="classForm.classNowFee = oninput(classForm.classNowFee)" @keyup.native="classForm.classNowFee = oninput(classForm.classNowFee)" v-model.trim="classForm.classNowFee" placeholder="请输入金额，如300.00"></el-input>
              </el-form-item>
              <p>该价格为非VIP用户的下单价格，或单独收费时所有用户不打折时的下单价格</p>
            </div>
            <div class="input-fee-contain" v-if="classForm.feeType == 3">
              <div class="class-price-label">
                <span></span>
                <span>VIP折扣价</span>
              </div>
              <el-form-item class="class-item-input-fee">
                <el-input size="small" type="number" @change="classForm.classVipFee = oninput(classForm.classVipFee)" @keyup.native="classForm.classVipFee = oninput(classForm.classVipFee)" v-model.trim="classForm.classVipFee" placeholder="请输入金额，如300.00"></el-input>
              </el-form-item>
              <p>该价格为单独收费时VIP用户的下单价格，不输入等于不打折</p>
            </div>
          </div>
        </div>
        <div class="class-item" v-if="classForm.feeType !== 1">
          <div class="class-item-label">
            <span>*</span>
            <span>含第三方费用</span>
          </div>
          <div class="class-item-input">
            <el-form-item>
            <el-radio-group @change="changeThirdFeeStatus()" v-model="classForm.classThirdFeeStatus" class="third-fee">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="classForm.classThirdFeeStatus == 1" prop="classThirdFee">
            <el-input class="fee-status-sty" type="number" size="small" @change="classForm.classThirdFee = oninput(classForm.classThirdFee)" @keyup.native="classForm.classThirdFee = oninput(classForm.classThirdFee)" v-model="classForm.classThirdFee" placeholder="请输入金额，如300.00"></el-input>
          </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <!-- 快速修改/编辑按钮区域 -->
    <div class="fix-edit-btn" v-if="(pageFrom == 0 || pageFrom == 1)&&classForm.showStatus !== 3">
      <el-button type="primary" size="medium" class="save-btn" v-preventReClick @click="permissions.sys_wt_course_edit ? saveData() : $notAuthorized()">保存</el-button>
      <el-button size="medium" @click="cancelToList()">取消</el-button>
    </div>
    <!-- 添加关联产品 -->
    <add-product @receive-product="receiveProduct" @refresh="refresh()" :pageFrom="pageFrom" ref="child"></add-product>
  </div>
</template>

<script>
import {
  getOptionList,
  editClass,
  getClassDetail,
  listAllPlates,
} from "@/api/project/wtClass";
import * as CodeMsg from "@/api/common/CodeChange";
import addProduct from "@/components/project/wt-classroom/add-product";
import imgUpload from "@/components/upload/class-upload";
import { clearDetail } from "@/util/clearDetail";
export default {
  props: {
    pageFrom: {
      type: Number,
      default: 0, // 0-编辑页 1-列表页（快速修改） 2-添加页
    },
    permissions:{
      type: Object
    }
  },
  components: {
    imgUpload,
    addProduct,
  },
  data() {
    var validatePreFee = (rule, value, callback) => {
      if (value == 0) {
        return callback(new Error("请填写价格，价格不能为0！"));
      } else if (Number(value) < Number(this.classForm.classNowFee)) {
        return callback(new Error("原价应大于等于现价！"));
      } else {
        callback();
      }
    };
    var validateNowFee = (rule, value, callback) => {
      if (value == 0) {
        return callback(new Error("请填写价格，价格不能为0！"));
      } else if (Number(value) > Number(this.classForm.classPreFee)) {
        return callback(new Error("原价应大于等于现价！"));
      } else if (Number(value) < Number(this.classForm.classVipFee)) {
        return callback(new Error("现价应大于等于VIP折扣价！"));
      } else {
        callback();
      }
    };
    var validateThirdFee = (rule, value, callback) => {
      if (value == 0) {
        return callback(new Error("请填写价格，价格不能为0！"));
      } else if (this.classForm.feeType == 3) {
        if (Number(value) > Number(this.classForm.classVipFee)) {
          return callback(new Error("VIP折扣价应大于等于第三方费用！"));
        } else {
          callback();
        }
      } else {
        if (Number(value) > Number(this.classForm.classNowFee)) {
          return callback(new Error("VIP折扣价应小于等于现价！"));
        } else {
          callback();
        }
      }
    };
    return {
      imageDesc:"仅可上传一张图片作为封面，格式为jpg，png等，大小控制在4M以内。",
      content: "",
      setContent: false,
      classId: "",
      optionList: [],
      imgList: [],
      listProduct: [],
      listSubject: [],
      themeTypeCopy: [],
      platesList: [],
      listPlate: [],
      listPlate1: [],
      classForm: {
        // 基本信息
        classTitle: "",
        adviseDesc: "",
        themeType: [],
        coverUrl: "",
        showStatus: 1,
        relateProduct: [],
        sort: 1,
        //所属板块
        plates: [],
        // SEO信息
        metaTitle: "",
        metaKeywords: "",
        metaDesc: "",
        // 交易信息
        feeType: 1,
        classPreFee: "", // 原价
        classNowFee: "", // 现价价
        classVipFee: "", // vip折扣
        classThirdFeeStatus: 0,
        classThirdFee: "",
      },
      rules: {
        classTitle: [{ required: true, message: "请填写", trigger: "blur" }],
        adviseDesc: [{ required: true, message: "请填写", trigger: "blur" }],
        themeType: [{ required: true, message: "请选择", trigger: "blur" }],
        videoUrl: [{ required: true, message: "请上传", trigger: "blur" }],
        plates: [{ required: true, message: "请选择所属板块", trigger: "blur" }],
        sort: [{ required: true, message: "请填写", trigger: "blur" }],
        metaTitle: [{ required: true, message: "请填写", trigger: "blur" }],
        metaKeywords: [{ required: true, message: "请填写", trigger: "blur" }],
        metaDesc: [{ required: true, message: "请填写", trigger: "blur" }],
        classPreFee: [{ validator: validatePreFee, trigger: "blur" }],
        classNowFee: [{ validator: validateNowFee, trigger: "blur" }],
        classThirdFee: [{ validator: validateThirdFee, trigger: "blur" }],
        metaDesc: [{ required: true, message: "请填写", trigger: "blur" }],
        coverUrl: [
          { required: true, message: "请上传视频封面", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    if (this.$route.query.classId) {
      this.classId = this.$route.query.classId;
    }
  },
  methods: {
    // 修改收费类型
    changeFeeType() {
      if (this.pageFrom == 2) {
        if (this.classForm.feeType != 3) {
          this.classForm.classVipFee = "";
        }
        if (this.classForm.feeType == 1) {
          this.classForm.classPreFee = "";
          this.classForm.classNowFee = "";
          this.classForm.classVipFee = "";
        }
      }
    },
    // 修改第三方服务费类型状态
    changeThirdFeeStatus() {
      if (this.classForm.classThirdFeeStatus == 0 && this.pageFrom == 2) {
        this.classForm.classThirdFee = "";
      }
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
    changeThemType() {
      this.themeTypeCopy = [];
      this.classForm.themeType.forEach((item) => {
        this.themeTypeCopy.push({
          subjectId: item,
        });
      });
    },
    // 筛选关联产品
    filterProData() {
      this.classForm.relateProduct.forEach((pItem) => {
        this.listProduct.forEach((item) => {
          if (pItem.productId == item.productId) {
            pItem.id = item.id;
          }
        });
      });
    },
    // 筛选专业分类(有问题)
    filterSubjectData() {
      this.themeTypeCopy.forEach((pItem) => {
        this.listSubject.forEach((item) => {
          if (pItem.subjectId == item.subjectId) {
            pItem.id = item.id;
          }
        });
      });
    },
    checkContent(val) {
      let classDesc = val;
      classDesc = classDesc.replace(/&nbsp;/g, "").replace(/\s*/g, "");
      return classDesc;
    },
    finalSave(val) {
      if (val !== "" && this.checkContent(val) !== "<p></p>") {
        this.content = val;
        this.setContent = true;
        this.saveData();
      } else {
        this.$message({
          type: "warning",
          message: "课程介绍不能为空！",
          offset: 300,
        });
      }
    },
    cancelToList() {
      if (this.pageFrom == 0) {
        clearDetail("/wt-classroom/course-management/index");
        this.$router.push("/wt-classroom/course-management/index");
      } else if (this.pageFrom == 1) {
        this.$emit("close-dialog");
      }
    },
    changePlateFn() {
      this.listPlate = []
      let itemList = []
      this.listPlate1.forEach(item => {
        itemList.push(item.id)
        if (this.classForm.plates.includes(item.id)) {
          this.listPlate.push({
            plateId: item.id,
            plateName: item.plateName,
            id: item.plateClassId
          });
        }
      })
      this.platesList.forEach(item2 => {
        if (this.classForm.plates.includes(item2.id) && !itemList.includes(item2.id)) {
          this.listPlate.push({
            plateId: item2.id,
            plateName: item2.plateName,
            id: item2.plateClassId
          });
        }
      })
    },
    // 编辑课堂信息+校验
    saveData() {
      this.filterProData();
      this.filterSubjectData();
      if(this.$refs.upload.imgList.length>0){
      let imgUrl = this.$refs.upload.imgList[0].response.data;
      this.$refs.classForm.validate((val) => {
        if (val) {
          let basicInfo = this.classForm;
          let params = {
            id: this.classId,
            // 基本信息
            baseTitle: basicInfo.classTitle, // 课程标题
            baseSlogan: basicInfo.adviseDesc, // 广告语
            listSubject: this.themeTypeCopy, // 专业类型
            listPlate: this.listPlate,//所属板块
            baseCoverUrl: imgUrl, // 封面图片
            baseShowState: basicInfo.showStatus, // 显示状态
            listProduct: this.classForm.relateProduct.length>0? basicInfo.relateProduct:[], // 关联产品
            serialNo: basicInfo.sort, // 序号
            // SEO信息
            seoTitle: basicInfo.metaTitle, // 网页标题
            seoMeta: basicInfo.metaKeywords, // meta关键字
            seoMetaDesc: basicInfo.metaDesc, // meta描述
            // 交易信息
            tradingChargeType: basicInfo.feeType, // 收费类型
            tradingOriginalPrice: basicInfo.classPreFee == "" ? 0 : Number(basicInfo.classPreFee), // 课程原价
            tradingCurrentPrice: basicInfo.classNowFee == "" ? 0 : Number(basicInfo.classNowFee), // 课程现价
            tradingVipPrice: basicInfo.classVipFee == "" ? 0 : Number(basicInfo.classVipFee), // 课程vip价
            tradingThirdFee: basicInfo.classThirdFee == "" ? 0 : Number(basicInfo.classThirdFee), // 课程第三方费用
            tradingThirdFeeState: basicInfo.classThirdFeeStatus, // 是否含有第三方费用
          };
          if (basicInfo.feeType == 1) {
            params.tradingOriginalPrice = 0;
            params.tradingCurrentPrice = 0;
            params.tradingThirdFee = 0;
            params.tradingThirdFeeState = 0;
          }
          if (basicInfo.feeType == 2) {
            params.tradingVipPrice = 0;
          }
          if (basicInfo.classThirdFeeStatus == 0) {
            params.tradingThirdFee = 0;
          }
          if (this.setContent) {
            params.instruction = this.content;
          }
          this.editClassData(params);
        }else{
          this.$message({
            type:"warning",
            message:"信息填写不全，请补充完整！",
            offset:300
          })
        }
      });
     }else{
       this.$message({
          type:"warning",
          message:" 请上传视频封面！",
          offset:300
        })
     }
    },
    // 编辑接口
    editClassData(params) {
      editClass(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          if (this.pageFrom !== 2) {
            this.$message({
              type: "success",
              message: "保存成功！",
              offset: 300,
            });
            this.getDetail();
            this.cancel();
          } else {
            if (this.setContent) {
              this.$message({
                type: "success",
                message: "创建成功！",
                offset: 300,
              });
              this.cancel();
            } else {
              this.$emit("close-dialog");
            }
          }
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg,
            offset: 300,
          });
        }
      });
    },
    // 获取课堂详情数据
    getDetail() {
      let params = { id: this.classId };
      getClassDetail(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let result = res.data.data;
          this.listProduct = result.listProduct;
          this.listSubject = result.listSubject;
          this.classForm.classTitle = result.baseTitle;
          this.classForm.adviseDesc = result.baseSlogan;
          // 回显专业分类
          this.classForm.themeType = [];
          this.themeTypeCopy = [];
          result.listSubject.forEach((item) => {
            this.classForm.themeType.push(item.subjectId);
            this.themeTypeCopy.push({
              subjectId: item.subjectId,
            });
          });
          this.classForm.showStatus = result.baseShowState;
          this.classForm.sort = result.serialNo;
          this.classForm.coverUrl = result.baseCoverUrl;
          this.classForm.plates = []
          this.listPlate = []
          this.listPlate1 = []
          result.listPlate.forEach((item) => {
            this.classForm.plates.push(item.id);
            this.listPlate.push({
              plateId: item.id,
              plateName: item.plateName,
              id: item.plateClassId
            });
            this.listPlate1.push(item)
          });
          // 回显封面
          this.$refs.upload.imgList = []; 
          this.$refs.upload.imgList.push({
            response: {
              data: result.baseCoverUrl,
            },
          });
          // 回显关联产品
          this.classForm.relateProduct = [];
          result.listProduct.forEach((item) => {
            this.classForm.relateProduct.push({
              categoryId: item.categoryId,
              productId:item.productId,
              id:item.id,
              spuId: item.productId,
              productName: item.name,
            });
          });
          // SEO信息
          this.classForm.metaTitle = result.seoTitle;
          this.classForm.metaKeywords = result.seoMeta;
          this.classForm.metaDesc = result.seoMetaDesc;
          // 交易信息
          this.classForm.feeType = result.tradingChargeType;
          this.classForm.classPreFee = Number(result.tradingOriginalPrice) == 0 ? "" : Number(result.tradingOriginalPrice);
          this.classForm.classNowFee = Number(result.tradingCurrentPrice) == 0 ? "" : Number(result.tradingCurrentPrice);
          this.classForm.classVipFee = Number(result.tradingVipPrice) == 0 ? "" : Number(result.tradingVipPrice);
          this.classForm.classThirdFeeStatus = Number(result.tradingThirdFeeState);
          this.classForm.classThirdFee = Number(result.tradingThirdFee) == 0 ? "" : Number(result.tradingThirdFee);
        }
      });
    },
    // 保存参数
    saveParams() {
      if (this.$refs.upload.imgList.length > 0) {
        this.classForm.coverUrl = this.$refs.upload.imgList[0].response.data;
      }
      this.$refs.classForm.validate((val) => {
        if (val) {
          this.$emit("pass");
        }else{
          this.$message({
            type:"warning",
            message:"信息填写不全，请补充完整！",
            offset:300
          })
        }
      });
    },
    // 回显选择的产品数据
    receiveProduct(val) {
      var cList = this.classForm.relateProduct.slice(0)
      val.forEach(pItem=>{
        var flag = true
        cList.forEach(item=>{
          if((item.productId == pItem.productId)){
             flag = false
          }
        })
        if(flag){
          this.classForm.relateProduct.push(pItem)
        }
      })
      if(this.classForm.relateProduct.length>6){
        this.$message({
          type:"warning",
          message:"最多添加6个产品！",
          offset:300
        })
        this.classForm.relateProduct = cList
      }
    },
    showProduct() {
      this.$refs.child.showProduct();
    },
    cancel() {
      if (this.pageFrom == 2) {
        clearDetail("/wt-classroom/course-management/index");
        this.$router.push("/wt-classroom/course-management/index");
      } else if (this.pageFrom == 1) {
        this.$emit("close-dialog");
      }
    },
    delRelatePro(index) {
      this.$confirm("确定删除该条产品吗？", "提示", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
      }).then(() => {
          this.classForm.relateProduct.splice(index, 1);
        }).catch((err) => {
          return err;
        });
    },
    // 获取产品分类下拉框数据
    getDropList() {
      getOptionList().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.optionList = res.data.data;
        }
      });
    },
    //获取板块信息
    getPlatesList() {
      listAllPlates().then(res => {
        if (res.data.code == 0) {
          this.platesList = res.data.data
        }
      })
    }
  },
  mounted() {
    this.getDropList();
    this.getPlatesList()
    if (this.classId !== "") {
      this.getDetail();
    }
  },
};
</script>

<style scoped>
.class-basic {
  width: 100%;
}
.basic-title-basic {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 16px;
}
.class-item {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-bottom: none !important;
}
.class-item:last-of-type {
  border-bottom: 1px solid #dcdfe6 !important;
}
.class-item-label {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  align-items: center;
  font-size: 14px;
}
.class-item-label > span:nth-of-type(1) {
  color: red;
}
.class-price-label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
}
.class-price-label > span:nth-of-type(1) {
  color: red;
}
.class-item-input {
  width: 100%;
  flex: 6;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-left: 1px solid #dcdfe6;
  padding: 20px;
}
.class-item-input-fee {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
}
.item-input-value {
  width: 320%;
}
.item-edit-value {
  width: 500% !important;
}
.top-info {
  margin-bottom: 30px;
}
.wt-img-upload {
  padding-top: 30px;
  padding-left: 10px;
  margin-bottom: -20px;
}
.relate-list {
  display: flex;
  flex-direction: column;
}
.relate-btn span {
  margin-left: 10px;
}
.relate-list-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.realte-del-btn {
  width: 20px;
  height: 20px;
  margin-left: 20px;
  cursor: pointer;
  transition: 0.5s;
}
.realte-del-btn:hover {
  color: #36a6fe;
}
.class-fee-contain {
  width: 100%;
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-left: 1px solid #dcdfe6;
  padding: 10px 20px;
}
.input-fee-contain {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.input-fee-contain span {
  font-size: 14px;
}
.input-fee-contain > span:nth-of-type(1) {
  display: inline-block;
  text-align: center;
  width: 70px;
}
.input-fee-contain p {
  font-size: 14px;
}
.fix-edit-btn {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.save-btn {
  margin-right: 100px;
}
.third-fee {
  margin-right: 20px !important;
}
.fee-status-sty {
  width: 200px;
}
</style>

<style>
.class-basic .el-form-item {
  margin: 0 !important;
}
.class-basic .el-form-item__content {
  margin-left: 0 !important;
}
</style>