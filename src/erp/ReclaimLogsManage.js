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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import dayjs from 'dayjs';
import { FormControl, InputLabel, Select, MenuItem,useMediaQuery,IconButton } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TablePagination from '@mui/material/TablePagination';
import { Link,useNavigate } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import OrderSearch from '../search/OrderSearch';
import FinishedAlert from '../finishView/FinishedAlert';


const API_PATH = process.env.REACT_APP_API_PATH;

const columnVisibilityModel = {
  id:true
}

export default function ReclaimLogsManage() {
  LicenseInfo.setLicenseKey('9af075c09b5df7441264261f25d3d08eTz03ODI4MyxFPTE3MzEwNzgzMTkwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filterRows,setFilterRows] = useState([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [start,setStart] =useState(dayjs().add(-20,'day'))
  const [end,setEnd] =useState(dayjs().add(10,'day'))
  const [prizeName,setPrizeName] =useState('')

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'prizeName',
      headerName: '獎品名稱',
      width: 180,
      editable: false,
    },
    {
      field: 'money',
      headerName: '回收金額',
      width: 120,
      editable: false,
    },
    {
      field: 'reclaimDate',
      headerName: '回收日期',
      width: 180,
      editable: false,
      valueFormatter: (params) => {
        if (!params.value) {
          return '';
        }
        const date = new Date(params.value);
        const minutes = (`0${date.getMinutes()}`).slice(-2);
        const hours = (`0${date.getHours()}`).slice(-2);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes}`;
      },
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_PATH}/manufacturer/reclaimlogs?start=${start.format('YYYY-MM-DD')}&end=${end.format('YYYY-MM-DD')}&prizeName=${prizeName}&pageNumber=${page+1}&pageSize=${rowsPerPage}`);
      if (response.status === 200) { 
        setRows(response.data.source);
        setFilterRows(response.data.source);
        setTotalRows(response.data.totalItemCount)
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      if (error.response && error.response.status === 401) {
        // Unauthorized
        navigate('/login', { replace: true });
      } else {
        alert('權限不足 跳回登入頁');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [page,rowsPerPage]); 

  return (
    <>
    <Box sx={{ height: 600, width: '90%',margin:'auto' }}>
      <Grid container spacing={2} style={{marginBottom:'1%'}}>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h2" component="h2">
                    回收列表 
                </Typography>
            </Grid>    
            {/* <Grid item xs={3} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h6" component="h6">
                    銷售總額 {saleAmount}
                </Typography>
            </Grid> 
            <Grid item xs={3} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h6" component="h6">
                    平台服務費 {serviceFee}
                </Typography>
            </Grid> 
            <Grid item xs={3} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h6" component="h6">
                    運費總額 {freight}
                </Typography>
            </Grid> 
            <Grid item xs={3} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h6" component="h6">
                    實收金額 {realGetAmount}
                </Typography>
            </Grid>     */}
            <Grid item xs={5} sx={{ mt: 0,mr:1 }} style={{justifyContent:'center',display:'flex' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="起始日"
                  value={start}
                  onChange={(e) => setStart(dayjs(e))}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                  label="終止日"
                  value={end}
                  onChange={(e) => setEnd(dayjs(e))}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={2} style={{display:'flex',justifyContent:'center'}}>      
              <TextField
                fullWidth 
                id="outlined-number"
                size="small"
                label="獎品名稱"
                InputLabelProps={{
                    shrink: true,
                }}
                value={prizeName}
                onChange={(e) => setPrizeName(e.target.value)}
                />
            </Grid>
            <Button startIcon={<SearchIcon/>} onClick={fetchData}>搜尋</Button>  
      </Grid>
      <DataGridPro
        rows={filterRows}
        columns={columns}
        disableRowSelectionOnClick
        // onCellDoubleClick={handleMoneyOpenForm}
      />
      <TablePagination
      component="div"
      count={totalRows}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[50,100,200,500]} 
      />
    </Box>
    </>
  );
}

