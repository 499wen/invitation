<template>
    <div class="res-container">
        <!-- 头部 -->
        <div class="res-title">
            <!-- 标签 -->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/restaurant' }">餐厅管理</el-breadcrumb-item>
                <el-breadcrumb-item><a href="javascript:;">修改餐厅</a></el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- 主体 -->
        <div class="res-body"> 
            <!-- 表单 -->
            <el-form ref="form" :model="form" class="form" label-width="80px">
                <el-form-item label="餐厅类型">
                    <el-select v-model="form.diningRoomType" placeholder="请选择餐厅类型">
                        <el-option label="中餐厅" value="中餐厅"></el-option>
                        <el-option label="西餐厅" value="西餐厅"></el-option>
                        <el-option label="自助餐" value="自助餐"></el-option>
                        <el-option label="酒店" value="酒店"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="餐厅名称">
                    <el-input v-model="form.diningRoomName" placeholder="请输入餐厅名称"></el-input>
                </el-form-item>

                <el-form-item label="餐厅封面">
                    <el-upload
                        action="/api/filecenter/file/file"
                        :on-success="uploadSuccess"
                        :before-upload="beforeAvatarUpload"
                        :show-file-list='false'
                        :on-change="file"
                        :headers="headers"
                        >
                        <div class="upload-demo">
                            <img v-if="cover" :src="cover" class="avatar">
                            <img v-else width='100%' src="http://192.168.0.250:1003/images/plan.png" alt="">
                            <div class="upload-explain">
                                <p>建议尺寸：750*750 大小：300KB以下</p>
                                <p>餐厅封面可能会用于生成参会者炫耀海报、餐厅信息主图，上传非建议尺寸的图片将进行拉伸裁剪操作，可能会有一定的变形，推荐上传建议尺寸的图片文件</p>
                            </div>
                        </div>
                    </el-upload>
                </el-form-item>

                <el-form-item label="容纳人数">
                    <el-select v-model="form.maxPeopleNumber" placeholder="请选择容纳人数">
                        <el-option label="50" value="50"></el-option>
                        <el-option label="100" value="100"></el-option>
                        <el-option label="200" value="200"></el-option>
                        <el-option label="500" value="500"></el-option>
                        <el-option label="1000" value="1000"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="餐厅地址">
                    <el-input v-model="form.diningRoomAddress" placeholder="请输入餐厅地址"></el-input>
                </el-form-item>

                <el-form-item label="餐厅介绍" height='300'>
                    <el-input type="textarea" placeholder="请输入餐厅介绍" v-model="form.diningRoomNodes"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">确认提交</el-button>
                    <!-- <el-button>取消</el-button> -->
                </el-form-item>
            </el-form>
            
            <!-- 餐厅详情 -->
            <div class="res-detail">
                <!-- 餐厅平面图 -->
                <div class="plan">
                    <span class="res-plan">餐厅平面图</span>
                    <el-upload
                        action="/api/filecenter/file/file"
                        :show-file-list='false'
                        :file-list="fileList"
                        :before-upload="beforeAvatarUpload"
                        :on-change="planChange"
                        :headers="headers"
                        :on-success="uploadSuccess_plane">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" style="height: 323px; width: 791px">
                        <img v-else width='100%' src="http://192.168.0.250:1003/images/plan.png" alt="">

                    </el-upload>
                </div>

                <!-- 餐厅地点 -->
                 <div class="address">
                    <span class="res-plan">餐厅地点</span>
                    <!-- <img class="res-plan-img" src="https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2676242820,1295870088&fm=85&app=92&f=JPEG?w=121&h=75&s=7BA4AF465030738C987B577903009078" alt="">   -->
                    <baidu-map class="bmView" :scroll-wheel-zoom="false" :center="form.diningRoomAddress" :zoom="zoom" @tilesloaded="getLocationPoint">
                        <bm-view style="width: 100%; height:400px; flex: 1"></bm-view>
                        <bm-local-search :keyword="addressKeyword" :auto-viewport="true" style="display: none"></bm-local-search>
                    </baidu-map>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
// import 'https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=1a7BycAMOFIBGkPCx85y77L99en1hsFe'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmView from 'vue-baidu-map/components/map/MapView.vue'
import BmLocalSearch from 'vue-baidu-map/components/search/LocalSearch.vue'
import time from '@/plugins/time.js'

var token = localStorage.getItem("token") || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDI4ODBhYzcyMzRjY2NkMDE3MjM0ZGYzMTcwMDAyYSJ9.ha_86lMqcLBv3HciEwV_XJMiwOghKKvcrWZ2kwJl2vk"

