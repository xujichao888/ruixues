<template>
  <div class="product-management-container" v-loading="pageLoading">
    <div class="serch-content">
      <div>
        <el-space>
          <el-input
            placeholder="搜索产品"
            size="mini"
            v-model="searchKey"
            clearable
            @keyup.enter="searchProduct"
          />
          <el-button type="warning" size="mini" @click="searchProduct">检索</el-button>
        </el-space>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleCreateProduct"
          >新建产品</el-button
        >
      </div>
    </div>
    <div class="collapse-container">
      <el-collapse
        :name="idx"
        v-for="(i, idx) in productList"
        :key="i.randomid"
        accordion
        style="margin-top: 20px"
      >
        <el-collapse-item>
          <template #title>
            <div class="title-content">
              <div class="left-hand">
                <el-space>
                  <img :src="i.logo" class="avatar" />
                  <span>{{ i.name }}</span>
                </el-space>
              </div>
              <div class="right-hand">
                <el-space>
                  <el-button type="primary" plain size="mini" @click.stop="handleProductEdit(i)"
                    >编 辑</el-button
                  >
                  <el-button type="primary" size="mini" @click.stop="handleAddApp(i)"
                    >添加APP</el-button
                  >
                </el-space>
              </div>
            </div>
          </template>
          <div class="tabs-content">
            <el-tabs v-model="i.active">
              <el-tab-pane
                :label="item.value"
                :name="item.label"
                v-for="item in i.list"
                :key="item.label"
              >
                <pbTable
                  :tableData="item.data"
                  :columnArr="columnArr"
                  :styles="{ marginTop: 0 }"
                  :isUserPagination="false"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="paginations">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginationObj.page"
        :page-sizes="[10, 20, 50]"
        :page-size="paginationObj.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationObj.total"
      />
    </div>
  </div>
  <el-dialog v-model="productDialogShow" width="700px" @close="productresetSome" top="100px">
    <template #title>
      <div class="dialog-product-title">{{ productDailogTitle }}</div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="
            () => {
              productDialogShow = !productDialogShow
            }
          "
          size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="productDailogFormSub" size="small">确 定</el-button>
      </span>
    </template>
    <i-form
      ref="ProductFormRef"
      :formData="productDate.formData"
      :needToast="true"
      :form-cols="productDate.formCols"
      :rules="productDate.rules"
      v-loading="productDate.formData.loading"
    >
      <template #productLogo>
        <el-upload
          class="upload-demo"
          ref="ProductuploadRef"
          action="http://ruixue.weiletest.com/rd/v1/upload/oss-upload"
          :file-list="productDate.formData.productFileList"
          :on-success="handleProductSuccess"
          :on-change="handleProductUploadchange"
          :on-remove="
            () => {
              productDate.formData.productLogo = false
              productDate.formData.productFileList = []
            }
          "
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </template>
    </i-form>
  </el-dialog>
  <el-dialog v-model="appDialogShow" width="800px" @close="appresetSome" top="100px">
    <template #title>
      <div class="dialog-product-title">{{ appDailogTitle }}</div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="
            () => {
              appDialogShow = !appDialogShow
            }
          "
          size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="appDailogFormSub" size="small">确 定</el-button>
      </span>
    </template>
    <i-form
      ref="appFormRef"
      :formData="appData.formData"
      :needToast="true"
      :form-cols="appData.formCols"
      :rules="appData.rules"
      @event="appEvent"
      labelPosition="right"
    >
      <template #APPkey>
        <el-space :size="5">
          <el-input v-model="appData.formData.appKey" placeholder="32位MD5值" clearable />
          <el-button type="primary" @click="handleAppCreateMd5">生成</el-button>
        </el-space>
      </template>
      <template #channelLocationPage>
        <div style="display: flex">
          <el-input placeholder="渠道落地页地址" v-model="appData.formData.wechatDownloadUrl" />
          <img :src="appData.formData.qcodeUrl" />
        </div>
      </template>
      <template #websiteLocaltionPage>
        <div class="websition-input">
          <el-input placeholder="官网落地页地址" v-model="appData.formData.downloadUrl" />
          <uploadBtn />
        </div>
      </template>
    </i-form>
  </el-dialog>
  <el-dialog v-model="containGameDialogShow" width="700px" @close="containsetSome" top="100px">
    <template #title>
      <div class="dialog-product-title">选择模块</div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="
            () => {
              containGameDialogShow = !containGameDialogShow
            }
          "
          size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="containGameDailogFormSub" size="small">应 用</el-button>
      </span>
    </template>
    <div class="centers" v-if="containGameDialogShow">
      <el-transfer
        v-model="containGameValue"
        filterable
        :titles="['待包含模块', '已包含组件']"
        filter-placeholder="搜索"
        :data="containGamedata"
        @change="containGameTranferChange"
        ref="transferRef"
      >
        <template #left-footer>
          <el-select
            v-model="containGameNotSelection.values"
            clearable
            placeholder="全部"
            style="width: 198px"
          >
            <el-option
              v-for="item in containGameNotSelection.option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template #right-footer>
          <el-select
            v-model="containGameAlreadySelection.values"
            clearable
            placeholder="全部"
            style="width: 198px"
          >
            <el-option
              v-for="item in containGameAlreadySelection.option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-transfer>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import pbTable from '@/components/pbtable/index.vue'
