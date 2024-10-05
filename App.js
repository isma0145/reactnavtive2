import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, Platform, RefreshControl, TouchableOpacity } from 'react-native';
import axios from 'axios';
import UserAvatar from 'react-native-user-avatar';
import { AntDesign } from '@expo/vector-icons';

const App = () => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch 10 users from Random Data API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://randomuser.me/api/?results=10');
      const newUsers = response.data.results.map((user) => ({
        id: user.login.uuid,
        firstName: user.name.first,
        lastName: user.name.last,
        avatar: user.picture.thumbnail,
      }));
      setUsers(newUsers);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch 10 users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch 1 more user and add to the top of the list
  const fetchOneMoreUser = async () => {
    try {
      const response = await axios.get('https://randomuser.me/api/');
      const newUser = {
        id: response.data.results[0].login.uuid,
        firstName: response.data.results[0].name.first,
        lastName: response.data.results[0].name.last,
        avatar: response.data.results[0].picture.thumbnail,
      };
      setUsers([newUser, ...users]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const renderUser = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        {Platform.OS === 'android' && (
          <UserAvatar size={50} src={item.avatar} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.firstName}</Text>
          <Text style={styles.name}>{item.lastName}</Text>
        </View>
        {Platform.OS === 'ios' && (
          <UserAvatar size={50} src={item.avatar} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      
      <TouchableOpacity style={styles.fab} onPress={fetchOneMoreUser}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 20,
    bottom: 20,
  },
});

export default App;
