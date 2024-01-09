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

## 2.实现 Promise 的状态修改

实现 promsie 的状态修改需要完成以下目标

1. 改变 Promise 状态（PromiseState）
2. 设置结果值（PromiseResult）
3. throw 的抛出异常转化为失败的 Promise
4. Promise 的状态只能改变一次

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
	// 使用try catch捕获异常，将其转化为失败的Promise结果
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

then 方法同步执行，此时 Promise 状态为 pending，无法执行成功或失败的回调；

因此我们需要寻找回调执行的时机；

当同步代码执行完后，执行异步代码，调用 resolve 或 reject 方法改变 Promise 状态，此时就是 then 方法回调的执行 时机。

实现思路：

同步执行 then 方法时，Promise 状态为 pending，实例新增一个对象数组（callback）保存 onResolved,onRejected 回调；

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
	// 使用try catch捕获异常，将其转化为失败的Promise结果
	try {
		// 同步调用执行器函数
		executor(resolve, reject)
	} catch (error) {
		reject(error)
	}
}
// 在Promise状态为pending时，保存回调
// 在Promise状态改变时执行回调
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
	// 返回一个Promise对象
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

实现了 then 的返回值永远返回一个 Promise 对象就可以实现链式调用

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
	// 返回一个Promise对象
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

## 6.resolve 方法

Promise.resolve() 静态方法将给定的值转换为一个 Promise。如果该值本身就是一个 Promise，那么该 Promise 将被返回；

如果该值是一个 thenable 对象，Promise.resolve() 将调用其 then() 方法及其两个回调函数；

否则，返回的 Promise 将会以该值兑现。

```js
let p = Promise.resolve(
	new Promise((resolve, reject) => {
		resolve('ok')
	})
)
let p1 = Promise.resolve('success')
let p2 = Promise.resolve(Promise.resolve('yeah'))
console.log(p)
console.log(p1)
console.log(p2)
```

```js
Promise.resolve = function (value) {
	// 返回一个Promise对象
	return new Promise((resolve, reject) => {
		if (value instanceof Promise) {
			value.then(
				v => {
					resolve(v)
				},
				e => {
					reject(e)
				}
			)
		} else {
			// 传入非Promise，返回成功的Promise
			resolve(value)
		}
	})
}
```

## 7.reject 方法

返回一个已拒绝（rejected）的 Promise，拒绝原因为给定的参数。

```js
let p = Promise.reject(
	new Promise((resolve, reject) => {
		resolve('ok')
	})
)
let p1 = Promise.reject('error')
console.log(p)
console.log(p1)
```

```js
Promise.reject = function (error) {
	return new Promise((resolve, reject) => {
		reject(error)
	})
}
```

## 8.all 方法

Promise.all() 静态方法接受一个 Promise 可迭代对象作为输入，并返回一个 Promise。

当所有输入的 Promise 都被兑现时，返回的 Promise 也将被兑现（即使传入的是一个空的可迭代对象），并返回一个包含所有兑现值的数组。

如果输入的任何 Promise 被拒绝，则返回的 Promise 将被拒绝，并带有第一个被拒绝的原因。

```js
let p = new Promise((resolve, reject) => {
	resolve('ok')
})
let p1 = Promise.resolve('success')
let p2 = Promise.resolve(Promise.resolve('yeah'))
// 传入的是任意有迭代器的对象
let result1 = Promise.all([p, p1, p2, 1, 2])
let result2 = Promise.all(new Set([p, p1, p2, 1, 2, 3]))
console.log(result1)
console.log(result2)
```

