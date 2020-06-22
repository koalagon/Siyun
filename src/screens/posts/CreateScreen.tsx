import React from 'react';
import {Text, Button, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {TextInput} from 'react-native-gesture-handler';
import storage from '@react-native-firebase/storage';
import {firebase} from '@react-native-firebase/auth';

const options = {
  storageOptions: {
    skipBackup: true,
  },
};

interface IState {
  imagePath: string;
}

export default class CreateDrawingScreen extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      imagePath: '',
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
        //const source = {uri: response.uri};
        this.setState({imagePath: 'file://' + response.path});
      }
    });
  }

  async uploadImage() {
    const uid = firebase.auth().currentUser?.uid;
    const imagePath = this.state.imagePath;
    console.log(imagePath);
    const filename = `/${uid}/${imagePath.substring(
      imagePath.lastIndexOf('/') + 1,
    )}`;

    console.log(filename);
    const reference = storage().ref(filename);
    // uploads file
    await reference
      .putFile(this.state.imagePath)
      .catch((error) => console.log(error));

    const url = await reference.getDownloadURL();
    console.log(url);

    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <>
        {this.state.imagePath ? (
          <>
            <Image
              style={{width: 500, height: 400}}
              source={{uri: this.state.imagePath}}
            />
            <Text>Private/Public</Text>
            <TextInput
              multiline={true}
              numberOfLines={8}
              placeholder="Description"
            />
            <Button
              onPress={async () => await this.uploadImage()}
              title="Post"
            />
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
