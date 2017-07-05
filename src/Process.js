import Highcharts from 'highcharts';

const colnames = ["DAPI", "AF488", "FITC", "Cy3", "TexasRed", "Cy5", "AF750", "Atto425", "AF430", "Atto430LS", "Atto740"],
    rownames = ["DAPI", "FITCwide", "FITCnarrow", "Cy3", "TexasRed", "Cy5", "AF750"],
    dimList = {
        Excitation : [[315, 415], [450, 490], [470, 490], [515, 545], [573.5, 586.5], [620, 640], [672.5, 747.5]],
        Emission : [[420, 470], [500, 520], [500, 550], [556, 574], [597, 637], [652, 682], [765, 855]]
    };

class Process {
    constructor() {
        // this.data = data;
    }
    renderChart(dimType, data) {
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'The results'
            },
            xAxis: {
                categories: rownames
            },
            yAxis: {
                min: 0,
                title: {
                    text: dimType
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
                headerFormat: '<b>{series.name}: {point.y}</b><br/>',
                pointFormat: '<br/>Total: {point.stackTotal}'
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
        });
    }
    dataProcess(dimType, dim, results) {
        let sumTotal = 0,
            sumRange = 0,
            typeTemp = 0,
            resultData = { name: rownames[dim], data: [] },
            i = -1;
        results.data.forEach((item) => {
            if (typeTemp != item.Type) {
                i++;
                if (i != 0) {
                    resultData.data.push({ name: colnames[typeTemp - 1], data: parseInt((sumRange / sumTotal) * 100) });
                    sumTotal = 0;
                    sumRange = 0;
                }
                typeTemp = item.Type;
            }
            if (dimList[dimType][dim][0] <= item.Wavelength && dimList[dimType][dim][1] >= item.Wavelength) {
                sumRange += item[dimType];
            }
            sumTotal += item[dimType];
        })
        resultData.data.push({ name: colnames[typeTemp - 1], data: parseInt((sumRange / sumTotal) * 100) });
        return resultData;
    }
    dataReverse(data) {
        let resultData = [];
        // console.log(data);
        for (let i = 0; i < colnames.length; i++) {
            let dataList = [];
            for (let j = 0; j < 7; j++) {
                dataList.push(data[j].data[i].data);
            }
            resultData.push({ name: data[0].data[i].name, data: dataList });
        }
        // console.log(resultData);
        return resultData;
    }
}

export {Process}