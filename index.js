const koa = require('koa');
const koaBody = require('koa-body'); // 安装koa-body解析微信公众号服务器发送post请求数据
const validateWechatHost = require('./utils/validateWechaHost');
const xml2js = require('xml2js');
const xmlTool = require('./utils/xmlTool');
const {
	createResData
} = require('./utils/createResponseData');
const {
	getTaoBaoPro
} = require('./utils/getTaoBaoProduct');

const app = new koa();

app.use(koaBody({
	json: true
}))

// 安装koa-body解析微信公众号服务器发送过来的xml
app.use(async (ctx) => {
	let validateRes = await validateWechatHost(ctx);
	if (ctx.request.method == 'GET' && validateRes.isWechatHost) {
		ctx.body = validateRes.echostr;
	} else if (ctx.request.method == 'POST' && validateRes.isWechatHost) {
		let xmlString = await xml2js.parseStringPromise(ctx.request.body);
		let xmlTemp = xmlString.xml;
		let xmlJson = {}
		for (let item in xmlTemp) {
			xmlJson[item] = xmlTemp[item][0]
		}
		switch (xmlJson.MsgType) {
			case 'text':
				// 查询淘宝官方接口，返回商品返现和优惠券详情
				console.log(xmlJson.Content);
				const result = await getTaoBaoPro(xmlJson.Content);
				xmlJson.type = 'text';
				if (result == null) {
					xmlJson.content = '亲，该商家暂无活动哦!'
				} else {
					let {
						couponInfo,
						price,
						returnMoney,
						longTpwd
					} = result;
					xmlJson.content =
						`优惠券：${couponInfo}\n券后价格：${price}\n额外返现：${returnMoney}\n-----------------------\n${longTpwd}`;
				}
				break;
			case 'event':
				if (xmlJson.EventKey === 'chifanpiao') {
					xmlJson.type = 'news';
					xmlJson.content = [{
							title: '学习记录1',
							describe: '这里有很多很多的学习资料，请点击后查看',
							picurl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F0G020114924%2F200G0114924-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661062061&t=f92d92b677eed6646d532ac8ea5b4e57',
							url: 'http://www.bilibili.com'
						},
						{
							title: '学习记录2',
							describe: '这里有很多很多的学习资料，请点击后查看',
							picurl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F0G020114924%2F200G0114924-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661062061&t=f92d92b677eed6646d532ac8ea5b4e57',
							url: 'http://www.bilibili.com'
						}, {
							title: '学习记录3ss',
							describe: '这里有很多很多的学习资料，请点击后查看',
							picurl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F0G020114924%2F200G0114924-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661062061&t=f92d92b677eed6646d532ac8ea5b4e57',
							url: 'http://www.bilibili.com'
						}
					];
				}
				break;
			default:
				break;
		}
		let resMsg = createResData(xmlJson)
		ctx.body = resMsg;
	}
})

app.listen('8080');
console.log('server is on at 8080');
