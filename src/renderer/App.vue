<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'ele'
  }
</script>

<style lang="scss">
  /* CSS */
.toastWrapper{
    position:fixed;
    top:50%;
    width:100%;
    text-align: center;
    .content{
        background-color:rgba(0,0,0,0.5);
        color:white;
        vertical-align: top;
        padding:5px 15px;
        display: inline-block;
        border-radius: 4px;
    }
}
</style>
