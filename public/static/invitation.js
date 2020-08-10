let nodes = new Map(); //所有控件的集合
let idMap = new Map(); //所有控件的集合
let nodeStyleMap = new Map(); // 所有控件的集合


let mouseIsDown = false;
let currentNode;
let mouseX = 0;
let mouseY = 0;
let nodeX = 0;
let nodeY = 0; 
let nodeWidth;  
let nodeHeight;

let moveMethod;
let vue = null
let defaultStyle = null

// 每页的数据格式
export function eachPageData(_this) {
	return {
		page: _this.curPage,
		dataPre: [],
		eleList: [],
		model: {
			width: 375,
			height: 649,
			img: '../assets/temp-01.jpg'
		},
		formAttr: {
			'enable': true, // 使用表单标记
			'sex': true, // 性别
			'company': true, // 单位
			'department': true, // 部门
			'post': true, // 职务
			'email': true // 电子邮件
		},
	}
}

// 文本
var textStyle = {
	"opacity": 100, // 透明度
	// "backColor": "#FFFFFF", // 文本背景颜色
	"borderColor": "#2c3e50", // 文本边框颜色
	"borderStyle":"none", // 边框状态  直线 虚线 双直线
	"borderWidth":0, // 边框宽度
	"borderRadius":0, // 边框弧形角度
	"shadowWidth":0,  // 阴影大小
	"shadowColor":"#000",  // 阴影颜色
	"shadowDim":0,   // 阴影模糊程度
	"shadowDirectionV":0,  // 阴影水平方向移动
	"shadowDirectionH":0,  // 阴影垂直方向移动
	"z-index": '5', // 元素层级 最底层：1 默认：5 最顶层：9
	"width": '60%', // 文本基础宽度
	"height": '40px', // 文本基础高度
	'el-x': '', // 创建的文本元素距离模板左的距离
	'el-y': '', // 创建的文本元素距离模板上的距离

	"textColor": "#2c3e50", // 字体颜色
	"fontFamily": "微软雅黑", // 字体
	"fontSize": "14px", // 字体大小
	"lineSpa": 0, // 字体间距
	"lineHeight": 16, // 行高
	"textAlign": "left", // 文本对齐方式 left center right
	"fontWeight": false, // 字体粗细
	"textDecoration": false, // 文本下划线
	"fontStyle": false, // 文本斜体

	'cte': '' // 内容
}

// 图片
var imgStyle = {
	"opacity": 100, // 透明度
	// "backColor": "#FFFFFF", // 背景颜色
	"borderColor": "#2c3e50", // 边框颜色
	"borderStyle":"none", // 边框状态  直线 虚线 双直线
	"borderWidth":0, // 边框宽度
	"borderRadius":0, // 边框弧形角度
	"shadowWidth":0,  // 阴影大小
	"shadowColor":"#000",  // 阴影颜色
	"shadowDim":0,   // 阴影模糊程度
	"shadowDirectionV":0,  // 阴影水平方向移动
	"shadowDirectionH":0,  // 阴影垂直方向移动
	"z-index": '5', // 元素层级 最底层：1 默认：5 最顶层：9
	'el-x': '', // 创建的文本元素距离模板左的距离
	'el-y': '', // 创建的文本元素距离模板上的距离
	"width": '120px', // 文本基础宽度
	"height": '120px', // 文本基础高度
	
	"url": '', // 图片id
}

import $, { data } from 'jquery'

window.allowDrop = function(event) {
	event.preventDefault();
}

function textDrag(event) { 
	event = event || window.event

	event.dataTransfer.setData("text", 'invite-text')
}

export function textDragover(event) {
	event = event || window.event
	event.preventDefault()
}

