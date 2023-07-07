<template>
<!-- 排查完成 -->
    <div class="pro-detail">
      <h3 class="basic-title">{{ $t('message.detailContent') }}</h3>
      <div class="two-tab">
        <h3 class="title-sty">{{ $t('message.editContent') }}</h3>
        <div class="two-btn-sty">
          <span><el-button type="primary" @click="showAddDialog(0)">{{ $t('button.addTag') }}</el-button></span>
          <span v-if="tinyList.length!==0">
            <el-button type="primary" @click="saveProduct()">{{ $t('button.save') }}</el-button>
            <el-button type="warning" @click="preview">{{ $t('button.preview') }}</el-button>
            <el-button @click="leave">{{ $t('button.cancel') }}</el-button>
          </span>
        </div>
        <p class="desc-sty">{{ $t('message.productTipsOne') }}</p>
        <p class="desc-sty">{{ $t('message.productTipsTwo') }}</p>
        <p class="desc-sty">{{ $t('message.productTipsThree') }}</p>
        <div style="margin-top:20px;" v-for="(item,index) in tinyList" :key="index">
          <div class="tag-sty">
            <span>
              <span v-if="item.tagName" style="font-size:14px;">{{ item.tagName }}</span>
              <i @click="showAddDialog(1,index)" class="el-icon-edit cursor-pointer"></i>
              <i
                class="el-icon-bottom move-sty"
                id="down"
                v-if="index!=(tinyList.length-1)"
                @click="handleMoveDown(index,item)"
              ></i>
              <i
                class="el-icon-top move-sty"
                id="up"
                v-if="index!==0"
                @click="handleMoveUp(index,item)"
              ></i>
            </span>
            <span @click="delTag(index)"><i class="el-icon-delete cursor-pointer"></i></span>
          </div>
          <div><tinymce-editor  e-editor v-model="item.tagContent" @getEditorValue="getChildEditor"  @limit='wordLimit' :id='String(index)'></tinymce-editor></div>
        </div>
      </div>
      <div class="btn-confirm">
        <el-button size="medium" type="primary" @click="saveProduct()">{{ $t('button.save') }}</el-button>
        <el-button size="medium" type="warning" class="cancel-sty-two" v-if="tinyList.length!==0" @click="preview">{{ $t('button.preview') }}</el-button>
        <el-button size="medium" class="cancel-sty-two" @click="leave">{{ $t('button.cancel') }}</el-button>
      </div>
      <!-- dialog -->
      <el-dialog
      :title="operateName"
      :visible.sync="dialogVisible"
      width="20%"
      center
      :before-close="handleClose">
      <el-form ref="addObj" :model="addObj" inline :rules="rules">
        <el-form-item :label="$t('label.tagName')" prop="tagName">
          <el-input
            v-model="addObj.tagName"
            maxlength="4"
            :placeholder="$t('input.noMorethan4')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-sty">
        <el-button type="primary" v-if="operateName == $t('button.addTag')" @click="addTag()">{{ $t('button.confirm') }}</el-button>
        <el-button type="primary" v-if="operateName == $t('button.editTag')" @click="editTag()">{{ $t('button.confirm') }}</el-button>
        <el-button class="cancel-style" @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
      </div>
    </el-dialog>
    </div>
