import {useRouter} from 'next/router'
import React from 'react'
import {useSession} from 'next-auth/client'
import {gql, useQuery} from '@apollo/client';
import * as _ from 'lodash'
import Layout from "../../../components/layout";
import {useApollo} from "../../../lib/apolloClient";
import { ApolloProvider } from '@apollo/client';
import {Table} from "react-bootstrap";
import Link from "next/link";

function DealList({userUuid, token}) {

    const REQ = gql`
       query userDeals($user_uuid:String, $security_id:Int){
         userDeals(user_uuid:$user_uuid, security_id:$security_id){
            error 
            deals{
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
            "user_uuid": userUuid
        }
    })

    console.log("Data ", data)

    const dateConv = new Intl.DateTimeFormat('default', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
    })

    return (
        <Table>
            <thead>
            <tr>
                <th>DateTime</th>
                <th>Ticker</th>
                <th>Asset</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Total Paid</th>
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
                    </tr>)
            })
            }
            </tbody>
        </Table>
    )
}


export default function PortfolioDeals() {
    const [session, loading] = useSession()


    const router = useRouter()
    const {ticker} = router.query

    return (
        <Layout isSession={!!_.get(session, 'user.apiToken')} isProtected={true}
                userEmail={session && session.user.email} loading={loading} session={session}>
            <h1 className="header">Deal list for Portfolio</h1>
            <p>&nbsp;</p>
            <Link  href="/portfolio"> &lt;&lt; back to Portfolio</Link>
            <p>&nbsp;</p>

            <DealList userUuid={_.get(session,"user.uuid", false)}
                      token={_.get(session,"user.apiToken")}/>

        </Layout>
    )
}




