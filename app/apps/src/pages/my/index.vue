<route lang="json5">
{
  style: {
    navigationBarTitleText: '个人中心',
  },
}
</route>
<template>
  <view>
    <view>
      <!-- <wd-upload
        image-mode="aspectFill"
        action="minio/uploadFile"
      ></wd-upload> -->
      <image src="http://192.168.1.103:9000/inventory/6.png"></image>
      <view @click="upload">上传图片</view>

      <view>姓名：{{ user.name }}</view>
      <view>邮箱：{{ user.email }}</view>
      // #ifdef APP-PLUS
      <view>设备号：{{ clientid }}</view>
      // #endif
    </view>
  </view>
</template>
<script lang="ts" setup>
import { getUser } from '@/service/user'
const userId = uni.getStorageSync('userId')
const { loading, error, data, run } = useRequest(() => getUser({ userId }))
const user = ref({})
const clientid = ref()

const upload = () => {
  uni.chooseImage({
    count: 1,
    success: function (res) {
      const filePath = res.tempFilePaths[0]
      const fileName = res.tempFiles[0].name
      uni.uploadFile({
        url: '/minio/uploadFile', // 后端文件上传 API 地址
        filePath: filePath,
        name: 'file', // 表单字段名
        formData: {
          fileName: fileName, // 传递文件名
        },
        success: function (uploadRes) {
          console.log('上传成功', uploadRes)
        },
        fail: function (uploadErr) {
          console.log('上传失败', uploadErr)
        },
      })
    },
  })
}

// #ifdef APP-PLUS
plus.push.getClientInfoAsync(
  (info) => {
    uni.setStorageSync('cid', info.clientid)
    clientid.value = info.clientid
    console.log(clientid.value, 'value')
  },
  (e) => {},
)
// #endif

watchEffect(() => {
  if (!loading.value) {
    if (data.value) {
      user.value = data.value
    } else if (error) {
      if (error.value.code === 401) {
        isLogin.value = true
      }
    }
  }
})
</script>
