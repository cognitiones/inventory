<template>
  <wd-popup
    v-model="show"
    custom-style="padding: 30px 40px;width: 500rpx;border-radius: 20rpx"
    @close="handleClose"
  >
    <view class="flex justify-between items-end mb-6">
      <view class="btnColor" @click="show = false">取消</view>
      <view class="text-4">{{ title }}</view>
      <view class="btnColor" @click="handleConfirm">确认</view>
    </view>
    <wd-datetime-picker-view
      v-model="time"
      :columns-height="120"
      type="time"
      label="日期选择"
      @change="handleTimeChange"
    />
  </wd-popup>
</template>

<script lang="ts" setup>
const show = ref(false)
const title = ref('')
const time = ref<string>('08:00')

const emit = defineEmits(['change'])

const handleShow = (event) => {
  title.value = event.title
  show.value = true
}

const handleClose = () => {
  console.log('close')
}

const handleConfirm = () => {
  emit('change', time.value)
  show.value = false
}

const handleTimeChange = (time) => {
  console.log(time, 'time')
}

defineExpose({
  handleShow,
})
</script>

<style lang="scss" scoped>
.btnColor {
  color: $uni-color-primary;
  font-weight: bold;
}
</style>
