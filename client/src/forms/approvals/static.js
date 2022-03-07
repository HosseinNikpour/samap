/* eslint-disable eqeqeq */
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
    Header: "نام پروژه",
    accessor: "project",
    type: "lookup",
   
    notInGrid: true,
  },
  {
    Header: "نام پروژه",
    accessor: "vw_project",  
  },
  {
    Header: "شماره جلسه",
    accessor: "vw_meeting_no",  
  },
  {
    Header: "متولی",
    accessor: "vw_applicant",  
  },
  {
    Header: "وضعیت پروژه",
    accessor: "vw_resualt_id",  
  },

  {
    Header: "شرایط اجرا",
    accessor: "vw_execute_method_id",  
  },
  {
    Header: "مهلت",
    accessor: "vw_deadline", 
    render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
  },
  {
    Header: "درصد پیشرفت",
    accessor: "progress",
    type: "number",
    notInGrid: true,
  },
  {
    Header: "شناسه نامه گام",
    accessor: "letter_shenase",  
    type: "text",
   // req: true,
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
    //req: true,
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
];

export const last_state_options = [
{ key: 1, label: 'در حال اجرا', value: 1 },
{ key:11, label: 'متوقف شده', value: 11 },
{ key:12, label: 'خاتمه یافته', value: 12 },
];
export const entityName = 'approvals';
export const pageHeader = 'مصوبات';

