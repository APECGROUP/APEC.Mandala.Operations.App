import React, {useState, memo, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Post} from '../../models/Post';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainParams} from '../../../../navigation/params';
import AppImage from '../../../../elements/appImage/AppImage';
import LinearGradient from 'react-native-linear-gradient';

interface PostItemProps {
  item: Post;
  onFocusComment?: () => void; // ✅ thêm callback focus
}
const PostItem: React.FC<PostItemProps> = ({item, onFocusComment}) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainParams>>();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const randomLikes = Math.floor(Math.random() * 1000);
    setLikeCount(randomLikes);
  }, []);

  const toggleLike = () => {
    setLiked(prev => !prev);
    setLikeCount(prev => (liked ? prev - 1 : prev + 1));
  };

  const onImagePress = ({index}: {index: number}) => {
    navigation.navigate('ImageViewScreen', {
      images: item?.images?.map(uri => ({
        uri: uri.replace('/300/300', '/1000/1000'),
      })),
      imageIndex: index,
    });
  };

  const renderImagesGrid = () => {
    const maxImages = 6;
    const imagesToShow = item?.images?.slice(0, maxImages);
    const extraCount = item?.images?.length - maxImages;
    const columns = imagesToShow.length <= 2 ? 2 : 3;

    if (item?.images?.length === 1) {
      // Hiển thị ảnh full nếu chỉ có 1 ảnh
      return (
        <TouchableOpacity
          onPress={() => onImagePress({index: 0})}
          activeOpacity={0.8}>
          <AppImage source={{uri: imagesToShow[0]}} style={styles.fullImage} />
        </TouchableOpacity>
      );
    }

    return (
      <View style={[styles.gridContainer]}>
        {imagesToShow.map((img, index) => {
          const isLastAndExtra = index === maxImages - 1 && extraCount > 0;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onImagePress({index})}
              activeOpacity={0.8}
              style={{width: `${100 / columns}%`, padding: s(2)}}>
              <View style={styles.gridItem}>
                {isLastAndExtra ? (
                  <ImageBackground
                    source={{uri: img}}
                    style={styles.gridImage}
                    imageStyle={{borderRadius: s(6)}}
                    blurRadius={5}>
                    <LinearGradient
                      colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)']}
                      style={styles.overlay}>
                      <Text style={styles.extraText}>+{extraCount}</Text>
                    </LinearGradient>
                  </ImageBackground>
                ) : (
                  <AppImage source={{uri: img}} style={styles.gridImage} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <AppImage source={{uri: item?.user?.avatar}} style={styles.avatar} />
        <Text style={styles.username}>{item?.user?.name}</Text>
      </View>

      <Text style={styles.content}>{item?.content}</Text>

      {item?.images?.length > 0 && (
        <View style={styles.imageContainer}>{renderImagesGrid()}</View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={toggleLike} style={styles.actionBtn}>
          <Icon
            name={liked ? 'heart' : 'heart-outline'}
            size={s(20)}
            color={liked ? 'red' : 'gray'}
          />
          <Text style={styles.actionText}>
            {liked ? 'Đã thích' : 'Thích'} ({likeCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="comment-outline" size={s(20)} color="gray" />
          <Text style={styles.actionText}>Bình luận</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="share-outline" size={s(20)} color="gray" />
          <Text style={styles.actionText}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.commentRow}>
        <TextInput
          placeholder="Viết bình luận..."
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          onFocus={onFocusComment} // ✅ gọi khi focus
        />
        {comment.length > 0 && (
          <TouchableOpacity>
            <Icon name="send" size={s(20)} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: s(10),
    backgroundColor: '#fff',
    marginBottom: vs(10),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  avatar: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    marginRight: s(10),
  },
  username: {
    fontWeight: 'bold',
    fontSize: s(14),
  },
  content: {
    fontSize: s(13),
    marginBottom: vs(6),
  },
  imageContainer: {
    marginBottom: vs(8),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    aspectRatio: 1,
    borderRadius: s(6),
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: s(6),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: s(6),
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  extraText: {
    color: 'white',
    fontSize: s(18),
    fontWeight: 'bold',
  },
  fullImage: {
    width: '100%',
    height: 300, // Thay đổi chiều cao nếu cần
    borderRadius: s(6),
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: vs(8),
    marginBottom: vs(6),
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: s(13),
    color: '#555',
    marginLeft: s(6),
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#eee',
    paddingTop: vs(4),
  },
  commentInput: {
    flex: 1,
    fontSize: s(13),
    paddingVertical: vs(4),
  },
});

export default memo(PostItem);
