import React, { useState, useEffect, useRef } from 'react';
import { getItem, getItems, insertItem, deleteItem, updateItem } from '../../api/index';

import { columns, entityName, invoice_type_options } from './static';
import { message, Select, Modal, Popconfirm } from 'antd';
import DatePicker from 'react-datepicker2';
import moment from 'moment-jalaali';
import Static, { invoiceState_options } from '../static';

const Invoice = (props) => {

    const [errors, setErrors] = useState({});
    const [obj, setObj] = useState({});
    const [mode, setMode] = useState('');
    const [project_options, setProject_options] = useState([]);
    const [project_id, setProject_id] = useState();
    const [selectedObj, setSelectedObj] = useState({});
    const [tableData, setTableData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reviewUnit_options, setReviewUnit_options] = useState([]);
    //const [volumes_options, setVolumes_options] = useState([]);

    const getData = () => {
        setMode('');
        Promise.all([getItems('request', { tbName: 'request_vw1', where: '  WHERE (project_state_id = 10)' }), getItems("baseInfo")]).then((response) => {
            setProject_options(response[0].data.map(a => { return { ...a, key: a.id, label: ` ${a.vw_contract_no} -${a.name} `, value: a.id } }));
            setReviewUnit_options(response[1].data.filter(a => a.group_id === 11 && a.code === 1).map(a => { return { key: a.id, label: a.title, value: a.id } }));
         //   setVolumes_options(response[1].data.filter(a => a.group_id === 19).map(a => { return { key: a.id, label: a.title, value: a.id } }));
        })
        setObj({});;
    }
    useEffect(() => {
        getData();
        setSelectedObj({});
    }, [])
    const getTableData = (p_id) => {
        if (!p_id) p_id = project_id;
        console.log(p_id)
        getItem(p_id, entityName).then((response) => {

            let dt = response.data;
            dt.forEach(e => {
                //e.vw_resualt_id = e.vw_resualt_id ? resualt_options.find(a => a.key == e.vw_resualt_id).label : '';
                // e.vw_execute_method_id = e.vw_execute_method_id ? execute_method_options.find(a => a.key == e.vw_execute_method_id).label : '';
                e.invoice_date = e.invoice_date ? moment(e.invoice_date) : undefined;
            });
            setTableData(dt);
        });
    }

    const btnNewClick = () => {
        setMode('new');
        setIsModalVisible(true);
        setObj({});
    }
    const saveBtnClick = () => {

        let err = {};
        // columns.filter(a => a.req).forEach(a => {
        //     if (a.type === 'lookup')
        //         err[a.accessor + "_id"] = obj[a.accessor + "_id"] ? false : true;
        //     else
        //         err[a.accessor] = obj[a.accessor] ? false : true;
        // })
        // if (mode === 'new')
        err["name"] = obj["name"] ? false : true;
        err["price"] = obj["price"] ? false : true;
        err["invoice_date"] = obj["invoice_date"] ? false : true;
        err["invoice_type_id"] = obj["invoice_type_id"] ? false : true;

        if (Object.values(err).filter(a => a).length > 0) {
            setErrors(err);
            //   BoxRef.current.scrollIntoView({ behavior: 'smooth' });
            alert("لطفا موارد الزامی را وارد کنید");
        }

        else {
            var formData = new FormData();
            if (mode === 'new') {
                obj.invoice_state_id = 1;
                obj.project_id = project_id;
            }
            //  if (obj.f_file_attachment) formData.append("file_attachment", obj.f_file_attachment);
            formData.append("data", JSON.stringify(obj));
            if (mode === 'new') {
                insertItem(formData, entityName, 'multipart/form-data').then(response => {
                    if (response.data.type !== "Error") {
                        message.success('آیتم با موفقیت ذخیره شد');
                        getTableData();
                        setIsModalVisible(false);
                        setObj({})
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
                        getTableData();
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
    const saveInquiryBtnClick = () => {
        let err = {};

        err["review_unit_id"] = obj["review_unit_id"] ? false : true;
        err["letter_shenase"] = obj["letter_shenase"] ? false : true;
       // err["letter_no"] = obj["letter_no"] ? false : true;
        err["letter_date"] = obj["letter_date"] ? false : true;
        err["company_letter_shenase"] = obj["company_letter_shenase"] ? false : true;
        // err["company_letter_no"] = obj["company_letter_no"] ? false : true;
         err["company_letter_date"] = obj["company_letter_date"] ? false : true;
        err["invoice_no"] = obj["invoice_no"] ? false : true;

        if (Object.values(err).filter(a => a).length > 0) {
            setErrors(err);
            alert("لطفا موارد الزامی را وارد کنید");
        }

        else {
            //debugger;
            var formData = new FormData();
            obj.deadline = moment(obj.letter_date).add(14, 'days');
            let invoice_no = obj.invoice_no;
            delete obj.invoice_no;
            if (obj.f_file_attachment) formData.append("file_attachment", obj.f_file_attachment);
            formData.append("data", JSON.stringify(obj));

            let ii = { id: obj.invoice_id, invoice_state_id: 2, invoice_no };
            Promise.all([insertItem(formData, "invoice_inquiry", 'multipart/form-data'),
            updateItem(ii, "invoice/changeValues")]).then(response => {
                if (response[0].data.type !== "Error" && response[1].data.type !== "Error") {
                    message.success('آیتم با موفقیت ذخیره شد');
                    getData();
                    getTableData();
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


    const deleteBtnClick = (item) => {

        deleteItem(item.id, entityName).then(a => {
            getData();
        });

    }
    const displayBtnClick = (item) => {
        setMode('inquiry');
        setObj({ invoice_id: item.id,invoice_no:item.invoice_no })
    }
    const editBtnClick = (item) => {
        setMode('edit');
        setObj(item);
        setIsModalVisible(true);

    }
    const cancelBtnClick = () => {
        setMode('');
        setIsModalVisible(false);

    }
    const projectChange = (val) => {
        let x = project_options.find(a => a.key === val);
        getTableData(val);
       // x.production_duration=`${x.production_duration_m} ماه و ${x.production_duration_d} روز`
       // x.support_duration=`${x.support_duration_m} ماه و ${x.support_duration_d} روز`
        setSelectedObj(x);
        setProject_id(val);

    }

    return (<div className="container-fluid">
        <div className="row" style={{ paddingTop: '15px' }} >
            <div className="col">
                <div className="card ">
                    <div className="card-header border-0">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="mb-0"> ثبت فاکتور</h3>
                                <hr></hr>
                            </div>
                        </div>
                    </div>
                    <div className='card-body' style={{ marginTop: '-50px' }}>
                        <form>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">نام پروژه - شماره قراداد</label>
                                        <label className="req-label">*</label>
                                        <Select id='project' className={errors.project_id ? "form-control error-control" : "form-control"}
                                            {...Static.selectDefaultProp} disabled={mode === 'display'} options={project_options}
                                            value={project_id} onSelect={(values) => projectChange(values)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {project_id && <div>
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
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">مبلغ قرارداد تولید</label>
                                            <input className="form-control" type="text"
                                                value={selectedObj.production_price ? selectedObj.production_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''} disabled={true} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">شروع قرارداد تولید</label>
                                            <input className="form-control" type="text"
                                                value={selectedObj.production_start_date ? moment(selectedObj.production_start_date).format('jYYYY/jMM/jDD') : ''} disabled={true} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">پایان قرارداد تولید</label>
                                            <input className="form-control" type="text"
                                                value={selectedObj.production_end_date ? moment(selectedObj.production_end_date).format('jYYYY/jMM/jDD') : ''} disabled={true} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">مبلغ قرارداد پشتیبانی</label>
                                            <input className="form-control" type="text"
                                                value={selectedObj.support_price ? selectedObj.support_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''} disabled={true} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">شروع قرارداد پشتیبانی</label>
                                            <input className="form-control" type="text"
                                               // value={selectedObj.support_duration ? selectedObj.support_duration : ''} disabled={true} />
                                                value={selectedObj.support_start_date ? moment(selectedObj.support_start_date).format('jYYYY/jMM/jDD') : ''} disabled={true} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">پایان قرارداد پشتیبانی</label>
                                            <input className="form-control" type="text"
                                               // value={selectedObj.support_duration ? selectedObj.support_duration : ''} disabled={true} />
                                                value={selectedObj.support_end_date ? moment(selectedObj.support_end_date).format('jYYYY/jMM/jDD') : ''} disabled={true} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-control-label">ثبت تحویل شونده ها</label>
                                            <label className="req-label">*</label>
                                            <div className='col-1  ml-auto'>
                                                <i className="fa fa-plus-circle add-button" onClick={() => btnNewClick()}></i>
                                            </div>
                                            <table className='table table-striped table-bordered' style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <td>ردیف</td><td>نام فعالیت</td><td>تاریخ</td><td>مبلغ</td><td>نوع فعالیت</td><td>شماره فاکتور</td><td>نفر ساعت</td><td>وضعیت پرداخت</td><td></td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableData.map((item, i) => {
                                                        return (
                                                            <tr>
                                                                <td>{i + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td>{item.invoice_date?item.invoice_date.format('jYYYY/jMM/jDD'):''}</td>
                                                                <td>{item.price?item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''}</td>
                                                                <td>{item.invoice_type_id?invoice_type_options.find(a => a.key == item.invoice_type_id).label:''}</td>
                                                                <td>{item.invoice_no}</td>
                                                                <td>{item.person_hours}</td>
                                                                <td>{invoiceState_options.find(a => a.key == item.invoice_state_id).label}</td>
                                                                <td>
                                                                    <div>
                                                                        <i className="fa fa-edit" onClick={() => editBtnClick(item)}  ></i>
                                                                        <Popconfirm title="  آیا از حذف مطمئن هستید ؟" okText="تایید" cancelText="عدم تایید"
                                                                            onConfirm={() => deleteBtnClick(item)}>
                                                                            <i className="far fa-trash-alt" style={{ marginRight: '8px' }}></i>
                                                                        </Popconfirm>
                                                                        {(item.invoice_state_id === 1 || item.invoice_state_id === 3) && <i className="far fa-clipboard" onClick={() => displayBtnClick(item)} style={{ marginRight: '8px' }} ></i>}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                {mode === "inquiry" &&
                                    <div className='border-box' style={{ paddingBottom: '10px' }}>
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
                                            <div className="col-3">
                                                <div className="form-group">
                                                    <label className="form-control-label">شماره فاکتور</label>
                                                    <label className="req-label">*</label>
                                                    <input id='invoice_no' className={errors.invoice_no ? "form-control error-control" : "form-control"} 
                                                    type="text" value={obj.invoice_no}
                                                        onChange={(e) => setObj({ ...obj, invoice_no: e.target.value })} disabled={mode === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-3">
                                                <div className="form-group">
                                                    <label className="form-control-label">شناسه نامه شرکت</label>
                                                    <label className="req-label">*</label>
                                                    <input id='company_letter_shenase' className={errors.company_letter_shenase ? "form-control error-control" : "form-control"} type="text" value={obj.company_letter_shenase}
                                                        onChange={(e) => setObj({ ...obj, company_letter_shenase: e.target.value })} disabled={mode === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="form-group">
                                                    <label className="form-control-label">شماره نامه شرکت</label>
                                                    {/* <label className="req-label">*</label> */}
                                                    <input id='company_letter_no' className={errors.company_letter_no ? "form-control error-control" : "form-control"} type="text" value={obj.company_letter_no}
                                                        onChange={(e) => setObj({ ...obj, company_letter_no: e.target.value })} disabled={mode === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="form-group">
                                                    <label className="form-control-label">تاریخ نامه شرکت</label>
                                                    <label className="req-label">*</label>
                                                    <DatePicker id='company_letter_date' onChange={value => setObj({ ...obj, company_letter_date: value })}
                                                        value={obj.company_letter_date} disabled={mode === 'display'} {...Static.datePickerDefaultProp}
                                                        className={errors.company_letter_date ? "form-control error-control" : 'form-control'} />
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
                                                    <input className={errors.deadline ? "form-control error-control" : "form-control"} type="text"
                                                        value={obj.letter_date ? moment(obj.letter_date).add(14, 'days').format('jYYYY/jMM/jDD') : ''} disabled={true} />

                                                </div>
                                            </div>
                                            {/* <div className="col-3">
                                            <div className="form-group">
                                                <label className="form-control-label">حجم نفر ساعت</label>
                                                <Select className={errors.volume_id ? "form-control error-control" : "form-control"}
                                                    {...Static.selectDefaultProp} disabled={mode === 'display'} options={volumes_options}
                                                    value={obj.volume_id} onSelect={(values) => setObj({ ...obj, volume_id: values })} />

                                            </div>
                                        </div> */}
                                        </div>

                                        <div className="row">
                                            <div className="col">
                                                <button type="button" className="btn btn-outline-primary" onClick={saveInquiryBtnClick}>ذخیره</button>
                                                <button type="button" className="btn btn-outline-warning" onClick={cancelBtnClick}>انصراف</button>
                                            </div>
                                        </div>
                                    </div>}
                            </div>}
                        </form>
                    </div>
                </div>
            </div>

        </div>
        <div dir='RTL'>
            <Modal title="اضافه کردن ردیف جدید" visible={isModalVisible} closable={false}
                okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}>
                <div className="row">
                    <div className="col-9">
                        <div className="form-group">
                            <label className="form-control-label">نام فعالیت</label>
                            <label className="req-label">*</label>
                            <input className="form-control" type="text" value={obj.name}
                                onChange={(e) => setObj({ ...obj, name: e.target.value })} />
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="form-group">
                            <label className="form-control-label">نفر ساعت</label>
                            <label className="req-label">*</label>
                            <input className="form-control" type="number" value={obj.person_hours}
                                onChange={(e) => setObj({ ...obj, person_hours: e.target.value })} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label className="form-control-label">تاریخ</label>
                            <label className="req-label">*</label>
                            <DatePicker className="form-control" value={obj.invoice_date}
                                onChange={(e) => setObj({ ...obj, invoice_date: e })}
                                {...Static.datePickerDefaultProp} />
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-group">
                            <label className="form-control-label">مبلغ</label>
                            <label className="req-label">*</label>
                            <input className="form-control" type="number" value={obj.price}
                                onChange={(e) => setObj({ ...obj, price: e.target.value })} />
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-group">
                            <label className="form-control-label">نوع فعالیت</label>
                            <label className="req-label">*</label>
                            <Select className="form-control" value={obj.invoice_type_id}
                                onSelect={(e) => setObj({ ...obj, invoice_type_id: e })}
                                {...Static.selectDefaultProp} options={invoice_type_options} />
                        </div>
                    </div>
                </div>
                {mode !== 'display' && <div className="row">
                    <div className="col">
                        <button type="button" className="btn btn-outline-primary" onClick={saveBtnClick}>ذخیره</button>
                        <button type="button" className="btn btn-outline-warning" onClick={cancelBtnClick}>انصراف</button>
                    </div>
                </div>}
            </Modal>
        </div>
    </div>)
}

export default Invoice;