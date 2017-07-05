import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Row, Col, Upload, Icon, message } from 'antd';
import { Button, Select } from 'antd';
import 'antd/dist/antd.css';
import { Process } from './Process.js';

const { Header, Content, Footer } = Layout;
const Dragger = Upload.Dragger;

const ProcessData = new Process();
const dimList = ['Excitation','Emission'];

function parse(results) {
  let resultData = [];
  for (let i = 0; i < 7; i++) {
    resultData.push(ProcessData.dataProcess('Emission', i, results));
  }
  resultData = ProcessData.dataReverse(resultData);
  ProcessData.renderChart('Emission', resultData);
}

function handleChange(value) {
  console.log(`selected ${value}`);
}



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

const colnames = ["DAPI", "AF488", "FITC", "Cy3", "TexasRed", "Cy5", "AF750", "Atto425", "AF430", "Atto430LS", "Atto740"],
  rownames = ["DAPI", "FITCwide", "FITCnarrow", "Cy3", "TexasRed", "Cy5", "AF750"],
  excitation = [[315, 415], [450, 490], [470, 490], [515, 545], [573.5, 586.5], [620, 640], [672.5, 747.5]],
  emission = [[420, 470], [500, 520], [500, 550], [556, 574], [597, 637], [652, 682], [765, 855]];



function UploadInput() {
  const propsList = props;
  return <div style={{ marginTop: 16, height: 180 }}>
    <Dragger className="input-csv" {...propsList}>
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint"></p>
    </Dragger>
  </div>
}
function GridContent() {
  return (
    <Row>
      <Col span={3}><UploadInput /></Col>
      <Col span={21}><div id="container"></div></Col>
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