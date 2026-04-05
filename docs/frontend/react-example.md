# React 示例

这是一个 React 前端示例文档，展示了如何使用 React 构建现代前端应用。

## React 简介

React 是一个用于构建用户界面的 JavaScript 库，由 Facebook 开发和维护。它允许开发者创建可重用的 UI 组件，并通过虚拟 DOM 提高渲染性能。

## 基本组件示例

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>您点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>
        点击我
      </button>
    </div>
  );
}

export default Counter;
```

## React 钩子

React 提供了多种钩子函数，如 `useState`、`useEffect`、`useContext` 等，用于在函数组件中管理状态和副作用。

## 更多资源

- [React 官方文档](https://reactjs.org/)
- [React 教程](https://reactjs.org/tutorial/tutorial.html)
- [React 示例](https://reactjs.org/examples/)