import { nanoid } from 'nanoid'
import iForm from '@/components/iForm/zxForm.vue'
import { ElMessage } from 'element-plus'
import uploadBtn from './components/uploadBtn.vue'
import QRCode from 'qrcode'
import {
  getProductlList,
  getRegionListbyhttp,
  setProductbyhttp,
  getChannelListbyhttp,
  setAppbyhttp,
} from '@/api/management/management'
import hex_md5 from './hex_md5'
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
  if (field == 'productLogo' && !_value) {
    _callback(new Error('请上传产品logo'))
  }
  _callback()
}

export default defineComponent({
  components: {
    pbTable,
    iForm,
    uploadBtn,
  },
  setup() {
    const qcodeRef = ref()

    const paginationObj = ref({
      page: 1,
      size: 10,
      total: 0,
    })
    const regionList = ref([])
    const pageLoading = ref(false)
    const searchKey = ref('')
    const containGameDialogShow = ref(false)
    const appuploadRef = ref()
    const appFormRef = ref()
    const appkey = ref('')
    const appDialogShow = ref(false)
    const appFileList = ref([])
    const appDailogTitle = ref('添加APP')
    const appData = reactive<any>({
      show: false,
      tiem: '',
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'change' }],
        appId: [{ required: true, message: '请输入产品ID', trigger: 'change' }],
        appkey: [{ required: true, message: '请输入产品ID', trigger: 'change' }],
      },
      formData: {
        name: '',
        appId: '',
        appLogo: false,
        platformId: '',
        channelId: '',
        wechatSyncid: '',
        wechatSynckey: '',
        wechatPayid: '',
        mpRelation: '',
        loginip: '',
        reviewlogin: '',
        packageName: '',
        wechatDownloadUrl: '',
        downloadUrl: '',
        appKey: '',
        qcodeUrl: '',
        msg: {},
        productId: 0,
      },
      formCols: [
        [
          {
            eType: 'Input',
            placeholder: '请输入名称',
            label: '名称',
            prop: 'name',
            noShow: false,
            span: 10,
            clearable: true,
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '请输入产品APPID',
            label: 'APP ID',
            prop: 'appId',
            noShow: false,
            span: 10,
            clearable: true,
          },
          {
            eType: 'slot',
            label: 'APPkey',
            slotName: 'APPkey',
            prop: 'appKey',
            span: 13,
          },
        ],
        [
          {
            eType: 'Select',
            label: '渠道',
            placeholder: '请选择',
            clearable: true,
            filterable: true,
            options: [],
            prop: 'channelId',
            span: 10,
          },
          {
            eType: 'Select',
            label: '平台',
            placeholder: '请选择',
            clearable: true,
            options: [
              { label: 'IOS', value: 11 },
              { label: '安卓', value: 12 },
            ],
            prop: 'platformId',
            span: 10,
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '请输入微信登录ID',
            label: '微信登录ID',
            prop: 'wechatSyncid',
            noShow: false,
            span: 10,
            clearable: true,
          },
          {
            eType: 'Input',
            placeholder: '请输入微信密钥',
            label: '微信登录密钥',
            prop: 'wechatSynckey',
            noShow: false,
            span: 10,
            clearable: true,
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '请输入微信支付ID',
            label: '微信支付ID',
            prop: 'wechatPayid',
            noShow: false,
            span: 10,
            clearable: true,
          },
          {
            eType: 'Input',
            placeholder: '请输入',
            label: '关联公众号',
            prop: 'mpRelation',
            noShow: false,
            span: 10,
            clearable: true,
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '请输入登录配置',
            label: '登录配置',
            prop: 'loginip',
            noShow: false,
            span: 18,
            clearable: true,
            type: 'textarea',
            rows: '4',
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '请输入微信支付ID',
            label: '审核登录地址',
            prop: 'reviewlogin',
            noShow: false,
            span: 14,
            clearable: true,
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '请输入包名',
            label: '包名',
            prop: 'packageName',
            noShow: false,
            span: 14,
            clearable: true,
          },
        ],
        [
          {
            eType: 'slot',
            useColor: '#409EFF',
            slotName: 'channelLocationPage',
            label: '渠道落地页地址',
            prop: 'wechatDownload',
            span: 18,
          },
        ],
        [
          {
            eType: 'slot',
            useColor: '#409EFF',
            slotName: 'websiteLocaltionPage',
            label: '官网落地页地址',
            prop: 'downloadUrl',
            span: 18,
          },
        ],
      ],
    })

    const productList = ref<any>([])
    const columnArr = ref([
      {
        randomId: nanoid(),
        prop: 'name',
        label: '名称',
        width: '150',
      },
      {
        randomId: nanoid(),
        prop: 'appId',
        label: 'APP DI',
        width: '80',
      },
      {
        randomId: nanoid(),
        prop: 'channelName',
        label: '渠道',
        width: '150',
      },
      {
        randomId: nanoid(),
        prop: 'appKey',
        label: 'APP Key',
        width: '180',
      },
      {
        randomId: nanoid(),
        prop: 'loginIP',
        label: '登录地址',
      },
      {
        randomId: nanoid(),
        label: '操作',
        width: '250',
        action: [
          {
            btnType: 'text', //primary / success / warning / danger / info / text
            btnText: '编辑',
            btnCallBack(_index: number, _msg: any) {
              handleEditApp(_msg)
            },
          },
          {
            btnType: 'text',
            btnText: '拷贝',
            btnCallBack(_index: number, _msg: any) {},
          },
          {
            btnType: 'text',
            btnText: '包含子游戏',
            btnCallBack(_index: number, _msg: any) {
              containGameDialogShow.value = true
            },
          },
          {
            btnType: 'text',
            btnText: '删除',
            btnCallBack(_index: number, _msg: any) {},
          },
        ],
      },
    ])

    const ProductuploadRef = ref()
    const ProductFormRef = ref()
    const productDialogShow = ref(false)

    const productDailogTitle = ref('添加产品')
    const productDate = reactive<any>({
      show: false,
      tiem: '',
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'change' }],
        productId: [{ required: true, message: '请输入产品ID', trigger: 'change' }],
        productLogo: [{ required: true, validator: validatorPass, trigger: 'blur' }],
      },
      formData: {
        name: '',
        productId: '',
        productLogo: false,
        productFileList: [],
        teamId: 0,
        region: [],
        banhao: '',
        beian: '',
        autoGame: ['1'],
        loading: false,
        disable: '0',
      },
      formCols: [
        [
          {
            eType: 'Input',
            placeholder: '请输入产品名称',
            label: '产品名称',
            prop: 'name',
            noShow: false,
            span: 18,
            clearable: true,
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '请输入产品ID',
            label: '产品ID',
            prop: 'productId',
            noShow: false,
            span: 18,
            clearable: true,
          },
        ],
        [
          {
            eType: 'slot',
            label: '产品logo',
            slotName: 'productLogo',
            prop: 'productLogo',
            span: 18,
          },
        ],
        [
          {
            eType: 'Select',
            label: '所属团队',
            placeholder: '未分类',
            clearable: true,
            options: [
              { label: '团队1', value: '0' },
              { label: '团队2', value: '2' },
              { label: '团队3', value: '3' },
              { label: '团队4', value: '4' },
              { label: '团队5', value: '5' },
            ],
            prop: 'teamId',
            span: 12,
          },
        ],
        [
          {
            eType: 'Cascader',
            label: '所属地区',
            clearable: true,
            filterable: true,
            options: ['220000'],
            props: { checkStrictly: true },
            prop: 'region',
            span: 12,
            checkStrictly: true,
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '请输入版号',
            label: '版号',
            prop: 'banhao',

            noShow: false,
            span: 12,
            clearable: true,
          },
        ],
        [
          {
            eType: 'Input',
            placeholder: '请输入备案号',
            label: '备案号',
            prop: 'beian',
            noShow: false,
            span: 12,
            clearable: true,
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
            prop: 'disable',
            span: 24,
          },
        ],
        [
          {
            eType: 'Check',
            label: '自动包含游戏',
            options: [
              {
                label: ' ',
                value: '1',
              },
            ],
            prop: 'autoGame',
            noShow: false,
            span: 12,
            clearable: true,
          },
        ],
      ],
    })

    const transferRef = ref()
    const containGameValue = ref(['100'])
    const containGamedata = ref([
      {
        label: '模块1',
        key: '4',
      },
      {
        label: '模块2',
        key: '5',
      },
      {
        label: '模块3',
        key: '6',
      },
      {
        label: '模块5',
        key: '100',
      },
    ])
    const containGameNotSelection = ref({
      values: '',
      option: [
        {
          label: '选项1',
          value: '1',
        },
      ],
    })
    const containGameAlreadySelection = ref({
      values: '',
      option: [
        {
          label: '选项1',
          value: '1',
        },
      ],
    })

    function productresetSome() {
      console.log(ProductFormRef.value.elForm)
      ProductFormRef.value.elForm.resetFields()
      ProductuploadRef.value.clearFiles()
      productDate.formData = {
        name: '',
        productId: '',
        productLogo: false,
        productFileList: [],
        teamId: 0,
        region: [],
        banhao: '',
        beian: '',
        autoGame: ['1'],
        loading: false,
        disable: '0',
      }
    }
    function productDailogFormSub() {
      ProductFormRef.value.submit().then((res: any) => {
        //request interface
        console.log(res)
        if (res) {
          let modelValue = productDate.formData
          let region =
            modelValue.region.length > 0
              ? Number(modelValue.region[modelValue.region.length - 1])
              : 0
          let obj = {
            autoGame: Number(modelValue.autoGame[0]),
            banhao: modelValue.banhao,
            beian: modelValue.beian,
            logo: modelValue.productFileList[0].url,
            name: modelValue.name,
            productId: Number(modelValue.productId),
            region: region,
            teamId: Number(modelValue.teamId),
            vipProgram: '',
            disable: Number(modelValue.disable),
          }
          setProductbyhttp(obj).then(() => {
            ElMessage.success('修改成功')
            productDialogShow.value = !productDialogShow.value
            getProductlListFun(paginationObj.value.page, paginationObj.value.size)
          })
        }
      })
    }
    function handleProductUploadchange(_file: any, fileList: any[]) {
      productDate.formData.productLogo = fileList.length > 0
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
    }

    function handleProductSuccess(_file: any, fileList: any) {
      productDate.formData.productFileList[0] = {
        name: fileList.name,
        url: fileList.response.data,
      }
      ElMessage.success('上传成功')
    }
    async function handleProductEdit(_item: any) {
      console.log(_item)
      productDialogShow.value = !productDialogShow.value
      productDate.formData.loading = true
      await getRegionList()
      productDailogTitle.value = '编辑产品'
      productDate.formData.loading = false
      productDate.formData.name = _item.name
      productDate.formData.productId = _item.productId
      productDate.formData.banhao = _item.banhao
      productDate.formData.beian = _item.beian
      if (_item.logo.trim().length > 0) {
        productDate.formData.productLogo = true
        productDate.formData.productFileList = [
          {
            name: _item.logo,
            url: _item.logo,
          },
        ]
      }
      productDate.formData.disable = _item.disable + ''
      productDate.formData.autoGame = _item.autoGame == 1 ? ['1'] : []
      productDate.formData.region = findRegionById(_item.region)
    }
    function handleCreateProduct() {
      productDialogShow.value = !productDialogShow.value
      productDailogTitle.value = '添加产品'
    }

    function appresetSome() {
      appFormRef.value.elForm.resetFields()

      appData.formData = {
        name: '',
        appId: '',
        appLogo: false,
        platformId: '',
        channelId: '',
        wechatSyncid: '',
        wechatSynckey: '',
        wechatPayid: '',
        mpRelation: '',
        loginip: '',
        reviewlogin: '',
        packageName: '',
        wechatDownloadUrl: '',
        downloadUrl: '',
        appKey: '',
        qcodeUrl: '',
        msg: {},
        productId: 0,
      }
    }
    function appDailogFormSub() {
      console.log(appData.formData)
      if (appData.formData.msg.hasOwnProperty('loginIP')) {
        Reflect.deleteProperty(appData.formData.msg, 'loginIP')
      }
      appFormRef.value.submit().then((res: any) => {
        //request interface
        if (res) {
          let obj: any = {}
          Object.keys(appData.formData).forEach((item: string) => {
            if (item != 'appLogo' && item != 'qcodeUrl' && item != 'msg') {
              obj[item] = item == 'appId' ? Number(appData.formData[item]) : appData.formData[item]
            }
          })
          setAppbyhttp({ ...appData.formData.msg, ...obj })
        }
      })
    }
    function handleAppCreateMd5() {
      console.log(123)
      appData.formData.appKey = hex_md5(nanoid())
    }
    async function handleAddApp(item: any) {
      let { productId } = item
      appData.formData.productId = productId
      appDialogShow.value = !appDialogShow.value
      appDailogTitle.value = '添加App'
      let { list } = await getChannelListbyhttp({ page: 1, size: 1000 })
      appData.formCols[2][0].options = list.map((item: any) => {
        return { label: item.name, value: item.channelId }
      })
    }
    async function handleEditApp(msg: any) {
      let { list } = await getChannelListbyhttp({ page: 1, size: 1000 })
      appData.formCols[2][0].options = list.map((item: any) => {
        return { label: item.name, value: item.channelId }
      })
      appDailogTitle.value = '编辑产品'
      appDialogShow.value = !appDialogShow.value
      Object.keys(appData.formData).forEach((item: string) => {
        appData.formData[item] = msg[item]
      })
      appData.formData.msg = msg
      console.log(appData.formData)
      var opts = {
        Type: 'image/jpeg',
        quality: 0.3,
        width: 40,
        height: 30,
        margin: 1,
      }
      QRCode.toDataURL(
        qcodeRef.value,
        appData.formData.wechatDownloadUrl,
        opts,
        function (err, url) {
          if (err) throw err
          appData.formData.qcodeUrl = url
        }
      )
    }
    function appEvent() {}

    function containGameDailogFormSub() {}
    function containsetSome() {
      containGameValue.value = ['100']
    }
    function containGamefilterMethod() {}
    function containGameTranferChange() {}

    function findRegionById(regionNumber: number): string[] {
      let arr: string[] = []
      let regionTostring: string = regionNumber + ''
      if (regionTostring == '0') {
        return ['0']
      } else {
        //如果是省 后3位000 市100或200  区 101
        let provinceStr = regionTostring.substr(0, 2)
        let cityStr = regionTostring.substr(-4)
        let region: any[] = regionList.value
        for (let i = 1; i < region.length; i++) {
          if (region[i].value.substr(0, 2) == provinceStr) {
            if (cityStr == '0000') {
              return [region[i].value]
            } else {
              arr.push(region[i].value)
              let cityArr = region[i].children
              for (let a = 0; a < cityArr.length; a++) {
                if (cityArr[a].value.substr(-4) == cityStr) {
                  arr.push(cityArr[a].value)
                  return arr
                } else if (
                  cityStr.substr(-2) != '00' &&
                  cityArr[a].value.substr(2, 2) == cityStr.substr(0, 2)
                ) {
                  arr.push(cityArr[a].value)
                  let child: any[] = cityArr[a].children
                  let index = child.findIndex(
                    (item: any) => item.value.substr(-2) == cityStr.substr(-2)
                  )
                  arr.push(child[index].value)
                }
              }
            }
          }
        }
      }
      return arr
    }

    async function getRegionList() {
      let region = await getRegionListbyhttp()
      let arr: any[] = productDate.formCols
      arr.forEach((item: any) => {
        item.forEach((i: any) => {
          if (i.prop == 'region') {
            i.options = exchangeRegion(region)
            i.options.unshift({ label: '全国', value: '0' })
            regionList.value = i.options
          }
        })
      })
    }
    function exchangeRegion(arr: any) {
      let result: any = []
      arr.forEach((item: any) => {
        let obj: any = {}
        obj.label = item.name
        obj.value = item.provinceId ? item.provinceId : item.cityId ? item.cityId : item.areaId
        result.push(obj)
        if (item.hasOwnProperty('children') && item.children != null) {
          obj.children = exchangeRegion(item.children)
        }
      })
      return result
    }
    function getProductlListFun(page: number, size: number, key?: string) {
      pageLoading.value = true
      getProductlList({ page, size, key }).then((res: any) => {
        productList.value = []
        pageLoading.value = false
        paginationObj.value.total = res.total
        let equipmentType: any = {
          1: 'Windows',
          2: 'Linux',
          3: 'Mac',
          4: 'Web',
          11: '苹果',
          12: '安卓',
          13: 'WindowsPhone',
        }
        res.list.forEach((item: any) => {
          let { Apps } = item
          let copyApps: string = JSON.stringify(Apps == null ? [] : Apps)
          let AppsArr = JSON.parse(copyApps)
          Reflect.deleteProperty(item, 'Apps')
          let obj: any = {
            ...item,
            active: '',
            list: [],
            randomid: nanoid(),
          }
          let list: { label: string; value: string; data: any[] }[] = []
          AppsArr.forEach((item: any) => {
            let isHave = list.findIndex((i: any) => i.label == item.platformId + '')
            if (isHave == -1) {
              list.push({
                label: '' + item.platformId,
                value: equipmentType[item.platformId],
                data: [{ ...item, loginIP: item.loginip ? JSON.parse(item.loginip)['addr'] : '' }],
              })
            } else {
              list[isHave].data.push({ ...item, loginIP: JSON.parse(item.loginip)['addr'] })
            }
          })
          obj.list = list.sort((a, b) => parseInt(b.label) - parseInt(a.label))
          obj.active = list.length > 0 ? list[0].label : ''
          productList.value.push(obj)
        })
      })
    }
    function handleSizeChange(val: number) {
      paginationObj.value.size = val
      getProductlListFun(paginationObj.value.page, paginationObj.value.size)
    }
    function handleCurrentChange(val: number) {
      paginationObj.value.page = val
      getProductlListFun(paginationObj.value.page, paginationObj.value.size)
    }
    function searchProduct() {
      getProductlListFun(paginationObj.value.page, paginationObj.value.size, searchKey.value)
    }
    getProductlListFun(paginationObj.value.page, paginationObj.value.size)
    return {
      searchKey,
      productList,
      qcodeRef,
      columnArr,

      ProductFormRef,
      ProductuploadRef,
      productDailogTitle,
      productDialogShow,
      productDate,
      productresetSome,
      productDailogFormSub,
      handleProductUploadchange,
      handleProductSuccess,
      handleProductEdit,
      handleCreateProduct,

      appFormRef,
      appuploadRef,
      appDailogTitle,
      appDialogShow,
      appFileList,
      appData,
      appkey,
      appresetSome,
      appDailogFormSub,
      appEvent,
      handleAppCreateMd5,
      handleAddApp,

      containGamedata,
      transferRef,
      containGameValue,
      containGameDialogShow,
      containGameNotSelection,
      containGameAlreadySelection,
      containGameDailogFormSub,
      containsetSome,
      containGamefilterMethod,
      containGameTranferChange,

      paginationObj,
      handleSizeChange,
      handleCurrentChange,
      pageLoading,
      searchProduct,
    }
  },
})
</script>

