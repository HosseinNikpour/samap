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
    Header: "صورت وضعیت",
    accessor: "invoice",
    type: "lookup",
    req: true,
    notInGrid: true,
  },
  {
    Header: "نام پروژه",
    accessor: "vw_project_name",  
  },
  {
    Header: "شماره قرارداد",
    accessor: "vw_contract_no",  
  },
  {
    Header: "عنوان صورت وضعیت",
    accessor: "vw_invoice_name",  
  },
  {
    Header: "واحد بررسی کننده",
    accessor: "vw_review_unit",  
  },
  {
    Header: "نفر ساعت",
    accessor: "person_hours", 
    type: "number", 
    notInGrid: true,
    //req: true,
  },
  // {
  //   Header: "تاریخ صورت وضعیت",
  //   accessor: "vw_invoice_date",  
  //   render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
  // },
  {
    Header: "وضعیت صورتحساب",
    accessor: "resualt",
    type: "lookup",
    req: true,
    notInGrid: true,
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


export const entityName = 'invoice_inquiry';
export const pageHeader = 'صورت وضعیت -اعلام نظر ناظر';

