const crypto = require('crypto'); // 引入加密模块
const conf = require('./conf');

// 封装一个 sha1 加密函数
function sha1(str) {
	return crypto.createHash('sha1').update(str).digest('hex');
}

const validateWechatHost = async (ctx) => {
	try {
		const {
			signature,
			echostr,
			timestamp,
			nonce
		} = ctx.query;

		// 将token、timestamp、nonce三个参数进行字典序排序
		const stringArray = [conf.token, timestamp, nonce];
		const resultArray = stringArray.sort();;

		// 将三个参数字符串拼接成一个字符串进行sha1加密
		const resultString = resultArray.join("");
		const hashResult = sha1(resultString);

		let isWechatHost = false
		if (hashResult == signature) {
			isWechatHost = true
		}
		return {
			echostr,
			isWechatHost
		};
	} catch (e) {
		console.log(e)
	}
}

module.exports = validateWechatHost;
