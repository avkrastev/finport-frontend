export const currencies = [
  {
    value: 'USD',
    label: '$',
    left: true
  },
  {
    value: 'EUR',
    label: '€',
    left: true
  },
  {
    value: 'BGN',
    label: 'лв.',
    left: false
  },
];

export const transactionTypes = [
  {
    value: 0,
    parent: 0,
    label: 'Buy'
  },
  {
    value: 1,
    parent: 1,
    label: 'Sell'
  },
  {
    value: 2,
    parent: 2,
    label: 'Transfer in'
  },
  {
    value: 3,
    parent: 2,
    label: 'Transfer out'
  },
]; 

export const commodities = [
  {
    name: 'Silver',
    logo: 'silver.png',
    description: ''
  },
  {
    name: 'Gold',
    logo: 'silver.png',
    description: ''
  },
]

export const p2pPlatforms = [
  {
    name: 'PeerBerry',
    logo: '/static/images/logo/p2p/peerberry.svg',
    website: 'https://peerberry.com/'
  },
  {
    name: 'Reinvest24',
    logo: '/static/images/logo/p2p/reinvest24.svg',
    website: 'https://www.reinvest24.com/'
  },
  {
    name: 'EstateGuru',
    logo: '/static/images/logo/p2p/estateguru.svg',
    website: 'https://estateguru.co/'
  },
  {
    name: 'Mintos',
    logo: '/static/images/logo/p2p/mintos.svg',
    website: 'https://www.mintos.com/'
  },
  {
    name: 'Debitum',
    logo: '/static/images/logo/p2p/debitum.svg',
    website: 'https://debitum.network/'
  },
  {
    name: 'LenderMarket',
    logo: '/static/images/logo/p2p/lendermarket.svg',
    website: 'https://lendermarket.com/'
  },
  {
    name: 'Bondora',
    logo: '/static/images/logo/p2p/bondora.svg',
    website: 'https://www.bondora.com/'
  },
  {
    name: 'Rendity',
    logo: '/static/images/logo/p2p/rendity.svg',
    website: 'https://rendity.com/'
  },
]