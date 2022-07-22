const dtkSdk = require('dtk-nodejs-api-sdk');
/*
 *  @checkSign: 1 默认老版本验签  2 新版验签
 *  @appKey: 用户填写 appkey
 *  @appSecret: 用户填写 appSecret
 */
const APP_KEY = '62da4a29cb0a3';
const APP_SECRET = 'a326ed67f9f71bcf2f919e0cd10fcc81';
const sdk = new dtkSdk({
	appKey: APP_KEY,
	appSecret: APP_SECRET,
	checkSign: 2
});
let url = `https://openapi.dataoke.com/api/tb-service/twd-to-twd`;

const getTaoBaoPro = async (content) => {
	let taobaoProInfo = {
		couponInfo: 0, // 优惠券
		price: 0, // 券后价格
		returnMoney: '', // 额外返现
		longTpwd: '' // 淘口令
	}
	let productInfo = await sdk.request(url, {
		method: "GET",
		form: {
			version: "v1.0.0",
			content: content
		}
	});
	let productData = productInfo.data;
	if (productData) {
		taobaoProInfo.couponInfo = productData.originalPrice - productData.actualPrice;
		taobaoProInfo.price = productData.actualPrice;
		taobaoProInfo.returnMoney = ((productData.actualPrice * productData.maxCommissionRate / 100) * 0.9)
			.toFixed(2);
		taobaoProInfo.longTpwd = productData.longTpwd;
	}
	return productData ? taobaoProInfo : null;
	console.log('productInfo', productData)
}
// let proUrl = `【淘宝】https://m.tb.cn/h.fCvoye9?tk=9JzZ2JwdMt4 CZ0001 「【七夕礼物】科颜氏淡斑精华液淡化痘印VC维C抗氧美白双效提亮」
// 点击链接直接打开`
// getTaoBaoPro(proUrl);
// const getBrandList = sdk.request('接口地址', {
// 	method: "GET",
// 	/* 注意:form 里面就不用传appKey与appSecret  */
// 	form: {
// 		pageId: "1",
// 		pageSize: 20,
// 		version: "v1.1.0",
// 	}
// }).then((res) => {
// 	console.log(res, '接口调用成功')
// }, (error, body) => {
// 	console.log(error, '接口调用失败');
// })


exports.getTaoBaoPro = getTaoBaoPro;
