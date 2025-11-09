import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values);
      message.success('Регистрация успешна');
      navigate('/profile');
    } catch (e) {
      message.error('Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id1-src/pages/RegisterPage.jsx">
      <Card>
        <Title level={3}>Регистрация</Title>
        <Form layout="vertical" onFinish={onFinish} data-easytag="id2-src/pages/RegisterPage.jsx">
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Укажите email' }, { type: 'email', message: 'Введите корректный email' }]}>
            <Input placeholder="Введите email" />
          </Form.Item>
          <Form.Item label="Имя" name="first_name" rules={[{ required: true, message: 'Укажите имя' }]}>
            <Input placeholder="Введите имя" />
          </Form.Item>
          <Form.Item label="Фамилия" name="last_name" rules={[{ required: true, message: 'Укажите фамилию' }]}>
            <Input placeholder="Введите фамилию" />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Укажите пароль' }, { min: 8, message: 'Минимальная длина пароля — 8 символов' }]}>
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>Зарегистрироваться</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
