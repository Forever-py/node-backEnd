// 调用微信接口获取accesstoken保存在后台并且及时刷新

const rq = require('request-promise');
const conf = require('./conf');
const fs = require('fs'); // 引入文件操作模块

const file_path = __dirname + '/token_file/accessToken.json'; // access_token 存储的文件目录
let uri =
	`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${conf.appId}&secret=${conf.appSecret}`;

// 更新新获取access_token
const updateAccessToken = async () => {
	// 请求微信接口获取token
	let resAccessToken = await rq(uri);
	let formateToken = JSON.parse(resAccessToken);

	// 有效期 两小时 7200s 而时间戳是毫秒
	let expireTime = new Date().getTime() + formateToken.expires_in * 1000;
	formateToken.expireTime = expireTime;

	// 写入文件
	fs.writeFileSync(file_path, JSON.stringify(formateToken));
}

const getAccessToken = async () => {
	try {
		// 获取本地存储的accessToken
		let localToken = await fs.readFileSync(file_path, 'utf-8');

		// 判断本地token是否过期
		let localTokenFormat = JSON.parse(localToken);
		let nowTime = new Date().getTime();

		let resultToken = '';
		if (nowTime - localTokenFormat.expireTime >= 0) {
			await updateAccessToken();
			await getAccessToken();
		} else {
			resultToken = localTokenFormat.access_token
		}
		return resultToken;
	} catch (e) {
		await updateAccessToken();
		await getAccessToken();
	}
}

module.exports = getAccessToken;

// setInterval(() => {
// getAccessToken().then(res => {
// 	console.log(res);
// })
// }, 7200 * 1000)
