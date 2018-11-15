<template lang="pug">
  .BMap
</template>
<script>
export default {
  name: 'BMap',
  data() {
    return {
      map: null
    }
  },
  created() {
    // this._initBMapScript()
  },
  mounted() {
    this._initBMapScript()
  },
  methods: {
    _initBMapScript() {
      const that = this
      const AK = 'Y8f6BSmnqIGFguUx4Y9Ax8uG4U8hSGZw'
      const BMap_URL = `http://api.map.baidu.com/getscript?v=2.0&ak=${AK}&services=&t=1542001494816`
      return new Promise((resolve, reject) => {
        // 插入script脚本
        if (document.getElementById('BMap') === null) {
          const scirpt = document.createElement('script')
          scirpt.id = 'BMap'
          scirpt.type = 'text/javascript'
          scirpt.src = BMap_URL
          document.body.appendChild(scirpt)
        }
        // 如果已加载直接返回
        console.log(window.BMap, '111')
        if (window.BMap) {
          console.log(window.BMap.BMap, '222')
          if (window.BMap.BMap) {
            that._initBMap()
          } else {
            window.BMap.addEventListener('load', () => {
              that._initBMap()
            }, 0)
            // window.BMap.onload = () => that._initBMap()
          }
          resolve(window.BMap)
        }
        // // 等待页面加载完毕回调
        // let timeout = 0
        // let interval = setInterval(() => {
        //   // 超时10秒加载失败
        //   if (timeout >= 20) {
        //     reject()
        //     clearInterval(interval)
        //     console.error('百度地图脚本初始化失败...')
        //   }
        //   // 加载成功
        //   if (typeof BMap !== 'undefined') {
        //     resolve(BMap)
        //     clearInterval(interval)
        //     that._initBMap()
        //     console.log('百度地图脚本初始化成功...----------')
        //   }
        //   timeout += 1
        // }, 500)
      })
    },
    _initBMap() {
      let map = new BMap.Map(this.$el)
      this.map = map
      let point = new BMap.Point(116.404, 39.915)
      map.centerAndZoom(point, 11)
      this.$emit('ready', {BMap, map})
    }
  }
}
</script>

<style lang="less" scoped>
.BMap {
  width: 100%;
  height: 100%;
}
</style>

<style lang="less">
// 屏蔽百度地图LOGO
.anchorBL {
  display: none;
}
</style>
