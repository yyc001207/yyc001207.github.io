# 手写 pormsie

## 1.初始化 Promise

```js
function Promise(executor) {
	// resolve函数
	const resolve = data => {}
	// reject函数
	const reject = data => {}
	// 同步调用执行器函数
	executor(resolve, reject)
}
// then方法
Promise.prototype.then = function (onResolved, onRejected) {}
```

## 2.实现 promise 的状态修改

实现 promsie 的状态修改需要完成以下目标

1. 改变 promise 状态（PromiseState）
2. 设置结果值（PromiseResult）
3. throw 的抛出异常转化为失败的 promise
4. promise 的状态只能改变一次

```js
let p = new Promise((resolve, reject) => {
	resolve('ok') // PromiseState:fulfilled PromiseResult:'ok'
	reject('err') // PromiseState:rejected PromiseResult:'err'
	throw 'fail' // PromiseState:rejected PromiseResult:'fail'
})
console.log(p)
```

```js
function Promise(executor) {
	// 创建属性值保存状态与结果值
	this.PromiseState = 'pending'
	this.PromiseResult = null
	// resolve函数
	const resolve = data => {
		// 保证只会执行一次成功或失败
		if (this.PromiseState !== 'pending') return
		this.PromiseState = 'fulfilled'
		this.PromiseResult = data
	}
	// reject函数
	const reject = data => {
		// 保证只会执行一次成功或失败
		if (this.PromiseState !== 'pending') return
		this.PromiseState = 'rejected'
		this.PromiseResult = data
	}
	// 使用try catch捕获异常，将其转化为失败的promise结果
	try {
		// 同步调用执行器函数
		executor(resolve, reject)
	} catch (error) {
		reject(error)
	}
}
// then方法
Promise.prototype.then = function (onResolved, onRejected) {}
```

## 3.实现 then 方法调用回调 执行器函数执行同步任务

```js
let p = new Promise((resolve, reject) => {
	// 同步任务
	resolve('ok')
})
p.then(
	res => {
		console.log(res)
	},
	err => {
		console.log(err)
	}
)
```

```js
// then方法 仅处理同步任务
Promise.prototype.then = function (onResolved, onRejected) {
	if (this.PromiseState === 'fulfilled') {
		onResolved(this.PromiseResult)
	}
	if (this.PromiseState === 'rejected') {
		onRejected(this.PromiseResult)
	}
}
```

## 4. 实现 then 方法调用回调 执行器函数执行异步任务

实现目标：

1. 执行器函数执行异步任务，then 方法调用回调
2. 实现多次调用 then 方法回调

```js
let p = new Promise((resolve, reject) => {
	// 定时器模拟异步任务
	setTimeout(() => {
		resolve('ok')
	}, 1000)
})
p.then(
	res => {
		console.log(res)
	},
	err => {
		console.log(err)
	}
)
// 查看回调是否可以多次调用
p.then(
	res => {
		console.warn(res)
	},
	err => {
		console.warn(err)
	}
)
// 同步执行 PromiseState = 'pending'
// 异步执行完成后改变PromiseState
console.log(p)
```

使用 3 中代码执行异步任务时：

then 方法同步执行，此时 promise 状态为 pending，无法执行成功或失败的回调；

因此我们需要寻找回调执行的时机；

当同步代码执行完后，执行异步代码，调用 resolve 或 reject 方法改变 promise 状态，此时就是 then 方法回调的执行 时机。

实现思路：

同步执行 then 方法时，promise 状态为 pending，实例新增一个对象数组（callback）保存 onResolved,onRejected 回调；

执行异步代码时，执行执行器函数，此时遍历执行 callback 数组保存的 then 方法回调函数

```js
function Promise(executor) {
	// 创建属性值保存状态与结果值
	this.PromiseState = 'pending'
	this.PromiseResult = null
	// 新增实例F属性保存then方法的回调
	this.callback = []
	// resolve函数
	const resolve = data => {
		// 保证只会执行一次成功或失败
		if (this.PromiseState !== 'pending') return
		this.PromiseState = 'fulfilled'
		this.PromiseResult = data
		// 执行器执行异步任务，当状态改变时，执行then方法回调
		this.callback.forEach(item => {
			item.onResolved(data)
		})
	}
	// reject函数
	const reject = data => {
		// 保证只会执行一次成功或失败
		if (this.PromiseState !== 'pending') return
		this.PromiseState = 'rejected'
		this.PromiseResult = data
		// 执行器执行异步任务，当状态改变时，执行then方法回调
		this.callback.forEach(item => {
			item.onRejected(data)
		})
	}
	// 使用try catch捕获异常，将其转化为失败的promise结果
	try {
		// 同步调用执行器函数
		executor(resolve, reject)
	} catch (error) {
		reject(error)
	}
}
// 在promise状态为pending时，保存回调
// 在promise状态改变时执行回调
Promise.prototype.then = function (onResolved, onRejected) {
	if (this.PromiseState === 'fulfilled') {
		onResolved(this.PromiseResult)
	}
	if (this.PromiseState === 'rejected') {
		onRejected(this.PromiseResult)
	}
	if (this.PromiseState === 'pending') {
		// 实现执行多个回调，即调用多次then方法（p.then();p.then(); 不是链式调用）
		this.callback.push({
			onResolved,
			onRejected,
		})
	}
}
```
