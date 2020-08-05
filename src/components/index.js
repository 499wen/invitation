import $, { data } from "jquery";


import QRCode from "qrcodejs2";


import {
  hideBox,
  eachPageData,
  idMap,
  nodeStyleMap,
  nodes,
  drop,
  initNode,
  reduction,
  addSubmitForm,
  imageDrag,
  imageDragover
} from "../../public/static/invitation.js";

var token = localStorage.getItem("token"), t = null

export default {
  props: ["meetId"], //props
  data() {
    return {
      /**
       * dataCollection 结构
       * [
       *  { 
       *    page: '1',  // 页码标识
       *    dataPre: [], // 每页对应的元素映射
       *    eleList: [], // 保存每页的元素列
       *    model: {}, // 模板相应数据
       *    formAttr: { // 表单相应数据
              'enable': false, // 使用表单标记
              'sex': false, // 性别
              'company': false, // 单位
              'department': false, // 部门
              'post': false, // 职务
              'email': false // 电子邮件
            },
       *  }
       * ]
       * 
       */
      dataCollection: [
        {
          page: 1,
          dataPre: [],
          eleList: [],
          model: {
            height: 649,
            width: 375,
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
      ], // 数据收集
      curPage: 1, // 当前页数
      activeName: [],
      location: window.location.host,
      headers: {
        Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDI4ODA0MzczYTNjYTg1MDE3M2EzY2I4ZmJhMDAwMyJ9._oKdy8sQCGMn1uxmvYbivfn7O9l5nIcNXgRcr05JaZI',
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDI4ODA0MzczYTNjYTg1MDE3M2EzY2I4ZmJhMDAwMyJ9._oKdy8sQCGMn1uxmvYbivfn7O9l5nIcNXgRcr05JaZI'
      },
      popupVisible: false, //控制选择背景图弹出层的隐藏与显示
      isLongPage: true, //是否为长页模式
      longPageHeight: 649, //长页的长度，单位px
      longPageHeightArray: [],
      tempScreenY: 0, //鼠标的Y轴坐标
      isElongate: false, //是否处于拉伸长页状态
      longInterval: null, //拉伸长页的定时器
      codeVisible: null, //控制二维码的显示与隐藏
      needForm: false,
      showStyle: true,
      showKey: 0,
      address: "",

      isImage: false,

      // 接收当前元素的 数据对象
      defaultStyle: {},

      // 当前选中的 元素dom
      tNode: "",

      shadowDirection: 0,
      pageContent: [],
      formConfigVisible: false, //控制表单设置的隐藏与显示
      formConfig: {
        userName: true,
        sex: false,
        workplace: true,
        department: true,
        duties: true,
        email: true
      },
      eleColumn: '1',
      // letterProduction: {
      // 	imgList: ['封面'],
      // },
      isLoad:false, //是否已加载过一次，为true则不调用initPage内的接口
      content: "内容",
      switchImg: 0,
      idList: [], // 存放id
      //idMap:{},		// 存放id在第几页
      tempStyle: {
        list: [{
          id: "",
          name: "酷炫紫",
          imgSrc: "../../public/static/images/temp-m-01.jpg",
          titColor: "#fff",
          msgColor: "#fff",
          indexTitTop: 100,
          indexTitSize: 28,
          inxexMsgTop: 300,
          indexMsgSize: 16,
          mainTitTop: 75,
          mainTitSize: 24,
          mainMsgTop: 150,
          mainMsgSize: 13
        }]
      },
      tempData: {
        list: [{
          id: 1,
          title: "",
          msg: ""
        }],
        // selBg取数组中第一个数据
        selBg: {
          id: "",
          imgSrc: require('../assets/temp-01.jpg')
        },
        webTitle: "",
        selKey: 0
      }
    };
  },

  mounted: function() {
      if(this.$parent.$parent.currentName == 'invitation'){
        this.initPage();
      }
    var _this = this;
    var meetingId = _this.meetId;
    // if (meetingId === undefined) {
    // 	this.meetId =this.utils.getUrlParma("meetingId");
    // 	meetingId = this.meetId;
    // }
    //
    
    var dom = document.querySelector("#phone-item")
    // 移入事件
    dom.onmousemove = () => {
      document.oncontextmenu = function (event) {
        console.log('move')
        return false
      }
    }

    // 移出事件
    dom.onmouseout = () => {
      document.oncontextmenu = function (event) {
        console.log('out')
        return true
      }
    }


    if(false){

              // 模拟数据
              var dataCollection = JSON.parse(localStorage.getItem('dataCollection')) || 
              [{
                  page: 1,
                  dataPre: [],
                  eleList: [],
                  model: {
                    height: 649,
                    width: 375,
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
              }]
      
      // 数据初始化
      this.dataCollection = dataCollection 
      this.curPage = 1
      
      // 还原元素
      reduction(this)
    }
// return 
    this.$http
    .get(
      `/api/meetingcenter/meetingInvitation/meetingInvitations/meeting/4028804373a3f9b50173a3fbbd1e0000`)
    .then(res => {
      console.log(res);
      // 数据初始化
      this.dataCollection = JSON.parse(JSON.parse(res.data[0].dataVal).meetingInvitation)
      this.curPage = 1
      // 还原元素
      reduction(this)
    });
   return

  },
  watch: {
    // ["dataCollection[0].dataPre"]: function (val){
    //   console.log(val)
    // },

    // 监听defaultStyle下的fontFamily，即字体  : "",
    "defaultStyle.fontFamily": function(val) {
      this.defaultStyle.fontFamily = val
      $(this.tNode).css("font-family", val);
    },
    //监听defaultStyle下的fontSize，即字体大小
    "defaultStyle.fontSize": function(val) {
      this.defaultStyle.fontSize = val
      $(this.tNode).css("font-size", val);
    },
    //监听defaultStyle下的fontSize，即字体距离
    "defaultStyle.lineSpa": function(val) {
      this.defaultStyle.lineSpa = val
      $(this.tNode).css("letter-spacing", val);
    },

    "defaultStyle.lineHeight": function(val) {
      this.defaultStyle.lineHeight = val
      $(this.tNode).css("lineHeight", val / 10);
    },
    "defaultStyle.opacity": function(val) {
      if (val <= 1) {
        val = val * 100
      }
      this.defaultStyle.opacity = val
      $(this.tNode).css("opacity", val / 100);
    },
    "defaultStyle.textAlign": function(val) {
      this.defaultStyle.textAlign = val
      $(this.tNode).css("text-align", val);
    },

    "defaultStyle.fontWeight": function(val) {
      if (val) {
        $(this.tNode).css("font-weight", "bolder");
      } else {
        $(this.tNode).css("font-weight", "normal");
      }
    },
    "defaultStyle.textDecoration": function(val) {
      if (val) {
        $(this.tNode)
          .find(".invite-text-box-text")
          .css("text-decoration", "underline");
      } else {
        $(this.tNode)
          .find(".invite-text-box-text")
          .css("text-decoration", "none");
      }
    },
    "defaultStyle.fontStyle": function(val) {
      if (val) {
        $(this.tNode)
          .find(".invite-text-box-text")
          .css("font-style", "italic");
      } else {
        $(this.tNode)
          .find(".invite-text-box-text")
          .css("font-style", "normal");
      }
    },

    //监听defaultStyle下的fontSize，即字体大小
    "defaultStyle.borderStyle": function(val) {
      this.defaultStyle.borderStyle = val
      $(this.tNode).css("border-style", val);
    },

    //监听defaultStyle下的fontSize，即字体大小
    "defaultStyle.borderWidth": function(val) {
      this.defaultStyle.borderWidth = val
      $(this.tNode).css("border-width", val);
    },

    //监听defaultStyle下的fontSize，即字体大小
    "defaultStyle.borderRadius": function(val) {
      this.defaultStyle.borderRadius = val
      $(this.tNode).css("border-radius", val);
    },

    "defaultStyle.shadowDim": function() {
      this.setShadow();
    },
    "defaultStyle.shadowWidth": function(val) {
      if (val == 0) {
        $(this.tNode).css("box-shadow", "0px 0px ");
      } else {
        this.setShadow();
      }
    }, //shadowWidth
    "defaultStyle.shadowColor": function() {
      this.setShadow();
    }, //shadowColor
    "defaultStyle.shadowDirectionV": function() {
      this.setShadow();
    }, //shadowDirectionV
    "defaultStyle.shadowDirectionH": function() {
      this.setShadow();
    }, //shadowDirectionH

  },
  methods: {
    changeZindex: function(val) {
      console.log('置顶， 置底')
      $(this.tNode).css('z-index', val)
      this.defaultStyle['z-index'] = val
    },
    // 用户选择默认的字体颜色或背景颜色
    setColor: function(colorType, val) {
      if (colorType == "text") {
        this.defaultStyle.textColor = val;
        $(this.tNode).css("color", val);
      } else if (colorType == "back") {
        this.defaultStyle.backColor = val;
        $(this.tNode).css("background-color", val);
      } else if (colorType == "border") {
        this.defaultStyle.borderColor = val;
        $(this.tNode).css("border-color", val);
      } else if (colorType == "shadow") {
        this.defaultStyle.shadowColor = val;
      }
    },
    // 当鼠标在伸缩盒子上按下
    elongateDown: function(e) {
      console.log(e.target, e.screenY)
      // this.tempScreenY = e.screenY;
      // this.isElongate = true;
      let this_ = this, sign, defaultY = e.screenY
      $('.justify-center')[0].onmousemove = function(e){
        // 清空定时器
        t && clearInterval(t)
        /**
         * defaultY < e.screenY ? 
         *    模板拉长  :
         *    模板变短 (最短649)
         */
        if(defaultY < e.screenY){
          sign = 'down'
        }
        
        if(defaultY > e.screenY){
          sign = 'up'
        }
        
        // 记录上一次的值
        defaultY = e.screenY
        t = setInterval(() => {
          if(sign == 'down'){
            
            this_.dataCollection[this_.curPage - 1].model.height += 1
          } else if(sign == 'up'){
            if(this_.dataCollection[this_.curPage - 1].model.height > 649){
              this_.dataCollection[this_.curPage - 1].model.height -= 1
            }
          }
        }, 1)
      }

      $('.justify-center')[0].onmouseup = function(e){
        if(t){
          clearInterval(t)
        }
        $('.justify-center')[0].onmousemove = null
        $('.justify-center')[0].onmouseup = null
      }

    },
    // 当鼠标在伸缩盒子上按下
    elongateMove: function(e) {
      // 长页高度改变的值，值越大，改变速度越快
      let changePX = 5;
      let this_ = this;
      if (this_.isElongate) {
        if (e.screenY >= this_.tempScreenY) {
          this_.longPageHeight = this_.longPageHeight+changePX;
          clearInterval(this_.longInterval);
          this_.longInterval = setInterval(() => {
            this_.longPageHeight = this_.longPageHeight+changePX;
            let cta = document.querySelector(".iContent");
            cta.scrollTop = cta.scrollHeight;
            this.longPageHeightArray[this.showKey] = this_.longPageHeight
          }, 1);
        } else {
          let cta = document.querySelector(".iContent");
          if (this_.longPageHeight <= 649) {
            cta.scrollTop = 0;
            return;
          }
          this_.longPageHeight = this_.longPageHeight-changePX;
          clearInterval(this_.longInterval);
          this_.longInterval = setInterval(() => {
            if (this_.longPageHeight <= 649) {
              clearInterval(this_.longInterval);
              cta.scrollTop = 0;
              return;
            }
            this_.longPageHeight = this_.longPageHeight-changePX;
            cta.scrollTop = cta.scrollHeight;
            this.longPageHeightArray[this.showKey] = this_.longPageHeight
          }, 1);
        }
        this_.tempScreenY = e.screenY;
        //longPageHeightArray


      }
    },
    //  当鼠标松开 
    elongateUp: function(e) {},
    //  formConfig改变时刷新form表单
    initForm: function(val, need = 'update') {
      // addSubmitForm(this);
      if(val){
        var dom = document.querySelector("." + val)
        var bool = this.dataCollection[this.curPage - 1].formAttr[val]
        // var formParent = document.querySelector('.formTemplate .invite-text-box-text')
        if(bool){
          dom.style.display = 'block'
        } else {
          dom.style.display = 'none'
        }
        
        if(need == 'update'){
          // 更新 dataCollection.dataPre
          var dataPre = this.dataCollection[this.curPage - 1].dataPre
          dataPre.filter(item => item.type == '表单' ? item[val] = bool : '')
        }
      }
    },
    // 打开选择背景图片的弹出层
    imgPopupToggle: function() {
      this.popupVisible = !this.popupVisible;
    },
    changeBgImg(idx) {
      let img;
      switch (idx) {
        case 1:
          img = require('./../assets/temp-01.jpg');
          break;
        case 2:
          img = require('./../assets/temp-02.jpg')
          break;
        case 3:
          img = require('./../assets/temp-03.jpg');
          break;
        case 4:
          img = require('./../assets/temp-04.jpg');
          break;
        case 5:
          img = require('./../assets/temp-05.jpg');
          break;
        case 6:
          img = require('./../assets/temp-06.jpg');
          break;
        case 10:
          img = require('./../assets/temp-010.png');
          break;
      }
      this.tempData.selBg.imgSrc = img;
      console.log(this.tempData.selBg.imgSrc);
    },
    // 设置浏览器右键不触发
    rclick(){
      if (event.button == 2){
        event.returnvalue = false;
        console.log('设置浏览器右键不触发')
      }
    },
    setShadow: function() {
      if (this.defaultStyle.shadowWidth == 0) {
        return;
      }
      let shadow =
        this.defaultStyle.shadowDirectionV +
        "px " +
        this.defaultStyle.shadowDirectionH +
        "px " +
        this.defaultStyle.shadowDim +
        "px " +
        this.defaultStyle.shadowWidth +
        "px " +
        this.defaultStyle.shadowColor;
      $(this.tNode).css("box-shadow", shadow);
    }, //setShadow
    selectItem: function(id) {
      $(".check").removeClass("check");
      //1.判断是哪个页面 展示该页面 然后click
      // var key = idMap.get(id);
      // if (key !== this.showKey) {
      //   this.contentClick(key);
      // }

      $("#" + id).click();
      $("#itemId" + id).addClass("check");
    },

    contentClick: function(index) {
      // 清空模板中的元素 dom
      $('.phone-item').empty()

      // 更新页码
      this.curPage = index + 1

      // 还原元素
      reduction(this)
    },
    // 重置数据
    empty(){
      // 清空 tNode
      this.tNode = null

      this.defaultStyle = {}

      // 清空模板中的元素 dom
      $('.phone-item').empty()
    },

    showSubmitForm: function() {
      this.formConfigVisible = true;
      addSubmitForm(this);
      // this.$confirm("是否启用表单?", "提示", {
      // 	confirmButtonText: "确定",
      // 	cancelButtonText: "取消",
      // 	type: "warning"
      // }).then(() => {
      // 	this.needForm = true;
      // 	addSubmitForm(this);
      // });
    },

    updateSubmitForm: function(node) {
      //是否显示表单控件
      let _this = this;
      let nodes;

      //用户名
      nodes = $(node).find(".userName");
      for (let i = 0; i < nodes.length; i++) {
        $(nodes[i]).css("display", "block");
      }

      //性别
      nodes = $(node).find(".sex");
      if (_this.formConfig.sex) {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "block");
        }
      } else {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "none");
        }
      }

      //单位
      nodes = $(node).find(".workplace");
      if (_this.formConfig.workplace) {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "block");
        }
      } else {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "none");
        }
      }

      //部门
      nodes = $(node).find(".department");
      if (_this.formConfig.department) {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "block");
        }
      } else {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "none");
        }
      }

      //职务
      nodes = $(node).find(".duties");
      if (_this.formConfig.duties) {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "block");
        }
      } else {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "none");
        }
      }

      //电子邮件
      nodes = $(node).find(".email");
      if (_this.formConfig.email) {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "block");
        }
      } else {
        for (let i = 0; i < nodes.length; i++) {
          $(nodes[i]).css("display", "none");
        }
      }
    }, //updateSubmitForm

    uploadImage: function(res) {
      console.log(res);
      if (res.code == "000") {
        // let locationUrl = "/api/filecenter/file/file/" + res.data.id;

        this.defaultStyle.url = "/api/filecenter/file/file/" + res.data.id;

        // $(this.tNode).find('.invite-text-box-text').css('background-image','url("'+res.src+'")')
        $(this.tNode).css("background-image", 'url("' + this.defaultStyle.url + '")');
        $(this.tNode)
          .find(".tip")
          .css("display", "none");
      }
      this.$refs.elupload.clearFiles();
    }, //uploadImage
    imageDrag: function(event) {
      event = event || window.event;
      event.dataTransfer.setData("text", "image");
    },
    imageDragover: function(event) {
      event = event || window.event;
      event.preventDefault();
    },
    save: function() {
      // $("#qrcode").empty(); //清除二维码
      //     let mtId = this.meetId ? this.meetId : this.utils.getUrlParma("meetingId");
      let _this = this;
      // if (!mtId) {
      //   return; 
      // }

      // _this.dataCollection.meetingId = '4028804373a3f9b50173a3fbbd1e0000'

      let data = {
        meetingInvitation: JSON.stringify(_this.dataCollection),
        // meetingId: '4028804373a3f9b50173a3fbbd1e0000'
      }
      // for (let i = 0; i < _this.tempData.list.length; i++) {
      //   // let tmp= _this.tempData.list[i];
      //   let htmlObj = $($("#mc").find(".phone-item")[i]);
      //   htmlObj
      //     .find(">div >div >.invite-text-box-border")
      //     .css("display", "none");
      //   let tmp = {
      //     meetid: mtId,
      //     pageHeight: _this.longPageHeightArray[i],
      //     serial: i,
      //     content: htmlObj.html(),
      //     imgsrc: _this.tempData.selBg.imgSrc
      //   };
      //   params.push(tmp);
      // }
      // console.log(meetingInvitation );
      this.$http
        .post(
          `/api/meetingcenter/meetingInvitation/meetingInvitation/4028804373a3f9b50173a3fbbd1e0000`,
          data
        )
        .then(res => {
          console.log(res);

          if(res.code == "000"){
            _this.$message({
              type: "success",
              message: "保存成功"
            });
          }else{
            _this.$message({
              type: "error",
              message: "保存失败，请重试"
            });
          }
          // _this.generateQrCode();
        });
    }, //save

    generateQrCode() {
      // 获取二维码父盒子的宽度并将其设置为二维码的高宽
      let obj = document.getElementById("qrcode");
      let codeW = parseInt(window.getComputedStyle(obj, null).width);
      console.log(codeW);
      let qrcode = new QRCode("qrcode", {
        width: codeW, //图像宽度
        height: codeW, //图像高度
        colorDark: "#000000", //前景色
        colorLight: "#ffffff", //背景色
        typeNumber: 4,
        correctLevel: QRCode.CorrectLevel.H //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
      });


      var qrCodeUrl =
        window.location.host +
        "/meet/#/invitationMessage?meetingId=" +
        this.meetId;
      qrcode.makeCode(qrCodeUrl); //生成二维码
      obj.title = '';

    },


    getMatchedStrs: function(str, showKey) {
      var pattern = /id=\"(.*?)\"/g;
      var result = str
        .match(pattern)
        .toString()
        .replace(/id=/g, "")
        .replace(/"/g, "");
      var resultArray = result.split(",");
      resultArray.forEach((item, index) => {
        idMap.set(resultArray[index], showKey);
      });
    },
    initPage: function() {
      console.log("会议邀请函初始化");
      let mtId = this.meetId ? this.meetId : this.utils.getUrlParma("meetingId");
      let _this = this;
      if(!this.isLoad){
        this.$http.get(`/api/meetingcenter/meetingInvitation/meetingInvitations/meeting/`+mtId)
        .then(res => {
          console.log(res);
          let pages = res.data; 
          if (pages.length <= 0) {
            _this.longPageHeightArray.push(649);
            return;
          }
          // this.pageContent = pages;
          for (let i = 0; i < pages.length; i++) {
            if (i == 0) {
              _this.tempData.selBg = {
                id: "",
                imgSrc: pages[i].imgsrc
              };
              _this.address = pages[i].address;
              _this.longPageHeight = pages[i].pageHeight || 649;
              this.generateQrCode();
            } else {
              let tmp = {
                id: (_this.tempData.list[_this.tempData.list.length - 1].id + 1),
                msg: ""
              };
              _this.tempData.list.push(tmp);
            }
            _this.longPageHeightArray.push(pages[i].pageHeight)
            _this.pageContent.push(pages[i].content);

          }
          
          // console.log(pages,$('#mc').find('.phone-item'))
          setTimeout(function() {
            let items = $("#mc").find(".phone-item");
            // for (let i = 0; i < items.length; i++) {
            // 	if (pages[i].content !== "" && pages[i].content !== undefined) {
            // 		_this.getMatchedStrs(pages[i].content, i);
            // 		$(items[i]).html(pages[i].content);
            // 	}
            // } pageContent
            let textNodes = $("#mc").find(".textTemplate");
            for (let i = 0; i < textNodes.length; i++) {
              initNode(textNodes[i], _this, "文本");
            }
            let imageNodes = $("#mc").find(".imageTemplate");
            for (let i = 0; i < imageNodes.length; i++) {
              initNode(imageNodes[i], _this, "图片");
            }

            let formNodes = $("#mc").find(".formTemplate");
            for (let i = 0; i < formNodes.length; i++) {
              initNode(formNodes[i], _this);
            }
          }, 300);
        });
        this.isLoad = true;
      }

      $(document).keydown(function(e) {
        // console.log(e);
        // console.log(_this.tNode);
        // console.log($(_this.tNode).find(".invite-text-box-border").css("display"));
        // keyCode等于46为delete键
        if (!e || e.keyCode != 46) {
          //不是删除
          return;
        }
        if (!_this.tNode.id) {
          //没有当前节点
          return;
        }

        if (
          $(_this.tNode)
          .find(".invite-text-box-border")
          .css("display") != "block"
        ) {
          //不是编辑状态
          return;
        }
        //删除当前编辑的节点
        nodes.delete(_this.tNode.id);
        $(_this.tNode).remove();
      });
    },
    dropTest: function(event) {
      drop(event, this);
    },

    //添加页面
    addPage() {
      // this.letterProduction.imgList.push('内容')
      // console.log('内容', this.letterProduction.imgList, this.letterProduction.imgList.length)

      // this.tempData.list.push({
      //   id: (this.tempData.list[this.tempData.list.length - 1].id + 1),
      //   msg: ""
      // });
      // // this.longPageHeightArray.push(649)
      // let cta = document.querySelector(".iLeft");
      // cta.scrollTop = cta.scrollHeight;

      // 重置数据
      this.empty()

      // 修改当前页
      this.curPage ++ 

      // 添加新页 数据
      this.dataCollection.push(eachPageData(this))
    },
    // 删除页面
    deletePage(idx) {
      // 重置数据
      this.empty()
      
      // 判断idx 与 curPage大小关系
      if(idx < this.curPage){
        this.curPage --
      }

      // 删除 dataCollection 对应列
      this.dataCollection.filter((item, index) => 
        index == idx && this.dataCollection.splice(index, 1)
      )

      // 修改 对应的page 值
      this.dataCollection.filter(( item, index) => item.page = index + 1)
    },
    clickTag: function(e) {
      hideBox();
    },
    allowDrop: function(ev) {
      console.log("allowDrop");
      ev.preventDefault();
    },
    textDrag: function(event) {
      console.log("文本元素 ");
      event = event || window.event;

      event.dataTransfer.setData("text", "invite-text");
    },
    textDragover: function(event) {
      console.log("文本元素 textDragover");

      event = event || window.event;
      event.preventDefault();
    },
    initTemplateCss: function(node) {
      if ($(node).hasClass("formTemplate")) {
        this.showStyle = false;
      } else {
        this.showStyle = true;
      }
      //从nodeStyleMap获取该node的样式，否则解析节点  填充属性
      this.tNode = node;
      var defaultStyle = nodeStyleMap.get(node.id);
      if (defaultStyle === undefined) {
        // 初始化样式值    defaultStyle代表当前选中控件的所有属性,当回显保存数据的时候这个对象是空的,所以需要在此初始化
        defaultStyle = {};
        defaultStyle.textColor = $(node).css("color");
        defaultStyle.fontFamily = $(node).css("font-family")
        defaultStyle.fontSize = $(node).css("font-size")
        defaultStyle.lineSpa =Number($(node).css("letter-spacing").replace("px",""))
        defaultStyle.lineHeight = Number($(node).css("line-height").replace("px",""))
        defaultStyle.opacity = $(node).css("opacity")
        defaultStyle.textAlign = $(node).css("text-align")
        defaultStyle.borderColor = $(node).css("border-color")
        defaultStyle.borderStyle = $(node).css("border-style")
        defaultStyle.borderRadius = Number($(node).css("border-radius").replace("px",""))
        defaultStyle.borderWidth = Number($(node).css("border-width").replace("px",""))
        var boxShadow = $(node).css("box-shadow")
        var boxShadowArray = boxShadow.split(/\*|\-|\+|\s/);
        var shadowWidth = boxShadowArray[boxShadowArray.length - 1 ] || 0;
        var shadowDim = boxShadowArray[boxShadowArray.length - 2 ] || 0;
        var shadowDirectionH = boxShadowArray[boxShadowArray.length - 3 ] || 0;
        var shadowDirectionV = boxShadowArray[boxShadowArray.length - 4 ] || 0;
        defaultStyle.shadowWidth= Number(shadowWidth.replace("px",""))
        defaultStyle.shadowDim= Number(shadowDim.replace("px",""))
        defaultStyle.shadowDirectionV=   Number(shadowDirectionV.replace("px",""))
        defaultStyle.shadowDirectionH=   Number(shadowDirectionH.replace("px",""))
        defaultStyle.shadowColor=boxShadow.replace(shadowWidth,"").replace(shadowDim,"").replace(shadowDirectionV,"").replace(shadowDirectionH,"")
        if ($(node).css("background-color") === 'rgba(0, 0, 0, 0)') {
          defaultStyle.backColor = "#FFFFFF";
        } else {
          defaultStyle.backColor = $(node).css("background-color")
        }
        if (
          $(this.tNode)
          .find(".invite-text-box-text")
          .css("font-style") == "italic"
        ) {
          defaultStyle.fontStyle = true;
        } else {
          defaultStyle.fontStyle = false;
        }
        if (
          $(this.tNode)
          .find(".invite-text-box-text")
          .css("text-decoration").indexOf("underline") != -1
        ) {
          defaultStyle.textDecoration = true;
        } else {
          defaultStyle.textDecoration = false;
        }
        if ($(node).css("font-weight") == 700) {
          defaultStyle.fontWeight = true;
        } else {
          defaultStyle.fontWeight = false;
        }
        nodeStyleMap.set(node.id, defaultStyle);
      }
      this.defaultStyle = defaultStyle;
      if ($(node).hasClass("imageTemplate")) {
        this.isImage = true;
      } else {
        this.isImage = false;
      }
    }
  }
};