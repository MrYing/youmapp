import ProductChannel from '../../../channels/product';

const productChannel = new ProductChannel();
const pageSize = 10;
Page({
  page: 1,
  /**
   * 页面的初始数据
   */
  data: {
    productClassId: 0,
    productClassParentId: 0,
    categoryInfo: {},
    categoryData: [],
    productList: [],
    loadEnd: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const productClassId = parseInt(options.prod_classid) || 0;
    const productClassParentId = parseInt(options.prod_class_parentid) || 0;

    if (productClassId > 0 && productClassParentId > 0) {
      this.setData({ productClassId, productClassParentId });

      productChannel.getCategoryData().then(categoryData => {
        let subCategoryData = [];
        categoryData.some((item, index) => {
          if (item.id === productClassParentId) {
            subCategoryData = item.sub_class_list;
            return true;
          }
        });
        this.setData({ categoryData: subCategoryData });
      });

      productChannel.getProductClassInfo(productClassId).then(data => {
        if (data) {
          this.setData({ categoryInfo: data });
        }
      });

      this.loadData();
    }
  },
  loadData: function (more) {
    const { productClassId, loadEnd, productList } = this.data;
    if (more) {
      if (loadEnd === false) {
        wx.showLoading();

        this.page++;
        productChannel.getProductList(productClassId, 0, '', this.page, pageSize).then(data => {
          this.setData({
            productList: productList.concat(data),
            loadEnd: data.length === 0
          });

          wx.hideLoading();
        });
      }
    }
    else {
      wx.showLoading();

      this.page = 1;
      productChannel.getProductList(productClassId, 0, '', this.page, pageSize).then(data => {
        this.setData({
          productList: data,
          loadEnd: data.length === 0
        });

        wx.hideLoading();
      });
    }
  },
  onChangeTab: function (event) {
    const classId = parseInt(event.currentTarget.dataset.cateid);
    this.setData({ productClassId: classId });
    this.loadData();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadData(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})