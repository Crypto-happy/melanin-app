package com.melaninpeople.mobile;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class TrimmerManager extends ReactContextBaseJavaModule {
    static final String REACT_PACKAGE = "RNTrimmerManager";

    private final ReactApplicationContext reactContext;

    public TrimmerManager(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_PACKAGE;
    }

    @ReactMethod
    public void getPreviewImageAtPosition(String source, double second, ReadableMap maximumSize, String format, Promise promise) {
        Trimmer.getPreviewImageAtPosition(source , second, format, promise, reactContext);
    }
}
