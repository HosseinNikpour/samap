/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react';
import { getItems } from '../api/index';
//import moment from 'moment-jalaali';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import Timeline from 'highcharts/modules/timeline';
Timeline(Highcharts);


const ReportDashboard = (props) => {
    const [obj, setObj] = useState({});
    const [contractor_options, setContractor_options] = useState([]);

    const getData = () => {

        Promise.all([getItems('/request'), getItems('/baseInfo')]).then((response) => {

            let c = response[1].data.filter(a => a.group_id === 13).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let data = response[0].data;
            let dt1 = [], dt2 = [], dt3 = [];
debugger;
            c.forEach(e => {

                dt1.push(data.filter(a => a.contractor_id == e.key && a.req_type_id == 1).length);
                dt2.push(data.filter(a => a.contractor_id == e.key && a.req_type_id == 2).length);
                dt3.push(data.filter(a => a.contractor_id == e.key && a.req_type_id == 3).length);
            });
           // debugger
            setObj({ dt1, dt2, dt3 });
            setContractor_options(c);
        })

    }
    useEffect(() => {
        getData();
    }, [])

    const options1 = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'تعداد درخواست های اعلامی به فناوری اطلاعات'
        },
        // legend: { enabled: false },
        xAxis: {
            categories: contractor_options.map(a => a.label),
            labels: {
                useHTML: true,
                style: { fontSize: '15px' },
                skew3d: true,
            }
        },
        yAxis: {
            min: 0,
            allowDecimals: false,
            title: {
                text: 'تعداد درخواست'
            }
        },
        plotOptions: {
            series: {
                animation: {

                    duration: 2000
                },
            },
        },
        tooltip: {
            formatter: function () {
                return "<br/>" + this.point.y + "<br/>";
            }
        },
        series: [{
            name: 'درخواست‌های کسب و کار',
            data: obj.dt1,
            color: '#ff1744'
        }, {
            name: 'درخواست‌های فناوری اطلاعات',
            data: obj.dt2,
            color: '#3d5afe'
        }, {
            name: 'درخواست‌های امور سازمان',
            data: obj.dt3,
            color: '#ffea00'
        }]

    }


  

    return (<div className="container-fluid">


        <div className="row" style={{ paddingTop: '60px' }} >
            <div className="col">
                <div className='card-body' style={{ marginTop: '-50px' }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options1}
                    />
                </div>
            </div>
            {/* <div className="col">
                <div className='card-body' style={{ marginTop: '-50px' }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options2}
                    />
                </div>
            </div> */}
        </div>

    </div>)
}

export default ReportDashboard;