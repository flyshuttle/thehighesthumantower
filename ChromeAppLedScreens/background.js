chrome.app.runtime.onLaunched.addListener(function() {
  appwindow = chrome.app.window.create("index.html",
    {  frame: "none",
       id: "highesthumantower-ledsScreens",
       alwaysOnTop:true,
       minWidth:1120,
       minHeight: 640,
       left:0,
       top:0
    },function(appwindow){
      appwindow.setAlwaysOnTop(true);
      appwindow.focus();
      appwindow.setBounds({left:0,top:0,width:1120,height:640});
  });
});

