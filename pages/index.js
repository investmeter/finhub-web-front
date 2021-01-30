import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import react, {useState} from 'react';
import Layout from '../components/layout';

import {signIn, signOut, useSession} from 'next-auth/client'
// import jwt from 'next-auth/jwt'


export default function Home() {
    const [session, loading] = useSession();
    console.log(session);


    return (
        <Layout isSession={!!session} userEmail={session && session.user.email}>

            <Jumbotron  className='bg-white'>
                <Container>
                    <h1 className="header">Welcome To FinHub</h1>
                    <p>
                        The ultimate financial tools and info collection.
                    </p>
                </Container>
            </Jumbotron>

            {/*<Container>*/}
            {/*    <Row className="justify-content-center">*/}
            {/*        <Col md="auto">*/}
            {/*            Fill in Portfolio*/}
            {/*        </Col>*/}
            {/*    </Row>*/}

            {/*</Container>*/}

            {/*<Container fluid className="bg-dark text-white">*/}
            {/*    <Row>*/}

            {/*    {!session && <>*/}
            {/*        Not signed in <br/>*/}
            {/*        <button onClick={signIn}>Sign in</button>*/}
            {/*    </>}*/}
            {/*    {session && <>*/}
            {/*        Signed in as {session.user.email} <br/>*/}
            {/*        /!*<button onClick={signOut}>Sign out</button>*!/*/}


            {/*        {console.log("Session:",session)}*/}

            {/*    </>}*/}
            {/*    </Row>*/}
            {/*</Container>*/}

        </Layout>
    )
}
