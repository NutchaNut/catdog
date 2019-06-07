import React from "react";
import GoogleMap from './GoogleMap';
import * as firebase from 'firebase';

export default class MyFancyComponent extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = ({
      isMarkerShown: true,
      latitude : 13.6523217,
      longitude : 100.4927536
    })
    this.loadDatafromNetpie = this.loadDatafromNetpie.bind(this);
  }

  componentDidMount() {
    //this.delayedShowMarker()
    firebase.database().ref('/users/' + this.props.userData + '/profile/')
      .once('value')
      .then((snapshot) => {
        const userData = snapshot.val();
        console.log('appKey : ' + userData.appKey);
        userData.appKey && this.loadDatafromNetpie(userData);
      });

  }

  loadDatafromNetpie(userData){
    const auth = `auth=${userData.appKey}:${userData.appSecret}`
    const url = `https://api.netpie.io/topic/${userData.appId}/pawon/gps/status?${auth}`;
    fetch(url)
      .then((response) => {
            return response.json()
        })
      .then((responseJson) => {
        const LatandLong = responseJson[0].payload;
        console.log('lat and long : ', LatandLong)
        let latlongArr = LatandLong.split(",");
        latlongArr = latlongArr.map(value =>{
          const data = parseFloat(value);
          return data;
        })
        console.log('lat and long : ',latlongArr);

        this.setState({
          latitude : latlongArr[0],
          longitude : latlongArr[1]
        })


      });
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  render() {
    console.log('re-render', { state: this.state });
    return (
      <GoogleMap
        latitude={this.state.latitude}
        longitude={this.state.longitude}
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    )
  }
}