export function drop(event, _this) {
	// 去除事件冒泡
	event = event || window.event
	console.log(event)
	event.stopPropagation();
	event.preventDefault();
	
	// 保存 vue 对象
	vue = _this

	window.v = _this
	// 获取元素类型
	let data = event.dataTransfer.getData("text");
	//如果不是拖动的文本框，不响应
	console.log(data)
	if (!$(event.target).hasClass('phone-item')) {
		return;
	}
	let node 
	var nodeValue;
	if (data == 'invite-text') {
		nodeValue = "文本";
		node = document.getElementById('textTemplate').cloneNode(true);
		// 将元素 默认数据 统一保存在defaultStyle 对象中
		defaultStyle = textStyle
		
		// 元素样式配置
		_this.isImage = false

		// 给文本元素增加 oninput 事件
		node.oninput = getText

		/**
		 * 文本元素获取焦点 清空提示内容
		 * 文本元素失去焦点 内容为空给出提示
		 */
		var textDom = $(node).find('.invite-text-box-text')[0]
		textDom.onfocus = getFocus
		textDom.onblur = getBlur

	} else if (data == 'image') {
		nodeValue = "图片";
		node = document.getElementById('imageTemplate').cloneNode(true);
		// 将元素 默认数据 统一保存在defaultStyle 对象中
		defaultStyle = imgStyle
		// 元素样式配置
		_this.isImage = true
	}

	// 给元素添加  右键事件
	let elem = $(node).find('.invite-text-box')[0]
	elem.oncontextmenu = rightCilik

	// 给右键列表添加 移出事件
	let rightC_list = $(elem).find('.rightC-list')[0]
	rightC_list.onmouseout = rightList

	// 给右键列表增加点击事件
	let delDom = $(rightC_list).find('.del')[0]
	delDom.onclick = delEle

	// 保存类型
	defaultStyle.type = data

	if (!node) {
		return;
	}
	
	hideBox()
	//确定鼠标位置
	let x = event.layerX - 80;
	let y = event.layerY - 20;
	console.log("xy = " + x, y)

	// 将坐标x, y 保存默认数据中 defaultStyle
	defaultStyle['el-x'] = x
	defaultStyle['el-y'] = y

	// 将当前dom 放入vue.tNode 中
	_this.tNode = node
	_this.defaultStyle = defaultStyle

	// 配置唯一ID
	node.id = uuid()
	console.log("node = "+node)

	/**
	 * 数据收集  dataCollection
	 * 判断是否存在当前页的 数据 
	 * 		判断机制：当前页码(curPage) > 数据长度(dataCollection.length)	?
	 * 						 不存在 : 存在
	 * 
	 *    不存在：创建一条新记录,
	 *      { 
						page: '1',  // 页码标识
						dataPre: [], // 每页对应的元素映射
						eleList: [], // 保存每页的元素列
						model: {}, // 模板相应数据
					}
					在dataPre中添加新 映射对象
					在eleList中添加新 记录

				存在： 找到与当前页码对应的记录 
					在dataPre中添加新 映射对象 
					在eleList中添加新 记录
	 */

	// if(_this.curPage > _this.dataCollection.length){
	// 	// 创建新记录
	// 	_this.dataCollection.push(eachPageData(_this))
	// } 

	console.log('当前页', _this.curPage - 1)

	_this.dataCollection.filter( item => {
		if(item.page == _this.curPage){
			console.log(1)
			item.dataPre.push({key: node.id, value: defaultStyle})
			item.eleList.push({ id: node.id, nodeValue })
		}
	})
	// // 插入新的 映射对象 
	// _this.dataCollection[_this.curPage - 1].
	// // 插入新的 元素列
	// _this.dataCollection[_this.curPage - 1].


	// 元素列
	// _this.idList.push({ id: node.id, nodeValue })

	// idMap.set(node.id,_this.showKey)
	
	// nodeStyleMap.set(node.id,defaultStyle)
	
	// 设置元素位置和样式
	// $(node).css('display', 'block')
	// $(node).css('position', 'absolute')
	// console.log("设置 xy = " + x, y)
	// $(node).css('transform', "translate(" + x + "px," + y + "px)")
	console.log(defaultStyle)
	// 把控件保存起来
	// nodes.set(node.id, node)

	// 渲染 当前dom
	renderingDom(data, defaultStyle)

	// 给控件绑定点击事件
	$(node).click(function(e) {
		e.stopPropagation()
		e.preventDefault()
		hideBox()
		// 更换 当前操作元素 vue.tNode
		vue.tNode = node
		// console.log(vue.tNode)
		// 获取元素 id
		let id = $(node).attr('id')

		// 拿到 dataCollection 中与 id匹配的数据 把数据赋值给 vue.defaultStyle
		let dataPre = vue.dataCollection[vue.curPage - 1].dataPre
		dataPre.filter( item => item.key == id ? vue.defaultStyle = item.value : '')

		if(vue.defaultStyle.type == 'image'){
			vue.isImage = true
		} else {
			vue.isImage = false
		}

		$('.invite-text-box-border').css('display', 'none')

		$(this).find('.invite-text-box-border').css('display', 'block')
		$(this).find('.btn-upload').css('display', 'block')
		var but = document.getElementById("itemId"+node.id);
		if(but != null){
			$(".check").removeClass("check")
			$("#" +'itemId'+ node.id).addClass("check");
		}
		if(_this.activeName.length === 0){
			_this.activeName.push("1")
			 _this.activeName.push("2")
			 _this.activeName.push("3")
			}
		// _this.initTemplateCss(this)
		// $('#baseStyle').click();
	})

	// 给控件绑定鼠标按下的事件
	$(node).mousedown(function(e) {
		// 鼠标按下时，初始化当前控件的各项属性
		// if ($(e.target).hasClass('edit-text')) {
		// 	// moveMethod='topResize'
		// 	return
		// }
		mouseIsDown = true;
		currentNode = this;
		mouseX = e.pageX;
		mouseY = e.pageY;
		moveMethod = 'move';
		let trans = $(this).css('transform')
		let s = trans.split(',');
		nodeWidth = $(this).css('width').replace('px', '') - 0;
		nodeHeight = $(this).css('height').replace('px', '') - 0
		console.log(nodeWidth, nodeHeight)
		nodeX = s[4] - 0
		nodeY = s[5].substr(0, s[5].length - 1) - 0
		console.log($(e.target).hasClass('top-line-point'))
		if ($(e.target).hasClass('top-line-point')) {
			moveMethod = 'topResize'
		} else if ($(e.target).hasClass('left-line-point')) {
			moveMethod = 'leftResize'
		} else if ($(e.target).hasClass('right-line-point')) {
			moveMethod = 'rightResize'
		} else if ($(e.target).hasClass('bottom-line-point')) {
			moveMethod = 'bottomResize'
		} else if ($(e.target).hasClass('left-top-point')) {
			moveMethod = 'leftTopResize'
		} else if ($(e.target).hasClass('right-top-point')) {
			moveMethod = 'rightTopResize'
		} else if ($(e.target).hasClass('left-bottom-point')) {
			moveMethod = 'leftBottomResize'
		} else if ($(e.target).hasClass('right-bottom-point')) {
			moveMethod = 'rightBottomResize'
		}

	});
	//把控件添加到容器内
	event.target.appendChild(node);
	// 触发一次控件的点击事件
	$(node).click()

}

