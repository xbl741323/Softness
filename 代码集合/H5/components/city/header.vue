<template>
    <div class="header">
        <mt-header :title="$t('title.areaSwitch')">
            <router-link to="/" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
    </div>
</template>

<script>
export default {
}
</script>
<style scoped>
.header{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
}
</style>

