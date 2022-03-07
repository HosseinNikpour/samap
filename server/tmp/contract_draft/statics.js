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
    Header: "نام پروژه",
    accessor: "project",
    type: "lookup",
    req: true,
   
  },
 
  {
    Header: "تاریخ نامه",
    accessor: "letter_date",
    type: "date",
    req: true,
    render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
  },
  {
    Header: "شناسه نامه",
    accessor: "letter_shenase",
    type: "text",
    req: true,
  },
  {
    Header: "مهلت",
    accessor: "deadline",  
    type: "note",
    render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
  },
];


export const entityName = 'contract_draft';
export const pageHeader = 'ارسال پیش نویس به مدیریت امور تداکات و مهندسی';