// 渲染当前 元素dom
function renderingDom(elType, obj){
	// 当前dom
	let tNode = vue.tNode
	// console.log(tNode, obj)

	// 给tNode 编写css属性 公共属性
	tNode.style = `
		opacity: ${obj.opacity / 100};
		border-color: ${obj.borderColor};
		border-style: ${obj.borderStyle};
		border-width: ${obj.borderWidth}px;
		border-radius: ${obj.borderRadius}px;
		z-index: ${obj['z-index']};
		box-shadow: ${obj.shadowWidth}px ${obj.shadowDirectionV}px ${obj.shadowDirectionH}px ${obj.shadowDim}px ${obj.shadowColor};
		width: ${obj.width};
		height: ${obj.height};
		transform: translate(${obj['el-x']}px, ${obj['el-y']}px);
	`

	// 文本
	if(elType == 'invite-text'){
		var alonePos = [
			{css: 'color', self: 'textColor', company: ''},
			{css: 'font-family', self: 'fontFamily', company: ''},
			{css: 'font-size', self: 'fontSize', company: 'px'},
			{css: 'letter-spacing', self: 'lineSpa', company: 'px'},
			{css: 'line-height', self: 'lineHeight', company: 'px'},
			{css: 'text-align', self: 'textAlign', company: ''},
			{css: 'text-weight', self: 'fontWeight', company: ''},
			{css: 'text-decoration', self: 'textDecoration', company: ''},
			{css: 'font-style', self: 'fontStyle', company: ''}
		]

		for(let i in alonePos){
			tNode.style[alonePos[i].css] = obj[alonePos[i].self] + alonePos[i].company
		}

	} else 
	// 图片
	if(elType == 'image'){
		// url
		tNode.style.backgroundColor = obj['url']
	}
}

