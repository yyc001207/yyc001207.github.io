import { defaultTheme } from 'vuepress'
import { backToTopPlugin } from '@vuepress/plugin-back-to-top'
import { searchPlugin } from '@vuepress/plugin-search'
import { clipboardPlugin } from 'vuepress-plugin-clipboard'
export default {
    dest: './dist',
    lang: 'zh-CN',
    locales: {
        "/": {
            lang: "zh-CN",
        },
    },
    title: '你好， VuePress ！',
    description: '这是我的第一个 VuePress 站点',
    plugins: [
        backToTopPlugin(),
        clipboardPlugin({
            // options ...
            staticIcon: true,//复制按钮是否设置为悬停时可见
            delay: 400, // 页面动画的延迟毫秒, 这会影响到渲染时的按钮生成
            color: "var(--c-brand)",//复制按钮的颜色, 可以使用任意的十六进制颜色代码
            backgroundTransition: true,// 点击复制按钮时是否启动过渡动画
            backgroundTransitionColor: "var(--c-brand)",//过渡动画背景颜色, 可以使用任意的十六进制颜色代码
            successText: '复制成功',//复制成功后的提示词
            successTextColor: "var(--c-brand-light)"//设置提示词的颜色, 可以使用任意的十六进制颜色代码

        }),
        searchPlugin({
            locales: {
                '/': {
                    placeholder: '搜索文档',
                },
            },
            // 配置项
            isSearchable: (page) => page.path !== '/',
        }),
    ],
    theme: defaultTheme({
        repo: 'https://gitee.com/yang-yechuang',
        docsRepo: 'https://gitee.com/yang-yechuang/yyc001207',
        docsBranch: 'master',
        docsDir: 'docs',
        editLinkPattern: ':repo/tree/:branch/:path',
        logo: '/logo.jpg',
        lastUpdatedText: '最后更新时间',
        editLinkText: '编辑此页',
        contributorsText: '贡献者',
        navbar: [
            {
                text: 'vue项目',
                children: [
                    {
                        text: '项目搭建',
                        children: [
                            '/pro/vue3.md/', '/pro/vue2.md'
                        ]
                    },
                ],
            },
            {
                text: '学习',
                children: [
                    {
                        text: '高级技术',
                        children: [
                            '/study/Promise.md',
                        ]
                    },
                ],
            },
        ],
        sidebar: {
            '/pro/': [
                {
                    text: '项目搭建',
                    collapsible: true,
                    children: ['/pro/vue3.md/', '/pro/vue2.md'],
                },
            ],
            '/study/': [
                {
                    text: '学习',
                    collapsible: true,
                    children: ['/study/Promise.md'],
                },
            ],
        },
    })
}
