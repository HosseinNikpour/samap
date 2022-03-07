import moment from 'moment-jalaali'
export const columns = [
    {
        Header: "شناسه",
        accessor: "id",
        notInGrid:true,
        notInForm:true,
    },
    {
        Header: "نام و نام خانوادگی",
        accessor: "name",
        req:true
    },
    {
        Header: "نام کاربری",
        accessor: "username",
        req:true
    },
   
    {
        Header: "رمز عبور",
        accessor: "password",
        notInGrid:true,
       // req:true
    },
    {
        Header: "فعال؟",
        accessor: "enabled",
       
         render:( text,row ) => (text)?"بله":"خیر",
    },
    {
        Header: "تاریخ آخرین اتصال",
        accessor: "last_login",
        notInForm:true,
        render:( text,row ) => (text)?moment(text).format('jYYYY/jMM/jDD HH:mm'):''
    },
];
export const role_options=[
    { key: 1, label: 'کاربر', value: 1 },
    { key: 2, label: 'مشاهده کننده', value: 2 },
    { key:10, label: 'ادمین', value: 10 },
];
export const entityName='user';
export const pageHeader='مدیریت کاربران';