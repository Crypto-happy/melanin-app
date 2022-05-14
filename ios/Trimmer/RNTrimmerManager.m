//
//  RNVideoTrimmer.m
//  Flornt
//
//  Created by Thanh Nguyen on 01/06/2021.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
//#import "RCTSwiftBridgeModule.h"

@interface RCT_EXTERN_REMAP_MODULE(RNTrimmerManager, RNVideoTrimmer, NSObject)
RCT_EXTERN_METHOD(getPreviewImageAtPosition:(NSString *)source atTime:(float *)atTime maximumSize:(NSDictionary *)maximumSize format:(NSString *)format resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);

@end
