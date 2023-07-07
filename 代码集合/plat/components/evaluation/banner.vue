<template>  
    <div>
        <div class="banner">
            <div style="width:1200px;margin:0 auto;">
                <p class="first">国家级高新技术企业</p>
                <p class="second">安徽省技术转移服务机构</p>
                <p class="third">合肥市中小企业公共服务示范平台</p>
                <div class="banner_request" @click="toggle">立即咨询</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        };
    },
    methods: {
        toggle() {
            window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
        }
    }
};
</script>

<style scoped>
.banner {
    width: 100%;
    min-width:1200px;
    height: 416px;
    background-image: url('~assets/images/cgpj/banner-achievement@2x.png');
    background-size:cover;
    background-position:bottom center;
}
.banner_request {
    width: 222px;
    height: 34px;
    background: rgba(255, 205, 104, 1);
    line-height: 34px;
    text-align: center;
    font-weight: 400;
    color: rgba(91, 91, 91, 1);
    opacity: 1;
    border-radius: 20px;
    cursor: pointer;
    margin-top:50px;
}
.first{
    color: #FFF;
    padding-top:180px;
}
.second{
    color: #FFF;
}
.third{
    color: #FFF;
}
</style>

