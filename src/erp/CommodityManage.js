/* eslint-disable jsx-a11y/label-has-associated-control */
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
import Checkbox from '@mui/material/Checkbox';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton'; 
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Link,useNavigate } from 'react-router-dom';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import { v4 as uuidv4 } from 'uuid';
import { PhotoCamera } from '@mui/icons-material';
import CommoditySearch from '../search/CommoditySearch';

const API_PATH = process.env.REACT_APP_API_PATH;

export default function CommodityManage() {
  LicenseInfo.setLicenseKey('9af075c09b5df7441264261f25d3d08eTz03ODI4MyxFPTE3MzEwNzgzMTkwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filterRows,setFilterRows] = useState([]);
  const [commodityFormOpen, setCommodityFormOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [commodityStatus, setCommodityStatus] = useState(1);
  const [filterCommodityStatus, setFilterCommodityStatus] = useState(1);
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [totalDrawOutTimes, setTotalDrawOutTimes] = useState(0);
  const [drawOut1Price, setDrawOut1Price] = useState(0);
  const [drawOut5Price, setDrawOut5Price] = useState(null);
  const [drawOut10Price, setDrawOut10Price] = useState(null);
  const [drawOutMultiplePriceStatus, setDrawOutMultiplePriceStatus] = useState(false);
  const [category, setCategory] = useState('一番賞');

  const [prizeFormOpen,setPrizeFormOpen] = useState(false);
  const [prizes,setPrizes] = useState([]);
  const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    // {
    //   field: 'imgUrl',
    //   headerName: '圖片',
    //   width: 70,
    //   editable: false,
    // },
    {
      field: 'manufacturerName',
      headerName: '廠商',
      width: 80,
      editable: false,
    },
    {
      field: 'isValidateDrawOutTimes',
      headerName: '抽籤驗證',
      width: 120,
      editable: false,
      renderCell: (params) => {
        let color;
        let message;
        switch (params.value) {
          case false:
            color = 'red'; 
            message = '籤數不合';
            break;
          case true:
            color = 'green'; 
            message = '已通過';
            break;
          default:
            color = 'orange';
            message = '未知錯誤';
        }
    
        return <span style={{ color }}>{message}</span>;
      },
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
      width: 100,
      editable: false,
    },
    {
      field: 'status',
      headerName: '狀態',
      width: 100,
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
      width: 90,
      editable: false,
    },
    {
      field: 'creator',
      headerName: '創造者',
      sortable: false,
      width: 100,
    },   
    {
      field: 'createDate',
      headerName: '創建時間',
      width: 130,
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
      width: 100,
    },   
    {
      field: 'editDate',
      headerName: '修改時間',
      width: 130,
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
          <IconButton aria-label="edit" onClick={() => handleCommodityClickOpen(false,params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="prize" onClick={() => handlePrizeClickOpen(params.row.id)}>
            <DashboardCustomizeIcon />
          </IconButton>
        </>
  
      ),
    },
  ];


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        // img.width === 800 && img.height === 800
        if ( true) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(file);
            setImagePreviewUrl(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          alert('圖片尺寸必須為800px * 800px');
          setImage(null);
          setImagePreviewUrl('');
        }
      };
      img.onerror = () => {
        alert('無效的圖片文件');
        setImage(null);
        setImagePreviewUrl('');
      };
      img.src = URL.createObjectURL(file);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = async () => {    
      const request = {
        id,
        Name:name,
        Category:category,
        ManufacurerId:localStorage.getItem('id'),
        Status:commodityStatus,
        DrawOut1Price:drawOut1Price,
        DrawOut5Price:drawOut5Price,
        DrawOut10Price:drawOut10Price,
        DrawOutMultiplePriceStatus:drawOutMultiplePriceStatus,
        Img:image,
        TotalDrawOutTimes:totalDrawOutTimes
      }
      if (!name || !category || commodityStatus == null || drawOut1Price == null || drawOutMultiplePriceStatus == null || !image || totalDrawOutTimes == null) {
        alert('請確保資料無缺');
        return;
      }
      if(drawOutMultiplePriceStatus) {
        if(drawOut5Price === null || drawOut10Price === null || drawOut5Price === 0 || drawOut10Price === 0) {
          alert('多重價格啟用時 五連抽與十連抽價格不得為0');
          return;
        }
      }
      const data = new FormData();
      Object.keys(request).forEach(key => {
        if (request[key] !== null && request[key] !== undefined) {
          data.append(key, request[key]);
        }
      });
      try {
        const response = await axios.post(`${API_PATH}/manufacturer/commodity`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          alert('成功');
          setCommodityFormOpen(false);
          fetchData();
        }
      } catch (error) {
        alert(error.response?.data || '提交失败');
      }        
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_PATH}/manufacturer/commodities?pageNumber=${page+1}&status=${filterCommodityStatus}&pageSize=${rowsPerPage}`);
  
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

  const fetchPrizeData = async (id) => {
    localStorage.setItem('commodityId',id)
    try {
      const response = await axios.get(`${API_PATH}/manufacturer/prizes?commodityId=${id}`);
      if (response.status === 200) { 
        setPrizes(response.data.source);
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

  const handleCommodityClickOpen = (bool,row) => {
    if(bool) {
      setId(0);
      setName('');
      setCategory('');
      setCommodityStatus(1);
      setDrawOut1Price(0);
      setDrawOut5Price(null);
      setDrawOut10Price(null);
      setDrawOutMultiplePriceStatus(false);
      setImage(null);
      setTotalDrawOutTimes(0);
      setImagePreviewUrl('');
    }else {
      setId(row.id);
      setName(row.name);
      setCategory(row.category);
      setCommodityStatus(row.status);
      setDrawOut1Price(row.drawOut1Price);
      setDrawOut5Price(row.drawOut5Price);
      setDrawOut10Price(row.drawOut10Price);
      setDrawOutMultiplePriceStatus(row.drawOutMultiplePriceStatus);
      setTotalDrawOutTimes(totalDrawOutTimes);
      setImagePreviewUrl(row.imgUrl);
    }
    setCommodityFormOpen(true);
  };

  const handlePrizeClickOpen = (commodityId) => {
    fetchPrizeData(commodityId);
    setPrizeFormOpen(true);
  };

  const handlePrizeClickClose = () => {
    setPrizes([]);
    setPrizeFormOpen(false);
  };
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]); 

  useEffect(() => {
    if(!drawOutMultiplePriceStatus) {
      setDrawOut5Price(null);
      setDrawOut10Price(null);
    }
  }, [drawOutMultiplePriceStatus]); 

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
              <CommoditySearch rows={rows} setFilterRows={setFilterRows}/> 
            </Grid>
            <Grid item xs={12} style={{display:'flex',marginBottom:'2%'}}> 
              <FormControl style={{marginRight:'2%'}}>
                  <InputLabel id="stock-amount-label">搜尋狀態</InputLabel>
                  <Select
                    labelId="stock-amount-label"
                    id="stock-amount-select"
                    value={filterCommodityStatus}
                    label="搜尋商品狀態"
                    onChange={(e) => setFilterCommodityStatus(e.target.value)}
                  >
                    <MenuItem value={1}>上架中</MenuItem>
                    <MenuItem value={2}>已下架</MenuItem>
                    <MenuItem value={3}>準備中</MenuItem>
                    <MenuItem value={4}>40</MenuItem>
                    <MenuItem value={5}>50</MenuItem>
                  </Select>
              </FormControl>
              <Button variant="outlined" endIcon={<SearchIcon />} onClick={fetchData}>
                搜尋
              </Button>
              <Stack direction="row" spacing={2}  style={{marginLeft:'2%'}}>
                <Button variant="outlined" startIcon={<AddToPhotosIcon />} onClick={()=>handleCommodityClickOpen(true,null)}>
                  上架商品
                </Button>
              </Stack>
            </Grid>
      </Grid>
      <DataGridPro
        rows={filterRows}
        columns={columns}
        disableRowSelectionOnClick
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
    <Dialog open={commodityFormOpen} 
      onClose={()=>setCommodityFormOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          width: '50%',
          margin: 'auto'
        }
      }}
    >
      <DialogTitle style={{justifyContent:'center',display:'flex',fontSize:'16px'}}>{id === 0? "上架賞品":"修改賞品"}</DialogTitle>
      <DialogContent>
      <Box sx={{ flexGrow: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
            <FormControl fullWidth size="small">
              <InputLabel id="stock-amount-label">商品狀態</InputLabel>
              <Select
                labelId="stock-amount-label"
                id="stock-amount-select"
                value={commodityStatus}
                label="商品狀態"
                onChange={(e) => setCommodityStatus(e.target.value)}
              >
                <MenuItem value={1}>上架中</MenuItem>
                {/* <MenuItem value={2}>已下架</MenuItem> */}
                {/* <MenuItem value={3}>準備中</MenuItem> */}
                <MenuItem value={4}>40</MenuItem>
                <MenuItem value={5}>50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
            <TextField
                fullWidth 
                id="outlined-number"
                size="small"
                label="賞品名稱"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
          </Grid>
          <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
            <FormControl fullWidth size="small">
              <InputLabel id="stock-amount-label">賞品種類</InputLabel>
              <Select
                labelId="stock-amount-label"
                id="stock-amount-select"
                value={category}
                label="賞品種類"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value='一番賞'>一番賞</MenuItem>
                <MenuItem value='自製賞'>自製賞</MenuItem>
                <MenuItem value='活動賞'>活動賞</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
            <TextField
                fullWidth 
                id="outlined-number"
                size="small"
                label="總抽籤數"
                InputLabelProps={{
                    shrink: true,
                }}
                value={totalDrawOutTimes}
                onChange={(e) => setTotalDrawOutTimes(e.target.value)}
              />
          </Grid>
          <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={drawOutMultiplePriceStatus}
                  inputProps={{ 'aria-label': 'controlled' }}
                  onChange={(e) => setDrawOutMultiplePriceStatus(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" style={{ fontFamily: 'Arial', fontSize: '12px' }}>
                  多重售價
                </Typography>
              }
            />
          </Grid>
          <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
            <TextField
                fullWidth 
                id="outlined-number"
                size="small"
                label="一抽價格"
                InputLabelProps={{
                    shrink: true,
                }}
                value={drawOut1Price}
                onChange={(e) => setDrawOut1Price(e.target.value)}
              />
          </Grid>
          <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
            <TextField
                fullWidth 
                id="outlined-number"
                size="small"
                label="五連抽價格"
                helperText= {drawOutMultiplePriceStatus === false ? "目前不得更改" : ""}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                  readOnly: drawOutMultiplePriceStatus === false,
                }}
                value={drawOut5Price ?? 0}
                onChange={(e) => setDrawOut5Price(e.target.value)}
              />
          </Grid>
          <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
            <TextField
                fullWidth 
                id="outlined-number"
                size="small"
                label="十連抽價格"
                helperText= {drawOutMultiplePriceStatus === false ? "目前不得更改" : ""}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                  readOnly: drawOutMultiplePriceStatus === false,
                }}
                value={drawOut10Price ?? 0 }
                onChange={(e) => setDrawOut10Price(e.target.value)}
              />
          </Grid>
          <Grid item xs={12} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="contained-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="contained-button-file">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          </Grid>
          {!image && id === 0 && (
            <>
              <Grid item xs={12} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
                <Typography>尚未上傳賞品圖 800px * 800px </Typography>
              </Grid>
            </>
          )}
          {(image || id !== 0) && (
            <>
              <Grid item xs={12} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
                <Typography>預覽圖片:</Typography>
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
              <img src={imagePreviewUrl} alt="Preview" style={{ maxHeight: '300px', marginTop: '10px' }} />
            </Grid>
            </>
          )}
        </Grid>
      </Box>
      </DialogContent>
      <DialogActions>
            <Button onClick={handleSubmit} startIcon={<AddToHomeScreenIcon/>}>送出</Button>  
            <Button onClick={()=>setCommodityFormOpen(false)} startIcon={<ClearIcon/>}>取消</Button>  
      </DialogActions>
    </Dialog>

    <Dialog
        open={prizeFormOpen}
        onClose={()=>setPrizeFormOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            width: '50%',
            margin: 'auto'
          }
        }}
      >
        <DialogTitle>獎品管理</DialogTitle>
        <DialogContent>
          <PrizeForm data={null} index={null} fetchPrizeData={fetchPrizeData}/>
          {prizes.map((prize,index) => (
            <div key={uuidv4()}>
              <PrizeForm data={prize} index={index} fetchPrizeData={fetchPrizeData}/>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrizeClickClose}>取消</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function PrizeForm({ data, index,fetchPrizeData }) {
  const [id, setId] = useState(data && data.id !== undefined ? data.id : 0);
  const [prizeName, setPrizeName] = useState(data && data.prizeName !== undefined ? data.prizeName : '');
  const [prizeLevel, setPrizeLevel] = useState(data && data.prizeLevel !== undefined ? data.prizeLevel : 0);
  const [sort, setSort] = useState(data && data.sort !== undefined ? data.sort : 0);
  const [size, setSize] = useState(data && data.size !== undefined ? data.size : 0);
  const [amount, setAmount] = useState(data && data.amount !== undefined ? data.amount : 0);
  const [reclaimPrice, setReclaimPrice] = useState(data && data.reclaimPrice !== undefined ? data.reclaimPrice : 0);
  const [freight, setFreight] = useState(data && data.freight !== undefined ? data.freight : 0);
  const [isOverAfterSoldOut, setIsOverAfterSoldOut] = useState(data && data.isOverAfterSoldOut !== undefined ? data.isOverAfterSoldOut : false);
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(data && data.imgUrl !== undefined ? data.imgUrl : '');
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        // img.width === 800 && img.height === 800
        if (true) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(file);
            setImagePreviewUrl(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          alert('圖片尺寸必須為800px * 800px');
          setImage(null);
          setImagePreviewUrl('');
        }
      };
      img.onerror = () => {
        alert('無效的圖片文件');
        setImage(null);
        setImagePreviewUrl('');
      };
      img.src = URL.createObjectURL(file);
    }
  };
  // eslint-disable-next-line consistent-return
  const handleDeletePrize = async (id) => {
    try {
      const response = await axios.delete(`${API_PATH}/manufacturer/prize`, {
        params: { id }
      });
      if (response.status === 200) {
        fetchPrizeData(localStorage.getItem('commodityId'));
        alert('獎品刪除成功');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert('無此權限');
      } else {
        alert('內部錯誤');
      }
      return null;
    }
  };

  const handleSubmit = async (info) => {
    const request = {
      id,
      CommodityId: localStorage.getItem('commodityId'),
      PrizeName: prizeName,
      PrizeLevel: prizeLevel,
      Img: image,
      ImgUrl: info ? info.imgUrl : '',
      Sort: sort,
      Size: size,
      Amount: amount,
      ReclaimPrice: reclaimPrice,
      Freight: freight,
      IsOverAfterSoldOut: isOverAfterSoldOut,
    };
    if (!prizeName || prizeLevel === undefined || sort === undefined || (!image && id === 0) || size === undefined || amount === undefined || freight === undefined) {
      alert('請確保資料無缺');
      return;
    }

    const formData = new FormData();
    Object.keys(request).forEach(key => {
      if (request[key] !== null && request[key] !== undefined) {
        formData.append(key, request[key]);
      }
    });

    try {
      const response = await axios.post(`${API_PATH}/manufacturer/prize`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        alert('成功');
        fetchPrizeData(localStorage.getItem('commodityId'));
      }
    } catch (error) {
      alert(error.response?.data || '提交失败');
    }  
    
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Typography variant="body2" style={{ fontSize: '16px', marginBottom: '1%' }}>
        獎品-{index ? index + 1 : 0}
      </Typography>
      <Grid container spacing={2}>
        {/* 獎品名稱 */}
        <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
          <TextField
            fullWidth
            id="outlined-number"
            size="small"
            label="獎品名稱"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setPrizeName(e.target.value)}
            value={prizeName}
          />
        </Grid>
        {/* 獎品等級 */}
        <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
          <FormControl fullWidth size="小">
            <InputLabel id="prize-level-label">賞品種類</InputLabel>
            <Select
              labelId="prize-level-label"
              id="prize-level-select"
              value={prizeLevel}
              label="獎品等級"
              onChange={(e) => setPrizeLevel(e.target.value)}
            >
              <MenuItem value={0}>S級</MenuItem>
              <MenuItem value={1}>A級</MenuItem>
              <MenuItem value={2}>B級</MenuItem>
              <MenuItem value={3}>C級</MenuItem>
              <MenuItem value={4}>D級</MenuItem>
              <MenuItem value={5}>E級</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* 排序 */}
        <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
          <TextField
            fullWidth
            id="outlined-number"
            size="小"
            label="排序"
            InputLabelProps={{
              shrink: true,
            }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          />
        </Grid>
        {/* 尺寸 */}
        <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
          <TextField
            fullWidth
            id="outlined-number"
            size="小"
            label="尺寸"
            InputLabelProps={{
              shrink: true,
            }}
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </Grid>
        {/* 數量 */}
        <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
          <TextField
            fullWidth
            id="outlined-number"
            size="小"
            label="數量"
            InputLabelProps={{
              shrink: true,
            }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Grid>
        {/* 回收價格 */}
        <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
          <TextField
            fullWidth
            id="outlined-number"
            size="小"
            label="回收價格"
            InputLabelProps={{
              shrink: true,
            }}
            value={reclaimPrice}
            onChange={(e) => setReclaimPrice(e.target.value)}
          />
        </Grid>
        {/* 運費 */}
        <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
          <TextField
            fullWidth
            id="outlined-number"
            size="小"
            label="運費"
            InputLabelProps={{
              shrink: true,
            }}
            value={freight}
            onChange={(e) => setFreight(e.target.value)}
          />
        </Grid>
        {/* 是否售完即下架 */}
        <Grid item xs={3} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isOverAfterSoldOut}
                inputProps={{ 'aria-label': 'controlled' }}
                onChange={(e) => setIsOverAfterSoldOut(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2" style={{ fontFamily: 'Arial', fontSize: '12px' }}>
                是否售完即下架
              </Typography>
            }
          />
        </Grid>
        {/* 圖片上傳 */}
        <Grid item xs={12} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="contained-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="contained-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Grid>
        {!image && id === 0 && (
          <>
            <Grid item xs={12} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
              <Typography>尚未上傳獎品圖 800px * 800px </Typography>
            </Grid>
          </>
        )}
        {(image || id !== 0) && (
          <>
            <Grid item xs={12} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
              <Typography>預覽圖片:</Typography>
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
              <img src={imagePreviewUrl} alt="Preview" style={{ maxHeight: '300px', marginTop: '10px' }} />
            </Grid>
          </>
        )}
      </Grid>
      <Grid item xs={12} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
        <Button type="button" endIcon={<SaveAsIcon />} onClick={() => handleSubmit(data)}>{id === 0 ? '新增' : '修改'}</Button>
        {id !== 0 && (
          <>
            <Button type="button" endIcon={<DeleteForeverIcon />} onClick={() => handleDeletePrize(id)}>刪除</Button>
          </>
        )}
      </Grid>
      <Grid item xs={12} sx={{ mt: 1 }} style={{ justifyContent: 'center', display: 'flex' }}>
        -----------------------------------------------------------------
      </Grid>
    </Box>
  );
}


