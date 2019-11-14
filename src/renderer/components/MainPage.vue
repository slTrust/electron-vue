<template>
  <div id="wrapper">
    
    <!-- <h2>主页面</h2>
    <li v-for="item in stockList">
      <el-button type="primary" @click="newWindow(item)" :disabled="item.state">{{item.code}}新窗口</el-button>
      <el-button @click="sendMsg(item.code)" :disabled="!item.state">单独给{{item.code}}窗口发消息</el-button>
    </li> -->
    <el-table
      :data="stockList"
      style="width: 100%">
      <el-table-column
        prop="code"
        label="股票代码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="state"
        label="操作">
         <template slot-scope="scope">
            <el-button
                size="mini"
                type="danger"
                @click="newWindow(scope.row)" :disabled="scope.row.state">新开窗口
            </el-button>
            <el-button
                size="mini"
                type="primary"
                @click="sendMsg(scope.row.code)" :disabled="!scope.row.state">单独给{{scope.row.code}}窗口发消息
            </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-button @click="sendMsg(null)">主页面给所有子窗口发消息</el-button>
    <hr>
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
            this.$message
            this.$message(`子窗口${code} 关闭了，恢复开启子窗口状态`);
        })

        this.$electron.ipcRenderer.on('router',(event,path)=>{
            this.$router.replace(path)
        })

        this.$electron.ipcRenderer.on('sub-to-main',(event,msg)=>{
            console.log(msg);
            // window.Toast(`子窗口：发来了msg:${JSON.stringify(msg)}`);
            this.$message(`子窗口：发来了msg:${JSON.stringify(msg)}`);
        })
    }
  }
</script>

<style lang="scss">
</style>
