import React, { Component } from 'react';
import Quagga from 'quagga';


class Scanner extends Component {

  componentDidMount() {
    console.log(this.props.codeType);

    Quagga.init({
        inputStream: {
            type : "LiveStream",
            constraints: {
                facingMode: "environment" // or user
            }
        },
        locator: {
            patchSize: "medium",
            halfSample: true
        },
        numOfWorkers: 4,
        decoder: {
            readers : [ this.props.codeType ]
        },
        locate: true
    }, function(err) {
        if (err) {
            return console.log(err);
        }
        Quagga.start();
    });
    Quagga.onDetected(this._onDetected);
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected);
    Quagga.stop();
  }

  _onDetected = (result) => {
    this.props.onDetected(result);
  }

  render() {
    return (
      <div id="interactive" className="viewport"/>
    )
  }
}

export default Scanner
