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

    <view class="selectBox">
      <view
        class="text-4 item h-10 leading-10"
        :class="{ checkItem: item.checked }"
        v-for="(item, index) in options"
        :key="index"
        @click="handleClick(item)"
      >
        <view class="flex justify-between items-center">
          <view>{{ item.label }}</view>
          <image v-show="item.checked" class="w-5 h-5" src="http://cdn.chen-zeqi.cn/confirm2.png" />
        </view>
      </view>
    </view>
    <!-- <wd-datetime-picker-view
      v-model="time"
      :columns-height="120"
      type="time"
      label="日期选择"
      @change="handleTimeChange"
    /> -->
  </wd-popup>
</template>

<script lang="ts" setup>
const show = ref(false)
const title = ref('')
const time = ref<string>('08:00')
const options = ref()

const emit = defineEmits(['change'])

const handleShow = (event) => {
  title.value = event.title
  options.value = event.options
  options.value.forEach((el) => {
    el.checked = false
  })

  show.value = true
}

const handleClick = (item) => {
  options.value.forEach((el) => {
    el.checked = false
  })
  item.checked = true
}

const handleClose = () => {
  console.log('close')
}

const handleConfirm = () => {
  const selected = options.value.filter((el) => el.checked)[0]

  emit('change', selected)
  show.value = false
}

// const handleTimeChange = (time) => {
//   console.log(time, 'time')
// }

defineExpose({
  handleShow,
})
</script>

<style lang="scss" scoped>
.btnColor {
  color: $uni-color-primary;
  font-weight: bold;
}

.selectBox {
}

.checkItem {
  color: $uni-color-primary;
}
</style>
