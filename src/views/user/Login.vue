<template>
  <div>
   <div class="user-layout-login">
    <div class="login-title">
      <span style="font-size:16px; color:#1890ff"><b>终端测试平台</b></span>
    </div>
    <div>
    <div
      style="margin-top:20%"
      id="formLogin" 
      @submit="login"
      >
      <a-form-item>
        <a-input
          class="login-wrapper"
          size="large"
          type="text"
          placeholder="用户名"
          v-model="username"
        >
        <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input-password
          class="login-wrapper"
          size="large"
          type="text"
          placeholder="密码"
          v-model="password"
        >
        <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button class="login-btn" @click="login" type="primary">登录</a-button>
      </a-form-item>
        <div style="float:right">
            <a-button type="link" @click="loginAsGuest">访客进入</a-button>
        </div>

    </div>
    </div>
   </div>
  </div>
</template>

<script>
export default {
  created() {
  },
  data() {
    return {
      username: "",
      password: "",
      visible: false,
      confirmLoading: false,
    };
  },
  methods: {
  login() {
  },

  loginAsGuest(){
     this.username = "guest"
     this.password = "guest"
      this.login()
  },
  handleOk(){

    },

  handleCancel(){
      this.visible = false

    },
  },
}
</script>

<style lang="less" scoped>
.login-title {
  width: auto;
  height: auto;
  position: absolute;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.login-wrapper {
  width: 300px;
  height: 45px;
}

.login-btn{
  width: 300px;
  height: 45px;
}
.user-layout-login {
  background-color: white;;
  padding: 60px 30px;
  width: auto;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.input-user {
  width: 300px;
}
</style>
