import React, { useState, useEffect, useRef } from 'react';
import { getItems, updateItem, checkPermission } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import { columns, entityName } from './static';
import { message, Select } from 'antd';
import DatePicker from 'react-datepicker2';
import moment from 'moment-jalaali';
import Static, { workload_options, response_options } from '../static';

const Requestinquiry = (props) => {
    const BoxRef = useRef(null), GridRef = useRef(null);;

    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});
    const [obj, setObj] = useState({});
    const [mode, setMode] = useState('');
   // const [permission_id, setPermission_id] = useState(0);

    const getData = () => {
        setMode('');
        GridRef.current.scrollIntoView({ behavior: 'smooth' });
        Promise.all([getItems(entityName + "/vw", { where: 'and response_id is null' })
            , checkPermission(3)]).then((response) => {
                if (response[1].data.per_id > 0) {
                 //   setPermission_id(response[2].data.per_id);
                    setData(response[0].data);
                }
            })
        setObj({});;
    }
    useEffect(() => {
        getData();
    }, [])


    const saveBtnClick = () => {

        let err = {};

        err["response_id"] = obj["response_id"] ? false : true;
        err["vw_workload_id"] = obj["vw_workload_id"] ? false : true;
        err["letter_shenase_replay"] = obj["letter_shenase_replay"] ? false : true;
       // err["letter_no_replay"] = obj["letter_no_replay"] ? false : true;
        err["letter_date_replay"] = obj["letter_date_replay"] ? false : true;

        if (Object.values(err).filter(a => a).length > 0) {
            setErrors(err);
            BoxRef.current.scrollIntoView({ behavior: 'smooth' });
            alert("لطفا موارد الزامی را وارد کنید");
        }

        else {
            var formData = new FormData();
            if (obj.f_file_attachment_replay) formData.append("file_attachment_replay", obj.f_file_attachment_replay);
            formData.append("data", JSON.stringify(obj));

            let rr = { id: obj.project_id, workload_id: obj.vw_workload_id };
            Promise.all([updateItem(formData, entityName, 'multipart/form-data'),
            updateItem(rr, "request/changeValues")]).then(response => {
                if (response[0].data.type !== "Error" && response[1].data.type !== "Error") {
                    //updateItem(formData, entityName, 'multipart/form-data').then((response) => {
                    //  if (response.data.type !== "Error") {
                    message.success('آیتم با موفقیت ذخیره شد');
                    getData();
                }
                else {
                    message.error('خطا در ذخیره سازی اطلاعات');
                    console.log(response[0].data.message);
                    console.log(response[1].data.message);
                }
            }).catch((error) => {
                message.error('بروز خطا در سیستم');
                console.log(error)
            });

        }
    }

    // const displayBtnClick = (item) => {
    //     setMode('display');
    //     BoxRef.current.scrollIntoView({ behavior: 'smooth' });
    //     setObj(item);
    // }
    const editBtnClick = (item) => {
        setErrors({});
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
                                <h3 className="mb-0">استعلام درخواست</h3>
                            </div>
                            {/* <div className="col text-right">
                                <button className="btn btn-icon btn-primary" type="button" onClick={btnChangeModeClick}>
                                    <span className="btn-inner--icon"><i className="fas fa-plus"></i></span>
                                    <span className="btn-inner--text">درخواست های پاسخ داده شده</span>
                                </button>

                            </div> */}
                        </div>
                    </div>
                    <div className='table-responsive'>
                        <TableContainer columns={columns.filter(a => !a.notInGrid)} data={data}
                            // displayClick={displayBtnClick}
                            //deleteClick={deleteBtnClick}                   
                            editClick={editBtnClick}
                        />
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
                                <h3 className="mb-0"> پاسخ استعلام</h3>
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
                                        <input className="form-control" type="text"
                                            value={obj.vw_project} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">اداره/واحد بررسی کننده</label>
                                        <input className="form-control" type="text"
                                            value={obj.vw_review_unit} disabled={true} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">شناسه نامه استعلام</label>
                                        <input className="form-control" type="text"
                                            value={obj.letter_shenase} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">شماره نامه استعلام</label>
                                        <input className="form-control" type="text"
                                            value={obj.letter_no} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">تاریخ استعلام</label>
                                        <input className="form-control" type="text"
                                            value={moment(obj.letter_date).format('jYYYY/jMM/jDD')} disabled={true} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">مهلت</label>
                                        <input className="form-control" type="text"
                                            value={moment(obj.deadline).format('jYYYY/jMM/jDD')} disabled={true} />
                                    </div>
                                </div>
                            </div>
                            <div className='border-box'>
                                <div className='row'>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">پاسخ استعلام</label>
                                            <label className="req-label">*</label>
                                            <Select className={errors.response_id ? "form-control error-control" : "form-control"}
                                                {...Static.selectDefaultProp} options={response_options} disabled={mode === 'display'}
                                                value={obj.response_id} onSelect={(values) => setObj({ ...obj, response_id: values })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">حجم کاری</label>
                                            <label className="req-label">*</label>
                                            <Select className={errors.vw_workload_id ? "form-control error-control" : "form-control"}
                                                {...Static.selectDefaultProp} options={workload_options} disabled={mode === 'display'}
                                                value={obj.vw_workload_id} onSelect={(values) => setObj({ ...obj, vw_workload_id: values })}
                                            />

                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">شناسه نامه گام</label>
                                            <label className="req-label">*</label>
                                            <input id='letter_shenase_replay' className={errors.letter_shenase_replay ? "form-control error-control" : "form-control"} type="text" value={obj.letter_shenase_replay}
                                                onChange={(e) => setObj({ ...obj, letter_shenase_replay: e.target.value })} disabled={mode === 'display'} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">شماره نامه گام</label>
                                            {/* <label className="req-label">*</label> */}
                                            <input id='letter_no_replay' className={errors.letter_no_replay ? "form-control error-control" : "form-control"} type="text" value={obj.letter_no_replay}
                                                onChange={(e) => setObj({ ...obj, letter_no_replay: e.target.value })} disabled={mode === 'display'} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">تاریخ نامه گام</label>
                                            <label className="req-label">*</label>
                                            <DatePicker id='letter_date_replay' onChange={value => setObj({ ...obj, letter_date_replay: value })}
                                                value={obj.letter_date_replay} disabled={mode === 'display'} {...Static.datePickerDefaultProp}
                                                className={errors.letter_date_replay ? "form-control error-control" : 'form-control'} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">ضمائم</label>

                                            {mode !== 'display' && <input id='file_attachment_replay' className={errors.file_attachment_replay ? "form-control error-control" : "form-control"} type="file"
                                                onChange={(e) => setObj({ ...obj, f_file_attachment_replay: e.target.files[0] })} disabled={mode === 'display'} />}
                                            {obj.file_attachment_replay && <div><a rel="noreferrer" target="_blank" href={obj.file_attachment_replay}>مشاهده فایل</a>
                                                {mode === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                    onClick={() => setObj({ ...obj, file_attachment_replay: false })}></i>}</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">توضیحات</label>

                                            <textarea rows={3} id='description_replay' className={errors.description_replay ? "form-control error-control" : "form-control"} type="text" value={obj.description_replay}
                                                onChange={(e) => setObj({ ...obj, description_replay_replay: e.target.value })} disabled={mode === 'display'} />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col">
                                    <button type="button" className="btn btn-outline-primary" onClick={saveBtnClick}>ذخیره</button>
                                    <button type="button" className="btn btn-outline-warning" onClick={cancelBtnClick}>انصراف</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            }
        </div >

    </div >)
}

export default Requestinquiry;