<style lang="scss" scope>
.collapse-transition {
  -webkit-transition: 0s height, 0s padding-top, 0s padding-bottom;
  transition: 0s height, 0s padding-top, 0s padding-bottom;
}

.horizontal-collapse-transition {
  -webkit-transition: 0s width, 0s padding-left, 0s padding-right;
  transition: 0s width, 0s padding-left, 0s padding-right;
}
.horizontal-collapse-transition .el-submenu__title .el-submenu__icon-arrow {
  -webkit-transition: 0s;
  transition: 0s;
  opacity: 0;
}

.product-management-container {
  height: calc(100vh - 82px);
  overflow: auto;
  padding: 10px 20px;
  .serch-content {
    display: flex;
    justify-content: space-between;
  }
  .collapse-container {
    margin-top: 20px;
    .title-content {
      height: 40px;
      width: 100%;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left-hand {
        height: 40px;
        display: flex;
        align-items: center;
        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 5px;
        }
      }
    }
    .tabs-content {
      width: 95%;
      margin: 0 auto;
    }
  }
  .paginations {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
.dialog-product-title {
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.2);
  padding-bottom: 10px;
}
.centers {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .selection-container {
    width: 573px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.websition-input {
  display: flex;
  .btn {
    margin-left: 5px;
  }
}
</style>
