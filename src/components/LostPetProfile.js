import React from 'react';
import GoogleMap from './GoogleMap';
import * as firebase from 'firebase';
import './profile.css';

export default class LostPetProfile extends React.Component {

  constructor(props){
    super(props)
    this.state={
      data : ''
    }
  }
  componentDidMount(){
    firebase.database().ref('/users/' + this.props.userID + '/profile/')
    .once('value')
    .then((snapshot) => {
      const profileData = snapshot.val();
      this.setState({data : profileData})
    });
  }
  render(){
    console.log('lat : ' + this.state.data.latitude);
    return(
      <div>
        <div className="profile-container">
          <div className="profile-image-container">
            <img className="profile-image" src={this.state.data.downloadURL} />
          </div>
          <div className="profile-info-container">
              <p>Name : {this.state.data.name}</p>
              <p>Age : {this.state.data.age} Year</p>
              <p>Phone Number : {this.state.data.phoneNo}</p>
              <p>Detail : {this.state.data.detail}</p>
            </div>
        </div>
        {this.state.data.latitude &&
          <GoogleMap
            isMarkerShown
            latitude={this.state.data.latitude}
            longitude={this.state.data.longitude}
          />
        }

      </div>
    );
  }
}
