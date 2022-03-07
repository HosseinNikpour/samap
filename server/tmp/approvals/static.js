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
    Header: "نوع پروژه",
    accessor: "project_type",
    type: "lookup",
    req: true,
   
  },
  {
    Header: "زمان بندی تحویل",
    accessor: "delivery_schedule",
    render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
    type: "date",
    req: true,
  },
  {
    Header: "زمان بندی ارسال پروپوزال",
    accessor: "proposal_schedule",
    render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
    //notInGrid: true,
    type: "date",
    req: true,
  },{
    Header: "درصد پیشرفت",
    accessor: "progress",
    type: "number",
   // notInGrid: true,
  },
];


export const entityName = 'approvals';
export const pageHeader = 'مصوبات';

