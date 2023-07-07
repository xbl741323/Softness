<template>
    <div class="frame">
        <span class="spa">技术描述：</span>
        <div style="min-height:100px">
            <p class="ql-editor" v-html="data.technicalDesc" ></p>
        </div>
        <!-- <span class="spa">技术优势：</span>
        <div style="margin:0 40px;min-height:100px">
            <p v-html="data.ownership"></p>
        </div> -->
    </div>
</template>

<script>
export default {
    props:['data'],
    mounted(){
        // console.log(this.data)
    }
}
</script>

<style lang="scss" scoped>
.frame{
   margin: 20px;
    .spa{
         margin-left :-20px;
        font-size:16px;
        font-family:Microsoft YaHei;
        font-weight:bold;
        line-height:26px;
        color:rgba(112,112,112,1);
        opacity:1;  
    }
      
}
    
.frame p{
   font-size:14px;
    text-indent :2em;
    font-family:Microsoft YaHei;
    font-weight:400;
    line-height:24px;
    color:rgba(112,112,112,1);
    opacity:1;
    .ql-editor li::before{
        display: inline-block; 
        white-space: nowrap; 
        width:0; 
    } 
}
    
</style>