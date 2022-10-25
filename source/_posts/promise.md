---
title: promise
date: 2022-10-25 10:29:25
keywords: promise,javascript,异步编程
tags: 
     - promise
     - javascript
     - 异步编程
---

\# 笔记

\# 课件和笔记都是摘自尚硅谷的promise相关教程

[B站教程地址](https://www.bilibili.com/video/BV1GA411x7z1/?spm_id_from=333.999.header_right.fav_list.click&vd_source=5b3402369f2047c6a7873145482528ad)

\## 1.1. Promise 是什么?

\###  1.1.1. 理解

\####  1. 抽象表达: 

\* 1) Promise 是一门新的技术(ES6 规范)

\* 2) Promise 是 JS 中进行异步编程的新解决方案

\*   备注：旧方案是单纯使用回调函数

\#### 2. 具体表达:

\* 1) 从语法上来说: Promise 是一个构造函数

\* 2) 从功能上来说: promise 对象用来封装一个异步操作并可以获取其成功/ 失败的结果值

\## 异步编程

\* fs文件操作

\```javascript

require('fs').readeFile('./index.html',(*err*,*data*)=>{})*//回调函数解决异步请求*

\```

\* 数据库操作

\* AJAX

\* 定时器

\```javascript  

setTimeout(()=>{},2000)*//回调函数解决异步请求*

\```



\## 1.2. 为什么要用 Promise?

\### 1.2.1. 指定回调函数的方式更加灵活

\#### 1.旧的:

\*  必须在启动异步任务前指定

\#### 2. promise:

\*  启动异步任务 => 返回promie对象 => 给promise对象绑定回调函

数(甚至可以在异步任务结束后指定/多个)

\### 1.2.2. 

\* 支持链式调用, 可以解决回调地狱问题

\#### 1. 什么是回调地狱? 

\* 回调函数嵌套调用, 外部回调函数异步执行的结果是嵌套的回调执行的条件

<img src='..\image\回调地狱.jpg'>

\#### 2. 回调地狱的缺点? 

\* 不便于阅读

\* 不便于异常处理

\#### 3. 解决方案

\* promise 链式调用

\#### 4. 终极解决方案

\* async/await



\## 1.3 promise 的几个关键问题

\### 1. 如何改变 promise 的状态?

\* (1) resolve(value): 如果当前是 pending 就会变为 resolved

\* (2) reject(reason): 如果当前是 pending 就会变为 rejected

\* (3) 抛出异常: 如果当前是 pending 就会变为 rejected

\### 2. 一个 promise 指定多个成功/失败回调函数, 都会调用吗?

当 promise 改变为对应状态时都会调用

\### 3. 改变 promise 状态和指定回调函数谁先谁后?

\* (1) 都有可能, 正常情况下是先指定回调再改变状态, 但也可以先改状态再指定回调

\* (2) 如何先改状态再指定回调?

\* ① 在执行器中直接调用 resolve()/reject()

\* ② 延迟更长时间才调用 then()

\* (3) 什么时候才能得到数据?

\* * ① 如果先指定的回调, 那当状态发生改变时, 回调函数就会调用, 得到数据

\* * ② 如果先改变的状态, 那当指定回调时, 回调函数就会调用, 得到数据

\### 4. promise.then()返回的新 promise 的结果状态由什么决定?

\* (1) 简单表达: 由 then()指定的回调函数执行的结果决定

\* (2) 详细表达:

\* * ① 如果抛出异常, 新 promise 变为 rejected, reason 为抛出的异常

\* * ② 如果返回的是非 promise 的任意值, 新 promise 变为 resolved, value 为返回的值

\* * ③ 如果返回的是另一个新 promise, 此 promise 的结果就会成为新 promise 的结果

\### 5. promise 如何串连多个操作任务?

\* (1) promise 的 then()返回一个新的 promise, 可以开成 then()的链式调用

\* (2) 通过 then 的链式调用串连多个同步/异步任务

\### 6. promise 异常传透?

\* (1) 当使用 promise 的 then 链式调用时, 可以在最后指定失败的回调, 

\* (2) 前面任何操作出了异常, 都会传到最后失败的回调中处理

\### 7. 中断 promise 链?

\* (1) 当使用 promise 的 then 链式调用时, 在中间中断, 不再调用后面的回调函数

\* (2) 办法: 在回调函数中返回一个 pendding 状态的 promise 对象
