<template>
  <div>
    <!-- 法律服务 -->
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
      orderType: 10
    }
  }
}
</script>

<style>

</style>