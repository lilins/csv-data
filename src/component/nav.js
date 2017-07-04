import React from 'react';
import ReactDOM from 'react-dom';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'mail'
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    render() {
        return (
            <Menu
                onClick={this.handleClick}
                selectedKeys={this.state.current}
                mode="horizontal"
            >
                <Menu.Item key="mail">
                    <Icon type="area-chart" />
                </Menu.Item>
            </Menu>
        );
    }
}

export { Nav };