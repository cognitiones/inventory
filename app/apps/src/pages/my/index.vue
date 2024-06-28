<route lang="json5">
{
  style: {
    navigationBarTitleText: '个人中心',
  },
}
</route>
<template>
  <view>
    <view>
      <view>姓名：{{ user.name }}</view>
      <view>邮箱：{{ user.email }}</view>
      // #ifdef APP-PLUS
      <view>设备号：{{ clientid }}</view>
      // #endif
    </view>
  </view>
</template>
<script lang="ts" setup>
import { getUser } from '@/service/user'
const userId = uni.getStorageSync('userId')
const { loading, error, data, run } = useRequest(() => getUser({ userId }))
const user = ref({})
const clientid = ref()
// #ifdef APP-PLUS
plus.push.getClientInfoAsync(
  (info) => {
    console.log('cid:', info)
    cid.value = info.clientid
    uni.setStorageSync('cid', info.clientid)
    clientid.value = info.clientid
  },
  (e) => {},
)
// #endif

watchEffect(() => {
  if (!loading.value) {
    if (data.value) {
      user.value = data.value
    } else if (error) {
      if (error.value.code === 401) {
        isLogin.value = true
      }
    }
  }
})
</script>
