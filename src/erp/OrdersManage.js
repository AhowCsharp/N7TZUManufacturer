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

export default function OrdersManage() {
  LicenseInfo.setLicenseKey('9af075c09b5df7441264261f25d3d08eTz03ODI4MyxFPTE3MzEwNzgzMTkwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filterRows,setFilterRows] = useState([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [start,setStart] =useState(dayjs())
  const [end,setEnd] =useState(dayjs().add(10,'day'))
  const [status,setStatus] =useState(1)
  const [name,setName] = useState('');
  const [orderNo,setOrderNo] = useState('');
  const [orderId,setOrderId] = useState(0);
  const [manufacturerMemo,setManufacturerMemo] = useState('');
  const [orderStatus,setOrderStatus] = useState(1);
  const [logisticsNo,setLogisticsNo] = useState('');
  const [shippingDetails,setShippingDetails] = useState([]);

  const [open,setOpen] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'orderNo',
      headerName: '訂單編號',
      width: 120,
      editable: false,
    },
    {
      field: 'customerName',
      headerName: '顧客名稱',
      width: 120,
      editable: false,
    },
    {
      field: 'shipWay',
      headerName: '寄送方式',
      width: 80,
      editable: false,
      renderCell: (params) => {
        let statusText;
        switch (params.value) {
          case 0:
            statusText = '宅配';
            break;
          case 1:
            statusText = '7-11';
            break;
          case 2:
            statusText = '全家';
            break;
          default:
            statusText = '未知';
        }
        return statusText;
      },
    },
    {
      field: 'zipCode',
      headerName: '郵遞區號',
      width: 80,
      editable: false,
    },
    {
      field: 'shipAddress',
      headerName: '寄送地址',
      width: 150,
      editable: false,
    },
    {
      field: 'convenienceStoreName',
      headerName: '超商店名',
      width: 120,
      editable: false,
    },
    {
      field: 'convenienceStoreAddress',
      headerName: '超商地址',
      width: 120,
      editable: false,
    },
    {
      field: 'logisticsNo',
      headerName: '物流編號',
      width: 120,
      editable: false,
    },
    {
      field: 'status',
      headerName: '狀態',
      width: 80,
      editable: false,
      renderCell: (params) => {
        let statusText;
        switch (params.value) {
          case 0:
            statusText = '待寄出';
            break;
          case 1:
            statusText = '已寄出';
            break;
          case -1:
            statusText = '資料不正確';
            break;
          default:
            statusText = '未知';
        }
        return statusText;
      },
    },
    {
      field: 'memo',
      headerName: '顧客備註',
      width: 120,
      editable: false,
    },
    {
      field: 'manufacturerMemo',
      headerName: '廠商備註',
      width: 120,
      editable: false,
    },
    {
      field: 'orderDate',
      headerName: '訂單日期',
      width: 180,
      editable: false,
      valueFormatter: (params) => { 
        const date = new Date(params.value || new Date());
        const minutes = (`0${  date.getMinutes()}`).slice(-2); 
        const hours = (`0${  date.getHours()}`).slice(-2);     
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes}`;
      }, 
    },
    {
      field: 'shipDate',
      headerName: '配送日期',
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
    {
      field: 'Operation',
      headerName: '操作',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton aria-label="reset">
            <LocalShippingIcon onClick={() => handleOrderClickOpen(params.row)}/>
          </IconButton>
        </>
  
      ),
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
      const response = await axios.get(`${API_PATH}/manufacturer/orders?start=${start.format('YYYY-MM-DD')}&end=${end.format('YYYY-MM-DD')}&name=${name}&orderNo=${orderNo}&status=${status}&pageNumber=${page+1}&pageSize=${rowsPerPage}`);
  
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
  const handleOrderClickOpen = (row) => {
    setOrderId(row.id);
    setShippingDetails(row.shippingDetails);
    setOpen(true);
  };

  const handleSubmit = async () => {    
    const request = {
      OrderId:orderId,
      ManufacturerMemo:manufacturerMemo,
      Status:orderStatus,
      LogisticsNo:logisticsNo,
    }

    try {
      const response = await axios.put(`${API_PATH}/manufacturer/order`, request);
      if (response.status === 200) {
        alert('成功');
        setOpen(false);
        fetchData();
      }
    } catch (error) {
      alert(error.response?.data || '提交失败');
    }        
}
 

  useEffect(() => {
    fetchData();
  }, [page,rowsPerPage]); 

  return (
    <>
    <Box sx={{ height: 600, width: '90%',margin:'auto' }}>
      <Grid container spacing={2} style={{marginBottom:'1%'}}>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h2" component="h2">
                    訂單列表 
                </Typography>
            </Grid>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <OrderSearch rows={rows} setFilterRows={setFilterRows}/>
            </Grid>          
            <Grid item xs={2} style={{display:'flex',justifyContent:'center'}}>      
              <TextField
                fullWidth 
                id="outlined-number"
                size="small"
                label="顧客名稱"
                InputLabelProps={{
                    shrink: true,
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </Grid>
            <Grid item xs={2} style={{display:'flex',justifyContent:'center'}}>      
              <TextField
                fullWidth 
                id="outlined-number"
                size="small"
                label="訂單號碼"
                InputLabelProps={{
                    shrink: true,
                }}
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                />
            </Grid>
            <Grid item xs={5} sx={{ mt: 0 }} style={{justifyContent:'center',display:'flex' }}>
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
            <Grid item xs={3} style={{display:'flex',justifyContent:'center'}}>      
              <FormControl style={{marginRight:'0%'}}>
                <InputLabel id="stock-amount-label">訂單狀態</InputLabel>
                <Select
                  labelId="stock-amount-label"
                  id="stock-amount-select"
                  value={status}
                  label="訂單狀態"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value={1}>已寄出</MenuItem>
                  <MenuItem value={0}>待寄出</MenuItem>
                  <MenuItem value={-1}>資料不正確</MenuItem>
                </Select>
              </FormControl>
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
    <Dialog open={open} 
          BackdropProps={{
            style: {
              backgroundColor: 'transparent',
            },
          }}
      >
        <DialogTitle style={{justifyContent:'center',display:'flex',fontSize:'16px'}}>修改訂單狀態</DialogTitle>
        <DialogContent>
            <Box sx={{ flexGrow: 0 }}>
                <Grid container spacing={2}>.                  
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                        <TextField
                        fullWidth 
                        id="outlined-number"
                        size="small"
                        label="廠商備註"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={manufacturerMemo}
                        onChange={(e) => setManufacturerMemo(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                        <TextField
                        fullWidth 
                        id="outlined-number"
                        size="small"
                        label="物流編號"
                        InputLabelProps={{
                            shrink: true,
                        }}                     
                        value={logisticsNo}
                        onChange={(e) => setLogisticsNo(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                      <FormControl style={{marginRight:'0%'}}>
                        <InputLabel id="stock-amount-label">訂單狀態</InputLabel>
                        <Select
                          labelId="stock-amount-label"
                          id="stock-amount-select"
                          value={orderStatus}
                          label="訂單狀態"
                          onChange={(e) => setOrderStatus(e.target.value)}
                        >
                          <MenuItem value={1}>已寄出</MenuItem>
                          <MenuItem value={0}>待寄出</MenuItem>
                          <MenuItem value={-1}>資料不正確</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {shippingDetails.map((data) => (
                          <ListItem
                            key={data.id}
                            disableGutters
                            // secondaryAction={
                            //   <IconButton aria-label="comment">
                            //     <CommentIcon />
                            //   </IconButton>
                            // }
                          >
                            <ListItemText primary={`獎品名稱: ${data.prizeName}`} />
                            <ListItemText primary={`寄送數量: ${data.amount}`} />
                          </ListItem>
                          
                        ))}
                      </List>
                    </Grid>
                </Grid>
            </Box> 
        </DialogContent>
        <DialogActions>
              <Button onClick={handleSubmit}>送出</Button>  
              <Button onClick={() =>setOpen(false)}>取消</Button>  
        </DialogActions>
      </Dialog>

    </>
  );
}

