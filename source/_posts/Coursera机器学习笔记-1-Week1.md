---
title: Coursera机器学习笔记(1)_Week1
date: 2017-09-06 15:38:01
categories: 机器学习笔记
tags: [机器学习, ML, 数学]
mathjax: true
comments: 
---
在第一周的课程里简要介绍了__什么是机器学习__，__Model - 模型__和__Cost Function - 代价函数__的概念，以及一些必要的__线性代数__的知识。

{% note warning %} 
__特别声明__：这里不会对线性代数基础进行记录，有需要了解的请自行学习。

<center><strong>敬请留意</strong></center>
{% endnote %}

<!--more-->

# Introduction - 简介 
## What is Machine Learning? - 何为机器学习？
引用Tom Mitchell的经典解释（有点像绕口令）
>Two definitions of Machine Learning are offered. Arthur Samuel described it as: "the field of study that gives computers the ability to learn without being explicitly programmed." This is an older, informal definition.
>
Tom Mitchell provides a more modern definition: "A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E."
>
Example: playing checkers.
>
E = the experience of playing many games of checkers
>
T = the task of playing checkers.
>
P = the probability that the program will win the next game.
>
In general, any machine learning problem can be assigned to one of two broad classifications:
>
Supervised learning and Unsupervised learning.

## Supervised Learning - 有监督学习
有监督学习，简要的说，就是我们有一个__数据集__，并且我们知道这对数据的__输出__是张什么样的，而且可以肯定作为变量的输入数据与作为结果的输出数据之间有着必然的联系。

有监督学习通常分为__regression - 回归__与__classification - 分类__两类问题。
* 在回归问题中，我们要做的就是得到一个连续的__预测函数__去拟合离散的数据，也就是要把__输入变量映射到连续函数上__，从而实现未知数据的预测。
{% note info %} 
__例子：__
Given data about the size of houses on the real estate market, try to predict their price. Price as a function of size is a continuous output, so this is a regression problem.
We could turn this example into a classification problem by instead making our output about whether the house "sells for more or less than the asking price." Here we are classifying the houses based on price into two discrete categories.
{% asset_img pic1.jpg %}
{% endnote %}

* 在分类问题中，输出结果是离散的，比如二分类问题，每一类别分别对应0,1两个离散数值，我们要做的就是得到一个__预测函数__，能够根据输入变量得到离散的输出结果，也就是要把__输入变量映射到离散的类别中__
{% note info %} 
__例子：__
(a) Classification - Given a patient with a tumor, we have to predict whether the tumor is malignant or benign.
{% asset_img pic2.jpg %}

(b) Regression - Given a picture of a person, we have to predict their age on the basis of the given picture
{% asset_img pic3.jpg %}
{% endnote %}

## Unsupervised Learning - 无监督学习
无监督学习就是有监督学习的反面情况，即我们有一组数据集，但我们并不知道它的输出结果是什么，或者它根本就没有输出，甚至它本身代表什么我们都不知道。我们要做的就是从这堆数据中__找出它的规律或者结构__，来确定这些输入变量产生的影响，比如将这堆数据分组。

特别的是，无监督学习并不像有监督学习那样有基于预测结果的反馈。

现实生活中有很多这样的例子，比如你有一堆新闻内容的数据，你要把有关联的分成一组。像这样的算法叫做__聚类__，就如字面意思一样。

{% note info %} 
__例子：__
{% asset_img pic4.jpg %}
{% asset_img pic5.jpg %}
{% asset_img pic6.jpg %}
{% asset_img pic7.jpg %}
{% endnote %}

---
# Model and Cost Function - 模型与代价函数
## Model Representation - 模型的表示方法 
对于__有监督学习__，在这门课程里有一套专门的符号，参数，公式的表示方法：
* $vector$: 向量（都指列向量）
* $m$: 训练样本组数
* $x^{\left(i \right)}$ : 第$i$组输入变量（一般为向量）
* $y^{\left(i \right)}$: 第$i$组输出变量（一般为向量）
* $\left(x^{\left(i \right)}, y^{\left(i \right)} \right)$: 第$i$组训练样本
* $\left(x, y\right)$: 全体训练样本数据
* $X$: 输入变量空间（一般为矩阵）
* $Y$: 输出变量空间（一般为矩阵）
* $h_{\theta} \left(x \right)$: 预测函数
* $\theta_{j}$: 第$j$组学习参数

