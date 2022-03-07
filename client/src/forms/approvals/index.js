import React, { useState, useEffect, useRef } from 'react';
import { getItems, insertItem, deleteItem, updateItem,checkPermission } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import { columns, entityName, last_state_options } from './static';
import { message, Select } from 'antd';
import DatePicker from 'react-datepicker2';
import moment from 'moment-jalaali';
import Static, { resualt_options, execute_method_options, priority_options } from '../static';
import convertArrayToTable from '../../components/downloadExcelfile';

const Approvals = (props) => {
    const BoxRef = useRef(null), GridRef = useRef(null);;

    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});
    const [obj, setObj] = useState({});
    const [mode, setMode] = useState('');
    const [project_options, setProject_options] = useState([]);
    const [selectedObj, setSelectedObj] = useState({});
    const [permission_id, setPermission_id] = useState(0);

    const getData = () => {
        setMode('');
        GridRef.current.scrollIntoView({ behavior: 'smooth' });
        Promise.all([getItems(entityName),
        getItems('request', { tbName: 'request_vw3', where: '  WHERE (c.project_state_id = 4 OR c.project_state_id = 5)' }),
        checkPermission(6)]).then((response) => {
            if (response[2].data.per_id > 0) {
                setPermission_id(response[2].data.per_id);

                let dt = response[0].data;
                dt.forEach(e => {
                    e.vw_resualt_id = e.vw_resualt_id ? resualt_options.find(a => a.key == e.vw_resualt_id).label : '';
                    e.vw_execute_method_id = e.vw_execute_method_id ? execute_method_options.find(a => a.key == e.vw_execute_method_id).label : '';
                    e.letter_date = e.letter_date ? moment(e.letter_date) : undefined;
                    e.vw_deadline = e.vw_deadline ? moment(e.vw_deadline) : undefined;
                });

                setData(dt);
                setProject_options(response[1].data.map(a => { return { ...a, key: a.id, label: a.name, value: a.id } }));
            }
        })
        setObj({});
        setSelectedObj({});
    }
    useEffect(() => {
        getData();
    }, [])


    const btnNewClick = () => {
        setMode('new');
        BoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setSelectedObj({});
        setObj({ last_state_id: 1 })
    }
    const saveBtnClick = () => {

        let err = {};
        columns.filter(a => a.req).forEach(a => {
            if (a.type === 'lookup')
                err[a.accessor + "_id"] = obj[a.accessor + "_id"] ? false : true;
            else
                err[a.accessor] = obj[a.accessor] ? false : true;
        })
        if (mode === 'new')
            err["project_id"] = obj["project_id"] ? false : true;

        if (obj.last_state_id > 1) {
            err["letter_shenase"] = obj["letter_shenase"] ? false : true;
            //err["letter_no"] = obj["letter_no"] ? false : true;
            err["letter_date"] = obj["letter_date"] ? false : true;
        }

        if (Object.values(err).filter(a => a).length > 0) {
            setErrors(err);
            BoxRef.current.scrollIntoView({ behavior: 'smooth' });
            alert("لطفا موارد الزامی را وارد کنید");
        }

        else {
            var formData = new FormData();
            if (obj.f_file_attachment) formData.append("file_attachment", obj.f_file_attachment);
            formData.append("data", JSON.stringify(obj));

            if (mode === 'new') {
                insertItem(formData, entityName, 'multipart/form-data').then(response => {
                    if (response.data.type !== "Error") {

                        // eslint-disable-next-line eqeqeq
                        let psi = 6;
                        if (selectedObj.vw_resualt_id !== 1) psi = 7;
                        if (obj.last_state_id != 1) psi = obj.last_state_id;

                        let rr = { id: obj.project_id, project_state_id: psi };
                        updateItem(rr, "request/changeValues").then(response1 => {
                            if (response1.data.type !== "Error") {
                                message.success('آیتم با موفقیت ذخیره شد');
                                getData();
                            }
                        });
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
                delete obj.project_id;
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
        getItems('request', { tbName: 'request_vw3', where: 'where id=' + item.project_id }).then((response) => {
            setSelectedObj(response.data[0]);
        });
    }
    const editBtnClick = (item) => {
        setMode('edit');
        BoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setObj(item);
        getItems('request', { tbName: 'request_vw3', where: 'where id=' + item.project_id }).then((response) => {
            setSelectedObj(response.data[0]);
        });
    }
    const cancelBtnClick = () => {
        setMode('');
        GridRef.current.scrollIntoView({ behavior: 'smooth' });

    }
    const projectChange = (val) => {
        let x = project_options.find(a => a.key === val);
        setSelectedObj(x)
        setObj({ ...obj, project_id: val })
    }
    const btnDownloadClick=()=>{
        convertArrayToTable(data,'مصوبات')
    }
    return (<div className="container-fluid">
        <div className="row" style={{ paddingTop: '15px' }}>
            <div className="col">
                <div className="card ">
                    <div className="card-header border-0">
                        <div className="row align-items-center" ref={GridRef}>
                            <div className="col">
                                <h3 className="mb-0">مصوبات</h3>
                            </div>
                            {permission_id > 1 && <div className="col text-right">
                                <button className="btn btn-icon btn-primary" type="button" onClick={btnNewClick}>
                                    <span className="btn-inner--icon"><i className="fas fa-plus"></i></span>
                                    <span className="btn-inner--text">مورد جدید</span>
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
                                <div className="col-6">
                                    <div className="form-group">
                                        <label className="form-control-label">نام پروژه</label>
                                        <label className="req-label">*</label>
                                        {mode === 'new' && <Select id='project' className={errors.project_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={project_options}
                                            value={obj.project_id} onSelect={(values) => projectChange(values)}
                                        />}
                                        {mode !== 'new' && <input className="form-control" type="text"
                                            value={obj.vw_project} disabled={true} />}
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">شماره جلسه</label>
                                        <input className="form-control" type="text"
                                            value={selectedObj.vw_meeting_no} disabled={true} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">مدیریت/ اداره/ واحد متقاضی</label>
                                        <input className="form-control" type="text"
                                            value={selectedObj.vw_applicant} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">مدیریت/ اداره/ واحد همکار</label>
                                        <input className="form-control" type="text"
                                            value={selectedObj.vw_colleague} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">وضعیت پروژه</label>
                                        <input className="form-control" type="text"
                                            // eslint-disable-next-line eqeqeq
                                            value={selectedObj.vw_resualt_id ? resualt_options.find(a => a.key == selectedObj.vw_resualt_id).label : ''} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">اولویت پروژه</label>
                                        <input className="form-control" type="text"
                                            value={selectedObj.priority_id ? priority_options.find(a => a.key == selectedObj.priority_id).label : ''} disabled={true} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">پیمانکار</label>
                                        <input className="form-control" type="text"
                                            value={selectedObj.vw_contractor} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">ناظر</label>
                                        <input className="form-control" type="text"
                                            value={selectedObj.vw_supervisor} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">شرایط اجرا</label>
                                        <input className="form-control" type="text"
                                            value={selectedObj.vw_execute_method_id ? execute_method_options.find(a => a.key == selectedObj.vw_execute_method_id).label : ''} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">زمانبندی</label>
                                        <input className="form-control" type="text"
                                            value={selectedObj.vw_deadline ? moment(selectedObj.vw_deadline).format('jYYYY/jMM/jDD') : ''} disabled={true} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label className="form-control-label">آخرین وضعیت</label>
                                        <label className="req-label">*</label>
                                        <Select className={errors.last_state_id ? "form-control error-control" : "form-control"}
                                            {...Static.selectDefaultProp} disabled={mode === 'display'} options={last_state_options}
                                            value={obj.last_state_id} onSelect={(values) => setObj({ ...obj, last_state_id: values })}
                                        />
                                    </div>
                                </div>
                                {obj.last_state_id === 1 && <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">درصد پیشرفت</label>
                                        <input className="form-control" type="number" value={obj.progress}
                                            onChange={(e) => setObj({ ...obj, progress: e.target.value })} disabled={mode === 'display'} />

                                    </div>
                                </div>}
                            </div>
                            {obj.last_state_id !== 1 && <div className='border-box'>
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
                            }
                            {mode !== 'display' && <div className="row">
                                <div className="col">
                                    <button type="button" className="btn btn-outline-primary" onClick={saveBtnClick}>ذخیره</button>
                                    <button type="button" className="btn btn-outline-warning" onClick={cancelBtnClick}>انصراف</button>
                                </div>
                            </div>}
                        </form>
                    </div>
                </div>
            </div>
            }
        </div>

    </div>)
}

export default Approvals;