let formData = {
	'el-x': 10,
	'el-y': 50,
	'width': '80%',
	'height': '320',

	formAttr: {
		'enable': true, // 使用表单标记
		'sex': true, // 性别
		'company': true, // 单位
		'department': true, // 部门
		'post': true, // 职务
		'email': true // 电子邮件
	},
	'type': 'form'
}

export function addSubmitForm(_this) {
	// 每页只能存在一个表单
	var eleList = _this.dataCollection[_this.curPage - 1].eleList
	var is_form = eleList.map(item => item.nodeValue == '表单' && true).filter(item => item)[0]

	console.log(is_form)
	if (is_form) {
		console.log('已存在表单')
		// //不需要表单
		// let forms = $('#mc').find('.formTemplate');	
		// for (let i = 0; i < forms.length; i++) {
		// 	$(forms[i]).remove()
		// }

		return
	}
	
	// 取出其它的选中效果
	$('.invite-text-box-border').css('display', 'none')

	// 获取 vue 对象
	vue = _this

	//需要添加表单，先判断是否己经有表单了，如果有了，按配置变更显示项，否则先添加一下，再按配置变更显示项
	let forms = $('#mc').find('.formTemplate');
	if (forms.length >= 1) {
		//己经存在表单
		_this.updateSubmitForm(forms[0])
		return
	}
	// 没有存在表单，就要先添加一个
	let node = document.getElementById('formTemplate').cloneNode(true)

	// 给元素添加  右键事件
	let elem = $(node).find('.invite-text-box')[0]
	elem.oncontextmenu = rightCilik

	// 给右键列表添加 移出事件
	let rightC_list = $(elem).find('.rightC-list')[0]
	rightC_list.onmouseout = rightList

	// 给右键列表增加点击事件
	let delDom = $(rightC_list).find('.del')[0]
	delDom.onclick = delEle

	node.id = uuid()
	$(node).css('display', 'block')
	$($('#mc').find('.phone-item')[_this.showKey]).append(node);

	/**
	 * 渲染表单dom 
	 * 
	 */
	$(node).css({
		'transform': `translate(${formData['el-x']}px,${formData['el-y']}px)`,
		'width': `${formData.width}`,
		'height': `${formData.height}px`,
	})

	// 覆盖 dataCollection.formAttr
	var formAttr = _this.dataCollection[_this.curPage - 1].formAttr
	formData.formAttr = formAttr

	// 将表单添进 dataCollection.dataPre
	var dataPre = _this.dataCollection[_this.curPage - 1].dataPre
	dataPre.push({key: node.id, value: formData})

	// 将表单记录添进 dataCollection.eleList
	eleList.push({id: node.id, nodeValue: '表单'})

	_this.defaultStyle = formData

	console.log(dataPre, eleList)
	// initNode(node, _this)
// return 
	$(node).click(function(e) {
		e.stopPropagation()
		e.preventDefault()
		hideBox()
		$(this).find('.invite-text-box-border').css('display', 'block')
		// _this.initTemplateCss(this)
		
		if(_this.activeName.length === 0){
			_this.activeName.push("1")
			 _this.activeName.push("2")
			 _this.activeName.push("3")
			}
			
	})
	$(node).mousedown(function(e) {

		$(".check").removeClass("check")
		 $("#" +'itemId'+ node.id).addClass("check");
		
		// var nodeElement = $("#"+ node.id);
		// console.log("zzzz",nodeElement.css('color'))
		// 鼠标按下时，初始化当前控件的各项属性
		// if ($(e.target).hasClass('edit-text')) {
		// 	// moveMethod='topResize'
		// 	return
		// }
		console.log("mouseIsDown = " + mouseIsDown)
		mouseIsDown = true;
		currentNode = this;
		mouseX = e.pageX;
		mouseY = e.pageY;
		moveMethod = 'move';
		let trans = $(this).css('transform')
		let s = trans.split(',');
		console.log(s)
		nodeWidth = $(this).css('width').replace('px', '') - 0;
		nodeHeight = $(this).css('height').replace('px', '') - 0
		console.log(nodeWidth, nodeHeight, s)
		nodeX = s[4] - 0
		nodeY = s[5].substr(0, s[5].length - 1) - 0
		console.log($(e.target).hasClass('top-line-point'))
		if ($(e.target).hasClass('top-line-point')) {
			moveMethod = 'topResize'
		} else if ($(e.target).hasClass('left-line-point')) {
			moveMethod = 'leftResize'
		} else if ($(e.target).hasClass('right-line-point')) {
			moveMethod = 'rightResize'
		} else if ($(e.target).hasClass('bottom-line-point')) {
			moveMethod = 'bottomResize'
		} else if ($(e.target).hasClass('left-top-point')) {
			moveMethod = 'leftTopResize'
		} else if ($(e.target).hasClass('right-top-point')) {
			moveMethod = 'rightTopResize'
		} else if ($(e.target).hasClass('left-bottom-point')) {
			moveMethod = 'leftBottomResize'
		} else if ($(e.target).hasClass('right-bottom-point')) {
			moveMethod = 'rightBottomResize'
		}

	});

	_this.updateSubmitForm(node)

} //addSubmitForm

