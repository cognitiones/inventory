<template>
    <wd-popup v-model="show" position="bottom" custom-style="height: 700rpx;border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;" custom-class="popup" @close="handleClose">
        <view class="popup">
            <wd-input :confirm-hold="true" :hold-keyboard="true" :adjust-position="false" :focus="true"
                type="text" v-model="form.title" placeholder="你想要做些什么" />
            <wd-input :confirm-hold="true" :hold-keyboard="true" :adjust-position="false"
                type="text" v-model="form.description" placeholder="描述" />
            <view class="handle flex mt-2">
                <view class="confirmBtn">
                    <image src="http://cdn.chen-zeqi.cn//confirm.png" class="confirmIcon"></image>
                </view>
            </view>
        </view>
    </wd-popup>
</template>

<script lang="ts" setup>
import { addTask, AddTaskDto } from "@/service/task";
const emit = defineEmits(['close', 'getTodayList'])
const show = ref(true)
const form = ref<AddTaskDto>({
    listId: 1,
    title: "",
    description: "",
    repeat: 'NONE',
    completed: false
})

const handleInsert = async () => {
    console.log('哈哈');

    return
    const res = await addTask(form.value)
    if (res.data.id) {
        emit('getTodayList')
    }
}

const handleClose = () => {
    emit('close')
    show.value = false
}

defineExpose({
    handleClose
})
</script>

<style lang="scss" scoped>
.popup {
    height: 700rpx;
    box-sizing: border-box;
    padding: 10rpx 30rpx 0;
}

.confirmBtn{
    box-sizing: border-box;
    padding: 10rpx 30rpx;
    border-radius: 30rpx;
    background-color: #1296db;
    display: flex;
    align-items: center;
    justify-content: center;
}

.confirmIcon{
    width: 33rpx;
    height: 33rpx;
}
</style>