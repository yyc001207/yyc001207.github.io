---
title: vue-admin
date: 2022-10-24 20:43:29
tags: 
     - vue.js
     - vue-admin
     - javascript
---

# day1

## 1.什么是后台管理系统项目？

注意：前端领域当中，开发后台管理系统项目，并非是java、php等后台语言项目。

在前面课程当中，我们已经开发了一个项目【尚品汇电商平台项目】，这个项目主要针对的是用户（游客），可以让用户在平台当中购买产品。
但是你需要想明白一件事情，用户购买产品信息从何而来呀？

比如：前台项目当中的数据来源于卖家（公司），但是需要注意的时候，卖家它不会数据库操作。对于卖家而言，需要把产品的信息上传于服务器，写入数据库。
卖家并非程序员，不会数据库操作（增删改查）。导致卖家，找了一个程序员，开发一个产品，可以让我进行可视化操作数据库（增伤改查）

卖家（公司）：组成，老板、员工。
老板：开发这个项目，对于老板而言，什么都可以操作。【产品的上架、产品的下架、查看员工的个人业绩、其他等等】
员工：可能就是查看个人业绩

后台管理系统：可以让用户通过一个可视化工具，可以实现对于数据库进行增删改查的操作。
而且需要注意，根据不同的角色（老板、员工），看到的、操作内容是不同的。

对于后台管理系统项目，一般而言，是不需要注册的。

## 2.模板介绍

简洁版: https://github.com/PanJiaChen/vue-admin-template 我们用这个
加强版: https://github.com/PanJiaChen/vue-element-admin

## 3.文件夹介绍

### build

​     ------ index.js webpack配置文件【很少修改这个文件】

### mock

​     ------ mock数据文件夹 【模拟一些假数据mockjs实现】，本案例使用真实数据

### node_modules

​     ------ 项目依赖

### public

​     ------ 静态资源，打包时不会编译这个文件夹

### src------ 程序员源代码

api------ 接口请求相关

assets------ 静态资源，打包时不会编译

components ------ 一般放置非路由组件或者全局组件

icons ------ 放置了一些svg矢量图

layout ------ 放置一些组件与混入，后续组件都是在layout组件中

router ------ 路由相关

store------ vuex

style------ 样式相关

utils ------ 封装一些需要的方法比如request.js axios二次封装，以及token的存储和移出操作

views------ 放置路由组件

App.vue:根组件
main.js：入口文件
permission.js:与导航守卫先关、
settings：项目配置项文件
.env.development
.env.producation

## 4.登录功能

### 1.接口

因为我们使用的是真实接口需要替换原模板的接口

接口地址：http://39.98.123.211:8170/swagger-ui.html#/

<img src="C:\Users\15363\AppData\Roaming\Typora\typora-user-images\image-20220915151250481.png" alt="image-20220915151250481" style="zoom:50%;" />

这里将其他接口一起进行了替换

```js
//引入axios（axios进行了二次封装）
import request from '@/utils/request'

//对外暴露的登录接口函数
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}
//对外暴露的用户信息接口函数
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}
//对外暴露的退出登录接口函数
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
```

修改axios的二次封装，真实接口成功的code=200，我们真实接口需要携带token字段，而不是提供的X-Token

```js
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['token'] = getToken()//修改后
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
```

```js
 if (res.code !== 20000 && res.code != 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
```

因为使用了真实接口所以需要在vue.config.js配置代理跨域

```js
devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    //配置代理跨域
    proxy: {
      '/dev-api': {
        target: 'http://39.98.123.211:8170',
        pathRewrite: { '^/dev-api': '' },
      },
    },
  },
```

### 2.源码分析

组件内

```js
handleLogin() {
      //验证表单元素是否符合规则
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          //按钮的loading效果
          this.loading = true
          //派发一个action：user/login，带着用户名和密码
          this.$store
            .dispatch('user/login', this.loginForm)
            //登录成功
            .then(() => {
              //路由跳转
              this.$router.push({ path: this.redirect || '/' })
              //loading结束
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
```

vuex仓库中

actions，由于之前没有async和await，模板使用的.then与.catch

