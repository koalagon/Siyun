import React from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {
  Text,
  FlatList,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Dimensions,
  Keyboard,
} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {AirbnbRating} from 'react-native-ratings';
import IFeedback from '../../models/IFeedback';
import PostButton from '../../components/PostButton';

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
    console.log('saveFeedback');

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
      .then(() => {
        this.setState({
          feedbacks: [...this.state.feedbacks, feedback],
          rating: 4,
          comment: '',
        });
        Keyboard.dismiss();
      });
  }

  renderItem(item: IFeedback) {
    return (
      <>
        <View
          style={{
            borderBottomColor: '#eee',
            borderBottomWidth: 1,
            paddingBottom: 7,
            paddingTop: 7,
            paddingLeft: 15,
            paddingRight: 15,
          }}>
          <View style={styles.row}>
            <Text style={{fontWeight: '700'}}>{item.displayName}</Text>
            <AirbnbRating
              defaultRating={item.rating}
              isDisabled={true}
              showRating={false}
              size={14}
              starContainerStyle={{paddingLeft: 10}}
            />
          </View>
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
        <View style={styles.container}>
          <AirbnbRating
            defaultRating={this.state.rating}
            onFinishRating={(rating) => this.setState({rating})}
          />
          <View style={[styles.row, styles.marginTop15]}>
            <TextInput
              style={[
                styles.feedbackInput,
                {width: Dimensions.get('window').width - 100},
              ]}
              placeholder="Enter your feedback"
              value={this.state.comment}
              onChangeText={(comment) => this.setState({comment})}
            />
            <PostButton onPress={() => this.saveFeedback()} />
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
  },
  marginTop15: {
    marginTop: 15,
  },
  feedbackInput: {
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
