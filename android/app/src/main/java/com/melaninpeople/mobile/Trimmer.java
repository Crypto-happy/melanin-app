package com.melaninpeople.mobile;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Matrix;

import android.util.Base64;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;


import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

import wseemann.media.FFmpegMediaMetadataRetriever;

import java.util.UUID;
import java.io.FileOutputStream;


public class Trimmer {


    static File createTempFile(String extension, final Promise promise, Context ctx) {
        UUID uuid = UUID.randomUUID();
        String imageName = uuid.toString() + "-screenshot";

        File cacheDir = ctx.getCacheDir();
        File tempFile = null;
        try {
            tempFile = File.createTempFile(imageName, "." + extension, cacheDir);
        } catch( IOException e ) {
            promise.reject("Failed to create temp file", e.toString());
            return null;
        }

        if (tempFile.exists()) {
            tempFile.delete();
        }

        return tempFile;
    }

    static void getPreviewImageAtPosition(String source, double sec, String format, final Promise promise, ReactApplicationContext ctx) {
        Bitmap bmp = null;
        int orientation = 0;
        FFmpegMediaMetadataRetriever metadataRetriever = new FFmpegMediaMetadataRetriever();
        try {
            FFmpegMediaMetadataRetriever.IN_PREFERRED_CONFIG = Bitmap.Config.ARGB_8888;
            metadataRetriever.setDataSource(source);

            bmp = metadataRetriever.getFrameAtTime((long) (sec * 1000000), FFmpegMediaMetadataRetriever.OPTION_CLOSEST);
            if(bmp == null){
                promise.reject("Failed to get preview at requested position.");
                return;
            }

            // NOTE: FIX ROTATED BITMAP
            orientation = Integer.parseInt(metadataRetriever.extractMetadata(FFmpegMediaMetadataRetriever.METADATA_KEY_VIDEO_ROTATION));
        } finally {
            metadataRetriever.release();
        }

        if ( orientation != 0 ) {
            Matrix matrix = new Matrix();
            matrix.postRotate(orientation);
            bmp = Bitmap.createBitmap(bmp, 0, 0, bmp.getWidth(), bmp.getHeight(), matrix, true);
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        WritableMap event = Arguments.createMap();

        if ( format == null || (format != null && format.equals("base64")) ) {
            bmp.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
            byte[] byteArray = byteArrayOutputStream .toByteArray();
            String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);

            event.putString("image", encoded);
        } else if ( format.equals("JPEG") ) {
            bmp.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
            byte[] byteArray = byteArrayOutputStream.toByteArray();

            File tempFile = createTempFile("jpeg", promise, ctx);

            try {
                FileOutputStream fos = new FileOutputStream( tempFile.getPath() );

                fos.write( byteArray );
                fos.close();
            } catch (java.io.IOException e) {
                promise.reject("Failed to save image", e.toString());
                return;
            }

            WritableMap imageMap = Arguments.createMap();
            imageMap.putString("uri", "file://" + tempFile.getPath());

            event.putMap("image", imageMap);
        } else {
            promise.reject("Wrong format error", "Wrong 'format'. Expected one of 'base64' or 'JPEG'.");
            return;
        }

        promise.resolve(event);
    }

}
