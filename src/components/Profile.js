import React from 'react';
import * as firebase from 'firebase';
import './profile.css';

export class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isEdited: false,
      file: '',
      imagePreviewUrl: '',
      data: null,
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAgeChange = this.handleAgeChange.bind(this);
    this.handlePhoneNoChange = this.handlePhoneNoChange.bind(this);
    this.handleDetailChange = this.handleDetailChange.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.uploadToFirebase = this.uploadToFirebase.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.handleAppIdChange = this.handleAppIdChange.bind(this);
    this.handleAppKeyChange = this.handleAppKeyChange.bind(this);
    this.handleAppSecretChange = this.handleAppSecretChange.bind(this);

  }

  componentWillMount() {
    console.log('willMount');
    let userid = this.props.userData;
    firebase.database().ref('/users/' + userid + '/profile/')
    .once('value')
    .then((snapshot) => {
      const profileData = snapshot.val();
      if(!profileData){
        const defaultData = {
          name : 'PetName',
          age : '1',
          phoneNo : 'null',
          detail : 'so cute ...',
          appId : 'null',
          appKey : 'null',
          appSecret : 'null',
          isPost : false,
          latitude : 13.6523217,
          longitude : 100.4927536,
        };
        firebase.database().ref('/users/' + userid + '/profile/').set(defaultData);
        this.setState({data : defaultData})
      }else {
        this.setState({
          data: profileData
        });
      }
    })
  }

  uploadImage() {

    let userid = this.props.userData;

    let storageRef = firebase.storage().ref();
    let fileName = this.state.file;
    const metadata = {
      contentType: 'image/jpeg'
    };

    const uploadTask = storageRef.child(userid + '/Image/' + 'profilePic').put(fileName, metadata);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => null,
      (error) => null,
      () => {
        const downloadURL = uploadTask.snapshot.downloadURL;
        this.setState({ data: { ...this.state.data, downloadURL : downloadURL }});
        console.log('upload complete');
        this.uploadToFirebase(downloadURL);
      }
    );
  }

  uploadToFirebase(downloadURL) {
    let userid = this.props.userData;

    console.log('upload firebase')
    console.log('file : ',this.state.file);

    firebase.database().ref('/users/' + userid + '/profile/').set(this.state.data);
  }

  toggleEdit() {
    // this.setState((prevState) => ({ isEdited: !prevState.isEdited }));
    this.setState({ isEdited: !this.state.isEdited });
    console.log(this.state.isEdited);
    this.state.isEdited
    ? this.uploadImage() : null;
  }

  handleNameChange(event) {
    const data = this.state.data;
    this.setState({
      data: data && { ...data, name: event.target.value },
    })
  }

  handleAgeChange(event) {
    const data = this.state.data;
    this.setState({
      data: data && { ...data, age: event.target.value },
    })
  }
  handlePhoneNoChange(event) {
    const data = this.state.data;
    this.setState({
      data: data && { ...data, phoneNo: event.target.value },
    })
  }

  handleDetailChange(event) {
    const data = this.state.data;
    this.setState({
      data: data && { ...data, detail: event.target.value },
    })
  }

  handleAppIdChange(event) {
    const data = this.state.data;
    this.setState({
      data: data && { ...data, appId: event.target.value },
    })
  }

  handleAppKeyChange(event) {
    const data = this.state.data;
    this.setState({
      data: data && { ...data, appKey: event.target.value },
    })
  }

  handleAppSecretChange(event) {
    const data = this.state.data;
    this.setState({
      data: data && { ...data, appSecret: event.target.value },
    })
  }

  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  render(){

    if (this.state.data == null) {
      return <div>loading...</div>;
    }

    const imageUploadButton = this.state.isEdited
      && <input type="file" className="profile-image-uploader" onChange={this.handleImageChange}/>;
    const imageDisplay = this.state.isEdited
      ? this.state.imagePreviewUrl ? this.state.imagePreviewUrl : this.state.data.downloadURL
      : this.state.data.downloadURL;

    return(
      <div>
        <div className="profile-container">
          {
            this.state.data.downloadURL
            ? <div className="profile-image-container">
                <img className="profile-image" src={imageDisplay} />
                {imageUploadButton}
              </div>
            : <div className="profile-image-container">
                <div className="profile-image default" />
                {imageUploadButton}
              </div>
          }
          {
            this.state.isEdited
            ?(<div className="profile-info-container">
                <p>Name : </p>
                <input
                  value={this.state.data.name}
                  onChange={this.handleNameChange}
                />
                <p>Age : </p>
                <input
                  value={this.state.data.age}
                  onChange={this.handleAgeChange}
                />
                <p>Phone Number : </p>
                <input
                  value={this.state.data.phoneNo}
                  onChange={this.handlePhoneNoChange}
                />
                <p>Detail : </p>
                <textarea
                  className="profile-info-inputDetail"
                  value={this.state.data.detail}
                  onChange={this.handleDetailChange}
                />
                <p>AppId : </p>
                <input
                  value={this.state.data.appId}
                  onChange={this.handleAppIdChange}
                />
                <p>AppKey : </p>
                <input
                  value={this.state.data.appKey}
                  onChange={this.handleAppKeyChange}
                />
                <p>AppSecret : </p>
                <input
                  value={this.state.data.appSecret}
                  onChange={this.handleAppSecretChange}
                />
              </div>
            )
            :(<div className="profile-info-container">
                <p>Name : {this.state.data.name}</p>
                <p>Age : {this.state.data.age} Year</p>
                <p>Phone Number : {this.state.data.phoneNo}</p>
                <p>Detail : {this.state.data.detail}</p>
                <p>appId : {this.state.data.appId}</p>
                <p>appKey : {this.state.data.appKey}</p>
                <p>appSecret : {this.state.data.appSecret}</p>
              </div>
            )
          }
        </div>
        <div className="profile-edit">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={this.toggleEdit}
          >
            {
              this.state.isEdited
              ? 'Save'
              : 'Edit Profile'
            }
          </button>
        </div>
      </div>
    );
  }
}

export default Profile;
