// plugins/withSceneLifecycle.js
// iOS 27 refuses to launch apps without the UIScene life cycle. Expo SDK 57 ships
// ExpoAppSceneDelegate but its prebuild template does not adopt it yet, so this plugin
// registers the scene in Info.plist and moves React Native startup from the app delegate
// into the scene delegate.
const { withAppDelegate, withInfoPlist } = require('expo/config-plugins');

const SCENE_DELEGATE_CLASS = 'EXExpoAppSceneDelegate';

const withSceneManifest = (config) =>
  withInfoPlist(config, (mod) => {
    mod.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: SCENE_DELEGATE_CLASS,
          },
        ],
      },
    };
    return mod;
  });

const withSceneAppDelegate = (config) =>
  withAppDelegate(config, (mod) => {
    if (mod.modResults.language !== 'swift') {
      throw new Error('withSceneLifecycle supports only a Swift AppDelegate');
    }

    let src = mod.modResults.contents;
    if (src.includes('ExpoReactNativeFactoryProvider')) {
      return mod;
    }

    // The scene delegate reads the factory and window through this protocol
    src = src.replace(
      'class AppDelegate: ExpoAppDelegate {',
      'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {'
    );

    // The scene delegate now creates the window and starts React Native into it
    const startBlock = /\n#if os\(iOS\) \|\| os\(tvOS\)\n {4}window = UIWindow\(frame: UIScreen\.main\.bounds\)\n {4}factory\.startReactNative\([\s\S]*?\)\n#endif\n/;
    if (!startBlock.test(src)) {
      throw new Error('withSceneLifecycle: could not find the React Native start block in AppDelegate.swift');
    }
    src = src.replace(startBlock, '');

    mod.modResults.contents = src;
    return mod;
  });

module.exports = (config) => withSceneAppDelegate(withSceneManifest(config));
