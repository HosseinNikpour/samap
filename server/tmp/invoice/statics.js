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
    notInGrid: true,
  },
  {
    Header: "ثبت تحویل شونده ها",
    accessor: "deliverables",
    type: "note",
    req: true,
   
  },
  {
    Header: "تاریخ",
    accessor: "invoice_date",
    type: "date",
    req: true,
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
    type: "text",
    req: true,
  },{
    Header: "مبلغ صورتحساب",
    accessor: "invoice_price",  
    type: "decimal",
    req: true,
  },{
    Header: "حجم نفرساعت",
    accessor: "volume_id",  
    type: "lookup",
   
  },
  {
    Header: "ضمائم",
    accessor: "file_attachment",
    type: "file",
    notInGrid: true,
  },
];


export const entityName = 'invoice';
export const pageHeader = 'فرم ثبت فاکتور';

