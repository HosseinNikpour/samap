/* eslint-disable eqeqeq */
/* eslint-disable no-sparse-arrays */
import { projectState_options, priority_options } from '../static';
export const columns = [
  {
    Header: "شناسه",
    accessor: "id",
    notInGrid: true,
    notInForm: true,
    type: "serial",
  },
  {
    Header: "نوع درخواست",
    accessor: "req_type",
    type: "lookup",
    req: true,
    notInGrid: true,
  },
  {
    Header: "نوع درخواست",
    accessor: "req_type_id",
    notInForm: true,
    render: (text, _row) => (text) ? reqType_options.find(a => a.key == text).label : '',
  },
  {
    Header: "نام پروژه",
    accessor: "name",
    req: true,
    type: "text",
  },
  {
    Header: "اولویت پروژه",
    accessor: "priority",
    notInGrid: true,
    req: true,
    type: "lookup",
  },
  {
    Header: "اولویت پروژه",
    accessor: "priority_id",
    notInForm: true,
    render: (text, row) => (text) ? priority_options.find(a => a.key == text).label : '',
  },
  {
    Header: "مدیریت/ اداره/ واحد متقاضی",
    accessor: "applicant",
    type: "lookup",
    req: true,
    notInGrid: true,
  },
  {
    Header: "متقاضی",
    accessor: "vw_applicant",
    notInForm: true,
  },
  {
    Header: "مدیریت/ اداره/ واحد همکار",
    accessor: "colleague",
    notInGrid: true,
    type: "lookup",
  },
  {
    Header: "پیمانکار",
    accessor: "contractor",
    notInGrid: true,
    type: "lookup",
  }, {
    Header: "استراتژی",
    accessor: "strategy",
    notInGrid: true,
    type: "lookup",
  }, {
    Header: "پیشنهاد اجرا",
    accessor: "execution",
    notInGrid: true,
    type: "lookup",
  }, {
    Header: "حجم کاری",
    accessor: "workload",
    notInGrid: true,
    type: "lookup",
  }, {
    Header: "اهداف پروژه",
    accessor: "goals",
    notInGrid: true,
    type: "note",
  }, {
    Header: "محدوده پروژه و استفاده کننده گان",
    accessor: "scopes",
    notInGrid: true,
    type: "note",
  },
  {
    Header: "ارکان/ ذینفعان",
    accessor: "pillars",
    notInGrid: true,
    type: "note",
  },
  {
    Header: "ریسک های پروژه",
    accessor: "project_risks",
    notInGrid: true,
    type: "note",
  },

  {
    Header: "پیش نیازهای اجرای پروژه",
    accessor: "implementation_requirements",
    notInGrid: true,
    type: "note",
  }, {
    Header: "بازه زمانی مورد انتظار",
    accessor: "time_period",
    notInGrid: true,
    type: "lookup",
  }, {
    Header: "مخاطرات و مشکللات پروژه",
    accessor: "project_difficulties",
    notInGrid: true,
    type: "note",
  }, {
    Header: "عواید مالی طرح",
    accessor: "financial_income_id",
    notInGrid: true,
    type: "text",
  },
  , {
    Header: "عواید غیر مالی طرح",
    accessor: "not_financial_income_id",
    notInGrid: true,
    type: "text",
  },
  {
    Header: "آخرین وضعیت",
    accessor: "project_state_id",
    type: "lookup",
    render: (text, row) => (text) ? projectState_options.find(a => a.key == text).label : '',
  },
  {
    Header: "کد پروژه",
    accessor: "project_code",
    type: "text",
    notInGrid: true,
  },
  {
    Header: "تاریخ ثبت",
    accessor: "req_date",
    type: "date",
    notInGrid: true,
  },
  {
    Header: "کاربر ثبت کننده",
    accessor: "req_user",
    type: "text",
    notInGrid: true,
  },
  {
    Header: '',
    accessor: 'id',
    width: '50px',
    render: (text) => <a rel="noreferrer" target="_blank" href={'http://10.39.95.172/reports_SSRS/report/Project_Dashboard?rs:embed=true&rc:zoom=page%20width&rc:parameters=false&project=' + text}>
      <i className="fas fa-chart-line" title='آخرین وضعیت پروژه'></i>
    </a>
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

export const reqType_options = [{ key: 1, label: 'درخواست‌های کسب و کار', value: 1 },
{ key: 2, label: 'درخواست‌های فناوری اطلاعات', value: 2 },
{ key: 3, label: 'درخواست‌های امور سازمان', value: 3 },];

export const entityName = 'request';
export const pageHeader = 'درخواست ها';

