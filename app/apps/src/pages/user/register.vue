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
          class="mb-5"
        />
        <wd-input
          label="请输入邮箱"
          label-width="100px"
          prop="email"
          clearable
          v-model="model.email"
          placeholder="请输入邮箱"
          :rules="[{ required: true, message: '请填写邮箱' }]"
          class="mb-5"
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
          class="mb-5"
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

const form = ref()

function handleSubmit() {
  form.value
    .validate()
    .then(async ({ valid, errors }) => {
      if (valid) {
        console.log('ok了')
        const res = await register(model)
        console.log(res);

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
.login {
  width: 600rpx;
  margin: 100rpx auto;
}
</style>
<style lang="scss" scoped>
.register {
  width: 600rpx;
  margin: 100rpx auto;
}
</style>
