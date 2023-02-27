import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function CollapsibleTableSkeleton() {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>{t('Asset')}</TableCell>
            <TableCell align="right">{t('Current Price')}</TableCell>
            <TableCell align="right">{t('Average Net Cost')}</TableCell>
            <TableCell align="right">{t('Holdings')}</TableCell>
            <TableCell align="right">{t('P&L')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {Array(10)
            .fill(0)
            .map((n, i) => {
              return (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Skeleton
                      variant="text"
                      sx={{
                        fontSize: '1rem',
                        paddingTop: '11px',
                        paddingBottom: '11px'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: '1rem', textAlign: 'right' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
