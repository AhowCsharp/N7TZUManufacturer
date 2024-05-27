import { useState,useRef,useEffect,useCallback} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { LicenseInfo,DataGridPro } from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link,useNavigate } from 'react-router-dom';

import SuperAdminSearch from '../search/SuperAdminSearch';



const API_PATH = process.env.REACT_APP_API_PATH;

export default function ManufacturerInfo() {
  const navigate = useNavigate();
  const [request, setRequest] = useState({
    id: 0,
    account: "",
    name: "",
    servicePercentage: 0,
    stockAmount: 0,
    safeAmount: 0,
    sort: 0,
    startDate: "",
    endDate: "",
  });
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_PATH}/manufacturer/info?id=${localStorage.getItem('id')}`); 
      if (response.status === 200) { 
        setRequest(prevRequest => ({
          ...prevRequest,
          account: response.data.source.account,
          name: response.data.source.name,
          servicePercentage: response.data.source.servicePercentage,
          stockAmount: response.data.source.stockAmount,
          safeAmount: response.data.source.safeAmount,
          sort: response.data.source.sort,
          startDate: response.data.source.startDate,
          endDate: response.data.source.endDate,
        }));
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      if (error.response && error.response.status === 401) {
        // Unauthorized
        navigate('/login', { replace: true });
      } else {
        alert('發生錯誤');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', { // Using 'en-CA' to get the format YYYY-MM-DD
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  useEffect(() => {
    fetchData()
  }, []); 


  return (
    <>
      <Box sx={{ height: 600, width: '90%',margin:'auto' }}>
        <Box sx={{ flexGrow: 0 }}>
          <Grid container spacing={2}>.                  
              <Grid item xs={4} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                  <TextField
                  fullWidth 
                  id="outlined-number"
                  size="small"
                  label="廠商名稱"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={request.name}
                  />
              </Grid>
              <Grid item xs={4} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                  <TextField
                  fullWidth 
                  id="outlined-number"
                  size="small"
                  label="帳號"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={request.account}
                  />
              </Grid>
              <Grid item xs={4} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                  <TextField
                  fullWidth 
                  id="outlined-number"
                  size="small"
                  label="服務費趴數"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={request.servicePercentage}
                  />
              </Grid>
              <Grid item xs={4} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                  <TextField
                  fullWidth 
                  id="outlined-number"
                  size="small"
                  label="安全量門檻"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={request.safeAmount}
                  />
              </Grid>
              <Grid item xs={4} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                  <TextField
                  fullWidth 
                  id="outlined-number"
                  size="small"
                  error = {request.stockAmount < request.safeAmount}
                  label="目前剩餘安全量"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={request.stockAmount}
                  />
              </Grid>
              <Grid item xs={4} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                  <TextField
                  fullWidth 
                  id="outlined-number"
                  size="small"
                  label="合約起始"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={formatDate(request.startDate)}
                  />
              </Grid>
              <Grid item xs={4} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                  <TextField
                  fullWidth 
                  id="outlined-number"
                  size="small"
                  label="合約截止"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={formatDate(request.endDate)}
                  />
              </Grid>
            </Grid>
          </Box> 
      </Box> 
    </>
  );
}