---
title: 服务器安装anaconda与配置jupyter反向代理
date: 2018-05-23 23:54:26
categories: 技术杂项
tags: [anaconda, jupyter, nginx, 反向代理]
mathjax: false
comments: true
---

{% asset_img pic0.png %}

最近在公司的服务器上搭环境和工具，折腾了一小会，记录一下

<!-- more -->

---

# 安装Anaconda

__公司服务器系统信息:__
> * Linux version: `4.4.0-116-generic (buildd@lgw01-amd64-021)`
> * Distribution: `Ubuntu 16.04.4 LTS`
> * gcc version: `5.4.0 20160609`
> * CPU info: `32  Intel(R) Xeon(R) CPU E5-2670 0 @ 2.60GHz` (双物理cpu，单个cpu 8核16线程...)
> * 内网ip: `10.10.22.13`

* 首先`ssh`到服务器，`cd`到一个非系统级的目录，下载anaconda安装脚本:
`wget https://mirrors4.tuna.tsinghua.edu.cn/anaconda/archive/Anaconda3-5.1.0-Linux-x86_64.sh`

* 执行安装脚本:
`sh Anaconda3-5.1.0-Linux-x86_64.sh`
{% note warning %}
* 若中途问你是否添加环境变量，请选择否，不然会覆盖系统的python环境变量
* 安装位置自选
{% endnote %}

* 设置软链接至`usr/local/bin`:
因为不设置环境变量，所以这一步是方便我们可以在命令行直接输入`可执行文件名` 执行`anaconda3/bin` 下的可执行文件，如`jupyter`
```shell
# 将anaconda3/bin/python解释器运行脚本软链接至/usr/local/bin/python36，python36可换成其他你喜欢的名字
ln -s ${path to anaconda3}/bin/python /usr/local/bin/python36

# 将anaconda3/bin/jupyter运行脚本软链接至/usr/local/bin/jupyter
ln -s ${path to anaconda3}/bin/jupyter /usr/local/bin/jupyter

# 还有什么要软链过去的请参照上面自便
```
在终端输入`python36`，`jupyter`查看是否生效

---

# 服务器配置jupyter

到重头戏了

这里有两个需求:
* 在公司内网能访问到juoyter服务的端口
* 在家时连上公司VPN能访问到jupyter服务的端口

## 首先生成jupyter配置文件
执行下面的命令:
```
jupyter notebook --generate-config
```

配置文件会生成在以下路径:
* Windows: `C:\Users\USERNAME\.jupyter\jupyter_notebook_config.py`
* OS X: `/Users/USERNAME/.jupyter/jupyter_notebook_config.py`
* Linux: `/home/USERNAME/.jupyter/jupyter_notebook_config.py`

## 生成密码与加密后的hash串
执行下面的命令，输入设定的密码
```
jupyter notebook password
```

hash文件生成在以下路径:
* Windows: `C:\Users\USERNAME\.jupyter\jupyter_notebook_config.json`
* OS X: `/Users/USERNAME/.jupyter/jupyter_notebook_config.json`
* Linux: `/home/USERNAME/.jupyter/jupyter_notebook_config.json`

## 配置`jupyter_notebook_config.py`
先`cd`进`.jupyter`目录，然后`vim jupyter_notebook_config.py`进行修改

在顶部添加下面的配置:
```python
c.NotebookApp.allow_origin = '*'
c.NotebookApp.ip = '*'
c.NotebookApp.open_browser = False
c.NotebookApp.password = u"sha1:bb7b06..."  # 这里将jupyter_notebook_config.json里的sha1串复制过来
c.NotebookApp.port = 9999  # 端口可设为其他，注意不要冲突
c.NotebookApp.trust_xheaders = True
```

## 配置hosts
以我的为例
```
10.10.22.13 fp-bd13
```

## 启动jupyter
用nohup在后台启动:
```shell
nohup jupyter notebook --allow-root &
```

浏览器访问`http://fp-bd13:9999`，看看效果。
{% note info %}
Tips: jupyter新的jupyter lab比notebook做了一些优化，界面也高端很多。只要在url后面加`/lab`就能立即享用
`http://fp-bd13:9999/lab`
{% endnote %}

## 配置反向代理
这一步是最坑爹的

我们公司内部的vpn统一登上这台服务器`172.17.22.229`，然后通过它再连`10.10.22.*`的机器。所以需要在`172.17.22.229`的nginx上配置反向代理，这样我们就能在外面访问到jupyter了

折腾了N久，最终配置如下:
```
map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
}
server{
        server_name fp.bd13.dev.jupyter;

        location / {
                proxy_pass http://10.10.22.13:9999;
                proxy_redirect off;
                proxy_set_header HOST $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
        }
}
```
重新加载下nginx的配置，在浏览器访问`fp.bd13.dev.jupyter`就能愉快地玩耍啦
