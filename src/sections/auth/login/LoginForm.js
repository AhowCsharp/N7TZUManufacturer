import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------
const API_PATH = process.env.REACT_APP_API_PATH;


export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [acc,setAcc] = useState('');
  const [pw,setPw] = useState('');

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => `%${  (`00${  c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };
  const handleLogin = async () => {
    
    try {
      
      const response = await axios.post(`${API_PATH}/super/login`, { Account: acc, Password: pw });  
      console.log(response)
      if (response.status === 200) {
        localStorage.setItem('token', response.data.source); 
        const decodedToken = parseJwt(response.data.source);
        console.log(decodedToken)
        localStorage.setItem('name',  decodedToken.Name); 
        localStorage.setItem('id',  decodedToken.Id); 
        navigate('/admin/superadmins', { replace: true })
      }
    } catch (error) {
        alert(error.response.data)
    }
  };
  
  

  return (
    <>
      <Stack spacing={3}>
        <TextField name="account" label="Account" onChange={(e)=>setAcc(e.target.value)}/>

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e)=>setPw(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" >
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack> */}

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleLogin} style={{marginTop:'10%'}}>
        Login
      </LoadingButton>
    </>
  );
}
