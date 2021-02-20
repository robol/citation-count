import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Typeahead, AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const api_base = '/api/v1/'

class VQRForm extends React.Component {
  constructor(props) {
    super(props);
    this.computeClassification = this.computeClassification.bind(this);

    this.citations_ref = React.createRef();
    this.journal_ref = React.createRef();

    this.state = {
      "sector": [],
      "year": [],
      "journal": [],
      isLoading: false,
      options: []
    }

    this.journal_list = undefined;
    this.getJournals();
  }

  async getJournals() {
    if (this.journal_list === undefined) {
      const res = await fetch(api_base + 'journals', {
        method: 'GET'
      });
      this.journal_list = await res.json();
    }

    return this.journal_list;
  }

  async computeClassification() {

    // Check data; FIXME: We should handle errors here
    if (this.state["year"].length !== 1) {
      return;
    }

    if (this.state["sector"].length !== 1) {
      return;
    }

    if (this.state["journal"].length !== 1) {
      return;
    }
    
    const data = {
      "journal": this.state["journal"][0],
      "citations": parseInt(this.citations_ref.current.value),
      "year": parseInt(this.state["year"][0]),
      "sector": this.state["sector"][0]
    };

    const res = await fetch(api_base + 'classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const response = await res.json();

    this.props.onClassification({
      "input": data,
      "response": response
    });
  }

  render() {
    return (
      <Form>
        <Form.Group controlId="formJournal">
          <Form.Label>Rivista</Form.Label>
          <AsyncTypeahead 
            isLoading={this.state.isLoading}
            onChange={(selected) => this.setState({'journal': selected})}
            id="journal"
            onSearch={(query) => {
              this.getJournals().then((r) => {
                this.setState({
                  isLoading: false,
                  options: r
                });
              })
            }}
            options={this.state.options}
            ref={this.journal_ref}
          >
          </AsyncTypeahead>
          <Form.Text className="text-muted">
            Digitare le prime lettere per completare automaticamente il nome.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formYear">
          <Form.Label>Anno</Form.Label>
          <Typeahead 
            onChange={(selected) => this.setState({'year': selected})}
            id="year" 
            options={[ '2015', '2016', '2017', '2018', '2019' ]}
          >
          </Typeahead>
          <Form.Text className="text-muted">
            Inserire un anno compreso fra 2015 e 2019.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formCitations">
          <Form.Label>Numero di citazioni</Form.Label>
          <Form.Control ref={this.citations_ref} type="text" label="Numero di citazioni" />
          <Form.Text className="text-muted">
            Inserire un intero positivo.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formSector">
          <Form.Label>Settore</Form.Label>
          <Typeahead 
            onChange={(selected) => this.setState({'sector': selected})}
            id="sector" 
            options={[ 'MAT01', 'MAT02', 'MAT03', 'MAT05', 'MAT06', 'MAT07', 'MAT08' ]}
          >
          </Typeahead>
          <Form.Text className="text-muted">
            Inserire il settore (MAT01, ..., MAT08)
          </Form.Text>
        </Form.Group>

        <Button variant="primary" onClick={this.computeClassification}>
          Calcola classificazione
        </Button>
      </Form>
    );
  }
}

export default VQRForm;