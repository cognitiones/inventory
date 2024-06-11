<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <!-- TODO: popup 弹层取消时 加一个过渡动画 -->
  <view :style="{ paddingTop: safeAreaInsets?.top + 11 + 'px' }" class="title">今天</view>
  <view class="list">
    <view class="list-items" v-for="(item, index) in list" :key="index">
      <view class="list-header">
        <view>{{ item.title }}</view>
        <view>{{ item.data.length }}</view>
      </view>
      <view class="list-content">
        <view class="content-items" v-for="(it, ind) in item.data" @click="handleDetail(it, item)">
          <view :class="it.completed ? 'completed' : ''">{{ it.title }}</view>
        </view>
      </view>
    </view>
  </view>

  <!-- insert Icon  -->
  <view class="fab" @click="handleInsert()">
    <image src="http://cdn.chen-zeqi.cn/insert.png" class="fab-btn"></image>
    <!-- <wd-icon name="add-circle fab-btn" size="100rpx"></wd-icon> -->
  </view>

  <!-- detail popup -->
  <TaskDetail ref="TaskDetailRef" @getTodayList="run"></TaskDetail>

  <!-- insert popup -->
  <TaskInsert v-if="insertDialogState" ref="TaskInsertRef" @getTodayList="run" @close="insertDialogState = false">
  </TaskInsert>
</template>

<script lang="ts" setup>
import { TodayItem, TaskItem } from "./types/index";
import { getUserTasksForToday } from "@/service/task";
import TaskDetail from "./components/taskDetail.vue";
import TaskInsert from "./components/taskInsert.vue";

const { safeAreaInsets } = uni.getSystemInfoSync()
const TaskDetailRef = ref(null)
const TaskInsertRef = ref(null)
const insertDialogState = ref<boolean>(false)
const list = ref<TodayItem[]>()

const handleDetail = (it: TaskItem, item: TodayItem) => {
  TaskDetailRef.value.handleShow(it, item)
}

const handleInsert = () => {
  insertDialogState.value = true
}

const { loading, error, data, run } = useRequest<TaskItem[]>(() => getUserTasksForToday({ userId: 1 }))
watchEffect(() => {
  if (!loading.value && data.value) {
    getTodayList(data.value)
  }
})

//格式化数据
const getTodayList = (res: TaskItem[] = data.value) => {
  // 按照 listId 进行分组
  const groupedTasks = res.reduce((groups: { [key: string]: TodayItem }, task: TaskItem) => {
    const { listId, list, completed } = task;

    // 分组依据：listId 或 'completed'
    const groupKey = completed ? 'completed' : listId.toString();

    if (!groups[groupKey]) {
      groups[groupKey] = {
        title: completed ? '已完成' : list.title,
        listId: completed ? 0 : listId,
        data: []
      };
    }
    groups[groupKey].data.push(task);
    return groups;
  }, {});

  // 将分组结果转换为数组
  const result: TodayItem[] = Object.values(groupedTasks);
  console.log(result, 'result');

  list.value = result;
}

</script>

<!-- 设置page属性 不能带有 scoped 标签，否则 app 不生效 -->
<style>
page {
  background-color: #f3f4f8;
  padding: 0 30rpx;
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
$animation-duration: 0.2s;
$scale-factor: 0.85;

.list-items {
  background-color: #fff;
  border-radius: 10rpx;
  box-sizing: border-box;
  padding: 20rpx;

  margin: 20rpx 0
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-items {
  margin: 20rpx 0;

  &:last-child {
    margin-bottom: 0;
  }
}

.completed {
  text-decoration: line-through;
  color: #ccc
}

.fab {
  width: 100rpx;
  height: 100rpx;

  position: fixed;
  bottom: 150rpx;
  right: 50rpx;
}

.fab-btn {
  width: 100rpx;
  height: 100rpx;
  transition: transform $animation-duration ease-in-out;

  &:active {
    animation: scaleDown $animation-duration ease-in-out,
      scaleUp $animation-duration ease-in-out $animation-duration;
  }
}

@keyframes scaleDown {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale($scale-factor);
  }
}

@keyframes scaleUp {
  0% {
    transform: scale($scale-factor);
  }

  100% {
    transform: scale(1);
  }
}
</style>
