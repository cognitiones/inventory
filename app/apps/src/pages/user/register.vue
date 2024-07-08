<route lang="json5">
{
  style: {
    navigationBarTitleText: '注册',
  },
}
</route>

<template>
  <view class="register">
    <wd-form ref="form" :model="model">
      <wd-cell-group border>
        <wd-input
          label="用户名"
          label-width="100px"
          prop="name"
          clearable
          v-model="model.name"
          placeholder="请输入用户名"
          class="box"
        />
        <wd-input
          label="邮箱"
          label-width="100px"
          prop="email"
          clearable
          v-model="model.email"
          placeholder="请输入邮箱"
          :rules="[{ required: true, message: '请填写邮箱' }]"
          class="box"
        />
        <wd-input
          label="密码"
          label-width="100px"
          prop="password"
          show-password
          clearable
          v-model="model.password"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
          class="mb-5 box"
        />
      </wd-cell-group>
      <view class="footer">
        <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
      </view>
    </wd-form>

    <view @click="handleLogin" class="mt-3 text-center">已有账号 去登录</view>
  </view>
</template>
<script lang="ts" setup>
import { RegisterDto, register } from '@/service/user'
const model = reactive<RegisterDto>({
  email: '',
  name: '',
  password: '',
})
const clientid = ref<string[]>()
const form = ref()

// #ifdef APP-PLUS
plus.push.getClientInfoAsync(
  (info) => {
    uni.setStorageSync('cid', info.clientid)
    clientid.value = [info.clientid]
  },
  (e) => {},
)
// #endif

function handleSubmit() {
  form.value
    .validate()
    .then(async ({ valid, errors }) => {
      if (valid) {
        const res = await register({
          ...model,
          app_clientId: clientid.value,
        })
        console.log(res)
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}

const handleLogin = () => {
  uni.navigateTo({
    url: '/pages/user/login',
  })
}
</script>
<style lang="scss" scoped>
.register {
  width: 600rpx;
  padding: 100rpx;
  margin: 0 auto;
}

.box {
  padding: 30rpx !important;
}
</style>
