import {useRouter} from 'next/router'
import React from 'react'
import {useSession} from 'next-auth/client'
import {gql, useQuery} from '@apollo/client';
import * as _ from 'lodash'
import Layout from "../../../components/layout";

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
    
        }
      }
    }
    `
    console.log("Token ", token)
    if (!userUuid || !token) return null;


    const {loadingData, error, data} = useQuery(REQ, {
        context: {
                token: 'Bearer ' + token
        },
        variables: {
            "user_uuid": userUuid,
            "security_id": 29
        }
    })
    console.log("Data ", data)
    return (
        <div>
            {!loadingData && _.get(data, "userDeals.deals") &&
            data.userDeals.deals.map(deal => {
                return <p>{deal.asset.ticker}</p>
            })
            }
        </div>
    )

}


export default function PortfolioDeals() {
    const [session, loading] = useSession()

    const router = useRouter()
    const {ticker} = router.query

    return (
        <Layout isSession={!!_.get(session, 'user.apiToken')} isProtected={true}
                userEmail={session && session.user.email} loading={loading} session={session}>

            <DealList userUuid={_.get(session,"user.uuid", false)} token={_.get(session,"user.apiToken")}/>

        </Layout>
    )
}




