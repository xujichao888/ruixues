<template>
  <form-plus
    v-if="useSearchForm"
    ref="formRef"
    :fields="searchFormFields"
    :rules="searchFormRules"
    inline
    size="mini"
    :gutter="gutter"
    :base-cl-props="baseColProps"
    :loading="loading"
    :hide-label="hideLabel"
    :advance-lines="advanceLines"
    @submit="submit()"
    @reset="reset()"
  >
    <template #[item]="formSlotProps" v-for="item of ['prepend', 'append', 'after']">
      <slot :name="`form-${item}`" v-bind="formSlotProps"></slot>
    </template>
  </form-plus>
  <el-table
    ref="tableRef"
    v-loading="loading"
    v-bind="$attrs"
    :data="dataSource"
    :max-height="maxHeight"
    :size="size"
    @selection-change="handleselectionChange"
  >
    <column-item
      v-for="col in rebuildColumns"
      :key="col.prop"
      :column="col"
      :action-column-key="actionsColumn.prop"
      :rules="formRules"
      :edit-rows="editRows"
      @row-change="(field, value, index) => (editRows[index][field] = value)"
    >
      <!-- body cell -->
      <template
        #[`${SlotsPrefix.BODY_CELL}${col.prop}`]="cellProps"
        v-if="$slots[`${SlotsPrefix.BODY_CELL}${col.prop}`]"
      >
        <slot :name="`${SlotsPrefix.BODY_CELL}${col.prop}`" v-bind="cellProps"></slot>
      </template>
      <!-- header cell -->
      <template
        #[`${SlotsPrefix.HEADER_CELL}${col.prop}`]="cellProps"
        v-if="$slots[`${SlotsPrefix.HEADER_CELL}${col.prop}`]"
      >
        <slot :name="`${SlotsPrefix.HEADER_CELL}${col.prop}`" v-bind="cellProps"></slot>
      </template>
      <!-- action column -->
      <template
        #[`${SlotsPrefix.BODY_CELL}${actionsColumn.prop}`]="cellProps"
        v-if="col.prop === actionsColumn.prop"
      >
        <slot :name="`${SlotsPrefix.BODY_CELL}${col.prop}`" v-bind="cellProps">
          <actions-column
            :row-editable="rowEditable"
            :row="cellProps.row"
            :actions="actions"
            :column="col"
            :index="cellProps.$index"
            :edit-rows="editRows"
            :fields="formFields"
            @save="handleRowSave"
            @edit="handleRowEdit"
            @cancel="handleRowCancel"
          >
            <template #default="actionsAppendProps">
              <slot name="actions-default" v-bind="actionsAppendProps"></slot>
            </template>
            <template #append="actionsAppendProps">
              <slot name="actions-append" v-bind="actionsAppendProps"></slot>
            </template>
          </actions-column>
        </slot>
      </template>
    </column-item>
  </el-table>
  <section ref="toolbarRef" v-if="!isHidden || rebuildBatchActions.length" class="toolbar">
    <el-scrollbar class="batch-actions">
      <action-confirm
        v-for="act in rebuildBatchActions"
        :key="act.label"
        size="small"
        :action="act"
        @confirm="handleActionClick(act.onClick, $event)"
      >
        {{ act.label }}
      </action-confirm>
    </el-scrollbar>
    <el-pagination
      v-if="!isHidden && getPaginationInfo"
      :current-page="getPaginationInfo.currentPage"
      :page-sizes="getPaginationInfo.pageSizes"
      :page-size="getPaginationInfo.pageSize"
      :total="getPaginationInfo.total"
      :layout="getPaginationInfo.layout"
      :pager-count="getPaginationInfo.pagerCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </section>
</template>

<script lang="ts">
import { cloneDeep, get, isBoolean, isFunction } from 'lodash'
import {
  ComponentPublicInstance,
  computed,
  defineComponent,
  onMounted,
  ref,
  unref,
  watch,
} from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import { actionsColumnDefault, pageFieldDefault, SlotsPrefix } from './constant'
import ColumnItem from './table-column.vue'
import ActionsColumn from './table-actions.vue'
import FormPlus from '@/components/form-plus'
import type {
  ElTableExpose,
  FetchParams,
  PageField,
  Pagination,
  TableAction,
  TableColumn,
  TablePlusExpose,
} from './types'
import { usePagination } from './hooks/use-pagination'
import useRowEdit from './hooks/use-row-edit'
import { filterDeep, processDeep } from '@/utils/array'
import { RuleItem } from 'async-validator'
import useChildrenExpose from '@/hooks/use-children-expose'
import ActionConfirm from './components/action-confirm.vue'
import type { ColProps, FormPlusExpose } from '../form-plus/types'
import { getActionButton } from './utils'

