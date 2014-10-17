#include "ofApp.h"

_DepthSpacePoint*        m_pDepthCoordinates;

//--------------------------------------------------------------
void ofApp::setup(){
	gui.setup();
	recordFramesBt.addListener(this, &ofApp::startRecording);
	gui.add(recordFramesBt.setup("Record",400,400));

	kinect.open();
	kinect.initDepth();
	kinect.initColor();
	kinect.initInfrared();
	kinect.initBodyIndex();
	kinect.initBodyFrame();

	ofSetWindowShape(640 * 2, 480 * 2);
	kinect.getSensor()->get_CoordinateMapper(&m_pCoordinateMapper);

	// Allocate fbo
	fboColorImage.allocate(cColorWidth,cColorHeight,GL_RGB);
	fboBodyIndex.allocate(cDepthWidth,cDepthHeight,GL_RGB);

	// Allocate transparent silhouette output
	output.allocate(cColorWidth,cColorHeight,OF_IMAGE_COLOR);

	// inicialize Array Images to capture
	for(int i=0;i<FRAMES_NUMBER;i++){
		frames[i].allocate(cColorWidth,cColorHeight, OF_IMAGE_COLOR);
	}

	// connect to arduino
	int baud = 9600;
	serial1.setup(0, baud); // Arduino 1 rail with foots
	serial2.setup(1, baud); // Arduino 2 lights

	middleXBodyPosition = 1920/2;
	factorMiddleXBodyPosition = 150;
	recording = false;
	processingKeying=false;

	setupRenderSprite();
}

//--------------------------------------------------------------
void ofApp::update(){
	this->kinect.update();
	//
	if(playing){
		fboColorImage.begin();
			this->kinect.getColor()->draw(0,0);
		fboColorImage.end();
		fboColorImage.readToPixels(pixelsColorImage);

		fboBodyIndex.begin();
			this->kinect.getBodyIndex()->draw(0,0);
		fboBodyIndex.end();
		fboBodyIndex.readToPixels(pixelsBodyImage);

		// Color pixels to map depth 
		unsigned short * pixeles = this->kinect.getDepth()->getPixels();
		ProcessFrame( pixeles);
	}
	//greenscreen.setPixels(output.getPixelsRef());
}

//--------------------------------------------------------------
void ofApp::draw(){
//	output.draw(0,0,640,480);

	if(recording){
		recordFrames();
	}

	if(processingKeying){
		processKeying(currentFrameProcessed);
		ofDrawBitmapStringHighlight("PROCESSING KEYING frame:"+ofToString(currentFrameProcessed),ofGetWidth()/2,ofGetHeight()/2);
	currentFrameProcessed++;
	}

	/*
	ofEnableAlphaBlending();
	greenscreen.draw(0, 0, greenscreen.getWidth(), greenscreen.getHeight());
	ofDisableAlphaBlending();
	*/
	gui.draw();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){

}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}

//--------------------------------------------------------------
void ofApp::ProcessFrame(unsigned short *  pDepthBuffer)
{
	unsigned char * pixelsColor = pixelsColorImage.getPixels();

     HRESULT hr = m_pCoordinateMapper->MapColorFrameToDepthSpace(
		cDepthWidth * cDepthHeight, 
		(const UINT16*)pDepthBuffer, 
		cColorWidth * cColorHeight, 
		m_pDepthCoordinates);
	
	if (SUCCEEDED(hr))
	{
		for (int colorIndex = 0; colorIndex < (cColorWidth * cColorHeight); ++colorIndex)
         {
             DepthSpacePoint p = m_pDepthCoordinates[colorIndex];
             // Values that are negative infinity means it is an invalid color to depth mapping so we
             // skip processing for this pixel
             if (p.X != -std::numeric_limits<float>::infinity() && p.Y != -std::numeric_limits<float>::infinity())
             {
                 int depthX = static_cast<int>(p.X + 0.5f);
                 int depthY = static_cast<int>(p.Y + 0.5f);

                 if ((depthX >= 0 && depthX < cDepthWidth) && (depthY >= 0 && depthY < cDepthHeight))
                 {
					ofColor c=	pixelsBodyImage.getColor(p.X,p.Y);
					if((c.r==255 && c.g==255 && c.b==255)){
						pixelsColor[colorIndex*3]=0;//red
						pixelsColor[(colorIndex*3)+1]=255;//green
						pixelsColor[(colorIndex*3)+2]=0;//blue
					}
				}else{
					pixelsColor[colorIndex*3]=0;//red
					pixelsColor[(colorIndex*3)+1]=255;//green
					pixelsColor[(colorIndex*3)+2]=0;//blue
				}
			}else{
				pixelsColor[colorIndex*3]=0;//red
				pixelsColor[(colorIndex*3)+1]=255;//green
				pixelsColor[(colorIndex*3)+2]=0;//blue
			}
         }
	}
	output.setFromPixels(pixelsColor,cColorWidth,cColorHeight,OF_IMAGE_COLOR);
}
//--------------------------------------------------------------
void ofApp::SendForm()
{
	string id = "";
	HttpForm f = HttpForm( "http://thehighesthumantower.com/insert-new" );
	f.addFormField("heightPerson",ofToString(heightPerson));
	f.addFormField("id",ofToString(id));
	f.addFile("animation512",	"animation512.png",   "image/png");
	f.addFile("animation1024",	"animation1024.png", "image/png");
	f.addFile("animation2048",	"animation2048.png", "image/png");
	fm.submitForm( f, false );	
}
//--------------------------------------------------------------
void ofApp::recordFrames()
{
	if(currentFrameRecording>=FRAMES_NUMBER){
		recording = false; 
		processingKeying=true;
		currentFrameProcessed=0;
		return;
	}

	ofSetColor(255,0,0);
	ofCircle(40,40,50);
	ofSetColor(255,255,255);
	frames[currentFrameRecording].setFromPixels(output.getPixelsRef());
	frames[currentFrameRecording].draw(0,0);
	ofDrawBitmapStringHighlight(ofToString(currentFrameRecording),20,20);
	currentFrameRecording++;
}
//--------------------------------------------------------------
void ofApp::startRecording(){
	currentFrameRecording=0;
	recording =  true;
}

