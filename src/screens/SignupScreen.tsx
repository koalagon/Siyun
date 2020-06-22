import auth, {firebase} from '@react-native-firebase/auth';
import React from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {Button, Alert} from 'react-native';

interface IState {
  email: string;
  password: string;
  nickname: string;
}

export default class SignupScreen extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: '',
      password: '',
      nickname: '',
    };
  }

  signup() {
    auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        console.log('User account created & signed in!');
        const user = firebase.auth().currentUser;
        if (user) {
          user
            .updateProfile({
              displayName: this.state.nickname,
            })
            .then(() => this.props.navigation.navigate('Home'));
        }
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        }

        console.error(error);
      });
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
        <TextInput
          placeholder="Nickname"
          autoCapitalize="none"
          onChangeText={(nickname) => this.setState({nickname})}
        />
        <Button onPress={() => this.signup()} title="Sign Up" />
      </>
    );
  }
}
