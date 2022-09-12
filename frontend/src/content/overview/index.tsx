import { Helmet } from 'react-helmet-async';
import PageHeader from '../dashboards/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import WatchList from '../dashboards/WatchList';
import AccountBalance from '../dashboards/AccountBalance';
import { AppDispatch } from 'src/app/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSummary,
  getSummaryStatus,
  selectAllSummary
} from './summarySlice';
import { useEffect, useState } from 'react';
import {
  fetchCrypto,
  getCryptoStatus,
  selectAllCrypto
} from '../dashboards/Crypto/cryptoSlice';
import {
  fetchStocks,
  getStocksStatus,
  selectAllStocks
} from '../dashboards/Stocks/stocksSlice';
import {
  fetchP2P,
  getP2PStatus,
  selectAllP2P
} from '../dashboards/P2P/p2pSlice';
import {
  fetchMisc,
  getMiscStatus,
  selectAllMisc
} from '../dashboards/Misc/miscSlice';
import {
  fetchCommodities,
  getCommoditiesStatus,
  selectAllCommodities
} from '../dashboards/Commodities/commoditiesSlice';
import {
  fetchETFs,
  getETFsStatus,
  selectAllETFs
} from '../dashboards/Etf/ETFsSlice';
import { currencies } from 'src/constants/common';

