export const entity_options = [{ label: 'فرم ثبت درخواست', value: 1, key: 1 },
{ label: 'فرم ثبت استعلام', value: 2, key: 2 },
{ label: 'فرم استعلام درخواست', value: 3, key: 3 },
{ label: 'فرم دستور جلسه کمیته', value: 4, key: 4 },
{ label: 'فرم صورتجلسه کمیته', value: 5, key: 5 },
{ label: 'فرم مصوبات', value: 6, key: 6 },
{ label: 'فرم دریافت پروپوزال', value: 7, key: 7 },
{ label: 'فرم پیش نویس قرارداد', value: 8, key: 8 },
{ label: 'فرم انعقاد قرارداد و ابلاغ', value: 9, key: 9 },

{ label: 'فرم صدور فاکتور', value: 10, key: 10 },
{ label: 'فرم استعلام فاکتور', value: 11, key: 11 },
{ label: 'ارسال به شرکت', value: 12, key: 12 },
{ label: 'پاسخ شرکت', value: 13, key: 13 },
{ label: 'تدارکات', value: 14, key: 14 },
{ label: 'مالی', value: 15, key: 15 },

];
export const entityName = 'permission';
export const pageHeader = 'اطلاعات دسترسی ها';

export const columns = [
  {
    Header: "فرم",
    accessor: "entity",
    req: true,
    type: 'lookup',
    notInGrid: true,
  },
  {
    Header: "فرم",
    accessor: "entity_id",
    render: (text, row) => (text) ? entity_options.find(a => a.key == text).label : '',
  },
  {
    Header: "کاربر",
    accessor: "user",
    req: true,
    type: 'lookup',
    notInGrid: true,
  },
  {
    Header: "کاربر",
    accessor: "vw_user_name",
  },
  {
    Header: "دسترسی",
    accessor: "permission",
    req: true,
    type: 'lookup',
    notInGrid: true,
  },
  {
    Header: "دسترسی",
    accessor: "permission_id",
    render: (text, row) => (text) ? permissions_options.find(a => a.key == text).label : '',
  },
]

export const permissions_options = [{ label: 'مشاهده', value: 1, key: 1 },
{ label: 'اضافه', value: 2, key: 2 },
{ label: 'ویرایش', value: 3, key: 3 },
{ label: 'همه موارد', value: 4, key: 4 },]