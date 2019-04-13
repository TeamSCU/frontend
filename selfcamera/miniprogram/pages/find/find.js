var app = getApp()
var util = require('../../utils/util.js');
var photos = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos: [],
    pics: [],
    // windowWidth: app.systemInfo.windowWidth,
  },
  onLoad() {
    
  },
  /**
   * 选择照片
   */
  choose: function () {
    var that = this;
    var pics = that.data.pics;
    wx.chooseImage({
      count: 5 - pics.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          pics: tempFilePaths
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    this.setData({
      pics: pics
    });

  },
  /**
   * 上传照片
   */
  uploadImg: function () {
    var that = this
    var photoPath = null;
    /**
     * 加载图片
     */
    wx.showToast({
      title: '正在上传',
      icon: 'loading',
    });
    var time = (util.formatTime(new Date())).replace(/[^0-9]+/g, '');
    wx.uploadFile({
      url: 'https://face.3cat.top/client/upload',
      filePath: that.data.pics[0],
      name: app.globalData.openid + time,
      formData: {
        'account': app.globalData.openid
      },
      success: function (res) {
        console.log(res)
        if (res.data == '"没有检测到人脸"') {
          wx.showToast({
            title: '没有检测到人脸喔~(ノへ￣、)',
            icon: 'none',
          })
        }
        else {
          var data = JSON.parse(res.data)
          //console.log(res.data)
          for (var i = 0; i < data.length; i++) {
          photos[i] = 'https://face.3cat.top/' + data[i].path
          }
          that.setData({
            photos: photos
          });
        }
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  previewImage1: function (e) {
    console.log(e)
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.pics,
    })
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
})