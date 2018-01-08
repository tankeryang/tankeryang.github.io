---
title: Machine Learning (Week3)
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

因此我们只要一个函数{% math %}g(\theta^{T}x){% endmath %}
* 当{% math %}\theta^{T}x > 0{% endmath %}时，{% math %}g(\theta^{T}x) > 0.5{% endmath %}
* 当{% math %}\theta^{T}x < 0{% endmath %}时，{% math %}g(\theta^{T}x) < 0.5{% endmath %}

最后令{% math %}h_{\theta}(x) = g(\theta^{T}x){% endmath %}，就ok了。

## Hypothesis Representation - 假设函数的表示
接着上面的问题。我们给出这样一个函数
<center>
{% math %} g(z) = \frac{1}{1+e^{-z}} {% endmath %}
</center>

它的图像如下
{% asset_img pic4.jpg %}

它满足下述性质

* 当{% math %}z > 0{% endmath %}时，{% math %}g(z) > 0.5{% endmath %}
* 当{% math %}z < 0{% endmath %}时，{% math %}g(z) < 0.5{% endmath %}

因此，我们只需令{% math %}\theta^{T}x = z{% endmath %}，即
<center>
{% math %}g(\theta^{T}x) = \frac{1}{1+e^{-\theta^{T}x}}{% endmath %}
</center>

则可得我们的假设函数
<center>
{% math %}h_{\theta}(x) = g(\theta^{T}x) = \frac{1}{1+e^{-\theta^{T}x}}{% endmath %}
</center>

这里{% math %}h_{\theta}(x){% endmath %}实际上可以理解为如下
<center>
{% math %}h_{\theta}(x) = p(y = 1|x;\theta){% endmath %}
</center>

即输入{% math %}x{% endmath %}的情况下，预测结果为{% math %}1{% endmath %}的概率为{% math %}h_{\theta}(x){% endmath %}。
比如说这是一个良性/恶性肿瘤的分类问题，我们训练出了{% math %}h_{\theta}(x){% endmath %}。现在有一个肿瘤的各项特征为{% math %}x{% endmath %}，我们要判断它是良性{% math %}(y=1){% endmath %}还是恶性{% math %}(y=0){% endmath %}，把{% math %}x{% endmath %}丢进{% math %}h_{\theta}(x){% endmath %}里，结果为{% math %}0.8{% endmath %}，那么我们就可以说这个肿瘤有{% math %}80\%{% endmath %}的概率是良性的。假如我们设置了一个__阈值__为{% math %}0.7{% endmath %}，计算结果超过这个阈值就可以声明预测为真，那么在上面的情况中，我们就可以直接对病人说你的肿瘤是良性的，不用担心。

## Decision Boundary - 判定边界
在逻辑斯谛回归中，我们一般

* 当{% math %}h_{\theta}(x) > 0.5{% endmath %}，即当{% math %}\theta^{T}x > 0{% endmath %}时，预测{% math %}y=1{% endmath %}
* 当{% math %}h_{\theta}(x) < 0.5{% endmath %}，即当{% math %}\theta^{T}x < 0{% endmath %}时，预测{% math %}y=0{% endmath %}

如下图（见上节）
{% asset_img pic2.png %}
{% asset_img pic3.png %}

此时__阈值__为{% math %}0.5{% endmath %}

对于一般的问题，{% math %}0.5{% endmath %}的阈值足以胜任。可是假如是一些精确度要求很高的问题，就比如刚刚的判断肿瘤是否良性，或者判断是否得癌症等，那么就应该把__阈值__设置得高点，预测结果更准确。毕竟是人命关天的事嘛:)

假如我们的样本分布不能线性划分，如下图所示
{% asset_img pic5.png %}

我们可以用一个非线性的边界（高次多项式）来划分。

## Cost function - 代价函数

对于前面的回归问题，我们的代价函数是__所有误差的平方和取均值__（实际上就是__方差__）
<center>
{% math %}
J(\theta)=\frac{1}{2m}\sum_{i=1}^{m}\left(h_{\theta}(x^{(i)})-y^{(  i)}\right)^{2}
{% endmath %}
</center>

<br />
如果我们沿用这个计算方法，将逻辑斯谛回归的{% math %}h_{\theta}(x) = g(\theta^{T}x) = \frac{1}{1+e^{-\theta^{T}x}}{% endmath %}代入进上式的话，我们的函数图像会呈现出下面一种状况
{% asset_img pic6.png %}

这是一个__非凸函数__，它有许多的局部最小值，不利于用梯度下降法寻找全局最小值。
所以我们要对逻辑回归重新定义一个代价函数。

根据我们{% math %}h_{\theta}(x){% endmath %}的性质

* 当{% math %}\theta^{T}x > 0{% endmath %}时，{% math %}h_{\theta}(x) > 0.5{% endmath %}
* 当{% math %}\theta^{T}x < 0{% endmath %}时，{% math %}h_{\theta}(x) < 0.5{% endmath %}
* {% math %}h_{\theta}(x) \in (0, 1){% endmath %}

