import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Button, Container, Modal, Input, Loader, Dimmer } from "semantic-ui-react";
import { push } from 'react-router-redux';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import zipcelx from 'zipcelx';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getProcessedOrders, setViewingProcessedOrder } from "./../../actions/OrderActions";

class ViewProcessedOrder extends Component {
    state = {}
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        const idParam = this.props.location.pathname.split("/")[2];
        dispatch(getProcessedOrders({token: token}));
        dispatch(setViewingProcessedOrder(idParam));
    }

    saveAdPdf = () => {
        const idParam = this.props.location.pathname.split("/")[2];
        const { order } = this.props.order;
        var doc = new jsPDF('p', 'pt');
        var data = order.lastModifiedAt.slice(5,7) + "/" + order.lastModifiedAt.slice(8,10) + "/" + order.lastModifiedAt.slice(0,4);
        var columns = ["ID", "SKU", "Description", "Requested", "Accept", "Notes"];
        var rows = [];
        var id = 1;
        order.details.forEach(function(cart){
            var row = [];
            row.push(id);
            id++;
            row.push(cart.mainSku);
            row.push(cart.desc);
            row.push(cart.quantity);
            if (order.status === 'approved') row.push(cart.accept);
            else row.push(0);
            row.push("");
            rows.push(row);
        });

        doc.setFontSize(20);
        doc.text(245, 40, "Order Report");
        doc.setFontSize(12);
        doc.text(40, 65, "Order Number: " + idParam);
        doc.text(40, 85, "Company Name: " + order.company);
        doc.text(40, 105, "Status: " + order.status);
        doc.text(490, 40, "Date");
        doc.text(490, 60, data);
        //console.log(rows);
        doc.page = 1;
        var footer = function(){
            doc.text(300,820, '' + doc.page);
            doc.page ++;
        }
        doc.autoTable(columns, rows, {
            theme: 'grid',
            styles: {overflow: 'linebreak'},
            startY: 125,
            addPageContent: footer,
            columnStyles: {
              0: {columnWidth: 35},
              1: {columnWidth: 100},
              2: {columnWidth: 210},
              3: {columnWidth: 60},
              4: {columnWidth: 60},
              5: {columnWidth: 60},
            }
        });
        doc.save("order-" + idParam + ".pdf")
    }

    saveAsExcel = () => {
        const { order } = this.props.order;
        const idParam = this.props.location.pathname.split("/")[2];
        var data = [];
        var header = [
                        {value: 'ID', type: 'string'},
                        {value: 'SKU', type: 'string'},
                        {value: 'Description', type: 'string'},
                        {value: 'Requested', type: 'string'},
                        {value: 'Accept', type: 'string'},
                        {value: 'Notes', type: 'string'},
                     ];
        data.push(header);
        var id = 1;
        order.details.forEach(function(cart){
            var row = [];
            row.push({value: id, type: 'number'});
            id++;
            row.push({value: cart.mainSku, type: 'string'});
            row.push({value: cart.desc, type: 'string'});
            row.push({value: cart.quantity, type: 'number'});
            row.push({value: cart.accept, type: 'number'});
            row.push({value: "", type: 'string'});
            data.push(row);
        });
        const config = {
          filename: 'order-' + idParam,
          sheet: {
            data: data
          }
        };
        zipcelx(config);
    }

    render() {
        const { user } = this.props.auth;
        const { order } = this.props.order;
        var title = '';
        if (order){
            title = order.status.charAt(0).toUpperCase() + order.status.substr(1);
        }
        let error = null;
        let orderView = null;
        //console.log(order);
        if (order !== null && order !== undefined) {
            orderView = order.details.map(function (cart) {
                return (
                    <Table.Row key={cart.id}>
                        <Table.Cell>{cart.mainSku}</Table.Cell>
                        <Table.Cell>{cart.desc}</Table.Cell>
                        <Table.Cell>{cart.quantity}</Table.Cell>
                        <Table.Cell>{cart.accept}</Table.Cell>
                        <Table.Cell>{cart.capacity}</Table.Cell>
                    </Table.Row>
                )
            }, this);
        }

        let tableView = <h4>No Order Found</h4>
        if (order !== null) {
            tableView = (
                <Table celled columns={9}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>SKU</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Request</Table.HeaderCell>
                            <Table.HeaderCell>Accept</Table.HeaderCell>
                            <Table.HeaderCell>Box Capacity</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {orderView}
                    </Table.Body>
                    <Table.Footer>
                      <Table.Row>
                        <Table.HeaderCell colSpan='8' textAlign='right'>
                            <Button floated='right' icon labelPosition='left' color='green' size='small' onClick={() => this.saveAdPdf()}>
                              <Icon name='file pdf outline' /> Save As PDF
                            </Button>
                            <Button floated='right' icon labelPosition='left' color='brown' size='small' onClick={() => this.saveAsExcel()}>
                              <Icon name='file excel outline' /> Save As Excel
                            </Button>
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Footer>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' padded='very' >
                    <Header as="h2">{title} Order Details</Header>
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
        location: state.router.location,
    }
}

export default connect(mapStatesToProps)(ViewProcessedOrder);
