<template>
  <div class="contain">
    <div class="tab-contain">
      <!-- 声明子路由链接 -->
      <div 
       @click="changeTab(index)"
       :class="['tab-item', tabIndex === index ? 'active-tab-item' : '']" 
       v-for="(item, index) in tabList" 
       :key="item.path">{{ item.title }}</div>
    </div>
     <!-- 声明子路由占位符 -->
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
} from 'vue';
import { RouterView, useRouter } from 'vue-router';
const router = useRouter()
const tabIndex = ref<number>(0)
const tabList = reactive([
  {
    title: '服务1',
    path: '/service/serviceOne'
  },
  {
    title: '服务2',
    path: '/service/serviceTwo'
  }
])

const changeTab = (index:number)=>{
  tabIndex.value = index
  toPage(tabList[index].path)
}

const toPage = (path:string)=>{
  router.push({
    path: path
  })
}

</script>

<style scoped>
.contain {
  padding: 0;
}

.tab-contain {
  display: flex;
  height: 40px;
  border-bottom: 1px solid #e7e6eb;
}

.tab-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.active-tab-item {
  color: #36a6fe;
}
</style>