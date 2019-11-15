import { app, BrowserWindow,ipcMain,Menu } from 'electron'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
console.log(BrowserWindow)

Menu.setApplicationMenu(null);

let mainWindow;
let subWindosMaps = {};
let subWindow;

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    autoHideMenuBar:true,
    width: 1000,
    show: false,
  })

  mainWindow.loadURL(winURL)
  mainWindow.on('ready-to-show',()=>{
    console.log(111)
    mainWindow.show();
    // mainWindow.send('router',{path:'/entry'});
  })

    // 主窗口要关闭的时候 关闭所有未关闭的子窗口
    mainWindow.on('close',(a,b)=>{
        console.log("close 事件")
        for(var key in subWindosMaps){
            let subWin = subWindosMaps[key];
            subWin && subWin.destroy();
        }
        mainWindow = null
    })
}

ipcMain.on('newWindow',(event,payload)=>{
    subWindow = new BrowserWindow({
        height: 400,
        width: 400,
        useContentSize: true,
        show: false,
        title:payload.id,
        autoHideMenuBar:true,
        // // frame: false, // 这样子窗口有头部 可以关闭和放大 缩小
        // parent: mainWindow
    })
    // console.log(winURL+"/#/sub") //开发和构件时路由方式不同，不能用这个
    const modalPath = process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080/#/sub/' + payload.id
    : `file://${__dirname}/index.html#sub/${payload.id}`
    subWindow.loadURL(modalPath);
    
   
    subWindow.on('ready-to-show',()=>{
        subWindow.setTitle(payload.id)
        subWindow.show();
        // 缓存这个 subWindow到map里
        subWindosMaps[payload.id] = subWindow;
    })

    subWindow.on('focus', () => {
        
    })

    subWindow.on('closed', () => {
        // 注销所有事件监听
        subWindow.destroy();
        mainWindow.send('subwindow-closed',{...payload,msg:"这是子窗口关闭时发来的消息"});
        delete subWindosMaps[payload.id]
        console.log('closed' + payload.id)
    })
})

// 子窗口的消息监听
ipcMain.on('sub-to-main',(a,b)=>{
    // process的 console是在 控制台里
    console.log(b);
    mainWindow.send('sub-to-main',b);
})



ipcMain.on('main-to-sub',(a,payload)=>{
    if(payload.id!==undefined){
        let subWin = subWindosMaps[payload.id];
        if(subWin){
            subWin.send && subWin.send('main-to-sub',payload);
        }
    }else{
        for(var key in subWindosMaps){
            let subWin = subWindosMaps[key];
            if(subWin){
                subWin.send && subWin.send('main-to-sub',payload);
            }
        }
    }
    
})




app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
