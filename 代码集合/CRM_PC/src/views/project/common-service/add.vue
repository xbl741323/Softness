<template>
<!-- 排查完成 -->
  <div class="add_product_main">
    <div class="add-product-pro">
      <div class="add-top">
        <span class="title-size">{{ $t("message.createProduct") }}</span>
        <el-steps :active="active" finish-status="success" class="steps-sty">
          <el-step title="基本信息"></el-step>
          <el-step title="详细内容"></el-step>
          <el-step title="创建完成"></el-step>
        </el-steps>
      </div>
      <!-- 第一步-表格区域 -->
      <div v-show="active == 1">
        <h3 class="basic-title">基本信息</h3>
        <el-form ref="addForm" :model="addForm" :rules="addRules">
          <table class="tab-sty">
            <tr style="flex: 1">
              <th :class="[index == 8 ? 'last-th' : '']" v-for="(item, index) in titleList" :key="index">
                <span class="must-sty">*</span>
                <span :class="[index == 2 ? 'img-select-sty' : '']">{{ item }}</span>
              </th>
            </tr>
            <tr style="flex: 5">
              <td>
                <el-form-item class="input-sty" prop="name">
                  <el-input v-model.trim="addForm.name" maxlength="30" placeholder="不超过30个字" show-word-limit></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="input-sty" prop="advertise">
                  <el-input v-model.trim="addForm.advertise" maxlength="30" placeholder="不超过30个字" show-word-limit></el-input>
                </el-form-item>
              </td>
              <td class="img-select-add">
							  <vide-upload ref="video"></vide-upload>
                <div>
                 <p>1.图片最多6张包括视频，格式为jpg，png，gif，mp4，avi，mov等，大小控制在4M以内（视频为100M以内）。</p>
                 <p style="margin-top:-5px;">2.上传视频时我们会为您自动截取封面，您也可手动上传视频封面图片</p>
                </div>
							</td>
              <td>
                <el-form-item class="input-sty" prop="status">
                  <el-radio-group v-model="addForm.status">
                    <el-radio :label="1">显示</el-radio>
                    <el-radio :label="2">不显示</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="input-sty" prop="workId">
                  <el-select v-model="addForm.workId">
                    <el-option v-for="(item, index) in flowList" :key="index" :label="item.flowNo+'-'+item.flowName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="input-sty" prop="sort">
                  <el-input type="number" class="sort-width" v-model.trim="addForm.sort" maxlength="6" show-word-limit></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="input-sty" prop="metaTitle">
                  <el-input v-model.trim="addForm.metaTitle" maxlength="70" :placeholder="$t('input.noMorethan70')" show-word-limit></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="input-sty" prop="metaKeywords">
                  <el-input v-model.trim="addForm.metaKeywords" maxlength="100" :placeholder="$t('input.noMorethan100')" show-word-limit></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="input-sty" prop="metaDesc">
                  <el-input type="textarea" v-model.trim="addForm.metaDesc" maxlength="200" :placeholder="$t('input.noMorethan200')" show-word-limit></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
      </div>
      <!-- 第二步-表格区域 -->
      <div v-show="active == 2">
        <h3 class="basic-title">{{ $t("message.detailContent") }}</h3>
        <div class="two-tab">
          <p class="title-sty">{{ $t("message.editContent") }}</p>
          <div class="two-btn-sty">
            <span><el-button type="primary" @click="showAddDialog(0)">{{ $t("button.addTag") }}</el-button></span>
            <span v-if="tinyList.length !== 0">
              <el-button type="primary" @click="createProduct()" v-preventReClick>{{ $t("button.create") }}</el-button>
              <el-button type="primary" @click="toLast()">{{ $t("button.lastStep") }}</el-button>
              <el-button type="warning" v-if="tinyList.length > 0 && active == 2" @click="preview()">{{ $t("button.preview") }}</el-button>
              <el-button @click="leave()">{{ $t("button.cancel") }}</el-button>
            </span>
          </div>
          <p class="desc-sty">{{ $t("message.productTipsOne") }}</p>
          <p class="desc-sty">{{ $t("message.productTipsTwo") }}</p>
          <p class="desc-sty">{{ $t("message.productTipsThree") }}</p>
          <div
            style="margin-top: 20px"
            v-for="(item, index) in tinyList"
            :key="index">
            <div class="tag-sty">
              <span>
                <span v-if="item.tagName" class="font-sty">{{ item.tagName }}</span>
                <i @click="showAddDialog(1, index)" class="el-icon-edit cursor-pointer"></i>
              </span>
              <span @click="delTag(index)"><i class="el-icon-delete cursor-pointer"></i></span>
            </div>
            <div>
							<tinymce-editor v-model="item.tagContent" @getEditorValue="getChildEditor" @limit="wordLimit" :id="String(index)"></tinymce-editor>
            </div>
          </div>
        </div>
      </div>
      <!-- 按钮区域 -->
      <div class="btn-confirm">
        <el-button
          size="medium"
          type="primary"
          v-if="active == 2"
          @click="createProduct()"
          v-preventReClick>{{ $t("button.create") }}</el-button>
        <el-button
          size="medium"
          type="primary"
          v-if="active == 2"
          class="cancel-sty-two"
          @click="toLast()">{{ $t("button.lastStep") }}</el-button>
        <el-button
          size="medium"
          type="primary"
          v-if="active == 1"
          @click="toNext()">{{ $t("button.nextStep") }}</el-button>
        <el-button
          size="medium"
          type="warning"
          class="cancel-sty-two"
          v-if="tinyList.length > 0 && active == 2"
          @click="preview()">{{ $t("button.preview") }}</el-button>
        <el-button size="medium" class="cancel-sty-two" @click="leave()">{{ $t("button.cancel") }}</el-button>
      </div>
      <!-- dialog添加标签 -->
      <el-dialog
        :title="operateName"
        :visible.sync="dialogVisible"
        width="20%"
        center
        :before-close="handleClose">
        <el-form ref="addObj" :model="addObj" inline :rules="rules">
          <el-form-item :label="$t('label.tagName')" prop="tagName">
            <el-input v-model="addObj.tagName" maxlength="4" :placeholder="$t('input.noMorethan4')"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-sty">
          <el-button
            type="primary"
            v-if="operateName == $t('button.addTag')"
            @click="addTag()">{{ $t("button.confirm") }}</el-button>
          <el-button
            type="primary"
            v-if="operateName == $t('button.editTag')"
            @click="editTag()">{{ $t("button.confirm") }}</el-button>
          <el-button class="cancel-style" @click="dialogVisible = false">{{ $t("button.cancel") }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { commonAdd,commonCheckName } from "@/api/project/common"
import videUpload from "@/components/upload/video-upload"
import tinymceEditor from "../ip-service/tinymceEditor";
import { getAllFlow } from "@/api/processmanage/work-flow";
import * as CodeMsg from "@/api/common/CodeChange"
import { clearDetail } from "@/util/clearDetail";
export default {
  components: { tinymceEditor,videUpload },
  data() {
    var recheck = (rule, value, callback) => {
      commonCheckName(this.type,{ name: value }).then((res) => {
          if (res.data.code === CodeMsg.CODE_1) {
            return callback(new Error('产品名称已存在，请重新填写！'));
          } else {
            callback();
          }
        })
    };
    return {
		  type:"",
      flowList: [],
      imgList: [],
      imgBaseUrl:
        process.env.NODE_ENV === "production"
          ? "//static.wotao.com/"
          : "//static-tst.wotao.com/",
      addObj: {
        tagName: "",
      },
      checkStatus: false,
      editIndex: "",
      operateName: "",
      dialogVisible: false,
      tinyList: [],
      limit: true,
      rules: {
        tagName: [{required: true,message: this.$t("message.productRuleTipsOne"),trigger: "blur"}],
      },
      addRules: {
        name: [
          {required: true,message: this.$t("message.productRuleTipsTwo"),trigger: "blur"},
          {validator: recheck, trigger: "blur" },
          ],
        sort:[{ required: true, message: this.$t("input.pleaseInputSort"), trigger: "blur", }],
        advertise: [{required: true,message: this.$t("message.productRuleTipsThree"),trigger: "blur"}],
        metaTitle: [{ required: true, message: "请填写", trigger: "blur" }],
        metaKeywords: [{ required: true, message: "请填写", trigger: "blur" }],
        metaDesc: [{ required: true, message: "请填写", trigger: "blur" }],
        workId: [{ required: true, message: "请选择", trigger: "change" }],
      },
      titleList: ["产品名称","广告语","封面图片","产品状态","工作流","序号","网页标题","meta关键字","meta描述"],
      addForm: {
        name: "",
        type: 1,
        advertise: "",
        sort:1,
        status: 1,
        workId: "",
        metaTitle: "",
        metaKeywords: "",
        metaDesc: ""
      },
      active: 1,
    };
  },
	created(){
		this.type = this.$route.query.type
	},
  methods: {
    leave() {
			var url = ""
			switch(this.type){
				case 1:
          url = "/project/common-service/cs-service/index";
				 break;
				case 2:
					url = "/project/common-service/gs-register/index";
				 break;
				case 3:
					url = "/project/common-service/legal-service/index";
				 break;
				case 4:
					url = "/project/common-service/rz-list/index";
				 break;
        case 6:
					url = "/project/common-service/rj-design/index";
				 break;
			}
			clearDetail(url);
      this.$router.push(url);
		},
    removeHTMLTag(val) {  
      let str = val
      str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag  
      str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白  
      str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行  
      str = str.replace(/&nbsp;/ig, "")
      str = str.replace(/ /ig,'');//去掉   
      return str;  
    },
    createProduct() {
      this.checkStatus = false;
      //判断至少添加一个标签并包含内容才可创建产品
      this.tinyList.forEach((item) => {
        if (item.tagContent !== ""&&item.tagContent !== "<p><br></p>") {
          this.checkStatus = true;
        } else {
          this.checkStatus = false;
        }
      });
      if (this.checkStatus) {
        this.saveParams();
      } else {
        this.$message({
          type: "warning",
          message: this.$t("message.productMsgTipsOne"),
          offset: 300,
        });
      }
    },
    getUrls(){
      var coverUrls = []
        this.$refs.video.fileList.forEach(item=>{
           coverUrls.push(
             {
               isCover:this.$refs.video.checkd == item.response.data?1:0,
               url:item.response.data,
               spUrl:item.response.faceUrl==null?"":item.response.faceUrl
               }
             )
        })
        return coverUrls;
    },
    saveParams() {
      let params = {
        //上一页
        name: this.addForm.name,
        slogan: this.addForm.advertise,
        showStatus: this.addForm.status,
        metaTitle: this.addForm.metaTitle,
        metaKeyword: this.addForm.metaKeywords,
        metaDescription: this.addForm.metaDesc,
        coverUrls:this.getUrls(),
        workId:this.addForm.workId,
        sort:this.addForm.sort,
        //下一页
        labelOneName: this.tinyList[0]&&this.tinyList[0].tagName!==null?this.tinyList[0].tagName:"",
        labelOneContent: this.tinyList[0]&&this.tinyList[0].tagContent!==null?this.tinyList[0].tagContent:"",
        labelTwoName: this.tinyList[1]&&this.tinyList[1].tagName!==null?this.tinyList[1].tagName:"",
        labelTwoContent: this.tinyList[1]&&this.tinyList[1].tagContent!==null?this.tinyList[1].tagContent:"",
        labelThreeName: this.tinyList[2]&&this.tinyList[2].tagName!==null?this.tinyList[2].tagName:"",
        labelThreeContent: this.tinyList[2]&&this.tinyList[2].tagContent!==null?this.tinyList[2].tagContent:"",
        labelFourName: this.tinyList[3]&&this.tinyList[3].tagName!==null?this.tinyList[3].tagName:"",
        labelFourContent: this.tinyList[3]&&this.tinyList[3].tagContent!==null?this.tinyList[3].tagContent:"",
      };
      commonAdd(this.type,params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "创建成功！",
            offset: 300,
          });
          this.leave();
        }
      });
    },
    showAddDialog(num, index) {
      this.dialogVisible = true;
      if (num == 0) {
        this.operateName = this.$t("button.addTag");
        this.addObj.tagName = "";
      } else {
        this.editIndex = index;
        this.operateName = this.$t("button.editTag");
        this.addObj.tagName = this.tinyList[index].tagName;
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    preview() {
      let routeData = this.$router.resolve({
        path:"/common-service-preview",
        query:{
          form:JSON.stringify(this.addForm),
          coverUrls:JSON.stringify(this.getUrls()),
          tinyList:JSON.stringify(this.tinyList)
        }
        });
      window.open(routeData.href);
    },
    getChildEditor(data, index) {
      this.tinyList[index].tagContent = data;
      console.log(this.tinyList);
    },
    wordLimit(val) {
      this.limit = val;
    },
    delTag(index) {
      this.$confirm(
        this.$t("message.productConfirmOne"),
        this.$t("title.notice"),
        {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        }
      ).then(() => {
        this.tinyList.splice(index, 1);
      });
    },
    editTag() {
      this.$refs["addObj"].validate((val) => {
        if (val) {
          this.tinyList[this.editIndex].tagName = this.addObj.tagName;
          this.dialogVisible = false;
        }
      });
    },
    addTag() {
      this.$refs["addObj"].validate((val) => {
        if (val) {
          if (this.tinyList.length < 4) {
            let obj = {
              tagName: this.addObj.tagName,
              tagContent: "",
              status: false,
            };
            this.tinyList.push(obj);
            this.dialogVisible = false;
          } else {
            this.$message({
              type: "warning",
              message: this.$t("message.productMsgTipsTwo"),
            });
          }
        }
      });
    },
    toNext() {
      this.$refs["addForm"].validate((val) => {
        if (val) {
          if(this.$refs.video.fileList.length>0){
            this.active = 2;
          }else{
            this.$message({
            type: "warning",
            message: "请上传封面图片！",
            offset: 300,
          });
          }
         } else {
          this.$message({
            type: "warning",
            message: "信息填写有误，请检查！",
            offset: 300,
          });
        }
      });
    },
    toLast() {
      this.active--;
    },
		getDropData(){
			getAllFlow().then((res) => {
        this.flowList = res.data.data;
    });
		}
  },
  mounted() {
    this.getDropData()
  },
};
</script>

