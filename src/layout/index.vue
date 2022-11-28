<template>
  <a-layout id="layout-wrapper">
    <a-layout-sider v-if="!this.key.includes('login')" v-model="collapsed" :trigger="null" collapsable
                    :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <div class="logo">{{ !collapsed ? "测试平台" : "测试" }}</div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
      <a-sub-menu key="2">
        <span slot="title"><a-icon type="solution" />{{ !collapsed ? "测试任务" : "" }}</span>
        <a-menu-item key="2-1">
          <router-link to="/task_plan">
            <a-icon type="control" />
            测试计划
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="3">
        <span slot="title"><a-icon type="container" />{{ !collapsed ? "测试用例" : "" }}</span>
        <a-menu-item key="3-1">
          <router-link to="/test_cases">
            <a-icon type="table" />
            测试集合1
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="4">

        <router-link to="/devices">
          <a-icon type="table" />
          <span >{{ !collapsed ? "测试设备" : "" }}</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu key="5">
        <span slot="title"><a-icon type="appstore" />{{ !collapsed ? "更多功能" : "" }}</span>
        <a-menu-item key="5-2">
          <router-link to="/image">
            <a-icon type="picture" />
            图像资源
          </router-link>
        </a-menu-item>
        <a-menu-item key="5-3">
          <router-link to="/action">
            <a-icon type="table" />
            基础操作库
          </router-link>
        </a-menu-item>
        <a-menu-item key="5-4">
          <router-link to="/appmap">
            <a-icon type="table" />
            应用信息库
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout :style="{ marginLeft: margin_left }">
      <a-layout-header v-if="!this.key.includes('login')" class="header-wrapper">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="clickCollapse"
        />
        <a-dropdown class="right">
          <div>
            <a-avatar :size="24" icon="user" />
            <span class="username">{{this.$store.getters.username}}</span>
          </div>
          <a-menu slot="overlay" style="width: 80%">
            <a-menu-item><span @click="logout">退出登录</span></a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content class="main-wrapper">
        <router-view :key="key" />
      </a-layout-content>
    </a-layout>

  </a-layout>
</template>
<script>

export default {
  computed: {
    key() {
      return this.$route.path;
    },
  },
  created(){
    //在页面加载时读取sessionStorage里的状态信息
    let sessionStorage = window.sessionStorage;
    if (sessionStorage.getItem("store") ) {
      this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
      sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })
  },
  mounted() {

  },
  data() {
    return {
      collapsed: false,
      loading: false,
      visible: false,
      margin_left: "200px"
    };
  },
  methods:{
    clickCollapse(){
      this.collapsed = !this.collapsed
      if (this.collapsed) {
        setTimeout(()=>{
          this.margin_left = "80px"
        }, 80)
      } else {
        this.margin_left = "200px"
      }


    },
    logout() {
      this.$store.dispatch('user/logout').then(resp=>{
        if (resp.logout){
          this.$router.push({ path: '/login' })
        }

      })
    },
  }
};
</script>

<style scoped>
#layout-wrapper .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#layout-wrapper .trigger:hover {
  color: #1890ff;
}

#layout-wrapper .logo {
  height: 64px;
  line-height: 64px;
  text-align: center;
  color: white;
  margin-bottom: 20px;
  font-size: 22px;
  user-select: none;
}

.main-wrapper {
  margin: 20px 2px 20px 20px;
  min-height: calc(100vh - 50px);
}

.header-wrapper {
  background: #fff;
  padding: 0;
  display: flex;
  justify-content: space-between;
}
.right {
  width: 150px;
}
.username {
  margin-left: 2px;
  font-size: 16px;
}

</style>
