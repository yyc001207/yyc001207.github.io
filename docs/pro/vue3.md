---

---
# vue3模板项目搭建

## 一、前言

### 1.1 项目初始化

从 0 开始搭建一个 vue3 模板项目。一个项目要有统一的规范，需要使用 eslint+stylelint+prettier 来对我们的代码质量做检测和修复，需要使用 husky 来做 commit 拦截，需要使用 commitlint 来统一提交规范，需要使用 preinstall 来统一包管理工具。

下面我们就用这一套规范来初始化我们的项目，集成一个规范的模版。

本文参考：[参考文档](https://docs.spicyboy.cn/)

[Geeker Admin](https://github.com/HalseySpicy/Geeker-Admin) 一款基于 Vue3.3、TypeScript、Vite3、Pinia、Element-Plus 开源的后台管理框架，使用目前最新技术栈开发。项目提供强大的 [ProTable](https://docs.spicyboy.cn/components/proTable.html) 组件，在一定程度上节省您的开发效率。另外本项目还封装了一些常用组件、hooks、指令、动态路由、按钮级别权限控制等功能。

### 1.2 环境准备

- node v16.x
- pnpm 8.6.2
- vscode

## 二、项目配置

### 2.1 限制包管理器及版本

```json
	"scripts": {
		"preinstall": "npx only-allow pnpm"
	},
		"engines": {
		"node": ">=16.x",
		"pnpm": ">=8.6.2"
	}
```

### 2.2 代码格式化工具（Prettier）

#### 2.2.1 下载 prettier 相关依赖：

```sh
pnpm install prettier -D
```

#### 2.2.2 安装 Vscode 插件（Prettier）

#### 2.2.3 配置 Prettier

新建.prettierrc.cjs

```js
// @see: https://www.prettier.cn

module.exports = {
  // 指定最大换行长度
  printWidth: 130,
  // 缩进制表符宽度 | 空格数
  tabWidth: 2,
  // 使用制表符而不是空格缩进行 (true：制表符，false：空格)
  useTabs: false,
  // 结尾不用分号 (true：有，false：没有)
  semi: false,
  // 使用单引号 (true：单引号，false：双引号)
  singleQuote: false,
  // 在对象字面量中决定是否将属性名用引号括起来 可选值 "<as-needed|consistent|preserve>"
  quoteProps: "as-needed",
  // 在JSX中使用单引号而不是双引号 (true：单引号，false：双引号)
  jsxSingleQuote: false,
  // 多行时尽可能打印尾随逗号 可选值"<none|es5|all>"
  trailingComma: "none",
  // 在对象，数组括号与文字之间加空格 "{ foo: bar }" (true：有，false：没有)
  bracketSpacing: true,
  // 将 > 多行元素放在最后一行的末尾，而不是单独放在下一行 (true：放末尾，false：单独一行)
  bracketSameLine: false,
  // (x) => {} 箭头函数参数只有一个时是否要有小括号 (avoid：省略括号，always：不省略括号)
  arrowParens: "avoid",
  // 指定要使用的解析器，不需要写文件开头的 @prettier
  requirePragma: false,
  // 可以在文件顶部插入一个特殊标记，指定该文件已使用 Prettier 格式化
  insertPragma: false,
  // 用于控制文本是否应该被换行以及如何进行换行
  proseWrap: "preserve",
  // 在html中空格是否是敏感的 "css" - 遵守 CSS 显示属性的默认值， "strict" - 空格被认为是敏感的 ，"ignore" - 空格被认为是不敏感的
  htmlWhitespaceSensitivity: "css",
  // 控制在 Vue 单文件组件中 <script> 和 <style> 标签内的代码缩进方式
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf 结尾是 可选值 "<auto|lf|crlf|cr>"
  endOfLine: "auto",
  // 这两个选项可用于格式化以给定字符偏移量（分别包括和不包括）开始和结束的代码 (rangeStart：开始，rangeEnd：结束)
  rangeStart: 0,
  rangeEnd: Infinity
}
```

新建忽略检查配置文件.prettierignore

```
/dist/*
.local
/node_modules/**

**/*.svg
**/*.sh

/public/*
stats.html

```

### 2.3 代码规范工具（ESLint）

| 依赖                             | 作用描述                                                             |
| -------------------------------- | -------------------------------------------------------------------- |
| eslint                           | ESLint 核心库                                                        |
| eslint-config-prettier           | 关掉所有和 Prettier 冲突的 ESLint 的配置                             |
| eslint-plugin-prettier           | 将 Prettier 的 rules 以插件的形式加入到 ESLint 里面                  |
| eslint-plugin-vue                | 为 Vue 使用 ESlint 的插件                                            |
| @typescript-eslint/eslint-plugin | ESLint 插件，包含了各类定义好的检测 TypeScript 代码的规范            |
| @typescript-eslint/parser        | ESLint 的解析器，用于解析 TypeScript，从而检查和规范 TypeScript 代码 |

#### 2.2.1 下载相关依赖

```sh
pnpm install eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
```

#### 2.2.1 安装 Vscode 插件（ESLint)

#### 2.2.3 配置 ESLint（.eslintrc.cjs）

```js
// @see: http://eslint.cn

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // 指定如何解析语法
  parser: "vue-eslint-parser",
  // 优先级低于 parse 的语法解析配置
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true
    }
  },
  // 继承某些已有的规则
  extends: ["plugin:vue/vue3-recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  /**
   * "off" 或 0    ==>  关闭规则
   * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
   * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
   */
  rules: {
    // eslint (http://eslint.cn/docs/rules)
    "no-var": "error", // 要求使用 let 或 const 而不是 var
    "no-multiple-empty-lines": ["error", { max: 1 }], // 不允许多个空行
    "prefer-const": "off", // 使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
    "no-use-before-define": "off", // 禁止在 函数/类/变量 定义之前使用它们

    // typeScript (https://typescript-eslint.io/rules)
    "@typescript-eslint/no-unused-vars": "error", // 禁止定义未使用的变量
    "@typescript-eslint/prefer-ts-expect-error": "error", // 禁止使用 @ts-ignore
    "@typescript-eslint/ban-ts-comment": "error", // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
    "@typescript-eslint/no-inferrable-types": "off", // 可以轻松推断的显式类型可能会增加不必要的冗长
    "@typescript-eslint/no-namespace": "off", // 禁止使用自定义 TypeScript 模块和命名空间
    "@typescript-eslint/no-explicit-any": "off", // 禁止使用 any 类型
    "@typescript-eslint/ban-types": "off", // 禁止使用特定类型
    "@typescript-eslint/no-var-requires": "off", // 允许使用 require() 函数导入模块
    "@typescript-eslint/no-empty-function": "off", // 禁止空函数
    "@typescript-eslint/no-non-null-assertion": "off", // 不允许使用后缀运算符的非空断言(!)

    // vue (https://eslint.vuejs.org/rules)
    "vue/script-setup-uses-vars": "error", // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效
    "vue/v-slot-style": "error", // 强制执行 v-slot 指令样式
    "vue/no-mutating-props": "error", // 不允许改变组件 prop
    "vue/custom-event-name-casing": "error", // 为自定义事件名称强制使用特定大小写
    "vue/html-closing-bracket-newline": "error", // 在标签的右括号之前要求或禁止换行
    "vue/attribute-hyphenation": "error", // 对模板中的自定义组件强制执行属性命名样式：my-prop="prop"
    "vue/attributes-order": "off", // vue api使用顺序，强制执行属性顺序
    "vue/no-v-html": "off", // 禁止使用 v-html
    "vue/require-default-prop": "off", // 此规则要求为每个 prop 为必填时，必须提供默认值
    "vue/multi-word-component-names": "off" // 要求组件名称始终为 “-” 链接的单词
  }
}
```

#### 2.2.4 忽略 eslint 检查(.eslintignore)

```
*.sh
node_modules
*.md
*.woff
*.ttf
.vscode
.idea
dist
/public
/docs
.husky
.local
/bin
/src/mock/*
stats.html

```

### 2.4 样式规范工具（StyleLint）

| 依赖                              | 作用描述                                                                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| stylelint                         | stylelint 核心库                                                                                                                                 |
| stylelint-config-html             | Stylelint 的可共享 HTML（和类似 HTML）配置，捆绑 postcss-html 并对其进行配置。                                                                   |
| stylelint-config-recommended-scss | 扩展 stylelint-config-recommended 共享配置，并为 SCSS 配置其规则                                                                                 |
| stylelint-config-recommended-vue  | 扩展 stylelint-config-recommended 共享配置，并为 Vue 配置其规则                                                                                  |
| stylelint-config-standard         | 打开额外的规则来执行在规范和一些 CSS 样式指南中发现的通用约定，包括：惯用 CSS 原则，谷歌的 CSS 样式指南，Airbnb 的样式指南，和 @mdo 的代码指南。 |
| stylelint-config-standard-scss    | 扩展 stylelint-config-standard 共享配置，并为 SCSS 配置其规则                                                                                    |
| stylelint-config-recess-order     | 属性的排序（插件包）                                                                                                                             |
| postcss                           | postcss-html 的依赖包                                                                                                                            |
| postcss-html                      | 用于解析 HTML（和类似 HTML）的 PostCSS 语法                                                                                                      |

#### 2.4.1StyleLint 相关依赖

```sh
pnpm install stylelint stylelint-config-html stylelint-config-recommended-scss stylelint-config-recommended-vue stylelint-config-standard stylelint-config-standard-scss stylelint-config-recess-order postcss postcss-html -D
```

#### 2.4.2 安装 Vscode 插件（StyleLint）

#### 2.4.3 在目录的 .vscode 文件夹下新建 settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  },
  "stylelint.enable": true,
  "stylelint.validate": ["css", "less", "postcss", "scss", "vue", "sass", "html"],
  "files.eol": "\n"
}
```

#### 2.4.4 配置 StyleLint（.stylelintrc.cjs）

```js
// @see: https://stylelint.io

module.exports = {
  root: true,
  // 继承某些已有的规则
  extends: [
    "stylelint-config-standard", // 配置 stylelint 拓展插件
    "stylelint-config-html/vue", // 配置 vue 中 template 样式格式化
    "stylelint-config-standard-scss", // 配置 stylelint scss 插件
    "stylelint-config-recommended-vue/scss", // 配置 vue 中 scss 样式格式化
    "stylelint-config-recess-order" // 配置 stylelint css 属性书写顺序插件,
  ],
  overrides: [
    // 扫描 .vue/html 文件中的 <style> 标签内的样式
    {
      files: ["**/*.{vue,html}"],
      customSyntax: "postcss-html"
    }
  ],
  rules: {
    "function-url-quotes": "always", // URL 的引号 "always(必须加上引号)"|"never(没有引号)"
    "color-hex-length": "long", // 指定 16 进制颜色的简写或扩写 "short(16进制简写)"|"long(16进制扩写)"
    "rule-empty-line-before": "never", // 要求或禁止在规则之前的空行 "always(规则之前必须始终有一个空行)"|"never(规则前绝不能有空行)"|"always-multi-line(多行规则之前必须始终有一个空行)"|"never-multi-line(多行规则之前绝不能有空行)"
    "font-family-no-missing-generic-family-keyword": null, // 禁止在字体族名称列表中缺少通用字体族关键字
    "scss/at-import-partial-extension": null, // 解决不能使用 @import 引入 scss 文件
    "property-no-unknown": null, // 禁止未知的属性
    "no-empty-source": null, // 禁止空源码
    "selector-class-pattern": null, // 强制选择器类名的格式
    "value-no-vendor-prefix": null, // 关闭 vendor-prefix (为了解决多行省略 -webkit-box)
    "no-descending-specificity": null, // 不允许较低特异性的选择器出现在覆盖较高特异性的选择器
    "value-keyword-case": null, // 解决在 scss 中使用 v-bind 大写单词报错
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global", "v-deep", "deep"]
      }
    ]
  },
  ignoreFiles: ["**/*.js", "**/*.jsx", "**/*.tsx", "**/*.ts"]
}
```

#### 2.4.5 忽略 StyleLint 检查(.stylelintignore)

```
/dist/*
/public/*
public/*
stats.html

```

### 2.5EditorConfig 配置

#### 2.5.1 简介

- **EditorConfig** 帮助开发人员在 **不同的编辑器** 和 **IDE** 之间定义和维护一致的编码样式。

#### 2.5.2 安装 VsCode 插件（EditorConfig ）

### 2.5.3 配置 EditorConfig（.editorconfig）

```
# @see: http://editorconfig.org

root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
end_of_line = lf # 控制换行类型(lf | cr | crlf)
insert_final_newline = true # 始终在文件末尾插入一个新行
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
max_line_length = 130 # 最大行长度

[*.md] # 表示仅对 md 文件适用以下规则
max_line_length = off # 关闭最大行长度限制
trim_trailing_whitespace = false # 关闭末尾空格修剪
```

## 三、Git 流程规范配置

| 依赖                            | 作用描述                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| husky                           | 操作**git** 钩子的工具（在 **git xx** 之前执行某些命令）                    |
| lint-staged                     | 在提交之前进行**eslint** 校验，并使用 **prettier** 格式化本地暂存区的代码， |
| @commitlint/cli                 | 校验**git commit** 信息是否符合规范，保证团队的一致性                             |
| @commitlint/config-conventional | **Anglar** 的提交规范                                                             |
| czg                             | 交互式命令行工具生成标准化的 git commit message                                         |
| cz-git                          | 一款工程性更强，轻量级，高度自定义，标准输出格式的**commitize** 适配器            |

### 3.1husky（操作 git 钩子的工具）

安装

```sh
pnpm install husky -D
```

使用

```sh
# 编辑 package.json > prepare 脚本并运行一次

pnpm set-script prepare "husky install"
pnpm prepare
```

### 3.2 lint-staged（本地暂存代码检查工具）

安装

```sh
pnpm install lint-staged --D
```

> **添加 ESlint Hook（在.husky 文件夹下添加 pre-commit 文件）：**

> **作用：通过钩子函数，判断提交的代码是否符合规范，并使用 prettier 格式化代码**

```shell
npx husky add .husky/pre-commit "pnpm run lint:lint-staged"
```

> 新增 **lint-staged.config.cjs** 文件：

```js
module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "{!(package)*.json,*.code-snippets,.!(browserslist)*rc}": ["prettier --write--parser json"],
  "package.json": ["prettier --write"],
  "*.vue": ["eslint --fix", "prettier --write", "stylelint --fix"],
  "*.{scss,less,styl,html}": ["stylelint --fix", "prettier --write"],
  "*.md": ["prettier --write"]
}
```

### 3.3commitlint（commit 信息校验工具，不符合则报错）

> **安装：**

```sh
pnpm install @commitlint/cli @commitlint/config-conventional -D
```

> **配置命令（在.husky 文件夹下添加 commit-msg 文件）：**

```sh
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

### 3.4commitizen（基于 Node.js 的 git commit 命令行工具，生成标准化的 message）

```sh
// 安装 czg，如此一来可以快速使用 czg 命令进行启动。
pnpm install czg -D
```

### 3.5cz-git

> **指定提交文字规范，一款工程性更强，高度自定义，标准输出格式的 commitizen 适配器**

```sh
pnpm install cz-git -D
```

> **配置 package.json：**

```json
"config": {
  "commitizen": {
    "path": "node_modules/cz-git"
  }
}
```

> **新建 commitlint.config.js 文件：**

```js
// @see: https://cz-git.qbenben.com/zh/guide
const fs = require("fs")
const path = require("path")

const scopes = fs
  .readdirSync(path.resolve(__dirname, "src"), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name.replace(/s$/, ""))

/** @type {import('cz-git').UserConfig} */
module.exports = {
  ignores: [commit => commit.includes("init")],
  extends: ["@commitlint/config-conventional"],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 108],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "subject-case": [0],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
        "wip",
        "workflow",
        "types",
        "release"
      ]
    ]
  },
  prompt: {
    messages: {
      type: "Select the type of change that you're committing:",
      scope: "Denote the SCOPE of this change (optional):",
      customScope: "Denote the SCOPE of this change:",
      subject: "Write a SHORT, IMPERATIVE tense description of the change:\n",
      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixsSelect: "Select the ISSUES type of changeList by this change (optional):",
      customFooterPrefixs: "Input ISSUES prefix:",
      footer: "List any ISSUES by this change. E.g.: #31, #34:\n",
      confirmCommit: "Are you sure you want to proceed with the commit above?"
      // 中文版
      // type: "选择你要提交的类型 :",
      // scope: "选择一个提交范围（可选）:",
      // customScope: "请输入自定义的提交范围 :",
      // subject: "填写简短精炼的变更描述 :\n",
      // body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      // breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      // footerPrefixsSelect: "选择关联issue前缀（可选）:",
      // customFooterPrefixs: "输入自定义issue前缀 :",
      // footer: "列举关联issue (可选) 例如: #31, #I3244 :\n",
      // confirmCommit: "是否提交或修改commit ?"
    },
    types: [
      {
        value: "feat",
        name: "feat:     🚀  A new feature",
        emoji: "🚀"
      },
      {
        value: "fix",
        name: "fix:      🧩  A bug fix",
        emoji: "🧩"
      },
      {
        value: "docs",
        name: "docs:     📚  Documentation only changes",
        emoji: "📚"
      },
      {
        value: "style",
        name: "style:    🎨  Changes that do not affect the meaning of the code",
        emoji: "🎨"
      },
      {
        value: "refactor",
        name: "refactor: ♻️   A code change that neither fixes a bug nor adds a feature",
        emoji: "♻️"
      },
      {
        value: "perf",
        name: "perf:     ⚡️  A code change that improves performance",
        emoji: "⚡️"
      },
      {
        value: "test",
        name: "test:     ✅  Adding missing tests or correcting existing tests",
        emoji: "✅"
      },
      {
        value: "build",
        name: "build:    📦️   Changes that affect the build system or external dependencies",
        emoji: "📦️"
      },
      {
        value: "ci",
        name: "ci:       🎡  Changes to our CI configuration files and scripts",
        emoji: "🎡"
      },
      {
        value: "chore",
        name: "chore:    🔨  Other changes that don't modify src or test files",
        emoji: "🔨"
      },
      {
        value: "revert",
        name: "revert:   ⏪️  Reverts a previous commit",
        emoji: "⏪️"
      },
      {
        value: "wip",
        name: "wip:      🕔  work in process",
        emoji: "🕔"
      },
      {
        value: "workflow",
        name: "workflow: 📋  workflow improvements",
        emoji: "📋"
      },
      {
        value: "type",
        name: "type:     🔰  type definition file changes",
        emoji: "🔰"
      }
      // 中文版
      // { value: "feat", name: "特性:   🚀  新增功能", emoji: "🚀" },
      // { value: "fix", name: "修复:   🧩  修复缺陷", emoji: "🧩" },
      // { value: "docs", name: "文档:   📚  文档变更", emoji: "📚" },
      // { value: "style", name: "格式:   🎨  代码格式（不影响功能，例如空格、分号等格式修正）", emoji: "🎨" },
      // { value: "refactor", name: "重构:   ♻️  代码重构（不包括 bug 修复、功能新增）", emoji: "♻️" },
      // { value: "perf", name: "性能:    ⚡️  性能优化", emoji: "⚡️" },
      // { value: "test", name: "测试:   ✅  添加疏漏测试或已有测试改动", emoji: "✅" },
      // { value: "build", name: "构建:   📦️  构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）", emoji: "📦️" },
      // { value: "ci", name: "集成:   🎡  修改 CI 配置、脚本", emoji: "🎡" },
      // { value: "chore", name: "回退:   ⏪️  回滚 commit", emoji: "⏪️" },
      // { value: "revert", name: "其他:   🔨  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）", emoji: "🔨" },
      // { value: "wip", name: "开发:   🕔  正在开发中", emoji: "🕔" },
      // { value: "workflow", name: "工作流:   📋  工作流程改进", emoji: "📋" },
      // { value: "types", name: "类型:   🔰  类型定义文件修改", emoji: "🔰" }
    ],
    useEmoji: true,
    scopes: [...scopes],
    customScopesAlign: "bottom",
    emptyScopesAlias: "empty",
    customScopesAlias: "custom",
    allowBreakingChanges: ["feat", "fix"]
  }
}
```

## 四、配置 package.json 命令

```json
{
  "scripts": {
    // 本地运行(dev环境)
    "dev": "vite",
    // 本地运行(dev环境)
    "serve": "vite",
    // 构建打包(dev环境)
    "build:dev": "vue-tsc && vite build --mode development",
    // 构建打包(test环境)
    "build:test": "vue-tsc && vite build --mode test",
    // 构建打包(pro环境)
    "build:pro": "vue-tsc && vite build --mode production",
    // 检查项目 ts 类型
    "type:check": "vue-tsc --noEmit --skipLibCheck",
    // 本地环境预览构建后的 dist
    "preview": "npm run build:dev && vite preview",
    // 执行 eslint 校验
    "lint:eslint": "eslint --fix --ext .js,.ts,.vue ./src",
    // 执行 prettier 格式化
    "lint:prettier": "prettier --write \"src/**/*.{js,ts,json,tsx,css,less,scss,vue,html,md}\"",
    // 执行 stylelint 格式化
    "lint:stylelint": "stylelint --cache --fix \"**/*.{vue,less,postcss,css,scss}\" --cache --cache-location node_modules/.cache/stylelint/",
    // 执行 lint-staged.config.js 文件下的命令
    "lint:lint-staged": "lint-staged",
    // 初始化 husky 配置
    "prepare": "husky install",
    // 自动更新版本
    "release": "standard-version",
    // 提交代码(可自定义配置执行命令)
    "commit": "git add -A && czg && git push",
    "preinstall": "npx only-allow pnpm"
  }
}
```

## 五、项目集成

### 1.src别名的配置

在开发项目的时候文件与文件关系可能很复杂，因此我们需要给src文件夹配置一个别名！！！

```typescript
// vite.config.ts
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
        }
    }
})
```

**TypeScript 编译配置**

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": { //路径映射，相对于baseUrl
      "@/*": ["src/*"] 
    }
  }
}
```