{% note info %} 
__例子：__
假设我们有一组（房子面积, 价格）数据集，对应下表:

|$Size in feet^{2}$ (x)|$prize$ (y)|
|:---:|:---:|
|2104|460|
|1416|232|
|1534|315|
|852|178|

{% endnote %}

其中
* $m = 4$
* $x^{\left(1 \right)} = 2104$
* $y^{\left(1 \right)} = 460$
* $\left(x^{\left(1 \right)}, y^{\left(1 \right)} \right) = (2104, 460)$
* $X$ = $\begin{bmatrix}2104 & 1416 & 1534 & 852\end{bmatrix}^{T}$
* $Y$ = $\begin{bmatrix}460 & 232 & 315 & 178\end{bmatrix}^{T}$
* {% math %}h_{\theta}\left(x\right)=\theta_{0}+\theta_{1}x{% endmath %}
* $\theta_{1}$: 第$1$组学习参数

对于多变量（或者叫__feature - 特征__）的表示方法，如下
{% note info %}
__例子：__
假设我们有一组多个特征的数据，每组特征对应一个确定的输出：

|$X_{0}$|$X_{1}$|$X_{2}$|$X_{3}$|...|$X_{n}$|$Y$|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|$1$|$x_{1}^{(1)}$|$x_{2}^{(1)}$|$x_{3}^{(1)}$|...|$x_{n}^{(1)}$|$y^{(1)}$|
|$1$|$x_{1}^{(2)}$|$x_{2}^{(2)}$|$x_{3}^{(2)}$|...|$x_{n}^{(2)}$|$y^{(2)}$|
|$1$|$x_{1}^{(3)}$|$x_{2}^{(3)}$|$x_{3}^{(3)}$|...|$x_{n}^{(3)}$|$y^{(3)}$|
|...|...|...|...|...|...|...|
|$1$|$x_{1}^{(m)}$|$x_{2}^{(m)}$|$x_{3}^{(m)}$|...|$x_{n}^{(m)}$|$y^{(m)}$|

{% endnote %}

其中
* {% math %}X_{m\times (n+1)} = \begin{bmatrix}1 & x_{1}^{(1)} & \cdots &x_{n}^{(1)} \\ \vdots & \vdots & \ddots & \vdots \\ 1 & x_{1}^{(m)} & \cdots & x_{n}^{(m)} \\ \end{bmatrix}{% endmath %}

* $Y_{m\times 1} = \begin{bmatrix} y^{(1)} & \cdots & y^{(m)}\end{bmatrix}^{T}$

* {% math %}\theta = \begin{bmatrix} \theta_{0} & \theta_{1} & \cdots & \theta_{n} \end{bmatrix}^{T}{% endmath %}

* {% math %}
h_{\theta}\left(x\right)=\begin{bmatrix}h_{\theta}\left(x^{(1)}\right)&h_{\theta}\left(x^{(2)}\right)&\cdots&h_{\theta}\left(x^{(m)}\right)\end{bmatrix}^{T}=\begin{bmatrix}\theta^{T}x^{(1)}&\theta^{T}x^{(2)}&\cdots&\theta^{T}x^{(m)}\end{bmatrix}^{T}
{% endmath %}

整个监督学习的过程，就是找到最优的$\theta$，从而得到最优的{% math %}h_{\theta}\left(x\right){% endmath %}。对于__回归问题__，预测就是我们把一组$x$丢进 {% math %}h_{\theta}\left(x\right){% endmath %} 中，得到的结果就是预测值。对于__分类问题__，$h_{\theta}\left(x\right)$得到的结果是一个概率，即输入$x$属于某一类的概率值是多少。或许你觉得我解释得很抽象，因为这里的内容只是让你的大脑对机器学习有一个大致的轮廓。详细的过程将记录在后面的笔记中，请读者放心。

## Cost Function - 代价函数
回到我们上面的那个（房子面积, 价格）数据集的例子中。这是一个<strong>单变量</strong>的回归问题。如下
{% note info %}
{% asset_image pic8.jpg %}
{% endnote %}
在这里，我们的预测函数为{% math %}h_{\theta}(x)=\theta_{0}+\theta_{1}x{% endmath %}。当$\theta$取不同值时，对应如下图：

{% asset_image pic9.jpg %}

我们要找到最优的$\theta$去拟合$(x,y)$，首先就要定义一个能判断当前$\theta$是否最优的函数，这个函数就是__代价函数__。在这里我们将它定义为$J(\theta)$。

