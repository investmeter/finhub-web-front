import { Col, Container, Modal, Row, Table} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Layout from '../../components/layout';
import {useSession} from 'next-auth/react'
import {useState, useEffect} from "react";
import PortfolioItemForm from "../../components/portfolio_item_form"
import * as _ from "lodash";
import {initializeApollo} from "../../lib/apolloClient";
import {gql} from "@apollo/client";
import Link from "next/link"

async function fetchPortfolio(userUuid,session){
    console.log("Fetching portfolio...")
    const client = initializeApollo()

    return client.query({
        query: gql`query userPortfolio($user_uuid:String){
                      userPortfolio(user_uuid: $user_uuid) {
                      error 
                      portfolioAssets {
                          last_deal_timestamp
                          asset{
                              id
                              title
                              ticker
                              currency
                          }
                        amount
                        }
                    }
        }`,
        variables: {
            user_uuid: userUuid
        },
        context: {
            token: 'Bearer ' + session.user.apiToken
        },
        fetchPolicy: "no-cache"
    }).then(
        (res) => {
            console.log('data fetched')
            return res.data.userPortfolio.portfolioAssets
        }
    )

}

function PortFolio({session, doUpdate, setDoUpdate}){

    const [portfolio, setPortfolio] = useState([])

    useEffect( () => {

        if (doUpdate) {
            setDoUpdate(false)
            console.log("updating.... ")

            fetchPortfolio(session.user.uuid, session).then((data) => {
                console.log(data)
                setPortfolio(data)

                }
            )
        }
    })
    const dateConv = new Intl.DateTimeFormat('default', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
    })
    return (
        <Table style={{width:"100%", border:1}}>
            <thead>
            <tr>
                <th>&nbsp;</th>
                <th>Ticker</th>
                <th>Asset</th>
                <th>Amount</th>
                <th>Last Updated</th>

            </tr>
            </thead>
            <tbody>
            {portfolio.length > 0  && portfolio.map( (item, i) => {

                return (<tr key={i}>
                    <td><img width={36} height={36}
                             src={`https://yastatic.net/s3/fintech-icons/1/i/${item.asset.ticker}.svg`}
                             onError={
                                 (e)=>{
                                 e.target.onerror=null;
                                 e.target.src=`https://eu.ui-avatars.com/api/?rounded=true&background=007BFF&color=ffffff&font-size=0.33&length=4&name=${item.asset.ticker}`}}
                    />
                    </td>
                    <td><Link href={`/portfolio/deals?asset=${item.asset.id}`} >{item.asset.ticker}</Link></td>
                    <td>{item.asset.title}</td>
                    <td>{item.amount}</td>
                    <td>{dateConv.format(new Date(item.last_deal_timestamp))}</td>
                </tr>)
            } )}
            </tbody>
        </Table>
    )

}

export default function PortfolioHome() {
    const [show, setShow] = useState(false)
    const [formState, setFormState] = useState('INIT')

    const [doUpdate, setDoUpdate] = useState(true)
    const { data: session } = useSession()
    console.log("Session", session)
    const handleClose = () => {

        setShow(false)
        setDoUpdate(true)
    }
    const handleShow = () => {
        setFormState('INIT')
        setShow(true)
    }



    return (
        <Layout session={session} isProtected={true} isSession={!!session && session.user.apiToken} >
            <Button onClick={handleShow} type="button">Add Deal</Button> &nbsp; <Link  href="/portfolio/deals/">Show All Deals</Link>

            {session &&
                <PortFolio session={session} doUpdate={doUpdate} setDoUpdate={setDoUpdate}/>
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
