import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import {Container, Row, Col, Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import react, {useState} from 'react';
import Layout from '../components/layout';

import {signIn, signOut, useSession} from 'next-auth/client'
import {Typeahead, withAsync} from 'react-bootstrap-typeahead';

import DatePicker from "react-datepicker";

import {useForm, Controller} from "react-hook-form"
import {yupResolver} from '@hookform/resolvers/yup'

import * as yup from 'yup'

import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

import {initializeApollo} from '../lib/apolloClient'
import * as _ from 'lodash'
import React from "react";

const schema = yup.object({
    securityId: yup.number().positive().required(),
    dateAdded: yup.date().required(),
    price: yup.number().required(),
    amount: yup.number().positive(),
    totalPaid: yup.number(),
    brokerFee: yup.number()
});


let AsyncTypeHead = withAsync(Typeahead)

// validation setup


const SecuritiesSearchTypeHead = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState(props.options);

    // if (props.options !== undefined) {
    //     setOptions(props.options)
    // }


    const handleSearch = (query) => {
        setIsLoading(true);

        const client = initializeApollo()

        client.query({
            query: gql`query securities($query:String){
                        securities (search: $query) {
                        value:id
                        company:title
                        ticker
                      }
        }`,
            variables: {
                query: query
            },
            context: {}
        }).then(
            (res) => {
                setOptions(res.data.securities)
                setIsLoading(false)
            }
        )
    }

    return (
        <AsyncTypeHead options={options}
                       id = 'securititesSearch'
                       onSearch={handleSearch}
                       isLoading={isLoading}
                       highlightOnlyResult={true}
                       labelKey={option => `${option.ticker} ${option.company}`}
                       placeholder="Type ticker or company name"
                       clearButton
                       defaultOpen={true}
                       isValid = {props.isValid}
                       isInvalid = {props.isInvalid}
                        onChange={(selected) => {
                            console.log('Selected', selected);
                           if (selected.length > 0) {
                               props.onChange( selected[0].value)
                           }
                           else{
                               props.onChange( undefined)
                           }
                        }}

        >
        </AsyncTypeHead>
    )
}

const RBTDatePicker = (props) => {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <DatePicker {...props} selected={startDate} onChange={date => {setStartDate(date)
        props.setValue('dateAdded',date, { shouldDirty: true, shouldValidate:true })
        }}
                    className="rbt-input rbt-input-main form-control"/>
    )
}


function PortfolioAdd({assets}) {

    const { control, handleSubmit, watch, errors, formState} = useForm(
        // {
        // mode: "onChange",
        // resolver: yupResolver(schema)
        //}
    );

    const [session, loading] = useSession();
    console.log(session);
    console.log(assets);

    if (loading) {
        return (
            <Layout>
                <Container>
                    <Row>&nbsp;</Row>
                    <h1>Loading....</h1>
                </Container>
            </Layout>
        )
    }



    const onSubmit = (data) => {
        console.log("Submitted", data)
    }


    return (
        <Layout isProtected={true} isSession={!!_.get(session, 'user.apiToken')}
                userEmail={!!session && session.user.email}>
            <Container>
                <Row>&nbsp;</Row>

                <h1>Portfolio</h1>
                <h2>Add Item</h2>
                <Form onSubmit={handleSubmit(onSubmit)}>
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
                        <Controller as={SecuritiesSearchTypeHead}
                                    id='asset-id'
                                    name='securityId'
                                    control={control}
                                    options={assets}
                                    defaultValue={0}
                                    isValid={formState.dirtyFields.securityId && !errors.securityId}
                                    isInvalid={errors.securityId}
                                    render = { ({onChange, value}) =>
                                        <SecuritiesSearchTypeHead onChange={onChange} />
                                    }
                        >

                        </Controller>

                    </Form.Group>

                    {/*<Form.Group controlId="dateAdded">*/}
                    {/*    <Form.Label>Date of deal</Form.Label>*/}
                    {/*    <Form.Row>*/}
                    {/*        <Col>*/}
                    {/*            <Controller name='dateAdded'*/}
                    {/*                        control={control}*/}
                    {/*                        as={RBTDatePicker}*/}
                    {/*                        isValid={formState.dirtyFields.dateAdded && !errors.dateAdded}*/}
                    {/*                        isInvalid={errors.dateAdded}*/}
                    {/*            />*/}
                    {/*        </Col>*/}
                    {/*    </Form.Row>*/}
                    {/*</Form.Group>*/}

                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Row>
                            <Col>
                                <Form.Control placeholder="Average price of acquired securities"/>
                            </Col>
                            <Form.Label column>USD</Form.Label>
                        </Form.Row>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Amount</Form.Label>

                        <Form.Row>

                            <Col>
                                <Form.Control placeholder='Number of securities'></Form.Control>
                            </Col>
                            <Form.Label column>psc.</Form.Label>

                        </Form.Row>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Total deal Amount</Form.Label>
                        <Form.Row>
                            <Col>
                                <Form.Control placeholder="Total paid for securities"/>
                            </Col>
                            <Form.Label column>USD</Form.Label>
                        </Form.Row>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Broker Fee</Form.Label>
                        <Form.Row>
                            <Col>
                                <Form.Control placeholder="fee"/>
                            </Col>
                            <Form.Label column>USD</Form.Label>
                        </Form.Row>
                    </Form.Group>

                    <Button variant="primary" type="submit">Add to Portfolio</Button>

                </Form>

            </Container>

        </Layout>
    )
}
//
// export const getServerSideProps = async (ctx) => {
//
//     // const client = initializeApollo()
//     //
//     // let res;
//     //
//     // console.log("Fetching...")
//     //
//     // res = await client.query({
//     //     query: gql`query {
//     //                 securities (limit: 10){
//     //                     company: title
//     //                     ticker
//     //                   }
//     //             }`
//     // });
//     //
//     //
//     // return {
//     //     props:
//     //         {
//     //             assets: res.data.securities,
//     //             initialApolloState: client.cache.extract()
//     //         }
//     //     //, revalidate: 1
//     // }
//
// }

export default PortfolioAdd
