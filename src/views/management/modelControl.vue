<template>
  <div class="model-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      class="create-model"
      size="mini"
      @click="
        () => {
          modelDailogTitle = '创建模块'
          modelDialogShow = true
        }
      "
      >创建模块</el-button
    >
    <el-tabs v-model="tabActive" @tab-click="handleTabClick">
      <el-tab-pane label="子游戏模块" name="1">
        <pbTable :tableData="tableData" :columnArr="columnArr" :pagination="pagination" />
      </el-tab-pane>
      <el-tab-pane label="通用模块" name="2">
        <pbTable :tableData="tableData" :columnArr="columnArr" :pagination="pagination" />
      </el-tab-pane>
    </el-tabs>
  </div>
  <el-dialog v-model="modelDialogShow" width="50%" @close="modelresetSome" top="100px">
    <template #title>
      <div class="dialog-product-title">{{ modelDailogTitle }}</div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="
            () => {
              modelDialogShow = false
            }
          "
          size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="modelDailogFormSub" size="small">确 定</el-button>
      </span>
    </template>
    <i-form
      ref="Form"
      :formData="modelDate.formData"
      :needToast="true"
      :form-cols="modelDate.formCols"
      :rules="modelDate.rules"
      @event="modelEvent"
    >
      <template #channelLogo>
        <el-upload
          class="upload-demo"
          ref="modelUploadRef"
          action="https://jsonplaceholder.typicode.com/posts/"
          :limit="1"
          :file-list="modelFileList"
          :on-change="handlemodelUploadchange"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </template>
    </i-form>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import pbTable from '@/components/pbtable/index.vue'
