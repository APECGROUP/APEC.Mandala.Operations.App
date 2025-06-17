import React, {useState} from 'react';
import {
  View,
  ImageStyle,
  ViewStyle,
  StyleProp,
  ImageSourcePropType,
} from 'react-native';
import FastImage, {
  Source,
  FastImageProps,
  OnLoadEvent,
} from 'react-native-fast-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import styles from './AppImage.Style';

interface AppImageProps extends Omit<FastImageProps, 'source'> {
  source: Source;
  thumbnailSource?:
    | ImageSourcePropType
    | SharedValue<ImageSourcePropType | undefined>
    | undefined;
  loadingSource?: number | Source;
  errorSource?: number | Source;
  thumbnailImageStyle?: StyleProp<ImageStyle>;
  loadingImageStyle?: StyleProp<ImageStyle> | {};
  loadingImageContainerStyle?: StyleProp<ViewStyle>;
  thumbnailAnimationDuration?: number;
  imageAnimationDuration?: number;
  onThumbnailLoad?: () => void;
}

const AppImage: React.FC<AppImageProps> = ({
  source,
  thumbnailSource,
  loadingSource = require('./loading.gif'),
  errorSource = require('./errorImage.png'),
  style,
  thumbnailImageStyle,
  loadingImageStyle,
  loadingImageContainerStyle,
  thumbnailAnimationDuration = 300,
  imageAnimationDuration = 300,
  onLoad,
  onThumbnailLoad,
  onLoadEnd,
  onError,
  resizeMode = 'cover',
  ...rest
}) => {
  const [isError, setIsError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const loadingOpacity = useSharedValue(1);
  const thumbnailOpacity = useSharedValue(0);
  const imageOpacity = useSharedValue(0);

  const onThumbnailLoadHandler = () => {
    thumbnailOpacity.value = withTiming(1, {
      duration: thumbnailAnimationDuration,
    });
    loadingOpacity.value = withTiming(0, {duration: 200});
    onThumbnailLoad?.();
  };

  const onImageLoadHandler = (e: OnLoadEvent) => {
    setImageLoaded(true);
    imageOpacity.value = withTiming(1, {duration: imageAnimationDuration});
    onLoad?.(e);
  };

  const onLoadEndHandler = () => {
    runOnJS(() => {
      onLoadEnd?.();
    })();
  };

  const onErrorHandler = () => {
    setIsError(true);
    onError?.();
  };

  const getImageSource = () => (isError ? errorSource : source);

  const animatedLoadingStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  const animatedThumbStyle = useAnimatedStyle(() => ({
    opacity: thumbnailOpacity.value,
  }));

  const animatedMainImageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));
  return (
    <View style={[styles.container, style]}>
      {loadingSource && !imageLoaded && (
        <Animated.View
          style={[
            styles.loadingImageStyle,
            loadingImageContainerStyle,
            animatedLoadingStyle,
          ]}>
          <FastImage
            source={loadingSource}
            resizeMode={resizeMode}
            style={[loadingImageStyle, {}]}
          />
        </Animated.View>
      )}
      {thumbnailSource && (
        <Animated.Image
          source={thumbnailSource}
          blurRadius={15}
          style={[styles.imageStyle, thumbnailImageStyle, animatedThumbStyle]}
          onLoad={onThumbnailLoadHandler}
          resizeMode={resizeMode}
        />
      )}
      <Animated.View style={[styles.imageStyle, animatedMainImageStyle]}>
        <FastImage
          {...rest}
          source={getImageSource()}
          style={[style, styles.imageStyle]}
          onLoad={onImageLoadHandler}
          onLoadEnd={onLoadEndHandler}
          onError={onErrorHandler}
          resizeMode={resizeMode}
        />
      </Animated.View>
    </View>
  );
};

export default AppImage;