### 2.环境变量的配置

**项目开发过程中，至少会经历开发环境、测试环境和生产环境(即正式环境)三个阶段。不同阶段请求的状态(如接口地址等)不尽相同，若手动切换接口地址是相当繁琐且易出错的。于是环境变量配置的需求就应运而生，我们只需做简单的配置，把环境状态切换的工作交给代码。**

开发环境（development）
顾名思义，开发使用的环境，每位开发人员在自己的dev分支上干活，开发到一定程度，同事会合并代码，进行联调。

测试环境（testing）
测试同事干活的环境啦，一般会由测试同事自己来部署，然后在此环境进行测试

生产环境（production）
生产环境是指正式提供对外服务的，一般会关掉错误报告，打开错误日志。(正式提供给客户使用的环境。)

注意:一般情况下，一个环境对应一台服务器,也有的公司开发与测试环境是一台服务器！！！

项目根目录分别添加 开发、生产和测试环境的文件!

```
.env.development
.env.production
.env.test
```

文件内容

```
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'development'
VITE_APP_TITLE = '开发'
VITE_APP_BASE_API = '/dev-api'
```

```
NODE_ENV = 'production'
VITE_APP_TITLE = '生产'
VITE_APP_BASE_API = '/prod-api'
```

```
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'test'
VITE_APP_TITLE = '测试'
VITE_APP_BASE_API = '/test-api'
```

