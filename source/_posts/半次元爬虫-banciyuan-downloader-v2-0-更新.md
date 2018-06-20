---
title: 半次元爬虫 banciyuan-downloader v2.0 更新
date: 2018-06-20 11:01:33
categories: python
tags: [python, 爬虫, 二次元]
mathjax: false
comments: true
---

{% asset_img pic0.png %}

<!--more-->

---

这段时间[半次元](https://bcy.net)前端做了很大的改动，先后更新了两版，之前的小版本`v1.1`也不能用了，索性更新了[banciyuan-downloader v2.0](https://github.com/tankeryang/banciyuan-downloader)版本，做了很大的改变，代码全部封装到`Downloader`类里，下面是更新内容

# banciyuan-downloader v2.0 

* 更新时间: `2018-06-18`

## 更新原因

* 半次元前端改版，需要重写脚本以适应HTML解析
* 半次元登录认证改为通过cookie表单传递认证，需重写登录方法
* 脚本太乱，需进行封装

## 更新内容

### 模块化

将方法封装到类`Downloader`里，优化接口方法，可提供外部调用

### 实现功能

* [x] 根据`coser_id`批量下载某个coser发布的作品的所有图片
* [x] 图片保存在以 __coser名__ 命名的文件夹内
* [x] 图片按 __coser发布的作品__ 分文件夹保存，文件夹命名以 __作品标签__ 拼接而成
* [x] 若有相同标题的作品，则命名文件夹时会加上 __顺序编号后缀__ 防止文件名冲突
* [x] 图片命名格式为`%num%.jpg`/`%num%.png`，其中`%num%`为从`1`开始的 __编号__
* [x] 支持智能下载 __本地没有的作品__，本地已有的作品 __不会__ 重复下载
* [x] 支持 __断点续传__ （从断连作品的下一个作品开始下载，若断连作品没下载完，则会丢失一部分断连作品的图片，其余均不影响）
* [x] 支持超时自动重试
* [x] 支持下载指定作品
* [x] 根据频繁I/O进行 __多线程优化__
* [ ] 不支持无半次元账号的下载，因为有 __只有粉丝可见__ 的限制，最好注册一个半次元账号
* [ ] 只有粉丝可见的作品需关注该coser后方可下载
* [ ] 暂时不支持只下载`COS`类的作品，因为半次元改版后没有对`COS`和`绘画`之类的做分类，都在同一`url`下

### 依赖的库

我的测试环境:

* python 3.6.4
* beautifulsoup 4.5.3
* requests 2.13.0
* lxml 3.7.2

### 如何使用

* 直接运行`run.py`

    先执行:

    ```python
    python run.py
    ```

    后续步骤参考[v1.0的Usage](https://github.com/tankeryang/banciyuan-downloader#usage)

* 自定义实现

    因为进行了 __模块化__，所以可以自行实例化一个`Downloader`对象来调用方法实现功能，下面给出简单例子:

    __分部执行__

    ```python
    from bcy_downloader import Downloader

    # 实例化Downloader对象
    # 用户名: test
    # 密码: 123
    # coser_id: 770554
    # 下载目录: E:/banciyuan
    dl = Downloader(account='test', password='123', coser_id='770554', bcy_home_dir='E:/banciyuan')

    # 获取作品url列表
    dl.get_post_url_list()

    # 或者自定义下载作品列表
    dl.post_url_list = ["https://bcy.net/item/detail/6558754255610577155", "https://bcy.net/item/detail/6554677621064466692"]

    # 查看作品url列表
    print(dl.post_url_list)

    # 查看本地已下载作品url列表
    print(dl.local_post_url_list)

    # 获取每个作品下所有图片url，得到download_data
    dl.get_pics_url_list()

    # 查看download_data
    # 格式如下
    # {
    #   '$(post_url)':
    #   {
    #     'post_name': $(post_name),
    #     'pics_url_list': $(pics_url_list)
    #   }
    # }
    # 例子:
    # {
    #   "https://bcy.net/item/detail/6558754255610577155":
    #   {
    #     'post_name': "碧蓝航线-COS-舰娘-场照-返图-cp22-三三笠",
    #     'pics_url_list': [
    #       'https://img5.bcyimg.com/user/770554/item/c0je3/63y6vuq8hhgfmge7nrqcaqkpspyfszj5.jpg?1',
    #       'https://img9.bcyimg.com/user/770554/item/c0je3/esdrtvchzzkfzm74ezd8idx04ennjjfr.jpg?2',
    #       ......
    #       'https://img9.bcyimg.com/user/770554/item/c0je3/zfiyptpdcpasyz0itzh7ndtmpiysw8uy.jpg?9'
    #     ]
    #   }
    # }
    print(dl.download_data)

    # 根据download_data获取图片
    dl.get_pics()
    ```

    __一键执行__
    ```python
    from bcy_downloader import Downloader

    # 实例化Downloader对象
    # 用户名: test
    # 密码: 123
    # coser_id: 770554
    # 下载目录: E:/banciyuan
    dl = Downloader(account='test', password='123', coser_id='770554', bcy_home_dir='E:/banciyuan')

    # 自动下载
    dl.run()
    ```

## 注意

`v2.0`版本下载时会在 __每个作品对应的文件夹__ 里建一个`url.local`文件，里面写入的是该作品对应的`url`。该文件主要用于 __判断本地是否已经下载过该`url`对应的作品，以实现智能无重复下载，请不要随意删除__

# FAQ
有何疑问可在[github](https://github.com/tankeryang/banciyuan-downloader)发布[issue](https://github.com/tankeryang/banciyuan-downloader/issues) ，本人会尽量及时查看