var app = getApp()
const api = require('../../utils/api.js');
var photos =[]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    photos: [],
    // windowWidth: app.systemInfo.windowWidth,
  },
  onLoad(options) {
    console.log(options.key)
    var that = this
    var time = options.key
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
        var data = res.data
        console.log(data)
        for (var i = 0; i < data.length; i++) {
          var temp = data[i].time.split(' ');
          if (time == temp[0]) {
            photos[i] = 'https://face.3cat.top/' + data[i].path;
          }
        }
        that.setData({
          photos: photos
        })
      },
      fail: e => {
        console.error(e)
      },
    });
  },
  previewImage2: function (e) {
    console.log(e)
    var current = photos[e.target.dataset.index];
    console.log(current)
    wx.previewImage({
      current: current,
      urls: this.data.photos,
    })
  },
  longpress: function (e) {
    var that = this;
    var index = [];
    index[0]=e.target.dataset.index;
    var current = photos[index[0]];
    console.log(current);
    wx.showActionSheet({
      itemList: ['下载图片至本地', '移除该图片'],
      success(res) {
        console.log(res)
        if(res.tapIndex == 0){
          wx.saveImageToPhotosAlbum({
            filePath:current,
            success(res) { 
              wx.showToast({
                title: '下载成功',
              })
            }
          })
        }
        if (res.tapIndex == 1){
          photos.splice(index,1);
          that.setData({
            photos: photos
          });
          wx.showToast({
            title: '删除成功',
          })  
          wx.request({
            url: 'https://face.3cat.top/client/picture/delete',
            method: 'POST',
            data: {
              delete_ids: index,
            },
            header: {
              "content-type": "application/x-www-form-urlencoded" 
            },
            success(res) {
              console.log(res) 
            },
            fail: e => {
              console.error(e)
            },
          });
        }
      }
    })
  },
})