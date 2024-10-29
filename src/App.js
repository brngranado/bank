// src/App.js
import React, {useEffect, useState} from 'react';
import {
    Layout,
    Menu,
    Card,
    Typography,
    Button,
    Input,
    Form,
    notification,
    Modal
} from 'antd';
import {FormUser} from './components/FormUser';
import {getUserById, getBalance, reload, pay, confirmOk} from './services';
const {Header, Content} = Layout;
const {Title} = Typography;


const App = () => {
    const [balance,
        setBalance] = useState(0); // Balance inicial
    const [amount,
        setAmount] = useState(0);
        const [amountPay,
          setAmountPay] = useState(0);
    const [userData,
        setUserData] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [verify, setVerify] = useState(false);

    const handleRecharge = async () => {
        try {
          const payload = {
            amount: amount,
            document: Number(userData.document),
            phone: userData.phone
        }
        await reload(payload);
        const phoneModified = userData.phone.slice(1);
        getBalanceCurrent({ document: userData.document, phone: phoneModified });
        openNotification({
            message: 'Recarga exitosa',
            description: 'Se ha recargado exitosamente',
        }); 
        setAmount(0);
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'Hubo un problema. Inténtalo de nuevo.',
            placement: 'topRight',
            duration: 2,
          });
        }
    };

    const handlePayment = async  () => {
      try {
        const payload = {
          document: Number(userData.document),
          amount: amountPay
        }
        const response = await pay(payload);
        if (response) {
           sessionStorage.setItem('sessionIdPay', JSON.stringify(response.sessionId));
           showModal();
        }

        
      } catch (error) {
        
      }
    };

    const openNotification = (data) => {
      notification.success({
        message: data.message,
        description: data.description,
        placement: 'topRight',
        duration: 2, 
      });
    };

    const showModal = () => {
      setIsModalVisible(true);
  };

    
    const handleOk = async () => {
      console.log('Código de confirmación:', confirmationCode);

      try {
        const payload = {
          token: confirmationCode,
          sessionId: JSON.parse(sessionStorage.getItem('sessionIdPay'))
        }
        await confirmOk(payload);
        setIsModalVisible(false);
        setConfirmationCode(''); 
        const phoneModified = userData.phone.slice(1);
        getBalanceCurrent({ document: userData.document, phone: phoneModified });
        setAmountPay(0);
        openNotification({
          message: 'Pago confirmado',
          description: 'El pago ha sido confirmado exitosamente',
        });
  
      } catch (error) {
        
      }
  };

  const handleCancel = () => {
      setIsModalVisible(false);
      setConfirmationCode('');
  };

  const handleChildAction = (info) => {
    setVerify(info); // Actualiza el estado con la información del hijo
};
  

    const getBalanceCurrent = async (params) => {
        try {
          const response = await getBalance({ document: params.document, phone: params.phone });
          setBalance(response.balance);
        } catch (error) {
          console.error('Error fetching balance:', error);
          throw error;
        }
      };

      useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser); 
            setUserData(user);
  
            const phoneModified = user.phone.slice(1);
            getBalance({ document: user.document, phone: phoneModified })
                .then(data => {
                    setBalance(data.balance);
                })
                .catch(error => {
                    console.error('Error al obtener los datos del usuario:', error);
                });
        }
    }, [verify]);
    

  



    return (
        <Layout>
            <Header>
                <Menu theme="dark" mode="horizontal">
                    <Menu.Item key="1">Wallet</Menu.Item>
                </Menu>
            </Header>
            <Content style={{
                padding: '50px'
            }}>
                <Card
                    title={`Balance de ${userData ? userData.name : 'Usuario'}`}
                    style={{
                    marginBottom: '20px'
                }}>
                    <Title level={3}>${balance}</Title>
                </Card>
                <Card
                    title="Recargar Saldo"
                    style={{
                    marginBottom: '20px'
                }}>
                    <Form layout="inline">
                        <Form.Item>
                            <Input
                                type="number"
                                name="reload"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                placeholder="Monto a recargar"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleRecharge}>
                                Recargar
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Card
                    title="Pagar"
                    style={{
                    marginBottom: '20px'
                }}>
                    <Form layout="inline">
                        <Form.Item>
                            <Input
                                type="number"
                                value={amountPay}
                                onChange={(e) => setAmountPay(Number(e.target.value))}
                                placeholder="Monto a pagar"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handlePayment}>
                                Pagar
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Card title="Registro de Usuario">
                    <FormUser onAction={handleChildAction}/>
                </Card>
                <Modal
                    title="Código de Confirmación"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Input
                        type="text"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        placeholder="Ingresa tu código de confirmación"
                    />
                </Modal>
            </Content>
        </Layout>
    );
};

export default App;