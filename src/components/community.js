import React from 'react';
import * as firebase from 'firebase';
import './community.css'
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

function ListItem(props) {
  return (
    <Card>
      <div className="community-OtherPost-mediaCard">
        <img src={props.value.downloadURL}/>
        <div className="community-OtherPost-mediaCard-text">
          <h3>Name : {props.value.name}</h3>
          <h3>AGE : {props.value.age} Year</h3>
          <h3>Tel : {props.value.phoneNo} </h3>
          <CardText>
            {props.value.detail}
          </CardText>
        </div>
      </div>
    </Card>
  );
}

export class Community extends React.Component{
  constructor(props){
    super(props);
    this.state={
      post : [],
      userData : '',
      postData : []
    }
    this.togglePostBtn = this.togglePostBtn.bind(this);
    this.postToFind = this.postToFind.bind(this);
    this.uploadPost = this.uploadPost.bind(this);
    this.foundIt = this.foundIt.bind(this);
  }

  getPostData = async (snapshot) => {
    const post = snapshot.val();
    if (post) {
      const usersSnapshot = await firebase.database().ref('/users/').once('value');
      const users = usersSnapshot.val();
      const postData = post.map(userID => ({ ...users[userID].profile, id: userID }));
      this.setState({ postData , post });
    } else {
      this.setState({ postData: [] , post: [] });
    }
  }

  componentDidMount(){
    let userid = this.props.userData;
    firebase.database().ref('/post/')
      .on('value', this.getPostData);
    firebase.database().ref('/users/' + userid + '/profile/')
      .once('value')
      .then((snapshot) => {
        const userData = snapshot.val();
        this.setState({ userData });
      });
  }

  uploadPost(nextPost){
    let userid = this.props.userData;
    firebase.database().ref('/post/').set(nextPost);
  }

  togglePostBtn(){
    const userData = this.state.userData;
    console.log("isPost " + this.state.userData.isPost);
    const isPostValue = !this.state.userData.isPost;
    this.setState({
      userData: userData && { ...userData, isPost: isPostValue }
    });
    let userid = this.props.userData;
    firebase.database().ref('/users/' + userid + '/profile/isPost').set(isPostValue);

    isPostValue
    ? this.postToFind() : this.foundIt();      //?topost : tofound
  }

  postToFind(){
    let userid = this.props.userData;
    const nextPost = this.state.post.concat(userid);
    this.setState({ post: nextPost });
    this.uploadPost(nextPost);
  }

  foundIt(){
    let userid = this.props.userData;
    const { post } = this.state;
    const filteredPost = post.filter((item, i) => item !== userid )
    this.setState({ post: filteredPost });
    this.uploadPost(filteredPost);
  }

  render(){
    console.log("isPost " + this.state.userData.isPost);
    const textBtnPost = this.state.userData.isPost
      ? "FOUND!"
      : "POST!";
    return(
      <div>
        <div className="community-container">
          <div className="community-MyPost">
            <img
              className="myPost-profile-image"
              src={this.state.userData.downloadURL}
            />
            <FlatButton
              label={textBtnPost}
              backgroundColor={'#4DD0E1'}
              className="community-MyPost-btn"
              onClick={this.togglePostBtn}
            />
          </div>
          <div className="community-OtherPost">
              {
                this.state.postData.map((postData, index) => {
                  return (
                    <ListItem key={postData.id} value={postData} />
                  )
                })
              }
          </div>
        </div>
      </div>
    );
  }
}

export default Community;