配置运行命令：package.json

```json
 "scripts": {
    "dev": "vite --open",
    "build:test": "vue-tsc && vite build --mode test",
    "build:pro": "vue-tsc && vite build --mode production",
    "preview": "vite preview"
  },
```

通过import.meta.env获取环境变量

### 3.SVG图标配置

在开发项目的时候经常会用到svg矢量图,而且我们使用SVG以后，页面上加载的不再是图片资源,

这对页面性能来说是个很大的提升，而且我们SVG文件比img要小的很多，放在项目中几乎不占用资源。

**安装SVG依赖插件**

```
pnpm install vite-plugin-svg-icons -D
```

**在 `vite.config.ts`中配置插件**

```typescript
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
export default () => {
  return {
    plugins: [
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
  }
}
```

**入口文件导入**

```
import 'virtual:svg-icons-register'
```

#### 3.1.svg封装为全局组件

因为项目很多模块需要使用图标,因此把它封装为全局组件！！！

**在src/components目录下创建一个SvgIcon组件:代表如下**

```vue
<template>
  <div>
    <svg :style="{ width: width, height: height }">
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  //xlink:href属性值的前缀
  prefix: {
    type: String,
    default: '#icon-'
  },
  //svg矢量图的名字
  name: String,
  //svg图标的颜色
  color: {
    type: String,
    default: ""
  },
  //svg宽度
  width: {
    type: String,
    default: '16px'
  },
  //svg高度
  height: {
    type: String,
    default: '16px'
  }

})
</script>
<style scoped></style>
```

