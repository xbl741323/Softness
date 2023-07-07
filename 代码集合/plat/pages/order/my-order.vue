<template>
  <div class="my-order">
    <member-head></member-head>
    <div class="my-order-frame">
      <div class="breadcrumb">
        <a @click="jump('/member/order')" class="breadcrumb-first">我的订单</a>
        >
        <a>订单详情</a>
      </div>
      <div class="order-box">
        <div class="order-head">
          <div class="order-info-left">
            <div class="order">
              <p>订单号：{{ orderDetail.orderNo }}</p>
              <img
                src="~assets/images/order/copy_icon@2x.png"
                class="orderNo"
                :data-clipboard-text="orderDetail.orderNo"
                @click="copy()"
              />
            </div>
            <template
              v-if="!orderDetail.refundStatus && orderDetail.orderStatus != 1"
            >
              <p
                :class="
                  orderDetail.orderStatus == 6
                    ? 'order-status pay-cancel'
                    : 'order-status'
                "
              >
                {{ orderDetail.orderStatus | orderStatus }}
              </p>
              <p
                :class="
                  orderDetail.waitingAudit || orderDetail.thirdOrderNo
                    ? 'pay-order pay-order-cancel'
                    : 'pay-order'
                "
                v-if="orderDetail.orderStatus == 0 || ('2,3,4'.includes(orderDetail.orderStatus) && orderDetail.payStatus == 0)"
                @click="orderDetail.waitingAudit || orderDetail.thirdOrderNo ? '' : toPay()"
              >
                去付款
              </p>
              <p v-if="orderDetail.waitingAudit" class="audit">
                对公转账审核中
              </p>
              <p class="notpass" v-if="orderDetail.transferFailure">
                对公转账审核未通过
                <el-tooltip
                  placement="bottom"
                  effect="light"
                  v-if="orderDetail.transferFailure"
                >
                  <div slot="content">
                    <div style="width: 368px">
                      <p
                        style="
                          font-size: 16px;
                          font-weight: 550;
                          color: #333333;
                        "
                      >
                        审核不通过原因：{{ refuseReason }}
                      </p>
                      <p style="font-size: 14px; color: #666666">
                        对公转账审核不通过，您可以点击“付款”按钮，
                        再次提交正确的转账凭证，或选择其他方式付款。
                      </p>
                    </div>
                  </div>
                  <img
                    @mouseover="getReason(orderDetail)"
                    src="~/assets/images/order/wenhao_icon@2x.png"
                  />
                </el-tooltip>
              </p>
              <p
                class="cancel-order"
                v-if="(orderDetail.orderStatus == 0 && !orderDetail.waitingAudit) || orderDetail.orderStatus == 1"
                @click="updateStatus(orderDetail, 6, '取消')"
              >
                取消订单
              </p>
              <p
                class="delte-order"
                v-if="orderDetail.orderStatus == 6"
                @click="updateStatus(orderDetail, 7, '删除')"
              >
                删除订单
              </p>
              <p
                class="ready-tailpay"
                v-if="
                  '2,3'.match(orderDetail.orderStatus) &&
                  orderDetail.tailStatus == 1 &&
                  !orderDetail.waitingAudit
                "
              >
                <img src="~/assets/images/order/tishi@2x.png" />
                您的订单尾款未支付，请尽快付尾款!
              </p>
              <p
                class="hastailpay"
                v-if="
                  orderDetail.orderStatus != 4 &&
                  orderDetail.categoryId == 1 &&
                  orderDetail.tailStatus == 2
                "
              >
                您的订单已经支付尾款!
              </p>
              <p
                :class="[orderDetail.thirdOrderNo ? 'tail-pay bgccc' : 'tail-pay']"
                v-if="
                  '2,3'.match(orderDetail.orderStatus) &&
                  orderDetail.tailStatus == 1 &&
                  !orderDetail.waitingAudit
                "
                @click="orderDetail.thirdOrderNo ? '' :toPay(true)"
              >
                支付尾款￥<span>{{
                  (orderDetail.finalPrice || 0) * orderCount
                }}</span>
              </p>
              <!-- <div class="viewcontract" v-if="'2,3,4'.match(orderDetail.orderStatus) && orderDetail.contractFileName" @click="viewContract()">查看合同</div> -->
            </template>
            <!-- 去签约 -->
            <template
              v-else-if="
                !orderDetail.refundStatus && orderDetail.orderStatus == 1
              "
            >
              <p class="order-status">待签约</p>
              <div class="twoSign">
                <p
                  :class="[orderDetail.thirdOrderNo ? 'gosigncontract pay-order-cancel' : 'gosigncontract']"
                  v-if="
                    orderDetail.orderStatus == 1 &&
                    orderDetail.contractScope == 3 &&
                    (orderDetail.contractType == 1 ||
                      (orderDetail.contractType == 2 &&
                        orderDetail.contractStatus != 2)) && orderDetail.refundStatus != 4
                  "
                  @click="orderDetail.thirdOrderNo ? '' : signPrompt(orderDetail)"
                >
                  更换签约方式
                </p>
                <p
                  v-if="
                    orderDetail.orderStatus == 1 && orderDetail.contractType == 1 && orderDetail.refundStatus != 4
                  "
                  @click="orderDetail.thirdOrderNo ? '' : (userInfo.authorizedType == 2 && userInfo.autType == 2) || (userInfo.autType == 1 && userInfo.certifiedType == 2) ? essAuth(orderDetail, userInfo) : AuthenticationDialog = true"
                  :class="[orderDetail.thirdOrderNo ? 'gosigncontract pay-order-cancel' : 'gosigncontract']"
                >
                  去签约
                </p>
              </div>
              <p
                class="cancel-order"
                style="margin: 5px 0"
                v-if="(orderDetail.orderStatus == 0 && !orderDetail.waitingAudit) || orderDetail.orderStatus == 1"
                @click="updateStatus(orderDetail, 6, '取消')"
              >
                取消订单
              </p>
              <!-- <p v-if="orderDetail.orderStatus == 1 && (orderDetail.contractType == 1 || (orderDetail.contractScope == 3 && orderDetail.contractType == 1 || orderDetail.contractType == 2 && orderDetail.contractStatus !=2))" class="gosigncontract" @click="orderDetail.contractScope == 3 && (orderDetail.contractType == 1 || orderDetail.contractType == 2 && orderDetail.contractStatus !=2) ? signPrompt(orderDetail) : orderDetail.contractType == 1 ?  goSigncontract(0) : ''">{{orderDetail.contractScope == 3 ? '更换签约方式' :'去签约'}}</p> -->
              <!-- <div class="gosigncontract" v-if="orderDetail.orderStatus == 1"  @click="!'1,4'.match(orderDetail.contractStatus) || (orderDetail.contractType == 2 && orderDetail.contractScope !=3 ) ? signPrompt(orderDetail) : goSigncontract(0)">{{orderDetail.contractType == 2 ? "签约中" : "去签约"}}</div> -->
              <p
                v-if="
                  orderDetail.contractType == 2 &&
                  orderDetail.orderStatus == 1 &&
                  orderDetail.contractStatus != 2
                "
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <img
                  src="~/assets/images/order/tishi@2x.png"
                  width="16px"
                  height="16px"
                />&nbsp;待业务经理上传纸质合同
              </p>
              <p
                v-else-if="
                  orderDetail.contractType == 2 &&
                  orderDetail.orderStatus == 1 &&
                  orderDetail.contractStatus == 2
                "
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <img
                  src="~/assets/images/order/tishi@2x.png"
                  width="16px"
                  height="16px"
                />&nbsp;合同正在审核中，有问题请联系业务经理
              </p>
              <div v-else>
                <p
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <img
                    src="~/assets/images/order/tishi@2x.png"
                    width="16px"
                    height="16px"
                  />&nbsp;为了更好地保障您的权益
                </p>
                <p>请您签订线上合同</p>
              </div>
            </template>
            <template v-else-if="orderDetail.orderStatus == 5">
              <p class="order-status">交易关闭</p>
            </template>
            <!-- 退款信息 -->
            <template v-else>
              <template
                v-if="
                  orderDetail.refundStatus == 1 ||
                  orderDetail.refundStatus == 2 ||
                  orderDetail.refundStatus == 3
                "
              >
                <div style="display: flex; margin-left: 72px">
                  <img
                    width="50"
                    height="50"
                    src="~assets/images/order/time_icon@2x.png"
                  />
                  <div style="margin-left: 10px">
                    <p class="order-status">退款中</p>
                    <div class="viewrefund" @click="goRefundDetail(1)">
                      查看退款进度
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="orderDetail.refundStatus == 4">
                <p class="order-status">退款完成</p>
                <div class="viewrefund" @click="goRefundDetail(1)">
                  查看退款详情
                </div>
              </template>
              <template v-if="orderDetail.refundStatus == -2">
                <p class="order-status">退款拒绝</p>
                <p class="viewrefund" @click="goRefundDetail(1)">
                  查看拒绝原因
                </p>
              </template>
              <template v-if="orderDetail.refundStatus == -1">
                <p class="order-status">退款关闭</p>
                <p class="viewrefund" @click="goRefundDetail(1)">
                  查看退款详情
                </p>
              </template>
              <div
                :class="[orderDetail.thirdOrderNo ? 'gosigncontract pay-order-cancel' : 'gosigncontract']"
                v-if="orderDetail.orderStatus == 9"
                @click="orderDetail.thirdOrderNo ? '' : goSigncontract(0)"
              >
                去签约
              </div>
            </template>
          </div>
          <!-- 进度条 -->
          <div class="progress">
            <div class="steps" v-if="timeData">
              <div class="step-status">
                <img
                  src="~assets/images/order/tijiao_icon@2x.png"
                  v-if="timeData.orderTime && orderDetail.orderStatus != 5"
                />
                <img
                  src="~assets/images/order/tijiao_icon_cancel@2x.png"
                  v-else
                />
                <p>提交订单</p>
                <p class="mytime">{{ timeData.orderTime }}</p>
              </div>
              <div
                :class="timeData.orderTime && orderDetail.orderStatus != 5 ? 'line active-line' : 'line'"
              ></div>
              <div class="step-status">
                <img
                  src="~assets/images/order/tijiao_icon@2x.png"
                  v-if="timeData.contractTime && orderDetail.orderStatus != 5"
                />
                <img
                  src="~assets/images/order/wait_icon_light@2x.png"
                  v-else-if="timeData.orderTime && orderDetail.orderStatus != 5"
                />
                <img src="~assets/images/order/wait_icon@2x.png" v-else />
                <p>{{ timeData.contractTime ? "已签约" : "待签约" }}</p>
                <p class="mytime">{{ timeData.contractTime }}</p>
              </div>
              <div
                :class="timeData.contractTime && orderDetail.orderStatus != 5 ? 'line active-line' : 'line'"
              ></div>
              <div class="step-status">
                <img
                  src="~assets/images/order/tijiao_icon@2x.png"
                  v-if="timeData.payTime && orderDetail.orderStatus != 5"
                />
                <img
                  src="~assets/images/order/wait_icon_light@2x.png"
                  v-else-if="timeData.contractTime && orderDetail.orderStatus != 5"
                />
                <img src="~assets/images/order/wait_icon@2x.png" v-else />
                <p>支付订单</p>
                <p class="mytime">{{ timeData.payTime }}</p>
              </div>
              <div
                :class="timeData.payTime && orderDetail.orderStatus != 5 ? 'line active-line' : 'line'"
              ></div>
              <div class="step-status">
                <img
                  src="~assets/images/order/tijiao_icon@2x.png"
                  v-if="timeData.completedTime && orderDetail.orderStatus != 5"
                />
                <img
                  src="~assets/images/order/wait_icon_light@2x.png"
                  v-else-if="timeData.serviceTime"
                />
                <img src="~assets/images/order/wait_icon@2x.png" v-else />
                <p>为您服务</p>
                <p class="mytime">{{ timeData.serviceTime }}</p>
              </div>
              <div
                :class="timeData.completedTime && orderDetail.orderStatus != 5 ? 'line active-line' : 'line'"
              ></div>
              <div class="step-status">
                <img
                  src="~assets/images/order/tijiao_icon@2x.png"
                  v-if="timeData.completedTime && orderDetail.orderStatus != 5"
                />
                <img src="~assets/images/order/wait_icon@2x.png" v-else />
                <p>服务完成</p>
                <p class="mytime">{{ timeData.completedTime }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 项目申报 -->
        <div class="order-info" v-if="orderDetail.orderFeeVoList">
          <img
            :src="imgUrl + orderDetail.url"
            @click="toproduct(orderDetail)"
            v-if="filterType(orderDetail)"
          />
          <video
            class="project_img"
            :src="imgUrl + orderDetail.url"
            v-if="!filterType(orderDetail)"
          />
          <div class="product" @click="toproduct(orderDetail)">
            <p class="order-name">{{ orderDetail.spuName }}</p>
            <p class="order-type">
              订单类型：{{ orderDetail.categoryId | orderType }}
            </p>
            <p class="spec">{{ orderDetail.spec }}</p>
          </div>
          <div class="price price-project">
            <p class="price-title">服务费(元)</p>
            <p class="price-title">官费(元)</p>
            <p class="price-title">数量</p>
            <p class="price-title">总金额(元)</p>
            <div class="project-price" v-if="!orderDetail.isDue">
              <!-- "尾款状态 0-待定 1-待付款 2-已结清 3-无 -->
              <p
                :class="
                  orderDetail.orderStatus == 0 || orderDetail.orderStatus == 1
                    ? 'bright'
                    : orderDetail.tailStatus == 2
                    ? ''
                    : 'grey'
                "
              >
                定金 ￥{{ orderDetail.depositPrice || "0.00" }}
              </p>
              <p
                :class="
                  orderDetail.orderStatus == 1 && orderDetail.tailStatus == 1 && orderDetail.orderStatus != 1
                    ? 'bright'
                    : orderDetail.tailStatus == 1 ||
                      (orderDetail.orderStatus == 2 &&
                        orderDetail.tailStatus == 2)
                    ? ''
                    : 'grey'
                "
              >
                尾款<span v-if="orderDetail.finalPrice">￥</span
                >{{ orderDetail.finalPrice || " 待定 " }}
              </p>
            </div>
            <div v-else class="project-price">
              <p
                :class="
                  orderDetail.orderStatus == 0 || orderDetail.orderStatus == 1
                    ? 'bright'
                    : orderDetail.tailStatus == 2
                    ? ''
                    : 'grey'
                "
              >
                ￥{{ orderDetail.dueDepositPrice || "0.00" }}
              </p>
            </div>
            <p
              v-if="orderDetail.tailStatus != 3"
              class="project-price"
              :class="
                orderDetail.orderStatus == 0 || orderDetail.orderStatus == 1
                  ? 'bright'
                  : orderDetail.tailStatus == 2
                  ? ''
                  : 'grey'
              "
            >
              ￥{{ orderDetail.officalPrice || "0.00" }}
            </p>
            <p v-else class="project-price bright">
              ￥{{
                orderDetail.isDue ? orderDetail.officalPrice || "0.00" : "0.00"
              }}
            </p>
            <p class="project-price">{{ orderCount }}</p>
            <div
              class="price-amount project-price"
              v-if="orderDetail.orderStatus == 0 || orderDetail.tailStatus == 1 || orderDetail.orderStatus == 1"
            >
              <p :class="orderDetail.orderStatus == 0 || orderDetail.orderStatus == 1 ? '' : 'grey'">
                服务费(定金)：
              </p>
              <p :class="orderDetail.orderStatus == 0 || orderDetail.orderStatus == 1 ? '' : 'grey'">
                ￥{{
                  (orderDetail.isDue
                    ? orderDetail.dueDepositPrice * orderCount
                    : orderDetail.depositPrice * orderCount) || "0.00"
                }}
              </p>
              <p :class="orderDetail.orderStatus == 0 || orderDetail.orderStatus == 1 ? '' : 'grey'">官费：</p>
              <p
                v-if="orderDetail.officalPrice > 0"
                :class="orderDetail.orderStatus == 0 || orderDetail.orderStatus == 1 ? '' : 'grey'"
              >
                ￥{{ Number(orderDetail.officalPrice) * orderCount || "0.00" }}
              </p>
              <p v-else :class="orderDetail.orderStatus == 0 || orderDetail.orderStatus == 1 ? '' : 'grey'">
                ￥0.00
              </p>
              <p
                v-if="!orderDetail.isDue"
                :class="orderDetail.tailStatus == 1 ? '' : 'grey'"
              >
                服务费(尾款)：
              </p>
              <p
                v-if="orderDetail.tailStatus != 3 && !orderDetail.isDue"
                :class="orderDetail.tailStatus == 1 ? '' : 'grey'"
              >
                ￥{{ Number(orderDetail.finalPrice) * orderCount || "待定" }}
              </p>
              <p
                v-if="!orderDetail.isDue && orderDetail.tailStatus == 3"
                class="grey"
              >
                待定
              </p>
              <p>待支付合计：</p>
              <p class="bright amount" v-if="orderDetail.orderStatus == 0  || orderDetail.orderStatus == 1">
                ￥{{
                  ((orderDetail.depositPrice ||
                    orderDetail.dueDepositPrice ||
                    0) +
                    (orderDetail.officalPrice || 0)) *
                  orderCount
                }}
              </p>
              <p
                class="bright amount"
                v-if="
                  orderDetail.orderStatus != 0 && orderDetail.tailStatus == 1 && orderDetail.orderStatus != 1
                "
              >
                ￥{{ (orderDetail.finalPrice || 0) * orderCount }}
              </p>
            </div>
            <p
              v-else-if="!orderDetail.finalPrice && !orderDetail.isDue"
              class="amount"
            >
              待定
            </p>
            <p v-else class="amount">￥{{ orderDetail.totalAmount }}</p>
          </div>
        </div>
        <!-- 收件信息 -->
        <div class="area-info" v-if="orderDetail.orderAddress">
          <p class="area-title">收件信息</p>
          <div class="area-content">
            <p>收件人：{{ receiveAddress.receiverName }}</p>
            <div style="display: flex">
              <p style="min-width: 60px">收件地址：</p>
              <p>
                {{ receiveAddress.areaName + receiveAddress.detailAddress }}
              </p>
            </div>
            <p>手机号码：{{ receiveAddress.mobilePhoneNumber }}</p>
          </div>
        </div>
        <!-- <div class="area-info" v-if="taskList.length == 1">
          <p class="area-title">任务信息</p>
          <div class="task-info" >
            <p>任务编号：{{taskList[0].taskNo}} 
              <span v-if="taskList[0].taskStatus == 0" class="progress-btn" @click="toStart = true, progress(taskList[0],true)">待开始</span>
              <span v-else @click="toStart = false,progress(taskList[0], false)" class="progress-btn">{{taskList[0].stepName}}</span>
            </p>
            <p>交付物名称：{{taskList[0].deliveryName || '/'}}</p>
          </div>
        </div> -->
      </div>
    </div>
    <!-- 任务/付款信息 -->
    <div class="task-pay-info" v-if="!'6,7'.match(orderDetail.orderStatus)">
      <div class="task-pay-tab">
        <div>
          <p
            :class="tab == 2 ? 'tab-label tab-label-active' : 'tab-label'"
            @click="(tab = 2), (tag = '合同信息')"
          >
            合同信息
          </p>
          <div class="label-bootom-line" v-if="tab == 2"></div>
        </div>
        <div>
          <p
            :class="tab == 0 ? 'tab-label tab-label-active' : 'tab-label'"
            @click="(tab = 0), (tag = '任务信息')"
          >
            任务信息
          </p>
          <div class="label-bootom-line" v-if="tab == 0"></div>
        </div>
        <div>
          <p
            :class="tab == 1 ? 'tab-label tab-label-active' : 'tab-label'"
            @click="(tab = 1), (tag = '付款信息')"
          >
            付款信息
          </p>
          <div class="label-bootom-line" v-if="tab == 1"></div>
        </div>
      </div>
      <!-- <div class="line"></div> -->
      <span class="tab-span">{{
        tab == 0 && taskList.length != 0
          ? "任务信息"
          : tab == 1
          ? "付款信息"
          : "合同信息"
      }}</span>
      <!-- 操作按钮 -->
      <!-- <span class="btns"><span class="applybtn">申请开票</span><span class="applybtn" v-if="'0,2,4,9'.match(orderDetail.orderStatus) && (!orderDetail.refundStatus || orderDetail.refundStatus==5)" @click="goRefundDetail(0)">申请退款</span></span> -->
      <div class="info-table" v-if="tab == 0">
        <el-table :data="taskList" border :header-cell-style="cell">
          <el-table-column
            label="任务编号"
            prop="taskNo"
            align="center"
          ></el-table-column>
          <el-table-column
            label="任务名称"
            prop="spuName"
            align="center"
          ></el-table-column>
          <el-table-column label="交付物名称" align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.deliveryName || "/" }}</p>
            </template>
          </el-table-column>
          <el-table-column label="任务进度" align="center">
            <template slot-scope="scope">
              <div v-if="orderDetail.refundStatus != 4">
                <div v-if="scope.row.taskStatus == 0" class="task-status">
                  <img src="~/assets/images/order/bluese@2x.png" class="round" />
                  <p
                    class="apply-btn"
                    @click="(toStart = true), progress(scope.row, true)"
                  >
                    待开始
                  </p>
                </div>
                <div
                  v-else
                  class="task-status"
                  @click="(toStart = false), progress(scope.row, false)"
                >
                  <img src="~/assets/images/order/bluese@2x.png" class="round" />
                  <p class="schedule">{{ scope.row.stepName }}</p>
                </div>

              </div>
              <div v-else class="task-status" @click="(toStart = false), progress(scope.row, false)">
                  <img src="~/assets/images/order/bluese@2x.png" class="round" />
                  <p class="schedule">{{ scope.row.preFinishLabel }}</p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="info-table" v-else-if="tab == 1">
        <el-table
          :data="payList"
          border
          :header-cell-style="cell"
        >
          <el-table-column
            label="付款时间"
            prop="payTime"
            align="center"
          ></el-table-column>
          <el-table-column
            label="费用类型"
            prop="name"
            align="center"
          ></el-table-column>
          <el-table-column label="数量" prop="buyNum" align="center">
          </el-table-column>
          <el-table-column label="付款金额" align="center">
            <template slot-scope="scope"
              ><span v-if="scope.row.price">￥</span
              >{{ scope.row.amount * scope.row.buyNum || "待定" }}</template
            >
          </el-table-column>
          <el-table-column label="售后状态" align="center">
            <template slot-scope="scope">
              <span
                v-if="([-1,-2].includes(orderDetail.refundStatus) || !orderDetail.refundStatus) && scope.row.payStatus == 2"
                style="cursor: pointer; color: #36A6FE;"
                :class="[orderDetail.waitingAudit || orderDetail.thirdOrderNo ? 'ccc' : '']"
                @click="orderDetail.waitingAudit || orderDetail.thirdOrderNo ? '' : goRefundDetail(0)"
                >申请退款</span
              >
              <span
                v-else-if="'1,2,3,4'.includes(orderDetail.refundStatus)"
                style="cursor: pointer; color: #36A6FE;"
                @click="goRefundDetail(1)"
              >
                退款详情
              </span>
              <span v-else>/</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="info-table" v-else-if="tab == 2">
        <el-table :data="contractList" border :header-cell-style="cell">
          <el-table-column
            label="合同编号"
            prop="contractNo"
            align="center"
          ></el-table-column>
          <el-table-column
            label="合同名称"
            prop="contractName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="签约时间"
            prop="signTime"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button type="text" @click="viewSupplementContract(row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog
      :visible.sync="commonDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog
    ><!-- 遮罩层 -->
    <!-- 任务进度 -->
    <div v-if="progressDialog" class="progress-box">
      <p class="task-progress">任务进度</p>
      <img
        class="close-img"
        v-if="mouseOver"
        @mouseover="mouseOver = false"
        src="~/assets/images/order/guanbi_icon_dark@2x.png"
      />
      <img
        class="close-img"
        v-else
        @mouseleave="mouseOver = true"
        src="~/assets/images/order/guanbi_icon@2x.png"
        @click="(progressDialog = false), (commonDialog = false)"
      />
      <p class="task-name">任务名称：{{ taskName }}</p>
      <div class="progress-content" v-if="!toStart">
        <div
          v-for="(item, index) in progressList"
          :key="index"
          class="grid-process"
        >
          <p
            :style="index == 0 ? 'color:#333333' : 'color:#999999'"
            style="margin-top: -3px; text-align: center; font-size: 12px"
          >
            {{ item.createTime }}
          </p>
          <!-- <div :class="item.gmtCreate ? 'vertical-line' : 'vertical-line bright-line'" v-if="index !=0"></div> -->
          <div>
            <div class="progress-img-box">
              <img
                src="~/assets/images/order/bluese@2x.png"
                class="progress-img"
                v-if="index == 0"
              />
              <!-- <img src="~/assets/images/order/bluese@2x.png" class="progress-img " v-if="!item.current" /> -->
              <img
                src="~/assets/images/order/huise@2x.png"
                class="progress-img-complete"
                v-else
              />
            </div>
            <p
              :class="
                index != progressList.length - 1
                  ? 'point'
                  : 'point point-complete'
              "
            ></p>
          </div>
          <div style="margin-top: -3px; min-height: 60px">
            <p class="progress-name">{{ item.stepName }}</p>
            <p v-if="item.description" class="progress-desc">
              备注：{{ item.description }}
            </p>
          </div>
        </div>
      </div>
      <p class="to-start" v-else>当前进度：待开始</p>
    </div>
    <!-- 取消/删除订单弹框 -->
    <div v-if="delDialog" class="del-box">
      <p class="del-title">{{ title }}订单</p>
      <img
        v-if="mouseOver"
        @mouseover="mouseOver = false"
        src="~/assets/images/order/guanbi_icon_dark@2x.png"
      />
      <img
        v-else
        @mouseleave="mouseOver = true"
        src="~/assets/images/order/guanbi_icon@2x.png"
        @click="(delDialog = false), (commonDialog = false)"
      />
      <p class="del-content">订单{{ title }}后无法恢复，是否确认{{ title }}?</p>
      <div class="del-btn">
        <div
          class="cancel-del-btn"
          @click="(delDialog = false), (commonDialog = false)"
        >
          再想想
        </div>
        <div
          class="cancel-del-btn confirm-del-btn"
          @click="updateOrderStatus(orderInfo, delStatus, title)"
        >
          提交
        </div>
      </div>
    </div>
    <!--认证提醒弹框-->
    <el-dialog
      :visible.sync="AuthenticationDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog>
    <div v-if="AuthenticationDialog" class="del-box">
      <p class="del-title">认证提醒</p>
      <img
        v-if="mouseOver"
        @mouseover="mouseOver = false"
        src="~/assets/images/order/guanbi_icon_dark@2x.png"
      />
      <img
        v-else
        @mouseleave="mouseOver = true"
        src="~/assets/images/order/guanbi_icon@2x.png"
        @click="AuthenticationDialog = false"
      />
      <p class="cancel-content">由于您的身份未认证，暂时无法进行签约操作</p>
      <p class="cancel-tip">为了给您提供更好的服务，请尽快完成认证</p>
      <p></p>
      <div class="del-btn">
        <div
          class="cancel-del-btn confirm-del-btn"
          @click="AuthenticationDialog = false"
        >
          放弃认证
        </div>
        <div class="cancel-del-btn" @click="goAuthentication">去认证</div>
      </div>
    </div>

    <!--授权提醒-->
    <el-dialog
      :visible.sync="essAuthDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog>
    <div v-if="essAuthDialog" class="del-box">
      <p class="del-title">签约提示</p>
      <img
        v-if="mouseOver"
        @mouseover="mouseOver = false"
        src="~/assets/images/order/guanbi_icon_dark@2x.png"
      />
      <img
        v-else
        @mouseleave="mouseOver = true"
        src="~/assets/images/order/guanbi_icon@2x.png"
        @click="essAuthDialog = false"
      />
      <p class="ess-content">
        由于您首次使用签约功能，需要完成签约授权，请先去授权再来签约吧~
      </p>
      <!-- <p class="cancel-tip">为了给您提供更好的服务，请尽快完成认证</p> -->
      <p></p>
      <div class="del-btn">
        <div
          class="cancel-del-btn confirm-del-btn"
          @click="essAuthDialog = false"
        >
          取消
        </div>
        <div class="cancel-del-btn" @click="toAuth">去认证</div>
      </div>
    </div>

    <!-- 签约选择-->
    <el-dialog
      :visible.sync="signDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog>
    <div v-if="signDialog" class="del-box">
      <p class="sign-title">选择签约方式</p>
      <i class="el-icon-close close" @click="signDialog = false" />
      <!-- <img v-if="mouseOver" @mouseover="mouseOver = false" src="~/assets/images/order/guanbi_icon_dark@2x.png" />
      <img v-else @mouseleave="mouseOver = true" src="~/assets/images/order/guanbi_icon@2x.png" @click="signDialog = false" /> -->
      <div class="change-contract">
        <el-radio v-model="signType" :label="1">电子合同</el-radio>
        <span>线上签约，安全高效省心</span>
      </div>
      <div class="change-contract">
        <el-radio v-model="signType" :label="2">纸质合同</el-radio>
        <span>面签，扫描，邮寄等流程</span>
      </div>
      <div class="sign-btn" @click="signType == 1 && (userInfo.authorizedType != 2 && userInfo.autType == 2) || (userInfo.autType == 1 && userInfo.certifiedType != 2) ? (AuthenticationDialog = true, signDialog = false) : changeSign()">确认</div>
    </div>

    <!-- 签约提示 -->
    <sign-prompt
      v-if="signPromptDialog || currentSignPromptDialog"
      :order="currentOrder"
      @closePromptDialog="closePromptDialog"
      @changeSignWay="changeSignWay"
    />

    <!-- 订阅消息 -->
    <focusTip></focusTip>
  </div>
