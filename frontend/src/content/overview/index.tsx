import { Helmet } from 'react-helmet-async';
import PageHeader from '../dashboards/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import WatchList from '../dashboards/WatchList';
import { AppDispatch } from 'src/app/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHistory,
  fetchSummary,
  getSummaryStatus,
  selectAllHistory,
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
import WatchListWithChart from '../dashboards/WatchListWithChart';

function Overview() {
  const dispatch: AppDispatch = useDispatch();
  const summary = useSelector(selectAllSummary);
  const summaryStatus = useSelector(getSummaryStatus);
  const history = useSelector(selectAllHistory);
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
      dispatch(fetchHistory());
    }
  }, [summaryStatus, dispatch]);

  useEffect(() => {
    if (
      cryptoStatus === 'idle' &&
      summaryStatus === 'succeeded' &&
      summary.stats.length > 0 &&
      summary.stats.find((item) => item.alias === 'crypto')
    ) {
      dispatch(fetchCrypto());
    }
    if (
      cryptoStatus === 'succeeded' &&
      summary.stats.length > 0 &&
      summary.stats.find((item) => item.alias === 'crypto')
    ) {
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
  }, [cryptoStatus, dispatch, crypto, summaryStatus, summary]);

  useEffect(() => {
    if (
      stocksStatus === 'idle' &&
      summaryStatus === 'succeeded' &&
      summary.stats.length > 0 &&
      summary.stats.find((item) => item.alias === 'stocks')
    ) {
      dispatch(fetchStocks());
    }
    if (
      stocksStatus === 'succeeded' &&
      summary.stats.length > 0 &&
      summary.stats.find((item) => item.alias === 'stocks')
    ) {
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
  }, [stocksStatus, dispatch, stocks, summaryStatus, summary]);

  useEffect(() => {
    if (
      p2pStatus === 'idle' &&
      summaryStatus === 'succeeded' &&
      summary.stats.length > 0 &&
      summary.stats.find((item) => item.alias === 'p2p')
    ) {
      dispatch(fetchP2P());
    }
    if (
      p2pStatus === 'succeeded' &&
      summary.stats.length > 0 &&
      summary.stats.find((item) => item.alias === 'p2p')
    ) {
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
  }, [p2pStatus, dispatch, p2p, summaryStatus, summary]);

  useEffect(() => {
    if (
      miscStatus === 'idle' &&
      summaryStatus === 'succeeded' &&
      summary.stats.length > 0 &&
      summary.stats.find((item) => item.alias === 'misc')
    ) {
      dispatch(fetchMisc());
    }
    if (
      miscStatus === 'succeeded' &&
      summary.stats.length > 0 &&
      summary.stats.find((item) => item.alias === 'misc')
    ) {
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
  }, [miscStatus, dispatch, misc, summaryStatus, summary]);

  useEffect(() => {
    if (
      commoditiesStatus === 'idle' &&
      summaryStatus === 'succeeded' &&
      summary.stats.length > 0 &&
      summary.stats.find((item) => item.alias === 'commodities')
    ) {
      dispatch(fetchCommodities());
    }
    if (
      commoditiesStatus === 'succeeded' &&
      summary.stats.length > 0 &&
      summary.stats.find((item) => item.alias === 'commodities')
    ) {
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
  }, [commoditiesStatus, dispatch, commodities, summaryStatus, summary]);

  useEffect(() => {
    if (
      etfStatus === 'idle' &&
      summaryStatus === 'succeeded' &&
      summary.stats.length > 0 &&
      summary.stats.find((item) => item.alias === 'etf')
    ) {
      dispatch(fetchETFs());
    }
    if (
      etfStatus === 'succeeded' &&
      summary.stats.length > 0 &&
      summary.stats.find((item) => item.alias === 'etf')
    ) {
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
  }, [etfStatus, dispatch, etf, summaryStatus, summary]);

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
            <WatchListWithChart
              assets={summary}
              category=""
              loading={summaryStatus}
              totalBalance={totalBalance}
              totalDifference={totalDifference}
              totalSumsInDifferentInCurrencies={
                totalSumsInDifferentInCurrencies
              }
              crypto={crypto.sums}
              stocks={stocks.sums}
              p2p={p2p.sums}
              etf={etf.sums}
              misc={misc.sums}
              commodities={commodities.sums}
            />
          </Grid>
          {summary.stats.length > 0 && (
            <Grid item xs={12}>
              <WatchList
                categories={summary.stats}
                crypto={crypto.sums}
                cryptoLoading={cryptoStatus}
                stocks={stocks.sums}
                stocksLoading={stocksStatus}
                p2p={p2p.sums}
                p2pLoading={p2pStatus}
                etf={etf.sums}
                etfLoading={etfStatus}
                misc={misc.sums}
                miscLoading={miscStatus}
                commodities={commodities.sums}
                commoditiesLoading={commoditiesStatus}
                history={history}
              />
            </Grid>
          )}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Overview;
