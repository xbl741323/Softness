<template>
    <el-dialog width="40%" title="推广" @close="handleClose" :visible.sync="dialogShow" :before-close="handleClose">
        <el-radio-group v-model="shareRadio">
            <el-radio :label="0">链接推广（客户使用PC端）</el-radio>
            <el-radio :label="1">二维码推广（客户使用小程序）</el-radio>
        </el-radio-group>
        <el-input
            class="shareInput"
            v-if="shareRadio == 0"
            v-model="pcCodeUrl"
            placeholder="请输入内容"
        >
            <template slot="append">
                <el-button type="primary" @click="copyToClip(pcCodeUrl)">
                    {{!isCopied ? "复制推广地址" : "推广地址已复制"}}
                </el-button>
            </template>
        </el-input>
        <div v-else class="erweima " ref="erweima">
            <div class="erweimainfo wx-member-sty" 
                :style="{
                    backgroundImage: `url('${wtMemberBgUrl}')`,
                    backgroundSize: '100% 100%',
                }">
                <img
                    class="shareBanner"
                    src="@/assets/images/project/shareImg.jpg"
                    alt=""
                />
                <div class="bottom">
                    <div class="jieshao" style="margin-top: 18px">
                        <div class="title">
                            {{ type == 2 ? dialogForm.fileName : dialogForm.title }}
                        </div>
                        <div class="allPrice">
                            <div class="price">
                            工号：{{userInfo.number}}
                            </div>
                        </div>
                    </div>
                    <div>
                        <vue-qr
                        :class="['wx-member-main-sty']"
                        :text="wxCodeUrl"
                        :size="150"
                        :logoScale="0.2"
                        ></vue-qr>
                    </div>
                </div>
            </div>
            <el-button style="margin-top:15px" type="primary" @click="saveMemberCode">下载二维码</el-button>
        </div>
        <div slot="footer">
            <el-button type="primary" @click="handleClose">知道了</el-button>
        </div>
    </el-dialog>
</template>

<script>
import html2canvas from "html2canvas";
import VueQr from "vue-qr";
import { getWxYaoCode } from "@/api/personal/myhome";
import { mapState } from "vuex";
export default {
    components: {
        VueQr,
    },
    props: {
        dialogForm: {
            type: Object,
            default() {
                return {}
            }
        },
        dialogShow: {
            type: Boolean,
            default: false
        },
        type: {//1 通知公告 2 行业资讯 3 卧涛文档
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            shareRadio: 0,
            isCopied: false,
            wxCodeUrl: "",
            pcCodeUrl: "",
            pcUrl: process.env.VUE_APP_WEB_URL,
            depositFee: '',
            number: "",
            wtMemberBgUrl: require("@/assets/images/project/pic_WTmember.png"),
        }
    },
    computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    },
    created() {
        this.handleShare(this.type)
    },
    methods: {
        handleShare(type) {
            getWxYaoCode().then(res => {
                if (type != 2) {
                    let params = {
                        policyId: this.dialogForm.id,
                        number: type == 0 ? this.dialogForm.number : this.dialogForm.industryNo,
                        index: type,
                        policySpread: res.data.data,
                    }
                    let data = JSON.stringify(params)
                    this.wxCodeUrl = `https://www.wotao.com/policy?data=${data}`
                } else {
                    let params = {
                        fileId: this.dialogForm.id,
                        fileSpread: res.data.data,
                    }
                    let data = JSON.stringify(params)
                    this.wxCodeUrl = `https://www.wotao.com/wtFiles?data=${data}`
                }
                switch(type) {
                    case 0:
                        this.pcCodeUrl = this.pcUrl+`policy/${this.dialogForm.number}01?id=${this.dialogForm.id}&link=${res.data.data}`
                        break
                    case 1:
                        this.pcCodeUrl = this.pcUrl+`policy/${this.dialogForm.industryNo}101?link=${res.data.data}`
                        break
                    case 2:
                        this.pcCodeUrl = this.pcUrl+`policy/files/${this.dialogForm.id}?link=${res.data.data}`
                        break
                }
            })
        },
        handleClose() {
            this.$emit("shareClose")
        },
        copyToClip(content) {
            const ele = document.createElement("input");
            ele.setAttribute("value", content);
            document.body.appendChild(ele);
            ele.select();
            document.execCommand("copy");
            document.body.removeChild(ele);
            this.$message({
                type: "success",
                message: "推广地址复制成功",
            });
            this.isCopied = true
        },
        saveMemberCode() {
            this.saveQrStatus = false;
            setTimeout(() => {
                html2canvas(this.$refs.erweima, {
                    useCORS: true,
                    width: 380,
                    height: 532,
                    scale: 3,
                    windowWidth: document.body.scrollWidth,
                    windowHeight: document.body.scrollHeight,
                    x: 169,
                    y: 0,
                }).then((canvas) => {
                    let imgUrl = canvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.href = imgUrl;
                    link.setAttribute("download", this.type == 2 ? this.dialogForm.fileName : this.dialogForm.title + ".png");
                    link.style.display = "none";
                    document.body.appendChild(link);
                    link.click();
                    this.saveQrStatus = true;
                    this.$message({
                        type: "success",
                        message: "图片下载成功"
                    })
                });
            }, 500);
        },
    },
}
</script>

<style scoped>
.shareInput {
    width: 90%;
    margin-top: 30px;
}
.erweima{
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.erweimainfo {
    display: flex;
    flex-direction: column;
    z-index: 1;
    width: 380px;
    height: 532px;
}
.shareBanner {
    width: 329px; 
    height: 235px; 
    background: #ccc; 
    border-radius: 10px;
    position: relative;
    top: 70px;
    left: 23px;
}
.bottom {
    display: flex;
    position: relative;
    top: 83px;
    left: 21px;
}
.jieshao {
    width: 190px;
}
.title {
    font-size: 16px;
    font-weight: 700;
    color: #000;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
.allPrice {
    display: flex;
    margin-top: 10px;
}
.price {
    display: flex;
    flex-direction: column;
    margin-right: 5px;
    width: 100%;
    color: #222;
}
.priceName {
    font-size: 12px;
    color: #2b2b2b;
    padding: 8px 0;
}
.wx-member-main-sty {
    width: 150px;
    height: 150px;
    z-index: 2;
}
</style>