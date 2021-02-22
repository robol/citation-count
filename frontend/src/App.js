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
        <Nav className="justify-content-center navbar">
          <Nav.Item>
            <Nav.Link>Classificazione Lavori VQR 2015 &mdash; 2019 (GEV 1)</Nav.Link>
          </Nav.Item>
        </Nav>

        <Container>
          <Row>
            <Col>
            L'applicazione calcola la classificazione dei lavori in base a collocazione editoriale 
            e numero di citazioni ricevute in base all'algoritmo descritto dal GEV1. Vengono fornite 
            5 possibili classi, identificate dalle lettere <strong>A</strong>, ..., <strong>E</strong>, 
            con la seguente corrispondenza:
            <ul>
              <li>Classe <strong>A</strong>: Top 10%.</li>
              <li>Classe <strong>B</strong>: 10% - 35%.</li>
              <li>Classe <strong>C</strong>: 35% - 50%.</li>
              <li>Classe <strong>D</strong>: 60% - 80%.</li>
              <li>Classe <strong>E</strong>: Bottom 20%.</li>
            </ul>
            </Col>
          </Row>
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
