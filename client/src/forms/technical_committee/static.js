/* eslint-disable eqeqeq */
import {resualt_options } from '../static';
import moment from 'moment-jalaali'
export const columns = [
  {
    Header: "شناسه",
    accessor: "id",
    notInGrid: true,
    notInForm: true,
    type: "serial",
  },
  {
    Header: "تاریخ جلسه",
    accessor: "meeting_date",
    type: "date",
    //req: true,
    render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
  },
  {
    Header: "شماره جلسه",
    accessor: "meeting_no",
    type: "text",
   // req: true,
  },
  {
    Header: "نام پروژه",
    accessor: "project",
    type: "lookup",
    req: true,
    notInGrid: true,
  },
  {
    Header: "نام پروژه",
    accessor: "vw_project",
    notInForm: true,
  },
  {
    Header: "همکار",
    accessor: "vw_colleague",
    notInForm: true,
  },
  
  {
    Header: "نتیجه",
    accessor: "resualt",
    type: "lookup",
    req: true,
    notInGrid: true,
  },
  {
    Header: "نتیجه",
    accessor: "resualt_id",
    notInForm: true,
    render: (text, row) => (text) ?resualt_options.find(a=>a.key==text).label : '',
  },
  {
    Header: "اولویت",
    accessor: "priority",
    notInGrid: true,
    type: "lookup",
    //req: true,
  }, {
    Header: "ناظر",
    accessor: "supervisor",
    notInGrid: true,
    type: "lookup",
    //req: true,
  }, {
    Header: "حجم کاری",
    accessor: "workload",
    notInGrid: true,
    type: "lookup",
    //req: true,
  }, {
    Header: "شرایط اجرا",
    accessor: "execute_method",
    notInGrid: true,
    type: "lookup",
    //req: true,
  },

  {
    Header: "شناسه نامه گام",
    accessor: "letter_shenase",  
    type: "text",
    req: true,
    notInGrid: true,
  },{
    Header: "شماره نامه گام",
    accessor: "letter_no",  
    type: "text",
    //req: true,
    notInGrid: true,
  },{
    Header: "تاریخ نامه گام",
    accessor: "letter_date",  
    type: "date",
    req: true,
     notInGrid: true,
  },
  {
    Header: "ضمائم",
    accessor: "file_attachment",
    type: "file",
    notInGrid: true,
  },
  {
    Header: "توضیحات",
    accessor: "description",
    type: "note",
    notInGrid: true,
  },
  {
    Header: "مهلت",
    accessor: "deadline",  
    type: "date",
    //req: true,
     notInGrid: true,
  },
];



export const entityName = 'technical_committee';
export const pageHeader = 'صورت جلسات کمیته فنی';

