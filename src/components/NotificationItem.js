import * as React from 'react';
import './notificationItem.css';


class NotificationItem extends React.Component {
  render() {
    const message = `This pet is near you about ${this.props.data.distance} km`;
    const date = new Date(this.props.data.date);
    let displayDate = `${date.toLocaleString()}`
    console.log(date.toString());
    return (
      <React.Fragment>
        <div className="dropdown-divider"></div>
        <a
          className="dropdown-item notification-container"
          onClick={this.props.onClick}
        >
          <div className="content">
            <img src={this.props.data.downloadURL} />
            <div className="message">
              <span>{this.props.data.name}</span>
              <span className="dropdown-message small">{message}</span>
            </div>
          </div>
          <span className="small text-muted">{displayDate}</span>
        </a>
      </React.Fragment>
    );
  }
}

export default NotificationItem;
