---
title: Coursera机器学习笔记(3)_Week3
date: 2017-10-03 22:26:22
categories: 机器学习笔记
tags: [机器学习, ML, 数学]
mathjax: true
comments:
---
在第三周的课程里，介绍了__Logistic Regression - 逻辑斯谛回归__问题，主要应用在__Classification - 分类__上。还有__Regularization - 正则化__，如何用来解决__Overfitting - 过拟合__问题。

<!--more-->

# Logistic Regression - 逻辑斯谛回归
## Classification - 分类问题
分类在日常中用在很多地方，比如邮件是否垃圾邮件，肿瘤是否良性。通过给定的特征与对应的类别，我们可以训练出一个能够进行分类的算法。相应的，垃圾邮件的特征可以是某些关键词，比如推销类的；而肿瘤的特征可以是肿瘤大小或者别的什么（不懂就不胡说了）。
这时我们的结果$y$就是离散化的数字。
* 如果是__Binary Classification - 二分类__问题，$y$可以离散化为$y = 0 or 1$，对应__是/否__，__大/小__等抽象的结果。
* 如果是__Multiple Classification - 多分类__问题，$y$可以离散化为__元素个数为类别个数的向量__。比如我们需要对某组数据进行分类，训练样本中一共有$n$类，当前训练样本的$y$是属于第$i$类的，则令{% math %}y = [0_{1},0_{2},\cdots,1_{i},\cdots,0_{n}]^{T}{% endmath %}，其中下标位置为对应类别。

这里我们先讨论__Binary Classification - 二分类__问题。同样先来个例子。

假如我们有一组肿瘤大小与其对应性质（良性/恶性）的数据，特征只有一个，就是肿瘤大小，$y=1$和<font color="#ff0000">红色X点</font>代表恶性。如下图：
{% asset_img pic1.png %}
我们看到，假如我们用单纯的线性方程来拟合这组数据，按照图示定义，当{% math %}h_{\theta} = \theta^{T}x >0.5{% endmath %}时预测为恶性，则会与原数据__误差较大__。显然单纯的线性方程很难做到精准的分类。

我们尝试换一种思路。可以看到，两种类型的数据在某一$x$值上会有明显的区分。在$x$左边是良性的，在$x$右边是恶性的。于是我们做如下分析：
{% asset_img pic2.png %}
令分界点{% math %}x = \frac{-\theta_{0}}{\theta_{1}}{% endmath %}，则当{% math %}x > \frac{-\theta_{0}}{\theta_{1}}{% endmath %}即{% math %}\theta^{T}x = \theta_{0}+\theta_{1}x > 0{% endmath %}时，预测$y=1$，当{% math %}x < \frac{-\theta_{0}}{\theta_{1}}{% endmath %}即{% math %}\theta^{T}x = \theta_{0}+\theta_{1}x < 0{% endmath %}时，预测$y=0$。这样就能得到很好的分类效果。

同样的，多特征时也可以如此这般。比如两个特征时的情况：
{% asset_img pic3.png %}

因此我们只要一个函数$g(\theta^{T}x)$
* 当$\theta^{T}x > 0$时，$g(\theta^{T}x) > 0.5$
* 当$\theta^{T}x < 0$时，$g(\theta^{T}x) < 0.5$

最后令{% math %}h_{\theta}(x) = g(\theta^{T}x){% endmath %}，就ok了。