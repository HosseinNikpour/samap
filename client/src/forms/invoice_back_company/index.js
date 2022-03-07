import React, { useState, useEffect, useRef } from 'react';
import { getItems, insertItem, deleteItem, updateItem } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import { columns, entityName } from './statics';
import { message, Select } from 'antd';
import DatePicker from 'react-datepicker2';
import moment from 'moment-jalaali';
import Static from '../static';

const InvoicePayment = (props) => {
    const BoxRef = useRef(null), GridRef = useRef(null);;

    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});
    const [obj, setObj] = useState({});
    const [mode, setMode] = useState('');
    const [invoice_options, setInvoice_options] = useState([]);

    const getData = () => {
        setMode('');
        GridRef.current.scrollIntoView({ behavior: 'smooth' });
        Promise.all([getItems(entityName),
        getItems("invoice/vw", { tbName: 'invoice_vw1', where: '  WHERE (invoice_state_id = 5)' })]).then((response) => {
            let dt = response[0].data;
            dt.forEach(e => {
                e.letter_date = e.letter_date ? moment(e.letter_date) : undefined;
                // e.proposal_schedule = e.proposal_schedule ? moment(e.proposal_schedule) : undefined;
            });

            setData(dt);
            setInvoice_options(response[1].data.map(a => { return { key: a.id, label: `${a.vw_contract_no} - ${a.vw_project_name} - ${a.name}`, value: a.id } }));
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
        if (mode === 'new')
            err["invoice_id"] = obj["invoice_id"] ? false : true;

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
                // debugger;
                insertItem(formData, entityName, 'multipart/form-data').then(response => {
                    if (response.data.type !== "Error") {
                        let ii = { id: obj.invoice_id, invoice_state_id: 3 };
                        var fd = new FormData();
                        fd.append("data", JSON.stringify(ii));
                        updateItem(fd, "invoice", 'multipart/form-data').then(response1 => {
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
                                <h3 className="mb-0">فرم پاسخ شرکت</h3>
                            </div>
                            <div className="col text-right">
                                <button className="btn btn-icon btn-primary" type="button" onClick={btnNewClick}>
                                    <span className="btn-inner--icon"><i className="fas fa-plus"></i></span>
                                    <span className="btn-inner--text">مورد جدید</span>
                                </button>

                            </div>
                        </div>
                    </div>
                    <div className='table-responsive'>
                        <TableContainer columns={columns.filter(a => !a.notInGrid)} data={data}
                            deleteClick={deleteBtnClick}
                            displayClick={displayBtnClick}
                            editClick={editBtnClick} />
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
                                        <label className="form-control-label">صورت وضعیت</label>
                                        <label className="req-label">*</label>
                                        {mode === 'new' && <Select id='invoice' className={errors.invoice_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={invoice_options}
                                            value={obj.invoice_id} onSelect={(values) => setObj({ ...obj, invoice_id: values })}
                                        />}
                                        {mode !== 'new' && <input className="form-control" type="text"
                                            value={obj.vw_invoice} disabled={true} />}
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

export default InvoicePayment;