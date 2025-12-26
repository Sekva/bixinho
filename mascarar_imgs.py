from PIL import Image
import sys, os

inp = sys.argv[1]
out = inp

im = Image.open(inp).convert("RGBA")
r,g,b,a = im.split()
mask = Image.new("RGBA", im.size, (255,255,255,0))
mask.putalpha(a)
mask.save(out)
print(out)


with open("imgs_mascaradas.db", "w") as f:
    f.write("a")
