import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Input, Grid, Accordion, Confirm } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getAllCode, addPopUp, closePopUp, trackInput, errorInput,
          submitCode, deleteCode, getCodeByCompany } from "./../../actions/CodeActions";

import { getCompanies } from "./../../actions/CompanyActions";

class ViewCode extends Component {
    state = {
      activeIndex: null,
      openConfirm: false
    };
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        if (user.company === 'ISRA'){
              dispatch(getAllCode({token: token}));
        }
        else {
              dispatch(getCodeByCompany({token: token}));
        }
        dispatch(getCompanies({token: token}));
    }
    onPressAdd(sku) {
        const { dispatch } = this.props;
        dispatch(addPopUp(sku));

    }
    onPressDelete = (keyCode) => {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        dispatch(deleteCode({ token: token, keyCode: keyCode })).then(function(data){
              if (user.company === 'ISRA'){
                    dispatch(getAllCode({token: token}));
              }
              else {
                    dispatch(getCodeByCompany({token: token}));
              }
        });
        this.setState({openConfirm: false});
    }

    handleInput(e){
        const { dispatch } = this.props;
        dispatch(trackInput(e.target.value.trim()));
    }

    onPressConfirm(code){
        const { dispatch, token } = this.props;
        const { codeInput } = this.props.code;
        const { user } = this.props.auth;
        if (!codeInput || (codeInput + "").trim() === ""){
            const data = "Invalid Input";
            dispatch(errorInput(data))
        }
        else {
            var mainSku = null;
            if (user.company === 'ISRA'){
                mainSku = code.sku;
            }
            else{
                mainSku = code.mainSku;
            }
            const data = {
               token: token,
               sku: code.sku,
               mainSku: mainSku,
               key: codeInput
            }
            dispatch(submitCode(data)).then(function(data){
                if (user.company === 'ISRA'){
                      dispatch(getAllCode({token: token}));
                }
                else {
                      dispatch(getCodeByCompany({token: token}));
                }
            });
        }
    }

    onCloseAdd(){
        const { dispatch } = this.props;
        dispatch(closePopUp());
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? null : index

        this.setState({ activeIndex: newIndex })
    }

    handleCancel = () => this.setState({ openConfirm: false });

    openConfirm = () => this.setState({ openConfirm: true });

    render() {
        const { activeIndex, openConfirm } = this.state;
        const { user } = this.props.auth;
        const { codes, fetchingCodesError, addingCodeError, openAdd, codeInput, errorInput } = this.props.code;
        const { companies } = this.props.company;
        let error = null;
        if (fetchingCodesError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Code</Message.Header>
                    <p>{fetchingCodesError}</p>
                </Message>
            )
        }
        else if (addingCodeError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Adding Code</Message.Header>
                    <p>{addingCodeError}</p>
                </Message>
            )
        }
        else if (errorInput) {
            error = (
                <Message negative>
                    <Message.Header>Error while Inputing Data</Message.Header>
                    <p>{errorInput}</p>
                </Message>
            )
        }
        const skuViewForBigCompany = codes.map(function (code, index) {
          const accordionView = companies.map(function(company){
            const codeView = code.keys.map(function(keyCode, index){
               return (
                <div key={index}>
                 { (keyCode.company === company.name.en) ?
                   <Grid columns={2}>
                     <Grid.Row>
                         <Grid.Column>
                             <p>{keyCode.value}</p>
                           </Grid.Column>
                           <Grid.Column textAlign='right'>
                              <Icon name='trash outline' onClick={this.openConfirm}/>
                              <Confirm open={openConfirm} onCancel={this.handleCancel} onConfirm={() => this.onPressDelete(keyCode)} />
                           </Grid.Column>
                     </Grid.Row>
                   </Grid> : null }
                 </div>
               )
            },this);
            const match = company.id + code.sku;
            return (
              <div key={company.id}>
                <Accordion fluid styled>
                  <Accordion.Title active={activeIndex === match} index={match} onClick={this.handleClick}>
                    <Icon name='dropdown' />
                     {company.name.en}
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === match}>
                    {codeView}
                  </Accordion.Content>
                </Accordion>
              </div>
             )
          },this);
            return (
                <Table.Row key={index}>
                    <Table.Cell>{code.sku}</Table.Cell>
                    <Table.Cell>
                        {accordionView}
                        <hr />
                        { (openAdd === code.sku) ?
                          <Grid columns={2} divided>
                            <Grid.Row>
                              <Grid.Column className="columnForInput" textAlign='center'>
                                  <Input placeholder='Code' className="inputBox" size='mini' defaultValue={codeInput} onChange={this.handleInput.bind(this)} />
                              </Grid.Column>
                                  <Grid.Column className="columnForButton" textAlign='center'>
                                      <Grid columns={2}>
                                          <Grid.Row>
                                              <Grid.Column textAlign='center'>
                                                 <Icon name='checkmark' size='large' onClick={this.onPressConfirm.bind(this, code)} />
                                              </Grid.Column>
                                              <Grid.Column textAlign='center'>
                                                  <Icon name='close' size='large' onClick={this.onCloseAdd.bind(this)} />
                                              </Grid.Column>
                                          </Grid.Row>
                                      </Grid>
                                  </Grid.Column>
                              </Grid.Row>
                            </Grid> : null}
                    </Table.Cell>
                    <Table.Cell>
                        <Button primary onClick={this.onPressAdd.bind(this, code.sku)}>Add Code</Button>
                    </Table.Cell>
                </Table.Row>
            )
        }, this);

        const skuView = codes.map(function (code, index) {
           const codeView = code.keys.map(function(keyCode, index){
              return (
                <div key={index}>
                  <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                           <p>{keyCode.value}</p>
                          </Grid.Column>
                        <Grid.Column textAlign='right'>
                            <Icon name='trash outline' onClick={this.openConfirm}/>
                            <Confirm open={openConfirm} onCancel={this.handleCancel} onConfirm={() => this.onPressDelete(keyCode)} />
                        </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </div>
              )
           },this);
            return (
                <Table.Row key={index}>
                    <Table.Cell>{code.sku}</Table.Cell>
                    <Table.Cell>
                        {codeView}
                        <hr />
                        { (openAdd === code.sku) ?
                          <Grid columns={2} divided>
                            <Grid.Row>
                              <Grid.Column className="columnForInput" textAlign='center'>
                                  <Input placeholder='Code' className="inputBox" size='mini' defaultValue={codeInput} onChange={this.handleInput.bind(this)} />
                              </Grid.Column>
                                  <Grid.Column className="columnForButton" textAlign='center'>
                                      <Grid columns={2}>
                                          <Grid.Row>
                                              <Grid.Column textAlign='center'>
                                                 <Icon name='checkmark' size='large' onClick={this.onPressConfirm.bind(this, code)} />
                                              </Grid.Column>
                                              <Grid.Column textAlign='center'>
                                                  <Icon name='close' size='large' onClick={this.onCloseAdd.bind(this)} />
                                              </Grid.Column>
                                          </Grid.Row>
                                      </Grid>
                                  </Grid.Column>
                              </Grid.Row>
                            </Grid> : null}
                    </Table.Cell>
                    <Table.Cell>
                        <Button primary onClick={this.onPressAdd.bind(this, code.sku)}>Add Code</Button>
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Code Found. Please Add Some </h4>
        if (codes.length > 0) {
            tableView = (
                <Table celled color='blue'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>SKU</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Scanning Codes</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {(user.company !== 'ISRA') ? <Table.Body>
                        {skuView}
                    </Table.Body> : null }
                    {(user.company === 'ISRA') ? <Table.Body>
                        {skuViewForBigCompany}
                    </Table.Body> : null }
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Code List</Header>
                    {error}
                    <Container>
                        {tableView}
                    </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        code: state.code,
        inventory: state.inventory,
        auth: state.auth,
        company: state.company
    }
}

export default connect(mapStatesToProps)(ViewCode);
