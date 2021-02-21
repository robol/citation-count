import React from 'react';
import { Alert, Row, Col } from 'react-bootstrap';
import ClassificationCard from './ClassificationCard.js';

class ClassificationData extends React.Component {

  render() {
    if (this.props.classification === undefined) {
      return (
        <Alert variant="warning" className="mt-4">Nessuna classificazione calcolata.</Alert>
      );
    }
    else if (this.props.classification["errors"] !== undefined) {
      const errors = this.props.classification["errors"];
      const error_list = errors.map((v, idx) => {
        return (
          <li key={idx}>{v}</li>
        );
      });

      return (
        <Alert variant="danger" className="mt-4">
          <p>Sono stati incontrati degli errori:</p>
          <ul>
            {error_list}
          </ul>
        </Alert>
      );
    }
    else {
      const input = this.props.classification["input"];
      const response = this.props.classification["response"];

      return (
        <Alert variant="info" className="mt-4">
          <strong>Rivista</strong>: <span style={{ "textTransform": "capitalize" }}>{input["journal"]}</span><br />
          <strong>Anno</strong>: {input["year"]} <br />
          <strong>Settore</strong>: {input["sector"]} <br />
          <strong>Citazioni su SCOPUS</strong>: {input["scopus-citations"]} <br />
          <strong>Citazioni su WOS</strong>: {input["wos-citations"]} <br /><br />

          <Row>
            <Col>
              <ClassificationCard name="MCQ-SCOPUS" classification={ response["mcq"] }></ClassificationCard>
            </Col>
            <Col>
              <ClassificationCard name="SJR-SCOPUS" classification={ response["sjr"] }></ClassificationCard>
            </Col>
            <Col>
              <ClassificationCard name="SNIP" classification={ response["snip"] }></ClassificationCard>
            </Col>
            <Col>
              <ClassificationCard name="MCQ-WOS" classification={ response["mcq-wos"] }></ClassificationCard>
            </Col>
          </Row>
        </Alert>
      );
    }

    
  }
}

export default ClassificationData;