import { useEffect, useState } from 'react';
import { Card } from '@mui/material';
import { CryptoOrder } from 'src/models/crypto_order';
import { Asset } from 'src/models/assets';
import RecentOrdersTable from './RecentOrdersTable';
import { subDays } from 'date-fns';
import { getAssets } from '../../../utils/api/assetsApiFunction';

function RecentOrders() {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAssets();
      setAssets([...result.data.assets]);
    };

    fetchData();
  }, []);

  return (
    <Card>
      <RecentOrdersTable assets={assets} />
    </Card>
  );
}

export default RecentOrders;