</template>
<script>
import tinymceEditor from "@/views/project/ip-service/tinymceEditor";
import { editContent } from "@/api/project/ip";
import { clearDetail } from "@/util/clearDetail"
import * as CodeMsg from "@/api/common/CodeChange"
export default {
  components:{ tinymceEditor },
  props:["productInfo","tinyList"],
  data() {
    return {
      imgBaseUrl:"",
      addObj: {
        tagName: "",
      },
      checkStatus:false,
      editIndex:"",
      operateName:"",
      dialogVisible: false,
      limit: true,
      rules: {
        tagName: [{ required: true, message: this.$t("message.productRuleTipsOne"), trigger: "blur" }],
      },
    };
  },
  mounted(){
    this.switch()
  },
  methods: {
    switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
		// 上移
    handleMoveUp(index, row) {
      var that = this;
      if (index > 0) {
        // 获取当前点击的上一条数据
        const upDate = that.tinyList[index - 1];
        if (this.tinyList) {
          // 移除上一条数据
          that.tinyList.splice(index - 1, 1);
          // 把上一条数据插入当前点击的位置
          that.tinyList.splice(index, 0, upDate);
          // setTimeout(this.bannerSort(0, row.id, row.sort), 500);
        }
      }
    },
    // 下移
    handleMoveDown(index, row) {
      var that = this;
      const downDate = that.tinyList[index + 1];
      that.tinyList.splice(index + 1, 1);
      that.tinyList.splice(index, 0, downDate);
      // setTimeout(this.bannerSort(1, row.id, row.sort), 500);
    },
		leave() {
      clearDetail("/project/ip-service/index")
      this.$router.push("/project/ip-service/index");
    },
    saveProduct(){
      this.checkStatus = false;
      //判断至少添加一个标签并包含内容才可创建产品
      this.tinyList.forEach((item) => {
        if (item.tagName==""||item.tagContent == "") {
          this.checkStatus = false;
        }else{
          this.checkStatus = true
        }
      });
      if (this.checkStatus) {
        //调用编辑接口
        this.saveParams()
      } else {
        this.$message({
          type: "warning",
          message: this.$t("message.productMsgTipsOne"),
          offset: 300,
        });
      }
    },
    saveParams() {
      let labelList = [];
      let contentList = [];
      this.tinyList.forEach((item) => {
        labelList.push(item.tagName);
        contentList.push(item.tagContent);
      });
      let params = {
        id:this.productInfo.id,
        labelNames: labelList,
        labelContents: contentList,
      };
      editContent(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: this.$t('button.modifySuccess'),
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
    showAddDialog(num,index) {
      this.dialogVisible = true;
      if(num == 0){
      this.operateName = this.$t('button.addTag');
      this.addObj.tagName = "";
      }else{
      this.editIndex = index
      this.operateName = this.$t('button.editTag');
      this.addObj.tagName = this.tinyList[index].tagName
      }
    },
    handleClose() {
      this.dialogVisible = false;
		},
		preview() {
      let dataInfo=Object.assign({},this.productInfo);
      // console.log(dataInfo,"dataInfo")
      dataInfo.name=this.productInfo.name;
      dataInfo.slogan=this.productInfo.slogan;       
      if(dataInfo.feeType==1){
        dataInfo.nowFee=(dataInfo.thirdPartyFee || dataInfo.agencyFee)?(Number(dataInfo.thirdPartyFee)+Number(dataInfo.agencyFee)):null;
      }
      // if(dataInfo.hasPublicExpense===0){
      //   dataInfo.governmentFeeTypeList.forEach((item,index)=>{
      //     if(this.productInfo.defaultGovernmentFee==index){
      //       item.isDefault=0;
      //     }else{
      //       item.isDefault=1;
      //     }
      //     item.typeFee=Number(item.typeFee);
      //   })
      // }else{
      //   dataInfo.governmentFeeTypeList=[]
      // }
      if(this.productInfo.isOnline===0 ) dataInfo.isOnline=0;                      
      let routeData = this.$router.resolve({
        path: "/preview-product",
        query: {
          dataInfo:JSON.stringify(dataInfo),
          dataList: JSON.stringify(this.tinyList),
        },
      });     
      window.open(routeData.href, "_blank");
    },
    getChildEditor(data, index) {
      this.tinyList[index].tagContent = data;
    },
    wordLimit(val) {
      this.limit = val;
    },
    delTag(index) {
			this.$confirm(this.$t("message.productConfirmOne"), this.$t("title.notice"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          this.tinyList.splice(index, 1);
        })
    },
    editTag(){
      this.$refs["addObj"].validate((val) => {
        if(val){
          this.tinyList[this.editIndex].tagName = this.addObj.tagName
          this.dialogVisible = false
        }
      })
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
.check-choose {
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
.check-choose-form {
  margin: 8px;
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
.move-sty{
	font-size:18px;
	font-weight: bold;
	cursor:pointer;
	color:#409eff;
	border: 2px solid #409eff;
	border-radius: 20px;
	margin-left: 10px;
}
.btn-sty{
	display: flex;
	justify-content: center;
}
.cancel-style{
	margin-left: 25px;
}
</style>
