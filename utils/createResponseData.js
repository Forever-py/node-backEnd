/**
 * 1、接收发送的内容
 * 2、接收发送的消息类型
 */
const createResData = (res) => {
	let commData = `<xml>
	  <ToUserName><![CDATA[${res.FromUserName}]]></ToUserName>
	  <FromUserName><![CDATA[${res.ToUserName}]]></FromUserName>
	  <CreateTime>${new Date().getTime()}</CreateTime>
	  <MsgType><![CDATA[${res.type}]]></MsgType>`
	let newsItem = ''
	if (res.type === 'news') {
		res.content.forEach(item => {
			newsItem += `<item>
					<Title><![CDATA[${item.title}]]></Title>
					<Description><![CDATA[${item.describe}]]></Description>
					<PicUrl><![CDATA[${item.picurl}]]></PicUrl>
					<Url><![CDATA[${item.url}]]></Url>
				</item>`
		})
	}

	let typeMap = {
		"text": `<Content><![CDATA[${res.content}]]></Content>`,
		"news": `<ArticleCount>${res.content?.length}</ArticleCount><Articles>${newsItem}</Articles>`
	}
	return commData + typeMap[res.type] + '</xml>';
}


exports.createResData = createResData;
