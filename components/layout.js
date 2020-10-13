import Head from "next/head";
import {Nav, Navbar, NavDropdown, Button} from "react-bootstrap";
import {signIn, signOut, useSession, getSession} from 'next-auth/client'

export default function Layout({children}) {

    const [session, loading] = useSession();

    const signOutRedirect = () => {
        signOut({ callbackUrl: '/'});
    }

    return (
        <div>
        <Head>
            <title>Next.js-bootstrap test app</title>
            <link rel="icon" href="/favicon.ico"/>
            </Head>
        <Navbar variant="dark" bg="dark">
            <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">Link</Nav.Link>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>

                    {!session && <>
                        <Button onClick={signIn}>Sign in</Button>
                    </>}
                    {session &&
                    <Nav className="ml-auto">
                        <NavDropdown title={session.user.email} >
                            <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item href="#" onClick={signOutRedirect}>Sign out</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    }


            </Navbar.Collapse>


        </Navbar>

        <main>
            {children}
        </main>

        </div>
)
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    return {
        props: { session }
    }
}
