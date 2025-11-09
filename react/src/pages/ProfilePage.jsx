import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Typography, message, Space } from 'antd';
import { useAuth } from '../auth/AuthContext';
import { authApi } from '../api/authApi';

const { Title } = Typography;

const ProfilePage = () => {
  const { user, fetchMe } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        let u = user;
        if (!u) {
          u = await fetchMe();
        }
        if (!u) {
          message.error('Не удалось загрузить профиль');
          return;
        }
        form.setFieldsValue({
          email: u.email,
          first_name: u.first_name,
          last_name: u.last_name,
        });
      } catch {
        message.error('Не удалось загрузить профиль');
      }
    };
    load();
  }, [user, fetchMe, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authApi.updateMe({ first_name: values.first_name, last_name: values.last_name });
      message.success('Профиль обновлён');
    } catch {
      message.error('Не удалось обновить профиль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id1-src/pages/ProfilePage.jsx">
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={3}>Профиль</Title>
          <Form form={form} layout="vertical" onFinish={onFinish} data-easytag="id2-src/pages/ProfilePage.jsx">
            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Имя" name="first_name" rules={[{ required: true, message: 'Укажите имя' }]}>
              <Input placeholder="Введите имя" />
            </Form.Item>
            <Form.Item label="Фамилия" name="last_name" rules={[{ required: true, message: 'Укажите фамилию' }]}>
              <Input placeholder="Введите фамилию" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>Сохранить</Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default ProfilePage;