```js
 login({ commit }, userInfo) {
    //解构用户名与密码
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      //向服务器请求数据
      login({ username: username.trim(), password: password })
        //请求成功
        .then(response => {
          // console.log(response);
          //将response解构赋值给data
          const { data } = response
          //派发mutations业务
          commit('SET_TOKEN', data.token)
          //本地保存token
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
    })
  },
```

修改为async和await

```js
async login({ commit }, userInfo) {
    //解构用户名与密码
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
```

剩余工作就是将英文文本替换成中文，较为简单不做演示，表单验证放在后面做

登录页最终结果

<img src="C:\Users\15363\AppData\Roaming\Typora\typora-user-images\image-20220915174306393.png" alt="image-20220915174306393" style="zoom:50%;" />

### 退出登录

由于api在上面已经做了修改，所以这里只是修改文本不做演示，退出登录组件名为Navbar

## 5.创建路由

### 1.路由目录

首页（一级路由）

权限管理（一级）

商品管理（一级）

---------品牌管理（二级）

---------平台属性管理（二级）

---------Spu管理（二级）

---------Sku管理（二级）

### 2.创建路由

我们的一级路由都是在**Layout**这个骨架下搭建的，所以一级路由的component都写Layout

```js
 {
    path: '/',
    component: Layout,
    //重定向至dashboard组件，即首页
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/product',
    component: Layout,
    name: 'Product',
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: '/tradeMark',
        name: 'TradeMark',
        component: () => import('@/views/product/tradeMark'),
        meta: { title: '品牌管理' }
      },
      {
        path: '/attr',
        name: 'Attr',
        component: () => import('@/views/product/Attr'),
        meta: { title: '平台属性管理' }
      },
      {
        path: '/spu',
        name: 'Spu',
        component: () => import('@/views/product/Spu'),
        meta: { title: 'Spu管理' }
      },
      {
        path: '/sku',
        name: 'Sku',
        component: () => import('@/views/product/Sku'),
        meta: { title: 'Sku管理' }
      },
    ]
  },
```

meta中的title为菜单栏以及面包屑显示的名字

<img src="C:\Users\15363\AppData\Roaming\Typora\typora-user-images\image-20220916091331235.png" alt="image-20220916091331235" style="zoom:100%;" />![image-20220916091415769](C:\Users\15363\AppData\Roaming\Typora\typora-user-images\image-20220916091415769.png)

##  6.商品管理

这里主要是利用element-UI制作静态页面，模板的element-UI默认英文版

```vue
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
```

### 1.品牌管理

![屏幕截图 2022-09-16 092103](D:\桌面\屏幕截图 2022-09-16 092103.png)

#### 1.添加按钮

```vue
<el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px"
      >添加</el-button
    >
```

#### 2.添加table表格—显示的标题要居中—且序号的占比要小

el-table属性：

 data：表格组件将来需要展示的数据【数组类型】

 border：是给表格带上边框

el-table-column属性：

 label：显示的标题

 width：对应列的宽度

 align：对齐方式

```vue
<el-table :data="data" style="width: 100%" border="true">
      <el-table-column prop="prop" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="prop" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌logo" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
      </el-table-column>
    </el-table>
```

#### 3.分页器----要居中

```vue
 <!-- 
      current-page：当前页数
      page-sizes：每页显示个数选择器
      page-size：每页显示条目个数
      total：总条目数
      pager-count：页码按钮的数量，当总页数超过该值时会折叠
      layout：实现分页器布局
    -->
    <el-pagination
      class="pagination"
      :current-page="6"
      :total="100"
      :page-size="3"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, jumper, ->, sizes, total"
    >
    </el-pagination>
```

```css
.pagination {
  margin-top: 20px;
  text-align: center;
}
```

<img src="D:\桌面\屏幕截图 2022-09-16 092103.png" alt="屏幕截图 2022-09-16 092103" style="zoom:60%;" />

# day2

## 1.品牌管理动态数据展示

### 1.修改接口地址

原地址端口更改，代理跨域发生改变

```js
proxy: {
      '/dev-api': {
        target: 'http://gmall-h5-api.atguigu.cn',
        pathRewrite: { '^/dev-api': '' },
      },
    },
```

后续就是写接口，写仓库

### 2.获取品牌列表接口

在api文件夹创建product文件夹统一管理商品管理的接口

