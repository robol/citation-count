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
      const error_list = errors.map((v) => {
        return (
          <li>{v}</li>
        );
      });

      return (
        <Alert variant="danger" className="mt-4">
          <p>Sono stati incontrati degli errori:
          <ul>
            {error_list}
          </ul></p>
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
          <strong>Citazioni</strong>: {input["citations"]} <br /><br />

          <Row>
            <Col>
              <ClassificationCard name="MCQ" classification={ response["mcq"] }></ClassificationCard>
            </Col>
            <Col>
              <ClassificationCard name="SJR" classification={ response["sjr"] }></ClassificationCard>
            </Col>
            <Col>
              <ClassificationCard name="SNIP" classification={ response["snip"] }></ClassificationCard>
            </Col>
          </Row>
        </Alert>
      );
    }

    
  }
}

export default ClassificationData;