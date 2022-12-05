import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import {Navbar, Nav, NavDropdown, Form, Modal} from "react-bootstrap";
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import react, {useEffect, useState} from 'react';
import Layout from '../components/layout';

import {signIn, signOut, useSession} from 'next-auth/react'

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';

import {ApolloClient, InMemoryCache, gql} from '@apollo/client';
import { initializeApollo } from '../lib/apolloClient'
import React from "react";


const schema = yup.object({
    userEmail: yup.string().required().email(),
    password: yup.string().required().min(6),
    repeatPassword: yup.string().oneOf([yup.ref('password')], "Passwords must match"),

});


const onSubmit = data => console.log(data);

function ErrorWindow({toShow, onHide}) {
    console.log("toShow", toShow)
    const [show, setShow] = useState(toShow);

    useEffect(() => {
        setShow(toShow);
    }, [toShow]);

    const handleClose = () => {
        console.log("TRY TO HIDE")
        setShow(false);
        onHide();
        }

    const handleShow = () => setShow(true);

    return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>Ooops something goes wrong. Please try again</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
            </>
    );
}


export default function Register() {

    const [registrationFormState,setRegistrationFormState ]=useState();
    const [showErrorWindow, setShowErrorWindow] = useState(true);

    const {data:session} = useSession();

    const { control, handleSubmit, formState:{errors}, formState } = useForm({
        mode:"onChange",
        resolver: yupResolver(schema)
    });

    // const [registerUser] =

    const onSubmit = (data) => {
        console.log("Submitted", data)

        const client = initializeApollo()

        client.mutate({
            mutation: gql`mutation RegisterUser($userEmail:String,$passHash:String ){
                        registerUser(email:$userEmail, passHash:$passHash) {
                      user{
                        user_uuid
                        email
                        }
                    result
                   }
                   }
                    `,
            variables: {
                    userEmail:data.userEmail,
                    passHash: data.password
            }
        }).then(
            (res) => {
                console.log("Register Result", res)
                if (res.data.registerUser.result === "OK") {
                    console.log("Registration is OK")
                    setRegistrationFormState("OK")
                    setShowErrorWindow(false)
                    signIn('credentials', { username:  data.userEmail ,
                        password: data.password,
                        callbackUrl: '/portfolio'  })
                }
                else{
                    console.log("Error during registration")
                    setRegistrationFormState("ERROR")
                    setShowErrorWindow(true)

                }

            }
        ).catch( reason => {
            console.log("Error", reason)
            setRegistrationFormState("ERROR")})
    }

    return (
        <Layout>
            <Container>
                <Row>&nbsp;</Row>
                <h1>Register</h1>
                {session && <div>Already signed-in. Log-out First</div>}
                {!session && registrationFormState === 'OK' && <div>Registration is Ok. Redirecting....</div> }
                {registrationFormState === 'ERROR' &&
                    <ErrorWindow toShow={showErrorWindow} onHide={()=>{setShowErrorWindow(false); console.log("Hide")}}/>
                }
                {!session && registrationFormState!=='OK' &&
                    <Form onSubmit={handleSubmit(onSubmit)} >
                        <Form.Group className="mb-3" controlId="userEmail">
                            <Form.Label>Email</Form.Label>
                            <Controller
                                control={control}
                                name="userEmail" 
                                render={({field}) => <Form.Control 
                                {...field}
                                placeholder="Email"
                                defaultValue=""
                                isValid={(formState.dirtyFields.userEmail && !!errors &&  !errors.email) }
                                isInvalid={!!errors && errors.userEmail}
                                />}
                             />
                            
                            <Form.Text >
                                Unique username to identify yourself
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                { !!errors && errors.userEmail && <span>Please provide correct email</span>}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="registerPassword" className="mb-3" >
                            <Form.Label>Password</Form.Label>

                            <Controller 
                                        name="password"
                                        control={control}
                                        render = { 
                                            ({field})=> (
                                                <Form.Control 
                                                {...field}
                                                type="password"
                                                placeholder="Password"
                                                isValid={formState.dirtyFields.password && !!errors &&  !errors.password}
                                                isInvalid={!!errors && errors.password}
                                                />
                                            )
                                        }
                            />
                            <Form.Control.Feedback type="invalid">
                                {!!errors && errors.password && <span>Please set password.</span>}
                            </Form.Control.Feedback>

                        </Form.Group>

                        <Form.Group controlId="registerRepeatPassword" className="mb-3" >
                            <Form.Label>Repeat Password</Form.Label>
                            <Controller
                                        name="repeatPassword"
                                        control={control}
                                        render = { ({field}) => (
                                            <Form.Control    
                                                {...field}
                                                placeholder="Password"
                                                type="password"
                                                defaultValue=""
                                                isValid={formState.dirtyFields.repeatPassword && !!errors && !errors.repeatPassword}
                                                isInvalid={!!errors && errors.repeatPassword}
                                            />
                                            )
                                        }
                            />
                            <Form.Control.Feedback type="invalid">
                                {!!errors && errors.repeatPassword && <span>Should match the password</span>}
                            </Form.Control.Feedback>

                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form.Group>                
                    </Form>
                }
            </Container>

        </Layout>
    )
}
