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
import SavingsIcon from '@mui/icons-material/Savings';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
  key?: string;
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
        key: 'crypto',
        link: '/dashboards/crypto',
        icon: CurrencyBitcoinTwoToneIcon,
        show: true
      },
      {
        name: 'Stocks',
        key: 'stocks',
        link: '/dashboards/stocks',
        icon: ShowChartTwoToneIcon,
        show: true
      },
      {
        name: 'Bonds',
        key: 'bonds',
        link: '/dashboards/bonds',
        icon: BookTwoToneIcon,
        show: true
      },
      {
        name: 'Commodities',
        key: 'commodities',
        link: '/dashboards/commodities',
        icon: AgricultureTwoToneIcon,
        show: true
      },
      {
        name: 'Real Estates',
        key: 'real',
        link: '/dashboards/realestate',
        icon: MapsHomeWorkTwoToneIcon,
        show: true
      },
      {
        name: 'P2P',
        key: 'p2p',
        link: '/dashboards/p2p',
        icon: GroupTwoToneIcon,
        show: true
      },
      {
        name: 'ETFs',
        key: 'etf',
        link: '/dashboards/etf',
        icon: AddchartTwoToneIcon,
        show: true
      },
      {
        name: 'Miscellaneous',
        key: 'misc',
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
        name: 'Savings',
        icon: SavingsIcon,
        link: '/management/savings',
        show: true
      },
      {
        name: 'Balances',
        icon: AccountBalanceWalletTwoToneIcon,
        link: '/management/balances',
        show: true
      }
    ]
  },
  {
    heading: 'History',
    items: [
      {
        name: 'Reports',
        icon: AssessmentTwoToneIcon,
        link: '/history/reports',
        show: true,
        items: [
          {
            name: 'Monthly',
            link: '/history/reports/monthly',
            show: true
          },
          {
            name: 'Yearly',
            link: '/history/reports/yearly',
            show: true
          },
          {
            name: 'Taxable',
            link: '/history/reports/taxable',
            show: true
          }
        ]
      }
      // {
      //   name: 'Snapshots',
      //   icon: AddAPhotoTwoToneIcon,
      //   link: '/history/snapshots',
      //   show: true
      // }
    ]
  }
];

export default menuItems;
