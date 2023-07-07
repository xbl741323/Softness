<template>
  <div class="answer-list">
    <div class="answer-top">
      <div class="flexX">
        <div class="flexX">
          <div class="userImg">
            <img
              v-if="answer.createByAvatar"
              :src="imgBaseUrl + answer.createByAvatar"
              alt
            />
            <img v-else :src="require('@/assets/images/task/head.png')" alt />
          </div>
          <div>
            <div class="my_answer">
              <span> {{ answer.createByName }}</span>
              <span v-if="userInfo.id == answer.createBy" class="myAnswer">我的回答</span>
            </div>
            <div>{{ answer.createTime }}</div>
          </div>
        </div>
        <el-button v-if="answer.acceptFlag == 1" type="primary">已采纳</el-button>
      </div>
    </div>
    <div class="answer_content_sty">
      <p
        class="answer-content"
        v-html="answer.content"
        ref="answer"
        @click="handleImgClick($event)"
      ></p>
      <p v-if="showState" class="more-content blue_sty" @click="moreVisible = true">
        更多>
      </p>
    </div>
    <div>
      <div class="flexX">
        <div class="flexX">
          <div class="flexX">
            <img class="img_sty" src="../../../assets/images/icons/aixin.png" alt="" />
            <span>喜欢</span>
            <span class="num_sty">{{ answer.upNum }}</span>
          </div>
          <div class="flexX">
            <img class="img_sty" src="../../../assets/images/icons/noaixin.png" alt="" />
            <span>不喜欢</span>
            <span class="num_sty">{{ answer.lowNum }}</span>
          </div>
        </div>
        <div class="flexX operation_sty" v-if="type == 2">
          <div class="flexX" v-if="filterStatus(permissions, 3)">
            <el-switch
              v-model="showValue"
              active-color="#0082fc"
              :disabled="!filterStatus(permissions, 1)"
              @change="
                filterStatus(permissions, 1) ? changeState($event) : $notAuthorized()
              "
            >
            </el-switch>
            <span class="operation_sty_btn">前台展示</span>
          </div>
          <div
            v-if="filterStatus(permissions, 3)"
            @click="
              filterStatus(permissions, 2) ? (dialogVisible = true) : $notAuthorized()
            "
            class="blue_sty flexX"
          >
            <i class="el-icon-delete"></i><span>删除</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="删除"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确认删除本次回答吗？客户端同步删除。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDetailFun()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="回答"
      :visible.sync="moreVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div class="dialog_sty">
        <p v-if="userInfo.id == answer.createBy" class="myAnswer">我的回答</p>
        <div class="answer-top">
          <div class="flexX">
            <div class="flexX">
              <div class="flexX">
                <div class="userImg">
                  <img
                    v-if="answer.createByAvatar"
                    :src="imgBaseUrl + answer.createByAvatar"
                    alt
                  />
                  <img v-else :src="require('@/assets/images/task/head.png')" alt />
                </div>
                <div class="userInfo">
                  <div>{{ answer.createByName }}</div>
                  <div>{{ answer.createTime }}</div>
                </div>
              </div>
              <div class="flexX iconfont_sty">
                <div class="flexX">
                  <img
                    class="img_sty"
                    src="../../../assets/images/icons/aixin.png"
                    alt=""
                  />
                  <span>喜欢</span>
                  <span class="num_sty">{{ answer.upNum }}</span>
                </div>
                <div class="flexX">
                  <img
                    class="img_sty"
                    src="../../../assets/images/icons/noaixin.png"
                    alt=""
                  />
                  <span>不喜欢</span>
                  <span class="num_sty">{{ answer.lowNum }}</span>
                </div>
              </div>
            </div>
            <el-button v-if="answer.acceptFlag == 1" type="primary">已采纳</el-button>
          </div>
        </div>
        <p
          v-html="answer.content"
          class="answer_content_sty"
          @click="handleImgClick($event)"
        ></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="moreVisible = false">我知道了 </el-button>
      </span>
    </el-dialog>
    <!-- 预览 -->
    <div class="demo-image__preview image_fix_sty">
      <el-image
        ref="preview"
        style="width: 0px; height: 0px"
        :src="preUrl"
        :preview-src-list="srcList"
      >
      </el-image>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { updateAnswer, removeAnswerById } from "@/api/personal/my-answer.js";
