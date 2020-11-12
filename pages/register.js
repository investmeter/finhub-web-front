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
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';

const schema = yup.object({
    userEmail: yup.string().required().email(),
    password: yup.string().required().min(6),
    repeatPassword: yup.string().oneOf([yup.ref('password')], "Passwords must match"),

});


const onSubmit = data => console.log(data);

export default function Register() {


    const [session, loading] = useSession();

    const { control, handleSubmit, watch, errors, formState } = useForm({
        mode:"onChange",
        resolver: yupResolver(schema)
    });


    console.log(session);

    return (
        <Layout>
            <Container>
                <h1>Register</h1>

                        <Form onSubmit={handleSubmit(onSubmit)} >
                            <Form.Group >
                                <Form.Label>Email</Form.Label>
                                <Controller as={Form.Control}
                                            placeholder="Email"
                                            name="userEmail"
                                            control={control}
                                            defaultValue=""
                                            isValid = { !errors.userEmail}
                                            isInvalid = {errors.userEmail}
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
                                            isValid = {formState.dirtyFields.password && !errors.password}
                                            isInvalid = {errors.password}
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
                                            isValid = {formState.dirtyFields.repeatPassword && !errors.repeatPassword}
                                            isInvalid = {errors.repeatPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.repeatPassword && <span>Should mathc the password</span>}
                                </Form.Control.Feedback>

                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>


            </Container>

        </Layout>
    )
}
