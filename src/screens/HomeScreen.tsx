import React from 'react';
import {Text, Button, Image, View, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

interface IState {
  posts: Array<IPost>;
}

interface IPost {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  description: string;
  dateCreated: string;
  nickname: string;
}

const screenWidth = Dimensions.get('window').width;

export default class HomeScreen extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      posts: [],
    };

    this.props.navigation.addListener('focus', () => {
      const refresh = this.props.route.params?.refresh;
      if (refresh) {
        this.setState({posts: []}, this.fetchPosts);
      }
    });
  }

  componentDidMount() {
    this.fetchPosts();
  }

  fetchPosts() {
    firestore()
      .collection('posts')
      // Filter results
      .where('isPublic', '==', true)
      .orderBy('dateCreated', 'desc')
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot);
        querySnapshot.forEach((documentSnapshot) => {
          const post: IPost = {
            id: documentSnapshot.id,
            imageUrl: documentSnapshot.data().imageUrl,
            width: documentSnapshot.data().width,
            height: documentSnapshot.data().height,
            description: documentSnapshot.data().description,
            dateCreated: documentSnapshot.data().dateCreated,
            nickname: 'Siyun',
          };
          console.log('post: ', post);
          this.setState({posts: [...this.state.posts, post]});
        });
      });
  }

  renderItem(item: IPost) {
    const padding = 15;
    const width = item.width > screenWidth ? screenWidth : item.width;
    const ratio = screenWidth / item.width;
    const height = item.width > screenWidth ? item.height * ratio : item.height;

    return (
      <View style={{backgroundColor: 'white', marginBottom: 15}}>
        <Text style={{padding: padding}}>{item.nickname}</Text>
        <Image
          source={{uri: item.imageUrl}}
          style={{width: width, height: height}}
        />
        <Text style={{padding: padding}}>{item.description}</Text>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <FlatList
          data={this.state.posts}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    );
  }
}
