import React, { useState, useEffect, useRef } from 'react';
import { getItems, insertItem, deleteItem, updateItem } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import {columns,entityName} from './statics';
import { message,Select } from 'antd';
//import DatePicker from 'react-datepicker2';
//import moment from 'moment-jalaali';
//import Static from '../static' ; 
 
 const Contract = (props) => {
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
                     message.success('آیتم با موفقیت ذخیره شد');
                    //alert('آیتم با موفقیت ذخیره شد');
                    getData();
                }
                else{
                    //alert('خطا در ذخیره سازی اطلاعات');
                    message.error('خطا در ذخیره سازی اطلاعات');
                    console.log(response.data.message);
                }
            }).catch((error) => {
                message.error('بروز خطا در سیستم');
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
                    message.error('خطا در ذخیره سازی اطلاعات');
                    console.log(response.data.message);
                }
            }).catch((error) =>{
                message.error('بروز خطا در سیستم');
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
                        <h3 className="mb-0">انعقاد و ابلاغ قرارداد</h3>
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
                    <label className="form-control-label">نام پروژه</label>
                      <label className="req-label">*</label>
                    <Select id='project' className={errors.project_id?"form-control error-control":"form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={project_options}
                value={obj.project_id} onSelect={(values) =>  setObj({ ...obj, project_id: values})}
            />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">مبلغ قرارداد</label>
                      <label className="req-label">*</label>
                      <input id='contract_price' className={errors.contract_price?"form-control error-control":"form-control"} type="number" value={obj.contract_price} 
                onChange={(e) => setObj({ ...obj, contract_price: e.target.value })} disabled={mode === 'display'}/>
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">مدت قرارداد</label>
                      <label className="req-label">*</label>
                      <input id='contract_duration' className={errors.contract_duration?"form-control error-control":"form-control"} type="text" value={obj.contract_duration} 
                onChange={(e) => setObj({ ...obj, contract_duration: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">شماره قرارداد</label>
                      <label className="req-label">*</label>
                      <input id='contract_no' className={errors.contract_no?"form-control error-control":"form-control"} type="text" value={obj.contract_no} 
                onChange={(e) => setObj({ ...obj, contract_no: e.target.value })} disabled={mode === 'display'} />
                </div>
            </div></div><div className="row"><div className="col">
                <div className="form-group">
                    <label className="form-control-label">ضمائم</label>
                    
                     {mode !== 'display' &&  <input id='file_attachment' className={errors.file_attachment?"form-control error-control":"form-control"} type="file"  
                    onChange={(e) => setObj({ ...obj, f_file_attachment: e.target.files[0] })} disabled={mode === 'display'}/>}
                     {obj.file_attachment && <div><a target="_blank" href={obj.file_attachment}>مشاهده فایل</a>
                    {mode === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                        onClick={() => setObj({ ...obj, file_attachment:false})}></i>}</div>}
                </div>
            </div></div>
                    {mode!=='display'&&  <div className="row">
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

export default Contract;