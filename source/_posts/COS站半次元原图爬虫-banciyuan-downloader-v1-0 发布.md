---
title: COS站半次元原图爬虫 banciyuan-downloader v1.0 发布
date: 2017-10-29 17:14:13
categories: python
tags: [python, 爬虫, 二次元]
mathjax: false
comments: true
---
<strong><center><font color="#ff0000"><h1>请勿用于商业用途 尊重coser的版权 转载图片请注明Cn及链接</h1></font></center></strong>

{% asset_img 16.jpg %}

<!--more-->

---

今天突然看到一组 [《小魔女学院》的cos图](https://bcy.net/coser/detail/99095/1511757)，小姐姐美炸了。
> <i class="fa fa-wheelchair-alt" aria-hidden="true"></i>&nbsp;因为加载速度太慢，我只能调低了图片的分辨率，各位将就一下，想看原图的到上面的链接慢慢欣赏。

{% asset_img 1.jpg %}
{% asset_img 3.jpg %}
{% asset_img 4.jpg %}
{% asset_img 6.jpg %}
{% asset_img 9.jpg %}
{% asset_img 10.jpg %}
<br>

于是乎搜到了这位小姐姐[【cn:犬神洛洛子】](https://bcy.net/u/770554)
cos粉毛那位

{% asset_img 5.jpg %}
{% asset_img 6_.jpg %}
{% asset_img 42.jpg %}
{% asset_img 45.jpg %}
<br>

这是她的[半次元主页](https://bcy.net/u/770554)

{% asset_img coser_page.png %}
{% asset_img post_page.png %}
<br>

关注一波。想着有空写个爬虫来爬她的原图吧。结果越写添加的功能越多。现在这个版本我push到了[github](https://github.com/tankeryang/banciyuan-downloader)，上面有详细的使用方法。

## 目前版本支持功能情况
* [x] 根据```coser_id```批量下载某个coser发布的主题的所有图片
* [x] 图片保存在以 __coser名__ 命名的文件夹内
* [x] 图片按 __coser发布的主题__ 分文件夹保存，文件夹以主题标题命名
* [x] 若有相同标题的主题，则命名文件夹时会加上随机后缀防止文件名冲突
* [x] 图片命名格式为```%num%.jpg```/```%num%.png```，其中```%num%```为从```1```开始的 __编号__ 
* [x] 只下载 __最新__ 发布的图片，本地已有的 __不会__ 重复下载
* [x] 支持 __断点续传__ （从断连主题的下一个主题开始下载，若断连主题没下载完，则会丢失一部分断连主题的图片，其余均不影响）
* [ ] ~~无须提供半次元账号即可下载~~
* [ ] ~~下载指定主题~~
* [ ] ~~智能下载 __未下载过的主题__~~
* [ ] ~~无须提前关注就可下载 __粉丝可见的主题__~~

## 运行环境及python包版本（本人）
* __windows__ 10 1703-15063.674
* __python__ 3.6.1
* __beautifulsoup__ 4.5.3
* __requests__ 2.13.0
* __lxml__ 3.7.2

## 运行结果

{% asset_img home_folder.png %}
{% asset_img coser_folder.png %}
{% asset_img post_folder.png %}

## FAQ
有何疑问可在[github](https://github.com/tankeryang/banciyuan-downloader)发布[issue](https://github.com/tankeryang/banciyuan-downloader/issues) ，本人会尽量及时查看

## 疯狂打call
原图出处: [小魔女学园-主角三人搞事组cos](https://bcy.net/coser/detail/99095/1511757)
苏西·曼芭芭拉(粉毛) __cn__ :[犬神洛洛子](https://bcy.net/u/770554)
亚可·卡嘉莉(黑毛) __cn__ :real\_\_yami
洛蒂·杨森(黄毛) __cn__ :[樱群](https://bcy.net/u/48018)