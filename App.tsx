import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabs from './src/components/BottomTabs';
import Signin from './src/screens/SigninScreen';
import Signup from './src/screens/SignupScreen';
import Profile from './src/screens/ProfileScreen';
import {firebase} from '@react-native-firebase/auth';

const Stack = createStackNavigator();
let unsubscribe: any;

export default class App extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({user});
      } else {
        this.setState({user: null});
      }
    });
  }

  componentWillUnmount() {
    unsubscribe();
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="BottomTabs"
            component={BottomTabs}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signin"
            component={Signin}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
