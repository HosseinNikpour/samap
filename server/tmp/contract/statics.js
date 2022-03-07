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
    Header: "مبلغ قرارداد",
    accessor: "contract_price",
    type: "decimal",
    req: true,
   
  },
  {
    Header: "مدت قرارداد",
    accessor: "contract_duration",
    type: "text",
    req: true,
  },
  {
    Header: "شماره قرارداد",
    accessor: "contract_no",  
    type: "text",
    req: true,
  },{
    Header: "ضمائم",
    accessor: "file_attachment",
    type: "file",
    notInGrid: true,
  },
];


export const entityName = 'contract';
export const pageHeader = 'انعقاد و ابلاغ قرارداد';

