
import React, { Component } from 'react';

import QrReader from 'react-qr-reader'

class TestCam extends Component {
    constructor(props){
        super(props);
        this.state = {
            delay: 100,
            result: 'No result',
        }

        this.handleScan = this.handleScan.bind(this)
    }
    handleScan(data){
        if(data) {
            this.setState({
                result: data,
            });
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
                <p>{this.state.result}</p>

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

export default TestCam;