// text = 元素列显示的文字
export function initNode(node, _this,text) {
		if(text !== undefined){
			 var idObject = {};
			 idObject.id = $(node).attr('id');
			 idObject.nodeValue = text;
			 _this.idList.push(idObject)
			 idMap.set(node.id,_this.showKey)
		}
	

	nodes.set($(node).attr('id'), node)
	
	$(node).click(function(e) {
		e.stopPropagation()
		e.preventDefault()
		hideBox()
		$(this).find('.invite-text-box-border').css('display', 'block')
		// _this.initTemplateCss(this)
		
		if(_this.activeName.length === 0){
			_this.activeName.push("1")
			 _this.activeName.push("2")
			 _this.activeName.push("3")
			}
			
	})
	$(node).mousedown(function(e) {
		$(".check").removeClass("check")
		 $("#" +'itemId'+ node.id).addClass("check");
		
		// var nodeElement = $("#"+ node.id);
		// console.log("zzzz",nodeElement.css('color'))
		// 鼠标按下时，初始化当前控件的各项属性
		if ($(e.target).hasClass('edit-text')) {
			// moveMethod='topResize'
			return
		}
		console.log("mouseIsDown = " + mouseIsDown)
		mouseIsDown = true;
		currentNode = this;
		mouseX = e.pageX;
		mouseY = e.pageY;
		moveMethod = 'move';
		let trans = $(this).css('transform')
		let s = trans.split(',');
		// nodeWidth = $(this).css('width').replace('px', '') - 0;
		// nodeHeight = $(this).css('height').replace('px', '') - 0
		// console.log(nodeWidth, nodeHeight, s)
		nodeX = s[4] - 0
		nodeY = s[5].substr(0, s[5].length - 1) - 0
		console.log($(e.target).hasClass('bottom-line-point'))
		if ($(e.target).hasClass('top-line-point')) {
			moveMethod = 'topResize'
			$(e.target).css('cursor', 's-resize')
		} else if ($(e.target).hasClass('left-line-point')) {
			moveMethod = 'leftResize'
			$(e.target).css('cursor', 'w-resize')
		} else if ($(e.target).hasClass('right-line-point')) {
			moveMethod = 'rightResize'
			$(e.target).css('cursor', 'w-resize')
		} else if ($(e.target).hasClass('bottom-line-point')) {
			moveMethod = 'bottomResize'
			$(e.target).css('cursor', 's-resize')
		} else if ($(e.target).hasClass('left-top-point')) {
			moveMethod = 'leftTopResize'
		} else if ($(e.target).hasClass('right-top-point')) {
			moveMethod = 'rightTopResize'
		} else if ($(e.target).hasClass('left-bottom-point')) {
			moveMethod = 'leftBottomResize'
		} else if ($(e.target).hasClass('right-bottom-point')) {
			moveMethod = 'rightBottomResize'
		}

	});
}

// 生成唯一id
function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

