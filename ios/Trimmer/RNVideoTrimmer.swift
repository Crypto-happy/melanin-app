//
//  RNVideoTrimmer.swift
//  Flornt
//
//  Created by Thanh Nguyen on 01/06/2021.
//

import Foundation
import AVFoundation
import UIKit


@objc(RNVideoTrimmer)
class RNVideoTrimmer: NSObject {
  @objc func getPreviewImageAtPosition(_ source: String,atTime: Float = 0, maximumSize: NSDictionary, format: String = "base64", resolver:(RCTPromiseResolveBlock), rejecter:(RCTPromiseResolveBlock)) {
    let sourceURL = getSourceURL(source: source)
    let asset = AVAsset(url: sourceURL)
    
    var width: CGFloat = 1080
    if let _width = maximumSize.object(forKey: "width") as? CGFloat {
          width = _width
    }
    var height: CGFloat = 1080
    
    if let _height = maximumSize.object(forKey: "height") as? CGFloat {
        height = _height
    }
    
    let imageGenerator = AVAssetImageGenerator(asset: asset)
        imageGenerator.maximumSize = CGSize(width: width, height: height)
        imageGenerator.appliesPreferredTrackTransform = true
    var second = atTime
    if atTime > Float(asset.duration.seconds) || atTime < 0 {
        second = 0
    }
    let timestamp = CMTime(seconds: Double(second), preferredTimescale: 600)
    do {
          let imageRef = try imageGenerator.copyCGImage(at: timestamp, actualTime: nil)
          let image = UIImage(cgImage: imageRef)
          if ( format == "base64" ) {
            let imgData = image.pngData()
            let base64string = imgData?.base64EncodedString(options: Data.Base64EncodingOptions.init(rawValue: 0))
            if base64string != nil {
              resolver([base64string!])
            } else {
              rejecter( ["Unable to convert to base64)", NSNull()]  )
            }
          } else if ( format == "JPEG" ) {
            let imgData = image.jpegData(compressionQuality: 1)

            let fileName = ProcessInfo.processInfo.globallyUniqueString
            let fullPath = "\(NSTemporaryDirectory())\(fileName).jpg"

            try imgData?.write(to: URL(fileURLWithPath: fullPath), options: .atomic)

            let imageWidth = imageRef.width
            let imageHeight = imageRef.height
            let imageFormattedData: [AnyHashable: Any] = ["uri": fullPath, "width": imageWidth, "height": imageHeight]

            resolver([imageFormattedData])
          } else {
            rejecter(["Failed format. Expected one of 'base64' or 'JPEG'", NSNull()] )
          }
      } catch {
        
          rejecter( ["Failed to convert base64: \(error.localizedDescription)", NSNull()] )
      }
  }
  
  
  func getSourceURL(source: String) -> URL {
    var sourceURL: URL
    if source.contains("assets-library") {
      sourceURL = NSURL(string: source) as! URL
    } else {
      let bundleUrl = Bundle.main.resourceURL!
      sourceURL = URL(string: source, relativeTo: bundleUrl)!
    }
    return sourceURL
  }
}
  
