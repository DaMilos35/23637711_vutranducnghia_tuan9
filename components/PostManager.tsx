import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import {
  fetchPosts,
  addPost,
  updatePost,
  deletePost,
  selectPosts,
  selectPostsStatus,
  selectPostsError,
  Post,
} from '../slices/postsSlice';

export default function PostManager() {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector(selectPosts);
  const status = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);

  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchPosts());
  }, [status, dispatch]);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    try {
      if (editingId) {
        await dispatch(updatePost({ id: editingId, title, body: '...', userId: 1 })).unwrap();
      } else {
        await dispatch(addPost({ title, body: '...', userId: 1 })).unwrap();
      }
      setTitle('');
      setEditingId(null);
    } catch (err: any) {
      alert('Thao tác thất bại: ' + err.message);
    }
  };

  const startEdit = (post: Post) => {
    setEditingId(post.id);
    setTitle(post.title);
  };

  if (status === 'loading') return <Text>Đang tải...</Text>;
  if (status === 'failed') return <Text>Lỗi: {error}</Text>;

  return (
    <ScrollView>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Tiêu đề bài viết"
        style={{ borderWidth: 1, padding: 6, marginVertical: 6 }}
      />
      <Button title={editingId ? 'Cập nhật' : 'Thêm'} onPress={handleSubmit} />
      {editingId && (
        <Button
          title="Hủy"
          onPress={() => {
            setEditingId(null);
            setTitle('');
          }}
        />
      )}

      {posts.map((p, index) => (
        <View key={`${p.id}-${index}`} style={{ marginVertical: 6 }}>
          <Text>{p.id}. {p.title}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Sửa" onPress={() => startEdit(p)} />
            <Button title="Xóa" onPress={() => dispatch(deletePost(p.id))} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}