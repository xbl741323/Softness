<template>
  <div>
    <!--签约提示-->
    <el-dialog :visible.sync="signPromptDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
    <div v-if="signPromptDialog" class="del-box sign-box">
      <p class="del-title">签约提示</p>
      <img v-if="mouseOver" @mouseover="mouseOver = false" src="~/assets/images/order/guanbi_icon_dark@2x.png" />
      <img v-else @mouseleave="mouseOver = true" src="~/assets/images/order/guanbi_icon@2x.png" @click="closeDialog" />
      <p class="sign-prompt-content">{{signTitle}}</p>
      <!-- <div class="del-btn">
        <div class="cancel-del-btn confirm-del-btn" @click="signPromptDialog = false">取消</div>
        <div class="cancel-del-btn" @click="toAuth">去认证</div>
      </div> -->
    </div>

    
    <!--切换签约方式提醒-->
    <el-dialog :visible.sync="currentSignPromptDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
    <div v-if="currentSignPromptDialog" class="del-box">
      <p class="del-title">当前签约方式</p>
      <img v-if="mouseOver" @mouseover="mouseOver = false" src="~/assets/images/order/guanbi_icon_dark@2x.png" />
      <img v-else @mouseleave="mouseOver = true" src="~/assets/images/order/guanbi_icon@2x.png" @click="closeDialog" />
      <p class="sign-prompt-content">{{signTitle}}</p>
      <div class="del-btn">
        <div class="cancel-del-btn" @click="changeSignWay()">切换</div>
        <div class="cancel-del-btn confirm-del-btn" @click="closeDialog">取消</div>
      </div>
    </div>
  </div>
</template>

<script> 
import { sign } from "~/mixins/signing-mixin";
export default {
  mixins:[sign],
  props:{
    order:{
      type: Object,
      required: true
    }
  },
  data(){
    return {
      mouseOver: true
    }
  },
  mounted(){
    this.signPrompt(this.order);
  },
  methods:{
    closeDialog(){
      this.$emit('closePromptDialog');
    },
    changeSignWay(){
      this.$emit('changeSignWay');
    },
  }
}
</script>

<style lang="stylus" scoped>
  @import './productOrder/index.stylus';
</style>

<style scoped>
.sign-box{
  min-height: 200px !important;
}
.sign-prompt-content{
  font-size: 16px;
  padding: 40px 0;
  text-align: center;
}
</style>