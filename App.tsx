import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store';
import UserList from './components/UserList';
import PostManager from './components/PostManager';
import ShoppingCart from './components/ShoppingCart';

export default function App() {
  const [tab, setTab] = useState(1);

  return (
    <Provider store={store} children={undefined}>
      <View style={{ flex: 1, padding: 20, paddingTop: 40 }}>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Button title="1. GET API" onPress={() => setTab(1)} />
          <Button title="2. CRUD" onPress={() => setTab(2)} />
          <Button title="3. Level 3" onPress={() => setTab(3)} />
        </View>

        {tab === 1 && <UserList />}
        {tab === 2 && <PostManager />}
        {tab === 3 && <ShoppingCart />}
      </View>
    </Provider>
  );
}