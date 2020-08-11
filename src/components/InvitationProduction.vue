<template>
	<div class="invitation not_select">
		<!-- 添加页面 -->
		<div class="iLeft">
			<!-- <div @click="generateQrCode">获取css</div> -->
			<div class="title">页面管理</div>
			<ul class="page_num_ul">
				<li v-for="(item,index) in dataCollection" :key="item.id" :class="{'page_num': true,'page_active': curPage == index + 1}"
				 @click="contentClick(index)">
					<div class="page_txt">第{{ index + 1 }}页
						<div class="deleteIcon" v-if="index != 0" @click.stop="deletePage(index)">×</div>
					</div>
					<!-- <p class="el-icon-close closeImg" v-if="index != 0" @click.stop="tempData.list.splice(index, 1),showKey = 0"></p> -->
				</li>
			</ul> 
			<div class="imgBtn">
				<div class="pImg" @click="addPage">  
					<img src="./../assets/addpageBtn.png" alt />
				</div>
				<p @click="addPage">添加页面</p>
				<!-- <p @click="presModel">保存模板</p> -->
			</div>
		</div>

		<!-- 手机模板 -->
		<div class="iContent flex">
			<div class="content-middle ml15 justify-center" style="padding-right: 15px;width:100%;">
				<div class="content-middle-type" v-if="false">
					<div class="pattern select" @click="pattern($event, 'multiPage')">多页模式</div>
					<div class="pattern" @click="pattern($event, 'longPage')">长页模式</div>
				</div>
				<!-- 长页邀请函 -->
				<div class="po-r phone-long" :style="'text-align:center;height:'+ dataCollection[curPage - 1].model.height +'px;background-image: url(/api/filecenter/file/file/'+ dataCollection[curPage - 1].model.img +');'" v-if="isLongPage">
					<div id="mc">
						<div id="phonecontent">
							<div class="phone-item" id="phone-item" :style="'height:'+ dataCollection[curPage - 1].model.height +'px;'" @drop="dropTest($event)"
							  @dragover="allowDrop($event)">
							</div>
						</div>
					</div>
					<div class="elongate" @mousedown="elongateDown">
						<div></div>
					</div>
					<div class="longpage_pixel" draggable="false">
						375 x {{ dataCollection[curPage - 1].model.height }}
					</div>
					<!-- 鼠标悬停后展示二维码 -->
					<div class="show_qrcode" @click="openQrcode">
						<span v-if="codeVisible">收起</span>
						<span v-else>预览</span>
						<div class="qrcode_box" v-show="codeVisible">
							<p class="scan" style="margin:0 0 5px 0;">扫码预览(保存后)</p>
							<div class="align-center">
								<div id="qrcode" ref="qrcode" title=""></div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>

		<!-- 元素样式 -->
		<div class="iRight">
			<div class="invite-head justify-between" style="padding-left:10px;">
				<div class="flex" style="margin: 0 auto;">
					<ul class="verson text-area" draggable="true" @dragstart="textDrag($event)" @dragover="textDragover($event)" style="padding-left:0px;">
						<img class="invittext" src="../../public/static/images/invittext.png" title="拖拽到手机进行编辑" />
						<li>文本</li>
					</ul>
					<ul class="pl20 verson" draggable="true" @dragstart="imageDrag($event)" @dragover="imageDragover($event)">
						<img class="invittext" src="../../public/static/images/invitimages.png" title="拖拽到手机进行编辑" />
						<li>图片</li>
					</ul>
					<ul class="pl20 verson" @click="showSubmitForm">
						<img class="invittext" src="../../public/static/images/invitTable.png" title="点击打开表单设置" />
						<li>表单</li>
					</ul>
					<ul class="pl20 verson" @click="imgPopupToggle()">
						<img class="invittext" src="../../public/static/images/invitbg.png" title="点击打开背景样式" />
						<li>背景</li>
					</ul>
					<ul class="pl20 verson" @click="popupModel = true">
						<img class="invittext" width="30" height="30" src="../../public/static/images/model.png" title="点击打开模板" />
						<li>模板</li>
					</ul>
					<ul class="pl20 verson" @click="presModel">
						<img class="invittext" width="30" height="30" src="../../public/static/images/addmodel.png" title="添加模板" />
						<li>添加模板</li>
					</ul>
					<ul class="pl20 verson" @click="save">
						<img class="invittext" width="30" height="30" src="../../public/static/images/shangchuan.png" title="提交邀请函" />
						<li>提交</li>
					</ul>
				</div>
				<!-- 	<div class="po-r inp-control mt15 mr15 ml10">class="btn_save invit-save" type="button" id="upEdit" data-loading-text="正在提交，请稍后..."
					<button class="btn btn-warning invit-save" type="button" id="upEdit" data-loading-text="正在提交，请稍后..." @click="save">保存并提交
					</button>
					<span class="red ml10 font-14">* 设置完成后界面必须提交保存才能生效</span>
        </div>-->
			</div>

			<!--  -->
			<div id="templateStyle" v-if="tNode && defaultStyle.type != 'form'">
				<el-collapse v-model="activeName">
					<el-collapse-item title="基本样式" name="1" style="padding-right: 0px;">
						<div class="layui-colla-content layui-show">
							<div v-if="!isImage" class="single">
								<!-- <div class="mb10 clear_float" style="text-align: left"> -->
									<div >
										<span class="mr15 style_label">字体</span>
										<el-select class="font_select mr10" size="mini" v-model="defaultStyle.fontFamily" style="width:100px;">
											<el-option value="黑体" selected="selected">黑体</el-option>
											<el-option value="宋体">宋体</el-option>
											<el-option value="微软雅黑">微软雅黑</el-option>
										</el-select>
									</div>
									<div>
										<span class="mr15 style_label">字号</span>
										<el-select v-model="defaultStyle.fontSize" size="mini" class="font_select mr10" style="width:100px;">
											<el-option value="12px">12px</el-option>
											<el-option value="13px">13px</el-option>
											<el-option value="14px">14px</el-option>
											<el-option value="16px">16px</el-option>
											<el-option value="18px">18px</el-option>
											<el-option value="20px">20px</el-option>
											<el-option value="24px">24px</el-option>
											<el-option value="32px">32px</el-option>
											<el-option value="48px">48px</el-option>
											<el-option value="64px">64px</el-option>
											<el-option value="96px">96px</el-option>
										</el-select>
									</div>
								<!-- </div> -->
								<div class="flex invite-progress">
									<span class="mr15 style_label">字距</span>
									<div class="ml15" style="display: inline-block;width: 100px">
										<!-- <el-slider v-model="defaultStyle.lineSpa" :max="50 * 1"></el-slider> -->
										<el-input-number v-model="defaultStyle.lineSpa" size="mini" style="width:100px;" controls-position="right" :min="0" :max="50"></el-input-number>
									</div>
								</div>
								<div class="flex invite-progress">
									<span class="mr15 style_label">行高</span>
									<div class="ml15" style="display: inline-block;width: 100px">
										<!-- <el-slider v-model="defaultStyle.lineHeight"></el-slider> -->
										<el-input-number v-model="defaultStyle.lineHeight" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>

									</div>
								</div>
								<div class="flex invite-progress">
									<span class="mr15 style_label">透明度</span>
									<div style="display: inline-block;width: 100px">
										<!-- <el-slider v-model="defaultStyle.opacity"></el-slider> -->
										<el-input-number v-model="defaultStyle.opacity" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>

									</div>
								</div>
								<div class="flex invite-progress" style="width: 100%">
									<ul style="margin-left: 3px;padding:0;" class="option flex">
										<li @click="defaultStyle.textAlign='left'" class="font_style">
											<img class="" src="../../public/static/images/activeduiqi.png" style="background: #ee6363;" title="左对齐" v-if="defaultStyle.textAlign=='left'" />
											<img class="" src="../../public/static/images/duiqi.png" title="左对齐" v-else />
										</li>

										<li @click="defaultStyle.textAlign='center'" class="font_style">
											<img class="" src="../../public/static/images/activejuzhong.png" title="居中" style="background: #ee6363;"
											 v-if="defaultStyle.textAlign=='center'" />
											<img class="" src="../../public/static/images/juzhongduiqi.png" title="居中" v-else />
										</li>

										<li @click="defaultStyle.textAlign='right'" class="font_style">
											<img class="" src="../../public/static/images/activeduiqi_1.png" title="右对齐" style="background: #ee6363;"
											 v-if="defaultStyle.textAlign=='right'" />
											<img class="" src="../../public/static/images/duiqi_1.png" title="右对齐" v-else />
										</li>
										<li @click="defaultStyle.fontWeight = ! defaultStyle.fontWeight" class="font_style">
											<img class="" style="background: #ee6363;" src="../../public/static/images/activezitiyangshi_jiacu.png"
											 title="加粗" v-if="defaultStyle.fontWeight" />
											<img class="" src="../../public/static/images/zitiyangshi_jiacu.png" title="加粗" v-else />
										</li>

										<li @click="defaultStyle.textDecoration= !defaultStyle.textDecoration" class="font_style">
											<img class="" src="../../public/static/images/activezitiyangshi_xiahuaxian.png" style="background: #ee6363;"
											 v-if="defaultStyle.textDecoration" title="下划线" />
											<img class="" src="../../public/static/images/zitiyangshi_xiahuaxian.png" title="下划线" v-else />
										</li>

										<li @click="defaultStyle.fontStyle = !defaultStyle.fontStyle" class="font_style">
											<img class="" src="../../public/static/images/activezitiyangshi_xieti.png" style="background: #ee6363;" v-if="defaultStyle.fontStyle"
											 title="斜体" />
											<img class="" src="../../public/static/images/zitiyangshi_xieti.png" title="斜体" v-else />
										</li>
										<div class="flex invite-progress" style="float:left;margin-left:10px;">
											<li class="flex top-floor mr20" @click="changeZindex(9)">
												<img style="margin-top: 6px;margin-right: 2px;" class="alignment-mode0" src="../../public/static/images/roofplacement.png"
												 alt />
												<span>置顶</span>
											</li>
											<li class="flex top-floor" @click="changeZindex(1)">
												<img style="margin-top: 6px;margin-right: 2px;" class="alignment-mode0" src="../../public/static/images/bottomsetting.png"
												 alt />
												<span>置底</span>
											</li>
										</div>
									</ul>
								</div>
								<div class="flex invite-progress" style="width: 100%">
									<span class="style_label mr10" style="width: 52px">字体颜色</span>
									<el-color-picker v-model="defaultStyle.textColor" size="medium"></el-color-picker>
									<!-- ffffff,ff5448,f2a653,ffca28,18cfa1,59c7f9,4d8ff3,7171ef,4f5975,000000 -->
									<div class="default_color_box">
										<div class="default_color" @click="setColor('text','#ffffff')" style="background-color:#ffffff;"></div>
										<div class="default_color" @click="setColor('text','#ff5448')" style="background-color:#ff5448;"></div>
										<div class="default_color" @click="setColor('text','#f2a653')" style="background-color:#f2a653;"></div>
										<div class="default_color" @click="setColor('text','#ffca28')" style="background-color:#ffca28;"></div>
										<div class="default_color" @click="setColor('text','#18cfa1')" style="background-color:#18cfa1;"></div>
										<div class="default_color" @click="setColor('text','#59c7f9')" style="background-color:#59c7f9;"></div>
										<div class="default_color" @click="setColor('text','#4d8ff3')" style="background-color:#4d8ff3;"></div>
										<div class="default_color" @click="setColor('text','#7171ef')" style="background-color:#7171ef;"></div>
									</div>
								</div>
								<!-- <div class="flex invite-progress" style="margin-top:10px;">
									<span class="style_label mr10">背景颜色</span>
									<el-color-picker v-model="defaultStyle.backColor" size="medium"></el-color-picker>
									<div class="default_color_box">
										<div class="default_color" @click="setColor('back','rgba(255,255,255,0)')" style="background-color:rgba(0,0,0,0);"></div>
										<div class="default_color" @click="setColor('back','#ffffff')" style="background-color:#ffffff;"></div>
										<div class="default_color" @click="setColor('back','#ff5448')" style="background-color:#ff5448;"></div>
										<div class="default_color" @click="setColor('back','#ffca28')" style="background-color:#ffca28;"></div>
										<div class="default_color" @click="setColor('back','#18cfa1')" style="background-color:#18cfa1;"></div>
										<div class="default_color" @click="setColor('back','#59c7f9')" style="background-color:#59c7f9;"></div>
										<div class="default_color" @click="setColor('back','#4d8ff3')" style="background-color:#4d8ff3;"></div>
										<div class="default_color" @click="setColor('back','#7171ef')" style="background-color:#7171ef;"></div>
										<div class="default_color" @click="setColor('back','#4f5975')" style="background-color:#4f5975;"></div>
										<div class="default_color" @click="setColor('back','#000000')" style="background-color:#000000;"></div>
									</div>
								</div> -->
							</div>
							<div v-if="isImage" style="display: flex; justify-content: space-between; align-items: center">
								<!-- <el-upload class="upload-demo" drag action="/api/filecenter/file/file" :on-success="uploadImage" ref="elupload"
								 :headers="headers" accept="image/*" show-file-list="false">
									<i class="el-icon-upload"></i>
									<div class="el-upload__text">
										将图片拖到此处，或
										<em>点击上传</em>
									</div>
								</el-upload> -->

								<el-upload
									class="upload-demo"
									action="/api/filecenter/file/file" :on-success="uploadImage" ref="elupload"
								 :headers="headers" accept="image/*" :show-file-list="false"
								>
									<el-button size="mini" type="">点击上传</el-button>
								</el-upload>

								<div class="flex invite-progress">
									<span class="mr15">透明度</span>
									<div style="display: inline-block;width: 100px">
										<!-- <el-slider v-model="opacity"></el-slider> -->
										<el-input-number v-model="defaultStyle.opacity" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>

									</div>
								</div>
								<div class="flex invite-progress" style="float:left;margin:10px 0;">
									<li class="flex top-floor mr20" @click="changeZindex(9)">
										<img style="margin-top: 3px;" class="mb10 alignment-mode0" src="../../public/static/images/roofplacement.png"
										 alt />
										<span>置顶</span>
									</li>
									<li class="flex top-floor" @click="changeZindex(1)">
										<img style="margin-top: 3px;" class="mb10 alignment-mode0" src="../../public/static/images/bottomsetting.png"
										 alt />
										<span>置底</span>
									</li>
								</div>
							</div>
						</div>
					</el-collapse-item>
					<el-collapse-item title="边框样式" name="2" style="padding-right: 0px;">
						<div class="layui-colla-content single">
							<div class="flex invite-progress">
								<span class="mr15 style_label">宽度</span>
								<div style="display: inline-block;width: 100px">
									<!-- <el-slider v-model="defaultStyle.borderWidth" :max="20*1"></el-slider> -->
									<el-input-number v-model="defaultStyle.borderWidth" size="mini" style="width:100px;" controls-position="right" :min="0" :max="20"></el-input-number>
								</div>
							</div>
							<div class="flex invite-progress">
								<span class="mr15 style_label">弧度</span>
								<div style="display: inline-block;width: 100px">
									<!-- <el-slider v-model="defaultStyle.borderRadius"></el-slider> -->
									<el-input-number v-model="defaultStyle.borderRadius" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>
								</div>
							</div>

							<div class="flex invite-progress">
								<span class="style_label mr10">颜色</span>
								<el-color-picker v-model="defaultStyle.borderColor" size="medium"></el-color-picker>
								<div class="default_color_box" style="clear:both;">
									<div class="default_color" @click="setColor('border','#ffffff')" style="background-color:#ffffff;"></div>
									<div class="default_color" @click="setColor('border','#ff5448')" style="background-color:#ff5448;"></div>
									<div class="default_color" @click="setColor('border','#f2a653')" style="background-color:#f2a653;"></div>
									<div class="default_color" @click="setColor('border','#ffca28')" style="background-color:#ffca28;"></div>
									<div class="default_color" @click="setColor('border','#18cfa1')" style="background-color:#18cfa1;"></div>
									<div class="default_color" @click="setColor('border','#59c7f9')" style="background-color:#59c7f9;"></div>
									<div class="default_color" @click="setColor('border','#4d8ff3')" style="background-color:#4d8ff3;"></div>
									<div class="default_color" @click="setColor('border','#7171ef')" style="background-color:#7171ef;"></div>
								</div>
							</div>
							<div class="flex invite-progress">
								<span class="style_label mr10">样式</span>
								<el-select v-model="defaultStyle.borderStyle" class="option" size="mini" style="margin-left: 5px;width:97px;height:35px;">
									<el-option value="none" label="无"></el-option>
									<el-option value="solid" label="直线"></el-option>
									<el-option value="dashed" label="虚线"></el-option>
									<el-option value="dotted" label="点状线"></el-option>
									<el-option value="double" label="双划线"></el-option>
								</el-select>
							</div>


						</div>
					</el-collapse-item>
					<el-collapse-item title="阴影样式" name="3" style="padding-right: 0px;">
						<div class="layui-colla-content single">
							<div class="flex invite-progress">
								<span class="mr15 style_label">大小</span>
								<div style="display: inline-block;width: 100px">
									<!-- <el-slider v-model="defaultStyle.shadowWidth"></el-slider> -->
									<el-input-number v-model="defaultStyle.shadowWidth" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>

								</div>
							</div>
							
							<div class="flex invite-progress">
								<span class="mr15 style_label">模糊</span>
								<div style="display: inline-block;width: 100px">
									<!-- <el-slider v-model="defaultStyle.shadowDim"></el-slider> -->
									<el-input-number v-model="defaultStyle.shadowDim" size="mini" style="width:100px;" controls-position="right" :min="0" :max="100"></el-input-number>

								</div>
							</div>
							<div class="flex invite-progress">
								<span class="mr15 style_label" style="width: 52px">水平方向</span>
								<div style="display: inline-block;width: 100px">
									<!-- <el-slider v-model="defaultStyle.shadowDirectionV" :min="-50/1.0" :max="50/1.0"></el-slider> -->
									<el-input-number v-model="defaultStyle.shadowDirectionV" size="mini" style="width:100px;" controls-position="right" :min="-50" :max="50"></el-input-number>

								</div>
							</div>
							<div class="flex invite-progress">
								<span class="mr15 style_label" style="width: 52px">垂直方向</span>
								<div style="display: inline-block;width: 100px">
									<el-input-number v-model="defaultStyle.shadowDirectionH" size="mini" style="width:100px;" controls-position="right" :min="-50" :max="50"></el-input-number>
									<!-- <el-slider v-model="defaultStyle.shadowDirectionH" :min="-50/1.0" :max="50/1.0"></el-slider> -->
								</div>
							</div>
							<div class="flex invite-progress">
								<span class="style_label mr10">颜色</span>
								<el-color-picker v-model="defaultStyle.shadowColor" size="medium"></el-color-picker>
								<div class="default_color_box">
									<div class="default_color" @click="setColor('shadow','#ffffff')" style="background-color:#ffffff;"></div>
									<div class="default_color" @click="setColor('shadow','#ff5448')" style="background-color:#ff5448;"></div>
									<div class="default_color" @click="setColor('shadow','#f2a653')" style="background-color:#f2a653;"></div>
									<div class="default_color" @click="setColor('shadow','#ffca28')" style="background-color:#ffca28;"></div>
									<div class="default_color" @click="setColor('shadow','#18cfa1')" style="background-color:#18cfa1;"></div>
									<div class="default_color" @click="setColor('shadow','#59c7f9')" style="background-color:#59c7f9;"></div>
									<div class="default_color" @click="setColor('shadow','#4d8ff3')" style="background-color:#4d8ff3;"></div>
									<div class="default_color" @click="setColor('shadow','#7171ef')" style="background-color:#7171ef;"></div>
								</div>
							</div>
						</div>
					</el-collapse-item>
				</el-collapse>
			</div>
			<!--  组件样式 end-->
		</div>

		<!-- 模板中存在的元素列 -->
		<div class="iRight mini_iRight">
			<el-collapse v-model="eleColumn" accordion>
				<el-collapse-item title="元素列" name="1">
					<div v-if="dataCollection[curPage - 1]">
						<div class="ele_btn clear_float" v-for="(item,index) in dataCollection[curPage - 1].eleList" :key="item.id">
							<el-button @click="selectItem(item.id)" :id="'itemId'+item.id">{{item.nodeValue}}({{index+1}})</el-button>
						</div>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>
		<!-- 这里是文字的模板 start-->
		<div class="mr20 ml15">
			<div v-show="false" id="textTemplate" class="textTemplate" style="height:40px;width:60%">
				<div class="invite-text-box">
					<div class="invite-text-box-text edit-text" contenteditable="true">点击这里编辑</div>

					<!-- 右键列表 -->
					<div class="rightC-list currency" id="">
						<span class="del currency">删除</span>
					</div>

					<div class="invite-text-box-border">
						<div class="invite-text-box-border-container">
							<div class="invite-text-box-border top-line move-line">
								<div class="invite-text-box-border line-point s-resize top-line-point"></div>
							</div>

							<div class="invite-text-box-border left-line move-line">
								<div class="invite-text-box-border line-point left-line-point"></div>
							</div>

							<div class="invite-text-box-border right-line move-line">
								<div class="invite-text-box-border line-point right-line-point"></div>
							</div>

							<div class="invite-text-box-border bottom-line move-line">
								<div class="invite-text-box-border line-point s-resize bottom-line-point"></div>
							</div>

							<div class="invite-text-box-border left-top-point up-point"></div>
							<div class="invite-text-box-border right-top-point up-point"></div>
							<div class="invite-text-box-border left-bottom-point up-point"></div>
							<div class="invite-text-box-border right-bottom-point up-point"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 这里是文字的模板 end?-->
		<!--  这里是图片的模板 start-->
		<div v-show="false" id="imageTemplate" class="imageTemplate" style="height:150px;width:150px">
			<div class="invite-text-box">
				<div class="invite-text-box-text">
					<div class="tip">请上传图片</div>
				</div>
				<!-- 右键列表 -->
				<div class="rightC-list currency">
					<span class="currency del">删除</span>
				</div>

				<div class="invite-text-box-border">
					<div class="invite-text-box-border-container">
						<div class="invite-text-box-border top-line move-line">
							<div class="invite-text-box-border line-point s-resize top-line-point"></div>
						</div>

						<div class="invite-text-box-border left-line move-line">
							<div class="invite-text-box-border line-point left-line-point"></div>
						</div>

						<div class="invite-text-box-border right-line move-line">
							<div class="invite-text-box-border line-point right-line-point"></div>
						</div>

						<div class="invite-text-box-border bottom-line move-line">
							<div class="invite-text-box-border line-point s-resize bottom-line-point"></div>
						</div>

						<div class="invite-text-box-border left-top-point up-point"></div>
						<div class="invite-text-box-border right-top-point up-point"></div>
						<div class="invite-text-box-border left-bottom-point up-point"></div>
						<div class="invite-text-box-border right-bottom-point up-point"></div>
					</div>
				</div>
			</div>
		</div>
		<!--  这里是图片的模板 end-->
		<!-- 这里是表单的模板 start-->
		<div v-show="false" id="formTemplate" class="formTemplate">
			<div class="invite-text-box">
				<div class="invite-text-box-text">
					<div class="userName mb10 mt15">
						<span class="two-text white">姓名：</span>
						<input class="inp-style" type="text" />
					</div>
					<div class="sex mb10">
						<span class="two-text white">性别：</span>
						<input class="inp-style" type="text" />
					</div>
					<div class="company mb10">
						<span class="two-text white">单位：</span>
						<input class="inp-style" type="text" />
					</div>
					<div class="department mb10">
						<span class="two-text white">部门：</span>
						<input class="inp-style" type="text" />
					</div>
					<div class="post mb10">
						<span class="two-text white">职务：</span>
						<input class="inp-style" type="text" />
					</div>
					<div class="email mb10">
						<span class="white">电子邮件：</span>
						<input class="inp-style" type="text" />
					</div>
					<div class="phone mb10">
						<span class="white">手机号码：</span>
						<input class="inp-style" type="text" />
					</div>
					<div class="checkNum mb10 flex">
						<ul class="align-center mb10" style="width: 62%;padding:0;margin-top:0;">
							<span class="three-text white">验证码 ：</span>
							<input class="inp-style1" type="text" />
						</ul>
						<button class="dain-code">获取验证码</button>
					</div>
					<div class="submitForm mb10">
						<button class="invite-submission">提 交</button>
					</div>
				</div>

				<!-- 右键列表 -->
				<div class="rightC-list currency">
					<span class="currency del">删除</span>
				</div>

				<div class="invite-text-box-border">
					<div class="invite-text-box-border-container">
						<div class="invite-text-box-border top-line move-line">
							<div class="invite-text-box-border line-point s-resize top-line-point"></div>
						</div>

						<div class="invite-text-box-border left-line move-line">
							<div class="invite-text-box-border line-point left-line-point"></div>
						</div>

						<div class="invite-text-box-border right-line move-line">
							<div class="invite-text-box-border line-point right-line-point"></div>
						</div>

						<div class="invite-text-box-border bottom-line move-line">
							<div class="invite-text-box-border line-point s-resize bottom-line-point"></div>
						</div>

						<div class="invite-text-box-border left-top-point up-point"></div>
						<div class="invite-text-box-border right-top-point up-point"></div>
						<div class="invite-text-box-border left-bottom-point up-point"></div>
						<div class="invite-text-box-border right-bottom-point up-point"></div>
					</div>
				</div>
			</div>
		</div>
		<!--  这里是表单的模板 end-->
		<!-- 选择背景时的弹出层 -->
		<div class="popup_bg" v-show="popupVisible">
			<div class="white_box">
				<div class="popup_titile">
					选择背景图
				</div>
				<div class="popup_cente">
					<div class="popup_item" v-for="(item, idx) in bgImage" :key="idx">
						<img :src="'/api/filecenter/file/file/' + item.imgId" alt="">
						<div>
							<input type="radio"  name="bgImgRadio" id="" @click="changeBgImg(idx)">
						</div>
					</div>
				</div>

				<div class="popup_bottom">
					<el-upload
						class="upload-demo"
						:headers="headers"
						action="/api/filecenter/file/file"
						accept="image/*" :show-file-list="false"
						:on-success='bgiUpload'>
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
					<el-button size="small" type="danger" v-if="selectImg" @click="delBgimg">删除</el-button>
					<el-button size="small" type="primary" @click="imgPopupToggle">确定</el-button>
				</div>
			</div>
		</div>
		<!-- 背景弹出层end -->

		<!-- 选择模板时的弹出层 -->
		<div class="popup_bg" v-show="popupModel">
			<div class="white_box">
				<div class="popup_titile">
					选择模板
				</div>
				<div class="popup_cente">

					<div class="popup_item" v-for="(item, idx) in invitaModel" :key="idx">
						<img :src="'/api/filecenter/file/file/'+item.imgId" alt="">
						<div>
							<input type="radio" name="bgImgRadio" id="" @click="changeBgModel(idx)">
						</div>
					</div>

				</div>

				<div class="popup_bottom">
					<!-- <el-upload
						class="upload-demo"
						action="https://jsonplaceholder.typicode.com/posts/"
						:on-success='bgiUpload'>
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload> -->

					<el-button size="small" v-if="selectModel" type="primary" @click="modelBtn">选择</el-button>
					<el-button size="small" v-if="selectModel" type="danger" @click="delModel">删除</el-button>
					<el-button size="small" @click="popupModel = false">关闭</el-button>
				</div>
			</div>
		</div>
		<!-- 模板弹出层end -->

		<!-- 表单弹窗start -->
		<div class="form_bg" v-show="formConfigVisible">
			<div class="form_table">
				<div class="form_switch">
					<div class="form_label">启用表单：</div>
					<el-switch v-model="dataCollection[curPage - 1].formAttr.enable" :width="40" @change="initForm()">
					</el-switch>
				</div>
				<div v-show="dataCollection[curPage - 1].formAttr.enable">
					<div class="form_item">
						<div class="form_label">性别：</div>
						<el-switch v-model="dataCollection[curPage - 1].formAttr.sex" :width="40" @change="initForm('sex')">
						</el-switch>
					</div>
					<div class="form_item">
						<div class="form_label">单位：</div>
						<el-switch v-model="dataCollection[curPage - 1].formAttr.company" :width="40" @change="initForm('company')">
						</el-switch>
					</div>
					<div class="form_item">
						<div class="form_label">部门：</div>
						<el-switch v-model="dataCollection[curPage - 1].formAttr.department" :width="40" @change="initForm('department')">
						</el-switch>
					</div>
					<div class="form_item">
						<div class="form_label">职务：</div>
						<el-switch v-model="dataCollection[curPage - 1].formAttr.post" :width="40" @change="initForm('post')">
						</el-switch>
					</div>
					<div class="form_item">
						<div class="form_label">电子邮件：</div>
						<el-switch v-model="dataCollection[curPage - 1].formAttr.email" :width="40" @change="initForm('email')">
						</el-switch>
					</div>
				</div>
				<div class="form_btn" @click="formConfigVisible=false">关闭</div>
			</div>
		</div>
		<!-- 表单弹窗end -->
	</div>
