<template>
    <section class="container">
        <v-app style="background-color: #fff">
            <v-toolbar flat color="white">
                <v-toolbar-title>Writers Post</v-toolbar-title>
                <v-divider class="mx-2" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-data-table :headers="headers" :items="posts" class="elevation-1">
                <template slot="items" slot-scope="props">
                    <td class="text-xs-left" style="width: 1px">{{posts.indexOf(props.item) + 1}}</td>
                    <td class="text-xs-left" style="width: 1px">
                        <img src="../assets/images/logo.jpg" class="post-img" alt="">
                    </td>
                    <td class="text-xs-left" style="width: 1px">{{props.item.title}}</td>
                    <td class="text-xs-left" style="width: 1px">{{props.item.category}}</td>
                    <td class="text-xs-left" style="width: 1px">{{props.item.view}}</td>
                    <td class="text-xs-left" style="width: 1000px">{{props.item.body}}</td>
                    <td class="text-xs-left" style="width: 150px">
                        <span @click="launchMoreModal(props.item)"><mdb-icon icon="ellipsis-h" style="margin-left: 2px" class="mr-1 icons text-info" size="lg"/></span>
                        <span @click="show(props.item)" v-if="!props.item.show"><mdb-icon icon="eye-slash" style="margin-left: 2px" class="mr-1 icons text-warning" size="lg"/></span>
                        <span @click="show(props.item)" v-if="props.item.show"><mdb-icon icon="eye" style="margin-left: 2px" class="mr-1 icons text-success" size="lg"/></span>
                        <span @click="showHome(props.item)" v-if="!props.item.show_home"><mdb-icon icon="home" style="margin-left: 2px" class="mr-1 icons" size="lg"/></span>
                        <span @click="showHome(props.item)" v-if="props.item.show_home"><mdb-icon icon="home" style="margin-left: 2px" class="mr-1 icons text-info" size="lg"/></span>
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
                  <img src="../assets/images/logo.jpg" class="more-post-img" alt="">
                  <p>{{moreData.body}}</p>
                </mdb-modal-body>
            </mdb-modal>
        </v-app>
    </section>
</template>
<script>
import axios from 'axios'
import {mdbIcon, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn} from 'mdbvue'
export default {
    name: 'Writers',
    components:{
        mdbIcon, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn
    },
    data() {
        return {
            moreModal: false,
            deleteModal: false,
            moreData: {},
            deleteData: {},
            headers: [
                {text: '#',align: 'left',value: 'writers_no'},
                {text: 'Post Picture',align: 'left',value: 'post_picture'},
                { text: 'Title',align: 'left', value: 'title' },
                { text: 'Category',align: 'left', value: 'category' },
                { text: 'View',align: 'left', value: 'view' },
                { text: 'Post',align: 'left', value: 'post' },
                { text: 'Control',align: 'left', value: 'control' },
            ],
            posts: []
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
            let filterPost = {
                where : {
                    post_by: 'writer'
                }
            }
            axios.get('http://'+ this.$store.state.server_ip +':3000/api/posts?filter='+ JSON.stringify(filterPost))
            .then(res => {
                this.posts = res.data
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
        show(item){
            axios.patch('http://' + this.$store.state.server_ip + ':3000/api/posts/'+ item.id,{show: !item.show})
            .then(res => {
                this.init()
            })
        },
        showHome(item){
            axios.patch('http://' + this.$store.state.server_ip + ':3000/api/posts/'+ item.id,{show_home: !item.show_home})
            .then(res => {
                this.init()
            })
        },
        deletePost(){
            axios.delete('http://' + this.$store.state.server_ip + ':3000/api/posts/'+ this.deleteData.id)
            .then(res => {
                this.init()
                this.deleteModal = false
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
        margin-left: 30%;
    }
</style>

