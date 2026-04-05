# Python 示例

这是一个 Python 后端示例文档，展示了如何使用 Python 构建服务器端应用。

## Python 简介

Python 是一种高级编程语言，以其简洁的语法和强大的生态系统而闻名，广泛用于后端开发、数据科学和机器学习等领域。

## Flask 框架示例

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, Flask!'

if __name__ == '__main__':
    app.run(debug=True)
```

## Django 框架示例

```python
# views.py
from django.http import HttpResponse

def hello(request):
    return HttpResponse("Hello, Django!")

# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello, name='hello'),
]
```

## 更多资源

- [Python 官方文档](https://docs.python.org/zh-cn/3/)
- [Flask 官方文档](https://flask.palletsprojects.com/zh/2.0.x/)
- [Django 官方文档](https://docs.djangoproject.com/zh-hans/4.0/)