<template>
  <div class="error-page">
    <el-result
      v-if="activeError"
      :icon="activeError.icon"
      :title="activeError.title"
      :subTitle="activeError.subTitle"
    >
      <template #extra>
        <el-button type="primary" size="medium" @click="routerTo">返回</el-button>
      </template>
    </el-result>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ErrorCodeEnum } from '@/enums/errorEnum'
import { MessageErrorEnum } from '@/enums/messageEnum'
import { PageEnum } from '@/enums/pageEnum'

interface ErrorValue {
  title: string
  subTitle?: string
  icon: 'success' | 'warning' | 'info' | 'error'
}

export default defineComponent({
  name: 'ErrorPage',
  props: {
    code: Number,
    errorData: Object as PropType<ErrorValue>,
  },
  setup(props) {
    const ICON = 'error'
    const errorsMap = ref(new Map<number, ErrorValue>())
    const { replace } = useRouter()
    const {
      params: { path },
    } = useRoute()
    const activeError = computed(() => {
      const { code, errorData } = props
      if (errorData) {
        return errorData
      }
      const resultCode = Number(path) || code || 500
      return unref(errorsMap).get(resultCode)
    })

    unref(errorsMap).set(ErrorCodeEnum.ERROR, {
      icon: ICON,
      title: 'SYSTEM ERROR',
      subTitle: MessageErrorEnum.ERROR_SYS,
    })

    unref(errorsMap).set(ErrorCodeEnum.NOT_FOUND, {
      icon: ICON,
      title: 'NOT FOUND',
      subTitle: MessageErrorEnum.ERROR_NOT_FOUND,
    })

    unref(errorsMap).set(ErrorCodeEnum.NO_ACCESS, {
      icon: ICON,
      title: 'NO ACCESS',
      subTitle: MessageErrorEnum.ERROR_NO_ACCESS,
    })

    function routerTo() {
      replace(PageEnum.BASE_HOME)
    }

    return {
      activeError,
      routerTo,
    }
  },
})
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - #{$navbar-height});
  font-weight: lighter;
  color: #878889;
}
</style>
