<template>
<!-- 排查完成 -->
  <div class="cover_frame">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="技术成果" name="first"></el-tab-pane>
    </el-tabs>
    <cover-setting />
  </div>
</template>

<script>
import coverSetting from '@/components/achievement/cover-setting.vue'
export default {
  components: { 
    coverSetting 
  },
  data(){
    return {
      activeName: 'first'
    }
  },
  methods:{
    handleClick(){

    },
  }
}
</script>

<style scoped>
.cover_frame{
  height: 100%;
  background: #fff;
  padding: 10px;
}
</style>