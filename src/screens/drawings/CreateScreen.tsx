import React from 'react';
import {Text, Button, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {TextInput} from 'react-native-gesture-handler';

const options = {
  storageOptions: {
    skipBackup: true,
  },
};

interface IState {
  imageUri: string;
}

export default class CreateDrawingScreen extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      imageUri: '',
    };
  }

  pickImage() {
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};

        this.setState({imageUri: response.uri});
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      }
    });
  }

  render() {
    return (
      <>
        {this.state.imageUri ? (
          <>
            <Image
              style={{width: 500, height: 400}}
              source={{uri: this.state.imageUri}}
            />
            <TextInput
              multiline={true}
              numberOfLines={8}
              placeholder="Description"
            />
            <Button onPress={() => console.log('upload!')} title="Post" />
          </>
        ) : (
          <>
            <Button
              onPress={() => this.pickImage()}
              title="Pick your drawing"
            />
          </>
        )}
      </>
    );
  }
}
