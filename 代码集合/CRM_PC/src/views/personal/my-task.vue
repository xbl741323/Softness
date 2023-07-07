<!-- 排查完成 -->
<template>
  <div>
    <task-list :listType="listType" :showEngineer ='false' showEdit v-if="listType=='personal'"></task-list>
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
      listType: 'personal'
    }
  }
}
</script>

<style>

</style>