function Overview() {
  const dispatch: AppDispatch = useDispatch();
  const summary = useSelector(selectAllSummary);
  const summaryStatus = useSelector(getSummaryStatus);
  const crypto = useSelector(selectAllCrypto);
  const cryptoStatus = useSelector(getCryptoStatus);
  const stocks = useSelector(selectAllStocks);
  const stocksStatus = useSelector(getStocksStatus);
  const p2p = useSelector(selectAllP2P);
  const p2pStatus = useSelector(getP2PStatus);
  const misc = useSelector(selectAllMisc);
  const miscStatus = useSelector(getMiscStatus);
  const commodities = useSelector(selectAllCommodities);
  const commoditiesStatus = useSelector(getCommoditiesStatus);
  const etf = useSelector(selectAllETFs);
  const etfStatus = useSelector(getETFsStatus);

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalDifference, setTotalDifference] = useState(0);
  const [
    totalSumsInDifferentInCurrencies,
    setTotalSumsInDifferentInCurrencies
  ] = useState(() => {
    return currencies.map((currency) => {
      let data: any = {};
      data.currency = currency.value;
      data.holdingAmount = 0;
      data.totalAmount = 0;
      return data;
    });
  });

  useEffect(() => {
    if (summaryStatus === 'idle') {
      dispatch(fetchSummary());
    }
  }, [summaryStatus, dispatch, summary.sums.totalSum]);

  useEffect(() => {
    if (cryptoStatus === 'idle') {
      dispatch(fetchCrypto());
    }
    if (cryptoStatus === 'succeeded') {
      setTotalBalance((prevState) => prevState + crypto.sums.holdingValue);
      setTotalDifference((prevState) => prevState + crypto.sums.difference);
      setTotalSumsInDifferentInCurrencies((prevState) => {
        for (let i in prevState) {
          prevState[i].holdingAmount +=
            crypto.sums.sumsInDifferentCurrencies[i].holdingAmount;
          prevState[i].totalAmount +=
            crypto.sums.sumsInDifferentCurrencies[i].totalAmount;
        }
        return prevState;
      });
    }
  }, [cryptoStatus, dispatch, crypto]);

  useEffect(() => {
    if (stocksStatus === 'idle') {
      dispatch(fetchStocks());
    }
    if (stocksStatus === 'succeeded') {
      setTotalBalance((prevState) => prevState + stocks.sums.holdingValue);
      setTotalDifference((prevState) => prevState + stocks.sums.difference);
      setTotalSumsInDifferentInCurrencies((prevState) => {
        for (let i in prevState) {
          prevState[i].holdingAmount +=
            stocks.sums.sumsInDifferentCurrencies[i].holdingAmount;
          prevState[i].totalAmount +=
            stocks.sums.sumsInDifferentCurrencies[i].totalAmount;
        }
        return prevState;
      });
    }
  }, [stocksStatus, dispatch, stocks]);

  useEffect(() => {
    if (p2pStatus === 'idle') {
      dispatch(fetchP2P());
    }
    if (p2pStatus === 'succeeded') {
      setTotalBalance((prevState) => prevState + p2p.sums.holdingValue);
      setTotalDifference((prevState) => prevState + p2p.sums.difference);
      setTotalSumsInDifferentInCurrencies((prevState) => {
        for (let i in prevState) {
          prevState[i].holdingAmount +=
            p2p.sums.sumsInDifferentCurrencies[i].holdingAmount;
          prevState[i].totalAmount +=
            p2p.sums.sumsInDifferentCurrencies[i].totalAmount;
        }
        return prevState;
      });
    }
  }, [p2pStatus, dispatch, p2p]);

  useEffect(() => {
    if (miscStatus === 'idle') {
      dispatch(fetchMisc());
    }
    if (miscStatus === 'succeeded') {
      setTotalBalance((prevState) => prevState + misc.sums.holdingValue);
      setTotalDifference((prevState) => prevState + misc.sums.difference);
      setTotalSumsInDifferentInCurrencies((prevState) => {
        for (let i in prevState) {
          prevState[i].holdingAmount +=
            misc.sums.sumsInDifferentCurrencies[i].holdingAmount;
          prevState[i].totalAmount +=
            misc.sums.sumsInDifferentCurrencies[i].totalAmount;
        }
        return prevState;
      });
    }
  }, [miscStatus, dispatch, misc]);

  useEffect(() => {
    if (commoditiesStatus === 'idle') {
      dispatch(fetchCommodities());
    }
    if (commoditiesStatus === 'succeeded') {
      setTotalBalance((prevState) => prevState + commodities.sums.holdingValue);
      setTotalDifference(
        (prevState) => prevState + commodities.sums.difference
      );
      setTotalSumsInDifferentInCurrencies((prevState) => {
        for (let i in prevState) {
          prevState[i].holdingAmount +=
            commodities.sums.sumsInDifferentCurrencies[i].holdingAmount;
          prevState[i].totalAmount +=
            commodities.sums.sumsInDifferentCurrencies[i].totalAmount;
        }
        return prevState;
      });
    }
  }, [commoditiesStatus, dispatch, commodities]);

  useEffect(() => {
    if (etfStatus === 'idle') {
      dispatch(fetchETFs());
    }
    if (etfStatus === 'succeeded') {
      setTotalBalance((prevState) => prevState + etf.sums.holdingValue);
      setTotalDifference((prevState) => prevState + etf.sums.difference);
      setTotalSumsInDifferentInCurrencies((prevState) => {
        for (let i in prevState) {
          prevState[i].holdingAmount +=
            etf.sums.sumsInDifferentCurrencies[i].holdingAmount;
          prevState[i].totalAmount +=
            etf.sums.sumsInDifferentCurrencies[i].totalAmount;
        }
        return prevState;
      });
    }
  }, [etfStatus, dispatch, etf]);

  return (
    <>
      <Helmet>
        <title>Overview</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title="Overview" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <AccountBalance
              assets={summary}
              category=""
              loading={summaryStatus}
              totalBalance={totalBalance}
              totalDifference={totalDifference}
              totalSumsInDifferentInCurrencies={
                totalSumsInDifferentInCurrencies
              }
            />
          </Grid>
          <Grid item xs={12}>
            <WatchList
              categories={summary.stats}
              crypto={crypto}
              cryptoLoading={cryptoStatus}
              stocks={stocks}
              stocksLoading={stocksStatus}
              p2p={p2p}
              p2pLoading={p2pStatus}
              etf={etf}
              etfLoading={etfStatus}
              misc={misc}
              miscLoading={miscStatus}
              commodities={commodities}
              commoditiesLoading={commoditiesStatus}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Overview;
