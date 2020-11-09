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

import { useForm, Controller } from "react-hook-form";
import * as yup from 'yup';

const schema = yup.object({
    userName: yup.string().required().min(1),
    password: yup.string().required(),
    repeatPassword: yup.string().required(),

});

const onSubmit = data => console.log(data);

export default function Register() {


    const [session, loading] = useSession();

    const { control, handleSubmit, watch, errors, formState } = useForm({
        mode:"onChange"
    });


    console.log(session);

    return (
        <Layout>
            <Container>
                <h1>Register</h1>

                        <Form onSubmit={handleSubmit(onSubmit)} >
                            <Form.Group >
                                <Form.Label>User name</Form.Label>
                                <Controller as={Form.Control}
                                            placeholder="Enter user name"
                                            name="userName"
                                            control={control}
                                            rules={ {required: true} }
                                            defaultValue=""
                                            isValid = {formState.dirtyFields.userName && !errors.userName}
                                            isInvalid = {errors.userName}
                                            cntx={formState}
                                />
                                <Form.Text className="text-muted">
                                    Unique username to identify yourself
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    {errors.userName && <span>Errors!!</span>}
                                </Form.Control.Feedback>

                            </Form.Group>

                            <Form.Group controlId="registerPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                />

                            </Form.Group>

                            <Form.Group controlId="registerRepeatPassword">
                                <Form.Label>Repeat Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Repeat password"
                                    name="repeatPassword"
                                />

                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>


            </Container>

        </Layout>
    )
}
