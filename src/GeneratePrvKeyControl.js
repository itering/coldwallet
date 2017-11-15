
import React, { Component } from 'react';

let QRCode = require('qrcode.react');
let sssa = require('sssa-js');
let ethUtil = require('ethereumjs-util');
let keythereum = require("keythereum");

class GeneratePrvKeyControl extends Component {
    constructor(props) {
        super(props);
        let address, privateKey = '';
        if(this.props.privateKey){
            privateKey = this.props.privateKey;
            address = '0x' + ethUtil.privateToAddress(new Buffer(privateKey, 'hex')).toString('hex');
        }
        this.state = { address: address, privateKey:privateKey };
    }

    componentDidMount() {
        if(this.state.address)
            return;
        let params = { keyBytes: 32, ivBytes: 16 };
        let dk = keythereum.create(params);
        let address = '0x' + ethUtil.privateToAddress(dk.privateKey).toString('hex');

        this.setState({ address: address, privateKey: dk.privateKey });
    }

    render() {
        return(
            <div className = 'GeneratePrivateKeySecret'>
                <p>new address: {this.state.address}</p>
                <SecretForm privateKey={this.state.privateKey}/>
            </div>
        );
    }
}

class SecretForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {kValue: '4', nValue: '6', secretList:[], isShowSecretList: false};

        this.handleKChange = this.handleKChange.bind(this);
        this.handleNChange = this.handleNChange.bind(this);

        this.handleShowClick = this.handleShowClick.bind(this);
        this.handleHideClick = this.handleHideClick.bind(this);

    }

    handleKChange(event) {
        this.setState({kValue: event.target.value});
    }

    handleNChange(event) {
        this.setState({nValue: event.target.value});
    }

    handleShowClick() {
        if(this.state.kValue > this.state.nValue) {
            alert('k should be less than n, ' + this.state.kValue + ' > ' + this.state.nValue );
            return;
        }

        let secretList = sssa.create(this.state.kValue, this.state.nValue, this.props.privateKey.toString('hex'));
        this.setState({isShowSecretList: true, secretList: secretList});
    }

    handleHideClick() {
        this.setState({isShowSecretList: false});
    }

    render() {

        let button, secretList = null;

        if(this.state.isShowSecretList) {
            button = <HideSecretButton onClick={this.handleHideClick}/>;
            secretList = <SecretList items={this.state.secretList}/>;
        }else {
            button = <ShowSecretButton onClick={this.handleShowClick}/>
        }

        return (
            <div >
                <label>
                    <label>k-shares:</label>
                    <SelectShareOptions value={this.state.kValue} handleChange={this.handleKChange}/>
                    <label>n-shares:</label>
                    <SelectShareOptions value={this.state.nValue} handleChange={this.handleNChange}/>
                    {button}
                </label>
                <div>
                    {secretList}
                </div>
            </div>
        );
    }
}

class SecretList extends React.Component {
    render(){
        return (
            <ol>
                {this.props.items.map(item =>(
                    <li key={item}>
                        <p>{new Array(50 + 1).join('*')}</p>
                        <QRCode value={item} />
                    </li>
                ))}
            </ol>
        );
    }
}

function SelectShareOptions(props) {
    let shareOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return(
        <select value={props.value} onChange={props.handleChange}>
            {shareOptions.map(item => (
                <option key={item}>{item}</option>
            ))}
        </select>
    );
}

function ShowSecretButton(props) {
    return (
        <button onClick={props.onClick}>
            分割密钥
        </button>
    );
}

function HideSecretButton(props) {
    return (
        <button onClick={props.onClick}>
            隐藏分割密钥
        </button>
    );
}

export default GeneratePrvKeyControl;