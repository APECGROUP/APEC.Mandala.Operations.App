import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import RNBootSplash // ⬅️ add this import
import Firebase

@main
class AppDelegate: RCTAppDelegate {
  var taskIdentifier: UIBackgroundTaskIdentifier = .invalid

  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "MandalaOperations"
    self.dependencyProvider = RCTAppDependencyProvider()
  FirebaseApp.configure()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }


  override func applicationWillResignActive(_ application: UIApplication) {
          // End any existing background task
          if taskIdentifier != .invalid {
              application.endBackgroundTask(taskIdentifier)
              taskIdentifier = .invalid
          }

          // Start a new background task
          taskIdentifier = application.beginBackgroundTask(withName: nil) { [weak self] in
              if let strongSelf = self {
                  application.endBackgroundTask(strongSelf.taskIdentifier)
                  strongSelf.taskIdentifier = .invalid
              }
          }
      }


   override func customize(_ rootView: RCTRootView!) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView) 
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
                        OtaHotUpdate.getBundle()  // -> Add this line


#endif
  }
}