// 还原元素
export function reduction(_this){

	// 创建dom
	let dataCollection = _this.dataCollection
	let curPage = _this.curPage
	let node
	vue = _this

	for(let item of dataCollection[curPage - 1].dataPre){
		var data = item.value.type
		
		if (data == 'invite-text') {
			node = document.getElementById('textTemplate').cloneNode(true);
			// 将元素 默认数据 统一保存在defaultStyle 对象中
			defaultStyle = item.value
			
			// 元素样式配置
			_this.isImage = false

			// 给文本元素增加 oninput 事件
			node.oninput = getText

			/**
			 * 文本元素获取焦点 清空提示内容
			 * 文本元素失去焦点 内容为空给出提示
			 */
			var textDom = $(node).find('.invite-text-box-text')[0]
			textDom.onfocus = getFocus
			textDom.onblur = getBlur
			
		} else if (data == 'image') {
			node = document.getElementById('imageTemplate').cloneNode(true);
			// 将元素 默认数据 统一保存在defaultStyle 对象中
			defaultStyle = item.value
			// 元素样式配置
			_this.isImage = true

		} else if(data == 'form') {
			node = document.getElementById('formTemplate').cloneNode(true);
			// 将元素 默认数据 统一保存在defaultStyle 对象中
			defaultStyle = item.value
			// 元素样式配置
			_this.isImage = false
		}

		node.id = item.key
		
		_this.tNode = node
		// 元素数据赋值给 vue.defaultStyle
		_this.defaultStyle = defaultStyle

		// 元素附加拖动效果
		dropEffect(node, _this)

		// 给元素添加 右键事件
		let elem = $(node).find('.invite-text-box')[0]
		elem.oncontextmenu = rightCilik

		// 给右键列表添加 移出事件
		let rightC_list = $(elem).find('.rightC-list')[0]
		rightC_list.onmouseout = rightList

		// 给右键列表增加点击事件
		let delDom = $(rightC_list).find('.del')[0]
		delDom.onclick = delEle

		document.querySelector('.phone-item').appendChild(node)

		// 渲染dom 表单不适合 
		if(data == 'invite-text'){
			renderingDom(data, defaultStyle)

			// 获取文本内容
			$(node).find('.invite-text-box-text')[0].innerText = defaultStyle.cte || '点击这里编辑'
		} else if(data == 'image'){
			renderingDom(data, defaultStyle)

			node.style.backgroundImage = `url(${defaultStyle.url})`
			// 获取文本内容
			// console.log($(node).find('.invite-text-box'))
			$(node).find('.invite-text-box-text')[0].innerText = defaultStyle.url ? ' ' :  '请上传图片1'
		} else {
			/**
			 * 渲染表单dom 
			 * 
			 */
			$(node).css({
				'transform': `translate(${defaultStyle['el-x']}px,${defaultStyle['el-y']}px)`,
				'width': `${defaultStyle.width}`,
				'height': `${defaultStyle.height}px`,
				'display': 'block'
			})
			console.log(defaultStyle.formAttr)
			for(let i in defaultStyle.formAttr){
				if(i != 'enable')
				_this.initForm(i, 'no-update')
			}

		}

		// 去除选中标识
		$('.invite-text-box-border').css('display', 'none')
	}
}

// 元素附加拖动效果
function dropEffect(node, _this){
	$(node).click(function(e) {
		e.stopPropagation()
		e.preventDefault()
		hideBox()

		// 更换 当前操作元素 vue.tNode
		vue.tNode = node

		// 获取元素 id
		let id = $(node).attr('id')

		// 拿到 dataCollection 中与 id匹配的数据 把数据赋值给 vue.defaultStyle
		let dataPre = vue.dataCollection[vue.curPage - 1].dataPre
		dataPre.filter( item => item.key == id ? vue.defaultStyle = item.value : '')

		if(vue.defaultStyle.type == 'image'){
			vue.isImage = true
		} else {
			vue.isImage = false
		}
		// 去除选中标识
		$('.invite-text-box-border').css('display', 'none')
		$(this).find('.invite-text-box-border').css('display', 'block')
		// _this.initTemplateCss(this)
		
		if(_this.activeName.length === 0){
			_this.activeName.push("1")
			 _this.activeName.push("2")
			 _this.activeName.push("3")
		}

	})
	$(node).mousedown(function(e) {

		$(".check").removeClass("check")
		 $("#" +'itemId'+ node.id).addClass("check");
		
		// var nodeElement = $("#"+ node.id);
		// console.log("zzzz",nodeElement.css('color'))
		// 鼠标按下时，初始化当前控件的各项属性
		// if ($(e.target).hasClass('edit-text')) {
		// 	// moveMethod='topResize'
		// 	return
		// }
		console.log("mouseIsDown = " + mouseIsDown)
		mouseIsDown = true;
		currentNode = this;
		mouseX = e.pageX;
		mouseY = e.pageY;
		moveMethod = 'move';
		let trans = $(this).css('transform')
		let s = trans.split(',');
		console.log(s)
		nodeWidth = $(this).css('width').replace('px', '') - 0;
		nodeHeight = $(this).css('height').replace('px', '') - 0
		console.log(nodeWidth, nodeHeight, s)
		nodeX = s[4] - 0
		nodeY = s[5].substr(0, s[5].length - 1) - 0
		console.log($(e.target).hasClass('top-line-point'))
		if ($(e.target).hasClass('top-line-point')) {
			moveMethod = 'topResize'
		} else if ($(e.target).hasClass('left-line-point')) {
			moveMethod = 'leftResize'
		} else if ($(e.target).hasClass('right-line-point')) {
			moveMethod = 'rightResize'
		} else if ($(e.target).hasClass('bottom-line-point')) {
			moveMethod = 'bottomResize'
		} else if ($(e.target).hasClass('left-top-point')) {
			moveMethod = 'leftTopResize'
		} else if ($(e.target).hasClass('right-top-point')) {
			moveMethod = 'rightTopResize'
		} else if ($(e.target).hasClass('left-bottom-point')) {
			moveMethod = 'leftBottomResize'
		} else if ($(e.target).hasClass('right-bottom-point')) {
			moveMethod = 'rightBottomResize'
		}

	});
}

