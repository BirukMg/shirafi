<template>
  <div class="intro-page">
    <mdb-view>
      <video class="video-intro">
        <!-- <source src="https://mdbootstrap.com/img/video/animation.mp4" type="video/mp4"/> -->
      </video>
      <mdb-mask class="d-flex justify-content-center align-items-center gradient">
        <mdb-container class="px-md-3 px-sm-0">
          <mdb-row>
            <mdb-col md="12" class="mb-4 white-text text-center">
                <v-snackbar v-model="msg.snackbar" :color="msg.color" :multi-line="msg.mode === 'multi-line'" :timeout="msg.timeout" :vertical="msg.mode === 'vertical'" :top = "true">
                    {{ msg.text }}
                    <v-btn dark flat @click="msg.snackbar = false">Close</v-btn>
                </v-snackbar>
              <img src="../assets/images/logo.jpg" class="animated fadeIn intro-logo" alt="">
              <hr class="hr-light my-4 w-75" style="margin-left: 13%"/>
              <input type="text" placeholder="Username" class="form-control login-forms" v-model="loginData.username">
              <input type="password" placeholder="Password" class="form-control login-forms" v-model="loginData.password">
              <mdb-btn outline="white" color="white" @click="login"><mdb-icon icon="sign-in-alt"/> Login</mdb-btn>
            </mdb-col>
          </mdb-row>
        </mdb-container>
      </mdb-mask>
    </mdb-view>
  </div>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbView, mdbMask, mdbInput, mdbBtn, mdbIcon, mdbNavbar, mdbNavItem, mdbNavbarNav, mdbNavbarToggler, mdbNavbarBrand  } from 'mdbvue';

export default {
  name: 'VideoBackgroundPage',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbView,
    mdbMask,
    mdbInput,
    mdbBtn,
    mdbIcon,
    mdbNavbar,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbNavbarBrand
  },
  data() {
      return {
        msg:{
            snackbar: false,
            color: '',
            mode: '',
            timeout: 2000,
            text: ''
        },
        loginData:{
            username:'',
            password: ''
        }
      }
  },
  mounted() {
      this.isLog()
  },
  methods: {
      login(){
        if (this.loginData.username == '' && this.loginData.username == '') {
            this.msg.text = "Username & Password are empty"
            this.msg.snackbar = true
            this.msg.color = "red"
        }else if (this.loginData.username == '') {
            this.msg.text = "Username is empty"
            this.msg.snackbar = true
            this.msg.color = "red"
        }else if (this.loginData.password == '') {
            this.msg.text = "Password is empty"
            this.msg.snackbar = true
            this.msg.color = "red"
        }else{
            this.$store.dispatch('login', this.loginData)
            .then(res => {
                this.$router.push('/home')
                this.msg.text = "Done!"
                this.msg.snackbar = true
                this.msg.color = "green"
            }).catch(err => {
                this.msg.text = "Something went wrong"
                this.msg.snackbar = true
                this.msg.color = "orange"
                if (err.response.status == 401) {
                    this.msg.text = "Incorrect username/password"
                    this.msg.snackbar = true
                    this.msg.color = "red"
                }
            })
        }
      },
      isLog(){
            if (this.$store.getters.isLoggedIn) {
            this.$router.push('/home')
            }
        }
  },

};
</script>
<style scoped>
.intro-page .gradient {
    background-color: #212121
}

.intro-page .view video {
  top: 0!important;
  left: 0!important;
  transform: none!important;
  height: 100vh;
}

.intro-page .navbar {
  transition: background .5s ease-in-out,padding .5s ease-in-out;
}

.top-nav-collapse {
  background-color: #563e91 !important;
}
.intro-logo{
    height: 400px;
    width: 400px;
    margin: -20% 0px 0px 40%;
    border-radius: 50%
}
.login-forms{
    background: transparent;
    color: #fff;
    margin: 10px 0px 0px 40%;
    width: 400px;
}
</style>
