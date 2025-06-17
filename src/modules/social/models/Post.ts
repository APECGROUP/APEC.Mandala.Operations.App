export interface Post {
  id: string;
  content: string;
  images: string[]; // chỉ 1 ảnh ở đây
  videos: string[]; // không có video trong API này, để trống
  user: {
    name: string;
    avatar: string;
  };
}
