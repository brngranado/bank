import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { createUser } from '../services';
import { notification } from 'antd';
export const FormUser = ({ onAction }) => {
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    email: '',
    phone: '',
  });

  const handleCreateUser = async () => {
    try {
      const payload = {
          ...formData,
          phone: `+${formData.phone}`,
          document: Number(formData.document),
      }
      const response = await createUser(payload);
      sessionStorage.setItem('user', JSON.stringify(response));
      openNotification(); 
      setFormData({
        name: '',
        document: '',
        email: '',
        phone: '',
      });
      onAction(true);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Hubo un problema al registrar el usuario. Inténtalo de nuevo.',
        placement: 'topRight',
        duration: 2,
      });
    }
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const openNotification = () => {
    notification.success({
      message: 'Registro Exitoso',
      description: 'El usuario ha sido registrado correctamente.',
      placement: 'topRight',
      duration: 2, 
    });
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="Nombre" required>
          <Input
            value={formData.name}
            name="name"
            onChange={handleInputChange}
            placeholder="Ingresa tu nombre"
          />
        </Form.Item>
        <Form.Item label="Documento" required>
          <Input
            value={formData.document}
            name="document"
            onChange={handleInputChange}
            placeholder="Ingresa tu documento"
          />
        </Form.Item>
        <Form.Item label="Email" required>
          <Input
            type="email"
            value={formData.email}
            name="email"
            onChange={handleInputChange}
            placeholder="Ingresa tu email"
          />
        </Form.Item>
        <Form.Item label="Teléfono" required>
          <Input
            type="number"
            value={formData.phone}
            name="phone"
            onChange={handleInputChange}
            placeholder="Ingresa tu teléfono"
          />
        </Form.Item>
        <Form.Item>
          <Button onClick={handleCreateUser} type="primary">
            Registrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};