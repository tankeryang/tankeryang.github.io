---
title: python-eve 最佳实践
date: 2019-08-22 23:06:57
categories:
tags: [python, python-eve, web]
mathjax:
comments: true
---

{% asset_img pic0.png %}

实在找不到图了......

<!-- more -->

最近因为工作的关系，被要求用到 [Eve](https://docs.python-eve.org/en/stable/) 这个框架，需求简要概括就是对一个 mongo 表的 crud，本来用 flask 直接一把梭完就一个下午的事，但因为 “工作” 的关系，不得不盘一下 __Eve__

# Eve 简介

详细看了 Eve 的源码，他是一个对 __Flask__ 高度定制化的，以 __配置__ 为驱动的 restful 框架，根据配置文件生成 __endpoint url__ 和 __endpoint method__，以 __http method__ 对应 __crud__ 操作。__Eve__ 的数据持久化原生支持 __mongodb__，配置了 __mongo__ 相关的参数后，对 __endpoint url__ 的请求操作相当于直接对对应的 mongo 表进行 crud

下面上官方文档的例子进行说明

## 快速开始

- 先启动一个 mongodb，这里用 docker 启一个 mongodb 容器 (这里选 3.4 版本的和公司一致，你可以自行选择其他版本)
    ```bash
    > $ docker run --name mongodb -p 27017:27017 \
        -v /srv/mongodb/etc:/etc/mongo \
        -v /srv/mongo/data/db:/data/db \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
        -d mongo:3.4-xenial
    ```

- 进入容器，创建 `test` 数据库，并设置用户 `test`，密码 `test123`
    - 进入容器的 mongodb 交互终端
        ```bash
        > $ docker exec -it mongodb mongo -u admin -p admin123 --authenticationDatabase admin
        ```
    - 创建 `test` 数据库，并设置用户 `test`，密码 `test123`
        ```bash
        > use test
        > db.createUser({user: 'test', pwd: 'test123', roles:[{role: 'readWrite', db: 'test'}]})
        ```

- 假设你当前目录为 `workspace`，在这个目录下新建 `settings.py` 文件，顾名思义，这就是 __配置文件__
    > 文件名可以自定义，在初始化 Eve 对象的时候传进去就好了，默认是 `settings.py`

    ```python settings.py
    # 下面为 mongo 相关配置
    MONGO_HOST = 'localhost'
    MONGO_PORT = 27017
    MONGO_USERNAME = 'test'
    MONGO_PASSWORD = 'test123'
    MONGO_AUTH_SOURCE = 'test'
    MONGO_DBNAME = 'test'

    # 定义 resource 和 item 能够接受的 http method
    # 这里统一规定，resource 相当于 mongo collection，item 相当于 mongo document
    RESOURCE_METHODS = ['GET', 'POST', 'DELETE']
    ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']

    # 定义 item schema，schema 相当于 mongo document 的字段定义
    schema = {
        'firstname': {
            'type': 'string',
            'minlength': 1,
            'maxlength': 10,
        },
        'lastname': {
            'type': 'string',
            'minlength': 1,
            'maxlength': 15,
            'required': True,
            'unique': True,
        },
        'role': {
            'type': 'list',
            'allowed': ["author", "contributor", "copy"],
        },
        'location': {
            'type': 'dict',
            'schema': {
                'address': {'type': 'string'},
                'city': {'type': 'string'}
            },
        },
        'born': {
            'type': 'datetime',
        },
    }

    # 定义 resource，名为 people
    people = {
        'item_title': 'person',

        # 默认的请求 item 的 endpoint path 为 '/people/<mongo ObjectId>'，这样不太方便，
        # 我们可以自定义 item 的 endpoint path，这里用 lastname，因为是 unique 字段
        'additional_lookup': {
            'url': 'regex("[\w]+")',
            'field': 'lastname'
        },

        # cache 相关
        'cache_control': 'max-age=10,must-revalidate',
        'cache_expires': 10,

        # 这里会覆盖上面定义的全局 RESOURCE_METHOD
        'resource_methods': ['GET', 'POST'],

        # 指定 schema
        'schema': schema
    }

    # 定义 domain，相当于将 people resource 绑定到 ‘people’ 这个 resource endpoint
    DOMAIN = {'people': people}
    ```

- 接着新建 `main.py` 文件
    > 同样文件名可自定义，这个文件主要实例化 Eve 对象，相当于入口文件

    ```python main.py
    from eve import Eve
    app = Eve()

    if __name__ == '__main__':
        app.run()
    ```

- 执行 `main.py` 这个脚本
    ```bash
    > $ python main.py

    * Serving Flask app "eve" (lazy loading)
    * Environment: production
    WARNING: This is a development server. Do not use it in a production deployment.
    Use a production WSGI server instead.
    * Debug mode: off
    * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
    ```

- `curl` 测试一下 api
    ```bash
    > $ curl -i http://127.0.0.1:5000/
    ```

    如果没有意外的话，你会得到下面的返回

    ```json
    HTTP/1.0 200 OK
    Content-Type: application/json
    Content-Length: 62
    Server: Eve/0.9.2 Werkzeug/0.15.4 Python/3.6.8
    Date: Fri, 23 Aug 2019 09:32:08 GMT

    {"_links": {"child": [{"href": "people", "title": "people"}]}}
    ```

    请求一下 `people` 资源

    ```bash
    > $ curl http://127.0.0.1:5000/people
    ```

    如果没有意外的话，你会得到下面的返回

    ```json
    {
        "_items": [],
        "_links": {
            "self": {
                "href": "people",
                "title": "people"
            },
            "parent": {
                "href": "/",
                "title": "home"
            }
        }
    }
    ```

    试一下 `DELETE` http method

    ```bash
    > $ curl -X DELETE http://127.0.0.1:5000/people
    ```

    你应该会得到

    ```json
    {
        "_status": "ERR",
        "_error": {
            "code": 405,
            "message": "The method is not allowed for the requested URL."
        }
    }
    ```

    因为我们在 `people` 里配置了 `'resource_methods': ['GET', 'POST']`，除了 `GET`、`POST` 外，其他请求都是不成功的

    我们 `POST` 一些数据过去

    ```bash
    # POST 多条数据传 list，单条直接 json
    > $ curl -X POST \
        -H 'Content-Type: application/json' \
        -d '[{"firstname": "barack", "lastname": "obama"}, {"firstname": "mitt", "lastname": "romney"}]' \
        http://127.0.0.1:5000/people
    ```

    返回结果为

    ```json
    {
        "_status": "OK",
        "_items": [
            {
                "_updated": "Fri, 23 Aug 2019 10:45:30 GMT",
                "_created": "Fri, 23 Aug 2019 10:45:30 GMT",
                "_etag": "fc6d5b3a95813465269c57d180ef1716f700cc6a",
                "_id": "5d5fc3cae85c86602304ef3b",
                "_links": {
                    "self": {
                        "title": "person",
                        "href": "people/5d5fc3cae85c86602304ef3b"
                    }
                },
                "_status": "OK"
            },
            {
                "_updated": "Fri, 23 Aug 2019 10:45:30 GMT",
                "_created": "Fri, 23 Aug 2019 10:45:30 GMT",
                "_etag": "30761f80c263beb3b96fef0e07f5ec60ca4086e2",
                "_id": "5d5fc3cae85c86602304ef3c",
                "_links": {
                    "self": {
                        "title": "person",
                        "href": "people/5d5fc3cae85c86602304ef3c"
                    }
                },
            "_status": "OK"}
        ]
    }
    ```

    查看一下 mongo

    {% asset_img pic1.png %}

    已经自动创建了 `people` 表，并插入了刚刚传的两条数据

    我们请求一下 `item`，也就是 `people` 里的 `document`

    ```bash
    > $ curl -i http://127.0.0.1:5000/people/obama
    ```

    可以看到，我们直接用 `people/obama` 来请求资源，因为我们之前在 `people` 里定义了 `additional_lookup`，因此我们直接用 `last_name` 作为 `endpoint` 来访问，没有意外应该能得到下面的返回

    ```json
    {
        "_id": "5d5fc3cae85c86602304ef3b",
        "firstname": "barack",
        "lastname": "obama",
        "_updated": "Fri, 23 Aug 2019 10:45:30 GMT",
        "_created": "Fri, 23 Aug 2019 10:45:30 GMT",
        "_etag": "fc6d5b3a95813465269c57d180ef1716f700cc6a",
        "_links": {
            "self": {
                "title": "person",
                "href": "people/5d5fc3cae85c86602304ef3b"
            },
            "parent": {
                "title": "home",
                "href": "/"
            },
            "collection": {
                "title": "people",
                "href": "people"
            }
        }
    }
    ```

## 源码分析

Eve 的目录结构如下

```
eve
├── io/
├── methods/
├── tests/
├── __init__.py
├── auth.py
├── default_settings.py
├── defaults.py
├── endpoints.py
├── exceptions.py
├── flaskapp.py
├── logging.py
├── render.py
├── utils.py
├── validation.py
└── versioning.py
```

这里不会一一详解，只会分析和配置比较相关的，影响开发的部分，部分分析会在注释里呈现

### endpoints

Eve 初始化的时候 `__init__()` 方法会调用 `register_resource()` 方法来注册 `resource` 信息

```python flaskapp.py __init__()
# Use a snapshot of the DOMAIN setup for iteration so
# further insertion of versioned resources do not
# cause a RuntimeError due to the change of size of
# the dict
domain_copy = copy.deepcopy(self.config["DOMAIN"])
for resource, settings in domain_copy.items():
    self.register_resource(resource, settings)

# 这里 self.config 就是 settings.py 里的配置，self.config['DOMAIN'] 就是 DOMAIN = {'people': people}
```

`self.register_resource()` 方法会调用 `self._add_resource_url_rules(resource, settings)`，绑定 `endpoint url` 和 `endpoint method`

```python flaskapp.py register_resource()
# set up resource
self._set_resource_defaults(resource, settings)
self._validate_resource_settings(resource, settings)
self._add_resource_url_rules(resource, settings)  # 就是它
```

`_add_resource_url_rules()` 实现如下

```python _add_resource_url_rules()
def _add_resource_url_rules(self, resource, settings):
    """ Builds the API url map for one resource. Methods are enabled for
    each mapped endpoint, as configured in the settings.

    .. versionchanged:: 0.5
        Don't add resource to url rules if it's flagged as internal.
        Strip regexes out of config.URLS helper. Closes #466.

    .. versionadded:: 0.2
    """
    self.config["SOURCES"][resource] = settings["datasource"]

    if settings["internal_resource"]:
        return

    url = "%s/%s" % (self.api_prefix, settings["url"])

    pretty_url = settings["url"]
    if "<" in pretty_url:
        pretty_url = (
            pretty_url[: pretty_url.index("<") + 1]
            + pretty_url[pretty_url.rindex(":") + 1 :]
        )
    self.config["URLS"][resource] = pretty_url

    # resource endpoint
    # 这里调用 flask 的 add_url_rule() 方法绑定 resource url 和 method
    # collection_endpoint 函数是对 http method 的一些封装，下面会讲到
    endpoint = resource + "|resource"
    self.add_url_rule(
        url,
        endpoint,
        view_func=collections_endpoint,
        methods=settings["resource_methods"] + ["OPTIONS"],
    )

    # item endpoint
    # 这里调用 flask 的 add_url_rule() 方法绑 item url 和 method
    if settings["item_lookup"]:
        item_url = "%s/<%s:%s>" % (
            url,
            settings["item_url"],
            settings["item_lookup_field"],
        )

        # item_endpoint 函数是对 http method 的一些封装，下面会讲到
        endpoint = resource + "|item_lookup"
        self.add_url_rule(
            item_url,
            endpoint,
            view_func=item_endpoint,
            methods=settings["item_methods"] + ["OPTIONS"],
        )
        if "PATCH" in settings["item_methods"]:
            # support for POST with X-HTTP-Method-Override header for
            # clients not supporting PATCH. Also see item_endpoint() in
            # endpoints.py
            endpoint = resource + "|item_post_override"
            self.add_url_rule(
                item_url, endpoint, view_func=item_endpoint, methods=["POST"]
            )

        # also enable an alternative lookup/endpoint if allowed
        lookup = settings.get("additional_lookup")
        if lookup:
            l_type = settings["schema"][lookup["field"]]["type"]
            if l_type == "integer":
                item_url = "%s/<int:%s>" % (url, lookup["field"])
            else:
                item_url = "%s/<%s:%s>" % (url, lookup["url"], lookup["field"])
            endpoint = resource + "|item_additional_lookup"
            self.add_url_rule(
                item_url,
                endpoint,
                view_func=item_endpoint,
                methods=["GET", "OPTIONS"],
            )
```

`collections_endpoint` 和 `item_endpoint` 封装了 __http method__ 对应的 __mongo io 操作__

```python endpoints.py
def collections_endpoint(**lookup):
    """ Resource endpoint handler

    :param url: the url that led here

    .. versionchanged:: 0.3
       Pass lookup query down to delete_resource, so it can properly process
       sub-resources.

    .. versionchanged:: 0.2
       Relying on request.endpoint to retrieve the resource being consumed.

    .. versionchanged:: 0.1.1
       Relying on request.path for determining the current endpoint url.

    .. versionchanged:: 0.0.7
       Using 'utils.request_method' helper function now.

    .. versionchanged:: 0.0.6
       Support for HEAD requests

    .. versionchanged:: 0.0.2
        Support for DELETE resource method.
    """

    resource = _resource()
    response = None
    method = request.method
    if method in ("GET", "HEAD"):
        response = get(resource, lookup)
    elif method == "POST":
        response = post(resource)
    elif method == "DELETE":
        response = delete(resource, lookup)
    elif method == "OPTIONS":
        send_response(resource, response)
    else:
        abort(405)
    return send_response(resource, response)


def item_endpoint(**lookup):
    """ Item endpoint handler

    :param url: the url that led here
    :param lookup: sub resource query

    .. versionchanged:: 0.2
       Support for sub-resources.
       Relying on request.endpoint to retrieve the resource being consumed.

    .. versionchanged:: 0.1.1
       Relying on request.path for determining the current endpoint url.

    .. versionchanged:: 0.1.0
       Support for PUT method.

    .. versionchanged:: 0.0.7
       Using 'utils.request_method' helper function now.

    .. versionchanged:: 0.0.6
       Support for HEAD requests
    """
    resource = _resource()
    response = None
    method = request.method
    if method in ("GET", "HEAD"):
        response = getitem(resource, **lookup)
    elif method == "PATCH":
        response = patch(resource, **lookup)
    elif method == "PUT":
        response = put(resource, **lookup)
    elif method == "DELETE":
        response = deleteitem(resource, **lookup)
    elif method == "OPTIONS":
        send_response(resource, response)
    else:
        abort(405)
    return send_response(resource, response)
```

对应 `get`、`put` 等具体实现在 `method` 文件夹下

## 使用建议

在我的需求场景中，mongo 表有一个唯一标识字段 `urs`，__查询__ 操作直接通过这个字段查询，__插入__ 数据时，已存在则覆盖(upsert)，不存在则直接插入(insert)，__删除__ 时根据这个字段删除

但是因为 `POST` 只有 `collections_endpoint` 实现，而且还不能够 `upsert` 只能 `insert`，所以插入需要用 `PUT` 来做，因此 `settings.py` 里只设置 `item_methods`

settings 大致如下:

```python settings.py
import os

from schemas import urs_schema


# config =========================================================
# MONGO_HOST = os.environ.get('MONGO_HOST')
# MONGO_PORT = int(os.environ.get('MONGO_PORT'))
MONGO_URI = os.environ.get('MONGO_URI')
MONGO_USERNAME = os.environ.get('MONGO_USERNAME')
MONGO_PASSWORD = os.environ.get('MONGO_PASSWORD')
MONGO_AUTH_SOURCE = os.environ.get('MONGO_AUTH_SOURCE')
MONGO_DBNAME = os.environ.get('MONGO_DBNAME')

IF_MATCH = False

# domain =========================================================
offline_trading_account = {
    'item_title': 'urs',
    'id_field': 'urs',  # 比较关键的设置，将 id_field 设为你的唯一字段
    'item_url': 'regex("[\s\S]+")',
    'item_lookup_field': 'urs',
    'additional_lookup': {
        'url': 'regex("[\s\S]+")',
        'field': 'urs'
    },
    'resource_methods': [],  # resource_methods 为空
    'item_methods': ['GET', 'PUT', 'DELETE'],
    'schema': urs_schema
}

DOMAIN = {os.environ.get('MONGO_COLLECTION'): offline_trading_account}
```

在上面的快速开始中，你可能注意到，插入数据时，eve 会自动给你加上 `_updated`、`_created` 的 date 格式字段，你想动它又不知如何下手；还有它返回的 json 格式，可能并不符合需求。这时你就要利用到 __hook__ 的特性了。Eve 提供了一系列 __hook 函数__ 让你进行操作，这里贴上我定义的 hook 函数供参考，具体用法跟如何定义参考 Eve 文档

```python hooks.py
import json
from datetime import datetime

from flask import request, abort


def before_insert_urs(items):
    for item in items:
        item['updateTime'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        item.pop('_created')
        item.pop('_updated')


def before_replace_urs(item, original):
    item['updateTime'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    item.pop('_created')
    item.pop('_updated')


def after_fetched_urs(response):
    response.pop('_id')
    response['_status'] = 'OK'


def before_get_put_delete(resource, _request, lookup):
    if _request.headers.get('X-NEProxy-User') is None:
        abort(403)


def after_get_put_delete(resoure, _request, payload):
    code = payload.status_code
    data = payload.json.copy()

    if len(data) == 0:
        data['_status'] = 'OK'
    if data.get('_created'):
        data.pop('_created')
    if data.get('_updated'):
        data.pop('_updated')
    if data.get('_links'):
        data.pop('_links')

    payload.json.clear()
    payload.json['code'] = code
    payload.json['data'] = data

    payload.status_code = 200
    payload.data = json.dumps(payload.json).encode()
    payload.headers['Access-Control-Allow-Origin'] = '*'
```

在 app 对象里注册 hook 函数

```python init.py
from eve import Eve

from flask import jsonify

from hooks import (
    before_get_put_delete,
    before_insert_urs,
    before_replace_urs,
    after_fetched_urs,
    after_get_put_delete
)


def register_event_hook(app):
    # 这里 req131313_offline_trading_account 要和你定义的 resource 名一致，也就是 DOMAIN 的 key
    app.on_insert_req131313_offline_trading_account += before_insert_urs
    app.on_replace_req131313_offline_trading_account += before_replace_urs
    app.on_fetched_item_req131313_offline_trading_account += after_fetched_urs
    app.on_pre_GET += before_get_put_delete
    app.on_pre_PUT += before_get_put_delete
    app.on_pre_DELETE += before_get_put_delete
    app.on_post_GET += after_get_put_delete
    app.on_post_PUT += after_get_put_delete
    app.on_post_DELETE += after_get_put_delete


def create_app():
    app = Eve()
    register_event_hook(app)
    return app
```

hook 的原理其实就是在执行 `method` 里的函数时(如 `get`、`put`)，通过 `getattr` 获取到 `app` 对象注册的 hook 函数，然后调用执行，下面是代码片段

```python methods/common.py
def pre_event(f):
    """ Enable a Hook pre http request.

    .. versionchanged:: 0.6
       Enable callback hooks for HEAD requests.

    .. versionchanged:: 0.4
       Merge 'sub_resource_lookup' (args[1]) with kwargs, so http methods can
       all enjoy the same signature, and data layer find methods can seemingly
       process both kind of queries.

    .. versionadded:: 0.2
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        method = request.method
        if method == "HEAD":
            method = "GET"

        # 这里拿到的 event_name 就是我们 app 注册的 hook 函数名
        event_name = "on_pre_" + method
        resource = args[0] if args else None
        gh_params = ()
        rh_params = ()
        combined_args = kwargs

        if len(args) > 1:
            combined_args.update(args[1].items())

        if method in ("GET", "PATCH", "DELETE", "PUT"):
            gh_params = (resource, request, combined_args)
            rh_params = (request, combined_args)
        elif method in ("POST",):
            # POST hook does not support the kwargs argument
            gh_params = (resource, request)
            rh_params = (request,)

        # general hook
        # 通过 getattr 调用
        getattr(app, event_name)(*gh_params)
        if resource:
            # resource hook
            getattr(app, event_name + "_" + resource)(*rh_params)

        r = f(resource, **combined_args)
        return r

    return decorated
```

# 结语

在看了大部分的源码和文档之后，总结一下，Eve 这个框架实现的并不复杂，思想上非常符合 restful 风格，可以说是一个通用的，以配置为驱动的 restful 框架，但是也仅仅是通用而已了，因为它的 endpoint method 已经封装好了，你想要做一些改动，比如入参或返回，要通过 hook 来做，这样就很不友好而且很不规范，还仅支持 mongo，那就只能写些小接口玩玩了。或许这就是它原本的初衷呢？
