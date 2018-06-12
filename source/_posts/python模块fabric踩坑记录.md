---
title: python模块fabric踩坑记录
date: 2018-06-11 16:50:41
categories: [python, 技术杂项]
tags: [python, fabric, 远程部署]
mathjax: false
comments:
---

{% asset_img pic0.jpeg %}

最近都在狂写脚本，好像变成 __半个运维__ 一样...
刚好有需求写些部署工具，于是了解到了[fabric](http://www.fabfile.org/)这个模块。下面简单带过一下

<!-- more -->

# 什么是Fabric

__引用fabric主页的介绍__

> Fabric is a high level Python (2.7, 3.4+) library designed to execute shell commands remotely over SSH, yielding useful Python objects in return

意思就是Fabric是基于SSH的远程执行命令，并返回可调用的python对象的框架
{% note info %}
Fabric`2.x`的版本与`1.x`相比，除了支持`python3`之外，还做了很多改动。网上很多博客都写的是`1.x`的版本，参考时要注意。
__这里主要分析`2.x`的版本__
{% endnote %}

安装什么的就不废话了，下面来用一下
参照他的示例:
```python
>>> from fabric import Connection
>>> result = Connection('web1.example.com').run('uname -s')
>>> msg = "Ran {.command!r} on {.host}, got this stdout:\n{.stdout}"
>>> print(msg.format(result))

Ran "uname -s" on web1.example.com, got this stdout:
Linux
```
一目了然

下面在公司服务器上测试一下
```python
# 服务器ip: 10.10.22.13
# 用户: root

>>> from fabric import Connection
>>> result = Connection('10.10.22.13', user='root').run('uname -s')
>>> msg = "Ran {.command!r} on {.host}, got this stdout:\n{.stdout}"
>>> print(msg.format(result))

Traceback (most recent call last):
  File "/Users/yang/workspace/PycharmProjects/FP-project/inventory_allocate/test/fabric_test.py", line 10, in <module>
    result = Connection("10.10.22.13", user='root').run("uname -s")
  File "<decorator-gen-3>", line 2, in run
  File "/Users/yang/anaconda3/lib/python3.6/site-packages/fabric/connection.py", line 29, in opens
    self.open()
  File "/Users/yang/anaconda3/lib/python3.6/site-packages/fabric/connection.py", line 501, in open
    self.client.connect(**kwargs)
  File "/Users/yang/anaconda3/lib/python3.6/site-packages/paramiko/client.py", line 424, in connect
    passphrase,
  File "/Users/yang/anaconda3/lib/python3.6/site-packages/paramiko/client.py", line 715, in _auth
    raise SSHException('No authentication methods available')
paramiko.ssh_exception.SSHException: No authentication methods available
```
呵呵，我他妈就知道，代码里一行ssh的参数毛都没见到，这么容易连上就有鬼了（微笑
没的说，填坑要紧

---

# 源码分析

分析报错
```python
Traceback (most recent call last):
  File "/Users/yang/workspace/PycharmProjects/FP-project/inventory_allocate/test/fabric_test.py", line 10, in <module>
    result = Connection("10.10.22.13", user='root').run("uname -s")
  File "<decorator-gen-3>", line 2, in run
  File "/Users/yang/anaconda3/lib/python3.6/site-packages/fabric/connection.py", line 29, in opens
    self.open()
  File "/Users/yang/anaconda3/lib/python3.6/site-packages/fabric/connection.py", line 501, in open
    self.client.connect(**kwargs)
  File "/Users/yang/anaconda3/lib/python3.6/site-packages/paramiko/client.py", line 424, in connect
    passphrase,
  File "/Users/yang/anaconda3/lib/python3.6/site-packages/paramiko/client.py", line 715, in _auth
    raise SSHException('No authentication methods available')
paramiko.ssh_exception.SSHException: No authentication methods available
```

我们可以看到调用堆栈上的错误回溯，定位到`line 501`，在实例化`Connection`对象后调用`client.connect(**kwargs)`时抽了...

直接摸过去，从`Connection`类出发往他祖宗上刨，下面先给出继承关系和`Connection`的关键部分，然后逐块拆分说明:

{% plantuml %}
object DataProxy
object Context
object Config
object Connection

DataProxy <|-- Context
DataProxy <|-- Config
Context <|-- Connection
{% endplantuml %}

```python connection.py
class Connection(Context):
    host = None
    original_host = None
    user = None
    port = None
    ssh_config = None
    gateway = None
    forward_agent = None
    connect_timeout = None
    connect_kwargs = None
    client = None
    transport = None
    _sftp = None
    _agent_handler = None

    def __init__(
        self,
        host,
        user=None,
        port=None,
        config=None,
        gateway=None,
        forward_agent=None,
        connect_timeout=None,
        connect_kwargs=None,
    ):

        super(Connection, self).__init__(config=config)
        if config is None:
            config = Config()
        elif not isinstance(config, Config):
            config = config.clone(into=Config)
        self._set(_config=config)

        shorthand = self.derive_shorthand(host)
        host = shorthand["host"]
        err = (
            "You supplied the {} via both shorthand and kwarg! Please pick one."  # noqa
        )
        if shorthand["user"] is not None:
            if user is not None:
                raise ValueError(err.format("user"))
            user = shorthand["user"]
        if shorthand["port"] is not None:
            if port is not None:
                raise ValueError(err.format("port"))
            port = shorthand["port"]

        # ssh_config
        self.ssh_config = self.config.base_ssh_config.lookup(host)

        # original_host
        self.original_host = host

        # host
        self.host = host
        if "hostname" in self.ssh_config:
            self.host = self.ssh_config["hostname"]

        # user
        self.user = user or self.ssh_config.get("user", self.config.user)

        # port
        self.port = port or int(self.ssh_config.get("port", self.config.port))

        if gateway is None:
            if "proxyjump" in self.ssh_config:
                hops = reversed(self.ssh_config["proxyjump"].split(","))
                prev_gw = None
                for hop in hops:
                    if prev_gw is None:
                        cxn = Connection(hop)
                    else:
                        cxn = Connection(hop, gateway=prev_gw)
                    prev_gw = cxn
                gateway = prev_gw
            elif "proxycommand" in self.ssh_config:
                gateway = self.ssh_config["proxycommand"]
            else:
                gateway = self.config.gateway
        self.gateway = gateway

        # forward_agent
        if forward_agent is None:
            forward_agent = self.config.forward_agent
            if "forwardagent" in self.ssh_config:
                map_ = {"yes": True, "no": False}
                forward_agent = map_[self.ssh_config["forwardagent"]]
        self.forward_agent = forward_agent

        # connect_timeout
        if connect_timeout is None:
            connect_timeout = self.ssh_config.get(
                "connecttimeout", self.config.timeouts.connect
            )
        if connect_timeout is not None:
            connect_timeout = int(connect_timeout)
        self.connect_timeout = connect_timeout

        # connect_kwargs
        self.connect_kwargs = self.resolve_connect_kwargs(connect_kwargs)

        # client
        client = SSHClient()
        client.set_missing_host_key_policy(AutoAddPolicy())
        self.client = client

        # transport
        self.transport = None
```

## 重要的成员变量

```python
host = None             # 主机名或IP地址: www.host.com, 66.66.66.66
original_host = None    # 同host
user = None             # 系统用户名: root, someone
port = None             # 端口号（远程执行某些应用需提供）
gateway = None          # 网关
forward_agent = None    # 代理
connect_timeout = None  # 超时时间
connect_kwargs = None   # 连接参数（记住这个，非常重要）
client = None           # 客户端
```

## 构造函数参数

```python
host
user=None
port=None
config=None
gateway=None
forward_agent=None
connect_timeout=None
connect_kwargs=None
```
这些就是我们在实例化`Connection`对象时可以控制的一些部分，比较重要的有`config`和`connection_kwargs`

## 构造函数主体

### config

```python
super(Connection, self).__init__(config=config)
if config is None:
    config = Config()
elif not isinstance(config, Config):
    config = config.clone(into=Config)
self._set(_config=config)
```
`config`成员变量是一个`Config`对象，它是调用父类`Context.__init__()`方法来初始化的。`Context.__init__()`定义如下:
```python
class Context(DataProxy):
    def __init__(self, config=None):
        config = config if config is not None else Config()
        self._set(_config=config)

        command_prefixes = list()
        self._set(command_prefixes=command_prefixes)

        command_cwds = list()
        self._set(command_cwds=command_cwds)
```
具体过程是`Context.__init__()`初始化时调用`_set()`绑定了`Config`成员对象`_config`:
```python
def _set(self, *args, **kwargs):
    if args:
        object.__setattr__(self, *args)
    for key, value in six.iteritems(kwargs):
        object.__setattr__(self, key, value)
```
再通过加了`@property`的`config()`函数，使得`connection`对象能直接用`self.config`来引用`_config`:
```python
@property
def config(self):
    return self._config

@config.setter
def config(self, value):
    self._set(_config=value)
```

### host, user, port

```python
shorthand = self.derive_shorthand(host)
host = shorthand["host"]
err = (
    "You supplied the {} via both shorthand and kwarg! Please pick one."  # noqa
)
if shorthand["user"] is not None:
    if user is not None:
        raise ValueError(err.format("user"))
    user = shorthand["user"]
if shorthand["port"] is not None:
    if port is not None:
        raise ValueError(err.format("port"))
    port = shorthand["port"]
```
这段是处理`host`参数的。`host`可以有下面集中传入形式:
```
user@host:port  # 例如: root@10.10.10.10:6666
user@host       # 例如: root@10.10.10.10
host:port       # 例如: 10.10.10.10:6666
host            # 例如: 10.10.10.10
```
前三种会调用`self.derive_shorthand(host)`分别解析出`self.host`，`self.user`和`self.port`，最后一种需单独传入`user`，`port`。
如果用前三种传入方式的话，记得不要再重复传入`user`或`port`了，会抛出异常

源码是真他妈长啊，注释就占了一两百行 (微笑

{% note danger %}
<i class="fa fa-spinner fa-pulse fa-lg margin-bottom" aria-hidden="true"></i>&nbsp;未完待续...有空继续...
{% endnote %}
