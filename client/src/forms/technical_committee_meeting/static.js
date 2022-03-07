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
    accessor: "vw_project",
    type: "lookup",
   //req: true,
   // notInGrid: true,
  },
  {
    Header: "شماره جلسه",
    accessor: "meeting_no",
    type: "text",
    req: true,
    width:'150px'
  },
  {
    Header: "تاریخ جلسه",
    accessor: "meeting_date",
    type: "date",
    req: true,
    render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
    width:'150px'
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
   // req: true,
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
];


export const entityName = 'technical_committee_meeting';
export const pageHeader = ' دستور جلسه کمیته فنی';

