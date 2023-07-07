<template>
  <div v-if="columnBox">
    <el-drawer
      :direction="'rtl'"
      lock-scroll
      :modal-append-to-body="$AVUE.modalAppendToBody"
      :append-to-body="$AVUE.appendToBody"
      title="列显隐"
      :size="'30%'"
      :visible.sync="columnBox">
      <el-table :data="data" ref="table" height="100%" size="small" border>
        <el-table-column
          align="center"
          header-align="center"
          prop="label"
          key="label"
          label="列名">
        </el-table-column>
        <template v-for="(item, index) in defaultColumn">
          <el-table-column
            :label="item.label"
            v-if="item.hide !== true"
            :prop="item.prop"
            :key="index"
            align="center"
            header-align="center">
            <template slot-scope="{ row }">
              <el-checkbox
                @change="handleChange(item.prop)"
                v-model="row[item.prop]">
              </el-checkbox>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-drawer>
  </div>
</template>
<script>
import config from "./config.js";
export default {
  inject: ["crud"],
  data() {
    return {
      data: [],
      columnBox: false,
    };
  },
  computed: {
    defaultColumn() {
      return [
        {
          label: "隐藏",
          prop: "hide",
        },
      ];
    },
  },
  methods: {
    handleShow() {
      this.data = [];
      this.crud.$refs.crud.propOption.forEach((column) => {
        if (column.showColumn != false) this.data.push(column);
      });
      this.columnBox = true;
      this.$nextTick(() => this.rowDrop())
    },
    handleChange(prop) {
      if (["hide", "filters"].includes(prop)) {
        this.crud.$refs.crud.refreshTable();
        this.$emit('hideColumn',this.data)
      }
    },
    rowDrop() {
      const el = this.$refs.table.$el.querySelectorAll(config.dropRowClass)[0];
      this.crud.$refs.crud.tableDrop("column", el, (evt) => {
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;
        this.crud.$refs.crud.headerSort(oldIndex, newIndex);
        this.crud.$refs.crud.refreshTable(() => this.rowDrop());
      });
    },
  },
};
</script>

<style scoped>

</style>
