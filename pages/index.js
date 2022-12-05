
// import Jumbotron from 'react-bootstrap/Jumbotron';
import {Container, Row, Col} from 'react-bootstrap';
import Layout from '../components/layout';

import {useSession} from 'next-auth/react'
// import jwt from 'next-auth/jwt'


export default function Home() {
    const {data:session}= useSession();
    console.log("Session:", session);


    return (
        <Layout isSession={!!session} userEmail={session && session.user.email} >

           {/* < <Jumbotron  className='bg-white'> */}
                <Container>
                    
                    <div>
                        The ultimate financial tools and info collection.
                    </div>
                </Container>
            {/* </Jumbotron> */}

            {/*<Container>*/}
            {/*    <Row className="justify-content-center">*/}
            {/*        <Col md="auto">*/}
            {/*            Fill in Portfolio*/}
            {/*        </Col>*/}
            {/*    </Row>*/}

            {/*</Container>*/}

            {/*<Container fluid className="bg-dark text-white">*/}
            {/*    <Row>*/}

            {/*    {!session && <>*/}
            {/*        Not signed in <br/>*/}
            {/*        <button onClick={signIn}>Sign in</button>*/}
            {/*    </>}*/}
            {/*    {session && <>*/}
            {/*        Signed in as {session.user.email} <br/>*/}
            {/*        /!*<button onClick={signOut}>Sign out</button>*!/*/}


            {/*        {console.log("Session:",session)}*/}

            {/*    </>}*/}
            {/*    </Row>*/}
            {/*</Container>*/}

        </Layout>
    )
}
