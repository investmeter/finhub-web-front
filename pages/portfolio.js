import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import {Container, Row, Col, Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import react, {useState} from 'react';
import Layout from '../components/layout';

import {signIn, signOut, useSession} from 'next-auth/client'
import { Typeahead } from 'react-bootstrap-typeahead';



function PortfolioAdd({assets}) {
    const [session, loading] = useSession();
    console.log(session);
    console.log(assets);

    return (
        <Layout>
            <Container>
                <h1>Portfolio</h1>
                <h2>Add Item</h2>
                <Form>
                    <Form.Group controlId="formAssetType">
                        <Form.Label>Type of Instrument</Form.Label>
                        <Form.Control as='select'>
                            <option key='blankChoice' hidden value>Choose</option>
                            <option>Stocks</option>
                            <option>Bonds</option>
                        </Form.Control>


                    </Form.Group>

                    <Form.Group controlId="formAssetId">
                        <Form.Label>Instrument</Form.Label>

                        <Typeahead
                            id='asset-id'
                            highlightOnlyResult = {true}
                            onChange={(selected) => {
                                // Handle selections...
                            }}
                            options={assets}
                            labelKey= { option => `${option.ticker} ${option.company}`}
                            placeholder="Type ticker or company name"
                            clearButton>
                        </Typeahead>

                    </Form.Group>

                </Form>

            </Container>

        </Layout>
    )
}

PortfolioAdd.getInitialProps = async (ctx) => {
    const assets = [
        {
            ticker:"AAPL",
            company:"Apple",
        },
        {
            ticker:"GOOGL",
            company: "Alphabet (Google)"
        }
        ]
    return {assets}
}



export default PortfolioAdd
