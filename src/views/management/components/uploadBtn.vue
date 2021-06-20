<template>
  <div>
    <el-upload
      ref="fileRef"
      action="https://jsonplaceholder.typicode.com/posts/"
      :file-list="[]"
      :show-file-list="false"
      :auto-upload="false"
      :on-success="handleUploadSuccess"
      :on-change="handleUploadChange"
    >
      <el-button style="margin-left" type="primary">选取文件</el-button>
    </el-upload>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const sizes = 10 * 1024 * 1024
    const url = ''
    const percent = 0
    const percentShow = false
    const fileSize = 0
    const status = ''
    const fileRef = ref()
    function handleUpload() {
      sizes
      url
      percent
      percentShow
      fileSize
      status
      fileRef.value.click()
    }
    function handleUploadFile() {
      console.log(123)
    }
    function handleUploadSuccess() {
      console.log('成功')
    }
    function handleUploadChange(file: any, _fileList: any) {
      console.log(file)
    }
    return {
      handleUpload,
      handleUploadFile,
      handleUploadSuccess,
      handleUploadChange,
      fileRef,
    }
  },
})
</script>

<style lang="scss" scope></style>
