---
title: 安装Ubuntu 18.04 LTS之后的N件事
date: 2018-06-24 23:51:06
categories: Ubuntu
tags: [linux, ubuntu]
mathjax: false
comments: true
---

{% asset_img pic0.jpeg %}

这两天装机，记录下装完系统后的一些后续事项
<!-- more -->

# 软件和更新

{% asset_img pic1.png %}
{% asset_img pic2.png %}
{% asset_img pic3.png %}

显卡驱动换成官方的之后可以重启一下，执行下面的命令看看是否安装成功:

```shell
nvidia-smi
```

{% asset_img pic4.png %}

```shell
ubuntu-drivers devices
```

{% asset_img pic5.png %}

# 设置sudo无密码

执行:

```shell
sudo visudo
```

找到

```shell
%sudo ALL=(ALL:ALL) ALL
```

改成

```shell
%sudo ALL=(ALL:ALL) NOPASSWD:ALL
```

# 安装neofetch

添加`PPA`:

```shell
sudo add-apt-repository ppa:dawidd0811/neofetch
```

更新`apt`软件列表索引，并下载`neofetch`:

```shell
sudo apt update && sudo apt install neofetch
```

执行:

```shell
neofetch
```

{% asset_img pic6.png %}

# 安装gnome-tweak

执行:

```shell
sudo apt install gnome-tweak-tool
```

装完后 __程序中文名__ 叫`优化`

{% asset_img pic7.png %}

# 安装Opera浏览器（针对博主本人，本人常用浏览器）

去官网下`deb`包安装

# 安装主题和图标

ubuntu 18.04 将桌面环境换成了 __Gnome__，所以我们的主题是基于 __Gnome/Gtk__ 的

