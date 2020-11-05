import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import {Navbar, Nav, NavDropdown, Form} from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import react, {useState} from 'react';
import Layout from '../components/layout';

import {signIn, signOut, useSession} from 'next-auth/client'

import { Formik } from 'formik';
import * as yup from 'yup';

const schema = yup.object({
    userName: yup.string().required(),
    password: yup.string().required(),
    repeatPassword: yup.string().required(),

});


export default function Register() {


    const [session, loading] = useSession();
    console.log(session);

    return (
        <Layout>
            <Container>
                <h1>Register</h1>
                <Formik
                    validationSchema={schema}
                    onSubmit={console.log}
                    initialValues={{}}
                >
                    {({
                          handleSubmit,
                          handleChange,
                          handleBlur,
                          values,
                          touched,
                          isValid,
                          errors,
                      }) => (
                        <Form onSubmit={handleSubmit} noValidate>
                            <Form.Group >
                                <Form.Label>User name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter user name"
                                    name="userName"
                                    value={values.userName}
                                    onChange={handleChange}
                                    isInvalid={!!errors.userName}
                                    isValid={!errors.userName}

                                />
                                <Form.Text className="text-muted">
                                    Unique username to identify yourself
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    {errors.userName}
                                </Form.Control.Feedback>

                            </Form.Group>

                            <Form.Group controlId="registerPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    isValid={touched.password && !errors.password}

                                />

                            </Form.Group>

                            <Form.Group controlId="registerRepeatPassword">
                                <Form.Label>Repeat Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Repeat password"
                                    name="repeatPassword"
                                    value={values.repeatPassword}
                                    onChange={handleChange}
                                    isValid={touched.repeatPassword && !errors.repeatPassword}
                                />

                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                        )}

                </Formik>


            </Container>

        </Layout>
    )
}
