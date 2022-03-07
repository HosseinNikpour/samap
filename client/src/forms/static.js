export const successMessage = "عملیات با موفقیت انجام شد";
export const successDuration = 3;

export const errorMessage = "خطا در ذخیره سازی اطلاعات";
export const errorDuration = 3;

export const errorMesesagDuplicate = "اطلاعات مربوط به این سطر قبلا وارد سیستم شده";
export const errorDurationDuplicate = 5;

export const selectDefaultProp = {
    direction: "rtl", placeholder: 'انتخاب ...',
    filterOption: true, optionFilterProp: "label", showSearch: true
}

export const datePickerDefaultProp = {
    placeholder: "انتخاب تاریخ",
    format: "jYYYY/jMM/jDD", timePicker: false, isGregorian: false
}

export const numberDefaultProp = {
    thousandSeparator: true,
    displayType: 'input',
}



export const priority_options = [{ key: 1, label: 'فوری', value: 1 },
{ key: 2, label: 'متوسط', value: 2 },
{ key: 3, label: 'عادی', value: 3 },];

export const workload_options = [{ key: 1, label: 'کوچک', value: 1 },
{ key: 2, label: 'متوسط', value: 2 },
{ key: 3, label: 'بزرگ', value: 3 },];

export const projectState_options = [{ key: 1, label: 'ثبت درخواست', value: 1 },
{ key: 2, label: 'در انتظار استعلام', value: 2 },
{ key: 3, label: 'در انتظار کمیته فنی', value: 3 },
{ key: 4, label: 'تایید درخواست - کمیته فنی', value: 4 },
{ key: 5, label: 'رد درخواست - کمیته فنی', value: 5 },
{ key: 6, label: 'مصوب شده', value: 6 },
{ key: 7, label: 'رد شده', value: 7 },
{ key: 8, label: 'دریافت پروپوزال', value: 8 },
{ key: 9, label: 'پیشنویس قرارداد', value: 9 },
{ key: 10, label: 'انعقاد قرارداد', value: 10 },
{ key: 11, label: 'متوقف شده', value: 11 },
{ key: 12, label: 'خاتمه یافته', value: 12 },

];
export const invoiceState_options = [{ key: 1, label: 'ثبت شده', value: 1 },
{ key: 2, label: 'صدور استعلام', value: 2 },
 { key: 3, label: 'استعلام مجدد', value: 3 },
{ key: 4, label: 'ارسال به شرکت', value: 4 },
{ key: 5, label: 'پاسخ شرکت', value: 5 },
{ key: 6, label: 'ارسال به تدارکات', value:6 },
{ key: 7, label: 'ارسال به مالی', value: 7 },
{ key: 8, label: 'پرداخت شده', value: 8 },

];
export const response_options = [{ key: 1, label: 'نیازمند بررسی بیشتر', value: 1 },
{ key: 2, label: 'قابل انجام- داخلی', value: 2 },
{ key: 3, label: 'قابل انجام - برونسپاری -پروپوزال', value: 3 },
{ key: 4, label: 'قابل انجام -فعالیت', value: 4 },
{ key: 5, label: 'رد پروژه', value: 5 },];

export const resualt_options = [{ key: 1, label: 'تایید', value: 1 },
{ key: 2, label: 'رد', value: 2 },
{ key: 3, label: 'ابلاغ تکلیف', value: 3 },
];
export const invoice_response_options = [{ key: 1, label: 'تایید', value: 1 },
{ key: 2, label: 'رد', value: 2 },

];
export const execute_method_options = [
    { key: 2, label: 'داخلی', value: 2 },
    { key: 3, label: 'برونسپاری (فعالیت)', value: 3 },
    { key: 4, label: 'برونسپاری (پروپوزال)', value: 4 },
];

 
export default { numberDefaultProp, datePickerDefaultProp, selectDefaultProp, errorMesesagDuplicate, errorDurationDuplicate }