import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/HomeScreen';
import CreatePost from '../screens/posts/CreateScreen';
import Profile from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/AntDesign';

const Tab = createBottomTabNavigator();

export default class BottomTabs extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Tab.Navigator tabBarOptions={{showLabel: true}}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: () => (
              <Icon name="home" size={24} style={{paddingTop: 5}} />
            ),
          }}
        />
        <Tab.Screen
          name="CreatePost"
          component={CreatePost}
          options={{
            tabBarLabel: 'New Post',
            tabBarIcon: () => (
              <Icon name="pluscircle" size={24} style={{paddingTop: 5}} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: () => (
              <Icon name="user" size={24} style={{paddingTop: 5}} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}
