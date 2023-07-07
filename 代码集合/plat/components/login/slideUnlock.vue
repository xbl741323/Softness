<template>
    <div ref="wrap" class="slider-unlock">
        <div class="before">请按住滑块，拖动到最右边</div>
        <div ref="after" class="after">
            <div class="after-inner">{{ success?'验证成功':'请按住滑块，拖动到最右边' }}</div>
        </div>
        <div ref="slider" :class="['slider',success==true ? 'is-success':'']"> </div>
    </div>
</template>
 
<script>
export default {
    name: 'SliderUnlock',
    data() {
     return {
            success: false,
            clear: null,
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        this.clear()
    },
    methods: {
      init() {
        // 获取 dom
        const after = this.$refs.after
        const slider = this.$refs.slider
        const wrap = this.$refs.wrap
        // 设置after-inner的固定宽度
        after.childNodes[0].style.width = wrap.offsetWidth + 'px'
        // 滑块移动最大位置
        const limit = wrap.offsetWidth - slider.offsetWidth
        // 实时计算滑块的偏移量
        let offsetX
        // 点击滑块时的鼠标X位置
        let initX
        // 页面鼠标移动事件
        const docMousemoveHandler = e => {
            // 获取移动后鼠标实时位置
            const moveX = e.clientX
            // 计算滑块应该移动的偏移量
            offsetX = moveX - initX
            // 限制上下限
            if (offsetX < 0) {
                offsetX = 0
            } else if (offsetX > limit) {
            offsetX = limit
            }
            // 移动滑块
            slider.style.left = offsetX + 'px'
            // 修改高亮背景宽度
            after.style.width = offsetX + 'px'
            if (offsetX >= limit) {
                this.success = true
                this.$emit('success', this.success)
                document.removeEventListener('mousemove', docMousemoveHandler)
                slider.removeEventListener('mousedown', sliderMousedownHandler)
            }
        }
        // 页面鼠标松开事件
        const docMouseupHandler = e => {
            // 解绑事件
            document.removeEventListener('mousemove', docMousemoveHandler)
            // 重置滑块
            if (offsetX < limit) {
                slider.style.left = 0
                after.style.width = 0
            }
        }
        // 滑块点击事件
        const sliderMousedownHandler = e => {
        // 获取鼠标位置
        initX = e.clientX
        // 绑定页面的鼠标移动事件
        document.addEventListener('mousemove', docMousemoveHandler)
        }
        // 绑定滑块点击事件
        slider.addEventListener('mousedown', sliderMousedownHandler)
        // 页面鼠标松开事件
        document.addEventListener('mouseup', docMouseupHandler)
        // 定义清理方法
        this.clear = () => {
            document.removeEventListener('mousemove', docMousemoveHandler)
            slider.removeEventListener('mousedown', sliderMousedownHandler)
            document.removeEventListener('mouseup', docMouseupHandler)
        }
      },
    },
}
</script>
 
<style lang="stylus" scoped>
.slider-unlock{
     height: 40px;
     background: #EEF1F2;
     border-radius: 4px;
     position: relative;
     overflow: hidden;
     border: 1px solid #EEF1F2;
     box-sizing: border-box;
     user-select: none;
     .before, .after {
            position: absolute;
            margin: -1px 0 0 -1px;
            top: 0;
            left: 0;
            z-index: 1;
            height: 100%;
            box-sizing: content-box;
            line-height: 38px;
            text-align: center;
            font-size: 12px;
            font-family: Source Han Sans CN, Source Han Sans CN-Regular;
            color: #b4b4b4;
        }
     .before {
            width: 100%;
            color: #b4b4b4;
            padding: 0 1px 1px 0;
        }
     .after {
            width: 0;
            overflow: hidden;
            padding: 0 0 1px 0;
            .after-inner {
                position: absolute;
                width:100%;
                height: 100%;
                color: #fff;
                background-color: #36A6FE;
            }
     }
     .slider{
        position: absolute;
        margin: -1px 0 0 -1px;
        top: 0;
        left: 0;
        z-index: 3;
        width: 70px;
        height: 40px;
        border: 1px solid #CCC;
        cursor: pointer;
        background: no-repeat center center #fff;
        background-image: url('~assets/images/home/icon-allow-right.png');
  }
  .is-success {
        background-image: url('~assets/images/home/icon-success.png') !important;
    }
}
</style>