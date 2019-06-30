# Blog source file

[![Travis](https://www.travis-ci.org/tankeryang/tankeryang.github.io.svg?branch=master)](https://tankeryang.github.io)

## 如何克隆

* 设置 git http代理[(点我)](https://www.jianshu.com/p/1a1c764661ed)
```
git config --global http.proxy 'socks5://127.0.0.1:1086'
git config --global https.proxy 'socks5://127.0.0.1:1086'
```

* 克隆
```
git clone https://github.com/tankeryang/tankeryang.github.io.git
```

* 取消代理
```
git config --global --unset http.proxy
git config --global --unset https.proxy

# 或者修改 ～/.gitconfig 文件
```

* 更改```~/.git```下的```config```

```
将
    https://github.com/tankeryang/tankeryang.github.io.git
换成
    git@github.com:tankeryang/tankeryang.github.io.git
```

## 关联分支
* 查看所有分支
```
git branch -a
```

* 创建并切换到dev分支，并与远程dev分支关联
```
git checkout -b dev origin/dev
```

## 安装npm包
按照```.travis.yml```的安装列表进行安装(`install` & `before_script`)