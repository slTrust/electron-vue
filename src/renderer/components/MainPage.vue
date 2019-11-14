<template>
  <div id="wrapper">
      <!-- <div class="toastWrapper">
          <div class="content">ddd</div>
        </div> -->
    <h2>主页面</h2>
    <li v-for="item in stockList">
      <button @click="newWindow(item)" :disabled="item.state">{{item.code}}新窗口</button>
      <!-- <button @click="sendMsg($event,item.code)">单独给{{item.code}}窗口发消息</button> -->
      <button @click="sendMsg(item.code)" :disabled="!item.state">单独给{{item.code}}窗口发消息</button>

    </li>
    主页面发广播
    <button @click="sendMsg(null)">发所有子窗口发消息</button>

    系统信息
    <system-information></system-information>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'main-page',
    components: { SystemInformation },
    data(){
      return {
          isOpened: false,
          stockList:[
              {code:"600001",state:false,},
              {code:"600002",state:false,},
              {code:"600003",state:false,},
              {code:"600004",state:false}
          ]
      }
    },
    methods: {
        sendMsg(code){
            let payload = { msg:'这是来自主窗口的信息' };
            if(code){
                payload.id = code;
                payload.msg = '单独发送的消息'
            }
            this.$electron.ipcRenderer.send('main-to-sub',payload)
        },
        open (link) {
            this.$router
            this.$electron.shell.openExternal(link)
        },
        newWindow(stock){
            stock.state = true;
            this.$electron.ipcRenderer.send('newWindow',{id:stock.code,msg:'这是来自主窗口的信息'})
        }
    },
    mounted(){
        this.$electron.ipcRenderer.on('subwindow-closed',(event,payload)=>{
            console.log('--------')
            console.log(payload);
            console.log('--------')
            let code = payload.id;
            let item = this.stockList.filter(item=>item.code===code)[0];
            item.state = false;
            window.Toast(`子窗口${code} 关闭了，恢复开启子窗口状态`);
        })

        this.$electron.ipcRenderer.on('router',(event,path)=>{
            this.$router.replace(path)
        })

        this.$electron.ipcRenderer.on('sub-to-main',(event,msg)=>{
            console.log(msg);
            window.Toast(`子窗口：发来了msg:${JSON.stringify(msg)}`);
        })
    }
  }
</script>

<style lang="scss">
</style>
