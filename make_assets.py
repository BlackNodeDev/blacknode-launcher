from PIL import Image, ImageDraw, ImageFilter
def icon(S, k=1.0):
    im=Image.new('RGBA',(S,S),(5,5,10,255))
    bg=Image.new('RGBA',(S,S),(0,0,0,0));d=ImageDraw.Draw(bg)
    d.ellipse([S*.05,S*.0,S*1.1,S*1.0],fill=(90,70,220,70));bg=bg.filter(ImageFilter.GaussianBlur(S*.18));im=Image.alpha_composite(im,bg)
    cx=S/2
    pts=[(cx-S*.13*k,S/2+S*.25*k),(cx-S*.13*k,S/2-S*.27*k),(cx+S*.07*k,S/2-S*.27*k),(cx+S*.19*k,S/2-S*.19*k),(cx+S*.19*k,S/2-S*.09*k),(cx+S*.07*k,S/2-S*.01*k),(cx-S*.13*k,S/2-S*.01*k),(cx+S*.08*k,S/2-S*.01*k),(cx+S*.21*k,S/2+S*.08*k),(cx+S*.21*k,S/2+S*.17*k),(cx+S*.08*k,S/2+S*.25*k),(cx-S*.13*k,S/2+S*.25*k)]
    def stroke(w,col,blur):
        l=Image.new('RGBA',(S,S),(0,0,0,0));dd=ImageDraw.Draw(l);dd.line(pts,fill=col,width=int(w),joint='curve')
        for p in (pts[0],pts[2]):r=w/2;dd.ellipse([p[0]-r,p[1]-r,p[0]+r,p[1]+r],fill=col)
        return l.filter(ImageFilter.GaussianBlur(blur)) if blur else l
    for w,col,b in [(S*.16*k,(120,110,255,200),S*.07),(S*.1*k,(170,140,255,230),S*.025),(S*.07*k,(139,123,255,255),0),(S*.028*k,(235,232,255,255),S*.004)]:
        im=Image.alpha_composite(im,stroke(w,col,b))
    return im.convert('RGB')
icon(512).save('dist/icon-512.png');icon(192).save('dist/icon-192.png');icon(512,.72).save('dist/icon-maskable-512.png')