那么它等于什么呢？下面给个直观的图例辅助解释：

{% asset_image pic10.jpg %}

在这幅图里，有3组样本数据为

|$X$|$Y$|
|:---:|:---:|
|1|1|
|2|2|
|3|3|
分别对应上图三个<font color="#fc0c0c">红色×点</font>。<font color="#000000">黑色斜线</font>为
<center>
{% math %}
h_{\theta}(x)=0+0.5x
{% endmath %}
</center>
过这3点分别作垂直于$x$轴的__垂线段__交于{% math %}h_{\theta}(x){% endmath %}。则第$i$个样本点的误差（即代价）就是该样本点对应__垂线段的长度__，为
<center>
{% math %}
\left|h_{\theta}(x^{(i)})-y^{(i)}\right|
{% endmath %}
</center>
为方便处理，我们将绝对值去掉，重新定义误差为
<center>
{% math %}
\left(h_{\theta}(x^{(i)})-y^{(i)}\right)^{2}
{% endmath %}
</center>
则总误差为
<center>
{% math %}
\sum_{i=1}^{3}\left(h_{\theta}(x^{(i)})-y^{(i)}\right)^{2}
{% endmath %}
</center>
平均误差为
<center>
{% math %}
\frac{1}{3}\sum_{i=1}^{3}\left(h_{\theta}(x^{(i)})-y^{(i)}\right)^{2}
{% endmath %}
</center>
为了方便后面处理，这里我们一般将平均误差乘一个$\frac{1}{2}$，即
<center>
{% math %}
\frac{1}{2 \times 3}\sum_{i=1}^{3}\left(h_{\theta}(x^{(i)})-y^{(i)}\right)^{2}
{% endmath %}
</center>
上式就是我们的代价函数，即
<center>
{% math %}
J(\theta)=\frac{1}{6}\sum_{i=1}^{3}\left(h_{\theta}(x^{(i)})-y^{(i)}\right)^{2}
{% endmath %}
</center>
将上式扩展到$m$个样本点的一般情况，即
<center>
{% math %}
J(\theta)=\frac{1}{2m}\sum_{i=1}^{m}\left(h_{\theta}(x^{(i)})-y^{(i)}\right)^{2}
{% endmath %}
</center>
当我们的$\theta$能令$J(\theta)$取到最小值时，我们就认为这是最优的$\theta$。

是不是很直观？

有了代价函数之后，我们要做的就是找出令它取得最小值的$\theta$，下图就是我们的任务：

{% asset_image pic11.jpg %}

其中 __Goal__ 就是我们的优化目标

这是典型的极值问题，在数学方法中，我们可以求导解决，可是在计算机程序中，我们要用一种__通用的数值方法__，去逼近。

我们看只有一个学习参数的情况，假设{% math %}h_{\theta}(x)=\theta x{% endmath %}

当{% math %}\theta{% endmath %}比较小时：
{% asset_img pic12.png %}
我们看到{% math %}h_{\theta}(x){% endmath %}没有很好地拟合数据，{% math %}J(\theta){% endmath %}比较大。

当{% math %}\theta{% endmath %}比较大时：
{% asset_img pic13.png %}
同样的，{% math %}h_{\theta}(x){% endmath %}没有很好地拟合数据，{% math %}J(\theta){% endmath %}比较大。

当{% math %}\theta{% endmath %}比取到能使{% math %}h_{\theta}(x)=\theta x{% endmath %}很好地拟合数据时：
{% asset_img pic14.png %}
这时的{% math %}theta{% endmath %}就是{% math %}J(\theta){% endmath %}的极小值点。也就是最优的{% math %}\theta{% endmath %}。

接下来我们就来讲，如何让计算机自动训练出最优的{% math %}\theta{% endmath %}

---
# Parameter Learning - 参数学习
## Gradient Descent - 梯度下降
我们继续用上面的例子，
当{% math %}\theta{% endmath %}比较小时：
{% asset_img pic15.png %}
我们求得{% math %}J(\theta){% endmath %}在当前{% math %}\theta{% endmath %}的导数，__小于__{% math %}0{% endmath %}。此时我们把{% math %}\theta{% endmath %}更新为{% math %}\theta - \alpha\frac{dJ(\theta)}{d\theta}{% endmath %}，{% math %}\theta{% endmath %}就会__变大__，往极值点靠近。其中{% math %}\alpha{% endmath %}为__学习速率__。

