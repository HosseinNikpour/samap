/* eslint-disable default-case */
/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from 'react';
import { getItems, insertItem, deleteItem, updateItem, checkPermission } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import { columns, entityName } from './static';
import { message, Select } from 'antd';
import DatePicker from 'react-datepicker2';
import moment from 'moment-jalaali';
import Static, { priority_options, workload_options, resualt_options, execute_method_options } from '../static';

const TechnicalCommittee = (props) => {
    const BoxRef = useRef(null), GridRef = useRef(null);;

    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});
    const [obj, setObj] = useState({});
    const [mode, setMode] = useState('');
    const [permission_id, setPermission_id] = useState(0);
    const [supervisor_options, setSupervisor_options] = useState([]);
    // const [execute_method_options, setExecute_method_options] = useState([]);

    const getData = () => {
        setMode('');
        GridRef.current.scrollIntoView({ behavior: 'smooth' });
        Promise.all([getItems(entityName), getItems("baseInfo")
            , checkPermission(5)]).then((response) => {
                if (response[2].data.per_id > 0) {
                    setPermission_id(response[2].data.per_id);
                    let dt = response[0].data;
                    debugger;
                    dt.forEach(e => {
                        e.letter_date = e.letter_date ? moment(e.letter_date) : undefined;
                        e.deadline = e.deadline ? moment(e.deadline) : undefined;
                    });
                    setData(dt);
                    setSupervisor_options(response[1].data.filter(a => a.group_id === 11).map(a => { return { key: a.id, label: a.title, value: a.id } }));
                }
            })
        setObj({});;
    }
    useEffect(() => {
        getData();
    }, [])


    const saveBtnClick = () => {

        let err = {};
        columns.filter(a => a.req).forEach(a => {

            if (document.getElementById(a.accessor))
                if (a.type === 'lookup')
                    err[a.accessor + "_id"] = obj[a.accessor + "_id"] ? false : true;
                else
                    err[a.accessor] = obj[a.accessor] ? false : true;
        })
        err["letter_date"] = obj["letter_date"] ? false : true;
        if (obj.resualt_id == 1) {
            err["execute_method_id"] = obj["execute_method_id"] ? false : true;
            if (obj.execute_method_id == 2)
                err["workload_id"] = obj["workload_id"] ? false : true;
            err["supervisor_id"] = obj["supervisor_id"] ? false : true;
            err["priority_id"] = obj["priority_id"] ? false : true;
            err["deadline"] = obj["deadline"] ? false : true;

        }

        if (Object.values(err).filter(a => a).length > 0) {
            setErrors(err);
            BoxRef.current.scrollIntoView({ behavior: 'smooth' });
            alert("لطفا موارد الزامی را وارد کنید");
        }

        else {

            if (mode === 'new') {
                insertItem(obj, entityName).then(response => {
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
                var formData = new FormData();
                if (obj.f_file_attachment) formData.append("file_attachment", obj.f_file_attachment);
                formData.append("data", JSON.stringify(obj));
                updateItem(formData, entityName, 'multipart/form-data').then(response => {
                    if (response.data.type !== "Error") {
                        if (obj.resualt_id != 3) {
                            let rr = {
                                id: obj.project_id, project_state_id: obj.resualt_id == 1 ? 4 : 5
                                , supervisor_id: obj.supervisor_id, workload_id: obj.workload_id
                            };
                            updateItem(rr, "request/changeValues").then(response1 => {
                                if (response1.data.type !== "Error") {
                                    message.success('آیتم با موفقیت ذخیره شد');
                                    getData();
                                }
                            })
                        }
                        else {
                            message.success('آیتم با موفقیت ذخیره شد');
                            getData();
                        }
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
    const setDeadline = () => {
        let dateAdd = 0;
      
        if (obj.execute_method_id === 2)//قابل انجام- داخلی
        {
            switch (obj.priority_id) {
                case 1://فوری
                    if (obj.workload_id === 1) dateAdd = 1 * 30;//کوچک
                    else if (obj.workload_id === 2) dateAdd = 3 * 30;// متوسط
                    // else if(obj.workload_id===3) dateAdd=obj.;// بزرگ
                    break;
                case 2://متوسط
                    if (obj.workload_id === 1) dateAdd = 2 * 30;//کوچک
                    else if (obj.workload_id === 2) dateAdd = 5 * 30;// متوسط
                    // else if(obj.workload_id===3) dateAdd=obj.;// بزرگ
                    break;
                case 3://عادی
                    if (obj.workload_id === 1) dateAdd = 3 * 30;//کوچک
                    else if (obj.workload_id === 2) dateAdd = 8 * 30;// متوسط
                    // else if(obj.workload_id===3) dateAdd=obj.;// بزرگ
                    break;
            }
        }
        else if (obj.execute_method_id === 4)//قابل انجام - برونسپاری -پروپوزال
        {
            switch (obj.priority_id) {
                case 1://فوری
                    dateAdd = 1 * 30;
                    break;
                case 2://متوسط
                    dateAdd = 1.5 * 30;
                    break;
                case 3://عادی
                    dateAdd = 2 * 30;
                    break;
            }
        }
        else if (obj.execute_method_id === 3)//قابل انجام -فعالیت
        {
            switch (obj.priority_id) {
                case 1://فوری
                    dateAdd = 14;
                    break;
                case 2://متوسط
                    dateAdd = 1 * 30;
                    break;
                case 3://عادی
                    dateAdd = 2 * 30;
                    break;
            }
        }
       
        // o.letter_date=value;
        // o.deadline=moment(value).add(dateAdd, 'days');
        setObj({ ...obj, deadline: moment(obj.letter_date).add(dateAdd, 'days') });
        //     setObj({...obj,deadline:moment(value).add(dateAdd, 'days')})

    }

    return (<div className="container-fluid">
        <div className="row" style={{ paddingTop: '15px' }}>
            <div className="col">
                <div className="card ">
                    <div className="card-header border-0">
                        <div className="row align-items-center" ref={GridRef}>
                            <div className="col">
                                <h3 className="mb-0">مصوبات کمیته فنی</h3>
                            </div>
                            {/*   {permission_id >1 && <div className="col text-right">
                                <button className="btn btn-icon btn-primary" type="button" onClick={btnNewClick}>
                                    <span className="btn-inner--icon"><i className="fas fa-plus"></i></span>
                                    <span className="btn-inner--text">مورد جدید</span>
                                </button>
                            </div> }*/}
                        </div>
                    </div>
                    <div className='table-responsive'>
                        <TableContainer columns={columns.filter(a => !a.notInGrid)} data={data}
                            displayClick={displayBtnClick}
                            deleteClick={permission_id > 3 ? deleteBtnClick : undefined}
                            editClick={permission_id > 2 ? editBtnClick : undefined} />
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
                                <h3 className="mb-0">  {mode === 'new' ? 'اضافه کردن آیتم جدید' : mode === 'edit' ? 'ویرایش آیتم' : 'مشاهده آیتم'}</h3>
                                <hr></hr>
                            </div>
                        </div>
                    </div>
                    <div className='card-body' style={{ marginTop: '-50px' }}>
                        <form>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">نام پروژه</label>
                                        {/* <Select className={errors.project_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={project_options}
                                            value={obj.project_id} onSelect={(values) => setObj({ ...obj, project_id: values })}
                                        /> */}
                                        <input className="form-control" type="text"
                                            value={obj.vw_project} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">تاریخ جلسه</label>
                                        {/* <DatePicker onChange={value => setObj({ ...obj, meeting_date: value })}
                                            value={obj.meeting_date} disabled={mode === 'display'} {...Static.datePickerDefaultProp}
                                            className={errors.meeting_date ? "form-control error-control" : 'form-control'} /> */}
                                        <input className="form-control" type="text"
                                            value={moment(obj.meeting_date).format('jYYYY/jMM/jDD')} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">شماره جلسه</label>
                                        {/* <input className={errors.meeting_no ? "form-control error-control" : "form-control"} type="text" value={obj.meeting_no}
                                            onChange={(e) => setObj({ ...obj, meeting_no: e.target.value })} disabled={mode === 'display'} /> */}
                                        <input className="form-control" type="text"
                                            value={obj.meeting_no} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">نتیجه</label>
                                        <Select className={errors.resualt_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={resualt_options}
                                            value={obj.resualt_id} onSelect={(values) => setObj({ ...obj, resualt_id: values })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {obj.resualt_id && <div className='border-box'>
                                {obj.resualt_id === 1 && <div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">شرایط اجرا</label>
                                                <label className="req-label">*</label>
                                                <Select className={errors.execute_method_id ? "form-control error-control" : "form-control"}
                                                    {...Static.selectDefaultProp} disabled={mode === 'display'} options={execute_method_options}
                                                    value={obj.execute_method_id} onSelect={(values) => setObj({ ...obj, execute_method_id: values })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">ناظر</label>
                                                <label className="req-label">*</label>
                                                <Select id='supervisor_id' className={errors.supervisor_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={supervisor_options}
                                                    value={obj.supervisor_id} onSelect={(values) => setObj({ ...obj, supervisor_id: values })}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">اولویت</label>
                                                <label className="req-label">*</label>
                                                <Select id='priority_id' className={errors.priority_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={priority_options}
                                                    value={obj.priority_id} onSelect={(values) => setObj({ ...obj, priority_id: values })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">حجم کاری</label>
                                               {obj.execute_method_id == 2 &&<label className="req-label">*</label>}
                                                <Select id='workload_id' className={errors.workload_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={workload_options}
                                                    value={obj.workload_id} onSelect={(values) => setObj({ ...obj, workload_id: values })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                }

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
                                    {/* {obj.deadline?obj.deadline.format('jYYYY/jMM/jDD'):''} */}
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">تاریخ نامه گام</label>
                                            <label className="req-label">*</label>
                                            <DatePicker id='letter_date' onChange={(value) => setObj({ ...obj, letter_date: value })}
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
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label className="form-control-label">توضیحات</label>

                                            <textarea rows={3} id='description' className={errors.description ? "form-control error-control" : "form-control"} type="text" value={obj.description}
                                                onChange={(e) => setObj({ ...obj, description: e.target.value })} disabled={mode === 'display'} />
                                        </div>
                                    </div>
                                    {obj.resualt_id == 1 &&
                                        <div className="col">
                                            <div className="form-group">
                                                <label className="form-control-label">مهلت</label>
                                                <label className="req-label">*</label>
                                                <DatePicker id='deadline' onChange={value => setObj({ ...obj, deadline: value })}
                                                    value={obj.deadline} disabled={mode === 'display'} {...Static.datePickerDefaultProp}
                                                    className={errors.deadline ? "form-control error-control" : 'form-control'} />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            }
                            {mode !== 'display' && <div className="row">
                                <div className="col">
                                    {obj.resualt_id == 1 && <button type="button" className="btn btn-outline-primary" onClick={setDeadline}>محاسبه مهلت</button>}
                                    <button type="button" className="btn btn-outline-primary" onClick={saveBtnClick}>ذخیره</button>
                                    <button type="button" className="btn btn-outline-warning" onClick={cancelBtnClick}>انصراف</button>
                                </div>
                            </div>}

                        </form>
                    </div>
                </div>
            </div>
            }
        </div >

    </div >)
}

export default TechnicalCommittee;