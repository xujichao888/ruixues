<template>
  <el-dialog v-model="productDialogShow" width="50%" @close="productresetSome" top="100px">
    <template #title>
      <div class="dialog-product-title">{{ productDailogTitle }}</div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="productTriggerDailog" size="small">取 消</el-button>
        <el-button type="primary" @click="productDailogFormSub" size="small">确 定</el-button>
      </span>
    </template>
    <i-form
      ref="Form"
      :formData="formData"
      :needToast="true"
      :form-cols="formCols"
      :rules="rules"
      @event="productEvent"
    >
    </i-form>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
interface Icallback {
  (message?: string | Error | undefined): Error | void
}
type rule = {
  field: string
  fullField: string
  type: string
  _callback: Icallback
}
const validatorPass = (_rule: rule, _value: boolean, _callback: Icallback): void => {
  let { field } = _rule
  if (field == 'channelLogo' && !_value) {
    _callback(new Error('请上传渠道logo'))
  }
  _callback()
}
export default defineComponent({
  setup() {
    const productDialogShow = ref(false)
    const productFileList = ref([])
    const productDailogTitle = ref('添加chanp')
    const productDate = reactive({
      show: false,
      tiem: '',
      rules: {
        channelID: [{ required: true, message: '请输入渠道ID', trigger: 'change' }],
        channelName: [{ required: true, message: '请输入渠道ID', trigger: 'change' }],
        channelLogo: [{ required: true, validator: validatorPass, trigger: 'blur' }],
      },
      formData: {
        channelID: '',
        channelName: '',
        channelLogo: false,
        channelType: '',
        channelClassify: '',
        percent: '',
      },
      formCols: [
        [
          {
            eType: 'Input',
            placeholder: '请输入渠道ID',
            label: '渠道ID',
            prop: 'channelID',
            noShow: false,
            span: 18,
            clearable: true,
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '请输入渠道名称',
            label: '渠道名称',
            prop: 'channelName',
            noShow: false,
            span: 18,
            clearable: true,
          },
        ],
        [
          {
            eType: 'slot',
            label: '渠道logo',
            slotName: 'channelLogo',
            prop: 'channelLogo',
            span: 18,
          },
        ],
        [
          {
            eType: 'Radio',
            label: '渠道类型',
            options: [
              { label: 'APP', value: '0' },
              { label: '小游戏', value: '1' },
              { label: 'H5', value: '2' },
            ],
            prop: 'channelType',
            span: 24,
          },
        ],
        [
          {
            eType: 'Select',
            label: '渠道分类',
            placeholder: '未分类',
            options: [
              { label: '自有渠道', value: '0' },
              { label: '联动渠道', value: '2' },
              { label: '地推渠道', value: '3' },
              { label: '线上渠道', value: '4' },
              { label: '自定义', value: '5' },
            ],
            prop: 'channelClassify',
            span: 12,
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '未配置',
            label: '利润分成%',
            prop: 'percent',
            noShow: false,
            span: 12,
            clearable: true,
          },
        ],
      ],
    })
    const productresetSome = () => {}
    const productTriggerDailog = () => {}
    const productDailogFormSub = () => {}
    const handleProductUploadchange = () => {}
    const productEvent = () => {}
    return {
      productDailogTitle,
      productDialogShow,
      productFileList,
      ...toRefs(productDate),
      productresetSome,
      productTriggerDailog,
      productDailogFormSub,
      handleProductUploadchange,
      productEvent,
    }
  },
})
</script>


<style lang="scss" scope>
.dialog-product-title {
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.2);
  padding-bottom: 10px;
}
</style>