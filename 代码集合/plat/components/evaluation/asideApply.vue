<template>
    <div class="aside">
        <div class="aside-tite">成果评价申请</div>
        <span class="cancel_aside" @click="hiddenAside">+</span>
        <div class="aisde-input">
            <el-form :model="form" :rules="rules" ref="form">
                <div style="position:relative;">
                    <span style="position:absolute;color:#3D85DC;left:-12px;top:10px;font-size:16px;">*</span>
                    <el-form-item style="margin-top:-12px;" prop="productName">
                        <el-input v-model="form.productName" size="medium" placeholder="成果名称"></el-input>
                    </el-form-item>
                </div>
                <el-form-item style="margin-top:-12px;" prop="firm">
                    <el-input v-model="form.firm" size="medium" placeholder="完成单位"></el-input>
                </el-form-item>
                <el-form-item label prop="address" style="margin-top:-12px;">
                    <el-cascader
                        size="medium"
                        :options="options"
                        v-model="form.address"
                        @change="handleChange"
                        placeholder="所在地区"
                        style="width:100%;"
                    ></el-cascader>
                </el-form-item>
                <div style="position:relative;">
                    <span style="position:absolute;color:#3D85DC;left:-12px;top:10px;font-size:16px;">*</span>
                    <el-form-item style="margin-top:-12px;" prop="contractName">
                        <el-input v-model="form.contractName" size="medium" placeholder="联系姓名"></el-input>
                    </el-form-item>
                </div>
                <div style="position:relative;">
                    <span style="position:absolute;color:#3D85DC;left:-12px;top:10px;font-size:16px;">*</span>
                    <el-form-item style="margin-top:-12px;" prop="telephone">
                        <el-input v-model="form.telephone" size="medium" placeholder="联系电话"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="aside-button" style="margin-top:-8px;" @click="submit('form')">提交申请</div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    methods: {
        hiddenAside() {
            this.$emit("hidden");
        },
        handleChange(value) {

        },
    }
};
</script>

<style scoped>
.aside {
  position: fixed;
  width: 450px;
  height: 400px;
  background: rgba(255, 255, 255,255);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Microsoft YaHei";
}
.aside-tite {
  width: 110px;
  height: 24px;
  font-size: 17px;
  font-weight: bold;
  line-height: 24px;
  color: #3d85dc;
  opacity: 1;
  margin-bottom: 15px;
}
.aisde-input {
  width: 78%;
  margin: 10px 0px;
  margin-bottom: 5px;
  /* background: red; */
}

.aside-button {
  width: 226px;
  height: 32px;
  background: #3d85dc;
  opacity: 1;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 32px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}
.cancel_aside {
  position: absolute;
  display: inline-block;
  /* background: red; */
  top: 5px;
  right: 5px;
  font-size: 25px;
  transform: rotate(45deg);
  cursor: pointer;
  color: #3d85dc;
}
</style>