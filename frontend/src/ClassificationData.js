import React from 'react';
import { Alert } from 'react-bootstrap';

class ClassificationData extends React.Component {

  render() {
    if (this.props.classification === undefined) {
      return (
        <Alert variant="warning" className="mt-4">Nessuna classificazione calcolata.</Alert>
      );
    }
    else {
      const input = this.props.classification["input"];
      const response = this.props.classification["response"];

      return (
        <Alert variant="info" className="mt-4">
          Rivista: {input["journal"]} <br />
          Anno: {input["year"]} <br />
          Settore: {input["sector"]} <br />
          Citazioni: {input["citations"]} <br /><br />
          Classe MCQ: {response["mcq"]}<br />
          Classe SJR: {response["sjr"]}<br />
          Classe SNIP: {response["snip"]}<br />
        </Alert>
      );
    }

    
  }
}

export default ClassificationData;