export default {
    components: {
        BaiduMap,
        BmView,
        BmLocalSearch
    },
    data() {
        return {
            //图片路径
            headers:{
                Authorization:token,
                token:token
            },
            // 表单属性
            form: {
                diningRoomAddress: '',
                "statusCode": "0",
                diningRoomPresentation: "不知道啊23333333333",
                drawingOfSite: "",
                diningRoomPhoto: "",
            },
            // 上传后的图片储存
            fileList: [],
      location: {
        lng: 116.404,
        lat: 39.915
      },
      zoom: 12.8,
      addressKeyword: '',
            // 表格数据
            tableData: [],
            // 表格头部
            tableCate: [
                {name: '序号', description: 'a'},
                {name: '图片', description: 'b'},
                {name: '名称', description: 'c'},
                {name: '餐厅类别', description: 'd'},
                {name: '就餐人数', description: 'e'},
                {name: '餐厅地点', description: 'f'},
                {name: '操作', description: 'g'},
            ],
            imageUrl: '',
            cover: ''
        }
    },
    methods: {
        // 提交表单
        onSubmit(e) {
            let detail = this.form, that = this
            // detail.modifyDate = time(new Date().getTime(), true)
            console.log(detail)

            // let detail = test
            // return
            this.$http.post('/api/cateringcenter/restaurant/save', detail).
            then( res => {
                console.log(res)
                if(res.code == '000'){
                    this.$message.success('修改成功!')

                    setTimeout(() => {
                        that.$router.push('/restaurant')
                    }, 500)
                }
            }).
            catch( err => {
                console.log('err:', err)
            })
        },
        // 图片上传限制
        beforeAvatarUpload(file) {
            // const isJPG = file.type === 'image/jpeg';
            const isJPG = true
            const isLt2M = file.size / 1024 < 300;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 上传图片返回数据
        file(e){
            console.log(e)
            if(e.response){
                this.form.diningRoomPhoto = e.response.id
            }
        },
        // 上传平面图返回数据
        planChange(e){
            console.log(e)
            if(e.response){
                this.form.drawingOfSite = e.response.id
            }
        },
        // 封面上传成功
        uploadSuccess(res, file){
            console.log(res, file)
            this.form.diningRoomPhoto = res.data.id
            this.cover = URL.createObjectURL(file.raw);
        },
        // 平面图上传成功
        uploadSuccess_plane(res, file){
            console.log(res, file)
            this.form.drawingOfSite = res.data.id
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        getLocationPoint(e){
            let din = e.currentTarget.re, mapCoordinates = `{longitude: ${din.lng}, latitude: ${din.lat},} `
            console.log(din.lng, din.lat)
            this.form.mapCoordinates = mapCoordinates
        },
    },
    mounted() {
        console.log(this.$route)
        this.form = this.$route.query.data
        this.cover = `/api/filecenter/file/file/${this.form['diningRoomPhoto']}`
        this.imageUrl = `/api/filecenter/file/file/${this.form['drawingOfSite']}`
    }
}
</script>

<style lang="less" scoped>
.res-container {
    width: 100%;
    height: calc(100% - 80px);
    background-color: #e6e6e6;

    .res-title {
        width: 100%;
        height: 60px;
        padding: 0 20px;
        padding-right: 30%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }


    .res-body {
        width: calc(100% - 40px);
        margin: 0 auto;
        height: calc(100% - 80px);
        background-color: #fff;
        padding: 20px 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;

        .form {
            width: 40%;
            height: 100%;
            overflow-y: auto;

            .upload-demo {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                font-size: 13px;

                img {
                    width: 95px;
                    height: 95px;
                }

                .upload-explain {
                    margin-left: 10px;
                    color: #999;
                    width: 360px;
                    text-align: left;
                    line-height: 1.1rem;
                }
            }
        }

        .res-detail {
            margin-left: 30px;
            box-sizing: border-box;
            width: 40%;
            min-width: 500px;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;

            .plan {
                margin-bottom: 20px;
            }

            .res-plan {
                display: block;
                height: 48px;
                line-height: 48px;
                color: #054591;
                font-size: 18px;
                font-weight: 700;
                box-sizing: border-box;
            }

            .res-plan-img {
                width: 70%;
            }
        }
    }
}

.el-textarea {
    height: 150px;
}
</style>

<style>
.el-textarea__inner {
    height: 100%!important;
}
</style>