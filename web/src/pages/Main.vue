<template id="app">
    <div style="margin-top: 60px">
        <navbar class="mt-2 special-color-dark" dark position="top">
        <mdb-navbar-brand href="#">
            <!-- ሽራፊ -->
            <img src="../assets/images/logo.jpg" height="30" alt="">
        </mdb-navbar-brand>
        <mdb-navbar-toggler>
            <mdb-navbar-nav>
                <mdb-nav-item @click.native="activeItem = 1" to="/writers">Writers</mdb-nav-item>
                <mdb-nav-item @click.native="activeItem = 2" to="/medias">Medias</mdb-nav-item>
                <mdb-nav-item @click.native="activeItem = 3" to="/writers post">Writers Post</mdb-nav-item>
                <mdb-nav-item @click.native="activeItem = 4" to="/media post">Medias Post</mdb-nav-item>
                <mdb-nav-item @click.native="activeItem = 5" to="/news">News</mdb-nav-item>
                <mdb-nav-item @click.native="activeItem = 6" to="/sponsorship">Sponsor ship</mdb-nav-item>
            </mdb-navbar-nav>
            <mdb-navbar-nav right>  
                <mdb-nav-item @click="launchEdit"><mdb-icon icon="user"/> Hi {{userData.username}}</mdb-nav-item>
                <mdb-btn outline="white" size="sm" @click="logout"><mdb-icon icon="sign-out-alt"/> Logout</mdb-btn>
            </mdb-navbar-nav>
        </mdb-navbar-toggler>
        <v-snackbar v-model="msg.snackbar" :color="msg.color" :multi-line="msg.mode === 'multi-line'" :timeout="msg.timeout" :vertical="msg.mode === 'vertical'" :top = "true">
            {{ msg.text }}
            <v-btn dark flat @click="msg.snackbar = false">Close</v-btn>
        </v-snackbar>
        </navbar>
        <mdb-modal v-if="editModal" @close="editModal = false">
                <mdb-modal-header>
                    <mdb-modal-title>More</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body>
                  <mdb-input type="text" label="Username" v-model="editData.username" />
                  <mdb-input type="text" label="New password or leave empty" v-model="editData.password" />
                </mdb-modal-body>
                <mdb-modal-footer>
                    <mdb-btn size="sm" outline="success" @click="edit">Save changes</mdb-btn>
                </mdb-modal-footer>
            </mdb-modal>

        <router-view/>
    </div>
</template>
<script>
import axios from 'axios'
import {Navbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbBtn, mdbIcon,mdbInput, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter} from 'mdbvue'
export default {
    name: 'Main',
    components: {
        Navbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbBtn, mdbIcon,mdbInput, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter
    },
    data() {
        return {
            activeItem: 1,
            userData: {},
            editData: {
                username:'',
                password:''
            },
            editModal: false,
            msg:{
                snackbar: false,
                color: '',
                mode: '',
                timeout: 2000,
                text: ''
            }
        }
    },
    mounted() {
        // this.notLog()
        if (this.$store.getters.isLoggedIn) {
            this.$router.push('/writers')
        }else{
            this.$router.push('/')
        }
        this.init()
    },
    methods: {
        init(){
            if (this.$store.getters.isLoggedIn) {
                axios.get('http://'+ this.$store.state.server_ip +':3000/api/shirafi_users/'+this.$store.state.userId)
                .then(res => {
                    this.userData = Object.assign({}, res.data)
                })
            }else{
                console.log('nop')
            }
        },
        logout(){
            this.$store.dispatch('logout')
            .then(() => this.$router.push('/'))
            .catch(err => console.log(err))
        },
        notLog(){
            if (!this.$store.getters.isLoggedIn) {
                this.$router.push('/')
            }
        },
        launchEdit(){
            this.editModal = true
            this.editData.username = this.userData.username
        },
        edit(){
            if (this.editData.password == '') {
                if (this.editData.username == '') {
                    this.msg.text = "Username is empty"
                    this.msg.snackbar = true
                    this.msg.color = "red"
                }else{
                    axios.patch('http://'+ this.$store.state.server_ip +':3000/api/shirafi_users/'+this.$store.state.userId,{
                        username: this.editData.username
                    }).then(res=> {
                         this.msg.text = "Done!"
                    this.msg.snackbar = true
                    this.msg.color = "green"
                        this.init()
                        this.editModal = false
                    })
                }
            }else{
                if (this.editData.username == '') {
                   this.msg.text = "Done!"
                        this.msg.snackbar = true
                        this.msg.color = "green"
                }else{
                    axios.patch('http://'+ this.$store.state.server_ip +':3000/api/shirafi_users/'+this.$store.state.userId,{
                        username: this.editData.username,
                        password: this.editData.password
                    }).then(res=> {
                        this.msg.text = "Done!"
                        this.msg.snackbar = true
                        this.msg.color = "green"
                        this.init()
                        this.editModal = false
                    })
                }
            }
        }
    },
}
</script>
