import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages
const Login = Loader(lazy(() => import('src/content/login')));

const Overview = Loader(lazy(() => import('src/content/overview')));

// Dashboards
const Crypto = Loader(lazy(() => import('src/content/dashboards/Crypto')));
const Stocks = Loader(lazy(() => import('src/content/dashboards/Stocks')));
const Etf = Loader(lazy(() => import('src/content/dashboards/Etf')));
const Commodities = Loader(lazy(() => import('src/content/dashboards/Commodities')));
const Misc = Loader(lazy(() => import('src/content/dashboards/Misc')));
const P2P = Loader(lazy(() => import('src/content/dashboards/P2P')));

// Applications
const Transactions = Loader(
  lazy(() => import('src/content/applications/Transactions'))
);
const UserProfile = Loader(
  lazy(() => import('src/content/applications/Users/profile'))
);
const UserSettings = Loader(
  lazy(() => import('src/content/applications/Users/settings'))
);

// Status
const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);

const routes = (isLoggedIn: any) => [
  {
    path: '*',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: isLoggedIn ? <Navigate to="/overview" /> : <Login />
      },
      {
        path: 'status',
        children: [
          {
            path: '/',
            element: <Navigate to="404" replace />
          },
          {
            path: '404',
            element: <Status404 />
          },
          {
            path: '500',
            element: <Status500 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          }
        ]
      },
      {
        path: 'overview',
        element: <SidebarLayout />,
        children: [
          {
            path: '/',
            element: <Overview />
          }
        ]
      },
      {
        path: 'dashboards',
        element: isLoggedIn ? <SidebarLayout /> : <Login />,
        children: [
          {
            path: '/',
            element: <Navigate to="/dashboards/crypto" replace />
          },
          {
            path: 'crypto',
            element: <Crypto />
          },
          {
            path: 'stocks',
            element: <Stocks />
          },
          {
            path: 'p2p',
            element: <P2P />
          },
          {
            path: 'etf',
            element: <Etf />
          },
          {
            path: 'misc',
            element: <Misc />
          },
          {
            path: 'commodities',
            element: <Commodities />
          },
          {
            path: 'bonds',
            element: <StatusComingSoon />
          },
          {
            path: 'realestate',
            element: <StatusComingSoon />
          },
        ]
      },
      {
        path: 'management',
        element: isLoggedIn ? <SidebarLayout /> : <Login />,
        children: [
          {
            path: '/',
            element: <Navigate to="/management/transactions" replace />
          },
          {
            path: 'transactions',
            element: <Transactions />
          },
          {
            path: 'reports',
            element: <StatusComingSoon />
          },
          {
            path: 'snapshots',
            element: <StatusComingSoon />
          },
          {
            path: 'profile',
            children: [
              {
                path: '/',
                element: <Navigate to="details" replace />
              },
              {
                path: 'details',
                element: <UserProfile />
              },
              {
                path: 'settings',
                element: isLoggedIn ? <UserSettings /> : <Login />
              }
            ]
          }
        ]
      },
      {
        path: 'expenses',
        element: isLoggedIn ? <SidebarLayout /> : <Login />,
        children: [
          {
            path: '/',
            element: <Navigate to="/expenses/balances" replace />
          },
          {
            path: 'balances',
            element: <StatusComingSoon />
          }
        ]
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  }
];

export default routes;
