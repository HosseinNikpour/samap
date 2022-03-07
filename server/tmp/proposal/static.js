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
    Header: "زمانبندی",
    accessor: "scheduling",
    type: "date",
    req: true,
    render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
  },
  {
    Header: "ریسک ها",
    accessor: "risks",
   
    type: "note",
    req: true,
  },
  {
    Header: "نیازمندی‌های سخت‌افزاری",
    accessor: "hardware_requirements",  
    type: "note",
    req: true,
  },{
    Header: "مشکلات",
    accessor: "difficulties",  
    type: "note",
    req: true,
  },{
    Header: "ضمائم",
    accessor: "file_attachment",
    type: "file",
    notInGrid: true,
  },
  {
    Header: "هزینه اعلامی",
    accessor: "declaration_fee",  
    type: "decimal",
    req: true,
  },
];


export const entityName = 'proposal';
export const pageHeader = 'دریافت پروپوزال نهایی';

