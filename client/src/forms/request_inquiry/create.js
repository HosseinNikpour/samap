import React, { useState, useEffect } from 'react';
import { getItems, insertItem, updateItem } from '../../api/index';

import { columns, entityName } from './static';
import { message, Select } from 'antd';
import DatePicker from 'react-datepicker2';
import moment from 'moment-jalaali';
import Static, { priority_options } from '../static';

const CreateInquiry = (props) => {


    const [project_options, setProject_options] = useState([]);
    const [reviewUnit_options, setReviewUnit_options] = useState([]);
    const [errors, setErrors] = useState({});
    const [obj, setObj] = useState({});
    const [selectedObj, setSelectedObj] = useState({});
    // eslint-disable-next-line no-unused-vars
    const [mode, setMode] = useState('new');



    const getData = () => {

        Promise.all([getItems('request', { tbName: 'request_vw1', where: 'where project_state_id =1' }), getItems("baseInfo")]).then((response) => {
            setProject_options(response[0].data.map(a => { return { ...a, key: a.id, label: a.name, value: a.id } }));
            setReviewUnit_options(response[1].data.filter(a => a.group_id === 11 && a.code === 1).map(a => { return { key: a.id, label: a.title, value: a.id } }));

        })
        setObj({});;
    }
    useEffect(() => {
        getData();
    }, [])

    const setDeadline = () => {
        setObj({ ...obj, deadline: moment(obj.letter_date).add(21, 'days') });
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
            //  BoxRef.current.scrollIntoView({ behavior: 'smooth' });
            alert("لطفا موارد الزامی را وارد کنید");
        }

        else {

            setErrors({})
            // obj.inquiry_date = moment().format('YYYY-MM-DD');
          //  obj.deadline = moment().add(21, 'days').format('YYYY-MM-DD');

            var formData = new FormData();
            if (obj.f_file_attachment) formData.append("file_attachment", obj.f_file_attachment);
            formData.append("data", JSON.stringify(obj));

            if (mode === 'new') {
                insertItem(formData, entityName, 'multipart/form-data').then(response => {
                    if (response.data.type !== "Error") {
                        let rr = { id: obj.project_id, project_state_id: 2 };
                        updateItem(rr, "request/changeValues").then(response1 => {
                            if (response1.data.type !== "Error") {
                                message.success('آیتم با موفقیت ذخیره شد');
                                setSelectedObj({});
                                //setObj({});
                                getData();
                            }
                            else {
                                message.error('خطا در در تغییر وضعیت');
                                console.log(response.data.message);
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
        }

    }
    const projectChange = (val) => {
        let x = project_options.find(a => a.key === val);
        x.vw_priority = x.priority_id ? priority_options.find(a => a.key === x.priority_id).label : '';
        setSelectedObj(x)
        setObj({ ...obj, project_id: val })
    }
    return (<div className="container-fluid">


        <div className="row" style={{ paddingTop: '15px' }} >
            <div className="col">
                <div className="card ">
                    <div className="card-header border-0">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="mb-0"> ثبت استعلام جدید</h3>
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
                                        <Select className={errors.project_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={project_options}
                                            value={obj.project_id} onSelect={(values) => projectChange(values)}// setObj({ ...obj, project_id: values })
                                        />
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
                                        <label className="form-control-label">اولویت پروژه</label>
                                        <input className="form-control" type="text"
                                            value={selectedObj.vw_priority} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">پیمانکار</label>
                                        <input className="form-control" type="text"
                                            value={selectedObj.vw_contractor} disabled={true} />
                                    </div>
                                </div>
                            </div>
                            <div className='border-box'>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">اداره/واحد بررسی کننده</label>
                                            <label className="req-label">*</label>
                                            <Select className={errors.review_unit_id ? "form-control error-control" : "form-control"}
                                                {...Static.selectDefaultProp} disabled={mode === 'display'} options={reviewUnit_options}
                                                mode="multiple"
                                                value={obj.review_unit_id} onChange={(values) => setObj({ ...obj, review_unit_id: values })}
                                            />
                                        </div>
                                    </div>
                                </div>
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
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label className="form-control-label">توضیحات</label>

                                            <textarea rows={3} id='description' className={errors.description ? "form-control error-control" : "form-control"} type="text" value={obj.description}
                                                onChange={(e) => setObj({ ...obj, description: e.target.value })} disabled={mode === 'display'} />
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="form-group">
                                            <label className="form-control-label">مهلت</label>
                                            {/* <input className={errors.deadline ? "form-control error-control" : "form-control"} type="text"
                                                value={obj.letter_date ? moment(obj.letter_date).add(21, 'days').format('jYYYY/jMM/jDD') : ''} disabled={true} /> */}
                                            <DatePicker onChange={value => setObj({ ...obj, deadline: value })}
                                            value={obj.deadline} disabled={mode === 'display'} {...Static.datePickerDefaultProp}
                                            className={errors.deadline ? "form-control error-control" : 'form-control'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <button type="button" className="btn btn-outline-primary" onClick={setDeadline}>محاسبه مهلت</button>
                                    <button type="button" className="btn btn-outline-primary" onClick={saveBtnClick} disabled={!obj.deadline}>ذخیره</button>
                                    {/* <button type="button" className="btn btn-outline-warning" onClick={cancelBtnClick}>انصراف</button> */}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>

    </div>)
}

export default CreateInquiry;