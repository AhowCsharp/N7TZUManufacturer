// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const AdminConfig = [
  {
    title: '廠商資訊',
    path: '/manufacturer/info',
    icon: icon('ic_analytics')
  },
  {
    title: '賞品管理',
    path: '/manufacturer/commodity',
    icon: icon('ic_analytics')
  },
  {
    title: '訂單管理',
    path: '/manufacturer/orders',
    icon: icon('ic_analytics')
  },
  {
    title: '銷售管理',
    path: '/manufacturer/salesamount',
    icon: icon('ic_analytics')
  },
  {
    title: '回收列表',
    path: '/manufacturer/reclaim',
    icon: icon('ic_analytics')
  },
];

export default AdminConfig;
