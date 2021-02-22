import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Typeahead, AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const api_base = '/api/v1/'

class VQRForm extends React.Component {
  constructor(props) {
    super(props);
    this.computeClassification = this.computeClassification.bind(this);

    this.scopus_citations_ref = React.createRef();
    this.wos_citations_ref = React.createRef();
    this.journal_ref = React.createRef();
    this.year_ref = React.createRef();
    this.sector_ref = React.createRef();

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

    var errors = [];
    const valid_years = [ "2015", "2016", "2017", "2018", "2019" ];
    const valid_sectors = [ "MAT01", "MAT02", "MAT03", "MAT05", "MAT06", "MAT07", "MAT08" ];

    const year = this.year_ref.current.state.text;
    const sector = this.sector_ref.current.state.text;
    const journal = this.journal_ref.current.state.text;
    const scopus_citations = parseInt(this.scopus_citations_ref.current.value);
    const wos_citations = parseInt(this.wos_citations_ref.current.value);

    if (! valid_years.includes(year)) {
      errors.push("Selezionare un anno valido.");
    }

    if (! valid_sectors.includes(sector)) {
      errors.push("Inserire un settore valido.")
    }

    if (! this.journal_list.includes(journal)) {
      errors.push("Selezionare una valida rivista, inclusa nelle liste del GEV.");
    }

    if (isNaN(scopus_citations) || scopus_citations < 0) {
      errors.push("Inserire un valido numero di citazioni su SCOPUS.");
    }

    if (isNaN(wos_citations) || wos_citations < 0) {
      errors.push("Inserire un valido numero di citazioni su WOS.");
    }

    if (errors.length > 0) {
      this.props.onClassification({
        "errors": errors
      });
      return;
    }
    
    const data = {
      "journal": journal,
      "scopus-citations": scopus_citations,
      "wos-citations": wos_citations,
      "year": parseInt(year),
      "sector": sector
    };

    const res = await fetch(api_base + 'classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (res.status === 200) {
      const response = await res.json();
      this.props.onClassification({
        "input": data,
        "response": response
      });
    }
    else {
      this.props.onClassification({
        "errors": [
          "Impossibile interrogare il servizio; controllare gli input, o riprovare più tardi"
        ]
      });
    }
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
            ref={this.year_ref}
            id="year" 
            options={[ '2015', '2016', '2017', '2018', '2019' ]}
          >
          </Typeahead>
          <Form.Text className="text-muted">
            Inserire un anno compreso fra 2015 e 2019.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formScopusCitations">
          <Form.Label>Numero di citazioni su Scopus</Form.Label>
          <Form.Control ref={this.scopus_citations_ref} type="text" label="Numero di citazioni su SCOPUS" />
          <Form.Text className="text-muted">
            Inserire un intero non negativo.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formCitations">
          <Form.Label>Numero di citazioni su WOS</Form.Label>
          <Form.Control ref={this.wos_citations_ref} type="text" label="Numero di citazioni su WOS" />
          <Form.Text className="text-muted">
            Inserire un intero non negativo.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formSector">
          <Form.Label>Settore</Form.Label>
          <Typeahead 
            ref={this.sector_ref}
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