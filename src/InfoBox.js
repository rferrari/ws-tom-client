import React, { Component } from 'react';

class InfoBox extends Component {
    constructor(props) {
        super(props);
        // this.addMessage = this.addMessage.bind(this);
    }

    render() {
        return (
            <div>
                <div className="info-box">
                    <div className="info-event">
                        <p>Last Event ID: {this.props.lastEventId}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoBox;