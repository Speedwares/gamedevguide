import React, { Component } from 'react'
import { Link, graphql, StaticQuery } from 'gatsby'

import { Menu as AntdMenu, Icon as AntdIcon } from 'antd'
import siteCfg from '../../../SiteCfg'
import { relFilePathToSlug } from '../../../gatsby/utils'
import './Menu.css'
import Search from '../Search'


class Menu extends Component {

  state = {
     collapsed: false
  };

  toggle = () => {
    const { headerCollapsed } = this.props
    this.setState({
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      collapsed: !this.state.collapsed,
    });
    // eslint-disable-next-line react/destructuring-assignment
    console.log(this.state.collapsed)
    // eslint-disable-next-line react/destructuring-assignment
    headerCollapsed(!this.state.collapsed)
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
          const { siteNavTitle } = this.props
          const menuItems = data.allMenuItems.edges.map(edge => edge.node).reverse()
          return (
            <AntdMenu theme={siteCfg.theme.DarkVariant} mode="horizontal">
              <AntdIcon
                className="trigger"
                // eslint-disable-next-line react/destructuring-assignment
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                // eslint-disable-next-line react/destructuring-assignment
                onClick={(e) => this.toggle(e,this.state.collapsed)}
              />
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
