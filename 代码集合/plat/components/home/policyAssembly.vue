<template>
 
  <div class="frame">
    <!-- 卧涛问答 -->
    <div class="troubleshooting" :class="{'teshuya':show==1}">
        <!-- 导航 -->
        <div class="policyNav"  @click="more">
             <img
                src="~assets/images/last/ynjd_icon@2x.png"
                alt=""
                width="20"
                height="20"
                style="margin-right:5px;cursor: pointer;"
            />
            <div class="notice">卧涛问答</div>
            <p class="des">为您解答项目申报过程中的难点</p>
            <div class="more">
                更多&nbsp;
              <img
                  src="~assets/images/last/newicon_right_arrow@2x.png"
                  alt=""
                  width="14"
                  height="14"
                  style="margin-right:5px;cursor: pointer;"
                />
              </div>
        </div>
      <div class="trouble-content">
        <div class="showask">
           <!-- 项目申报 -->
           <div style="flex:1">
               <span class="bord"></span>
               <span class="t">项目申报</span>
              <!-- <div class="projectImg" :class="{'smallprojectImg':show==1}">
                  <p class="ta">
                    <span>项目申报</span>
                    <span style="font-size: 14px;font-weight: 400;">PROJECT DECLARATION</span>
                   </p>
                  <p class="tb">为您解答项目申报过程中的难点</p>
              </div> -->
              <div style="margin-left:20px;">
                <div
                v-for="(item, index) in firstAnswerList"
                :key="index"
                style="margin:13px 0 15px 0"
              >
                <div class="askcontent">
                  <div style="display:flex;align-items: center;">
                    <div class="circle" />
                    <p class="yiban" :class="{'otheryiban':show==1}" style="cursor: pointer;margin-left:7px" @click="goDetail(item.number)">
                      {{ item.title }}
                    </p>
                  </div>
                </div>
              </div>
              </div>
           </div>
          
          <!-- 知识产权 -->
          <div style="margin-left:15px;flex:1">
               <span class="bord"></span>
               <span class="t">知识产权</span>
             <!-- <div class="zhichanImg" :class="{'smallzhichanImg':show==1}">
                 <p class="ta">
                    <span>知识产权</span>
                    <span style="font-size: 14px;font-weight: 400;">IBTELLECTUAL PROPERTY RIGHT</span>
                   </p>
                  <p class="tb">加强知识产权运用与保护</p>
             </div> -->
             <div style="margin-left:20px">
               <div
                v-for="(item, index) in secondAnswerList"
                :key="index"
                style="margin:13px 0 15px 0"
              >
                <div class="askcontent">
                  <div style="display:flex;align-items: center;">
                  <div class="circle" />
                    <p class="yiban" :class="{'otheryiban':show==1}" style="cursor: pointer;margin-left:7px" @click="goDetail(item.number)">
                      {{ item.title }}
                    </p>
                  </div>
                </div>
              </div>
             </div>
         </div>
        </div>
      </div>
    </div>
     <!-- 政策汇编 -->
    <div class="assembly" v-if="show==1">
        <!-- 导航 -->
        <div class="newpolicyNav" @click="toMore">
            <img
                src="~assets/images/last/tzgg_icon@2x.png"
                alt=""
                width="20"
                height="20"
                style="margin-right:5px;cursor: pointer;"
            />
            <div class="notice">政策汇编</div>
            <p class="des">专业项目客服为您解答</p>
            <div class="more">
                更多&nbsp;
              <img
                  src="~assets/images/last/newicon_right_arrow@2x.png"
                  alt=""
                  width="14"
                  height="14"
                  style="margin-right:5px;cursor: pointer;"
                />
              </div>
        </div>
       
      <div class="right-box">
        <div class="time-class">
          <div class="title-list">
            <div
              v-for="(item, index) in AssemblyList"
              :key="index"
              style="display:flex;justify-content: space-between;align-items: center;margin:16px 0 15px 0"
            >
              <div
                style="display:flex;justify-content: space-between;align-items: center;"
              >
                <span
                  style="
                width: 8px;
                height: 8px;
                background: #f97700;
                border-radius: 50%;
                opacity: 1;
                display: inline-block;
              "
                ></span>
                <p
                  class="over"
                  @click="toAssembly(item.number)"
                >
                  {{ item.title }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          style="height: 80%; border-left: 1px dashed #cecece; margin-top: 30px"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAssembly, getAnswer } from "@/api/home";
