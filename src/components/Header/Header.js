import React from 'react'
// import { Link } from 'gatsby';
// import sizeMe  from 'react-sizeme';
// import { connect } from "react-redux";
// import { updateHeaderHeight } from '../../actions/layout';
import { Layout as AntdLayout } from 'antd'
import Menu from '../Menu'


const { Header: AntdHeader } = AntdLayout



const Header = ({ siteNavTitle, headerCollapsed, collapsed, sidebarActive }) => (
	
  <AntdHeader>

    <Menu siteNavTitle={siteNavTitle} headerCollapsed={headerCollapsed} collapsed={collapsed} sidebarActive = {sidebarActive}/>
  </AntdHeader>
)
// const mapDispatchToProps = {
//  updateHeaderHeight
// }

// export default connect(()=>({}), mapDispatchToProps) (sizeMe({monitorHeight: true})(Header))
export default Header
