import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {useSession} from 'next-auth/client'
import {gql, useQuery} from '@apollo/client';
import * as _ from 'lodash'
import Layout from "../../../components/layout";
import {initializeApollo, useApollo} from "../../../lib/apolloClient";
import {ApolloProvider} from '@apollo/client';
import {Table, Button, Modal} from "react-bootstrap";
import Link from "next/link";


function DealList({userUuid, asset, setAssetTitle}) {

    function handleDelButton(dealId) {
        console.log("BTN", dealId)
        setDealId(dealId)
        handleShow(true)
    }

    function deleteDealGql(dealId) {
        console.log("Starting delete deal...", dealId)
        setModalState('dealDelete')

        const client = initializeApollo()
        const REQ = gql`
            mutation deleteDeal($deal_id:Int){
                  deleteDeal(deal_id:$deal_id){
                    error
                    deals{
                      id
                        status
                       } 
                }
            }
        `

        client.mutate({
            mutation: REQ,
            variables: {'deal_id': Number.parseInt(dealId)},
            context: {
                token: 'Bearer ' + session.user.apiToken
            },
        }).then((result) => {
            console.log(result)
            setModalState('dealResult')
        })


    }


    const [session, loading] = useSession()

    const [show, setShow] = useState(false);

    const handleClose = () => {setShow(false);}
    const handleShow = () => {setModalState(""); setShow(true) }

    const [dealId, setDealId] = useState()
    const [modalState, setModalState] = useState("")


    const token = _.get(session, "user.apiToken")

    const REQ = gql`
       query userDeals($user_uuid:String, $security_id:Int){
         userDeals(user_uuid:$user_uuid, security_id:$security_id){
            error 
            deals{
              id
              deal_timestamp
              asset{
                id
                title
                ticker
                currency
              }
            amount
            price
            total_paid
            fee
        }
      }
    }
    `
    if (!userUuid || !token) return null;

    const {loadingData, error, data} = useQuery(REQ, {
        context: {
            token: 'Bearer ' + token
        },
        variables: {
            "user_uuid": userUuid,
            "security_id": Number.parseInt(asset)
        }
    })

    useEffect(() => {
        console.log("Data in Effect", data)
        if (asset && loadingData) setAssetTitle("L O A D I N G")
        if (asset && _.get(data, "userDeals.deals")) setAssetTitle(_.get(data, "userDeals.deals")[0].asset.ticker)

    })

    console.log("Data ", data)

    const dateConv = new Intl.DateTimeFormat('default', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
    })

    return (
        <>
            <Table style={{width: '100%'}}>
                <thead>
                <tr>
                    <th>DateTime</th>
                    <th>Ticker</th>
                    <th>Asset</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Total Paid</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {!loadingData && _.get(data, "userDeals.deals") &&

                data.userDeals.deals.map((deal, i) => {
                    return (
                        <tr key={i}>
                            <td>{dateConv.format(new Date(deal.deal_timestamp))}</td>
                            <td>{deal.asset.ticker}</td>
                            <td>{deal.asset.title}</td>
                            <td>{deal.amount}</td>
                            <td>{deal.price}</td>
                            <td>{deal.total_paid}</td>
                            <td><Button variant="outline-danger" onClick={() => {
                                handleDelButton(deal.id)
                            }}>del</Button></td>
                        </tr>)
                })
                }
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Really Delete?</Modal.Title>
                </Modal.Header>
                {modalState === '' &&
                <>
                    <Modal.Body>You could restore deal from archive later</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" variant="danger" onClick={() => {deleteDealGql(dealId)}}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </>
                }

                {modalState === 'dealDelete' &&
                <>
                    <Modal.Body> Please wait.. </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled >Cancel</Button>
                        <Button variant="primary" disabled variant="danger" >Delete</Button>
                    </Modal.Footer>
                </>
                }

                {modalState === 'dealResult' &&
                <>
                    <Modal.Body> Deal {dealId} has been deleted! </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </>
                }
            </Modal>
        </>

    )
}


export default function PortfolioDeals()
{
    const [session, loading] = useSession()
    const [assetTitle, setAssetTitle] = useState("")

    const router = useRouter()
    const {asset} = router.query

    return (
        <Layout isSession={!!_.get(session, 'user.apiToken')} isProtected={true}
                userEmail={session && session.user.email} loading={loading}>
            {!assetTitle &&
            <h1 className="header">Deal list for Portfolio</h1>
            }
            {assetTitle &&
            <h1 className="header">Deal list for {assetTitle}</h1>
            }
            <p>&nbsp;</p>
            <Link href="/portfolio"> &lt;&lt; back to Portfolio</Link>
            <p>&nbsp;</p>


            <DealList userUuid={_.get(session, "user.uuid", false)}
                      asset={asset}
                // token={_.get(session,"user.apiToken")}
                      setAssetTitle={setAssetTitle}/>

        </Layout>
    )
}




