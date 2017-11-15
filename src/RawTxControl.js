import React, { Component } from 'react';

import Web3 from 'web3'


let Tx = require('ethereumjs-tx');
let QRCode = require('qrcode.react');

class RawTxControl extends Component {

    constructor(props) {
        super(props);

        this.onTxInputChange = this.onTxInputChange.bind(this);
        this.handleTxButton = this.handleTxButton.bind(this);

        // this.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io:8545"));
        this.web3 = new Web3();

        this.state = {
            gasPrice:21,
            gasLimit:30000,
            toAddress: '0x',
            value: 0,
            nonce: 0,
            data:'0',

            rawTx:''
        };
    }

    onTxInputChange(e) {
        this.setState({[e.target.id]: e.target.value})
    }

    handleTxButton() {
        this.setState({rawTx: 'please input private secrets!'});
        this.generateRawTx();
    }

    generateRawTx() {

        if(this.props.privateKey === '') return;

        let valueWei = this.web3.toWei(this.state.value, 'ether');
        let gasPriceWei = this.web3.toWei(this.state.gasPrice, 'gwei');

        let rawTx = {
            gasPrice:   this.web3.toHex(gasPriceWei),
            gasLimit:   this.web3.toHex(this.state.gasLimit),
            to:         this.state.toAddress,
            value:      this.web3.toHex(valueWei),
            nonce:      this.web3.toHex(this.state.nonce),
            data:       this.state.data
        };
        console.log(rawTx);

        let tx = new Tx(rawTx);
        tx.sign(new Buffer(this.props.privateKey, 'hex'));

        console.log(rawTx );
        let serializedTx = tx.serialize();
        console.log('0x' + serializedTx.toString('hex'));

        this.setState({rawTx: serializedTx.toString('hex')});
    }

    render(){
        let rawTxInputs = [
            {id:'gasPrice',  desc:'gasPrice(gwei)',     handler: this.onGasPriceChange},
            {id:'gasLimit',  desc:'gasLimit',           handler: this.onTxInputChange},
            {id:'toAddress', desc:'toAddress',          handler: this.onToAddressChange},
            {id:'value',     desc:'value',              handler: this.onValueChange},
            {id:'nonce',     desc:'nonce',              handler: this.onNonceChange},
            {id:'data',      desc:'data',               handler: this.onDataChange},
        ];

        let rendInputs = rawTxInputs.map(item => {
            return (
                <div key={item.id}>
                    <div>
                        <label className="label">{item.desc}:</label>
                        <input className="input" type="text" id={item.id} value={this.state[item.id]} onChange={this.onTxInputChange}/>
                    </div>
                </div>
            );
        });


        return(
            <div>

                {rendInputs}


                <div>
                    <p>签名交易:</p>
                    <p>{this.state.rawTx}</p>

                    <QRCode value={this.state.rawTx} />

                    <div>
                        <RawTxButton className="button" onClick={this.handleTxButton}/>
                    </div>

                </div>

                <BlockChainInfo web3={this.web3}/>

            </div>
        );
    }
}


function RawTxButton(props) {
    return(<button onClick={props.onClick}> 生成离线交易</button>);
}

class BlockChainInfo extends Component{

    constructor(props) {
        super(props);
        this.state = {blockNumber: 0, date: new Date()};
    }


    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {

        if(this.props.web3 === null) return;


        let blockNumber = 0;

        try {
            // blockNumber = this.props.web3.eth.blockNumber;
        }catch (e) {
            console.log(e);
        }

        this.setState({
            blockNumber: blockNumber,
            date: new Date()
        });
    }

    render() {

        return(
            <div>
                <p>block: {this.state.blockNumber}</p>
                <p>{this.state.date.toLocaleTimeString()}</p>
            </div>

        );
    }
}

export default RawTxControl;