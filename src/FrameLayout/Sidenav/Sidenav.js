import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

//Contexto
import { useAuth } from '../../context/auth';

const CustomSidenav = ({...props}) => {
    const { expanded, history, userData } = props;
    const {
        state: { userId, token }
    } = useAuth();

    const [isExpanded, setIsExpanded] = useState(false);

    const modules = {
        'Administrador': [
            {
                eventKey: '1',
                icono: 'area-chart',
                name: 'Estadísticos',
                route: '/estadisticos'
            },
            {
                eventKey: '2',
                icono: 'book2',
                name: 'Productos',
                route: '/productos'
            },
            {
                eventKey: '3',
                icono: 'character-authorize',
                name: 'Trámites',
                route: '/tramites'
            },
            {
                eventKey: '4',
                icono: 'money',
                name: 'Ventas',
                route: '/ventas'
            }
        ],
        'Almacenista': [
            {
                eventKey: '2',
                icono: 'book2',
                name: 'Productos',
                route: '/productos'
            }
        ],
        'RH': [
            {
                eventKey: '3',
                icono: 'character-authorize',
                name: 'Trámites',
                route: '/tramites'
            },
        ],
        'Vendedor': [
            {
                eventKey: '4',
                icono: 'money',
                name: 'Ventas',
                route: '/ventas'
            }
        ]
    }
    return (
        <SideNav
            style = {{backgroundColor: '7CC3EA'}}
            expanded={isExpanded}
            onToggle={(expanded) => {
                setIsExpanded( expanded );
            }}
        >
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected="home">
                <NavItem eventKey="home">
                    <NavIcon>
                        <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                    </NavIcon>
                    <NavText>
                        Home
                    </NavText>
                </NavItem>
            </SideNav.Nav>
        </SideNav>
    );
}

export default withRouter(CustomSidenav);