当{% math %}\theta{% endmath %}比较大时：
{% asset_img pic16.png %}
我们求得{% math %}J(\theta){% endmath %}在当前{% math %}\theta{% endmath %}的导数，__大于__{% math %}0{% endmath %}。此时我们把{% math %}\theta{% endmath %}更新为{% math %}\theta - \alpha\frac{dJ(\theta)}{d\theta}{% endmath %}，{% math %}\theta{% endmath %}就会 __减小__，往极值点靠近。其中{% math %}\alpha{% endmath %}为__学习速率__。

这就是__梯度下降__算法。通过多次的迭代，更新{% math %}\theta{% endmath %}，我们就能无限逼近最优值。

将{% math %}\theta{% endmath %}拓展到__二维向量__（即有两个参数）的情形，我们可能会得到如下的{% math %}J(\theta){% endmath %}：
{% asset_img pic17.png %}
这是一个二维曲面，这种情况我们就要分别对{% math %}\theta_{0},\theta_{1}{% endmath %}求偏导来进行梯度下降。

对于梯度下降，还有一些要注意的地方：
* 关于__学习速率__{% math %}\alpha{% endmath %}，怎样设置学习速率也是很关键的问题，如果{% math %}\alpha{% endmath %}设置的__过小__，则梯度下降就会收敛得很慢，训练时间会过长。如果{% math %}\alpha{% endmath %}设置的过大，则梯度下降有可能会发散，就是越过了极值点：
{% asset_img pic18.png %}
所以我们在做迭代时一定要关注着{% math %}J(\theta){% endmath %}，确保它是在下降的。

* 在实际问题中，我们的{% math %}J(\theta){% endmath %}一般不会是__凸函数__，也就是说我们做梯度下降得到的只是__局部最优值__，而不是__全局最优值__：
{% asset_img pic19.png %}
{% asset_img pic20.png %}

## Gradient Descent for Liner Regression - 线性回归中的梯度下降
对于线性回归，我们有如下定义：
* {% math %}X_{m\times (n+1)} = \begin{bmatrix}1 & x_{1}^{(1)} & \cdots &x_{n}^{(1)} \\ \vdots & \vdots & \ddots & \vdots \\ 1 & x_{1}^{(m)} & \cdots & x_{n}^{(m)} \\ \end{bmatrix}{% endmath %}

* {% math %}Y_{m\times 1} = \begin{bmatrix} y^{(1)} & \cdots & y^{(m)}\end{bmatrix}^{T}{% endmath %}

* {% math %}\theta = \begin{bmatrix} \theta_{0} & \theta_{1} & \cdots & \theta_{n} \end{bmatrix}^{T}{% endmath %}
* {% math %}
h_{\theta}\left(x\right)=\begin{bmatrix}h_{\theta}\left(x^{(1)}\right)&h_{\theta}\left(x^{(2)}\right)&\cdots&h_{\theta}\left(x^{(m)}\right)\end{bmatrix}^{T}=\begin{bmatrix}\theta^{T}x^{(1)}&\theta^{T}x^{(2)}&\cdots&\theta^{T}x^{(m)}\end{bmatrix}^{T} = X \theta
{% endmath %}

* {% math %}h_{\theta}\left(x^{(i)}\right) = \theta_{0} + \theta_{1}x_{1}^{i} + \cdots + \theta_{n}x_{n}^{i}{% endmath %}

* {% math %}J(\theta)=\frac{1}{2m}\sum_{i=1}^{m}\left(h_{\theta}(x^{(i)})-y^{(i)}\right)^{2}{% endmath %}

我们对{% math %}J(\theta){% endmath %}求所有{% math %}\theta{% endmath %}的偏导：
<center>
{% math %}
\frac{\partial J}{\partial \theta_{j}} = \frac{1}{m} \sum_{i=1}^{m} \left[\left( h_{theta}(x^{(i)})-y^{i} \right) \frac{\partial h_{theta}(x^{(i)})}{\partial \theta_{j}} \right]
{% endmath %}
</center>
当{% math %}j=0{% endmath %}时
<center>
{% math %}
\frac{\partial h_{theta}(x^{(i)})}{\partial \theta_{0}} = 1
{% endmath %}
</center>
当{% math %}j=1 \cdots n{% endmath %}时
<center>
{% math %}
\frac{\partial h_{theta}(x^{(i)})}{\partial \theta_{j}} = x_{j}^{i}
{% endmath %}
</center>
综上
<center>
{% math %}
\frac{\partial J}{\partial \theta_{0}} = \frac{1}{m} \sum_{i=1}^{m} \left[\left( h_{theta}(x^{(i)})-y^{i} \right)\right]
{% endmath %}

