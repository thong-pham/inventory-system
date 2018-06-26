import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button,
          Input, Item, Grid, Accordion, Divider, Checkbox, Dropdown, Pagination } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getProcessedOrders, getProcessedOrdersByCompany, filterStatus, filterCompany, renderPage } from "./../../actions/OrderActions";

import { getCompanies } from "./../../actions/CompanyActions";

class ViewProcessedOrders extends Component {
    state = {
        activeIndex: 0,
        column: null
      };
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        if (user.company === 'ISRA'){
            dispatch(getProcessedOrders({ token: token }));
            dispatch(getCompanies({token: token}));
        }
        else {
            dispatch(getProcessedOrdersByCompany({ token: token}));
            dispatch(getCompanies({token: token}));
        }
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    handleFilter = (e, data) => {
        const { dispatch } = this.props;
        dispatch(filterStatus(data.label));
    }

    handleChange = (e, data) => {
        const { dispatch } = this.props;
        dispatch(filterCompany(data.value));
    }

    handlePaginationChange = (e, data) => {
        const { dispatch } = this.props;
        //console.log(data.activePage);
        this.setState({column: null});
        dispatch(renderPage(data.activePage));
    }

    onDetails = (id) => {
        const { dispatch } = this.props;
        dispatch(push("/processedOrder/" + id))
    }

    render() {
        const { activeIndex, column } = this.state;
        const { user } = this.props.auth;
        const { processedOrders, fetchingApprovedOrdersError, checkApproved, checkCanceled, checkCompany, allPages, activePage } = this.props.order;
        const { companies } = this.props.company;
        var companyList = [{key:1, text:'All', value:'All'}];
        var companyKey = 2;
        if (companies.length > 0){
            companies.forEach(function(company){
                if (company.name.en !== 'ISRA'){
                    const data = {
                        key: companyKey,
                        text: company.name.en,
                        value: company.name.en
                    }
                    companyList.push(data);
                    companyKey += 1;
                }
            });
        }
        let error = null;
        if (fetchingApprovedOrdersError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Orders</Message.Header>
                    <p>{fetchingApprovedOrdersError}</p>
                </Message>
            )
        }
        let ordersView = null;
        if (processedOrders !== null){
            ordersView = processedOrders.map(function (order) {
                const detailsView = order.details.map(function(cart){
                    return (
                        <Item key={cart.id}>
                          <Item.Content>
                            {/*<Item.Header as='a'>ID {cart.id}</Item.Header>*/}
                            <Item.Description>
                              { (user.company !== 'ISRA') ? <p>SKU : <strong>{cart.sku}</strong></p> : null }
                              { (user.company === 'ISRA') ? <p>SKU : <strong>{cart.mainSku}</strong></p> : null }
                              <p>Description : {cart.desc}</p>
                              <p>Request : {cart.quantity}</p>
                              <p>Accept : {cart.accept}</p>
                            </Item.Description>
                          </Item.Content>
                          <Divider horizontal></Divider>
                        </Item>
                    )
                }, this);
                return (
                    <Table.Row key={order.id}>
                        <Table.Cell>{order.id}</Table.Cell>
                        <Table.Cell>
                            {/*<Item.Group>
                              <Accordion fluid styled>
                                <Accordion.Title active={activeIndex === order.id} index={order.id} onClick={this.handleClick}>
                                  <Icon name='dropdown' />
                                   See Details
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === order.id}>
                                  {detailsView}
                                </Accordion.Content>
                              </Accordion>
                            </Item.Group>*/}
                            <Button onClick={() => this.onDetails(order.id)}>See Details</Button>
                        </Table.Cell>
                        <Table.Cell>{order.status}</Table.Cell>
                        <Table.Cell>{order.createdBy}</Table.Cell>
                        <Table.Cell>{order.processedBy}</Table.Cell>
                        <Table.Cell>{order.lastModifiedAt.slice(5,7)}/{order.lastModifiedAt.slice(8,10)}/{order.lastModifiedAt.slice(0,4)}</Table.Cell>
                        { (user.company === 'ISRA') ? <Table.Cell >{order.company}</Table.Cell> : null }
                    </Table.Row>
                )
            }, this);
        }

        let tableView = <h4>No Processed Orders Found</h4>
        if (processedOrders !== null && processedOrders.length > 0) {
            tableView = (
                <Table celled fixed color='blue'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>Order Number</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Details</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Created By</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Proccessed By</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Date</Table.HeaderCell>
                            { (user.company === 'ISRA') ? <Table.HeaderCell width={1}>Company</Table.HeaderCell> : null }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {ordersView}
                    </Table.Body>
                    <Table.Footer>
                      <Table.Row>
                        {(user.company === 'ISRA') ? <Table.HeaderCell colSpan='7' textAlign='right'>
                            <Pagination pointing activePage={activePage} onPageChange={this.handlePaginationChange} totalPages={allPages.length} />
                        </Table.HeaderCell> : null }
                        {(user.company !== 'ISRA') ? <Table.HeaderCell colSpan='6' textAlign='right'>
                            <Pagination pointing activePage={activePage} onPageChange={this.handlePaginationChange} totalPages={allPages.length} />
                        </Table.HeaderCell> : null }
                      </Table.Row>
                    </Table.Footer>
                </Table>
            )
        }
        return (
          <BaseLayout>
              <Segment textAlign='center' >
                  { (user.company === 'ISRA') ? <Header as="h2">Processed Order List</Header> : <Header as="h2">{user.company} - Processed Order List</Header> }
                  <div>
                      <Checkbox className="checkBoxOrder" label="Approved" toggle checked={checkApproved} onChange={this.handleFilter}/>
                      <Checkbox className="checkBoxOrder" label="Canceled" toggle checked={checkCanceled} onChange={this.handleFilter}/>
                      { (user.company === 'ISRA') ? <Dropdown
                        onChange={this.handleChange}
                        options={companyList}
                        placeholder='Filter by Company'
                        selection
                        value={checkCompany}
                      /> : null }
                  </div>
                  <hr />
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
        order: state.order,
        auth: state.auth,
        company: state.company
    }
}

export default connect(mapStatesToProps)(ViewProcessedOrders);
