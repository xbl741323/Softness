<template>
  <div>
      <!-- 工商财税 -->
    <task-list :orderType="orderType" v-if="orderType"></task-list>
  </div>
</template>

<script>
import taskList from '@/components/task/task-list'
export default {
  components:{
    taskList
  },
  data(){
    return{
      orderType: 7
    }
  }
}
</script>

<style>

</style>