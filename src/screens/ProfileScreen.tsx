import React from 'react';
import {Text, Button, StyleSheet, View} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';

interface IState {
  user: any;
}

export default class ProfileScreen extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.setState({user: firebase.auth().currentUser});
    });
  }

  signout() {
    auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('Home');
        console.log('User signed out!');
      });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.user ? (
          <>
            <Text style={styles.marginBottom15}>
              Hello {this.state.user?.displayName}
            </Text>
            <Button onPress={() => this.signout()} title="Sign Out" />
          </>
        ) : (
          <>
            <Text style={styles.marginBottom15}>
              You are not logged in. Please sign in.
            </Text>
            <Button
              title="Sign In"
              onPress={() => this.props.navigation.navigate('Signin')}
            />
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingTop: 30,
  },
  marginBottom15: {
    marginBottom: 15,
  },
});
