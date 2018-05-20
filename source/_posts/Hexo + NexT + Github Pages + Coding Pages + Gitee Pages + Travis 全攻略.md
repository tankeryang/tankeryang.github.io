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
以下配置对于 __Windows，Mac，Linux__ 均可参考。

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
* __国内的朋友__，因为众所周知的原因，从npm直接安装hexo会非常慢，所以你需要用到[__镜像源__](https://npm.taobao.org/)，参考上面的步骤，使用cnpm命令行工具代替默认的npm: 在windows控制台（cmd）里输入并执行`npm install -g cnpm --registry=https://registry.npm.taobao.org`，然后安装hexo: `cnpm install -g hexo-cli`

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

{% note warning %}
以下步骤均采用这个路径作为说明，并且 __所有有关`hexo`的命令__ 均要在此路径下执行。
{% endnote %}

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
<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>&nbsp;__恭喜你！你已经完成了博客搭建的主要工作！接下来就是细节的配置了。请耐心阅读以下内容。__
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

> <i class="fa fa-hand-o-down" aria-hidden="true"></i>&nbsp;<font color="#aeaeae">以下内容更新于2018/1/24，承接上文</font>

## 配置资源文件夹
资源（Asset）代表source文件夹中除了文章以外的所有文件，例如图片、CSS、JS 文件等。比方说，如果你的Hexo项目中只有少量图片，那最简单的方法就是将它们放在 source/images 文件夹中。然后通过类似于`![](/images/image.jpg)`的方法访问它们。

如果你想要更有规律地提供图片和其他资源以及想要将他们的资源分布在各个文章上的人来说，Hexo也提供了更组织化的方式来管理资源。这个稍微有些复杂但是管理资源非常方便的功能可以通过将`config.yml`文件中的`post_asset_folder`选项设为`true`来打开：
```yaml
post_asset_folder: true # 设置为true
```

设置为`true`后，当你新建一篇文章时，hexo同时会新建一个 __和文章标题一样名字__ 的文件夹，你的文章所引用的图片等资源就可以放在这里面了。

将所有与你的文章有关的资源放在这个关联文件夹中之后，你可以通过[__标签插件__](#标签插件)来引用它们，这样你就得到了一个更简单而且方便得多的工作流。关于什么是标签插件，接下来的内容会说明。请耐心阅读。（你也可以点击上面的链接浏览一下标签插件的内容）

---

> <i class="fa fa-hand-o-down" aria-hidden="true"></i>&nbsp;<font color="#aeaeae">以下内容更新与2018/1/25，承接上文（不好意思，本人很懒...）</font>

# 写作
## 新建文章
执行如下命令新建文章：
```bash
hexo new [layout] <title>
```

其中`[layout]`字段是文章的 __布局__，默认为`post`，可以通过修改`_config.yml`中的`default_layout`参数来指定默认布局。`<title>`则是文章标题。

### 布局
Hexo 有三种默认布局：`post`、`page`和`draft`，它们分别对应不同的路径，而您 __自定义的其他布局__ 和`post`相同，都将储存到`source/_posts`文件夹。

|布局|路径|
|:---:|:---:|
|`post`|`source/_posts`|
|`page`|`source`|
|`draft`|`source/_draft`|

其实布局我到现在也不是很清楚是什么，__我是这样认为的：__

{% note primary %}
如果你执行了这条命令`hexo new post "new article"`，hexo会新建一个`new article.md`文件在`source/_post`文件夹下。同理，其他两个布局参照上面的路径新建文章。
{% endnote %} 

### 文件名称
Hexo默认以 __标题__ 作为文件名称，你也可编辑`myblog/_config.yml`中的`new_post_name`参数来改变默认的文件名称，比如设置为：
```yaml
new_post_name: :year-:month-:day-:title.md # File name of new posts
```

这样在 __文章名__ 前面就会加上日期和时间共同组成 __文件名__。

下面是一些可用来配置文件名的变量：

|变量|描述|
|:---:|:---:|
|`:title`|标题（小写，空格将会被替换为短杠）|
|`:year`|建立的年份,比如，2015|
|`:month`|建立的月份（有前导零），比如，`04`|
|`i_month`|建立的月份（无前导零），比如，`4`|
|`:day`|建立的日期（有前导零），比如，`07`|
|`i_day`|建立的日期（无前导零），比如，`7`|

{% note info %}
更多有关 __基本写作设置__ 的内容请参考[hexo官方文档](https://hexo.io/zh-cn/docs)的[写作](https://hexo.io/zh-cn/docs/writing.html)部分。
{% endnote %}

### 下面，我们就来尝试一下吧！
首先，执行
```bash
hexo new post "caonima"
```
 
你会看到输出
```
INFO  Created: C:/hexo/myblog/source/_posts/caonima.md
```

同时，在`source/_post`文件夹下多了`caonima.md`文件和`caonima`文件夹。
```
.
├── caonima.md
├── hello-world.md
├── caonima
```

打开`caonima.md`，你会看到这些
```yaml
---
title: caonima
date: 2018-01-25 13:06:28
tags:
---
```

这些是 __front-matter__，下面我会对它进行说明，请耐心阅读（~~这句话我到底讲了几次~~）。
接下来你可以随便在里面写点内容，比如：
```markdown
# caonima
## caonima
### caonima
__caonima__
_caonima_
* caonima

> caonima

[caonima]()
~~caonima~~
`caonima`
```

保存。执行下面语句生成博客文件并运行本地hexo服务端：
```bash
hexo g && hexo s
```

你会看到如下输出：
```bash
INFO  Start processing
INFO  Files loaded in 642 ms
INFO  Generated: 2018/01/22/hello-world/index.html
INFO  Generated: archives/index.html
INFO  Generated: index.html
INFO  Generated: archives/2018/01/index.html
INFO  Generated: archives/2018/index.html
INFO  Generated: images/avatar.gif
INFO  Generated: images/apple-touch-icon-next.png
INFO  Generated: images/cc-by-nc-nd.svg
INFO  Generated: images/algolia_logo.svg
INFO  Generated: images/cc-by-nc-sa.svg
INFO  Generated: images/cc-by-nd.svg
INFO  Generated: images/cc-by-nc.svg
INFO  Generated: images/cc-by.svg
INFO  Generated: images/favicon-16x16-next.png
INFO  Generated: images/cc-zero.svg
INFO  Generated: images/favicon-32x32-next.png
INFO  Generated: images/cc-by-sa.svg
INFO  Generated: images/logo.svg
INFO  Generated: images/placeholder.gif
INFO  Generated: images/quote-l.svg
INFO  Generated: images/loading.gif
INFO  Generated: images/quote-r.svg
INFO  Generated: lib/font-awesome/HELP-US-OUT.txt
INFO  Generated: lib/font-awesome/css/font-awesome.css.map
INFO  Generated: images/searchicon.png
INFO  Generated: lib/font-awesome/fonts/fontawesome-webfont.woff2
INFO  Generated: lib/font-awesome/fonts/fontawesome-webfont.woff
INFO  Generated: js/src/algolia-search.js
INFO  Generated: js/src/exturl.js
INFO  Generated: js/src/affix.js
INFO  Generated: js/src/post-details.js
INFO  Generated: js/src/motion.js
INFO  Generated: js/src/scroll-cookie.js
INFO  Generated: js/src/utils.js
INFO  Generated: js/src/scrollspy.js
INFO  Generated: lib/font-awesome/bower.json
INFO  Generated: js/src/js.cookie.js
INFO  Generated: js/src/bootstrap.js
INFO  Generated: lib/velocity/velocity.ui.min.js
INFO  Generated: lib/ua-parser-js/dist/ua-parser.pack.js
INFO  Generated: js/src/schemes/pisces.js
INFO  Generated: lib/ua-parser-js/dist/ua-parser.min.js
INFO  Generated: css/main.css
INFO  Generated: lib/jquery/index.js
INFO  Generated: lib/velocity/velocity.ui.js
INFO  Generated: lib/font-awesome/css/font-awesome.css
INFO  Generated: lib/velocity/velocity.min.js
INFO  Generated: lib/font-awesome/css/font-awesome.min.css
INFO  Generated: lib/velocity/velocity.js
INFO  Generated: lib/font-awesome/fonts/fontawesome-webfont.eot
INFO  Generated: 2018/01/25/caonima/index.html
INFO  51 files generated in 1 s
INFO  Start processing
INFO  Hexo is running at http://localhost:4000/. Press Ctrl+C to stop.
```

在浏览器输入`http://localhost:4000/`并访问，你会看到这样的页面：
{% asset_img pic4.png %}

{% note success %}
<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>&nbsp;__恭喜你！你已经可以进行简单的文字创作了！下面的任务就是让你的写作流程规范化的细节。请耐心阅读。__
{% endnote %}

## 标签插件
><font color="#aeaeae">从上方跳转过来的朋友，</font>[<i class="fa fa-hand-o-up" aria-hidden="true"></i>&nbsp;点此返回__资源配置文件夹处__](#配置资源文件夹)

标签插件是用于在文章中快速插入特定内容的插件。
它的在文章中用法一般是这样：
```
{% [某种标签] %}
<你想插入的内容>
{% end[某种标签] %}
```
或者这样：
```
{% [某种标签] <你想插入的内容> %}
```

用例子说明最快：
比如像前面提到的，__用标签插件在文章引用图片__，你只需这样写
```
{% asset_img <图片文件名> %}
```
示例
```
{% asset_img caonima.jpg %}
```

这是我最常用的标签了，`asset_img`，顾名思义，就是图片资源。一般我都用它来插入图片。因为我们在前面配置了 __资源文件夹__，所以`<图片文件名>`这里我们不用输入绝对路径，__只需输入图片文件名__ 就ok了，__hexo会自动在资源文件夹里寻找你的图片__。

你可以在`caonima`文件夹里放一张图片，然后在`caonima.md`里用上面的`asset_img`标签插件来引用它，看看效果。

{% note info %}
更多有关标签插件的内容，请参考[hexo官方文档](https://hexo.io/zh-cn/docs)中的[标签插件](https://hexo.io/zh-cn/docs/tag-plugins.html)部分。
{% endnote %}

---

# 配置主题配置文件

NexT主题作为hexo众多主题里最火的一款，除了简约美观的设计之外，最重要的一点就是 __可定制化的程度高__。你可以很轻松的 __开启或关闭某些功能__，甚至 __自己尝试添加一些功能__也比其他主题简单，因为它的 __源文件组织得很清晰__，主题的 __布局__，__js__，__css__，__字体__，__语言__，等文件都独立区分。

下面我会参照我的配置来详细介绍如何配置NexT主题。

## 重要更新
在{% label info@v6.0.x %}的版本里，NexT新增了 __缓存__ 这样一个特性：
```yaml
# Allow to cache content generation. Introduced in NexT v6.0.0.
cache:
  enable: true
```
这是一个非常强大的改进！也就是说，当我们执行了`hexo s`预览博客内容时，同时对 __文章内容__ 或 __主题配置__ 做了一些修改，我们只需 __刷新一下__ 页面就能实时看到更改效果，而不用重新执行`hexo clean && hexo g`来重新生成页面。对此我只能说{% label default@6 %}{% label primary@6 %}{% label success@6 %}{% label info@6 %}{% label warning@6 %}{% label danger@6 %}

## 网站图标
下面就是网站图标的配置项：
```yaml
# For example, you put your favicons into `hexo-site/source/images` directory.
# Then need to rename & redefine they on any other names, otherwise icons from Next will rewrite your custom icons in Hexo.
favicon:
  small: /images/favicon-16x16-next.png
  medium: /images/favicon-32x32-next.png
  apple_touch_icon: /images/apple-touch-icon-next.png
  safari_pinned_tab: /images/logo.svg
  #android_manifest: /images/manifest.json
  #ms_browserconfig: /images/browserconfig.xml
```

参照注释，先在`myblog/source/`路径下新建`images`文件夹，找一张`16x16`的`ico`或者`png`图标，放进`images`文件夹（在哪里找图标请自行百度），比如`caonima.ico`。
然后将`small`选项设置为`/images/caonima.ico`：
```yaml
favicon:
  small: /images/caonima.ico
```

再将其他的选项注释掉（因为基本用不到）：
```yaml
favicon:
  small: /images/caonima.ico
  #medium: /images/favicon-32x32-next.png
  #apple_touch_icon: /images/apple-touch-icon-next.png
  #safari_pinned_tab: /images/logo.svg
  #android_manifest: /images/manifest.json
  #ms_browserconfig: /images/browserconfig.xml
```

网站图标配置就完成了。关于其他选项你可以有空自己放些图标文件来玩玩看什么效果。

## 网站底部内容
这些在`footer`选项的配置里：
```yaml
footer:
  # Specify the date when the site was setup.
  # If not defined, current year will be used.
  #since: 2015

  # Icon between year and copyright info.
  icon: user

  # If not defined, will be used `author` from Hexo main config.
  copyright:
  # -------------------------------------------------------------
  # Hexo link (Powered by Hexo).
  powered: true

  theme:
    # Theme & scheme info link (Theme - NexT.scheme).
    enable: true
    # Version info of NexT after scheme info (vX.X.X).
    version: true
  # -------------------------------------------------------------
  # Any custom text can be defined here.
  #custom_text: Hosted by <a target="_blank" rel="external nofollow" href="https://pages.coding.me"><b>Coding Pages</b></a>
```

默认图标是[`user`](http://www.fontawesome.com.cn/icons/user/)。假如你想个性化的话可以参照[fontawsome](http://www.fontawesome.com.cn/)提供的图标来进行选择。下面是我的配置：
```yaml
footer:
  # Specify the date when the site was setup.
  # If not defined, current year will be used.
  since: 2017

  # Icon between year and copyright info.
  icon: cog
  # spiner icon
  rotate: fa-spin fa-lg margin-bottom
  #rotate_plus : fa-plus fa-lg margin-bottom

  # If not defined, will be used `author` from Hexo main config.
  copyright:
  # -------------------------------------------------------------
  # Hexo link (Powered by Hexo).
  powered: true

  theme:
    # Theme & scheme info link (Theme - NexT.scheme).
    enable: true
    # Version info of NexT after scheme info (vX.X.X).
    version: true
  # -------------------------------------------------------------
  # Any custom text can be defined here.
  #custom_text: Hosted by <a target="_blank" href="https://pages.github.com">GitHub Pages</a>
```

## 菜单栏设置
这些在`menu`选项里：
```yaml
# ---------------------------------------------------------------
# Menu Settings
# ---------------------------------------------------------------

# When running the site in a subdirectory (e.g. domain.tld/blog), remove the leading slash from link value (/archives -> archives).
# Usage: `Key: /link/ || icon`
# Key is the name of menu item. If translate for this menu will find in languages - this translate will be loaded; if not - Key name will be used. Key is case-senstive.
# Value before `||` delimeter is the target link.
# Value after `||` delimeter is the name of FontAwesome icon. If icon (with or without delimeter) is not specified, question icon will be loaded.
menu:
  home: / || home
  #about: /about/ || user
  #tags: /tags/ || tags
  #categories: /categories/ || th
  archives: /archives/ || archive
  #schedule: /schedule/ || calendar
  #sitemap: /sitemap.xml || sitemap
  #commonweal: /404/ || heartbeat

# Enable/Disable menu icons / item badges.
menu_settings:
  icons: true
  badges: false
```
`||`后面的`icon`对应的是[fontawsome](http://www.fontawesome.com.cn/)相应的图标名。如果你想添加`about`菜单的话，按照以下步骤：
* 在`myblog`下新建`about`文件夹
* 在`about`文件夹下新增`index.md`文件
* 在`index.md`里添加内容
* 在`menu`选项里添加`about: /about/ || user`

刷新一下看看效果。你会发现多了一个`about`菜单。用这样的办法可以自定义很多菜单目录。

## 主题布局
NexT主题提供了4种不同风格的主题布局，按需设置：
```yaml
# ---------------------------------------------------------------
# Scheme Settings
# ---------------------------------------------------------------

# Schemes
scheme: Muse
#scheme: Mist
#scheme: Pisces
#scheme: Gemini
```

## 侧边栏设置
这一项的内容有点多，先放配置文件，我们一个个看：
```yaml
# ---------------------------------------------------------------
# Sidebar Settings
# ---------------------------------------------------------------

# Posts / Categories / Tags in sidebar.
site_state: true

# Social Links.
# Usage: `Key: permalink || icon`
# Key is the link label showing to end users.
# Value before `||` delimeter is the target permalink.
# Value after `||` delimeter is the name of FontAwesome icon. If icon (with or without delimeter) is not specified, globe icon will be loaded.
#social:
  #GitHub: https://github.com/yourname || github
  #E-Mail: mailto:yourname@gmail.com || envelope
  #Google: https://plus.google.com/yourname || google
  #Twitter: https://twitter.com/yourname || twitter
  #FB Page: https://www.facebook.com/yourname || facebook
  #VK Group: https://vk.com/yourname || vk
  #StackOverflow: https://stackoverflow.com/yourname || stack-overflow
  #YouTube: https://youtube.com/yourname || youtube
  #Instagram: https://instagram.com/yourname || instagram
  #Skype: skype:yourname?call|chat || skype

social_icons:
  enable: true
  icons_only: false
  transition: false
  # Dependencies: exturl: true in Tags Settings section below.
  # To encrypt links above use https://www.base64encode.org
  # Example encoded link: `GitHub: aHR0cHM6Ly9naXRodWIuY29tL3RoZW1lLW5leHQ= || github`
  exturl: false

# Follow me on GitHub banner in right-top corner.
# Usage: `permalink || title`
# Value before `||` delimeter is the target permalink.
# Value after `||` delimeter is the title and aria-label name.
#github_banner: https://github.com/yourname || Follow me on GitHub

# Blog rolls
links_icon: link
links_title: Links
links_layout: block
#links_layout: inline
#links:
  #Title: http://example.com/

# Sidebar Avatar
avatar:
  # in theme directory(source/images): /images/avatar.gif
  # in site  directory(source/uploads): /uploads/avatar.gif
  # You can also use other linking images.
  url: #/images/avatar.gif
  # If true, the avatar would be dispalyed in circle. 
  rounded: false
  # The value of opacity should be choose from 0 to 1 to set the opacity of the avatar.
  opacity: 1
  # If true, the avatar would be rotated with the cursor.
  rotated: false

# Table Of Contents in the Sidebar
toc:
  enable: true

  # Automatically add list number to toc.
  number: true

  # If true, all words will placed on next lines if header width longer then sidebar width.
  wrap: false

# Creative Commons 4.0 International License.
# http://creativecommons.org/
# Available: by | by-nc | by-nc-nd | by-nc-sa | by-nd | by-sa | zero
#creative_commons: by-nc-sa
#creative_commons:

sidebar:
  # Sidebar Position, available value: left | right (only for Pisces | Gemini).
  position: left
  #position: right

  # Sidebar Display, available value (only for Muse | Mist):
  #  - post    expand on posts automatically. Default.
  #  - always  expand for all pages automatically
  #  - hide    expand only when click on the sidebar toggle icon.
  #  - remove  Totally remove sidebar including sidebar toggle.
  display: post
  #display: always
  #display: hide
  #display: remove

  # Sidebar offset from top menubar in pixels (only for Pisces | Gemini).
  offset: 12

  # Back to top in sidebar (only for Pisces | Gemini).
  b2t: false

  # Scroll percent label in b2t button.
  scrollpercent: false

  # Enable sidebar on narrow view (only for Muse | Mist).
  onmobile: false
```

* `social`: 这一项被注释掉了，我们先取消注释。配置内容就是对应的社交账号链接。
* `github_banner`: 右上角的 __follow me on github__
* `links`: 放一些友情链接或其它的你想放的链接
* `avatar`: 头像的一些设置

其余的设置参考他给出的注释说明配置即可。下面是我的配置：
```yaml
# ---------------------------------------------------------------
# Sidebar Settings
# ---------------------------------------------------------------

# Posts / Categories / Tags in sidebar.
site_state: true

# Social Links.
# Usage: `Key: permalink || icon`
# Key is the link label showing to end users.
# Value before `||` delimeter is the target permalink.
# Value after `||` delimeter is the name of FontAwesome icon. If icon (with or without delimeter) is not specified, globe icon will be loaded.
social:
  GitHub: https://github.com/tankeryang || github
  E-Mail: mailto:youngzyang@outlook.com || envelope
  #Google: https://plus.google.com/yourname || google
  #Twitter: https://twitter.com/yourname || twitter
  #FB Page: https://www.facebook.com/yourname || facebook
  #VK Group: https://vk.com/yourname || vk
  #StackOverflow: https://stackoverflow.com/yourname || stack-overflow
  #YouTube: https://youtube.com/yourname || youtube
  #Instagram: https://instagram.com/yourname || instagram
  #Skype: skype:yourname?call|chat || skype

social_icons:
  enable: true
  icons_only: false
  transition: true

# Follow me on GitHub banner in right-top corner.
# Usage: `permalink || title`
# Value before `||` delimeter is the target permalink.
# Value after `||` delimeter is the title and aria-label name.
github_banner: https://github.com/tankeryang || Follow me on GitHub

# Blog rolls
links_icon: link
links_title: 博客镜像 & 友情链接
links_layout: block
#links_layout: inline
links:
  淦 - github: https://tankeryang.github.io
  淦 - coding: https://tankeryang.coding.me
  淦 - gitee: http://tankeryang.gitee.io
  未知: https://deeeeeeeee.github.io
  简单可依赖: https://www.tiexo.cn/
  刘伟的博客: https://darrenliuwei.com

# Sidebar Avatar
# in theme directory(source/images): /images/avatar.gif
# in site  directory(source/uploads): /uploads/avatar.gif
avatar: 
  url: /uploads/my.jpg
  rounded: true

# Table Of Contents in the Sidebar
toc:
  enable: true

  # Automatically add list number to toc.
  number: true

  # If true, all words will placed on next lines if header width longer then sidebar width.
  wrap: false

# Creative Commons 4.0 International License.
# http://creativecommons.org/
# Available: by | by-nc | by-nc-nd | by-nc-sa | by-nd | by-sa | zero
creative_commons: by-nc-sa
#creative_commons:

sidebar:
  # Sidebar Position, available value: left | right (only for Pisces | Gemini).
  position: left
  #position: right

  # Sidebar Display, available value (only for Muse | Mist):
  #  - post    expand on posts automatically. Default.
  #  - always  expand for all pages automatically
  #  - hide    expand only when click on the sidebar toggle icon.
  #  - remove  Totally remove sidebar including sidebar toggle.
  #display: post
  display: always
  #display: hide
  #display: remove

  # Sidebar offset from top menubar in pixels (only for Pisces | Gemini).
  offset: 12

  # Back to top in sidebar (only for Pisces | Gemini).
  b2t: true

  # Scroll percent label in b2t button.
  scrollpercent: true

  # Enable sidebar on narrow view (only for Muse | Mist).
  onmobile: true
```

## 个性化设置
因为NexT可配置的选项太多，在这里我就不一一展开了，下面在介绍两个个性化的设置

### 主题标签插件
关于标签插件，大家可以回顾一下前面的内容。NexT也自带了一些标签插件供用户使用

#### note
{% note default %}
提示块标签，效果就像你看到的这个提示块
{% endnote %}
配置如下：
```yaml
# Note tag (bs-callout).
note:
  # Note tag style values:
  #  - simple    bs-callout old alert style. Default.
  #  - modern    bs-callout new (v2-v3) alert style.
  #  - flat      flat callout style with background, like on Mozilla or StackOverflow.
  #  - disabled  disable all CSS styles import of note tag.
  style: flat
  icons: true
  border_radius: 2
  # Offset lighter of background in % for modern and flat styles (modern: -12 | 12; flat: -18 | 6).
  # Offset also applied to label tag variables. This option can work with disabled note tag.
  light_bg_offset: 3
```
使用方法：
```
{% note class %}
Any content (support inline tags too).
{% endnote %}

# 支持的class: class : default | primary | success | info | warning | danger.
```

#### label
{% label primary@label标签，给文字加底色 %}
配置如下：
```
# Label tag.
label: true
```
使用方法：
```
{% label class@Text %}

# 支持的class : default | primary | success | info | warning | danger.
```

#### 选项卡
效果如下：
{% tabs 选项卡1 选项卡2 %}
<!-- tab 选项卡1 -->
我是选项卡1
{% codeblock %}
我是代码框1
{% endcodeblock %}
 <!-- endtab -->

 <!-- tab 选项卡2 -->
我是选项卡2
{% codeblock %}
我是代码框2
{% endcodeblock %}
 <!-- endtab -->
{% endtabs %}
配置如下：
```yaml
# Tabs tag.
tabs:
  enable: true
  transition:
    tabs: true
    labels: true
  border_radius: 3
```
使用方法：
```
{% tabs 选项卡1 选项卡2 %}
<!-- tab 选项卡1 -->
我是选项卡1
{% codeblock %}
我是代码框1
{% endcodeblock %}
 <!-- endtab -->

 <!-- tab 选项卡2 -->
我是选项卡2
{% codeblock %}
我是代码框2
{% endcodeblock %}
 <!-- endtab -->
{% endtabs %}
```

{% note info %}
更多设置请参考{% label danger@v5.x %}版本的[NexT文档](http://theme-next.iissnan.com/)和最新的{% label primary@v6.x %}版本的[NexT文档](https://github.com/theme-next/hexo-theme-next/tree/master/docs/zh-CN)
{% endnote %}

---

# 配置Git与Travic-CI持续集成
{% note warning %}
这一步是最能体现 __自动化博客写作流程__ 的关键。务必仔细阅读。
{% endnote %}

## github新建博客项目
首先在github上新开一个repo，__repo名为: `USERNAME.github.io`__
> `USERNAME`为你的github用户名，详细可参考[官方链接](https://pages.github.com/)

## 添加.gitignore
进入{% label @myblog %}文件夹，新增{% label @.gitignore %}文件，若存在则检查是否与如下一致：
{% codeblock .gitignore %}
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
{% endcodeblock %}

## 

{% codeblock lang:yaml .travis.yml %}
language: node_js
node_js: stable

install:
  - npm install
  - npm install hexo-math --save
  - npm install hexo-generator-searchdb --save
  - npm install hexo-symbols-count-time --save
  - npm install hexo-generator-feed --save
  - npm install hexo-wordcount --save
  - npm install mermaid --save
  - npm install hexo-tag-mermaid --save
  - npm install hexo-tag-plantuml --save

before_script:
  - cd ./themes/next
  - git clone https://github.com/theme-next/theme-next-fancybox3 source/lib/fancybox
  - git clone https://github.com/theme-next/theme-next-jquery-lazyload source/lib/jquery_lazyload
  - git clone https://github.com/theme-next/theme-next-needmoreshare2 source/lib/needsharebutton
  - git clone https://github.com/theme-next/theme-next-pace source/lib/pace
  - git clone https://github.com/theme-next/theme-next-pangu.git source/lib/pangu
  - git clone https://github.com/theme-next/theme-next-reading-progress source/lib/reading_progress

  - cd ..
  - cd ..
script:
  - hexo -version
  - hexo clean && hexo g

after_script:
  - cd ./public
  - git init
  - git config user.name "USERNAME"     # 这里填你的github用户名
  - git config user.email "YOUR EMAIL"  # 这里填你的github注册email
  - git add .
  - git commit -m "Update docs"
  - git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:master

branches:
  only:
    - dev
env:
 global:
   - GH_REF: github.com/USERNAME/USERNAME.github.io.git  # USERNAME为你的github用户名
{% endcodeblock %}





<!-- {% note danger %}
<i class="fa fa-spinner fa-pulse fa-lg margin-bottom" aria-hidden="true"></i>&nbsp;未完待续...明天继续...
{% endnote %} -->