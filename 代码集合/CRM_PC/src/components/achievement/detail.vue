<template>
<!-- 排查完成 -->
  <div class="details_frame">
    <div class="header_box">
      <span class="achievement-status">当前状态：{{ this.dataList.status | statusChange }}</span>
      <el-button
        type="primary"
        size="mini"
        style="margin-left:10px;"
        v-show="this.dataList.status===2"
        @click="onSale()"
      >上架</el-button>
      <el-button
        type="warning"
        size="mini"
        v-show="this.dataList.status===1"
        @click="offSale()"
      >下架</el-button>
      <el-button
        type="warning"
        size="mini"
        v-show="this.dataList.status===1 || this.dataList.status===2 "
        @click="delAchievement()"
      >删除</el-button>
      <el-button
        type="primary"
        size="mini"
        v-show="this.dataList.status===1 || this.dataList.status===2"
        @click="edit()"
      >编辑成果信息</el-button>
    </div>
    <!-- 编辑 -->
    <div v-if="isEditor">
      <achievement-editor :id="achievementId" :isEditor.sync="isEditor"></achievement-editor>
    </div>
    <!-- 详情 -->
    <div v-else>
      <div class="spa">
        <span>成果信息</span>
      </div>
      <table class="tables" style="border-collapse:collapse;">
          <tr>
            <td class="t1">成果名称</td>
            <td class="t2">{{dataList.achievementName}}</td>
          </tr>
          <tr>
            <td class="t1">成果编号</td>
            <td class="t2">
                {{dataList.achievementNo}}
            </td>
          </tr>
          <tr>
            <td class="t1">发布人</td>
            <td class="t2">
              <div v-if="dataList.sourceUser===0">{{dataList.sourceUser |sourceUser}}</div>
              <div v-else>{{dataList.sourceUser |sourceUser}}({{dataList.userVO.name}}-{{dataList.userVO.number}})</div>
            </td>
          </tr>
          <tr>
            <td class="t1">交易价格</td>
            <td class="t2">
              <div v-if="dataList.priceType===0">{{dataList.tradePrice | tradePrice()}}万元</div>
              <div v-else>面议</div>
            </td>
          </tr>
          <tr>
            <td class="t1">交易方式</td>
            <td class="t2">
              <span>{{dataList.tradeTypeTxt}}</span>
            </td>
          </tr>
          <tr>
            <td class="t1">技术类型</td>
            <td class="t2">{{dataList.technologyTypeTxt}}</td>
          </tr>
          <tr>
            <td class="t1">行业分类</td>
            <td class="t2">
              <span>{{dataList.industryTxt}}&nbsp;</span>
            </td>
          </tr>
          <tr>
            <td class="t1">成熟度</td>
            <td class="t2">{{dataList.maturity | maturity}}</td>
          </tr>
          <tr>
            <td class="t1">所在地</td>
            <td class="t2">{{dataList.areaTxt}}</td>
          </tr>
          <tr>
            <td class="t1">更新时间</td>
            <td class="t2">{{dataList.updateTime}}</td>
          </tr>
          <tr>
            <td class="t1">图片资料</td>
            <td class="t2" style="display:flex;min-height:51px;">
              <div
                v-for="(item,index) in dataList.coverUrls"
                :key="index"
                style="margin-left:10px;"
              >
                <el-popover placement="top" trigger="hover">
                    <img :src="imgSrc+item.picture" style="width:450px;height:350px;" v-if="dataList.coverUrls[0] && dataList.coverUrls[0].picture.match(/icon/)" />
                    <img :src="yagu_ImgSrc+item.picture" style="width:450px;height:350px;" v-else/>
                    <img
                      slot="reference"
                      v-if="dataList.coverUrls[0] && dataList.coverUrls[0].picture.match(/icon/)"
                      :src="imgSrc+item.picture"
                      style="width:100px;height:100px;"
                    />
                    <img
                      v-else
                      slot="reference"
                      :src="yagu_ImgSrc+item.picture"
                      style="width:100px;height:100px;"
                    />
                </el-popover>
                <p v-if="item.status===0" style="padding-left:20px;line-height:3px">(仅审核)</p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="t1">技术摘要</td>
            <td class="t2" v-html="dataList.technologyAbstract"></td>
          </tr>
          <tr>
            <td class="t1">技术描述</td>
            <td class="t2" v-html="dataList.technicalDesc"></td>
          </tr>
          <tr>
            <td class="t1">浏览量/收藏量</td>
            <td class="t2">浏览量{{dataList.scanNumber}} / 收藏量{{dataList.collectionNumber}}</td>
          </tr>
      </table>
    </div>
    <el-dialog
        title="改派"
        :visible.sync="reassignDialog"
        width="30%"
        :close-on-click-modal="false"
    >
      <el-form
        :model="reassignmentForm"
        ref="reassignmentForm"
        :rules="rulesForm"
        label-width="120px"
      >
        <el-form-item label="当前人员：">{{this.dataList.brokerName}}({{this.dataList.brokerNo}})</el-form-item>
        <el-form-item label="新指派人员：" prop="newStaff">
          <el-cascader
            :options="chargeList"
            placeholder="请选择"
            ref="myCascader"
            v-model="reassignmentForm.newStaff"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="改派备注：">
          <el-input type="textarea" :rows="5" v-model="reassignmentForm.ReassignNote" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeStaff()">确 定</el-button>
        <el-button @click="reassignDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import achievementEditor from '@/views/project/technical-result/achievement-create.vue';
