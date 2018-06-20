from PIL import Image
import os
import math

for pic in os.listdir():
    if pic.endswith('.jpg'):
        im = Image.open(pic)
        out = im.resize(tuple(map(lambda x: math.ceil(x * (4/9)), im.size)), Image.ANTIALIAS)
        out.save(pic, quality=120)
    if pic.endswith('.png'):
        im = Image.open(pic)
        out = im.resize(tuple(map(lambda x: math.ceil(x * (4/9)), im.size)), Image.ANTIALIAS)
        out.save(pic, quality=120)