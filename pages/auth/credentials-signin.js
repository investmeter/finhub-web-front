import React from 'react'
import { getCsrfToken  } from 'next-auth/react'

import {Container, Row, Col, Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import react, {useState} from 'react';
import Link from 'next/link'

import Layout from '../../components/layout';
import * as _ from "lodash";

import { useRouter } from 'next/router'
import Alert from 'react-bootstrap/Alert';


export default function SignIn({ csrfToken }) {
    const router = useRouter()
    const { error } = router.query

    return (
        <Layout isProtected={false}  >
        <Container>
            <Row>&nbsp;</Row>
            {!!error && error == 'CredentialsSignin' && 
                <Alert variant='danger'>
                   Could not sign-in. Please check email and password!
                </Alert>
            }
            <h1>Sign-In or <Link href="/register">Register</Link></h1>

            <Form method='post' action='/api/auth/callback/credentials'>
                <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
                <Form.Group  className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control name='username' type='text'/>
                </Form.Group>
                <Form.Group  className="mb-3">
                <Form.Label>
                    Password</Form.Label>
                    <Form.Control as="input"  name='password' type='password'/>
                </Form.Group>
                <Button type="submit" variant = "primary">Sign in</Button>
            </Form>
            </Container>
        </Layout>
    )
}

// SignIn.getInitialProps = async (context) => {
//     return {
//         csrfToken: await getCsrfToken (context)
//     }
// }

export async function getServerSideProps(context) {
    return {
      props: {
        csrfToken: await getCsrfToken(context),
      },
    }
  }