import React, { FC, lazy } from 'react';
import { FaMusic, FaTachometerAlt, FaUsers } from 'react-icons/fa';

const Dashboard = lazy(() => import('@/pages/Home'));
const UserList = lazy(() => import('@/pages/Users/List'));
const UserCreate = lazy(() => import('@/pages/Users/Create'));
const UserEdit = lazy(() => import('@/pages/Users/Edit'));
const ManageAccount = lazy(() => import('@/pages/Users/ManageAccount'));

const ArtistList = lazy(() => import('@/pages/Artists/List'));
const ArtistCreate = lazy(() => import('@/pages/Artists/Create'));
const ArtistEdit = lazy(() => import('@/pages/Artists/Edit'));

const MusicList = lazy(() => import('@/pages/Music/List'));
const MusicCreate = lazy(() => import('@/pages/Music/Create'));
const MusicEdit = lazy(() => import('@/pages/Music/Edit'));

const Unauthorized = lazy(() => import('@/pages/Unauthorized'));
const NotFound = lazy(() => import('@/pages/NotFound'));


type UserRole = 'super_admin' | 'artist_manager' | 'artist';

interface RouteConfig {
    path: string;
    name?: string;
    component: React.FC;
    roles: UserRole[];
    icon?: FC<{ className?: string }>;
}

export const routes: RouteConfig[] = [
    {
        path: '/dashboard',
        component: Dashboard,
        roles: ['super_admin','artist_manager', 'artist'],
        name: "Dashboard",
        icon: FaTachometerAlt
    },
    {
        path: '/manage-account',
        component: ManageAccount,
        roles: ['super_admin', 'artist_manager', 'artist'],
    },
    {
        path: '/users/list',
        component: UserList,
        roles: ['super_admin'],
        name: "List Users",
        icon: FaUsers
    },
    {
        path: '/users/create',
        component: UserCreate,
        roles: ['super_admin'],

    },
    {
        path: '/user/:id/edit',
        component: UserEdit,
        roles: ['super_admin'],
    },
    {
        path: '/artist/list',
        component: ArtistList,
        roles: ['super_admin', 'artist_manager'],
        name: "List Artists",
        icon: FaUsers
    },
    {
        path: '/artist/create',
        component: ArtistCreate,
        roles: ['artist_manager'],
    },
    {
        path: '/artist/:id/edit',
        component: ArtistEdit,
        roles: ['artist_manager'],
    },
    {
        path: '/musics/list',
        component: MusicList,
        roles: ['artist'],
        name: "List Music",
        icon: FaMusic
    },
    {
        path: '/artist/:id/musics/list',
        component: MusicList,
        roles: ['super_admin','artist_manager','artist'],
    },
    {
        path: '/artist/:id/musics/create',
        component: MusicCreate,
        roles: ['artist'],
    },
    {
        path: '/artist/:id/musics/:musicId/edit',
        component: MusicEdit,
        roles: ['artist'],
    },
    {
        path: '/unauthorized',
        component: Unauthorized,
        roles: ['super_admin', 'artist_manager', 'artist'],
    },
    {
        path: '*',
        component: NotFound,
        roles: ['super_admin', 'artist_manager', 'artist'],
    },
];