export default {
  name: "CRMPCAnswerList",
  props: {
    answer: {
      type: Object,
    },
    source: {
      type: String,
    },
    type: {
      // 1 查看 2  回复
      require: true,
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  data() {
    return {
      videoUrl: null,
      preUrl: null,
      srcList: [],
      userInfo: null,
      moreVisible: false,
      dialogVisible: false,
      showState: false,
      showValue: true,
      imgBaseUrl:
        process.env.NODE_ENV === "production"
          ? "//static.wotao.com/"
          : "//static-tst.wotao.com/",
    };
  },

  created() {
    // 判断是否添加更多
    this.$nextTick(() => {
      let answer = this.$refs.answer;
      let cHeight = answer.clientHeight;
      let sHeight = answer.scrollHeight;
      if (sHeight > cHeight) {
        this.showState = true;
      }
    });
    this.userInfo = JSON.parse(sessionStorage.getItem("pigx-userInfo")).content;
    this.showValue = this.filterShow(this.answer.showFlag, 1);
  },
  mounted() {},
  methods: {
    filterStatus(state, filterType) {
      /***
       * 1 状态  2 删除 3 我的发布 删除我的问答 修改状态
       * **/
      if (filterType == 1) {
        return this.source == "myPublish"
          ? state.bt_updateMyAnswer
          : state.bt_updateAnswer;
      } else if (filterType == 2) {
        return this.source == "myPublish"
          ? state.bt_removeMyAnswerById
          : state.bt_removeAnswerById;
      } else if (filterType == 3) {
        return this.source == "myPublish"
          ? this.userInfo.id == this.answer.createBy
          : true;
      }
    },
    handleImgClick(event) {
      if (event.target.tagName === "IMG") {
        this.srcList = [event.target.src];
        this.$refs.preview.showViewer = true;
        this.preUrl = event.target.src;
      }
    },
    //  删除回答
    deleteDetailFun() {
      removeAnswerById(this.answer.id, this.source == "myPublish").then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$parent.getDetailPaging();
          this.$message({
            type: "success",
            message: "删除成功",
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.moreVisible = false;
    },
    /****
     * 过滤switch状态
     *
     *@param type 1 转换 boolean 2 转换  数字
     * **/

    filterShow(state, type) {
      if (type == 1) {
        return state == 0 ? true : false;
      } else {
        return state ? 0 : 1;
      }
    },
    changeState(e) {
      this.showValue = e;
      let data = {
        id: this.answer.id,
        showFlag: this.filterShow(e, 2),
      };
      updateAnswer(data, this.source == "myPublish").then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$parent.getDetailPaging();
          this.$message({
            type: "success",
            message: "修改成功",
            duration: 2000,
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.font_size_sty {
  font-size: 14 !important;
}
.adopt_sty {
  background-color: rgb(146, 180, 214);
  width: 60px;
  height: 20px;
  border-radius: 5%;
  text-align: center;
  line-height: 20px;
}
.userImg {
  width: 30px;
  height: 30px;
  margin-right: 20px;
  img {
    width: 100%;
    height: 100%;
  }
}

.answer-list {
  color: #303133;
  background-color: #fff;
  margin-top: 10px;
  padding: 20px 50px;
}
.flexX {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.iconfont_sty {
  margin: 18px 0 0 10px;
}
.answer-content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-all;
  -webkit-line-clamp: 2;
}
.answer-top {
  margin-bottom: 20px;
}
.answer-content {
  margin-bottom: 20px;
}
.operation_sty {
  width: 200px;
}
.el-icon-delete {
  font-size: 20px;
}
.operation_sty_btn {
  margin-left: 10px;
}
.aixin {
  color: red;
}
.num_sty {
  margin: 0 10px;
}
.more_sty {
  color: #000;
}
.image_fix_sty {
  position: absolute;
  top: 0;
  z-index: 10000;
}
.el-image-viewer__close {
  background: rgb(238, 235, 235) !important;
}
.answer_content_sty {
  position: relative;
  margin: 0;
}
.answer_content_sty >>> video {
  width: 200px;
  height: 200px;
}
.answer_content_sty >>> img {
  width: 10%;
  height: 10%;
}
.answer_content_sty :nth-child(1) {
  padding-right: 20px;
}
.more-content {
  position: absolute;
  right: 0;
  bottom: -11px;
  cursor: pointer;
}
.blue_sty {
  color: #0082fc;
}
.img_sty {
  width: 14px;
  margin: 0 10px;
}
.myAnswer {
  margin-left: 10px;
  font-size: 14px;
  color: #f59a23;
}
.userInfo div {
  font-size: 16px;
}
.my_answer span {
  font-size: 16px;
}
.dialog_sty {
  // height: 70%;
  height: 700px;
  width: 100%;
  overflow-y: auto;
}
</style>
