/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from 'react';
import { getItems, insertItem, deleteItem, updateItem, checkPermission } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import { columns, entityName, reqType_options } from './static';
import { message, Select } from 'antd';
import DatePicker from 'react-datepicker2';
import moment from 'moment-jalaali';
import Static, { priority_options, workload_options, projectState_options } from '../static';

import convertArrayToTable from '../../components/downloadExcelfile';

const Request = (props) => {
    const BoxRef = useRef(null), GridRef = useRef(null);;

    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});
    const [obj, setObj] = useState({});
    const [mode, setMode] = useState('');
    const [applicant_options, setApplicant_options] = useState([]);
    const [supervisor_options, setSupervisor_options] = useState([]);
    const [colleague_options, setColleague_options] = useState([]);
    const [contractor_options, setContractor_options] = useState([]);
    const [timePeriod_options, setTimePeriod_options] = useState([]);
    const [strategy_options, setStrategy_options] = useState([]);
    const [execution_options, setExecution_options] = useState([]);
    const [financialIncome_options, setfinancialIncome_options] = useState([]);
    const [notFinancialIncome_options, setnotFinancialIncome_options] = useState([]);
    const [permission_id, setPermission_id] = useState(0);

    const getData = () => {
        setMode('');
        GridRef.current.scrollIntoView({ behavior: 'smooth' });
        Promise.all([getItems(entityName, { tbName: 'request_vw_list', where: ' where 1=1 ' })
            , getItems("baseInfo"), checkPermission(1)]).then((response) => {
                if (response[2].data.per_id > 0) {
                    setPermission_id(response[2].data.per_id);
                    
                    let dt = response[0].data;
                    dt.forEach(e => {
                        e.req_date = e.req_date ? moment(e.req_date) : undefined;
                        e.letter_date = e.letter_date ? moment(e.letter_date) : undefined;
                        e.financial_income_id = e.financial_income_id ? JSON.parse("[" + e.financial_income_id + "]") : undefined;
                        e.not_financial_income_id = e.not_financial_income_id ? JSON.parse("[" + e.not_financial_income_id + "]") : undefined;
                    });

                    setData(dt);

                    setTimePeriod_options(response[1].data.filter(a => a.group_id === 17).map(a => { return { key: a.id, label: a.title, value: a.id } }));
                    setfinancialIncome_options(response[1].data.filter(a => a.group_id === 2).map(a => { return { key: a.id, label: a.title, value: a.id } }));
                    setnotFinancialIncome_options(response[1].data.filter(a => a.group_id === 3).map(a => { return { key: a.id, label: a.title, value: a.id } }));
                    setApplicant_options(response[1].data.filter(a => a.group_id === 11).map(a => { return { key: a.id, label: a.title, value: a.id } }));
                    setColleague_options(response[1].data.filter(a => a.group_id === 11).map(a => { return { key: a.id, label: a.title, value: a.id } }));
                    setSupervisor_options(response[1].data.filter(a => a.group_id === 11).map(a => { return { key: a.id, label: a.title, value: a.id } }));
                    setContractor_options(response[1].data.filter(a => a.group_id === 13).map(a => { return { key: a.id, label: a.title, value: a.id } }));
                    setStrategy_options(response[1].data.filter(a => a.group_id === 15).map(a => { return { key: a.id, label: a.title, value: a.id } }));
                    setExecution_options(response[1].data.filter(a => a.group_id === 16).map(a => { return { key: a.id, label: a.title, value: a.id } }));

                }
            })
        setObj({});
        setErrors({});
    }
    useEffect(() => {
        getData();
    }, [])


    const btnNewClick = () => {
        setMode('new');
        BoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setObj({});
    }
    const saveBtnClick = () => {

        let err = {};
        columns.filter(a => a.req).forEach(a => {
            if (a.type === 'lookup')
                err[a.accessor + "_id"] = obj[a.accessor + "_id"] ? false : true;
            else
                err[a.accessor] = obj[a.accessor] ? false : true;
        })


        if (Object.values(err).filter(a => a).length > 0) {
            setErrors(err);
            BoxRef.current.scrollIntoView({ behavior: 'smooth' });
            alert("لطفا موارد الزامی را وارد کنید");
        }

        else {

            var formData = new FormData();
            obj.req_user = JSON.parse(localStorage.getItem('user')).username;
            obj.req_date = new Date();
            if (mode === 'new') obj.project_state_id = 1;
            if (obj.f_file_attachment) formData.append("file_attachment", obj.f_file_attachment);
            formData.append("data", JSON.stringify(obj));
            if (mode === 'new') {
                insertItem(formData, entityName, 'multipart/form-data').then(response => {

                    if (response.data.type !== "Error") {
                        message.success('آیتم با موفقیت ذخیره شد');
                        getData();
                    }
                    else {
                        message.error('خطا در ذخیره سازی اطلاعات');
                        console.log(response.data.message);
                    }
                }).catch((error) => {
                    message.error('بروز خطا در سیستم');
                    console.log(error)
                });
            }
            else if (mode === 'edit') {
                updateItem(formData, entityName, 'multipart/form-data').then(response => {
                    if (response.data.type !== "Error") {
                        message.success('آیتم با موفقیت ذخیره شد');
                        getData();
                    }
                    else {
                        message.error('خطا در ذخیره سازی اطلاعات');
                        console.log(response.data.message);
                    }
                }).catch((error) => {
                    message.error('بروز خطا در سیستم');
                    console.log(error)
                });
            }
        }
    }
    const deleteBtnClick = (item) => {

        deleteItem(item.id, entityName).then(a => {
            getData();
        });

    }
    const displayBtnClick = (item) => {
        setMode('display');
        BoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setObj(item);
        debugger;
    }
    const editBtnClick = (item) => {
        setMode('edit');
        BoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setObj(item);
    }
    const cancelBtnClick = () => {
        setMode('');
        GridRef.current.scrollIntoView({ behavior: 'smooth' });

    }
    const btnDownloadClick=()=>{
        convertArrayToTable(data,'لیست درخواست ها')
    }
    return (<div className="container-fluid">
        <div className="row" style={{ paddingTop: '15px' }}>
            <div className="col">
                <div className="card ">
                    <div className="card-header border-0">
                        <div className="row align-items-center" ref={GridRef}>
                            <div className="col">
                                <h3 className="mb-0">درخواست ها</h3>
                            </div>
                           {permission_id >1 && <div className="col text-right">
                                <button className="btn btn-icon btn-primary" type="button" onClick={btnNewClick}>
                                    <span className="btn-inner--icon"><i className="fas fa-plus"></i></span>
                                    <span className="btn-inner--text">ثبت درخواست جدید</span>
                                </button>
                            </div>}
                            <button className="btn btn-icon btn-primary" type="button" onClick={btnDownloadClick} style={{backgroundColor: '#ffcd05',borderColor: '#ffcd05'}}>
                                    <span className="btn-inner--icon"><i className="fa fa-download"></i></span>                
                                </button>
                        </div>
                    </div>
                    <div className='table-responsive'>
                        <TableContainer columns={columns.filter(a => !a.notInGrid)} data={data}
                            displayClick={displayBtnClick}
                            deleteClick={permission_id >3?deleteBtnClick:undefined}                        
                            editClick={permission_id >2?editBtnClick:undefined} />
                    </div>
                </div>
            </div>
        </div>

        <div className="row" style={{ paddingTop: '15px' }} ref={BoxRef}>
            {mode !== '' && <div className="col">
                <div className="card ">
                    <div className="card-header border-0">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="mb-0">  {mode === 'new' ? 'ایجاد درخواست جدید' : mode === 'edit' ? 'ویرایش درخواست' : 'مشاهده درخواست'}</h3>
                                <hr></hr>
                            </div>
                        </div>
                    </div>
                    <div className='card-body' style={{ marginTop: '-50px' }}>
                        <form>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label className="form-control-label">نوع درخواست</label>
                                        <label className="req-label">*</label>
                                        <Select className={errors.req_type_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={reqType_options}
                                            value={obj.req_type_id} onSelect={(values) => setObj({ ...obj, req_type_id: values })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {obj.req_type_id && <div>
                                <div className='row'>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">نام پروژه</label>
                                            <label className="req-label">*</label>
                                            <input className={errors.name ? "form-control error-control" : "form-control"} type="text" value={obj.name}
                                                onChange={(e) => setObj({ ...obj, name: e.target.value })} disabled={mode === 'display'} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">مدیریت/ اداره/ واحد متقاضی</label>
                                            <label className="req-label">*</label>
                                            <Select className={errors.applicant_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={applicant_options}
                                                value={obj.applicant_id} onSelect={(values) => setObj({ ...obj, applicant_id: values })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">مدیریت/ اداره/ واحد همکار</label>
                                            <Select className={errors.colleague_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={colleague_options}
                                                value={obj.colleague_id} onSelect={(values) => setObj({ ...obj, colleague_id: values })}
                                            />
                                        </div>
                                    </div>


                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">استراتژی</label>
                                            <Select className={errors.strategy_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={strategy_options}
                                                value={obj.strategy_id} onSelect={(values) => setObj({ ...obj, strategy_id: values })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">اولویت پروژه</label>
                                            <label className="req-label">*</label>
                                            <Select className={errors.priority_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={priority_options}
                                                value={obj.priority_id} onSelect={(values) => setObj({ ...obj, priority_id: values })}
                                            />
                                        </div>
                                    </div>


                                </div>
                                {obj.req_type_id == 2 && <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label className="form-control-label">پیشنهاد اجرا</label>
                                            <Select className={errors.execution_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={execution_options}
                                                value={obj.execution_id} onSelect={(values) => setObj({ ...obj, execution_id: values })}
                                            />
                                        </div>
                                    </div>

                                </div>}
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">پیمانکار</label>
                                            <Select className={errors.contractor_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={contractor_options}
                                                value={obj.contractor_id} onSelect={(values) => setObj({ ...obj, contractor_id: values })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">بازه زمانی مورد انتظار</label>
                                            <Select className={errors.time_period_id ? "form-control error-control" : "form-control"}
                                                {...Static.selectDefaultProp} disabled={mode === 'display'} options={timePeriod_options}
                                                value={obj.time_period_id} onSelect={(values) => setObj({ ...obj, time_period_id: values })}
                                            />

                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">اهداف پروژه</label>
                                            <textarea className={errors.goals ? "form-control error-control" : "form-control"} rows={3}
                                                defaultValue={obj.goals}
                                                onChange={(e) => setObj({ ...obj, goals: e.target.value })} disabled={mode === 'display'} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">محدوده پروژه و استفاده کننده گان</label>
                                            <textarea className={errors.scopes ? "form-control error-control" : "form-control"} rows={3} value={obj.scopes}
                                                onChange={(e) => setObj({ ...obj, scopes: e.target.value })} disabled={mode === 'display'} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">ارکان/ ذینفعان</label>
                                            <textarea className={errors.pillars ? "form-control error-control" : "form-control"} rows={3} value={obj.pillars}
                                                onChange={(e) => setObj({ ...obj, pillars: e.target.value })} disabled={mode === 'display'} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">ریسک های پروژه</label>
                                            <textarea rows={3} className={errors.project_risks ? "form-control error-control" : "form-control"} type="text" value={obj.project_risks}
                                                onChange={(e) => setObj({ ...obj, project_risks: e.target.value })} disabled={mode === 'display'} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">پیش نیازهای اجرای پروژه</label>
                                            <textarea rows={3} className={errors.implementation_requirements ? "form-control error-control" : "form-control"} type="text" value={obj.implementation_requirements}
                                                onChange={(e) => setObj({ ...obj, implementation_requirements: e.target.value })} disabled={mode === 'display'} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">مخاطرات و مشکللات پروژه</label>
                                            <textarea rows={3} className={errors.project_difficulties ? "form-control error-control" : "form-control"} type="text" value={obj.project_difficulties}
                                                onChange={(e) => setObj({ ...obj, project_difficulties: e.target.value })} disabled={mode === 'display'} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">عواید مالی طرح</label>
                                            <Select className={errors.financial_income_id ? "form-control error-control" : "form-control"}
                                                {...Static.selectDefaultProp} disabled={mode === 'display'} options={financialIncome_options} mode="multiple"
                                                value={obj.financial_income_id} onChange={(values) => setObj({ ...obj, financial_income_id: values })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">عواید غیر مالی طرح</label>
                                            <Select className={errors.not_financial_income_id ? "form-control error-control" : "form-control"}
                                                {...Static.selectDefaultProp} disabled={mode === 'display'} options={notFinancialIncome_options} mode="multiple"
                                                value={obj.not_financial_income_id} onChange={(values) => setObj({ ...obj, not_financial_income_id: values })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='border-box'>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">شناسه نامه گام</label>
                                                <label className="req-label">*</label>
                                                <input id='letter_shenase' className={errors.letter_shenase ? "form-control error-control" : "form-control"} type="text" value={obj.letter_shenase}
                                                    onChange={(e) => setObj({ ...obj, letter_shenase: e.target.value })} disabled={mode === 'display'} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">شماره نامه گام</label>
                                                {/* <label className="req-label">*</label> */}
                                                <input id='letter_no' className={errors.letter_no ? "form-control error-control" : "form-control"} type="text" value={obj.letter_no}
                                                    onChange={(e) => setObj({ ...obj, letter_no: e.target.value })} disabled={mode === 'display'} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">تاریخ نامه گام</label>
                                                <label className="req-label">*</label>
                                                <DatePicker id='letter_date' onChange={value => setObj({ ...obj, letter_date: value })}
                                                    value={obj.letter_date} disabled={mode === 'display'} {...Static.datePickerDefaultProp}
                                                    className={errors.letter_date ? "form-control error-control" : 'form-control'} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">ضمائم</label>

                                                {mode !== 'display' && <input id='file_attachment' className={errors.file_attachment ? "form-control error-control" : "form-control"} type="file"
                                                    onChange={(e) => setObj({ ...obj, f_file_attachment: e.target.files[0] })} disabled={mode === 'display'} />}
                                                {obj.file_attachment && <div><a rel="noreferrer" target="_blank" href={obj.file_attachment}>مشاهده فایل</a>
                                                    {mode === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                        onClick={() => setObj({ ...obj, file_attachment: false })}></i>}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">توضیحات</label>

                                                <textarea rows={3} id='description' className={errors.description ? "form-control error-control" : "form-control"} type="text" value={obj.description}
                                                    onChange={(e) => setObj({ ...obj, description: e.target.value })} disabled={mode === 'display'} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {mode !== 'new' && <div>
                                    <div className='row'>
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">ناظر</label>
                                                <Select className={errors.supervisor_id ? "form-control error-control" : "form-control"}
                                                    {...Static.selectDefaultProp} disabled={true} options={supervisor_options}
                                                    value={obj.supervisor_id} onSelect={(values) => setObj({ ...obj, supervisor_id: values })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">حجم کاری</label>
                                                <Select className={errors.workload_id ? "form-control error-control" : "form-control"}
                                                    {...Static.selectDefaultProp} disabled={true} options={workload_options}
                                                    value={obj.workload_id} onSelect={(values) => setObj({ ...obj, workload_id: values })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">آخرین وضعیت</label>
                                                <Select className={errors.project_state_id ? "form-control error-control" : "form-control"}
                                                    {...Static.selectDefaultProp} disabled={mode === 'display'} options={projectState_options}
                                                    value={obj.project_state_id} onSelect={(values) => setObj({ ...obj, project_state_id: values })} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">کد پروژه</label>
                                                <input className={errors.project_code ? "form-control error-control" : "form-control"} type="text" value={obj.project_code}
                                                    onChange={(e) => setObj({ ...obj, project_code: e.target.value })} disabled={mode === 'display'} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">تاریخ ثبت</label>
                                                <input className="form-control" type="text"
                                                    value={obj.req_date.format('jYYYY/jMM/jDD')} disabled={true} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">کاربر ثبت کننده</label>
                                                <input className="form-control" type="text"
                                                    value={obj.req_user} disabled={true} />
                                            </div>
                                        </div>
                                    </div></div>}
                                {mode !== 'display' && <div className="row">
                                    <div className="col">
                                        <button type="button" className="btn btn-outline-primary" onClick={saveBtnClick}>ذخیره</button>
                                        <button type="button" className="btn btn-outline-warning" onClick={cancelBtnClick}>انصراف</button>
                                    </div>
                                </div>}
                            </div>}
                        </form>
                    </div>
                </div>
            </div>
            }
        </div>

    </div>)
}

export default Request;