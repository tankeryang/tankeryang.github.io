---
title: Coursera机器学习笔记(1)_Week1
date: 2017-09-06 15:38:01
categories: 机器学习笔记
tags: [机器学习, ML, 数学]
mathjax: true
comments: 
---
在第一周的课程里简要介绍了__什么是机器学习__，__Model - 模型__和__Cost Function - 损失函数__的概念，以及一些必要的__线性代数__的知识。

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
# Model and Cost Function - 模型与损失函数
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

---
## Cost Function - 损失函数
回到我们上面的那个（房子面积, 价格）数据集的例子中。这是一个<strong>单变量</strong>的回归问题。如下
{% note info %}
{% asset_image pic8.jpg %}
{% endnote %}
在这里，我们的预测函数为{% math %}h_{\theta}(x)=\theta_{0}+\theta_{1}x{% endmath %}。当$\theta$取不同值时，对应如下图：

{% asset_image pic9.jpg %}

我们要找到最优的$\theta$去拟合$(x,y)$，首先就要定义一个能判断当前$\theta$是否最优的函数，这个函数就是__损失函数__。在这里我们将它定义为$J(\theta)$。

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
过这3点分别作垂直于$x$轴的__垂线段__交于$h_{\theta}(x)$。则第$i$个样本点的误差（即损失）就是该样本点对应__垂线段的长度__，为
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
上式就是我们的损失函数，即
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

有了损失函数之后，我们要做的就是找出令它取得最小值的$\theta$，下图就是我们的任务：

{% asset_image pic11.jpg %}

其中 __Goal__ 就是我们的优化目标


