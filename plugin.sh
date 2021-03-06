echo "----------------"
echo "removing plugin"
echo "----------------"
cordova plugin rm org.apache.cordova.device
cordova plugin rm org.apache.cordova.dialogs
cordova plugin rm org.apache.cordova.media
cordova plugin rm org.apache.cordova.network-information
cordova plugin rm org.apache.cordova.vibration
cordova plugin rm org.apache.cordova.globalization
cordova plugin rm de.appplant.cordova.plugin.local-notification
cordova plugin rm https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git
cordova plugin rm https://github.com/phonegap-build/PushPlugin.git 
#cordova plugin rm https://github.com/alongubkin/phonertc.git

echo "----------------"
echo "creating plugin"
echo "----------------"
cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.dialogs
cordova plugin add org.apache.cordova.media
cordova plugin add org.apache.cordova.network-information
cordova plugin add org.apache.cordova.vibration
cordova plugin add org.apache.cordova.globalization
cordova plugin add de.appplant.cordova.plugin.local-notification
cordova plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git
cordova plugin add https://github.com/phonegap-build/PushPlugin.git
#cordova plugin add https://github.com/alongubkin/phonertc.git