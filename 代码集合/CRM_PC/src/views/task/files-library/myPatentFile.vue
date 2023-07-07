<template>
    <div>
        <task-patentFile :isManage="false"></task-patentFile>
    </div>
</template>

<script>
import taskPatentFile from "@/components/task/task-patentFile.vue"
export default {
    components: {
        taskPatentFile
    }
}
</script>