//--------------------------------------------------------------
void ofApp::startPlaying(){
	currentFramePlaying=0;
	playing=true;
	readyToPlay=false;
}
//--------------------------------------------------------------
void ofApp::processKeying(int frameNb){
	//for(int i=0;i<FRAMES_NUMBER;i++){
			greenscreen.setPixels(frames[frameNb].getPixelsRef());
			frames[frameNb].setFromPixels(greenscreen.getPixelsRef());
			
		if(frameNb==FRAMES_NUMBER-1){
			processingKeying=false;
				cout<<"processed"<<endl;
				readyToPlay = true;
				// 
				renderSprite(2048);
				renderSprite(1024);
				renderSprite(512);
			}
}
//--------------------------------------------------------------
void ofApp::setupRenderSprite(){

	// This is support for all devices openGLES 2.0
	cropX = 300;
	cropY = 0;
	widthTiles = 10;
	heightTiles = 10;
	texture.allocate(widthSprite,heightSprite);
	chomaKeyColor = ofColor(0,255,0);
}
//--------------------------------------------------------------
void ofApp::renderSprite(int size){

	widthSprite = size;
	heightSprite = size;
	
	widthSubSprite = widthSprite/8;
	heightSubSprite = heightSprite/6;

	unsigned long long timeStart = ofGetElapsedTimeMillis();
	texture.begin();
	ofSetColor(chomaKeyColor);
	ofRect(0,0,widthSprite,heightSprite);
	for(int i=0;i<FRAMES_NUMBER;i++)
	{
		ofSetColor(ofColor::white);
		frames[i].crop(700,0,600,1080);
		int newWidth = frames[i].getWidth();
		ofPushMatrix();
		ofTranslate(widthSubSprite*(i%widthTiles),heightSubSprite*(i/heightTiles));
		frames[i].draw(0,0,widthSubSprite ,heightSubSprite );
		ofPopMatrix();
	}
	texture.end();
	ofPixels px;
	texture.readToPixels(px);
	ofImage img;
	img.setFromPixels(px);
	img.saveImage("animation"+ofToString(size)+".png");
	unsigned long long timeSpendRendering = ofGetElapsedTimeMillis()-timeStart;
	cout << "timeSpendRendering:" << timeSpendRendering/1000 << " resolution:"<< size << endl;
}
//--------------------------------------------------------------

void ofApp::getDataSkeleton(){
	for(int i=0;i<6;i++){
		if(this->kinect.getBodyFrame()->getBodies()[i].tracked){
			Joint j;
			ofxKinectForWindows2::Body b = this->kinect.getBodyFrame()->getBodies()[i];
			float bodyXPosition = b.joints[JointType_SpineBase].getProjected(m_pCoordinateMapper).x;
			if(b.joints[JointType_Head].getTrackingState()==TrackingState_Tracked && bodyXPosition-middleXBodyPosition>factorMiddleXBodyPosition){
				headPerson = b.joints[JointType_Head].getPosition().y;
				headImagePosition = b.joints[JointType_Head].getProjected(m_pCoordinateMapper);
			}
		}
	}
}
//--------------------------------------------------------------