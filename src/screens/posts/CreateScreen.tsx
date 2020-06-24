import React from 'react';
import {Text, Button, Image, Dimensions, View, StyleSheet} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {SafeAreaView} from 'react-native-safe-area-context';
import PostButton from '../../components/PostButton';

const options = {
  storageOptions: {
    skipBackup: true,
  },
};

interface IState {
  imagePath: string;
  imageWidth: number;
  imageHeight: number;
  originalWidth: number;
  originalHeight: number;
  description: string;
  selectedIndex: number;
  user: any;
  screenWidth: number;
}

export default class CreateScreen extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      imagePath: '',
      imageWidth: 0,
      imageHeight: 0,
      originalWidth: 0,
      originalHeight: 0,
      description: '',
      selectedIndex: 0,
      user: null,
      screenWidth: Dimensions.get('window').width,
    };

    this.props.navigation.addListener('focus', () => {
      this.setState({user: firebase.auth().currentUser});
    });

    this.props.navigation.addListener('blur', () => {
      this.setState({description: '', selectedIndex: 0, imagePath: ''});
    });

    Dimensions.addEventListener('change', () => {
      const screenWidth = Dimensions.get('window').width;
      this.setState({screenWidth});
    });
  }

  componentDidMount() {}

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
        this.setState({originalWidth: width, originalHeight: height});
        if (width > this.state.screenWidth) {
          const ratio = this.state.screenWidth / width;
          this.setState({
            imageWidth: this.state.screenWidth,
            imageHeight: height * ratio,
          });
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
        userId: this.state.user.uid,
        displayName: this.state.user.displayName,
        width: this.state.originalWidth,
        height: this.state.originalHeight,
      })
      .then(() => {
        console.log('Post added!');
        this.setState({imagePath: '', description: '', selectedIndex: 0});
        this.props.navigation.navigate('Home', {refresh: true});
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
            <SafeAreaView>
              <ScrollView>
                <Image
                  style={{
                    width: this.state.imageWidth,
                    height: this.state.imageHeight,
                  }}
                  source={{uri: this.state.imagePath}}
                />
                <View style={[styles.padding10, styles.marginTop15]}>
                  <SegmentedControlTab
                    values={['Public', 'Private']}
                    selectedIndex={this.state.selectedIndex}
                    onTabPress={this.handleIndexChange}
                    activeTabStyle={{backgroundColor: '#2196f3'}}
                  />
                  <View style={[styles.row, styles.marginTop15]}>
                    <TextInput
                      placeholder="Description"
                      onChangeText={(description) =>
                        this.setState({description})
                      }
                      value={this.state.description}
                      style={[
                        styles.descInput,
                        {width: this.state.screenWidth - 90},
                      ]}
                    />
                    <PostButton
                      onPress={async () => await this.uploadImage()}
                    />
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          ) : (
            <View style={[styles.padding10, {marginTop: 50}]}>
              <Button
                onPress={() => this.chooseImage()}
                title="Pick your drawing"
              />
            </View>
          )
        ) : (
          <>
            <View style={styles.container}>
              <Text>You need to sign in in order to post your drawing.</Text>
              <View style={styles.marginTop15}>
                <Button
                  title="Sign In"
                  onPress={() => this.props.navigation.navigate('Signin')}
                />
              </View>
            </View>
          </>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 30,
  },
  row: {
    flexDirection: 'row',
  },
  padding10: {
    padding: 10,
  },
  marginTop15: {
    marginTop: 15,
  },
  descInput: {
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
