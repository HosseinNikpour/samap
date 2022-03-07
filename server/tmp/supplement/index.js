import React, { useState, useEffect, useRef } from 'react';
import { getItems, insertItem, deleteItem, updateItem } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import {columns,entityName} from './statics';
import { message,Select } from 'antd';
//import DatePicker from 'react-datepicker2';
//import Static from '../static' ; 
 
 const Supplement = (props) => {
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
            err[a.accessor] = obj[a.accessor] ? false : true;
        })


        if (Object.values(err).length > 0) {
            setErrors(err);
            BoxRef.current.scrollIntoView({ behavior: 'smooth' });
            alert("لطفا موارد الزامی را وارد کنید");
        }

        else {

        if (mode === 'new') {
            insertItem(obj, entityName).then(response => {
                if (response.data.type !== "Error") {
                     message.success('آیتم با موفقیت ذخیره شد');
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
                    message.success('آیتم با موفقیت ذخیره شد');
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
                        <h3 className="mb-0">اطلاعات الحاقیه </h3>
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
                    <label className="form-control-label">شماره الحاقیه</label>
                      <input className={errors.title?"form-control error-control":"form-control"} type="text" value={obj.title} 
                onChange={(e) => setObj({ ...obj, title: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">شماره قرارداد</label>
                    <Select className={errors.contract_number?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={contract_number_options}
                value={obj.contract_number_id} onSelect={(values) =>  setObj({ ...obj, contract_number_id: values})}
            />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">مبلغ جدید </label>
                      <input className={errors.new_amount?"form-control error-control":"form-control"} type="number" value={obj.new_amount} 
                onChange={(e) => setObj({ ...obj, new_amount: e.target.value })} disabled={mode === 'display'}/>
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">تاریخ خاتمه جدید</label>
                    <DatePicker onChange={value =>  setObj({ ...obj, end_date: value})}
                value={obj.end_date} disabled={mode === 'display'} {...Static.datePickerDefaultProp}
                className={errors.end_date ? "form-control error-control" : 'form-control'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">تعهدات جدید</label>
                      <input className={errors.new_commitments?"form-control error-control":"form-control"} type="text" value={obj.new_commitments} 
                onChange={(e) => setObj({ ...obj, new_commitments: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div><div className="col">
                <div className="form-group">
                    <label className="form-control-label">تعهدات جدید</label>
                      <input className={errors.new_commitments2?"form-control error-control":"form-control"} type="text" value={obj.new_commitments2} 
                onChange={(e) => setObj({ ...obj, new_commitments2: e.target.value })} disabled={mode === 'display'} />
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

export default Supplement;