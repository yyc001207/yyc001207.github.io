# Vue 示例

这是一个 Vue 前端示例文档，展示了如何使用 Vue.js 构建现代前端应用。

## Vue 简介

Vue 是一个渐进式 JavaScript 框架，用于构建用户界面。它的核心库只关注视图层，易于集成到现有项目中。

## 基本组件示例

```vue
<template>
  <div>
    <p>您点击了 {{ count }} 次</p>
    <button @click="count++">
      点击我
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<style scoped>
p {
  font-size: 18px;
}

button {
  padding: 8px 16px;
  font-size: 16px;
}
</style>
```

## Composition API

Vue 3 引入了 Composition API，提供了一种更灵活的方式来组织组件逻辑：

```vue
<template>
  <div>
    <p>您点击了 {{ count }} 次</p>
    <button @click="increment">
      点击我
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
const increment = () => count.value++;
</script>
```

## 更多资源

- [Vue 官方文档](https://vuejs.org/)
- [Vue 教程](https://vuejs.org/tutorial/)
- [Vue 示例](https://vuejs.org/examples/)