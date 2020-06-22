import React from 'react';
import {Text, Button} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default class HomeScreen extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Hello Siyun</Text>
      </SafeAreaView>
    );
  }
}
