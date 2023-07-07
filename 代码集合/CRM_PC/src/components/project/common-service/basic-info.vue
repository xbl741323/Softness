<template>
<!-- 排查完成 -->
  <div class="basic-info">
    <!-- 表格区域 -->
    <h3 v-if="type==0" class="basic-title">{{ $t('message.basicInfo') }}</h3>
    <el-form ref="productInfo" :model="productInfo" :rules="addRules">
      <table class="tab-style">
        <tr style="flex: 1">
          <th :class="[index == 8 ? 'last-th' : '']" v-for="(item, index) in titleList" :key="index">
            <span class="must-sty">*</span>
            <span :class="[index == 2 ? 'img-select-sty' : '']">{{ item }}</span>
          </th>
          <th v-if="type == 0">{{ $t("label.publishMan") }}</th>
          <th v-if="type == 0">{{ $t("label.publishTime") }}</th>
          <th v-if="type == 0">{{ $t("label.viewNumber") }}</th>
        </tr>
        <tr style="flex: 6">
          <td>
            <el-form-item class="input-style" prop="name">
              <el-input v-model.trim="productInfo.name" maxlength="30" placeholder="不超过30个字" show-word-limit></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item class="input-style" prop="slogan">
              <el-input v-model.trim="productInfo.slogan" maxlength="30" placeholder="不超过30个字" show-word-limit></el-input>
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
            <el-form-item class="input-style" prop="showStatus">
              <el-radio-group v-model="productInfo.showStatus">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="2">不显示</el-radio>
                <el-radio v-if="productInfo.showStatus == 3" :label="3">已删除</el-radio>
              </el-radio-group>
            </el-form-item>
          </td>
          <!-- 工作流这期不做 -->
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
            <el-form-item class="input-style" prop="sort">
              <el-input type="number" class="sort-width" v-model.trim="productInfo.sort" maxlength="6" show-word-limit></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item class="input-style" prop="metaTitle">
              <el-input v-model.trim="productInfo.metaTitle" maxlength="70" :placeholder="$t('input.noMorethan70')" show-word-limit></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item class="input-style" prop="metaKeyword">
              <el-input
                v-model.trim="productInfo.metaKeyword"
								maxlength="100"
                :placeholder="$t('input.noMorethan100')"
								show-word-limit
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item class="input-style" prop="metaDescription">
              <el-input
                type="textarea"
                v-model.trim="productInfo.metaDescription"
								maxlength="200"
                :placeholder="$t('input.noMorethan200')"
								show-word-limit
              ></el-input>
            </el-form-item>
          </td>
          <td v-if="type == 0" class="time-size">
					<el-tooltip effect="dark" :content="$t('label.jobNumber')+'：' + productInfo.createUserNumber +' '+ $t('message.emp')+productInfo.deptName" placement="right">
              <div>
							<span v-if="productInfo.createUserName!==null">{{ productInfo.createUserName }}</span>
							<span v-if="productInfo.createUserNumber!==null">({{ productInfo.createUserNumber }})</span>
							</div>
          </el-tooltip>
					</td>
          <td v-if="type == 0" class="time-size">{{ productInfo.createTime }}</td>
          <td v-if="type == 0">
            <span v-if="productInfo.pageViews!==null" class="view-sty">{{ $t("message.viewNumber") }} {{ productInfo.pageViews }}</span>
            <span v-else class="view-sty">{{ $t("message.viewNumber") }} 0</span>
            <span v-if="productInfo.collects!==null" class="view-sty">{{ $t("message.collectNumber") }} {{ productInfo.collects }}</span>
            <span v-else class="view-sty">{{ $t("message.collectNumber") }} 0</span>
          </td>
        </tr>
      </table>
    </el-form>
    <!-- 按钮区域 -->
    <div class="btn-confirm" v-if="productInfo.showStatus !== 3">
      <el-button size="medium" type="primary" @click="saveProduct()" v-preventReClick>{{ $t('button.save') }}</el-button>
      <el-button size="medium" class="cancel-sty" @click="leave()">{{ $t('button.cancel') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getCommonDetail, commonSetBasic ,commonCheckName } from "@/api/project/common"
import videUpload from "@/components/upload/video-upload"
import * as CodeMsg from "@/api/common/CodeChange"
import { clearDetail } from "@/util/clearDetail"
import { getAllFlow,getWorkDetail } from "@/api/processmanage/work-flow"
export default {
  components: { videUpload },
  props: ["type"],
  data() {
    var recheck = (rule, value, callback) => {
      commonCheckName(this.formType,{ name:value,id:this.id}).then((res) => {
          if (res.data.code == CodeMsg.CODE_1) {
            return callback(new Error('产品名称已存在，请重新填写！'));
          } else {
            callback();
          }
        })
    };
    return {
      id:"",
      formType:"",
      productInfo:{},
      flowList:[],
      nameStatus:false,
      imgBaseUrl: process.env.NODE_ENV === "production"?"//static.wotao.com/":"//static-tst.wotao.com/",
			imgList: [],
			addRules: {
        name: [
          { required: true, message: this.$t("message.productRuleTipsTwo"), trigger: "blur" },
          {validator: recheck, trigger: "blur" },
          ],
        slogan: [{ required: true, message: this.$t("message.productRuleTipsThree"), trigger: "blur" }],
        sort:[{ required: true, message: this.$t("input.pleaseInputSort"), trigger: "blur", }],
        metaTitle: [{ required: true, message: "请填写", trigger: "blur" }],
        metaKeyword: [{ required: true, message: "请填写", trigger: "blur" }],
        metaDescription: [{ required: true, message: "请填写", trigger: "blur" }],
        workId: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      titleList: ["产品名称","广告语","封面图片","产品状态","工作流","序号","网页标题","meta关键字","meta描述"],
    };
  },
  created(){
    if(this.$route.query.type){
      this.formType = this.$route.query.type
    }
    if(this.$route.query.id){
      this.id = this.$route.query.id
    }
  },
  methods: {
    translateType(val){
      // 财税服务转化为3 工商注册转化为2 法律服务转化为3 融资上市转化为3
      return val == 1?3:val == 2?2:val==3?5:val == 4?4:val == 6?6:""
  },
    getWorkId(){
      let params = {
        policyId:this.productInfo.id,
        type:this.translateType(Number(this.formType))
      }
      getWorkDetail(params).then(res=>{ 
         this.$set(this.productInfo, "workId",res.data.workId);
      })
    },
    getDetail() {
      getCommonDetail(this.formType,this.id).then((res) => {
        if(res.data.code == CodeMsg.CODE_0){
          this.productInfo = res.data.data;
          this.getWorkId()
          if (res.data.data.coverUrls!==null&&res.data.data.coverUrls.length>0) {
              this.$refs.video.fileList=[]
              res.data.data.coverUrls.forEach(item=>{
              this.$refs.video.fileList.push({
              response:{
                data:item.url,
                faceUrl:item.spUrl
              }
            })
            if(item.isCover == 1){
              this.$refs.video.checkd = item.url
            }
            })
        }
        }
      });
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
			if(this.type == 0){
       var url = ""
			 switch(this.formType){
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
      }
      this.$emit("close-dialog")
    },
		saveProduct() {
        this.$refs["productInfo"].validate((val) => {
        if (val) {
          if(this.$refs.video.fileList.length>0){
            this.saveParams()
          }else{
            this.$message({
            type: "warning",
            message: this.$t("请上传封面图片！"),
            offset: 300,
          });
          }
				} else {
          this.$message({
            type: "warning",
            message: this.$t("信息填写有误，请检查！"),
            offset: 300,
          });
        }
      });
		},
		saveParams() {
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
      let params = {
        number:this.productInfo.number,
		    id:this.productInfo.id,
        name: this.productInfo.name,
        slogan: this.productInfo.slogan,
        showStatus: this.productInfo.showStatus,
        metaTitle: this.productInfo.metaTitle,
        metaKeyword: this.productInfo.metaKeyword,
        metaDescription: this.productInfo.metaDescription,
        workId:this.productInfo.workId,
        sort:this.productInfo.sort,
        coverUrls: coverUrls,
      };
      commonSetBasic(this.formType,params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess"),
            offset: 300,
					});
          this.getDetail();
					this.$emit("refresh");
        } else {
          this.$message({
            type: "warning",
            message: res.data.data,
            offset: 300,
          });
        }
      });
    },
    getFollwData(){
      getAllFlow().then(res=>{
      this.flowList = res.data.data
    })
    }
  },
  mounted() {
    this.getDetail();
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
.sort-width{
  width: 200px;
}
</style>
