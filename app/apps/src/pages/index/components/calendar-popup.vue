<template>
    <wd-popup v-model="show" position="bottom" custom-style="height:1100rpx;border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;" custom-class="popup" @close="handleClose">
        <view class="popup">
            <view class="flex justify-between mb-2 border-box px-5 text-8">
                <view>x</view>
                <view @click="calendarConfirm">√</view>
            </view>

            <wu-calendar @change="calendarChange" type="week" :itemHeight="50" :insert="true"
                :fold="true"></wu-calendar>
        </view>
        <view class="border-box px-5 mt-2">
            <view @click="handleTime" class="flex items-center justify-between">

                <image class="timeBtn itemBtn" src="http://cdn.chen-zeqi.cn//time.png"></image>
                <view>{{ selectTimeValue.value }}</view>
            </view>
        </view>
        <wd-popup v-model="timeShow" custom-style="padding: 30px 40px;width: 500rpx;border-radius: 20rpx"
            @close="handleClose">
            <view class="flex justify-between mb-6">
                <view>取消</view>
                <view @click="handleTimeConfirm">确认</view>
            </view>
            <wd-datetime-picker-view v-model="timeValue" :columns-height="120" type="time" label="日期选择"
                @change="handleTimeChange" />
        </wd-popup>
        <!-- <wd-popup v-model="timeShow" position="top"  @close="handleClose">
           
        </wd-popup> -->
    </wd-popup>
</template>

<script lang="ts" setup>
import { endOfToday, formatDate } from "@/utils/days";
const emit = defineEmits(['change'])
const show = ref(false)
const timeShow = ref(false)
const timeValue = ref<string>('08:00')
const calendarValue = ref({
    fulldate: ""
})
const selectTimeValue = ref({
    value: "请选择"
})
const handleShow = () => {
    show.value = true
}
const handleClose = () => {
    console.log('close');
}

const handleTime = () => {
    timeShow.value = true
}

const handleTimeChange = (time)=>{
    selectTimeValue.value = time
}

const handleTimeConfirm = ()=>{
    timeShow.value = false
}

const calendarChange = (calendar) => {
    calendarValue.value = calendar
}

const calendarConfirm = ()=>{
    if(!calendarValue.value.fulldate){
        //取今天的日期 这个格式 2022-01-01
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth() + 1
        const day = today.getDate()
        calendarValue.value.fulldate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
    }
    if(!selectTimeValue.value.value || selectTimeValue.value.value === "请选择"){
        selectTimeValue.value.value = "00:00:00"
    }else{
        if(selectTimeValue.value.value.length !== 8){
          selectTimeValue.value.value += ":00"
        }
    }

    const reminderDate = `${calendarValue.value.fulldate} ${selectTimeValue.value.value}`
    
    let times = {
        dueDate: endOfToday(),
        reminderDate: formatDate(new Date(reminderDate)) 
    }
    
    emit('change',times)
}

defineExpose({
    handleShow,
    handleClose
})
</script>
<style lang="scss" scoped>
.timeBtn {
    display: block;
    width: 50rpx;
    height: 50rpx;
}
</style>