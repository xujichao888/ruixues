<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="header">{{ title }}</div>
      <el-form ref="formRef" :model="formData" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password" placeholder="密码" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" plain :loading="loading" class="full-width">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="msg">忘记密码？<el-link type="primary" href="">找回</el-link> </div>
    </div>
  </div>
</template>
<script lang="ts">
import md5 from 'blueimp-md5'
import { PageEnum } from '@/enums/pageEnum'
import { useGlobSetting } from '@/hooks/setting'
import { useUserStore } from '@/store/modules/user'
import type { RuleItem } from 'async-validator'
import type { ElFormItemContext } from 'element-plus/lib/el-form'
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Login',
  setup() {
    const formRef = ref<ElFormItemContext>()
    const { title } = useGlobSetting()
    const formData = reactive({
      username: '',
      password: '',
    })
    const rules: Recordable<RuleItem[]> = {
      username: [{ required: true, message: '用户名不能为空' }],
      password: [{ required: true, message: '密码不能为空' }],
    }
    const loading = ref(false)
    const { push } = useRouter()

    async function onSubmit() {
      try {
        loading.value = true
        await formRef.value?.validate()
        await useUserStore().login({
          ...formData,
          password: md5(formData.password),
        })
        push(PageEnum.BASE_HOME)
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }

    return {
      formRef,
      title,
      formData,
      rules,
      loading,
      onSubmit,
    }
  },
})
</script>
<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: linear-gradient(-225deg, #7de2fc 0%, #b9b6e5 100%);
}

.login-wrapper {
  width: 340px;
  height: 440px;
  padding: 0 50px;
  background-color: #fff;
  border-radius: 15px;
}

.header {
  font-size: 30px;
  font-weight: bold;
  line-height: 150px;
  text-align: center;
}

.input-item {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 15px;
  border: none;
  border-bottom: 2px solid rgb(128, 125, 125);
  outline: none;

  &::placeholder {
    text-transform: uppercase;
  }
}

.btn {
  padding: 5px;
  margin-top: 40px;
  color: #fff;
  text-align: center;
  background-image: linear-gradient(-225deg, #7de2fc 0%, #b9b6e5 100%);
}

.msg {
  margin: 50px 0;
  text-align: center;

  a {
    text-decoration-line: none;
  }
}
</style>
