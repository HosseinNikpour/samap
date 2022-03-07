/* eslint-disable eqeqeq */
import moment from 'moment-jalaali';

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
    notInForm: true,
  },
  {
    Header: "اداره/واحد بررسی کننده",
    accessor: "review_unit",
    type: "lookup",
    req: true,
    notInGrid: true,
  },
  {
    Header: "اداره/واحد بررسی کننده",
    accessor: "vw_review_unit",
    notInForm: true,
  },
  {
    Header: "اداره/واحد همکار",
    accessor: "vw_colleague",
    notInForm: true,
  },
  {
    Header: "شناسه نامه گام",
    accessor: "letter_shenase",
    notInGrid: true,
    type: "text",
    req: true,
  },
  {
    Header: "شماره نامه گام",
    accessor: "letter_no",
    notInGrid: true,
    type: "text",
    //req: true,
  }, {
    Header: "تاریخ نامه گام",
    accessor: "letter_date",
    render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
    type: "date",
    notInGrid: true,
    req: true,
  }, {
    Header: "مهلت",
    accessor: "deadline",
    type: "date",
    render: (text, row) => (text) ? moment(text).format('jYYYY/jMM/jDD') : '',
  },
  {
    Header: "پاسخ استعلام",
    accessor: "response",
    type: "lookup",
    //req: true,
    notInGrid: true,
  },
  {
    Header: "توضیحات",
    accessor: "description",
    type: "note",
    notInGrid: true,
  }, {
    Header: "ضمائم",
    accessor: "file_attachment",
    type: "file",
    notInGrid: true,
  },
];


export const entityName = 'requestInquiry';
export const pageHeader = 'استعلام درخواست';

