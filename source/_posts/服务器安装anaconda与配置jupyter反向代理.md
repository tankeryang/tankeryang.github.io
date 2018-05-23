---
title: 服务器安装anaconda与配置jupyter反向代理
date: 2018-05-23 23:54:26
categories: 技术杂项
tags: [anaconda, jupyter, nginx, 反向代理]
mathjax: false
comments: true
---

{% asset_img pic1.png %}

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

首先`ssh`到服务器，`cd`到一个非系统级的目录，下载anaconda安装脚本:
```
wget https://mirrors4.tuna.tsinghua.edu.cn/anaconda/archive/Anaconda3-5.1.0-Linux-x86_64.sh
```

{% note danger %}
<i class="fa fa-spinner fa-pulse fa-lg margin-bottom" aria-hidden="true"></i>&nbsp;未完待续...有空继续...
{% endnote %}