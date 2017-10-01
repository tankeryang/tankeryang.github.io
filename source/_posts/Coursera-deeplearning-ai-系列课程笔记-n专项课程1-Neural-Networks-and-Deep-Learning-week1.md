---
title: Coursera deeplearning.ai 系列课程笔记 专项课程1--Neural Networks and Deep Learning_week1
date: 2017-09-30 19:03:30
categories: deeplearning.ai笔记
tags: [机器学习, 深度学习, ML, DL,  数学]
mathjax: true
comments: true
---

第一周的课程里主要是简单介绍__deeplearning - 深度学习__，__Neural NetWork - 神经网络__的概念。

<!--more-->

# Introduction to Deep Learning - 深度学习简介
## What is Neural Network? - 什么是神经网络？
其实__神经网络__并没有想象中那么复杂，它由三部分组成：
* 输入层
* 隐藏层
* 输出层

其中每一层都包含数个__neuron - 神经元__，我称之为__计算节点__。每一层的每一个节点都完成一种计算任务，上一层的节点计算的结果会作为当前层的节点的输入，当前层节点的输出则作为下一层节点的输入。

我们用一个简单的例子来解释：
假如现在有一组数据，是关于房子面积和价格的表格，如下：

|$Size in feet^{2}$ (x)|$prize$ (y)|
|:---:|:---:|
|2104|460|
|1416|232|
|1534|315|
|852|178|

我们可以作线性回归，可能画出来的图是这样的：

{% asset_img pic0.png %}

那么我们可以作如下定义：
* __输入层节点__为房子面积$(x)$
* __隐藏层节点__为<font color="#50ccf1">蓝色直线</font>所代表的 __拟合函数__ $(f)$
* __输出层节点__为 __拟合函数__在对应输入上的输出$(\hat{y})$

可作下图：

{% mermaid %}
graph LR;
    x((x)) --> f((f));
    f((f)) --> y((yhat));
{% endmermaid %}

这就是最简单的神经网络，它只有$3$层，每层只有$1$个节点。只要我们将随便一个房屋子的面积作为输入丢进去，它就会帮我们预测输出价格。

可是只靠面积来预测价格肯定是不严谨的，可能会有多个因素，比如地段，交通便利情况等。这时我们就会有多个输入，也就意味着输入层节点有多个，与输入的特征一一对应。
{% asset_img pic01.png %}

我的总结，__神经网络就是一个多层的嵌套函数__。这句话会在后面的笔记得以充分体现。

---

## Supervised Learning with Neural Networks - 有监督学习神经网络
有监督学习，简要的说，就是我们有一个 __数据集__，并且我们知道这对数据的 __输出__是张什么样的，而且可以肯定作为变量的输入数据与作为结果的输出数据之间有着必然的联系。

有监督学习通常分为__regression - 回归__与__classification - 分类__两类问题。
* 对于回归问题，一般我们的数据都是 __Structured - 结构化__ 的，有着明显的特征：
{% note info %}
{% asset_img pic02.png %}
{% endnote %}

* 对于分类问题，数据一般是 __Unstructured - 无结构化__的，特征不明显：
{% note info %}
{% asset_img pic03.png %}
{% endnote %}

---
关于神经网络的发展请阅读课程资料，这里不在赘述。
{% note info %}
<center><strong>课程资料</strong></center>
[week1课程笔记](https://github.com/tankeryang/Coursera-deeplearning.ai-lecture-note/tree/master/week1/PDF)
{% endnote %}