<route lang="json5">
{
  style: {
    navigationBarTitleText: '关于',
  },
}
</route>

<template>
  <view class="overflow-hidden pt-2 px-4">
    <view class="calendar">
      <wu-calendar
        @change="calendarChange"
        :selected="selected"
        type="week"
        :itemHeight="50"
        :insert="true"
        :fold="true"
      ></wu-calendar>
    </view>
    <view v-if="list.length != 0" class="list bg-white mt-4 box-border px-3 py-3">
      <view
        class="item h-6 flex items-center my-2 first:mt-0 last:mb-0"
        v-for="(item, index) in list"
        :key="index"
      >
        <wd-checkbox v-model="item.completed" disabled shape="square">{{ item.title }}</wd-checkbox>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
// 获取屏幕边界到安全区域距离
import { TaskItem } from '../index/types/index'
import { getUserTasksForMonth, MonthTask } from '@/service/task'
import { startOfToday } from '@/utils/days'

const list = ref<TaskItem[]>([])
const selected = ref([])
const {
  loading,
  error,
  data: monthTasks,
  run: getMonthTasks,
} = useRequest<MonthTask[]>(() => getUserTasksForMonth({}))

const calendarChange = (e) => {
  let fulldate = e.fulldate

  const monthTask = monthTasks.value.find((monthTask: MonthTask) => {
    if (monthTask.date === fulldate) {
      return monthTask.data
    }
  })

  list.value = monthTask ? monthTask.data : []
}

const getCalendarData = (data: MonthTask[]) => {
  let array = []
  const today = startOfToday()

  data.forEach((monthTask: MonthTask) => {
    if (monthTask.date === today) {
      list.value = monthTask.data
    }

    let obj = {
      date: monthTask.date,
      badgeColor: 'red',
      badgePosition: 'bottom-center',
      badge: true,
    }

    array.push(obj)
  })

  selected.value = array
}

onShow(() => {
  if (loading.value === false) {
    getMonthTasks()
  }
})

watchEffect(() => {
  if (!loading.value && monthTasks.value) {
    getCalendarData(monthTasks.value)
  }
})
</script>
<!-- 设置page属性 不能带有 scoped 标签，否则 app 不生效 -->
<style>
page {
  background-color: #f3f4f8;
  padding: 0 30rpx;
  box-sizing: border-box;
}
</style>
<style lang="scss" scoped></style>
