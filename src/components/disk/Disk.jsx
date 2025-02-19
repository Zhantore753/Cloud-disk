import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFiles, uploadFile } from '../../actions/file';
import backBtn from '../../assets/img/back-btn.svg';
import FileList from "./fileList/FileList";
import './disk.css';
import { setCurrentDir, setFileView, setPopupDisplay } from '../../reducers/fileReducer';
import Popup from './Popup';
import Uploader from "./uploader/Uploader";

const Disk = () => {
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);
    const currentDirName = useSelector(state => state.files.currentDirName);
    const loader = useSelector(state => state.app.loader);
    const dirStack = useSelector(state => state.files.dirStack);
    const[dragEnter, setDragEnter] = useState(false);
    const [sort, setSort] = useState('type');

    console.log(currentDirName);

    useEffect(()=>{
        dispatch(getFiles(currentDir, sort));
    }, [currentDir, sort]);

    function showPopupHandler() {
        dispatch(setPopupDisplay('flex'));
    }

    function backClickHandler() {
        const backDirId = dirStack.pop();
        dispatch(setCurrentDir(backDirId));
    }

    function fileUploadHandler(event) {
        const files = [...event.target.files];
        files.forEach(file => dispatch(uploadFile(file, currentDir)));
    }

    function dragEnterHandler(event){
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(true);
    }

    function dragLeaveHandler(event){
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(false);
    }

    function dropHandler(event){
        event.preventDefault();
        event.stopPropagation();
        let files = [...event.dataTransfer.files];
        files.forEach(file => dispatch(uploadFile(file, currentDir)));
        setDragEnter(false);
    }

    if(loader) {
        return (
            <div className="loader">
                <div className="lds-dual-ring"></div>
            </div>
        )
    }

    return ( !dragEnter ?
        <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            <h2 className='disk__current-dir'>{currentDirName[0] ? currentDirName[0].path : 'Корневая папка'}</h2>
            <div className="disk__header">
                <div className="disk__btns">
                    <button className="disk__back" onClick={() => backClickHandler()}>
                        <img className="disk__back-img" src={backBtn} alt="Назад"/>
                    </button>
                    <div className="disk__header-actions">
                        <button className="disk__create" onClick={() => showPopupHandler()}>Создать папку</button>
                        <div className="disk__upload">
                            <label htmlFor="disk__upload-input" className="disk__upload-label">Загрузить файл</label>
                            <input multiple={true} onChange={(event)=> fileUploadHandler(event)} type="file" id="disk__upload-input" className="disk__upload-input"/>
                        </div>
                    </div>
                </div>
                <div className="disk__sort">
                    <select value={sort} onChange={(e)=> setSort(e.target.value)} className="disk__select">
                        <option value="name">По имени</option>
                        <option value="type">По типу</option>
                        <option value="date">По дате</option>
                    </select>
                    <button className="disk__plate" onClick={() => dispatch(setFileView('plate'))}/>
                    <button className="disk__list" onClick={() => dispatch(setFileView('list'))}/>
                </div>
            </div>
            <FileList />
            <Popup />
            <Uploader />
        </div>
        :
        <div className="drop-area" onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            Перетащите файлы сюда
        </div>
    );
};

export default Disk;