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
        //console.log(res)
        var data = res.data
        //console.log(data)
        var j=0;
        for (var i = 0; i < data.length; i++) {
          var temp = data[i].time.split(' ');
          if (time == temp[0]) {
            photos[j] = 'https://face.3cat.top/' + data[i].path;
            j+=1;
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
          wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.writePhotosAlbum']) {
                wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success() {
                    // 用户已经同意小程序使用相册功能，后续调用 wx.saveImageToPhotosAlbum 接口不会弹窗询问
                    wx.saveImageToPhotosAlbum();

                  }
                })
              }
            }
          });
          wx.downloadFile({
            url: current, // 仅为示例，并非真实的资源
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success(res) {
                    wx.showToast({
                      title: '下载成功',
                    })
                  }
                })
              }
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