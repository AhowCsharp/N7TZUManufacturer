// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const AdminConfig = [
  {
    title: '廠商資訊',
    path: '/manufacturer/info',
    icon: icon('ic_analytics')
  }
];

export default AdminConfig;
