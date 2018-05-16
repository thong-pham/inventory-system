import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import Scanner from "./Scanner";
import Result from "./Result";

import './../../styles/custom.css';

import { fillingCode } from "./../../actions/ImportActions";

class ImportInventoryByCamera extends Component {
    state = {
        scanning: false,
        results: []
    }
    componentWillMount() {
        const { dispatch } = this.props;
    }

    _scan = () => {
        this.setState({scanning: !this.state.scanning, results: []});
    }

    _onDetected = (result) => {
        var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
        if (!pattern.test(result.codeResult.code)){
            this.setState({results: this.state.results.concat([result])});
            if (this.state.results.length > 0){
                this.setState({scanning: !this.state.scanning});
            }
        }
    }

    handleCode = () => {
        const { dispatch } = this.props;
        const data = this.state.results[0].codeResult.code;
        dispatch(fillingCode(data));
        dispatch(push("/importInventory"));
    }

    render() {
        //const { isImportingInventory, importingInventoryError } = this.props.import;
        let error = null;

        return (
          <BaseLayout>
              <Segment textAlign='center'>
                <div>
                  <Header as="h2">Import Inventory</Header>
                  {error}
                    <Button onClick={this._scan}>{this.state.scanning ? 'Stop' : 'Start'}</Button>
                    { (this.state.results.length > 0) ? <Button onClick={this.handleCode}>Confirm</Button> : null }
                    <ul className="results">
                      {this.state.results.map((result, i) => (<Result key={result.codeResult.code + i} result={result} />))}
                    </ul>
                    {this.state.scanning ? <Scanner onDetected={this._onDetected}/> : null}
                </div>
              </Segment>
          </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {

    return {
        auth: state.auth,
        import: state.importData
    }
}


export default connect(mapStatesToProps)(ImportInventoryByCamera);
