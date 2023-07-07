<template>
  <div class="contain">
    <button @click="changeVal()">点我改名</button>
    <h1>{{ name }}</h1>
    <h1>{{ getName }}</h1>
    <h1>{{ age }}</h1>
    <h1>{{ info.name }}{{ info.age }}{{ info.hobby.name }}</h1>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, watchEffect } from 'vue';
let name = ref<string>('胡桃')
let age = ref<number>(18)
interface obj {
  name: string,
  age: number,
  hobby: {
    name: string,
  }
}
let info = reactive<obj>({
  name: '七七',
  age: 8,
  hobby: {
    name: '玩游戏'
  }
})
let changeVal = () => {
  name.value = '甘雨'
  age.value = 20
  info.name = '可莉'
  info.age = 18
  info.hobby = {
    name: '读书'
  }
}
// 计算属性
let getName = computed(() => {
  return `我是${name.value}`
})
// watch-监视基本类型
watch([name, age], (newVal, oldVal) => {
  console.log(newVal, 'newVal')
  console.log(oldVal, 'oldVal')
})

// watch-监视对象
watch(info, (newVal, oldVal) => {
  console.log(newVal, 'newVal')
  console.log(oldVal, 'oldVal')
}, { immediate: true })

// watchEffect
watchEffect(() => {
  console.log(name.value, 'watchEffect')
})
</script>

<style scoped>
.contain{
  padding: 5px;
}
</style>