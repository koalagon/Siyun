import React from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {Button, Text, FlatList, KeyboardAvoidingView, View} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {AirbnbRating} from 'react-native-ratings';
import IFeedback from 'src/models/IFeedback';

interface IState {
  postId: string;
  rating: number;
  comment: string;
  user: any;
  feedbacks: Array<IFeedback>;
}

export default class CreateScreen extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      rating: 4,
      comment: '',
      postId: this.props.route.params.postId,
      user: firebase.auth().currentUser,
      feedbacks: this.props.route.params.feedbacks
        ? this.props.route.params.feedbacks
        : [],
    };
  }

  saveFeedback() {
    const feedback = {
      rating: this.state.rating,
      comment: this.state.comment,
      userId: this.state.user.uid,
      displayName: this.state.user.displayName,
      dateCreated: new Date(),
    };

    firestore()
      .collection('posts')
      .doc(this.state.postId)
      .update({
        feedbacks: firebase.firestore.FieldValue.arrayUnion(feedback),
      })
      .then(() =>
        this.setState({
          feedbacks: [...this.state.feedbacks, feedback],
          rating: 4,
          comment: '',
        }),
      );
  }

  renderItem(item: IFeedback) {
    return (
      <>
        <View style={{padding: 10}}>
          <Text>{item.displayName}</Text>
          <Text>
            {item.dateCreated
              ? new Date(item.dateCreated?._seconds * 1000).toString()
              : 'N/A'}
          </Text>
          <Text>{item.rating}</Text>
          <Text>{item.comment}</Text>
        </View>
      </>
    );
  }

  render() {
    return (
      <>
        <FlatList
          data={this.state.feedbacks}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={(feedback) => feedback.dateCreated?._nanoseconds}
        />
        <KeyboardAvoidingView>
          <AirbnbRating
            defaultRating={this.state.rating}
            onFinishRating={(rating) => this.setState({rating})}
          />
          <TextInput
            multiline={true}
            numberOfLines={4}
            placeholder="Enter your feedback"
            value={this.state.comment}
            onChangeText={(comment) => this.setState({comment})}
          />
        </KeyboardAvoidingView>
        <Button title="Save Changes" onPress={() => this.saveFeedback()} />
      </>
    );
  }
}
