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
  },
  onLoad() {
    var that = this
    wx.request({
      url: 'https://face.3cat.top/client/picture/camera',
      method: 'POST',
      data: {
        account: app.globalData.openid,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded" // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.length == 0) {
          wx.showToast({
            title: '相册还是空的喔~',
            icon: 'none',
          })
        }
        else {
          var data = res.data; 
          var temp2=[];
          for (var l = 0; l < data.length; l++) {
            var temp1 = data[l].time.split(' ');
            console.log(temp1);
            temp2[l] = temp1[0].replace(/[^0-9]/ig, "");
          }
          //排序
          for (var i = 0; i < data.length; i++) {
            for (var j = i + 1; j < data.length;j++){
              if(temp2[i]<temp2[j]){
                var t1=temp2[i];
                temp2[i] = temp2[j];
                temp2[j] = t1;
                var t2=data[i];
                data[i]=data[j];
                data[j]=t2;
              }
            }
          }
          console.log(data);
          photos[0] = 'https://face.3cat.top/' + data[0].path;
          var q = data[0].time.split(' ');
          times[0] = q[0];
          var f=0;
          for(var k=1;k<data.length;k++){
            if (temp2[k-1] != temp2[k]) {
                f += 1;
                q = data[k].time.split(' ');
                times[f] = q[0];
                photos[f] = 'https://face.3cat.top/' + data[k].path;
                //console.log(data[i].path)
              }
            }
          //console.log(times)
          that.setData({
            photos: photos,
            time: times
          });
        }
      }
    })
},
onShow(){
      if(photos==null){
        wx.showToast({
          title: '相册还是空的喔~',
          icon: 'none',
        })
      }
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
refresh:function(e){
    var that = this
    wx.request({
      url: 'https://face.3cat.top/client/picture/camera',
      method: 'POST',
      data: {
        account: app.globalData.openid,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded" // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.length == 0) {
          wx.showToast({
            title: '没有找到您的照片喔~',
            icon: 'none',
          })
        }
        else {
          var data = res.data;
          photos[0] = 'https://face.3cat.top/' + data[0].path;
          var temp = data[0].time.split(' ');
          times[0] = temp[0];
          var j = 0;
          for (var i = 1; i < data.length; i++) {
            var temp = data[i].time.split(' ');
            if (times[j] != temp[0]) {
              j += 1;
              times[j] = temp[0];
              photos[j] = 'https://face.3cat.top/' + data[i].path;
              console.log(data[i].path)
            }
          }
          //console.log(times)
          that.setData({
            photos: photos,
            time: times
          });
        }
      }
    })
  },
})