在src文件夹目录下创建一个index.ts文件：用于注册components文件夹内部全部全局组件！！！

```typescript
import SvgIcon from './SvgIcon/index.vue';
import type { App, Component } from 'vue';
const components: { [name: string]: Component } = { SvgIcon };
export default {
    install(app: App) {
        Object.keys(components).forEach((key: string) => {
            app.component(key, components[key]);
        })
    }
}
```

在入口文件引入src/index.ts文件,通过app.use方法安装自定义插件

```
import gloablComponent from './components/index';
app.use(gloablComponent);
```

### 5.集成sass

我们目前在组件内部已经可以使用scss样式,因为在配置styleLint工具的时候，项目当中已经安装过sass sass-loader,因此我们再组件内可以使用scss语法！！！需要加上lang="scss"

```
<style scoped lang="scss"></style>
```

接下来我们为项目添加一些全局的样式

在src/styles目录下创建一个index.scss文件，当然项目中需要用到清除默认样式，因此在index.scss引入reset.scss

```
@import reset.scss
```

在入口文件引入

```
import '@/styles'
```

但是你会发现在src/styles/index.scss全局样式文件中没有办法使用$变量.因此需要给项目中引入全局变量$.

在style/variable.scss创建一个variable.scss文件！

在vite.config.ts文件配置如下:

