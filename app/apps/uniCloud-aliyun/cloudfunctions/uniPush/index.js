// 简单的使用示例
'use strict';
const uniPush = uniCloud.getPushManager({
	appId: "H587414D6"
}) //注意这里需要传入你的应用appId，用于指定接收消息的客户端
exports.main = async (event, context) => {
	let { clientid, title, content, payload } = event.queryStringParameters
	return await uniPush.sendMessage({
		"push_clientid": clientid, //填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
		"title": title,
		"content": content,
		"payload": payload
	})
};