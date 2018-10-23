<template>
  <div class="mapBox" :style="{width: `${width <=0 ? '100%' : width < 101 ? `${width}%` : `${width}px`}`, height: `${height <=0 ? '100vh' : height < 101 ? `${height}vh` : `${height}px`}`}">
    <div id="container" :style="{width: `${width <=0 ? '100%' : width < 101 ? `${width}%` : `${width}px`}`, height: `${height <=0 ? '100vh' : height < 101 ? `${height}vh` : `${height}px`}`}"></div>
    <div id="marker" v-if="model" class="markerModelBox" :style="{left: `${markerW}px`, top: `${markerT + top}px`}">
      <div id="triangle" class="markerModelBox_Triangle"></div>
      <div class="markerModel_body">
        <slot name="clearfix">
          123
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import AMap from 'AMap'
// import gltf from '../assets/Duck.gltf'

export default {
  props: {
    markers: Array,
    zoom: {
      default: 16,
      type: Number
    },
    width: {
      default: 100,
      type: Number
    },
    height: {
      default: 100,
      type: Number
    },
    top: {
      default: 0,
      type: Number
    },
    viewMode: {
      default: '2D',
      type: String
    }
  },
  data() {
    return {
      map: null,
      object3Dlayer: null, // 3dObj
      mapMarkers: [], // marker集合
      cluster: [],
      markerModel: false, // markerWindow
      model: false,
      markerWindow: null,
      markerW: 0,
      markerT: 0,
      heatmap: null, // 热力
      iconlist: [{
        status: 'LH',
        icon: 'assets/lampIcon/on-'
      }, {
        status: 'E',
        icon: '@/assets/lampIcon/error-'
      }, {
        status: 'C',
        icon: '@/assets/lampIcon/off-'
      }, {
        status: 'WL',
        icon: '@/assets/lampIcon/warnOn-'
      }, {
        status: 'WO',
        icon: '@/assets/lampIcon/warnOff-'
      }, {
        status: 'IN',
        icon: '@/assets/lampIcon/install-'
      }],
      iconOffset: [{
        size: 18,
        pixel: {
          x: -30,
          y: -65
        }
      }, {
        size: 17,
        pixel: {
          x: -25,
          y: -57
        }
      }, {
        size: 16,
        pixel: {
          x: -20,
          y: -38
        }
      }, {
        size: 10,
        pixel: {
          x: 0,
          y: -6
        }
      }],
      test: 16
    }
  },
  created() {
    console.log(this.markers, '重加载')
  },
  watch: {
    zoom: function(val, oldVal) {
      this.map.setZoom(val)
    }
  },
  mounted() {
    this._initAMap()
  },
  methods: {
    _initAMap() {
      let _this = this
      let map = new AMap.Map('container', {
        center: [113.380755, 23.125649],
        zoom: this.zoom,
        pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
        viewMode: this.viewMode
      })
      _this.map = map
      map.setMapStyle('amap://styles/8526441dd2230be94aa668c405a12a3b')
      console.log(this.markers, 'markers')
      if (this.viewMode === '2D') {
        // 添加覆盖物
        this.markers.forEach((item, i) => {
          let marker = new AMap.Marker({
            position: [item.lng, item.lat]
          })
          marker.setIcon(_this.markSetIcon(marker, item.status))
          map.add(marker)
          marker.data = item
          this.mapMarkers.push(marker)
          marker.on('click', (e) => {
            this.markerWindow = marker
            this.markerSition()
          })
        })
        // 添加热力图
        var heatmap = this.heatmap
        map.plugin(['AMap.Heatmap'], function() {
          // 初始化heatmap对象
          heatmap = new AMap.Heatmap(map, {
            radius: 5, // 给定半径
            gradient: {
              0: 'rgb(174,255,1)',
              0.25: 'rgb(174,68,52)',
              0.5: 'rgb(216,128,88)',
              0.75: 'rgb(230,209,140)',
              1: 'rgb(248,241,169)'
            }
          })
          heatmap.setDataSet({
            data: _this.markers,
            max: 100
          })
        })
        heatmap.hide()
        // 添加聚合组件
        map.plugin(['AMap.MarkerClusterer'], function() {
          // this.cluster = new AMap.MarkerClusterer(map, _this.mapMarkers, {gridSize: 80})
          // this.cluster.setMap(null)
          console.log(_this.mapMarkers, 'marker')
          // cluster = new AMap.MarkerClusterer(
          //   map, // 地图实例
          //   _this.mapMarkers, // 海量点组成的数组
          //   {
          //     gridSize: 80,
          //     renderCluserMarker: _this._renderCluserMarker
          //   }
          // )
        })
      } else {
        map.plugin(['AMap.ControlBar'], function() {
          var controlBar = new AMap.ControlBar({
            showZoomBar: false,
            showControlButton: true,
            position: {
              right: '10px',
              top: '10px'
            }
          })
          map.addControl(controlBar)
        })
        var object3Dlayer = new AMap.Object3DLayer()
        this.object3Dlayer = object3Dlayer
        map.add(object3Dlayer)
        map.plugin(['AMap.GltfLoader'], function() {
          var urlDuck = 'https://a.amap.com/jsapi_demos/static/gltf/Duck.gltf'
          // var urlDuck = 'https://a.amap.com/jsapi_demos/static/gltf/DuckCM.png'
          // var urlDuck = '../assets/test.gltf'
          var gltfObj = new AMap.GltfLoader()
          let tempList = []
          console.log(_this.markers, 'markersmarkersmarkers')
          for (const item of _this.markers) {
            gltfObj.load(urlDuck, (gltfDuck) => {
              let temp = {
                position: new AMap.LngLat(item.lng, item.lat),
                scale: 30,
                height: 0,
                scene: 0
              }
              gltfDuck.setOption(temp)
              gltfDuck.rotateX(90)
              gltfDuck.rotateZ(-20)
              object3Dlayer.add(gltfDuck)
              gltfDuck.data = item
              tempList.push(gltfDuck)
            })
          }
          _this.mapMarkers = tempList
        })
      }
      map.on('click', (e) => {
        if (this.viewMode === '2D') {
          this.model = false
          this.$emit('on-change', e)
        }
      })
      // 更新markerModel的位置
      map.on('moveend', (e) => {
        if (this.viewMode === '2D') {
          if (this.model) this.markerSition()
        }
      })
      // 缩放处理marker
      map.on('zoomend', (e) => {
        let zoom = this.map.getZoom()
        console.log(zoom, 'zoom')
        if (zoom > 15) {
          this.mapMarkers.forEach((item, i) => {
            item.show()
            item.setIcon(this.markSetIcon(item, item.data.status))
          })
          heatmap.hide()
        } else if (zoom < 16) {
          this.mapMarkers.forEach((item, i) => {
            item.hide()
          })
          console.log(this.mapMarkers, 'mapMarkers')
          heatmap.show()
        }
      })
    },
    AMapMain() {
      return this.map
    },
    _renderCluserMarker(context) {
      // var factor = Math.pow(context.count / count, 1 / 18)
      // var div = document.createElement('div')
      // var Hue = 180 - factor * 180
      // var bgColor = 'hsla(' + Hue +',100%,50%,0.7)'
      // var fontColor = 'hsla(' + Hue +',100%,20%,1)'
      // var borderColor = 'hsla(' + Hue +',100%,40%,1)'
      // var shadowColor = 'hsla(' + Hue +',100%,50%,1)'
      // div.style.backgroundColor = bgColor
      // var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
      // div.style.width = div.style.height = size + 'px'
      // div.style.border = 'solid 1px ' + borderColor
      // div.style.borderRadius = size / 2 + 'px'
      // div.style.boxShadow = '0 0 1px ' + shadowColor
      // div.innerHTML = context.count
      // div.style.lineHeight = size + 'px'
      // div.style.color = fontColor
      // div.style.fontSize = '14px'
      // div.style.textAlign = 'center'
      // context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      // context.marker.setContent(div)
    },
    // 修改gltf状态参数
    setMarker(id, value) {
      let _this = this
      this.mapMarkers.forEach((item, i) => {
        if (id === item.data.id) {
          var gltfObj = new AMap.GltfLoader()
          var urlDuck = 'https://a.amap.com/jsapi_demos/static/gltf-online/shanghai/scene.gltf'
          let json = null
          _this.object3Dlayer.remove(item)
          gltfObj.load(urlDuck, (gltfDuck) => {
            let temp = {
              position: new AMap.LngLat(item.data.lng, item.data.lat),
              scale: 30,
              height: 0,
              scene: 0
            }
            gltfDuck.setOption(temp)
            gltfDuck.rotateX(90)
            gltfDuck.rotateZ(-20)
            _this.object3Dlayer.add(gltfDuck)
            json = gltfDuck
            json.data = item.data
            item = json
          })
        }
      })
    },
    /*
      markicon切换
    */
    markSetIcon(data, status, click) {
      let url = null
      let size = null
      let zoom = this.map.getZoom()
      if (zoom > 17) {
        size = 18
      } else if (zoom === 17) {
        size = 17
      } else if (zoom === 16) {
        size = 16
      } else if (zoom === 15) {
        size = 10
      }
      for (const item of this.iconOffset) {
        if (size === item.size) {
          data.setOffset(item.pixel)
        }
      }
      for (const item of this.iconlist) {
        if (item.status === status) {
          if (click) {
            url = `${item.icon}click-${size}.png`
          } else {
            url = `${item.icon}${size}.png`
          }
        }
      }
      return require(`@/${url}`)
    },
    // markWindow像素坐标处理
    markerSition() {
      if (this.markerWindow) {
        // this.$emit('update:model', true)
        this.model = true
        this.$nextTick(() => {
          let markerDom = this.map.lnglatTocontainer([this.markerWindow.getPosition().lng, this.markerWindow.getPosition().lat])
          let markerBoxW = document.getElementById('marker').getBoundingClientRect().width
          let markerBoxH = document.getElementById('marker').getBoundingClientRect().height
          let triangleH = document.getElementById('triangle').getBoundingClientRect().height
          this.markerW = markerDom.x - markerBoxW / 2
          this.markerT = markerDom.y - markerBoxH - triangleH - 20
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .mapBox {
    position: relative;
    overflow: hidden;
  }
  #container {
    width: 100%;
    height: 100vh;
  }
  .markerModelBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 400px;
    height: 250px;
    background: #fdfdfd;
    border-radius: 2px;
    box-shadow: 0px 0px 2px 2px #d4d4d4;
    .markerModel_main {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .markerModelBox_Triangle {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -21px;
      margin: 0 auto;
      height: 0px;
      width: 0px;
      background: transparent;
      border-top: 21px solid transparent;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top-color: #fdfdfd;
    }
  }
</style>
