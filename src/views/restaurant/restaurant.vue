<template>
    <div class="res-container">
        <!-- 头部 -->
        <div class="res-title">
            <!-- 标签 -->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">餐厅管理</a></el-breadcrumb-item>
            </el-breadcrumb>

            <!-- 搜索框 -->
            <div class="res-search">
                <el-button type="warning" size="small" @click="addTaurant">+ 添加餐厅</el-button>
                <!-- 搜索框 -->
                <div class="search" v-if="false">
                    <el-input placeholder="请输入搜索内容" @input="getSearchVal" size="small" v-model="searchKey" class="log-search">
                        <el-button slot="append" @click="getDataBtn">搜索</el-button>
                    </el-input>
                    <div class="search-cte" v-show="filterData.length">
                        <div class="log-s-c" v-for="(item, idx) in filterData" :key="idx">{{ item.name }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 主体 -->
        <div class="res-body">
            <!-- 表格 -->
            <el-table
                :data="tableData"
                style="width: 50%; max-width: 50%;"
                @cell-click="selectCoulnm">
                <el-table-column
                    :prop="item.description"
                    :label="item.name"
                    width=""
                    border
                    align='center'
                    v-for="(item, idx) in tableCate" :key="idx"
                >
                    <template slot-scope="scope">
                        <div v-if="item.description == 'diningRoomPhoto'">
                            <img :src="`/api/filecenter/file/file/${scope.row['diningRoomPhoto']}`" alt="暂无图片" style="width: 50px;">
                        </div>
                        <span v-else> {{ scope.row[item.description] }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger" 
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 餐厅详情 -->
            <div class="res-detail">
                <!-- 餐厅平面图 -->
                <div class="plan">
                    <span class="res-plan">餐厅平面图</span>
                    <img class="res-plan-img" :src="`/api/filecenter/file/file/${curData.drawingOfSite}`" alt="">  
                </div>

                <!-- 餐厅地点 -->
                 <div class="address">
                    <span class="res-plan">餐厅地点</span>
                    <!-- <img class="res-plan-img" src="https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2676242820,1295870088&fm=85&app=92&f=JPEG?w=121&h=75&s=7BA4AF465030738C987B577903009078" alt="">   -->
                    <baidu-map class="bmView" :scroll-wheel-zoom="false" :center="curData.diningRoomAddress" :zoom="12.8">
                        <bm-view style="width: 100%; height:400px; flex: 1"></bm-view>
                        <bm-local-search :keyword="''" :auto-viewport="true" style="display: none"></bm-local-search>
                    </baidu-map>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmView from 'vue-baidu-map/components/map/MapView.vue'
import BmLocalSearch from 'vue-baidu-map/components/search/LocalSearch.vue'

export default {
    components: {
        BaiduMap,
        BmView,
        BmLocalSearch
    },
    data() {
        return {
            searchKey: '',

            // 选中餐厅列表 - 位置
            diningRoomAddress: '',

            // 模拟搜索框数据
            mockData: [
                {val: '12345', name: 'HTML'},
                {val: '1234', name: 'CSS'},
                {val: '123', name: 'JS'},
                {val: '12', name: 'PHP'},
                {val: '1', name: 'Python'},
            ],
            filterData: [],

            // 表格数据
            tableData: [],
            // 表格头部
            tableCate: [
                {name: '图片', description: 'diningRoomPhoto'},
                {name: '名称', description: 'diningRoomName'},
                {name: '餐厅类别', description: 'diningRoomType'},
                {name: '就餐人数', description: 'maxPeopleNumber'},
                {name: '餐厅地点', description: 'diningRoomAddress'},
            ],

            curData: {
                diningRoomAddress: '广东'
            }
        }
    },
    methods: {
        // 选择表格列
        selectCoulnm(e){
            console.log(e)
            this.curData = e
        },
        // 添加餐厅
        addTaurant(){
            this.$router.push('/restaAdd')
        },
        // 搜索
        getDataBtn(){

        },
        // 监听输入框内容
        getSearchVal(val){
            if(val.trim()){
                this.filterData = this.mockData.filter( item => item.val.includes(val))
            } else {
                this.filterData = []
            }
        },
        // 删除
        handleDelete(idx, row){
            let that = this
            console.log(idx, row)

            this.$confirm('此操作将删除该餐厅, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
                }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });

                this.$http.post(`/api/cateringcenter/restaurant/delete/${row.diningRoomId}`).then(res => {
                    console.log(res)
                    that.tableData.splice(idx, 1)
                }).catch(err => {
                    console.log(err)
                })
            })


        },
        // 编辑
        handleEdit(idx, row){
            this.$router.push({path: '/restaEdit', query: {data: row}})
        },
    },
    mounted() {
        let pageNum = 1, pageSize = 10, that = this
        this.$http.get(`/api/cateringcenter/restaurant/select`).then(res => {
            console.log(res)
            if(res.code == '000'){
                if(res.data.length >= 1){
                    that.tableData = res.data
                    that.curData = res.data[0]
                } 
            }
        }).catch( err => {
            console.log(err)
        })
    }
}
</script>

<style lang="less" scoped>
.res-container {
    width: 100%;
    height: calc(100% - 80px);
    background-color: #e6e6e6;
    // padding: 10px;
    // box-sizing: border-box;

    .res-title {
        width: 100%;
        height: 60px;
        padding: 0 20px;
        padding-right: 30%;
        box-sizing: border-box;
        // background-color: rgba(255, 68, 0, 0.26);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .res-search {
            width: 40%;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .search {
                margin-left: 10px;
                position: relative;

                .search-cte {
                    width: calc(100% - 20px);
                    background-color: #fff;
                    box-sizing: border-box;
                    border: 1px solid #e6e6e6;
                    position: absolute;
                    // left: 20px;
                    z-index: 9999;

                    .log-s-c {
                    width: 100%;
                    padding: 5px 10px;
                    box-sizing: border-box;
                    color: #666;
                    font-size: 14px;
                    }
                }
            }
        }
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
</style>