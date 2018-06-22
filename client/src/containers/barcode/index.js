import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container, Grid, Image } from "semantic-ui-react";
import { push } from 'react-router-redux';
import axios from "axios";
import jsPDF from 'jspdf';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { generateBarcode, trackInput } from "./../../actions/BarcodeActions";

class BarcodeGenerator extends Component {
    state = {
       image: false
    }
    componentWillMount() {
        const { dispatch } = this.props;
    }

    handleInput = (e) => {
        const { dispatch } = this.props;
        dispatch(trackInput(e.target.value));
        this.setState({image: true});
    }

    saveBarcode = () => {
        const { dispatch } = this.props;
        const { input } = this.props.barcode;
        axios.get('https://bwipjs-api.metafloor.com/?bcid=code128&scaleY=1&text=' + input, {responseType: 'blob'})
            .then(function (response) {
                const data = response.data;
                var reader = new window.FileReader();
                reader.readAsDataURL(data);
                reader.onload = function () {
                    var imageDataUrl = reader.result;
                    var doc = new jsPDF('l', 'in', [1, 2.5]);
                    doc.setFontSize(12);
                    doc.addImage(imageDataUrl, 'PNG', 0.1, 0.05, 2.3, 0.7);
                    doc.text(0.1,0.95,input);
                    doc.save(input + ".pdf");
                }
            })
            .catch(function(error){
                const response = error.response;
                throw response
            })
    }

    render() {
        const { image } = this.state;
        const { barcode, input } = this.props.barcode;
        const url = 'https://bwipjs-api.metafloor.com/?bcid=code128&scaleY=1&text=' + input;
        return (
          <BaseLayout>
              <Segment textAlign='center'>
                <div>
                  <Header as="h2">Barcode Generator</Header>
                   <Input onChange={this.handleInput}/>
                   <p></p>
                   {(input) ? <Image className="imageRender" src={url} /> : null}
                   <p></p>
                   <Button primary onClick={() => this.saveBarcode()}>Save as PDF</Button>
                </div>
              </Segment>
          </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {

    return {
        auth: state.auth,
        barcode: state.barcode
    }
}


export default connect(mapStatesToProps)(BarcodeGenerator);
