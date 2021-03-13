import {Button, Container, Modal, Row, Col} from 'react-bootstrap';
import Layout from '../../components/layout';
import {useSession} from 'next-auth/client'
import React, {useState} from "react";
import PortfolioItemForm from "../../components/portfolio_item_form"
import * as _ from "lodash";

export default function Home() {
    const [session, loading] = useSession()

    const [show, setShow] = useState(false)
    const [formState, setFormState] = useState('INIT')

    const handleClose = () => setShow(false)
    const handleShow = () => {
        setFormState('INIT')
        setShow(true)
    }


    return (
        <Layout isSession={!!_.get(session, 'user.apiToken')} isProtected={true}
                userEmail={session && session.user.email}>

            <h1 className="header">Portfolio</h1>
            <Button onClick={handleShow}>Add</Button>

            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Add item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formState === 'INIT' &&
                    <PortfolioItemForm setFormState={setFormState}/>
                    }
                    {formState === 'ADDED_OK' &&
                    <>
                    <Container>
                        <Row>
                            <Col>
                                <h3>Item have been Added</h3> <br/>
                            </Col>
                        </Row>
                    </Container>
                        <Container>
                        <Row>
                            <Col>
                                <Button onClick={() => setFormState('INIT')} block>Add one more</Button>
                            </Col>
                        </Row>
                        <Row><Col>&nbsp;</Col></Row>
                        <Row>
                            <Col>
                                <Button onClick={handleClose} block >Close</Button>
                            </Col>
                        </Row>
                    </Container>
                    </>
                    }
                </Modal.Body>
            </Modal>
        </Layout>
    )
}
