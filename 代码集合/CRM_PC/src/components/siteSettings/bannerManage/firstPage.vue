<template>
  <div class="banner">
    <div class="banner_head">
      <div>
        <el-button
          size="small"
          type="primary"
          style="width:120px;margin-bottom:20px;"
          @click="showBanner"
        >{{ $t('button.addBanner') }}</el-button>
      </div>
    </div>
    <!-- +新增操作的dialog -->
    <el-dialog
      :title="$t('button.addBanner')"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      center
      width="30%"
      @close="cancel"
    >
      <el-form :model="bannerInfo" ref="bannerInfo" :rules="rules">
        <el-form-item
          :label="$t('label.bannerTitle')"
          v-model="bannerInfo.title"
          label-width="110px"
          prop="title"
        >
          <el-input v-model="bannerInfo.title" v-maxlength:test="40"></el-input>
        </el-form-item>
        <el-form-item :label="$t('label.bannerImg')" label-width="110px">
          <up-img :url="bannerInfo.photo" :typeStatus="false" @on-change="changeImage"></up-img>
          <ul style="margin-left:-40px;margin-top:10px;">
            <li v-if="deviceType=='pc'" style="margin-bottom:-10px;line-height:20px;">{{ $t('message.addView') }}</li>
            <li v-else style="margin-bottom:-10px;line-height:20px;">{{ $t('message.addViewMobile') }}</li>
          </ul>
        </el-form-item>
        <el-form-item
          style="margin-left:-175px;"
          :label="$t('label.sortNumber')"
          label-width="280px"
          prop="sort"
        >
          <el-select v-model="bannerInfo.sort">
            <el-option :label="1" :value="1"></el-option>
            <el-option :label="2" :value="2"></el-option>
            <el-option :label="3" :value="3"></el-option>
            <el-option :label="4" :value="4"></el-option>
            <el-option :label="5" :value="5"></el-option>
            <el-option :label="6" :value="6"></el-option>
            <el-option :label="7" :value="7"></el-option>
            <el-option :label="8" :value="8"></el-option>
            <el-option :label="9" :value="9"></el-option>
            <el-option :label="10" :value="10"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          style="margin-left:-175px;"
          :label="$t('label.urlTxt')+'：'"
          label-width="280px"
        >
          <el-input v-model="bannerInfo.linkUrl"></el-input>
        </el-form-item>
        <el-form-item
          style="margin-left:-175px;"
          :label="$t('label.planTime')+'：'"
          label-width="280px"
        >
          <el-date-picker
            v-model="bannerInfo.dateTime"
            type="datetimerange"
            :start-placeholder="$t('placeholder.startTime')"
            :end-placeholder="$t('placeholder.endTime')"
            @change="changeTime"
            :picker-options="expireTimeOption"
            :unlink-panels="true"
            format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-top:-40px;">
        <el-button
          @click="addBanner"
          style="margin-right:40px;margin-left:85px;width:100px;"
          type="primary"
          :disabled="disbtn"
        >{{ $t('button.save') }}</el-button>
        <el-button @click="cancel" style="width:100px;">{{ $t('button.cancel') }}</el-button>
      </div>
    </el-dialog>
    <!-- +新增操作的dialog-结束线 -->
    <el-table border :data="bannerList" ref="imgList" highlight-current-row style="width:100%">
      <el-table-column type="index" :label="$t('label.sortNumber')" width="60"  align="center"></el-table-column>
      <el-table-column prop="number" :label="$t('label.editNumber')" width="115" align="center"></el-table-column>
      <el-table-column :label="$t('table.title')" align="center" width="200">
        <template slot-scope="scope">
          <span
            style="cursor:pointer;"
            @click="showInput(scope.row)"
            @mouseenter="(showIndex = scope.$index)"
            @mouseleave="showIndex = 9999"
            v-if="scope.row.showStatus == false"
          >{{ scope.row.title }}</span>
          <i class="el-icon-edit" style="margin-left:1px;" v-if="scope.$index == showIndex"></i>
          <el-input
            size="mini"
            v-if="showStatus == true&&showId == scope.row.id"
            v-model="scope.row.title"
            v-maxlength:test="40"
            style="width:105px;"
          ></el-input>
          <span style="margin-left:10px;" v-if="showStatus == true&&showId == scope.row.id">
            <el-button type="success" icon="el-icon-check" circle @click="submitUpdate(scope.row)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-close"
              circle
              @click="showStatus = false,scope.row.showStatus = false"
            ></el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('label.img')" align="center" width="200">
        <template slot-scope="scope">
          <div>
            <el-image
              style="width: 180px; height: 110px;cursor:pointer;"
              :src="imgBaseUrl+scope.row.photoUrl"
            ></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('label.urlTxt')" align="center" width="120">
        <template slot-scope="scope">
          <a :href="scope.row.linkUrl" style="color:blue;">{{ scope.row.linkUrl }}</a>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('placeholder.startTime')+'-'+$t('placeholder.endTime')"
        width="300"
        align="center"
      >
        <template slot-scope="scope">
          <el-date-picker
            style="width:95%;color:red;"
            size="mini"
            v-model="scope.row.dateList"
            :picker-options="expireTimeOption"
            type="datetimerange"
            :start-placeholder="$t('placeholder.startTime')"
            :end-placeholder="$t('placeholder.endTime')"
            format="yyyy-MM-dd HH:mm"
            :unlink-panels="true"
            @blur="changeDate(scope.row)"
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.showBannerStatus')" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.statusBoo"
            active-color="#13ce66"
            inactive-color="#ccc"
            @change="changeSwitch(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('label.opration')" align="center" width="180">
        <template slot-scope="scope">
          <!-- +编辑操作的dialog -->
          <el-dialog
            :title="$t('button.edit')+'banner'"
            :visible.sync="dialogFormVisible2"
            :close-on-click-modal="false"
            center
            width="30%"
            @close="cancel"
          >
            <el-form :model="bannerInfo" ref="bannerInfo" :rules="rules">
              <el-form-item
                :label="$t('label.bannerTitle')"
                v-model="bannerInfo.title"
                label-width="110px"
                prop="title"
              >
                <el-input v-model="bannerInfo.title" v-maxlength:test="40"></el-input>
              </el-form-item>
              <el-form-item :label="$t('label.bannerImg')" label-width="110px">
                <up-img :url="bannerInfo.photo" :typeStatus="true" @on-change="changeImage"></up-img>
                <ul style="margin-left:-38px;margin-top:10px;">
                  <li v-if="deviceType=='pc'" style="margin-bottom:-10px;line-height:20px;">{{ $t('message.addView') }}</li>
                  <li v-else style="margin-bottom:-10px;line-height:20px;">{{ $t('message.addViewMobile') }}</li>
                </ul>
              </el-form-item>
              <el-form-item
                style="margin-left:-175px;"
                :label="$t('label.sortNumber')"
                label-width="280px"
                prop="sort"
              >
                <el-select v-model="bannerInfo.sort" @change="changeSort">
                  <el-option
                    v-for="(item,index) in numberList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                style="margin-left:-175px;"
                :label="$t('label.urlTxt')+'：'"
                label-width="280px"
              >
                <el-input v-model="bannerInfo.linkUrl"></el-input>
              </el-form-item>
              <el-form-item
                style="margin-left:-175px;"
                :label="$t('label.planTime')+'：'"
                label-width="280px"
              >
                <el-date-picker
                  v-model="bannerInfo.dateTime"
                  type="datetimerange"
                  :start-placeholder="$t('placeholder.startTime')"
                  :end-placeholder="$t('placeholder.endTime')"
                  :picker-options="expireTimeOption"
                  :unlink-panels="true"
                  @change="changeTime"
                ></el-date-picker>
              </el-form-item>
            </el-form>
            <div slot="footer" style="margin-top:-40px;">
              <el-button
                @click="editBanner(scope.row)"
                style="width:100px;margin-right:40px;margin-left:85px;"
                type="primary"
                :disabled="disbtn"
              >{{ $t('button.save') }}</el-button>
              <el-button @click="cancel" style="width:100px;">{{ $t('button.cancel') }}</el-button>
            </div>
          </el-dialog>
          <!-- +编辑操作的dialog-结束线 -->
          <span style="margin-right:10px;display:inline-block;">
            <i
              class="el-icon-sort-down"
              style="font-size:22px;cursor:pointer;color:#409eff;"
              id="down"
              v-if="scope.$index!=(bannerCount-1)"
              @click="handleMoveDown(scope.$index,scope.row)"
            ></i>
            <i
              class="el-icon-sort-up"
              style="font-size:22px;cursor:pointer;color:#409eff;"
              id="up"
              v-if="scope.$index!=0"
              @click="handleMoveUp(scope.$index,scope.row)"
            ></i>
          </span>
          <el-button
            size="mini"
            type="text"
            @click="showEdit(scope.$index, scope.row)"
            icon="el-icon-edit"
            style="border:none;"
          >{{ $t('button.edit') }}</el-button>
          <el-button
            size="mini"
            @click="deleteBanner(scope.$index, scope.row)"
            type="text"
            icon="el-icon-delete"
            style="border:none;"
            v-if="bannerCount>=1"
          >{{ $t('button.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="lune_banner">
      <div>
        <ul>
          <li>{{ $t('message.bannerExplain') }}</li>
          <li>{{ $t('message.bannerExplainOne') }}</li>
          <li>{{ $t('message.bannerExplainTwo') }}</li>
          <li v-if="deviceType=='mobile'">{{ $t('message.bannerExplainFour') }}</li>
          <li v-else>
            <span v-if="type==4">3.banner尺寸为840*550，分辨率72dpi，每张大小不超过1M。</span>
            <span v-else>{{ $t('message.bannerExplainThree') }}</span>
            </li>
        </ul>
      </div>
      <!-- <img v-if="type==3 && deviceType!='mobile'||type==4 && deviceType!='mobile'" style="margin-left:40px;" src="./image/banner.png" alt /> -->
    </div>
  </div>
</template>

<script>
import {
  addBanner,
  editBanner,
  deleteBanner,
  changeOne,
  getBannerList,
  moveBanner
} from "@/api/siteSettings/banner";
import upImg from "./upImg";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  props: ["type", "deviceType"],
  components: {
    upImg
  },
  data() {
    return {
      typeStatus:false,
      imgBaseUrl: "//static-tst.wotao.com/",
      numberList: [],
      disbtn: false,
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() < new Date() - 86400000;
        },
        selectableRange: "18:30:00 - 20:30:00",
        step: "00:15"
      },
      timeInfo: null,
      currentSort: "",
      showIndex: 9999,
      showId: "",
      showStatus: false,
      id: "",
      param: new FormData(),
      orinalSort: "",
      file: "",
      hImg: null,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      bannerCount: "",
      switchStatus: false,
      bannerInfo: {
        title: "",
        photo: "",
        dateTime: null,
        linkUrl: "",
        sort: ""
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入banner标题",
            trigger: "blur"
          }
        ],
        sort: [
          {
            required: true,
            message: "请选择序号",
            trigger: "blur"
          }
        ]
      },
      bannerList: []
    };
  },
  methods: {
    // 上移
    handleMoveUp(index, row) {
      var that = this;
      if (index > 0) {
        // 获取当前点击的上一条数据
        const upDate = that.bannerList[index - 1];
        if (this.bannerList) {
          // 移除上一条数据
          that.bannerList.splice(index - 1, 1);
          // 把上一条数据插入当前点击的位置
          that.bannerList.splice(index, 0, upDate);
          setTimeout(this.bannerSort(0, row.id, row.sort,row.number), 500);
        }
      }
    },
    // 下移
    handleMoveDown(index, row) {
      var that = this;
      const downDate = that.bannerList[index + 1];
      that.bannerList.splice(index + 1, 1);
      that.bannerList.splice(index, 0, downDate);
      setTimeout(this.bannerSort(1, row.id, row.sort,row.number), 500);
    },
    bannerSort(num, moveId, sort,number) {
      this.param = {
        moveToken: num, //0 上移 1下移,
        id: moveId,
        sort: sort,
        type: this.type,
        number
      };
      moveBanner(this.param).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: "操作成功！"
          });
          this.getList();
        }
      });
    },
    showInput(row) {
      row.showStatus = true;
      this.showId = row.id;
      this.showStatus = true;
      this.showIndex = 9999;
    },
    //点击修改栏目名称
    submitUpdate(row) {
      let params = {
        type: this.type,
        title: row.title,
        id: row.id
      };
      changeOne(params).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: "修改成功！"
          });
          this.getList();
          this.showStatus = false;
        }
      });
    },
    changeDate(row) {
      var nowTime = new Date();
      console.log(nowTime.getTime());
      console.log(row.dateList[0].getTime(), "输出待修改时间的对象");
      if (row.dateList[0].getTime() - nowTime.getTime() < 5 * 60 * 1000) {
        this.$message({
          type: "warning",
          message: "时间可选范围为当前时间+5分钟~未来时间"
        });
      } else {
        let params = {
          type: this.type,
          startTime: this.$moment(row.dateList[0]).format("YYYY-MM-DD HH:mm"),
          endTime: this.$moment(row.dateList[1]).format("YYYY-MM-DD HH:mm"),
          id: row.id
        };
        changeOne(params).then(res => {
          if (res.data.code == CodeMsg.CODE_1000) {
            this.$message({
              type: "success",
              message: "修改成功！"
            });
            this.getList();
          } else if (res.data.code == CodeMsg.CODE_1000) {
            this.$message({
              type: "warning",
              message: res.data.data
            });
            this.getList();
          }else{
            this.$message({
              type: "warning",
              message: res.data.data
            });
          }
        });
      }
    },
    changeSwitch(row) {
      console.log(row, "输出待修改值");
      let params = {
        type: this.type,
        id: row.id,
        number: row.number,
        status: row.statusBoo == true ? 1 : 2,
        number:row.number
      };
      changeOne(params).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: "修改成功！"
          });
          this.getList();
        } else if (res.data.code == CodeMsg.CODE_2004) {
          this.$message({
            type: "warning",
            message: res.data.data,
            offset: 300
          });
          this.getList();
        }
      });
    },
    changeSort(val) {
      console.log(val, "输出sort");
      this.currentSort = val;
    },
    getList() {  
      getBannerList(this.type).then(res => {
       if(res.data.code == CodeMsg.CODE_1000){
          this.bannerList = res.data.data;
          this.bannerCount = res.data.data.length;
          this.bannerList.forEach(item => {
          item.showStatus = false;
          if (item.token == 0) {
            if (item.startTime !== null && item.endTime !== null) {
              item.dateList = [];
              item.dateList.push(new Date(item.startTime));
              item.dateList.push(new Date(item.endTime));
            }
          } else {
            item.dateList = null;
          }
        });
        console.log(this.bannerList, "输出bannerList");
       }
      });
    },
    cancel() {
      this.bannerInfo = {
        photo: "",
        dateTime: null,
        linkUrl: "",
        title: "",
        sort: ""
      };
      this.file = "";
      this.dialogFormVisible = false;
      this.dialogFormVisible2 = false;
    },
    changeTime(val) {
      console.log(val);
      var nowTime = new Date();
      console.log(nowTime.getTime());
      console.log(val[0].getTime(), "输出待修改时间的对象");
      if (val[0].getTime() - nowTime.getTime() < 5 * 60 * 1000) {
        this.$message({
          type: "warning",
          message: "时间可选范围为当前时间+5分钟~未来时间"
        });
        this.disbtn = true;
      } else {
        this.disbtn = false;
      }
    },
    showBanner() {
      this.typeStatus = false
      this.disbtn = false;
      if (this.bannerCount >= 10) {
        this.$message({
          type: "warning",
          message: "banner最多添加10条"
        });
      } else {
        this.bannerInfo.sort = "";
        this.dialogFormVisible = true;
        if (this.bannerList && this.bannerList.length <= 9) {
          this.bannerInfo.sort = this.bannerList.length + 1;
        }
      }
    },
    showEdit(index, row) {
      this.typeStatus = true
      this.disbtn = false;
      console.log(row, "输出编辑对象");
      this.id = row.id;
      this.bannerInfo.title = row.title;
      this.bannerInfo.photo = this.imgBaseUrl + row.photoUrl;
      this.orinalSort = "";
      this.orinalSort = row.sort;
      this.bannerInfo.sort = row.sort;
      if (row.linkUrl !== "undefined") {
        this.bannerInfo.linkUrl = row.linkUrl;
      } else {
        this.bannerInfo.linkUrl = "";
      }

      if (row.dateList) {
        this.bannerInfo.dateTime = row.dateList;
      } else {
        this.bannerInfo.dateTime = null;
      }
      this.dialogFormVisible2 = true;
    },
    addBanner() {
      this.$refs["bannerInfo"].validate(val => {
        if (val) {
          if (this.file !== "") {
            this.param = new FormData();
            this.param.append("type", this.type);
            this.param.append("title", this.bannerInfo.title);
            this.param.append("photo", this.file, this.file.name);
            this.param.append("sort", this.bannerInfo.sort);
            this.param.append("linkUrl", this.bannerInfo.linkUrl);
            if (this.bannerInfo.dateTime !== null) {
              this.param.append(
                "startTime",
                this.$moment(this.bannerInfo.dateTime[0]).format(
                  "YYYY-MM-DD HH:mm"
                )
              );
              this.param.append(
                "endTime",
                this.$moment(this.bannerInfo.dateTime[1]).format(
                  "YYYY-MM-DD HH:mm"
                )
              );
            }
            addBanner(this.param).then(res => {
              if (res.data.code == CodeMsg.CODE_1000) {
                this.$message({
                  type: "success",
                  message: "添加成功！"
                });
                this.getList();
                this.cancel();
              } else if (res.data.code == CodeMsg.CODE_2004) {
                this.$message({
                  type: "warning",
                  message: res.data.data
                });
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: "上传图片不能为空！",
              offset: 300
            });
          }
        }
      });
    },
    editBanner(row) {
      console.log(row, "输出对象");
      this.$refs["bannerInfo"].validate(val => {
        if (val) {
          this.param = new FormData();
          this.param.append("number", row.number);
          this.param.append("type", this.type);
          this.param.append("id", this.id);
          this.param.append("beforeSort", this.orinalSort);
          this.param.append("title", this.bannerInfo.title);
          if (this.file !== "") {
            this.param.append("photo", this.file, this.file.name);
          }

          this.param.append("sort", this.bannerInfo.sort);
          this.param.append("linkUrl", this.bannerInfo.linkUrl);
          if (this.bannerInfo.dateTime !== null) {
            this.param.append(
              "startTime",
              this.$moment(this.bannerInfo.dateTime[0]).format(
                "YYYY-MM-DD HH:mm"
              )
            );
            this.param.append(
              "endTime",
              this.$moment(this.bannerInfo.dateTime[1]).format(
                "YYYY-MM-DD HH:mm"
              )
            );
          }

          editBanner(this.param).then(res => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "修改成功！"
              });
              this.getList();
              this.cancel();
            } else if (res.data.code == CodeMsg.CODE_2004) {
              this.$message({
                type: "warning",
                message: res.data.data
              });
            }else{
              this.$message({
                type: "warning",
                message: res.data.data
              });
            }
          });
        }
      });
    },
    deleteBanner(index, row) {
      this.$confirm(this.$t("label.confirmDelete"), this.$t("message.tips"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: row.id,
            sort: row.sort,
            number: row.number,
            type: this.type
          };
          deleteBanner(params).then(res => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              this.getList();
            }
          });
        })
        .catch(() => {
          this.getList();
        });
    },
    changeImage(imgUrl) {
      let imgFile = this.base64ImgtoFile(imgUrl);
      this.file = imgFile;
      console.log("处理过的图片" + "hImg");
      console.log(this.file);
      this.bannerInfo.photo = imgUrl;
    },
    base64ImgtoFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      });
    },
    switch() {
       if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
    createSortList() {
      this.numberList = [];
      for (let i = 1; i <= 10; i++) {
        let obj = {
          label: i,
          value: i
        };
        this.numberList.push(obj);
      }
    }
  },
  mounted() {
    this.switch();
    this.createSortList();
    this.getList();
  }
};
</script>

<style>
.banner {
  padding-top: 20px;
  padding-bottom: 100px;
  background: #fff;
}
.banner_img {
  display: inline-block;
  height: 110px;
  width: 200px;
}
.banner_head {
  display: flex;
  align-items: center;
}
ul,
li {
  list-style: none;
}
li {
  font-size: 14px;
  color: #666666;
}
.el-image-viewer__close {
  background: rgba(225, 225, 225, 1);
}
#up:hover {
  color: #409eff;
}
#down:hover {
  color: #409eff;
}
.lune_banner {
  display: flex;
  flex-direction: column;
  margin-left: -40px;
}
</style>