#!/usr/bin/env python


#python script to update the people's spritesheets and generate animation spritesheets
#http://stackoverflow.com/questions/20972788/how-to-invoke-external-scripts-programs-from-node-js

import Image
import sys
import os

def main():
	
	if len(sys.argv)<3:
		print "generate <spritesheet image> <humanIndex> [<jpeg quality>]"
		exit()

	animationPath	= sys.argv[1]
	#filename without extension http://stackoverflow.com/a/4444952/2205297
	animationFile   = os.path.splitext(os.path.basename(animationPath))[0]
	humanIndex	= int(sys.argv[2])
	#http://stackoverflow.com/a/394814/2205297
	jpegquality	= 50 if len(sys.argv)<4 else  int(sys.argv[3])

	animation2048 = Image.open(animationPath)

	#resize to 1024 & 512
	multiresize(animation2048,animationFile+".jpg","./animations",[2048,1024,512],jpegquality);

	#crop first frame
	frame = animation2048.crop((0,0,204,408))
	#save this filename
	frame.save("./single/"+animationFile+".jpg",quality=jpegquality)	
	
	#add to static spritesheet
	peopleFilename = "people%s.jpg" % (humanIndex/128);

	try:
		people = Image.open("./people/2048/"+peopleFilename)
	except  Exception:
		people = Image.new("RGB",(2048,2048));

	posx = (humanIndex%128)%16*128
	posy = (humanIndex%128)/16*256
	box = (posx,posy,posx+128,posy+256)

	frame = frame.resize((128,256))

	people.paste(frame,box)

	#resize to 1024 & 512
	multiresize(people,peopleFilename,"./people/",[2048,1024,512],jpegquality);

#resizes to different sizes the filename
def multiresize(image,filename,path,resolutions,quality):
	path = os.path.abspath(path)
	for resolution in resolutions:
		sizepath = "%s/%s/%s" % (path,resolution,filename)
		resized = image.resize((resolution,resolution))
		resized.save(sizepath,quality=quality)	

if __name__ == '__main__':
    main()
    print "ok"
