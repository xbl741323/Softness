<template>
    <div class="evalution_definition">
        <div class="define_main">
            <div class="define_title">成果评价定义</div>
            <div class="define_desc">科技成果转化是落实“科学技术是第一生产力”的关键</div>
            <div class="define_intro">
                <div class="intro_left">
                    <div class="left_title">科技成果评价</div>
                    <div class="left_desc">
                        是通过国家专业机构组织权威专家依照规定程序和标准，对科技成果进行审查与辨别，
                        对其科学性、创造性、先进性、可行性和应用前景等进行科学客观全面评价，最终形成权威评价结果
                    </div>
                    <div class="left_desc2">具备科学性、创造性、先进性等属性</div>
                    <div class="left_desc3">应用技术成果、基础研究成果和软科学研究成果</div>
                </div>
                <div class="intro_right">
                    <img :src="require('@/assets/images/'+'cgpj/img_cgpj01.png')" alt />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {};
</script>
<style scoped>
.evalution_definition {
    padding-top:20px;
    width: 100%;
    height: 428px;
    background: #ffffffff;
    font-family: "Microsoft YaHei UI";
}
.define_main {
    width: 1200px;
    height: 428px;
    /* background: lightYellow; */
    margin: 0 auto;
}
.define_title {
    width: 159px;
    height: 33px;
    font-size: 26px;
    font-weight: bold;
    color: rgba(68, 77, 90, 1);
    opacity: 1;
    margin: 0 auto;
    padding-bottom: 10px;
}
.define_desc {
    width: 390px;
    height: 20px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(147, 150, 155, 1);
    opacity: 1;
    margin: 0 auto;
}
.define_intro {
    display: flex;
    width: 1200px;
    height: 325px;
}
.intro_left {
    width: 610px;
    height: 100%;
    padding-left: 40px;
}
.left_title {
    padding-top: 68px;
    width: 122px;
    height: 25px;
    font-size: 20px;
    font-weight: 400;
    color: rgba(72, 77, 84, 1);
    opacity: 1;
}
.left_desc {
    margin-top: 20px;
    text-align: left;
    width: 620px;
    height: 68px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(147, 150, 155, 1);
    opacity: 1;
}
.left_desc2 {
    margin-top: 8px;
    width: 262px;
    height: 20px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(147, 150, 155, 1);
    opacity: 1;
}
.left_desc3 {
    width: 344px;
    height: 20px;
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
    color: rgba(147, 150, 155, 1);
    opacity: 1;
}
.intro_right {
    margin-top: 30px;
    width: 580px;
    height: 295px;
    margin-left: 45px;
}
</style>