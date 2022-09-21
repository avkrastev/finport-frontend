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
  }
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
  }
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
  }
];

export const dayNames = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const shortDayNames = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun'
];

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const shortMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export const p2pPlatforms = [
  {
    name: 'Afranga',
    logo: '/static/images/logo/p2p/afranga.svg',
    website: 'https://afranga.com/'
  },
  {
    name: 'BlockFi',
    logo: '/static/images/logo/p2p/blockfi.svg',
    website: 'https://blockfi.com/'
  },
  {
    name: 'Bondora',
    logo: '/static/images/logo/p2p/bondora.svg',
    website: 'https://www.bondora.com/'
  },
  {
    name: 'Bondster',
    logo: '/static/images/logo/p2p/bondster.svg',
    website: 'https://bondster.com/'
  },
  {
    name: 'Bulkestate',
    logo: '/static/images/logo/p2p/bulkestate.svg',
    website: 'https://www.bulkestate.com/'
  },
  {
    name: 'Cabital',
    logo: '/static/images/logo/p2p/cabital.svg',
    website: 'https://www.cabital.com/'
  },
  {
    name: 'Capitalia',
    logo: '/static/images/logo/p2p/capitalia.svg',
    website: 'https://www.capitalia.com/'
  },
  {
    name: 'Celsius',
    logo: '/static/images/logo/p2p/celsius.svg',
    website: 'https://celsius.network/'
  },
  {
    name: 'Coin Rabbit',
    logo: '/static/images/logo/p2p/coinrabbit.svg',
    website: 'https://coinrabbit.io/'
  },
  {
    name: 'CoinLoan',
    logo: '/static/images/logo/p2p/coinloan.svg',
    website: 'https://coinloan.io/'
  },
  {
    name: 'Constant',
    logo: '/static/images/logo/p2p/constant.svg',
    website: 'https://www.myconstant.com/'
  },
  {
    name: 'Crowd Estate',
    logo: '/static/images/logo/p2p/crowdestate.svg',
    website: 'https://crowdestate.eu/'
  },
  {
    name: 'Crowdestor',
    logo: '/static/images/logo/p2p/crowdestor.svg',
    website: 'http://crowdestor.com/'
  },
  {
    name: 'Crypto.com',
    logo: '/static/images/logo/p2p/cryptocom.svg',
    website: 'https://crypto.com/'
  },
  {
    name: 'Debitum',
    logo: '/static/images/logo/p2p/debitum.svg',
    website: 'https://debitum.network/'
  },
  {
    name: 'DoFinance',
    logo: '/static/images/logo/p2p/dofinance.svg',
    website: 'https://www.dofinance.eu/'
  },
  {
    name: 'Envestio',
    logo: '/static/images/logo/p2p/envestio.svg',
    website: 'https://envestio.com/'
  },
  {
    name: 'Esketit',
    logo: '/static/images/logo/p2p/esketit.svg',
    website: 'https://esketit.com/'
  },
  {
    name: 'EstateGuru',
    logo: '/static/images/logo/p2p/estateguru.svg',
    website: 'https://estateguru.co/'
  },
  {
    name: 'Evenfi',
    logo: '/static/images/logo/p2p/evenfy.svg',
    website: 'https://www.evenfy.com/'
  },
  {
    name: 'Evoestate',
    logo: '/static/images/logo/p2p/evoestate.svg',
    website: 'https://evoestate.com/'
  },
  {
    name: 'Fast Invest',
    logo: '/static/images/logo/p2p/fast-invest.svg',
    website: 'https://www.fastinvest.com/'
  },
  {
    name: 'Fellow Bank',
    logo: '/static/images/logo/p2p/fellow-finance.svg',
    website: 'https://www.fellowbank.com/'
  },
  {
    name: 'Flender',
    logo: '/static/images/logo/p2p/flender.svg',
    website: 'https://flender.ie/'
  },
  {
    name: 'GoParity',
    logo: '/static/images/logo/p2p/goparity.svg',
    website: 'https://goparity.com/'
  },
  {
    name: 'Grupeer',
    logo: '/static/images/logo/p2p/grupeer.svg',
    website: 'https://www.grupeer.com/'
  },
  {
    name: 'Haru',
    logo: '/static/images/logo/p2p/haru.svg',
    website: 'https://haruinvest.com/'
  },
  {
    name: 'Heavy Finance',
    logo: '/static/images/logo/p2p/heavyfinance.svg',
    website: 'https://heavyfinance.com/'
  },
  {
    name: 'Hodlnaut',
    logo: '/static/images/logo/p2p/hodlnaut.svg',
    website: 'https://www.hodlnaut.com/'
  },
  {
    name: 'Income',
    logo: '/static/images/logo/p2p/income.svg',
    website: 'https://getincome.com/'
  },
  {
    name: 'InRento',
    logo: '/static/images/logo/p2p/inrento.svg',
    website: 'https://inrento.com/'
  },
  {
    name: 'Iuvo Group',
    logo: '/static/images/logo/p2p/iuvogroup.svg',
    website: 'https://www.iuvo-group.com/'
  },
  {
    name: 'Lande',
    logo: '/static/images/logo/p2p/lande.svg',
    website: 'https://lande.finance/'
  },
  {
    name: 'Ledn',
    logo: '/static/images/logo/p2p/ledn.svg',
    website: 'https://www.ledn.io/'
  },
  {
    name: 'LenderMarket',
    logo: '/static/images/logo/p2p/lendermarket.svg',
    website: 'https://lendermarket.com/'
  },
  {
    name: 'Lenndy',
    logo: '/static/images/logo/p2p/lenndy.svg',
    website: 'https://lenndy.com/'
  },
  {
    name: 'Max Crowdfund',
    logo: '/static/images/logo/p2p/maxcrowdfund.svg',
    website: 'https://lande.finance/'
  },
  {
    name: 'Midas Investements',
    logo: '/static/images/logo/p2p/midas.svg',
    website: 'https://midas.investments/'
  },
  {
    name: 'Mintos',
    logo: '/static/images/logo/p2p/mintos.svg',
    website: 'https://www.mintos.com/'
  },
  {
    name: 'Moncera',
    logo: '/static/images/logo/p2p/moncera.svg',
    website: 'https://moncera.com/'
  },
  {
    name: 'NEO Finance',
    logo: '/static/images/logo/p2p/neofinance.svg',
    website: 'https://www.neofinance.com/'
  },
  {
    name: 'Nexo',
    logo: '/static/images/logo/p2p/nexo.svg',
    website: 'https://nexo.io/'
  },
  {
    name: 'Nibble',
    logo: '/static/images/logo/p2p/nibble.svg',
    website: 'https://nibble.finance/'
  },
  {
    name: 'NORDSTREET',
    logo: '/static/images/logo/p2p/nordstreet.svg',
    website: 'https://nordstreet.com/'
  },
  {
    name: 'PeerBerry',
    logo: '/static/images/logo/p2p/peerberry.svg',
    website: 'https://peerberry.com/'
  },
  {
    name: 'Profitus',
    logo: '/static/images/logo/p2p/profitus.svg',
    website: 'https://www.profitus.com/'
  },
  {
    name: 'Reinvest24',
    logo: '/static/images/logo/p2p/reinvest24.svg',
    website: 'https://www.reinvest24.com/'
  },
  {
    name: 'Rendity',
    logo: '/static/images/logo/p2p/rendity.svg',
    website: 'https://rendity.com/'
  },
  {
    name: 'Robocash',
    logo: '/static/images/logo/p2p/robocash.svg',
    website: 'https://robo.cash/'
  },
  {
    name: 'Swaper',
    logo: '/static/images/logo/p2p/swaper.svg',
    website: 'https://swaper.com/'
  },
  {
    name: 'Twino',
    logo: '/static/images/logo/p2p/twino.svg',
    website: 'https://www.twino.eu/'
  },
  {
    name: 'Vauld',
    logo: '/static/images/logo/p2p/vauld.svg',
    website: 'https://www.vauld.com/'
  },
  {
    name: 'Via Invest',
    logo: '/static/images/logo/p2p/viainvest.svg',
    website: 'https://viainvest.com/'
  },
  {
    name: 'Viventor',
    logo: '/static/images/logo/p2p/viventor.svg',
    website: 'https://www.viventor.com/'
  },
  {
    name: 'Wisefund',
    logo: '/static/images/logo/p2p/wisefund.svg',
    website: 'https://wisefund.eu/'
  },
  {
    name: 'Yield App',
    logo: '/static/images/logo/p2p/yieldapp.svg',
    website: 'https://www.yield.app/'
  },
  {
    name: 'Youholder',
    logo: '/static/images/logo/p2p/youhodler.svg',
    website: 'https://www.youhodler.com/'
  }
];
