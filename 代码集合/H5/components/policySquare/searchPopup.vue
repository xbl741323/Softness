
<template>
  <div @touchmove="onTouchMove">
  <!-- 遮罩层动画 -->
    <div class="mask" @click="hideOnBlur && (currentValue = false)" v-show="currentValue"></div>
    <input style="display:none" v-model="currentValue">
    <!-- 显示信息层 -->
    <transition :name="dialogTransition">
      <div :class="['popupBox', middle ?'middle-fixed':'']" v-show="currentValue">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    //是否显示
    value: {
      type: Boolean,
      default: false
    },
    middle:{
      type: Boolean,
      default: false
    },
    //弹窗动画
    dialogTransition: {
      type: String,
      default: "slide-fade"
    },
    //点击遮罩层关闭弹窗
    hideOnBlur: {
      default: function() {
        return true;
      }
    },
    //禁止页面滚动
    scroll: {
      type: Boolean,
      default: true
    }
  },
  created() {
    if (typeof this.value !== "undefined") {
      this.currentValue = this.value;
    }
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      this.$emit(val ? "on-show" : "on-hide");
      this.$emit("input", val);
    }
  },
  data() {
    return {
      // 传进来的值
      currentValue: false
    };
  },
  methods: {
    onTouchMove: function(event) {
      !this.scroll && event.preventDefault();
    }
  }
};
</script>
<style scoped>
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
  width: 0 !important;
  height: 0;
}
/*遮罩层*/
.mask {
  position: fixed;
  z-index: 98;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
.popupBox {
  position: fixed;
  top: 0;
  left: 0px;
  max-width: 100%;
  max-height: 100%;
  min-width: 100%;
  min-height: 50px;
  background: #fff;
  z-index: 999;
  transform: translateY(0%);
  font-size: 0.3rem;
}
.middle-fixed{
  top: 3.0rem;
  border-top: 1px solid #f5f4f4;;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateY(-40px);
  opacity: 0;
}
</style>