export default defineComponent({
  name: 'TablePlus',
  components: {
    ActionsColumn,
    ColumnItem,
    FormPlus,
    ActionConfirm,
  },
  props: {
    data: {
      type: Array as PropType<Recordable[]>,
      default: () => [],
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => [],
    },
    fit: Boolean,
    size: {
      type: String,
      default: 'small',
    },
    // data fetch
    request: {
      type: Function,
    },
    immediate: {
      type: Boolean,
      default: true,
    },
    beforeFetch: {
      type: Function,
    },
    afterFetch: {
      type: Function,
    },
    // actions
    batchActions: {
      type: Array as PropType<TableAction[]>,
      default: () => [],
    },
    rowEditable: Boolean,
    actionsColumn: {
      type: Object as PropType<TableColumn>,
      default: () => actionsColumnDefault,
    },
    actions: {
      type: Array as PropType<TableAction[]>,
      default: () => [],
    },
    // search form
    useSearchForm: Boolean,
    gutter: Number,
    baseColProps: Object as PropType<ColProps>,
    submitOnReset: {
      type: Boolean,
      default: true,
    },
    extraSearchData: Object,
    hideLabel: Boolean,
    advanceLines: Number,
    // pageination
    hidePagination: Boolean,
    pagination: {
      type: Object as PropType<Pagination>,
      default: () => ({}),
    },
    pageField: {
      type: Object as PropType<PageField>,
      default: pageFieldDefault,
    },
    // fix: emits 内的事件无法通过 props / attrs 获取
    onFetchError: Function,
  },
  emits: [
    // pagination
    'update:current-page',
    'update:page-size',
    'size-change',
    'current-change',
    'update:loading',
    'fetch-error',
    'fetch-success',
    'row-save',
  ],
  setup(props, { emit, attrs, slots, expose }) {
    const formRef = ref<ComponentPublicInstance<{}, FormPlusExpose>>()
    const tableRef = ref<InstanceType<typeof ElTable>>()
    const loading = ref(false)
    const dataSource = ref<Recordable[]>(props.data)
    const maxHeight = ref<number>()
    const selection = ref<Recordable[]>([])
    const rebuildProps = computed(() => {
      const pageField = {
        ...pageFieldDefault,
        ...props.pageField,
      }
      return {
        ...props,
        pageField,
      }
    })
    const searchFormFields = computed(() => {
      const columns = props.columns
      const flattenColumns = filterDeep<TableColumn>(columns, (col) => !!col.useInSearchForm)
      return flattenColumns
    })
    const searchFormModel = computed(() => formRef.value?.getFieldsValue() || {})
    const searchFormRules = computed(() => {
      const result: Recordable<RuleItem[]> = {}
      unref(searchFormFields).forEach(({ rules, searchRules, prop }) => {
        if (searchRules || rules) result[prop as string] = (searchRules || rules)!
      })
      return result
    })
    const formFields = computed(() => {
      const columns = props.columns
      const flattenColumns = filterDeep<TableColumn>(
        columns,
        (col) => !!(col.component && !col.hideOnEdit)
      )
      return flattenColumns
    })
    const formRules = computed(() => {
      const result: Recordable<RuleItem[]> = {}
      unref(formFields).forEach(({ rules, editRules, prop }) => {
        if (editRules || rules) result[prop as string] = (editRules || rules)!
      })
      return result
    })
    const rebuildColumns = ref<TableColumn[]>([])
    const rebuildBatchActions = ref<TableAction[]>([])
    const editRows = ref<Recordable>({})
    // pagination
    const { getPaginationInfo, isHidden, setHidePagination, setPagination } =
      usePagination(rebuildProps)

    async function fetchTable(options?: FetchParams) {
      try {
        await formRef.value?.validate()
      } catch (error) {
        return
      }

      const {
        request,
        pageField: { listField, totalField, pageField, sizeField },
        pagination,
        beforeFetch,
        afterFetch,
      } = unref(rebuildProps)

      if (!request || !isFunction(request)) {
        return
      }

      try {
        setLoading(true)
        let pageParams: Recordable = {}
        const { currentPage = 1, pageSize } = unref(getPaginationInfo) as Pagination

        if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
          pageParams = {}
        } else {
          pageParams[pageField] = options?.page || currentPage
          pageParams[sizeField] = pageSize
        }

        let params: Recordable = {
          ...pageParams,
          ...unref(searchFormModel),
          ...props.extraSearchData,
          ...options?.searchData,
        }
        if (beforeFetch && isFunction(beforeFetch)) {
          params = beforeFetch(params) || params
        }
        const res = await request(params)

        let resultItems = get(res, listField) || []
        if (afterFetch && isFunction(afterFetch)) {
          resultItems = afterFetch(resultItems) || resultItems
        }

        dataSource.value = resultItems
        const total = get(res, totalField, 0)
        setPagination({
          total,
        })
        if (options?.page) {
          setPagination({
            currentPage: options.page || 1,
          })
        }
        emit('fetch-success', {
          items: unref(resultItems),
          total,
        })
      } catch (error) {
        emit('fetch-error', error)
        if (!props.onFetchError) {
          ElMessage.error(error.message)
        }
        dataSource.value = []
        setPagination({
          total: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    function handleCurrentChange(page: number) {
      fetchTable({ page })
      emit('update:current-page', page)
      emit('current-change', page)
    }

    function handleSizeChange(size: number) {
      setPagination({
        pageSize: size,
      })
      fetchTable({ page: 1 })
      emit('update:page-size', size)
      emit('size-change', size)
    }

    function setLoading(bool: boolean) {
      loading.value = bool
    }

    function calcMaxHeight() {
      const el = unref(tableRef)?.$el
      if (el) {
        const offsetTop = el.offsetTop
        const toolbarContainerHeight = document.body.offsetHeight - offsetTop - el.offsetHeight
        maxHeight.value = window.innerHeight - offsetTop - toolbarContainerHeight
      }
    }

    function handleActionClick(handler: TableAction['onClick'], index: number) {
      if (handler && isFunction(handler)) {
        handler(unref(selection), index)
      }
    }

    function handleselectionChange(options: Recordable[]) {
      const { onSelectionChange } = attrs
      if (onSelectionChange && isFunction(onSelectionChange)) {
        onSelectionChange(options)
      }
      selection.value = options
    }

    function reload(options?: FetchParams) {
      submit(options)
    }

    function submit(options?: FetchParams) {
      fetchTable({
        ...options,
        page: 1,
      })
    }

    function reset(options?: FetchParams) {
      if (props.submitOnReset) {
        submit(options)
      }
    }

    function addRow(defaultData?: Recordable, append?: boolean) {
      const row = {
        ...defaultData,
      }
      let index = 0
      if (append) {
        index = dataSource.value.length
        dataSource.value.push(row)
      } else {
        dataSource.value.unshift(row)
      }
      return [row, index]
    }

    const { handleRowEdit, handleRowSave, handleRowCancel } = useRowEdit({
      dataSource,
      editRows,
      emit,
    })

    const editRow = handleRowEdit

    function getRowByIndex(index: number) {
      return dataSource.value[index]
    }

    function updateRowByIndex(index: number, values: Recordable) {
      const row = getRowByIndex(index)
      if (row) {
        Object.assign(row, values)
      }
    }

    function removeRowByIndex(index: number) {
      delete editRows.value[index]
      delete dataSource.value[index]
    }

    onMounted(() => {
      if (unref(rebuildProps).immediate) submit()
      props.fit && calcMaxHeight()
    })

    watch(() => unref(rebuildProps).hidePagination, setHidePagination, { immediate: true })
    watch(
      [() => props.rowEditable, () => props.columns],
      ([rowEditable, cols]) => {
        const result = cloneDeep(cols)
        if (
          rowEditable ||
          props.actions.length ||
          slots['actions-append'] ||
          slots['actions-default']
        ) {
          result.push({
            ...actionsColumnDefault,
            ...props.actionsColumn,
          })
        }
        rebuildColumns.value = processDeep<TableColumn>(result, (item) => {
          return item
        })
      },
      { immediate: true, deep: true }
    )
    watch(
      () => props.batchActions,
      (actions) => {
        rebuildBatchActions.value = actions.map((act) => getActionButton(act))
      },
      { immediate: true, deep: true }
    )

    useChildrenExpose({
      expose,
      children: [
        {
          methods: [
            'validate',
            'clearValidate',
            'resetFields',
            'validateField',
            'updateFieldsValue',
            'getFieldsValue',
            'updateFieldValueByKey',
          ] as (keyof FormPlusExpose)[],
          component: formRef,
        },
        {
          methods: [
            'clearSelection',
            'toggleRowSelection',
            'toggleAllSelection',
            'toggleRowExpansion',
            'setCurrentRow',
            'clearSort',
            'clearFilter',
            'doLayout',
            'sort',
          ] as (keyof ElTableExpose)[],
          component: tableRef,
        },
      ],
      methods: {
        reload,
        getPaginationInfo: () => unref(getPaginationInfo),
        addRow,
        editRow,
        getRowByIndex,
        updateRowByIndex,
        removeRowByIndex,
      } as TablePlusExpose,
    })

    return {
      formRef,
      tableRef,
      dataSource,
      loading,
      setLoading,
      isHidden,
      maxHeight,
      searchFormFields,
      searchFormRules,
      formFields,
      formRules,
      SlotsPrefix,
      submit,
      reset,
      editRows,
      rebuildColumns,
      rebuildBatchActions,
      handleCurrentChange,
      handleSizeChange,
      handleActionClick,
      handleselectionChange,
      handleRowEdit,
      handleRowSave,
      handleRowCancel,
      getPaginationInfo,
    }
  },
})
</script>

<style lang="scss" scoped>
$space-h: 10px;

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-top: $space-h;
}

.el-table {
  &::v-deep(.cell) {
    .el-form-item:not(.is-error) {
      margin-bottom: 0;
    }

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      max-width: 100%;
    }
  }
}
</style>
