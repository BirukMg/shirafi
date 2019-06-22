<template>
    <section class="container">
        <v-app style="background-color: #fff">
            <v-toolbar flat color="white">
                <v-toolbar-title>Writers</v-toolbar-title>
                <v-divider class="mx-2" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <mdb-btn size="sm" outline="primary" @click="addWriterModal = true"><mdb-icon icon="plus" class="mr-1"/> New Writer</mdb-btn>
            </v-toolbar>
            <v-data-table :headers="headers" :items="writers" class="elevation-1">
                <template slot="items" slot-scope="props">
                    <td class="text-xs-left" style="width: 1px">{{writers.indexOf(props.item) + 1}}</td>
                    <td class="text-xs-left" style="width: 1px">
                        <img src="../assets/images/logo.jpg" class="post-img" alt="">
                    </td>
                    <td class="text-xs-left" style="width: 1px">{{props.item.full_name}}</td>
                    <td class="text-xs-left" style="width: 1px">{{props.item.nick_name}}</td>
                    <td class="text-xs-left" style="width: 1px">{{props.item.address}}</td>
                    <td class="text-xs-left" style="width: 1000px">{{props.item.phone_number}}</td>
                    <td class="text-xs-left" style="width: 1000px">{{props.item.username}}</td>
                    <td class="text-xs-left" style="width: 1000px">{{props.item.password}}</td>
                    <td class="text-xs-left" style="width: 150px">
                        <span @click="launchEditModal(props.item)"><mdb-icon icon="edit" style="margin-left: 2px" class="mr-1 icons text-info" size="lg"/></span>
                        <span @click="onOffItem(props.item)"><mdb-icon icon="lock" v-if="!props.item.active" style="margin-left: 2px" class="mr-1 icons text-warning" size="lg"/></span>
                        <span @click="onOffItem(props.item)"><mdb-icon icon="unlock" v-if="props.item.active" style="margin-left: 2px" class="mr-1 icons text-success" size="lg"/></span>
                        <span @click="launchDeleteModal(props.item)"><mdb-icon icon="times" style="margin-left: 2px" class="mr-1 icons text-danger" size="lg"/></span>
                        
                    </td>
                    
                </template>
            </v-data-table>

            <mdb-modal v-if="deleteModal" @close="deleteModal = false">
                <mdb-modal-header class="cancel-modal-header">
                    <mdb-modal-title class="header-title">Are you sure?</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body>
                    <i class="fa fa-times fa-4x animated rotateIn text-danger"></i>
                    <h5 class="font-weight-bold text-danger">Delete {{deleteData.full_name}} ??</h5>
                </mdb-modal-body>
                <mdb-modal-footer>
                    <section style="margin-right: 7%">
                        <mdb-btn color="danger" size="sm" @click="deleteWriter">Delete account only</mdb-btn>
                        <mdb-btn color="danger" size="sm" @click="deleteItem">Delete related post</mdb-btn>
                        <mdb-btn color="danger" size="sm" @click="deleteModal = false">Cancel</mdb-btn>
                    </section>
                </mdb-modal-footer>
            </mdb-modal>

            <mdb-modal size="lg" v-if="editModal" @close="editModal = false">
                <mdb-modal-header>
                    <mdb-modal-title>More</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body>
                  <h5 :class="editmsg.styles">{{editmsg.title}}</h5>
                  <mdb-input type="text" label="Full name" v-model="editData.full_name" />
                  <mdb-input type="text" label="Nick name" v-model="editData.nick_name" />
                  <mdb-input type="text" label="Address" v-model="editData.address" />
                  <mdb-input type="text" label="Phone number" v-model="editData.phone_number" />
                  <mdb-input type="text" label="Username" v-model="editData.username" />
                  <mdb-input type="text" label="Password" v-model="editData.password" />
                </mdb-modal-body>
                <mdb-modal-footer>
                    <mdb-btn size="sm" outline="success" @click="editWriter">Save changes</mdb-btn>
                </mdb-modal-footer>
            </mdb-modal>


            <mdb-modal v-if="addWriterModal" @close="addWriterModal = false">
                <mdb-modal-header>
                    <mdb-modal-title>New Writer</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body>
                    <h5 :class="addmsg.styles">{{addmsg.title}}</h5>
                    <mdb-input type="text" label="Full name" v-model="addData.full_name"/>
                    <mdb-input type="text" label="Nick name" v-model="addData.nick_name"/>
                    <mdb-input type="text" label="Address" v-model="addData.address"/>
                    <mdb-input type="text" label="Phone number" v-model="addData.phone_number"/>
                </mdb-modal-body>
                <mdb-modal-footer>
                    <mdb-btn size="sm" outline="success" @click="addWriter">Save</mdb-btn>
                </mdb-modal-footer>
            </mdb-modal>
        </v-app>
    </section>