```js
Promise.all = function (promises) {
	// 返回一个Promise对象
	return new Promise((resolve, reject) => {
		// count每成功一个加1  i 记录值的长度
		let count = 0,
			i = 0
		// 保存成功结果
		const arr = []
		for (const promise of promises) {
			const index = i
			i++
			// 将非Promise也转为Promise
			Promise.resolve(promise).then(
				v => {
					count++
					// 保存成功结果
					arr[index] = v
					// 如果都成功，调用resolve
					if (count == i) {
						resolve(arr)
					}
				},
				e => {
					// 只要有一个失败，调用reject
					reject(e)
				}
			)
		}
		// 如果传入的值长度为0，调用resolve，成功值的为空数组
		if (i == 0) {
			resolve(arr)
		}
	})
}
```

在写 all 方法的过程中，如果传递的可迭代对象中的某一个为失败的 Promise，结果不会返回失败的 Promise，而是返回成功的 Promise，结果是其他成功的 Promise 组成的数组。

在遍历出的对象执行 then 方法中打印我们记录长度的变量 i，发现他的值是 0,1,2,3；由此我们发现之前所写的 then 方法的回调是同步调用的，根据[MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#then_%E7%9A%84%E5%BC%82%E6%AD%A5%E6%80%A7)，then 方法的回调是异步调用的；所以在 then 方法调用回调时加上一个定时器，将回调改为异步调用。

```js
Promise.prototype.then = function (onResolved, onRejected) {
	// 返回一个Promise对象
	return new Promise((resolve, reject) => {
		// 保存this
		const that = this
		// 判断回调函数
		if (typeof onRejected !== 'function') {
			onRejected = err => {
				throw err
			}
		}
		if (typeof onResolved !== 'function') {
			onResolved = res => {
				resolve(res)
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
			// 定时器的作用是，实现then方法的异步性
			setTimeout(() => {
				back(onResolved)
			})
		}
		if (this.PromiseState === 'rejected') {
			// 定时器的作用是，实现then方法的异步性
			setTimeout(() => {
				back(onRejected)
			})
		}
		if (this.PromiseState === 'pending') {
			// 实现执行多个回调，即调用多次then方法（p.then();p.then(); 不是链式调用）
			this.callback.push({
				onResolved: function () {
					// 定时器的作用是，实现then方法的异步性
					setTimeout(() => {
						back(onResolved)
					})
				},
				onRejected: function () {
					// 定时器的作用是，实现then方法的异步性
					setTimeout(() => {
						back(onRejected)
					})
				},
			})
		}
	})
}
```

## 9.race 方法

Promise.race() 静态方法接受一个 promise 可迭代对象作为输入，并返回一个 Promise。

这个返回的 promise 会随着第一个 promise 的敲定而敲定。

```js
Promise.race = function (promises) {
	// 返回一个Promise对象
	return new Promise((resolve, reject) => {
		let i = 0
		for (const promise of promises) {
			i++
			Promise.resolve(promise).then(
				v => {
					// 修改返回对象为成功
					resolve(v)
				},
				e => {
					// 只要有一个失败，调用reject
					reject(e)
				}
			)
		}
		// 如果传入的值长度为0，调用resolve，成功值的为空数组
		if (i == 0) {
			resolve([])
		}
	})
}
```

## 10.Promise 构造函数

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
	// 使用try catch捕获异常，将其转化为失败的Promise结果
	try {
		// 同步调用执行器函数
		executor(resolve, reject)
	} catch (error) {
		reject(error)
	}
}

