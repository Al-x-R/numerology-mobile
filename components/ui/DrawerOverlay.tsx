// components/ui/DrawerOverlay.tsx
import React from 'react';
import {
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Easing,
} from 'react-native';
import { useProfile } from '@/contexts/ProfileContext';
import ProfileDrawer from './ProfileDrawer';

const { width } = Dimensions.get('window');

export default function DrawerOverlay() {
  // const { isDrawerVisible, closeDrawer } = useProfile();

  const translateX = React.useRef(new Animated.Value(width)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isDrawerVisible) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: width,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isDrawerVisible]);

  return (
    <View style={styles.container} pointerEvents={isDrawerVisible ? 'box-none' : 'none'}>
      <TouchableWithoutFeedback onPress={closeDrawer}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.overlay,
            { opacity: overlayOpacity },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX }] },
        ]}
      >
        <ProfileDrawer onClose={closeDrawer} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width,
    height: '100%',
    backgroundColor: '#0d0d0d',
    shadowColor: '#000',
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 24,
  },
});
