import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Row, Col, Upload, Icon, message } from 'antd';
import { Button } from 'antd';
import 'antd/dist/antd.css';


const { Header, Content, Footer } = Layout;
const Dragger = Upload.Dragger;

const props = {
  name: 'file',
  multiple: false,
  showUploadList: false,
  action: 'http://localhost:8080',
  beforeUpload(file) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: parse
    });
    return false;
  },
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const parse = function(results){
  console.log(3333333333333);
  console.log(results)
}
function UploadInput() {
  const propsList = props;
  return <div style={{ marginTop: 16, height: 180 }}>
    <Dragger className="input-csv" {...propsList}>
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
    </Dragger>
  </div>
}
function GridContent() {
  return (
    <Row>
      <Col span={6}><UploadInput /></Col>
      <Col span={18}>col-18</Col>
    </Row>)
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">报表</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '12px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>报表</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <GridContent />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          CSV-DATA展示 ©2017 Created by LE
    </Footer>
      </Layout>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);