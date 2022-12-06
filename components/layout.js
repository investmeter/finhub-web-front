import Head from "next/head";
import Link from "next/link";
import {Nav, Navbar, NavDropdown, Button, Container, Row, Col} from "react-bootstrap";
import {useSession, signIn, signOut} from 'next-auth/react'


import { useRouter } from 'next/router'


export default function Layout({isProtected = false, children = {}, userEmail="", isSession=false, loading=false}) {

    const noBulletsList= {listStyleType: "none"};

    // const [session, loading] = useSession();
    const {data:session} = useSession()
    const router = useRouter();

    const signOutRedirect = () => {
        signOut({ callbackUrl: '/'});
    }

    return (
        <>
        <Head>
            <title>Next.js-bootstrap test app</title>
            <link rel="icon" href="/favicon.ico"/>
        </Head>
        <Navbar variant="dark" bg="primary">
            <Container>
            <Navbar.Brand href="#home">FinHub</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link  onClick= {function (e){e.preventDefault(); router.push('/')}} href="/">Home</Nav.Link>
                    {/*<Nav.Link  onClick={(e) => {e.preventDefault();router.push('/portfolio')}} href="/portfolio">Portfolio</Nav.Link>*/}
                    
                    <Nav.Link as="a" href="/portfolio" >Portfolio</Nav.Link>

                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>

                    {!isSession && <>
                        <Button onClick={signIn}>Sign in</Button>
                    </>}
                    {isSession &&
                    <Nav className="ml-auto">
                        <NavDropdown title={userEmail} >
                            <NavDropdown.Item href="/profile" onClick= {function (e){e.preventDefault(); router.push('/profile')}} >Profile</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item href="#" onClick={signOutRedirect}>Sign out</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    }


            </Navbar.Collapse>

            </Container>       
        </Navbar>

        <main >

            {!!loading &&
                <div>Please wait....</div>
            }

            {isProtected && !isSession && !loading &&
                <Container>
                    <Row>&nbsp;</Row>
                    <h1>Session Expired</h1>
                    <h2>Please <Link onClick={signIn} href="/auth/credentials-signin"><a href="/auth/credentials-signin">sign-in</a></Link></h2>

                </Container>
            }

            {((!!!isProtected) || (!!isProtected && !!isSession)) && (!loading) &&
            // !!session.user &&

            <Container>
                <Row>&nbsp;</Row>
                {children}
            </Container>
            }

        </main>

            {/*<Container fluid className='bg-dark'>*/}
            {/*    <Row>*/}
            {/*        <Col className='text-white' >*/}
            {/*            <ul style={noBulletsList}>*/}
            {/*                <li>About</li>*/}
            {/*                <li>About</li>*/}
            {/*                <li>About</li>*/}
            {/*            </ul>*/}

            {/*        </Col>*/}

            {/*    </Row>*/}
            {/*</Container>*/}

        </>
)
}
