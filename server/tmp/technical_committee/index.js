import React, { useState, useEffect, useRef } from 'react';
import { getItems, insertItem, deleteItem, updateItem } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import {columns,entityName} from './statics';
import { message,Select } from 'antd';
//import DatePicker from 'react-datepicker2';
//import moment from 'moment-jalaali';
//import Static from '../static' ; 
 
 const TechnicalCommittee = (props) => {
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
                        <h3 className="mb-0">کمیته فنی</h3>
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
                    <label className="form-control-label">تاریخ جلسه</label>
                    <DatePicker onChange={value =>  setObj({ ...obj, meeting_date: value})}
                value={obj.meeting_date} disabled={mode === 'display'} {...Static.datePickerDefaultProp}
                className={errors.meeting_date ? "form-control error-control" : 'form-control'} />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">شماره جلسه</label>
                      <input className={errors.meeting_no?"form-control error-control":"form-control"} type="text" value={obj.meeting_no} 
                onChange={(e) => setObj({ ...obj, meeting_no: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">نام پروژه</label>
                    <Select className={errors.project_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={project_options}
                value={obj.project_id} onSelect={(values) =>  setObj({ ...obj, project_id: values})}
            />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">نتیجه</label>
                    <Select className={errors.resualt_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={resualt_options}
                value={obj.resualt_id} onSelect={(values) =>  setObj({ ...obj, resualt_id: values})}
            />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">اولویت</label>
                    <Select className={errors.priority_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={priority_options}
                value={obj.priority_id} onSelect={(values) =>  setObj({ ...obj, priority_id: values})}
            />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">ناظر</label>
                    <Select className={errors.supervisor_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={supervisor_options}
                value={obj.supervisor_id} onSelect={(values) =>  setObj({ ...obj, supervisor_id: values})}
            />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">حجم کاری</label>
                    <Select className={errors.workload_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={workload_options}
                value={obj.workload_id} onSelect={(values) =>  setObj({ ...obj, workload_id: values})}
            />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">شرایط احراز</label>
                      <input className={errors.achievement_conditions?"form-control error-control":"form-control"} type="text" value={obj.achievement_conditions} 
                onChange={(e) => setObj({ ...obj, achievement_conditions: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">دلیل تصمیم</label>
                      <input className={errors.decision_reason?"form-control error-control":"form-control"} type="text" value={obj.decision_reason} 
                onChange={(e) => setObj({ ...obj, decision_reason: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">شناسه گام</label>
                      <input className={errors.letter_no?"form-control error-control":"form-control"} type="text" value={obj.letter_no} 
                onChange={(e) => setObj({ ...obj, letter_no: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">تاریخ گام</label>
                    <DatePicker onChange={value =>  setObj({ ...obj, letter_date: value})}
                value={obj.letter_date} disabled={mode === 'display'} {...Static.datePickerDefaultProp}
                className={errors.letter_date ? "form-control error-control" : 'form-control'} />
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

export default TechnicalCommittee;