import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import { QueryResponse } from '../../types';

interface ResultVisualizationProps {
  result: QueryResponse | null;
}

const ResultVisualization: React.FC<ResultVisualizationProps> = ({ result }) => {
  if (!result) return null;

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Query Results
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Query: {result.query}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Display the result */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Result
        </Typography>
        <Box 
          sx={{ 
            p: 2, 
            backgroundColor: 'grey.100', 
            borderRadius: 1,
            overflow: 'auto'
          }}
        >
          {typeof result.result === 'object' 
            ? <pre>{JSON.stringify(result.result, null, 2)}</pre>
            : <Typography>{result.result}</Typography>
          }
        </Box>
      </Box>
      
      {/* Display metadata if available */}
      {result.metadata && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Metadata
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Execution time: {result.metadata.execution_time}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Data sources: {result.metadata.data_sources?.join(', ')}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ResultVisualization;