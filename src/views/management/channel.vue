<template>
  <div class="version-container">
    <div class="version-title">
      <div class="left-hand">
        <div>渠道管理</div>
      </div>
    </div>
    <div class="serch-content">
      <div>
        <el-space>
          <el-input placeholder="查找" size="mini" />
          <el-button type="warning" size="mini">检索</el-button>
        </el-space>
      </div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="
            () => {
              dailogTitle = '添加渠道'
              dialogShow = true
            }
          "
          >添 加</el-button
        >
        <el-button type="primary" icon="el-icon-delete" size="mini" plain>删 除</el-button>
      </div>
    </div>
    <pbTable
      :tableData="tableData"
      :columnArr="columnArr"
      :pagination="pagination"
      :isUserSelection="true"
    />
  </div>
  <el-dialog v-model="dialogShow" width="50%" @close="resetSome" top="100px">
    <template #title>
      <div class="dialog-product-title">{{ dailogTitle }}</div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="
            () => {
              dialogShow = false
            }
          "
          size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="DailogFormSub" size="small">确 定</el-button>
      </span>
    </template>
    <i-form
      ref="mForm"
      :formData="formData"
      :needToast="true"
      :form-cols="formCols"
      :rules="rules"
      @event="event"
    >
      <template #channelLogo>
        <el-upload
          class="upload-demo"
          ref="uploadRef"
          action="https://jsonplaceholder.typicode.com/posts/"
          :limit="1"
          :file-list="fileList"
          :on-change="handleUploadchange"
          :on-remove="
            () => {
              formData.channelLogo = false
            }
          "
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </template>
    </i-form>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
import pbTable from '@/components/pbtable/index.vue'
import { nanoid } from 'nanoid'
import iForm from '@/components/iForm/zxForm.vue'
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
  components: {
    pbTable,
    iForm,
  },
  setup() {
    const dialogShow = ref(false)
    const dailogTitle = ref('添加渠道')
    const data = reactive({
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
    const tableData = ref([
      {
        channelId: '1',
        channelName: '名称',
        channelType: '类型',
        channelHas: 'h5',
        percent: '100%',
      },
      {
        channelId: '2',
        channelName: '名称',
        channelType: '类型',
        channelHas: 'h5',
        percent: '100%',
      },
      {
        channelId: '3',
        channelName: '名称',
        channelType: '类型',
        channelHas: 'h5',
        percent: '100%',
      },
      {
        channelId: '4',
        channelName: '名称',
        channelType: '类型',
        channelHas: 'h5',
        percent: '100%',
      },
      {
        channelId: '5',
        channelName: '名称',
        channelType: '类型',
        channelHas: 'h5',
        percent: '100%',
      },
      {
        channelId: '6',
        channelName: '名称',
        channelType: '类型',
        channelHas: 'h5',
        percent: '100%',
      },
      {
        channelId: '7',
        channelName: '名称',
        channelType: '类型',
        channelHas: 'h5',
        percent: '100%',
      },
      {
        channelId: '8',
        channelName: '名称',
        channelType: '类型',
        channelHas: 'h5',
        percent: '100%',
      },
    ])
    const columnArr = ref([
      {
        randomId: nanoid(),
        prop: 'channelId',
        label: '渠道ID',
      },
      {
        randomId: nanoid(),
        prop: 'channelName',
        label: '渠道名称',
        width: '300',
      },
      {
        randomId: nanoid(),
        prop: 'channelType',
        label: '渠道类型',
      },
      {
        randomId: nanoid(),
        prop: 'channelHas',
        label: '渠道所属',
      },
      {
        randomId: nanoid(),
        prop: 'percent',
        label: '利润分成百分比',
      },
      {
        randomId: nanoid(),
        label: '操作',
        width: '250',
        action: [
          {
            btnType: 'warning',
            btnText: '编辑',
            btnCallBack(_index: number, _msg: any) {
              dailogTitle.value = '编辑模块'
              data.formData.channelID = _msg.channelId
              data.formData.channelName = _msg.channelName
              data.formData.channelType = '2'
              data.formData.channelClassify = '2'
              data.formData.percent = _msg.percent
              dialogShow.value = true
            },
          },
          {
            btnType: 'danger',
            btnText: '删除',
            btnCallBack(_index: number, _msg: any) {},
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
      current: 1,
      pageSize: 10,
      total: 100,
    })
    const fileList = ref([])
    const mForm = ref()
    const uploadRef = ref()
    function event(params: any) {
      if (params.prop === 'submit1') {
        data.show = !data.show
        mForm.value.setNoShow('date4', data.show)
      }
    }
    function handleUploadchange(_file: any, fileList: any[]) {
      data.formData.channelLogo = fileList.length > 0
    }
    function resetSome() {
      mForm.value.elForm.resetFields()
      uploadRef.value.clearFiles()
      data.formData.channelLogo = false
    }
    function triggerDailog() {
      dialogShow.value = !dialogShow.value
    }
    function DailogFormSub() {
      mForm.value.submit().then((res: any) => {
        //request interface
        console.log(res)
        console.log(data.formData)
      })
    }
    return {
      tableData,
      columnArr,
      pagination,
      dialogShow,
      dailogTitle,
      uploadRef,
      DailogFormSub,
      resetSome,
      triggerDailog,
      handleUploadchange,
      ...toRefs(data),
      event,
      mForm,
      fileList,
    }
  },
})
</script>


<style lang="scss" scope>
.version-container {
  height: calc(100vh - 82px);
  background: white;
  overflow: auto;
  padding: 10px 20px;
  .version-title {
    display: flex;
    height: 40px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.2);
    align-items: center;
    justify-content: space-between;
    .left-hand {
      height: 39px;
      width: 60px;
      display: flex;
      font-size: 14px;
      color: #409eff;
      align-items: center;
      justify-content: center;
      position: relative;
      .blue-line {
        width: 80%;
        position: absolute;
        bottom: 0;
        height: 2px;
        border-radius: 30px;
        background: #409eff;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .right-hand {
      color: #606266;
      font-size: 14px;
      .red-one {
        color: #f56c6c;
      }
      .blue-one {
        color: #409eff;
      }
    }
  }
  .serch-content {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
}
.dialog-product-title {
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.2);
  padding-bottom: 10px;
}
</style>