export default {
  data() {
    return {
      assemblyList: [],
      firstAnswerList: [],
      secondAnswerList: [],
      firstName: "",
      secondName: "",
      leftName: "",
      rightName: "",
      AssemblyList: [],
      leftId: "",
      rightId: "",
      leftClassSetNumber: "",
      rightClassSetNumber: "",
      show: 0,
      provinceId:100000
    };
  },
  filters: {
    clearTag(val) {
       return val.replace(/&ldquo;/ig,'"').replace(/&rdquo;/ig,'"').replace(/<[^>]+>|&[^>]+;\s*/g, "");
    }
  },
  methods: {
    // 跳转政策汇编列表
    toMore(){
      this.$router.push({
        name: "index-policy-assembly"
      });
    },
   more(){
      this.$router.push({
        name: "index-policy-troubleshooting"
      });
    },
    //跳转政策汇编列表
    // more(data) {
    //   if (data == 1) {
    //     var optionsName = this.leftId;
    //     var classSetNumber = this.leftClassSetNumber;
    //   } else {
    //     var optionsName = this.rightId;
    //     var classSetNumber = this.rightClassSetNumber;
    //   }
    //   this.$router.push({
    //     name: "index-policy-assembly",
    //     query: {
    //       optionsNo: optionsName,
    //       classSetNumber: classSetNumber
    //     }
    //   });
    // },
    //跳转政策汇编详情
    toAssembly(number) {
      var id = number + 1 + 1;
      window.open("/policy/" + id);
    },
    // 跳转至卧涛问答列表
    toTroubleList() {
      sessionStorage.setItem("add", "wtClass"); //选中当前浏览的导航栏
      this.$router.push({
        name: "index-policy-troubleshooting"
      });
    },
    //跳转卧涛问答详情
    goDetail(data) {
      window.open("/policy/trouble/" + data + 1);
    },
    getList(positionNo) {
      this.show = 0;
      let para = {
        areaNo: positionNo,
        size: 8
      };
       let newpara = {
        areaNo: positionNo,
        size: 9
      };
       //首页政策汇编列表
      getAssembly(newpara)
        .then(res => {
          if (res.data.data) {
             if(res.data.data.length>=8){
                this.show = 1;
            }else{
                this.show = 0;  // 不显示政策汇编
            }
             this.AssemblyList = res.data.data;
          }
        })
        .catch(err => {
          return err;
        });
      //首页卧涛问答列表
      getAnswer(para)
        .then(res => {
          if (res.data.code == 1000) {
            this.firstName = res.data.data[0].optionName;
            this.secondName = res.data.data[1].optionName;
            if (res.data.data[0].polices) {
              this.firstAnswerList = res.data.data[0].polices;
            }
            if (res.data.data[1].polices) {
              this.secondAnswerList = res.data.data[1].polices;
            }
          }
        })
        .catch(err => {
          return err;
        });
    }
  },
  computed: {
    areaNo() {
      if (this.$store.state.Set_LocationNo !== null) {
        return this.$store.state.Set_LocationNo;
      } else {
        return 100001;
      }
    }
  },
  watch: {
    areaNo(val) {
      if (val !== null) {
        this.getList(val);
      } else {
        this.getList(100000);
      }
    }
  },
  mounted() {
    if (this.$store.state.Set_LocationNo) {
      this.getList(this.$store.state.Set_LocationNo);
    } else {
      this.getList(100000);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import './policyAssembly.styl'
</style>
