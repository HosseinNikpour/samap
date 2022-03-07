import React, { useState, useEffect, useRef } from 'react';
import { getItems, insertItem, deleteItem, updateItem, updatePassword } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import { columns, entityName,role_options } from './statics';
import { message, Select } from 'antd';
import Static from '../static';

const User = (props) => {
    const BoxRef = useRef(null), GridRef = useRef(null);;

    const [data, setData] = useState([]);
    const [obj, setObj] = useState({});
    const [mode, setMode] = useState('');
    const [chp, setChp] = useState(false);
    const [errors, setErrors] = useState({});
    const [unit_options, setUnit_options] = useState([]);
    const [company_options, setCompany_options] = useState([]);

    const getData = () => {
        setMode('');
        GridRef.current.scrollIntoView({ behavior: 'smooth' });
        Promise.all([getItems(entityName)  , getItems("baseInfo")]).then((response) => {
            setData(response[0].data);
            setUnit_options(response[1].data.filter(a => a.group_id === 11).map(a => { return { key: a.id, label: a.title, value: a.id } }));
            setCompany_options(response[1].data.filter(a => a.group_id === 13).map(a => { return { key: a.id, label: a.title, value: a.id } }));
            setObj({});
            setErrors({});
        })
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
            if (mode === 'new') {
                insertItem(obj, entityName).then(response => {
                    if (response.data.type !== "Error") {
                        message.success('آیتم با موفقیت ذخیره شد');
                        //alert('آیتم با موفقیت ذخیره شد');
                        getData();
                    }
                    else {
                        //alert('خطا در ذخیره سازی اطلاعات');
                        message.error('خطا در ذخیره سازی اطلاعات');
                        console.log(response.data.message);
                    }

                }).catch((error) => {
                    message.error('بروز خطا در سیستم');
                    console.log(error)
                });
            }
            else if (mode === 'edit') {
                updateItem(obj, entityName).then(response => {
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
            else if (chp) {
                updatePassword({ id: obj.id, password: obj.password }).then(response => {
                    if (response.data.type !== "Error") {
                        message.success('رمز عبور با موفقیت تغییر کرد');
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
                                <h3 className="mb-0">مدیریت کاربران</h3>
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
                                <h3 className="mb-0">
                                    {mode === 'new' ? 'اضافه کردن آیتم جدید' : mode === 'edit' ? 'ویرایش آیتم' : 'مشاهده آیتم'}
                                </h3>
                                <hr></hr>
                            </div>
                        </div>
                    </div>
                    <div className='card-body' style={{ marginTop: '-50px' }}>
                        <form>
                            <div className="row">
                                <div className="col-4">
                                    <div className="form-group">
                                        <label className="form-control-label">نام و نام خانوادگی</label>
                                        <label className="req-label"> *</label>
                                        <input className={errors.name ? "form-control error-control" : "form-control"} type="text" value={obj.name}
                                            onChange={(e) => setObj({ ...obj, name: e.target.value })} disabled={mode === 'display'} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label className="form-control-label">نام کاربری</label>
                                        <label className="req-label"> *</label>
                                        <input className={errors.username ? "form-control error-control" : "form-control"} type="text" value={obj.username}
                                            onChange={(e) => setObj({ ...obj, username: e.target.value })} disabled={mode === 'display'} />
                                    </div>
                                </div>
                                {mode !== 'new' && <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">فعال؟</label>
                                        <input className="form-control1" type="checkbox" checked={obj.enabled}
                                            onChange={(e) => setObj({ ...obj, enabled: !obj.enabled })} disabled={mode === 'display'} />
                                    </div>
                                </div>}
                            </div>
                            <div className="row">
                                {mode === 'display' &&
                                    <div className="col-4">
                                        <div className="form-group">
                                            <label className="form-control-label">تغیر رمز عبور؟</label>
                                            <input className="form-control1" type="checkbox" checked={chp}
                                                onChange={(e) => setChp(!chp)} />
                                        </div>
                                    </div>}
                                {(mode === 'new' || chp) && <div className="col-4">
                                    <div className="form-group">
                                        <label className="form-control-label">رمز عبور</label>
                                        {/* <label className="req-label"> *</label> */}
                                        <input className="form-control" type="text" value={obj.password}
                                            onChange={(e) => setObj({ ...obj, password: e.target.value })} disabled={mode === 'display' && !chp} />
                                    </div>
                                </div>}
                               
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">مدیریت/ اداره/ واحد </label>
                                        <Select className={errors.unit_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={unit_options}
                                            value={obj.unit_id} onSelect={(values) => setObj({ ...obj, unit_id: values })}
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">پیمانکار</label>
                                        <Select className={errors.company_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={company_options}
                                            value={obj.company_id} onSelect={(values) => setObj({ ...obj, company_id: values })}
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">نقش</label>
                                        <Select className={errors.role_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={role_options}
                                            value={obj.role_id} onSelect={(values) => setObj({ ...obj, role_id: values })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    {(mode !== "display" || chp) && <button type="button" className="btn btn-outline-primary" onClick={saveBtnClick}>ذخیره</button>}
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

export default User;