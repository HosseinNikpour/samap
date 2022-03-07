import React, { useState, useEffect, useRef } from 'react';
import { getItems, insertItem, deleteItem, updateItem, getItem } from '../../api/index';
import TableContainer from "../../components/TableContainer";
import { columns, entityName, groups, pageHeader } from './statics';
import Static, { checkPermission } from '../static';
import { message } from 'antd';

const BaseInfo = (props) => {
    const BoxRef = useRef(null), GridRef = useRef(null);;
    const [orgData, setOrgData] = useState([]);
    const [data, setData] = useState([]);
    const [obj, setObj] = useState({});
   // const [per, setPer] = useState({});
    const [mode, setMode] = useState('');
    const [grpSelected, setGrpSelected] = useState(11);
    const [errors, setErrors] = useState({});

    const getData = () => {
        setMode('');
        GridRef.current.scrollIntoView({ behavior: 'smooth' });

        Promise.all([getItems(entityName)]).then((response) => {

            setOrgData(response[0].data);
            setData(response[0].data.filter(a => a.group_id == grpSelected));
            setObj({});
            setErrors({});
            //   }

        })
    }
    useEffect(() => {
        getData();
    }, [])


    const btnNewClick = () => {
        setMode('new');
        // BoxRef.current.scrollIntoView({ behavior: 'smooth' });
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
            obj.group_id = grpSelected;
            if (mode === 'new') {
                insertItem(obj, entityName).then(response => {
                    if (response.data.type !== "Error") {
                        message.success('آیتم با موفقیت ذخیره شد');
                        //alert('آیتم با موفقیت ذخیره شد');
                        getData();
                    }
                    else {
                        //alert('خطا در ذخیره سازی اطلاعات');
                        message.error('خطا در ذخیره سازی اطلاعات',);
                        console.log(response.data.message);
                    }

                }).catch((error) => {
                    message.error('بروز خطا در سیستم',);
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
                        message.error('خطا در ذخیره سازی اطلاعات',);
                        console.log(response.data.message);
                    }
                }).catch((error) => {
                    message.error('بروز خطا در سیستم',);
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
        // BoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setObj(item);
    }
    const editBtnClick = (item) => {
        setMode('edit');
        //BoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setObj(item);
    }
    const cancelBtnClick = () => {
        setMode('');
        //  GridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    const typeChange = (event) => {
        let index = event.nativeEvent.target.selectedIndex;
        let value = event.nativeEvent.target[index].value;
        // let data = this.state.data;
        //let rr = orgData.filter(a => a.group_id == value);
        setData(orgData.filter(a => a.group_id == value));
        setGrpSelected(value);
    }
    return (<div className="container-fluid">
        <div className="row" style={{ paddingTop: '15px' }}>
            <div className="col-7">
                <div className="card ">
                    <div className="card-header border-0">
                        <div className="row align-items-center" ref={GridRef}>
                            <div className="col">
                                <h3 className="mb-0">{pageHeader}</h3>
                            </div>
                            <div className='col-5 ml-auto'>

                                <select className="form-control" onChange={typeChange}
                                    style={{ 'width': '200px', marginLeft: '30px' }} >
                                    {groups.map(a => <option key={a.value} value={a.value}>{a.title} </option>)}
                                </select>
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
                            scroll={{ y: 350, x: 500 }}
                            deleteClick={ deleteBtnClick }
                            displayClick={displayBtnClick}
                            editClick={ editBtnClick } />
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
                                        <label className="form-control-label">عنوان</label>
                                        <input className="form-control" type="text" value={obj.title}
                                            onChange={(e) => setObj({ ...obj, title: e.target.value })} disabled={mode === 'display'} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">ترتیب</label>
                                        <input className="form-control" type="number" value={obj.sort}
                                            onChange={(e) => setObj({ ...obj, sort: e.target.value })} disabled={mode === 'display'} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-control-label">کد</label>
                                        <input className="form-control" type="number" value={obj.code}
                                            onChange={(e) => setObj({ ...obj, code: e.target.value })} disabled={mode === 'display'} />
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

export default BaseInfo;