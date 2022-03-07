import React, { useState, useEffect } from 'react';
import '../assets/css/antd.rtl.css'
import { Table, Popconfirm,Menu, Dropdown } from 'antd';

import { CSVLink } from "react-csv";

function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }
    // const varA = a[key];
    // const varB = b[key];
    const varA = (Number(a[key])) ?Number(a[key]) : a[key];
    const varB = (Number(b[key])) ?Number(b[key]) : b[key];
   // console.log(varA);
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else  if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

const TableContainer = (props) => {

  const [rows, setRows] = useState();
  useEffect(() => {
    setRows(props.data)
  }, [props.data]);
  const [orgRows, setOrgRows] = useState(props.data);
  useEffect(() => {
    setOrgRows(props.data)
  }, [props.data]);
  const [columns, setColumns] = useState();
  useEffect(() => {

    let cols = props.columns;
    cols.forEach(c => {
        c.dataIndex=c.accessor;
        c.title=c.Header;
        c.key=c.accessor;
    //  c.sorter = compareValues(c.key);
      c.sorter = compareValues(c.accessor);
    })
    let cc = cols.filter(a => a.dataIndex === 'operation');
    //  console.log(props);
    if (cc.length === 0 && (props.editClick || props.displayClick || props.deleteClick))
     {
      cols.push({
        title: '',
        dataIndex: 'operation',
        width:'120px',
        render: (text, record) =>
          (<div>
            {props.editClick && <i className="fa fa-edit" onClick={() => props.editClick(record)}  ></i>}
            {props.deleteClick && <Popconfirm title="  آیا از حذف مطمئن هستید ؟" okText="تایید" cancelText="عدم تایید"
              onConfirm={() => props.deleteClick(record, text)}>
              <i className="far fa-trash-alt" style={{ marginRight: '8px' }}></i>
            </Popconfirm>}
          
            {props.displayClick && <i className="far fa-eye" onClick={() => props.displayClick(record)} style={{ marginRight: '8px' }} ></i>}
          </div>
          ) 
      });
    }
    setColumns(cols)
  },[props.columns]);

//  

  const onSearch = (searchText) => {
    //debugger;
   // console.log(searchText);
    if (searchText === '')
      setRows(orgRows)
    else {

      let matched = [];
      orgRows.forEach(record => {
        columns.filter(a => a.dataIndex !== 'operation').forEach(c => {
          //    console.log(record[c.dataIndex]);
          if (record[c.dataIndex] && record[c.dataIndex].toString().toLowerCase().replaceAll('ي', 'ی').replaceAll('ك', 'ک').indexOf(searchText.toLowerCase()) >= 0 
              &&!matched.find(a=>a.id===record.id)) {
           
            matched.push(record);
            
          }
        })
      })
    //  console.log(matched)
      setRows(matched);

    }

  }
  return (
    <div>
     {props.downloadName&& <CSVLink data={props.data} headers={props.columns.filter(a=>a.dataIndex!= 'operation').map(a=>({label:a.Header,key:a.accessor}))} filename={props.downloadName+'.csv'} className="download-list" >  </CSVLink>} 
      جستجو : <input className='form-control' onChange={e => onSearch(e.target.value)}
        style={{ width: '200px', display: 'inline', marginBottom: '20px' }} />

{props.description &&<lable className='form-control1' 
        style={{ fontSize: 'larger',textAlign: 'left',width: '40%',float: 'left' }}>{props.description}</lable> }
{/* ,backgroundColor: '#91f59d' */}
      <Table dataSource={rows} columns={columns} rowKey="id"
       scroll={props.scroll?props.scroll: { y: 350 ,x:800}} bordered pagination={false} />
    </div>
  )
}

export default TableContainer;