</template>

<script>
	import index from './index.js'

	export default index
</script>
<style>
	@import "../../public/static/inviteTemplate.css";

	@import "../../public/static/text.css";
</style>
<style lang="less">
	.content-middle {
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		padding-top: 50px;
		box-sizing: border-box;

		.content-middle-type {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 14px;

			.pattern {
				cursor: pointer;
				width: 68px;
				height: 26px;
				text-align: center;
				line-height: 26px;
				box-sizing: border-box;
				border: 1px solid #d9d9d9;
				font-size: 12px;
				z-index: 3;
				position: relative;
			}

			.pattern:nth-child(1) {
				border-radius: 5px 0 0 5px;
				left: .5px;
			}

			.pattern:nth-child(2) {
				right: .5px;
				border-radius: 0 5px 5px 0;
			}

			.select {
				z-index: 5;
				color: #1890ff;
				border-color: #1890ff;
			}
		}
	}
	// 
	.el-select-dropdown__item {
		text-align: center !important;
	}

	.single {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-content: center;

		& > div {
			width: 50%;

			& > span {
				text-align-last: initial;
				text-align: right;
				width: 40px;
			}
		}
	}

	.invite-text-box {
		position: relative;	
	}
	
	// 右键列表
	.invite-text-box .rightC-list {
		background-color: #fff;
		padding: 5px 10px;
		z-index: 20;
		box-sizing: border-box;
		flex-wrap: wrap;
		position: absolute;
		cursor: pointer !important;
		display: none;

		& > span {
			width: 100%;
			margin-bottom: 5px;
		}

		& > span:nth-last-child(1) {
			margin-bottom: 0;
		}
	}

	.clear_float::after {
		content: "";
		display: table;
		clear: both;
	}

	.mr30 {
		margin-right: 30px;
	}

	.mr15 {
		margin-right: 15px;
	}

	.mr10 {
		margin-right: 10px;
	}

	.mb10 {
		margin-bottom: 8px;
	}

	.ml10 {
		margin-left: 10px;
	}

	.mt15 {
		margin-top: 15px;
	}

	.pl20 {
		padding-left: 25px;
	}

	ul,
	li {
		list-style: none;
	}

	.po-r {
		position: relative;
	}

	.top-floor {
		width: 55px;
	}

	.inp-control {
		width: 90%;
		overflow: auto;
	}

	.show_qrcode {
		width: 15px;
		position: absolute;
		padding: 5px;
		top: 0px;
		right: -25px;
		color: #666;
		background-color: #fff;
		cursor: pointer;
	}

	.show_qrcode:hover {
		color: #509eff;
	}

	.show_qrcode .qrcode_box {
		position: absolute;
		top: 0px;
		left: 25px;
		padding: 10px;
		background-color: #fff;
		color: #666;
	}

	#qrcode {
		width: 130px;
		height: 130px;
		margin: 0 auto;
	}
	.flex {
		display: flex;
	}

	.invite-head .flex {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.invitation {
		display: flex;
		justify-content: space-between;
		margin-top: 5px;
		height: 100%;

		.iLeft {
			background-color: #f5f5f5;
			width: 100px;
			height: 93%;
			text-align: center;
			overflow: auto;
			margin-right: 5px;

			.title {
				height: 40px;
				line-height: 40px;
				background: #ddd;
			}

			.page_num_ul {
				padding: 0;
			}

			.page_num_ul li {
				padding: 0 20px;
				box-sizing: border-box;
				cursor: pointer;
				height: 45px;
			}

			.page_num_ul li>div {
				padding: 15px 0;
				padding-bottom: 8px;
				box-sizing: border-box;
			}

			.page_num_ul .page_active>div {
				border-bottom: 2px solid #75c5f5;
			}

			.closeImg {
				width: 20px;
				height: 20px;
				background: #ccc;
				position: absolute;
				top: -21px;
				right: -4px;
				border-radius: 50%;
				line-height: 20px;
				cursor: pointer;
			}

			// .page_num_ul {
			// 	margin: 0;
			// 	padding: 0;

			// li {
			// 	width: 90px;
			// 	height: 150px;
			// 	line-height: 150px;
			// 	list-style: none;
			// 	background: url(../assets/phone-sm.png) no-repeat;
			// 	background-size: 100% 100%;
			// 	margin: 15px auto;
			// 	position: relative;

			// 	&.clbg {
			// 		background: url(../assets/atthispage.png) no-repeat;
			// 		background-size: 100% 100%;
			// 	}
			// }
			// }

			.imgBtn {
				width: 100px;
				height: 150px;
				// background: url(../assets/addpage.png) no-repeat;
				background-size: 100% 100%;
				margin: 15px auto;
				cursor: pointer;

				.pImg {
					padding-top: 10px;
					padding-left: 33px;
					width: 40px;
					height: 40px;

					img {
						width: 100%;
					}
				}
			}
		}

		.iRight {
			width: 420px;
			overflow: auto;
			height: 93%;
			background-color: #f4f4f4;
		}

		.iContent {
			width: 45%;
			height: 93%;
			min-width: 560px;
			overflow-x: visible;
			overflow-y: auto;
			box-sizing: border-box;
			background-color: #f4f4f4;
		}

		.version {
			width: 70px;
			text-align: center;
			margin-top: 17px;
			cursor: pointer;
		}

		.check {
			color: #409eff;
			border-color: #c6e2ff;
			background-color: #ecf5ff;
			font-weight: 700;
		}

		.phone-long {
			width: 375px;
			height: 649px;
			position: relative;
			background-size: 100% 100%;
			margin: 20px auto 0px auto;
			background-repeat: no-repeat;
			border: 1px dashed #ccc;
		}

		.phone-m {
			width: 378px;
			height: 672px;
			position: relative;
			float: left;
			background-image: url(../../public/static/images/phone.png);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			background-position: 0px 0px;
		}

		#mc {
			text-align: center;
			width: 100%;
			height: 100%;
			position: relative;
		}

		.popup_bg {
			background-color: rgba(100, 100, 100, 0.5);
			position: fixed;
			top: 0px;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 20;

			.white_box {
				background-color: #fff;
				width: 900px;
				height: 400px;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(10%, -50%);
				border-radius: 20px;
				display: flex;
				flex-direction: column;
				flex-wrap: wrap;

				.popup_titile {
					width: 100%;
					background-color: #5381c6;
					padding: 10px;
					font-size: 18px;
					color: #fff;
					box-sizing: border-box;
					padding-left: 2%;
				}
			}

			.popup_cente {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-content: flex-start;
				flex: 1;
				flex-wrap: wrap;
				overflow-y: auto;
			}

			.popup_item {
				margin-top: 10px;
				// float: left;
				width: 12%;
				padding-left: 2%;

				img {
					width: 110px;
					height: 210px;
				}

				& > div {
					text-align: center;
				}

				input {
					cursor: pointer;
				}
			}

			.popup_item:last-child {
				padding-right: 2%;
			}

			.popup_bottom {
				padding: 10px 0;
				display: flex;
				justify-content: center;
				align-items: center;

				& > div {
					margin: 0 5px;
				}
			}

			.popup_btn {
				background-color: #1e9fff;
				cursor: pointer;
				color: #fff;
				width: 60px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				margin: 10px auto;
				box-sizing: border-box;
			}
		}

		.verson {
			cursor: pointer;
		}

		.page_txt {
			position: relative;
		}

		.page_txt:hover .deleteIcon {
			display: block;
		}

		.deleteIcon {
			display: none;
			width: 20px;
			height: 20px;
			position: absolute;
			top: -1px;
			right: -15px;
			text-align: center;
			font-size: 18px;
			background-color: #ccc;
			color: #fff;
			border-radius: 50%;
		}

		.formTemplate {
			height: 50%;
			margin: 0;
			width: 80%;
		}

		.invite-text-box input {
			height: 20px;
		}

		.dain-code {
			height: 26px;
			width: 72px;
			font-size: 12px;
		}

		.form_bg {
			background-color: rgba(100, 100, 100, 0.5);
			position: fixed;
			top: 0px;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 2;

			.form_table {
				padding-top: 20px;
				background-color: #fff;
				width: 250px;
				height: 400px;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				border-radius: 10px;
			}

			.form_item {
				padding: 10px;
			}

			.form_label {
				font-size: 12px;
				float: left;
				width: 35%;
				text-align: center;
				font-size: 16px;
				text-align-last: justify;
				text-align: justify;
				text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
			}

			.form_switch {
				padding-bottom: 20px;
				padding-left: 10px;
			}

			.form_btn {
				width: 70px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				background-color: #048bea;
				cursor: pointer;
				color: #fff;
				position: absolute;
				bottom: 20px;
				left: 50%;
				transform: translate(-50%, 0);
				border-radius: 5px;
				margin-top: 20px;
			}
		}

		.white {
			// display: inline-block;
			width: 70px;
			font-size: 14px;
			text-align-last: justify;
			text-align: justify;
			text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
			color: #333;
		}

		.three-text {
			width: 70px;
			margin-left: 7px;
		}

		.phone-item {
			width: 100%;
			height: 630px;
			position: absolute;
			top: 0px;
			left: 5px;
		}
	}

	.el-slider__button-wrapper {
		z-index: 1;
	}

	.el-slider__button {
		width: 8px;
		height: 8px;
	}

	.font_style {
		height: 17px;
		padding: 5px 8px;
		cursor: pointer;

		img {
			width: 16px;
			height: 16px;
		}
	}

	.el-select-dropdown__list {
		height: 121px;
	}

	.font_select .el-input--mini .el-input__inner {
		line-height: 25px;
		// height: 24px;
	}

	.style_label {
		line-height: 35px;
		display: inline-block;
		// width: 60px;
		text-align-last: justify;
		text-align: justify;
		text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
	}

	.el-collapse {
		border: none;
	}

	.el-collapse-item__arrow {
		margin: 0 27px 0 auto;
	}

	.two-text {
		font-size: 12px;
	}

	.inp-style {
		width: 52%;
	}

	.inp-style1 {
		width: 28%;
	}

	// 拉伸长页的图标样式
	.elongate {
		position: absolute;
		bottom: -16px;
		left: 50%;
		transform: translate(-50%, 0%);
		width: 30px;
		height: 10px;
		border-radius: 2px;
		padding-top: 4px;
		cursor: ns-resize;
		background-color: #1593ff;
	}

	.elongate div {
		margin: 0 auto;
		width: 10px;
		height: 1px;
		background-color: #ccd5db;
		margin-top: 3px;
	}

	.longpage_pixel {
		user-select: none;
		margin-top: 30px;
		margin-bottom: 20px;
		cursor: default;
	}

	.not_select {
		-moz-user-select: none;
		/*火狐*/
		-webkit-user-select: none;
		/*webkit浏览器*/
		-ms-user-select: none;
		/*IE10*/
		-khtml-user-select: none;
		/*早期浏览器*/
		user-select: none;
	}

	.longpage_switch {
		position: absolute;
		top: 0px;
		left: 5px;
	}

	.el-collapse-item__header {
		height: 35px;
		line-height: 35px;
		background-color: #ddd;
		padding-left: 15px;
		margin-bottom: 10px;
	}

	.invitation .mini_iRight {
		width: 250px;
		text-align: center;
	}

	// 供选的字体颜色与背景颜色
	.default_color_box {
		width: 90px;
		padding: 5px;
	}

	.default_color_box .default_color {
		width: 15px;
		height: 15px;
		border: 1px solid #ccd5db;
		float: left;
		margin-left: 2px;
		margin-bottom: 3px;
		cursor: pointer;
	}

	// 元素列的按钮
	.ele_btn {
		width: 50%;
		float: left;
		margin-bottom: 8px;
	}

	.ele_btn .el-button {
		width: 83px;
		padding: 0;
		line-height: 40px;
	}

	// 保存提交按钮
	.btn_save {
		margin-left: 26px;
		margin-top: 22px;
		background-color: #539ee6;
		line-height: 25px;
		border: none;
		height: 30px;
		width: 110px;
		border-radius: 6px;
		color: #fff;
		cursor: pointer;
	}

	.btn_save:hover {
		background-color: #75aaea;
	}

	.btn_save:active {
		background-color: #0771d6;
	}

	.el-collapse-item__wrap {
		background-color: #f4f4f4;
		padding-left: 10px;
		padding-right: 10px;
	}

	.invite-text-box-text:focus {
		border: none;
		outline: none;
	}

	.btn_custom_cancel{
    float: right;
    margin-left: 10px !important;
	}

	@media screen and (max-width:1600px) {
		.invitation .phone-long {
			margin: 0 15px;
			margin-top: 30px;
		}
	}

	@media screen and (min-width:1680px) {
		.invitation .iContent {
			width: 55%;
		}
	}

	@media screen and (min-width:2300px) {
		.invitation {
			.iContent {
				width: 60%;
			}

			// #qrcode{
			// 	width: 150px;
			// 	height: 150px;
			// }
		}
	}
</style>