import { getDetails,onlydelAchievement } from "@/api/achievement/index";
import achievementData from './achievementJs/index.js';
import {receivePrice} from '@/util/price.js';
import { mapGetters } from 'vuex';
export default {
    components: {
      achievementEditor,  
    },
    data() {
      return {
        isEditor:false,
        imgSrc: process.env.VUE_APP_IMAGE_BASEURL,
        yagu_ImgSrc: process.env.VUE_APP_YAGU_IMAGE_BASEURL,
        achievementId: "",
        memberStatus: "",
        joinStatus: "",
        dataList: {},
        userData: [],
        chargeList:[],
        reassignDialog: false,
        reassignmentForm: {},
        emplyeesList: {},
        rulesForm: {
          newStaff: [
            {
              required: true,
              message: "请选择洗指派人员",
              trigger: "change"
            }
          ]
        },
        changeList: []
      };
    },
    filters: {
      sourceUser(value) {
        if (value === 0) {
          var sourceUser = "用户";
        } else if (value === 1) {
          var sourceUser = "后台";
        } else {
          var sourceUser = "未知";
        }
        return sourceUser;
      },
      maturity(value) {
        return achievementData.maturity(value);
      },
      statusChange(value) {
        return achievementData.statusChange(value);
      },
      tradePrice(value){
        return receivePrice(value,2);
      }
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    created() {
      this.achievementId = this.$route.query.achievementId;
      this.isEditor = this.$route.query.status==1?true:false;
    },
    methods: {
      onSale(row){
        let param = new FormData();
        param.append('id', this.achievementId);
        param.append('no', this.dataList.achievementNo);
        achievementData.onSaleProduct(param).then(res=>{
          this.getAchievementDetail();
        })
      },
      offSale(row){
        let param = {
          id: this.achievementId,
          no:this.dataList.achievementNo
        }
        achievementData.offSaleProduct(param).then(res=>{
          this.getAchievementDetail();
        })
      },
      delAchievement(row){
        this.idList = [this.achievementId];
        let param = {
          ids: this.idList.join(','),
          nos:this.dataList.achievementNo
        }
        onlydelAchievement(param).then(res=>{
          this.getAchievementDetail();
        })
      },
      toBatch(){
        this.$confirm('改派后，当前订单或产品下的员工的待处理流程会一起被改派，是否确认改派',{
          type:'warning',
          cancelButtonClass: 'btn-custom-cancel',
        }).then(()=>{
          this.reassignDialog = true;
        }).catch(()=>{

        })
      },
      checkOrder() {
        window.open(
          "/resultOrderList?achievementNo=" +
          this.dataList.achievementNo +
          "&achievementName=" +
          this.dataList.achievementName
        );
      },
      changeStaff() {
        this.$refs["reassignmentForm"].validate(valid => {
          if(valid){
            let param = {
              id: this.dataList.id,
              brokerNo: this.reassignmentForm.newStaff[1],
              operateNote: this.reassignmentForm.ReassignNote,
              achievementNo: this.dataList.achievementNo
            };
            changeBroker(param).then(res => {
              this.reassignDialog = false;
              this.getList();
              this.$message({
                type: "success",
                message: "成果经纪人改派成功！",
                offset: 300
              });
            })
            .catch(err => {
              return err;
            });
          } else {
            return false;
          }
        });
      },

      edit(row) {
        this.isEditor=true
        // achievementData.addOrEditAchievement(1)
          // if(row.isPop==true){
          //     this.$confirm('该成果当前已有客户下单，未经双方客户允许请勿编辑。是否确认编辑？',{
          //         confirmButtonText: "确定",
          //         cancelButtonText: "取消",
          //         cancelButtonClass: "btn-custom-cancel",
          //         type: "warning"
          //     }).then(()=>{
          //         this.$router.push({
          //             path: "/edit",
          //             query: {
          //                 editStatus: 2,
          //                 achievementNo: this.dataList.achievementNo
          //             }
          //         });
          //     }).catch(()=>{
          //         console.log('cancled');
          //     })
          // }else{
          //     this.$router.push({
          //         path: "/edit",
          //         query: {
          //             editStatus: 2,
          //             achievementNo: this.dataList.achievementNo
          //         }
          //     });
          // }
          
      },

      // getemployees() {
      //   let param = {
      //       departmentNo: this.dataList.departmentNo,
      //       brokerNo: this.dataList.brokerNo
      //   };
      //   getEmployeesByDepartment(param)
      //       .then(res => {
      //           this.emplyeesList = res.data;
      //       })
      //       .catch(err => {
      //           console.log(error);
      //       });
      // },
      getAchievementDetail() {
        let param = new FormData();
        param.append('id',this.achievementId);
        getDetails(param).then(res => {
          this.dataList = res.data.data;
          // if (res.data.coverId === -1) {
          //     this.dataList.images.push({
          //         imgUrl: res.data.coverUrl
          //     });
          // }
          // let tempVal = parseFloat(
          //     this.dataList.tradePrice / 1000000
          // ).toFixed(3);
          // let realVal = tempVal.substring(0, tempVal.length - 1);
          // this.dataList.tradePrice = realVal;
          // if (res.data.user) {
          //     this.userData = [res.data.user];
          // }
          // this.joinStatus = res.data.joinStatus;
          // this.memberStatus = res.data.memberStatus;
        }).catch(err => {

        });
        // getEmployeesOption().then(res => {
        //   this.chargeList = res.data;
        // }).catch(err => {
        //     console.log(err);
        // });
      }
    },
    mounted() {
      this.getAchievementDetail()
    }
};
</script>

<style>
.details_frame {
  min-width: 960px;
}
.header_box {
  width: 100%;
  height: 70px;
  padding-top: 15px;
}
.spa {
  padding-left: 15px;
  border-left: 5px solid #3d85dc;
  font-size: 16px;
  margin: 20px 0;
}
.tables {
  min-width: 960px;
  margin: 30px 0;
  color: #666;
}
.t1 {
  font-size: 14px;
  padding: 5px 5px;
  line-height: 40px;
  width: 300px;
  text-align: center;
  border: 1px solid lightgrey;
  padding-right: -10px;
  font-weight: bold;
}
.t2 {
  padding: 5px 5px;
  /* line-height:20px; */
  font-size: 14px;
  border: 1px solid lightgrey;
}
.info {
  margin: 30px;
}
.achievement-status{
  font-weight: 550;
}
</style>