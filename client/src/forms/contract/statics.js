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
    accessor: "contract_no",  
    type: "text",
    //req: true,
  },
  {
    Header: "مبلغ قرارداد تولید",
    accessor: "production_price",
    type: "decimal",
    req: true,
    render:(text,row)=>(text)?text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''
  },
  {
    Header: "شروع قرارداد تولید",
    accessor: "production_start_date",
    type: "date",
  // req: true,
  render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
  },
  {
    Header: "پایان قرارداد تولید",
    accessor: "production_end_date",
    type: "date",
  // req: true,
  render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
  },
  {
    Header: "مبلغ قرارداد پشتیبانی",
    accessor: "support_price",
    type: "decimal",
    req: true,
    render:(text,row)=>(text)?text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''
  },
  {
    Header: "شروع قرارداد پشتیبانی",
    accessor: "support_start_date",
    type: "date",
  // req: true,
  render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
  },
  {
    Header: "پایان قرارداد پشتیبانی",
    accessor: "support_end_date",
    type: "date",
  // req: true,
  render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
  },
  
];


export const entityName = 'contract';
export const pageHeader = 'انعقاد و ابلاغ قرارداد';