import iForm from '@/components/iForm/zxForm.vue'
import { nanoid } from 'nanoid'
// interface Icallback {
//   (message?: string | Error | undefined): Error | void
// }
// type rule = {
//   field: string
//   fullField: string
//   type: string
//   _callback: Icallback
// }
// const validatorPass = (_rule: rule, _value: boolean, _callback: Icallback): void => {
//   let { field } = _rule
//   if (field == 'channelLogo' && !_value) {
//     _callback(new Error('请上传渠道logo'))
//   }
//   _callback()
// }
export default defineComponent({
  components: {
    pbTable,
    iForm,
  },
  setup() {
    const tabActive = ref('1')

    const modelUploadRef = ref()
    const modelDialogShow = ref(false)
    const modelFileList = ref([])
    const modelDailogTitle = ref('创建模块')
    const modelDate = reactive({
      show: false,
      tiem: '',
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        characteristic: [{ required: true, message: '请输入标识', trigger: 'change' }],
      },
      formData: {
        name: '',
        characteristic: '',
        modelType: '',
        gameType: '',
        region: '',
        team: '',
        onlineState: '',
        isAvalible: '',
        params: '',
      },
      formCols: [
        [
          {
            eType: 'Input',
            placeholder: '请输入模块名称',
            label: '名称',
            prop: 'name',
            noShow: false,
            span: 18,
            clearable: true,
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '请输入标识',
            label: '标识',
            prop: 'characteristic',
            noShow: false,
            span: 18,
            clearable: true,
          },
        ],
        [
          {
            eType: 'Radio',
            label: '模式类型',
            options: [
              { label: '子游戏', value: '0' },
              { label: '通用模块', value: '1' },
            ],
            prop: 'modelType',
            span: 24,
          },
        ],
        [
          {
            eType: 'Radio',
            label: '游戏类型',
            options: [
              { label: '扑克', value: '0' },
              { label: '麻将', value: '1' },
              { label: '休息', value: '2' },
            ],
            prop: 'gameType',
            span: 24,
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
            eType: 'Select',
            label: '所属地区',
            placeholder: '全国',
            options: [
              { label: '地区1', value: '0' },
              { label: '地区2', value: '2' },
              { label: '地区3', value: '3' },
              { label: '地区4', value: '4' },
              { label: '地区5', value: '5' },
            ],
            prop: 'region',
            span: 12,
          },
        ],
        [
          {
            eType: 'Select',
            label: '所属项目组',
            placeholder: '请选择',
            options: [
              { label: '组1', value: '0' },
              { label: '组2', value: '2' },
              { label: '组3', value: '3' },
              { label: '组4', value: '4' },
              { label: '组5', value: '5' },
            ],
            prop: 'team',
            span: 12,
          },
        ],
        [
          {
            eType: 'Radio',
            label: '上线状态',
            options: [
              { label: '已上线', value: '0' },
              { label: '未上线', value: '1' },
            ],
            prop: 'onlineState',
            span: 24,
          },
        ],
        [
          {
            eType: 'Radio',
            label: '启用状态',
            options: [
              { label: '启用', value: '0' },
              { label: '禁用', value: '1' },
            ],
            prop: 'isAvalible',
            span: 24,
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '无',
            label: '自定义参数',
            type: 'textarea',
            rows: '4',
            prop: 'params',
            noShow: false,
            span: 18,
            clearable: true,
          },
        ],
      ],
    })

    const handleTabClick = (_tab: any) => {
      console.log(_tab)
    }
    const tableData = ref([
      {
        id: '1',
        name: '斗地主',
        gameType: '扑克',
        characteristic: 'ddxs',
        team: '系统组',
        region: '2020-11-11',
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi9.download.fd.pchome.net%2Fg1%2FM00%2F0F%2F0C%2FoYYBAFU99YSIWMoYAAEa8gwaOXoAACcEgFczfQAARsK765.png&refer=http%3A%2F%2Fi9.download.fd.pchome.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626226265&t=f353e9ec8224870ea79af30dc6c6881e',
        onlineState: '已上线',
        isAvalible: '禁用',
        params: '123',
      },
      {
        id: '1',
        name: '斗地主',
        gameType: '扑克',
        characteristic: 'ddxs',
        team: '系统组',
        region: '2020-11-11',
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi9.download.fd.pchome.net%2Fg1%2FM00%2F0F%2F0C%2FoYYBAFU99YSIWMoYAAEa8gwaOXoAACcEgFczfQAARsK765.png&refer=http%3A%2F%2Fi9.download.fd.pchome.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626226265&t=f353e9ec8224870ea79af30dc6c6881e',
        onlineState: '已上线',
        isAvalible: '禁用',
        params: '123',
      },
      {
        id: '1',
        name: '斗地主',
        gameType: '扑克',
        characteristic: 'ddxs',
        team: '系统组',
        region: '2020-11-11',
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi9.download.fd.pchome.net%2Fg1%2FM00%2F0F%2F0C%2FoYYBAFU99YSIWMoYAAEa8gwaOXoAACcEgFczfQAARsK765.png&refer=http%3A%2F%2Fi9.download.fd.pchome.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626226265&t=f353e9ec8224870ea79af30dc6c6881e',
        onlineState: '已上线',
        isAvalible: '禁用',
        params: '123',
      },
      {
        id: '1',
        name: '斗地主',
        gameType: '扑克',
        characteristic: 'ddxs',
        team: '系统组',
        region: '2020-11-11',
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi9.download.fd.pchome.net%2Fg1%2FM00%2F0F%2F0C%2FoYYBAFU99YSIWMoYAAEa8gwaOXoAACcEgFczfQAARsK765.png&refer=http%3A%2F%2Fi9.download.fd.pchome.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626226265&t=f353e9ec8224870ea79af30dc6c6881e',
        onlineState: '已上线',
        isAvalible: '禁用',
        params: '123',
      },
      {
        id: '1',
        name: '斗地主',
        gameType: '扑克',
        characteristic: 'ddxs',
        team: '系统组',
        region: '2020-11-11',
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi9.download.fd.pchome.net%2Fg1%2FM00%2F0F%2F0C%2FoYYBAFU99YSIWMoYAAEa8gwaOXoAACcEgFczfQAARsK765.png&refer=http%3A%2F%2Fi9.download.fd.pchome.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626226265&t=f353e9ec8224870ea79af30dc6c6881e',
        onlineState: '已上线',
        isAvalible: '禁用',
        params: '123',
      },
      {
        id: '1',
        name: '斗地主',
        gameType: '扑克',
        characteristic: 'ddxs',
        team: '系统组',
        region: '2020-11-11',
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi9.download.fd.pchome.net%2Fg1%2FM00%2F0F%2F0C%2FoYYBAFU99YSIWMoYAAEa8gwaOXoAACcEgFczfQAARsK765.png&refer=http%3A%2F%2Fi9.download.fd.pchome.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626226265&t=f353e9ec8224870ea79af30dc6c6881e',
        onlineState: '已上线',
        isAvalible: '禁用',
        params: '123',
      },
      {
        id: '1',
        name: '斗地主',
        gameType: '扑克',
        characteristic: 'ddxs',
        team: '系统组',
        region: '2020-11-11',
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi9.download.fd.pchome.net%2Fg1%2FM00%2F0F%2F0C%2FoYYBAFU99YSIWMoYAAEa8gwaOXoAACcEgFczfQAARsK765.png&refer=http%3A%2F%2Fi9.download.fd.pchome.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626226265&t=f353e9ec8224870ea79af30dc6c6881e',
        onlineState: '已上线',
        isAvalible: '禁用',
        params: '123',
      },
    ])
    const columnArr = ref([
      {
        randomId: nanoid(),
        prop: 'id',
        label: 'ID',
      },
      {
        randomId: nanoid(),
        prop: 'name',
        label: '名称',
        width: '100',
      },
      {
        randomId: nanoid(),
        prop: 'gameType',
        label: '游戏类型',
        width: '80',
      },
      {
        randomId: nanoid(),
        prop: 'characteristic',
        label: '标识',
      },
      {
        randomId: nanoid(),
        prop: 'team',
        label: '所属组',
      },
      {
        randomId: nanoid(),
        prop: 'region',
        label: '所属地区',
      },
      {
        randomId: nanoid(),
        label: '里程碑',
        imgObj: {
          style: { width: '30px', height: '30px' },
        },
        width: '80',
      },
      {
        randomId: nanoid(),
        prop: 'onlineState',
        label: '上线状态',
      },
      {
        randomId: nanoid(),
        prop: 'isAvalible',
        label: '禁用',
      },
      {
        randomId: nanoid(),
        prop: 'params',
        label: '自定义参数',
      },

      {
        randomId: nanoid(),
        label: '操作',
        width: '80',
        action: [
          {
            btnType: 'primary',
            btnText: '编辑',
            btnCallBack(_index: number, _msg: any) {
              modelDailogTitle.value = '编辑模块'
              modelDialogShow.value = true
            },
          },
        ],
      },
    ])
    const pagination = ref({
      handleSizeChange(size: number) {
        console.log(size)
      },
      handleCurrentChange(current: number) {
        console.log(current)
      },
      current: 2,
      pageSize: 10,
    })

    const modelresetSome = () => {}

    const modelDailogFormSub = () => {}
    const handlemodelUploadchange = () => {}
    const modelEvent = () => {}

    return {
      tableData,
      columnArr,
      pagination,

      tabActive,
      handleTabClick,

      modelUploadRef,
      modelDailogTitle,
      modelDialogShow,
      modelFileList,
      modelDate,
      modelresetSome,
      modelDailogFormSub,
      handlemodelUploadchange,
      modelEvent,
    }
  },
})
</script>


<style lang="scss" scope>
.model-container {
  height: calc(100vh - 82px);
  overflow: auto;
  padding: 10px 20px;
  position: relative;
  background: white;
  .create-model {
    position: absolute;
    right: 20px;
    top: 10px;
    z-index: 1;
  }
}
</style>