// then方法
Promise.prototype.then = function (onResolved, onRejected) {
	// 返回一个Promise对象
	return new Promise((resolve, reject) => {
		// 保存this
		const that = this
		// 判断回调函数
		if (typeof onRejected !== 'function') {
			onRejected = err => {
				throw err
			}
		}
		if (typeof onResolved !== 'function') {
			onResolved = res => {
				resolve(res)
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
			// 定时器的作用是，实现then方法的异步性
			setTimeout(() => {
				back(onResolved)
			})
		}
		if (this.PromiseState === 'rejected') {
			// 定时器的作用是，实现then方法的异步性
			setTimeout(() => {
				back(onRejected)
			})
		}
		if (this.PromiseState === 'pending') {
			// 实现执行多个回调，即调用多次then方法（p.then();p.then(); 不是链式调用）
			this.callback.push({
				onResolved: function () {
					// 定时器的作用是，实现then方法的异步性
					setTimeout(() => {
						back(onResolved)
					})
				},
				onRejected: function () {
					// 定时器的作用是，实现then方法的异步性
					setTimeout(() => {
						back(onRejected)
					})
				},
			})
		}
	})
}

// catch方法
Promise.prototype.catch = function (onRejected) {
	return this.then(undefined, onRejected)
}

// resolve方法
// Promise.resolve() 静态方法将给定的值转换为一个 Promise。如果该值本身就是一个 Promise，那么该 Promise 将被返回；
// 如果该值是一个 thenable 对象，Promise.resolve() 将调用其 then() 方法及其两个回调函数；
// 否则，返回的 Promise 将会以该值兑现。
Promise.resolve = function (value) {
	// 返回一个Promise对象
	return new Promise((resolve, reject) => {
		if (value instanceof Promise) {
			value.then(
				v => {
					resolve(v)
				},
				e => {
					reject(e)
				}
			)
		} else {
			// 传入非Promise，返回成功的Promise
			resolve(value)
		}
	})
}

// reject方法
// 返回一个已拒绝（rejected）的 Promise，拒绝原因为给定的参数。
Promise.reject = function (error) {
	// 返回一个Promise对象
	return new Promise((resolve, reject) => {
		reject(error)
	})
}

// all方法
// Promise.all() 静态方法接受一个 Promise 可迭代对象作为输入，并返回一个 Promise。
// 当所有输入的 Promise 都被兑现时，返回的 Promise 也将被兑现（即使传入的是一个空的可迭代对象），并返回一个包含所有兑现值的数组。
// 如果输入的任何 Promise 被拒绝，则返回的 Promise 将被拒绝，并带有第一个被拒绝的原因。
Promise.all = function (promises) {
	// 返回一个Promise对象
	return new Promise((resolve, reject) => {
		// count每成功一个加1  i 记录值的长度
		let count = 0,
			i = 0
		// 保存成功结果
		const arr = []
		for (const promise of promises) {
			const index = i
			i++
			// 将非Promise也转为Promise
			Promise.resolve(promise).then(
				v => {
					count++
					// 保存成功结果
					arr[index] = v
					// 如果都成功，调用resolve
					if (count == i) {
						resolve(arr)
					}
				},
				e => {
					// 只要有一个失败，调用reject
					reject(e)
				}
			)
		}
		// 如果传入的值长度为0，调用resolve，成功值的为空数组
		if (i == 0) {
			resolve(arr)
		}
	})
}

// race方法
// Promise.race() 静态方法接受一个 promise 可迭代对象作为输入，并返回一个 Promise。
// 这个返回的 promise 会随着第一个 promise 的敲定而敲定。
Promise.race = function (promises) {
	// 返回一个Promise对象
	return new Promise((resolve, reject) => {
		let i = 0
		for (const promise of promises) {
			i++
			// 将非Promise也转为Promise
			Promise.resolve(promise).then(
				v => {
					// 修改返回对象为成功
					resolve(v)
				},
				e => {
					// 只要有一个失败，调用reject
					reject(e)
				}
			)
		}
		// 如果传入的值长度为0，调用resolve，成功值的为空数组
		if (i == 0) {
			resolve([])
		}
	})
}
```

## 11.Promise 类

```js
// class封装
class Promise {
	// 构造函数
	constructor(executor) {
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
		// 使用try catch捕获异常，将其转化为失败的Promise结果
		try {
			// 同步调用执行器函数
			executor(resolve, reject)
		} catch (error) {
			reject(error)
		}
	}

	// then方法
	then(onResolved, onRejected) {
		// 返回一个Promise对象
		return new Promise((resolve, reject) => {
			// 保存this
			const that = this
			// 判断回调函数
			if (typeof onRejected !== 'function') {
				onRejected = err => {
					throw err
				}
			}
			if (typeof onResolved !== 'function') {
				onResolved = res => {
					resolve(res)
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
				// 定时器的作用是，实现then方法的异步性
				setTimeout(() => {
					back(onResolved)
				})
			}
			if (this.PromiseState === 'rejected') {
				// 定时器的作用是，实现then方法的异步性
				setTimeout(() => {
					back(onRejected)
				})
			}
			if (this.PromiseState === 'pending') {
				// 实现执行多个回调，即调用多次then方法（p.then();p.then(); 不是链式调用）
				this.callback.push({
					onResolved: function () {
						// 定时器的作用是，实现then方法的异步性
						setTimeout(() => {
							back(onResolved)
						})
					},
					onRejected: function () {
						// 定时器的作用是，实现then方法的异步性
						setTimeout(() => {
							back(onRejected)
						})
					},
				})
			}
		})
	}

	// catch方法
	catch(onRejected) {
		return this.then(undefined, onRejected)
	}

	// resolve方法
	// Promise.resolve() 静态方法将给定的值转换为一个 Promise。如果该值本身就是一个 Promise，那么该 Promise 将被返回；
	// 如果该值是一个 thenable 对象，Promise.resolve() 将调用其 then() 方法及其两个回调函数；
	// 否则，返回的 Promise 将会以该值兑现。
	static resolve(value) {
		// 返回一个Promise对象
		return new Promise((resolve, reject) => {
			if (value instanceof Promise) {
				value.then(
					v => {
						resolve(v)
					},
					e => {
						reject(e)
					}
				)
			} else {
				// 传入非Promise，返回成功的Promise
				resolve(value)
			}
		})
	}

	// reject方法
	// 返回一个已拒绝（rejected）的 Promise，拒绝原因为给定的参数。
	static reject(error) {
		// 返回一个Promise对象
		return new Promise((resolve, reject) => {
			reject(error)
		})
	}

	// all方法
	// Promise.all() 静态方法接受一个 Promise 可迭代对象作为输入，并返回一个 Promise。
	// 当所有输入的 Promise 都被兑现时，返回的 Promise 也将被兑现（即使传入的是一个空的可迭代对象），并返回一个包含所有兑现值的数组。
	// 如果输入的任何 Promise 被拒绝，则返回的 Promise 将被拒绝，并带有第一个被拒绝的原因。
	static all(promises) {
		// 返回一个Promise对象
		return new Promise((resolve, reject) => {
			// count每成功一个加1  i 记录值的长度
			let count = 0,
				i = 0
			// 保存成功结果
			const arr = []
			for (const promise of promises) {
				const index = i
				i++
				// 将非Promise也转为Promise
				Promise.resolve(promise).then(
					v => {
						count++
						// 保存成功结果
						arr[index] = v
						// 如果都成功，调用resolve
						if (count == i) {
							resolve(arr)
						}
					},
					e => {
						// 只要有一个失败，调用reject
						reject(e)
					}
				)
			}
			// 如果传入的值长度为0，调用resolve，成功值的为空数组
			if (i == 0) {
				resolve(arr)
			}
		})
	}

	// race方法
	// Promise.race() 静态方法接受一个 promise 可迭代对象作为输入，并返回一个 Promise。
	// 这个返回的 promise 会随着第一个 promise 的敲定而敲定。

	static race(promises) {
		// 返回一个Promise对象
		return new Promise((resolve, reject) => {
			let i = 0
			for (const promise of promises) {
				i++
				// 将非Promise也转为Promise
				Promise.resolve(promise).then(
					v => {
						// 修改返回对象为成功
						resolve(v)
					},
					e => {
						// 只要有一个失败，调用reject
						reject(e)
					}
				)
			}
			// 如果传入的值长度为0，调用resolve，成功值的为空数组
			if (i == 0) {
				resolve([])
			}
		})
	}
}
```
