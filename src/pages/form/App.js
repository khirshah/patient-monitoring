// ---------------------------------- IMPORT ------------------------------------------
// --------------------------- React and Bootstrap --------------------------------
import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

// --------------------------  styles ---------------------------------------------
import styles from './styles/app.css';

// --------------------------  components -----------------------------------------


// --------------------------------- COMPONENT ----------------------------------------

class App extends Component {
  render() {
    return (
      <Container className={styles.app}>
        <Row className="justify-content-center"><h1> Patient monitoring </h1></Row>
        <Row>
        </Row>
      </Container>
    );
  }
}

export default App;
