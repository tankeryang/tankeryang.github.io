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
        # config
        super(Connection, self).__init__(config=config)
        if config is None:
            config = Config()
        elif not isinstance(config, Config):
            config = config.clone(into=Config)
        self._set(_config=config)

        # host相关
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

```python class Connection
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

```python Connection.__init__()
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

```python Connection.__init__()
super(Connection, self).__init__(config=config)
if config is None:
    config = Config()
elif not isinstance(config, Config):
    config = config.clone(into=Config)
self._set(_config=config)
```
`config`成员变量是一个`Config`对象，它是调用父类`Context.__init__()`方法来初始化的。`Context.__init__()`定义如下:
```python class Context
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
```python class DataProxy
def _set(self, *args, **kwargs):
    if args:
        object.__setattr__(self, *args)
    for key, value in six.iteritems(kwargs):
        object.__setattr__(self, key, value)
```
再通过加了`@property`的`config()`函数，使得`connection`对象能直接用`self.config`来引用`_config`:
```python class DataProxy
@property
def config(self):
    return self._config

@config.setter
def config(self, value):
    self._set(_config=value)
```

### host, user, port

```python Connection.__init__()
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

ok，初始化的参数我们先到这里，因为它给的示例也就只有个`host`而已，一会再讲`config_kwags`和深入下`config`。我们现在先去报错的地方:
```python class Connection
kwargs = dict(
    self.connect_kwargs,
    username=self.user,
    hostname=self.host,
    port=self.port,
)
if self.gateway:
    kwargs["sock"] = self.open_gateway()
if self.connect_timeout:
    kwargs["timeout"] = self.connect_timeout
# Strip out empty defaults for less noisy debugging
if "key_filename" in kwargs and not kwargs["key_filename"]:
    del kwargs["key_filename"]
# Actually connect!
self.client.connect(**kwargs)  # 就是你了
```
看到最后一行，传参时将字典`kwargs`传了过去，`kwargs`里除了`usr`，`host`，`port`之外，还有一个`connect_kwargs`。我们看看`client.connect()`的定义:
```python
def connect(
        self,
        hostname,
        port=SSH_PORT,
        username=None,
        password=None,      # 你
        pkey=None,          # 你
        key_filename=None,  # 还有你
        timeout=None,
        allow_agent=True,
        look_for_keys=True,
        compress=False,
        sock=None,
        gss_auth=False,
        gss_kex=False,
        gss_deleg_creds=True,
        gss_host=None,
        banner_timeout=None,
        auth_timeout=None,
        gss_trust_dns=True,
        passphrase=None,
    )
```
看到`6, 7, 8`行没？that's it.

接下来我们改写一下一开始的示例:

* 使用`password`:
    ```python
    >>> from fabric import Connection
    >>> # my_password为10.10.22.13的root用户密码
    >>> conn = Connection('10.10.22.13', user='root', connect_kwargs={'password': '${my_password}'})
    >>> conn.run("uname -s")

    Linux
    ```

* 使用`key_filename`:
    ```python
    >>> from fabric import Connection
    >>> # 使用key_filename参数前提需将你的ssh公钥（.pub后缀）添加到远程服务器的.ssh/authorized_keys file里
    >>> # id_rsa为私钥
    >>> conn = Connection('10.10.22.13', user='root', connect_kwargs={'key_filename': '${path to local .ssh dir}/${your id_rsa file}'})
    >>> conn.run("uname -s")

    Linux
    ```
朋友们，让我们举杯庆祝一下吧

