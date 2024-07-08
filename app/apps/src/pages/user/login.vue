<route lang="json5">
{
  style: {
    navigationBarTitleText: '登录',
  },
}
</route>
<template>
  <view>
    <view class="login">
      <wd-form ref="form" :model="model">
        <wd-cell-group border>
          <wd-input
            label="邮箱"
            label-width="100px"
            prop="email"
            clearable
            v-model="model.email"
            placeholder="请输入邮箱"
            class="box"
            :rules="[{ required: true, message: '请填写邮箱' }]"
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

      <view @click="handleRegister" class="mt-3 text-center">没有账号 注册一个吧</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { LoginDto, login } from '@/service/user'
const model = reactive<LoginDto>({
  email: '',
  password: '',
})

const form = ref()

function handleSubmit() {
  form.value
    .validate()
    .then(async ({ valid, errors }) => {
      if (valid) {
        const res = await login(model)

        if (res.code === 200) {
          console.log(res, 'res')

          uni.setStorageSync('token', res.data.accessToken)
          uni.setStorageSync('refreshToken', res.data.refreshToken)
          uni.setStorageSync('userInfo', JSON.stringify(res.data.userInfo))
          uni.setStorageSync('userId', res.data.userInfo.id)
          // return
          uni.switchTab({
            url: '/pages/index/index',
          })
        }
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}

const handleRegister = () => {
  uni.navigateTo({
    url: '/pages/user/register',
  })
}
</script>
<style lang="scss" scoped>
.login {
  width: 600rpx;
  padding-top: 100rpx;
  margin: 0 auto;
}

.box {
  padding: 30rpx !important;
}
</style>
