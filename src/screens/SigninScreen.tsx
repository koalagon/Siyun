import React from 'react';
import {View, Button, Text, Alert, StyleSheet} from 'react-native';
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
    if (!this.state.email || !this.state.password) {
      return;
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('Home'))
      .catch((error) => {
        this.setState({email: '', password: ''});
        Alert.alert('Invalid username or password');
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
          style={[styles.input, styles.formGroup]}
          value={this.state.email}
          onChangeText={(email) => this.setState({email})}
        />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          style={[styles.input, styles.formGroup]}
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={(password) => this.setState({password})}
        />
        <Button onPress={() => this.signin()} title="Sign In" />

        <View style={{marginTop: 30}}>
          <Text style={styles.formGroup}>
            I would like to create an account.
          </Text>
          <Button
            title="Sign Up"
            onPress={() => this.props.navigation.navigate('Signup')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingTop: 30,
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    borderRadius: 5,
    borderColor: '#eee',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
