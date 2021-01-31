import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import react, {useState} from 'react';
import Layout from '../../components/layout';


export default function ErrorSession() {

        return (
            <Layout>
                <Container >
                    <h1>Something goes wrong.</h1>
                    <h2>Please retry to continue</h2>
                </Container>
            </Layout>
        )
    }

