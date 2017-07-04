import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Row, Col, Upload, Icon, message } from 'antd';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import Highcharts from 'highcharts';

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

const colnames = ["DAPI", "AF488", "FITC", "Cy3", "TexasRed", "Cy5", "AF750", "Atto425", "AF430", "Atto430LS", "Atto740"],
  rownames = ["DAPI", "FITCwide", "FITCnarrow", "Cy3", "TexasRed", "Cy5", "AF750"],
  excitation = [[315, 415], [450, 490], [470, 490], [515, 545], [573.5, 586.5], [620, 640], [672.5, 747.5]],
  emission = [[420, 470], [500, 520], [500, 550], [556, 574], [597, 637], [652, 682], [765, 855]];

function renderChart(data) {
  Highcharts.chart('container', {
    chart: {
      type: 'column'
    },
    title: {
      text: '某实验结果'
    },
    xAxis: {
      categories: rownames
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Excitation'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
        }
      }
    },
    legend: {
      align: 'right',
      x: -30,
      verticalAlign: 'top',
      y: 25,
      floating: true,
      backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
        }
      }
    },
    series: data
    // [{
    //     name: 'John',
    //     data: [5, 3, 4, 7, 2]
    // }, {
    //     name: 'Jane',
    //     data: [2, 2, 3, 2, 1]
    // }, {
    //     name: 'Joe',
    //     data: [3, 4, 4, 2, 5]
    // }]
  });
}

const dataProcess = function (dim, results) {
  let sumTotal = 0,
    sumRange = 0,
    typeTemp = 0,
    resultData = { name: rownames[dim], data: [] },
    i = -1;
  results.data.forEach((item) => {
    if (typeTemp != item.Type) {
      i++;
      if (i != 0) {
        resultData.data.push({name:colnames[item.Type-1],data:parseInt((sumRange / sumTotal) * 100)});
        sumTotal = 0;
        sumRange = 0;
      }
      typeTemp = item.Type;
    }
    if (excitation[dim][0] <= item.Wavelength && excitation[dim][1] >= item.Wavelength) {
      sumRange += item.Excitation;
    }
    sumTotal += item.Excitation;
  })
  resultData.data.push(parseInt((sumRange / sumTotal) * 100));
  return resultData;
}

const dataReverse = function(data){
  let resultData = [];
  console.log(data);
  for(let i = 0;i<colnames.length;i++){
    let dataList = [];
    for(let j=0;j<7;j++){
      dataList.push(data[j].data[i].data);
    }
    resultData.push({name:data[0].data[i].name,data:dataList});
  }
  console.log(resultData);
  return resultData;
}

const parse = function (results) {
  let resultData = [];
  for(let i = 0;i<rownames.length;i++){
    resultData.push(dataProcess(i, results));
  }
  resultData = dataReverse(resultData);
  // console.log(resultData);
  renderChart(resultData);
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
      <Col span={18}><div id="container"></div></Col>
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