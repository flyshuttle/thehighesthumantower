#pragma once

#include "ofMain.h"
#include "ofxGreenscreen.h"
#include "ofxKinectForWindows2.h"
#include "base.h"
#include "ofxGui.h"
#include "HttpFormManager.h"
#include "ofxJSON.h"

#define FRAMES_NUMBER 50

typedef struct
{
    ofPoint left_hand;
    ofPoint right_hand;
	ofPoint left_foot;
    ofPoint right_foot;
	ofPoint head;
}bodyData;

class ofApp : public ofBaseApp{
		static const int        cDepthWidth  = 512;
		static const int        cDepthHeight = 424;
		static const int        cColorWidth  = 1920;
		static const int        cColorHeight = 1080;
		static const int		totalFramesCaptures = 50;
	public:
		void setup();
		void update();
		void draw();

		void keyPressed(int key);
		void keyReleased(int key);
		void mouseMoved(int x, int y );
		void mouseDragged(int x, int y, int button);
		void mousePressed(int x, int y, int button);
		void mouseReleased(int x, int y, int button);
		void windowResized(int w, int h);
		void dragEvent(ofDragInfo dragInfo);
		void gotMessage(ofMessage msg);

		//--------------------------------------------------------------
		void SendForm();
		void ProcessFrame(unsigned short *  pDepthBuffer);
		void getDataSkeleton();

		ofxKFW2::Device kinect;

		ICoordinateMapper*	m_pCoordinateMapper;
		DepthSpacePoint		m_pDepthCoordinates[cColorWidth*cColorHeight];
		ofFbo				fboColorImage;
		ofFbo				fboBodyIndex;
		ofPixels			pixelsColorImage;
		ofPixels			pixelsBodyImage;
		ofImage				output;

		//Greenscreen
		ofxGreenscreen greenscreen;
		//ofImage framesCapturedAr[totalFramesCaptures];
		bodyData DataCapturedAr[totalFramesCaptures];
		// people van 128 personas y 16 columnas 8 filas por ejemplo en la de 1024 el tamaño por persona es 64x128 
 
		ofSerial	serial1;
		ofSerial	serial2;

		float headPerson;
		ofPoint headImagePosition;
		float middleXBodyPosition;
		float factorMiddleXBodyPosition;

		// Send form to Node.js 
		void newResponse(HttpFormResponse &response);
		HttpFormManager fm;
		int heightPerson;

		ofxPanel gui;
		ofxButton recordFramesBt;
		void recordFrames();
		void startRecording();
		bool recording;
		int currentFrameRecording;

		void startPlaying();
		bool playing;
		int currentFramePlaying;
		bool readyToPlay;
		ofImage frames[FRAMES_NUMBER];
		
		void processKeying(int frameNb);
		bool processingKeying;
		int currentFrameProcessed;


		// Sprite
		void renderSprite(int size);
		void setupRenderSprite();
		ofFbo texture;
		int widthSprite;
		int heightSprite;
		int widthSubSprite;
		int heightSubSprite;
		int widthTiles;
		int heightTiles;
		int cropX;
		int cropY;
		ofColor chomaKeyColor;

		ofxCvColorImage croppedImage;
		ofxCvColorImage bgImage
};
