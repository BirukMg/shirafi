<template>
    <section class="container">
        <v-app style="background-color: #fff">
            <v-toolbar flat color="white">
                <v-toolbar-title>Writers Post</v-toolbar-title>
                <v-divider class="mx-2" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <mdb-btn size="sm" outline="primary" @click="addNewsModal = true"><mdb-icon icon="plus" class="mr-1"/> News</mdb-btn>
            </v-toolbar>
            <v-data-table :headers="headers" :items="news" class="elevation-1">
                <template slot="items" slot-scope="props">
                    <td class="text-xs-left" style="width: 1px">{{news.indexOf(props.item) + 1}}</td>
                    <td class="text-xs-left" style="width: 1px">
                        <img :src="'http://localhost:3000/api/containers/images/download/' + props.item.post_img" class="post-img" alt="">
                    </td>
                    <td class="text-xs-left" style="width: 1px">{{props.item.title}}</td>
                    <td class="text-xs-left" style="width: 1000px">{{props.item.body}}</td>
                    <td class="text-xs-left" style="width: 150px">
                        <span @click="launchMoreModal(props.item)"><mdb-icon icon="ellipsis-h" style="margin-left: 2px" class="mr-1 icons text-info" size="lg"/></span>
                        <span @click="launchEditModal(props.item)"><mdb-icon icon="edit" style="margin-left: 2px" class="mr-1 icons text-primary" size="lg"/></span>
                        <span @click="show(props.item)" v-if="!props.item.show"><mdb-icon icon="eye-slash" style="margin-left: 2px" class="mr-1 icons text-warning" size="lg"/></span>
                        <span @click="show(props.item)" v-if="props.item.show"><mdb-icon icon="eye" style="margin-left: 2px" class="mr-1 icons text-success" size="lg"/></span>
                        <span @click="launchDeleteModal(props.item)"><mdb-icon icon="times" style="margin-left: 2px" class="mr-1 icons text-danger" size="lg"/></span>
                    </td>
                    
                </template>
            </v-data-table>

            <mdb-modal size="sm" v-if="deleteModal" @close="deleteModal = false">
                <mdb-modal-header class="cancel-modal-header">
                    <mdb-modal-title class="header-title">Are you sure?</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body>
                    <i class="fa fa-times fa-4x animated rotateIn" style="color:red"></i>
                    <h5 class="font-weight-bold text-danger">Delete {{deleteData.title}} ??</h5>
                </mdb-modal-body>
                <mdb-modal-footer>
                    <mdb-btn color="primary" outline="danger" size="sm" @click="deletePost">Yes</mdb-btn>
                    <mdb-btn color="danger" size="sm" @click="deleteModal = false">No</mdb-btn>
                </mdb-modal-footer>
            </mdb-modal>

            <mdb-modal size="lg" v-if="moreModal" @close="moreModal = false">
                <mdb-modal-header>
                    <mdb-modal-title>More</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body>
                  <img :src="'http://localhost:3000/api/containers/images/download/' + moreData.post_img" class="more-post-img" alt="">
                  <p>{{moreData.body}}</p>
                </mdb-modal-body>
            </mdb-modal>

            <mdb-modal v-if="addNewsModal" @close="addNewsModal = false">
                <mdb-modal-header>
                    <mdb-modal-title>New Writer</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body>
                    <h5 :class="addmsg.styles">{{addmsg.title}}</h5>
                    <input type="file" style="display: none" @change="onAddImg" ref="pickAddImg">
                    <img :src="img_preview === null ? '../assets/images/logo.jpg' : img_preview" alt="news image" class="img-thumbnail news-img" @click="$refs.pickAddImg.click()"/>
                    <mdb-input type="text" label="Title" v-model="addData.title"/>
                    <mdb-textarea label="Body" :rows="3" v-model="addData.body"/>
                </mdb-modal-body>
                <mdb-modal-footer>
                    <mdb-btn size="sm" outline="success" @click="addNews">Save</mdb-btn>
                </mdb-modal-footer>
            </mdb-modal>

            <mdb-modal v-if="editNewsModal" @close="editNewsModal = false">
                <mdb-modal-header>
                    <mdb-modal-title>Edit news</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body>
                    <h5 :class="editmsg.styles">{{editmsg.title}}</h5>
                    <input type="file" style="display: none" @change="onEditImg" ref="pickAddImg">
                    <img :src="editimg_preview" alt="news image" class="img-thumbnail news-img" @click="$refs.pickAddImg.click()"/>
                    <mdb-input type="text" label="Title" v-model="editData.title"/>
                    <mdb-textarea label="Body" :rows="3" v-model="editData.body"/>
                </mdb-modal-body>
                <mdb-modal-footer>
                    <mdb-btn size="sm" outline="success" @click="editNews">Save</mdb-btn>
                </mdb-modal-footer>
            </mdb-modal>
        </v-app>
    </section>