```typescript
export default defineConfig((config) => {
	css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
	}
}
```

**`@import "./src/styles/variable.less";`后面的 `;`不要忘记，不然会报错**!

配置完毕你会发现scss提供这些全局变量可以在组件样式中使用了！！！

### 6.mock数据

安装依赖:https://www.npmjs.com/package/vite-plugin-mock

```bash
pnpm install -D vite-plugin-mock mockjs
```

在 vite.config.js 配置文件启用插件。

```js
import { UserConfigExport, ConfigEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
export default ({ command })=> {
  return {
    plugins: [
      vue(),
      viteMockServe({
        localEnabled: command === 'serve',
      }),
    ],
  }
}
```

在根目录创建mock文件夹:去创建我们需要mock数据与接口！！！

在mock文件夹内部创建一个user.ts文件

```typescript
//用户信息数据
function createUserList() {
    return [
        {
            userId: 1,
            avatar:
                'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            username: 'admin',
            password: '111111',
            desc: '平台管理员',
            roles: ['平台管理员'],
            buttons: ['cuser.detail'],
            routes: ['home'],
            token: 'Admin Token',
        },
        {
            userId: 2,
            avatar:
                'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            username: 'system',
            password: '111111',
            desc: '系统管理员',
            roles: ['系统管理员'],
            buttons: ['cuser.detail', 'cuser.user'],
            routes: ['home'],
            token: 'System Token',
        },
    ]
}

export default [
    // 用户登录接口
    {
        url: '/api/user/login',//请求地址
        method: 'post',//请求方式
        response: ({ body }) => {
            //获取请求体携带过来的用户名与密码
            const { username, password } = body;
            //调用获取用户信息函数,用于判断是否有此用户
            const checkUser = createUserList().find(
                (item) => item.username === username && item.password === password,
            )
            //没有用户返回失败信息
            if (!checkUser) {
                return { code: 201, data: { message: '账号或者密码不正确' } }
            }
            //如果有返回成功信息
            const { token } = checkUser
            return { code: 200, data: { token } }
        },
    },
    // 获取用户信息
    {
        url: '/api/user/info',
        method: 'get',
        response: (request) => {
            //获取请求头携带token
            const token = request.headers.token;
            //查看用户信息是否包含有次token用户
            const checkUser = createUserList().find((item) => item.token === token)
            //没有返回失败的信息
            if (!checkUser) {
                return { code: 201, data: { message: '获取用户信息失败' } }
            }
            //如果有返回成功信息
            return { code: 200, data: {checkUser} }
        },
    },
]
```

