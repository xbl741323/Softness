<template>
  <div class="contain">
    <h1>count：{{ counter.count }}</h1>
    <h1>doubleCount：{{ counter.doubleCount }}</h1>
    <button @click="countAdd">点我加一</button>
    <button @click="countReduce">点我减一</button>
    <button @click="countChange">点我改变</button>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
const countAdd = () => {
  counter.increment()
}
const countReduce = () => {
  counter.reduce()
}
// 可以添加逻辑判断修改count值
const countChange = () => {
  counter.$patch((state) => {
    if (state.count < 0) {
      state.count = 0
    }
  })
}
</script>

<style scoped></style>