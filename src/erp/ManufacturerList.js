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
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TablePagination from '@mui/material/TablePagination';
import { Link,useNavigate } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import ManufacturerSearch from '../search/ManufacturerSearch';
import FinishedAlert from '../finishView/FinishedAlert';


const API_PATH = process.env.REACT_APP_API_PATH;

const columnVisibilityModel = {
  id:true
}

export default function ManufacturerList() {
  LicenseInfo.setLicenseKey('9af075c09b5df7441264261f25d3d08eTz03ODI4MyxFPTE3MzEwNzgzMTkwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filterRows,setFilterRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [moneyOpen, setMoneyOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [okOpen,setOkopen] = useState(false);
  const [newPw,setNewPw] = useState('');

  const [request, setRequest] = useState({
    id : 0,
    account: "",
    password: "",
    name: "",
    servicePercentage: 0,
    stockAmount: 0,
    safeAmount: 0,
    sort: 0,
    startDate: dayjs(),
    endDate: dayjs().add(1, 'year'),
  });
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: '名稱',
      width: 120,
      editable: false,
    },
    {
      field: 'account',
      headerName: '帳號',
      width: 70,
      editable: false,
    },
    {
      field: 'servicePercentage',
      headerName: '服務費%數',
      width: 120,
      editable: false,
    },
    {
      field: 'stockAmount',
      headerName: '剩餘安全量',
      width: 120,
      editable: false,
    },
    {
      field: 'safeAmount',
      headerName: '目前安全量',
      width: 120,
      editable: false,
    },
    {
      field: 'sort',
      headerName: '商城排序',
      width: 70,
      editable: false,
    },
    {
      field: 'status',
      headerName: '狀態',
      width: 120,
      editable: false,
    },
    {
      field: 'startDate',
      headerName: '合約起始',
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
      field: 'endDate',
      headerName: '合約截止',
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
      field: 'creator',
      headerName: '創造者',
      sortable: false,
      width: 160,
    },   
    {
      field: 'createDate',
      headerName: '創建時間',
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
      field: 'editor',
      headerName: '修改者',
      sortable: false,
      width: 160,
    },   
    {
      field: 'editDate',
      headerName: '修改時間',
      width: 180,
      editable: false,
      valueFormatter: (params) => { 
        if(params.value) {
          const date = new Date(params.value);
          const minutes = (`0${  date.getMinutes()}`).slice(-2); 
          const hours = (`0${  date.getHours()}`).slice(-2);     
          return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes}`;
        }
          return null;      
      }, 
    },
    {
      field: 'Operation',
      headerName: '操作',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton aria-label="reset" onClick={() => resetManufacturerAdminPassword(params.row.id)}>
            <LockResetIcon />
          </IconButton>
          <IconButton aria-label="edit" onClick={() => handleOpenForm('edit',params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDeleteSubmit(params.row.id)}>
            <DeleteIcon />
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

  const handleDeleteSubmit = async (id) => {
    // 使用 confirm 对话框要求用户确认
    if (window.confirm("確認刪除嗎? 該廠商所有賞品訂單資料都將刪除 請謹慎操作")) {
        try {
            const response = await axios.delete(`${API_PATH}/super/manufacturerAdmin?id=${id}`);
            if (response.status === 200) {
                fetchData();
            }
        } catch (error) {
            console.error("Error deleting record:", error);
            alert('請確認資料型態有無錯誤');
        }
    }
};
  
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_PATH}/super/manufacturerAdmins?pageNumber=${page+1}&pageSize=${rowsPerPage}`);
  
      if (response.status === 200) { 
        setRows(response.data.source);
        setFilterRows(response.data.source);
        setTotalRows(response.data.totalRows)
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
  const handleOkOpen = () => {
    setOkopen(true);
  }
  // eslint-disable-next-line consistent-return
  const resetManufacturerAdminPassword = async (manufacturerId) => {
    // 弹出确认对话框
    const confirmReset = window.confirm("您確定要重製該廠商密碼？");
    if (!confirmReset) {
      return; // 如果用户点击“取消”，则不执行任何操作
    }
  
    try {
      const response = await axios.put(`${API_PATH}/super/manufacturerpw?manufacturerId=${manufacturerId}`);
      if (response.status === 200) {
        setNewPw(response.data.source); // 设置新密码
        handleOkOpen(); // 打开一个成功提示的对话框或其他反馈机制
      }
    } catch (error) {
      console.error('Failed to reset password', error.response || error);
      alert('重製該廠商密碼失敗：');
      throw error; // 抛出错误，允许调用者知道操作失败
    }
  }
  const handleMoneyOpenForm = async (row) => {
      setRequest({
        id : row.id,
        account: row.account,
        password: row.password,
        name: row.name,
        servicePercentage: row.servicePercentage,
        stockAmount: row.stockAmount,
        safeAmount: row.safeAmount,
        sort: row.sort,
        startDate: dayjs(row.startDate),
        endDate: dayjs(row.endDate),
      });
    
    setMoneyOpen(true);
  };

  const handleMoenyCloseForm = async () => {
    setMoneyOpen(false);
  };
  const handleOpenForm = async (model,row) => {
    if(model === 'create'){
      setRequest({
        id : 0,
        account: "",
        password: "",
        name: "",
        servicePercentage: 0,
        stockAmount: 0,
        safeAmount: 0,
        sort: 0,
        startDate: dayjs(),
        endDate: dayjs().add(1, 'year'),
      });
    }
    if(model === 'edit'){
      setRequest({
        id : row.id,
        account: row.account,
        password: row.password,
        name: row.name,
        servicePercentage: row.servicePercentage,
        stockAmount: row.stockAmount,
        safeAmount: row.safeAmount,
        sort: row.sort,
        startDate: dayjs(row.startDate),
        endDate: dayjs(row.endDate),
      });
    }
    setOpen(true);
  };

  const handleCloseForm = async () => {
    setOpen(false);
  };

  const handleInputChange = (event, propertyName) => {
    console.log(event)
    console.log(propertyName)
    if(propertyName === "startDate" || propertyName === "endDate" ) {
      setRequest((prevData) => ({
        ...prevData,
        [propertyName]:dayjs(event).format('YYYY-MM-DD')
      }));
    }else {
      const value = event.target.value;
      setRequest((prevData) => ({
        ...prevData,
        [propertyName]: value,
      }));
    }
  };

  const handleSubmit = async () => {    
    try {
        const response = await axios.post(`${API_PATH}/super/manufacturerAdmin`, request);
        if (response.status === 200) {
          alert('成功');
          handleCloseForm();
          fetchData();
        }
    } catch (error) {
      alert(error.response.data)
    }                    
  }

// eslint-disable-next-line consistent-return
const updateManufacturerMoney = async () => {
    const requestData = {
        id:request.id,
        Money: request.stockAmount
    };
    try {
        const response = await axios.put(`${API_PATH}/super/money`, requestData);

        if (response.status === 200) {
          handleMoenyCloseForm();
          await fetchData();
        }
    } catch (error) {
        alert(error.response.data)
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
                    廠商列表 
                </Typography>
            </Grid>
            <ManufacturerSearch rows={rows} setFilterRows={setFilterRows}/>
            <Button onClick={() =>handleOpenForm('create')} startIcon={<AddCircleOutlineIcon/>}>新增廠商</Button>  
      </Grid>
      <DataGridPro
        rows={filterRows}
        columns={columns}
        disableRowSelectionOnClick
        onCellDoubleClick={handleMoneyOpenForm}
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
          PaperProps={{
            style: {
              width: '600px',
            },
          }}
      >
        <DialogTitle style={{justifyContent:'center',display:'flex',fontSize:'16px'}}>{request.id === 0?'新增廠商':'修改廠商'}</DialogTitle>
        <DialogContent>
            <Box sx={{ flexGrow: 0 }}>
                <Grid container spacing={2}>.                  
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                        <TextField
                        fullWidth 
                        id="outlined-number"
                        size="small"
                        label="廠商名稱"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={request.name}
                        onChange={(e) => handleInputChange(e, 'name')}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                        <TextField
                        fullWidth 
                        id="outlined-number"
                        size="small"
                        label="帳號"
                        InputLabelProps={{
                            shrink: true,
                        }}                     
                        value={request.account}
                        onChange={(e) => handleInputChange(e, 'account')}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                        <TextField
                        fullWidth 
                        id="outlined-number"
                        size="small"
                        label="密碼"
                        InputLabelProps={{
                            shrink: true,
                        }}                     
                        disabled={request.id !== 0}
                        value={request.password}
                        onChange={(e) => handleInputChange(e, 'password')}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                        <TextField
                        fullWidth 
                        id="outlined-number"
                        size="small"
                        label="服務費%數"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={request.servicePercentage}
                        onChange={(e) => handleInputChange(e, 'servicePercentage')}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                        <TextField
                        fullWidth 
                        id="outlined-number"
                        size="small"
                        label="剩餘安全量"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled
                        value={request.stockAmount}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                        <TextField
                        fullWidth 
                        id="outlined-number"
                        size="small"
                        label="安全量門檻"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={request.safeAmount}
                        onChange={(e) => handleInputChange(e, 'safeAmount')}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                        <TextField
                        fullWidth 
                        id="outlined-number"
                        size="small"
                        label="商城排序"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={request.sort}
                        onChange={(e) => handleInputChange(e, 'sort')}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Start Date"
                          value={dayjs(request.startDate)}
                          onChange={(e) => handleInputChange(e, 'startDate')}
                          renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker
                          label="End Date"
                          value={dayjs(request.endDate)}
                          onChange={(e) => handleInputChange(e, 'endDate')}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                </Grid>
            </Box> 
        </DialogContent>
        <DialogActions>
              <Button onClick={handleSubmit}>送出</Button>  
              <Button onClick={handleCloseForm}>取消</Button>  
        </DialogActions>
      </Dialog>

      <Dialog open={moneyOpen} 
          BackdropProps={{
            style: {
              backgroundColor: 'transparent',
            },
          }}
          PaperProps={{
            style: {
              width: '200px',
            },
          }}
      >
        <DialogTitle style={{justifyContent:'center',display:'flex',fontSize:'16px'}}>派發安全代幣</DialogTitle>
        <DialogContent>
            <Box sx={{ flexGrow: 0 }}>
                <Grid container spacing={2}>.                  
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                        <TextField
                        fullWidth 
                        id="outlined-number"
                        size="small"
                        label="剩餘安全量"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => handleInputChange(e, 'stockAmount')}
                        value={request.stockAmount}
                        />
                    </Grid>
                </Grid>
            </Box> 
        </DialogContent>
        <DialogActions>
              <Button onClick={updateManufacturerMoney} startIcon={<AttachMoneyIcon/>}>取消</Button>  
              <Button onClick={handleMoenyCloseForm} startIcon={<CancelIcon/>}>取消</Button>  
        </DialogActions>
      </Dialog>
      <FinishedAlert okOpen={okOpen} handleOkClose={()=>setOkopen(false)} title={'操作成功'} message={`新密碼為:${newPw}`}/>
    </>
  );
}

