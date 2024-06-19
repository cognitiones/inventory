<script setup lang="ts">
	import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

	//App.vue
	onLaunch(() => {
		// console.log('App Launch')
		uni.onPushMessage((res) => {
			console.log("收到推送消息222：", res) //监听推送消息
			let { title, content, payload } = res.data
			uni.createPushMessage({
				title: title,
				content: content,
				payload: payload,
				success: function () {
					console.log("创建推送消息成功")
				},
				fail: (err) => {
					console.log("创建推送消息失败", err);
				}
			})
		})
		// // uni-app客户端获取push客户端标记
		plus.push.getClientInfoAsync((info) => {
			console.log('cid:', info)
			uni.setStorageSync('cid', info.clientid)
		}, (e) => { })
	})
	onShow(() => {
		// console.log('App Show')
	})
	onHide(() => {
		// console.log('App Hide')
	})
</script>

<style lang="scss">
	/* stylelint-disable selector-type-no-unknown */
	button::after {
		border: none;
	}

	swiper,
	scroll-view {
		flex: 1;
		height: 100%;
		overflow: hidden;
	}

	image {
		width: 100%;
		height: 100%;
		vertical-align: middle;
	}

	// 单行省略，优先使用 unocss: text-ellipsis
	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	// 两行省略
	.ellipsis-2 {
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	// 三行省略
	.ellipsis-3 {
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
</style>