import React from 'react'
import { getCsrfToken  } from 'next-auth/react'

import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import react, {useState} from 'react';
import Link from 'next/link'

import Layout from '../../components/layout';
import * as _ from "lodash";

export default function SignIn({ csrfToken }) {
    return (
        <Layout isProtected={false}  >
        <Container>
            <Row>&nbsp;</Row>
            <h1>Sign-In or <Link href="/register">Register</Link></h1>

            <Form method='post' action='/api/auth/callback/credentials'>
            <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
            <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control name='username' type='text'/>
            </Form.Group>
            <Form.Group>
            <Form.Label>
                Password</Form.Label>
                <Form.Control as="input"  name='password' type='password'/>
            </Form.Group>

            <Button type='submit'>Sign in</Button>

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