</template>

<script>
import memberHead from "~/components/member/head";
import {
  getOrderDetail,
  updateOrder,
  getTaskProcessList,
  getOrderTime,
  signSelf,
  changeContractType,
  getTaskByTaskNo,
  getEssAuthStatus,
  listContractByOrderId,
} from "~/api/order";
import { receiveList } from '~/api/member'
import orderData from "~/pages/member/order/productOrder/order-data";
import ClipboardJS from "clipboard";
import Encrypt from "~/plugins/Encrypt";
import focusTip from "@/components/order/focus-tip";
import essayCollectVue from "~/components/member/components/collect/essayCollect.vue";
import signPrompt from "@/pages/member/order/sign-prompt";
import { sign } from "~/mixins/signing-mixin";

export default {
  mixins: [sign],
  components: {
    memberHead,
    focusTip,
    signPrompt,
  },
  head() {
    return {
      title: "订单详情",
      meta: [
        { name: "keywords", content: "订单详情" },
        {
          hid: "description",
          name: "description",
          content: "订单详情",
        },
      ],
    };
  },
  data() {
    return {
      orderId: "",
      orderDetail: {},
      imgUrl: process.env.CDN_BASE_URL,
      delDialog: false,
      signDialog: false,
      essAuthDialog: false,
      commonDialog: false,
      progressDialog: false,
      mouseOver: true,
      delStatus: "",
      orderInfo: {},
      title: "",
      tab: 2,
      taskList: [],
      contractList: [],
      payList: [],
      receiveAddress: {},
      timeData: {},
      progressList: [],
      taskName: "",
      tag: "任务信息",
      toStart: true, //待开始
      orderCount: 0,
      imgType: ".jpg,.png,.jpeg,.gif",
      videoType: ".mp4,.avi,.mov",
      property_URL: process.env.PROPERTY_URL,
      AuthenticationDialog: false,
      userInfo: {},
      refuseReason: "",
      signType: "",
      signInfo: {},
    };
  },
  filters: {
    orderStatus(val) {
      return orderData.orderStatus(val);
    },
    orderType(val) {
      return orderData.orderType(val);
    },
    costType(val) {
      return orderData.costType(val);
    },
    payType(val) {
      return orderData.payType(val);
    },
    refundStatus(val) {
      return orderData.refundStatus(val);
    },
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (this.userInfo) {
      this.orderId = this.$route.query.id;
      this.getDetail();
    } else {
      this.$router.push({ path: "/login" });
    }
  },
  methods: {
    //付款信息合并最后一列
    sapnMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        if (rowIndex === 0) {
          return [3, 1];
        } else {
          return [0, 0];
        }
      }
    },
    viewSupplementContract(row) {
      if (row.contractType == 1) {
        window.open(row.signUrl);
      } else {
        window.open(process.env.CDN_BASE_URL + row.signUrl);
      }
    },
    viewContract() {
      if (this.orderDetail.contractType == 1) {
        window.open(this.orderDetail.contractFileUrl);
      } else {
        window.open(
          process.env.CDN_BASE_URL + this.orderDetail.contractFileUrl
        );
      }
    },
    changeSignWay() {
      this.goSigncontract(this.currentOrder);
    },
    closePromptDialog() {
      this.signPromptDialog = false;
      this.currentSignPromptDialog = false;
    },
    toAuth() {
      this.essAuthDialog = false;
      if (this.userInfo.userType == 1) {
        this.$router.push("/member/authentication/authentication-personal");
      } else {
        this.$router.push("/member/authentication/authentication-unit");
      }
    },
    changeSign() {
      if (this.orderDetail.contractType == this.signType) {
        this.signPromptDialog = false;
        this.currentSignPromptDialog = false;
        this.signDialog = false;
        return
      }
      let param = {
        id: this.signInfo.id,
        contractType: this.signType,
      };
      changeContractType(param).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            type: "success",
            message: "修改签约方式成功！",
            offset: 100,
          });
          this.signDialog = false;
          location.reload()
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          })
          this.signDialog = false;
        }
      });
    },
    // getEssAuthStatus() {
    //   getEssAuthStatus().then((res) => {
    //     if (res.data.code == 0) {
    //       if ("0,1,4".match(JSON.parse(res.data.data.status))) {
    //         this.signDialog = false;
    //         this.essAuthDialog = true;
    //       } else if (res.data.data.status == 3) {
    //         this.signDialog = false;
    //         window.open(res.data.data.authUrl, "_self");
    //       } else {
    //         let param = {
    //           orderId: this.signInfo.id,
    //           returnUrl: process.env.PC_URL + "/member/order",
    //         };
    //         signSelf(param).then((res) => {
    //           if (res.data.code == 0) {
    //             window.open(res.data.data, "_self");
    //           } else {
    //             this.$message({
    //               type: "warning",
    //               message: res.data.msg,
    //               offset: 100,
    //             });
    //           }
    //         });
    //       }
    //     }
    //   });
    // },
    filterType(item) {
      if (item.url.match(/(jpeg|png|jpg|gif)/)) {
        return true;
      } else {
        return false;
      }
    },
    getReason(val) {
      let tradeNo = ''
      val.orderFeeVoList.forEach(item => {
        if (item.payStatus == 3) {
          tradeNo = item.tradeNo
        }
      })
      getTaskByTaskNo({ tradeNo: tradeNo }).then((res) => {
        this.refuseReason = res.data.data.auditMessage;
      });
    },
    goSigncontract(type) {
      // if(type==0){
      if (this.userInfo.status != 2 && this.userInfo.status != 5) {
          this.signPromptDialog = false;
          this.currentSignPromptDialog = false;
          this.signDialog = true;
      } else {
        this.signInfo = this.orderDetail;
        if (this.orderDetail.contractScope == 3) {
          this.signType = this.orderDetail.contractType;
          this.signPromptDialog = false;
          this.currentSignPromptDialog = false;
          this.signDialog = true;
        } else if (this.orderDetail.contractScope == 1) {
          this.essAuth(row, this.userInfo);
        } else if (this.orderDetail.contractScope == 2) {
          let param = {
            id: this.orderDetail.id,
            contractType: 2,
          };
          changeContractType(param).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "合同正在审核中，有问题请联系业务经理",
              });
              this.getDetail();
            } else {
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 100,
              });
            }
          });
        } else {
        }
      }
      // }else{
      //   window.open(this.imgUrl+this.orderDetail.attachmentUrl)
      // }
    },
    goAuthentication() {
      this.AuthenticationDialog = false;
      this.$router.push({ path: "/member/authentication" });
    },
    toproduct(row) {
      window.open("/productdetails/details?spuId=" + row.spuId);
    },
    progress(row, toStart) {
      if (toStart) {
        this.taskName = row.spuName;
        this.progressDialog = true;
        this.commonDialog = true;
      } else {
        getTaskProcessList({ taskId: row.id }).then((res) => {
          this.progressList = res.data.data;
          this.taskName = row.spuName;
          this.progressDialog = true;
          this.commonDialog = true;
        });
      }
    },
    cell() {
      return {
        background: "#F3FBFE",
      };
    },
    jump(route) {
      this.$router.push({
        path: route,
      });
    },
    amountType(row) {
      return row.amountType == 2 ? "官费" : "服务费";
    },
    toPay(tailstatusPayFlag) {
      if (
        tailstatusPayFlag &&
        this.userInfo.status != 2 &&
        this.userInfo.status != 5 && this.userInfo.certifiedType != 1 && this.userInfo.certifiedType != 2
      ) {
        this.AuthenticationDialog = true;
      } else {
        /* 加密 */
        var encrypt = Encrypt.encrypt(
          JSON.stringify(this.orderDetail),
          "Y2FsdGVkX184Asts"
        ); //密钥自定义 加密解密时保持一致即可
        this.$router.push({
          path: "/order/order-pay",
          query: {
            source: "pay-detail",
            data: encrypt,
            tailstatusPayFlag: tailstatusPayFlag,
            orderType: this.orderDetail.orderType,
          },
        });
      }
    },
    getDetail() {
      listContractByOrderId({ orderId: this.orderId }).then((res) => {
        this.contractList = res.data.data;
      });
      getOrderDetail({ id: this.orderId }).then((res) => {
        if (res.data.data.orderStatus == 8) {
          this.$router.push({
            path: "/member/order",
          });
        } else {
          this.orderDetail = res.data.data;
          this.filterAddresss()
          getOrderTime({ orderId: this.orderId }).then((res) => {
            this.timeData = res.data.data;
          });
          this.taskList = res.data.data.tmOrderTaskVoList || [];
          this.orderCount = this.orderDetail.buyNum;
          this.signType = this.orderDetail.contractType;
          this.$set(this.orderDetail, "dueDepositPrice", 0);
          this.$set(this.orderDetail, "depositPrice", 0);
          this.$set(this.orderDetail, "finalPrice", 0);
          try {
            this.orderDetail.orderFeeVoList.forEach((item) => {
              if (item.payType == 1) {
                //定金
                this.$set(this.orderDetail, "hasDeposit", true);
                if (item.costType == 3) {
                  //定金官费
                  this.$set(this.orderDetail, "hasOffical", true);
                  this.$set(this.orderDetail, "officalPrice", item.price); //官费单价
                  this.$set(this.orderDetail, "officalTime", item.payTime);
                } else {
                  this.orderDetail.depositPrice += item.price;
                  this.$set(this.orderDetail, "depositPayTime", item.payTime);
                }
                //payStatus 支付状态：0待付款 1支付中 2支付成功  3支付失败  payChannel支付渠道(0-支付宝，1-对公转账 2-微信)
                if (item.payStatus == 1 && item.payChannel == 1) {
                  this.$set(this.orderDetail, "waitingAudit", true);
                } else if (item.payStatus == 3 && item.payChannel == 1) {
                  this.$set(this.orderDetail, "transferFailure", true);
                }
                if (item.tradeNo) {
                  this.$set(this.orderDetail, "tradeNo", item.tradeNo);
                }
              }
              if (item.payType == 3) {
                //一口价
                this.$set(this.orderDetail, "isDue", true);
                if (item.costType == 3) {
                  //定金官费
                  this.$set(this.orderDetail, "hasOffical", true);
                  this.$set(this.orderDetail, "officalPrice", item.price); //官费单价
                  this.$set(this.orderDetail, "officalTime", item.payTime);
                } else {
                  this.orderDetail.dueDepositPrice += item.price;
                  this.$set(
                    this.orderDetail,
                    "dueDepositPayTime",
                    item.payTime
                  );
                }
                if (item.payStatus == 1 && item.payChannel == 1) {
                  this.$set(this.orderDetail, "waitingAudit", true);
                } else if (item.payStatus == 3 && item.payChannel == 1) {
                  this.$set(this.orderDetail, "transferFailure", true);
                }
                if (item.tradeNo) {
                  this.$set(this.orderDetail, "tradeNo", item.tradeNo);
                }
              }
              if (item.payType == 2) {
                //尾款
                if (this.orderDetail.tailStatus == 0) {
                  // this.$set(this.orderDetail, "hasOffical", false);
                } else {
                  this.orderDetail.finalPrice += item.price;
                  this.$set(this.orderDetail, "finalPayTime", item.payTime);
                }
                if (item.payStatus == 1 && item.payChannel == 1) {
                  this.$set(this.orderDetail, "waitingAudit", true);
                } else if (item.payStatus == 3 && item.payChannel == 1) {
                  this.$set(this.orderDetail, "transferFailure", true);
                }
              }
            });
          } catch (error) {}
          this.payList = [];
          if (this.orderDetail.isDue) {
            if ("1,3".includes(this.orderDetail.payStatus)) {
              this.payList.push({
                payTime: this.orderDetail.dueDepositPayTime,
                name: "服务费(定金)",
                buyNum: this.orderDetail.buyNum,
                amount: this.orderDetail.dueDepositPrice,
                payStatus: "1,3".includes(this.orderDetail.payStatus) ? 2 : 0
              });
            }
          } else {
            if ("1,3".includes(this.orderDetail.payStatus)) {
              this.payList.push(
                {
                  payTime: this.orderDetail.depositPayTime,
                  name: "服务费(定金)",
                  buyNum: this.orderDetail.buyNum,
                  amount: this.orderDetail.depositPrice,
                },
              );
            }
            
            if (!("1,2,3,4".includes(this.orderDetail.refundStatus) && !this.orderDetail.finalPayTime) && this.orderDetail.payStatus == 3) {
              this.payList.push(
                {
                  payTime: this.orderDetail.finalPayTime,
                  name: "服务费(尾款)",
                  buyNum: this.orderDetail.buyNum,
                  amount: this.orderDetail.finalPrice,
                }
              )
            }
            try {
              this.orderDetail.orderPaymentVoList.forEach(item => {
                if (item.payType == 1) {
                  this.payList[0].payStatus = item.payStatus
                } else if (item.payType == 2 && item.payStatus == 2) {
                  this.payList[1].payStatus = item.payStatus
                }
              })
            } catch (error) {
              
            }
            
          }
          if (this.orderDetail.hasOffical) {
            if ("1,3".includes(this.orderDetail.payStatus)) {
              this.payList.push({
                payTime: this.orderDetail.officalTime,
                name: "官费",
                buyNum: this.orderDetail.buyNum,
                amount: this.orderDetail.officalPrice,
                payStatus: "1,3".includes(this.orderDetail.payStatus) ? 2 : 0
              });
            }
          }
          if(this.orderDetail.orderStatus == 1 || this.orderDetail.orderStatus == 0){
            this.payList = []
          }
        }
      });
    },
    filterAddresss() {
      receiveList({accountId:this.userInfo.accountId}).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.length > 0) {
            let list = res.data.data
            if (this.orderDetail.orderAddress) {
              let result = list.filter((item) => {
                return item.id == this.orderDetail.orderAddress.sourceId
              })
              this.receiveAddress = result[0]
            }
          }
        }
      })
      
    },
    copy() {
      new ClipboardJS(".orderNo");
      this.$message({
        type: "success",
        message: "复制成功",
        offset: 80,
        duration: 1000,
      });
    },
    updateStatus(row, status, title) {
      this.title = title;
      this.orderInfo = row;
      this.delStatus = status;
      this.delDialog = true;
      this.commonDialog = true;
    },
    updateOrderStatus(row, status, title) {
      let param = {
        id: row.id,
        orderStatus: status,
        // accountId: this.userInfo.accountId,
        // orderNo: row.orderNo,
        // productName: row.orderDetailVO.productName
      };
      if (status == 6 || status == 7) {
        updateOrder(param).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: title + "订单成功！",
              offset: 80,
              duration: 2000,
            });
            if (status == 7) {
              this.$router.push({
                path: "/member/order",
              });
            } else {
              this.delDialog = false;
              this.commonDialog = false;
              this.getDetail();
            }
          } else {
          }
        });
      } else {
        updateOrder(param).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "订单状态修改成功！",
              offset: 80,
              duration: 2000,
            });
            this.getDetail();
          } else {
          }
        });
      }
    },
    goRefundDetail(check) {
      if (check == 0) {
        let routerUrl = this.$router.resolve({
          path: "/refund/refund-apply",
          query: {
            orderNo: this.orderDetail.orderNo,
            id: this.orderDetail.id,
          },
        });
        window.open(routerUrl.href, "_blank");
      } else {
        // 退款详情
        let routerUrl = this.$router.resolve({
          path: "/refund/refund-apply",
          query: {
            id: this.orderDetail.id,
            refundId: this.orderDetail.refundId,
            orderNo: this.orderDetail.orderNo,
            refundStatus: this.orderDetail.refundStatus,
          },
        });
        window.open(routerUrl.href, "_self");
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
@import './my-order.stylus';
</style>