我们对代价函数作出如下定义
<center>
{% math %}
Cost\left( h_{\theta}\left( x \right), y \right) =\begin{cases}
 -log\left( h_{\theta}\left( x \right ) \right )& \text{ if } y = 1 \\ 
 -log\left( 1 - h_{\theta}\left( x \right ) \right )& \text{ if } y = 0
\end{cases} 
{% endmath %}
</center>

它的函数图像和意义如下所示


* 当{% math %}y = 1{% endmath %}时
{% asset_img pic8.jpg %}

它所反映的就是当样本结果{% math %}y = 1{% endmath %}时，如果我们{% math %} h_{\theta}(x) {% endmath %}输出也{% math %}\rightarrow 1{% endmath %}的话，我们的误差就{% math %}\rightarrow 0{% endmath %}；反之，如果我们{% math %}h_{\theta}(x){% endmath %}输出{% math %}\rightarrow 0{% endmath %}的话，我们的误差就{% math %}\rightarrow \infty{% endmath %}
<br>

* 当{% math %}y = 0{% endmath %}时
{% asset_img pic7.jpg %}

它所反映的就是当样本结果{% math %}y = 0{% endmath %}时，如果我们{% math %} h_{\theta}(x) {% endmath %}输出也{% math %}\rightarrow 0{% endmath %}的话，我们的误差就{% math %}\rightarrow 0{% endmath %}；反之，如果我们{% math %}h_{\theta}(x){% endmath %}输出{% math %}\rightarrow 1{% endmath %}的话，我们的误差就{% math %}\rightarrow \infty{% endmath %}

没毛病:)

## Simplified cost function and gradient descent - 化简代价函数与梯度下降
对于{% math %}Cost\left( h_{\theta}\left( x \right), y \right){% endmath %}，我们可以化简成
<center>
{% math %}Cost\left( h_{\theta}\left( x \right), y \right) = -ylog\left( h_{\theta}\left( x \right) \right) - \left( 1-y \right)log\left( 1-h_{\theta}\left( x \right) \right){% endmath %}
</center>

<br>
对于{% math %}J(\theta){% endmath %}我们作如下定义
<center>
{% math %}
J(\theta) = \frac{1}{m} \sum_{i=1}^{m}Cost\left( h_{\theta}\left( x^{\left( i \right)} \right), y^{\left( i \right) }\right)
{% endmath %}
</center>

<br>
将{% math %}Cost\left( h_{\theta}\left( x \right), y \right){% endmath %}代入上式，则可得
<center>
{% math %}
J(\theta) = - \frac{1}{m} \sum_{i=1}^{m} \left[ y^{\left( i \right)}log\left( h_{\theta}\left( x^{\left( i \right)} \right) \right) + \left( 1-y^{\left( i \right)} \right)log\left( 1-h_{\theta}\left( x^{\left( i \right)} \right) \right) \right]
{% endmath %}
</center>

<br>
这时我们就可以用__梯度下降__来求{% math %}min_{\theta}J(\theta){% endmath %}。

与回归一样，我们要做的就是不断更新{% math %}\theta{% endmath %}
<center>
{% math %}
\theta := \theta - \alpha \frac{\partial J}{\partial \theta}
{% endmath %}
</center>

<br>
接下来我们来推导一下{% math %}\frac{\partial J}{\partial \theta}{% endmath %}。

首先，我们有

* {% math %}X_{m \times (n+1)}\begin{bmatrix}x_{0}^{(1)} & x_{1}^{(1)} & \cdots & x_{n}^{(1)}\\ \vdots & \vdots & \ddots & \vdots\\ x_{0}^{(m)} & x_{1}^{(m)} & \cdots & x_{n}^{(m)}\end{bmatrix} = \begin{bmatrix}1 & x_{1}^{(1)} & \cdots & x_{n}^{(1)}\\ \vdots & \vdots & \ddots & \vdots\\ 1 & x_{1}^{(m)} & \cdots & x_{n}^{(m)}\end{bmatrix}{% endmath %}

<br>

* {% math %}Y_{m\times 1} = \begin{bmatrix} y^{(1)} & \cdots & y^{(m)}\end{bmatrix}^{T}{% endmath %}

<br>

* {% math %}\theta = \begin{bmatrix}\theta_{0} & \theta_{1} & \cdots  & \theta_{n} \end{bmatrix}^{T}{% endmath %}

<br>

* {% math %}\frac{\partial J}{\partial \theta} = - \frac{1}{m} \sum_{i=1}^{m} \left[ y^{(i)}\frac{\partial log(h_{\theta}(x^{(i)}))}{\partial \theta} + ( 1-y^{(i)})\frac{\partial log(1-h_{\theta}( x^{(i)} ))}{\partial \theta} \right]{% endmath %}

