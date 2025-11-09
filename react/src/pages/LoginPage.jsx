import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values);
      message.success('Вы успешно вошли');
      navigate('/profile');
    } catch (e) {
      message.error('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id1-src/pages/LoginPage.jsx">
      <Card>
        <Title level={3}>Вход</Title>
        <Form layout="vertical" onFinish={onFinish} data-easytag="id2-src/pages/LoginPage.jsx">
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Укажите email' }, { type: 'email', message: 'Введите корректный email' }]}>
            <Input placeholder="Введите email" />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Укажите пароль' }]}>
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>Войти</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
