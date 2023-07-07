<template >
    <div class="evaluation_main">
        <banner @show-aside="toggle"></banner>
        <definition></definition>
        <benefit @show-aside="toggle"></benefit>
        <!-- <difference></difference> -->
        <contain></contain>
        <process></process>
        <div v-if="showStatus == true">
            <aside-apply @hidden="hidden"></aside-apply>
        </div>
    </div>
</template>
<script>
import Banner from "@/components/evaluation/banner";
import definition from "@/components/evaluation/definition";
import benefit from "@/components/evaluation/benefit";
// import difference from "@/components/evaluation/difference";
import contain from "@/components/evaluation/content";
import process from "@/components/evaluation/process";
import asideApply from "@/components/evaluation/asideApply";
export default {
    head () {
        return {
            title: '卧涛网-成果评价',
        }
    },
    data() {
        return {
            showStatus: false
        };
    },
    components: {
        Banner,
        definition,
        benefit,
        // difference,
        contain,
        process,
        asideApply
    },
    methods: {
        hidden() {
            this.showStatus = false;
        },
        toggle() {
            this.showStatus = true;
            }
    }   
};
</script>

<style scoped>
.evaluation_main {
    width: 100%;
    background: rgba(245, 245, 245, 1);
}