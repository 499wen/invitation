<template>
  <div id="app">
    <!-- 左侧 - 导航栏 -->
    <!-- <AppLeft></AppLeft> -->

    <!-- 右侧 -->
    <div class="right">
      <!-- 右侧顶部 - 信息栏 -->
      <!-- <AppRight></AppRight> -->

      <!-- 右侧 - 主体 -->
      <router-view />
    </div>
  </div>
</template>

<script>
// import AppLeft from "./components/AppLeft";
// import AppRight from "./components/AppRight";

export default {
  name: "App",
  // components: {
  //   AppLeft,
  //   AppRight
  // } //components
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #fff;
  overflow: hidden;
}

.right {
  flex: 1;
  height: 100vh;
  overflow: hidden;
}

body,
html {
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar {
  width: 4px;
  // height: 4px;
  background-color: #f3f3f3;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
</style>
