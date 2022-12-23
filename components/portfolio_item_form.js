// import styles from '../styles/Home.module.css'
import {Col, Container, Form, Row, Alert} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import React, {useEffect, useState} from 'react';

import {useSession} from 'next-auth/react'
import {Typeahead, withAsync} from 'react-bootstrap-typeahead';

import DatePicker from "react-datepicker";

import {useForm} from "react-hook-form"
import {yupResolver} from '@hookform/resolvers/yup'

import * as yup from 'yup'

import {gql} from '@apollo/client';

import {initializeApollo} from '../lib/apolloClient'
import * as _ from 'lodash'


const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

const schema = yup.object({
    // securityType: yup.string().min(1).ensure().required(),
    securityId: yup.number().positive().required(),
    dateAdded: yup.date().required().max(tomorrow, "Date could not be in future"),
    price: yup.number().required().positive(),
    amount: yup.number().max(Math.pow(2,50),"Number is too big"),
    totalPaid: yup.number(),
    brokerFee: yup.number()
});


let AsyncTypeHead = withAsync(Typeahead)

// validation setup


const SecuritiesSearchTypeHead = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState(props.options);

    const {register, unregister, setValue, setCurrency, name} = props

    useEffect(() => {
        register({name});
        return () => unregister(name);
    }, [name, register, unregister]);


    const handleSearch = (query) => {
        setIsLoading(true);

        const client = initializeApollo()

        client.query({
            query: gql`query securities($query:String){
                        securities (search: $query) {
                        value:id
                        company:title
                        ticker
                        currency
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
                       id='securityIdCntrl'
                       onSearch={handleSearch}
                       isLoading={isLoading}
                       highlightOnlyResult={true}
                       labelKey={option => `${option.ticker} ${option.company}`}
                       placeholder="Type ticker or company name"
                       clearButton
                       defaultOpen={true}
                       isValid={props.isValid}
                       isInvalid={props.isInvalid}
                       onChange={(selected) => {
                           console.log('Selected', selected);
                           if (selected.length > 0) {
                               setValue(name, selected[0].value, {shouldValidate: true, shouldDirty: true})
                               setCurrency(selected[0].currency)
                           } else {
                               setValue(name, undefined, {shouldValidate: true, shouldDirty: true})
                           }
                       }}

        >
        </AsyncTypeHead>
    )
}

const RBTDatePicker = (props) => {
    const [startDate, setStartDate] = useState(new Date());

    const {isValid, isInvalid} = props
    const {register, unregister, setValue, name} = props

    useEffect(() => {
        register({name});
        return () => unregister(name);
    }, [name, register, unregister]);

    setValue('dateAdded', startDate, {shouldValidate: true})

    return (
        <DatePicker isValid={isValid} isInvalid={isInvalid} selected={startDate} onChange={date => {
            setStartDate(date)
            setValue('dateAdded', date, {shouldDirty: true, shouldValidate: true})
        }}
                    className={`form-control ${isValid ? "is-valid" : ""} ${isInvalid ? "is-invalid" : ""}`}/>
    )
}

function AlertFormError({show, setShow}) {
//    const [show, setShow] = useState(show);

    if (show) {
        return (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            </Alert>
        )
    }

    return null
}


export default function PortfolioItemForm({assets, setFormState}) {

    const {control, handleSubmit, watch,  formState:{errors}, formState, register, unregister, setValue, getValues} = useForm(
        {
            mode: "onChange",
            resolver: yupResolver(schema),
            shouldFocusError: false
        }
    );

    const {data:session, status} = useSession();
    const loading = status === "loading"
    const [formLoading, setFormLoading] = useState(false)
    const [currency, setCurrency] = useState()

    const [errorAlertShow, setErrorAlertShow] = useState(false)


    console.log(session);
    console.log(assets);

    if (loading) {
        return (
                <Container>
                    <Row>&nbsp;</Row>
                    <h1>Loading....</h1>
                </Container>
        )
    }


    const onSubmit = (data) => {

        data.apiToken = session.user.apiToken
        console.log("Submitted", data)

        setFormLoading(true);

        const client = initializeApollo()

        client.mutate({
            mutation: gql`
                  mutation addDeal{
                      addDeal(input:{
                        deal_timestamp:"${data.dateAdded.toISOString()}"
                        # type:${data.securityType},
                        security_id:${data.securityId}
                        amount:${data.amount}
                        price:${data.price}
                        totalPaid:${data.totalPaid}
                        currency:"${data.currency}"
                        fee:${data.brokerFee}
                        fee_currency:"${data.currency}"
                        payload: ${data.payload}
                      })
                      {
                           error
                      }
                    }
        `,
            variables: {},
            context: {
                token: 'Bearer ' + session.user.apiToken
            }
        }).then(
            (res) => {
                //setOptions(res.data.securities)
                console.log(res)
                setFormLoading(false)
                if (_.get(res, "data.addDeal.error") === '') {
                    console.log('Deal added OK')
                    setFormState('ADDED_OK')
                }
            }
            )
            .catch( (e) => {
                console.log("FORM_ERROR")
                console.log(e)
                setErrorAlertShow(true)
//                setFormState('ERROR_FORM_ADD_ITEM')
            } )

    }


    return (<Container>
                {/* <AlertFormError show={errorAlertShow} setShow={setErrorAlertShow}/> */}

                <Form onSubmit={handleSubmit(onSubmit)}>
                    {/*<Form.Group controlId="formAssetType">*/}
                    {/*    <Form.Label>Type of Instrument</Form.Label>*/}
                    {/*    <Form.Control as='select' defaultValue='' name='securityType'*/}
                    {/*                  isInvalid={!!errors.securityType}*/}
                    {/*                  ref={register}*/}
                    {/*                  onChange={(e) => setValue('securityType', e.target.value,*/}
                    {/*                      {shouldValidate: true, shouldDirty: true})}*/}
                    {/*    >*/}
                    {/*        <option key='blankChoice' hidden value=''>Choose</option>*/}
                    {/*        <option value='stock'>Stocks</option>*/}
                    {/*        /!*<option>Bonds</option>*!/*/}
                    {/*    </Form.Control>*/}

                    {/*</Form.Group>*/}

                    <Form.Group controlId="formAssetId">
                        <Form.Label>Instrument</Form.Label>

                        {/* <SecuritiesSearchTypeHead
                            id='asset-id'
                            name='securityId'
                            options={assets}
                            defaultValue={0}
                            //isValid={formState.dirtyFields.securityId && !errors.securityId}
                            isInvalid={!!errors.securityId}
                            setValue={setValue}
                            register={register}
                            unregister={unregister}
                            setCurrency={setCurrency}
                        >

                        </SecuritiesSearchTypeHead> */}

                    </Form.Group>

                    <Form.Group controlId="dateAdded">
                        <Form.Label>Date of deal</Form.Label>
                        <Form.Row>
                            <Col xs="auto">
                                {/* <RBTDatePicker name='dateAdded'
                                               {...{register, unregister, setValue}}
                                    //isValid={formState.dirtyFields.dateAdded && !errors.dateAdded}
                                               isInvalid={!!errors.dateAdded}
                                /> */}
                            </Col>
                            <Col xs="auto">
                                <Form.Text>{!!errors.dateAdded && <span>Date should not be in future</span>}</Form.Text>
                            </Col>

                        </Form.Row>

                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Row>
                            <Col>
                                <Form.Control name="price"
                                              placeholder="Average price of acquired securities"
                                              ref={register}
                                    //isValid={formState.dirtyFields.price && !errors.price}
                                              isInvalid={!!errors.price}
                                              onChange={
                                                  (e) => {
                                                      setValue('totalPaid', getValues('amount') * e.target.value, {shouldValidate: true})
                                                  }
                                              }
                                              autoComplete="off"

                                />
                            </Col>

                            <Form.Label column>{currency}</Form.Label>
                        </Form.Row>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Amount</Form.Label>

                        <Form.Row>

                            <Col>
                                <Form.Control placeholder='Number of securities'
                                              name="amount"
                                              ref={register}
                                    //isValid={formState.dirtyFields.amount && !errors.amount}
                                              isInvalid={!!errors.amount}
                                              onChange={
                                                  (e) => {
                                                      setValue('totalPaid', getValues('price') * e.target.value, {shouldValidate: true})
                                                  }
                                              }
                                              autoComplete="off"

                                />
                            </Col>
                            <Form.Label column>psc.</Form.Label>

                        </Form.Row>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Total deal Amount</Form.Label>
                        <Form.Row>
                            <Col>
                                <Form.Control placeholder="Total paid for securities"
                                              name="totalPaid"
                                              ref={register}
                                    //isValid={formState.dirtyFields.totalPaid && !errors.totalPaid}
                                              isInvalid={!!errors.totalPaid}
                                              autoComplete="off"
                                />
                            </Col>
                            <Form.Label column>{currency}</Form.Label>
                        </Form.Row>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Broker Fee</Form.Label>
                        <Form.Row>
                            <Col>
                                <Form.Control placeholder="fee"
                                              name="brokerFee"
                                              defaultValue={0}
                                              ref={register}
                                    //isValid={formState.dirtyFields.brokerFee && !errors.brokerFee}
                                              isInvalid={!!errors.brokerFee}
                                />
                            </Col>
                            <Form.Label column>{currency}</Form.Label>
                        </Form.Row>
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={formState.isSubmitting}>Add to Portfolio</Button>
                    {formLoading && <p>Loading</p>}

                </Form>

            </Container>

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


