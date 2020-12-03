import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import  NavbarLogo from '../../assets/images/usBay_logotipo_horizontal_inverted.png';
//Contexto
import { useAuth } from '../../context/auth';
import './Navbar.css'

//API
import { getFilter } from '../../api/Services';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/esm/Dropdown';

const CustomNavbar = ({...props}) =>{

    const {
        state: { token, userId },
        logout
    } = useAuth();

    const [user, setUser ] = useState({});
    const {
        userData,
        modules, 
        history
    } = props;

    const getUserData = async () => {
        const tokenLocal = localStorage.getItem('token');
        if ((token || tokenLocal) && userId) 
        {
          try
          {
            const filter = {
              "where":{
                  "id": userId
                }
            }
            const user = await getFilter(filter, "AppUsers", null, token);
            setUser(user[0]);
          }catch(err)
          {
            console.log(err);
          }
        }
      };

    useEffect(() => {
        /**
         * Si existe el token, entonces el usuario inició sesión
         */
        if(token)
        {
            getUserData();
        }
        }, []);
    
    return (
        <Navbar bg="primary" variant = 'light' sticky = 'top'>
            <Navbar.Brand href="#home">
            <img
                alt=""
                src={ NavbarLogo }
                width="150"
                height="40"
                className="d-inline-block align-top"
            />{' '}
            </Navbar.Brand>
            <Nav className="mr-auto">
                {user.role &&
                    modules[user.role].map(mod => {
                    return <Nav.Link style = {{color: 'white', fontWeight: 'bold'}} key = {mod.direccion} onClick = {() => history.push(mod.direccion)}>{mod.name}</Nav.Link>
                    })
                }
            </Nav>
            <Nav>
                {user &&
                    <DropdownButton menuAlign = 'right' style = {{color: 'white', fontWeight: 'bold'}} title = {user.firstName} id="dropdown-menu-align-right">
                        <Dropdown.Item onClick = {() => {
                            logout(()=> history.push('/login'));
                        }}>Cerrar Sesión</Dropdown.Item>
                    </DropdownButton>
                }
            </Nav>
        </Navbar>
    );
}

export default withRouter(CustomNavbar);