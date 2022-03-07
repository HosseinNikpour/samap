//import moment from 'moment-jalaali'
export const columns = [
    {
        Header: "شناسه",
        accessor: "id",
      //  notInGrid:true,
        notInForm:true,
        width: '100px'
    },
    {
        Header: "عنوان",
        accessor: "title",
        req:true,
    },
    {
        Header: "ترتیب",
        accessor: "sort",
        width: '100px'
    },
    {
        Header: "گروه",
        accessor: "group",
        notInGrid:true,
        notInForm:true,
    },
   
    
   
];
export const groups=[/*
{title:'عواید مالی طرح',value:2},
{title:'عواید غیر مالی طرح',value:3},

{title:'پاسخ استعلام',value:6},
{title:'نتایج کمیته',value:7},*/
{title:'واحدها',value:11},
// {title:'واحد بررسی استعلام',value:12},
{title:'پیمانکار',value:13},
// {title:'شرایط اجرا',value:14},
{title:'استراتژی',value:15},
{title:'پیشنهاد اجرا',value:16},
{title:'بازه زمانی مورد انتظار',value:17},
// {title:'نوع قرارداد',value:18},
{title:'حجم نفرساعت',value:19},
];
export const entityName='baseInfo';
export const pageHeader='اطلاعات پایه';