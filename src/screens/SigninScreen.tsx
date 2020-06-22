import React from 'react';
import {View, Button, Text, Alert} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import {TextInput} from 'react-native-gesture-handler';

interface IState {
  email: string;
  password: string;
}

export default class SignupScreen extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  signin() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('Home'))
      .catch((error) => Alert.alert(error));
  }

  render() {
    return (
      <>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(email) => this.setState({email})}
        />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({password})}
        />
        <Button onPress={() => this.signin()} title="Sign In" />

        <Text>Create an account!</Text>
        <Button
          title="Sign Up"
          onPress={() => this.props.navigation.navigate('Signup')}
        />
      </>
    );
  }
}