上[这里](https://www.gnome-look.org/browse/cat/135/ord/latest/)挑一款自己喜欢的主题:

{% asset_img pic8.png %}

下面介绍3种安装主题和图标的方法

## 通过apt安装

这种方法需要所下载的主题或图标 __有加入官方PPA源__ 或者 __有提供第三方PPA源__
下面以[macOS High Sierra](https://www.gnome-look.org/p/1013714/)这款主题为例说明:

{% asset_img pic9.png %}

看到它标题下方的 __github地址__: [https://github.com/vinceliuice/Sierra-gtk-theme](https://github.com/vinceliuice/Sierra-gtk-theme):

{% asset_img pic10.png %}

根据`README`进行安装:

- Ubuntu PPA (maintained by @igor-dyatlov):
    ```shell
    sudo add-apt-repository ppa:dyatlov-igor/sierra-theme
    sudo apt update
    sudo apt install sierra-gtk-theme       # point releases
    sudo apt install sierra-gtk-theme-git   # git master branch
    ```

## 通过ocs-url-tools安装

我们可以看到，每个主题页面右边都有提供`Download`和`Install`，但是点完`Install`却发现浏览器会弹出询问 __如何处理ocs: 链接__，但是你点了执行却什么都没发生。这是因为你还需要安装 __能处理ocs链接的工具__

首先，访问[这里](https://www.linux-apps.com/p/1136805/)，下载[ocs-url_3.0.3-0ubuntu1_amd64.deb](https://www.linux-apps.com/p/1136805/startdownload?file_id=1517920714&file_name=ocs-url_3.0.3-0ubuntu1_amd64.deb&file_type=application/x-debian-package&file_size=54198&url=https%3A%2F%2Fdl.opendesktop.org%2Fapi%2Ffiles%2Fdownloadfile%2Fid%2F1517920714%2Fs%2F976aa85dcaba33fafa7ee0c3074f03ad%2Ft%2F1529946099%2Fu%2F%2Focs-url_3.0.3-0ubuntu1_amd64.deb)（你可以直接点这个链接下载），双击运行安装

{% asset_img pic11.png %}

回到下载主题的地方，以[Arrongin themes](https://www.gnome-look.org/p/1215199/)这款主题为例:

{% asset_img pic12.png %}

直接点`Install`安装，选择某个系列（如: `Telinkrin-Buttons-Right.tar.xz`），浏览器会弹出提示，选择`启动应用程序`，弹出如下提示框，点`ok`安装:

{% asset_img pic13.png %}

装完之后点击`open`就是打开安装位置，一般在`~/.theme`下；点击`close`就是关闭窗口

## 通过下载压缩包解压安装

安装主题或图标实质上只是把 __主题文件__ 或 __图标文件__ 解压到制定文件夹下，因此我们只要下载某款主题或图标的压缩文件，然后分别解压到下面的位置:

- 主题文件夹: `~/.theme/`
- 图标文件夹: `~/.local/share/icons/`

# 安装gnome-extension

ubuntu 18.04 将gnome-shell-theme变成了一个gnome-extension插件，导致gnome-tweak不能直接换shell的主题，因此我们要先安装gnome-extension，下面说明详细步骤

- 先本地安装支持下载gnome-extension的模块:
    ```shell
    sudo apt install chrome-gnome-shell
    ```
- 访问[gnome插件商店](https://extensions.gnome.org/)，点开[User theme](https://extensions.gnome.org/extension/19/user-themes/)插件页面，点击`Click here to install browser extension`安装浏览器端的插件下载模块

- 刷新一下页面，你就能看到右方有个开关按钮，点开就能自动安装插件了。关闭就是禁用插件

现在你不仅可以下载gnome-shell-theme插件，还能下载安装商店里的很多插件了

# 安装输入法

执行如下命令安装fcitx和googlepinyin:

```shell
sudo apt install fcitx fcitx-googlepinyin im-config
```

执行:

```shell
im-config
```

指定fcitx的配置即可

# 安装git/zsh/oh-my-zsh

- 安装`git`:

    ```shell
    sudo apt install git
    ```

    顺便配置ssh:

    ```shell
    cd ~/.ssh
    ssh-keygen -C "${你的git仓库(如github)的email}"
    ```

- 安装`zsh`:
    ```shell
    sudo apt install zsh
    ```

- 安装`oh-my-zsh`:
    ```shell
    # wget
    sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"

    # curl
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
    ```

# 安装pip

- `pip2`:
    ```shell
    # 安装pip2
    sudo apt update
    sudo apt install python-pip

    # 查看版本
    pip --verion
    # 输出: pip 9.0.1 from /usr/lib/python2.7/dist-packages (python 2.7)
    ```

- `pip3`:
    ```shell
    # 安装pip3
    sudo apt update
    sudo apt install python3-pip

    # 查看版本
    pip3 --verion
    # 输出: pip 9.0.1 from /usr/lib/python3/dist-packages (python 3.6)
    ```

# 安装vim/tmux

- `vim`:
    ```shell
    sudo apt install vim
    ```

- `tmux`
    ```shell
    sudo apt install tmux
    ```

# 安装powerline终端美化和字体库

## 安装

- 先安装`powerline`插件:

    ```shell
    pip install --user powerline-status
    ```

    这是一个Python的模块，安装位置一般在`~/.local/lib/python2.7/site-packages`

    装完之后，将`~/.local/bin`下的`powerline`相关的可执行脚本复制到`~/.local/lib/python2.7/site-packages/scripts`下:

    ```shell
    # 先新建scripts文件夹
    mkdir ~/.local/lib/python2.7/site-packages/scripts

    # 拷贝脚本到scripts下
    cp ~/.local/bin/powerline* ~/.local/lib/python2.7/site-packages/scripts
    ```

- 再安装`powerline`字体

    ```shell
    # clone
    git clone https://github.com/powerline/fonts.git --depth=1

    # install
    cd fonts
    ./install.sh

    # clean-up a bit
    cd ..
    rm -rf fonts
    ```

## 使用

再下面的文件添加对应配置

- `~/.zshrc`:
    ```shell
    # 开头添加
    . /home/${填你的用户名}/.local/lib/python2.7/site-packages/powerline/bindings/zsh/powerline.zsh
    ```

- `~/.vimrc`:
    ```vim
    set shell=/bin/zsh
    set rtp+=/home/${填你的用户名}/.local/lib/python2.7/site-packages/powerline/bindings/vim
    set guifont=Source\ Code\ Pro\ for\ Powerline:h14
    set t_Co=256
    let g:Powerline_symbols = 'fancy'
    set fillchars+=stl:\ ,stlnc:\
    ```

- `~/.tmux.conf`:
    ```shell
    source "/home/${填你的用户名}/.local/lib/python2.7/site-packages/powerline/bindings/tmux/powerline.conf"
    ```

# 安装dotfile（本人的配置文件，针对博主本人，有兴趣可以参考）

```shell
# clone
git clone git@github.com:tankeryang/dotfile.git

# 切换分支
git checkout -b ubuntu-18.04 origin/ubuntu-18.04

# 复制配置文件
cd dotfile
cp .zshrc .vimrc .tmux.conf ~/
cp .ssh/config ~/.ssh/
```

# 安装ShadowSocks-Qt5/SwitchyOmega

访问[这里](https://github.com/shadowsocks/shadowsocks-qt5/releases)下载 __release__ 版本的`ShadowSocks-Qt5`可执行程序[Shadowsocks-Qt5-3.0.1-x86_64.AppImage](https://github.com/shadowsocks/shadowsocks-qt5/releases/download/v3.0.1/Shadowsocks-Qt5-3.0.1-x86_64.AppImage)，或者直接`wget`下载:

```shell
wget https://github.com/shadowsocks/shadowsocks-qt5/releases/download/v3.0.1/Shadowsocks-Qt5-3.0.1-x86_64.AppImage
```

顺便搞一张`icon`图标:

```shell
wget https://avatars1.githubusercontent.com/u/3006190?s=200&v=4 shadowsocks.png
```

将下载的可执行程序 __提权__，与图标一起拷贝到`/opt/ShadowSocks-Qt5`:

```shell
# 提权
chmod a+x ${你的下载路径}/Shadowsocks-Qt5-3.0.1-x86_64.AppImage

# 将可执行程序放到/opt/ShadowSocks-Qt5
sudo mkdir /opt/ShadowSocks-Qt5
mv ${你的下载路径}/Shadowsocks-Qt5-3.0.1-x86_64.AppImage /opt/ShadowSocks-Qt5
mv ${你的下载路径}/shaodwsocks.png /opt/ShadowSocks-Qt5
```

建立启动器

```shell
# 进入启动器文件夹
cd /usr/share/applications

# 新建desktop文件
sudo vim ShadowSocks.desktop
```

写入如下内容

```ini
[Desktop Entry]
Name=ShadowSocks
Comment=ShadowSocks
Type=Application
Exec=/opt/ShadowSocks-Qt5/Shadowsocks-Qt5-3.0.1-x86_64.AppImage
Icon=/opt/ShadowSocks-Qt5/shadowsocks.png
Terminal=false
StartupNotify=true
Categories=Application;
```

保存退出，你应该在应用程序里能见到Shadowsocks的启动器图标了

然后安装浏览器代理插件[SwitchyOmega](https://github.com/FelisCatus/SwitchyOmega/releases):

- 点击下载`crx`文件:[SwitchyOmega.crx](https://github.com/FelisCatus/SwitchyOmega/releases/download/v2.5.15/SwitchyOmega.crx)，然后将其拖到浏览器中安装

- 用`wget`下载:
    ```shell
    wget https://github.com/FelisCatus/SwitchyOmega/releases/download/v2.5.15/SwitchyOmega.crx
    ```
    然后拖到浏览器安装

接下来配置`SwitchyOmega`，参考[这篇博客](https://www.sundabao.com/ubuntu使用shadowsocks/)

# 安装Shutter截图软件

- 添加源，并安装 __shutter__:
    ```shell
    sudo add-apt-repository ppa:shutter/ppa
    sudo apt-get update
    sudo apt-get install shutter
    ```

- 设置快捷键

{% asset_img pic14.png %}

# 安装微信

访问[这里](https://github.com/geeeeeeeeek/electronic-wechat/releases)下载 __release__ 64位版本的[linux-x64.tar.gz](https://github.com/geeeeeeeeek/electronic-wechat/releases/download/V2.0/linux-x64.tar.gz)，或者用`wget`:

```shell
wget https://github.com/geeeeeeeeek/electronic-wechat/releases/download/V2.0/linux-x64.tar.gz
```

下载完后解压至`/opt`文件夹下:

```shell
sudo tar -xzvf ${你的下载路径}/linux-x64.tar.gz -C /opt
```

顺便搞一张[图标](https://images2018.cnblogs.com/blog/1127869/201806/1127869-20180602105354254-1327395543.png):

```shell
wget -O wechat.png https://images2018.cnblogs.com/blog/1127869/201806/1127869-20180602105354254-1327395543.png
```

将图标文件放到刚刚解压的路径:

```shell
sudo mv ${你的下载路径}/wechat.png /opt/electronic-wechat-linux-x64/resources
```

建立启动器:

```shell
# 进入启动器文件夹
cd /usr/share/applications

# 新建desktop文件
sudo vim wechat.desktop
```

填入以下内容:

```ini
[Desktop Entry]
Name=wechat
Comment=wechat
Type=Application
Exec=/opt/electronic-wechat-linux-x64/electronic-wechat
Icon=/opt/electronic-wechat-linux-x64/resources/wechat.png
Terminal=false
StartupNotify=true
Categories=Application;
```

赶快去试试吧～

# 安装VSCode

官网下载`deb`包安装

安装后将`dotfile`里的`vscode`配置copy到相应位置（针对博主本人，有兴趣可以参考）:

```shell
cp ~/dotfile/.vscode/* ~/.config/Code/User/
```

# 安装java

- 添加源，更新:
    ```shell
    sudo add-apt-repository ppa:webupd8team/java
    sudo apt update
    ```

- 安装:
    ```shell
    # java8
    sudo apt install oracle-java8-set-default

    #java9
    sudo apt install oracle-java9-set-default
    ```

- 管理java/javac:
    ```shell
    # java
    sudo update-alternatives --config java

    # javac
    sudo update-alternatives --config javac
    ```
    输出，自行选择版本:
    ```shell
    有 1 个候选项可用于替换 java (提供 /usr/bin/java)。

    选择       路径                                   优先级  状态
    ------------------------------------------------------------
      0            /usr/lib/jvm/java-8-oracle/jre/bin/java   1081      自动模式
    * 1            /usr/lib/jvm/java-8-oracle/jre/bin/java   1081      手动模式

    要维持当前值[*]请按<回车键>，或者键入选择的编号：
    ```
    ```shell
    有 1 个候选项可用于替换 javac (提供 /usr/bin/javac)。

      选择       路径                                优先级  状态
    ------------------------------------------------------------
      0            /usr/lib/jvm/java-8-oracle/bin/javac   1081      自动模式
    * 1            /usr/lib/jvm/java-8-oracle/bin/javac   1081      手动模式

    要维持当前值[*]请按<回车键>，或者键入选择的编号：
    ```
- 配置`JAVA_HOME`:
    ```shell
    sudo vim /etc/environment
    ```
    填入:
    ```ini
    JAVA_HOME="/usr/lib/jvm/java-8-oracle/jre/bin/java"
    ```
    使其生效:
    ```shell
    source /etc/environment
    ```
    检查是否生效:
    ```shell
    echo $JAVA_HOME
    ```

# 安装Anaconda

访问[这里](https://mirrors4.tuna.tsinghua.edu.cn/anaconda/archive/)，下载你想要的anaconda版本，或者直接`wget`:

```shell
# Anaconda3-5.2.0-Linux-x86_64.sh
wget https://mirrors4.tuna.tsinghua.edu.cn/anaconda/archive/Anaconda3-5.2.0-Linux-x86_64.sh
```

然后执行脚本安装，安装位置推荐放在`/opt`或`/usr/local`下，注意不要添加环境变量，以免与系统python冲突
安装完后将`anaconda/bin`下的可执行程序软连接到`/usr/local/bin`下，比如:

```shell
# conda
sudo ln -s /opt/anaconda3/bin/conda /usr/local/bin/conda

# python
sudo ln -s /opt/anaconda3/bin/python /usr/local/bin/python36  # 命名python36是为了不与系统python冲突

# jupyter
sudo ln -s /opt/anaconda3/bin/jupyter /usr/local/bin/jupyter
```

终端执行一下`conda`，`python36`，`jupyter`，看有没有问题

# 安装JetBrain系列

官网下载`deb`包安装