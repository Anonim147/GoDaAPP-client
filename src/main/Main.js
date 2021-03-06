import React, { Component } from 'react';
import './Main.css';
import Upload from '../import/upload/Upload';
import Select from '../select/select/Select';
import Update from '../update/update/Update';
import Manage from '../manage/manage/Manage';

import  { Tab, Row, Col, Nav } from 'react-bootstrap';



class Main extends Component {
    render(){ 
        return(
        <div className="wrapper">
            <div className="header">
                <h1>GoDAPP</h1>
            </div>
            <Tab.Container id="left-tabs-example" defaultActiveKey="manage">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="import">Upload Data</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="select">Select Data</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="update">Update Data</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="manage">Manage Tables</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="import">
                    <Upload />
                  </Tab.Pane>
                  <Tab.Pane eventKey="select">
                    <Select />
                  </Tab.Pane>
                  <Tab.Pane eventKey="update">
                    <Update />
                  </Tab.Pane>
                  <Tab.Pane eventKey="manage">
                    <Manage />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
        )
    }
}

export default Main;