**安装axios**

```bash
pnpm install axios
```

最后通过axios测试接口！！！

### 7.axios二次封装

在开发项目的时候避免不了与后端进行交互,因此我们需要使用axios插件实现发送网络请求。在开发项目的时候

我们经常会把axios进行二次封装。

目的:

1:使用请求拦截器，可以在请求拦截器中处理一些业务(开始进度条、请求头携带公共参数)

2:使用响应拦截器，可以在响应拦截器中处理一些业务(进度条结束、简化服务器返回的数据、处理http网络错误)

在根目录下创建utils/request.ts

```typescript
import axios from "axios";
import { ElMessage } from "element-plus";
//创建axios实例
let request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000
})
//请求拦截器
request.interceptors.request.use(config => {
    return config;
});
//响应拦截器
request.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    //处理网络错误
    let msg = '';
    let status = error.response.status;
    switch (status) {
        case 401:
            msg = "token过期";
            break;
        case 403:
            msg = '无权访问';
            break;
        case 404:
            msg = "请求地址错误";
            break;
        case 500:
            msg = "服务器出现问题";
            break;
        default:
            msg = "无网络";

    }
    ElMessage({
        type: 'error',
        message: msg
    })
    return Promise.reject(error);
});
export default request;
```

### 8.API接口统一管理

