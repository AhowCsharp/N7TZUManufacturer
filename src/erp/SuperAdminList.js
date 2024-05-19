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

const columnVisibilityModel = {
  id:true
}

export default function SuperAdminList() {
  LicenseInfo.setLicenseKey('9af075c09b5df7441264261f25d3d08eTz03ODI4MyxFPTE3MzEwNzgzMTkwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filterRows,setFilterRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState({
    id : 0,
    name : '',
    authType : 1,
    account : '',
    password : '',
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
      width: 120,
      editable: false,
    },
    {
      field: 'authType',
      headerName: '權限',
      width: 70,
      editable: false,
      valueFormatter: (params) => params.value === 1 ? '超級' : '一般',
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
      width: 120,
      renderCell: (params) => (
        <>
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

  const handleDeleteSubmit = async (id) => {
    try {
        const response = await axios.delete(`${API_PATH}/businessman`, {
            params: { id }
        });

        if (response.status === 200) {
            fetchData();
        }
    } catch (error) {
        console.error("Error deleting record:", error);
        alert('請確認資料型態有無錯誤')
    }
  }
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_PATH}/super/admins`);
  
      if (response.status === 200) { 
        setRows(response.data.source);
        setFilterRows(response.data.source);
      }
    } catch (error) {
      alert(error.response.data)
    }
  };
  const handleOpenForm = async (model,row) => {
    if(model === 'create'){
      setRequest({
        id : 0,
        name : '',
        authType : 1,
        account: parseInt(sessionStorage.getItem('StoreId'),10),
        password : '',
      });
    }
    if(model === 'edit'){
      setRequest({
        id : row.id,
        name : row.name,
        authType : row.authType,
        account:row.account,
        password : row.password ,
      });
    }
    setOpen(true);
  };

  const handleCloseForm = async () => {
    setOpen(false);
  };

  const handleInputChange = (event, propertyName) => {
    const value = event.target.value;
    setRequest((prevData) => ({
      ...prevData,
      [propertyName]: value,
    }));
  };

  const handleSubmit = async () => {    
    try {
        const response = await axios.post(`${API_PATH}/super/admin`, request);
        if (response.status === 200) {
          alert('成功');
          handleCloseForm();
          fetchData();
        }
    } catch (error) {
      alert(error.response.data)
    }                    
  }

  useEffect(() => {
    fetchData();
  }, []); 


  return (
    <>
    <Box sx={{ height: 600, width: '90%',margin:'auto' }}>
      <Grid container spacing={2} style={{marginBottom:'1%'}}>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h2" component="h2">
                    管理者列表 
                </Typography>
            </Grid>
            <SuperAdminSearch rows={rows} setFilterRows={setFilterRows}/>
            <Button onClick={() =>handleOpenForm('create')} startIcon={<AddCircleOutlineIcon/>}>新增平台管理者</Button>  
      </Grid>
      <DataGridPro
        rows={filterRows}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[100,75,50]}
        disableRowSelectionOnClick
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
              width: '300px',
            },
          }}
      >
        <DialogTitle style={{justifyContent:'center',display:'flex',fontSize:'16px'}}>{request.id === 0?'新增平台管理者':'修改平台管理者'}</DialogTitle>
        <DialogContent>
            <Box sx={{ flexGrow: 0 }}>
                <Grid container spacing={2}>.                  
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                        <TextField
                        fullWidth 
                        id="outlined-number"
                        size="small"
                        label="管理者名稱"
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
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex',marginRight:'10px' }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">權限</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={request.authType}
                          onChange={(e) => handleInputChange(e, 'authType')}
                        >
                          <MenuItem value={1}>超級</MenuItem>
                          <MenuItem value={0}>一搬</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                </Grid>
            </Box> 
        </DialogContent>
        <DialogActions>
              <Button onClick={handleSubmit}>送出</Button>  
              <Button onClick={handleCloseForm}>取消</Button>  
        </DialogActions>
      </Dialog>
    </>
  );
}