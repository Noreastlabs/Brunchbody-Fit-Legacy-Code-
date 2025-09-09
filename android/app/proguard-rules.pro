# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native specific rules
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# Handle duplicate class issue
-dontwarn com.facebook.react.views.view.WindowUtilKt
-keep class com.facebook.react.views.view.WindowUtilKt { *; }

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Keep React Native modules
-keep class * extends com.facebook.react.bridge.ReactContextBaseJavaModule { *; }
-keep class * extends com.facebook.react.bridge.ReactContextBaseJavaModule { *; }

# Keep React Native views
-keep class * extends com.facebook.react.uimanager.ViewGroupManager { *; }
-keep class * extends com.facebook.react.uimanager.SimpleViewManager { *; }

# Keep React Native packages
-keep class * implements com.facebook.react.ReactPackage { *; }
