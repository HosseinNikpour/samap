import React, { useState, useEffect } from 'react';
import { getItems } from '../api/index';
import moment from 'moment-jalaali';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import Timeline from 'highcharts/modules/timeline';
Timeline(Highcharts);




// import Static from '../static';

const ReportTimeline = (props) => {
    const [obj, setObj] = useState({});

    const getData = () => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        Promise.all([getItems('report/timeline', { id: params.id })]).then((response) => {
            setObj(response[0].data[0]);;
            debugger
        })

    }
    useEffect(() => {
        getData();
    }, [])

    const options = {
        chart: {
            type: 'timeline'
        },
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h5>{chartTitle}</h5>' +
                    '<div>{typeDescription}</div>' +
                    '<div>{chartSubtitle}</div>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{viewTableButton}</div>'
            },
            point: {
                valueDescriptionFormat: '{index}. {point.label}. {point.description}.'
            }
        },
        plotOptions: {
            series: {
                animation: {
                    defer: 2,
                    duration: 3000
                },
                dataLabels: {
                    useHTML: true,
                    // backgroundColor:'red',
                    // connectorColor:'silver',
                    connectorWidth: 5,
                    marker: { enabled: true },
                    style: { fontSize: '14px' }
                }
            },
            line: {
                lineWidth: 5
            }
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        title: {
            text: obj && obj.name ? obj.name : ''
        },


        series: [{
            data: [{
                name: 'ثبت درخواست',
                label: obj && obj.req_date ? moment(obj.req_date).format('jYYYY/jMM/jDD') : '',
                description: '',
                color: obj && obj.req_date ? '#07a321' : '#cbccc4'
            }, {
                name: 'استعلام درخواست',
                label: obj && obj.inquiry_date ? moment(obj.inquiry_date).format('jYYYY/jMM/jDD') : '',
                description: '',
                color: obj && obj.inquiry_date ? '#07a321' : '#cbccc4'
            }, {
                name: 'کمیته فنی',
                label: obj && obj.meeting_date ? moment(obj.meeting_date).format('jYYYY/jMM/jDD') : '',
                description: '',
                color: obj && obj.meeting_date ? '#07a321' : '#cbccc4'
            }, {
                name: 'پروپوزال',
                label: '',
                description: '',
                color: '#cbccc4'
            }, {
                name: 'استعلام پروپوزال',
                label: '',
                description: '',
                color: '#cbccc4'
            }, {
                name: 'ثبت اقدامات',
                label: '',
                description: '',
                color: '#cbccc4'
            }, {
                name: 'پیشنویس قرارداد',
                label: '',
                description: '',
                color: '#cbccc4'
            }, {
                name: 'انعقاد قرارداد',
                label: '',
                description: '',
                color: '#cbccc4'
            }]
        }]
    }


    return (<div className="container-fluid">


        <div className="row" style={{ paddingTop: '15px' }} >
            <div className="col">
                <div className="card ">
                    <div className="card-header border-0">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="mb-0">آخرین وضعیت پروژه</h3>
                                <hr></hr>
                            </div>
                        </div>
                    </div>
                    <div className='card-body' style={{ marginTop: '-50px' }}>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options}
                        />
                    </div>
                </div>
            </div>

        </div>

    </div>)
}

export default ReportTimeline;