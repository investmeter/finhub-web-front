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

import * as _ from  'lodash'

export default function Profile({isSession, userEmail}) {

    const [session, loading] =  useSession()


    if (loading){
        return (
            <Layout>
                <Container props={{isSession, userEmail}}>
                    <h1>...loading</h1>
                </Container>
            </Layout>
        )
    }

   return (
            <Layout isProtected={true} isSession={!!session.user.apiToken} userEmail={_.get(session,'user.email')}>
                <Container>
                    <Row>&nbsp;</Row>
                    <h1> Profile </h1>
                    <h2>Email from session: {_.get(session, 'user.email')}</h2>
                    {/*<h2>Email from server : {userEmail}</h2>*/}
                </Container>

            </Layout>
        )

    // //const [session, loading] = useSession();
    // console.log(session);


}

export async function getServerSideProps({req, res}) {
    const session = await getSession({req})
    console.log("Session from page ", session)
    return {
        props: {
            isSession: !!session,
            userEmail : !!session && _.get(session, "user.email"),
            session: session
        }, // will be passed to the page component as props
    }
}

