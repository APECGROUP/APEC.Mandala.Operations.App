import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AutoSkeletonView} from 'react-native-auto-skeleton';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const PostSkeleton: React.FC = () => {
  return (
    <AutoSkeletonView
      shimmerSpeed={1.0}
      // defaultRadius={20}
      // shimmerBackgroundColor={'#cccc'}
      // gradientColors={['red', 'blue']}
      animationType={'gradient'} // 'gradient' | 'pulse' | 'none'
      isLoading={true}>
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <View style={styles.avatar} />
          <View style={styles.userName} />
        </View>
        <View style={styles.content} />
        <View style={styles.media} />
      </View>
    </AutoSkeletonView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    width: 120,
    height: 20,
    borderRadius: 4,
    marginLeft: 8,
  },
  content: {
    width: '100%',
    height: 60,
    borderRadius: 4,
    marginBottom: 8,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 4,
  },
});

export default PostSkeleton;
