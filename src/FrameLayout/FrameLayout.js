import React, {useState, useEffect} from 'react'
import Sidenav from './Sidenav/Sidenav';
import Navbar from './Navbar/Navbar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { FlexboxGrid, Loader } from 'rsuite';
//Vistas
import Login from '../views/Login/Login';
import Companies from '../views/Companies/Companies';
import Users from '../views/Users/Users';
import Rates from '../views/Rates/Rates';
import Bays from '../views/Bays/Bays';
import Routes from '../views/Routes/Routes';
import Vehicles from '../views/Vehicles/Vehicles';
import Bookings from '../views/Bookings/Bookings';
import Drivers from '../views/Drivers/Drivers';

//API
import { getFilter } from '../api/Services';

//Contexto
import { useAuth } from '../context/auth';
import './FrameLayout.css'

const FrameLayout = (props) => {

  const routes = {
    'Super': [
        {
          direccion: '/empresas',
          name: 'Empresas',
          componente: Companies,
        },
        {
          direccion: '/usuarios',
          name: 'Usuarios',
          componente: Users,
        },
        {
          direccion: '/tarifas',
          name: 'Tarifas',
          componente: Rates,
        },
        {
          direccion: '/bahías',
          name: 'Bahías',
          componente: Bays,
        },
        {
          direccion: '/rutas',
          name: 'Rutas',
          componente: Routes,
        },
    ],
    'Company': [
        {
          direccion: '/vehículos',
          name: 'Vehículos',
          componente: Vehicles,
        },
        {
          direccion: '/reservas',
          name: 'Reservaciones',
          componente: Bookings,
        },
        {
          direccion: '/conductores',
          name: 'Conductores',
          componente: Drivers,
        }
    ],
    'Particular': [
        {
          direccion: '/vehículos',
          name: 'Vehículos',
          componente: Vehicles,
        },
        {
          direccion: '/reservas',
          name: 'Reservaciones',
          componente: Bookings,
        },
      ],
}

    const {
        state: { token, userId },
        testToken
    } = useAuth();
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [userData, setUserData ] = useState({
      "firstName": "",
      "lastName": "",
      "role": "",
      "createdAt": "",
      "phoneNumber": "",
      "email": "",
      "companyId": "",
      "realm": "",
      "username": "",
      "id": ""
    })
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
          setUserData(user[0]);
          setIsDataLoading(false);
        }catch(err)
        {
          console.log(err);
          setIsDataLoading(false);
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
        setIsDataLoading(false);
      }, [token]);

      if (isDataLoading) {
        return (
          <FlexboxGrid justify='center' align='middle' className='page-container' style = {{width: '100vw', height: '100vh', backgroundColor: '#7CC3EA'}}>
            <Loader style = {{color: 'white'}} content={<b className = 'color-white'>Cargando...</b>} size='lg' />
          </FlexboxGrid>
        );
      }
return (
    <Router>
        { token && !isDataLoading && userData && <Navbar userData = {userData} modules = {routes}/>}
        <div className = {token && 'wrapper-container'}>
          { token && userId && userData.role &&
            routes[userData.role].map(ruta => {
             return <Route path = {ruta.direccion} component = {ruta.componente}/>
            })
          }
          {!isDataLoading && userData &&
           <>
            <Route exact = {true} path = '/' component = {Login}/>
            <Route path = '/login' component = {Login}/>
           </>
          }
        </div>
    </Router>
    );
}

export default FrameLayout;