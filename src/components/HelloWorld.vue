<template>
  <div class="hello">
    <!-- <div class="amap-wrapper">
      <el-amap class="amap-box" :vid="'amap-vue'" :rotateEnable="true"></el-amap>
    </div> -->
    123123
    <div id="test">
      <test-solt ref="map" :markers="markers" :zoom="zoom" :top="-10" :viewMode="'2D'" @on-change="click" :model.sync="mapModel">
        <div slot="clearfix">
          <p>标题</p>
          <div>内容内容内容内容内容内容内容内容</div>
        </div>
      </test-solt>
    </div>
    <!-- <div id="container"></div> -->
  </div>
</template>

<script>
import testSolt from './AMap'

export default {
  name: 'HelloWorld',
  components: {
    testSolt
  },
  data() {
    return {
      markers: this.initAMapData(),
      zoom: 18,
      mapModel: false
    }
  },
  created() {
  },
  mounted() {
    console.log(this.$refs.map, 'mapmap')
    // let map = this.$refs.map.AMapMain()
    // map.on('click', (e) => {
    //   this.mapModel = false
    //   console.log(this.mapModel, 'mapModelmapModel')
    //   // console.log(e)
    //   // console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat())
    // })
  },
  methods: {
    initAMapData() {
      let list = []
      for (let i = 0; i < 10; i++) {
        let json = {}
        let lng = 113.38121
        let lat = 23.125786
        lng = Number((lng + 0.000228 * i).toFixed(6))
        json.id = i
        json.lng = lng
        json.lat = lat
        json.count = 20
        json.status = 'LH'
        list.push(json)
      }
      return list
    },
    click(data) {
      console.log(data, '222')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.amap-wrapper {
  width: 100%;
  height: 100vh;
}
#container {
  width: 100%;
  height: 100vh;
}
</style>
