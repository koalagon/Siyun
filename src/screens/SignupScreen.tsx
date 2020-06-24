import auth, {firebase} from '@react-native-firebase/auth';
import React from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {Button, Alert, StyleSheet, View} from 'react-native';

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
    if (!this.state.email || !this.state.password || !this.state.nickname) {
      return;
    }

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

        if (error.code === 'auth/weak-password') {
          Alert.alert('Password should be at least 6 characters!');
        }

        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          textContentType="emailAddress"
          autoCompleteType="email"
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
          style={[styles.input, styles.formGroup]}
        />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          style={[styles.input, styles.formGroup]}
        />
        <TextInput
          placeholder="Nickname"
          autoCapitalize="none"
          onChangeText={(nickname) => this.setState({nickname})}
          value={this.state.nickname}
          style={[styles.input, styles.formGroup]}
        />
        <Button onPress={() => this.signup()} title="Sign Up" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 30,
  },
  formGroup: {
    marginBottom: 10,
  },
  input: {
    borderRadius: 5,
    borderColor: '#eee',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
