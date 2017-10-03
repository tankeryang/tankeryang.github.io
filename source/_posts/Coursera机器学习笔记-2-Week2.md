---
title: Coursera机器学习笔记(2)_Week2
date: 2017-10-03 14:43:21
categories: 机器学习笔记
tags: [机器学习, ML, 数学]
mathjax: true
comments:
---
在第二周的课程里，主要讲了__多变量线性回归__以及相应的__梯度下降实践__，一些梯度下降的技巧如__学习速率的选择__，__Feature Scaling - 特征缩放__等，最后介绍了__Polynomial Regression - 多项式回归__和__Normal Equation - 正规方程__。

<!--more-->

# Linear Regression with multiple variables - 多变量线性回归
## Multiple Feature - 多变量
* 参考[__week1__](https://tankeryang.github.io/posts/Coursera机器学习笔记-1-Week1)第二节内容。

## Gradient Descent for multiple variable - 多变量梯度下降
* 参考[__week1__](https://tankeryang.github.io/posts/Coursera机器学习笔记-1-Week1)第三节内容。

## Gradient Descent in practise 1: Feature Scaling - 梯度下降实践1：特征缩放
首先还是用房价预测回归的例子来说明：
假设我们有两个特征：
* {% math %}x_{1} = size(feet_{2}) \in (0,2000){% endmath %}
* {% math %}x_{2} = number of bedrooms \in (1,5){% endmath %}

可以看到{% math %}x_{1}{% endmath %}比{% math %}x_{2}{% endmath %}的取值范围要大了几个数量级。这么做的直接后果就是，只要{% math %}x_{1}{% endmath %}的参数{% math %}\theta_{1}{% endmath %}稍微变化一下，预测值{% math %}h_{\theta}(x){% endmath %}与实际价格之间的误差就会偏移得很厉害，也就导致{% math %}J(\theta){% endmath %}在{% math %}\theta_{1}{% endmath %}偏移得很厉害，如下图所示：
{% asset_img pic1.png %}
我们看到，假如对此进行梯度下降，须迭代多次才能达到极值点。显然这是不ok的。

所以我们要对{% math %}x_{1}{% endmath %}和{% math %}x_{2}{% endmath %}进行缩放，让他们的取值范围落在同一个区间，或者相近区间。

一般我们会用下面的方法进行缩放：
* {% math %}x_{1} = \frac{size(feet_{2})}{2000}{% endmath %}
* {% math %}x_{2} = \frac{number of bedrooms}{5}{% endmath %}

这样我们就能令{% math %}x_{1},x_{2} \in [0,1]{% endmath %}，这种方法也叫__归一化__。
我们在做梯度下降时，速度就会快很多：
{% asset_img pic2.png %}

更普遍的，我们采用如下方法：
<center>
{% math %}x := \frac{x-\mu}{s}{% endmath %}
</center>

其中$\mu$为$x$的均值，$s$为$x$的方差。这样就能令$x\in (-1,1)$。

## Gradient Descent in practise 2: Learning rate - 梯度下降实践2：学习速率
如何选择学习速率是做梯度下降的很关键的一步。在[__week1__](https://tankeryang.github.io/posts/Coursera机器学习笔记-1-Week1)第三节的内容里，我们了解到学习速率$\alpha$设置不当会有怎样的结果。所以当我们做梯度下降时一定要确保每一次迭代时$J(\theta)$都在__减小__，最后收敛于某个值。一般我们可以作__迭代次数 - $J(\theta)$图__来观察$J(\theta)$是否收敛：
{% note info %}
* 收敛
{% asset_img pic3.png %}

* 发散
{% asset_img pic4.png %}

{% endnote %}
或者设置某个阈值（比如$0.001$）来检测，__当__$J(\theta)$__减小的差值小于阈值时__，可以认为$J(\theta)$已收敛到极值。

## Features and Polynomial Regression - 特征与多项式回归
线性回归顾名思义，用于特征与结果有明显的线性关系时的情况。假如我们的某些特征与结果是非线性关系的，比如下图，我们只要观察散点的分布趋向哪种多项式函数然后做拟合就好了：
{% asset_img pic5.png %}

## Normal Equation - 正规方程
根据[__week1__](https://tankeryang.github.io/posts/Coursera机器学习笔记-1-Week1)第三节最后的内容，我们得到：
<center>
{% math %} 
\frac{\partial J}{\partial \theta} = grad_{(n+1)\times 1} = \frac{1}{m} X^{T}(X\theta - Y)
{% endmath %} 
</center>
令其为$0$，可得：
<center>
{% math %} 
X^{T}X\theta - X^{T}Y = 0
{% endmath %}
{% math %}
X^{T}X\theta = X^{T}Y
{% endmath %} 
</center>
则得：
<center>
{% math %}
\theta = (X^{T}X)^{-1}X^{T}Y
{% endmath %}
</center>

<br>
其中要注意的是，$X^{T}X$不一定是可逆的。比如__特征数过多__$(m<<n)$，此时$r(X)\leq m$，$r(X^{T}X)\leq min(r(X),r(X^{T}))\leq m < n$。而$X^{T}X\in n\times n$，因此$X^{T}X$是不可逆的。
因此在__样本数量远大于特征数量__时才能用正规方程。

# 小结
具体问题具体分析，梯度下降虽然基础，但在许多问题上仍然是很有效的。正规方程用在合适的问题上则能非常快的得出结果。各司其职。

{% note info %}
<center><strong>课程资料</strong></center>
* [week2课程讲义](https://github.com/tankeryang/Coursera-machine-learning-lecture-note/tree/master/week2)
* [编程作业ex1](https://github.com/tankeryang/Coursera-machine-learning-assignment/tree/master/machine-learning-ex1)
{% endnote %}
