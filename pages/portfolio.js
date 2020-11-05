import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import {Container, Row, Col, Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import react, {useState} from 'react';
import Layout from '../components/layout';

import {signIn, signOut, useSession} from 'next-auth/client'
import {Typeahead, withAsync} from 'react-bootstrap-typeahead';
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

import { initializeApollo } from '../lib/apolloClient'

let AsyncTypeHead = withAsync(Typeahead)

const SecuritiesSearchTypeHead= (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState(props.options);

    // if (props.options !== undefined) {
    //     setOptions(props.options)
    // }


    const handleSearch =(query) => {
        setIsLoading(true);

        const client = initializeApollo()

        client.query({
            query: gql`query securities($query:String){
                        securities (where: {_or:[{ticker_contains: $query},{title_contains:$query}]}) {
                        company:title
                        ticker
                      }
        }`,
            variables: {
                query:query
            }
        }).then(
            (res) => {
                setOptions(res.data.securities)
                setIsLoading(false)
            }
        )
        }

        return (
            <AsyncTypeHead {...props} options={options} onSearch={handleSearch} isLoading={isLoading}>
            </AsyncTypeHead>
        )

}
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

                        <SecuritiesSearchTypeHead
                            id='asset-id'
                            highlightOnlyResult={true}
                            onChange={(selected) => {
                                // Handle selections...
                            }}
                            options={assets}
                            labelKey={option => `${option.ticker} ${option.company}`}
                            placeholder="Type ticker or company name"
                            clearButton
                            defaultOpen={true}

                        >
                        </SecuritiesSearchTypeHead>

                    </Form.Group>

                </Form>

            </Container>

        </Layout>
    )
}

export const  getStaticProps = async (ctx) => {

    const client = initializeApollo()

    let res;

    console.log("Fetching...")

    res = await client.query({
        query: gql`query {
                    securities (limit: 10){
                        company: title
                        ticker
                      }
                }`
        });


    return {
        props:
            {
                assets: res.data.securities,
                initialApolloState: client.cache.extract()
            }
            //, revalidate: 1
    }

}

export default PortfolioAdd
