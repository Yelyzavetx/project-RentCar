// src/components/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
    background-color: #1a1a1a;
    color: white;
    padding: 0.5rem 1rem;
`;

const Nav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
`;

const Logo = styled(Link)`
    display: flex;
    align-items: center;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    img {
        height: 40px;
        width: auto;
    }
`;

const NavLinks = styled.div`
    display: flex;
    gap: 1rem;
`;

const NavLink = styled(Link)`
    color: white;
    text-decoration: none;
    padding: 0.5rem;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const ProfileDropdown = styled.div`
    position: relative;
`;

const ProfileButton = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    width: 150px;
    display: ${props => props.isOpen ? 'block' : 'none'};
    z-index: 10;
    margin-top: 0.5rem;
`;

const MenuItem = styled.div`
    padding: 10px 16px;
    cursor: pointer;
    color: #333;
    font-size: 0.9rem;

    &:hover {
        background-color: #f5f5f5;
    }
`;

const AdminBadge = styled.span`
  background-color: #d32f2f;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 6px;
`;

const UserInfo = styled.div`
  padding: 10px 16px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  color: #333;
  display: flex;
  align-items: center;
`;

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const isAdmin = user && user.role === 'ADMIN';

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const handleProfileClick = () => {
        if (user) {
            setMenuOpen(!menuOpen);
        } else {
            navigate('/login');
        }
    };

    return (
        <HeaderContainer>
            <Nav>
                <Logo to="/">
                    <img src="logo_black.jpg" alt="RentCar Logo" />
                </Logo>
                <NavLinks>
                    <NavLink to="/catalog">Каталог</NavLink>
                    <NavLink to="/reviews">Відгуки</NavLink>
                    <NavLink to="/about">Про нас</NavLink>
                    <NavLink to="/contacts">Контакти</NavLink>
                </NavLinks>

                <ProfileDropdown>
                    <ProfileButton onClick={handleProfileClick}>
                        <img src="/user.png" alt="User Avatar"
                             style={{
                                 width: '50px',
                                 height: '50px',
                                 borderRadius: '50%',
                                 objectFit: 'cover',
                                 marginRight: '8px',
                             }}/>
                    </ProfileButton>
                    {user && (
                        <DropdownMenu isOpen={menuOpen}>
                            <UserInfo>
                                {user.name || user.email}
                                {isAdmin && <AdminBadge>Адмін</AdminBadge>}
                            </UserInfo>
                            <MenuItem onClick={() => {
                                navigate('/profile');
                                setMenuOpen(false);
                            }}>
                                Профіль
                            </MenuItem>
                            <MenuItem onClick={() => {
                                navigate('/bookings');
                                setMenuOpen(false);
                            }}>
                                Мої бронювання
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                Вийти
                            </MenuItem>
                        </DropdownMenu>
                    )}
                </ProfileDropdown>
            </Nav>
        </HeaderContainer>
    );
};

export default Header;