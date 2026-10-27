import React, { useEffect } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchUsers, selectUsers, selectUsersStatus, selectUsersError } from '../slices/usersSlice';

export default function UserList() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(selectUsers);
  const status = useSelector(selectUsersStatus);
  const error = useSelector(selectUsersError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <Text>Đang tải...</Text>;
  if (status === 'failed') return <Text>Lỗi: {error}</Text>;

  return (
    <ScrollView>
      <Button title="Tải lại danh sách" onPress={() => dispatch(fetchUsers())} />
      {users.map((u) => (
        <View key={u.id} style={{ marginVertical: 4 }}>
          <Text>{u.id}. {u.name} ({u.email})</Text>
        </View>
      ))}
    </ScrollView>
  );
}