package com.facebook.react.views.view;

/**
 * Custom WindowUtilKt class to provide the missing setEdgeToEdgeFeatureFlagOn method
 * This is a workaround for the compatibility issue with React Native 0.80.2 and Android SDK 35
 */
public class WindowUtilKt {
    public static void setEdgeToEdgeFeatureFlagOn() {
        // This method is a no-op workaround for the missing method in React Native 0.80.2
        // The edge-to-edge feature is handled differently in this version
    }
}
