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
    //req: true,
    notInGrid: true,
  },
  {
    Header: "نام پروژه",
    accessor: "vw_project",  
  },
  {
    Header: "متولی",
    accessor: "vw_applicant",  
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
  {
    Header: "مهلت",
    accessor: "deadline",  
    type: "note",
    render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
  },
];


export const entityName = 'contract_draft';
export const pageHeader = 'ارسال پیش نویس به مدیریت امور تداکات و مهندسی';

