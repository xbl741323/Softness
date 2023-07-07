<template>
    <div class="evalution_difference">
        <div class="deffer_main">
        <div class="deffer_title">成果鉴定与评价的异同</div>
        <div class="deffer_desc">科技成果转化是落实“科学技术是第一生产力”的关键</div>
        <div class="deffer_content">
            <div class="content_left">
                <div class="left_img">
                    <img :src="require('@/assets/images/'+'cgpj/img_cgpj02.png')" alt />
                </div>
                <div class="left_desc">
                    <div class="left_desc_title">相同点</div>
                    <div class="left_desc_main">
                    <span class="little_black"></span>
                    <span>均是对科技成果的真伪和水平进行评判</span>
                    </div>
                </div>
            </div>
            <div class="content_right">
            <div class="right_desc">
                <div class="right_desc_title">不同点</div>
                <div class="right_desc_main">
                    <div>
                        <span class="little_black"></span>
                        <span>
                        评审方式：前者定性评价；
                        后者定性与定量评价
                        </span>
                    </div>
                    <div>
                        <span class="little_black"></span>
                        <span>
                        评价内容不同：前者主要侧
                        重技术和水平鉴定；后者包
                        括技术、水平、应用价值、
                        经济效益和社会效益
                        </span>
                    </div>
                    <div>
                        <span class="little_black"></span>
                        申请受理不同：前者申请表；
                        后者签订评价协议
                    </div>
                </div>
            </div>
            <div class="right_img">
                <img :src="require('@/assets/images/'+'cgpj/img_cgpj02.png')" alt />
            </div>
            </div>
        </div>
        </div>
    </div>
</template>
<script>
export default {};
</script>
<style scoped>
.evalution_difference {
    padding-top:20px;
    width: 100%;
    height: 480px;
    font-family: "Microsoft YaHei UI";
    background: #ffffffff;
}
.deffer_main {
    width: 1200px;
    height: 480px;
    margin: 0 auto;
}
.deffer_title {
    padding-bottom: 10px;
    width: 266px;
    height: 33px;
    font-size: 26px;
    font-weight: bold;
    line-height: 33px;
    color: rgba(68, 77, 90, 1);
    opacity: 1;
    margin: 0 auto;
}
.deffer_desc {
    width: 390px;
    height: 20px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(147, 150, 155, 1);
    opacity: 1;
    margin: 0 auto;
}
.deffer_content {
    margin-top: 30px;
    width: 1200px;
    height: 284px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.content_left {
    width: 580px;
    height: 284px;
    background: rgba(241, 244, 248, 1);
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

.content_right {
    width: 580px;
    height: 284px;
    background: rgba(241, 244, 248, 1);
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}
.left_img {
    width: 284px;
    height: 190px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.left_desc {
    width: 176px;
    height: 284px;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
.right_img {
    width: 284px;
    height: 190px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.right_desc {
    width: 180px;
    height: 284px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 10px;
}
.left_desc_title {
    width: 60px;
    height: 30px;
    font-size: 20px;
    font-weight: 400;
    line-height: 25px;
    color: rgba(72, 77, 84, 1);
    opacity: 1;
    border-bottom: 2px solid #397dcfff;
    margin-bottom: 20px;
}
.left_desc_main {
    width: 176px;
    height: 40px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(153, 153, 153, 1);
    opacity: 1;
}
.right_desc_title {
    margin-top: 20px;
    width: 60px;
    height: 35px;
    font-size: 20px;
    font-weight: 400;
    line-height: 25px;
    color: rgba(72, 77, 84, 1);
    opacity: 1;
    border-bottom: 2px solid #397dcfff;
    margin-bottom: 10px;
}
.right_desc_main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    color: #999999ff;
}
.right_desc_main div {
    width: 168px;
    margin-bottom: 10px;
}
.little_black {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: rgba(141, 141, 141, 1);
    border-radius: 50%;
    opacity: 1;
    margin-bottom: 3px;
}
</style>