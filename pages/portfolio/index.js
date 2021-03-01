
import {Container, Row, Col, Modal} from 'react-bootstrap';
import Layout from '../../components/layout';
import {signIn, signOut, useSession} from 'next-auth/client'
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import PortfolioItemForm from "../../components/portfolio_item_form"
import * as _ from "lodash";

export default function Home() {
    const [session, loading] = useSession()

    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)




    return (
        <Layout isSession={!!_.get(session, 'user.apiToken')} isProtected={true} userEmail={session && session.user.email}>

            <h1 className="header">Portfolio</h1>
            <Button onClick={handleShow}>Add</Button>

            <Modal show={show} onHide={handleClose} backdrop="static" >
                <Modal.Header closeButton>
                    <Modal.Title>Add item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PortfolioItemForm/>
                </Modal.Body>
            </Modal>


        </Layout>
    )
}