</template>
<script>
import axios from 'axios'
import {mdbIcon, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn, mdbTextarea, mdbInput} from 'mdbvue'
export default {
    name: 'Writers',
    components:{
        mdbIcon, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn, mdbTextarea, mdbInput
    },
    data() {
        return {
            passed: false,
            moreModal: false,
            addNewsModal: false,
            deleteModal: false,
            editNewsModal: false,
            moreData: {},
            deleteData: {},
            editData: {},
            addmsg:{
                title: '',
                styles: '',
                show: false
            },
            editmsg:{
                title: '',
                styles: '',
                show: false
            },
            addData: {
                title: '',
                body:'',
                post_img: null
            },
            img_preview: null,
            selectedImg: null,
            editselectedImg: null,
            editimg_preview: '',
            headers: [
                { text: '#',align: 'left',value: 'news_no'},
                { text: 'News Picture',align: 'left',value: 'news_picture'},
                { text: 'Title',align: 'left', value: 'title' },
                { text: 'Body',align: 'left', value: 'body' },
                { text: 'Control',align: 'left', value: 'control' },
            ],
            news: []
        }
    },
    mounted() {
        this.init()
        if (!this.$store.getters.isLoggedIn) {
            this.$router.push('/')
        }
    },
    methods: {
        init(){
            axios.get('http://'+ this.$store.state.server_ip +':3000/api/news')
            .then(res => {
                this.news = res.data
            })
        },
        launchDeleteModal(item){
            this.deleteModal = true
            this.deleteData = Object.assign({}, item)
        },
        launchMoreModal(item){
            this.moreModal = true
            this.moreData =  Object.assign({}, item)
        },
        launchEditModal(item){
            this.editNewsModal = true
            this.editData =  Object.assign({}, item)
            this.editimg_preview = 'http://localhost:3000/api/containers/images/download/' + item.post_img
        },
        addNews(){
            this.checkEmpty(this.addData,this.addmsg)
            if (this.passed) {
                let formData = new FormData()
                formData.append('file',this.selectedImg)
                axios.post('http://'+ this.$store.state.server_ip +':3000/api/containers/images/upload',formData,{
                onUploadProgress: uploadEvent => {
                    this.addmsg.show = true
                    this.addmsg.title = "Please wait..." + Math.round(uploadEvent.loaded / uploadEvent.total * 100) + "%"
                    this.addmsg.styles = "text-success font-weight-bold"
                }
                }).then(res => {
                    console.log(res.data.result.files.file[0].name)
                    this.addData.post_img = res.data.result.files.file[0].name
                    axios.post('http://'+ this.$store.state.server_ip +':3000/api/news', this.addData)
                    .then(res => {
                        this.passed = false
                        this.addmsg.show = true
                        this.addmsg.title = "Done!"
                        this.addmsg.styles = "text-success font-weight-bold"
                        this.init()
                    })
                })
            }
        },
        editNews(){
            this.checkEmpty(this.editData,this.editmsg)
            if (this.passed) {
                let formData = new FormData()
                formData.append('file',this.editselectedImg)
                axios.post('http://'+ this.$store.state.server_ip +':3000/api/containers/images/upload',formData,{
                onUploadProgress: uploadEvent => {
                    this.addmsg.show = true
                    this.addmsg.title = "Please wait..." + Math.round(uploadEvent.loaded / uploadEvent.total * 100) + "%"
                    this.addmsg.styles = "text-success font-weight-bold"
                }
                }).then(res => {
                    this.editData.post_img = res.data.result.files.file[0].name
                    axios.patch('http://'+ this.$store.state.server_ip +':3000/api/news/'+this.editData.id, this.editData)
                    .then(res => {
                        this.init()
                        this.editNewsModal = false
                        this.editmsg.title = ''
                    })
                })
            }
        },
        show(item){
            axios.patch('http://' + this.$store.state.server_ip + ':3000/api/news/'+ item.id,{show: !item.show})
            .then(res => {
                this.init()
            })
        },
        showHome(item){
            axios.patch('http://' + this.$store.state.server_ip + ':3000/api/news/'+ item.id,{show_home: !item.show_home})
            .then(res => {
                this.init()
            })
        },
        deletePost(){
            axios.delete('http://' + this.$store.state.server_ip + ':3000/api/news/'+ this.deleteData.id)
            .then(res => {
                this.init()
                this.deleteModal = false
            })
        },
        onAddImg(e){
        
        if (!this.isFileImage(e.target.files[0])) {
          this.addmsg.show = true
          this.addmsg.title = "Please select image"
          this.addmsg.styles = "text-danger font-weight-bold animated bounceIn"
        }else{
          this.addmsg.show = true
          this.addmsg.title = e.target.files[0].name
          this.addmsg.styles = "text-success font-weight-bold animated bounceIn"
          this.selectedImg = e.target.files[0]
          let reader = new FileReader()
          reader.readAsDataURL(e.target.files[0])
          reader.onload = event => {
            this.img_preview = event.target.result
          }
        }
      },
      onEditImg(e){
        
        if (!this.isFileImage(e.target.files[0])) {
          this.editmsg.show = true
          this.editmsg.title = "Please select image"
          this.editmsg.styles = "text-danger font-weight-bold animated bounceIn"
        }else{
          this.editmsg.show = true
          this.editmsg.title = e.target.files[0].name
          this.editmsg.styles = "text-success font-weight-bold animated bounceIn"
          this.editselectedImg = e.target.files[0]
          let reader = new FileReader()
          reader.readAsDataURL(e.target.files[0])
          reader.onload = event => {
            this.editimg_preview = event.target.result
          }
        }
      },
      isFileImage(file) {
          return file && file['type'].split('/')[0] === 'image';
      },
      checkEmpty(object,msgs){
          for (const value in object) {
              if (object.hasOwnProperty(value)) {
                  if (object[value] == '') {
                      msgs.title = value + " is requred"
                      msgs.styles = 'text-danger font-weight-bold animated bounceIn'
                      this.passed = false
                      break
                  }else {
                      this.passed = true
                  }
              }
          }
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
        margin-left: 30%;
    }
    .news-img{
        height: 200px;
        width: 300px;
    }
    .news-img:hover{
        cursor: pointer;
    }
</style>

