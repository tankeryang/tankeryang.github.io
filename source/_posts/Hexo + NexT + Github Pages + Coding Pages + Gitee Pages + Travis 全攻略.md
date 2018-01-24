---
title: Hexo + NexT + Github Pages + Coding Pages + Gitee Pages + Travis 全攻略
date: 2018-01-22 15:34:54
categories: 技术杂项
tags: [Hexo, NexT, Github Pages, Coding Pages, Gitee Pages, Travis]
mathjax: false
comments: true
---

{% asset_img pic1.png %}

<!--more-->

这几天刚更新了NexT主题，一直在修改细节，终于从5.1.x的版本更新到了6.0.x的版本，nodeJS和NPM也做了更新。本着 __互联网共享精神__，我在这里将 __如何搭建Hexo+NexT博客和如何规范化写作+构建+push的流程__ 做详细整理。
本人现在常用Windows，所以下面的过程都是基于Windows来展开的，MacOS和Linux仅供参考。

# 安装Hexo
## 安装node.js
{% note success %}
如果你已经安装了node.js，请忽略。
{% endnote %}

访问[node.js官网](https://nodejs.org/en/)，下载安装程序（msi文件）进行安装。

## 安装Git
{% note success %}
如果你已经安装了Git，请忽略。
{% endnote %}

访问[Git官网](https://git-scm.com/)，下载安装程序（exe文件）进行安装。

{% note warning %}
由于众所周知的原因，从上面的链接下载git for windows最好挂上一个代理，否则下载速度十分缓慢。也可以参考[这个页面](https://github.com/waylau/git-for-win)，收录了存储于百度云的下载地址。
{% endnote %}

## 安装Hexo
* __国内的朋友__，因为众所周知的原因，从npm直接安装hexo会非常慢，所以你需要用到 [__镜像源__](https://npm.taobao.org/)，参考上面的步骤，使用cnpm命令行工具代替默认的npm: 在windows控制台（cmd）里输入并执行`npm install -g cnpm --registry=https://registry.npm.taobao.org`，然后安装hexo: `cnpm install -g hexo-cli`

* __国外的朋友__，请直接打开windows控制台，输入`npm install -g hexo-cli`并执行。

---

# 建站
## 建立本地博客文件夹
在命令行执行如下命令，其中`<folder>`为文件夹路径
```bash
hexo init <folder>
cd <folder>
```
示例
```bash
hexo init C:/hexo/myblog
cd C:/hexo/myblog
```
__以下步骤均采用这个路径作为说明__

建立好后文件夹目录如下
```nohighlight
.
├── _config.yml
├── package.json
├── .gitignore
├── node_modules
├── scaffolds
├── source
|   ├── _posts
└── themes
```

其中

* `_config.yml`：博客的配置文件，可以在此配置大部分的参数。
* `package.json`：应用程序的信息。EJS, Stylus和Markdown renderer 已默认安装，您可以自由移除。
{% codeblock lang:json package.json %}
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "hexo": {
    "version": ""
  },
  "dependencies": {
    "hexo": "^3.2.0",
    "hexo-generator-archive": "^0.1.4",
    "hexo-generator-category": "^0.1.3",
    "hexo-generator-index": "^0.2.0",
    "hexo-generator-tag": "^0.2.0",
    "hexo-renderer-ejs": "^0.3.0",
    "hexo-renderer-stylus": "^0.3.1",
    "hexo-renderer-marked": "^0.3.0",
    "hexo-server": "^0.2.0"
  }
}
{% endcodeblock %}
* scaffolds：模板文件夹，当您新建文章时，Hexo会根据scaffold来建立文件。
* source：资源文件夹，存放用户资源的地方。除`_posts`文件夹之外，开头命名为 _ (下划线)的文件/文件夹和隐藏的文件将会被忽略。Markdown和HTML 文件会被解析并放到 public 文件夹，而其他文件会被拷贝过去。
* themes：主题文件夹。Hexo会根据主题来生成静态页面。
* node_modules：node.js模块，一些 __插件__ 和 __依赖__ 会被安装到这里。

{% note info %}
更加详细的解释请参考[hexo官方文档](https://hexo.io/zh-cn/docs/)
{% endnote %}

## 安装NexT主题
进入本地博客文件夹并将NexT主题`clone`至`themes`文件夹下
```bash
cd C:/hexo/myblog
git clone https://github.com/theme-next/hexo-theme-next themes/next
```

接着，进入`./themes/next/`文件夹，将 __隐藏文件夹__ `.git`删除。这一步是为了后面将网站源码push到github上的 __必要工作__。

你会看到，在`next`下也有一个`_config.yml`的文件，这是 __NexT主题的配置文件__，为了区别它和 __博客配置文件__，下面会用带路径的文件名来描述它们：

* `myblog/_config.yml`：博客配置文件
* `next/_config.yml`：主题配置文件

## 启用NexT主题
在`myblog/_config.yml`里`theme:`选项填`next`，=>`theme: next`，注意冒号后空一格。

到这里，建站的任务就完成了。你现在可以打开控制台，输入并执行如下命令：
```bash
cd C:/hexo/myblog
hexo g && hexo s
```
其中
* `hexo g`：新建`public`文件夹，并在其中生成网站静态文件（html，css，等文件）
* `hexo s`：启动hexo服务器，默认情况下，访问网址为：`http://localhost:4000/`

{% note info %}
更多有关hexo的命令，请参考[hexo官方文档](https://hexo.io/zh-cn/docs/)的[命令](https://hexo.io/zh-cn/docs/commands.html)部分。
{% endnote %}

你会看到控制台有如下输出：
```bash
INFO  Start processing
INFO  Files loaded in 624 ms
INFO  Generated: index.html
INFO  Generated: archives/index.html
INFO  Generated: images/algolia_logo.svg
INFO  Generated: images/cc-by-nc-nd.svg
INFO  Generated: images/cc-by-nc-sa.svg
INFO  Generated: images/avatar.gif
INFO  Generated: images/cc-by-nc.svg
INFO  Generated: images/apple-touch-icon-next.png
INFO  Generated: images/cc-by-sa.svg
INFO  Generated: images/cc-by.svg
INFO  Generated: images/cc-zero.svg
INFO  Generated: images/cc-by-nd.svg
INFO  Generated: images/favicon-32x32-next.png
INFO  Generated: images/favicon-16x16-next.png
INFO  Generated: images/loading.gif
INFO  Generated: images/placeholder.gif
INFO  Generated: images/logo.svg
INFO  Generated: images/quote-r.svg
INFO  Generated: images/quote-l.svg
INFO  Generated: images/searchicon.png
INFO  Generated: archives/2018/01/index.html
INFO  Generated: archives/2018/index.html
INFO  Generated: lib/font-awesome/HELP-US-OUT.txt
INFO  Generated: css/main.css
INFO  Generated: lib/velocity/velocity.ui.min.js
INFO  Generated: lib/velocity/velocity.min.js
INFO  Generated: lib/font-awesome/bower.json
INFO  Generated: lib/velocity/velocity.js
INFO  Generated: lib/velocity/velocity.ui.js
INFO  Generated: lib/jquery/index.js
INFO  Generated: lib/font-awesome/fonts/fontawesome-webfont.woff
INFO  Generated: lib/font-awesome/fonts/fontawesome-webfont.woff2
INFO  Generated: js/src/affix.js
INFO  Generated: lib/ua-parser-js/dist/ua-parser.min.js
INFO  Generated: js/src/bootstrap.js
INFO  Generated: js/src/motion.js
INFO  Generated: js/src/js.cookie.js
INFO  Generated: js/src/exturl.js
INFO  Generated: js/src/algolia-search.js
INFO  Generated: js/src/post-details.js
INFO  Generated: js/src/scrollspy.js
INFO  Generated: lib/ua-parser-js/dist/ua-parser.pack.js
INFO  Generated: lib/font-awesome/css/font-awesome.min.css
INFO  Generated: js/src/utils.js
INFO  Generated: js/src/scroll-cookie.js
INFO  Generated: lib/font-awesome/css/font-awesome.css.map
INFO  Generated: lib/font-awesome/css/font-awesome.css
INFO  Generated: 2018/01/22/hello-world/index.html
INFO  Generated: lib/font-awesome/fonts/fontawesome-webfont.eot
INFO  Generated: js/src/schemes/pisces.js
INFO  50 files generated in 865 ms
INFO  Start processing
INFO  Hexo is running at http://localhost:4000/. Press Ctrl+C to stop.
```

在浏览器地址栏输入`http://localhost:4000/`并访问，你应该会看到如下页面：
{% asset_img pic2.png %}

{% note success %}
__恭喜你！你已经完成了博客搭建的主要工作！接下来就是细节的配置了。请耐心阅读以下内容。__
{% endnote %}

---

# 配置博客配置文件

整个`myblog/_config.yml`的内容如下：
```yaml
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
title: Hexo
subtitle:
description:
author: John Doe
language:
timezone:

# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://yoursite.com
root: /
permalink: :year/:month/:day/:title/
permalink_defaults:

# Directory
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
skip_render:

# Writing
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link: true # Open external links in new tab
filename_case: 0
render_drafts: false
post_asset_folder: false
relative_link: false
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace:
  
# Home page setting
# path: Root path for your blogs index page. (default = '')
# per_page: Posts displayed per page. (0 = disable pagination)
# order_by: Posts order. (Order by date descending by default)
index_generator:
  path: ''
  per_page: 10
  order_by: -date
  
# Category & Tag
default_category: uncategorized
category_map:
tag_map:

# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss

# Pagination
## Set per_page to 0 to disable pagination
per_page: 10
pagination_dir: page

# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: next

# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type:

```

## 博客基础配置
这里是配置博客基础的地方，包括 __博客名__，__小标题__，__描述__，__站长名（你的昵称）__，__语言__，__时区__。
```yaml
# Site
title: # 博客名
subtitle: # 小标题
description: # 描述
author: # 你叫啥
language: # 语言
timezone: # 时区
```

下面是我的配置：
```yaml
# Site
title: 淦
subtitle: n*m*lg(b)
description: 汝亦知射乎？吾射不亦精乎？
author: tankeryang
language: zh-Hans
timezone: 
```

你可以参考一下 __哪项配置分别对应哪个位置__，其中`language: zh-Hans`这里是根据 __主题是否支持__ 来设置的，因为渲染的js和css等文件都在主题里。NexT主题支持的语言[参考这里](http://theme-next.iissnan.com/getting-started.html#select-language)。hexo默认使用您计算机设置的时区。更改时区请参考[时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)，比如如果您想换成 __纽约时区__，您需填`America/New_York`。

{% note warning %}
注意，您在查看NexT支持的语言时访问的是`v5.x`的[NexT使用文档](http://theme-next.iissnan.com/getting-started.html)，阅读时请注意。`v6.x`的github地址在[这里](https://github.com/theme-next/hexo-theme-next)，官网在[这里](https://theme-next.org/)
{% endnote %}

## 博客url配置
这里是配置你的博客 __链接格式__ 的，包括 __主站__ 和 __文章__ 链接。
```yaml
# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url:  http://yoursite.com # 博客链接
root: / # 博客根目录
permalink: :year/:month/:day/:title/ # 文章的永久链接格式
permalink_defaults: # 永久链接中各部分的默认值 
```

这是我的配置：
```yaml
url: https://tankeryang.github.io
root: /
permalink: posts/:title/
permalink_defaults:
```

这里我的博客链接是`https://tankeryang.github.io`，因为我是挂在github上的。`root`设置为`/`。如果你的博客是在 __子目录__ 下，如`http://yoursite.com/child`，你需这样设置：
```yaml
url: http://yoursite.com/child
root: /child/
```

接着是`permalink`的配置，hexo默认的是`:year/:month/:day/:title/`的格式。比如我点开博客搭建好之后的默认博文 __Hello World__，它的链接是这样的：`http://localhost:4000/2018/01/22/hello-world/`：
{% asset_img pic3.png %}

如果你想 __更改文章永久链接格式__ 的话，以下是和链接格式有关的变量，你可以根据以下变量来配置：

|变量|描述|
|:---:|:---:|
|`:year`|文章的发表年份（4 位数）|
|`:month`|文章的发表月份（2 位数）|
|`:i_month`|文章的发表月份（去掉开头的零）|
|`:day`|文章的发表日期 (2 位数)|
|`:i_day`|文章的发表日期（去掉开头的零）|
|`:title`|文件名称|
|`:id`|文章 ID|

{% note info %}
更多有关链接的配置，请参考[hexo官方文档](https://hexo.io/zh-cn/docs/)中的[永久链接](https://hexo.io/zh-cn/docs/permalinks.html)部分。
{% endnote %}

---

> <i class="fa fa-hand-o-down" aria-hidden="true"></i>&nbsp;以下内容更新于2018/1/24，承接上文

## 配置资源文件夹
资源（Asset）代表source文件夹中除了文章以外的所有文件，例如图片、CSS、JS 文件等。比方说，如果你的Hexo项目中只有少量图片，那最简单的方法就是将它们放在 source/images 文件夹中。然后通过类似于`![](/images/image.jpg)`的方法访问它们。

如果你想要更有规律地提供图片和其他资源以及想要将他们的资源分布在各个文章上的人来说，Hexo也提供了更组织化的方式来管理资源。这个稍微有些复杂但是管理资源非常方便的功能可以通过将`config.yml`文件中的`post_asset_folder`选项设为`true`来打开：
```yaml
# Writing
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link: true # Open external links in new tab
filename_case: 0
render_drafts: false
post_asset_folder: true # 设置为true
relative_link: false
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace:
```

设置为`true`后，当你新建一篇文章时，hexo同时会新建一个 __和文章标题一样名字__ 的文件夹，你的文章所引用的图片等资源就可以放在这里面了。

将所有与你的文章有关的资源放在这个关联文件夹中之后，你可以通过 __标签插件__ 来引用它们，这样你就得到了一个更简单而且方便得多的工作流。关于什么是标签插件，接下来的内容会说明。请耐心阅读。
