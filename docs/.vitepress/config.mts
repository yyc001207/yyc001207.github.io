import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "开发技术文档",
  description: "前端与后端技术示例",
  lang: "zh-CN",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '前端', link: '/frontend/react-example' },
      { text: '后端', link: '/backend/nodejs-example' }
    ],

    sidebar: [
      {
        text: '前端',
        items: [
          { text: 'React 示例', link: '/frontend/react-example' },
          { text: 'Vue 示例', link: '/frontend/vue-example' }
        ]
      },
      {
        text: '后端',
        items: [
          { text: 'Node.js 示例', link: '/backend/nodejs-example' },
          { text: 'Python 示例', link: '/backend/python-example' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yyc001207/yyc001207.github.io' }
    ]
  }
})
