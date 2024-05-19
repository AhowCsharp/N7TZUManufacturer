// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const AdminConfig = [
  {
    title: '超級管理者列表',
    path: '/admin/superadmins',
    icon: icon('ic_analytics')
  },
  {
    title: '廠商列表',
    path: '/admin/manufacturers',
    icon: icon('ic_analytics')
  },
  {
    title: '賞品列表',
    path: '/admin/commodities',
    icon: icon('ic_analytics')
  }
];

export default AdminConfig;
