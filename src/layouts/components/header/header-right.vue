<template>
  <section class="layout-header-right">
    <el-dropdown :show-timeout="70" :hide-timeout="50">
      <span class="flex items-center">
        <el-avatar :src="userInfo.avatar" class="mr-2" size="small" />
        {{ userInfo.name }}
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item icon="el-icon-switch-button" @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </section>
</template>

<script lang="ts">
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'HeaderRight',
  setup() {
    const userStore = useUserStore()
    const userInfo = computed(() => userStore.getUserInfo)

    async function logout() {
      try {
        await userStore.logout()
        ElMessage.success('退出成功')
      } catch (error) {
        console.error(error)
      }
    }

    return {
      userInfo,
      logout,
    }
  },
})
</script>

<style lang="scss" scoped>
.layout-header-right {
  display: flex;
  align-items: center;
}
</style>
