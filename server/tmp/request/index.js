import React, { useState, useEffect, useRef } from 'react';
import { getItems, insertItem, deleteItem, updateItem } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import {columns,entityName} from './statics';
import { message,Select } from 'antd';
//import DatePicker from 'react-datepicker2';
//import moment from 'moment-jalaali';
//import Static from '../static' ; 
 
 const Request = (props) => {
    const BoxRef = useRef(null), GridRef = useRef(null);;

    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});
    const [obj, setObj] = useState({});
    const [mode, setMode] = useState('');
    
    const getData = () => {
        setMode('');
        GridRef.current.scrollIntoView({ behavior: 'smooth' });
        Promise.all([ getItems(entityName),getItems("baseInfo")]).then((response) => {
            setData(response[0].data);
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
            if(a.type==='lookup')
            err[a.accessor+"_id"] = obj[a.accessor+"_id"] ? false : true;
            else
            err[a.accessor] = obj[a.accessor] ? false : true;
        })


        if (Object.values(err).filter(a=>a).length > 0) {
            setErrors(err);
            BoxRef.current.scrollIntoView({ behavior: 'smooth' });
            alert("لطفا موارد الزامی را وارد کنید");
        }

        else {

        if (mode === 'new') {
            insertItem(obj, entityName).then(response => {
                if (response.data.type !== "Error") {
                     message.success('آیتم با موفقیت ذخیره شد',3000);
                    //alert('آیتم با موفقیت ذخیره شد');
                    getData();
                }
                else{
                    //alert('خطا در ذخیره سازی اطلاعات');
                    message.error('خطا در ذخیره سازی اطلاعات', 3000);
                    console.log(response.data.message);
                }
            }).catch((error) => {
                message.error('بروز خطا در سیستم', 3000);
                console.log(error)});
        }
        else if (mode === 'edit') {
            updateItem(obj, entityName).then(response => {
                if (response.data.type !== "Error") {
                    message.success('آیتم با موفقیت ذخیره شد',3000);
                    //alert('آیتم با موفقیت ذخیره شد');
                    getData();
                }
                else{
                   // alert('خطا در ذخیره سازی اطلاعات');
                    message.error('خطا در ذخیره سازی اطلاعات', 3000);
                    console.log(response.data.message);
                }
            }).catch((error) =>{
                message.error('بروز خطا در سیستم', 3000);
                console.log(error)});
        }
    }
    }
    const deleteBtnClick = (item) => {

        deleteItem(item.id,entityName).then(a => {
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
                        <h3 className="mb-0">درخواست ها</h3>
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
                <TableContainer columns={columns.filter(a=>!a.notInGrid)} data={data} 
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
                    <div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">نوع درخواست</label>
                    <Select className={errors.reqType_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={reqType_options}
                value={obj.reqType_id} onSelect={(values) =>  setObj({ ...obj, reqType_id: values})}
            />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">مدیریت/ اداره/ واحد متقاضی</label>
                    <Select className={errors.applicant_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={applicant_options}
                value={obj.applicant_id} onSelect={(values) =>  setObj({ ...obj, applicant_id: values})}
            />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">مدیریت/ اداره/ واحد همکار</label>
                    <Select className={errors.colleague_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={colleague_options}
                value={obj.colleague_id} onSelect={(values) =>  setObj({ ...obj, colleague_id: values})}
            />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">پیمانکار پیشنهادی</label>
                    <Select className={errors.contractor_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={contractor_options}
                value={obj.contractor_id} onSelect={(values) =>  setObj({ ...obj, contractor_id: values})}
            />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">اولویت پروژه</label>
                    <Select className={errors.riority_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={riority_options}
                value={obj.riority_id} onSelect={(values) =>  setObj({ ...obj, riority_id: values})}
            />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">استراتژی</label>
                    <Select className={errors.strategy_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={strategy_options}
                value={obj.strategy_id} onSelect={(values) =>  setObj({ ...obj, strategy_id: values})}
            />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">پیشنهاد اجرا</label>
                    <Select className={errors.execution_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={execution_options}
                value={obj.execution_id} onSelect={(values) =>  setObj({ ...obj, execution_id: values})}
            />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">حجم کاری</label>
                    <Select className={errors.workload_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={workload_options}
                value={obj.workload_id} onSelect={(values) =>  setObj({ ...obj, workload_id: values})}
            />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">نام پروژه</label>
                      <input className={errors.name?"form-control error-control":"form-control"} type="text" value={obj.name} 
                onChange={(e) => setObj({ ...obj, name: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">اهداف پروژه</label>
                      <input className={errors.goals?"form-control error-control":"form-control"} type="text" value={obj.goals} 
                onChange={(e) => setObj({ ...obj, goals: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">محدوده پروژه</label>
                      <input className={errors.scopes?"form-control error-control":"form-control"} type="text" value={obj.scopes} 
                onChange={(e) => setObj({ ...obj, scopes: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">دلایل تعریف</label>
                      <input className={errors.reasons?"form-control error-control":"form-control"} type="text" value={obj.reasons} 
                onChange={(e) => setObj({ ...obj, reasons: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">ارکان/ ذینفعان</label>
                      <input className={errors.pillars?"form-control error-control":"form-control"} type="text" value={obj.pillars} 
                onChange={(e) => setObj({ ...obj, pillars: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">استفاده کنندگان</label>
                      <input className={errors.users?"form-control error-control":"form-control"} type="text" value={obj.users} 
                onChange={(e) => setObj({ ...obj, users: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">الزامات پشتیبانی</label>
                      <input className={errors.supportRequirements?"form-control error-control":"form-control"} type="text" value={obj.supportRequirements} 
                onChange={(e) => setObj({ ...obj, supportRequirements: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">الزامات اجرای پروژه</label>
                      <input className={errors.implementationRequirements?"form-control error-control":"form-control"} type="text" value={obj.implementationRequirements} 
                onChange={(e) => setObj({ ...obj, implementationRequirements: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">بازه زمانی مورد انتظار</label>
                      <input className={errors.timePeriod?"form-control error-control":"form-control"} type="text" value={obj.timePeriod} 
                onChange={(e) => setObj({ ...obj, timePeriod: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">مخاطرات پروژه</label>
                      <input className={errors.projectRisks?"form-control error-control":"form-control"} type="text" value={obj.projectRisks} 
                onChange={(e) => setObj({ ...obj, projectRisks: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">عواید مالی طرح</label>
                      <input className={errors.financialIncome?"form-control error-control":"form-control"} type="text" value={obj.financialIncome} 
                onChange={(e) => setObj({ ...obj, financialIncome: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">عواید غیر مالی طرح</label>
                      <input className={errors.notFinancialIncome?"form-control error-control":"form-control"} type="text" value={obj.notFinancialIncome} 
                onChange={(e) => setObj({ ...obj, notFinancialIncome: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">آخرین وضعیت</label>
                      <input className={errors.prjState?"form-control error-control":"form-control"} type="text" value={obj.prjState} 
                onChange={(e) => setObj({ ...obj, prjState: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">کد پروژه</label>
                      <input className={errors.prjCode?"form-control error-control":"form-control"} type="text" value={obj.prjCode} 
                onChange={(e) => setObj({ ...obj, prjCode: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">تاریخ ثبت</label>
                    <DatePicker onChange={value =>  setObj({ ...obj, reqDate: value})}
                value={obj.reqDate} disabled={mode === 'display'} {...Static.datePickerDefaultProp}
                className={errors.reqDate ? "form-control error-control" : 'form-control'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">کاربر ثبت کننده</label>
                      <input className={errors.reqUser?"form-control error-control":"form-control"} type="text" value={obj.reqUser} 
                onChange={(e) => setObj({ ...obj, reqUser: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div></div>
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
</div>

</div>)
}

export default Request;