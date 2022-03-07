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
   // req: true,
   notInGrid: true,
  },
  {
    Header: "نام پروژه",
    accessor: "vw_project",
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
    notInGrid: true,
    type: "note",
    req: true,
  },
  {
    Header: "نیازمندی‌های سخت‌افزاری",
    accessor: "hardware_requirements",  
    type: "note",
    req: true,
    notInGrid: true,
  },{
    Header: "مشکلات",
    accessor: "difficulties",  
    type: "note",
    req: true,
    notInGrid: true,
  },
  {
    Header: "هزینه اعلامی",
    accessor: "declaration_fee",  
    type: "decimal",
    req: true,
    render:(text,row)=>(text)?text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''
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


export const entityName = 'proposal';
export const pageHeader = 'دریافت پروپوزال نهایی';

