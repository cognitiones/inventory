<route lang="json5">
{
  style: {
    navigationBarTitleText: '关于',
  },
}
</route>

<template>
  <view class="bg-white overflow-hidden pt-2 px-4">

    <view class="index">
      <wu-calendar type="week" :itemHeight="50" :insert="true" :fold="true"></wu-calendar>
    </view>
  </view>

</template>
<script lang="ts" setup>
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<style lang="scss" scoped></style>
