//import moment from 'moment-jalaali'
export const columns = [
  {
    Header: "شناسه",
    accessor: "id",
    notInGrid: true,
    notInForm: true,
    type: "serial",
  },
  {
    Header: "صورت وضعیت",
    accessor: "invoice",
    type: "lookup",
    req: true,
    notInGrid: true,
  },
  {
    Header: "شناسه نامه گام",
    accessor: "letter_shenase",  
    type: "text",
    req: true,
  },{
    Header: "شماره نامه گام",
    accessor: "letter_no",  
    type: "text",
    req: true,
  },{
    Header: "تاریخ نامه گام",
    accessor: "letter_date",  
    type: "date",
    req: true,
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


export const entityName = 'invoice_logistics';
export const pageHeader = 'ارسال به مدیریت امور تدارکات و مهندسی ';