</template>
<script>
import axios from 'axios'
import {mdbIcon, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn, mdbInput} from 'mdbvue'
export default {
    name: 'Writers',
    components:{
        mdbIcon, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn, mdbInput
    },
    data() {
        return {
            passed: false,
            editModal: false,
            addWriterModal: false,
            deleteModal: false,
            editData: {},
            deleteData: {},
            addData: {
                full_name: '',
                nick_name: '',
                address: '',
                phone_number: '',
                username: 'username',
                password:'password'
            },
            addmsg:{
                title: '',
                styles: ''
            },
            editmsg:{
                title: '',
                styles: ''
            },
            backupUsername: '',
            usernameAvailable: false,
            headers: [
                { text: '#',align: 'left',value: 'writers_no'},
                { text: 'Profile Picture',align: 'left',value: 'profile_picture'},
                { text: 'Full name',align: 'left', value: 'full_name' },
                { text: 'Nick name',align: 'left', value: 'nick_name' },
                { text: 'Address',align: 'left', value: 'address' },
                { text: 'Phone number',align: 'left', value: 'phone_number' },
                { text: 'Username',align: 'left', value: 'username' },
                { text: 'Password',align: 'left', value: 'password' },
                { text: 'Control',align: 'left', value: 'control' },
            ],
            writers: []
        }
    },
    mounted() {
        this.init()
        this.notLog()
    },
    methods: {
        notLog(){
            if (!this.$store.getters.isLoggedIn) {
                this.$router.push('/')
            }
        },
        init(){
            axios.get('http://' + this.$store.state.server_ip + ':3000/api/writers')
            .then(res => {
                this.writers = res.data
            })
        },
        addWriter(){
            this.checkEmpty(this.addData, this.addmsg)
            if (this.passed) {
                this.addData.username = this.defaultUsername(this.addData.full_name)
                this.addData.password = this.defaultPassword()
                axios.post('http://' + this.$store.state.server_ip + ':3000/api/shirafi_users',{
                    username: this.addData.username,
                    email: this.defaultEmail(),
                    password: this.addData.password
                }).then(res => {
                    axios.post('http://' + this.$store.state.server_ip + ':3000/api/shirafi_users/'+ res.data.id +'/writers',this.addData)
                    .then(res => {
                        this.init()
                        this.addmsg.title = 'New writer added'
                        this.addmsg.styles = 'text-success font-weight-bold'
                        this.passed = false
                    })
                })
            }
        },
        editWriter(){
            this.checkEmpty(this.editData, this.editmsg)
            this.checkUsername(this.editData.username)
            if (this.passed) {
                if (this.usernameAvailable) {
                    axios.patch('http://' + this.$store.state.server_ip + ':3000/api/shirafi_users/'+ this.editData.user_id,{
                        username: this.editData.username,
                        password: this.editData.password
                    }).then(res => {
                        axios.patch('http://' + this.$store.state.server_ip + ':3000/api/writers/'+ this.editData.id,this.editData)
                        .then(res => {
                            this.init()
                            this.editModal = false
                            this.editmsg.title = ''
                        })
                    })
                }else{
                    this.editmsg.title = 'Username alredy taken'
                    this.editmsg.styles = 'text-danger font-weight-bold'
                }
            }

        },
        onOffItem(item){
            axios.patch('http://' + this.$store.state.server_ip + ':3000/api/writers/'+ item.id,{active: !item.active})
            .then(res => {
                this.init()
            })
        },
        deleteWriter(){
            axios.delete('http://' + this.$store.state.server_ip + ':3000/api/writers/'+ this.deleteData.id)
            .then(res => {
                this.init()
                this.deleteModal = false
            })
        },
        launchDeleteModal(item){
            this.deleteModal = true
            this.deleteData = Object.assign({}, item)
        },
        launchEditModal(item){
            this.editModal = true
            this.editData =  Object.assign({}, item)
            this.backupUsername = item.username
        },
        defaultEmail(){
            var dafaultMail = "";
            var possibleMail = "1234567890";

            for (var i = 0; i < 3; i++)
            dafaultMail += possibleMail.charAt(Math.floor(Math.random() * possibleMail.length));
            var tem = "willcheck" + dafaultMail + "@office.com"
            return tem;
        },
        defaultUsername(name){
            var sidNum = "";
            var number = "1234567890";

            for (var i = 0; i < 4; i++)
            sidNum += number.charAt(Math.floor(Math.random() * number.length));
            return name.substring(0,3) + "-" + sidNum
        },
        defaultPassword(){
            var dafaultPassword = "";
            var possiblePassword = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()}{><,.?}";

            for (var i = 0; i < 10; i++)
            dafaultPassword += possiblePassword.charAt(Math.floor(Math.random() * possiblePassword.length));
            return dafaultPassword;
        },
        checkEmpty(object,msgs){
          for (const value in object) {
              if (object.hasOwnProperty(value)) {
                  if (!this.isInt(object[value])) {
                    if (object[value] == '') {
                      msgs.title = value + " is requred"
                      msgs.styles = 'text-danger font-weight-bold'
                      this.passed = false
                      break
                    }else {
                        this.passed = true
                    }
                  }else{
                    break
                  }
              }
          }
      },
      isInt(value) {
        var x = parseFloat(value);
        return !isNaN(value) && (x | 0) === x;
      },
      checkUsername(username){
      let filter = {
        where: {
          username : username
        }
      }
      axios.get("http://"+ this.$store.state.server_ip +":3000/api/shirafi_users?filter="+ JSON.stringify(filter))
      .then(res => {
        if (res.data.length > 0) {
            if (res.data[0].username == this.backupUsername) {
                this.usernameAvailable = true
            }else {
                this.usernameAvailable = false
            }
          }else {
            this.usernameAvailable = false
          }
      })
    }
    },
}
</script>
<style scoped>
    .icons:hover{
        cursor: pointer;
    }
    .post-img{
        height: 60px;
        width: 60px;
        margin: 5px 0px;
        border-radius: 50%;
    }
    .more-post-img{
        width: 100%;
        height: 400px;
    }
    .cancel-modal-header{
        font-weight: bold;
        color: #fff;
        background-color: red;
    }
    .header-title{
        font-weight: bold;
        margin-left: 40%;
    }
</style>

