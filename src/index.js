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
const dimList = ['Excitation', 'Emission'];

function isEmptyObject(e) {  
    var t;  
    for (t in e)  
        return !1;  
    return !0  
} 

function parse(dim, file) {
  if (!isEmptyObject(file)) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        let resultData = [];
        for (let i = 0; i < 7; i++) {
          resultData.push(ProcessData.dataProcess(dim, i, results));
        }
        resultData = ProcessData.dataReverse(resultData);
        ProcessData.renderChart(dim, resultData);
      },
      error: () => {
        message.error("Please upload .CSV!");
      }
    });
  } else {
    message.error("Please upload FILE first!");
  }
}

class SelectDim extends React.Component {
  constructor(props) {
    super(props);
    this.state = { select: 'Excitation' }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(value) {
    this.setState({ select: value });
    this.props.onSelectChange(value);
  }
  render() {
    const Option = Select.Option;
    return <Select
      showSearch
      value={this.state.select}
      style={{ width: '100%' }}
      placeholder="Select a person"
      optionFilterProp="children"
      onChange={this.handleChange}
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      <Option value="Excitation">Excitation</Option>
      <Option value="Emission">Emission</Option>
    </Select>
  }
};

const props = {
  name: 'file',
  multiple: false,
  showUploadList: false,
  action: 'http://localhost:8080',
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

class UploadInput extends React.Component {
  constructor(props) {
    super(props);
    this.beforeUpload = this.beforeUpload.bind(this);
  }
  beforeUpload(file) {
    this.props.onUploadChange(file);
    return false;
  }
  render() {
    const propsList = props;
    return <div style={{ marginTop: 16, height: 180 }}>
      <Dragger className="input-csv" {...propsList} beforeUpload={this.beforeUpload}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint"></p>
      </Dragger>
    </div>
  }
}

class GridContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { file: {}, dim: 'Excitation' }
    this.handleUpload = this.handleUpload.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.onClick = this.onClick.bind(this);
  }
  handleUpload(file) {
    this.setState({ file: file });
  }
  handleSelect(dim) {
    this.setState({ dim: dim });
  }
  onClick() {
    parse(this.state.dim, this.state.file);
  }
  render() {
    return (
      <div>
        <Row gutter={3}>
          <Col span={3}>
            <div>
              <Row style={{ marginBottom: 20 }}><UploadInput onUploadChange={this.handleUpload} /></Row>
              <Row style={{ marginBottom: 20 }}><SelectDim onSelectChange={this.handleSelect} /></Row>
              <Row style={{ marginBottom: 20 }}><Button style={{ width: '100%' }} onClick={this.onClick} type="primary">Parse</Button></Row>
            </div>
          </Col>
          <Col span={21}><div id="container"></div></Col>
        </Row>
      </div>)
  }
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
            <Menu.Item key="1">Report</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '12px 0' }}>
            <Breadcrumb.Item>Report</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <GridContent />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          CSV-DATA ©2017 Created by LE
    </Footer>
      </Layout>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);