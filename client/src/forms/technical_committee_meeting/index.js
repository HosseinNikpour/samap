import React, { useState, useEffect, useRef } from 'react';
import { getItems, insertItem, deleteItem, updateItem, checkPermission } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import { columns, entityName } from './static';
import { message, Select } from 'antd';
import DatePicker from 'react-datepicker2';
import moment from 'moment-jalaali';
import Static from '../static';

const TechnicalCommitteeMeeting = (props) => {
    const BoxRef = useRef(null), GridRef = useRef(null);;

    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});
    const [obj, setObj] = useState({});
    const [mode, setMode] = useState('');
    const [project_options, setProject_options] = useState([]);
    const [permission_id, setPermission_id] = useState(0);

    const getData = () => {
        setMode('');
        GridRef.current.scrollIntoView({ behavior: 'smooth' });
        Promise.all([getItems(entityName, { tbName: entityName, where: 'where 1=1 ' }),
        getItems("request", { tbName: 'request_vw1', where: 'where 3=3 ' })//project_state_id =3
            , checkPermission(4)]).then((response) => {
                if (response[2].data.per_id > 0) {
                    setPermission_id(response[2].data.per_id);
                    let dt = response[0].data;
                    dt.forEach(e => {
                        e.meeting_date = e.meeting_date ? moment(e.meeting_date) : undefined;
                        e.letter_date = e.letter_date ? moment(e.letter_date) : undefined;
                        e.project_id = e.project_id ? JSON.parse("[" + e.project_id + "]") : undefined;
                        //debugger;
                        try{
                        e.vw_project=e.project_id.map(a=>response[1].data.find(b=>b.id==a).name).toString();
                        }
                        catch(err)
                        {
                            
                        }
                    });

                    setData(dt);
                    setProject_options(response[1].data.filter(a=>a.project_state_id ===3).map(a => { return { key: a.id, label: a.name, value: a.id } }));
                }
            })
        setObj({});;
    }
    useEffect(() => {
        getData();
    }, [])


    const btnNewClick = () => {
        setMode('new');
        BoxRef.current.scrollIntoView({ behavior: 'smooth' });
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
            if (obj.f_file_attachment) formData.append("file_attachment", obj.f_file_attachment);
            formData.append("data", JSON.stringify(obj));
            if (mode === 'new') {
                let obj2 = { meeting_no: obj.meeting_no, meeting_date: obj.meeting_date.format('YYYY-MM-DD'), project_id: obj.project_id }
                Promise.all([insertItem(formData, entityName, 'multipart/form-data'),
                insertItem(obj2, "technical_committee")]).then(response => {
                    if (response[0].data.type !== "Error" && response[1].data.type !== "Error") {
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
                        //alert('آیتم با موفقیت ذخیره شد');
                        getData();
                    }
                    else {
                        // alert('خطا در ذخیره سازی اطلاعات');
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
    return (<div className="container-fluid">
        <div className="row" style={{ paddingTop: '15px' }}>
            <div className="col">
                <div className="card ">
                    <div className="card-header border-0">
                        <div className="row align-items-center" ref={GridRef}>
                            <div className="col">
                                <h3 className="mb-0"> دستور جلسه کمیته فنی</h3>
                            </div>
                            {permission_id > 1 && <div className="col text-right">
                                <button className="btn btn-icon btn-primary" type="button" onClick={btnNewClick}>
                                    <span className="btn-inner--icon"><i className="fas fa-plus"></i></span>
                                    <span className="btn-inner--text">مورد جدید</span>
                                </button>
                            </div>}
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
                                        <label className="req-label">*</label>
                                        <Select id='project' className={errors.project_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={project_options}
                                            mode="multiple" value={obj.project_id} onChange={(values) => setObj({ ...obj, project_id: values })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">شماره جلسه</label>
                                        <label className="req-label">*</label>
                                        <input id='meeting_no' className={errors.meeting_no ? "form-control error-control" : "form-control"} type="text" value={obj.meeting_no}
                                            onChange={(e) => setObj({ ...obj, meeting_no: e.target.value })} disabled={mode === 'display'} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">تاریخ جلسه</label>
                                        <label className="req-label">*</label>
                                        <DatePicker id='meeting_date' onChange={value => setObj({ ...obj, meeting_date: value })}
                                            value={obj.meeting_date} disabled={mode === 'display'} {...Static.datePickerDefaultProp}
                                            className={errors.meeting_date ? "form-control error-control" : 'form-control'} />
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

export default TechnicalCommitteeMeeting;