{% math %}
\frac{\partial J}{\partial \theta_{1}} = \frac{1}{m} \sum_{i=1}^{m} \left[\left( h_{theta}(x^{(i)})-y^{i} \right) x_{1}^{i} \right]
{% endmath %}

{% math %}
\vdots
{% endmath %}

{% math %}
\frac{\partial J}{\partial \theta_{n}} = \frac{1}{m} \sum_{i=1}^{m} \left[\left( h_{theta}(x^{(i)})-y^{i} \right) x_{n}^{i} \right]
{% endmath %}
</center>
更新{% math %}\theta{% endmath %}
<center>
{% math %}
\theta_{0}:=\theta_{0} - \alpha \frac{1}{m} \sum_{i=1}^{m} \left[\left( h_{theta}(x^{(i)})-y^{i} \right)\right]
{% endmath %}

{% math %}
\theta_{1}:=\theta_{1} - \alpha \frac{1}{m} \sum_{i=1}^{m} \left[\left( h_{theta}(x^{(i)})-y^{i} \right) x_{1}^{i} \right]
{% endmath %}

{% math %}
\vdots
{% endmath %}

{% math %}
\theta_{n}:=\theta_{n} - \alpha \frac{1}{m} \sum_{i=1}^{m} \left[\left( h_{theta}(x^{(i)})-y^{i} \right) x_{n}^{i} \right]
{% endmath %}
</center>

我们将上述过程向量化：
* 首先将偏导数向量化
<center>
{% math %} 
\frac{\partial J}{\partial \theta_{0}} = \frac{1}{m} \begin{bmatrix}h_{\theta}(x^{(1)})-y^{(1)}&h_{\theta}(x^{(2)})-y^{(2)}&\cdots&h_{\theta}(x^{(m)})-y^{(m)}\end{bmatrix} \begin{bmatrix}1\\1\\ \vdots\\1\end{bmatrix}
{% endmath %}  

{% math %} 
\frac{\partial J}{\partial \theta_{1}} = \frac{1}{m} \begin{bmatrix}h_{\theta}(x^{(1)})-y^{(1)}&h_{\theta}(x^{(2)})-y^{(2)}&\cdots&h_{\theta}(x^{(m)})-y^{(m)}\end{bmatrix} \begin{bmatrix}x_{1}^{(1)}\\x_{1}^{(2)}\\ \vdots\\ x_{1}^{(m)}\end{bmatrix}
{% endmath %}

{% math %} 
\vdots
{% endmath %}  

{% math %} 
\frac{\partial J}{\partial \theta_{n}} = \frac{1}{m} \begin{bmatrix}h_{\theta}(x^{(1)})-y^{(1)}&h_{\theta}(x^{(2)})-y^{(2)}&\cdots&h_{\theta}(x^{(m)})-y^{(m)}\end{bmatrix} \begin{bmatrix}x_{n}^{(1)}\\x_{n}^{(2)}\\ \vdots\\ x_{n}^{(m)}\end{bmatrix}
{% endmath %}

可得
{% math %} 
\frac{\partial J}{\partial \theta} = grad_{(n+1)\times 1} = \frac{1}{m} X^{T}(X\theta - Y)
{% endmath %}  

* 接着将梯度下降的过程向量化
{% math %} 
\theta := \theta - \alpha \frac{1}{m} X^{T}(X\theta - Y)
{% endmath %}
</center>

---
PS:其实上面的__多变量线性回归梯度下降__ 是 __week2__的内容，因为不算太复杂我就搬到这里讲了，那么__week2__的笔记里就会跳过这部分内容，请大家注意。
{% note info %}
<center><strong>课程资料</strong></center>
* [week1课程讲义](https://github.com/tankeryang/Coursera-machine-learning-lecture-note/tree/master/week1)
* [week1编程作业](https://github.com/tankeryang/Coursera-machine-learning-assignment/tree/master/machine-learning-ex1)
{% endnote %}


\begin{bmatrix}1\\1\\ \vdots\\1\end{bmatrix}

