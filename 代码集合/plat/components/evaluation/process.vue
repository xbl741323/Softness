<template>
    <div class="evalution_process">
        <div class="process_main">
            <div class="process_title">科技成果评价流程</div>
            <div class="process_desc">科技成果转化是落实“科学技术是第一生产力”的关键</div>
            <div class="process_intro">
                <img :src="require('@/assets/images/'+'cgpj/img_cgpj08.png')" alt />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    
};
</script>

<style scoped>
.evalution_process {
    padding-top:20px;
    width: 100%;
    height: 560px;
    background: #f5f5f5;
    font-family: "Microsoft YaHei UI";
}
.process_main {
    width: 1200px;
    height: 560px;
    margin: 0 auto;
}
.process_title {
    width: 212px;
    height: 33px;
    font-size: 26px;
    font-weight: bold;
    color: rgba(68, 77, 90, 1);
    opacity: 1;
    margin: 0 auto;
    padding-bottom: 10px;
}
.process_desc {
    width: 390px;
    height: 20px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(147, 150, 155, 1);
    opacity: 1;
    margin: 0 auto;
}
.process_intro {
    display: flex;
    width: 1200px;
    height: 457px;
    align-items: center;
    justify-content: center;
}
</style>