import './App.scss';

import React from 'react';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import VQRForm from './VQRForm.js';
import ClassificationData from './ClassificationData.js';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.onClassification = this.onClassification.bind(this);

    this.state = {
      "currentClassification": undefined
    };
  }

  onClassification(cl) {
    this.setState({
      "currentClassification": cl
    });
  }

  render() {
    return (
      <div className="App">
        <Nav className="justify-content-center" >
          <Nav.Item>
            <Nav.Link>Classificazione Lavori VQR 2015 &mdash; 2019 (GEV 1)</Nav.Link>
          </Nav.Item>
        </Nav>

        <Container>
          <Row>
            <Col>
              <VQRForm onClassification={this.onClassification}></VQRForm>
            </Col>
          </Row>
          <Row>
            <Col>
              <ClassificationData classification={this.state.currentClassification}></ClassificationData>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
