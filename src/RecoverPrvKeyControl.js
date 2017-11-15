
import React, { Component } from 'react';
import sssa from 'sssa-js'
import MyQrReader from './MyQrReader';
import RawTxControl from './RawTxControl'


let ethUtil = require('ethereumjs-util');


class RecoverPrvKeyControl extends Component {

    constructor(props) {
        super(props);

        this.handleScanClick = this.handleScanClick.bind(this);
        this.handleCloseScanClick = this.handleCloseScanClick.bind(this);
        this.handleScanDataChange = this.handleScanDataChange.bind(this);
        this.handleRecoverClick = this.handleRecoverClick.bind(this);

        this.state = {
            secretList: [],
            isScanning: false,
            scanResult: '',
            recoverPrivateKey: '',
            recoverAddress: ''
        }
    }

    handleScanClick() {
        this.setState({isScanning: true});
    }

    handleCloseScanClick() {
        this.setState({isScanning: false, scanResult: ''});

        if(this.state.scanResult === '') return;

        let newItem = { id:Date.now(), text: this.state.scanResult};
        this.setState(prevState => ({
            secretList: prevState.secretList.concat(newItem),
        }));
    }

    handleScanDataChange(data) {
        this.setState({ scanResult: data });
    }

    handleRecoverClick() {
        let sList = [];
        sList = this.state.secretList.map(item =>(item.text));

        if(sList.length === 0) return;

        try {
            let recoverPrivateKey = sssa.combine(sList);
            let address = '0x' + ethUtil.privateToAddress(new Buffer(recoverPrivateKey, 'hex')).toString('hex');

            this.setState({
                recoverPrivateKey: recoverPrivateKey,
                recoverAddress: address
            });
        } catch (e){
            console.log(e.toString());
        }
    }


    render() {
        let scanButton = null;
        let myQrReader = null;
        let recoverButton = null;

        if(this.state.isScanning) {
            scanButton = <CloseScanButton onClick={this.handleCloseScanClick}/>;
            myQrReader = <MyQrReader onDataChange={this.handleScanDataChange}/>;
        }else {
            scanButton = <ScanButton i={this.state.secretList.length + 1} onClick={this.handleScanClick}/>;
        }

        recoverButton = <RecoverButton onClick={this.handleRecoverClick}/>;

        let scanString = this.state.scanResult;
        return (
            <div>
                <SecretList items={this.state.secretList}/>
                <p>scan result: {scanString.substring(0, 4) + new Array(31).join('*') + scanString.substring(scanString.length-4) }</p>
                {scanButton}
                {myQrReader}

                <div>
                    <p>公钥地址: {this.state.recoverAddress}</p>
                    {recoverButton}
                </div>

                <hr/>
                <RawTxControl privateKey={this.state.recoverPrivateKey}/>
            </div>
        );
    }
}

class SecretList extends React.Component {
    render(){
        return (
            <ol>
                {this.props.items.map(item =>(
                    <li key={item.id}>
                        <p>{item.text.substring(0,4) + new Array(31).join('*') + item.text.substring(item.text.length-4) }</p>
                    </li>
                ))}
            </ol>
        );
    }
}

function ScanButton(props) {
    return (
        <button onClick={props.onClick}>扫描输入密钥 #{props.i} </button>
    );
}

function CloseScanButton(props) {
    return (
        <button onClick={props.onClick}>关闭扫描 </button>
    );
}

function RecoverButton(props) {
    return (<button onClick={props.onClick}>还原公钥地址</button>);
}

export default RecoverPrvKeyControl;
