import * as React from 'react';

import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';

import Typography from '@mui/material/Typography';


export default function CaseCard(props) {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {props.title}
        </Typography>
        <Typography variant="h5" component="div">
            {props.subtitle}
        </Typography>
        
        <Typography variant="body2">
          Confirmed: {props.confirmed}
        </Typography>

        <Typography variant="body2">
          Deaths: {props.deaths}
        </Typography>
      </CardContent>
      
    </Card>
  );
}
