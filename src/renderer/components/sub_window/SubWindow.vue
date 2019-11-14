<template>
  <div id="wrapper"  style="-webkit-app-region: drag">
    <h2>子窗口</h2>
    <div style="border:1px solid red;">
      <strong>主页面传递的信息</strong>
      <br>
      id:{{id}}
      <br>
      msg:{{payload.msg}}
      <button @click="sendMsg">发消息</button>
      <br>
      收到的消息：{{data}}
    </div>

    <system-information/>

  </div>
</template>

<script>
  import SystemInformation from '@/components/LandingPage/SystemInformation'
  export default {
    name: 'subWindow',
    components: {SystemInformation },
    data(){
      return {
            id:this.$route.params.id,
            payload: '',
            data:null,
      }
    },
    methods: {
        goToMain(){
          this.$router.replace({path:'/'})
        },
        sendMsg(){
            this.$electron.ipcRenderer.send('sub-to-main',{id:this.id,msg:'子页面'+this.id+'的msg'});
        },
        xxx1(event, payload){
            let id = this.$route.params.id;
            if(payload.id===id){
                console.log(payload)
                this.payload = payload
            }
        },
        xxx2(event,payload){
            console.log("main-to-sub")
            console.log(payload)
            this.data = payload
        }
    },
    mounted() {
        let id = this.$route.params.id;
        this.$electron.ipcRenderer.send('sub-to-main',{id,msg:"子窗口已经开启！"});
        this.$electron.ipcRenderer.on('main-to-sub',(event,payload)=>{
            console.log("main-to-sub")
            console.log(payload)
            this.data = payload
            alert(`"main-to-sub：发来了数据:${JSON.stringify(payload)}`);
        });
    }
  }
</script>

<style scoped>
  button{
    -webkit-app-region: no-drag;
  }
</style>
