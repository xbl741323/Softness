<template>
<!-- 排查完成 -->
  <div class="basic-info">
    <!-- 表格区域 -->
    <h3 v-if="type==0" class="basic-title">{{ $t('message.basicInfo') }}</h3>
    <el-form ref="productInfo" :model="productInfo" :rules="addRules">
      <table class="tab-style">
        <tr style="flex: 1">
          <th>
            <span class="must-sty">*</span>
            <span>{{ $t("message.productName") }}</span>
            </th>
            <th>
            <span class="must-sty">*</span>
            <span>{{ $t("message.ipType") }}</span>
            </th>
            <th>
            <span class="must-sty">*</span>
            <span>{{ $t("message.slogan") }}</span>
            </th>
            <th>
            <span class="must-sty">*</span>
            <span class="img-select-sty">{{ $t("message.coverImg") }}</span>
            </th>
            <th>
            <span class="must-sty">*</span>
            <span>{{ $t("message.productStatus") }}</span>
            </th>
          <th>
            <span class="must-sty">*</span>
            <span>工作流：</span>
            </th>
          <th>
              <span class="must-sty">*</span>
              <span>{{ $t("label.webTitle") }}</span>
              </th>
            <th>
              <span class="must-sty">*</span>
              <span>{{ $t("label.metaKeyword") }}</span>
              </th>
            <th class="last-th">
              <span class="must-sty">*</span>
              <span>{{ $t("label.metaDescription") }}</span>
              </th>
          <th v-if="type == 0">{{ $t("label.publishMan") }}</th>
          <th v-if="type == 0">{{ $t("label.publishTime") }}</th>
          <th v-if="type == 0">{{ $t("label.viewNumber") }}</th>
        </tr>
        <tr style="flex: 6">
          <td>
            <el-form-item class="input-style" prop="name">
              <el-input @input="checkName" v-model="productInfo.name" maxlength="16" :placeholder="$t('input.noMorethan16')" show-word-limit></el-input>
            </el-form-item>
          </td>
          <td>
            <el-radio-group v-model="productInfo.type">
              <el-radio :label="1">{{ $t("message.patent") }}</el-radio>
              <el-radio :label="2">{{ $t("message.trademark") }}</el-radio>
              <el-radio :label="3">{{ $t("message.copyright") }}</el-radio>
              <el-radio :label="4">其他</el-radio>
            </el-radio-group>
          </td>
          <td>
            <el-form-item class="input-style" prop="slogan">
              <el-input v-model="productInfo.slogan" maxlength="20" :placeholder="$t('input.noMorethan20')" show-word-limit></el-input>
            </el-form-item>
          </td>
          <td class="img-select-add">
            <el-button type="primary" @click="imgVisible = true">{{ $t("button.updateImg") }}</el-button>
            <img class="select-img" :src="imgBaseUrl + productInfo.coverUrl" alt="" />
          </td>
          <td>
            <el-form-item class="input-style" prop="status">
              <el-radio-group v-model="productInfo.status">
                <el-radio :label="1">{{ $t("status.show") }}</el-radio>
                <el-radio :label="2">{{ $t("status.noShow") }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </td>
           <td>
              <el-form-item class="input-style" prop="workId">
              <el-select v-model="productInfo.workId">
                <el-option 
                v-for="(item,index) in flowList" :key="index" 
                :label="item.flowNo+'-'+item.flowName"
                :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            </td>
          <td>
            <el-form-item class="input-style" prop="metaTitle">
              <el-input v-model="productInfo.metaTitle" maxlength="70" :placeholder="$t('input.noMorethan70')" show-word-limit></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item class="input-style" prop="metaKeywords">
              <el-input
                v-model="productInfo.metaKeywords"
								maxlength="100"
                :placeholder="$t('input.noMorethan100')"
								show-word-limit
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item class="input-style" prop="metaDesc">
              <el-input
                type="textarea"
                v-model="productInfo.metaDesc"
								maxlength="200"
                :placeholder="$t('input.noMorethan200')"
								show-word-limit
              ></el-input>
            </el-form-item>
          </td>
          <td v-if="type == 0" class="time-size">
					<el-tooltip effect="dark" :content="$t('label.jobNumber') +'：'+ productInfo.employeeNumber +' '+ $t('message.emp')+productInfo.deptName" placement="right">
              <div>
							<span v-if="productInfo.employeeName!==null">{{ productInfo.employeeName }}</span>
							</div>
          </el-tooltip>
					</td>
          <td v-if="type == 0" class="time-size">{{ productInfo.createTime }}</td>
          <td v-if="type == 0">
            <span class="view-sty">{{ $t("message.viewNumber") }} {{ productInfo.pageViews }}</span>
            <span class="view-sty">{{ $t("message.collectNumber") }} {{ productInfo.collection }}</span>
          </td>
        </tr>
      </table>
    </el-form>
    <!-- 按钮区域 -->
    <div class="btn-confirm">
      <el-button size="medium" type="primary" @click="saveProduct()">{{ $t('button.save') }}</el-button>
      <el-button size="medium" class="cancel-sty" @click="leave()">{{ $t('button.cancel') }}</el-button>
    </div>
    <!-- 添加图片 -->
    <el-dialog :title="$t('button.addImg')" :visible.sync="imgVisible" width="60%" center :modal="type==0?true:false">
      <el-radio-group v-model="productInfo.coverUrl">
        <el-radio v-for="(item, index) in imgList" :key="index" :label="item.imgUrl">
          <img class="pro-img" :src="imgBaseUrl + item.imgUrl" alt="" />
        </el-radio>
      </el-radio-group>
      <div class="btn-sty-img">
        <el-button type="primary" @click="imgVisible = false">{{ $t('button.confirm') }}</el-button>
        <el-button class="cancel-style" @click="cancel()">{{ $t('button.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { clearDetail } from "@/util/clearDetail"
import { getAllFlow } from "@/api/processmanage/work-flow"
import * as CodeMsg from "@/api/common/CodeChange"
import { getProductImg,editProduct,checkProductName } from "@/api/project/ip";
export default {
  props: ["productInfo", "payList", "type"],
  data() {
    return {
      flowList:[],
      nameStatus:false,
      imgBaseUrl: process.env.NODE_ENV === "production"?"//static.wotao.com/":"//static-tst.wotao.com/",
      imgVisible: false,
			imgList: [],
			addRules: {
        name: [{ required: true, message: this.$t("message.productRuleTipsTwo"), trigger: "blur" }],
        slogan: [{ required: true, message: this.$t("message.productRuleTipsThree"), trigger: "blur" }],
        metaTitle: [{ required: true, message: "请填写", trigger: "blur" }],
        metaKeywords: [{ required: true, message: "请填写", trigger: "blur" }],
        metaDesc: [{ required: true, message: "请填写", trigger: "blur" }],
        workId: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      addForm: {
        workId:"",
        name: "",
        type: 0,
        advertise: "",
        imgUrl: "",
        status: 0,
        routePay: "",
        metaTitle: "",
        metaKeywords: "",
        metaDesc: "",
      },
    };
  },
  methods: {
    checkName(){
      let params = {
        id:this.productInfo.id,
        name:this.productInfo.name
      }
      checkProductName(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_1){
         this.nameStatus = true
         this.$message({
          type:"warning",
          message:res.data.msg,
          offset:300
        })
        }else{
         this.nameStatus = false
        }
      })
    },
		oninput(value) {
		value = value.replace(/^0*(0\.|[1-9])/, "$1");
    value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
    value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
    value = value
     .replace(".", "$#$")
     .replace(/\./g, "")
     .replace("$#$", ".");
    value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
    value =
     value.indexOf(".") > 0
       ? value.split(".")[0].substring(0, 10) + "." + value.split(".")[1]
       : value.substring(0, 10);
    return value;
	},
		leave() {
			clearDetail("/project/ip-service/index")
      this.$router.push("/project/ip-service/index");
      this.$emit("close-dialog")
    },
		saveProduct() {
      if(this.nameStatus){
       this.$message({
            type: "warning",
            message: "产品名称已存在！",
            offset: 300,
          });
      }else{
        this.$refs["productInfo"].validate((val) => {
        if (val) {
          this.saveParams()
				} else {
          this.$message({
            type: "warning",
            message: this.$t("message.productMsgFive"),
            offset: 300,
          });
        }
      });
      }
		},
		saveParams() {
      let params = {
        number:this.productInfo.number,
		    id:this.productInfo.id,
        name: this.productInfo.name,
        type: this.productInfo.type,
        workId:this.productInfo.workId,
        workType:1,
        slogan: this.productInfo.slogan,
        coverUrl: this.productInfo.coverUrl,
        status: this.productInfo.status,
        metaTitle: this.productInfo.metaTitle,
        metaKeywords: this.productInfo.metaKeywords,
        metaDesc: this.productInfo.metaDesc,
      };
      editProduct(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess"),
            offset: 300,
					});
					this.$emit("refresh")
        } else {
          this.$message({
            type: "warning",
            message: res.data.data,
            offset: 300,
          });
        }
      });
    },
    checkSelect(index) {
      this.payList.forEach(item=>{
        if(item.status == false){
          item.price = ""
        }
      })
    },
    cancel() {
      this.imgVisible = false;
    },
    getImg() {
      getProductImg().then((res) => {
        this.imgList = res.data.data;
      });
    },
    getFollwData(){
      getAllFlow().then(res=>{
      this.flowList = res.data.data
    })
    }
  },
  mounted() {
    this.getImg();
    this.getFollwData();
  },
};
</script>
<style scoped>
.basic-title {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 16px;
}
.input-style {
  width: 100%;
  margin-top: 10px;
}
table,
th,
td {
  border-collapse: collapse;
}
.tab-style {
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  display: flex;
}
tr {
  display: flex;
  flex-direction: column;
}
th {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
}
th,
td {
  min-height: 65px;
  padding: 0 12px;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
td {
  display: flex;
  align-items: center;
  padding-left: 18px;
}
.check-choose-sty {
  display: flex;
  align-items: center;
}
.pay-sty {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
}
.special-th {
  height: 148px;
}
.check-form-sty {
  margin: 8px !important;
}
.last-th {
  height: 79px;
}
.btn-confirm {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
}
.cancel-sty {
  margin-left: 40px;
  width: 84px;
}
.view-sty {
  font-size: 14px;
  margin-right: 15px;
}
.select-img {
  width: 100px;
  margin-left: 20px;
}
.img-select-sty {
  height: 100px;
  line-height: 100px;
}
.img-select-sty {
  height: 100px;
  line-height: 100px;
}
.img-select-add {
  height: 101px;
}
.pay-type-sty {
  font-size: 14px;
  margin: 0 15px 0 20px;
}
.time-size {
  font-size: 14px;
}
.pro-img {
  width: 100px;
}
.btn-sty-img {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.check-btn-select {
  width: 100px;
}
.must-sty {
  color: red;
}
</style>
