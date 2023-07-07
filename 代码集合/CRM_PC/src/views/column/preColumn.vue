<template>
  <div class="preview_column">
    <div class="pre_top">
      <h1 style="margin-top:100px;">前台top区域</h1>
    </div>
    <div class="pre_content">
      <div class="pre_left">
        <h3 class="left_desc">{{ name }}</h3>
      </div>
      <div class="pre_right" v-html="content"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: "",
      name: ""
    };
  },
  created() {
    this.name = this.$route.query.name;
    this.content = this.$route.query.content;
    console.log(this.content,"shcuhu")
  },
  methods: {}
};
</script>

<style scoped>
.preview_column {
  background: #f1f1f1;
  min-height: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.pre_content {
  background: #f1f1f1;
  min-height: 960px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.left_desc {
  margin-top: 300px;
  color: #fff;
  background: #36a6fe;
  line-height: 46px;
  text-align: center;
  width: 186px;
  height: 46px;
  margin: 0px auto;
}

.pre_top {
  width: 100%;
  height: 300px;
  background: #fff;
  border-bottom: 5px solid #ccc;
  text-align: center;
}
.pre_left {
  width: 191px;
  min-height: 960px;
  background: #fff;
  border-right: 5px solid #ccc;
}
.pre_right {
  padding: 10px;
  width: 964px;
  background: #fff;
  min-height: 960px;
}
</style>