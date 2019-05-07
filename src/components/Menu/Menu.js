import React, { Component } from 'react'
import { Link, graphql, StaticQuery } from 'gatsby'

import { Menu as AntdMenu, Icon as AntdIcon } from 'antd'
import siteCfg from '../../../SiteCfg'
import { relFilePathToSlug } from '../../../gatsby/utils'
import './Menu.css'
import Search from '../Search'


class Menu extends Component {


  toggle = () => {
    const { headerCollapsed, collapsed } = this.props
    // eslint-disable-next-line react/destructuring-assignment
    headerCollapsed(!collapsed)
  }


  render() {
    return (
      <StaticQuery
        query={graphql`
      query {
        allMenuItems {
          edges {
            node {
              name
              link
            }
          }
        }
        siteSearchIndex {
            index
        }
      }
    `}
        render={data => {
          const { siteNavTitle, collapsed } = this.props
        
          const menuItems = data.allMenuItems.edges.map(edge => edge.node).reverse()

          const checkSidebar = () => { 
          const { sidebarActive } = this.props
          let sidebar = ''
          if (sidebarActive){
            sidebar =
              <AntdIcon
                className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                // eslint-disable-next-line react/destructuring-assignment
                onClick={(e) => this.toggle(e,collapsed)}
              />
          }
          return sidebar
        }
        
          return (
          <AntdMenu theme={siteCfg.theme.DarkVariant} mode="horizontal">
         {checkSidebar()}
              <AntdMenu.Item>
                <Link to="/">{siteNavTitle}</Link>
              </AntdMenu.Item>
              <AntdMenu.Item>
                <a href={siteCfg.repoURL}>
                  <AntdIcon type="github"/>
                </a>
              </AntdMenu.Item>
                  <AntdMenu.Item>
                 <Search searchIndex={data.siteSearchIndex.index} />
                  </AntdMenu.Item>

              <AntdMenu.Item>
                <a href={siteCfg.twitterURL}>
                  <AntdIcon type="twitter"/>
                </a>
              </AntdMenu.Item>
              {menuItems.map(item => (
                <AntdMenu.Item key={menuItems.indexOf(item)}>
                  <Link to={relFilePathToSlug(item.link)}>{item.name}</Link>
                </AntdMenu.Item>
              ))}
            </AntdMenu>
          )
        }}
      />
    )
  }
}

export default Menu
