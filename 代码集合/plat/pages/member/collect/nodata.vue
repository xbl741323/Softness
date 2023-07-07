<template>
  <div>
    <div class="property_no_data">
      <img src="@/assets/images/member/no_question@2x.png" alt="暂无数据" />
      <p class="tip">暂无数据</p>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  data () {
    return {

    }
  },

  created () {

  },

  mounted () {

  },

  methods: {

  }

}
</script>

<style scoped>
.property_no_data{
  width: 960px;
  background: #ffffff;
  height: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tip {
  width: 169px;
  height: 20px;
  font-size: 16px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Regular;
  font-weight: 400;
  text-align: center;
  color: #bfbfbf;
  line-height: 20px;
  letter-spacing: 0.98px;
  margin-left: -25px;
}
</style>