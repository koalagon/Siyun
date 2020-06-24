import React from 'react';
import {
  Text,
  Button,
  Image,
  View,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore, {firebase} from '@react-native-firebase/firestore';
import IPost from '../models/IPost';
import IFeedback from '../models/IFeedback';

interface IState {
  posts: Array<IPost>;
  refreshing: boolean;
}

const screenWidth = Dimensions.get('window').width;

export default class HomeScreen extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      posts: [],
      refreshing: false,
    };

    this.props.navigation.addListener('focus', () => {
      const refresh = this.props.route.params?.refresh;
      if (refresh) {
        this.props.navigation.setParams({refresh: false});
        this.setState({posts: []}, this.fetchPosts);
      }
    });
  }

  componentDidMount() {
    console.log('component mounted');
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
        //console.log(querySnapshot);
        let posts: Array<IPost> = [];

        querySnapshot.forEach((documentSnapshot) => {
          const data = documentSnapshot.data();
          const post: IPost = {
            id: documentSnapshot.id,
            imageUrl: data.imageUrl,
            width: data.width,
            height: data.height,
            description: data.description,
            dateCreated: data.dateCreated,
            displayName: data.displayName,
            userId: data.userId,
            feedbacks: data.feedbacks,
          };
          console.log('post: ', post);
          posts.push(post);
        });

        this.setState({posts});
      });
  }

  feedback(postId: string, feedbacks: Array<IFeedback>) {
    if (firebase.auth().currentUser) {
      this.props.navigation.navigate('CreateFeedback', {postId, feedbacks});
    } else {
      this.props.navigation.navigate('Signin');
    }
  }

  renderItem(item: IPost) {
    const padding = 15;
    const width = item.width > screenWidth ? screenWidth : item.width;
    const ratio = screenWidth / item.width;
    const height = item.width > screenWidth ? item.height * ratio : item.height;

    return (
      <>
        <View style={{backgroundColor: 'white'}}>
          <Text style={styles.nickname}>{item.displayName}</Text>
          <Text style={{paddingLeft: 15, paddingBottom: 10}}>
            {new Date(item.dateCreated._seconds * 1000).toISOString()}
          </Text>
          <Image
            source={{uri: item.imageUrl}}
            style={{width: width, height: height}}
          />
          <View>
            <Text style={styles.description}>{item.description}</Text>
            <View>
              <Text>
                Avg Rate:{' '}
                {item.feedbacks != null
                  ? (
                      item.feedbacks.reduce(
                        (total, next) => total + next.rating,
                        0,
                      ) / item.feedbacks.length
                    ).toFixed(1)
                  : 'N/A'}
              </Text>
              <Text>
                Feedbacks: {item.feedbacks == null ? 0 : item.feedbacks.length}
              </Text>
              <Button
                title="Comment & Rate"
                onPress={() => this.feedback(item.id, item.feedbacks)}
              />
            </View>
          </View>
        </View>
        <View style={{height: 15, backgroundColor: '#ddd'}}></View>
      </>
    );
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchPosts();
    this.setState({refreshing: false});
  };

  render() {
    return (
      <SafeAreaView
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <FlatList
          data={this.state.posts}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  nickname: {
    padding: 10,
    paddingLeft: 15,
    paddingBottom: 2,
    fontWeight: '700',
  },
  description: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    fontSize: 16,
  },
});
