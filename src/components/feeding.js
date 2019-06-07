import React from 'react';
import * as firebase from 'firebase';
import './feeding.css';
import feed from '../dog-food.png'
import TimePicker from 'material-ui/TimePicker';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

function ListItem(props) {
  return (
    <div className="feeding-ListItem">
      <div>Time : {props.value}</div>
      <RaisedButton label="Delete" primary={true} onClick={props.onDelete} />
    </div>
  );
}

export class Feeding extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      foodValue : '50',
      times: [],
      time: null,
      userData :''
    }

    this.addTime = this.addTime.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.uploadToFirebase = this.uploadToFirebase.bind(this);
    this.addZero = this.addZero.bind(this);
    this.loadFoodValue = this.loadFoodValue.bind(this);
    this.putTimeToNetPie = this.putTimeToNetPie.bind(this);
  }

  componentDidMount(){
    let userid = this.props.userData;
    const ref = firebase.database();
    firebase.database().ref('/users/' + userid + '/times/')
    .once('value')
    .then((snapshot) => {
      const times = snapshot.val();
      if(!times){
        firebase.database().ref('/users/' + userid+ '/times/').set(times);
      }else{
        this.setState({ times });
      }
      firebase.database().ref('/users/' + userid + '/profile/')
        .once('value')
        .then((snapshot) => {
          const userData = snapshot.val();
          this.setState({ userData });
          userData.appKey && this.loadFoodValue(userData);
        });
    });
  }

  loadFoodValue(userData){
    const auth = `auth=${userData.appKey}:${userData.appSecret}`
    const url = `https://api.netpie.io/topic/${userData.appId}/PET/Food?${auth}`;
    fetch(url)
      .then((response) => {
            return response.json()
          })
      .then((responseJson) => {
        const foodValue = responseJson[0].payload;
        console.log('food value : ', foodValue)
        this.setState({
          foodValue,
        });
      });
  }

  uploadToFirebase(nextTimes) {
    let userid = this.props.userData;
    const times = nextTimes.map((time) => time.toString());
    firebase.database().ref('/users/' + userid + '/times/').set(times);
  }

  deleteTime(index) {
    const { times } = this.state;
    const filteredTimes = times.filter((item, i) => i !== index )
    this.setState({ times: filteredTimes });
    this.uploadToFirebase(filteredTimes);
    this.state.userData.appKey && this.putTimeToNetPie(filteredTimes);
  }

  addTime() {
    const { time, times } = this.state;
    const nextTimes = times.concat(time);
    this.setState({ times: nextTimes });
    this.uploadToFirebase(nextTimes);
    this.state.userData.appKey && this.putTimeToNetPie(nextTimes);
  }

  putTimeToNetPie(nextTimes){
    let timeText = '';

    nextTimes.map((time,index) => {
      timeText = timeText + time;
      if(index < nextTimes.length){
        timeText = timeText + ',';
      }
    });

    console.log("timeText :" + timeText);

      const auth = `auth=${this.state.userData.appKey}:${this.state.userData.appSecret}`
      const url = `https://api.netpie.io/microgear/${this.state.userData.appId}/jameqq?${auth}`;
      fetch(url,
        {
          method: 'PUT', // Use method PUT for send data.
          body: timeText // Change your messages send to netpie.
        }
      );
  }

  changeTime(event, date){
    console.log(date);
    let timeString = `${date.getHours().toString()}.${this.addZero(date.getMinutes()).toString()}`;
    this.setState({ time: timeString });
  }

  addZero(i){
    if (i < 10) {
        i = "0" + i;
    }
    return i;
  }

  render(){
    return(
      <div className = "feeding-container">
        <div className = "feeding-container-Top">
          <div className = "feeding-foodPic">
            <img src={feed} width="128" height="128" />
          </div>
          <div className = "feeding-foodValue">
            <CircularProgress
              size={100}
              thickness={7}
              mode="determinate"
              value={this.state.foodValue}
              innerStyle={{ transform: 'rotate(270deg)' }}
            />
            <p> Food Value : {this.state.foodValue} %</p>
          </div>
        </div>
        <div className="feeding-setTime">
          <div className="feeding-setTime-bar">
              <h1>Set Time</h1>
              <TimePicker
                hintText="12hr Format"
                onChange={this.changeTime}

              />
              <RaisedButton
                label="Add"
                onClick={this.addTime}
                backgroundColor="#FFF"
                labelColor="#00BCD4"
              />
          </div>
          <div>
            {
              this.state.times.map((time, index) => {
                // const value = time.getHours().toString() + '.' + time.getMinutes().toString();
                return (
                  <ListItem
                    onDelete={() => this.deleteTime(index)}
                    key={time.toString()}
                    value={time}
                  />
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Feeding;
