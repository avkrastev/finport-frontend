import { ReactNode } from 'react';

import DonutSmallTwoToneIcon from '@mui/icons-material/DonutSmallTwoTone';
import CurrencyBitcoinTwoToneIcon from '@mui/icons-material/CurrencyBitcoinTwoTone';
import AgricultureTwoToneIcon from '@mui/icons-material/AgricultureTwoTone';
import AutoGraphTwoToneIcon from '@mui/icons-material/AutoGraphTwoTone';
import AddchartTwoToneIcon from '@mui/icons-material/AddchartTwoTone';
import AssessmentTwoToneIcon from '@mui/icons-material/AssessmentTwoTone';
import AddAPhotoTwoToneIcon from '@mui/icons-material/AddAPhotoTwoTone';
import MapsHomeWorkTwoToneIcon from '@mui/icons-material/MapsHomeWorkTwoTone';
import BookTwoToneIcon from '@mui/icons-material/BookTwoTone';
import GroupTwoToneIcon from '@mui/icons-material/GroupTwoTone';
import ShowChartTwoToneIcon from '@mui/icons-material/ShowChartTwoTone';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
  alias?: string;
  show?: Boolean;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: '',
    items: [
      {
        name: 'Overview',
        link: '/overview',
        icon: DonutSmallTwoToneIcon,
        show: true
      }
    ]
  },
  {
    heading: 'Dashboards',
    items: [
      {
        name: 'Crypto',
        alias: 'crypto',
        link: '/dashboards/crypto',
        icon: CurrencyBitcoinTwoToneIcon,
        show: true
      },
      {
        name: 'Stocks',
        alias: 'stocks',
        link: '/dashboards/stocks',
        icon: ShowChartTwoToneIcon,
        show: true
      },
      {
        name: 'Bonds',
        alias: 'bonds',
        link: '/dashboards/bonds',
        icon: BookTwoToneIcon,
        show: true
      },
      {
        name: 'Commodities',
        alias: 'commodities',
        link: '/dashboards/commodities',
        icon: AgricultureTwoToneIcon,
        show: true
      },
      {
        name: 'Real Estates',
        alias: 'real',
        link: '/dashboards/realestate',
        icon: MapsHomeWorkTwoToneIcon,
        show: true
      },
      {
        name: 'P2P',
        alias: 'p2p',
        link: '/dashboards/p2p',
        icon: GroupTwoToneIcon,
        show: true
      },
      {
        name: 'ETFs',
        alias: 'etf',
        link: '/dashboards/etf',
        icon: AddchartTwoToneIcon,
        show: true
      },
      {
        name: 'Miscellaneous',
        alias: 'misc',
        link: '/dashboards/misc',
        icon: AutoGraphTwoToneIcon,
        show: true
      }
    ]
  },
  {
    heading: 'Management',
    items: [
      {
        name: 'Transactions',
        icon: TableChartTwoToneIcon,
        link: '/management/transactions',
        show: true
      },
      {
        name: 'Reports',
        icon: AssessmentTwoToneIcon,
        link: '/management/reports',
        show: true
      },
      {
        name: 'Snapshots',
        icon: AddAPhotoTwoToneIcon,
        link: '/management/snapshots',
        show: true
      }
    ]
  },
  {
    heading: 'Expenses',
    items: [
      {
        name: 'Balances',
        icon: AccountBalanceWalletTwoToneIcon,
        link: '/expenses/balances',
        show: true
      }
    ]
  }
];

export default menuItems;
