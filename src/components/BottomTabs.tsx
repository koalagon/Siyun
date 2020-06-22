import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/HomeScreen';
import CreateDrwaing from '../screens/drawings/CreateScreen';
import Profile from '../screens/ProfileScreen';

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
          }}
        />
        <Tab.Screen
          name="NewDrawing"
          component={CreateDrwaing}
          options={{
            tabBarLabel: 'New Drawing',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
    );
  }
}
