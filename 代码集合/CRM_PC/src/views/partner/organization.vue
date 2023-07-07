<template>
    <div class="institutions">
        <basic-container>
            <el-tabs v-model="activeName">
                <el-tab-pane label="合作机构管理" name="0">
                    <organizeManage @handleToAccount="handleToAccount"></organizeManage>
                </el-tab-pane>
                <el-tab-pane label="账号管理" name="1" v-if="activeName == 1">
                    <accountManage v-if="activeName == 1"></accountManage>
                </el-tab-pane>
            </el-tabs>
        </basic-container>
    </div>
</template>

<script>
import organizeManage from '@/components/partner/organizeManage.vue';
import accountManage from '@/components/partner/accountManage.vue';

export default{
    components: {
        organizeManage,
        accountManage
    },
    data() {
        return {
            activeName: "0", //0 合作机构管理 1 账号管理
        }
    },
    methods: {
        handleToAccount() {
            this.activeName = "1"
        },
    },
}

</script>

<style lang="scss" scoped>

</style>