### connect_kwargs
我们趁此机会窥视一下`connect_keargs`的相关部分
```python Connection.__init__()
self.connect_kwargs = self.resolve_connect_kwargs(connect_kwargs)
```
我们看到，当`connect_kwargs`为`None`时，会通过`config`成员变量动态增加属性`connect_kwargs`属性:
```python Connection.resolve_connect_kwargs()
def resolve_connect_kwargs(self, connect_kwargs):
    if connect_kwargs is None:
        connect_kwargs = self.config.connect_kwargs  # 调用__getattr__()动态增加属性
    elif "key_filename" in self.config.connect_kwargs:
        kwarg_val = connect_kwargs.get("key_filename", [])
        conf_val = self.config.connect_kwargs["key_filename"]
        connect_kwargs["key_filename"] = conf_val + kwarg_val

    if "identityfile" in self.ssh_config:
        connect_kwargs.setdefault("key_filename", [])
        connect_kwargs["key_filename"].extend(
            self.ssh_config["identityfile"]
        )

    return connect_kwargs
```
在`__getattr__`方法里又调用了类方法`_get()`将`connect_kwargs`传到`key`:
```python DataProxy.__getattr__()
def __getattr__(self, key):
    try:
        return self._get(key)  # 调用_get()
    except KeyError:
        if key in self._proxies:
            return getattr(self._config, key)
        err = "No attribute or config key found for {!r}".format(key)
        attrs = [x for x in dir(self.__class__) if not x.startswith('_')]
        err += "\n\nValid keys: {!r}".format(
            sorted(list(self._config.keys()))
        )
        err += "\n\nValid real attributes: {!r}".format(attrs)
        raise AttributeError(err)
```
调用`_get()`后返回一个`DataProxy`对象`value`:
```python DataProxy._get()
def _get(self, key):
    if key in (
        '__setstate__',
    ):
        raise AttributeError(key)
    value = self._config[key]
    if isinstance(value, dict):
        keypath = (key,)
        if hasattr(self, '_keypath'):
            keypath = self._keypath + keypath
        root = getattr(self, '_root', self)
        value = DataProxy.from_data(
            data=value,
            root=root,
            keypath=keypath,
        )
    return value
```
是不是晕了？呵呵没关系，我他妈也是。就让他随风而去吧

## fab命令
安装完`fabric`后会连同`fab`工具一起装到`python/bin`下，在终端输入`fab -h`查看命令参数
简单来说，`fab`干这么件事，__直接执行当前目录下的`fabfile.py`脚本里的函数__，下面介绍具体如何写`fabfile.py`

首先按照国际惯例，导入包:
```python
from fabric import Connection
from invoke import task
```

实例化`COnnection`对象:
```python
# ${}里的内容自行填充
conn = Connection("${remote host}", user='${remote user}', connect_kwargs={'password': "${remote user's password}"})
```

定义一个功能函数:
```python
@task
def execute(c):
    conn.run("uname -s")
```
这个`@task`装饰器是必须加的，保证`fab`能直接执行，参数`c`不用管它，但不能定义成与你实例化的`conn`同名，原因后面会说

保存为`fabfile.py`:
```python fabfile.py
from fabric import Connection
from invoke import task

conn = Connection("${remote host}", user='${remote user}', connect_kwargs={'password': "${remote user's password}"})

@task
def execute(c):
    conn.run("uname -s")
```

在终端执行（服务器系统为Linux）:
```shell
$ fab execute
Linux  # Linux下的输出
```

说回参数`c`，`c`在这里实际上是本地连接，是`localhost`的一个`Connection`对象。我们可以试一下:
```python fabfile.py
from fabric import Connection
from invoke import task

@task
def execute(c):
    c.run("uname -s")
```
在终端执行（我的系统为Mac）:
```shell
$ fab execute
Darwin  # Mac下的输出
```
一目了然

到这里大家应该大致明白`fab`是干啥的了。这样的玩法就多了，下面举几个例子:
```python fabfile.py
from fabric import Connection
from invoke import task

conn = Connection("${remote host}", user='${remote user}', connect_kwargs={'password': "${remote user's password}"})

@task
def uname_local(c):
    c.run("uname -s")

# 列出某路径下的文件
@task
def ls_remote(c, dir_path):
    with conn.cd(dir_path):
        conn.run("ls -la")

# 还能在函数里实例化Connection对象
@task
def uname_rmt(c, host, user, password):
    con = Connection(host, user=user, connect_kwargs={'password': password})

    con.run("uname -s")
```
执行:
```shell
$ fab uname_local
Darwin

$ fab ls_remote /home
trendy
td_root

$ fab uname_rmt 10.10.22.13 root ******* # 这个密码就不放出来了
Linux
```

具体的`Connection`还封装了哪些命令，就需要大家在使用中探索了

# fab 1.x 与 fab 2.x

`fab 1.x`与`fab 2.x`最大的不同就是`fab 2.x`没有了`env`模块，所有的操作都基于`Connection`对象完成，对于`fab`命令的调用，将暴露方法封装到`invoke`模块，使其独立出来。这是我觉得最大的不同。只是现在还没有很多的博客写到`fab 2.x`的一些特性，官方文档也很简单，还是需要大家花时间阅读下源码才能清楚里面的逻辑

有时间的话会再对`fabric`做个详细剖析