<style scoped>
.add_product_main {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 40px 20px;
}
.add-product-pro {
  width: 80%;
  margin-left: 5%;
}
.add-top {
  display: flex;
}
.title-size {
  margin-top: 4px;
  font-size: 14px;
}
.steps-sty {
  width: 85%;
  margin-left: 50px;
}
.basic-title {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 16px;
}
.input-sty {
  width: 100%;
  margin-top: 10px;
}
table,
th,
td {
  border-collapse: collapse;
}
.tab-sty {
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
.last-th {
  height: 79px;
}
.btn-confirm {
  margin-bottom: 46px;
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
}
.cancel-sty-left {
  margin-left: 80px;
  width: 84px;
}
.cancel-sty-two {
  margin-left: 20px;
  width: 84px;
}
.two-tab {
  border: 1px solid #ebeef5;
  padding: 20px 20px;
  min-height: 400px;
}
.desc-sty {
  font-size: 14px;
  margin-bottom: -5px;
}
.title-sty {
  font-size: 16px;
  font-weight: bold;
}
.two-btn-sty {
  display: flex;
  justify-content: space-between;
}
.tag-sty {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}
.cursor-pointer {
  cursor: pointer;
  margin-left: 5px;
}
.btn-sty {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cancel-style {
  margin-left: 35px;
}
.pay-type-sty {
  font-size: 14px;
  margin: 0 15px 0 20px;
}
.check-btn-select {
  width: 100px;
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
.must-sty {
  color: red;
}
.select-img {
  width: 100px;
  margin-left: 20px;
}
.img-select-sty {
  min-height: 461px;
  line-height: 461px;
}
.img-select-add {
	padding: 30px 0 0 30px;
	justify-content: center;
	align-items: flex-start;
	display: flex;
	flex-direction: column;
  min-height: 462px;
	font-size: 14px;
}
.font-sty{
	font-size: 14px;
}
.sort-width{
  width: 200px;
}
</style>
