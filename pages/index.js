import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import react, {useState} from 'react';
import Layout from '../components/layout';

import {signIn, signOut, useSession} from 'next-auth/client'

export default function Home() {
    const [session, loading] = useSession();
    console.log(session);

    return (
        <Layout>

            <Jumbotron fluid>
                <Container>
                    <h1 className="header">Welcome To React-Bootstrap</h1>
                    <p>
                        This is a simple hero unit, a simple jumbotron-style component for calling
                        extra attention to featured content or information.
                    </p>
                </Container>
            </Jumbotron>

            <div>
                {!session && <>
                    Not signed in <br/>
                    <button onClick={signIn}>Sign in</button>
                </>}
                {session && <>
                    Signed in as {session.user.email} <br/>
                    {/*<button onClick={signOut}>Sign out</button>*/}
                </>}
            </div>

        </Layout>
    )
}
