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

## 3.实现 then 方法调用回调

### 3.1 执行器函数执行同步任务

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

### 3.2 执行器函数执行异步任务

实现目标：

1. 执行器函数执行异步任务，then 方法调用回调
2. 实现指定多个回调调用

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

3.1 中代码执行异步任务时：

then 方法同步执行，此时 promise 状态为 pending，无法执行成功或失败的回调；

因此我们需要寻找回调执行的时机；

当同步代码执行完后，执行异步代码，调用 resolve 或 reject 方法改变 promise 状态，此时就是 then 方法回调的执行 时机。

实现思路：

同步执行 then 方法时，promise 状态为 pending，实例新增一个对象数组（callback）保存 onResolved,onRejected 回调；

执行异步代码时，执行执行器函数，此时遍历执行 callback 数组保存的 onResolved,onRejected 回调

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

## 4.then 方法返回值

参考[MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#%E8%BF%94%E5%9B%9E%E5%80%BC)

then 方法执行立即返回一个新的 Promise 对象，该对象始终处于待定状态，无论当前 Promise 对象的状态如何。

onFulfilled 和 onRejected 处理函数之一将被执行，以处理当前 Promise 对象的兑现或拒绝。即使当前 Promise 对象已经敲定，这个调用也总是异步发生的。返回的 Promise 对象（称之为 p）的行为取决于处理函数的执行结果，遵循一组特定的规则。如果处理函数：

返回一个值：p 以该返回值作为其兑现值。

没有返回任何值：p 以 undefined 作为其兑现值。

抛出一个错误：p 抛出的错误作为其拒绝值。

返回一个已兑现的 Promise 对象：p 以该 Promise 的值作为其兑现值。

返回一个已拒绝的 Promise 对象：p 以该 Promise 的值作为其拒绝值。

返回另一个待定的 Promise 对象：p 保持待定状态，并在该 Promise 对象被兑现/拒绝后立即以该 Promise 的值作为其兑现/拒绝值。

### 4.1 执行器函数执行同步任务

```js
let p = new Promise((resolve, reject) => {
	resolve('ok')
})
const res = p.then(
	res => {
		return new Promise((resolve, reject) => {
			resolve('success')
			// reject('error')
		})
		console.log(res)
	},
	err => {
		console.log(err)
	}
)
console.log(res)
```

既然需要立即返回一个新的 Promise 对象，那么在 then 执行时返回一个新的 Prommise 对象，然后按照 resolve 和 reject 的思路确定新的 Prommise 对象的执行结果。

```js
Promise.prototype.then = function (onResolved, onRejected) {
	// 返回一个promise对象
	return new Promise((resolve, reject) => {
		if (this.PromiseState === 'fulfilled') {
			try {
				let result = onResolved(this.PromiseResult)
				if (result instanceof Promise) {
					// 返回一个已兑现的 Promise 对象：res 以该 Promise 的值作为其兑现值。
					// 返回一个已拒绝的 Promise 对象：res 以该 Promise 的值作为其拒绝值。
					// 返回另一个待定的 Promise 对象：p 保持待定状态，并在该 Promise 对象被兑现/拒绝后立即以该 Promise 的值作为其兑现/拒绝值。
					result.then(
						v => {
							resolve(v)
						},
						e => {
							reject(e)
						}
					)
				} else {
					// 返回一个值：res 以该返回值作为其兑现值。
					// 没有返回任何值：res 以 undefined 作为其兑现值。
					resolve(result)
				}
			} catch (error) {
				// 抛出一个错误：p 抛出的错误作为其拒绝值。
				reject(error)
			}
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
	})
}
```

### 4.2 执行器函数执行异步任务

异步执行就是要在状态改变时执行回调，其他操作跟同步一致，参考 3.2 实现思路

实现了 then 的返回值永远返回一个 promise 对象就可以实现链式调用

```js
let p = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('ok')
	}, 1000)
})
const res = p
	.then(
		res => {
			return new Promise((resolve, reject) => {
				resolve('success')
				// reject('error')
			})
			console.log(res)
		},
		err => {
			console.log(err)
		}
	)
	.then(red => {
		console.log(red)
	})
console.log(res)
```

```js
Promise.prototype.then = function (onResolved, onRejected) {
	// 返回一个promise对象
	return new Promise((resolve, reject) => {
		// 保存this
		const that = this
		// 判断回调函数
		if (typeof onRejected !== 'function') {
			onRejected = err => {
				throw err
			}
		}
		// 封装
		function back(fun) {
			try {
				let result = fun(that.PromiseResult)
				if (result instanceof Promise) {
					// 返回一个已兑现的 Promise 对象：res 以该 Promise 的值作为其兑现值。
					// 返回一个已拒绝的 Promise 对象：res 以该 Promise 的值作为其拒绝值。
					// 返回另一个待定的 Promise 对象：res 保持待定状态，并在该 Promise 对象被兑现/拒绝后立即以该 Promise 的值作为其兑现/拒绝值。
					result.then(
						v => {
							resolve(v)
						},
						e => {
							reject(e)
						}
					)
				} else {
					// 返回一个值：res 以该返回值作为其兑现值。
					// 没有返回任何值：res 以 undefined 作为其兑现值。
					resolve(result)
				}
			} catch (error) {
				// 抛出一个错误：p 抛出的错误作为其拒绝值。
				reject(error)
			}
		}
		if (this.PromiseState === 'fulfilled') {
			back(onResolved)
		}
		if (this.PromiseState === 'rejected') {
			back(onRejected)
		}
		if (this.PromiseState === 'pending') {
			// 实现执行多个回调，即调用多次then方法（p.then();p.then(); 不是链式调用）
			this.callback.push({
				onResolved: function () {
					back(onResolved)
				},
				onRejected: function () {
					back(onRejected)
				},
			})
		}
	})
}
```

## 5.catch 方法与异常穿透

catch 方法就是 then 方法的第二个失败的回调，所以很简单。

```js
// catch方法
Promise.prototype.catch = function (onRejected) {
	return this.then(undefined, onRejected)
}
```

异常穿透

```js
let p = new Promise((resolve, reject) => {
	resolve('ok')
})
p.then(() => {
	console.log(111) // 111
})
	.then(() => {
		console.log(222) // 222
	})
	.then(() => {
		console.log(333) // 333
		throw 'error' // 中途抛出异常
	})
	.then(() => {
		console.log(444) // 不会输出
	})
	.catch(err => {
		console.log(err) // error
	})
```
