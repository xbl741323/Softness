<template>
  <div :class="['box', isDeleted ? '' : 'paddingtop']">
    <!-- <client-only> -->
    <div class="project-detail" v-if="isDeleted">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            style="cursor: pointer"
            @click.native="toHome()"
            >{{ $t("txt.home") }}</el-breadcrumb-item
          >
          <el-breadcrumb-item
            style="cursor: pointer"
            @click.native="toProject()"
            >{{ $t("txt.projectApplication") }}</el-breadcrumb-item
          >
          <el-breadcrumb-item style="color: #36a6fe">{{
            $t("txt.projectDetails")
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="project_box">
        <div class="left">
          <div class="head_box">
            <div class="left_box">
              <Carousel
                :coverUrls="detailData.coverUrls"
                v-if="detailData.coverUrls && detailData.coverUrls.length > 0"
              />
              <template v-else-if="detailData.oldcoverUrls">
                <Carousel :coverUrls="detailData.oldcoverUrls" />
              </template>
            </div>
            <div class="right_box">
              <p class="project_title">{{ this.detailData.title }}</p>
              <p class="project_introduction">{{ this.detailData.slogan }}</p>
              <div class="quickflex">
                <div class="quick">快速响应</div>
                <div class="quick">专业代理</div>
                <div class="quick">品质服务</div>
                <div class="quick">无忧售后</div>
              </div>
              <div class="project_online">
                <div class="price">
                  <div class="pricedetail">
                    <!-- 定金+尾款+原价 -->
                    <template
                      v-if="
                        detailData.nowFee &&
                        detailData.earnestMoney &&
                        detailData.previousFee
                      "
                    >
                      <div class="comprehensive">
                        <div class="mt">
                          <div><span class="word">定金</span></div>
                          <div>
                            <span class="word_a">￥</span
                            ><span class="priceword">{{
                              detailData.earnestMoney | filterPrice
                            }}</span>
                          </div>
                        </div>
                        <div class="weikuan_b">
                          <div><span class="weikuan">尾款</span></div>
                          <div>
                            <span class="weikuan_a">￥</span
                            ><span class="priceword">{{
                              handelWeikuan(
                                detailData.earnestMoney,
                                detailData.nowFee
                              )
                            }}</span>
                          </div>
                        </div>
                        <div class="del_a">
                          {{
                            handelWeikuan(
                              detailData.earnestMoney,
                              detailData.previousFee
                            )
                          }}
                        </div>
                      </div>
                    </template>
                    <!-- 定金+原价 -->
                    <template
                      v-else-if="
                        detailData.earnestMoney && detailData.previousFee
                      "
                    >
                      <div class="mt_a">
                        <span class="weikuan">定金</span>
                        <span class="weikuan_a">￥</span
                        ><span class="priceword">{{
                          detailData.earnestMoney | filterPrice
                        }}</span>
                        <span class="weikuan">原价</span>
                        <span class="weikuan_a">￥</span
                        ><span class="priceword">{{
                          detailData.previousFee | filterPrice
                        }}</span>
                      </div>
                    </template>
                    <!-- 定金+尾款 -->
                    <template
                      v-else-if="detailData.earnestMoney && detailData.nowFee"
                    >
                      <span class="weikuan">定金</span>
                      <span class="weikuan_a">￥</span
                      ><span class="priceword">{{
                        detailData.earnestMoney | filterPrice
                      }}</span>
                      <span class="weikuan">尾款</span>
                      <span class="weikuan_a">￥</span
                      ><span class="priceword">{{
                        handelWeikuan(
                          detailData.earnestMoney,
                          detailData.nowFee
                        )
                      }}</span>
                    </template>
                    <!-- 现价+原价 -->
                    <template
                      v-else-if="detailData.nowFee && detailData.previousFee"
                    >
                      <span class="weikuan">服务费</span>
                      <span class="weikuan_a">￥</span
                      ><span class="priceword">{{
                        detailData.nowFee | filterPrice
                      }}</span>
                      <span class="del_a">{{
                        detailData.previousFee | filterPrice
                      }}</span>
                    </template>
                    <!-- 现价 -->
                    <template v-else-if="detailData.nowFee">
                      <span class="weikuan">服务费</span
                      ><span class="weikuan_a">￥</span
                      ><span class="mianyi"></span
                      ><span class="priceword">{{
                        detailData.nowFee | filterPrice
                      }}</span>
                    </template>
                    <!-- 原价 -->
                    <template v-else-if="detailData.previousFee">
                      <span class="weikuan">原价</span
                      ><span class="weikuan_a">￥</span
                      ><span class="mianyi"></span
                      ><span class="priceword">{{
                        detailData.previousFee | filterPrice
                      }}</span>
                    </template>
                    <!-- 定金 -->
                    <template v-else-if="detailData.earnestMoney">
                      <span class="weikuan">定金</span
                      ><span class="weikuan_a">￥</span
                      ><span class="mianyi"></span
                      ><span class="priceword">{{
                        detailData.earnestMoney | filterPrice
                      }}</span>
                    </template>
                    <!-- 面议 -->
                    <template v-else>
                      <span class="weikuan">服务费</span
                      ><span class="weikuan_a">￥</span
                      ><span class="mianyi">面议</span>
                    </template>
                  </div>
                </div>
                <div class="area" v-if="detailData.categories">
                  <div
                    v-for="item in detailData.categories.slice(0, 2)"
                    :key="item.name"
                    class="areaitem"
                  >
                    <span>{{ item.name }}</span>
                    <span class="under">{{ item.optionName }}</span>
                  </div>
                </div>
              </div>
              <!-- 官费代缴 -->
              <template
                v-if="
                  detailData.policyGovfeeTypeList &&
                  detailData.policyGovfeeTypeList.length > 0
                "
              >
                <div class="guan">
                  <div class="guanwidth">
                    <span style="font-weight: bold">官费代缴</span
                    ><span class="ask" @click="dialogVisible = true">?</span>
                  </div>
                  <div
                    :class="[
                      'item',
                      detailData.isDefault == 1 ? 'activeborder' : '',
                    ]"
                    v-for="(
                      detailData, index
                    ) in detailData.policyGovfeeTypeList"
                    :key="index"
                    @click="changeDefault(index)"
                  >
                    <div class="duo">
                      {{ detailData.typeName
                      }}<span
                        class="typeFee_price"
                        :class="detailData.isDefault == 1 ? 'activeprice' : ''"
                        >¥{{ Number(detailData.typeFee / 100) }}</span
                      >
                    </div>
                    <img
                      v-if="detailData.isDefault == 1"
                      :src="require('@/assets/images/shop/dui_icon@2x.png')"
                      class="gou"
                      alt=""
                    />
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="service">
                  <span style="font-weight: bold">增值服务：</span
                  ><span>免费规划、相关专业培训课程</span>
                </div>
              </template>
              <div class="intro_three_content">
                <span
                  class="intro_img_icon"
                  v-for="(item, index) in imgList"
                  :key="index"
                >
                  <img :src="item.imgUrl" alt="" />
                  <span>{{ item.title }}</span>
                </span>
              </div>
              <div></div>
              <template v-if="detailData.isOnline == 1">
                <div class="consult">
                  <div class="xiadan">
                    <img
                      src="~assets/images/shop/xiadan_icon@2x.png"
                      width="20"
                      height="20"
                    />
                    <span class="aaa" style="color: #ffffff" @click="toPay()"
                      >立即下单</span
                    >
                  </div>
                  <div
                    class="shoucang"
                    v-if="collectId !== 0"
                    @click="collect(1)"
                  >
                    <img
                      src="~assets/images/shop/icon_Collection@2x.png"
                      width="20"
                      height="20"
                    />
                    <span class="aaa">加入收藏</span>
                  </div>
                  <div class="shoucang" v-else @click="collect(2)">
                    <img
                      src="~assets/images/shop/add_Collection@2x.png"
                      width="20"
                      height="20"
                    />
                    <span class="bbb">已收藏</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="consult">
                  <div class="contactImg" @click.stop="showQia()">
                    <img
                      src="~assets/images/shop/zixun_icon@2x.png"
                      width="20"
                      height="20"
                    />
                    <span class="aaa" style="color: #ffffff">立即咨询</span>
                  </div>
                  <div
                    class="shoucang"
                    v-if="collectId != 0"
                    @click="collect(1)"
                  >
                    <img
                      src="~assets/images/shop/icon_Collection@2x.png"
                      width="20"
                      height="20"
                    />
                    <span class="aaa">加入收藏</span>
                  </div>
                  <div class="shoucang" v-else @click="collect(2)">
                    <img
                      src="~assets/images/shop/add_Collection@2x.png"
                      width="20"
                      height="20"
                    />
                    <span class="bbb">已收藏</span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="content">
            <div class="article">
              <div :class="[fixed == true ? 'position-fixed' : '']">
                <div
                  class="introdution"
                  :class="[fixed == true ? 'fixed-width' : '']"
                >
                  <span
                    class="actived ml"
                    @click="handleClick('first')"
                    :class="{ activeSty: activeId == 'first' }"
                    >项目详情
                    <span class="triangle" v-if="activeId == 'first'"></span>
                  </span>
                  <span
                    class="actived"
                    @click="handleClick('second')"
                    :class="{ activeSty: activeId == 'second' }"
                    >项目参数
                    <span class="triangle" v-if="activeId == 'second'"></span>
                  </span>
                  <span
                    class="actived"
                    @click="handleClick('third')"
                    :class="{ activeSty: activeId == 'third' }"
                    >售后保障

                    <span class="triangle" v-if="activeId == 'third'"></span>
                  </span>
                  <div
                    v-if="fixed == true"
                    class="fixcontactImg"
                    @click.stop="showQia()"
                  >
                    <img
                      src="~assets/images/shop/zixun_icon@2x.png"
                      width="20"
                      height="20"
                    />
                    <span class="aaa" style="color: #ffffff">立即咨询</span>
                  </div>
                </div>
              </div>
              <!-- 项目介绍 -->
              <div id="header">
                <project-introduction
                  :projectContent="detailData"
                ></project-introduction>
              </div>
              <!-- 项目参数 -->
              <div id="center">
                <server-process :projectContent="detailData"></server-process>
              </div>
              <!-- 售后保障 -->
              <div id="under">
                <platform-advantage
                  :projectContent="detailData"
                ></platform-advantage>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="recommend">{{ $t("txt.recommendedProject") }}</div>
          <div class="moreProject" @click="toList()">
            {{ $t("txt.more")
            }}<img
              src="~/assets/images/industry/right_jiantou@2x.png"
              class="recimg"
            />
          </div>
          <div
            class="project_List"
            v-for="(item, index) in hotProjectList"
            :key="index"
            @click="toDetail(item.number)"
          >
            <div class="top_box">
              <template v-if="item.coverUrls && item.coverUrls.length > 0">
                <div
                  v-for="(newItem, index) in item.coverUrls"
                  :key="index * 6"
                >
                  <template v-if="newItem.isCover == 1">
                    <img
                      class="recommendImg"
                      :src="imgPath + newItem.url"
                      v-if="
                        newItem.url &&
                        (newItem.url.split('.')[1] == 'jpeg' ||
                          newItem.url.split('.')[1] == 'png' ||
                          newItem.url.split('.')[1] == 'jpg' ||
                          newItem.url.split('.')[1] == 'gif')
                      "
                    />
                    <video
                      class="recommendImg"
                      v-else-if="
                        newItem.spUrl &&
                        newItem.spUrl !== '' &&
                        newItem.spUrl !== null
                      "
                      :poster="imgPath + newItem.spUrl"
                      :src="imgPath + newItem.url"
                    ></video>
                    <video
                      v-else
                      :src="imgPath + newItem.url"
                      class="recommendImg"
                    ></video>
                  </template>
                </div>
              </template>
              <template v-else>
                <img
                  class="recommendImg"
                  :src="imgPath + item.coverUrl"
                  v-if="
                    item.coverUrl &&
                    (item.coverUrl.split('.')[1] == 'jpeg' ||
                      item.coverUrl.split('.')[1] == 'png' ||
                      item.coverUrl.split('.')[1] == 'jpg' ||
                      item.coverUrl.split('.')[1] == 'gif')
                  "
                />
                <video
                  class="recommendImg"
                  :src="imgPath + item.coverUrl"
                  v-if="
                    item.coverUrl &&
                    (item.coverUrl.split('.')[1] == 'mp4' ||
                      item.coverUrl.split('.')[1] == 'avi' ||
                      item.coverUrl.split('.')[1] == 'mov')
                  "
                />
              </template>
            </div>
            <div class="recommendtitle">{{ item.title }}</div>
            <div class="right_btn">
              <!-- <span class="attribute" @click="screening(item)">{{item.optionName}}</span> -->
              <div class="recommendConsult" @click.stop="showQia()">
                {{ $t("txt.immediatelyConsult") }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 官费代缴说明 -->
      <el-dialog :visible.sync="dialogVisible">
        <div style="padding: 10px 40px 40px 30px">
          <p style="text-align: center; color: #36a6fe; font-size: 18px">
            官费收费标准
          </p>
          <br />
          <p>
            官费是国家商标局或知识产权局收取的办理相关商标或专利的费用。下面以专利申请为例，具体见各产品详情中的收费标准
          </p>
          <br />
          <img
            src="https://static.yagu.cn/assets/plat/static/imgs/img/bgm.png"
            width="674px"
            height="420px"
          />
          <br />
          <p>减缓说明:</p>
          <p>可减缴费用</p>
          <p>
            根据《专利收费减缴办法》的规定，专利申请人或者专利权人可以请求减缴下列专利收费︰
          </p>
          <p>(一）申请费(不包括优先权要求费、申请附加费);</p>
          <p>(二）发明专利申请实质审查费;</p>
          <p>(三)年费（自授予专利权当年起十年内的年费）;</p>
          <p>(四)复审费。</p>
          <br />
          <p>专利申请人或专利权人符合下列条件之一的:</p>
          <p>(一)上年度月均收入低于5000元(年6万元)的个人;</p>
          <p>(二)上年度企业应纳税所得额低于100万元的企业;</p>
          <p>(三)事业单位、社会团体、非营利性科研机构;</p>
          <p>
            两个或者两个以上的个人或者单位为共同专利申请人或者共有专利权人的，应当分别符合前款规定。
          </p>
          <br />
          <p>减缴比例</p>
          <p>
            专利申请人或者专利权人为单个个人或者单个单位的，减缴前述收费的85%。
          </p>
          <p>
            两个或者两个以上的个人或者单位为共同专利申请人或者共有专利权人的，减缴前述收费的70%。
          </p>
        </div>
      </el-dialog>
      <!-- 交易信息 -->
      <Transecurity />
      <!-- 上一篇 上一篇 -->
      <div class="last-next">
        <client-only>
          <p v-if="this.last" @click="toLast(last.number)" class="lastone">
            <span style="color: #a8a8a8">{{ $t("txt.lastarticle") }} ></span
            >{{ this.last.title }}
          </p>
          <p v-if="this.next" @click="toLast(next.number)">
            <span style="color: #a8a8a8">{{ $t("txt.nextarticle") }} ></span
            >{{ this.next.title }}
          </p>
        </client-only>
      </div>
    </div>
    <div v-else class="property_no_data">
      <img src="@/assets/images/removed@2x.png" alt="" />
      <p class="remove">抱歉，该产品已下架！</p>
    </div>
    <!-- </client-only> -->
    <el-dialog
      :visible.sync="authDialog"
      width="0px"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog>
    <div v-if="authDialog" class="auth-dialog">
      <img
        class="close-img"
        v-if="mouseOver"
        @mouseover="mouseOver = false"
        src="~/assets/images/xiangmu/guanbi_icon@2x.png"
        @click="authDialog = false"
      />
      <img
        class="close-img"
        v-else
        @mouseleave="mouseOver = true"
        src="~/assets/images/xiangmu/guanbi_icon_bright@2x.png"
        @click="authDialog = false"
      />
      <img
        v-if="userInfo.accountType == 1"
        class="auth-img"
        src="~/assets/images/order/danwei_pic@2x.png"
      />
      <img
        v-else
        class="auth-img"
        src="~/assets/images/order/geren_pic@2x.png"
      />
      <div class="auth-prompt">
        <p class="auth-title">亲爱的客官,</p>
        <p class="auth-content" v-if="userInfo.accountType == 1">
          付款交易前请完成身份认证哦！身份认证审核需要1-2个工作日，审核通过后即可进行付款交易。
        </p>
        <p class="auth-content" v-if="userInfo.accountType == 0">
          付款交易前请完成身份认证哦！自动审核通过后即可进行付款交易。
        </p>
      </div>
      <div class="auth-btn" @click="toAuth()">立即认证</div>
    </div>
  </div>
</template>

<script>
import { getArtcleDetail, addColl, cancelCollect } from "@/api/announcement";
import ProjectIntroduction from "@/components/project/projectIntroduction";
import ServerProcess from "@/components/project/serverProcess";
import PlatformAdvantage from "@/components/project/platformAdvantage";
import Carousel from "@/components/project/rotation";
import Transecurity from "@/components/project/index";
import { getUserInfo } from "@/api/login";
import axios from "axios";
export default {
  scrollToTop: true,
  components: {
    ProjectIntroduction,
    ServerProcess,
    PlatformAdvantage,
    Carousel,
    Transecurity,
  },
  head() {
    return {
      title: this.metaTitle,
      meta: [
        { name: "keywords", content: this.metaKeyword },
        {
          hid: "description",
          name: "description",
          content: this.metaDescription,
        },
      ],
    };
  },
  async asyncData({ params }) {
    if (process.server) {
      try {
        let number = params.projectDetail.substr(
        0,
        params.projectDetail.length - 1
      );
      let id = params.projectDetail.substr(params.projectDetail.length - 1, 1);
      const res = await axios.get(
        process.env.ASYNC_DATA_API +
          "/policy/detail?number=" +
          number +
          "&type=" +
          4 +
          "&token=" +
          id
      );
      if (!res.data || !res.data.data || !res.data.data.detail) {
        return {
          // collectId:-1,
          hotProjectList: {},
          last: {},
          next: {},
          metaTitle: "",
          metaKeyword: "",
          metaDescription: "",
        };
      } else {
        console.log(33);
        if (
          res.data.data.detail.deleted == 1 ||
          res.data.data.detail.showStatus == 2
        ) {
          console.log(12);
          console.log("11111111");
          return {
            isDeleted: true,
            // collectId:res.data.data.isCollected,
            detailData: res.data.data.detail,
            hotProjectList: res.data.data.recommend,
            last: res.data.data.pre,
            next: res.data.data.next,
            metaTitle: res.data.data.detail.metaTitle,
            metaKeyword: res.data.data.detail.metaKeyword,
            metaDescription: res.data.data.detail.metaDescription,
          };
        } else {
          console.log(323);
          return {
            isDeleted: true,
            detailData: res.data.data.detail,
            // collectId:res.data.data.isCollected,
            hotProjectList: res.data.data.recommend,
            last: res.data.data.pre,
            next: res.data.data.next,
            metaTitle: res.data.data.detail.metaTitle,
            metaKeyword: res.data.data.detail.metaKeyword,
            metaDescription: res.data.data.detail.metaDescription,
          };
        }
      }
      }catch(error){
        console.log(error)
      }
    }
  },
  data() {
    return {
      collectId: null,
      authDialog: false,
      mouseOver: true, //鼠标是否悬浮
      fixed: false,
      isDeleted: true,
      imgPath: process.env.CDN_BASE_URL,
      contentImg: "xiangmu/banner_xiangqing_xiangmu@2x.jpg",
      projectNo: "",
      detailData: {},
      hotProjectList: [],
      activeId: "first",
      href: "",
      screenType: "",
      last: {},
      next: {},
      pageViews: "",
      imgList: [
        {
          title: "全程监督",
          imgUrl: require("~/assets/images/xiangmu/icon01_ label_details@2x.png"),
        },
        {
          title: "保障权益",
          imgUrl: require("~/assets/images/xiangmu/icon02_ label_details@2x.png"),
        },
        {
          title: "十年行业经验",
          imgUrl: require("~/assets/images/xiangmu/icon03_ label_details@2x.png"),
        },
      ],
      dialogVisible: false,
      govermentFeeType: "",
      loginStatus: false,
      userInfo: {},
    };
  },
  filters: {
    filterPrice(val) {
      return Number(val) / 100;
    },
  },
  created() {
    this.projectNo = this.$route.params.projectDetail.substr(
      0,
      this.$route.params.projectDetail.length - 1
    );
    this.screenType = this.$route.params.projectDetail.substr(
      this.$route.params.projectDetail.length - 1,
      1
    );
    // this.getDetail();
    this.getUserInfo();
  },
  methods: {
    handelWeikuan(before, now) {
      return (Number(now) - Number(before)) / 100;
    },
    toAuth() {
      this.$router.push({
        path: "/member/authentication",
      });
    },
    toPay() {
      if (this.loginStatus == true) {
        this.$router.push({
          path: "/order/order-pay",
          query: {
            orderType: 1, //0-知识产权 1-项目
            projectNo: this.projectNo,
            screenType: this.screenType,
            govermentFeeType: this.govermentFeeType,
          },
        });
      } else {
        this.$router.push({
          path: "/login",
        });
      }
    },
    getUserInfo() {
      getUserInfo().then((res) => {
        if (res.data.code == 0) {
          this.userInfo = res.data.data;
          this.loginStatus = true;
        } else {
          this.loginStatus = false;
        }
      });
    },
    changeDefault(whichInex) {
      this.govermentFeeType = whichInex;
      this.detailData.policyGovfeeTypeList.forEach((item, index) => {
        if (whichInex === index) {
          item.isDefault = 1;
        } else {
          item.isDefault = 0;
        }
      });
    },
    collect(status) {
      if (!this.userInfo.accountId) {
        this.$router.push({
          path: "/login",
        });
        return;
      }
      let param = {
        accountId: this.userInfo.accountId,
        number: this.projectNo,
        type: 0,
      };
      if (status == 1) {
        //status 1-收藏 2-取消
        addColl(param).then((res) => {
          if (res.data.code == 0) {
            this.getDetail();
            this.$message({
              type: "success",
              message: "收藏成功！",
              offset: 50,
            });
          }
        });
      } else {
        let newparam = {
          accountId: this.userInfo.accountId,
          numbers: [this.projectNo],
        };
        cancelCollect(newparam).then((res) => {
          if (res.data.code == 0) {
            this.getDetail();
            this.$message({
              type: "warning",
              message: "取消收藏成功",
              offset: 50,
            });
          }
        });
      }
    },
    toLast(number) {
      window.open(number + 2);
    },
    screening(data) {
      this.$router.push({
        name: "index-project",
        params: {
          id: data.optionsId,
          classSetNumber: data.classSetNumber,
        },
      });
    },
    toList() {
      this.$router.push({
        path: "/project",
      });
    },
    showQia() {
      window.open(
        "https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2",
        "",
        "height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no"
      );
    },
    toDetail(num) {
      //推荐项目详情
      window.open(num + 2);
    },
    getDetail() {
      let param = {
        number: this.projectNo,
        type: 4,
        screen: this.screenType,
      };
      getArtcleDetail(param)
        .then((res) => {
          if (res.data.code) {
            let data = res.data.data;
            this.collectId = data.isCollected;
            let oldcoverUrls = [];
            if (data.detail && data.detail.coverUrl) {
              oldcoverUrls.push({
                url: data.detail.coverUrl,
              });
              data.detail.oldcoverUrls = oldcoverUrls;
            }
            this.detailData = data.detail;
            if (
              this.detailData.deleted == 1 ||
              this.detailData.showStatus == 2
            ) {
              this.isDeleted = false;
            } else {
              this.isDeleted = true;
            }
            this.hotProjectList = data.recommend;
            this.last = data.pre;
            this.next = data.next;
            this.detailData.policyGovfeeTypeList.forEach((item, index) => {
              //获取默认官费下标
              if (item.isDefault == 1) {
                this.govermentFeeType = index;
              } else {
              }
            });
          }
        })
        .catch((err) => {});
    },
    handleClick(val) {
      if (val === "first") {
        var el = document.getElementById("header");
        if (this.fixed) {
          this.$nextTick(() => {
            window.scrollTo({
              behavior: "smooth",
              top: el.offsetTop - 70,
            });
          });
        } else {
          this.$nextTick(() => {
            window.scrollTo({
              behavior: "smooth",
              top: el.offsetTop - 190,
            });
          });
        }
      } else if (val === "second") {
        var el = document.getElementById("center");
        if (this.fixed) {
          this.$nextTick(() => {
            window.scrollTo({
              behavior: "smooth",
              top: el.offsetTop - 120,
            });
          });
        } else {
          this.$nextTick(() => {
            window.scrollTo({
              behavior: "smooth",
              top: el.offsetTop - 190,
            });
          });
        }
      } else if (val === "third") {
        var el = document.getElementById("under");
        if (this.fixed) {
          this.$nextTick(() => {
            window.scrollTo({
              behavior: "smooth",
              top: el.offsetTop - 120,
            });
          });
        } else {
          this.$nextTick(() => {
            window.scrollTo({
              behavior: "smooth",
              top: el.offsetTop - 190,
            });
          });
        }
      }
      this.activeId = val;
    },
    toHome() {
      window.open("/", "_self");
    },
    toProject(num) {
      window.open("/project/", "_self");
    },
    handleScroll() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 700) {
        this.fixed = true;
      } else {
        this.fixed = false;
      }
    },
    //qq分享
    qqShare() {
      let urlData =
        "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" +
        window.location.href +
        "&sharesource=qzone&title=" +
        this.detailData.metaTitle +
        "&pics=你的分享图片&summary=" +
        this.detailData.metaDescription +
        "";
      window.open(urlData, "_blank");
    },
    //微博分享
    weiboShare() {
      let urlData =
        "http://service.weibo.com/share/share.php?&sharesource=weibo&title=" +
        this.detailData.metaTitle +
        "&url=" +
        window.location.href +
        "&pic=你的分享图片&appkey=1343713053";
      window.open(urlData, "_blank");
    },
  },
  destroyed() {
    //离开该页面需要移除这个监听的事件
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  mounted() {
    // this.getDetail();
    this.href = window.location.href;
    window.addEventListener("scroll", this.handleScroll, true);
  },
};
</script>

<style lang="stylus" scoped>
@import './projectdetail.stylus';

.auth-dialog {
  position: fixed;
  width: 457px;
  height: 440px;
  border-radius: 10px;
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  top: 300px;
  left: 40%;
  z-index: 9999;
  color: #333333;
}

.auth-img {
  width: 457px;
  height: 216px;
  margin-left: -1px;
  margin-top: -12px;
}

.auth-prompt {
  width: 373px;
  margin: 27px 42px;
}

.auth-title {
  font-size: 18px;
  font-weight: 550;
  margin-top: 20px;
}

.auth-content {
  font-size: 14px;
  color: #333333;
  line-height: 25px;
  margin-top: 10px;
}

.auth-btn {
  width: 200px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: 550;
  text-align: center;
  margin: 0 auto;
  background: #1589E5;
  border-radius: 20px;
  color: #FFFFFF;
  margin-top: 40px;
  cursor: pointer;
}

.close-img {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>