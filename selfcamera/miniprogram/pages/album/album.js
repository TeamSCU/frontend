var app = getApp()
var times =[]
var photos = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos: [],
    time:[],
    number:[],
    // windowWidth: app.systemInfo.windowWidth,
  },
  onLoad() {
    var that = this
    wx.request({
      url: 'https://face.3cat.top/client/picture/camera', 
      method:'POST',
      data: {
        account: app.globalData.openid,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded" // 默认值
      },
      success(res) {
        console.log(res)
        var data = res.data
        photos[0] = 'https://face.3cat.top/' + data[0].path;
        var temp = data[0].time.split(' ');
        times[0] = temp[0];
        var j = 0;
        for (var i = 1; i < data.length; i++) {
          var temp = data[i].time.split(' ');
          if(times[j] != temp[0]){ 
            j += 1;
            photos[j] = 'https://face.3cat.top/' + data[i].path;
            //console.log(j)
          }
        }
        console.log(times)
        that.setData({
          photos: photos,
          time:times
        });
       }
    })
  },
  into: function (e) {
    console.log(e)
    var index = e.target.dataset.index
    var current = photos[index];
    console.log(current) 
    wx.navigateTo({
      url: '../photoslist/photoslist?key=' + times[index],
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
})