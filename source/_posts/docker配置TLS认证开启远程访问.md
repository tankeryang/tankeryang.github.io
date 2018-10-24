---
title: docker配置TLS认证开启远程访问
date: 2018-10-24 15:36:27
categories: docker
tags: [docker, portainer]
mathjax: False
comments: True
---

{% asset_img pic0.png %}

<!--more-->

# 前言

docker在今天对应用开发，运维管理来说已经是必备组件了，web应用的部署，微服务搭建，CI/CD，集群管理哪都有它。关于docker使用这里就不细说了，参考[官方文档](https://docs.docker.com/)。

当我们有多台服务器，每台服务器有多个docker容器，统一管理与监控docker集群就变得非常重要。轻量级的开源docker管理工具有[portainer](https://www.portainer.io/)，重量级的有[rancher](https://www.cnrancher.com)。如果服务不多，集群节点不多的话一般 __portainer__ 足以胜任。如果是大型集群的话可以考虑 __rancher__。

想要中心化的管理docker容器，那么就需要docker容器开启远程访问。在讲怎么开启远程访问之前，要先稍微讲一下 __docker容器进程__ 和 __docker守护进程__：

- __docker容器进程__

    顾名思义，就是运行在docker容器中的应用进程，比如你用docker启动的web应用，数据库等

- __docker守护进程__

    docker的设计是`C/S`模式，docker守护进程（server/服务端）运行在宿主机上，就是你运行docker容器的服务器。当你装完docker并敲下`service docker start`时，docker守护进程就启动了，它默认监听`/var/run.docker.sock`（unix域套接字）文件, 你可以通过`docker`命令（client/客户端）来对容器进行一系列操作，因为 __本机__ 的 __docker客户端__ 是默认通过`/var/run.docker.sock`来与 __docker守护进程__ 进行通信的

稍微明白了 __docker容器进程__ 与 __docker守护进程__ 后，你会发现，只有通过docker守护进程，才能与docker容器进行交互。而docker守护进程默认只监听本地的`/va/run/docker.sock`，因此只能在本地通过`docker`命令操作容器。

能让远程docker客户端访问容器，我们就要让docker守护进程能监听远程访问的端口。docker是采用 __socket__ 进行server和client的连接的，它提供了`tcp`和`fd`两种方式，一般采用`tcp`方式。

# 配置远程访问

## 不安全的配置

直接通过`dockerd`命令配置守护进程：

```bash
# 默认监听 6379 端口
> $ dockerd -H 0.0.0.0
```

这样所有ip都能通过`docker -H <remote-dcoker-server_ip>:6379 [OPTION]`命令与远程的docker守护进程通信，操作docker容器，生产上不提倡这种做法。

## 安全的配置

通过 __TLS（Transport Layer Security - 安全传输层协议）__ 来进行远程访问（[百度百科 - TLS](https://baike.baidu.com/item/TLS)）。我们需要在远程docker服务器（运行docker守护进程的服务器）生成 __CA证书，服务器证书，服务器密钥__，然后自签名，再颁发给需要连接远程docker容器的服务器。下面是具体操作：

{% note info %}
以下操作在`ubuntu 16.04 server`上测试成功，其他系统自行参考
{% endnote %}

### 修改`openssl`配置的CA部分

> __ubuntu 16.04__ 下 __openssl__ 配置文件位置：`/usr/lib/ssl/openssl.cnf`，其他系统可参考

- 修改如下部分：

    ```conf
    [ CA_default ]

    dir = <填你的路径>  # 下面的操作以 /etc/openssl 为例
    ```

- 创建相应文件和文件夹：

    ```bash
    > $ cd /etc/openssl  # 没有就新建
    > $ mkdir -p {certs,private,tls,crl,newcerts}
    > $ echo 00 > serial  # 注意serial要有数字，不然会报错
    > $ touch index.txt
    ```

### 生成私钥并自签证书

```bash
> $ openssl genrsa -out private/cakey.pem -des 1024  # 生成私钥
> $ openssl req -new -x509 -key private/cakey.pem -days 3650 -out cacert.pem  # 自签证书: 执行后会让你填写一些配置
```

### 颁发证书

- 生成要颁发证书的密钥文件

    ```bash
    > $ openssl genrsa -out private/test.key 1024
    ```

- 生成证书请求

    ```bash
    > $ openssl req -new -key private/test.key -days 3650 -out test.csr
    ```

- 颁发证书

    ```bash
    > $ openssl ca -in test.csr -out certs/test.crt -days 3650  # 这里也需要填写一些配置，最好和前面自签证书的配置保持一致
    ```

### 配置docker守护进程使用TLS认证并监听tcp端口

```bash
> $ service docker stop  # 需先停止 docker 服务
> $ dockerd --tls \
> --tlscacert /etc/openssl/cacert.pem \
> --tlscert /etc/openssl/certs/test.crt \
> --tlskey /etc/openssl/private/test.key \
> -H 0.0.0.0:2375  # 默认 6379 端口，可自定义
> $ service docker start  # 重启 docker 服务
```

### 保存CA证书，服务器证书，服务器密钥

重启docker后，你会发现在远程docker服务器上使用`docker`命令不起作用了，这是因为docker守护进程不再监听`var/run/docker.sock`文件，而是监听tcp端口了。所以如果要在远程docker服务器使用`docker`命令就要加上上面的参数`--tls`，`--tlscacert`，`--tlscert`，`--tlskey`，例如：

```bash
> $ docker --tls \
> --tlscacert /etc/openssl/cacert.pem \
> --tlscert /etc/openssl/certs/test.crt \
> --tlskey /etc/openssl/private/test.key \
> -H $HOSTNAME:2375 ps
```

这样就太麻烦了，所以我们用下面的做法，将证书，密钥保存到`~/.docker`文件夹，再配置环境变量：

```bash
> $ cd ~/.docker  # 没有就新建
> $ cp /etc/openssl/cacert.pem ./ca.pem
> $ cp /etc/openssl/newcerts/00.pem ./cert.pem
> $ cp /etc/openssl/private/test.key ./key.pem
> $ echo "export DOCKER_HOST=tcp://$HOSTNAME:2375" >> /etc/profile
> $ echo "export DOCKER_TLS_VERIFY=1" >> /etc/profile
> $ source /etc/profile
```

这时你再使用`docker`命令就没问题了。

# 配置portainer添加远程docker集群

- 添加节点

    {% asset_img pic1.png %}

- 配置节点属性

    {% asset_img pic2.png %}

    > 需要上传的文件对应为（以下目录在远程docker服务器上）
    > - TLS CA certificate: `~/.docker/ca.pem`
    > - TLS certificate: `~/.docker/cert.pem`
    > - TLS key: `~/.docker/key.pem`

点击`Add endpoint`，完成添加。

关于怎么安装 __portainer__，这里就不介绍了，详细内容参考[官方文档](https://www.portainer.io/install.html)