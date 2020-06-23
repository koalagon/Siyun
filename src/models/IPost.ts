import IFeedback from './IFeedback';

export default interface IPost {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  description: string;
  dateCreated: any;
  userId: string;
  displayName: string;
  feedbacks: Array<IFeedback>;
}
