import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Button, Container, Modal, Grid, Input, Label } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getLocations, deleteLocation, triggerChange, cancelChange, trackLocation, 
        editLocation, errorInput, changeProductLocation, cancelLocationChange,
        trackNewLocation, trackQuantity, moveProduct } from "./../../actions/LocationActions";

//import { getUsers } from "./../../actions/UserActions";

class ViewLocations extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getLocations({ token: token }));
        //dispatch(getUsers({ token: token }));
    }
    onPressEdit = (location) => {
        const { dispatch } = this.props;
        dispatch(triggerChange(location.id));
    }
    onPressDelete = (location) => {
        const { token, dispatch } = this.props;
        dispatch(deleteLocation({ token: token, location: location })).then(function (data) {
            dispatch(getLocations({ token: token }));
        });
    }
    onPressAdd() {
        const { dispatch } = this.props;
        dispatch(push("/addLocation"));
    }

    handleName = (e) => {
        const { dispatch } = this.props;
        dispatch(trackLocation(e.target.value.trim()));
    }

    onCancel = () => {
        const { dispatch } = this.props;
        dispatch(cancelChange());
    }

    onSaveName = (id) => {
        const { dispatch, token } = this.props;
        const { newName } = this.props.location;
        if (newName === null || (newName + "").trim() === ""){
            dispatch(errorInput("Invalid Input"));
        }
        else {
            const data = {
                id: id,
                name: newName,
                token: token
            }
            //console.log(data);
            dispatch(editLocation(data)).then(function(data){
                dispatch(getLocations({ token: token }));
            });
        }
    }

    onPressEditProduct = (locationId, productId) => {
        const { dispatch } = this.props;
        // console.log(locationId, productId);
        dispatch(changeProductLocation({locationId, productId}));
    }

    onCancelLocationChange = () => {
        const { dispatch } = this.props;
        dispatch(cancelLocationChange());
    }

    onMoveLocation = (location_id, product_sku) => {
        const { dispatch, token } = this.props;
        const { newLocation, newQuantity } = this.props.location;
        console.log(newLocation, newQuantity);
        console.log(location_id, product_sku);
        dispatch(moveProduct({token, location_id, product_sku, newLocation, newQuantity})).then(function(data){
            dispatch(getLocations({token: token}));
        });
        
    }

    handleNewLocation = (e) => {
        const { dispatch } = this.props;
        // console.log(e.target.value.trim());
        dispatch(trackNewLocation(e.target.value.trim()))
    }

    handleQuantity = (e) => {
        const { dispatch } = this.props;
        // console.log(e.target.value.trim());
        dispatch(trackQuantity(e.target.value.trim()))
    }

    render() {
        const { locations, isFetchingLocations, fetchingLocationsError, deletingsLocationsError,
                nameChange, newName, errorInput, locationChange, productChange } = this.props.location;
        
        let error = null;
        if (fetchingLocationsError || deletingsLocationsError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Locations</Message.Header>
                    <p>{fetchingLocationsError}</p>
                    <p>{deletingsLocationsError}</p>
                </Message>
            )
        }
        if (errorInput) {
            error = (
                <Message negative>
                    <Message.Header>Error while Inputing Data</Message.Header>
                    <p>{errorInput}</p>
                </Message>
            )
        }
        const locationsView = locations.map(function (location) {
            let locationView = null;
            if (location.products.length > 0){
                locationView = location.products.map((product, index) => {
                      return (
                          <div key={index}>
                             <Grid columns={3}>
                               <Grid.Row>
                                   <Grid.Column width={10}>
                                       <p>{product.sku}</p>
                                     </Grid.Column>
                                     <Grid.Column width={3}>
                                        <p>{product.quantity}</p>
                                     </Grid.Column>
                                     <Grid.Column textAlign='right' width={3}>
                                        {/* <Icon name='pencil' onClick={() => this.onPressEditProduct(location.id, product._id)}/> */}
                                     </Grid.Column>
                               </Grid.Row>
                             </Grid>
                             <hr />
                             { (locationChange === location.id && productChange === product._id) ?                            
                             <Grid divided>
                                <Grid.Row textAlign='center'>
                                    <Grid.Column width={8}>
                                        <label>New Location</label>
                                        <Input  onChange={this.handleNewLocation}/>
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <label>Quantity</label>
                                        <Input  onChange={this.handleQuantity}/>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row textAlign='center'>
                                    <Grid.Column width={8} style={{paddingLeft: '10px'}}>
                                        <Button onClick={() => this.onMoveLocation(location.id, product.sku)} style={{width: '50px'}}><Icon name='checkmark' /></Button>
                                    </Grid.Column>
                                    <Grid.Column width={8} style={{paddingLeft: '10px'}}>
                                        <Button onClick={this.onCancelLocationChange} style={{width: '50px'}}><Icon name='close'/></Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid> : null }
                           </div>
                      )
                })
            }
            return (
                <Table.Row key={location.id}>
                    <Table.Cell>
                    {location.name}
                    <hr />
                    { (nameChange === location.id) ? <Grid divided>
                            <Grid.Row textAlign='center'>
                                <Grid.Column width={8}>
                                  <Input style={{width: '120px'}} defaultValue={newName} onChange={this.handleName}/>
                                </Grid.Column>
                                <Grid.Column width={4} style={{paddingLeft: '10px'}}>
                                    <Button onClick={() => this.onSaveName(location.id)} style={{width: '50px'}}><Icon name='checkmark' /></Button>
                                </Grid.Column>
                                <Grid.Column width={4} style={{paddingLeft: '10px'}}>
                                    <Button onClick={this.onCancel} style={{width: '50px'}}><Icon name='close'/></Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid> : null }
                    </Table.Cell>
                    <Table.Cell>{locationView}</Table.Cell>
                    <Table.Cell>{location.total}</Table.Cell>
                    <Table.Cell>
                        <Button color='teal' onClick={() => this.onPressEdit(location)}><Icon name='pencil' />Edit</Button>
                        <Button color='red' onClick={() => this.onPressDelete(location)}><Icon name='trash outline' />Delete</Button>
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Locations Found. Please Add Some </h4>
        if (locations.length > 0) {
            tableView = (
                <Table celled columns={4} fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={2}>Name</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Products</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Total</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {locationsView}
                    </Table.Body>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' padded='very'>
                    <Header as="h2">Location List</Header>
                    {error}
                    <Container>
                        {tableView}
                        <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.onPressAdd.bind(this)}>
                          <Icon name='user' /> Add Location
                        </Button>
                    </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        location: state.location,
    }
}

export default connect(mapStatesToProps)(ViewLocations);
