import React, { useState, useEffect } from 'react';
import Banner from '../../assets/images/usBay_logotipo_horizontal_inverted.png';
import Swal from 'sweetalert2';
import { Notification } from 'rsuite';
//Context
import { useAuth } from '../../context/auth';
import './Login.css';

//API
import { post, getFilter } from '../../api/Services';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Col from 'react-bootstrap/esm/Col';
import Image from 'react-bootstrap/Image'

const Login = (props) => {

  const { history } = props;
  //Usando el Contexto
  const {
    signin,
    state: { token, userId }
  } = useAuth();

  //Variables de estado
  const [formType, setFormType] = useState('login');
  const [userData, setUserData] = useState({
    "firstName": "",
    "lastName": "",
    "role": "",
    "phoneNumber": "",
    "password": "",
    "confirmPassword": "",
    "email": "",
    "companyId": "",
    "realm": "",
    "username": "",
  })

  const loggeoExitoso = async (datosUsuario) => {
    console.log('datos usuario: ', datosUsuario);
    const { userId } = datosUsuario;
    try
    {
      const filter = {
        "where":{
            "id": userId
          }
      }
      const user = await getFilter(filter, "AppUsers", null, token);
      switch(user[0].role)
      {
        case "Super":
            history.push('/bahías');
            break;
        case 'Particular':
            history.push('/vehículos');
            break;
        case 'Empresa':
            history.push('/vehículos');
            break;
        default:
            break;
      }
    }catch(err)
    {
      console.log(err);
    }
  }

  const loggeoErroneo = () => {
    Swal.fire('Error en el servidor', `Credenciales Inválidas`, 'error');
  }

  const getUserData = async () => {
    const tokenLocal = localStorage.getItem('token');
    console.log(token, tokenLocal, userId);
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
        switch(user[0].role)
        {
          case "Super":
              console.log('me meti a bahías');
              history.push('/bahías');
              break;
          case 'Particular':
              history.push('/vehículos');
              break;
          case 'Empresa':
              history.push('/vehículos');
              break;
          default:
              break;
        }
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
    }, [token]);

    return (
        <div className = 'main-container'>
            <div style = {{backgroundColor: '#7CC3EA'}}>

            </div>
            <div className = 'logo-container'>
              <div>
                <Image src = {Banner} width = {300}/>
              </div>
              <h6 style = {{marginTop: '10px', color: 'white'}}>La mejor opción que tienes para la logística en espacios públicos</h6>
            </div>
            <div className = 'login-container' style = {formType === 'login' ? {left: '30vw'} : {left: '25vw'}}>
              <h2 className = 'text-center'>{formType === 'login' ? 'Inicia Sesión' : 'Registrate'}</h2>
              <Form>
                {formType !== 'login' &&
                <Form.Row>
                  <Form.Group as = {Col} controlId="formBasicEmail">
                    <Form.Label className = "font-weight-bold">Nombre</Form.Label>
                    <Form.Control type="text" placeholder="Ingresa tu primer nombre" onBlur = {(e) => setUserData({...userData, firstName: e.target.value})}/>
                  </Form.Group>
                  <Form.Group as = {Col} controlId="formBasicEmail">
                    <Form.Label className = "font-weight-bold">Apellido</Form.Label>
                    <Form.Control type="text" placeholder="Apellido paterno" onBlur = {(e) => setUserData({...userData, lastName: e.target.value})}/>
                  </Form.Group>
                  <Form.Group as = {Col} controlId="formBasicEmail">
                    <Form.Label className = "font-weight-bold">Tipo de Usuario</Form.Label>
                    <Form.Control 
                      as="select" 
                      placeholder="Selecciona un tipo" 
                      custom
                      onChange = {(e) => setUserData({...userData, role: e.target.value})}
                    >
                      <option>Empresa</option>
                      <option>Particular</option>
                    </Form.Control>
                  </Form.Group>
                </Form.Row>
                }
                <Form.Row>
                  <Form.Group as = {Col} controlId="formBasicEmail">
                    <Form.Label className = "font-weight-bold">Correo Electrónico</Form.Label>
                    <Form.Control type="email" placeholder="Ingresa tu email" onBlur = {(e) => setUserData({...userData, email: e.target.value})}/>
                  </Form.Group>
                  { formType !== 'login' &&
                    <Form.Group as = {Col} controlId="formBasicEmail">
                      <Form.Label className = "font-weight-bold">Teléfono</Form.Label>
                      <Form.Control type="text" placeholder="Ingresa tu teléfono" onBlur = {(e) => setUserData({...userData, phoneNumber: e.target.value})}/>
                    </Form.Group>
                  }
                </Form.Row>
                <Form.Row>
                  <Form.Group as = {Col} controlId="formBasicPassword">
                    <Form.Label className = 'font-weight-bold'>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Ingresa tu contraseña" onBlur = {(e) => setUserData({...userData, password: e.target.value})}/>
                  </Form.Group>
                  {formType !== 'login' &&
                    <Form.Group as = {Col} controlId="formBasicPassword">
                      <Form.Label className = 'font-weight-bold'>Confirmar contraseña</Form.Label>
                      <Form.Control type="password" placeholder="Nuevamente..." onBlur = {(e) => setUserData({...userData, confirmPassword: e.target.value})}/>
                    </Form.Group>
                  }
                </Form.Row>
                <ButtonToolbar className = 'justify-content-around'>
                  <Button variant="primary" block onClick = {() => {
                    if(formType === 'login')
                    {
                      console.log(userData);
                      signin({email: userData.email, password: userData.password, onSuccess: loggeoExitoso, onError: loggeoErroneo});
                    }
                    else
                    {
                      setFormType('login');
                    }
                  }}>
                    {formType === 'login' ? 'Entrar' : 'Ya tengo cuenta'}
                  </Button>
                  <Button variant="outline-primary" block onClick = {async () => {
                    if(formType === 'signin')
                    {
                      try
                      {
                        console.log(userData);
                        const res = await post(
                          userData,
                          "AppUsers", ""
                        );
                        Notification.success({
                          title: 'Registro exitoso',
                          description: '¡Ya puedes iniciar sesión! y no olvides checar tu correo ;)'
                        })
                      }catch(err)
                      {
                        Notification.error({
                          title: 'Error',
                          description: 'Ha ocurrido un error en el servidor, Intentelo de nuevo mas tarde'
                        })
                      }
                    }
                    else
                    {
                      setFormType('signin');
                    }
                  }}>
                    {formType === 'login' ? 'Quiero registrarme' : 'Registrarme'}
                  </Button>
                </ButtonToolbar>
              </Form>
            </div>
        </div>
    );
}

export default Login;