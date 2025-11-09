import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Space, Button } from 'antd';
import { UserOutlined, LoginOutlined, LogoutOutlined, HomeOutlined, ProfileOutlined, FormOutlined } from '@ant-design/icons';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './auth/AuthContext';
import './App.css';

const { Header, Content } = Layout;

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const items = [
    { key: '/', label: <Link to="/">Главная</Link>, icon: <HomeOutlined /> },
    ...(!user ? [
      { key: '/register', label: <Link to="/register">Регистрация</Link>, icon: <FormOutlined /> },
      { key: '/login', label: <Link to="/login">Вход</Link>, icon: <LoginOutlined /> },
    ] : [
      { key: '/profile', label: <Link to="/profile">Профиль</Link>, icon: <ProfileOutlined /> },
    ])
  ];

  useEffect(() => {
    try {
      window.handleRoutes && window.handleRoutes(["/", "/register", "/login", "/profile"]);
    } catch {}
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }} data-easytag="id1-src/App.js">
      <Header style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }} data-easytag="id2-src/App.js">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} data-easytag="id3-src/App.js">
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={items}
            style={{ flex: 1 }}
          />
          <Space>
            {user ? (
              <Button icon={<LogoutOutlined />} onClick={() => logout()} data-easytag="id4-src/App.js">Выйти</Button>
            ) : (
              <Button type="primary" icon={<UserOutlined />} onClick={() => navigate('/login')} data-easytag="id5-src/App.js">Войти</Button>
            )}
          </Space>
        </div>
      </Header>
      <Content style={{ padding: '24px', maxWidth: 960, margin: '0 auto', width: '100%' }} data-easytag="id6-src/App.js">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </Content>
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
