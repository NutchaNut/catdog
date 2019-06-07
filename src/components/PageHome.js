import React from 'react';
import Profile from './Profile.js'
import Feeding from './feeding.js'
import Map from './map.js'
import Community from './community.js'
import NotificationItem from './NotificationItem';
import * as firebase from 'firebase';
import LostPetProfile from './LostPetProfile';

class PageHome extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      content : 'PROFILE' ,
      notifications : [],
      currentLostPetID : '',
    }
    this.renderListOfNotificationItems = this.renderListOfNotificationItems.bind(this);
    this.handleNotificationSelected = this.handleNotificationSelected.bind(this);
  }

  componentDidMount(){
    firebase.database().ref('/users/' + this.props.userData + '/notifications/')
    .on('value', (snapshot) => {
      const notificationsObject = snapshot.val();
      const notifications = notificationsObject
        ? Object.keys(notificationsObject).map(id => {
            const data = notificationsObject[id];
            return Object.assign({ id }, data);
          })
        : [];
      this.setState({ notifications });
    })
  }

  handleNotificationSelected(lostPetID) {
    this.setState({ currentLostPetID: lostPetID, content: 'LOST_PET_PROFILE' });
  }

  renderListOfNotificationItems() {
    const notificationItems = this.state.notifications.map(notification => (
      <NotificationItem
        key={notification.id}
        data={notification.data}
        onClick={() => this.handleNotificationSelected(notification.data.id)}
      />
    ));
    const totalNotification = this.state.notifications
      .filter(notification => !notification.data.isSeen).length;
    const notificationBadge = totalNotification !== 0
      && <span className="badge badge-pill badge-warning">{`${totalNotification} New`}</span>;
    return (
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle mr-lg-2" id="alertsDropdown" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="fa fa-fw fa-bell"></i>
          <span className="d-lg-none">Alerts
            {notificationBadge}
          </span>
          <span className="indicator text-warning d-none d-lg-block">
            <i className="fa fa-fw fa-circle"></i>
          </span>
        </a>
        <div className="dropdown-menu" aria-labelledby="alertsDropdown">
          <h6 className="dropdown-header">New Alerts:</h6>
          {notificationItems}
          <div className="dropdown-divider"></div>
          <a className="dropdown-item small" href="#">View all alerts</a>
        </div>
      </li>
    );
  }

  render(){
    return(
      <div className="fixed-nav sticky-footer bg-dark" id="page-top">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
        <a className="navbar-brand" href="index.html">Where is my pet ?</a>
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav navbar-sidenav" id="exampleAccordion">
            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Profile">
              <a className="nav-link" onClick={ () => this.setState({content : 'PROFILE'}) } >
                <span className="nav-link-text">Profile</span>
              </a>
            </li>
            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Feeding Machine">
              <a className="nav-link" onClick={ () => this.setState({content : 'FEEDING'}) } >
                <span className="nav-link-text">Feeding Machine</span>
              </a>
            </li>
            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Map">
              <a className="nav-link" onClick={ () => this.setState({content : 'MAP'}) }>
                <span className="nav-link-text">Map</span>
              </a>
            </li>
            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Community">
              <a className="nav-link"onClick={ () => this.setState({content : 'COMMUNITY'}) }>
                <span className="nav-link-text">Community</span>
              </a>
            </li>
          </ul>
          <ul className="navbar-nav sidenav-toggler">
            <li className="nav-item">
              <a className="nav-link text-center" id="sidenavToggler">
                <i className="fa fa-fw fa-angle-left"></i>
              </a>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            {this.renderListOfNotificationItems()}
            <li className="nav-item">
              <a className="nav-link" data-toggle="modal" data-target="#exampleModal">
                <i className="fa fa-fw fa-sign-out"></i>Logout</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="content-wrapper">
        <div className="container-fluid">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Dashboard</a>
            </li>
            <li className="breadcrumb-item active">Navbar</li>
          </ol>
          <hr/>

          {this.state.content === 'PROFILE' && <Profile userData={this.props.userData} />}
          {this.state.content === 'FEEDING' && <Feeding userData={this.props.userData} />}
          {this.state.content === 'MAP' && <Map userData={this.props.userData} />}
          {this.state.content === 'COMMUNITY' && <Community userData={this.props.userData} />}
          {this.state.content === 'LOST_PET_PROFILE' && <LostPetProfile userID={this.state.currentLostPetID} />}

        </div>
      </div>
      </div>
    );
  }
}

export default PageHome;
