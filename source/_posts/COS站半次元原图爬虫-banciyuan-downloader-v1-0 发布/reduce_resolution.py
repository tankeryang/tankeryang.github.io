from PIL import Image
import os
import math

for pic in os.listdir():
    if pic.endswith('.jpg'):
        im = Image.open(pic)
        out = im.resize(tuple(map(lambda x: math.ceil(x / 5), im.size)), Image.ANTIALIAS)
        out.save(pic, quality=120)