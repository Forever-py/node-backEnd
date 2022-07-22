const rq = require('request-promise');
const getAccessToken = require('./getWexhatAccessToken');

// 创建公众号目录
const createMenu = async () => {
	let accessToken = await getAccessToken();
	console.log(accessToken);

	// 定义菜单
	let rqParams = {
		"button": [{
				"type": "click",
				"name": "吃饭票",
				"key": "chifanpiao"
			},
			{
				"name": "购物票",
				"sub_button": [{
						"type": "view",
						"name": "优惠优选",
						"url": "http://www.soso.com/"
					},
					{
						"type": "view",
						"name": "解析返现",
						"url": "https://www.bilibili.com/"
					}
				]
			// },
			// {
			// 	"type": "miniprogram",
			// 	"name": "小程序",
			// 	"url": "http://mp.weixin.qq.com",
			// 	"appid": "wx286b93c14bbf93aa",
			// 	"pagepath": "pages/lunar/index"
			}
		]
	};

	let param = {
		method: 'POST',
		uri: `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken}`,
		body: rqParams,
		json: true
	};

	let res = await rq.post(param);
	console.log('res======>', res)
}

createMenu();
