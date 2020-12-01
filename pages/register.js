import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import {Navbar, Nav, NavDropdown, Form, Modal} from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import react, {useEffect, useState} from 'react';
import Layout from '../components/layout';

import {signIn, signOut, useSession} from 'next-auth/client'

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';

import {ApolloClient, InMemoryCache, gql} from '@apollo/client';
import { initializeApollo } from '../lib/apolloClient'


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
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
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

    const [session, loading] = useSession();

    const { control, handleSubmit, watch, errors, formState } = useForm({
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
                }{
                    console.log("Error during registration")
                    setRegistrationFormState("ERROR")
                    setShowErrorWindow(true)

                }

            }
        ).catch( reason => {
            console.log("Error", reason)
            setRegistrationFormState("ERROR")})
    }

    console.log(session);

    return (
        <Layout>
            <Container>
                <h1>Register</h1>
                {session && <div>Already signe IN. Logout First</div>}
                {!session && registrationFormState === 'OK' && <div>Registration is OK</div> }
                {registrationFormState === 'ERROR' &&
                    <ErrorWindow toShow={showErrorWindow} onHide={()=>{setShowErrorWindow(false); console.log("Hide")}}/>
                }
                {!session &&
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Controller as={Form.Control}
                                        placeholder="Email"
                                        name="userEmail"
                                        control={control}
                                        defaultValue=""
                                        isValid={!errors.userEmail}
                                        isInvalid={errors.userEmail}
                                        cntx={formState}
                            />
                            <Form.Text className="text-muted">
                                Unique username to identify yourself
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                {errors.userName && <span>Please provide correct email</span>}
                            </Form.Control.Feedback>

                        </Form.Group>

                        <Form.Group controlId="registerPassword">
                            <Form.Label>Password</Form.Label>

                            <Controller as={Form.Control}
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        control={control}
                                        defaultValue=""
                                        isValid={formState.dirtyFields.password && !errors.password}
                                        isInvalid={errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password && <span>Please set password.</span>}
                            </Form.Control.Feedback>

                        </Form.Group>

                        <Form.Group controlId="registerRepeatPassword">
                            <Form.Label>Repeat Password</Form.Label>
                            <Controller as={Form.Control}
                                        placeholder="Password"
                                        name="repeatPassword"
                                        type="password"
                                        control={control}
                                        defaultValue=""
                                        isValid={formState.dirtyFields.repeatPassword && !errors.repeatPassword}
                                        isInvalid={errors.repeatPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.repeatPassword && <span>Should mathc the password</span>}
                            </Form.Control.Feedback>

                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                }
            </Container>

        </Layout>
    )
}