// 给元素添加右键事件
let rightCilik = function (e) {
	// 去除其它元素 选中样式
	$('.invite-text-box-border').css('display', 'none')
	
	// 增加选中样式
	$(this).find('.invite-text-box-border').css('display', 'block')

	// 获取元素 数据
	var id = this.parentNode.id
	var dataPre = vue.dataCollection[vue.curPage - 1].dataPre
	var style = dataPre.filter( item => id == item.key && item)[0].value

	// 获取当前元素 相对模板坐标
	var p_x = e.layerX - +style['el-x']
	var p_y = e.layerY - +style['el-y']

	console.log(p_x, p_y)
	// 显示右键列表
	$(this).find('.rightC-list')[0].style = `
		display: flex;
		top: ${p_y}px;
		left: ${p_x}px;
	`
}

// 给右键列表添加移出事件
let rightList = function (e) {
	if(!e.toElement.classList.contains('currency')){
		// 隐藏右键列表
		this.style.display = 'none'
	}
}

// 获取 删除元素
function delEle(e){
	console.log('删除元素')
	// 删除 vue.dataCollection.dataPre, eleList 数据
	let delDom = e.path[3]
	let id = delDom.id

	let dataPre = vue.dataCollection[vue.curPage - 1].dataPre
	let eleList = vue.dataCollection[vue.curPage - 1].eleList

	for(let i = 0; i < dataPre.length; i++){
		if(dataPre[i].key == id){
			dataPre.splice(i, 1)
			break
		}
	}

	for(let i = 0; i < eleList.length; i++){
		if(eleList[i].id == id){
			eleList.splice(i, 1)
			break
		}
	}

	// 删除 dom
	document.querySelector('.phone-item').removeChild(e.path[3])

	setTimeout(() => {
		// 重置数据
		vue.tNode = null
		vue.defaultStyle = {}
	}, 100)
}

// 获取文本输入内容
function getText(e){
	// var dataPre = 
	// _this.cte = e.innerText
	console.log(this.id)
	var id = this.id

	let dataPre = vue.dataCollection[vue.curPage - 1].dataPre
	dataPre.filter( item => item.key == id ? item.value.cte = this.innerText : '')
}

// 获取焦点
function getFocus(e){
	if(e.path[0].innerText == '点击这里编辑'){
		e.path[0].innerText = ''
	}
}

// 失去焦点
function getBlur(e){
	if(e.path[0].innerText == ''){
		e.path[0].innerText = '点击这里编辑'
	}
}

export function hideBox(showStyle) {
	// for (let i = 0; i < nodes.length; i++) {
	//     //     // $(nodes[i]).css('color','blue')
	//     //     $(nodes[i]).find('.invite-text-box-border').css('display', 'none')
	//     // }

	nodes.forEach(function(node) {
		$(node).find('.invite-text-box-border').css('display', 'none')
		$(node).find('.btn-upload').css('display', 'none')
	})
	showStyle = false
}

document.body.ondrop = function(event) {
	event = event || window.event
	event.stopPropagation()
	event.preventDefault()

}

document.body.onmouseup = function(event) {
	// 释放控件及属性
	mouseIsDown = false;
	currentNode = null
	moveMethod = '';
}

