import {Form, Media} from "react-bootstrap";
import Button from 'react-bootstrap/Button';

import Layout from '../../components/layout';

import {signIn, signOut, useSession} from 'next-auth/client'
import React from "react";
import * as _ from "lodash";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {initializeApollo} from "../../lib/apolloClient";
import {gql} from "@apollo/client";

function PortfolioIconImage({title, setValue, ...props}) {
    const imgSrc = `https://eu.ui-avatars.com/api/?rounded=false&background=007BFF&color=ffffff&font-size=0.33&length=2&name=${title}`
    setValue(imgSrc)
    return <img {...props} src={imgSrc} alt={'portfolio logo'}/>
}

export default function PortfolioManage() {

    const schema = yup.object({
        portfolioTitle: yup.string().min(1).ensure().required(),
        portfolioDescription: yup.string(),
        portfolioIconUrl: yup.string()
    })

    const [session, loading] = useSession();

    const {control, handleSubmit, watch, errors, formState, register, unregister, setValue, getValues} = useForm(
        {
            mode: "onChange",
            resolver: yupResolver(schema),
            shouldFocusError: false
        }
    );


    const onSubmit = (data) => {
        console.log('Submitted', data)
    }

    const watchPortfolioTitle = watch("portfolioTitle")

    // should register variable because dont have input for it
    register('portfolioIconUrl')

    return (
        <Layout isSession={!!_.get(session, 'user.apiToken')} userEmail={session && session.user.email}
                isProtected={true}>

            <h1 className="header">Create Portfolio</h1>
            <p>&nbsp;</p>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <Media>
                    <PortfolioIconImage width={64} height={64} className="mr-4"
                         title={watchPortfolioTitle} setValue={(src) => { setValue('portfolioIconUrl',src) }}/>

                    <Media.Body>
                        <>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control name='portfolioTitle'
                                              placeholder="Name of portfolio"
                                              isInvalid={!!errors.portfolioTitle}
                                              ref={register}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control name='portfolioDescription' as={"textarea"} rows={3}  ref={register}/>
                            </Form.Group>

                        </>
                        <Button variant='primary' type='submit' disabled={formState.isSubmitting} >Create Portfolio</Button>
                    </Media.Body>
                </Media>


            </Form>

        </Layout>

    )
}
