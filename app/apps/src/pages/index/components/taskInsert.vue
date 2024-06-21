<template>
    <wd-popup v-model="show" position="bottom" custom-style="height: 700rpx;border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;" custom-class="popup" @close="handleClose">
        <view class="popup">
            <wd-input :confirm-hold="true" :hold-keyboard="true" :adjust-position="false" :focus="true" type="text"
                v-model="form.title" placeholder="你想要做些什么" />
            <wd-input :confirm-hold="true" :hold-keyboard="true" :adjust-position="false" type="text"
                v-model="form.description" placeholder="描述" />
            <view class="handle flex mt-2 items-center">

                <image @click="handleDate" class="dateBtn itemBtn" src="http://cdn.chen-zeqi.cn//date.png"></image>

                <view class="confirmBtn itemBtn">
                    <image @click="handleInsert" src="http://cdn.chen-zeqi.cn//confirm.png" class="confirmIcon"></image>
                </view>
            </view>

            <CalendarPopup ref="calendarPopupRef" @change="calendarChange"></CalendarPopup>
        </view>
    </wd-popup>
</template>

<script lang="ts" setup>
import { endOfToday, formatDate } from "@/utils/days";
import { addTask, AddTaskDto } from "@/service/task";
import CalendarPopup from "./calendar-popup.vue";

const emit = defineEmits(['close', 'change'])
const show = ref(true)
const calendarPopupRef = ref(null)
const form = ref<AddTaskDto>({
    listId: 1,
    title: "",
    description: "",
    repeat: 'NONE',
    reminderDate: formatDate(new Date('2024-6-19 15:30:00')),
    dueDate: endOfToday(),
    completed: false
})

const handleDate = () => {
    calendarPopupRef.value.handleShow()
}

const calendarChange = (times) => {
    let { dueDate, reminderDate } = times    
    form.value.dueDate = dueDate
    form.value.reminderDate = reminderDate
}

const handleInsert = async () => {
    let data = {
        ...form.value,
        title: form.value.title.trim() || "无标题",
    }

    const res = await addTask(data)

    if (res.data) {
        emit('change')
        handleClose()
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

.confirmBtn {
    box-sizing: border-box;
    padding: 10rpx 30rpx;
    height: 50rpx;
    border-radius: 30rpx;
    background-color: #1296db;
    display: flex;
    align-items: center;
    justify-content: center;
}

.confirmIcon {
    width: 33rpx;
    height: 33rpx;
}

.dateBtn {
    display: block;
    width: 50rpx;
    height: 50rpx;
}

.itemBtn {
    margin: 0 10rpx;

    &:first-child {
        margin: 0 10rpx 0 0;
    }
}
</style>