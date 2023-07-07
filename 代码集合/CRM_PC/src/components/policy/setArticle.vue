<template>
  <div class="app-container calendar-list-container">
    <el-form
      ref="form"
      :label-position="labelPosition"
      :rules="rules"
      :model="form"
      label-width="200px"
    >
      <h3 class="form-title">基本参数</h3>
      <el-form-item label="文章标题：">
        <span>{{ detailarticle.title }}</span>
      </el-form-item>
      <el-form-item label="显示状态：">
        <el-radio-group v-model="detailarticle.showStatus" :disabled="detail.taskStatus=='1' ||detail.taskStatus=='2'">
          <el-radio :label="0">置顶</el-radio>
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="2">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="网页标题：">
        <span>{{ detailarticle.metaTitle }}</span>
      </el-form-item>
      <el-form-item label="meta关键字：">
        <span>{{ detailarticle.metaKeyword }}</span>
      </el-form-item>
      <el-form-item label="meta描述：">
        <el-input
          type="textarea"
          disabled
          :autosize="{ minRows: 4, maxRows: 6 }"
          maxlength="200"
          v-model.trim="detailarticle.metaDescription"
        />
      </el-form-item>
      <h3 class="form-title" style="margin-top: 50px">详细信息</h3>
      <el-form-item label="适用地区：" prop="region">
        <template  v-if="detailarticle.options && detailarticle.options.length>0">
          <span v-for="(item,index) in detailarticle.options" :key="index">
                <span v-if="item.categoryId == '1'">{{item.optionName}}  /   {{item.areaName}} </span>
          </span>
        </template>
        <!-- <span>{{ detailarticle.options && detailarticle.options.length>0? detailarticle.options[1].optionName:'' }}</span> -->
      </el-form-item>
      <el-form-item
        label="行业类型："
        prop="region"
        style="margin-bottom: 20px"
      >
      <template  v-if="detailarticle.options && detailarticle.options.length>0">
         <span v-for="(item,index) in detailarticle.options" :key="index">
              <span v-if="item.categoryId == '5'">{{item.optionName}}  </span>
         </span>
      </template>
      </el-form-item>
      <el-form-item label="详细内容：">
        <el-input
          type="textarea"
          disabled
          :autosize="{ minRows: 25, maxRows: 30 }"
          v-model="detailarticle.content"
        />
        <!-- <p v-html="detailarticle.content"></p> -->
      </el-form-item>
      <div class="notice-file" style="margin-top: 40px; margin-bottom: 30px">
        <el-form-item label="附件：" v-if="detailarticle.filesList && detailarticle.filesList.length>0">
          <el-tooltip effect="dark" :content="item.name" placement="bottom-start" v-for="(item,index) in detailarticle.filesList" :key="index" >
            <span style="color: #36a6fe;cursor: pointer;dispaly:inline-block;margin-right:20px"  @click="download(item.url)">{{item.name}}</span>
          </el-tooltip>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { contractsDown } from "@/api/personal/mycontracts";
import { getDetail, rechecking } from "@/api/policy/policy";
import { checkFileNameList } from "@/api/policy/detail";
import E from "wangeditor";
import * as CodeMsg from "@/api/common/CodeChange";
import { getDropPolicy } from "@/api/policy/list";
import preventReClick from "@/util/preventReClick";
import tinymceEditor from "@/views/policySquare/tinymceEditor";

export default {
  components: {
    tinymceEditor,
  },
   props: ["detailarticle","detail"],
  data() {
    return {
      imgBaseUrl: "",
      labelPosition: "right",
      previewFileUrl: "",
      form:{},
      rules:{}
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.switch();
  },
  methods: {
    switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
    //合同下载
    download(url) {
      this.previewFileUrl = this.imgBaseUrl + url;
      console.log(this.previewFileUrl)
      window.open(this.previewFileUrl, "_blank");
      //  let filename=row.attachmentName
      // console.log(row,"sdfsdfdsf",filename)
      // let params = {
      //   url: row.attachmentUrl
      // }
      // //下载接口
      //   contractsDown(params).then(res=>{
      //     console.log(res,"blob")
      //     let blob = new Blob([res.data]);
      //     // console.log(blob,"blob3")
      //     let objectUrl = window.URL.createObjectURL(blob);
      //     var a = document.createElement("a");
      //     a.href = objectUrl;
      //     a.download = filename;
      //     a.click()
      //   })
    },
  },
};
</script>
<style>
.form-title {
  border-left: 5px solid #409eff;
  padding-left: 12px;
  height: 15px;
  line-height: 20px;
  color: #666;
  font-size: 16px;
}
.must:before {
  content: "*";
  color: #f56c6c;
  margin-left: -91px;
}
.content-warning {
  color: #f56c6c;
  font-size: 12px;
}
.deleteBtn {
  margin-left: 10px;
  color: chocolate;
  cursor: pointer;
}
</style>