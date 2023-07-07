<template>
    <div class="frame">
        <div class="course_content">
            <ul class="member-wrapper">
                <li
                    :class="[{'member-last' : (index+1) % 4 === 0},'member-list']"
                    v-for="(item,index) of List"
                    :key="item.id"
                >
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
.frame{
    width:100%;
    font-family:Microsoft YaHei UI;
    .course_content{
        width:100%;
        .member-wrapper {
            margin-top: 30px;
            width: 100%;
            display: inline-block;
            .member-last {
              margin-right: 0 !important;
              box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
            }
            .member-list {
              text-align: center;
              background: rgba(255, 255, 255, 1);
              width: 208px;
              height: 236px;
              float: left;
              margin-right: 5%;
              margin-bottom: 40px;
              box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
            }
    }
}
</style>