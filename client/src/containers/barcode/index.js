import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container, Grid, Image } from "semantic-ui-react";
import { push } from 'react-router-redux';

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

    generate = () => {
        const { dispatch } = this.props;
        const { input } = this.props.barcode;
        //dispatch(generateBarcode(input));
        this.setState({image: true});
    }

    render() {
        const { image } = this.state;
        const { barcode, input } = this.props.barcode;
        const url = 'http://bwipjs-api.metafloor.com/?bcid=code128&scaleY=1&text=' + input;
        return (
          <BaseLayout>
              <Segment textAlign='center'>
                <div>
                  <Header as="h2">Barcode Generator</Header>
                   <Input onChange={this.handleInput}/>
                   {/*<Button primary onClick={() => this.generate()}>Generate</Button>*/}
                   <p></p>
                   {(input) ? <Image className="imageRender" src={url} /> : null}
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
