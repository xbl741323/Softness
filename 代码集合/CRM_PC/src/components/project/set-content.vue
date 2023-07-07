<template>
<!-- 排查完成 -->
  <div>
    <div class="two-tab">
      <h3 class="basic-title">{{ $t('message.detailContent') }}</h3>
      <div class="two-btn-sty">
        <span><el-button type="primary" @click="showAddDialog(0)">{{ $t('button.addTag') }}</el-button></span>
        <!-- <span v-if="tinyList.length!==0">
          <el-button type="primary" @click="toLast">{{ $t('button.lastStep') }}</el-button>
          <el-button type="primary" @click="createProduct()" v-preventReClick>{{ $t('button.create') }}</el-button>
          <el-button type="warning" @click="preview">{{ $t('button.preview') }}</el-button>
          <el-button @click="leave">{{ $t('button.cancel') }}</el-button>
        </span> -->
      </div>
      <p class="desc-sty">{{ $t('message.productTipsOne') }}</p>
      <p class="desc-sty">{{ $t('message.productTipsTwo') }}</p>
      <p class="desc-sty">{{ $t('message.productTipsThree') }}</p>
      <div style="margin-top:20px;" v-for="(item,index) in tinyList" :key="index">
        <div class="tag-sty">
          <!-- <span>
            <span v-if="item.tagName" style="font-size:14px;">{{ item.tagName }}</span>
            <i @click="showAddDialog(1,index)" class="el-icon-edit cursor-pointer"></i>
          </span> -->
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
        <div><tinymce-editor v-model="item.text" @getEditorValue="getChildEditor"  @limit='wordLimit' :id='String(index)'></tinymce-editor></div>
      </div>
    </div>

    <el-dialog
      :title="operateName"
      :visible.sync="dialogVisible"
      width="20%"
      center
      :close-on-click-modal="false"
    >
      <el-form :model="addObj" ref="addObj" inline :rules="rules">
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
    
      <div class="btn-confirm">
        <el-button class="cancel-sty-two" size="medium" type="primary" @click="modDetail()" v-preventReClick>{{$t('button.save')}}</el-button>
        <el-button class="cancel-sty-two" size="medium" @click="goback">{{$t('button.cancel')}}</el-button>
      </div>
  </div>
</template>

<script>
import { getDetailInfo, modDetailInfo} from '@/api/project/project'
import tinymceEditor from "@/views/project/ip-service/tinymceEditor";
import { clearDetail } from "@/util/clearDetail"
export default {
  components:{
    tinymceEditor
  },
  data(){
    return {
      tinyList:[],
      operateName:'',
      limit:'',
      addObj:{},
      editIndex:'',
      dialogVisible: false,
      productId:'',
      rules:{
        tagName:[{required: true, message:'请输入标签名',trigger:'blur'}]
      }
    }
  },
  mounted(){

  },
  methods:{
    getDetail(){
      getDetailInfo({spuId: this.$route.query.number}).then(res=>{
        this.productId = res.data.data[0].id;
        this.tinyList = res.data.data;
      })
    },
    modDetail(){
      let param = {
        id: this.$route.query.number,
        detailInfoList: this.tinyList
      }
      modDetailInfo(param).then(res=>{
        if(res.data.code == 0){
          this.$message({
            type:'success',
            message:'编辑成功！'
          })
          history.go(-1);
        }
      })
    },
    goback(){
      clearDetail("/project/index")
      history.go(-1)
    },
    getChildEditor(data, index) {
      this.tinyList[index].text = data;
    },
    wordLimit(val) {
      this.limit = val;
    },
    showAddDialog(num, index) {
      this.dialogVisible = true;
      if (num == 0) {
        this.operateName = this.$t('button.addTag');
        this.$set(this.addObj,'tagName','')
      } else {
        this.editIndex = index;
        this.operateName = this.$t('button.editTag');
        this.$set(this.addObj,'tagName',this.tinyList[index].tagName)
      };
    },
    delTag(index) {
			this.$confirm(this.$t("message.productConfirmOne"), this.$t("title.notice"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      }).then(() => {
        this.tinyList.splice(index, 1);
      })
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
              text: "",
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
  }
}
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
.two-tab {
  border: 1px solid #ebeef5;
  padding: 20px 20px;
  min-height: 400px;
}
.desc-sty {
  font-size: 14px;
  margin-bottom: -5px;
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
.btn-sty{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.cancel-style{
  margin-left: 50px;
}
.btn-confirm {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
}
.move-sty {
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  color: #409eff;
  border: 2px solid #409eff;
  border-radius: 20px;
  margin-left: 10px;
}
</style>