document.body.onmousemove = function(event) {

	if (!mouseIsDown || !currentNode || $(currentNode).find('.invite-text-box-border').css('display') == 'none') {
		return
	}

	let moveX = event.pageX - mouseX;
	let moveY = event.pageY - mouseY;

	// 鼠标放在右键列表时 不执行
	if(event.path[0].classList.contains('currency')){
		return 
	}
	// console.log("move = " +moveX,moveY,(nodeX+moveX),(nodeY+moveY))
	if (moveMethod == 'move') {
		console.log("move")
		// 移动时修改鼠标样式
		event.path[0].style.cursor = 'move'
		move(moveX, moveY)
	} else if (moveMethod == 'topResize') {
		topResize(moveX, moveY)
	} else if (moveMethod == 'bottomResize') {
		bottomResize(moveX, moveY)
	} else if (moveMethod == 'leftResize') {
		leftResize(moveX, moveY)
	} else if (moveMethod == 'rightResize') {
		rightResize(moveX, moveY)
	}else if (moveMethod == 'rightBottomResize') {
		rightBottomResize(moveX, moveY)
	}
}

function move(moveX, moveY) {
	$(currentNode).css('transform', 'translate(' + (nodeX + moveX) + 'px,' + (nodeY + moveY) + 'px)');

	var id = $(currentNode)[0].id
	var dataPre = vue.dataCollection[vue.curPage - 1].dataPre
	
	dataPre.filter( item => {
		if(id == item.key){	
			item.value['el-x'] = nodeX + moveX
			item.value['el-y'] = nodeY + moveY
		}
	})
}

function topResize(moveX, moveY) {
	if (nodeHeight - moveY <= 20) {
		return
	}
	$(currentNode).css('height', (nodeHeight - moveY) + 'px')
	$(currentNode).css('transform', 'translate(' + (nodeX) + 'px,' + (nodeY + moveY) + 'px)');

	console.log(nodeHeight - moveY)
	vue.defaultStyle.height = (nodeHeight - moveY) + 'px'
}

function bottomResize(moveX, moveY) {
	if (nodeHeight + moveY <= 20) {
		return
	}
	$(currentNode).css('height', (nodeHeight + moveY) + 'px')
	// $(currentNode).css('transform','translate('+(nodeX)+'px,'+(nodeY+moveY)+'px)');
	vue.defaultStyle.height = (nodeHeight + moveY) + 'px'
}

function leftResize(moveX, moveY) {
	if (nodeWidth - moveX <= 20) {
		return
	}
	console.log('移动', moveX, moveY)
	$(currentNode).css('width', (nodeWidth - moveX) / 375 * 101.5 + '%')
	$(currentNode).css('transform', 'translate(' + (nodeX + moveX) + 'px,' + (nodeY) + 'px)');

	vue.defaultStyle.width = ((nodeWidth - moveX) / 375 * 101.5) / 100 * 375 + 'px'
	// console.log((nodeWidth - moveX) / 375 * 101.5)
}

function rightResize(moveX, moveY) {
	if (nodeWidth + moveX <= 20) {
		return
	}
	$(currentNode).css('width', (nodeWidth + moveX) / 375 * 101.5 + '%')
	// $(currentNode).css('transform','translate('+(nodeX+moveX)+'px,'+(nodeY)+'px)');
	vue.defaultStyle.width = ((nodeWidth + moveX) / 375 * 101.5) / 100 * 375 + 'px'
}

function rightBottomResize(moveX, moveY) {
	if (nodeWidth + moveX <= 20 || nodeHeight + moveY <= 20) {
		return 
	}

	$(currentNode).css('height', (nodeHeight + moveY) + 'px')
	$(currentNode).css('width', (nodeWidth + moveX) / 375 * 101.5 + '%')
	// $(currentNode).css('transform','translate('+(nodeX+moveX)+'px,'+(nodeY)+'px)');

	vue.defaultStyle.width = ((nodeWidth + moveX) / 375 * 101.5) / 100 * 375 + 'px'
	vue.defaultStyle.height = (nodeHeight + moveY) + 'px'
}


export {
	nodes,
	idMap,
	nodeStyleMap,
	mouseIsDown,
	currentNode,
	mouseX,
	mouseY,
	nodeX,
	nodeY,
	nodeWidth,
	nodeHeight,
	moveMethod
}
