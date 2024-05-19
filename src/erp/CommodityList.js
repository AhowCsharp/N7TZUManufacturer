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
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import Autocomplete from '@mui/material/Autocomplete';
import { Link,useNavigate } from 'react-router-dom';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CancelIcon from '@mui/icons-material/Cancel';
import CommoditySearch from '../search/CommoditySearch';



const API_PATH = process.env.REACT_APP_API_PATH;

const columnVisibilityModel = {
  id:true
}

export default function CommodityList() {
  LicenseInfo.setLicenseKey('9af075c09b5df7441264261f25d3d08eTz03ODI4MyxFPTE3MzEwNzgzMTkwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filterRows,setFilterRows] = useState([]);
  const [statusOpen, setStatusOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [status,setStatus] = useState(1);
  const [commodityId,setCommodityId] = useState(null);
  const [options, setOptions] = useState([]);
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'imgUrl',
      headerName: '圖片',
      width: 70,
      editable: false,
    },
    {
      field: 'manufacturerName',
      headerName: '廠商',
      width: 120,
      editable: false,
    },
    {
      field: 'commodityUid',
      headerName: '商品編號',
      width: 70,
      editable: false,
    },
    {
      field: 'name',
      headerName: '賞品名稱',
      width: 120,
      editable: false,
    },
    {
      field: 'category',
      headerName: '賞品類別',
      width: 120,
      editable: false,
    },
    {
      field: 'status',
      headerName: '狀態',
      width: 120,
      editable: false,
      valueFormatter: (params) => {
        switch (params.value) {
          case 1:
            return '上架中';
          case 2:
            return '下架中';
          case 3:
            return '準備中';
          case 4:
            return '未知';
          case 5:
            return '未知';
          default:
            return '未知';
        }
      },
    },
    {
      field: 'totalDrawOutTimes',
      headerName: '總抽籤數',
      width: 70,
      editable: false,
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
    // {
    //   field: 'Operation',
    //   headerName: '操作',
    //   width: 120,
    //   renderCell: (params) => (
    //     <>
    //       <IconButton aria-label="edit" onClick={() => handleOpenForm('edit',params.row)}>
    //         <EditIcon />
    //       </IconButton>
    //       <IconButton aria-label="delete" onClick={() => handleDeleteSubmit(params.row.id)}>
    //         <DeleteIcon />
    //       </IconButton>
    //     </>
  
    //   ),
    // },
  ];
  const [selectedOption, setSelectedOption] = useState({
    id: 2,
    name: "ddd"
});
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleManufacturerChange = (event, newValue) => {
    setSelectedOption(newValue);
  };

  const fetchManufacturerOptionsData = async () => {
    try {
      const response = await axios.get(`${API_PATH}/super/manufacturerAdmins?pageNumber=${1}&pageSize=${500000}`);
      if (response.status === 200) { 
        setOptions(response.data.source);
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
  
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_PATH}/super/commodities?manufacturerId=${selectedOption.id}&pageNumber=${page+1}&pageSize=${rowsPerPage}`);
  
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
  const handleStatusOpenForm = async (row) => {
    setCommodityId(row.id)
    setStatusOpen(true);
  };

  const handleStatusCloseForm = async () => {
    setStatusOpen(false);
  };

const updateCommodityStatus = async () => {
    try {
      // 发送 PUT 请求
      const response = await axios.put(`${API_PATH}/super/status?id=${commodityId}&status=${status}`);
      // 处理响应
      if (response.status === 200) {
        handleStatusCloseForm();
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to update status:', error.response ? error.response.data : 'Unknown error');
      throw error;
    }
};

useEffect(() => {
  fetchData();
  fetchManufacturerOptionsData();
}, [page, rowsPerPage,selectedOption]); 


  return (
    <>
    <Box sx={{ height: 600, width: '90%',margin:'auto' }}>
      <Grid container spacing={2} style={{marginBottom:'1%'}}>
            <Grid item xs={12} style={{display:'flex',justifyContent:'center'}}>      
                <Typography variant="h2" component="h2">
                    賞品列表 
                </Typography>
            </Grid>
            <Grid item xs={12} style={{display:'flex'}}>  
              <Typography variant="h6" component="h6">
                  選擇廠商 : 
              </Typography>    
            </Grid>
            <Grid item xs={10} style={{display:'flex'}}>  
              <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={options}
                  sx={{ width: '20%',marginLeft:'3%' }}
                  value={selectedOption}
                  onChange={handleManufacturerChange}
                  getOptionLabel={(option) => `${option.id}-廠商 : ${option.name}`}
                  // 设置renderInput来渲染输入元件，并确保输入框的id与label的htmlFor相匹配
                  renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={12} style={{display:'flex'}}>  
              <CommoditySearch rows={rows} setFilterRows={setFilterRows}/> 
            </Grid>
      </Grid>
      <DataGridPro
        rows={filterRows}
        columns={columns}
        disableRowSelectionOnClick
        onCellDoubleClick={handleStatusOpenForm}
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
      <Dialog open={statusOpen} 
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
        <DialogTitle style={{justifyContent:'center',display:'flex',fontSize:'16px'}}>商品狀態修改</DialogTitle>
        <DialogContent>
            <Box sx={{ flexGrow: 0 }}>
                <Grid container spacing={2}>.                  
                    <Grid item xs={12} sx={{ mt: 1 }} style={{justifyContent:'center',display:'flex' }}>
                    <FormControl fullWidth size="small">
                    <InputLabel id="stock-amount-label">商品狀態</InputLabel>
                    <Select
                        labelId="stock-amount-label"
                        id="stock-amount-select"
                        value={status}
                        label="商品狀態"
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <MenuItem value={1}>上架中</MenuItem>
                        <MenuItem value={2}>已下架</MenuItem>
                        <MenuItem value={3}>準備中</MenuItem>
                        <MenuItem value={4}>40</MenuItem>
                        <MenuItem value={5}>50</MenuItem>
                    </Select>
                </FormControl>
                    </Grid>
                </Grid>
            </Box> 
        </DialogContent>
        <DialogActions>
              <Button onClick={updateCommodityStatus} startIcon={<AutoFixHighIcon/>}>送出</Button>  
              <Button onClick={handleStatusCloseForm} startIcon={<CancelIcon/>}>取消</Button>  
        </DialogActions>
      </Dialog>
    </>
  );
}

