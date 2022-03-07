import React, { useState, useEffect, useRef } from 'react';
import { getItems, insertItem, deleteItem, updateItem } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import { entity_options,permissions_options, entityName, pageHeader, columns } from './statics';
import { message, Select } from 'antd';
//import DatePicker from 'react-datepicker2';
import Static from '../static';

const Contract = (props) => {
    const BoxRef = useRef(null), GridRef = useRef(null);;

    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});
    const [obj, setObj] = useState({});
    const [users_options, setUsers_options] = useState([]);
    const [mode, setMode] = useState('');
    //const [grpSelected, setGrpSelected] = useState(1);
   //const [orgData, setOrgData] = useState([]);

    const getData = () => {
        setMode('');
        Promise.all([getItems(entityName), getItems("user")]).then((response) => {
            setData(response[0].data);//.filter(a => a.entity_id == grpSelected));
           // setOrgData(response[0].data);
           // setPermissions_options(response[2].data.filter(a => a.group_id === 100).map(a => { return { key: a.id, label: a.title, value: a.id } }));
            setUsers_options(response[1].data.map(a => { return { key: a.id, label: a.name, value: a.id } }));
        })
        setObj({});
        setErrors({});
    }
    useEffect(() => {
        getData();
    }, [])



    const btnNewClick = () => {
        setMode('new');
        //  BoxRef.current.scrollIntoView({ behavior: 'smooth' });
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
            //   BoxRef.current.scrollIntoView({ behavior: 'smooth' });
            alert("لطفا موارد الزامی را وارد کنید");
        }

        else {
           // obj.entity_id = grpSelected;

            if (mode === 'new') {
                insertItem(obj, entityName).then(response => {
                    if (response.data.type !== "Error") {
                        message.success('آیتم با موفقیت ذخیره شد');
                        //alert('آیتم با موفقیت ذخیره شد');
                        getData();
                    }
                    else {
                        if (response.data.message.indexOf('duplicate key value violates unique constraint') > -1)
                            message.error(Static.errorMesesagDuplicate, Static.errorDuration);
                        else {
                            message.error('خطا در ذخیره سازی اطلاعات');
                            console.log(response.data.message);
                        }
                    }

                }).catch((error) => {
                    message.error('بروز خطا در سیستم');
                    console.log(error)
                });
            }
            else if (mode === 'edit') {
                delete obj.project_name;
                updateItem(obj, entityName).then(response => {
                    if (response.data.type !== "Error") {
                        message.success('آیتم با موفقیت ذخیره شد');
                        //alert('آیتم با موفقیت ذخیره شد');
                        getData();
                    }
                    else {
                        if (response.data.message.indexOf('duplicate key value violates unique constraint') > -1)
                            message.error(Static.errorMesesagDuplicate, Static.errorDuration);
                        else {
                            message.error('خطا در ذخیره سازی اطلاعات');
                            console.log(response.data.message);
                        }
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
        //  BoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setObj(item);
    }
    const editBtnClick = (item) => {
        setMode('edit');
  
        //   BoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setObj(item);
    }
    const cancelBtnClick = () => {
        setMode('');
        //  GridRef.current.scrollIntoView({ behavior: 'smooth' });

    }
    // const entityChange = (value) => {
    //     console.log(value);
    
    //     setData(orgData.filter(a => a.entity_id == value));
    //     debugger;
    //     setGrpSelected(value);
    // }
    return (<div className="container-fluid">
        <div className="row" style={{ paddingTop: '15px' }}>
            <div className="col-7">
                <div className="card ">
                    <div className="card-header border-0">
                        <div className="row align-items-center" ref={GridRef}>
                            <div className="col">
                                <h3 className="mb-0">{pageHeader}</h3>
                            </div>
                            {/* <div className='col-4 ml-auto'>

                                <Select className={errors.entity_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} options={entity_options}
                                    value={grpSelected} onSelect={(values) => entityChange(values)}
                                />
                            </div> */}
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
                         scroll={{ y: 350 ,x:500}}
                            deleteClick={deleteBtnClick}
                            displayClick={displayBtnClick}
                            editClick={editBtnClick} />
                    </div>
                </div>
            </div>

            {mode !== '' && <div className="col" ref={BoxRef}>
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
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">فرم</label>
                                        <label className="req-label">*</label>
                                        <Select className={errors.entity_id ? "form-control error-control" : "form-control"} 
                                        {...Static.selectDefaultProp} options={entity_options} disabled={mode === 'display'}
                                    value={obj.entity_id} onSelect={(values) => { setObj({ ...obj, entity_id: values }) }}
                                />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">کاربر</label>
                                        <label className="req-label">*</label>
                                        <Select className={errors.user_id ? "form-control error-control" : "form-control"} 
                                        {...Static.selectDefaultProp} disabled={mode === 'display'} options={users_options}
                                            value={obj.user_id} onSelect={(values) => { setObj({ ...obj, user_id: values }) }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">دسترسی</label>
                                        <label className="req-label">*</label>
                                        <Select className={errors.permission_id ? "form-control error-control" : "form-control"} {...Static.selectDefaultProp} disabled={mode === 'display'} options={permissions_options}
                                            value={obj.permission_id} onSelect={(values) => { setObj({ ...obj, permission_id: values }) }}

                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    {mode !== "display" && <button type="button" className="btn btn-outline-primary" onClick={saveBtnClick}>ذخیره</button>}
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

export default Contract;