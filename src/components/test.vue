<template>
  <div class="list">
      <div id="uploader" class="wu-example">
      <!--用来存放文件信息-->
        <div id="fileLilst" class="uploader-list"></div>
          <div class="btns">
            <!-- 选择文件的按钮 -->
              <input type="file" name="" @change="chioce" id="" value="选择文件" multiple="multiple">
            <!-- 开始上传按钮 -->
              <button id="uploadBtn" class="btn btn-default">开始上传</button>
          </div>
      </div>
  </div>
</template>

<script>
import $ from 'jquery'
import WebUploader from 'webuploader'
import axios from 'axios'

var data = {
  aa: 123
}

export default {
  data: () => data,
  methods: {
    chioce(e){
      console.log(e)
      return 
      const param = new FormData();
      param.append("file", e.file);

      const config = {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDI4ODA0MzczYTNjYTg1MDE3M2EzY2I4ZmJhMDAwMyJ9._oKdy8sQCGMn1uxmvYbivfn7O9l5nIcNXgRcr05JaZI',
          token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDI4ODA0MzczYTNjYTg1MDE3M2EzY2I4ZmJhMDAwMyJ9._oKdy8sQCGMn1uxmvYbivfn7O9l5nIcNXgRcr05JaZI'
        }
      };
      return 
      axios.post('/api/filecenter/file/file', param, config).then(res => {
        console.log(res)
      }).catch( err => {
        console.log(err)
      })
    }
  },
  mounted:function(){


    return
    let that = this
    var uploader = WebUploader.create({
        // swf文件路径
        swf:'../static/webuploader-0.1.5/Uploader.swf',
        // 文件接收服务端。
        server: 'http://localhost:13333/api/filecenter/file/file',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker',
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        //是否开启自动上传
        auto:false
    });

    uploader.on( 'beforeFileQueued', function( file) {
      console.log('文件加入队前',file)
    });

  console.log(this.$http)
    uploader.on( 'fileQueued', function( file ) {
    var $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
            '</div>'
            ),
        $img = $li.find('img');


    // $list为容器jQuery实例
    $('.list').append( $li );

    // 创建缩略图
    // 如果为非图片文件，可以不用调用此方法。
    // thumbnailWidth x thumbnailHeight 为 100 x 100
    uploader.makeThumb( file, function( error, src ) {
        if ( error ) {
            $img.replaceWith('<span>不能预览</span>');
            return;
        }

        $img.attr( 'src', src );
    }, 100, 100 );

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<p class="progress"><span></span></p>')
                    .appendTo( $li )
                    .find('span');
        }

        $percent.css( 'width', percentage * 100 + '%' );
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file ) {
      console.log(112)

        $( '#'+file.id ).addClass('upload-state-done');
    });

    // 文件上传失败，显示上传出错。
    uploader.on( 'uploadError', function( file ) {
      console.log(112)
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');

        // 避免重复创建
        if ( !$error.length ) {
            $error = $('<div class="error"></div>').appendTo( $li );
        }

        $error.text('上传失败');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
      console.log(112)

        $( '#'+file.id ).find('.progress').remove();
    });

    });
  }
}
</script>

<style scoped>

</style>