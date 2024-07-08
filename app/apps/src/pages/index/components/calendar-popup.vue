<template>
  <wd-popup
    v-model="show"
    position="bottom"
    custom-style="height:1300rpx;border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;"
    custom-class="popup"
    @close="handleClose"
  >
    <view class="popup">
      <view class="flex justify-between mt-2 border-box px-5 text-8">
        <image @click="show = false" class="icon" src="http://cdn.chen-zeqi.cn/cancel.png" />
        <image @click="calendarConfirm" class="icon" src="http://cdn.chen-zeqi.cn/confirm2.png" />
      </view>

      <wu-calendar
        class="mb-3"
        @change="calendarChange"
        type="week"
        :itemHeight="50"
        :insert="true"
        :fold="true"
      ></wu-calendar>

      <view class="border-box px-5 mt-2 overflow-auto">
        <view @click="handleTime" class="flex items-center justify-between mb-7 last:mb-0">
          <view class="flex items-center">
            <image class="timeBtn itemBtn" src="http://cdn.chen-zeqi.cn/time2.png"></image>
            <view class="ml-2">时间</view>
          </view>

          <view>{{ calendarMsg.time || '请选择' }}</view>
        </view>

        <view @click="handleClock" class="flex items-center justify-between mb-7 last:mb-0">
          <view class="flex items-center">
            <image class="timeBtn itemBtn" src="http://cdn.chen-zeqi.cn/time.png"></image>
            <view class="ml-2">提醒</view>
          </view>

          <view>{{ calendarMsg.clock || '请选择' }}</view>
        </view>

        <view @click="handleRepetition" class="flex items-center justify-between mb-7 last:mb-0">
          <view class="flex items-center">
            <image class="timeBtn itemBtn" src="http://cdn.chen-zeqi.cn/repetition.png"></image>
            <view class="ml-2">重复</view>
          </view>

          <view>{{ calendarMsg.repetition.label || '请选择' }}</view>
        </view>
      </view>
    </view>

    <BaseTimeSelect ref="TimeRef" @change="selectChange('time', $event)"></BaseTimeSelect>
    <BaseTimeSelect ref="ClockRef" @change="selectChange('clock', $event)"></BaseTimeSelect>
    <BaseSelect ref="RepetitionRef" @change="selectChange('repetition', $event)"></BaseSelect>
  </wd-popup>
</template>

<script lang="ts" setup>
import { endOfToday, formatDate } from '@/utils/days'
import BaseTimeSelect from '@/components/base-time-select.vue'
import BaseSelect from '@/components/base-select.vue'

const show = ref(false)
const TimeRef = ref(null)
const ClockRef = ref(null)
const RepetitionRef = ref(null)

const calendarMsg = ref({
  time: '',
  clock: '',
  repetition: {
    label: '',
    value: '',
  },
})

const selectChange = (name, time) => {
  calendarMsg.value[name] = time
  console.log(calendarMsg.value)
}

const emit = defineEmits(['change'])

const calendarValue = ref({
  fulldate: '',
})

const handleShow = () => {
  show.value = true
}

const handleTime = () => {
  TimeRef.value.handleShow({
    title: '时间',
  })
}

const handleClock = () => {
  ClockRef.value.handleShow({
    title: '提醒',
  })
}

const handleRepetition = () => {
  //每日 每周 每月 工作日
  const options = [
    {
      label: '每日',
      value: 'DAILY',
    },
    {
      label: '每周',
      value: 'WEEKLY',
    },
    {
      label: '每月',
      value: 'MONTHLY',
    },
    // {
    //   label: "工作日",
    //   value: 4
    // }
  ]
  RepetitionRef.value.handleShow({
    title: '重复',
    options: options,
  })
}

const handleClose = () => {}

const calendarChange = (calendar) => {
  calendarValue.value = calendar
}

const calendarConfirm = () => {
  if (!calendarValue.value.fulldate) {
    //取今天的日期 这个格式 2022-01-01
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    calendarValue.value.fulldate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  }
  console.log(calendarMsg.value)

  const data = {
    dueDate: calendarMsg.value.time
      ? formatDate(new Date(`${calendarValue.value.fulldate} ${calendarMsg.value.time}`))
      : '',
    reminderDate: calendarMsg.value.clock
      ? formatDate(new Date(`${calendarValue.value.fulldate} ${calendarMsg.value.clock}`))
      : '',
    repeat: calendarMsg.value.repetition.value || 'NONE',
  }

  emit('change', data)
  show.value = false
}

defineExpose({
  handleShow,
  // handleClose,
})
</script>
<style lang="scss" scoped>
.timeBtn {
  display: block;
  width: 50rpx;
  height: 50rpx;
}

.icon {
  width: 70rpx;
  height: 70rpx;
}
</style>
