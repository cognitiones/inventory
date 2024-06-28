import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'unibest',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
    "app-plus": {
      softInputMode: "adjustResize"
    }
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: {
    color: '#8a8a8a',
    selectedColor: '#1296db',
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        iconPath: 'static/tabbar/today.png',
        selectedIconPath: 'static/tabbar/today-select.png',
        pagePath: 'pages/index/index',
        text: '今天',
      },
      {
        iconPath: 'static/tabbar/date.png',
        selectedIconPath: 'static/tabbar/date-select.png',
        pagePath: 'pages/about/about',
        text: '日历',
      },
      {
        iconPath: 'static/tabbar/my.png',
        selectedIconPath: 'static/tabbar/my-select.png',
        pagePath: 'pages/my/index',
        text: '个人中心',
      },
    ],
  },
})
