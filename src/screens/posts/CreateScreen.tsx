import React from 'react';
import {Text, Button, Image, Dimensions} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {TextInput} from 'react-native-gesture-handler';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import SegmentedControlTab from 'react-native-segmented-control-tab';

const options = {
  storageOptions: {
    skipBackup: true,
  },
};

interface IState {
  imagePath: string;
  imageWidth: number;
  imageHeight: number;
  description: string;
  selectedIndex: number;
  user: any;
  screenWidth: number;
}

export default class CreateDrawingScreen extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      imagePath: '',
      imageWidth: 0,
      imageHeight: 0,
      description: '',
      selectedIndex: 0,
      user: null,
      screenWidth: Dimensions.get('window').width,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.setState({user: firebase.auth().currentUser});
    });

    Dimensions.addEventListener('change', () => {
      const screenWidth = Dimensions.get('window').width;
      this.setState({screenWidth});
    });
  }

  chooseImage() {
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const {width, height} = response;
        if (width > this.state.screenWidth) {
          const ratio = this.state.screenWidth / width;
          this.setState({imageWidth: width, imageHeight: height * ratio});
        } else {
          this.setState({imageWidth: width, imageHeight: height});
        }

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

    const downloadUrl = await reference.getDownloadURL();

    firestore()
      .collection('posts')
      .add({
        imageUrl: downloadUrl,
        description: this.state.description,
        isPublic: this.state.selectedIndex === 0,
        dateCreated: new Date(),
        userId: firebase.auth().currentUser?.uid,
      })
      .then(() => {
        console.log('Post added!');
        this.setState({imagePath: '', description: '', selectedIndex: 0});
        this.props.navigation.navigate('Home');
      });
  }

  handleIndexChange = (index: number) => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  };

  render() {
    return (
      <>
        {this.state.user ? (
          this.state.imagePath ? (
            <>
              <Image
                style={{
                  width: this.state.imageWidth,
                  height: this.state.imageHeight,
                }}
                source={{uri: this.state.imagePath}}
              />
              <SegmentedControlTab
                values={['Public', 'Private']}
                selectedIndex={this.state.selectedIndex}
                onTabPress={this.handleIndexChange}
              />
              <TextInput
                multiline={true}
                numberOfLines={8}
                placeholder="Description"
                onChangeText={(description) => this.setState({description})}
                value={this.state.description}
              />
              <Button
                onPress={async () => await this.uploadImage()}
                title="Post"
              />
            </>
          ) : (
            <>
              <Button
                onPress={() => this.chooseImage()}
                title="Pick your drawing"
              />
            </>
          )
        ) : (
          <>
            <Text>Sign in!</Text>
            <Button
              title="Sign In"
              onPress={() => this.props.navigation.navigate('Signin')}
            />
          </>
        )}
      </>
    );
  }
}
