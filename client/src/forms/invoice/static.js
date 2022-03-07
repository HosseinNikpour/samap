/* eslint-disable eqeqeq */
/* eslint-disable no-sparse-arrays */
import { invoiceState_options } from '../static';
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
    Header: "ثبت تحویل شونده ها",
    accessor: "deliverables",
    type: "note",
    req: true,
    notInGrid: true,
  },
  {
    Header: "تاریخ",
    accessor: "invoice_date",
    type: "date",
    req: true,
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
    req: true,
    notInGrid: true,
  },{
    Header: "تاریخ نامه گام",
    accessor: "letter_date",  
    type: "date",
    req: true,
    notInGrid: true,
  },{
    Header: "مبلغ صورتحساب",
    accessor: "invoice_price",  
    type: "decimal",
    req: true,
    render:(text,row)=>(text)?text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''
  },{
    Header: "حجم نفرساعت",
    accessor: "volume",  
    type: "lookup",
    notInGrid: true,
  },
  {
    Header: "ضمائم",
    accessor: "file_attachment",
    type: "file",
    notInGrid: true,
  },
  {
    Header: "آخرین وضعیت",
    accessor: "invoice_state_id",
    type: "lookup",
    render: (text, row) => (text) ?invoiceState_options.find(a=>a.key==text).label : '',
  },
];
export const invoice_type_options = [
  { key: 1, label: 'تولید', value: 1 },
  { key: 2, label: 'پشتیبانی', value: 2 },
  { key: 3, label: 'استرداد تضامین', value:3 },
  { key: 4, label: 'مفاصاحساب', value:4 },
  ];

export const entityName = 'invoice';
export const pageHeader = 'فرم ثبت فاکتور';

