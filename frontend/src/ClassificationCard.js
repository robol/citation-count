import React from 'react';
import { Card } from 'react-bootstrap';

class ClassificationCard extends React.Component {

  render() {
    // Compute the right background for the header, that describes 
    // the class
    var bg_header = "bg-secondary";
    switch (this.props.classification) {
      case "A":
        bg_header = "bg-success";
        break;
      case "B":
        bg_header = "bg-warning";
        break;
      default:
        bg_header = "bg-info";
        break;
    }

    return (
      <Card className="shadow rounded">                
        <Card.Header className={bg_header}>
          <strong>{this.props.name}</strong>
        </Card.Header>
        <Card.Body>
          <Card.Title>Classe {this.props.classification}</Card.Title>
        </Card.Body>
      </Card>
    );
  }

}

export default ClassificationCard;