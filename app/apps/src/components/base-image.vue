<template>
  <view class="box">
    <view class="small-img" :class="{ loaded: loaded }" :style="smallImgStyle">
      <image
        @load="handleLoad"
        class="large-img"
        :src="props.src"
        :style="{ width: props.width, height: props.height }"
      ></image>
    </view>
  </view>
</template>
<script lang="ts" setup>
const props = defineProps<{
  src: string
  width: string
  height: string
}>()

const loaded = ref(false)

const smallImgStyle = computed(() => ({
  backgroundImage: `url(${props.src})`,
  width: props.width,
  height: props.height,
}))

const handleLoad = () => {
  console.log('加载完了')
  loaded.value = true
}
</script>
<style lang="scss" scoped>
.box {
  position: relative;
}

.small-img {
  position: absolute;
  background-size: cover;
  background-position: unset;

  filter: blur(5px);
  transition: all 0.5s ease-in-out;
}

.loaded {
  filter: blur(0);
}
</style>
