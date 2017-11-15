
import React, { Component } from 'react';

import QrReader from 'react-qr-reader'

class MyQrReader extends Component {
    constructor(props){
        super(props);
        this.state = {
            delay: 100
        }

        this.handleScan = this.handleScan.bind(this)
    }
    handleScan(data){
        if(data) {
            this.props.onDataChange(data);
        }
    }
    handleError(err){
        console.error(err)
    }
    render(){
        const previewStyle = {
            height: 440,
            width: 520,
        };

        return(
            <div>
                <QrReader
                    delay={this.state.delay}
                    style={previewStyle}
                    onError={this.handleError}
                    onScan={this.handleScan}
                />
            </div>
        )
    }
}

export default MyQrReader;