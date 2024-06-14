// 简单的使用示例
'use strict';
const uniPush = uniCloud.getPushManager({
	appId: "H587414D6"
}) //注意这里需要传入你的应用appId，用于指定接收消息的客户端
exports.main = async (event, context) => {
	console.log('d369630b2b0a3b5ee0baf8daeced7c98')
	return await uniPush.sendMessage({
		"push_clientid": "d369630b2b0a3b5ee0baf8daeced7c98", //填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
		"title": "通知栏显示的标题",
		"content": "通知栏显示的内容",
		"payload": {
			"text": "体验一下uni-push2.0"
		}
	})
};