![image-20220916165311726](C:\Users\15363\AppData\Roaming\Typora\typora-user-images\image-20220916165311726.png)

在index中统一暴露

```js
//统一暴露
import *as tradeMark from './product/tradeMark'
import *as attr from './product/attr'
import *as sku from './product/sku'
import *as spu from './product/spu'

export default {
    tradeMark,
    attr,
    sku,
    spu,
}
```

```js
//获取品牌信息
export const reqTradeMarkList = (page, limit) =>
    request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })
```

这里不需要共享数据所以没有使用vuex仓库，而是将api添加到Vue原型上，其他组件可以直接调用

```vue
import API from '@/api'
Vue.prototype.$API = API
```

#### 获取数据

```js
 mounted() {
    this.getPageList()
  },
  methods: {
    //获取商品列表
    async getPageList() {
      const { page, limit } = this
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit)
      if (result.code == 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    //点击分页器跳转页码
    handleCurrentChange(pager) {
      this.page = pager
      this.getPageList()
    },
    //展示数据条数切换
    handleSizeChange(sizes) {
      this.limit = sizes
      this.getPageList()
    },
```

#### 展示数据

elementUI当中的table组件，展示的数据是以一列一列进行展示数据的

如果需要显示索引，可以增加一列el-table-column，设置type属性为index即可显示从 1 开始的索引号。

prop:对应列内容的字段名，也可以使用 property 属性【字符串类型】

**el-tabel** `:data="list"`表示这个表格展示的是哪里面的数据

第一列 我们要展示的是序列号，可以用` type="index"`表示从1 开始展示索引号

第二列 我们展示的是品牌类型，在list 里面的tmName，我们可以用`prop`:对应列内容的字段名

```vue
    <el-table border :data="list">
        
      <el-table-column
        label="序号"
        width="80"
        align="center"
        type="index"
      ></el-table-column>
        
      <el-table-column label="品牌类型" prop="tmName"></el-table-column>
        
      <el-table-column label="品牌LOGO">
        <!-- { row, $index }是固定的名字，不能瞎写 -->
        <template slot-scope="{ row, $index }">
          <!-- row代表的是数组回传的数据 -->
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
        
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit>" size="mini"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete>" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
        
    </el-table>

```

第三列 展示的是品牌logo，是个图片，我们有地址，我们可以用【作用域插槽】来展示图片

 `slot-scope="{ row, $index }"`代表的是子组件回传过来的数据，也就是`list`

 然后我们进行动态展示图片`:src`

#### 分页器动态数据

```vue
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes, total"
      :total="total"
      style="margin-top: 20px; text-align: center"
      :page-count="7"
    >
    </el-pagination>

```

#### 完成相关点击事件

当点击页数的时候，修改data里面的page，然后再次发请求

`@current-change="handleCurrentChange"`当你点击其他页数时触发

```vue
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes, total"
      :total="total"
      style="margin-top: 20px; text-align: center"
      :page-count="7"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
```

```js
    // 点击页码进行切换
    handleCurrentChange(pager) {
      // pager你点击的页数
      // 修改参数，然后再发请求
      this.page = pager ;
      this.getPageList();
    },
    // 点击页码进行切换
    handleCurrentChange(pager) {
      // pager你点击的页数
      // 修改参数，然后再发请求
      this.page = pager ;
      this.getPageList();
    },
```

`@size-change="handleSizeChange"`当pageSize【展示数据条数】改变时触发

```js
    // 当分页器某一页需要展示数据的条数发生变化时触发
    handleSizeChange(limit){
      // 修改数据，再次发请求
      this.limit = limit ;
      this.getPageList();
    },
```

#### 添加和修改品牌信息（静态）

当你点击品牌管理页面 左上角【添加】的时候，会弹出一个类似遮罩层的页面

当你点击【修改】，也会弹出一个类似遮罩层的页面-----------显示对话框

![image-20220916172746949](C:\Users\15363\AppData\Roaming\Typora\typora-user-images\image-20220916172746949.png)

我们这里用elementui的 dialog 对话框

```vue
<el-dialog
     title="添加品牌"
      :visible.sync="dialogFormVisible"
    >
      <!-- :model属性将表单数据收集到一个指定对象上 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
```

上传图片用elementui的Upload上传

```vue
 <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2M
            </div>
          </el-upload>
```

