<template>
    <wd-popup v-model="show" position="bottom" custom-style="height: 600rpx;border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;" custom-class="popup" @close="handleClose">
        <view class="popup">
            <view class="text-center mb-3">{{ list.title }}</view>
            <view class="popup-content">
                <view class="content-title">
                    <wd-checkbox @change="handleChange(task)" v-model="task.completed" shape="square">{{
                        task.title}}</wd-checkbox>
                </view>

                <view class="mt-3">{{ task.description }}</view>
                <view class="content-tags mt-3 flex">
                    <view class="tags-item" v-for="(item, index) in task.tags" :key="index">
                        {{ item.name }}
                    </view>

                </view>
            </view>
        </view>
    </wd-popup>
</template>

<script lang="ts" setup>
import { TodayItem, TaskItem } from "../types/index";
import { completeTask } from "@/service/task";

const emit = defineEmits(['getTodayList'])
const show = ref(false)
const task = ref<TaskItem>(null)
const list = ref<TodayItem>(null)
const handleShow = (taskItem: TaskItem, listItem: TodayItem) => {
    task.value = taskItem
    list.value = listItem

    show.value = true
}

const handleChange = async (task: TaskItem) => {
    const res = await completeTask({ taskId: task.id, completed: task.completed })
    emit('getTodayList')
}

const handleClose = () => {
    console.log('关闭');
}

defineExpose({
    handleShow,
    handleClose
})
</script>

<style lang="scss" scoped>
.popup {
    height: 300rpx;


    box-sizing: border-box;
    padding: 40rpx 30rpx 0;
}

.tags-item{
    border-radius: 30rpx;
    background-color: #f3f4f8;
    padding: 10rpx 20rpx;
    box-sizing: border-box;
}
</style>