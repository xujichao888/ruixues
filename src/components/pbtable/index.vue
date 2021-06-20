<template>
  <el-table
    :data="tableData"
    :header-cell-style="{ background: '#FAFAFA' }"
    :style="styles"
    ref="tableRef"
    fit
    border
    stripe
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" v-if="isUserSelection" />
    <el-table-column
      v-for="item in columnArr"
      :prop="item.prop"
      :label="item.label"
      :key="item.randomId"
      :width="item.width"
      :sortable="item.sortable"
    >
      <template #default="scope">
        <el-space v-if="item.action">
          <span
            v-for="(i, idx) in item.action"
            :key="idx"
            @click="i.btnCallBack(scope.$index, scope.row)"
          >
            <el-button :type="i.btnType" size="mini">{{ i.btnText }}</el-button>
          </span>
        </el-space>
        <img v-if="item.imgObj" :src="scope.row.icon" :style="item.imgObj.style" />
        <span>{{ scope.row[item.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
  <div class="paginations" v-if="isUserPagination">
    <el-pagination
      @size-change="pagination.handleSizeChange"
      @current-change="pagination.handleCurrentChange"
      :current-page="pagination.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    tableData: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
    columnArr: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
    pagination: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        handleSizeChange() {},
        handleCurrentChange() {},
        current: 1,
        pageSize: 10,
      },
    },
    styles: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        width: '100%',
        marginTop: '20px',
      },
    },
    isUserPagination: {
      type: Boolean,
      default: true,
    },
    isUserSelection: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['selectionChange'],
  setup(_props, { emit }) {
    const handleSelectionChange = (val: any) => {
      emit('selectionChange', val)
    }
    return {
      handleSelectionChange,
    }
  },
})
</script>

<style lang="scss" scope>
.paginations {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
