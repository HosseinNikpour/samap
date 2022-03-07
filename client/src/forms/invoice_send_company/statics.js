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
    accessor: "vw_project",  
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
    Header: "شماره فاکتور",
    accessor: "vw_invoice_no",  
  },
  {
    Header: "تاریخ",
    accessor: "vw_invoice_date",  
    render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
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
];


export const entityName = 'invoice_send_company';
export const pageHeader = 'فرم ارسال به شرکت';

