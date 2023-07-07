<template>
  <div class="tab-bar-contain">
    <div class="tab-bar-item" @click="toPage(item.path, index)" v-for="(item, index) in tabList" :key="index"
      :to="item.path">
      <img :src="activeIndex == index ? item.activeImgUrl : item.imgUrl" alt="">
      <span :class="[activeIndex == index ? 'active-sty' : '']">{{ item.title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import homeIcon from '@/assets/images/home_icon_hui@2x.png'
import homeActiveIcon from '@/assets/images/home_icon@2x.png'
import serviceIcon from '@/assets/images/fenlei_icon_hui@2x.png'
import serviceActiveIcon from '@/assets/images/fenlei_icon@2x.png'
import policyIcon from '@/assets/images/zhengce_icon_hui@2x.png'
import policyActiveIcon from '@/assets/images/zhengce_icon@2x.png'
import personalIcon from '@/assets/images/me_icon_hui@2x.png'
import personalActiveIcon from '@/assets/images/me_icon@2x.png'
const activeIndex = ref(0)
const tabList = reactive(
  [
    {
      title: '首页',
      path: 'home',
      imgUrl: homeIcon,
      activeImgUrl: homeActiveIcon
    },
    {
      title: '服务',
      path: 'service',
      imgUrl: serviceIcon,
      activeImgUrl: serviceActiveIcon
    },
    {
      title: '政策',
      path: 'policy',
      imgUrl: policyIcon,
      activeImgUrl: policyActiveIcon
    },
    {
      title: '我的',
      path: 'personal',
      imgUrl: personalIcon,
      activeImgUrl: personalActiveIcon
    }
  ]
)

const router = useRouter();
// 1、运行时
const emit = defineEmits(['changeTitle'])

// 2、基于类型
// const emit = defineEmits<{
//   (e: 'changeTitle', name: string, index: number): void
// }>()
const toPage = (name: string, index: number) => {
  activeIndex.value = index
  emit('changeTitle', tabList[index].title, index)
  router.push({
    name: name
  });
};

// 向父组件暴露子组件的值
defineExpose({
  activeIndex,
  open: () => {
    console.log('子组件暴露的open方法')
  }
})
</script>

<style scoped>
.tab-bar-contain {
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  display: flex;
  border-top: 1px solid #e7e6eb;
}

.tab-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #999999;
}

.active-sty {
  color: #36a6fe;
}

.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-bottom: 1px;
}
</style>