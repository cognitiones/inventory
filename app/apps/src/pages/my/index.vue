<route lang="json5">
{
  style: {
    navigationBarTitleText: '个人中心',
  },
}
</route>
<template>
  <view>
    <view class="my">
      <wd-upload
        custom-evoke-class="upload"
        :file-list="fileList"
        image-mode="aspectFill"
        :limit="1"
        action="/minio/uploadFile"
        @success="handleUploadSuccess"
        @progress="handleProgress"
        @error="handleFail"
        @change="handleChange"
      ></wd-upload>

      <view>姓名：{{ user.name }}</view>
      <view>邮箱：{{ user.email }}</view>

      // #ifdef APP-PLUS
      <view @click="handleCid(clientid)">设备号：{{ clientid }}</view>
      // #endif
    </view>
  </view>
</template>
<script lang="ts" setup>
import { getUser, updateUser, UpdateUserDto, User } from '@/service/user'

const imgUrl = useUrls('imgUrl')
const userId = uni.getStorageSync('userId')
const { loading, error, data, run } = useRequest(() => getUser({ userId }), { immediate: false })
const user = ref<User>({
  name: '',
  email: '',
  headPic: '',
})

const clientid = ref()

const fileList = ref<any[]>([])

const handleCid = async (cid) => {
  const data: UpdateUserDto = {
    id: userId,
    app: {
      clientId: cid,
    },
  }

  const res = await updateUser(data)
}

const handleChange = ({ fileList }) => {
  fileList.value = fileList
}

const handleFail = ({ error, file, formData }) => {
  console.log(error, 'error')
}

const uploadUser = async () => {
  const data: UpdateUserDto = {
    id: userId,
    headPic: user.value.headPic,
    // apps: {
    //   clientid: cid,
    // },
  }
  const res = await updateUser(data)
  return res
}

const handleUploadSuccess =  ({ file }) => {
  console.log(file.response, 'event')
  user.value.headPic = file.response
  // fileList.value = []

  const res = uploadUser()
  // console.log('上传结果', res)

  // if (res.code === 200) {
  //   fileList.value = [
  //     {
  //       url: imgUrl + file.response,
  //     },
  //   ]
  // }
}

const handleProgress = ({ response, file })=>{
  console.log(file,11);

}

// #ifdef APP-PLUS
plus.push.getClientInfoAsync(
  (info) => {
    uni.setStorageSync('cid', info.clientid)
    clientid.value = info.clientid
  },
  (e) => {},
)
// #endif

watchEffect(() => {
  if (!loading.value) {
    if (data.value) {
      user.value = data.value
      if (data.value.headPic) {
        fileList.value = [
          {
            url: imgUrl + data.value.headPic,
          },
        ]
      }
    } else if (error) {
      if (error.value.code === 401) {
        // isLogin.value = true
      }
    }
  }
})

onShow(() => {
  run()
})
</script>

<style lang="scss" scoped>
.my {
  box-sizing: border-box;
  padding: 20rpx;

}

.upload {
  border-radius: 50%;
}
</style>