在开发项目的时候,接口可能很多需要统一管理。在src目录下去创建api文件夹去统一管理项目的接口；

比如:下面方式

```typescript
//统一管理咱们项目用户相关的接口

import request from '@/utils/request'

import type {

 loginFormData,

 loginResponseData,

 userInfoReponseData,

} from './type'

//项目用户相关的请求地址

enum API {

 LOGIN_URL = '/admin/acl/index/login',

 USERINFO_URL = '/admin/acl/index/info',

 LOGOUT_URL = '/admin/acl/index/logout',

}
//登录接口
export const reqLogin = (data: loginFormData) =>
 request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息

export const reqUserInfo = () =>

 request.get<any, userInfoReponseData>(API.USERINFO_URL)

//退出登录

export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
```

### 9.集成element-plus

官网地址:https://element-plus.gitee.io/zh-CN/

```bash
pnpm install element-plus @element-plus/icons-vue
```

**完整引入**

**入口文件main.ts全局安装element-plus,element-plus默认支持语言英语设置为中文**

```typescript
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
app.use(ElementPlus, {
    locale: zhCn
})
```

**Element Plus全局组件类型声明**

```json
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "types": ["element-plus/global"]
  }
}
```

配置完毕可以测试element-plus组件与图标的使用.

**按需引入**

```bash
pnpm install -D unplugin-vue-components unplugin-auto-import
```

**vite**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

**webpack**

```javascript
// webpack.config.js
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = {
  // ...
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
}
```

注意按需引入也需要引入样式文件

```typescript
import 'element-plus/dist/index.css'
```
