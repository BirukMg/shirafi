<template>
    <div class="container" style="margin-top: 60px">
        <mdb-btn size="sm" class="add-btn" outline="primary" @click="addSponsorModal = true"><mdb-icon icon="plus" class="mr-1"/> Sponsor</mdb-btn>
        <mdb-row>
            <mdb-col sm="4" v-for="sponsor in sponsors">
                <figure class="figure">
                    <figcaption class="figure-caption text-left">{{sponsor.note}}</figcaption>
                    <img :src="'http://'+ $store.state.server_ip +':3000/api/containers/images/download/'+sponsor.img" class="img-thumbnail sponsor-img" alt="...">
                    <span class="text-right" @click="deleteSponsor(sponsor)"><mdb-icon icon="times" class="mr-1 icons text-danger" size="lg"/></span>
                    <span class="text-right" @click="show(sponsor)" v-if="sponsor.show"><mdb-icon icon="eye" class="mr-1 icons text-success" size="lg"/></span>
                    <span class="text-right" @click="show(sponsor)" v-if="!sponsor.show"><mdb-icon icon="eye-slash" class="mr-1 icons text-warning" size="lg"/></span>
                </figure>
            </mdb-col>
        </mdb-row>

        <mdb-modal v-if="addSponsorModal" @close="addSponsorModal = false">
                <mdb-modal-header>
                    <mdb-modal-title>New Sponsor</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body>
                    <h5 :class="addmsg.styles">{{addmsg.title}}</h5>
                    <input type="file" style="display: none" @change="onAddImg" ref="pickAddImg">
                    <img :src="img_preview" alt="news image" class="img-thumbnail news-img" @click="$refs.pickAddImg.click()"/>
                    <mdb-input type="text" label="Note" v-model="note"/>
                </mdb-modal-body>
                <mdb-modal-footer>
                    <mdb-btn size="sm" outline="success" @click="addSponsor">Save</mdb-btn>
                </mdb-modal-footer>
            </mdb-modal>
    </div>
</template>
<script>
import axios from 'axios'
import {mdbRow, mdbCol, mdbIcon, mdbBtn, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbInput} from 'mdbvue'
export default {
    name: 'Sposorship',
    components: {
        mdbRow, mdbCol, mdbIcon, mdbBtn, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbInput
    },
    data() {
        return {
            addSponsorModal: false,
            addmsg:{
                title: '',
                styles: ''
            },
            img_preview: null,
            selectedImg: null,
            note: '',
            sponsors: []
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
            axios.get('http://'+ this.$store.state.server_ip +':3000/api/sponsors')
            .then(res => {
                this.sponsors = res.data
            })
        },
        addSponsor(){
            let formData = new FormData()
            formData.append('file',this.selectedImg)
            axios.post('http://'+ this.$store.state.server_ip +':3000/api/containers/images/upload',formData,{
            onUploadProgress: uploadEvent => {
                this.addmsg.show = true
                this.addmsg.title = "Please wait..." + Math.round(uploadEvent.loaded / uploadEvent.total * 100) + "%"
                this.addmsg.styles = "text-success font-weight-bold"
            }
            }).then(res => {
                axios.post('http://'+ this.$store.state.server_ip +':3000/api/sponsors', {
                    note: this.note,
                    img: res.data.result.files.file[0].name
                })
                .then(res => {
                    this.addmsg.title = "Done!"
                    this.addmsg.styles = "text-success font-weight-bold animated bounceIn"
                    this.init()
                })
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
      isFileImage(file) {
          return file && file['type'].split('/')[0] === 'image';
      },
      deleteSponsor(item){
            axios.delete('http://' + this.$store.state.server_ip + ':3000/api/sponsors/'+ item.id)
            .then(res => {
                this.init()
            })
        },
        show(item){
            axios.patch('http://' + this.$store.state.server_ip + ':3000/api/sponsors/'+ item.id,{show: !item.show})
            .then(res => {
                this.init()
            })
        }
    },
}
</script>
<style scoped>
    .sponsor-img{
        width: 500px;
        height: 400px;
    }
    .add-btn{
        float: right;
    }
    .text-right{
        float: right;
    }
</style>

