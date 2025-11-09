import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div data-easytag="id1-src/pages/HomePage.jsx">
      <Card>
        <Typography>
          <Title level={2}>Добро пожаловать!</Title>
          <Paragraph>Это главная страница приложения. Перейдите к регистрации или войдите в профиль.</Paragraph>
        </Typography>
      </Card>
    </div>
  );
};

export default HomePage;