<br>

* {% math %}h_{\theta}(x^{(i)}) = g(\theta^{T}x^{(i)}) = \frac{1}{1+e^{-\theta^{T}x^{(i)}}}{% endmath %}

<br>
因为
<center>
{% math %}
y^{(i)} \frac{\partial log(h_{\theta}(x^{(i)}))}{\partial \theta} = \frac{y^{(i)}}{h_{\theta}(x^{(i)})} \cdot \frac{x^{(i)}e^{-\theta^{T}x^{(i)}}}{(1+e^{-\theta^{T}x^{(i)}})^{2}}
{% endmath %}
<br>
{% math %}
= y^{(i)}(1+e^{-\theta^{T}x^{(i)}}) \cdot \frac{x^{(i)}e^{-\theta^{T}x^{(i)}}}{(1+e^{-\theta^{T}x^{(i)}})^{2}}
{% endmath %}
<br>
{% math %}
= y^{(i)} \frac{x^{(i)}e^{-\theta^{T}x^{(i)}}}{1+e^{-\theta^{T}x^{(i)}}}
{% endmath %}
<br>
{% math %}
= y^{(i)} h_{\theta}(x^{(i)})x^{(i)}e^{-\theta^{T}x^{(i)}}
{% endmath %}
</center>

<br>
又因为
<center>
{% math %}
(1-y^{(i)}) \frac{\partial log(1-h_{\theta}( x^{(i)} ))}{\partial \theta} = - (1-y^{(i)}) \frac{1}{1-h_{\theta}(x^{(i)})} \cdot \frac{x^{(i)}e^{-\theta^{T}x^{(i)}}}{(1+e^{-\theta^{T}x^{(i)}})^{2}}
{% endmath %}
<br>
{% math %}
= - (1-y^{(i)}) \frac{1+e^{-\theta^{T}x^{(i)}}}{e^{-\theta^{T}x^{(i)}}} \cdot \frac{x^{(i)}e^{-\theta^{T}x^{(i)}}}{(1+e^{-\theta^{T}x^{(i)}})^{2}}
{% endmath %}
<br>
{% math %}
= - (1-y^{(i)}) \frac{x^{(i)}}{1+e^{-\theta^{T}x^{(i)}}}
{% endmath %}
<br>
{% math %}
= - (1-y^{(i)})x^{(i)}h_{\theta}(x^{(i)})
{% endmath %}
</center>

<br>
将上面两式相加，提出{% math %}h_{\theta}(x^{(i)})x^{(i)}{% endmath %}，得
<center>
{% math %}
h_{\theta}(x^{(i)})x^{(i)} \left[y^{(i)}(1+e^{-\theta^{T}x^{(i)}}) - 1\right]
{% endmath %}
<br>
{% math %}
= x^{(i)}y^{(i)} - x^{(i)}h_{\theta}(x^{(i)})
{% endmath %}
<br>
{% math %}
= x^{(i)} (y^{(i)} - h_{\theta}(x^{(i)}))
{% endmath %}
</center>

<br>
将上式代入{% math %}\frac{\partial J}{\partial \theta}{% endmath %}，则
<center>
{% math %}
\frac{\partial J}{\partial \theta} = \frac{1}{m} \sum_{i=1}^{m}(h_{\theta}(x^{(i)}) - y^{(i)})x^{(i)}
{% endmath %}
</center>

<br>
我们惊奇地发现，{% math %}\frac{\partial J}{\partial \theta}{% endmath %}的表达式居然跟回归是一样的！这就是数学的魅力！
因此，参考<a href="https://tankeryang.github.io/posts/Machine%20Learning%20(Week1)/#Gradient-Descent-for-Liner-Regression-线性回归中的梯度下降">week1</a>的推导，可得
<center>
{% math %}
\frac{\partial J}{\partial \theta} = \frac{1}{m} X^{T}(X\theta - Y)
{% endmath %}

{% math %} 
\theta := \theta - \alpha \frac{1}{m} X^{T}(X\theta - Y)
{% endmath %}
</center>

## Multi-class classification: One-vs-all - 多分类问题：一对多
在实际分类问题中，我们遇到的大多是需要__分多个类__的问题，比如联系人的分类有家人，朋友，同事，同学等等。在可视化图像中，它们可能会呈现出如下的分布
{% asset_img pic9.png %}

一对多的做法就是我们分别对这三个类训练{% math %}h_{\theta}^{(i)}(x){% endmath %}，其中{% math %}i{% endmath %}为类别序号。如下图所示
{% asset_img pic10.png %}

训练完所有的{% math %}h_{\theta}^{(i)}(x){% endmath %}后，当我们给一组输入特征{% math %}x{% endmath %}时，取__最大的__{% math %}h_{\theta}^{(i)}(x){% endmath %}作为我们的预测结果。
