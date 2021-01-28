import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import react, {useState} from 'react';
import Layout from '../components/layout';

import {signIn, signOut, useSession, getSession} from 'next-auth/client'
// import jwt from 'next-auth/jwt'


export default function Profile({session}) {

    if (!session)  {
        return (
            <Layout>
            <Container>
                    <h1>Profile </h1>
                    <h2>Please Sign-In to continue</h2>
                </Container>
            </Layout>
        )
    }

    //const [session, loading] = useSession();
    console.log(session);

    return (

        <Layout userEmail="TEST" session={true}>
            <Container>
                <h1> Profile </h1>

            </Container>
        </Layout>
    )

}

export async function getServerSideProps({req, res}) {
    const session = await getSession({req})
    console.log("Session from page ", session)
    return {
        props: {
            session:true
        }, // will be passed to the page component as props
    }
}

