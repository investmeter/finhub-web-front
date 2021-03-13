import {Button, Col, Container, Modal, Row, Table} from 'react-bootstrap';
import Layout from '../../components/layout';
import {useSession} from 'next-auth/client'
import React, {useState} from "react";
import PortfolioItemForm from "../../components/portfolio_item_form"
import * as _ from "lodash";
import {initializeApollo} from "../../lib/apolloClient";
import {gql} from "@apollo/client";
import portfolio from "./portfolio";


async function fetchPortfolio(userUuid,session){
    console.log("Fetching portfolio...")
    const client = initializeApollo()

    return client.query({
        query: gql`query userPortfolio($user_uuid:String){
                      userPortfolio(user_uuid: $user_uuid) {
                      last_deal_timestamp
                      asset{
                          id
                          title
                          ticker
                          currency
                      }
                    amount
                    }
        }`,
        variables: {
            user_uuid: userUuid
        },
        context: {
            token: 'Bearer ' + session.user.apiToken
        }
    }).then(
        (res) => {
            console.log('data fetched')
            return res.data.userPortfolio
        }
    )

}

function PortFolio({session, doUpdate, setDoUpdate}){

    const [portfolio, setPortfolio] = useState([])

    if (doUpdate)
    {
            fetchPortfolio(session.user.uuid, session).then( (data) => {
            setPortfolio(data)
             setDoUpdate(false)
            }
        )
    }

    return (
        <Table>
            <thead>
            <tr>
                <th>Ticker</th>
                <th>Asset</th>
                <th>Amount</th>
                <th>Last Updated</th>

            </tr>
            </thead>
            <tbody>
            {portfolio.length > 0  && portfolio.map( (item, i) => {

                return (<tr key={i}>
                    <td>{item.asset.ticker}</td>
                    <td>{item.asset.title}</td>
                    <td>{item.amount}</td>
                    <td>{item.last_deal_timestamp}</td>
                </tr>)
            } )}
            </tbody>
        </Table>
    )

}

export default function PortfolioHome() {
    const [session, loading] = useSession()

    const [show, setShow] = useState(false)
    const [formState, setFormState] = useState('INIT')

    const [doUpdate, setDoUpdate] = useState(true)

    const handleClose = () => {

        setShow(false)
        setDoUpdate(true)
    }
    const handleShow = () => {
        setFormState('INIT')
        setShow(true)
    }



    return (
        <Layout isSession={!!_.get(session, 'user.apiToken')} isProtected={true}
                userEmail={session && session.user.email} loading={loading}>

            <h1 className="header">Portfolio</h1>
            <Button onClick={handleShow}>Add</Button>
            {session && <PortFolio session={session} doUpdate={doUpdate} setDoUpdate={setDoUpdate}/>

            }

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
                                    <Button onClick={handleClose} block>Close</Button>
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