粘贴elementui里面相关的数据和方法与样式

```js
data(){
	return{
      dialogFormVisible: false, // 对话框显示与隐藏的控制属性
      imageUrl: "", // 上传图片使用的属性
	}
},
methods:{
	// 上传图片相关的回调
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

}
```

### 3.完成 添加品牌、修改品牌和删除的功能

#### 1.api接口

```js
//添加或修改品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    //修改品牌信息时需要获得品牌的id，我们通过是否存在品牌id，判断需要发送什么请求
    if (tradeMark.id) {
        //修改
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
    } else {
        //添加
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
    }
}

//删除品牌
export const reqDeleteTradeMark = (id) => request({
    url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete'
})
```

#### 2.收集数据并发请求

##### 1收集数据

要收集到elementui里面的表单数据，就要在表单el-form上面添加 `model`属性，在item上添加v-model将来表单验证也需要这个属性

```js
   <el-form style="width: 80%" :model="tmForm">
        <el-form-item label="品牌名称" label-width="100px" >
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
```

收集LOGO图片

这里收集数据不能使用v-model，因为不是表单元素，我们这里用了另一个el-upload

action：设置图片上传的地址

on-success 可以检测到图片上传成功，图片上传成功会执行一次

before-upload ：可以在上传图片之前，会执行一次

```vue
   <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2M
            </div>
          </el-upload>
```

```js
 //图片上传成功
    handleAvatarSuccess(res, file) {
      //res：上传成功之后返回的前端数据
      //file：同上
      //收集品牌图片数据
      this.tmForm.logoUrl = res.data
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
```

##### 2发请求

当点击【添加品牌】里的【确定】按钮时

1. 将弹出的对话框隐藏
2. 发请求（添加品牌
3. 如果成功，弹出一个message框：可能是添加成功，也有可能是修改成功，然后重新获取新的品牌列表

```vue
<el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
```

笔记是在中午和晚上总结的，所以步骤会有点混乱，老师是先发请求，完成功能后再完成的表单验证，这里我提前表单验证

Form 组件提供了表单验证的功能，只需要通过`rules` 属性传入约定的验证规则，并将 Form-Item 的 `prop`属性设置为需校验的字段名即可。校验规则参见 [async-validator](https://github.com/yiminghe/async-validator)（element-ui原话）

```vue
 <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
```

```js
data(){
return{
 //表单验证规则
      rules: {
        tmName: [
          //required：必须验证的字段，message：提示信息，trigger：用户行为，blur失焦，change发生改变
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          {
            min: 2, //字符长度
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'change',
          },
        ],
        //图片格式、大小不在这里验证，因为他不是表单元素， 在beforeAvatarUpload方法中有校验规则
        logoUrl: [{ required: true, message: '请上传品牌logo' }],
      },
}
}
```

发请求

```js
addOrUpdateTradeMark() {
      //当全部字段验证通过在执行操作
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false
          //发请求
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          )
          if (result.code == 200) {
            //element-ui的消息提示
            this.$message({
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功',
              type: 'success',
            })
            //判断是修改还是添加操作，修改则留在当前页，添加返回第一页
            this.handleCurrentChange(this.tmForm.id ? this.page : 1)
            this.getPageList()
          }
        } else {
          this.$message.error('信息未填写完整')
          return false
        }
      })
    },
```

完善效果，点击不同按钮显示不同

```vue
<el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
```

#### 3.删除

![image-20220919094028254](C:\Users\15363\AppData\Roaming\Typora\typora-user-images\image-20220919094028254.png)

当点击【删除】按钮时，会弹出一个弹框【确定要删除吗】，然后有【确定】和【取消】两个按钮

点击【删除】按钮，给【删除】绑定点击事件`deleteTradeMark`，要传参数（你点击该品牌的信息—row）

弹出一个弹框，里面是【确定删除】还是【取消】

确定后，发请求删除该品牌，然后再发请求获取品牌列表数据；

```js
 deleteTradeMark(row) {
      this.$confirm(`确定删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        //点击确定触发
        .then(async () => {
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
          if (result.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.handleCurrentChange(
              this.list.length > 1 ? this.page : this.page - 1
            )
            this.getPageList()
          }
        })
        //点击取消触发
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
```

